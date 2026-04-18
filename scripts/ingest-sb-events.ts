/**
 * Ingest match events + shot events from StatsBomb open data.
 * Extracts discrete timeline events (goals, cards, subs) into `match_events`,
 * and all shots with xG/coords into `match_shot_events` (for xG maps).
 *
 * Usage:
 *   npx tsx scripts/ingest-sb-events.ts 2022
 *
 * Requires ingest-sb-matches.ts and ingest-sb-lineups.ts to have run first.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const SB_BASE = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data';

const TEAM_CODE_BY_SB: Record<string, string> = {
  Argentina: 'ARG', Australia: 'AUS', Belgium: 'BEL', Brazil: 'BRA',
  Cameroon: 'CMR', Canada: 'CAN', 'Costa Rica': 'CRC', Croatia: 'CRO',
  Denmark: 'DEN', Ecuador: 'ECU', England: 'ENG', France: 'FRA',
  Germany: 'GER', Ghana: 'GHA', Iran: 'IRN', 'Iran Islamic Republic': 'IRN',
  Japan: 'JPN', 'Korea Republic': 'KOR', Mexico: 'MEX', Morocco: 'MAR',
  Netherlands: 'NED', Poland: 'POL', Portugal: 'POR', Qatar: 'QAT',
  'Saudi Arabia': 'KSA', Senegal: 'SEN', Serbia: 'SRB', Spain: 'ESP',
  Switzerland: 'SUI', Tunisia: 'TUN', 'United States': 'USA', Uruguay: 'URU',
  Wales: 'WAL',
  Italy: 'ITA', 'West Germany': 'FRG', 'Soviet Union': 'URS',
  Czechoslovakia: 'TCH', Yugoslavia: 'YUG', Hungary: 'HUN', Chile: 'CHI',
  Colombia: 'COL', Peru: 'PER', Paraguay: 'PAR', Scotland: 'SCO',
  Russia: 'RUS', 'South Africa': 'RSA', Nigeria: 'NGA', Egypt: 'EGY',
  Algeria: 'ALG', Sweden: 'SWE', Bulgaria: 'BUL', Turkey: 'TUR',
  Greece: 'GRE', 'Ivory Coast': 'CIV',
};

type SBEvent = {
  id: string;
  index: number;
  period: number;
  timestamp: string;
  minute: number;
  second: number;
  type: { id: number; name: string };
  team: { id: number; name: string };
  player?: { id: number; name: string };
  shot?: {
    statsbomb_xg?: number;
    end_location?: number[];
    outcome?: { id: number; name: string };
    body_part?: { id: number; name: string };
    type?: { id: number; name: string };
  };
  location?: number[];
  substitution?: { replacement: { id: number; name: string } };
  foul_committed?: { card?: { id: number; name: string } };
  bad_behaviour?: { card?: { id: number; name: string } };
  pass?: { goal_assist?: boolean; assisted_shot_id?: string };
};

function periodCode(p: number): string {
  if (p === 1) return '1H';
  if (p === 2) return '2H';
  if (p === 3) return 'ET1';
  if (p === 4) return 'ET2';
  if (p === 5) return 'PK';
  return '1H';
}

function bodyPartCode(name?: string): string | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('head')) return 'head';
  if (n.includes('left')) return 'left_foot';
  if (n.includes('right')) return 'right_foot';
  return 'other';
}

function shotPattern(typeName?: string): string {
  if (!typeName) return 'open_play';
  const n = typeName.toLowerCase();
  if (n.includes('penalty')) return 'penalty';
  if (n.includes('corner')) return 'corner';
  if (n.includes('free')) return 'free_kick';
  return 'open_play';
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

async function main() {
  const year = parseInt(process.argv[2] ?? '2022', 10);
  console.log(`Loading matches for ${year}…`);

  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, external_statsbomb_id')
    .eq('tournament_year', year)
    .not('external_statsbomb_id', 'is', null);
  if (error) throw error;
  if (!matches?.length) {
    console.error(`No matches for ${year}.`);
    process.exit(1);
  }

  // Player sb_id → db id lookup (paginated; Supabase caps at 1000 rows/page)
  console.log('Loading player map…');
  const sbToDbId = new Map<number, string>();
  const pageSize = 1000;
  for (let page = 0; ; page++) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error: pErr } = await supabase
      .from('players')
      .select('id, transfermarkt_id')
      .like('transfermarkt_id', 'sb:%')
      .range(from, to);
    if (pErr) throw pErr;
    if (!data || data.length === 0) break;
    for (const p of data) {
      const sb = Number(p.transfermarkt_id?.replace('sb:', ''));
      if (!Number.isNaN(sb)) sbToDbId.set(sb, p.id);
    }
    if (data.length < pageSize) break;
  }
  console.log(`  ✓ ${sbToDbId.size} players indexed`);

  let totalTimelineEvents = 0;
  let totalShots = 0;
  let done = 0;

  for (const m of matches) {
    const events = await fetchJson<SBEvent[]>(`${SB_BASE}/events/${m.external_statsbomb_id}.json`);
    if (!events) {
      done++;
      continue;
    }

    // Index events by id for assist/sub lookups
    const byId = new Map(events.map((e) => [e.id, e]));

    const timelineRows: Array<Record<string, unknown>> = [];
    const shotRows: Array<Record<string, unknown>> = [];

    for (const e of events) {
      const teamCode = TEAM_CODE_BY_SB[e.team?.name] ?? null;
      const playerId = e.player?.id ? sbToDbId.get(e.player.id) ?? null : null;

      // --- Shots (all) → match_shot_events ---
      if (e.type.name === 'Shot' && e.shot && e.location) {
        const outcome = e.shot.outcome?.name ?? '';
        let outcomeCode = 'off_target';
        if (outcome === 'Goal') outcomeCode = 'goal';
        else if (outcome === 'Saved') outcomeCode = 'saved';
        else if (outcome === 'Blocked') outcomeCode = 'blocked';
        else if (outcome === 'Post') outcomeCode = 'post';
        else if (outcome === 'Off T' || outcome === 'Wayward') outcomeCode = 'off_target';

        shotRows.push({
          match_id: m.id,
          minute: e.minute,
          second: e.second,
          period: periodCode(e.period),
          team_code: teamCode,
          player_id: playerId,
          start_x: e.location[0],
          start_y: e.location[1],
          end_x: e.shot.end_location?.[0] ?? null,
          end_y: e.shot.end_location?.[1] ?? null,
          body_part: bodyPartCode(e.shot.body_part?.name),
          outcome: outcomeCode,
          xg: e.shot.statsbomb_xg ?? null,
          pattern: shotPattern(e.shot.type?.name),
          statsbomb_shot_id: e.id,
        });

        // --- Goal → timeline ---
        if (outcome === 'Goal' && e.period !== 5) {
          // Find assist (the pass that references this shot)
          const assistEvent = events.find(
            (x) => x.pass?.assisted_shot_id === e.id && x.pass?.goal_assist,
          );
          const assistPid = assistEvent?.player?.id
            ? sbToDbId.get(assistEvent.player.id) ?? null
            : null;

          const isPenalty = e.shot.type?.name === 'Penalty';
          timelineRows.push({
            match_id: m.id,
            minute: e.minute,
            period: periodCode(e.period),
            event_type: isPenalty ? 'penalty_goal' : 'goal',
            team_code: teamCode,
            player_id: playerId,
            secondary_player_id: assistPid,
            detail: e.shot.body_part?.name ?? null,
          });
        }
      }

      // --- Own goal ---
      if (e.type.name === 'Own Goal For') {
        timelineRows.push({
          match_id: m.id,
          minute: e.minute,
          period: periodCode(e.period),
          event_type: 'own_goal',
          team_code: teamCode,
          player_id: playerId,
          detail: null,
        });
      }

      // --- Cards ---
      const card = e.foul_committed?.card?.name ?? e.bad_behaviour?.card?.name;
      if (card) {
        let type = 'yellow';
        if (card === 'Red Card') type = 'red';
        else if (card === 'Second Yellow') type = 'yellow_red';
        timelineRows.push({
          match_id: m.id,
          minute: e.minute,
          period: periodCode(e.period),
          event_type: type,
          team_code: teamCode,
          player_id: playerId,
          detail: card,
        });
      }

      // --- Substitution ---
      if (e.type.name === 'Substitution' && e.substitution?.replacement) {
        const inId = sbToDbId.get(e.substitution.replacement.id) ?? null;
        timelineRows.push({
          match_id: m.id,
          minute: e.minute,
          period: periodCode(e.period),
          event_type: 'sub',
          team_code: teamCode,
          player_id: playerId, // player going off
          secondary_player_id: inId, // player coming on
          detail: null,
        });
      }
    }

    // Upsert in chunks
    const chunkSize = 500;

    if (timelineRows.length > 0) {
      // Delete existing events for this match first to avoid duplicates
      await supabase.from('match_events').delete().eq('match_id', m.id);
      for (let i = 0; i < timelineRows.length; i += chunkSize) {
        const { error: tlErr } = await supabase
          .from('match_events')
          .insert(timelineRows.slice(i, i + chunkSize));
        if (tlErr) {
          console.error(`match_events error at match ${m.id}:`, tlErr.message);
          break;
        }
      }
      totalTimelineEvents += timelineRows.length;
    }

    if (shotRows.length > 0) {
      await supabase.from('match_shot_events').delete().eq('match_id', m.id);
      for (let i = 0; i < shotRows.length; i += chunkSize) {
        const { error: shErr } = await supabase
          .from('match_shot_events')
          .insert(shotRows.slice(i, i + chunkSize));
        if (shErr) {
          console.error(`match_shot_events error at match ${m.id}:`, shErr.message);
          break;
        }
      }
      totalShots += shotRows.length;
    }

    done++;
    if (done % 5 === 0 || done === matches.length) {
      process.stdout.write(`\r  ${done}/${matches.length}  events=${totalTimelineEvents}  shots=${totalShots}`);
    }
  }
  process.stdout.write('\n');

  console.log(`\n✓ WC ${year}: ${totalTimelineEvents} timeline events, ${totalShots} shots ingested.`);
}

main().catch((err) => {
  console.error('Events ingest failed:', err);
  process.exit(1);
});

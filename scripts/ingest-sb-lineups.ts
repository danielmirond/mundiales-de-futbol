/**
 * Ingest lineups (players, squads, starting XI, minutes) from StatsBomb for a
 * World Cup that was already ingested via ingest-sb-matches.ts.
 *
 * Usage:
 *   npx tsx scripts/ingest-sb-lineups.ts 2022
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
  Ireland: 'IRL', 'Northern Ireland': 'NIR', Austria: 'AUT', Norway: 'NOR',
  Russia: 'RUS', 'South Africa': 'RSA', Nigeria: 'NGA', Egypt: 'EGY',
  Algeria: 'ALG', China: 'CHN', 'China PR': 'CHN', Sweden: 'SWE',
  Bulgaria: 'BUL', Romania: 'ROU', Ukraine: 'UKR', Turkey: 'TUR',
  Greece: 'GRE', 'Ivory Coast': 'CIV',
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Position id → category. Best-effort mapping from StatsBomb positions.
function positionCategory(id: number | null): 'GK' | 'DF' | 'MF' | 'FW' {
  if (!id) return 'MF';
  if (id === 1) return 'GK';
  if (id >= 2 && id <= 8) return 'DF';
  if (id >= 9 && id <= 18) return 'MF';
  return 'FW';
}

function parseTime(s: string): number {
  const parts = s.split(':').map(Number);
  if (parts.length < 2) return 0;
  return parts[0] * 60 + parts[1];
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

type SBPlayer = {
  player_id: number;
  player_name: string;
  player_nickname: string | null;
  jersey_number: number | null;
  country: { id: number; name: string } | null;
  positions: Array<{
    position_id: number;
    position: string;
    from: string;
    to: string | null;
    from_period: number;
    to_period: number | null;
    start_reason: string;
    end_reason: string;
  }>;
};

type SBLineupTeam = {
  team_id: number;
  team_name: string;
  lineup: SBPlayer[];
};

async function main() {
  const year = parseInt(process.argv[2] ?? '2022', 10);
  console.log(`Loading matches for ${year}…`);

  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, external_statsbomb_id, home_code, away_code')
    .eq('tournament_year', year)
    .not('external_statsbomb_id', 'is', null);
  if (error) throw error;
  if (!matches?.length) {
    console.error(`No matches with statsbomb ids for ${year}. Run ingest-sb-matches.ts first.`);
    process.exit(1);
  }

  console.log(`  ✓ ${matches.length} matches`);

  // --- Pass 1: collect unique players across all lineups ---
  console.log('Fetching lineups…');
  type PlayerRecord = {
    sb_id: number;
    slug: string;
    full_name: string;
    known_as: string | null;
    nationality_code: string | null;
    position: string;
    transfermarkt_id: string;
  };

  type LineupRecord = {
    sb_match_id: string;
    team_code: string;
    sb_player_id: number;
    shirt_number: number | null;
    position: string;
    starter: boolean;
    minutes_played: number;
    sub_on_minute: number | null;
    sub_off_minute: number | null;
  };

  const playerMap = new Map<number, PlayerRecord>();
  const lineupRecords: LineupRecord[] = [];

  let done = 0;
  for (const m of matches) {
    const lineups = await fetchJson<SBLineupTeam[]>(`${SB_BASE}/lineups/${m.external_statsbomb_id}.json`);
    if (!lineups) continue;
    for (const team of lineups) {
      const teamCode = TEAM_CODE_BY_SB[team.team_name] ?? team.team_name.slice(0, 3).toUpperCase();
      for (const p of team.lineup) {
        const nickname = p.player_nickname || p.player_name;
        const slug = slugify(`${nickname}-${p.player_id}`);
        if (!playerMap.has(p.player_id)) {
          const nat = p.country ? TEAM_CODE_BY_SB[p.country.name] ?? null : null;
          const firstPos = p.positions[0];
          playerMap.set(p.player_id, {
            sb_id: p.player_id,
            slug,
            full_name: p.player_name,
            known_as: p.player_nickname,
            nationality_code: nat,
            position: positionCategory(firstPos?.position_id ?? null),
            transfermarkt_id: `sb:${p.player_id}`,
          });
        }

        const positions = p.positions;
        const starter =
          positions.length > 0 &&
          (positions[0].from === '00:00' || positions[0].from === '00:00:00') &&
          !positions[0].start_reason?.includes('Substitution');
        let minutes = 0;
        let subOn: number | null = null;
        let subOff: number | null = null;
        for (const pos of positions) {
          const fromS = parseTime(pos.from);
          const toS = pos.to ? parseTime(pos.to) : fromS;
          minutes += Math.max(0, (toS - fromS) / 60);
          // Only flag as "Substitution - On/Off" (real subs), not "Player On/Off"
          // (temporary off for injury/blood/equipment).
          if (
            pos.start_reason?.includes('Substitution') &&
            pos.start_reason?.includes('On') &&
            subOn === null
          ) {
            subOn = Math.round(fromS / 60);
          }
          if (
            pos.end_reason?.includes('Substitution') &&
            pos.end_reason?.includes('Off') &&
            subOff === null
          ) {
            subOff = Math.round(toS / 60);
          }
        }

        lineupRecords.push({
          sb_match_id: m.external_statsbomb_id!,
          team_code: teamCode,
          sb_player_id: p.player_id,
          shirt_number: p.jersey_number,
          position: positionCategory(positions[0]?.position_id ?? null),
          starter,
          minutes_played: Math.round(minutes),
          sub_on_minute: subOn,
          sub_off_minute: subOff,
        });
      }
    }
    done++;
    if (done % 10 === 0 || done === matches.length) {
      process.stdout.write(`\r  ${done}/${matches.length}`);
    }
  }
  process.stdout.write('\n');

  // --- Upsert players (use slug as unique key; transfermarkt_id carries sb id). ---
  console.log(`Upserting ${playerMap.size} players…`);
  const playerRows = [...playerMap.values()].map((p) => ({
    slug: p.slug,
    full_name: p.full_name,
    known_as: p.known_as,
    nationality_code: p.nationality_code,
    position: p.position,
    transfermarkt_id: p.transfermarkt_id,
  }));

  // Upsert in chunks
  const chunkSize = 200;
  for (let i = 0; i < playerRows.length; i += chunkSize) {
    const chunk = playerRows.slice(i, i + chunkSize);
    const { error: pErr } = await supabase
      .from('players')
      .upsert(chunk, { onConflict: 'slug', ignoreDuplicates: false });
    if (pErr) throw pErr;
  }

  // Fetch player IDs
  const { data: dbPlayers } = await supabase
    .from('players')
    .select('id, slug, transfermarkt_id')
    .in(
      'transfermarkt_id',
      playerRows.map((p) => p.transfermarkt_id),
    );
  const sbToDbId = new Map<number, string>();
  for (const row of dbPlayers ?? []) {
    const sbId = Number(row.transfermarkt_id?.replace('sb:', ''));
    if (!Number.isNaN(sbId)) sbToDbId.set(sbId, row.id);
  }

  // --- Upsert squads ---
  console.log('Upserting squads…');
  const squadRows = new Map<string, { tournament_year: number; team_code: string; player_id: string; shirt_number: number | null; position: string }>();
  for (const r of lineupRecords) {
    const playerId = sbToDbId.get(r.sb_player_id);
    if (!playerId) continue;
    const key = `${year}|${r.team_code}|${playerId}`;
    if (!squadRows.has(key)) {
      squadRows.set(key, {
        tournament_year: year,
        team_code: r.team_code,
        player_id: playerId,
        shirt_number: r.shirt_number,
        position: r.position,
      });
    }
  }
  const squadsArray = [...squadRows.values()];
  for (let i = 0; i < squadsArray.length; i += chunkSize) {
    const chunk = squadsArray.slice(i, i + chunkSize);
    const { error: sErr } = await supabase
      .from('squads')
      .upsert(chunk, { onConflict: 'tournament_year,team_code,player_id', ignoreDuplicates: false });
    if (sErr) throw sErr;
  }

  // --- Upsert match_lineups ---
  console.log('Upserting match_lineups…');
  const matchIdBySb = new Map(matches.map((m) => [m.external_statsbomb_id!, m.id]));

  const lineupRows = lineupRecords
    .map((r) => {
      const matchId = matchIdBySb.get(r.sb_match_id);
      const playerId = sbToDbId.get(r.sb_player_id);
      if (!matchId || !playerId) return null;
      return {
        match_id: matchId,
        team_code: r.team_code,
        player_id: playerId,
        shirt_number: r.shirt_number,
        position: r.position,
        starter: r.starter,
        minutes_played: r.minutes_played,
        sub_on_minute: r.sub_on_minute,
        sub_off_minute: r.sub_off_minute,
      };
    })
    .filter(<T>(x: T | null): x is T => x !== null);

  for (let i = 0; i < lineupRows.length; i += chunkSize) {
    const chunk = lineupRows.slice(i, i + chunkSize);
    const { error: lErr } = await supabase
      .from('match_lineups')
      .upsert(chunk, { onConflict: 'match_id,team_code,player_id', ignoreDuplicates: false });
    if (lErr) throw lErr;
  }

  console.log(
    `\n✓ WC ${year}: ${playerMap.size} players, ${squadsArray.length} squad rows, ${lineupRows.length} match lineup rows.`,
  );
}

main().catch((err) => {
  console.error('Lineups ingest failed:', err);
  process.exit(1);
});

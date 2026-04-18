/**
 * Ingest matches + venues + referees from StatsBomb open data for a World Cup.
 *
 * Usage:
 *   npx tsx scripts/ingest-sb-matches.ts 2022
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// --- Load env ---
const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SB_BASE = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data';

const WC_SEASONS: Record<number, number> = {
  1958: 269, 1962: 270, 1970: 272, 1974: 51,
  1986: 54, 1990: 55, 2018: 3, 2022: 106,
};

const TEAM_CODE_BY_SB: Record<string, string> = {
  Argentina: 'ARG', Australia: 'AUS', Belgium: 'BEL', Brazil: 'BRA',
  Cameroon: 'CMR', Canada: 'CAN', 'Costa Rica': 'CRC', Croatia: 'CRO',
  Denmark: 'DEN', Ecuador: 'ECU', England: 'ENG', France: 'FRA',
  Germany: 'GER', Ghana: 'GHA', 'Iran': 'IRN', 'Iran Islamic Republic': 'IRN',
  Japan: 'JPN', 'Korea Republic': 'KOR', Mexico: 'MEX', Morocco: 'MAR',
  Netherlands: 'NED', Poland: 'POL', Portugal: 'POR', Qatar: 'QAT',
  'Saudi Arabia': 'KSA', Senegal: 'SEN', Serbia: 'SRB', Spain: 'ESP',
  Switzerland: 'SUI', Tunisia: 'TUN', 'United States': 'USA', Uruguay: 'URU',
  Wales: 'WAL',
  // Older mundials
  Italy: 'ITA', 'West Germany': 'FRG', 'East Germany': 'GDR',
  'Soviet Union': 'URS', Czechoslovakia: 'TCH', Yugoslavia: 'YUG',
  Bulgaria: 'BUL', Romania: 'ROU', Hungary: 'HUN', Chile: 'CHI',
  Colombia: 'COL', Peru: 'PER', Bolivia: 'BOL', Paraguay: 'PAR',
  Scotland: 'SCO', Ireland: 'IRL', 'Northern Ireland': 'NIR',
  Austria: 'AUT', Norway: 'NOR', Turkey: 'TUR', Greece: 'GRE',
  Russia: 'RUS', Ukraine: 'UKR', 'South Africa': 'RSA',
  Nigeria: 'NGA', 'Ivory Coast': 'CIV', Algeria: 'ALG', Egypt: 'EGY',
  China: 'CHN', 'China PR': 'CHN',
};

const STAGE_CODE: Record<string, string> = {
  'Group Stage': 'group',
  'Round of 16': 'r16',
  'Quarter-finals': 'qf',
  'Semi-finals': 'sf',
  '3rd Place Final': '3rd',
  '3rd-place Final': '3rd',
  'Final': 'final',
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type SBMatch = {
  match_id: number;
  match_date: string;
  kick_off: string | null;
  home_team: { home_team_name: string; country?: { name: string } };
  away_team: { away_team_name: string; country?: { name: string } };
  home_score: number;
  away_score: number;
  match_status: string;
  competition_stage: { id: number; name: string };
  stadium?: { id: number; name: string; country?: { name: string } };
  referee?: { id: number; name: string; country?: { name: string } };
};

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json() as Promise<T>;
}

async function main() {
  const year = parseInt(process.argv[2] ?? '2022', 10);
  const seasonId = WC_SEASONS[year];
  if (!seasonId) {
    console.error(`No StatsBomb data for World Cup ${year}. Available:`, Object.keys(WC_SEASONS).join(', '));
    process.exit(1);
  }

  console.log(`Fetching matches for World Cup ${year}…`);
  const matches: SBMatch[] = await fetchJson(`${SB_BASE}/matches/43/${seasonId}.json`);
  console.log(`  ✓ ${matches.length} matches`);

  // --- Collect unique teams, venues, referees ---
  const teams = new Map<string, { code: string; name_official: string }>();
  const venues = new Map<string, { slug: string; name: string; country_code: string | null; city?: string | null }>();
  const referees = new Map<string, { full_name: string; nationality_code: string | null }>();

  const codeOf = (name: string): string | null => {
    if (TEAM_CODE_BY_SB[name]) return TEAM_CODE_BY_SB[name];
    return name.slice(0, 3).toUpperCase();
  };

  for (const m of matches) {
    const hc = codeOf(m.home_team.home_team_name);
    const ac = codeOf(m.away_team.away_team_name);
    if (hc) teams.set(hc, { code: hc, name_official: m.home_team.home_team_name });
    if (ac) teams.set(ac, { code: ac, name_official: m.away_team.away_team_name });

    if (m.stadium) {
      const slug = slugify(m.stadium.name);
      if (!venues.has(slug)) {
        venues.set(slug, {
          slug,
          name: m.stadium.name,
          country_code: m.stadium.country ? codeOf(m.stadium.country.name) : null,
        });
      }
    }

    if (m.referee) {
      if (!referees.has(m.referee.name)) {
        referees.set(m.referee.name, {
          full_name: m.referee.name,
          nationality_code: m.referee.country ? codeOf(m.referee.country.name) : null,
        });
      }
      // Make sure the ref's nationality exists in `teams` so the FK holds.
      if (m.referee.country) {
        const rc = codeOf(m.referee.country.name);
        if (rc && !teams.has(rc)) {
          teams.set(rc, { code: rc, name_official: m.referee.country.name });
        }
      }
    }
    // Same for stadium countries
    if (m.stadium?.country) {
      const sc = codeOf(m.stadium.country.name);
      if (sc && !teams.has(sc)) {
        teams.set(sc, { code: sc, name_official: m.stadium.country.name });
      }
    }
  }

  // --- Upsert teams (don't overwrite existing — keep our Spanish names) ---
  console.log(`Upserting ${teams.size} teams (ignore duplicates)…`);
  const { error: teamsErr } = await supabase
    .from('teams')
    .upsert([...teams.values()], { onConflict: 'code', ignoreDuplicates: true });
  if (teamsErr) throw teamsErr;

  // --- Upsert venues (ignore duplicates) ---
  console.log(`Upserting ${venues.size} venues…`);
  const { error: venuesErr } = await supabase
    .from('venues')
    .upsert([...venues.values()], { onConflict: 'slug', ignoreDuplicates: true });
  if (venuesErr) throw venuesErr;

  // Fetch venue IDs back
  const { data: venueRows, error: venueSelErr } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', [...venues.keys()]);
  if (venueSelErr) throw venueSelErr;
  const venueIdBySlug = new Map(venueRows!.map((v) => [v.slug, v.id]));

  // --- Insert-if-missing referees ---
  console.log(`Ensuring ${referees.size} referees…`);
  const refNames = [...referees.keys()];
  const { data: existingRefs } = await supabase
    .from('referees')
    .select('id, full_name')
    .in('full_name', refNames);
  const existingSet = new Set(existingRefs?.map((r) => r.full_name) ?? []);
  const refIdByName = new Map<string, string>(
    existingRefs?.map((r) => [r.full_name, r.id]) ?? [],
  );
  const toInsertRefs = [...referees.values()].filter((r) => !existingSet.has(r.full_name));
  if (toInsertRefs.length > 0) {
    const { data: inserted, error: refErr } = await supabase
      .from('referees')
      .insert(toInsertRefs)
      .select('id, full_name');
    if (refErr) throw refErr;
    for (const r of inserted ?? []) refIdByName.set(r.full_name, r.id);
  }

  // --- Build matches for upsert ---
  // Order by date+kickoff so match_number is deterministic.
  matches.sort((a, b) => {
    const ad = `${a.match_date}T${a.kick_off ?? '00:00:00'}`;
    const bd = `${b.match_date}T${b.kick_off ?? '00:00:00'}`;
    return ad.localeCompare(bd);
  });

  const matchRows = matches.map((m, i) => {
    const hc = codeOf(m.home_team.home_team_name)!;
    const ac = codeOf(m.away_team.away_team_name)!;
    const winner =
      m.home_score > m.away_score ? hc : m.away_score > m.home_score ? ac : null;
    const slug = m.stadium ? slugify(m.stadium.name) : null;
    return {
      tournament_year: year,
      match_number: i + 1,
      stage: STAGE_CODE[m.competition_stage.name] ?? 'group',
      match_date: `${m.match_date}T${m.kick_off ?? '00:00:00'}Z`,
      venue_id: slug ? venueIdBySlug.get(slug) ?? null : null,
      home_code: hc,
      away_code: ac,
      home_score: m.home_score,
      away_score: m.away_score,
      winner_code: winner,
      referee_id: m.referee ? refIdByName.get(m.referee.name) ?? null : null,
      external_statsbomb_id: m.match_id.toString(),
      status: 'finished',
    };
  });

  console.log(`Upserting ${matchRows.length} matches…`);
  const { error: matchErr } = await supabase
    .from('matches')
    .upsert(matchRows, { onConflict: 'tournament_year,match_number' });
  if (matchErr) throw matchErr;

  console.log(`\n✓ World Cup ${year}: ${teams.size} teams, ${venues.size} venues, ${referees.size} referees, ${matchRows.length} matches.`);
}

main().catch((err) => {
  console.error('Ingest failed:', err);
  process.exit(1);
});

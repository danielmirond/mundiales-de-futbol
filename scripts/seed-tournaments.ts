/**
 * Seed the `tournaments` and `teams` tables with static data from src/lib/tournaments.ts.
 *
 * Usage:
 *   npx tsx scripts/seed-tournaments.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TOURNAMENTS } from '../src/lib/tournaments';

// Load env manually (no next runtime here).
const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* ignore */
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TEAMS: Array<{
  code: string;
  iso_alpha3: string | null;
  name_official: string;
  confederation: string;
  flag_emoji: string;
}> = [
  { code: 'URU', iso_alpha3: 'URY', name_official: 'Uruguay', confederation: 'CONMEBOL', flag_emoji: '🇺🇾' },
  { code: 'ARG', iso_alpha3: 'ARG', name_official: 'Argentina', confederation: 'CONMEBOL', flag_emoji: '🇦🇷' },
  { code: 'BRA', iso_alpha3: 'BRA', name_official: 'Brasil', confederation: 'CONMEBOL', flag_emoji: '🇧🇷' },
  { code: 'ITA', iso_alpha3: 'ITA', name_official: 'Italia', confederation: 'UEFA', flag_emoji: '🇮🇹' },
  { code: 'FRA', iso_alpha3: 'FRA', name_official: 'Francia', confederation: 'UEFA', flag_emoji: '🇫🇷' },
  { code: 'GER', iso_alpha3: 'DEU', name_official: 'Alemania', confederation: 'UEFA', flag_emoji: '🇩🇪' },
  { code: 'FRG', iso_alpha3: null, name_official: 'Alemania Occidental', confederation: 'UEFA', flag_emoji: '🇩🇪' },
  { code: 'ENG', iso_alpha3: 'GBR', name_official: 'Inglaterra', confederation: 'UEFA', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ESP', iso_alpha3: 'ESP', name_official: 'España', confederation: 'UEFA', flag_emoji: '🇪🇸' },
  { code: 'MEX', iso_alpha3: 'MEX', name_official: 'México', confederation: 'CONCACAF', flag_emoji: '🇲🇽' },
  { code: 'USA', iso_alpha3: 'USA', name_official: 'Estados Unidos', confederation: 'CONCACAF', flag_emoji: '🇺🇸' },
  { code: 'CAN', iso_alpha3: 'CAN', name_official: 'Canadá', confederation: 'CONCACAF', flag_emoji: '🇨🇦' },
  { code: 'CHI', iso_alpha3: 'CHL', name_official: 'Chile', confederation: 'CONMEBOL', flag_emoji: '🇨🇱' },
  { code: 'SUI', iso_alpha3: 'CHE', name_official: 'Suiza', confederation: 'UEFA', flag_emoji: '🇨🇭' },
  { code: 'SWE', iso_alpha3: 'SWE', name_official: 'Suecia', confederation: 'UEFA', flag_emoji: '🇸🇪' },
  { code: 'KOR', iso_alpha3: 'KOR', name_official: 'Corea del Sur', confederation: 'AFC', flag_emoji: '🇰🇷' },
  { code: 'JPN', iso_alpha3: 'JPN', name_official: 'Japón', confederation: 'AFC', flag_emoji: '🇯🇵' },
  { code: 'RSA', iso_alpha3: 'ZAF', name_official: 'Sudáfrica', confederation: 'CAF', flag_emoji: '🇿🇦' },
  { code: 'RUS', iso_alpha3: 'RUS', name_official: 'Rusia', confederation: 'UEFA', flag_emoji: '🇷🇺' },
  { code: 'QAT', iso_alpha3: 'QAT', name_official: 'Qatar', confederation: 'AFC', flag_emoji: '🇶🇦' },
];

const HOST_TO_CODE: Record<string, string> = {
  Uruguay: 'URU',
  Italia: 'ITA',
  Francia: 'FRA',
  Brasil: 'BRA',
  Suiza: 'SUI',
  Suecia: 'SWE',
  Chile: 'CHI',
  Inglaterra: 'ENG',
  México: 'MEX',
  'Alemania Occidental': 'FRG',
  Argentina: 'ARG',
  España: 'ESP',
  'Estados Unidos': 'USA',
  'Corea del Sur & Japón': 'KOR',
  Alemania: 'GER',
  Sudáfrica: 'RSA',
  Rusia: 'RUS',
  Qatar: 'QAT',
  'EE.UU. · Canadá · México': 'USA',
};

const CHAMPION_TO_CODE: Record<string, string | null> = {
  Uruguay: 'URU',
  Italia: 'ITA',
  'Alemania Occidental': 'FRG',
  Alemania: 'GER',
  Brasil: 'BRA',
  Inglaterra: 'ENG',
  Argentina: 'ARG',
  Francia: 'FRA',
  España: 'ESP',
  '—': null,
};

async function run() {
  console.log('Upserting teams…');
  const teamsRes = await supabase.from('teams').upsert(TEAMS, { onConflict: 'code' });
  if (teamsRes.error) {
    console.error('teams error:', teamsRes.error.message);
    process.exit(1);
  }
  console.log(`  ✓ ${TEAMS.length} teams`);

  console.log('Upserting tournaments…');
  const rows = TOURNAMENTS.map((t) => ({
    year: t.year,
    slug: t.slug,
    host_country: t.host,
    host_countries: t.hostCountries ?? null,
    champion_code: CHAMPION_TO_CODE[t.champion] ?? null,
    teams: t.teams,
    matches_played: t.matches,
    goals: t.goals,
    attendance: t.attendance,
    start_date: t.startDate,
    end_date: t.endDate,
    top_scorer_name: t.topScorer?.name ?? null,
    top_scorer_goals: t.topScorer?.goals ?? null,
    top_scorer_team: t.topScorer?.team ?? null,
    palette_from: t.palette.from,
    palette_to: t.palette.to,
    tagline_i18n: { es: t.tagline },
  }));

  const tRes = await supabase.from('tournaments').upsert(rows, { onConflict: 'year' });
  if (tRes.error) {
    console.error('tournaments error:', tRes.error.message);
    process.exit(1);
  }
  console.log(`  ✓ ${rows.length} tournaments`);

  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

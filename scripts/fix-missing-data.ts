/**
 * Backfill / fix known data gaps detected in audit:
 *   1) tournaments.runner_up_code set for all 22 played editions
 *   2) Missing finals added: 1958, 1962, 1986, 1990
 *   3) Missing SFs + 3rd added: 1958, 1962, 1986, 1990
 *
 * Idempotent (uses upsert on known match_numbers).
 *
 * Usage: npx tsx scripts/fix-missing-data.ts
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

// --- 1. runner_up + third + fourth codes ---
const POSITIONS: Array<{ year: number; runnerUp: string; third?: string; fourth?: string }> = [
  { year: 1930, runnerUp: 'ARG', third: 'USA', fourth: 'YUG' },
  { year: 1934, runnerUp: 'TCH', third: 'GER', fourth: 'AUT' },
  { year: 1938, runnerUp: 'HUN', third: 'BRA', fourth: 'SWE' },
  { year: 1950, runnerUp: 'BRA', third: 'SWE', fourth: 'ESP' },
  { year: 1954, runnerUp: 'HUN', third: 'AUT', fourth: 'URU' },
  { year: 1958, runnerUp: 'SWE', third: 'FRA', fourth: 'FRG' },
  { year: 1962, runnerUp: 'TCH', third: 'CHI', fourth: 'YUG' },
  { year: 1966, runnerUp: 'FRG', third: 'POR', fourth: 'URS' },
  { year: 1970, runnerUp: 'ITA', third: 'FRG', fourth: 'URU' },
  { year: 1974, runnerUp: 'NED', third: 'POL', fourth: 'BRA' },
  { year: 1978, runnerUp: 'NED', third: 'BRA', fourth: 'ITA' },
  { year: 1982, runnerUp: 'FRG', third: 'POL', fourth: 'FRA' },
  { year: 1986, runnerUp: 'FRG', third: 'FRA', fourth: 'BEL' },
  { year: 1990, runnerUp: 'ARG', third: 'ITA', fourth: 'ENG' },
  { year: 1994, runnerUp: 'ITA', third: 'SWE', fourth: 'BUL' },
  { year: 1998, runnerUp: 'BRA', third: 'CRO', fourth: 'NED' },
  { year: 2002, runnerUp: 'GER', third: 'TUR', fourth: 'KOR' },
  { year: 2006, runnerUp: 'FRA', third: 'GER', fourth: 'POR' },
  { year: 2010, runnerUp: 'NED', third: 'GER', fourth: 'URU' },
  { year: 2014, runnerUp: 'ARG', third: 'NED', fourth: 'BRA' },
  { year: 2018, runnerUp: 'CRO', third: 'BEL', fourth: 'ENG' },
  { year: 2022, runnerUp: 'FRA', third: 'CRO', fourth: 'MAR' },
];

// --- 2. Missing finals + SFs + 3rd for 1958, 1962, 1986, 1990 ---
type Row = {
  year: number;
  stage: 'final' | '3rd' | 'sf';
  match_number: number;
  date: string;
  home: string;
  away: string;
  home_score: number;
  away_score: number;
  home_et?: number;
  away_et?: number;
  home_pk?: number;
  away_pk?: number;
  winner: string | null;
  venue_name?: string;
  city?: string;
  country?: string;
  attendance?: number;
};

const MATCHES: Row[] = [
  // 1958
  { year: 1958, stage: 'sf',    match_number: 996, date: '1958-06-24T18:00:00Z', home: 'BRA', away: 'FRA', home_score: 5, away_score: 2, winner: 'BRA', venue_name: 'Råsunda Stadium', city: 'Solna', country: 'SWE' },
  { year: 1958, stage: 'sf',    match_number: 997, date: '1958-06-24T18:00:00Z', home: 'SWE', away: 'FRG', home_score: 3, away_score: 1, winner: 'SWE', venue_name: 'Ullevi', city: 'Gothenburg', country: 'SWE' },
  { year: 1958, stage: '3rd',   match_number: 998, date: '1958-06-28T18:00:00Z', home: 'FRA', away: 'FRG', home_score: 6, away_score: 3, winner: 'FRA', venue_name: 'Ullevi', city: 'Gothenburg', country: 'SWE' },
  { year: 1958, stage: 'final', match_number: 999, date: '1958-06-29T15:00:00Z', home: 'BRA', away: 'SWE', home_score: 5, away_score: 2, winner: 'BRA', venue_name: 'Råsunda Stadium', city: 'Solna', country: 'SWE', attendance: 51800 },

  // 1962
  { year: 1962, stage: 'sf',    match_number: 996, date: '1962-06-13T18:00:00Z', home: 'BRA', away: 'CHI', home_score: 4, away_score: 2, winner: 'BRA', venue_name: 'Estadio Nacional', city: 'Santiago', country: 'CHI' },
  { year: 1962, stage: 'sf',    match_number: 997, date: '1962-06-13T18:00:00Z', home: 'TCH', away: 'YUG', home_score: 3, away_score: 1, winner: 'TCH', venue_name: 'Estadio Sausalito', city: 'Viña del Mar', country: 'CHI' },
  { year: 1962, stage: '3rd',   match_number: 998, date: '1962-06-16T16:00:00Z', home: 'CHI', away: 'YUG', home_score: 1, away_score: 0, winner: 'CHI', venue_name: 'Estadio Nacional', city: 'Santiago', country: 'CHI' },
  { year: 1962, stage: 'final', match_number: 999, date: '1962-06-17T14:00:00Z', home: 'BRA', away: 'TCH', home_score: 3, away_score: 1, winner: 'BRA', venue_name: 'Estadio Nacional', city: 'Santiago', country: 'CHI', attendance: 68679 },

  // 1986
  { year: 1986, stage: '3rd',   match_number: 998, date: '1986-06-28T12:00:00Z', home: 'FRA', away: 'BEL', home_score: 4, away_score: 2, home_et: 4, away_et: 2, winner: 'FRA', venue_name: 'Estadio Cuauhtémoc', city: 'Puebla', country: 'MEX' },
  { year: 1986, stage: 'final', match_number: 999, date: '1986-06-29T12:00:00Z', home: 'ARG', away: 'FRG', home_score: 3, away_score: 2, winner: 'ARG', venue_name: 'Estadio Azteca', city: 'Ciudad de México', country: 'MEX', attendance: 114600 },

  // 1990
  { year: 1990, stage: 'sf',    match_number: 996, date: '1990-07-03T20:00:00Z', home: 'ITA', away: 'ARG', home_score: 1, away_score: 1, home_et: 1, away_et: 1, home_pk: 3, away_pk: 4, winner: 'ARG', venue_name: 'Stadio San Paolo', city: 'Naples', country: 'ITA' },
  { year: 1990, stage: 'sf',    match_number: 997, date: '1990-07-04T20:00:00Z', home: 'FRG', away: 'ENG', home_score: 1, away_score: 1, home_et: 1, away_et: 1, home_pk: 4, away_pk: 3, winner: 'FRG', venue_name: 'Stadio delle Alpi', city: 'Turin', country: 'ITA' },
  { year: 1990, stage: '3rd',   match_number: 998, date: '1990-07-07T20:00:00Z', home: 'ITA', away: 'ENG', home_score: 2, away_score: 1, winner: 'ITA', venue_name: 'Stadio San Nicola', city: 'Bari', country: 'ITA' },
  { year: 1990, stage: 'final', match_number: 999, date: '1990-07-08T20:00:00Z', home: 'FRG', away: 'ARG', home_score: 1, away_score: 0, winner: 'FRG', venue_name: 'Stadio Olimpico', city: 'Rome', country: 'ITA', attendance: 73603 },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const TEAM_NAMES: Record<string, string> = {
  URU: 'Uruguay', ARG: 'Argentina', BRA: 'Brasil', ITA: 'Italia', FRA: 'Francia',
  GER: 'Alemania', FRG: 'Alemania Occidental', ENG: 'Inglaterra', ESP: 'España',
  MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CHI: 'Chile', SUI: 'Suiza',
  SWE: 'Suecia', KOR: 'Corea del Sur', JPN: 'Japón', RSA: 'Sudáfrica', RUS: 'Rusia',
  QAT: 'Qatar', HUN: 'Hungría', TCH: 'Checoslovaquia', NED: 'Países Bajos',
  BEL: 'Bélgica', MAR: 'Marruecos', POR: 'Portugal', URS: 'Unión Soviética',
  YUG: 'Yugoslavia', AUT: 'Austria', BUL: 'Bulgaria', TUR: 'Turquía',
  POL: 'Polonia', CRO: 'Croacia',
};

async function main() {
  console.log('1) Updating runner_up / third / fourth codes…');
  for (const p of POSITIONS) {
    const { error } = await supabase
      .from('tournaments')
      .update({
        runner_up_code: p.runnerUp,
        third_code: p.third ?? null,
        fourth_code: p.fourth ?? null,
      })
      .eq('year', p.year);
    if (error) console.error(`  ✗ ${p.year}: ${error.message}`);
  }
  console.log(`  ✓ ${POSITIONS.length} tournaments updated.`);

  console.log(`\n2) Seeding ${MATCHES.length} missing matches…`);

  // Ensure all codes + venues exist
  const codes = new Set<string>();
  for (const m of MATCHES) {
    codes.add(m.home); codes.add(m.away);
    if (m.country) codes.add(m.country);
  }
  await supabase
    .from('teams')
    .upsert(
      [...codes].map((c) => ({ code: c, name_official: TEAM_NAMES[c] ?? c })),
      { onConflict: 'code', ignoreDuplicates: true },
    );

  const venueMap = new Map<string, { slug: string; name: string; city: string | null; country_code: string | null }>();
  for (const m of MATCHES) {
    if (!m.venue_name) continue;
    const slug = slugify(m.venue_name);
    if (!venueMap.has(slug)) {
      venueMap.set(slug, {
        slug, name: m.venue_name, city: m.city ?? null, country_code: m.country ?? null,
      });
    }
  }
  await supabase.from('venues').upsert([...venueMap.values()], { onConflict: 'slug', ignoreDuplicates: true });

  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', [...venueMap.keys()]);
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);

  const rows = MATCHES.map((m) => ({
    tournament_year: m.year,
    match_number: m.match_number,
    stage: m.stage,
    match_date: m.date,
    venue_id: m.venue_name ? venueIdBySlug.get(slugify(m.venue_name)) ?? null : null,
    home_code: m.home,
    away_code: m.away,
    home_score: m.home_score,
    away_score: m.away_score,
    home_score_et: m.home_et ?? null,
    away_score_et: m.away_et ?? null,
    home_score_pk: m.home_pk ?? null,
    away_score_pk: m.away_pk ?? null,
    winner_code: m.winner,
    attendance: m.attendance ?? null,
    status: 'finished',
  }));

  const { error } = await supabase
    .from('matches')
    .upsert(rows, { onConflict: 'tournament_year,match_number' });
  if (error) throw error;

  console.log(`  ✓ ${rows.length} matches seeded.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

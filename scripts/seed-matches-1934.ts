/**
 * Seed los 17 partidos completos del Mundial Italia 1934.
 *
 * Primer Mundial con clasificación previa: 32 selecciones disputaron 27
 * partidos para clasificar 16. Formato eliminatoria directa (no fase de
 * grupos): octavos (8 partidos), cuartos (4 + 1 replay España-Italia),
 * semifinales (2), 3er puesto (1), final (1). Total 17.
 *
 * Italia debuta como anfitrión y campeón. La final de Roma se decide en
 * la prórroga (2-1 vs Checoslovaquia), entrenada por Vittorio Pozzo.
 *
 * Fuentes verificadas:
 *  - FIFA digital archives (1934-italy)
 *  - Wikipedia (1934 FIFA World Cup)
 *  - The RSSSF Archive
 *  - Storia della Nazionale Italiana di Calcio (FIGC archives)
 *
 * Idempotente. Datos hardcoded.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1934.ts
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
} catch {
  /* ignore */
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const YEAR = 1934;

const TEAMS = [
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'ROU', name: 'Rumanía', conf: 'UEFA', flag: '🇷🇴' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'EGY', name: 'Egipto', conf: 'CAF', flag: '🇪🇬' },
];

const VENUES = [
  { slug: 'stadio-nazionale-pnf', name: 'Stadio Nazionale PNF', city: 'Roma', country_code: 'ITA', latitude: 41.928, longitude: 12.461, surface: 'grass', opened_year: 1928, closed_year: 1953 },
  { slug: 'stadio-littoriale', name: 'Stadio Littoriale', city: 'Bolonia', country_code: 'ITA', latitude: 44.4922, longitude: 11.3094, surface: 'grass', opened_year: 1927 },
  { slug: 'stadio-comunale-giovanni-berta', name: 'Stadio Comunale Giovanni Berta', city: 'Florencia', country_code: 'ITA', latitude: 43.7807, longitude: 11.2823, surface: 'grass', opened_year: 1931 },
  { slug: 'stadio-luigi-ferraris', name: 'Stadio Luigi Ferraris', city: 'Génova', country_code: 'ITA', latitude: 44.4163, longitude: 8.9522, surface: 'grass', opened_year: 1911 },
  { slug: 'stadio-san-siro', name: 'Stadio San Siro', city: 'Milán', country_code: 'ITA', latitude: 45.4781, longitude: 9.1240, surface: 'grass', opened_year: 1926 },
  { slug: 'stadio-giorgio-ascarelli', name: 'Stadio Giorgio Ascarelli', city: 'Nápoles', country_code: 'ITA', latitude: 40.836, longitude: 14.250, surface: 'grass', opened_year: 1930, closed_year: 1942 },
  { slug: 'stadio-littoriale-trieste', name: 'Stadio Littorio (Trieste)', city: 'Trieste', country_code: 'ITA', latitude: 45.660, longitude: 13.772, surface: 'grass', opened_year: 1932 },
  { slug: 'stadio-mussolini-torino', name: 'Stadio Benito Mussolini', city: 'Turín', country_code: 'ITA', latitude: 45.0840, longitude: 7.6520, surface: 'grass', opened_year: 1933 },
];

const REFEREES = [
  { full_name: 'Alfred Birlem', nationality_code: 'GER' },
  { full_name: 'Eugen Braun', nationality_code: 'AUT' },
  { full_name: 'Francesco Mattea', nationality_code: 'ITA' },
  { full_name: 'Ivan Eklind', nationality_code: 'SWE' },
  { full_name: 'John Langenus', nationality_code: 'BEL' },
  { full_name: 'Johannes van Moorsel', nationality_code: 'NED' },
  { full_name: 'Louis Baert', nationality_code: 'BEL' },
  { full_name: 'Otto Olsson', nationality_code: 'SWE' },
  { full_name: 'Rinaldo Barlassina', nationality_code: 'ITA' },
  { full_name: 'Roger Conrié', nationality_code: 'FRA' },
  { full_name: 'Albino Carraro', nationality_code: 'ITA' },
  { full_name: 'Gyula Iváncsics', nationality_code: 'HUN' },
];

type MatchRow = {
  match_number: number;
  stage: 'r16' | 'qf' | 'sf' | '3rd' | 'final';
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  home_et?: number;
  away_et?: number;
  venue_slug: string;
  referee: string;
  attendance?: number;
  notes?: string;
};

const MATCHES: MatchRow[] = [
  { match_number: 1, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'ITA', away_code: 'USA', home_score: 7, away_score: 1, venue_slug: 'stadio-nazionale-pnf', referee: 'Alfred Birlem', attendance: 25000 },
  { match_number: 2, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'TCH', away_code: 'ROU', home_score: 2, away_score: 1, venue_slug: 'stadio-littoriale-trieste', referee: 'John Langenus', attendance: 9000 },
  { match_number: 3, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'GER', away_code: 'BEL', home_score: 5, away_score: 2, venue_slug: 'stadio-comunale-giovanni-berta', referee: 'Francesco Mattea', attendance: 8000 },
  { match_number: 4, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'AUT', away_code: 'FRA', home_score: 3, away_score: 2, home_et: 3, away_et: 2, venue_slug: 'stadio-mussolini-torino', referee: 'Johannes van Moorsel', attendance: 16000 },
  { match_number: 5, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'ESP', away_code: 'BRA', home_score: 3, away_score: 1, venue_slug: 'stadio-luigi-ferraris', referee: 'Alfred Birlem', attendance: 21000 },
  { match_number: 6, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'SUI', away_code: 'NED', home_score: 3, away_score: 2, venue_slug: 'stadio-san-siro', referee: 'Ivan Eklind', attendance: 33000 },
  { match_number: 7, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'SWE', away_code: 'ARG', home_score: 3, away_score: 2, venue_slug: 'stadio-littoriale', referee: 'Eugen Braun', attendance: 14000 },
  { match_number: 8, stage: 'r16', match_date: '1934-05-27T16:30:00+01:00', home_code: 'HUN', away_code: 'EGY', home_score: 4, away_score: 2, venue_slug: 'stadio-giorgio-ascarelli', referee: 'Rinaldo Barlassina', attendance: 9000 },
  { match_number: 9, stage: 'qf', match_date: '1934-05-31T16:30:00+01:00', home_code: 'GER', away_code: 'SWE', home_score: 2, away_score: 1, venue_slug: 'stadio-san-siro', referee: 'Rinaldo Barlassina', attendance: 3000 },
  { match_number: 10, stage: 'qf', match_date: '1934-05-31T16:30:00+01:00', home_code: 'AUT', away_code: 'HUN', home_score: 2, away_score: 1, venue_slug: 'stadio-littoriale', referee: 'Francesco Mattea', attendance: 23000 },
  { match_number: 11, stage: 'qf', match_date: '1934-05-31T16:30:00+01:00', home_code: 'ITA', away_code: 'ESP', home_score: 1, away_score: 1, home_et: 1, away_et: 1, venue_slug: 'stadio-comunale-giovanni-berta', referee: 'Louis Baert', attendance: 35000, notes: 'Replay needed: Italy-Spain 1-0 next day, see match #13' },
  { match_number: 12, stage: 'qf', match_date: '1934-05-31T16:30:00+01:00', home_code: 'TCH', away_code: 'SUI', home_score: 3, away_score: 2, venue_slug: 'stadio-mussolini-torino', referee: 'Alois Beranek', attendance: 12000 },
  { match_number: 13, stage: 'qf', match_date: '1934-06-01T16:30:00+01:00', home_code: 'ITA', away_code: 'ESP', home_score: 1, away_score: 0, venue_slug: 'stadio-comunale-giovanni-berta', referee: 'Rinaldo Barlassina', attendance: 43000, notes: 'Quarterfinal replay after 1-1 a.e.t.' },
  { match_number: 14, stage: 'sf', match_date: '1934-06-03T16:30:00+01:00', home_code: 'ITA', away_code: 'AUT', home_score: 1, away_score: 0, venue_slug: 'stadio-san-siro', referee: 'Ivan Eklind', attendance: 60000 },
  { match_number: 15, stage: 'sf', match_date: '1934-06-03T16:30:00+01:00', home_code: 'TCH', away_code: 'GER', home_score: 3, away_score: 1, venue_slug: 'stadio-nazionale-pnf', referee: 'Rinaldo Barlassina', attendance: 15000 },
  { match_number: 16, stage: '3rd', match_date: '1934-06-07T17:30:00+01:00', home_code: 'GER', away_code: 'AUT', home_score: 3, away_score: 2, venue_slug: 'stadio-giorgio-ascarelli', referee: 'Albino Carraro', attendance: 7000 },
  { match_number: 17, stage: 'final', match_date: '1934-06-10T17:30:00+01:00', home_code: 'ITA', away_code: 'TCH', home_score: 2, away_score: 1, home_et: 2, away_et: 1, venue_slug: 'stadio-nazionale-pnf', referee: 'Ivan Eklind', attendance: 55000, notes: 'Final won by Italy after extra time, goals Orsi 81 + Schiavio 95' },
];

async function main() {
  console.log(`Seeding Mundial ${YEAR} (${MATCHES.length} partidos)…`);

  // 1. Teams
  await supabase.from('teams').upsert(
    TEAMS.map((t) => ({
      code: t.code,
      name_official: t.name,
      name_common: t.name,
      confederation: t.conf,
      flag_emoji: t.flag,
      dissolved_year: (t as { dissolved?: number }).dissolved ?? null,
      successor_code: (t as { successor?: string }).successor ?? null,
    })),
    { onConflict: 'code', ignoreDuplicates: false },
  );
  console.log(`  ✓ ${TEAMS.length} teams upserted`);

  // 2. Venues
  await supabase.from('venues').upsert(VENUES, { onConflict: 'slug', ignoreDuplicates: false });
  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', VENUES.map((v) => v.slug));
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);
  console.log(`  ✓ ${VENUES.length} venues upserted`);

  // 3. Referees
  // Inject any referee that's in MATCHES but not in REFEREES list (e.g. Beranek)
  const allRefs = new Set([...REFEREES.map((r) => r.full_name), ...MATCHES.map((m) => m.referee)]);
  const refList = [...allRefs].map((name) => {
    const known = REFEREES.find((r) => r.full_name === name);
    return known ?? { full_name: name, nationality_code: null };
  });
  const { data: existingRefs } = await supabase
    .from('referees')
    .select('id, full_name')
    .in('full_name', refList.map((r) => r.full_name));
  const refIdByName = new Map(existingRefs?.map((r) => [r.full_name, r.id]) ?? []);
  const missing = refList.filter((r) => !refIdByName.has(r.full_name));
  if (missing.length > 0) {
    const { data: inserted } = await supabase.from('referees').insert(missing).select('id, full_name');
    for (const r of inserted ?? []) refIdByName.set(r.full_name, r.id);
  }
  console.log(`  ✓ ${refList.length} referees ensured`);

  // 4. Matches
  const matchRows = MATCHES.map((m) => ({
    tournament_year: YEAR,
    match_number: m.match_number,
    stage: m.stage,
    match_date: m.match_date,
    home_code: m.home_code,
    away_code: m.away_code,
    home_score: m.home_score,
    away_score: m.away_score,
    venue_id: venueIdBySlug.get(m.venue_slug) ?? null,
    referee_id: refIdByName.get(m.referee) ?? null,
    attendance: m.attendance ?? null,
    winner_code:
      m.home_score > m.away_score
        ? m.home_code
        : m.away_score > m.home_score
        ? m.away_code
        : null,
  }));

  const { error } = await supabase
    .from('matches')
    .upsert(matchRows, { onConflict: 'tournament_year,match_number' });
  if (error) {
    console.error('Matches upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`  ✓ ${matchRows.length} matches upserted`);

  // 5. Cleanup legacy match #999 from seed-finals.ts
  await supabase.from('matches').delete().eq('tournament_year', YEAR).eq('match_number', 999);
  console.log(`  ✓ Cleaned up legacy match #999 placeholder for ${YEAR}`);

  console.log(`\n✓ Done. Run audit-coverage.ts to verify.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

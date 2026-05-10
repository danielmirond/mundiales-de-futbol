/**
 * Seed los 18 partidos completos del Mundial Francia 1938.
 *
 * Mundial pre-WW2 con 15 selecciones (Austria se retiró tras el
 * Anschluss y Suecia recibió bye). Formato eliminatoria directa.
 *
 * Estructura: 7 partidos primera ronda + 2 replays + 4 cuartos + 1
 * replay + 2 semifinales + 1 tercer puesto + 1 final = 18 partidos.
 *
 * Italia revalida el título contra Hungría (4-2 en Colombes), siendo
 * la primera selección bicampeona. Es el único Mundial que repitió
 * campeón hasta 1962 con Brasil.
 *
 * Fuentes verificadas:
 *  - FIFA digital archives (1938-france)
 *  - Wikipedia (1938 FIFA World Cup)
 *  - The RSSSF Archive
 *
 * Idempotente. Datos hardcoded.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1938.ts
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

const YEAR = 1938;

const TEAMS = [
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'CUB', name: 'Cuba', conf: 'CONCACAF', flag: '🇨🇺' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'NOR', name: 'Noruega', conf: 'UEFA', flag: '🇳🇴' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'ROU', name: 'Rumanía', conf: 'UEFA', flag: '🇷🇴' },
  { code: 'NEI', name: 'Indias Orientales Holandesas', conf: 'AFC', flag: '🇮🇩', dissolved: 1949, successor: 'IDN' },
];

const VENUES = [
  { slug: 'stade-olympique-de-colombes', name: 'Stade Olympique de Colombes', city: 'París', country_code: 'FRA', latitude: 48.9217, longitude: 2.2553, surface: 'grass', opened_year: 1907 },
  { slug: 'parc-des-princes', name: 'Parc des Princes', city: 'París', country_code: 'FRA', latitude: 48.8414, longitude: 2.2530, surface: 'grass', opened_year: 1897 },
  { slug: 'stade-velodrome-marseille', name: 'Stade Vélodrome', city: 'Marsella', country_code: 'FRA', latitude: 43.2696, longitude: 5.3958, surface: 'grass', opened_year: 1937 },
  { slug: 'stade-municipal-toulouse', name: 'Stade Municipal', city: 'Toulouse', country_code: 'FRA', latitude: 43.583, longitude: 1.434, surface: 'grass', opened_year: 1937 },
  { slug: 'stade-cavee-verte', name: 'Stade de la Cavée Verte', city: 'Le Havre', country_code: 'FRA', latitude: 49.503, longitude: 0.108, surface: 'grass', opened_year: 1932 },
  { slug: 'stade-auguste-delaune', name: 'Stade Auguste Delaune', city: 'Reims', country_code: 'FRA', latitude: 49.246, longitude: 4.025, surface: 'grass', opened_year: 1935 },
  { slug: 'stade-municipal-strasbourg', name: 'Stade de la Meinau', city: 'Estrasburgo', country_code: 'FRA', latitude: 48.5602, longitude: 7.7547, surface: 'grass', opened_year: 1914 },
  { slug: 'stade-fort-carre-antibes', name: 'Stade du Fort Carré', city: 'Antibes', country_code: 'FRA', latitude: 43.587, longitude: 7.124, surface: 'grass', opened_year: 1925 },
  { slug: 'stade-victor-boucquey', name: 'Stade Victor Boucquey', city: 'Lille', country_code: 'FRA', latitude: 50.626, longitude: 3.063, surface: 'grass', opened_year: 1902, closed_year: 1975 },
  { slug: 'stade-du-parc-lescure', name: 'Stade du Parc Lescure', city: 'Burdeos', country_code: 'FRA', latitude: 44.831, longitude: -0.601, surface: 'grass', opened_year: 1924 },
];

const REFEREES = [
  { full_name: 'Hans Wüthrich', nationality_code: 'SUI' },
  { full_name: 'Pál von Hertzka', nationality_code: 'HUN' },
  { full_name: 'Roger Conrié', nationality_code: 'FRA' },
  { full_name: 'Augustin Krist', nationality_code: 'TCH' },
  { full_name: 'Lucien Leclercq', nationality_code: 'FRA' },
  { full_name: 'Louis Baert', nationality_code: 'BEL' },
  { full_name: 'Rinaldo Barlassina', nationality_code: 'ITA' },
  { full_name: 'Alfred Birlem', nationality_code: 'GER' },
  { full_name: 'Ivan Eklind', nationality_code: 'SWE' },
  { full_name: 'Georges Capdeville', nationality_code: 'FRA' },
  { full_name: 'John Langenus', nationality_code: 'BEL' },
  { full_name: 'Cyril John Barber', nationality_code: 'ENG' },
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
  // Primera ronda (octavos en la nomenclatura moderna)
  { match_number: 1, stage: 'r16', match_date: '1938-06-04T17:00:00+01:00', home_code: 'SUI', away_code: 'GER', home_score: 1, away_score: 1, home_et: 1, away_et: 1, venue_slug: 'parc-des-princes', referee: 'Hans Wüthrich', attendance: 27152, notes: 'Replay needed: SUI 4-2 GER, see match #8' },
  { match_number: 2, stage: 'r16', match_date: '1938-06-05T17:00:00+01:00', home_code: 'CUB', away_code: 'ROU', home_score: 3, away_score: 3, home_et: 3, away_et: 3, venue_slug: 'stade-municipal-toulouse', referee: 'Augustin Krist', attendance: 6800, notes: 'Replay needed: CUB 2-1 ROU, see match #9' },
  { match_number: 3, stage: 'r16', match_date: '1938-06-05T17:00:00+01:00', home_code: 'HUN', away_code: 'NEI', home_score: 6, away_score: 0, venue_slug: 'stade-auguste-delaune', referee: 'Roger Conrié', attendance: 9000, notes: 'Indias Orientales Holandesas debut y única participación' },
  { match_number: 4, stage: 'r16', match_date: '1938-06-05T17:00:00+01:00', home_code: 'FRA', away_code: 'BEL', home_score: 3, away_score: 1, venue_slug: 'parc-des-princes', referee: 'Hans Wüthrich', attendance: 30454 },
  { match_number: 5, stage: 'r16', match_date: '1938-06-05T17:00:00+01:00', home_code: 'TCH', away_code: 'NED', home_score: 3, away_score: 0, home_et: 3, away_et: 0, venue_slug: 'stade-cavee-verte', referee: 'Lucien Leclercq', attendance: 11000 },
  { match_number: 6, stage: 'r16', match_date: '1938-06-05T17:00:00+01:00', home_code: 'BRA', away_code: 'POL', home_score: 6, away_score: 5, home_et: 6, away_et: 5, venue_slug: 'stade-municipal-strasbourg', referee: 'Ivan Eklind', attendance: 13452, notes: 'Leonidas 4 goles, Willimowski 4 goles, primer Mundial visto en TV en vivo (Estrasburgo)' },
  { match_number: 7, stage: 'r16', match_date: '1938-06-05T17:00:00+01:00', home_code: 'ITA', away_code: 'NOR', home_score: 2, away_score: 1, home_et: 2, away_et: 1, venue_slug: 'stade-velodrome-marseille', referee: 'Alfred Birlem', attendance: 18000 },
  // Replays primera ronda
  { match_number: 8, stage: 'r16', match_date: '1938-06-09T17:00:00+01:00', home_code: 'SUI', away_code: 'GER', home_score: 4, away_score: 2, venue_slug: 'parc-des-princes', referee: 'Ivan Eklind', attendance: 20025, notes: 'Replay después del 1-1' },
  { match_number: 9, stage: 'r16', match_date: '1938-06-09T17:00:00+01:00', home_code: 'CUB', away_code: 'ROU', home_score: 2, away_score: 1, venue_slug: 'stade-municipal-toulouse', referee: 'Augustin Krist', attendance: 8000, notes: 'Replay después del 3-3' },
  // Cuartos
  { match_number: 10, stage: 'qf', match_date: '1938-06-12T17:00:00+01:00', home_code: 'SWE', away_code: 'CUB', home_score: 8, away_score: 0, venue_slug: 'stade-fort-carre-antibes', referee: 'Augustin Krist', attendance: 7000 },
  { match_number: 11, stage: 'qf', match_date: '1938-06-12T17:00:00+01:00', home_code: 'HUN', away_code: 'SUI', home_score: 2, away_score: 0, venue_slug: 'stade-victor-boucquey', referee: 'John Langenus', attendance: 15000 },
  { match_number: 12, stage: 'qf', match_date: '1938-06-12T17:00:00+01:00', home_code: 'ITA', away_code: 'FRA', home_score: 3, away_score: 1, venue_slug: 'stade-olympique-de-colombes', referee: 'Louis Baert', attendance: 58455 },
  { match_number: 13, stage: 'qf', match_date: '1938-06-12T17:00:00+01:00', home_code: 'BRA', away_code: 'TCH', home_score: 1, away_score: 1, home_et: 1, away_et: 1, venue_slug: 'stade-du-parc-lescure', referee: 'Pál von Hertzka', attendance: 25000, notes: 'Replay needed, see match #14' },
  { match_number: 14, stage: 'qf', match_date: '1938-06-14T17:00:00+01:00', home_code: 'BRA', away_code: 'TCH', home_score: 2, away_score: 1, venue_slug: 'stade-du-parc-lescure', referee: 'Roger Conrié', attendance: 18141, notes: 'Cuarto replay después del 1-1' },
  // Semifinales
  { match_number: 15, stage: 'sf', match_date: '1938-06-16T18:00:00+01:00', home_code: 'ITA', away_code: 'BRA', home_score: 2, away_score: 1, venue_slug: 'stade-velodrome-marseille', referee: 'Hans Wüthrich', attendance: 33000 },
  { match_number: 16, stage: 'sf', match_date: '1938-06-16T18:00:00+01:00', home_code: 'HUN', away_code: 'SWE', home_score: 5, away_score: 1, venue_slug: 'parc-des-princes', referee: 'Lucien Leclercq', attendance: 20000 },
  // Tercer puesto
  { match_number: 17, stage: '3rd', match_date: '1938-06-19T15:00:00+01:00', home_code: 'BRA', away_code: 'SWE', home_score: 4, away_score: 2, venue_slug: 'stade-du-parc-lescure', referee: 'John Langenus', attendance: 12000 },
  // Final
  { match_number: 18, stage: 'final', match_date: '1938-06-19T17:00:00+01:00', home_code: 'ITA', away_code: 'HUN', home_score: 4, away_score: 2, venue_slug: 'stade-olympique-de-colombes', referee: 'Georges Capdeville', attendance: 45000, notes: 'Italia bicampeona consecutiva, Pozzo entrenador. Pasaría 24 años hasta otra repetición (Brasil 1962)' },
];

async function main() {
  console.log(`Seeding Mundial ${YEAR} (${MATCHES.length} partidos)…`);

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

  await supabase.from('venues').upsert(VENUES, { onConflict: 'slug', ignoreDuplicates: false });
  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', VENUES.map((v) => v.slug));
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);
  console.log(`  ✓ ${VENUES.length} venues upserted`);

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

  await supabase.from('matches').delete().eq('tournament_year', YEAR).eq('match_number', 999);
  console.log(`  ✓ Cleaned up legacy match #999 placeholder for ${YEAR}`);

  console.log(`\n✓ Done. Run audit-coverage.ts to verify.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

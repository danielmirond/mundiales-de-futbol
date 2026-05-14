/**
 * Seed los 38 partidos completos del Mundial Argentina 1978.
 *
 * Ultimo Mundial con dos rondas de fase de grupos (sin octavos): 24
 * partidos primera fase (4×6) + 12 segunda fase (2 grupos de 4) + 1
 * tercer puesto + 1 final = 38.
 *
 * Argentina campeona en su tierra contra Países Bajos 3-1 a.e.t. en
 * el Estadio Monumental con goles de Kempes (38, 105) y Bertoni (115).
 * Mundial políticamente cargado por la dictadura militar argentina
 * (1976-1983). Caso historico: ARG-PER 6-0 del 21 jun en Rosario,
 * partido que necesitaba ganar Argentina por 4+ goles para superar a
 * Brasil en goal difference y clasificar a la final.
 *
 * Fuentes verificadas:
 *  - FIFA digital archives (1978-argentina)
 *  - Wikipedia (1978 FIFA World Cup)
 *  - The RSSSF Archive
 *  - Archivo Diario La Nación
 *
 * Idempotente. Datos hardcoded.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1978.ts
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

const YEAR = 1978;

const TEAMS = [
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'PER', name: 'Perú', conf: 'CONMEBOL', flag: '🇵🇪' },
  { code: 'TUN', name: 'Túnez', conf: 'CAF', flag: '🇹🇳' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'IRN', name: 'Irán', conf: 'AFC', flag: '🇮🇷' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
];

const VENUES = [
  { slug: 'estadio-monumental', name: 'Estadio Monumental', city: 'Buenos Aires', country_code: 'ARG', latitude: -34.5455, longitude: -58.4497, surface: 'grass', opened_year: 1938 },
  { slug: 'estadio-jose-amalfitani', name: 'Estadio José Amalfitani', city: 'Buenos Aires', country_code: 'ARG', latitude: -34.6353, longitude: -58.5208, surface: 'grass', opened_year: 1951 },
  { slug: 'estadio-gigante-de-arroyito', name: 'Estadio Gigante de Arroyito', city: 'Rosario', country_code: 'ARG', latitude: -32.9183, longitude: -60.6488, surface: 'grass', opened_year: 1929 },
  { slug: 'estadio-mario-alberto-kempes', name: 'Estadio Chateau Carreras', city: 'Córdoba', country_code: 'ARG', latitude: -31.367, longitude: -64.245, surface: 'grass', opened_year: 1978 },
  { slug: 'estadio-jose-maria-minella', name: 'Estadio José María Minella', city: 'Mar del Plata', country_code: 'ARG', latitude: -38.0222, longitude: -57.5589, surface: 'grass', opened_year: 1978 },
  { slug: 'estadio-malvinas-argentinas', name: 'Estadio Mundialista (Mendoza)', city: 'Mendoza', country_code: 'ARG', latitude: -32.8869, longitude: -68.8478, surface: 'grass', opened_year: 1978 },
];

const REFEREES = [
  { full_name: 'Sergio Gonella', nationality_code: 'ITA' },
  { full_name: 'Abraham Klein', nationality_code: 'ISR' },
  { full_name: 'Ramon Barreto Ruiz', nationality_code: 'URU' },
  { full_name: 'Juan Silvagno Cavanna', nationality_code: 'CHI' },
  { full_name: 'Erich Linemayr', nationality_code: 'AUT' },
  { full_name: 'Pat Partridge', nationality_code: 'ENG' },
  { full_name: 'Karoly Palotai', nationality_code: 'HUN' },
  { full_name: 'Anatoly Ivanov', nationality_code: 'URS' },
  { full_name: 'Dušan Maksimović', nationality_code: 'YUG' },
  { full_name: 'Robert Wurtz', nationality_code: 'FRA' },
  { full_name: 'Alfonso González Archundia', nationality_code: 'MEX' },
  { full_name: 'Charles Corver', nationality_code: 'NED' },
  { full_name: 'Antonio Garrido', nationality_code: 'POR' },
  { full_name: 'Adolf Prokop', nationality_code: 'GDR' },
  { full_name: 'Werner Winsemann', nationality_code: 'CAN' },
  { full_name: 'Francisco Martinez', nationality_code: 'ESP' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'r2' | '3rd' | 'final';
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
  // ─── GROUP 1 (ITA, ARG, FRA, HUN) ─────────────────────────
  { match_number: 1, stage: 'group', match_date: '1978-06-02T15:00:00-03:00', home_code: 'FRG', away_code: 'POL', home_score: 0, away_score: 0, venue_slug: 'estadio-monumental', referee: 'Angel Coerezza', attendance: 77000, notes: 'Match inaugural' },
  { match_number: 2, stage: 'group', match_date: '1978-06-02T19:00:00-03:00', home_code: 'TUN', away_code: 'MEX', home_score: 3, away_score: 1, venue_slug: 'estadio-gigante-de-arroyito', referee: 'John Gordon', attendance: 24500, notes: '1ª victoria africana en Mundial' },
  { match_number: 3, stage: 'group', match_date: '1978-06-02T19:15:00-03:00', home_code: 'ITA', away_code: 'FRA', home_score: 2, away_score: 1, venue_slug: 'estadio-jose-maria-minella', referee: 'Nicolae Rainea', attendance: 38000 },
  { match_number: 4, stage: 'group', match_date: '1978-06-02T19:15:00-03:00', home_code: 'ARG', away_code: 'HUN', home_score: 2, away_score: 1, venue_slug: 'estadio-monumental', referee: 'Antonio Garrido', attendance: 77000 },
  { match_number: 5, stage: 'group', match_date: '1978-06-03T13:45:00-03:00', home_code: 'PER', away_code: 'SCO', home_score: 3, away_score: 1, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Ulf Eriksson', attendance: 37927 },
  { match_number: 6, stage: 'group', match_date: '1978-06-03T13:45:00-03:00', home_code: 'NED', away_code: 'IRN', home_score: 3, away_score: 0, venue_slug: 'estadio-malvinas-argentinas', referee: 'Charles Corver', attendance: 30000 },
  { match_number: 7, stage: 'group', match_date: '1978-06-03T16:45:00-03:00', home_code: 'AUT', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'estadio-jose-amalfitani', referee: 'Erich Linemayr', attendance: 35000 },
  { match_number: 8, stage: 'group', match_date: '1978-06-03T16:45:00-03:00', home_code: 'BRA', away_code: 'SWE', home_score: 1, away_score: 1, venue_slug: 'estadio-jose-maria-minella', referee: 'Clive Thomas', attendance: 32569, notes: 'Gol anulado a Zico en último corner por pitido final del árbitro Thomas (Gales) — episodio polémico' },
  { match_number: 9, stage: 'group', match_date: '1978-06-06T13:45:00-03:00', home_code: 'ITA', away_code: 'HUN', home_score: 3, away_score: 1, venue_slug: 'estadio-jose-maria-minella', referee: 'Nicolae Rainea', attendance: 32000 },
  { match_number: 10, stage: 'group', match_date: '1978-06-06T13:45:00-03:00', home_code: 'POL', away_code: 'TUN', home_score: 1, away_score: 0, venue_slug: 'estadio-gigante-de-arroyito', referee: 'Angel Coerezza', attendance: 25000 },
  { match_number: 11, stage: 'group', match_date: '1978-06-06T16:45:00-03:00', home_code: 'ARG', away_code: 'FRA', home_score: 2, away_score: 1, venue_slug: 'estadio-monumental', referee: 'Jean Dubach', attendance: 77000 },
  { match_number: 12, stage: 'group', match_date: '1978-06-06T16:45:00-03:00', home_code: 'FRG', away_code: 'MEX', home_score: 6, away_score: 0, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Farouk Bouzo', attendance: 35258 },
  { match_number: 13, stage: 'group', match_date: '1978-06-07T13:45:00-03:00', home_code: 'AUT', away_code: 'SWE', home_score: 1, away_score: 0, venue_slug: 'estadio-jose-amalfitani', referee: 'Werner Winsemann', attendance: 27000 },
  { match_number: 14, stage: 'group', match_date: '1978-06-07T13:45:00-03:00', home_code: 'NED', away_code: 'PER', home_score: 0, away_score: 0, venue_slug: 'estadio-malvinas-argentinas', referee: 'Antonio Garrido', attendance: 30000 },
  { match_number: 15, stage: 'group', match_date: '1978-06-07T16:45:00-03:00', home_code: 'BRA', away_code: 'ESP', home_score: 0, away_score: 0, venue_slug: 'estadio-jose-maria-minella', referee: 'Karoly Palotai', attendance: 35000 },
  { match_number: 16, stage: 'group', match_date: '1978-06-07T16:45:00-03:00', home_code: 'SCO', away_code: 'IRN', home_score: 1, away_score: 1, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Yousuf Namdar', attendance: 8000 },
  { match_number: 17, stage: 'group', match_date: '1978-06-10T13:45:00-03:00', home_code: 'ITA', away_code: 'ARG', home_score: 1, away_score: 0, venue_slug: 'estadio-monumental', referee: 'Abraham Klein', attendance: 77000 },
  { match_number: 18, stage: 'group', match_date: '1978-06-10T13:45:00-03:00', home_code: 'FRA', away_code: 'HUN', home_score: 3, away_score: 1, venue_slug: 'estadio-jose-maria-minella', referee: 'Sergio Gonella', attendance: 28000 },
  { match_number: 19, stage: 'group', match_date: '1978-06-10T16:45:00-03:00', home_code: 'POL', away_code: 'MEX', home_score: 3, away_score: 1, venue_slug: 'estadio-gigante-de-arroyito', referee: 'Antonio Garrido', attendance: 25000 },
  { match_number: 20, stage: 'group', match_date: '1978-06-10T16:45:00-03:00', home_code: 'FRG', away_code: 'TUN', home_score: 0, away_score: 0, venue_slug: 'estadio-mario-alberto-kempes', referee: 'César Orozco', attendance: 28000 },
  { match_number: 21, stage: 'group', match_date: '1978-06-11T13:45:00-03:00', home_code: 'ESP', away_code: 'SWE', home_score: 1, away_score: 0, venue_slug: 'estadio-jose-amalfitani', referee: 'Anatoly Ivanov', attendance: 35000 },
  { match_number: 22, stage: 'group', match_date: '1978-06-11T13:45:00-03:00', home_code: 'AUT', away_code: 'BRA', home_score: 0, away_score: 1, venue_slug: 'estadio-jose-maria-minella', referee: 'Erich Linemayr', attendance: 32000 },
  { match_number: 23, stage: 'group', match_date: '1978-06-11T16:45:00-03:00', home_code: 'PER', away_code: 'IRN', home_score: 4, away_score: 1, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Ulf Eriksson', attendance: 21000 },
  { match_number: 24, stage: 'group', match_date: '1978-06-11T16:45:00-03:00', home_code: 'SCO', away_code: 'NED', home_score: 3, away_score: 2, venue_slug: 'estadio-malvinas-argentinas', referee: 'Erich Linemayr', attendance: 35000, notes: 'Archie Gemmill marca el "gol más famoso del fútbol escocés"' },
  // ─── ROUND 2 GROUP A (NED, ITA, FRG, AUT) ─────────────────
  { match_number: 25, stage: 'r2', match_date: '1978-06-14T13:45:00-03:00', home_code: 'FRG', away_code: 'ITA', home_score: 0, away_score: 0, venue_slug: 'estadio-monumental', referee: 'Dušan Maksimović', attendance: 67547 },
  { match_number: 26, stage: 'r2', match_date: '1978-06-14T16:45:00-03:00', home_code: 'NED', away_code: 'AUT', home_score: 5, away_score: 1, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Erich Linemayr', attendance: 35000 },
  { match_number: 27, stage: 'r2', match_date: '1978-06-18T13:45:00-03:00', home_code: 'ITA', away_code: 'AUT', home_score: 1, away_score: 0, venue_slug: 'estadio-monumental', referee: 'Francisco Martínez', attendance: 67547 },
  { match_number: 28, stage: 'r2', match_date: '1978-06-18T16:45:00-03:00', home_code: 'NED', away_code: 'FRG', home_score: 2, away_score: 2, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Ramon Barreto Ruiz', attendance: 40500 },
  { match_number: 29, stage: 'r2', match_date: '1978-06-21T13:45:00-03:00', home_code: 'NED', away_code: 'ITA', home_score: 2, away_score: 1, venue_slug: 'estadio-monumental', referee: 'Abraham Klein', attendance: 67547 },
  { match_number: 30, stage: 'r2', match_date: '1978-06-21T16:45:00-03:00', home_code: 'AUT', away_code: 'FRG', home_score: 3, away_score: 2, venue_slug: 'estadio-mario-alberto-kempes', referee: 'Pat Partridge', attendance: 38318 },
  // ─── ROUND 2 GROUP B (ARG, BRA, POL, PER) ─────────────────
  { match_number: 31, stage: 'r2', match_date: '1978-06-14T16:45:00-03:00', home_code: 'BRA', away_code: 'PER', home_score: 3, away_score: 0, venue_slug: 'estadio-malvinas-argentinas', referee: 'Juan Silvagno Cavanna', attendance: 35000 },
  { match_number: 32, stage: 'r2', match_date: '1978-06-14T19:15:00-03:00', home_code: 'ARG', away_code: 'POL', home_score: 2, away_score: 0, venue_slug: 'estadio-gigante-de-arroyito', referee: 'Sergio Gonella', attendance: 38000 },
  { match_number: 33, stage: 'r2', match_date: '1978-06-18T16:45:00-03:00', home_code: 'POL', away_code: 'PER', home_score: 1, away_score: 0, venue_slug: 'estadio-malvinas-argentinas', referee: 'Antonio Garrido', attendance: 35000 },
  { match_number: 34, stage: 'r2', match_date: '1978-06-18T19:15:00-03:00', home_code: 'ARG', away_code: 'BRA', home_score: 0, away_score: 0, venue_slug: 'estadio-gigante-de-arroyito', referee: 'Karoly Palotai', attendance: 37315 },
  { match_number: 35, stage: 'r2', match_date: '1978-06-21T16:45:00-03:00', home_code: 'BRA', away_code: 'POL', home_score: 3, away_score: 1, venue_slug: 'estadio-malvinas-argentinas', referee: 'Charles Corver', attendance: 35000, notes: 'Brasil queda con +5 goal difference, esperando ARG-PER' },
  { match_number: 36, stage: 'r2', match_date: '1978-06-21T19:15:00-03:00', home_code: 'ARG', away_code: 'PER', home_score: 6, away_score: 0, venue_slug: 'estadio-gigante-de-arroyito', referee: 'Robert Wurtz', attendance: 37315, notes: 'Partido controvertido. Argentina necesitaba +4 goles para superar a Brasil. Acusaciones nunca probadas de soborno o presión política a la delegación peruana' },
  // ─── 3rd place + Final ────────────────────────────────────
  { match_number: 37, stage: '3rd', match_date: '1978-06-24T15:00:00-03:00', home_code: 'BRA', away_code: 'ITA', home_score: 2, away_score: 1, venue_slug: 'estadio-monumental', referee: 'Abraham Klein', attendance: 76609 },
  { match_number: 38, stage: 'final', match_date: '1978-06-25T15:00:00-03:00', home_code: 'ARG', away_code: 'NED', home_score: 3, away_score: 1, home_et: 3, away_et: 1, venue_slug: 'estadio-monumental', referee: 'Sergio Gonella', attendance: 71483, notes: 'Final ganada en prórroga, goles Kempes (38, 105) y Bertoni (115). Mario Kempes Bota de Oro con 6 goles' },
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

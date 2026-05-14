/**
 * Seed los 32 partidos del Mundial Inglaterra 1966.
 *
 * 16 selecciones en 4 grupos: 24 grupos + 4 cuartos + 2 semis +
 * 1 tercer puesto + 1 final = 32 partidos.
 *
 * Mundial historico:
 *  - GOL FANTASMA DE WEMBLEY (match #32, final ENG 4-2 FRG a.e.t.):
 *    Geoff Hurst, min 101, prórroga. La pelota golpea el larguero, bota
 *    en la linea, sale. Arbitro suizo Gottfried Dienst consulta al juez
 *    de linea sovietico Tofik Bahramov, que da gol. Imagen no resuelta
 *    hasta hoy. Hurst marca el 4-2 al 120 con la frase de Wolstenholme
 *    "They think it's all over... it is now!"
 *  - GEOFF HURST UNICO HAT-TRICK EN FINAL DE LA HISTORIA (hasta hoy)
 *  - EUSEBIO BOTA DE ORO con 9 goles, 4 en el remontada cuartos
 *    POR 5-3 PRK (Goodison, min 56-59, despues de ir 0-3)
 *  - PORTUGAL TERCERO, debut mundialista historico
 *  - PRK (Corea del Norte) elimina a ITA en grupo (PRK 1-0 ITA),
 *    UNICA participación asiatica top antes del 2002
 *  - BRASIL eliminado en primera fase, Pelé pateado por Bulgaria
 *    y Portugal. Anuncia que no jugara mas Mundiales (luego se
 *    retracta para 1970)
 *  - PICKLES, perro de Londres, encuentra la trofeo Jules Rimet
 *    robada en Westminster (ver historia tipo perro mascota Mundial)
 *
 * Datos verificados con FIFA archives, Wikipedia (1966 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF, BBC Archives.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1966.ts
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

const YEAR = 1966;

const TEAMS = [
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'PRK', name: 'Corea del Norte', conf: 'AFC', flag: '🇰🇵' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
];

const VENUES = [
  { slug: 'wembley-stadium-1923', name: 'Wembley Stadium', city: 'Londres', country_code: 'ENG', latitude: 51.556, longitude: -0.2796, surface: 'grass', opened_year: 1923, closed_year: 2003 },
  { slug: 'old-trafford', name: 'Old Trafford', city: 'Manchester', country_code: 'ENG', latitude: 53.4631, longitude: -2.2913, surface: 'grass', opened_year: 1910 },
  { slug: 'goodison-park', name: 'Goodison Park', city: 'Liverpool', country_code: 'ENG', latitude: 53.4388, longitude: -2.9663, surface: 'grass', opened_year: 1892 },
  { slug: 'hillsborough', name: 'Hillsborough Stadium', city: 'Sheffield', country_code: 'ENG', latitude: 53.4112, longitude: -1.5006, surface: 'grass', opened_year: 1899 },
  { slug: 'roker-park', name: 'Roker Park', city: 'Sunderland', country_code: 'ENG', latitude: 54.9213, longitude: -1.3814, surface: 'grass', opened_year: 1898, closed_year: 1997 },
  { slug: 'villa-park', name: 'Villa Park', city: 'Birmingham', country_code: 'ENG', latitude: 52.5092, longitude: -1.8847, surface: 'grass', opened_year: 1897 },
  { slug: 'ayresome-park', name: 'Ayresome Park', city: 'Middlesbrough', country_code: 'ENG', latitude: 54.572, longitude: -1.2419, surface: 'grass', opened_year: 1903, closed_year: 1995 },
  { slug: 'white-city-stadium', name: 'White City Stadium', city: 'Londres', country_code: 'ENG', latitude: 51.5128, longitude: -0.2236, surface: 'grass', opened_year: 1908, closed_year: 1985 },
];

const REFEREES = [
  { full_name: 'Gottfried Dienst', nationality_code: 'SUI' },
  { full_name: 'Tofiq Bahramov', nationality_code: 'URS' },
  { full_name: 'Rudolf Kreitlein', nationality_code: 'FRG' },
  { full_name: 'Konstantin Zecevic', nationality_code: 'YUG' },
  { full_name: 'Pierre Schwinte', nationality_code: 'FRA' },
  { full_name: 'Roberto Goicoechea', nationality_code: 'ARG' },
  { full_name: 'George McCabe', nationality_code: 'ENG' },
  { full_name: 'Jim Finney', nationality_code: 'ENG' },
  { full_name: 'Joaquim Campos', nationality_code: 'POR' },
  { full_name: 'Armando Marques', nationality_code: 'BRA' },
  { full_name: 'Menahem Ashkenazi', nationality_code: 'ISR' },
  { full_name: 'Hugh Phillips', nationality_code: 'SCO' },
  { full_name: 'Juan Gardeazabal', nationality_code: 'ESP' },
  { full_name: 'Bertil Loow', nationality_code: 'SWE' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'qf' | 'sf' | '3rd' | 'final';
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
  // ── GROUP 1 (ENG, URU, MEX, FRA) ── Wembley / White City ──
  { match_number: 1,  stage: 'group', match_date: '1966-07-11T19:30:00+01:00', home_code: 'ENG', away_code: 'URU', home_score: 0, away_score: 0, venue_slug: 'wembley-stadium-1923', referee: 'Istvan Zsolt', attendance: 87148, notes: 'Match inaugural. Wolstenholme retransmite por BBC' },
  { match_number: 2,  stage: 'group', match_date: '1966-07-13T19:30:00+01:00', home_code: 'FRA', away_code: 'MEX', home_score: 1, away_score: 1, venue_slug: 'wembley-stadium-1923', referee: 'Menahem Ashkenazi', attendance: 69237 },
  { match_number: 3,  stage: 'group', match_date: '1966-07-15T19:30:00+01:00', home_code: 'URU', away_code: 'FRA', home_score: 2, away_score: 1, venue_slug: 'white-city-stadium', referee: 'Karol Galba', attendance: 45662 },
  { match_number: 4,  stage: 'group', match_date: '1966-07-16T15:00:00+01:00', home_code: 'ENG', away_code: 'MEX', home_score: 2, away_score: 0, venue_slug: 'wembley-stadium-1923', referee: 'Concetto Lo Bello', attendance: 92570, notes: 'Bobby Charlton marca el "gol del Mundial" desde 30 metros al min 37' },
  { match_number: 5,  stage: 'group', match_date: '1966-07-19T19:30:00+01:00', home_code: 'URU', away_code: 'MEX', home_score: 0, away_score: 0, venue_slug: 'wembley-stadium-1923', referee: 'Bertil Loow', attendance: 61113 },
  { match_number: 6,  stage: 'group', match_date: '1966-07-20T19:30:00+01:00', home_code: 'ENG', away_code: 'FRA', home_score: 2, away_score: 0, venue_slug: 'wembley-stadium-1923', referee: 'Arturo Yamasaki', attendance: 92500 },
  // ── GROUP 2 (FRG, ARG, ESP, SUI) ── Hillsborough / Villa Park ──
  { match_number: 7,  stage: 'group', match_date: '1966-07-12T19:30:00+01:00', home_code: 'FRG', away_code: 'SUI', home_score: 5, away_score: 0, venue_slug: 'hillsborough', referee: 'Hugh Phillips', attendance: 36127, notes: 'Beckenbauer debut mundialista, marca dos goles a los 21 anios' },
  { match_number: 8,  stage: 'group', match_date: '1966-07-13T19:30:00+01:00', home_code: 'ARG', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'villa-park', referee: 'Roberto Goicoechea', attendance: 42738 },
  { match_number: 9,  stage: 'group', match_date: '1966-07-15T19:30:00+01:00', home_code: 'ARG', away_code: 'FRG', home_score: 0, away_score: 0, venue_slug: 'villa-park', referee: 'Konstantin Zecevic', attendance: 46587, notes: 'ARG juega muy duro, Rafael Albrecht expulsado. Prefigura el conflicto con Rattin en cuartos' },
  { match_number: 10, stage: 'group', match_date: '1966-07-15T19:30:00+01:00', home_code: 'ESP', away_code: 'SUI', home_score: 2, away_score: 1, venue_slug: 'hillsborough', referee: 'Tofiq Bahramov', attendance: 32028 },
  { match_number: 11, stage: 'group', match_date: '1966-07-19T19:30:00+01:00', home_code: 'FRG', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'villa-park', referee: 'Armando Marques', attendance: 51875 },
  { match_number: 12, stage: 'group', match_date: '1966-07-19T19:30:00+01:00', home_code: 'ARG', away_code: 'SUI', home_score: 2, away_score: 0, venue_slug: 'hillsborough', referee: 'Joaquim Campos', attendance: 32128 },
  // ── GROUP 3 (BRA, POR, HUN, BUL) ── Goodison / Old Trafford ──
  { match_number: 13, stage: 'group', match_date: '1966-07-12T19:30:00+01:00', home_code: 'BRA', away_code: 'BUL', home_score: 2, away_score: 0, venue_slug: 'goodison-park', referee: 'Kurt Tschenscher', attendance: 47308, notes: 'Pelé marca + Garrincha pone asistencia (su ultimo partido juntos en Mundiales)' },
  { match_number: 14, stage: 'group', match_date: '1966-07-13T19:30:00+01:00', home_code: 'POR', away_code: 'HUN', home_score: 3, away_score: 1, venue_slug: 'old-trafford', referee: 'Leo Callaghan', attendance: 37311 },
  { match_number: 15, stage: 'group', match_date: '1966-07-15T19:30:00+01:00', home_code: 'HUN', away_code: 'BRA', home_score: 3, away_score: 1, venue_slug: 'goodison-park', referee: 'Karol Galba', attendance: 51387, notes: 'Albert genial. Brasil sin Pelé (lesionado tras maltrato Bulgaria) cae sin remedio' },
  { match_number: 16, stage: 'group', match_date: '1966-07-16T15:00:00+01:00', home_code: 'POR', away_code: 'BUL', home_score: 3, away_score: 0, venue_slug: 'old-trafford', referee: 'Jose Ortiz de Mendibil', attendance: 25438 },
  { match_number: 17, stage: 'group', match_date: '1966-07-19T19:30:00+01:00', home_code: 'POR', away_code: 'BRA', home_score: 3, away_score: 1, venue_slug: 'goodison-park', referee: 'George McCabe', attendance: 58479, notes: 'Pelé vuelve, lo patean fuera de nuevo (Morais le hace falta sucia min 25 y 27). Brasil ELIMINADO. Pelé anuncia que no jugara mas Mundiales (luego se retracta para 1970)' },
  { match_number: 18, stage: 'group', match_date: '1966-07-20T19:30:00+01:00', home_code: 'HUN', away_code: 'BUL', home_score: 3, away_score: 1, venue_slug: 'old-trafford', referee: 'Roberto Goicoechea', attendance: 24129 },
  // ── GROUP 4 (URS, ITA, CHI, PRK) ── Roker Park / Ayresome ──
  { match_number: 19, stage: 'group', match_date: '1966-07-12T19:30:00+01:00', home_code: 'URS', away_code: 'PRK', home_score: 3, away_score: 0, venue_slug: 'ayresome-park', referee: 'Juan Gardeazabal', attendance: 22568, notes: 'Corea del Norte debuta en Mundial' },
  { match_number: 20, stage: 'group', match_date: '1966-07-13T19:30:00+01:00', home_code: 'ITA', away_code: 'CHI', home_score: 2, away_score: 0, venue_slug: 'roker-park', referee: 'George McCabe', attendance: 27199 },
  { match_number: 21, stage: 'group', match_date: '1966-07-15T19:30:00+01:00', home_code: 'CHI', away_code: 'PRK', home_score: 1, away_score: 1, venue_slug: 'ayresome-park', referee: 'Albert Dusch', attendance: 15887 },
  { match_number: 22, stage: 'group', match_date: '1966-07-16T15:00:00+01:00', home_code: 'URS', away_code: 'ITA', home_score: 1, away_score: 0, venue_slug: 'roker-park', referee: 'Rudolf Kreitlein', attendance: 27793 },
  { match_number: 23, stage: 'group', match_date: '1966-07-19T19:30:00+01:00', home_code: 'URS', away_code: 'CHI', home_score: 2, away_score: 1, venue_slug: 'roker-park', referee: 'John Adair', attendance: 16027 },
  { match_number: 24, stage: 'group', match_date: '1966-07-19T19:30:00+01:00', home_code: 'PRK', away_code: 'ITA', home_score: 1, away_score: 0, venue_slug: 'ayresome-park', referee: 'Pierre Schwinte', attendance: 17829, notes: 'PRK ELIMINA A ITALIA, mayor sorpresa mundialista hasta entonces. Pak Doo-ik marca al min 42. Italianos linchados verbalmente al regresar a Roma (rotos huevos en aeropuerto)' },
  // ── CUARTOS ── 23 jul ────────────────────────────────────
  { match_number: 25, stage: 'qf', match_date: '1966-07-23T15:00:00+01:00', home_code: 'ENG', away_code: 'ARG', home_score: 1, away_score: 0, venue_slug: 'wembley-stadium-1923', referee: 'Rudolf Kreitlein', attendance: 90584, notes: 'RATTIN EXPULSADO min 35 por discutir con arbitro aleman Kreitlein sin entender el idioma. Caos de 10 minutos, Aston (futuro inventor tarjetas) supervisa. Gol Geoff Hurst min 78' },
  { match_number: 26, stage: 'qf', match_date: '1966-07-23T15:00:00+01:00', home_code: 'FRG', away_code: 'URU', home_score: 4, away_score: 0, venue_slug: 'hillsborough', referee: 'Jim Finney', attendance: 33751, notes: 'Uruguay con 2 expulsados (Troche min 49, Silva min 54)' },
  { match_number: 27, stage: 'qf', match_date: '1966-07-23T15:00:00+01:00', home_code: 'POR', away_code: 'PRK', home_score: 5, away_score: 3, venue_slug: 'goodison-park', referee: 'Menahem Ashkenazi', attendance: 40248, notes: 'EUSEBIO 4 GOLES (min 27, 43, 56, 59), incluida remontada desde 0-3 al 22. Cuento de hadas norcoreano termina aqui' },
  { match_number: 28, stage: 'qf', match_date: '1966-07-23T15:00:00+01:00', home_code: 'URS', away_code: 'HUN', home_score: 2, away_score: 1, venue_slug: 'roker-park', referee: 'Juan Gardeazabal', attendance: 22102 },
  // ── SEMIS ── 25 jul ───────────────────────────────────────
  { match_number: 29, stage: 'sf', match_date: '1966-07-25T19:30:00+01:00', home_code: 'FRG', away_code: 'URS', home_score: 2, away_score: 1, venue_slug: 'goodison-park', referee: 'Concetto Lo Bello', attendance: 38273 },
  { match_number: 30, stage: 'sf', match_date: '1966-07-26T19:30:00+01:00', home_code: 'ENG', away_code: 'POR', home_score: 2, away_score: 1, venue_slug: 'wembley-stadium-1923', referee: 'Pierre Schwinte', attendance: 94493, notes: 'Bobby Charlton doblete (min 30, 80). Eusebio penalti min 82' },
  // ── 3er PUESTO ── 28 jul ──────────────────────────────────
  { match_number: 31, stage: '3rd', match_date: '1966-07-28T19:30:00+01:00', home_code: 'POR', away_code: 'URS', home_score: 2, away_score: 1, venue_slug: 'wembley-stadium-1923', referee: 'Karol Galba', attendance: 87696, notes: 'Eusebio gol al 88 le da su 9o gol del torneo, BOTA DE ORO 1966' },
  // ── FINAL ── 30 jul ───────────────────────────────────────
  { match_number: 32, stage: 'final', match_date: '1966-07-30T15:00:00+01:00', home_code: 'ENG', away_code: 'FRG', home_score: 4, away_score: 2, home_et: 4, away_et: 2, venue_slug: 'wembley-stadium-1923', referee: 'Gottfried Dienst', attendance: 96924, notes: '★ EL GOL FANTASMA. Hurst 3-2 al min 101 en prorroga, pelota golpea larguero y bota dudosamente sobre/detras de la linea. Arbitro suizo Dienst consulta al juez de linea sovietico Tofiq Bahramov, da gol. Hurst marca el 4-2 al 120 con la frase "They think it\\u0027s all over... it is now" de Wolstenholme. UNICO HAT-TRICK EN UNA FINAL DE MUNDIAL (vigente). ENG campeon en su tierra' },
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

/**
 * Seed los 38 partidos del Mundial Alemania Occidental 1974.
 *
 * Penúltimo Mundial con dos rondas de fase de grupos (igual que 1978):
 * 24 grupos primera fase + 12 grupos segunda fase + 1 tercer puesto +
 * 1 final = 38 partidos. 16 selecciones.
 *
 * Mundial histórico:
 *  - NARANJA MECÁNICA de Cruyff (Holanda) revoluciona el fútbol con
 *    el "fútbol total". Subcampeón.
 *  - "CRUYFF TURN" (match #16, NED 0-0 SWE, min 23): Cruyff hace
 *    su giro mítico ante Jan Olsson, gesto fundacional del repertorio
 *    técnico moderno.
 *  - SPARWASSER (match #6, RDA 1-0 FRG, 22 jun, Hamburg): el único
 *    partido oficial entre las dos Alemanias en la historia. La RDA
 *    vence al campeón mundial RFA. Sparwasser desertaría al Oeste en
 *    1988 (ver historia #19 ya publicada).
 *  - MWEPU ILUNGA (match #11, BRA 3-0 ZAI, 22 jun): patada al balón
 *    en tiro libre, gesto de protesta política contra Mobutu (ver
 *    historia #20 ya publicada).
 *  - FRG CAMPEÓN en casa (Beckenbauer capitán, Müller gol final, Maier
 *    portero). Final NED 1-2 FRG con penalti polémico a Hoeness por
 *    falta a Cruyff al primer minuto.
 *  - POLONIA TERCERA (sorpresa), Lato BOTA DE ORO con 7 goles.
 *  - YUG 9-0 ZAI = mayor goleada del Mundial hasta 1982 (HUN 10-1 SLV).
 *
 * Datos verificados con FIFA archives, Wikipedia (1974 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1974.ts
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

const YEAR = 1974;

const TEAMS = [
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'RDA', name: 'Alemania Oriental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'AUS', name: 'Australia', conf: 'AFC', flag: '🇦🇺' },
  { code: 'ZAI', name: 'Zaire', conf: 'CAF', flag: '🇨🇩', dissolved: 1997, successor: 'COD' },
  { code: 'HAI', name: 'Haití', conf: 'CONCACAF', flag: '🇭🇹' },
];

const VENUES = [
  { slug: 'olympiastadion-berlin', name: 'Olympiastadion', city: 'Berlín', country_code: 'FRG', latitude: 52.5145, longitude: 13.2395, surface: 'grass', opened_year: 1936 },
  { slug: 'olympiastadion-munich-1972', name: 'Olympiastadion Munich', city: 'Múnich', country_code: 'FRG', latitude: 48.1731, longitude: 11.5468, surface: 'grass', opened_year: 1972 },
  { slug: 'volksparkstadion', name: 'Volksparkstadion', city: 'Hamburgo', country_code: 'FRG', latitude: 53.5874, longitude: 9.8993, surface: 'grass', opened_year: 1953 },
  { slug: 'waldstadion-frankfurt', name: 'Waldstadion', city: 'Frankfurt', country_code: 'FRG', latitude: 50.0686, longitude: 8.6450, surface: 'grass', opened_year: 1925 },
  { slug: 'westfalenstadion', name: 'Westfalenstadion', city: 'Dortmund', country_code: 'FRG', latitude: 51.4925, longitude: 7.4517, surface: 'grass', opened_year: 1974 },
  { slug: 'parkstadion', name: 'Parkstadion', city: 'Gelsenkirchen', country_code: 'FRG', latitude: 51.5408, longitude: 7.0676, surface: 'grass', opened_year: 1973, closed_year: 2008 },
  { slug: 'rheinstadion', name: 'Rheinstadion', city: 'Düsseldorf', country_code: 'FRG', latitude: 51.2613, longitude: 6.7330, surface: 'grass', opened_year: 1925, closed_year: 2002 },
  { slug: 'neckarstadion', name: 'Neckarstadion', city: 'Stuttgart', country_code: 'FRG', latitude: 48.7920, longitude: 9.2320, surface: 'grass', opened_year: 1933 },
  { slug: 'niedersachsenstadion', name: 'Niedersachsenstadion', city: 'Hannover', country_code: 'FRG', latitude: 52.3601, longitude: 9.7311, surface: 'grass', opened_year: 1954 },
];

const REFEREES = [
  { full_name: 'Jack Taylor', nationality_code: 'ENG' },
  { full_name: 'Rudi Glöckner', nationality_code: 'GDR' },
  { full_name: 'Erich Linemayr', nationality_code: 'AUT' },
  { full_name: 'Karoly Palotai', nationality_code: 'HUN' },
  { full_name: 'Doğan Babacan', nationality_code: 'TUR' },
  { full_name: 'Gerhard Schulenburg', nationality_code: 'FRG' },
  { full_name: 'Dogan Babacan', nationality_code: 'TUR' },
  { full_name: 'Vital Loraux', nationality_code: 'BEL' },
  { full_name: 'Ramon Barreto', nationality_code: 'URU' },
  { full_name: 'Pavel Kazakov', nationality_code: 'URS' },
  { full_name: 'Aurelio Angonese', nationality_code: 'ITA' },
  { full_name: 'Clive Thomas', nationality_code: 'WAL' },
  { full_name: 'Werner Winsemann', nationality_code: 'CAN' },
  { full_name: 'Heinz Aldinger', nationality_code: 'FRG' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'r2' | '3rd' | 'final';
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  venue_slug: string;
  referee: string;
  attendance?: number;
  notes?: string;
};

const MATCHES: MatchRow[] = [
  // ── GROUP 1 (FRG, RDA, CHI, AUS) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '1974-06-14T18:00:00+02:00', home_code: 'FRG', away_code: 'CHI', home_score: 1, away_score: 0, venue_slug: 'olympiastadion-berlin', referee: 'Doğan Babacan', attendance: 81100, notes: 'Match inaugural. Breitner gol' },
  { match_number: 2,  stage: 'group', match_date: '1974-06-14T16:00:00+02:00', home_code: 'RDA', away_code: 'AUS', home_score: 2, away_score: 0, venue_slug: 'volksparkstadion', referee: 'Heinz Aldinger', attendance: 17000 },
  { match_number: 3,  stage: 'group', match_date: '1974-06-18T19:30:00+02:00', home_code: 'AUS', away_code: 'FRG', home_score: 0, away_score: 3, venue_slug: 'volksparkstadion', referee: 'Jafar Namdar', attendance: 53300 },
  { match_number: 4,  stage: 'group', match_date: '1974-06-18T19:30:00+02:00', home_code: 'CHI', away_code: 'RDA', home_score: 1, away_score: 1, venue_slug: 'olympiastadion-berlin', referee: 'Aurelio Angonese', attendance: 28300 },
  { match_number: 5,  stage: 'group', match_date: '1974-06-22T19:30:00+02:00', home_code: 'AUS', away_code: 'CHI', home_score: 0, away_score: 0, venue_slug: 'olympiastadion-berlin', referee: 'Mahmoud Mustafa Kamel', attendance: 14689 },
  { match_number: 6,  stage: 'group', match_date: '1974-06-22T19:30:00+02:00', home_code: 'RDA', away_code: 'FRG', home_score: 1, away_score: 0, venue_slug: 'volksparkstadion', referee: 'Ramon Barreto', attendance: 60200, notes: '★ SPARWASSER. Único partido oficial entre las dos Alemanias. Sparwasser min 77. La paradoja: la derrota empuja a la RFA al cuadro fácil de la 2a ronda. RFA acabará campeón. Ver historia #19' },
  // ── GROUP 2 (BRA, YUG, SCO, ZAI) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '1974-06-13T18:00:00+02:00', home_code: 'BRA', away_code: 'YUG', home_score: 0, away_score: 0, venue_slug: 'waldstadion-frankfurt', referee: 'Rudolf Scheurer', attendance: 62000, notes: 'Brasil sin Pelé (retirado). Subcampeón se queda sin la magia' },
  { match_number: 8,  stage: 'group', match_date: '1974-06-14T16:00:00+02:00', home_code: 'ZAI', away_code: 'SCO', home_score: 0, away_score: 2, venue_slug: 'westfalenstadion', referee: 'Gerhard Schulenburg', attendance: 25000, notes: 'Zaire primer país del África subsahariana en debutar en Mundial' },
  { match_number: 9,  stage: 'group', match_date: '1974-06-18T16:00:00+02:00', home_code: 'YUG', away_code: 'ZAI', home_score: 9, away_score: 0, venue_slug: 'parkstadion', referee: 'Omar Delgado', attendance: 31700, notes: 'Mayor goleada del Mundial hasta 1982 (HUN 10-1 SLV). Bajević 3 goles' },
  { match_number: 10, stage: 'group', match_date: '1974-06-18T19:30:00+02:00', home_code: 'BRA', away_code: 'SCO', home_score: 0, away_score: 0, venue_slug: 'waldstadion-frankfurt', referee: 'Arie van Gemert', attendance: 60000 },
  { match_number: 11, stage: 'group', match_date: '1974-06-22T16:00:00+02:00', home_code: 'BRA', away_code: 'ZAI', home_score: 3, away_score: 0, venue_slug: 'parkstadion', referee: 'Omar Delgado', attendance: 35700, notes: '★ MWEPU ILUNGA patea el balón en tiro libre contra Brasil al min 85. Resistencia política contra Mobutu. Ver historia #20' },
  { match_number: 12, stage: 'group', match_date: '1974-06-22T19:30:00+02:00', home_code: 'YUG', away_code: 'SCO', home_score: 1, away_score: 1, venue_slug: 'waldstadion-frankfurt', referee: 'Mahmoud Mustafa Kamel', attendance: 56000 },
  // ── GROUP 3 (NED, URU, BUL, SWE) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1974-06-15T18:00:00+02:00', home_code: 'URU', away_code: 'NED', home_score: 0, away_score: 2, venue_slug: 'niedersachsenstadion', referee: 'Karoly Palotai', attendance: 53700, notes: 'Cruyff vs Mazurkiewicz' },
  { match_number: 14, stage: 'group', match_date: '1974-06-15T16:00:00+02:00', home_code: 'SWE', away_code: 'BUL', home_score: 0, away_score: 0, venue_slug: 'rheinstadion', referee: 'Antonio Garrido', attendance: 23800 },
  { match_number: 15, stage: 'group', match_date: '1974-06-19T19:30:00+02:00', home_code: 'URU', away_code: 'BUL', home_score: 1, away_score: 1, venue_slug: 'niedersachsenstadion', referee: 'Kurt Schiller', attendance: 14000 },
  { match_number: 16, stage: 'group', match_date: '1974-06-19T19:30:00+02:00', home_code: 'NED', away_code: 'SWE', home_score: 0, away_score: 0, venue_slug: 'westfalenstadion', referee: 'Rudolf Scheurer', attendance: 53700, notes: '★ EL CRUYFF TURN. Min 23, Cruyff ante Jan Olsson hace su giro mítico, gesto fundacional del repertorio técnico moderno del fútbol' },
  { match_number: 17, stage: 'group', match_date: '1974-06-23T19:30:00+02:00', home_code: 'SWE', away_code: 'URU', home_score: 3, away_score: 0, venue_slug: 'rheinstadion', referee: 'Vital Loraux', attendance: 30100 },
  { match_number: 18, stage: 'group', match_date: '1974-06-23T19:30:00+02:00', home_code: 'NED', away_code: 'BUL', home_score: 4, away_score: 1, venue_slug: 'westfalenstadion', referee: 'Tony Boskovic', attendance: 53300, notes: 'Neeskens 2 penaltis. Cruyff asistencia' },
  // ── GROUP 4 (POL, ITA, ARG, HAI) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1974-06-15T16:00:00+02:00', home_code: 'ITA', away_code: 'HAI', home_score: 3, away_score: 1, venue_slug: 'olympiastadion-munich-1972', referee: 'Vicente Llobregat', attendance: 51100, notes: 'Sanon HAI marca el primer gol caribeño en Mundial' },
  { match_number: 20, stage: 'group', match_date: '1974-06-15T18:00:00+02:00', home_code: 'POL', away_code: 'ARG', home_score: 3, away_score: 2, venue_slug: 'neckarstadion', referee: 'Clive Thomas', attendance: 32700, notes: 'Lato 2 goles, comienza su carrera al Bota de Oro' },
  { match_number: 21, stage: 'group', match_date: '1974-06-19T19:30:00+02:00', home_code: 'ARG', away_code: 'ITA', home_score: 1, away_score: 1, venue_slug: 'neckarstadion', referee: 'Pavel Kazakov', attendance: 70100 },
  { match_number: 22, stage: 'group', match_date: '1974-06-19T19:30:00+02:00', home_code: 'POL', away_code: 'HAI', home_score: 7, away_score: 0, venue_slug: 'olympiastadion-munich-1972', referee: 'Hans-Joachim Weyland', attendance: 25400 },
  { match_number: 23, stage: 'group', match_date: '1974-06-23T19:30:00+02:00', home_code: 'ARG', away_code: 'HAI', home_score: 4, away_score: 1, venue_slug: 'olympiastadion-munich-1972', referee: 'Govinda Sambu Rai', attendance: 25900 },
  { match_number: 24, stage: 'group', match_date: '1974-06-23T19:30:00+02:00', home_code: 'POL', away_code: 'ITA', home_score: 2, away_score: 1, venue_slug: 'neckarstadion', referee: 'Hans-Joachim Weyland', attendance: 70100, notes: 'Polonia elimina a Italia subcampeona 1970. Lato sigue su Bota de Oro' },
  // ── 2a RONDA, GRUPO A (NED, BRA, ARG, RDA) ──────────────
  { match_number: 25, stage: 'r2', match_date: '1974-06-26T19:30:00+02:00', home_code: 'NED', away_code: 'ARG', home_score: 4, away_score: 0, venue_slug: 'parkstadion', referee: 'Vital Loraux', attendance: 55000, notes: 'Cruyff doblete, exhibición naranja' },
  { match_number: 26, stage: 'r2', match_date: '1974-06-26T19:30:00+02:00', home_code: 'BRA', away_code: 'RDA', home_score: 1, away_score: 0, venue_slug: 'niedersachsenstadion', referee: 'Armando Marques', attendance: 60100 },
  { match_number: 27, stage: 'r2', match_date: '1974-06-30T19:30:00+02:00', home_code: 'NED', away_code: 'RDA', home_score: 2, away_score: 0, venue_slug: 'parkstadion', referee: 'Alfonso Gonzalez', attendance: 68000 },
  { match_number: 28, stage: 'r2', match_date: '1974-06-30T19:30:00+02:00', home_code: 'BRA', away_code: 'ARG', home_score: 2, away_score: 1, venue_slug: 'niedersachsenstadion', referee: 'Karoly Palotai', attendance: 40500 },
  { match_number: 29, stage: 'r2', match_date: '1974-07-03T19:30:00+02:00', home_code: 'ARG', away_code: 'RDA', home_score: 1, away_score: 1, venue_slug: 'parkstadion', referee: 'Pavel Kazakov', attendance: 24000 },
  { match_number: 30, stage: 'r2', match_date: '1974-07-03T19:30:00+02:00', home_code: 'NED', away_code: 'BRA', home_score: 2, away_score: 0, venue_slug: 'westfalenstadion', referee: 'Kurt Tschenscher', attendance: 52500, notes: 'NED-BRA = "semifinal de facto". Cruyff y Neeskens. Brasil eliminado, NED a la final' },
  // ── 2a RONDA, GRUPO B (FRG, POL, SWE, YUG) ──────────────
  { match_number: 31, stage: 'r2', match_date: '1974-06-26T19:30:00+02:00', home_code: 'YUG', away_code: 'FRG', home_score: 0, away_score: 2, venue_slug: 'rheinstadion', referee: 'Rudi Glöckner', attendance: 67800 },
  { match_number: 32, stage: 'r2', match_date: '1974-06-26T19:30:00+02:00', home_code: 'SWE', away_code: 'POL', home_score: 0, away_score: 1, venue_slug: 'neckarstadion', referee: 'Werner Winsemann', attendance: 51000 },
  { match_number: 33, stage: 'r2', match_date: '1974-06-30T19:30:00+02:00', home_code: 'POL', away_code: 'YUG', home_score: 2, away_score: 1, venue_slug: 'waldstadion-frankfurt', referee: 'Rudolf Scheurer', attendance: 40500 },
  { match_number: 34, stage: 'r2', match_date: '1974-06-30T19:30:00+02:00', home_code: 'FRG', away_code: 'SWE', home_score: 4, away_score: 2, venue_slug: 'rheinstadion', referee: 'Pavel Kazakov', attendance: 67800 },
  { match_number: 35, stage: 'r2', match_date: '1974-07-03T19:30:00+02:00', home_code: 'SWE', away_code: 'YUG', home_score: 2, away_score: 1, venue_slug: 'rheinstadion', referee: 'Ramon Barreto', attendance: 41000 },
  { match_number: 36, stage: 'r2', match_date: '1974-07-03T19:30:00+02:00', home_code: 'POL', away_code: 'FRG', home_score: 0, away_score: 1, venue_slug: 'waldstadion-frankfurt', referee: 'Erich Linemayr', attendance: 62200, notes: 'Wasserschlacht (Batalla del Agua): partido se juega con encharcamiento del campo. Müller min 76 mete a FRG en la final' },
  // ── 3er PUESTO ── 6 jul ──────────────────────────────────
  { match_number: 37, stage: '3rd', match_date: '1974-07-06T16:00:00+02:00', home_code: 'BRA', away_code: 'POL', home_score: 0, away_score: 1, venue_slug: 'olympiastadion-munich-1972', referee: 'Aurelio Angonese', attendance: 76400, notes: 'Lato gol 7o = BOTA DE ORO 1974' },
  // ── FINAL ── 7 jul ───────────────────────────────────────
  { match_number: 38, stage: 'final', match_date: '1974-07-07T16:00:00+02:00', home_code: 'NED', away_code: 'FRG', home_score: 1, away_score: 2, venue_slug: 'olympiastadion-munich-1972', referee: 'Jack Taylor', attendance: 75200, notes: '★ FINAL DE LOS PENALTIS. Neeskens marca penalti al MIN 2 (FRG todavia no habia tocado balon) tras falta a Cruyff. Breitner empata 1-1 con penalti tambien. Müller marca 2-1 min 43. FRG bicampeón mundial (1954-1974). Cruyff y la Naranja Mecanica se quedan sin titulo' },
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

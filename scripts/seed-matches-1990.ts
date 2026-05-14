/**
 * Seed los 52 partidos del Mundial Italia 1990.
 *
 * 24 selecciones, mismo formato que 1986: 36 grupos + 8 octavos + 4
 * cuartos + 2 semis + 1 3o + 1 final = 52.
 *
 * Mundial historico:
 *  - SCHILLACI BOTA DE ORO (6 goles): "Notti Magiche" de Italia.
 *    Ver historia #25 ya publicada.
 *  - CAMERÚN ROGER MILLA (38 años, sin club al inicio del torneo):
 *    derrota a Argentina campeona en partido inaugural (CMR 1-0 ARG).
 *    Primera selección africana en cuartos de Mundial.
 *  - ARG 0-1 CMR inaugural = mayor sorpresa inaugural de la historia.
 *  - FRG TRICAMPEÓN (1954, 1974, 1990). Final FRG 1-0 ARG con penalti
 *    polémico de Brehme min 85. Monzón y Dezotti expulsados, ARG
 *    termina con 9 jugadores.
 *  - MARADONA jugó lesionado y eliminado en semis vs ITA en el San
 *    Paolo (donde era dios napolitano).
 *  - MUNDIAL MÁS ABURRIDO: 2.21 goles/partido = récord histórico
 *    bajo. Causa principal del cambio a regla "pase atrás portero"
 *    en 1992.
 *  - GAZZA LLORANDO: Gascoigne llora ante el ARG cuando Lineker le
 *    señala con el dedo. Foto icónica de Italia 90.
 *  - COSTA RICA 1ª participación, octavos.
 *  - IRLANDA 1ª participación: cuartos sin ganar partidos (todos
 *    empates o penaltis).
 *  - RIJKAARD ESCUPE A VÖLLER en octavos FRG-NED.
 *  - HIMNO "Nessun Dorma" Pavarotti = banda sonora del torneo.
 *
 * Datos verificados con FIFA archives, Wikipedia (1990 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1990.ts
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

const YEAR = 1990;

const TEAMS = [
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'IRL', name: 'Irlanda', conf: 'UEFA', flag: '🇮🇪' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'ROU', name: 'Rumanía', conf: 'UEFA', flag: '🇷🇴' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'COL', name: 'Colombia', conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'EGY', name: 'Egipto', conf: 'CAF', flag: '🇪🇬' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'UAE', name: 'Emiratos Árabes Unidos', conf: 'AFC', flag: '🇦🇪' },
];

const VENUES = [
  { slug: 'stadio-olimpico-roma', name: 'Stadio Olimpico', city: 'Roma', country_code: 'ITA', latitude: 41.9341, longitude: 12.4546, surface: 'grass', opened_year: 1937 },
  { slug: 'stadio-san-siro', name: 'Stadio Giuseppe Meazza (San Siro)', city: 'Milán', country_code: 'ITA', latitude: 45.4781, longitude: 9.1240, surface: 'grass', opened_year: 1926 },
  { slug: 'stadio-san-paolo', name: 'Stadio San Paolo', city: 'Nápoles', country_code: 'ITA', latitude: 40.8281, longitude: 14.1928, surface: 'grass', opened_year: 1959 },
  { slug: 'stadio-delle-alpi', name: 'Stadio delle Alpi', city: 'Turín', country_code: 'ITA', latitude: 45.1097, longitude: 7.6411, surface: 'grass', opened_year: 1990, closed_year: 2008 },
  { slug: 'stadio-artemio-franchi-florencia', name: 'Stadio Artemio Franchi', city: 'Florencia', country_code: 'ITA', latitude: 43.7806, longitude: 11.2820, surface: 'grass', opened_year: 1931 },
  { slug: 'stadio-san-nicola-bari', name: 'Stadio San Nicola', city: 'Bari', country_code: 'ITA', latitude: 41.0840, longitude: 16.8408, surface: 'grass', opened_year: 1990 },
  { slug: 'stadio-renato-dallara-bologna', name: 'Stadio Renato Dall\'Ara', city: 'Bolonia', country_code: 'ITA', latitude: 44.4920, longitude: 11.3094, surface: 'grass', opened_year: 1927 },
  { slug: 'stadio-luigi-ferraris-marassi', name: 'Stadio Luigi Ferraris', city: 'Génova', country_code: 'ITA', latitude: 44.4163, longitude: 8.9522, surface: 'grass', opened_year: 1911 },
  { slug: 'stadio-marcantonio-bentegodi', name: 'Stadio Marcantonio Bentegodi', city: 'Verona', country_code: 'ITA', latitude: 45.4358, longitude: 10.9686, surface: 'grass', opened_year: 1963 },
  { slug: 'stadio-santelia-cagliari', name: 'Stadio Sant\'Elia', city: 'Cagliari', country_code: 'ITA', latitude: 39.1973, longitude: 9.1378, surface: 'grass', opened_year: 1970, closed_year: 2017 },
  { slug: 'stadio-renzo-barbera-palermo', name: 'Stadio Renzo Barbera (La Favorita)', city: 'Palermo', country_code: 'ITA', latitude: 38.1517, longitude: 13.3450, surface: 'grass', opened_year: 1932 },
  { slug: 'stadio-friuli-udine', name: 'Stadio Friuli', city: 'Udine', country_code: 'ITA', latitude: 46.0815, longitude: 13.2003, surface: 'grass', opened_year: 1976 },
];

const REFEREES = [
  { full_name: 'Edgardo Codesal', nationality_code: 'MEX' },
  { full_name: 'Carlos Maciel', nationality_code: 'PAR' },
  { full_name: 'Michel Vautrot', nationality_code: 'FRA' },
  { full_name: 'José Roberto Wright', nationality_code: 'BRA' },
  { full_name: 'Joël Quiniou', nationality_code: 'FRA' },
  { full_name: 'Aron Schmidhuber', nationality_code: 'FRG' },
  { full_name: 'George Courtney', nationality_code: 'ENG' },
  { full_name: 'Helmut Kohl', nationality_code: 'AUT' },
  { full_name: 'Erik Fredriksson', nationality_code: 'SWE' },
  { full_name: 'Tullio Lanese', nationality_code: 'ITA' },
  { full_name: 'Naji Jouini', nationality_code: 'TUN' },
  { full_name: 'Peter Mikkelsen', nationality_code: 'DEN' },
  { full_name: 'Carlos Silva Valente', nationality_code: 'POR' },
  { full_name: 'Juan Carlos Loustau', nationality_code: 'ARG' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'r16' | 'qf' | 'sf' | '3rd' | 'final';
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  home_score_pk?: number | null;
  away_score_pk?: number | null;
  venue_slug: string;
  referee: string;
  attendance?: number;
  notes?: string;
};

const MATCHES: MatchRow[] = [
  // ── GROUP A (ITA, AUT, USA, TCH) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '1990-06-09T21:00:00+02:00', home_code: 'ITA', away_code: 'AUT', home_score: 1, away_score: 0, venue_slug: 'stadio-olimpico-roma', referee: 'Carlos Silva Valente', attendance: 73303, notes: 'Schillaci entra del banquillo al 75, marca al 78 = primer gol del torneo y empieza su Notti Magiche' },
  { match_number: 2,  stage: 'group', match_date: '1990-06-10T17:00:00+02:00', home_code: 'USA', away_code: 'TCH', home_score: 1, away_score: 5, venue_slug: 'stadio-artemio-franchi-florencia', referee: 'Kurt Röthlisberger', attendance: 33266 },
  { match_number: 3,  stage: 'group', match_date: '1990-06-14T17:00:00+02:00', home_code: 'ITA', away_code: 'USA', home_score: 1, away_score: 0, venue_slug: 'stadio-olimpico-roma', referee: 'Edgardo Codesal', attendance: 73423, notes: 'Schillaci sigue marcando' },
  { match_number: 4,  stage: 'group', match_date: '1990-06-15T21:00:00+02:00', home_code: 'AUT', away_code: 'TCH', home_score: 0, away_score: 1, venue_slug: 'stadio-artemio-franchi-florencia', referee: 'George Courtney', attendance: 38962 },
  { match_number: 5,  stage: 'group', match_date: '1990-06-19T21:00:00+02:00', home_code: 'ITA', away_code: 'TCH', home_score: 2, away_score: 0, venue_slug: 'stadio-olimpico-roma', referee: 'Aron Schmidhuber', attendance: 73303, notes: 'Schillaci hat-trick virtual: 3 partidos seguidos marcando' },
  { match_number: 6,  stage: 'group', match_date: '1990-06-19T21:00:00+02:00', home_code: 'AUT', away_code: 'USA', home_score: 2, away_score: 1, venue_slug: 'stadio-artemio-franchi-florencia', referee: 'Jamal Al-Sharif', attendance: 34857 },
  // ── GROUP B (CMR, ARG, URS, ROU) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '1990-06-08T18:00:00+02:00', home_code: 'ARG', away_code: 'CMR', home_score: 0, away_score: 1, venue_slug: 'stadio-san-siro', referee: 'Michel Vautrot', attendance: 73780, notes: '★★★ INAUGURAL DEL MUNDIAL. Mayor sorpresa inaugural histórica. Argentina (campeona defensora) cae 0-1 contra Camerún. Omam-Biyik gol min 66 (gol salta entre 3 defensores, portero falla). Camerún acabaria con 9 jugadores (Kana-Biyik 61, Massing 87) y aun asi gana. Roger Milla todavia no entra' },
  { match_number: 8,  stage: 'group', match_date: '1990-06-09T17:00:00+02:00', home_code: 'URS', away_code: 'ROU', home_score: 0, away_score: 2, venue_slug: 'stadio-san-nicola-bari', referee: 'José Roberto Wright', attendance: 42960 },
  { match_number: 9,  stage: 'group', match_date: '1990-06-13T21:00:00+02:00', home_code: 'ARG', away_code: 'URS', home_score: 2, away_score: 0, venue_slug: 'stadio-san-paolo', referee: 'Erik Fredriksson', attendance: 55759, notes: 'Maradona despeja con la mano en el área (Bin Nasser no lo ve), Codesal pita penalti que se anula. Mas tarde gol Burruchaga 79' },
  { match_number: 10, stage: 'group', match_date: '1990-06-14T21:00:00+02:00', home_code: 'CMR', away_code: 'ROU', home_score: 2, away_score: 1, venue_slug: 'stadio-san-nicola-bari', referee: 'Carlos Silva Valente', attendance: 38687, notes: 'ROGER MILLA entra del banquillo al 58, marca 2 al 76 y 86. CMR a octavos, primera africana asegurada' },
  { match_number: 11, stage: 'group', match_date: '1990-06-18T21:00:00+02:00', home_code: 'ARG', away_code: 'ROU', home_score: 1, away_score: 1, venue_slug: 'stadio-san-nicola-bari', referee: 'Carlos Maciel', attendance: 32733 },
  { match_number: 12, stage: 'group', match_date: '1990-06-18T21:00:00+02:00', home_code: 'URS', away_code: 'CMR', home_score: 4, away_score: 0, venue_slug: 'stadio-san-paolo', referee: 'Jamal Al-Sharif', attendance: 37307 },
  // ── GROUP C (BRA, SCO, CRC, SWE) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1990-06-10T21:00:00+02:00', home_code: 'BRA', away_code: 'SWE', home_score: 2, away_score: 1, venue_slug: 'stadio-delle-alpi', referee: 'Tullio Lanese', attendance: 62628, notes: 'Careca doblete. Brasil de Sebastiao Lazaroni decepcionante (4-4-2 italianista, no el fútbol arte clásico)' },
  { match_number: 14, stage: 'group', match_date: '1990-06-11T17:00:00+02:00', home_code: 'CRC', away_code: 'SCO', home_score: 1, away_score: 0, venue_slug: 'stadio-luigi-ferraris-marassi', referee: 'Juan Carlos Loustau', attendance: 30867, notes: 'COSTA RICA 1a participacion histórica, gana en debut' },
  { match_number: 15, stage: 'group', match_date: '1990-06-16T21:00:00+02:00', home_code: 'BRA', away_code: 'CRC', home_score: 1, away_score: 0, venue_slug: 'stadio-delle-alpi', referee: 'Tullio Lanese', attendance: 58007 },
  { match_number: 16, stage: 'group', match_date: '1990-06-16T17:00:00+02:00', home_code: 'SCO', away_code: 'SWE', home_score: 2, away_score: 1, venue_slug: 'stadio-luigi-ferraris-marassi', referee: 'Joël Quiniou', attendance: 31823 },
  { match_number: 17, stage: 'group', match_date: '1990-06-20T21:00:00+02:00', home_code: 'BRA', away_code: 'SCO', home_score: 1, away_score: 0, venue_slug: 'stadio-delle-alpi', referee: 'Helmut Kohl', attendance: 62628 },
  { match_number: 18, stage: 'group', match_date: '1990-06-20T21:00:00+02:00', home_code: 'CRC', away_code: 'SWE', home_score: 2, away_score: 1, venue_slug: 'stadio-luigi-ferraris-marassi', referee: 'Naji Jouini', attendance: 30223, notes: 'CRC pasa a octavos sin lesión' },
  // ── GROUP D (FRG, YUG, COL, UAE) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1990-06-10T17:00:00+02:00', home_code: 'FRG', away_code: 'YUG', home_score: 4, away_score: 1, venue_slug: 'stadio-san-siro', referee: 'Edgardo Codesal', attendance: 74765, notes: 'Matthäus 2, Klinsmann, Voller. FRG presenta candidatura' },
  { match_number: 20, stage: 'group', match_date: '1990-06-09T21:00:00+02:00', home_code: 'COL', away_code: 'UAE', home_score: 2, away_score: 0, venue_slug: 'stadio-renato-dallara-bologna', referee: 'Alan Snoddy', attendance: 30791 },
  { match_number: 21, stage: 'group', match_date: '1990-06-14T17:00:00+02:00', home_code: 'YUG', away_code: 'COL', home_score: 1, away_score: 0, venue_slug: 'stadio-renato-dallara-bologna', referee: 'Helmut Kohl', attendance: 32257 },
  { match_number: 22, stage: 'group', match_date: '1990-06-15T17:00:00+02:00', home_code: 'FRG', away_code: 'UAE', home_score: 5, away_score: 1, venue_slug: 'stadio-san-siro', referee: 'Vincent Mauro', attendance: 71169 },
  { match_number: 23, stage: 'group', match_date: '1990-06-19T17:00:00+02:00', home_code: 'YUG', away_code: 'UAE', home_score: 4, away_score: 1, venue_slug: 'stadio-renato-dallara-bologna', referee: 'Shi Zhuo', attendance: 27833 },
  { match_number: 24, stage: 'group', match_date: '1990-06-19T17:00:00+02:00', home_code: 'FRG', away_code: 'COL', home_score: 1, away_score: 1, venue_slug: 'stadio-san-siro', referee: 'Alan Snoddy', attendance: 72510, notes: 'Rincon gol al 93 da clasificación a COL' },
  // ── GROUP E (ESP, URU, BEL, KOR) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '1990-06-12T17:00:00+02:00', home_code: 'BEL', away_code: 'KOR', home_score: 2, away_score: 0, venue_slug: 'stadio-marcantonio-bentegodi', referee: 'Naji Jouini', attendance: 32790 },
  { match_number: 26, stage: 'group', match_date: '1990-06-13T17:00:00+02:00', home_code: 'URU', away_code: 'ESP', home_score: 0, away_score: 0, venue_slug: 'stadio-friuli-udine', referee: 'George Courtney', attendance: 35713 },
  { match_number: 27, stage: 'group', match_date: '1990-06-17T17:00:00+02:00', home_code: 'BEL', away_code: 'URU', home_score: 3, away_score: 1, venue_slug: 'stadio-marcantonio-bentegodi', referee: 'Hernan Silva', attendance: 33759 },
  { match_number: 28, stage: 'group', match_date: '1990-06-17T17:00:00+02:00', home_code: 'ESP', away_code: 'KOR', home_score: 3, away_score: 1, venue_slug: 'stadio-friuli-udine', referee: 'Alexei Spirin', attendance: 32733 },
  { match_number: 29, stage: 'group', match_date: '1990-06-21T17:00:00+02:00', home_code: 'BEL', away_code: 'ESP', home_score: 1, away_score: 2, venue_slug: 'stadio-marcantonio-bentegodi', referee: 'Helmut Kohl', attendance: 35950, notes: 'Michel gol del partido. ESP gana grupo' },
  { match_number: 30, stage: 'group', match_date: '1990-06-21T17:00:00+02:00', home_code: 'URU', away_code: 'KOR', home_score: 1, away_score: 0, venue_slug: 'stadio-friuli-udine', referee: 'Tullio Lanese', attendance: 29039, notes: 'Fonseca gol min 90, URU pasa a octavos' },
  // ── GROUP F (ENG, IRL, NED, EGY) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '1990-06-11T21:00:00+02:00', home_code: 'ENG', away_code: 'IRL', home_score: 1, away_score: 1, venue_slug: 'stadio-santelia-cagliari', referee: 'Aron Schmidhuber', attendance: 35238 },
  { match_number: 32, stage: 'group', match_date: '1990-06-12T21:00:00+02:00', home_code: 'NED', away_code: 'EGY', home_score: 1, away_score: 1, venue_slug: 'stadio-renzo-barbera-palermo', referee: 'Hubert Forstinger', attendance: 33288, notes: 'NED campeona Eurocopa 88, decepciona' },
  { match_number: 33, stage: 'group', match_date: '1990-06-16T17:00:00+02:00', home_code: 'ENG', away_code: 'NED', home_score: 0, away_score: 0, venue_slug: 'stadio-santelia-cagliari', referee: 'Zoran Petrović', attendance: 35267 },
  { match_number: 34, stage: 'group', match_date: '1990-06-17T17:00:00+02:00', home_code: 'IRL', away_code: 'EGY', home_score: 0, away_score: 0, venue_slug: 'stadio-renzo-barbera-palermo', referee: 'Marcel van Langenhove', attendance: 30791 },
  { match_number: 35, stage: 'group', match_date: '1990-06-21T17:00:00+02:00', home_code: 'ENG', away_code: 'EGY', home_score: 1, away_score: 0, venue_slug: 'stadio-santelia-cagliari', referee: 'Keith Hackett', attendance: 34959, notes: 'Mark Wright gol' },
  { match_number: 36, stage: 'group', match_date: '1990-06-21T17:00:00+02:00', home_code: 'IRL', away_code: 'NED', home_score: 1, away_score: 1, venue_slug: 'stadio-renzo-barbera-palermo', referee: 'Marcel van Langenhove', attendance: 33288, notes: 'IRL pasa sin ganar ningun partido (3 empates), historica' },
  // ── OCTAVOS ── 23-26 jun ─────────────────────────────────
  { match_number: 37, stage: 'r16', match_date: '1990-06-23T17:00:00+02:00', home_code: 'CMR', away_code: 'COL', home_score: 2, away_score: 1, venue_slug: 'stadio-san-paolo', referee: 'Tullio Lanese', attendance: 50026, notes: '★ CAMERÚN A CUARTOS, PRIMERA SELECCIÓN AFRICANA EN HACERLO. ROGER MILLA doblete en prorroga: min 106 (intercepta a Higuita al pasarse de cracks), min 109. Higuita queda como meme del fútbol' },
  { match_number: 38, stage: 'r16', match_date: '1990-06-23T21:00:00+02:00', home_code: 'TCH', away_code: 'CRC', home_score: 4, away_score: 1, venue_slug: 'stadio-san-nicola-bari', referee: 'Helmut Kohl', attendance: 47673 },
  { match_number: 39, stage: 'r16', match_date: '1990-06-24T17:00:00+02:00', home_code: 'BRA', away_code: 'ARG', home_score: 0, away_score: 1, venue_slug: 'stadio-delle-alpi', referee: 'Joël Quiniou', attendance: 61381, notes: '★ Caniggia gol min 80, pase ANTOLOGICO de Maradona arrastrando 4 brasileños. Brasil ELIMINADO, primera vez que cae ante ARG en Mundial' },
  { match_number: 40, stage: 'r16', match_date: '1990-06-24T21:00:00+02:00', home_code: 'FRG', away_code: 'NED', home_score: 2, away_score: 1, venue_slug: 'stadio-san-siro', referee: 'Juan Carlos Loustau', attendance: 74559, notes: '★ RIJKAARD ESCUPE A VÖLLER al min 21. Ambos expulsados. FRG gana 2-1. Klinsmann y Brehme goles' },
  { match_number: 41, stage: 'r16', match_date: '1990-06-25T17:00:00+02:00', home_code: 'IRL', away_code: 'ROU', home_score: 0, away_score: 0, home_score_pk: 5, away_score_pk: 4, venue_slug: 'stadio-luigi-ferraris-marassi', referee: 'José Roberto Wright', attendance: 31818, notes: 'IRL gana en penaltis. Bonner para a Timofte. Irlanda a cuartos sin ganar ningún partido en 90 minutos en todo el Mundial' },
  { match_number: 42, stage: 'r16', match_date: '1990-06-25T21:00:00+02:00', home_code: 'ITA', away_code: 'URU', home_score: 2, away_score: 0, venue_slug: 'stadio-olimpico-roma', referee: 'Carlos Silva Valente', attendance: 73303, notes: 'Schillaci sigue (gol 65). Notti Magiche llegan a cuartos' },
  { match_number: 43, stage: 'r16', match_date: '1990-06-26T17:00:00+02:00', home_code: 'YUG', away_code: 'ESP', home_score: 2, away_score: 1, home_score_pk: null, away_score_pk: null, venue_slug: 'stadio-renato-dallara-bologna', referee: 'Kurt Röthlisberger', attendance: 35713, notes: '2-1 a.e.t. Stojković doblete. ESP eliminada' },
  { match_number: 44, stage: 'r16', match_date: '1990-06-26T21:00:00+02:00', home_code: 'ENG', away_code: 'BEL', home_score: 1, away_score: 0, home_score_pk: null, away_score_pk: null, venue_slug: 'stadio-renato-dallara-bologna', referee: 'Peter Mikkelsen', attendance: 34520, notes: '1-0 a.e.t. Platt gol al 119 cuando se iban a penaltis' },
  // ── CUARTOS ── 30 jun - 1 jul ────────────────────────────
  { match_number: 45, stage: 'qf', match_date: '1990-06-30T17:00:00+02:00', home_code: 'ARG', away_code: 'YUG', home_score: 0, away_score: 0, home_score_pk: 3, away_score_pk: 2, venue_slug: 'stadio-artemio-franchi-florencia', referee: 'Kurt Röthlisberger', attendance: 38971, notes: 'Penaltis 3-2 ARG. Maradona FALLA penalti (segunda historia que falla, primera contra Inglaterra 86 no fue por su). Goycochea para 2 a Brnović y Hadzibegic' },
  { match_number: 46, stage: 'qf', match_date: '1990-06-30T21:00:00+02:00', home_code: 'IRL', away_code: 'ITA', home_score: 0, away_score: 1, venue_slug: 'stadio-olimpico-roma', referee: 'Carlos Silva Valente', attendance: 73303, notes: 'Schillaci min 38, sigue Bota de Oro. IRL fuera tras 4 empates en 5 partidos' },
  { match_number: 47, stage: 'qf', match_date: '1990-07-01T17:00:00+02:00', home_code: 'FRG', away_code: 'TCH', home_score: 1, away_score: 0, venue_slug: 'stadio-san-siro', referee: 'Helmut Kohl', attendance: 73347, notes: 'Matthäus penalti min 25' },
  { match_number: 48, stage: 'qf', match_date: '1990-07-01T21:00:00+02:00', home_code: 'CMR', away_code: 'ENG', home_score: 2, away_score: 3, venue_slug: 'stadio-san-paolo', referee: 'Edgardo Codesal', attendance: 55205, notes: '3-2 a.e.t. CMR iba 2-1 al 60. ENG dos penaltis Lineker (min 83 y prorroga). Camerún cuento de hadas termina en cuartos con la cabeza alta' },
  // ── SEMIS ── 3-4 jul ─────────────────────────────────────
  { match_number: 49, stage: 'sf', match_date: '1990-07-03T20:00:00+02:00', home_code: 'ITA', away_code: 'ARG', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 4, venue_slug: 'stadio-san-paolo', referee: 'Michel Vautrot', attendance: 59978, notes: '★ Schillaci 17 (sigue), Caniggia 67. Penaltis 4-3 ARG. Maradona usa el San Paolo (donde es dios) en su favor. Donadoni y Serena fallan. ITALIA OUT en semis, drama nacional' },
  { match_number: 50, stage: 'sf', match_date: '1990-07-04T20:00:00+02:00', home_code: 'FRG', away_code: 'ENG', home_score: 1, away_score: 1, home_score_pk: 4, away_score_pk: 3, venue_slug: 'stadio-delle-alpi', referee: 'José Roberto Wright', attendance: 62628, notes: '★ Brehme min 60 (chutazo), Lineker 80. Penaltis 4-3 FRG. Pearce y Waddle fallan. GAZZA (Gascoigne) LLORA tras tarjeta amarilla que le sacaría de la final si llegaban, foto histórica' },
  // ── 3er PUESTO ── 7 jul ──────────────────────────────────
  { match_number: 51, stage: '3rd', match_date: '1990-07-07T20:00:00+02:00', home_code: 'ITA', away_code: 'ENG', home_score: 2, away_score: 1, venue_slug: 'stadio-san-nicola-bari', referee: 'Joël Quiniou', attendance: 51426, notes: 'SCHILLACI gol 6o = BOTA DE ORO ITALIA 90. Italia tercera' },
  // ── FINAL ── 8 jul ───────────────────────────────────────
  { match_number: 52, stage: 'final', match_date: '1990-07-08T20:00:00+02:00', home_code: 'FRG', away_code: 'ARG', home_score: 1, away_score: 0, venue_slug: 'stadio-olimpico-roma', referee: 'Edgardo Codesal', attendance: 73603, notes: '★ FRG TRICAMPEONA MUNDIAL (1954, 74, 90). BREHME PENALTI min 85, falta polémica de Sensini sobre Voller. Codesal pita. MONZÓN expulsado min 64 (1ra expulsion en una final mundialista). DEZOTTI expulsado min 87. Maradona LLORA al recoger medalla 2o puesto. ARG termina con 9 jugadores. El final más amargo de Maradona en Mundiales. Beckenbauer SELECCIONADOR + CAPITÁN campeon (unico hasta Deschamps 2018)' },
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
    home_score_pk: m.home_score_pk ?? null,
    away_score_pk: m.away_score_pk ?? null,
    venue_id: venueIdBySlug.get(m.venue_slug) ?? null,
    referee_id: refIdByName.get(m.referee) ?? null,
    attendance: m.attendance ?? null,
    winner_code:
      m.home_score > m.away_score
        ? m.home_code
        : m.away_score > m.home_score
        ? m.away_code
        : m.home_score_pk != null && m.away_score_pk != null
        ? m.home_score_pk > m.away_score_pk
          ? m.home_code
          : m.away_code
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

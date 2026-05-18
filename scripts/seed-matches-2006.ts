/**
 * Seed los 64 partidos del Mundial Alemania 2006.
 *
 * 32 selecciones, 64 partidos, 12 estadios alemanes.
 *
 * Hitos:
 *  - ITALIA TETRACAMPEONA. Final 1-1 vs FRA (penaltis 5-3). Trezeguet
 *    falla el único francés. Materazzi gol del empate (min 19) tras
 *    Zidane (min 7, penalti picado).
 *  - ★★★ ZIDANE CABEZAZO A MATERAZZI min 110. Roja directa de Horacio
 *    Elizondo (cuarto árbitro Medina Cantalejo le avisa). Despedida
 *    más triste del fútbol. Insulto madre/hermana.
 *  - KLOSE BOTA DE ORO 5 goles. Comienza su recorrido al record
 *    histórico (16 goles, superado en 2014 Brasil).
 *  - ALEMANIA TERCERA (1-3 Portugal en partido del 3o, Schweinsteiger
 *    doblete). Klinsmann seleccionador, Löw asistente.
 *  - ARG cuartos eliminada por GER en penaltis (Lehmann héroe atajadas).
 *  - ENG cuartos eliminada por POR en penaltis (Beckham llorando con
 *    capitanía). Maxi Rodríguez golazo de volea vs MEX en oct.
 *  - ESP cae OCTAVOS vs FRA 1-3 (Vieira, Ribéry, Zidane). Aragonés
 *    seleccionador, fin del ciclo Camacho/Sáez.
 *  - SUI ELIMINADA SIN ENCAJAR GOL en juego (en cuartos vs UKR 0-0
 *    pen 0-3, los tres suizos fallaron primeros 3 lanzamientos).
 *  - TRINIDAD Y TOBAGO debut histórico. Australia primer Mundial 32 años
 *    (desde 1974).
 *  - Lippi seleccionador italiano. Pirlo, Cannavaro Balón de Oro 2006.
 *
 * Datos verificados con FIFA archives, Wikipedia (2006 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-2006.ts
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

const YEAR = 2006;

const TEAMS = [
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'UKR', name: 'Ucrania', conf: 'UEFA', flag: '🇺🇦' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'AUS', name: 'Australia', conf: 'AFC', flag: '🇦🇺' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'GHA', name: 'Ghana', conf: 'CAF', flag: '🇬🇭' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'CIV', name: 'Costa de Marfil', conf: 'CAF', flag: '🇨🇮' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'CZE', name: 'Chequia', conf: 'UEFA', flag: '🇨🇿' },
  { code: 'TOG', name: 'Togo', conf: 'CAF', flag: '🇹🇬' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'SCG', name: 'Serbia y Montenegro', conf: 'UEFA', flag: '🇷🇸', dissolved: 2006, successor: 'SRB' },
  { code: 'ANG', name: 'Angola', conf: 'CAF', flag: '🇦🇴' },
  { code: 'IRN', name: 'Irán', conf: 'AFC', flag: '🇮🇷' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'TUN', name: 'Túnez', conf: 'CAF', flag: '🇹🇳' },
  { code: 'KSA', name: 'Arabia Saudí', conf: 'AFC', flag: '🇸🇦' },
  { code: 'CRO', name: 'Croacia', conf: 'UEFA', flag: '🇭🇷' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'TRI', name: 'Trinidad y Tobago', conf: 'CONCACAF', flag: '🇹🇹' },
  { code: 'ECU', name: 'Ecuador', conf: 'CONMEBOL', flag: '🇪🇨' },
];

const VENUES = [
  { slug: 'olympiastadion-berlin', name: 'Olympiastadion', city: 'Berlín', country_code: 'GER', latitude: 52.5147, longitude: 13.2395, surface: 'grass', opened_year: 1936 },
  { slug: 'allianz-arena-munich', name: 'Allianz Arena', city: 'Múnich', country_code: 'GER', latitude: 48.2188, longitude: 11.6247, surface: 'grass', opened_year: 2005 },
  { slug: 'westfalenstadion-dortmund', name: 'Westfalenstadion', city: 'Dortmund', country_code: 'GER', latitude: 51.4925, longitude: 7.4517, surface: 'grass', opened_year: 1974 },
  { slug: 'veltins-arena-gelsenkirchen', name: 'Veltins-Arena', city: 'Gelsenkirchen', country_code: 'GER', latitude: 51.5547, longitude: 7.0678, surface: 'grass', opened_year: 2001 },
  { slug: 'commerzbank-arena-frankfurt', name: 'Commerzbank-Arena', city: 'Fráncfort', country_code: 'GER', latitude: 50.0686, longitude: 8.6453, surface: 'grass', opened_year: 1925 },
  { slug: 'volksparkstadion-hamburg', name: 'Volksparkstadion', city: 'Hamburgo', country_code: 'GER', latitude: 53.5872, longitude: 9.8990, surface: 'grass', opened_year: 1953 },
  { slug: 'awd-arena-hannover', name: 'AWD-Arena', city: 'Hannover', country_code: 'GER', latitude: 52.3603, longitude: 9.7311, surface: 'grass', opened_year: 1954 },
  { slug: 'frankenstadion-nuremberg', name: 'Frankenstadion', city: 'Núremberg', country_code: 'GER', latitude: 49.4264, longitude: 11.1257, surface: 'grass', opened_year: 1928 },
  { slug: 'mercedes-benz-arena-stuttgart', name: 'Gottlieb-Daimler-Stadion', city: 'Stuttgart', country_code: 'GER', latitude: 48.7925, longitude: 9.2322, surface: 'grass', opened_year: 1933 },
  { slug: 'fritz-walter-stadion-kaiserslautern', name: 'Fritz-Walter-Stadion', city: 'Kaiserslautern', country_code: 'GER', latitude: 49.4344, longitude: 7.7767, surface: 'grass', opened_year: 1920 },
  { slug: 'rheinenergiestadion-koln', name: 'RheinEnergieStadion', city: 'Colonia', country_code: 'GER', latitude: 50.9335, longitude: 6.8753, surface: 'grass', opened_year: 1923 },
  { slug: 'zentralstadion-leipzig', name: 'Zentralstadion', city: 'Leipzig', country_code: 'GER', latitude: 51.3458, longitude: 12.3481, surface: 'grass', opened_year: 2004 },
];

const REFEREES = [
  { full_name: 'Horacio Elizondo', nationality_code: 'ARG' },
  { full_name: 'Markus Merk', nationality_code: 'GER' },
  { full_name: 'Carlos Simon', nationality_code: 'BRA' },
  { full_name: 'Roberto Rosetti', nationality_code: 'ITA' },
  { full_name: 'Massimo Busacca', nationality_code: 'SUI' },
  { full_name: 'Frank de Bleeckere', nationality_code: 'BEL' },
  { full_name: 'Toru Kamikawa', nationality_code: 'JPN' },
  { full_name: 'Graham Poll', nationality_code: 'ENG' },
  { full_name: 'Valentin Ivanov', nationality_code: 'RUS' },
  { full_name: 'Luis Medina Cantalejo', nationality_code: 'ESP' },
  { full_name: 'Lubos Michel', nationality_code: 'SVK' },
  { full_name: 'Benito Archundia', nationality_code: 'MEX' },
  { full_name: 'Jorge Larrionda', nationality_code: 'URU' },
  { full_name: 'Carlos Amarilla', nationality_code: 'PAR' },
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
  // ── GRUPO A (GER, CRC, POL, ECU) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '2006-06-09T18:00:00+02:00', home_code: 'GER', away_code: 'CRC', home_score: 4, away_score: 2, venue_slug: 'allianz-arena-munich', referee: 'Horacio Elizondo', attendance: 66000, notes: '★ INAUGURAL. Klose doblete, Philipp Lahm gol min 6 (1er gol Mundial). Klinsmann debuta como seleccionador local. Gols rápidos en ambos lados' },
  { match_number: 2,  stage: 'group', match_date: '2006-06-09T21:00:00+02:00', home_code: 'POL', away_code: 'ECU', home_score: 0, away_score: 2, venue_slug: 'veltins-arena-gelsenkirchen', referee: 'Toru Kamikawa', attendance: 52000 },
  { match_number: 3,  stage: 'group', match_date: '2006-06-14T15:00:00+02:00', home_code: 'GER', away_code: 'POL', home_score: 1, away_score: 0, venue_slug: 'westfalenstadion-dortmund', referee: 'Luis Medina Cantalejo', attendance: 65000, notes: 'Neuville gol al 90+1' },
  { match_number: 4,  stage: 'group', match_date: '2006-06-15T18:00:00+02:00', home_code: 'ECU', away_code: 'CRC', home_score: 3, away_score: 0, venue_slug: 'awd-arena-hannover', referee: 'Mark Shield', attendance: 38500 },
  { match_number: 5,  stage: 'group', match_date: '2006-06-20T16:00:00+02:00', home_code: 'ECU', away_code: 'GER', home_score: 0, away_score: 3, venue_slug: 'olympiastadion-berlin', referee: 'Valentin Ivanov', attendance: 72000 },
  { match_number: 6,  stage: 'group', match_date: '2006-06-20T16:00:00+02:00', home_code: 'CRC', away_code: 'POL', home_score: 1, away_score: 2, venue_slug: 'awd-arena-hannover', referee: 'Roberto Rosetti', attendance: 43000 },
  // ── GRUPO B (ENG, SWE, PAR, TRI) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '2006-06-10T15:00:00+02:00', home_code: 'ENG', away_code: 'PAR', home_score: 1, away_score: 0, venue_slug: 'commerzbank-arena-frankfurt', referee: 'Marco Rodriguez', attendance: 48000, notes: 'Autogol Gamarra min 3' },
  { match_number: 8,  stage: 'group', match_date: '2006-06-10T18:00:00+02:00', home_code: 'TRI', away_code: 'SWE', home_score: 0, away_score: 0, venue_slug: 'fritz-walter-stadion-kaiserslautern', referee: 'Shamsul Maidin', attendance: 46000, notes: 'TRI debut Mundial historico' },
  { match_number: 9,  stage: 'group', match_date: '2006-06-15T15:00:00+02:00', home_code: 'ENG', away_code: 'TRI', home_score: 2, away_score: 0, venue_slug: 'frankenstadion-nuremberg', referee: 'Toru Kamikawa', attendance: 41000 },
  { match_number: 10, stage: 'group', match_date: '2006-06-15T21:00:00+02:00', home_code: 'SWE', away_code: 'PAR', home_score: 1, away_score: 0, venue_slug: 'olympiastadion-berlin', referee: 'Graham Poll', attendance: 72000 },
  { match_number: 11, stage: 'group', match_date: '2006-06-20T21:00:00+02:00', home_code: 'SWE', away_code: 'ENG', home_score: 2, away_score: 2, venue_slug: 'rheinenergiestadion-koln', referee: 'Massimo Busacca', attendance: 45000 },
  { match_number: 12, stage: 'group', match_date: '2006-06-20T21:00:00+02:00', home_code: 'PAR', away_code: 'TRI', home_score: 2, away_score: 0, venue_slug: 'fritz-walter-stadion-kaiserslautern', referee: 'Frank de Bleeckere', attendance: 46000 },
  // ── GRUPO C (ARG, NED, CIV, SCG) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '2006-06-10T21:00:00+02:00', home_code: 'ARG', away_code: 'CIV', home_score: 2, away_score: 1, venue_slug: 'awd-arena-hannover', referee: 'Lubos Michel', attendance: 45000, notes: 'Crespo y Saviola. Drogba descuenta' },
  { match_number: 14, stage: 'group', match_date: '2006-06-11T15:00:00+02:00', home_code: 'SCG', away_code: 'NED', home_score: 0, away_score: 1, venue_slug: 'zentralstadion-leipzig', referee: 'Markus Merk', attendance: 39000, notes: 'Robben gol. Ultima participacion SCG antes de disolverse' },
  { match_number: 15, stage: 'group', match_date: '2006-06-16T15:00:00+02:00', home_code: 'ARG', away_code: 'SCG', home_score: 6, away_score: 0, venue_slug: 'veltins-arena-gelsenkirchen', referee: 'Roberto Rosetti', attendance: 52000, notes: '★ "POEMA TIQUI-TAQUI" Argentino. Cambiasso gol al final tras jugada de 24 pases. Crespo, Rodriguez, Tevez, Messi (debut)' },
  { match_number: 16, stage: 'group', match_date: '2006-06-16T18:00:00+02:00', home_code: 'NED', away_code: 'CIV', home_score: 2, away_score: 1, venue_slug: 'mercedes-benz-arena-stuttgart', referee: 'Oscar Ruiz', attendance: 52000 },
  { match_number: 17, stage: 'group', match_date: '2006-06-21T16:00:00+02:00', home_code: 'NED', away_code: 'ARG', home_score: 0, away_score: 0, venue_slug: 'commerzbank-arena-frankfurt', referee: 'Markus Merk', attendance: 48000 },
  { match_number: 18, stage: 'group', match_date: '2006-06-21T16:00:00+02:00', home_code: 'CIV', away_code: 'SCG', home_score: 3, away_score: 2, venue_slug: 'allianz-arena-munich', referee: 'Carlos Simon', attendance: 66000 },
  // ── GRUPO D (POR, MEX, ANG, IRN) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '2006-06-11T18:00:00+02:00', home_code: 'MEX', away_code: 'IRN', home_score: 3, away_score: 1, venue_slug: 'frankenstadion-nuremberg', referee: 'Benito Archundia', attendance: 41000 },
  { match_number: 20, stage: 'group', match_date: '2006-06-11T21:00:00+02:00', home_code: 'ANG', away_code: 'POR', home_score: 0, away_score: 1, venue_slug: 'rheinenergiestadion-koln', referee: 'Jorge Larrionda', attendance: 45000, notes: 'ANG debut Mundial. Pauleta gol' },
  { match_number: 21, stage: 'group', match_date: '2006-06-16T21:00:00+02:00', home_code: 'MEX', away_code: 'ANG', home_score: 0, away_score: 0, venue_slug: 'awd-arena-hannover', referee: 'Lubos Michel', attendance: 43000 },
  { match_number: 22, stage: 'group', match_date: '2006-06-17T18:00:00+02:00', home_code: 'POR', away_code: 'IRN', home_score: 2, away_score: 0, venue_slug: 'commerzbank-arena-frankfurt', referee: 'Eric Poulat', attendance: 48000, notes: 'Deco y Cristiano Ronaldo (penalti)' },
  { match_number: 23, stage: 'group', match_date: '2006-06-21T21:00:00+02:00', home_code: 'POR', away_code: 'MEX', home_score: 2, away_score: 1, venue_slug: 'veltins-arena-gelsenkirchen', referee: 'Toru Kamikawa', attendance: 52000 },
  { match_number: 24, stage: 'group', match_date: '2006-06-21T21:00:00+02:00', home_code: 'IRN', away_code: 'ANG', home_score: 1, away_score: 1, venue_slug: 'zentralstadion-leipzig', referee: 'Mohamed Guezzaz', attendance: 38500 },
  // ── GRUPO E (ITA, GHA, CZE, USA) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '2006-06-12T15:00:00+02:00', home_code: 'USA', away_code: 'CZE', home_score: 0, away_score: 3, venue_slug: 'commerzbank-arena-frankfurt', referee: 'Carlos Amarilla', attendance: 48000 },
  { match_number: 26, stage: 'group', match_date: '2006-06-12T18:00:00+02:00', home_code: 'ITA', away_code: 'GHA', home_score: 2, away_score: 0, venue_slug: 'awd-arena-hannover', referee: 'Roberto Rosetti', attendance: 43000, notes: 'Pirlo y Iaquinta' },
  { match_number: 27, stage: 'group', match_date: '2006-06-17T15:00:00+02:00', home_code: 'CZE', away_code: 'GHA', home_score: 0, away_score: 2, venue_slug: 'rheinenergiestadion-koln', referee: 'Carlos Simon', attendance: 45000 },
  { match_number: 28, stage: 'group', match_date: '2006-06-17T21:00:00+02:00', home_code: 'ITA', away_code: 'USA', home_score: 1, away_score: 1, venue_slug: 'fritz-walter-stadion-kaiserslautern', referee: 'Jorge Larrionda', attendance: 46000, notes: 'Tres rojas (De Rossi tras codazo, Mastroeni y Pope USA)' },
  { match_number: 29, stage: 'group', match_date: '2006-06-22T16:00:00+02:00', home_code: 'CZE', away_code: 'ITA', home_score: 0, away_score: 2, venue_slug: 'volksparkstadion-hamburg', referee: 'Benito Archundia', attendance: 50000 },
  { match_number: 30, stage: 'group', match_date: '2006-06-22T16:00:00+02:00', home_code: 'GHA', away_code: 'USA', home_score: 2, away_score: 1, venue_slug: 'frankenstadion-nuremberg', referee: 'Markus Merk', attendance: 41000, notes: 'GHA primera selección africana en clasificar para octavos en su debut' },
  // ── GRUPO F (BRA, AUS, CRO, JPN) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '2006-06-12T21:00:00+02:00', home_code: 'AUS', away_code: 'JPN', home_score: 3, away_score: 1, venue_slug: 'fritz-walter-stadion-kaiserslautern', referee: 'Essam Abd El Fatah', attendance: 46000, notes: 'AUS remontada Hiddink min 84-90+2' },
  { match_number: 32, stage: 'group', match_date: '2006-06-13T18:00:00+02:00', home_code: 'BRA', away_code: 'CRO', home_score: 1, away_score: 0, venue_slug: 'olympiastadion-berlin', referee: 'Benito Archundia', attendance: 72000, notes: 'Kaká golazo tiro libre' },
  { match_number: 33, stage: 'group', match_date: '2006-06-18T15:00:00+02:00', home_code: 'JPN', away_code: 'CRO', home_score: 0, away_score: 0, venue_slug: 'frankenstadion-nuremberg', referee: 'Frank de Bleeckere', attendance: 41000 },
  { match_number: 34, stage: 'group', match_date: '2006-06-18T21:00:00+02:00', home_code: 'BRA', away_code: 'AUS', home_score: 2, away_score: 0, venue_slug: 'allianz-arena-munich', referee: 'Markus Merk', attendance: 66000 },
  { match_number: 35, stage: 'group', match_date: '2006-06-22T21:00:00+02:00', home_code: 'JPN', away_code: 'BRA', home_score: 1, away_score: 4, venue_slug: 'westfalenstadion-dortmund', referee: 'Eric Poulat', attendance: 65000, notes: 'Ronaldo doblete' },
  { match_number: 36, stage: 'group', match_date: '2006-06-22T21:00:00+02:00', home_code: 'CRO', away_code: 'AUS', home_score: 2, away_score: 2, venue_slug: 'mercedes-benz-arena-stuttgart', referee: 'Graham Poll', attendance: 52000, notes: '★ POLEMICA POLL: TRES AMARILLAS a Simunic. Roja al final pero Poll ridiculizado mundialmente. Fin carrera' },
  // ── GRUPO G (FRA, SUI, KOR, TOG) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '2006-06-13T15:00:00+02:00', home_code: 'FRA', away_code: 'SUI', home_score: 0, away_score: 0, venue_slug: 'mercedes-benz-arena-stuttgart', referee: 'Valentin Ivanov', attendance: 52000 },
  { match_number: 38, stage: 'group', match_date: '2006-06-13T21:00:00+02:00', home_code: 'KOR', away_code: 'TOG', home_score: 2, away_score: 1, venue_slug: 'commerzbank-arena-frankfurt', referee: 'Graham Poll', attendance: 48000, notes: 'TOG debut Mundial. Ahn doblete KOR' },
  { match_number: 39, stage: 'group', match_date: '2006-06-18T18:00:00+02:00', home_code: 'FRA', away_code: 'KOR', home_score: 1, away_score: 1, venue_slug: 'zentralstadion-leipzig', referee: 'Benito Archundia', attendance: 38500, notes: 'Henry y Park Ji-sung' },
  { match_number: 40, stage: 'group', match_date: '2006-06-19T15:00:00+02:00', home_code: 'TOG', away_code: 'SUI', home_score: 0, away_score: 2, venue_slug: 'westfalenstadion-dortmund', referee: 'Mohamed Guezzaz', attendance: 65000 },
  { match_number: 41, stage: 'group', match_date: '2006-06-23T21:00:00+02:00', home_code: 'TOG', away_code: 'FRA', home_score: 0, away_score: 2, venue_slug: 'rheinenergiestadion-koln', referee: 'Jorge Larrionda', attendance: 45000, notes: 'Vieira y Henry' },
  { match_number: 42, stage: 'group', match_date: '2006-06-23T21:00:00+02:00', home_code: 'SUI', away_code: 'KOR', home_score: 2, away_score: 0, venue_slug: 'awd-arena-hannover', referee: 'Horacio Elizondo', attendance: 43000 },
  // ── GRUPO H (ESP, UKR, TUN, KSA) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '2006-06-14T18:00:00+02:00', home_code: 'ESP', away_code: 'UKR', home_score: 4, away_score: 0, venue_slug: 'zentralstadion-leipzig', referee: 'Massimo Busacca', attendance: 38500, notes: 'Aragonés debuta. Xabi Alonso, Villa, Torres goles' },
  { match_number: 44, stage: 'group', match_date: '2006-06-14T21:00:00+02:00', home_code: 'TUN', away_code: 'KSA', home_score: 2, away_score: 2, venue_slug: 'allianz-arena-munich', referee: 'Mark Shield', attendance: 66000 },
  { match_number: 45, stage: 'group', match_date: '2006-06-19T18:00:00+02:00', home_code: 'ESP', away_code: 'TUN', home_score: 3, away_score: 1, venue_slug: 'mercedes-benz-arena-stuttgart', referee: 'Toru Kamikawa', attendance: 52000, notes: 'Raul, Torres doblete' },
  { match_number: 46, stage: 'group', match_date: '2006-06-19T21:00:00+02:00', home_code: 'KSA', away_code: 'UKR', home_score: 0, away_score: 4, venue_slug: 'awd-arena-hannover', referee: 'Carlos Amarilla', attendance: 43000 },
  { match_number: 47, stage: 'group', match_date: '2006-06-23T17:00:00+02:00', home_code: 'KSA', away_code: 'ESP', home_score: 0, away_score: 1, venue_slug: 'fritz-walter-stadion-kaiserslautern', referee: 'Modibo Toure', attendance: 46000 },
  { match_number: 48, stage: 'group', match_date: '2006-06-23T17:00:00+02:00', home_code: 'UKR', away_code: 'TUN', home_score: 1, away_score: 0, venue_slug: 'olympiastadion-berlin', referee: 'Carlos Simon', attendance: 72000 },
  // ── OCTAVOS ── 24-27 jun ─────────────────────────────────
  { match_number: 49, stage: 'r16', match_date: '2006-06-24T17:00:00+02:00', home_code: 'GER', away_code: 'SWE', home_score: 2, away_score: 0, venue_slug: 'allianz-arena-munich', referee: 'Carlos Simon', attendance: 66000, notes: 'Podolski doblete min 4 y 12. Lucic roja al 35' },
  { match_number: 50, stage: 'r16', match_date: '2006-06-24T21:00:00+02:00', home_code: 'ARG', away_code: 'MEX', home_score: 2, away_score: 1, venue_slug: 'zentralstadion-leipzig', referee: 'Massimo Busacca', attendance: 39000, notes: '★ MAXI RODRIGUEZ GOLAZO VOLEA min 108. Mejor gol del Mundial. Crespo empata 0-1, Hernandez prorroga' },
  { match_number: 51, stage: 'r16', match_date: '2006-06-25T17:00:00+02:00', home_code: 'ENG', away_code: 'ECU', home_score: 1, away_score: 0, venue_slug: 'veltins-arena-gelsenkirchen', referee: 'Frank de Bleeckere', attendance: 52000, notes: 'Beckham gol falta directa' },
  { match_number: 52, stage: 'r16', match_date: '2006-06-25T21:00:00+02:00', home_code: 'POR', away_code: 'NED', home_score: 1, away_score: 0, venue_slug: 'frankenstadion-nuremberg', referee: 'Valentin Ivanov', attendance: 41000, notes: '★ "BATTLE OF NUREMBERG" 16 amarillas + 4 rojas (record histórico). Costinha y Deco fuera, Boulahrouz y van Bronckhorst fuera. Maniche gol' },
  { match_number: 53, stage: 'r16', match_date: '2006-06-26T17:00:00+02:00', home_code: 'ITA', away_code: 'AUS', home_score: 1, away_score: 0, venue_slug: 'fritz-walter-stadion-kaiserslautern', referee: 'Luis Medina Cantalejo', attendance: 46000, notes: 'Totti penalti min 95. Polémica falta sobre Grosso' },
  { match_number: 54, stage: 'r16', match_date: '2006-06-26T21:00:00+02:00', home_code: 'SUI', away_code: 'UKR', home_score: 0, away_score: 0, home_score_pk: 0, away_score_pk: 3, venue_slug: 'rheinenergiestadion-koln', referee: 'Benito Archundia', attendance: 45000, notes: '★ SUI ELIMINADA SIN ENCAJAR GOL EN JUEGO. Falla 3 penaltis seguidos en tanda (Streller, Cabanas, Barnetta). UKR cuartos' },
  { match_number: 55, stage: 'r16', match_date: '2006-06-27T17:00:00+02:00', home_code: 'BRA', away_code: 'GHA', home_score: 3, away_score: 0, venue_slug: 'westfalenstadion-dortmund', referee: 'Lubos Michel', attendance: 65000, notes: 'Ronaldo gol 15 Mundiales (record antes Müller). Adriano y Ze Roberto' },
  { match_number: 56, stage: 'r16', match_date: '2006-06-27T21:00:00+02:00', home_code: 'ESP', away_code: 'FRA', home_score: 1, away_score: 3, venue_slug: 'awd-arena-hannover', referee: 'Roberto Rosetti', attendance: 43000, notes: '★ ESP CAE EN OCTAVOS. Villa penalti, Ribéry empate, Vieira y Zidane definen. Aragonés mantenido. Fin del ciclo Camacho-Sáez' },
  // ── CUARTOS ── 30 jun - 1 jul ────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '2006-06-30T17:00:00+02:00', home_code: 'GER', away_code: 'ARG', home_score: 1, away_score: 1, home_score_pk: 4, away_score_pk: 2, venue_slug: 'olympiastadion-berlin', referee: 'Lubos Michel', attendance: 72000, notes: '★★ LEHMANN HEROE. ARG primero (Ayala), Klose empata 80. Penaltis: Lehmann lee papelito con cuelos (escrito por su entrenador) y para a Ayala y Cambiasso. Trifulca después del partido, Cufré roja' },
  { match_number: 58, stage: 'qf', match_date: '2006-06-30T21:00:00+02:00', home_code: 'ITA', away_code: 'UKR', home_score: 3, away_score: 0, venue_slug: 'awd-arena-hannover', referee: 'Frank de Bleeckere', attendance: 43000, notes: 'Zambrotta, Toni doblete' },
  { match_number: 59, stage: 'qf', match_date: '2006-07-01T17:00:00+02:00', home_code: 'ENG', away_code: 'POR', home_score: 0, away_score: 0, home_score_pk: 1, away_score_pk: 3, venue_slug: 'veltins-arena-gelsenkirchen', referee: 'Horacio Elizondo', attendance: 52000, notes: '★★ ROONEY EXPULSADO al 62 por pisotón a Carvalho. Cristiano Ronaldo le guiño al banquillo (la imagen). Penaltis: Lampard, Gerrard y Carragher fallan. ENG fuera, Beckham se va llorando' },
  { match_number: 60, stage: 'qf', match_date: '2006-07-01T21:00:00+02:00', home_code: 'BRA', away_code: 'FRA', home_score: 0, away_score: 1, venue_slug: 'commerzbank-arena-frankfurt', referee: 'Luis Medina Cantalejo', attendance: 48000, notes: '★ ZIDANE MASTERCLASS. Cuatro años después de la convulsion del 98, viene el genio total. Asistencia a Henry. Brasil de Ronaldo, Ronaldinho, Kaká eliminado por un solo francés' },
  // ── SEMIS ── 4-5 jul ─────────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '2006-07-04T21:00:00+02:00', home_code: 'GER', away_code: 'ITA', home_score: 0, away_score: 2, venue_slug: 'westfalenstadion-dortmund', referee: 'Benito Archundia', attendance: 65000, notes: '★ Dos goles en prórroga al 119 y 121. Grosso (zurdazo al ángulo) y Del Piero (pase Cannavaro). ALE eliminada en casa. Klinsmann llora' },
  { match_number: 62, stage: 'sf', match_date: '2006-07-05T21:00:00+02:00', home_code: 'POR', away_code: 'FRA', home_score: 0, away_score: 1, venue_slug: 'allianz-arena-munich', referee: 'Jorge Larrionda', attendance: 66000, notes: 'Zidane penalti al 33 (falta a Henry)' },
  // ── 3er PUESTO ── 8 jul ──────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '2006-07-08T21:00:00+02:00', home_code: 'GER', away_code: 'POR', home_score: 3, away_score: 1, venue_slug: 'mercedes-benz-arena-stuttgart', referee: 'Toru Kamikawa', attendance: 52000, notes: 'Schweinsteiger doblete + autogol Petit. ALE tercera, Klose Bota de Oro 5 goles' },
  // ── FINAL ── 9 jul ───────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '2006-07-09T20:00:00+02:00', home_code: 'ITA', away_code: 'FRA', home_score: 1, away_score: 1, home_score_pk: 5, away_score_pk: 3, venue_slug: 'olympiastadion-berlin', referee: 'Horacio Elizondo', attendance: 69000, notes: '★★★ ITALIA TETRACAMPEONA. ZIDANE PENALTI PICADO al 7 (al larguero, picó al campo y entró). Materazzi empata 19 de cabeza. ★★ ZIDANE CABEZAZO A MATERAZZI min 110, roja directa. Elizondo informado por Medina Cantalejo (cuarto árbitro). PENALTIES 5-3: Trezeguet ÚNICO francés que falla (al larguero). Cannavaro capitán y Balón de Oro 2006. Lippi seleccionador. Despedida más triste de Zidane' },
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

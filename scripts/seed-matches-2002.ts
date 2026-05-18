/**
 * Seed los 64 partidos del Mundial Corea-Japón 2002.
 *
 * PRIMER MUNDIAL EN ASIA y primero compartido entre dos países
 * (Corea del Sur + Japón). 32 selecciones, 64 partidos.
 *
 * Hitos:
 *  - BRASIL PENTACAMPEÓN. Doblete de Ronaldo en final 2-0 vs ALE.
 *  - RONALDO BOTA DE ORO con 8 goles, redención del 0-3 de Francia 98.
 *  - INAUGURAL FRA-SEN 0-1: SENEGAL TUMBA al CAMPEÓN VIGENTE.
 *    Bouba Diop gol al 30. Francia eliminada en grupos sin marcar
 *    (FRA-URU 0-0 + FRA-DEN 0-2). Zidane lesionado.
 *  - COREA DEL SUR EN SEMIFINAL. Eliminada por Alemania 1-0.
 *    Guus Hiddink seleccionador. Park Ji-sung, Ahn Jung-hwan.
 *    KOR-ITA 2-1 (oct, gol oro Ahn) y KOR-ESP 0-0 (5-3 pen) en
 *    cuartos. POLÉMICA ARBITRAL constante.
 *  - JAPÓN OCTAVOS (eliminada por TUR 1-0). Hidetoshi Nakata
 *    capitán. Primer Mundial mostrado en horario asiático prime time.
 *  - TURQUÍA TERCERA en su segundo Mundial. Hakan Şükür gol más
 *    rápido de la historia (11 segundos, KOR-TUR 3o).
 *  - SENEGAL CUARTOS. EE.UU. CUARTOS. KOREA SEMIS. Cuatro
 *    selecciones no-tradicionales en la fase final.
 *  - VAR no existe. ÁRBITROS POLÉMICOS: Byron Moreno (KOR-ITA)
 *    y Gamal Al-Ghandour (KOR-ESP) en el ojo del huracán.
 *
 * Datos verificados con FIFA archives, Wikipedia (2002 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-2002.ts
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

const YEAR = 2002;

const TEAMS = [
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'TUR', name: 'Turquía', conf: 'UEFA', flag: '🇹🇷' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'SEN', name: 'Senegal', conf: 'CAF', flag: '🇸🇳' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'IRL', name: 'Irlanda', conf: 'UEFA', flag: '🇮🇪' },
  { code: 'DEN', name: 'Dinamarca', conf: 'UEFA', flag: '🇩🇰' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'NGA', name: 'Nigeria', conf: 'CAF', flag: '🇳🇬' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'CRO', name: 'Croacia', conf: 'UEFA', flag: '🇭🇷' },
  { code: 'ECU', name: 'Ecuador', conf: 'CONMEBOL', flag: '🇪🇨' },
  { code: 'SVN', name: 'Eslovenia', conf: 'UEFA', flag: '🇸🇮' },
  { code: 'RSA', name: 'Sudáfrica', conf: 'CAF', flag: '🇿🇦' },
  { code: 'CHN', name: 'China', conf: 'AFC', flag: '🇨🇳' },
  { code: 'TUN', name: 'Túnez', conf: 'CAF', flag: '🇹🇳' },
  { code: 'RUS', name: 'Rusia', conf: 'UEFA', flag: '🇷🇺' },
  { code: 'KSA', name: 'Arabia Saudí', conf: 'AFC', flag: '🇸🇦' },
];

const VENUES = [
  // Corea del Sur (10 estadios)
  { slug: 'seoul-world-cup-stadium', name: 'Seoul World Cup Stadium', city: 'Seúl', country_code: 'KOR', latitude: 37.5683, longitude: 126.8975, surface: 'grass', opened_year: 2001 },
  { slug: 'busan-asiad-stadium', name: 'Busan Asiad Stadium', city: 'Busán', country_code: 'KOR', latitude: 35.1924, longitude: 129.0589, surface: 'grass', opened_year: 2001 },
  { slug: 'incheon-munhak-stadium', name: 'Incheon Munhak Stadium', city: 'Incheon', country_code: 'KOR', latitude: 37.4359, longitude: 126.6911, surface: 'grass', opened_year: 2002 },
  { slug: 'daegu-world-cup-stadium', name: 'Daegu World Cup Stadium', city: 'Daegu', country_code: 'KOR', latitude: 35.8367, longitude: 128.5897, surface: 'grass', opened_year: 2001 },
  { slug: 'daejeon-world-cup-stadium', name: 'Daejeon World Cup Stadium', city: 'Daejeon', country_code: 'KOR', latitude: 36.3654, longitude: 127.3304, surface: 'grass', opened_year: 2001 },
  { slug: 'gwangju-world-cup-stadium', name: 'Gwangju World Cup Stadium', city: 'Gwangju', country_code: 'KOR', latitude: 35.1383, longitude: 126.8861, surface: 'grass', opened_year: 2001 },
  { slug: 'jeonju-world-cup-stadium', name: 'Jeonju World Cup Stadium', city: 'Jeonju', country_code: 'KOR', latitude: 35.8856, longitude: 127.0917, surface: 'grass', opened_year: 2001 },
  { slug: 'suwon-world-cup-stadium', name: 'Suwon World Cup Stadium', city: 'Suwon', country_code: 'KOR', latitude: 37.2867, longitude: 127.0367, surface: 'grass', opened_year: 2001 },
  { slug: 'ulsan-munsu-stadium', name: 'Ulsan Munsu Stadium', city: 'Ulsan', country_code: 'KOR', latitude: 35.5567, longitude: 129.2589, surface: 'grass', opened_year: 2001 },
  { slug: 'seogwipo-world-cup-stadium', name: 'Jeju World Cup Stadium', city: 'Seogwipo', country_code: 'KOR', latitude: 33.2456, longitude: 126.5083, surface: 'grass', opened_year: 2001 },
  // Japón (10 estadios)
  { slug: 'international-stadium-yokohama', name: 'International Stadium Yokohama', city: 'Yokohama', country_code: 'JPN', latitude: 35.5106, longitude: 139.6064, surface: 'grass', opened_year: 1998 },
  { slug: 'saitama-stadium-2002', name: 'Saitama Stadium 2002', city: 'Saitama', country_code: 'JPN', latitude: 35.9036, longitude: 139.7172, surface: 'grass', opened_year: 2001 },
  { slug: 'shizuoka-stadium-ecopa', name: 'Shizuoka Stadium Ecopa', city: 'Fukuroi', country_code: 'JPN', latitude: 34.7367, longitude: 137.9839, surface: 'grass', opened_year: 2001 },
  { slug: 'osaka-nagai-stadium', name: 'Nagai Stadium', city: 'Osaka', country_code: 'JPN', latitude: 34.6147, longitude: 135.5189, surface: 'grass', opened_year: 1996 },
  { slug: 'sapporo-dome', name: 'Sapporo Dome', city: 'Sapporo', country_code: 'JPN', latitude: 43.0150, longitude: 141.4097, surface: 'hybrid', opened_year: 2001 },
  { slug: 'miyagi-stadium', name: 'Miyagi Stadium', city: 'Rifu', country_code: 'JPN', latitude: 38.3261, longitude: 140.9272, surface: 'grass', opened_year: 2000 },
  { slug: 'niigata-big-swan-stadium', name: 'Niigata Stadium Big Swan', city: 'Niigata', country_code: 'JPN', latitude: 37.8889, longitude: 139.0758, surface: 'grass', opened_year: 2001 },
  { slug: 'kobe-wing-stadium', name: 'Kobe Wing Stadium', city: 'Kobe', country_code: 'JPN', latitude: 34.6536, longitude: 135.1697, surface: 'grass', opened_year: 2001 },
  { slug: 'oita-stadium-bigeye', name: 'Oita Stadium Big Eye', city: 'Oita', country_code: 'JPN', latitude: 33.1986, longitude: 131.6575, surface: 'grass', opened_year: 2001 },
  { slug: 'ibaraki-kashima-stadium', name: 'Kashima Stadium', city: 'Kashima', country_code: 'JPN', latitude: 35.9925, longitude: 140.6406, surface: 'grass', opened_year: 1993 },
];

const REFEREES = [
  { full_name: 'Pierluigi Collina', nationality_code: 'ITA' },
  { full_name: 'Byron Moreno', nationality_code: 'ECU' },
  { full_name: 'Gamal Al-Ghandour', nationality_code: 'EGY' },
  { full_name: 'Hugh Dallas', nationality_code: 'SCO' },
  { full_name: 'Anders Frisk', nationality_code: 'SWE' },
  { full_name: 'Lubos Michel', nationality_code: 'SVK' },
  { full_name: 'Saad Mane', nationality_code: 'KWT' },
  { full_name: 'Ali Bujsaim', nationality_code: 'UAE' },
  { full_name: 'Felipe Ramos Rizo', nationality_code: 'MEX' },
  { full_name: 'Toru Kamikawa', nationality_code: 'JPN' },
  { full_name: 'Markus Merk', nationality_code: 'GER' },
  { full_name: 'Carlos Simon', nationality_code: 'BRA' },
  { full_name: 'Ángel Sánchez', nationality_code: 'ARG' },
  { full_name: 'Mourad Daami', nationality_code: 'TUN' },
  { full_name: 'Vítor Pereira', nationality_code: 'POR' },
  { full_name: 'Urs Meier', nationality_code: 'SUI' },
  { full_name: 'Kim Milton Nielsen', nationality_code: 'DEN' },
  { full_name: 'Brian Hall', nationality_code: 'USA' },
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
  // ── GRUPO A (FRA, SEN, URU, DEN) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '2002-05-31T20:30:00+09:00', home_code: 'FRA', away_code: 'SEN', home_score: 0, away_score: 1, venue_slug: 'seoul-world-cup-stadium', referee: 'Ali Bujsaim', attendance: 62561, notes: '★★★ INAUGURAL HISTÓRICA. SENEGAL TUMBA AL CAMPEÓN. Bouba Diop gol min 30. Francia sin Zidane (lesionado). Inicio del FRA-0 (3 partidos sin marcar)' },
  { match_number: 2,  stage: 'group', match_date: '2002-06-01T15:30:00+09:00', home_code: 'URU', away_code: 'DEN', home_score: 1, away_score: 2, venue_slug: 'ulsan-munsu-stadium', referee: 'Mourad Daami', attendance: 30157 },
  { match_number: 3,  stage: 'group', match_date: '2002-06-06T20:30:00+09:00', home_code: 'FRA', away_code: 'URU', home_score: 0, away_score: 0, venue_slug: 'busan-asiad-stadium', referee: 'Felipe Ramos Rizo', attendance: 38289, notes: 'ZIDANE NO JUEGA. THIERRY HENRY EXPULSADO al 25. FRA empata sin marcar' },
  { match_number: 4,  stage: 'group', match_date: '2002-06-06T18:00:00+09:00', home_code: 'DEN', away_code: 'SEN', home_score: 1, away_score: 1, venue_slug: 'daegu-world-cup-stadium', referee: 'Ángel Sánchez', attendance: 43500 },
  { match_number: 5,  stage: 'group', match_date: '2002-06-11T15:30:00+09:00', home_code: 'DEN', away_code: 'FRA', home_score: 2, away_score: 0, venue_slug: 'incheon-munhak-stadium', referee: 'Kim Milton Nielsen', attendance: 48100, notes: '★ FRA ELIMINADA EN GRUPOS sin marcar un gol. Tomasson y Rommedahl. Aimé Jacquet sucesor Lemerre. Zidane vuelve pero no rinde' },
  { match_number: 6,  stage: 'group', match_date: '2002-06-11T15:30:00+09:00', home_code: 'SEN', away_code: 'URU', home_score: 3, away_score: 3, venue_slug: 'suwon-world-cup-stadium', referee: 'Brian Hall', attendance: 33681, notes: 'Recoba hat-trick para URU. SEN remontó 3-0 y empató' },
  // ── GRUPO B (ESP, PAR, RSA, SVN) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '2002-06-02T15:30:00+09:00', home_code: 'PAR', away_code: 'RSA', home_score: 2, away_score: 2, venue_slug: 'busan-asiad-stadium', referee: 'Carlos Simon', attendance: 25186 },
  { match_number: 8,  stage: 'group', match_date: '2002-06-02T18:30:00+09:00', home_code: 'ESP', away_code: 'SVN', home_score: 3, away_score: 1, venue_slug: 'gwangju-world-cup-stadium', referee: 'Brian Hall', attendance: 28598, notes: 'Raúl gol min 44. Camacho seleccionador' },
  { match_number: 9,  stage: 'group', match_date: '2002-06-07T15:30:00+09:00', home_code: 'ESP', away_code: 'PAR', home_score: 3, away_score: 1, venue_slug: 'jeonju-world-cup-stadium', referee: 'Mourad Daami', attendance: 25477, notes: 'Morientes doblete. Hierro penalti' },
  { match_number: 10, stage: 'group', match_date: '2002-06-08T18:00:00+09:00', home_code: 'RSA', away_code: 'SVN', home_score: 1, away_score: 0, venue_slug: 'daegu-world-cup-stadium', referee: 'Ángel Sánchez', attendance: 47226 },
  { match_number: 11, stage: 'group', match_date: '2002-06-12T15:30:00+09:00', home_code: 'RSA', away_code: 'ESP', home_score: 2, away_score: 3, venue_slug: 'daejeon-world-cup-stadium', referee: 'Markus Merk', attendance: 31024, notes: 'ESP gana grupo con 3 victorias. Raúl y Mendieta' },
  { match_number: 12, stage: 'group', match_date: '2002-06-12T15:30:00+09:00', home_code: 'SVN', away_code: 'PAR', home_score: 1, away_score: 3, venue_slug: 'seogwipo-world-cup-stadium', referee: 'Saad Mane', attendance: 25000 },
  // ── GRUPO C (BRA, TUR, CHN, CRC) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '2002-06-03T18:30:00+09:00', home_code: 'BRA', away_code: 'TUR', home_score: 2, away_score: 1, venue_slug: 'ulsan-munsu-stadium', referee: 'Kim Young-joo', attendance: 33842, notes: 'Ronaldo, Rivaldo. POLÉMICA: Rivaldo simula golpe al rostro tras pelota en el muslo, TUR a 10' },
  { match_number: 14, stage: 'group', match_date: '2002-06-04T15:30:00+09:00', home_code: 'CHN', away_code: 'CRC', home_score: 0, away_score: 2, venue_slug: 'gwangju-world-cup-stadium', referee: 'Mark Shield', attendance: 27217, notes: 'CHN debut mundialista. Wanchope para CRC' },
  { match_number: 15, stage: 'group', match_date: '2002-06-08T15:30:00+09:00', home_code: 'BRA', away_code: 'CHN', home_score: 4, away_score: 0, venue_slug: 'seogwipo-world-cup-stadium', referee: 'Lubos Michel', attendance: 36750 },
  { match_number: 16, stage: 'group', match_date: '2002-06-09T15:30:00+09:00', home_code: 'CRC', away_code: 'TUR', home_score: 1, away_score: 1, venue_slug: 'incheon-munhak-stadium', referee: 'Vítor Pereira', attendance: 42681 },
  { match_number: 17, stage: 'group', match_date: '2002-06-13T15:30:00+09:00', home_code: 'CRC', away_code: 'BRA', home_score: 2, away_score: 5, venue_slug: 'suwon-world-cup-stadium', referee: 'Carlos Simon', attendance: 36750, notes: 'Ronaldo doblete' },
  { match_number: 18, stage: 'group', match_date: '2002-06-13T15:30:00+09:00', home_code: 'TUR', away_code: 'CHN', home_score: 3, away_score: 0, venue_slug: 'seoul-world-cup-stadium', referee: 'Anders Frisk', attendance: 43605 },
  // ── GRUPO D (KOR, USA, POR, POL) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '2002-06-04T18:30:00+09:00', home_code: 'KOR', away_code: 'POL', home_score: 2, away_score: 0, venue_slug: 'busan-asiad-stadium', referee: 'Mourad Daami', attendance: 50256, notes: 'KOR debut victorioso. Hwang Sun-hong y Yoo Sang-chul' },
  { match_number: 20, stage: 'group', match_date: '2002-06-05T20:30:00+09:00', home_code: 'USA', away_code: 'POR', home_score: 3, away_score: 2, venue_slug: 'suwon-world-cup-stadium', referee: 'Hugh Dallas', attendance: 37306, notes: '★ USA SORPRESA. McBride, Donovan. POR favorita desplomada al 4 min' },
  { match_number: 21, stage: 'group', match_date: '2002-06-10T15:30:00+09:00', home_code: 'KOR', away_code: 'USA', home_score: 1, away_score: 1, venue_slug: 'daegu-world-cup-stadium', referee: 'Urs Meier', attendance: 60778, notes: 'Ahn Jung-hwan empata. Mathis falla penalti USA' },
  { match_number: 22, stage: 'group', match_date: '2002-06-10T20:30:00+09:00', home_code: 'POR', away_code: 'POL', home_score: 4, away_score: 0, venue_slug: 'jeonju-world-cup-stadium', referee: 'Felipe Ramos Rizo', attendance: 31000, notes: 'Pauleta hat-trick' },
  { match_number: 23, stage: 'group', match_date: '2002-06-14T20:30:00+09:00', home_code: 'POR', away_code: 'KOR', home_score: 0, away_score: 1, venue_slug: 'incheon-munhak-stadium', referee: 'Ángel Sánchez', attendance: 50239, notes: '★ KOR ELIMINA A POR. Park Ji-sung gol. POR a 9 con dos rojas (Joao Pinto, Beto). KOR gana grupo' },
  { match_number: 24, stage: 'group', match_date: '2002-06-14T20:30:00+09:00', home_code: 'POL', away_code: 'USA', home_score: 3, away_score: 1, venue_slug: 'daejeon-world-cup-stadium', referee: 'Lubos Michel', attendance: 26482 },
  // ── GRUPO E (GER, IRL, CMR, KSA) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '2002-06-01T18:30:00+09:00', home_code: 'IRL', away_code: 'CMR', home_score: 1, away_score: 1, venue_slug: 'niigata-big-swan-stadium', referee: 'Toru Kamikawa', attendance: 33679 },
  { match_number: 26, stage: 'group', match_date: '2002-06-01T20:30:00+09:00', home_code: 'GER', away_code: 'KSA', home_score: 8, away_score: 0, venue_slug: 'sapporo-dome', referee: 'Carlos Simon', attendance: 32218, notes: '★ MAYOR PALIZA del Mundial. Klose hat-trick. KSA en su tercer Mundial recibe paliza historica' },
  { match_number: 27, stage: 'group', match_date: '2002-06-05T15:30:00+09:00', home_code: 'GER', away_code: 'IRL', home_score: 1, away_score: 1, venue_slug: 'ibaraki-kashima-stadium', referee: 'Anders Frisk', attendance: 35854, notes: 'IRL empate al 92. Robbie Keane' },
  { match_number: 28, stage: 'group', match_date: '2002-06-06T15:30:00+09:00', home_code: 'CMR', away_code: 'KSA', home_score: 1, away_score: 0, venue_slug: 'saitama-stadium-2002', referee: 'Toru Kamikawa', attendance: 52328 },
  { match_number: 29, stage: 'group', match_date: '2002-06-11T20:30:00+09:00', home_code: 'CMR', away_code: 'GER', home_score: 0, away_score: 2, venue_slug: 'shizuoka-stadium-ecopa', referee: 'Antonio Lopez Nieto', attendance: 47085 },
  { match_number: 30, stage: 'group', match_date: '2002-06-11T20:30:00+09:00', home_code: 'KSA', away_code: 'IRL', home_score: 0, away_score: 3, venue_slug: 'international-stadium-yokohama', referee: 'Ali Bujsaim', attendance: 66060 },
  // ── GRUPO F (SWE, ENG, ARG, NGA) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '2002-06-02T18:30:00+09:00', home_code: 'ARG', away_code: 'NGA', home_score: 1, away_score: 0, venue_slug: 'ibaraki-kashima-stadium', referee: 'Saad Mane', attendance: 34050, notes: 'Batistuta gol cabeza al min 63' },
  { match_number: 32, stage: 'group', match_date: '2002-06-02T20:30:00+09:00', home_code: 'ENG', away_code: 'SWE', home_score: 1, away_score: 1, venue_slug: 'saitama-stadium-2002', referee: 'Carlos Simon', attendance: 52271 },
  { match_number: 33, stage: 'group', match_date: '2002-06-07T20:30:00+09:00', home_code: 'SWE', away_code: 'NGA', home_score: 2, away_score: 1, venue_slug: 'kobe-wing-stadium', referee: 'René Ortubé', attendance: 36194 },
  { match_number: 34, stage: 'group', match_date: '2002-06-07T20:30:00+09:00', home_code: 'ARG', away_code: 'ENG', home_score: 0, away_score: 1, venue_slug: 'sapporo-dome', referee: 'Pierluigi Collina', attendance: 35927, notes: '★ ENG-ARG el más esperado. BECKHAM PENALTI VENGANZA. Tras la roja del 98 vs Simeone, ahora marca el gol decisivo. ARG eliminada en grupos' },
  { match_number: 35, stage: 'group', match_date: '2002-06-12T20:30:00+09:00', home_code: 'SWE', away_code: 'ARG', home_score: 1, away_score: 1, venue_slug: 'miyagi-stadium', referee: 'Ali Bujsaim', attendance: 45777 },
  { match_number: 36, stage: 'group', match_date: '2002-06-12T20:30:00+09:00', home_code: 'NGA', away_code: 'ENG', home_score: 0, away_score: 0, venue_slug: 'osaka-nagai-stadium', referee: 'Brian Hall', attendance: 44864 },
  // ── GRUPO G (MEX, ITA, CRO, ECU) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '2002-06-03T15:30:00+09:00', home_code: 'CRO', away_code: 'MEX', home_score: 0, away_score: 1, venue_slug: 'niigata-big-swan-stadium', referee: 'Felipe Ramos Rizo', attendance: 32239, notes: 'Cuauhtémoc Blanco penalti' },
  { match_number: 38, stage: 'group', match_date: '2002-06-03T20:30:00+09:00', home_code: 'ITA', away_code: 'ECU', home_score: 2, away_score: 0, venue_slug: 'sapporo-dome', referee: 'Anders Frisk', attendance: 31081, notes: 'ECU debut. Vieri doblete' },
  { match_number: 39, stage: 'group', match_date: '2002-06-08T20:30:00+09:00', home_code: 'ITA', away_code: 'CRO', home_score: 1, away_score: 2, venue_slug: 'ibaraki-kashima-stadium', referee: 'Graham Poll', attendance: 36472 },
  { match_number: 40, stage: 'group', match_date: '2002-06-09T18:30:00+09:00', home_code: 'MEX', away_code: 'ECU', home_score: 2, away_score: 1, venue_slug: 'miyagi-stadium', referee: 'René Ortubé', attendance: 45610 },
  { match_number: 41, stage: 'group', match_date: '2002-06-13T20:30:00+09:00', home_code: 'MEX', away_code: 'ITA', home_score: 1, away_score: 1, venue_slug: 'oita-stadium-bigeye', referee: 'Mourad Daami', attendance: 39291 },
  { match_number: 42, stage: 'group', match_date: '2002-06-13T20:30:00+09:00', home_code: 'CRO', away_code: 'ECU', home_score: 0, away_score: 1, venue_slug: 'international-stadium-yokohama', referee: 'Ángel Sánchez', attendance: 65862 },
  // ── GRUPO H (JPN, BEL, RUS, TUN) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '2002-06-04T20:30:00+09:00', home_code: 'JPN', away_code: 'BEL', home_score: 2, away_score: 2, venue_slug: 'saitama-stadium-2002', referee: 'Mark Shield', attendance: 55256, notes: 'JPN debut Mundial casero. Inamoto y Suzuki' },
  { match_number: 44, stage: 'group', match_date: '2002-06-05T18:30:00+09:00', home_code: 'RUS', away_code: 'TUN', home_score: 2, away_score: 0, venue_slug: 'kobe-wing-stadium', referee: 'Markus Merk', attendance: 30957 },
  { match_number: 45, stage: 'group', match_date: '2002-06-09T20:30:00+09:00', home_code: 'JPN', away_code: 'RUS', home_score: 1, away_score: 0, venue_slug: 'international-stadium-yokohama', referee: 'Markus Merk', attendance: 66108, notes: '★ PRIMERA VICTORIA DE JAPÓN en un Mundial. Inamoto gol. Disturbios en Moscú tras el partido' },
  { match_number: 46, stage: 'group', match_date: '2002-06-10T18:30:00+09:00', home_code: 'TUN', away_code: 'BEL', home_score: 1, away_score: 1, venue_slug: 'osaka-nagai-stadium', referee: 'Lubos Michel', attendance: 40719 },
  { match_number: 47, stage: 'group', match_date: '2002-06-14T15:30:00+09:00', home_code: 'TUN', away_code: 'JPN', home_score: 0, away_score: 2, venue_slug: 'osaka-nagai-stadium', referee: 'Carlos Simon', attendance: 45213, notes: 'JPN gana grupo. Morishima y Nakata' },
  { match_number: 48, stage: 'group', match_date: '2002-06-14T15:30:00+09:00', home_code: 'BEL', away_code: 'RUS', home_score: 3, away_score: 2, venue_slug: 'shizuoka-stadium-ecopa', referee: 'Toru Kamikawa', attendance: 46640 },
  // ── OCTAVOS ── 15-18 jun ─────────────────────────────────
  { match_number: 49, stage: 'r16', match_date: '2002-06-15T15:30:00+09:00', home_code: 'GER', away_code: 'PAR', home_score: 1, away_score: 0, venue_slug: 'seogwipo-world-cup-stadium', referee: 'Brian Hall', attendance: 25176, notes: 'Neuville gol min 88. GER avanza sin brillar' },
  { match_number: 50, stage: 'r16', match_date: '2002-06-15T20:30:00+09:00', home_code: 'DEN', away_code: 'ENG', home_score: 0, away_score: 3, venue_slug: 'niigata-big-swan-stadium', referee: 'Markus Merk', attendance: 40582, notes: 'Ferdinand, Owen, Heskey' },
  { match_number: 51, stage: 'r16', match_date: '2002-06-16T15:30:00+09:00', home_code: 'SWE', away_code: 'SEN', home_score: 1, away_score: 2, venue_slug: 'oita-stadium-bigeye', referee: 'Ubaldo Aquino', attendance: 39747, notes: '★ SEN A CUARTOS. Henri Camara gol oro en prórroga (golden goal). Senegal en cuartos en su debut' },
  { match_number: 52, stage: 'r16', match_date: '2002-06-16T20:30:00+09:00', home_code: 'ESP', away_code: 'IRL', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 2, venue_slug: 'suwon-world-cup-stadium', referee: 'Anders Frisk', attendance: 38926, notes: 'Penaltis. Casillas para 2. Morientes gol' },
  { match_number: 53, stage: 'r16', match_date: '2002-06-17T15:30:00+09:00', home_code: 'MEX', away_code: 'USA', home_score: 0, away_score: 2, venue_slug: 'jeonju-world-cup-stadium', referee: 'Vítor Pereira', attendance: 36380, notes: '★ MEX-USA octavos. McBride y Donovan. Marquez expulsado por cabezazo. USA a cuartos' },
  { match_number: 54, stage: 'r16', match_date: '2002-06-17T20:30:00+09:00', home_code: 'BRA', away_code: 'BEL', home_score: 2, away_score: 0, venue_slug: 'kobe-wing-stadium', referee: 'Hugh Dallas', attendance: 40440, notes: 'Rivaldo y Ronaldo. Gol de Wilmots anulado polemica' },
  { match_number: 55, stage: 'r16', match_date: '2002-06-18T15:30:00+09:00', home_code: 'JPN', away_code: 'TUR', home_score: 0, away_score: 1, venue_slug: 'miyagi-stadium', referee: 'Pierluigi Collina', attendance: 45666, notes: 'TUR avanza con gol Davala. JPN eliminada' },
  { match_number: 56, stage: 'r16', match_date: '2002-06-18T20:30:00+09:00', home_code: 'KOR', away_code: 'ITA', home_score: 2, away_score: 1, venue_slug: 'daejeon-world-cup-stadium', referee: 'Byron Moreno', attendance: 38588, notes: '★★★ "GOL DE ORO" Ahn Jung-hwan al 117. ITA-KOR el más polémico del Mundial. POLÉMICA BYRON MORENO: expulsión Totti, gol Damiano Tommasi anulado, falta en gol. Vieri marca primero. ITA eliminada' },
  // ── CUARTOS ── 21-22 jun ─────────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '2002-06-21T15:30:00+09:00', home_code: 'ENG', away_code: 'BRA', home_score: 1, away_score: 2, venue_slug: 'shizuoka-stadium-ecopa', referee: 'Felipe Ramos Rizo', attendance: 47436, notes: '★ Owen gol primero, Rivaldo empata 45, Ronaldinho falta directa min 50 (sobrevoló Seaman). RONALDINHO expulsado al 57. ENG con 10 vs 11 no remontó' },
  { match_number: 58, stage: 'qf', match_date: '2002-06-21T20:30:00+09:00', home_code: 'GER', away_code: 'USA', home_score: 1, away_score: 0, venue_slug: 'ulsan-munsu-stadium', referee: 'Hugh Dallas', attendance: 37337, notes: 'Ballack gol cabeza min 39. Polémico: Frings mano gol gol no concedido a USA' },
  { match_number: 59, stage: 'qf', match_date: '2002-06-22T15:30:00+09:00', home_code: 'ESP', away_code: 'KOR', home_score: 0, away_score: 0, home_score_pk: 3, away_score_pk: 5, venue_slug: 'gwangju-world-cup-stadium', referee: 'Gamal Al-Ghandour', attendance: 42114, notes: '★★★ ESCÁNDALO ARBITRAL. 2 goles ANULADOS A ESP (Morientes válido, Helguera fuera de juego dudoso). Penaltis 5-3 KOR. ESP eliminada. Camacho protesta' },
  { match_number: 60, stage: 'qf', match_date: '2002-06-22T20:30:00+09:00', home_code: 'SEN', away_code: 'TUR', home_score: 0, away_score: 1, venue_slug: 'osaka-nagai-stadium', referee: 'Óscar Ruiz', attendance: 44233, notes: 'Ilhan Mansiz gol de oro prórroga' },
  // ── SEMIS ── 25-26 jun ───────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '2002-06-25T20:30:00+09:00', home_code: 'GER', away_code: 'KOR', home_score: 1, away_score: 0, venue_slug: 'seoul-world-cup-stadium', referee: 'Urs Meier', attendance: 65256, notes: '★ KOR en su PRIMERA SEMIFINAL. Ballack gol min 75 (luego amarilla que le impide jugar final). KOR sin Park Ji-sung lesionado' },
  { match_number: 62, stage: 'sf', match_date: '2002-06-26T20:30:00+09:00', home_code: 'BRA', away_code: 'TUR', home_score: 1, away_score: 0, venue_slug: 'saitama-stadium-2002', referee: 'Kim Milton Nielsen', attendance: 61058, notes: 'Ronaldo gol al 49. BRA a su 4a final consecutiva' },
  // ── 3er PUESTO ── 29 jun ─────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '2002-06-29T20:00:00+09:00', home_code: 'KOR', away_code: 'TUR', home_score: 2, away_score: 3, venue_slug: 'daegu-world-cup-stadium', referee: 'Saad Mane', attendance: 63483, notes: '★ HAKAN ŞÜKÜR GOL MÁS RÁPIDO DEL MUNDIAL: 10.8 segundos. Récord vigente 24 años después. TUR tercera en su segundo Mundial' },
  // ── FINAL ── 30 jun ──────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '2002-06-30T20:00:00+09:00', home_code: 'GER', away_code: 'BRA', home_score: 0, away_score: 2, venue_slug: 'international-stadium-yokohama', referee: 'Pierluigi Collina', attendance: 69029, notes: '★★★ BRASIL PENTACAMPEÓN. DOBLETE DE RONALDO (min 67 tras error Kahn, min 79 cierre). Kahn elegido Balón de Oro Mundial 2002 (único portero en la historia). BRASIL 4 victorias seguidas en finales (1958, 1962, 1994, 2002). Cafú capitán. Felipão entrenador. Ronaldo Bota de Oro con 8 goles - redención de Francia 98' },
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

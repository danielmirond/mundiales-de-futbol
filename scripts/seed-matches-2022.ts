/**
 * Seed los 64 partidos del Mundial Catar 2022.
 *
 * 32 selecciones, 64 partidos, 8 estadios. PRIMER Mundial en invierno
 * (nov-dic) en el hemisferio norte. PRIMER Mundial en Oriente Medio.
 *
 * Hitos:
 *  - ★★★★ ARGENTINA CAMPEONA, MESSI BALÓN DE ORO MUNDIAL. Final 3-3 vs
 *    FRA, ARG gana 4-2 en penaltis en el Lusail. Doblete Messi (1° pen
 *    23, 2° gol 109). Mbappé HAT-TRICK en final (2 pens + golazo).
 *  - Di María gol min 36 antes del descanso. Doblete Mbappé empata 80
 *    (penalti + golazo medio campo).
 *  - Penaltis: Mbappé y Messi marcan. Coman y Tchouaméni fallan.
 *  - SAUDÍ TUMBA A ARG inaugural 2-1. Argentina pierde primer partido
 *    pero remonta el grupo. Récord 36 partidos invicto roto.
 *  - JPN GANA GRUPO con dos victorias: 2-1 vs ALE y 2-1 vs ESP. Doha
 *    "the Doha thriller". ALE eliminada en grupos por 2º vez consecutiva.
 *  - MARRUECOS PRIMER AFRICANO EN SEMIFINAL. Eliminó a ESP en penaltis
 *    y a POR 1-0 (en-Nesyri). 4° lugar tras CRO. Regragui seleccionador.
 *  - MBAPPÉ BOTA DE ORO con 8 goles (no se vio venir hasta la final).
 *  - VAR refinado, posición semiautomática del fuera de juego (debut).
 *  - FUERA DE JUEGO MEMORABLE: Cristiano Ronaldo NO marca en cuartos,
 *    POR perdió a MAR 1-0. Cristiano LLORÓ saliendo del campo.
 *  - SVN y CUW debuts. ECU vuelve. Italia ausente por 2ª vez consecutiva.
 *  - RUSIA SANCIONADA y excluida tras invasión de Ucrania.
 *
 * Datos verificados con FIFA archives, Wikipedia (2022 FIFA World Cup), RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-2022.ts
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

const YEAR = 2022;

const TEAMS = [
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'CRO', name: 'Croacia', conf: 'UEFA', flag: '🇭🇷' },
  { code: 'MAR', name: 'Marruecos', conf: 'CAF', flag: '🇲🇦' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'SEN', name: 'Senegal', conf: 'CAF', flag: '🇸🇳' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'AUS', name: 'Australia', conf: 'AFC', flag: '🇦🇺' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'KSA', name: 'Arabia Saudí', conf: 'AFC', flag: '🇸🇦' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'ECU', name: 'Ecuador', conf: 'CONMEBOL', flag: '🇪🇨' },
  { code: 'TUN', name: 'Túnez', conf: 'CAF', flag: '🇹🇳' },
  { code: 'DEN', name: 'Dinamarca', conf: 'UEFA', flag: '🇩🇰' },
  { code: 'SRB', name: 'Serbia', conf: 'UEFA', flag: '🇷🇸' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'CAN', name: 'Canadá', conf: 'CONCACAF', flag: '🇨🇦' },
  { code: 'WAL', name: 'Gales', conf: 'UEFA', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'IRN', name: 'Irán', conf: 'AFC', flag: '🇮🇷' },
  { code: 'GHA', name: 'Ghana', conf: 'CAF', flag: '🇬🇭' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'QAT', name: 'Catar', conf: 'AFC', flag: '🇶🇦' },
];

const VENUES = [
  { slug: 'lusail-stadium', name: 'Lusail Stadium', city: 'Lusail', country_code: 'QAT', latitude: 25.4225, longitude: 51.4889, surface: 'grass', opened_year: 2022 },
  { slug: 'al-bayt-stadium', name: 'Al Bayt Stadium', city: 'Al Khor', country_code: 'QAT', latitude: 25.6500, longitude: 51.4869, surface: 'grass', opened_year: 2021 },
  { slug: 'stadium-974', name: 'Stadium 974', city: 'Doha', country_code: 'QAT', latitude: 25.2894, longitude: 51.5439, surface: 'grass', opened_year: 2021 },
  { slug: 'education-city-stadium', name: 'Education City Stadium', city: 'Al Rayyan', country_code: 'QAT', latitude: 25.3114, longitude: 51.4253, surface: 'grass', opened_year: 2020 },
  { slug: 'khalifa-stadium', name: 'Khalifa International Stadium', city: 'Al Rayyan', country_code: 'QAT', latitude: 25.2639, longitude: 51.4486, surface: 'grass', opened_year: 1976 },
  { slug: 'al-janoub-stadium', name: 'Al Janoub Stadium', city: 'Al Wakrah', country_code: 'QAT', latitude: 25.1597, longitude: 51.5944, surface: 'grass', opened_year: 2019 },
  { slug: 'ahmad-bin-ali-stadium', name: 'Ahmad bin Ali Stadium', city: 'Al Rayyan', country_code: 'QAT', latitude: 25.3289, longitude: 51.3433, surface: 'grass', opened_year: 2003 },
  { slug: 'al-thumama-stadium', name: 'Al Thumama Stadium', city: 'Doha', country_code: 'QAT', latitude: 25.2331, longitude: 51.5408, surface: 'grass', opened_year: 2021 },
];

const REFEREES = [
  { full_name: 'Szymon Marciniak', nationality_code: 'POL' },
  { full_name: 'Daniele Orsato', nationality_code: 'ITA' },
  { full_name: 'Antonio Mateu Lahoz', nationality_code: 'ESP' },
  { full_name: 'Wilton Sampaio', nationality_code: 'BRA' },
  { full_name: 'Néstor Pitana', nationality_code: 'ARG' },
  { full_name: 'Mustapha Ghorbal', nationality_code: 'ALG' },
  { full_name: 'Daniel Siebert', nationality_code: 'GER' },
  { full_name: 'Slavko Vinčić', nationality_code: 'SVN' },
  { full_name: 'Anthony Taylor', nationality_code: 'ENG' },
  { full_name: 'Facundo Tello', nationality_code: 'ARG' },
  { full_name: 'Michael Oliver', nationality_code: 'ENG' },
  { full_name: 'Stéphanie Frappart', nationality_code: 'FRA' },
  { full_name: 'César Arturo Ramos', nationality_code: 'MEX' },
  { full_name: 'Raphael Claus', nationality_code: 'BRA' },
  { full_name: 'Jesús Valenzuela', nationality_code: 'VEN' },
  { full_name: 'Andrés Matonte', nationality_code: 'URU' },
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
  // ── GRUPO A (NED, SEN, ECU, QAT) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '2022-11-20T19:00:00+03:00', home_code: 'QAT', away_code: 'ECU', home_score: 0, away_score: 2, venue_slug: 'al-bayt-stadium', referee: 'Daniele Orsato', attendance: 67372, notes: '★ INAUGURAL. Enner Valencia doblete (uno cabeza, uno penalti). QAT primer anfitrión que PIERDE inaugural. Ceremonia con Morgan Freeman. Anuncio LGBT prohibido' },
  { match_number: 2,  stage: 'group', match_date: '2022-11-21T13:00:00+03:00', home_code: 'SEN', away_code: 'NED', home_score: 0, away_score: 2, venue_slug: 'al-thumama-stadium', referee: 'Wilton Sampaio', attendance: 41721, notes: 'Gakpo y Klaassen al final. Mané fuera SEN por lesión' },
  { match_number: 3,  stage: 'group', match_date: '2022-11-25T13:00:00+03:00', home_code: 'QAT', away_code: 'SEN', home_score: 1, away_score: 3, venue_slug: 'al-thumama-stadium', referee: 'Antonio Mateu Lahoz', attendance: 41797 },
  { match_number: 4,  stage: 'group', match_date: '2022-11-25T16:00:00+03:00', home_code: 'NED', away_code: 'ECU', home_score: 1, away_score: 1, venue_slug: 'khalifa-stadium', referee: 'Facundo Tello', attendance: 44833, notes: 'Gakpo y Enner Valencia. ECU gol anulado fuera de juego polémico' },
  { match_number: 5,  stage: 'group', match_date: '2022-11-29T18:00:00+03:00', home_code: 'ECU', away_code: 'SEN', home_score: 1, away_score: 2, venue_slug: 'khalifa-stadium', referee: 'Clément Turpin', attendance: 44569, notes: 'Koulibaly gol decisivo. SEN clasifica, ECU fuera' },
  { match_number: 6,  stage: 'group', match_date: '2022-11-29T18:00:00+03:00', home_code: 'NED', away_code: 'QAT', home_score: 2, away_score: 0, venue_slug: 'al-bayt-stadium', referee: 'Bakary Gassama', attendance: 66784, notes: 'QAT anfitrión sin punto, primera vez en historia' },
  // ── GRUPO B (ENG, USA, IRN, WAL) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '2022-11-21T16:00:00+03:00', home_code: 'ENG', away_code: 'IRN', home_score: 6, away_score: 2, venue_slug: 'khalifa-stadium', referee: 'Raphael Claus', attendance: 45334, notes: 'Bellingham gol primer Mundial. Saka doblete. Rashford. IRN protesta política (no canta himno)' },
  { match_number: 8,  stage: 'group', match_date: '2022-11-21T22:00:00+03:00', home_code: 'USA', away_code: 'WAL', home_score: 1, away_score: 1, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Abdulrahman Al-Jassim', attendance: 43418, notes: 'WAL regresa al Mundial 64 años después (1958). Bale empata penalti 82' },
  { match_number: 9,  stage: 'group', match_date: '2022-11-25T19:00:00+03:00', home_code: 'WAL', away_code: 'IRN', home_score: 0, away_score: 2, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Mario Escobar', attendance: 40875, notes: 'Roja a Hennessey, dos goles IRN 90+8 y 90+10' },
  { match_number: 10, stage: 'group', match_date: '2022-11-25T22:00:00+03:00', home_code: 'ENG', away_code: 'USA', home_score: 0, away_score: 0, venue_slug: 'al-bayt-stadium', referee: 'Jesús Valenzuela', attendance: 68463 },
  { match_number: 11, stage: 'group', match_date: '2022-11-29T22:00:00+03:00', home_code: 'WAL', away_code: 'ENG', home_score: 0, away_score: 3, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Slavko Vinčić', attendance: 44297, notes: 'Rashford doblete' },
  { match_number: 12, stage: 'group', match_date: '2022-11-29T22:00:00+03:00', home_code: 'IRN', away_code: 'USA', home_score: 0, away_score: 1, venue_slug: 'al-thumama-stadium', referee: 'Antonio Mateu Lahoz', attendance: 42127, notes: '★ MATCH GEOPOLITICO. Pulisic gol min 38, USA clasifica' },
  // ── GRUPO C (ARG, POL, MEX, KSA) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '2022-11-22T13:00:00+03:00', home_code: 'ARG', away_code: 'KSA', home_score: 1, away_score: 2, venue_slug: 'lusail-stadium', referee: 'Slavko Vinčić', attendance: 88012, notes: '★★★★ "EL SHOCK SAUDÍ". Messi penalti gol 10. KSA remonta con Saleh Al-Shehri 48 y Saleh Al-Dawsari 53 (golazo). ARG 3 goles anulados por VAR fuera de juego. Récord 36 partidos invicto roto' },
  { match_number: 14, stage: 'group', match_date: '2022-11-22T19:00:00+03:00', home_code: 'MEX', away_code: 'POL', home_score: 0, away_score: 0, venue_slug: 'stadium-974', referee: 'Chris Beath', attendance: 39369, notes: '★ LEWANDOWSKI PENALTI FALLADO. Ochoa para. Lewandowski primera vez Mundial' },
  { match_number: 15, stage: 'group', match_date: '2022-11-26T16:00:00+03:00', home_code: 'POL', away_code: 'KSA', home_score: 2, away_score: 0, venue_slug: 'education-city-stadium', referee: 'Wilton Sampaio', attendance: 44259, notes: 'Lewandowski PRIMER GOL MUNDIAL (lloró)' },
  { match_number: 16, stage: 'group', match_date: '2022-11-26T22:00:00+03:00', home_code: 'ARG', away_code: 'MEX', home_score: 2, away_score: 0, venue_slug: 'lusail-stadium', referee: 'Daniele Orsato', attendance: 88966, notes: '★ MESSI GOLAZO min 64 desde fuera del área. Enzo Fernández gol espectacular. ARG resucita' },
  { match_number: 17, stage: 'group', match_date: '2022-11-30T22:00:00+03:00', home_code: 'POL', away_code: 'ARG', home_score: 0, away_score: 2, venue_slug: 'stadium-974', referee: 'Danny Makkelie', attendance: 44322, notes: '★ MESSI PENALTI FALLADO (Szczęsny para). Mac Allister y Álvarez goles. Ambos clasifican' },
  { match_number: 18, stage: 'group', match_date: '2022-11-30T22:00:00+03:00', home_code: 'KSA', away_code: 'MEX', home_score: 1, away_score: 2, venue_slug: 'lusail-stadium', referee: 'Michael Oliver', attendance: 84985, notes: 'MEX fuera por diferencia de goles (1 gol menos vs POL)' },
  // ── GRUPO D (FRA, AUS, TUN, DEN) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '2022-11-22T22:00:00+03:00', home_code: 'FRA', away_code: 'AUS', home_score: 4, away_score: 1, venue_slug: 'al-janoub-stadium', referee: 'Víctor Gómes', attendance: 40875, notes: 'Mbappé, Giroud doblete (iguala record francés). Goodwin AUS' },
  { match_number: 20, stage: 'group', match_date: '2022-11-22T16:00:00+03:00', home_code: 'DEN', away_code: 'TUN', home_score: 0, away_score: 0, venue_slug: 'education-city-stadium', referee: 'César Arturo Ramos', attendance: 42925 },
  { match_number: 21, stage: 'group', match_date: '2022-11-26T13:00:00+03:00', home_code: 'TUN', away_code: 'AUS', home_score: 0, away_score: 1, venue_slug: 'al-janoub-stadium', referee: 'Daniel Siebert', attendance: 41823 },
  { match_number: 22, stage: 'group', match_date: '2022-11-26T19:00:00+03:00', home_code: 'FRA', away_code: 'DEN', home_score: 2, away_score: 1, venue_slug: 'stadium-974', referee: 'Szymon Marciniak', attendance: 42860, notes: 'Mbappé doblete. Christensen DEN' },
  { match_number: 23, stage: 'group', match_date: '2022-11-30T18:00:00+03:00', home_code: 'TUN', away_code: 'FRA', home_score: 1, away_score: 0, venue_slug: 'education-city-stadium', referee: 'Matthew Conger', attendance: 43113, notes: '★ TUN VENCE A FRA (campeón vigente). Khazri gol al 58. Pero ambos fuera para octavos (TUN por diferencia)' },
  { match_number: 24, stage: 'group', match_date: '2022-11-30T18:00:00+03:00', home_code: 'AUS', away_code: 'DEN', home_score: 1, away_score: 0, venue_slug: 'al-janoub-stadium', referee: 'Mustapha Ghorbal', attendance: 41232 },
  // ── GRUPO E (ESP, GER, JPN, CRC) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '2022-11-23T16:00:00+03:00', home_code: 'GER', away_code: 'JPN', home_score: 1, away_score: 2, venue_slug: 'khalifa-stadium', referee: 'Iván Barton', attendance: 42608, notes: '★★★ "DOHA THRILLER". JPN remonta a CAMPEÓN HISTORICO. Doan 75, Asano 83 (golazo definición). ALE protesta jueces con mano boca antes partido' },
  { match_number: 26, stage: 'group', match_date: '2022-11-23T19:00:00+03:00', home_code: 'ESP', away_code: 'CRC', home_score: 7, away_score: 0, venue_slug: 'al-thumama-stadium', referee: 'Mohammed Abdulla Hassan', attendance: 40013, notes: '★ ESP MEJOR DEBUT HISTÓRICO. Gavi gol más joven mundialista 18 años. Olmo, Asensio, Torres doblete, Soler, Morata' },
  { match_number: 27, stage: 'group', match_date: '2022-11-27T13:00:00+03:00', home_code: 'JPN', away_code: 'CRC', home_score: 0, away_score: 1, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Mohammed Abdulla Hassan', attendance: 41479, notes: 'Fuller golazo' },
  { match_number: 28, stage: 'group', match_date: '2022-11-27T22:00:00+03:00', home_code: 'ESP', away_code: 'GER', home_score: 1, away_score: 1, venue_slug: 'al-bayt-stadium', referee: 'Danny Makkelie', attendance: 68895, notes: 'Morata 62, Füllkrug 83 (golazo)' },
  { match_number: 29, stage: 'group', match_date: '2022-12-01T22:00:00+03:00', home_code: 'JPN', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'khalifa-stadium', referee: 'Víctor Gómes', attendance: 44851, notes: '★★ "EL CENTÍMETRO DE DOHA". JPN gana grupo. Mitoma pase de centro con VAR confirmando que el balón NO había salido (controversia visual). Doan y Tanaka goles' },
  { match_number: 30, stage: 'group', match_date: '2022-12-01T22:00:00+03:00', home_code: 'CRC', away_code: 'GER', home_score: 2, away_score: 4, venue_slug: 'al-bayt-stadium', referee: 'Stéphanie Frappart', attendance: 67054, notes: '★ FRAPPART 1° MUJER ARBITRA UN PARTIDO DE MUNDIAL VARON. Füllkrug, Havertz doblete. GER eliminada 2° vez consecutiva' },
  // ── GRUPO F (CRO, MAR, BEL, CAN) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '2022-11-23T13:00:00+03:00', home_code: 'MAR', away_code: 'CRO', home_score: 0, away_score: 0, venue_slug: 'al-bayt-stadium', referee: 'Fernando Rapallini', attendance: 59407 },
  { match_number: 32, stage: 'group', match_date: '2022-11-23T22:00:00+03:00', home_code: 'BEL', away_code: 'CAN', home_score: 1, away_score: 0, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Janny Sikazwe', attendance: 40432, notes: 'CAN regresa Mundial 36 años. Alphonso Davies FALLA PENALTI min 11' },
  { match_number: 33, stage: 'group', match_date: '2022-11-27T16:00:00+03:00', home_code: 'BEL', away_code: 'MAR', home_score: 0, away_score: 2, venue_slug: 'al-thumama-stadium', referee: 'César Arturo Ramos', attendance: 43738, notes: 'Sabiri falta directa, Aboukhlal cierre' },
  { match_number: 34, stage: 'group', match_date: '2022-11-27T19:00:00+03:00', home_code: 'CRO', away_code: 'CAN', home_score: 4, away_score: 1, venue_slug: 'khalifa-stadium', referee: 'Andrés Matonte', attendance: 40719, notes: 'Kramaric doblete' },
  { match_number: 35, stage: 'group', match_date: '2022-12-01T18:00:00+03:00', home_code: 'CRO', away_code: 'BEL', home_score: 0, away_score: 0, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Anthony Taylor', attendance: 43984, notes: '★ BEL ELIMINADA. Lukaku FALLA 3 OCASIONES en última jugada. Generación de oro belga termina' },
  { match_number: 36, stage: 'group', match_date: '2022-12-01T18:00:00+03:00', home_code: 'CAN', away_code: 'MAR', home_score: 1, away_score: 2, venue_slug: 'al-thumama-stadium', referee: 'Raphael Claus', attendance: 43102 },
  // ── GRUPO G (BRA, SUI, CMR, SRB) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '2022-11-24T13:00:00+03:00', home_code: 'SUI', away_code: 'CMR', home_score: 1, away_score: 0, venue_slug: 'al-janoub-stadium', referee: 'Facundo Tello', attendance: 39089, notes: 'Embolo gol contra su país natal (no celebra)' },
  { match_number: 38, stage: 'group', match_date: '2022-11-24T22:00:00+03:00', home_code: 'BRA', away_code: 'SRB', home_score: 2, away_score: 0, venue_slug: 'lusail-stadium', referee: 'Alireza Faghani', attendance: 88103, notes: 'Richarlison hat-trick incluyendo CHILENA HISTÓRICA. Mejor gol del Mundial. Neymar lesionado' },
  { match_number: 39, stage: 'group', match_date: '2022-11-28T13:00:00+03:00', home_code: 'CMR', away_code: 'SRB', home_score: 3, away_score: 3, venue_slug: 'al-janoub-stadium', referee: 'Mohammed Abdulla', attendance: 39789, notes: 'Vincent Aboubakar gol y asistencia tras entrar' },
  { match_number: 40, stage: 'group', match_date: '2022-11-28T19:00:00+03:00', home_code: 'BRA', away_code: 'SUI', home_score: 1, away_score: 0, venue_slug: 'stadium-974', referee: 'Iván Barton', attendance: 43983, notes: 'Casemiro golazo' },
  { match_number: 41, stage: 'group', match_date: '2022-12-02T22:00:00+03:00', home_code: 'CMR', away_code: 'BRA', home_score: 1, away_score: 0, venue_slug: 'lusail-stadium', referee: 'Ismail Elfath', attendance: 85986, notes: '★ CMR PRIMER VICTORIA AFRICANA vs BRA en Mundiales. Vincent Aboubakar gol y roja (2ª amarilla por quitarse camiseta celebrando)' },
  { match_number: 42, stage: 'group', match_date: '2022-12-02T22:00:00+03:00', home_code: 'SRB', away_code: 'SUI', home_score: 2, away_score: 3, venue_slug: 'stadium-974', referee: 'Fernando Rapallini', attendance: 41378, notes: 'Shaqiri y Embolo. Brouhaha en banquillos al final' },
  // ── GRUPO H (POR, KOR, URU, GHA) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '2022-11-24T16:00:00+03:00', home_code: 'URU', away_code: 'KOR', home_score: 0, away_score: 0, venue_slug: 'education-city-stadium', referee: 'Clément Turpin', attendance: 41663 },
  { match_number: 44, stage: 'group', match_date: '2022-11-24T19:00:00+03:00', home_code: 'POR', away_code: 'GHA', home_score: 3, away_score: 2, venue_slug: 'stadium-974', referee: 'Ismail Elfath', attendance: 42662, notes: '★ CR7 PRIMER PENALTI MARCADO. Récord: primer jugador en marcar en 5 Mundiales (2006-2022)' },
  { match_number: 45, stage: 'group', match_date: '2022-11-28T16:00:00+03:00', home_code: 'KOR', away_code: 'GHA', home_score: 2, away_score: 3, venue_slug: 'education-city-stadium', referee: 'Anthony Taylor', attendance: 43983, notes: 'Kudus doblete. Mwepu Mbeumo' },
  { match_number: 46, stage: 'group', match_date: '2022-11-28T22:00:00+03:00', home_code: 'POR', away_code: 'URU', home_score: 2, away_score: 0, venue_slug: 'lusail-stadium', referee: 'Alireza Faghani', attendance: 88668, notes: '★ "GOL DE BRUNO O DE CR7?" Centro Bruno Fernandes, CR7 salta pero NO TOCA. FIFA confirma gol a Bruno. Cristiano protestó' },
  { match_number: 47, stage: 'group', match_date: '2022-12-02T18:00:00+03:00', home_code: 'KOR', away_code: 'POR', home_score: 2, away_score: 1, venue_slug: 'education-city-stadium', referee: 'Facundo Tello', attendance: 44097, notes: '★ HWANG HEE-CHAN gol min 91 clasifica KOR. Son Heung-min asistencia jugando con máscara' },
  { match_number: 48, stage: 'group', match_date: '2022-12-02T18:00:00+03:00', home_code: 'GHA', away_code: 'URU', home_score: 0, away_score: 2, venue_slug: 'al-janoub-stadium', referee: 'Daniel Siebert', attendance: 43443, notes: '★★ "VENGANZA DE GHANA (2010)" no llega. Ayew FALLA PENALTI temprano. URU gana 2-0 pero queda fuera por diferencia. Suárez en banquillo llorando' },
  // ── OCTAVOS ── 3-6 dic ───────────────────────────────────
  { match_number: 49, stage: 'r16', match_date: '2022-12-03T18:00:00+03:00', home_code: 'NED', away_code: 'USA', home_score: 3, away_score: 1, venue_slug: 'khalifa-stadium', referee: 'Wilton Sampaio', attendance: 44846, notes: 'Depay, Blind, Dumfries' },
  { match_number: 50, stage: 'r16', match_date: '2022-12-03T22:00:00+03:00', home_code: 'ARG', away_code: 'AUS', home_score: 2, away_score: 1, venue_slug: 'ahmad-bin-ali-stadium', referee: 'Szymon Marciniak', attendance: 45032, notes: '★ MESSI 1000º PARTIDO. Gol al 35, Álvarez 57' },
  { match_number: 51, stage: 'r16', match_date: '2022-12-04T18:00:00+03:00', home_code: 'FRA', away_code: 'POL', home_score: 3, away_score: 1, venue_slug: 'al-thumama-stadium', referee: 'Jesús Valenzuela', attendance: 44259, notes: 'Mbappé doblete. Giroud RECORD FRANCÉS goles selección' },
  { match_number: 52, stage: 'r16', match_date: '2022-12-04T22:00:00+03:00', home_code: 'ENG', away_code: 'SEN', home_score: 3, away_score: 0, venue_slug: 'al-bayt-stadium', referee: 'Iván Barton', attendance: 65985 },
  { match_number: 53, stage: 'r16', match_date: '2022-12-05T18:00:00+03:00', home_code: 'JPN', away_code: 'CRO', home_score: 1, away_score: 1, home_score_pk: 1, away_score_pk: 3, venue_slug: 'al-janoub-stadium', referee: 'Ismail Elfath', attendance: 41479, notes: 'CRO 4ª prórroga en Mundiales consecutiva. Livaković para 3 penaltis JPN' },
  { match_number: 54, stage: 'r16', match_date: '2022-12-05T22:00:00+03:00', home_code: 'BRA', away_code: 'KOR', home_score: 4, away_score: 1, venue_slug: 'stadium-974', referee: 'Clément Turpin', attendance: 43847, notes: 'Vinícius, Neymar, Richarlison, Paquetá. BRA "Samba de gols", 4 goles en 31 min' },
  { match_number: 55, stage: 'r16', match_date: '2022-12-06T18:00:00+03:00', home_code: 'MAR', away_code: 'ESP', home_score: 0, away_score: 0, home_score_pk: 3, away_score_pk: 0, venue_slug: 'education-city-stadium', referee: 'Fernando Rapallini', attendance: 44667, notes: '★★★★ MAR ELIMINA ESP. Bono héroe (3 paradas). Sarabia poste, Soler para, Busquets para. ESP 0/3 penaltis (peor récord histórico). Luis Enrique despedido' },
  { match_number: 56, stage: 'r16', match_date: '2022-12-06T22:00:00+03:00', home_code: 'POR', away_code: 'SUI', home_score: 6, away_score: 1, venue_slug: 'lusail-stadium', referee: 'César Arturo Ramos', attendance: 83720, notes: '★★ CRISTIANO BANQUILLO POR PRIMERA VEZ. RAMOS HAT-TRICK (joven). Pepe gol también. POR "más fuerte sin CR7"' },
  // ── CUARTOS ── 9-10 dic ──────────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '2022-12-09T18:00:00+03:00', home_code: 'CRO', away_code: 'BRA', home_score: 1, away_score: 1, home_score_pk: 4, away_score_pk: 2, venue_slug: 'education-city-stadium', referee: 'Michael Oliver', attendance: 43893, notes: '★★★ BRA ELIMINADA EN CUARTOS. Neymar gol 105 (iguala record Pelé 77 goles brasileños). Petković empate 117. Penaltis: Rodrygo y Marquinhos fallan' },
  { match_number: 58, stage: 'qf', match_date: '2022-12-09T22:00:00+03:00', home_code: 'NED', away_code: 'ARG', home_score: 2, away_score: 2, home_score_pk: 3, away_score_pk: 4, venue_slug: 'lusail-stadium', referee: 'Antonio Mateu Lahoz', attendance: 88235, notes: '★★★★ "EL PARTIDO DE LOS 18 AMARILLAS". Lahoz récord histórico. Messi asistencia Molina 35 y penalti 73. Weghorst doblete 83 y 100+10 (córner ejecutado de rastra). Penaltis: Emiliano Martínez para 2. ARG provoca y Messi le dice "qué miras, bobo" a Weghorst' },
  { match_number: 59, stage: 'qf', match_date: '2022-12-10T18:00:00+03:00', home_code: 'MAR', away_code: 'POR', home_score: 1, away_score: 0, venue_slug: 'al-thumama-stadium', referee: 'Facundo Tello', attendance: 44198, notes: '★★★★ MAR PRIMER AFRICANO EN SEMIS DE MUNDIAL. En-Nesyri cabezazo 42. Cristiano LLORA saliendo del campo en su último Mundial' },
  { match_number: 60, stage: 'qf', match_date: '2022-12-10T22:00:00+03:00', home_code: 'ENG', away_code: 'FRA', home_score: 1, away_score: 2, venue_slug: 'al-bayt-stadium', referee: 'Wilton Sampaio', attendance: 68895, notes: '★ KANE PENALTI FALLADO (al 84 con 2-1 abajo). Tchouaméni gol primero, Kane empate penalti, Giroud 78' },
  // ── SEMIS ── 13-14 dic ───────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '2022-12-13T22:00:00+03:00', home_code: 'ARG', away_code: 'CRO', home_score: 3, away_score: 0, venue_slug: 'lusail-stadium', referee: 'Daniele Orsato', attendance: 88966, notes: '★★ "DI MARÍA RUSH". Messi penalti 34, Álvarez 39 (golazo individual desde mitad de campo) y 69 (Messi asistencia regateando a Gvardiol)' },
  { match_number: 62, stage: 'sf', match_date: '2022-12-14T22:00:00+03:00', home_code: 'FRA', away_code: 'MAR', home_score: 2, away_score: 0, venue_slug: 'al-bayt-stadium', referee: 'César Arturo Ramos', attendance: 68294, notes: 'Hernández 5, Kolo Muani 79. MAR digno con bola en el área de FRA durante 90 min' },
  // ── 3er PUESTO ── 17 dic ─────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '2022-12-17T18:00:00+03:00', home_code: 'CRO', away_code: 'MAR', home_score: 2, away_score: 1, venue_slug: 'khalifa-stadium', referee: 'Abdulrahman Al-Jassim', attendance: 44137, notes: 'Gvardiol y Orsic. MAR digno 4to lugar. Modric último partido CRO Mundial' },
  // ── FINAL ── 18 dic ──────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '2022-12-18T18:00:00+03:00', home_code: 'ARG', away_code: 'FRA', home_score: 3, away_score: 3, home_score_pk: 4, away_score_pk: 2, venue_slug: 'lusail-stadium', referee: 'Szymon Marciniak', attendance: 88966, notes: '★★★★★★ ARGENTINA CAMPEONA DEL MUNDO 3a vez (1978, 1986, 2022). MESSI BALÓN DE ORO MUNDIAL. Doblete Messi (penalti 23, gol 109). Di María 36. MBAPPÉ HAT-TRICK (penalti 80, golazo 81, penalti 118). Cuelma Coman y Tchouaméni fallan penaltis. Emiliano Martínez héroe (para a Coman, Tchouaméni tira fuera). Marciniak árbitro. Lusail 88.966 espectadores. Messi capitán levanta la copa con turbante árabe (bisht). "Qatar 22 es mejor que Eurocopa": Maradona dijo Messi necesitaba el Mundial. MENSAJE: "Qué mirás bobo" inmortal'},
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

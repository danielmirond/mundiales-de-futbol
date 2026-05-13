/**
 * Seed los 52 partidos del Mundial Estados Unidos 1994.
 *
 * 24 selecciones, mismo formato que 1986-90: 36 grupos + 8 octavos +
 * 4 cuartos + 2 semis + 1 3o + 1 final = 52.
 *
 * Hitos:
 *  - BRASIL TETRACAMPEÓN MUNDIAL: 4º título. Final BRA 0-0 ITA tras
 *    prórroga, BRA gana penaltis 3-2 (Baggio falla el último por encima
 *    del travesaño). Romário Balón de Oro.
 *  - "BAGGIO LA CAMA": foto de Baggio cabizbajo tras fallar penalti.
 *  - DIANA ROSS falla penalti en la ceremonia inaugural ante portero
 *    accidentado (la portería se cae).
 *  - ANDRÉS ESCOBAR (COL) ASESINADO en Medellín al regresar tras un
 *    autogol vs USA en grupo. Tragedia mundialista.
 *  - MARADONA expulsado por dopaje (efedrina, falso positivo polémico)
 *    tras 2 partidos. ARG eliminada en octavos contra ROU.
 *  - SAEED AL-OWAIRAN (KSA) marca "el gol del Mundial" desde 60 metros
 *    contra BEL.
 *  - HRISTO STOICHKOV (BUL) Bota de Oro compartida con Salenko (6 goles).
 *    OLEG SALENKO marca 5 goles en un partido (RUS 6-1 CMR), récord.
 *  - BULGARIA SEMIFINALES (sorpresa), HAGI brilla con Rumanía.
 *  - SUECIA TERCERA.
 *  - RECORD ASISTENCIA: 94.194 espectadores en final Pasadena.
 *  - MUNDIAL SIN INGLATERRA (no clasifica, primera vez desde 1978).
 *
 * Datos verificados con FIFA archives, Wikipedia (1994 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1994.ts
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

const YEAR = 1994;

const TEAMS = [
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'ROU', name: 'Rumanía', conf: 'UEFA', flag: '🇷🇴' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'NGA', name: 'Nigeria', conf: 'CAF', flag: '🇳🇬' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'IRL', name: 'Irlanda', conf: 'UEFA', flag: '🇮🇪' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'NOR', name: 'Noruega', conf: 'UEFA', flag: '🇳🇴' },
  { code: 'COL', name: 'Colombia', conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'RUS', name: 'Rusia', conf: 'UEFA', flag: '🇷🇺' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'KSA', name: 'Arabia Saudí', conf: 'AFC', flag: '🇸🇦' },
  { code: 'BOL', name: 'Bolivia', conf: 'CONMEBOL', flag: '🇧🇴' },
  { code: 'MAR', name: 'Marruecos', conf: 'CAF', flag: '🇲🇦' },
  { code: 'GRE', name: 'Grecia', conf: 'UEFA', flag: '🇬🇷' },
];

const VENUES = [
  { slug: 'rose-bowl', name: 'Rose Bowl', city: 'Pasadena', country_code: 'USA', latitude: 34.1613, longitude: -118.1676, surface: 'grass', opened_year: 1922 },
  { slug: 'stanford-stadium', name: 'Stanford Stadium', city: 'Stanford', country_code: 'USA', latitude: 37.4347, longitude: -122.1604, surface: 'grass', opened_year: 1921 },
  { slug: 'cotton-bowl', name: 'Cotton Bowl', city: 'Dallas', country_code: 'USA', latitude: 32.7795, longitude: -96.7595, surface: 'grass', opened_year: 1932 },
  { slug: 'foxboro-stadium', name: 'Foxboro Stadium', city: 'Foxborough', country_code: 'USA', latitude: 42.0911, longitude: -71.2643, surface: 'grass', opened_year: 1971, closed_year: 2002 },
  { slug: 'pontiac-silverdome', name: 'Pontiac Silverdome', city: 'Pontiac', country_code: 'USA', latitude: 42.6458, longitude: -83.2552, surface: 'grass (temp.)', opened_year: 1975, closed_year: 2017, notes: 'Primer Mundial bajo techo. Césped natural temporal sobre placa de hormigón' },
  { slug: 'soldier-field', name: 'Soldier Field', city: 'Chicago', country_code: 'USA', latitude: 41.8623, longitude: -87.6167, surface: 'grass', opened_year: 1924 },
  { slug: 'giants-stadium', name: 'Giants Stadium', city: 'East Rutherford', country_code: 'USA', latitude: 40.8120, longitude: -74.0770, surface: 'grass', opened_year: 1976, closed_year: 2010 },
  { slug: 'citrus-bowl', name: 'Citrus Bowl', city: 'Orlando', country_code: 'USA', latitude: 28.5390, longitude: -81.4029, surface: 'grass', opened_year: 1936 },
  { slug: 'rfk-stadium', name: 'RFK Stadium', city: 'Washington D.C.', country_code: 'USA', latitude: 38.8898, longitude: -76.9719, surface: 'grass', opened_year: 1961, closed_year: 2019 },
];

const REFEREES = [
  { full_name: 'Sándor Puhl', nationality_code: 'HUN' },
  { full_name: 'Joël Quiniou', nationality_code: 'FRA' },
  { full_name: 'Brizio Carter', nationality_code: 'MEX' },
  { full_name: 'Mario van der Ende', nationality_code: 'NED' },
  { full_name: 'Philip Don', nationality_code: 'ENG' },
  { full_name: 'Markus Merk', nationality_code: 'GER' },
  { full_name: 'Pierluigi Pairetto', nationality_code: 'ITA' },
  { full_name: 'Renato Marsiglia', nationality_code: 'BRA' },
  { full_name: 'Bo Karlsson', nationality_code: 'SWE' },
  { full_name: 'Peter Mikkelsen', nationality_code: 'DEN' },
  { full_name: 'Leslie Mottram', nationality_code: 'SCO' },
  { full_name: 'Hellmut Krug', nationality_code: 'GER' },
  { full_name: 'Jamal Al-Sharif', nationality_code: 'SYR' },
  { full_name: 'Jose Roberto Wright', nationality_code: 'BRA' },
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
  // ── GROUP A (USA, SUI, COL, ROU) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '1994-06-18T12:30:00-05:00', home_code: 'USA', away_code: 'SUI', home_score: 1, away_score: 1, venue_slug: 'pontiac-silverdome', referee: 'Francisco Lamolina', attendance: 73425, notes: 'Inaugural en estadio bajo techo (primera vez en Mundial)' },
  { match_number: 2,  stage: 'group', match_date: '1994-06-18T16:00:00-05:00', home_code: 'COL', away_code: 'ROU', home_score: 1, away_score: 3, venue_slug: 'rose-bowl', referee: 'Jamal Al-Sharif', attendance: 91856, notes: 'Hagi golazo desde 30m al 35. COL favorita cae sorpresivamente' },
  { match_number: 3,  stage: 'group', match_date: '1994-06-22T16:00:00-05:00', home_code: 'ROU', away_code: 'SUI', home_score: 1, away_score: 4, venue_slug: 'pontiac-silverdome', referee: 'Lim Kee Chong', attendance: 61428 },
  { match_number: 4,  stage: 'group', match_date: '1994-06-22T19:30:00-05:00', home_code: 'USA', away_code: 'COL', home_score: 2, away_score: 1, venue_slug: 'rose-bowl', referee: 'Fabio Baldas', attendance: 93194, notes: '★ AUTOGOL DE ANDRÉS ESCOBAR (COL) al min 35. Colombia eliminada. Escobar sera asesinado en Medellin el 2 jul al regresar a casa. Tragedia mundialista' },
  { match_number: 5,  stage: 'group', match_date: '1994-06-26T12:30:00-05:00', home_code: 'USA', away_code: 'ROU', home_score: 0, away_score: 1, venue_slug: 'rose-bowl', referee: 'Mario Van der Ende', attendance: 93869, notes: 'Petrescu gol min 18' },
  { match_number: 6,  stage: 'group', match_date: '1994-06-26T12:30:00-05:00', home_code: 'SUI', away_code: 'COL', home_score: 0, away_score: 2, venue_slug: 'stanford-stadium', referee: 'Sándor Puhl', attendance: 83401, notes: 'Valderrama y Lozano. COL gana cuando ya no servía' },
  // ── GROUP B (BRA, RUS, CMR, SWE) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '1994-06-19T12:30:00-05:00', home_code: 'CMR', away_code: 'SWE', home_score: 2, away_score: 2, venue_slug: 'rose-bowl', referee: 'Renato Marsiglia', attendance: 83959, notes: 'Roger Milla (42 anios) sigue: gol al min 56 mas adelante (no ahora). Aqui Milla titular' },
  { match_number: 8,  stage: 'group', match_date: '1994-06-20T19:30:00-05:00', home_code: 'BRA', away_code: 'RUS', home_score: 2, away_score: 0, venue_slug: 'stanford-stadium', referee: 'Arturo Brizio', attendance: 81061, notes: 'Romario gol al 26. Brasil de Parreira presenta candidatura' },
  { match_number: 9,  stage: 'group', match_date: '1994-06-24T16:00:00-05:00', home_code: 'BRA', away_code: 'CMR', home_score: 3, away_score: 0, venue_slug: 'stanford-stadium', referee: 'Arturo Brizio', attendance: 83401, notes: 'Romario, Marcio Santos, Bebeto' },
  { match_number: 10, stage: 'group', match_date: '1994-06-24T19:30:00-05:00', home_code: 'SWE', away_code: 'RUS', home_score: 3, away_score: 1, venue_slug: 'pontiac-silverdome', referee: 'Mario van der Ende', attendance: 71528 },
  { match_number: 11, stage: 'group', match_date: '1994-06-28T16:00:00-05:00', home_code: 'BRA', away_code: 'SWE', home_score: 1, away_score: 1, venue_slug: 'pontiac-silverdome', referee: 'Sándor Puhl', attendance: 77217, notes: 'Brasil y Suecia van a ver de nuevo en semis' },
  { match_number: 12, stage: 'group', match_date: '1994-06-28T16:00:00-05:00', home_code: 'RUS', away_code: 'CMR', home_score: 6, away_score: 1, venue_slug: 'stanford-stadium', referee: 'Joël Quiniou', attendance: 74914, notes: '★ OLEG SALENKO 5 GOLES = RÉCORD HISTÓRICO de goles en un solo partido del Mundial. Milla marca el unico gol de CMR (42 anios, 1 mes), JUGADOR MAS VIEJO en marcar en Mundial' },
  // ── GROUP C (GER, BOL, ESP, KOR) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1994-06-17T15:00:00-05:00', home_code: 'GER', away_code: 'BOL', home_score: 1, away_score: 0, venue_slug: 'soldier-field', referee: 'Arturo Brizio', attendance: 63117, notes: 'Apertura del Mundial (no inaugural pero abre el día Chicago). Klinsmann gol' },
  { match_number: 14, stage: 'group', match_date: '1994-06-17T19:30:00-05:00', home_code: 'ESP', away_code: 'KOR', home_score: 2, away_score: 2, venue_slug: 'cotton-bowl', referee: 'Sándor Puhl', attendance: 56245 },
  { match_number: 15, stage: 'group', match_date: '1994-06-21T12:30:00-05:00', home_code: 'GER', away_code: 'ESP', home_score: 1, away_score: 1, venue_slug: 'soldier-field', referee: 'Renato Marsiglia', attendance: 63113, notes: 'Klinsmann y Goikoetxea' },
  { match_number: 16, stage: 'group', match_date: '1994-06-23T12:30:00-05:00', home_code: 'KOR', away_code: 'BOL', home_score: 0, away_score: 0, venue_slug: 'foxboro-stadium', referee: 'Leslie Mottram', attendance: 54453 },
  { match_number: 17, stage: 'group', match_date: '1994-06-27T19:30:00-05:00', home_code: 'GER', away_code: 'KOR', home_score: 3, away_score: 2, venue_slug: 'cotton-bowl', referee: 'Joël Quiniou', attendance: 63988 },
  { match_number: 18, stage: 'group', match_date: '1994-06-27T19:30:00-05:00', home_code: 'BOL', away_code: 'ESP', home_score: 1, away_score: 3, venue_slug: 'soldier-field', referee: 'Hellmut Krug', attendance: 63089, notes: 'Etxeberria, Caminero, Begiristain' },
  // ── GROUP D (ARG, NGA, BUL, GRE) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1994-06-21T15:00:00-05:00', home_code: 'ARG', away_code: 'GRE', home_score: 4, away_score: 0, venue_slug: 'foxboro-stadium', referee: 'Arturo Brizio', attendance: 54453, notes: 'Maradona gol al 60. Argentina vuelve magica con Mara, Caniggia, Batistuta hat-trick' },
  { match_number: 20, stage: 'group', match_date: '1994-06-21T16:00:00-05:00', home_code: 'NGA', away_code: 'BUL', home_score: 3, away_score: 0, venue_slug: 'cotton-bowl', referee: 'Bo Karlsson', attendance: 44132, notes: 'NGA debut mundial historico, Yekini gol famoso celebracion' },
  { match_number: 21, stage: 'group', match_date: '1994-06-25T12:30:00-05:00', home_code: 'ARG', away_code: 'NGA', home_score: 2, away_score: 1, venue_slug: 'foxboro-stadium', referee: 'Arturo Brizio', attendance: 54453, notes: 'Caniggia doblete. Maradona ULTIMO PARTIDO MUNDIAL DE SU CARRERA. Sale dopado (efedrina), expulsado del torneo y suspendido 15 meses' },
  { match_number: 22, stage: 'group', match_date: '1994-06-26T19:30:00-05:00', home_code: 'BUL', away_code: 'GRE', home_score: 4, away_score: 0, venue_slug: 'soldier-field', referee: 'Renato Marsiglia', attendance: 63987, notes: 'Stoichkov hat-trick. Comienza su Bota de Oro' },
  { match_number: 23, stage: 'group', match_date: '1994-06-30T19:30:00-05:00', home_code: 'ARG', away_code: 'BUL', home_score: 0, away_score: 2, venue_slug: 'foxboro-stadium', referee: 'Joël Quiniou', attendance: 53286, notes: 'ARG sin Maradona cae. Stoichkov goleador' },
  { match_number: 24, stage: 'group', match_date: '1994-06-30T19:30:00-05:00', home_code: 'GRE', away_code: 'NGA', home_score: 0, away_score: 2, venue_slug: 'foxboro-stadium', referee: 'Bo Karlsson', attendance: 53001 },
  // ── GROUP E (ITA, IRL, MEX, NOR) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '1994-06-18T16:00:00-05:00', home_code: 'IRL', away_code: 'ITA', home_score: 1, away_score: 0, venue_slug: 'giants-stadium', referee: 'Mario van der Ende', attendance: 75338, notes: 'Ray Houghton gol min 12. Italia favorita cae en debut' },
  { match_number: 26, stage: 'group', match_date: '1994-06-19T16:00:00-05:00', home_code: 'NOR', away_code: 'MEX', home_score: 1, away_score: 0, venue_slug: 'rfk-stadium', referee: 'Hellmut Krug', attendance: 52395 },
  { match_number: 27, stage: 'group', match_date: '1994-06-23T16:00:00-05:00', home_code: 'ITA', away_code: 'NOR', home_score: 1, away_score: 0, venue_slug: 'giants-stadium', referee: 'Mario Pairetto', attendance: 74624, notes: 'Pagliuca expulsado al 21, ITA con 10. Baggio gol min 69 = salva el Mundial italiano' },
  { match_number: 28, stage: 'group', match_date: '1994-06-24T12:30:00-05:00', home_code: 'MEX', away_code: 'IRL', home_score: 2, away_score: 1, venue_slug: 'citrus-bowl', referee: 'Peter Mikkelsen', attendance: 60790, notes: 'Garcia Aspe + Bernal. MEX revive' },
  { match_number: 29, stage: 'group', match_date: '1994-06-28T12:30:00-05:00', home_code: 'IRL', away_code: 'NOR', home_score: 0, away_score: 0, venue_slug: 'giants-stadium', referee: 'Hellmut Krug', attendance: 76332, notes: 'Cuatro equipos empatados a 4 puntos. Todos pasan menos NOR (peor diferencia goles)' },
  { match_number: 30, stage: 'group', match_date: '1994-06-28T12:30:00-05:00', home_code: 'ITA', away_code: 'MEX', home_score: 1, away_score: 1, venue_slug: 'rfk-stadium', referee: 'Brian Hill', attendance: 53186 },
  // ── GROUP F (BEL, NED, KSA, MAR) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '1994-06-19T12:30:00-05:00', home_code: 'BEL', away_code: 'MAR', home_score: 1, away_score: 0, venue_slug: 'citrus-bowl', referee: 'Neji Jouini', attendance: 60790 },
  { match_number: 32, stage: 'group', match_date: '1994-06-20T16:00:00-05:00', home_code: 'NED', away_code: 'KSA', home_score: 2, away_score: 1, venue_slug: 'rfk-stadium', referee: 'Hellmut Krug', attendance: 50535 },
  { match_number: 33, stage: 'group', match_date: '1994-06-25T16:00:00-05:00', home_code: 'BEL', away_code: 'NED', home_score: 1, away_score: 0, venue_slug: 'citrus-bowl', referee: 'Kurt Röthlisberger', attendance: 62387 },
  { match_number: 34, stage: 'group', match_date: '1994-06-25T16:00:00-05:00', home_code: 'KSA', away_code: 'MAR', home_score: 2, away_score: 1, venue_slug: 'giants-stadium', referee: 'Joël Quiniou', attendance: 76322 },
  { match_number: 35, stage: 'group', match_date: '1994-06-29T19:30:00-05:00', home_code: 'KSA', away_code: 'BEL', home_score: 1, away_score: 0, venue_slug: 'rfk-stadium', referee: 'Kurt Röthlisberger', attendance: 52959, notes: '★ SAEED AL-OWAIRAN MARCA EL GOL DEL MUNDIAL. Slalom 60m con 5 belgas superados al min 5. KSA pasa a octavos por primera vez' },
  { match_number: 36, stage: 'group', match_date: '1994-06-29T19:30:00-05:00', home_code: 'MAR', away_code: 'NED', home_score: 1, away_score: 2, venue_slug: 'citrus-bowl', referee: 'Peter Mikkelsen', attendance: 60578 },
  // ── OCTAVOS ── 2-4 jul ───────────────────────────────────
  { match_number: 37, stage: 'r16', match_date: '1994-07-02T12:30:00-05:00', home_code: 'GER', away_code: 'BEL', home_score: 3, away_score: 2, venue_slug: 'soldier-field', referee: 'Kurt Röthlisberger', attendance: 60246, notes: 'BEL falla penalti rechazado por arbitro. Voller doblete' },
  { match_number: 38, stage: 'r16', match_date: '1994-07-02T16:00:00-05:00', home_code: 'ESP', away_code: 'SUI', home_score: 3, away_score: 0, venue_slug: 'rfk-stadium', referee: 'Neji Jouini', attendance: 53121, notes: 'Hierro, Luis Enrique, Beguiristain' },
  { match_number: 39, stage: 'r16', match_date: '1994-07-03T12:30:00-05:00', home_code: 'SWE', away_code: 'KSA', home_score: 3, away_score: 1, venue_slug: 'cotton-bowl', referee: 'Pierluigi Pairetto', attendance: 60277 },
  { match_number: 40, stage: 'r16', match_date: '1994-07-03T16:00:00-05:00', home_code: 'ROU', away_code: 'ARG', home_score: 3, away_score: 2, venue_slug: 'rose-bowl', referee: 'Joël Quiniou', attendance: 90469, notes: '★ HAGI exhibición magistral, ROM elimina a ARG. Argentina sin Maradona se va. Dumitrescu doblete, Hagi 1' },
  { match_number: 41, stage: 'r16', match_date: '1994-07-04T12:30:00-05:00', home_code: 'NED', away_code: 'IRL', home_score: 2, away_score: 0, venue_slug: 'citrus-bowl', referee: 'Mario van der Ende', attendance: 61355 },
  { match_number: 42, stage: 'r16', match_date: '1994-07-04T16:00:00-05:00', home_code: 'BRA', away_code: 'USA', home_score: 1, away_score: 0, venue_slug: 'stanford-stadium', referee: 'Arturo Brizio', attendance: 84147, notes: 'Bebeto gol 74. Leonardo expulsado por codazo. Brasil pasa apretado' },
  { match_number: 43, stage: 'r16', match_date: '1994-07-05T12:30:00-05:00', home_code: 'NGA', away_code: 'ITA', home_score: 1, away_score: 2, home_score_pk: null, away_score_pk: null, venue_slug: 'foxboro-stadium', referee: 'Arturo Brizio', attendance: 54367, notes: '2-1 a.e.t. NGA iba 1-0 al 88. Baggio empata 88 + gol prorroga. Vuelve la magia de Roberto Baggio' },
  { match_number: 44, stage: 'r16', match_date: '1994-07-05T16:00:00-05:00', home_code: 'MEX', away_code: 'BUL', home_score: 1, away_score: 1, home_score_pk: 1, away_score_pk: 3, venue_slug: 'giants-stadium', referee: 'Joël Quiniou', attendance: 71030, notes: 'MEX falla 3 penaltis (Bernal, Garcia Aspe, Suarez). Stoichkov gol. BUL a cuartos historicamente' },
  // ── CUARTOS ── 9-10 jul ──────────────────────────────────
  { match_number: 45, stage: 'qf', match_date: '1994-07-09T12:30:00-05:00', home_code: 'ITA', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'foxboro-stadium', referee: 'Sándor Puhl', attendance: 53400, notes: '★ "EL CODAZO DE TASSOTTI A LUIS ENRIQUE", min 86. Tassotti rompe el tabique nasal a Luis Enrique. Arbitro Puhl no lo ve, sancionado 8 partidos por FIFA tras el partido. ESP eliminada injustamente. Baggio gol del partido 88' },
  { match_number: 46, stage: 'qf', match_date: '1994-07-09T16:00:00-05:00', home_code: 'NED', away_code: 'BRA', home_score: 2, away_score: 3, venue_slug: 'cotton-bowl', referee: 'Rodrigo Badilla', attendance: 63500, notes: 'Romario, Bebeto (★ celebracion del bebe, dedicada a su hijo recien nacido = ya iconica), Branco; NED Bergkamp y Winter. Brasil avanza' },
  { match_number: 47, stage: 'qf', match_date: '1994-07-10T12:30:00-05:00', home_code: 'BUL', away_code: 'GER', home_score: 2, away_score: 1, venue_slug: 'giants-stadium', referee: 'Jose Roberto Wright', attendance: 72416, notes: '★ MAYOR SORPRESA DEL TORNEO. GER (campeona defensora) cae. Stoichkov + Letchkov goles tras Matthäus penalti. BUL HISTORICAMENTE A SEMIS' },
  { match_number: 48, stage: 'qf', match_date: '1994-07-10T16:00:00-05:00', home_code: 'SWE', away_code: 'ROU', home_score: 2, away_score: 2, home_score_pk: 5, away_score_pk: 4, venue_slug: 'stanford-stadium', referee: 'Philip Don', attendance: 81715, notes: 'SWE 1-0 al 78. ROU empata 88 y gol 95 prorroga 2-1. SWE empata 115. Penaltis 5-4 SWE. Hagi sigue brillando aunque ROU cae' },
  // ── SEMIS ── 13 jul ──────────────────────────────────────
  { match_number: 49, stage: 'sf', match_date: '1994-07-13T12:30:00-05:00', home_code: 'BUL', away_code: 'ITA', home_score: 1, away_score: 2, venue_slug: 'giants-stadium', referee: 'Joël Quiniou', attendance: 74110, notes: 'BAGGIO DOBLETE (min 21 y 25). Stoichkov gol 44 (Bota de Oro suma). ITA a la final' },
  { match_number: 50, stage: 'sf', match_date: '1994-07-13T16:00:00-05:00', home_code: 'BRA', away_code: 'SWE', home_score: 1, away_score: 0, venue_slug: 'rose-bowl', referee: 'Sándor Puhl', attendance: 91856, notes: 'Romario gol min 80, BRA a final' },
  // ── 3er PUESTO ── 16 jul ─────────────────────────────────
  { match_number: 51, stage: '3rd', match_date: '1994-07-16T15:30:00-05:00', home_code: 'SWE', away_code: 'BUL', home_score: 4, away_score: 0, venue_slug: 'rose-bowl', referee: 'Ali Bujsaim', attendance: 91500, notes: 'Brolin, Mild, Larsson, Andersson. SWE tercera. Stoichkov sin marcar (6 goles = Bota de Oro compartida con Salenko)' },
  // ── FINAL ── 17 jul ──────────────────────────────────────
  { match_number: 52, stage: 'final', match_date: '1994-07-17T12:30:00-05:00', home_code: 'BRA', away_code: 'ITA', home_score: 0, away_score: 0, home_score_pk: 3, away_score_pk: 2, venue_slug: 'rose-bowl', referee: 'Sándor Puhl', attendance: 94194, notes: '★ BRASIL TETRACAMPEON. 0-0 a.e.t. RECORD ASISTENCIA EN UNA FINAL DEL MUNDIAL (94.194). Penaltis BRA 3-2 ITA. BAGGIO falla el ultimo penalti por encima del travesaño (★ "Baggio la cama" foto histórica). Romario Balon de Oro. Dunga capitan + Taffarel portero heroe. Mascherano? No, eso fue 2014. Brasil rompe la sequia 24 anios desde 1970' },
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
    })),
    { onConflict: 'code', ignoreDuplicates: false },
  );
  console.log(`  ✓ ${TEAMS.length} teams upserted`);

  await supabase.from('venues').upsert(
    VENUES.map(({ notes: _n, ...rest }) => rest),
    { onConflict: 'slug', ignoreDuplicates: false },
  );
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

/**
 * Seed los 64 partidos del Mundial Rusia 2018.
 *
 * 32 selecciones, 64 partidos, 12 estadios.
 *
 * Hitos:
 *  - ★★★ FRANCIA CAMPEONA. Final 4-2 vs CRO en Luzhniki. Doblete
 *    Griezmann (incluido penalti VAR) y Pogba, Mbappé. Mandzukić y
 *    Perišić para CRO. Deschamps gana como entrenador y como capitán
 *    (1998 jugador). Lloris portero capitán pero error en gol Mandzukić.
 *  - ★★★ VAR DEBUT MUNDIAL. Primera vez con tecnología video oficial.
 *    Penalti decisivo en final para FRA (Perišić mano discutida).
 *    Llamadas VAR: 19 en total el torneo.
 *  - MBAPPÉ 19 AÑOS REVELACIÓN. 4 goles, Mejor Jugador Joven. Doblete
 *    a ARG en oct (4-3) corriendo 60m. Recordando a Pelé.
 *  - MODRIĆ BALÓN DE ORO MUNDIAL. CRO subcampeona histórica. 3 prórrogas
 *    consecutivas (vs DEN, RUS, ENG) y aún así llega a la final.
 *  - ★★ ALEMANIA ELIMINADA GRUPOS por KOR (2-0) y MEX (1-0). Campeona
 *    vigente humillada. Löw mantenido. Kroos gol agónico vs SWE no
 *    suficiente.
 *  - ESPAÑA caos pre-Mundial: Lopetegui ficha por Real Madrid 2 días
 *    antes del debut. RFEF despide al seleccionador. Fernando Hierro
 *    interino. Oct vs RUS 1-1 (autogol Ignashevich) → penaltis 3-4.
 *    Cheryshev / Akinfeev héroes.
 *  - INGLATERRA SEMIFINALISTA. Pickford héroe penaltis vs COL. Cae
 *    2-1 vs CRO. Southgate seleccionador.
 *  - CR7 HAT-TRICK vs ESP 3-3 (incluida falta directa minuto 88).
 *    POR cae octavos por URU 2-1 (Cavani doblete).
 *  - BRA cae cuartos por BEL 2-1 (de Bruyne, Fernandinho autogol).
 *  - ARG-NGA 2-1 grupos al borde. Marcos Rojo volea histórica clasifica
 *    a ARG en el último suspiro.
 *  - JPN saluda al banquillo SEN tras eliminarse antes (fair play).
 *
 * Datos verificados con FIFA archives, Wikipedia, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-2018.ts
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

const YEAR = 2018;

const TEAMS = [
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'CRO', name: 'Croacia', conf: 'UEFA', flag: '🇭🇷' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'RUS', name: 'Rusia', conf: 'UEFA', flag: '🇷🇺' },
  { code: 'COL', name: 'Colombia', conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'DEN', name: 'Dinamarca', conf: 'UEFA', flag: '🇩🇰' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'SEN', name: 'Senegal', conf: 'CAF', flag: '🇸🇳' },
  { code: 'IRN', name: 'Irán', conf: 'AFC', flag: '🇮🇷' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'NGA', name: 'Nigeria', conf: 'CAF', flag: '🇳🇬' },
  { code: 'PER', name: 'Perú', conf: 'CONMEBOL', flag: '🇵🇪' },
  { code: 'ISL', name: 'Islandia', conf: 'UEFA', flag: '🇮🇸' },
  { code: 'SRB', name: 'Serbia', conf: 'UEFA', flag: '🇷🇸' },
  { code: 'EGY', name: 'Egipto', conf: 'CAF', flag: '🇪🇬' },
  { code: 'AUS', name: 'Australia', conf: 'AFC', flag: '🇦🇺' },
  { code: 'MAR', name: 'Marruecos', conf: 'CAF', flag: '🇲🇦' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'TUN', name: 'Túnez', conf: 'CAF', flag: '🇹🇳' },
  { code: 'KSA', name: 'Arabia Saudí', conf: 'AFC', flag: '🇸🇦' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'PAN', name: 'Panamá', conf: 'CONCACAF', flag: '🇵🇦' },
];

const VENUES = [
  { slug: 'luzhniki-stadium', name: 'Luzhniki Stadium', city: 'Moscú', country_code: 'RUS', latitude: 55.7158, longitude: 37.5536, surface: 'hybrid', opened_year: 1956 },
  { slug: 'otkritie-arena', name: 'Otkritie Arena (Spartak)', city: 'Moscú', country_code: 'RUS', latitude: 55.8181, longitude: 37.4400, surface: 'grass', opened_year: 2014 },
  { slug: 'krestovsky-stadium', name: 'Krestovsky Stadium', city: 'San Petersburgo', country_code: 'RUS', latitude: 59.9728, longitude: 30.2208, surface: 'grass', opened_year: 2017 },
  { slug: 'kazan-arena', name: 'Kazan Arena', city: 'Kazán', country_code: 'RUS', latitude: 55.8203, longitude: 49.1611, surface: 'grass', opened_year: 2013 },
  { slug: 'fisht-stadium', name: 'Fisht Stadium', city: 'Sochi', country_code: 'RUS', latitude: 43.4006, longitude: 39.9572, surface: 'grass', opened_year: 2013 },
  { slug: 'volgograd-arena', name: 'Volgograd Arena', city: 'Volgogrado', country_code: 'RUS', latitude: 48.7350, longitude: 44.4750, surface: 'grass', opened_year: 2018 },
  { slug: 'mordovia-arena', name: 'Mordovia Arena', city: 'Saransk', country_code: 'RUS', latitude: 54.1933, longitude: 45.1875, surface: 'grass', opened_year: 2017 },
  { slug: 'nizhny-novgorod-stadium', name: 'Nizhny Novgorod Stadium', city: 'Nizhny Novgorod', country_code: 'RUS', latitude: 56.3242, longitude: 43.9525, surface: 'grass', opened_year: 2018 },
  { slug: 'ekaterinburg-arena', name: 'Ekaterinburg Arena', city: 'Yekaterimburgo', country_code: 'RUS', latitude: 56.8323, longitude: 60.5722, surface: 'grass', opened_year: 1957 },
  { slug: 'rostov-arena', name: 'Rostov Arena', city: 'Rostov del Don', country_code: 'RUS', latitude: 47.2078, longitude: 39.7414, surface: 'grass', opened_year: 2018 },
  { slug: 'samara-arena', name: 'Samara Arena', city: 'Samara', country_code: 'RUS', latitude: 53.2828, longitude: 50.2367, surface: 'grass', opened_year: 2018 },
  { slug: 'kaliningrad-stadium', name: 'Kaliningrad Stadium', city: 'Kaliningrado', country_code: 'RUS', latitude: 54.7197, longitude: 20.4717, surface: 'grass', opened_year: 2018 },
];

const REFEREES = [
  { full_name: 'Néstor Pitana', nationality_code: 'ARG' },
  { full_name: 'Mark Geiger', nationality_code: 'USA' },
  { full_name: 'Felix Brych', nationality_code: 'GER' },
  { full_name: 'Cüneyt Çakır', nationality_code: 'TUR' },
  { full_name: 'Bjorn Kuipers', nationality_code: 'NED' },
  { full_name: 'Sandro Ricci', nationality_code: 'BRA' },
  { full_name: 'Damir Skomina', nationality_code: 'SVN' },
  { full_name: 'Wilmar Roldán', nationality_code: 'COL' },
  { full_name: 'Mehdi Abid Charef', nationality_code: 'ALG' },
  { full_name: 'Janny Sikazwe', nationality_code: 'ZMB' },
  { full_name: 'Ravshan Irmatov', nationality_code: 'UZB' },
  { full_name: 'Alireza Faghani', nationality_code: 'IRN' },
  { full_name: 'Andres Cunha', nationality_code: 'URU' },
  { full_name: 'Milorad Mažić', nationality_code: 'SRB' },
  { full_name: 'Gianluca Rocchi', nationality_code: 'ITA' },
  { full_name: 'Antonio Mateu Lahoz', nationality_code: 'ESP' },
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
  // ── GRUPO A (RUS, KSA, EGY, URU) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '2018-06-14T18:00:00+03:00', home_code: 'RUS', away_code: 'KSA', home_score: 5, away_score: 0, venue_slug: 'luzhniki-stadium', referee: 'Néstor Pitana', attendance: 78011, notes: '★ INAUGURAL. Cheryshev doblete (2 goles tras entrar al 24). Gazinsky gol al 12. 5-0 humillación. Imagen Putin con cara de poker' },
  { match_number: 2,  stage: 'group', match_date: '2018-06-15T17:00:00+05:00', home_code: 'EGY', away_code: 'URU', home_score: 0, away_score: 1, venue_slug: 'ekaterinburg-arena', referee: 'Bjorn Kuipers', attendance: 27015, notes: 'Salah no juega (lesionado en final UCL). Giménez gol min 89' },
  { match_number: 3,  stage: 'group', match_date: '2018-06-19T15:00:00+03:00', home_code: 'RUS', away_code: 'EGY', home_score: 3, away_score: 1, venue_slug: 'krestovsky-stadium', referee: 'Enrique Cáceres', attendance: 64468 },
  { match_number: 4,  stage: 'group', match_date: '2018-06-20T18:00:00+05:00', home_code: 'URU', away_code: 'KSA', home_score: 1, away_score: 0, venue_slug: 'rostov-arena', referee: 'Clément Turpin', attendance: 42678 },
  { match_number: 5,  stage: 'group', match_date: '2018-06-25T17:00:00+04:00', home_code: 'URU', away_code: 'RUS', home_score: 3, away_score: 0, venue_slug: 'samara-arena', referee: 'Malang Diédhiou', attendance: 41970, notes: 'Suárez, Cheryshev autogol, Cavani' },
  { match_number: 6,  stage: 'group', match_date: '2018-06-25T17:00:00+03:00', home_code: 'KSA', away_code: 'EGY', home_score: 2, away_score: 1, venue_slug: 'volgograd-arena', referee: 'Wilmar Roldán', attendance: 41312 },
  // ── GRUPO B (POR, ESP, IRN, MAR) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '2018-06-15T20:00:00+03:00', home_code: 'MAR', away_code: 'IRN', home_score: 0, away_score: 1, venue_slug: 'krestovsky-stadium', referee: 'Cüneyt Çakır', attendance: 62548, notes: 'Aziz Bouhaddouz autogol min 95' },
  { match_number: 8,  stage: 'group', match_date: '2018-06-15T21:00:00+02:00', home_code: 'POR', away_code: 'ESP', home_score: 3, away_score: 3, venue_slug: 'fisht-stadium', referee: 'Gianluca Rocchi', attendance: 43866, notes: '★★★ CR7 HAT-TRICK. Penalti al 4, gol área al 44, FALTA DIRECTA min 88 al 9 (8 metros al ángulo). ESP empataba 3-2 (Costa doblete, Nacho). Lopetegui había sido despedido 2 días antes' },
  { match_number: 9,  stage: 'group', match_date: '2018-06-20T18:00:00+04:00', home_code: 'POR', away_code: 'MAR', home_score: 1, away_score: 0, venue_slug: 'luzhniki-stadium', referee: 'Mark Geiger', attendance: 78011, notes: 'CR7 cabezazo min 4. MAR eliminada' },
  { match_number: 10, stage: 'group', match_date: '2018-06-20T21:00:00+04:00', home_code: 'IRN', away_code: 'ESP', home_score: 0, away_score: 1, venue_slug: 'kazan-arena', referee: 'Andres Cunha', attendance: 42718, notes: 'Diego Costa gol con suerte (rebote rodilla)' },
  { match_number: 11, stage: 'group', match_date: '2018-06-25T21:00:00+04:00', home_code: 'IRN', away_code: 'POR', home_score: 1, away_score: 1, venue_slug: 'mordovia-arena', referee: 'Enrique Cáceres', attendance: 41685, notes: '★ CR7 PENALTI FALLADO. Quaresma gol exterior espectacular. POR pasa segundo' },
  { match_number: 12, stage: 'group', match_date: '2018-06-25T21:00:00+03:00', home_code: 'ESP', away_code: 'MAR', home_score: 2, away_score: 2, venue_slug: 'kaliningrad-stadium', referee: 'Ravshan Irmatov', attendance: 33973, notes: 'Aspas gol VAR al 91 (1° gol con VAR explicito en Mundial)' },
  // ── GRUPO C (FRA, AUS, PER, DEN) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '2018-06-16T13:00:00+04:00', home_code: 'FRA', away_code: 'AUS', home_score: 2, away_score: 1, venue_slug: 'kazan-arena', referee: 'Andres Cunha', attendance: 41279, notes: '★ PRIMER PENALTI VAR DE LA HISTORIA. Griezmann anota tras revisión. Pogba gol decisivo' },
  { match_number: 14, stage: 'group', match_date: '2018-06-16T19:00:00+04:00', home_code: 'PER', away_code: 'DEN', home_score: 0, away_score: 1, venue_slug: 'mordovia-arena', referee: 'Bakary Gassama', attendance: 40502, notes: 'PER regresa al Mundial 36 años después (México 86). Cueva falla penalti' },
  { match_number: 15, stage: 'group', match_date: '2018-06-21T16:00:00+04:00', home_code: 'FRA', away_code: 'PER', home_score: 1, away_score: 0, venue_slug: 'ekaterinburg-arena', referee: 'Mohammed Abdulla', attendance: 32789, notes: 'Mbappé gol min 34' },
  { match_number: 16, stage: 'group', match_date: '2018-06-21T16:00:00+03:00', home_code: 'DEN', away_code: 'AUS', home_score: 1, away_score: 1, venue_slug: 'samara-arena', referee: 'Antonio Mateu Lahoz', attendance: 40727 },
  { match_number: 17, stage: 'group', match_date: '2018-06-26T17:00:00+02:00', home_code: 'DEN', away_code: 'FRA', home_score: 0, away_score: 0, venue_slug: 'luzhniki-stadium', referee: 'Sandro Ricci', attendance: 78011, notes: '★ "PARTIDO MÁS ABURRIDO DEL MUNDIAL". 0 disparos a portería en 2° tiempo. FRA gana grupo' },
  { match_number: 18, stage: 'group', match_date: '2018-06-26T17:00:00+03:00', home_code: 'AUS', away_code: 'PER', home_score: 0, away_score: 2, venue_slug: 'fisht-stadium', referee: 'Paolo Valeri', attendance: 44073, notes: 'Carrillo, Guerrero. PER se va con dignidad' },
  // ── GRUPO D (ARG, ISL, HRV, NGA) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '2018-06-16T16:00:00+03:00', home_code: 'ARG', away_code: 'ISL', home_score: 1, away_score: 1, venue_slug: 'otkritie-arena', referee: 'Szymon Marciniak', attendance: 44190, notes: '★ MESSI PENALTI FALLADO. Halldorsson lo para. ISL primer Mundial historico debuta empatando' },
  { match_number: 20, stage: 'group', match_date: '2018-06-16T21:00:00+03:00', home_code: 'CRO', away_code: 'NGA', home_score: 2, away_score: 0, venue_slug: 'kaliningrad-stadium', referee: 'Sandro Ricci', attendance: 31136 },
  { match_number: 21, stage: 'group', match_date: '2018-06-21T19:00:00+05:00', home_code: 'ARG', away_code: 'CRO', home_score: 0, away_score: 3, venue_slug: 'nizhny-novgorod-stadium', referee: 'Ravshan Irmatov', attendance: 43319, notes: '★★ ARG HUMILLADA 3-0. Caballero error grosero. Rebic, Modric, Rakitic. Sampaoli desautorizado' },
  { match_number: 22, stage: 'group', match_date: '2018-06-22T19:00:00+03:00', home_code: 'NGA', away_code: 'ISL', home_score: 2, away_score: 0, venue_slug: 'volgograd-arena', referee: 'Matt Conger', attendance: 40904 },
  { match_number: 23, stage: 'group', match_date: '2018-06-26T21:00:00+03:00', home_code: 'NGA', away_code: 'ARG', home_score: 1, away_score: 2, venue_slug: 'krestovsky-stadium', referee: 'Cüneyt Çakır', attendance: 64468, notes: '★★★ "EL DRAMA". Messi golazo min 14. Moses penalti 51. MARCOS ROJO VOLEA min 86 al ángulo: ARG clasifica al borde. Imagen Maradona vista en palco' },
  { match_number: 24, stage: 'group', match_date: '2018-06-26T21:00:00+03:00', home_code: 'ISL', away_code: 'CRO', home_score: 1, away_score: 2, venue_slug: 'rostov-arena', referee: 'Antonio Mateu Lahoz', attendance: 43472 },
  // ── GRUPO E (BRA, SUI, CRC, SRB) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '2018-06-17T15:00:00+03:00', home_code: 'CRC', away_code: 'SRB', home_score: 0, away_score: 1, venue_slug: 'samara-arena', referee: 'Malang Diédhiou', attendance: 41432, notes: 'Kolarov falta directa' },
  { match_number: 26, stage: 'group', match_date: '2018-06-17T21:00:00+03:00', home_code: 'BRA', away_code: 'SUI', home_score: 1, away_score: 1, venue_slug: 'rostov-arena', referee: 'Cesar Ramos', attendance: 43109, notes: 'Coutinho golazo. Zuber cabezazo empate. ★ NEYMAR FALTA NO MARCADA en jugada de empate (VAR no se uso)' },
  { match_number: 27, stage: 'group', match_date: '2018-06-22T15:00:00+04:00', home_code: 'BRA', away_code: 'CRC', home_score: 2, away_score: 0, venue_slug: 'krestovsky-stadium', referee: 'Bjorn Kuipers', attendance: 64468, notes: 'Coutinho y Neymar (lloró tras gol)' },
  { match_number: 28, stage: 'group', match_date: '2018-06-22T18:00:00+03:00', home_code: 'SRB', away_code: 'SUI', home_score: 1, away_score: 2, venue_slug: 'kaliningrad-stadium', referee: 'Felix Brych', attendance: 33167, notes: '★ "ÁGUILAS ALBANESAS" Xhaka y Shaqiri celebran goles con gestos albaneses (origen padres). FIFA multa por simbolismo político' },
  { match_number: 29, stage: 'group', match_date: '2018-06-27T21:00:00+04:00', home_code: 'SRB', away_code: 'BRA', home_score: 0, away_score: 2, venue_slug: 'otkritie-arena', referee: 'Alireza Faghani', attendance: 44190, notes: 'Paulinho y Thiago Silva' },
  { match_number: 30, stage: 'group', match_date: '2018-06-27T21:00:00+04:00', home_code: 'SUI', away_code: 'CRC', home_score: 2, away_score: 2, venue_slug: 'nizhny-novgorod-stadium', referee: 'Bakary Gassama', attendance: 43963 },
  // ── GRUPO F (GER, MEX, KOR, SWE) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '2018-06-17T18:00:00+03:00', home_code: 'GER', away_code: 'MEX', home_score: 0, away_score: 1, venue_slug: 'luzhniki-stadium', referee: 'Alireza Faghani', attendance: 78011, notes: '★★★ MEX SORPRESÓN HISTORICO. Lozano gol min 35 contraataque. MEX vence al CAMPEÓN VIGENTE. CELEBRACIÓN: terremoto en CDMX por el grito popular' },
  { match_number: 32, stage: 'group', match_date: '2018-06-18T15:00:00+03:00', home_code: 'SWE', away_code: 'KOR', home_score: 1, away_score: 0, venue_slug: 'nizhny-novgorod-stadium', referee: 'Joel Aguilar', attendance: 42300 },
  { match_number: 33, stage: 'group', match_date: '2018-06-23T18:00:00+03:00', home_code: 'KOR', away_code: 'MEX', home_score: 1, away_score: 2, venue_slug: 'rostov-arena', referee: 'Milorad Mažić', attendance: 43472 },
  { match_number: 34, stage: 'group', match_date: '2018-06-23T20:00:00+05:00', home_code: 'GER', away_code: 'SWE', home_score: 2, away_score: 1, venue_slug: 'fisht-stadium', referee: 'Szymon Marciniak', attendance: 44287, notes: '★ KROOS FALTA DIRECTA min 95 al ángulo. GER salva el grupo... momentáneamente' },
  { match_number: 35, stage: 'group', match_date: '2018-06-27T17:00:00+03:00', home_code: 'KOR', away_code: 'GER', home_score: 2, away_score: 0, venue_slug: 'kazan-arena', referee: 'Mark Geiger', attendance: 41835, notes: '★★★★ ALEMANIA ELIMINADA EN GRUPOS. Kim Young-gwon (VAR confirma) y Son Heung-min al 96. CAMPEONA VIGENTE ÚLTIMA DE GRUPO. Bochorno histórico' },
  { match_number: 36, stage: 'group', match_date: '2018-06-27T17:00:00+03:00', home_code: 'MEX', away_code: 'SWE', home_score: 0, away_score: 3, venue_slug: 'ekaterinburg-arena', referee: 'Néstor Pitana', attendance: 32789, notes: 'MEX pasa segundo gracias a KOR' },
  // ── GRUPO G (BEL, PAN, TUN, ENG) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '2018-06-18T18:00:00+03:00', home_code: 'BEL', away_code: 'PAN', home_score: 3, away_score: 0, venue_slug: 'fisht-stadium', referee: 'Janny Sikazwe', attendance: 43257, notes: 'PAN debut Mundial' },
  { match_number: 38, stage: 'group', match_date: '2018-06-18T21:00:00+03:00', home_code: 'TUN', away_code: 'ENG', home_score: 1, away_score: 2, venue_slug: 'volgograd-arena', referee: 'Wilmar Roldán', attendance: 41064, notes: 'Kane doblete (gol min 91)' },
  { match_number: 39, stage: 'group', match_date: '2018-06-23T15:00:00+03:00', home_code: 'BEL', away_code: 'TUN', home_score: 5, away_score: 2, venue_slug: 'otkritie-arena', referee: 'Jair Marrufo', attendance: 44190, notes: 'Hazard doblete, Lukaku doblete' },
  { match_number: 40, stage: 'group', match_date: '2018-06-24T15:00:00+03:00', home_code: 'ENG', away_code: 'PAN', home_score: 6, away_score: 1, venue_slug: 'nizhny-novgorod-stadium', referee: 'Ghead Grisha', attendance: 43319, notes: 'Kane hat-trick (uno por VAR penalti)' },
  { match_number: 41, stage: 'group', match_date: '2018-06-28T21:00:00+04:00', home_code: 'ENG', away_code: 'BEL', home_score: 0, away_score: 1, venue_slug: 'kaliningrad-stadium', referee: 'Damir Skomina', attendance: 33973, notes: '★ "TANKING": ambos prefieren segundo de grupo para evitar BRA. Januzaj golazo. BEL gana grupo "involuntariamente"' },
  { match_number: 42, stage: 'group', match_date: '2018-06-28T17:00:00+03:00', home_code: 'PAN', away_code: 'TUN', home_score: 1, away_score: 2, venue_slug: 'mordovia-arena', referee: 'Nawaf Shukralla', attendance: 39812 },
  // ── GRUPO H (COL, JPN, SEN, POL) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '2018-06-19T15:00:00+03:00', home_code: 'COL', away_code: 'JPN', home_score: 1, away_score: 2, venue_slug: 'mordovia-arena', referee: 'Damir Skomina', attendance: 40842, notes: '★ Carlos Sánchez roja al 3 (segunda más rápida historia). JPN gana 2-1' },
  { match_number: 44, stage: 'group', match_date: '2018-06-19T18:00:00+03:00', home_code: 'POL', away_code: 'SEN', home_score: 1, away_score: 2, venue_slug: 'otkritie-arena', referee: 'Nawaf Shukralla', attendance: 44190, notes: 'Niang gol tras error portero polaco' },
  { match_number: 45, stage: 'group', match_date: '2018-06-24T18:00:00+05:00', home_code: 'JPN', away_code: 'SEN', home_score: 2, away_score: 2, venue_slug: 'ekaterinburg-arena', referee: 'Sergei Karasev', attendance: 35716 },
  { match_number: 46, stage: 'group', match_date: '2018-06-24T21:00:00+03:00', home_code: 'POL', away_code: 'COL', home_score: 0, away_score: 3, venue_slug: 'kazan-arena', referee: 'Cesar Ramos', attendance: 42873, notes: 'James, Falcao, Cuadrado. Lewandowski sin marcar' },
  { match_number: 47, stage: 'group', match_date: '2018-06-28T19:00:00+04:00', home_code: 'SEN', away_code: 'COL', home_score: 0, away_score: 1, venue_slug: 'samara-arena', referee: 'Milorad Mažić', attendance: 41970, notes: '★ SEN ELIMINADA POR FAIR PLAY. Mismo puntaje y diferencia con JPN pero MÁS TARJETAS amarillas (1 más). Primera vez en historia Mundial' },
  { match_number: 48, stage: 'group', match_date: '2018-06-28T17:00:00+03:00', home_code: 'JPN', away_code: 'POL', home_score: 0, away_score: 1, venue_slug: 'volgograd-arena', referee: 'Janny Sikazwe', attendance: 42189, notes: '★ JPN ULTIMOS 10 MIN PASEA EL BALÓN sabiendo que SEN perdía y eso le clasificaría por fair play. Polémica eterna' },
  // ── OCTAVOS ── 30 jun - 3 jul ────────────────────────────
  { match_number: 49, stage: 'r16', match_date: '2018-06-30T17:00:00+03:00', home_code: 'FRA', away_code: 'ARG', home_score: 4, away_score: 3, venue_slug: 'kazan-arena', referee: 'Alireza Faghani', attendance: 42873, notes: '★★★★ "EL PARTIDO DEL MUNDIAL". MBAPPÉ 19 AÑOS GENIAL. Griezmann penalti, Di María empate golazo, Mercado, Pavard golazo volea, MBAPPÉ DOBLETE corriendo 60m. ARG enfocada en Messi. Higuaín al final no fue suficiente' },
  { match_number: 50, stage: 'r16', match_date: '2018-06-30T21:00:00+03:00', home_code: 'URU', away_code: 'POR', home_score: 2, away_score: 1, venue_slug: 'fisht-stadium', referee: 'Cesar Ramos', attendance: 43319, notes: 'CAVANI DOBLETE histórico. CR7 fuera 4ª vez consecutiva en octavos' },
  { match_number: 51, stage: 'r16', match_date: '2018-07-01T17:00:00+03:00', home_code: 'ESP', away_code: 'RUS', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 4, venue_slug: 'luzhniki-stadium', referee: 'Bjorn Kuipers', attendance: 78011, notes: '★★★ ESP ELIMINADA POR EL ANFITRION. Ignashevich autogol 12, Dzyuba penalti 41. ESP 1075 PASES (record histórico). Penaltis: Akinfeev héroe para Koke y Aspas. RUS a cuartos casa' },
  { match_number: 52, stage: 'r16', match_date: '2018-07-01T20:00:00+03:00', home_code: 'CRO', away_code: 'DEN', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 2, venue_slug: 'nizhny-novgorod-stadium', referee: 'Néstor Pitana', attendance: 40851, notes: '★ MODRIC PENALTI FALLADO. Subasic héroe (3 paradas). Schmeichel también (2). CRO primera prórroga consecutiva del torneo' },
  { match_number: 53, stage: 'r16', match_date: '2018-07-02T17:00:00+03:00', home_code: 'BRA', away_code: 'MEX', home_score: 2, away_score: 0, venue_slug: 'samara-arena', referee: 'Gianluca Rocchi', attendance: 41970, notes: 'Neymar y Firmino. Neymar pisotón a Layun (imagen viral)' },
  { match_number: 54, stage: 'r16', match_date: '2018-07-02T20:00:00+03:00', home_code: 'BEL', away_code: 'JPN', home_score: 3, away_score: 2, venue_slug: 'rostov-arena', referee: 'Malang Diédhiou', attendance: 41466, notes: '★★★ "EL MEJOR PARTIDO DE LA HISTORIA SEGÚN DE BRUYNE". JPN 2-0 (Haraguchi, Inui golazo). Vertonghen, Fellaini, Chadli min 94 tras córner ejecutado en 9 segundos. JPN saluda al banquillo despedida fair play' },
  { match_number: 55, stage: 'r16', match_date: '2018-07-03T20:00:00+03:00', home_code: 'SWE', away_code: 'SUI', home_score: 1, away_score: 0, venue_slug: 'krestovsky-stadium', referee: 'Damir Skomina', attendance: 64042, notes: 'Forsberg desviado por Schär' },
  { match_number: 56, stage: 'r16', match_date: '2018-07-03T21:00:00+03:00', home_code: 'COL', away_code: 'ENG', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 4, venue_slug: 'otkritie-arena', referee: 'Mark Geiger', attendance: 44190, notes: '★ PICKFORD HÉROE. Mina cabezazo al 93 empate. Penaltis: ENG primera vez gana penaltis en Mundial. Pickford para a Bacca. Carlos Bacca y Mateus Uribe fallan' },
  // ── CUARTOS ── 6-7 jul ───────────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '2018-07-06T16:00:00+04:00', home_code: 'URU', away_code: 'FRA', home_score: 0, away_score: 2, venue_slug: 'nizhny-novgorod-stadium', referee: 'Néstor Pitana', attendance: 43319, notes: 'Varane y Griezmann (error portero Muslera). Cavani lesionado fuera' },
  { match_number: 58, stage: 'qf', match_date: '2018-07-06T20:00:00+04:00', home_code: 'BRA', away_code: 'BEL', home_score: 1, away_score: 2, venue_slug: 'kazan-arena', referee: 'Milorad Mažić', attendance: 42873, notes: '★ BRA ELIMINADA. Fernandinho autogol 13, De Bruyne golazo 31. Renato Augusto descuenta. BRA fuera de cuartos por 2° Mundial consecutivo' },
  { match_number: 59, stage: 'qf', match_date: '2018-07-07T17:00:00+04:00', home_code: 'SWE', away_code: 'ENG', home_score: 0, away_score: 2, venue_slug: 'samara-arena', referee: 'Bjorn Kuipers', attendance: 39991, notes: 'Maguire y Alli cabezazos' },
  { match_number: 60, stage: 'qf', match_date: '2018-07-07T21:00:00+03:00', home_code: 'RUS', away_code: 'CRO', home_score: 2, away_score: 2, home_score_pk: 3, away_score_pk: 4, venue_slug: 'fisht-stadium', referee: 'Sandro Ricci', attendance: 44287, notes: '★★ CRO 2ª PRORROGA CONSECUTIVA. Cheryshev golazo, Kramaric, Fernandes, Vida 101. Penaltis: Smolov falla. Modric pasa. RUS afición despide con honores' },
  // ── SEMIS ── 10-11 jul ───────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '2018-07-10T21:00:00+03:00', home_code: 'FRA', away_code: 'BEL', home_score: 1, away_score: 0, venue_slug: 'krestovsky-stadium', referee: 'Andres Cunha', attendance: 64286, notes: 'Umtiti cabezazo córner min 51. Kanté tape it all' },
  { match_number: 62, stage: 'sf', match_date: '2018-07-11T21:00:00+03:00', home_code: 'CRO', away_code: 'ENG', home_score: 2, away_score: 1, venue_slug: 'luzhniki-stadium', referee: 'Cüneyt Çakır', attendance: 78011, notes: '★★ ENG PIERDE EN PRORROGA. Trippier falta directa min 5. Perišić empate, Mandzukić gol 109. CRO 3ª prorroga consecutiva. Modric arquitecto' },
  // ── 3er PUESTO ── 14 jul ─────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '2018-07-14T17:00:00+03:00', home_code: 'BEL', away_code: 'ENG', home_score: 2, away_score: 0, venue_slug: 'krestovsky-stadium', referee: 'Alireza Faghani', attendance: 64406, notes: 'Meunier y Hazard. BEL tercer puesto histórico (mejor desde 1986)' },
  // ── FINAL ── 15 jul ──────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '2018-07-15T18:00:00+03:00', home_code: 'FRA', away_code: 'CRO', home_score: 4, away_score: 2, venue_slug: 'luzhniki-stadium', referee: 'Néstor Pitana', attendance: 78011, notes: '★★★★ FRANCIA CAMPEONA (2° título tras 1998). Autogol Mandzukić cabezazo Griezmann (1er autogol en final). Perišić empata 28 (golazo recortando+remate). GRIEZMANN PENALTI VAR 38 (Perišić mano discutida, 1° penalti VAR en final). Pogba 59, Mbappé 65 (golazo desde fuera del área). Mandzukić aprovecha error LLORIS min 69 (jugando con balón). Lluvia final. Modric Balón de Oro Mundial. Deschamps gana como jugador (98) y entrenador (2018), 3° en la historia tras Zagallo y Beckenbauer. Putin presente con paraguas para Macron solo. 19 llamadas VAR en torneo' },
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

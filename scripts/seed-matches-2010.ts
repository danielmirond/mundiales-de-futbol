/**
 * Seed los 64 partidos del Mundial Sudáfrica 2010.
 *
 * PRIMER MUNDIAL EN ÁFRICA. 32 selecciones, 64 partidos, 10 estadios.
 *
 * Hitos:
 *  - ★★★ ESPAÑA CAMPEONA POR PRIMERA VEZ EN SU HISTORIA.
 *    Final 1-0 vs NED (gol Iniesta min 116 en prórroga). Howard Webb
 *    árbitro. 14 amarillas (récord histórico), Heitinga roja al 109.
 *    Iniesta enseña "Dani Jarque siempre con nosotros".
 *  - ESPAÑA DEBUT CON DERROTA: 0-1 vs SUI (Fernandes gol). Media España
 *    daba por perdida la copa. Vicente del Bosque mantuvo bloque.
 *    Recuperación: 2-0 HON, 2-1 CHI. Octavos POR 1-0, cuartos PAR 1-0,
 *    semi ALE 1-0 (Puyol cabezazo), final NED 1-0. Solo 8 goles, marca
 *    de cualquier campeón.
 *  - URUGUAY CUARTA, 40 años después. Forlán BALÓN DE ORO Mundial. Suárez
 *    mano gol vs GHA cuartos (penalti fallado por Asamoah Gyan, URU pasa
 *    en penaltis. Imagen icónica del Mundial).
 *  - VUVUZELAS la imagen sonora del Mundial. Comentaristas tape-rolled
 *    el primer día. FIFA mantuvo la tradición local.
 *  - INGLATERRA 1-1 USA: GAFFE DEL PORTERO ROBERT GREEN (gol Dempsey
 *    desde 30 m rebotado). LAMPARD "GOL FANTASMA" vs ALE oct (cruzó
 *    línea pero árbitro Larrionda no concede). 4-1 ALE.
 *  - FRANCIA EN LA HOGUERA: huelga jugadores tras expulsión Anelka,
 *    Domenech sin equipo. ESP campeón en su grupo.
 *  - MARADONA SELECCIONADOR ARGENTINA. Eliminada 4-0 por GER cuartos.
 *    Klose, Müller goleadores. Maradona despedido tras.
 *  - GHANA CASI SEMIFINAL. Suárez mano. Asamoah Gyan falla penalti.
 *    Penaltis URU 4-2.
 *  - 1ª RONDA SIN GANADOR EUROPEO: FRA, ITA campeones vigentes
 *    eliminados en fase de grupos. Primera vez histórica.
 *
 * Datos verificados con FIFA archives, Wikipedia (2010 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF, La Roja (Burns 2012).
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-2010.ts
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

const YEAR = 2010;

const TEAMS = [
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'GHA', name: 'Ghana', conf: 'CAF', flag: '🇬🇭' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'SVK', name: 'Eslovaquia', conf: 'UEFA', flag: '🇸🇰' },
  { code: 'RSA', name: 'Sudáfrica', conf: 'CAF', flag: '🇿🇦' },
  { code: 'AUS', name: 'Australia', conf: 'AFC', flag: '🇦🇺' },
  { code: 'NZL', name: 'Nueva Zelanda', conf: 'OFC', flag: '🇳🇿' },
  { code: 'SVN', name: 'Eslovenia', conf: 'UEFA', flag: '🇸🇮' },
  { code: 'ALG', name: 'Argelia', conf: 'CAF', flag: '🇩🇿' },
  { code: 'SRB', name: 'Serbia', conf: 'UEFA', flag: '🇷🇸' },
  { code: 'NGA', name: 'Nigeria', conf: 'CAF', flag: '🇳🇬' },
  { code: 'GRE', name: 'Grecia', conf: 'UEFA', flag: '🇬🇷' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'DEN', name: 'Dinamarca', conf: 'UEFA', flag: '🇩🇰' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'CIV', name: 'Costa de Marfil', conf: 'CAF', flag: '🇨🇮' },
  { code: 'PRK', name: 'Corea del Norte', conf: 'AFC', flag: '🇰🇵' },
  { code: 'HON', name: 'Honduras', conf: 'CONCACAF', flag: '🇭🇳' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
];

const VENUES = [
  { slug: 'soccer-city', name: 'Soccer City', city: 'Johannesburgo', country_code: 'RSA', latitude: -26.2347, longitude: 27.9824, surface: 'grass', opened_year: 1989 },
  { slug: 'ellis-park-stadium', name: 'Ellis Park Stadium', city: 'Johannesburgo', country_code: 'RSA', latitude: -26.1975, longitude: 28.0608, surface: 'grass', opened_year: 1928 },
  { slug: 'loftus-versfeld', name: 'Loftus Versfeld', city: 'Pretoria', country_code: 'RSA', latitude: -25.7536, longitude: 28.2231, surface: 'grass', opened_year: 1923 },
  { slug: 'royal-bafokeng', name: 'Royal Bafokeng Stadium', city: 'Rustenburg', country_code: 'RSA', latitude: -25.5786, longitude: 27.1611, surface: 'grass', opened_year: 1999 },
  { slug: 'free-state-stadium', name: 'Free State Stadium', city: 'Bloemfontein', country_code: 'RSA', latitude: -29.1175, longitude: 26.2147, surface: 'grass', opened_year: 1952 },
  { slug: 'moses-mabhida', name: 'Moses Mabhida Stadium', city: 'Durban', country_code: 'RSA', latitude: -29.8294, longitude: 31.0303, surface: 'grass', opened_year: 2009 },
  { slug: 'mbombela-stadium', name: 'Mbombela Stadium', city: 'Nelspruit', country_code: 'RSA', latitude: -25.4631, longitude: 31.0114, surface: 'grass', opened_year: 2009 },
  { slug: 'peter-mokaba', name: 'Peter Mokaba Stadium', city: 'Polokwane', country_code: 'RSA', latitude: -23.9244, longitude: 29.4694, surface: 'grass', opened_year: 2010 },
  { slug: 'green-point-stadium', name: 'Green Point Stadium', city: 'Ciudad del Cabo', country_code: 'RSA', latitude: -33.9036, longitude: 18.4108, surface: 'grass', opened_year: 2009 },
  { slug: 'nelson-mandela-bay', name: 'Nelson Mandela Bay Stadium', city: 'Port Elizabeth', country_code: 'RSA', latitude: -33.9378, longitude: 25.5989, surface: 'grass', opened_year: 2009 },
];

const REFEREES = [
  { full_name: 'Howard Webb', nationality_code: 'ENG' },
  { full_name: 'Ravshan Irmatov', nationality_code: 'UZB' },
  { full_name: 'Jorge Larrionda', nationality_code: 'URU' },
  { full_name: 'Massimo Busacca', nationality_code: 'SUI' },
  { full_name: 'Roberto Rosetti', nationality_code: 'ITA' },
  { full_name: 'Olegário Benquerença', nationality_code: 'POR' },
  { full_name: 'Wolfgang Stark', nationality_code: 'GER' },
  { full_name: 'Frank de Bleeckere', nationality_code: 'BEL' },
  { full_name: 'Stéphane Lannoy', nationality_code: 'FRA' },
  { full_name: 'Yuichi Nishimura', nationality_code: 'JPN' },
  { full_name: 'Viktor Kassai', nationality_code: 'HUN' },
  { full_name: 'Carlos Batres', nationality_code: 'GUA' },
  { full_name: 'Martin Hansson', nationality_code: 'SWE' },
  { full_name: 'Roberto Moreno', nationality_code: 'PAN' },
  { full_name: 'Koman Coulibaly', nationality_code: 'MLI' },
  { full_name: 'Pablo Pozo', nationality_code: 'CHI' },
  { full_name: 'Subkhiddin Mohd Salleh', nationality_code: 'MAS' },
  { full_name: 'Héctor Baldassi', nationality_code: 'ARG' },
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
  // ── GRUPO A (URU, MEX, RSA, FRA) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '2010-06-11T16:00:00+02:00', home_code: 'RSA', away_code: 'MEX', home_score: 1, away_score: 1, venue_slug: 'soccer-city', referee: 'Ravshan Irmatov', attendance: 84490, notes: '★ INAUGURAL. Tshabalala golazo min 55 (RSA delirio). Marquez empata. Primer Mundial africano. Vuvuzelas presentación mundial' },
  { match_number: 2,  stage: 'group', match_date: '2010-06-11T20:30:00+02:00', home_code: 'URU', away_code: 'FRA', home_score: 0, away_score: 0, venue_slug: 'green-point-stadium', referee: 'Yuichi Nishimura', attendance: 64100 },
  { match_number: 3,  stage: 'group', match_date: '2010-06-16T16:00:00+02:00', home_code: 'RSA', away_code: 'URU', home_score: 0, away_score: 3, venue_slug: 'loftus-versfeld', referee: 'Massimo Busacca', attendance: 42700, notes: 'Forlán doblete (uno penalti)' },
  { match_number: 4,  stage: 'group', match_date: '2010-06-17T13:30:00+02:00', home_code: 'FRA', away_code: 'MEX', home_score: 0, away_score: 2, venue_slug: 'peter-mokaba', referee: 'Khalil Al Ghamdi', attendance: 35370, notes: '★ FRA con problemas. Anelka critica a Domenech en vestuario, conflicto sale a luz' },
  { match_number: 5,  stage: 'group', match_date: '2010-06-22T16:00:00+02:00', home_code: 'MEX', away_code: 'URU', home_score: 0, away_score: 1, venue_slug: 'royal-bafokeng', referee: 'Olegário Benquerença', attendance: 33800 },
  { match_number: 6,  stage: 'group', match_date: '2010-06-22T16:00:00+02:00', home_code: 'FRA', away_code: 'RSA', home_score: 1, away_score: 2, venue_slug: 'free-state-stadium', referee: 'Oscar Ruiz', attendance: 39400, notes: '★★★ FRA ELIMINADA. JUGADORES SE NIEGAN A ENTRENAR el día anterior (huelga tras expulsión Anelka). Bafana eliminada también. Vergüenza nacional francesa. Domenech despedido' },
  // ── GRUPO B (ARG, KOR, GRE, NGA) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '2010-06-12T13:30:00+02:00', home_code: 'KOR', away_code: 'GRE', home_score: 2, away_score: 0, venue_slug: 'nelson-mandela-bay', referee: 'Michael Hester', attendance: 31500 },
  { match_number: 8,  stage: 'group', match_date: '2010-06-12T20:30:00+02:00', home_code: 'ARG', away_code: 'NGA', home_score: 1, away_score: 0, venue_slug: 'ellis-park-stadium', referee: 'Wolfgang Stark', attendance: 55700, notes: 'Heinze gol cabeza. MARADONA SELECCIONADOR debuta' },
  { match_number: 9,  stage: 'group', match_date: '2010-06-17T20:30:00+02:00', home_code: 'GRE', away_code: 'NGA', home_score: 2, away_score: 1, venue_slug: 'free-state-stadium', referee: 'Olegário Benquerença', attendance: 31600 },
  { match_number: 10, stage: 'group', match_date: '2010-06-17T16:00:00+02:00', home_code: 'ARG', away_code: 'KOR', home_score: 4, away_score: 1, venue_slug: 'soccer-city', referee: 'Frank de Bleeckere', attendance: 82200, notes: 'Higuaín hat-trick' },
  { match_number: 11, stage: 'group', match_date: '2010-06-22T20:30:00+02:00', home_code: 'NGA', away_code: 'KOR', home_score: 2, away_score: 2, venue_slug: 'moses-mabhida', referee: 'Olegário Benquerença', attendance: 61800 },
  { match_number: 12, stage: 'group', match_date: '2010-06-22T20:30:00+02:00', home_code: 'GRE', away_code: 'ARG', home_score: 0, away_score: 2, venue_slug: 'peter-mokaba', referee: 'Ravshan Irmatov', attendance: 38900, notes: 'Demichelis, Palermo' },
  // ── GRUPO C (USA, ENG, SVN, ALG) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '2010-06-12T20:30:00+02:00', home_code: 'ENG', away_code: 'USA', home_score: 1, away_score: 1, venue_slug: 'royal-bafokeng', referee: 'Carlos Simon', attendance: 38600, notes: '★ ROBERT GREEN GAFFE. Dempsey dispara desde 30m, rebota en el portero ENG al fondo. Empate humillante' },
  { match_number: 14, stage: 'group', match_date: '2010-06-13T13:30:00+02:00', home_code: 'ALG', away_code: 'SVN', home_score: 0, away_score: 1, venue_slug: 'peter-mokaba', referee: 'Andre Marriner', attendance: 30800 },
  { match_number: 15, stage: 'group', match_date: '2010-06-18T13:30:00+02:00', home_code: 'SVN', away_code: 'USA', home_score: 2, away_score: 2, venue_slug: 'ellis-park-stadium', referee: 'Koman Coulibaly', attendance: 45500, notes: '★ POLEMICA COULIBALY: gol USA min 86 anulado sin razón clara. Donovan empate al 91' },
  { match_number: 16, stage: 'group', match_date: '2010-06-18T20:30:00+02:00', home_code: 'ENG', away_code: 'ALG', home_score: 0, away_score: 0, venue_slug: 'green-point-stadium', referee: 'Ravshan Irmatov', attendance: 64100 },
  { match_number: 17, stage: 'group', match_date: '2010-06-23T20:30:00+02:00', home_code: 'SVN', away_code: 'ENG', home_score: 0, away_score: 1, venue_slug: 'nelson-mandela-bay', referee: 'Wolfgang Stark', attendance: 36900, notes: 'Defoe gol' },
  { match_number: 18, stage: 'group', match_date: '2010-06-23T20:30:00+02:00', home_code: 'USA', away_code: 'ALG', home_score: 1, away_score: 0, venue_slug: 'loftus-versfeld', referee: 'Frank de Bleeckere', attendance: 35800, notes: 'Donovan gol min 91 minuto histórico. USA gana grupo' },
  // ── GRUPO D (GER, GHA, AUS, SRB) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '2010-06-13T16:00:00+02:00', home_code: 'GER', away_code: 'AUS', home_score: 4, away_score: 0, venue_slug: 'moses-mabhida', referee: 'Marco Rodríguez', attendance: 62700, notes: 'Klose, Podolski, Cacau' },
  { match_number: 20, stage: 'group', match_date: '2010-06-13T20:30:00+02:00', home_code: 'SRB', away_code: 'GHA', home_score: 0, away_score: 1, venue_slug: 'loftus-versfeld', referee: 'Héctor Baldassi', attendance: 38800, notes: 'Asamoah Gyan penalti' },
  { match_number: 21, stage: 'group', match_date: '2010-06-18T16:00:00+02:00', home_code: 'GER', away_code: 'SRB', home_score: 0, away_score: 1, venue_slug: 'nelson-mandela-bay', referee: 'Alberto Undiano Mallenco', attendance: 38000, notes: 'Klose roja. GER cae primera vez vs SRB' },
  { match_number: 22, stage: 'group', match_date: '2010-06-19T13:30:00+02:00', home_code: 'GHA', away_code: 'AUS', home_score: 1, away_score: 1, venue_slug: 'royal-bafokeng', referee: 'Roberto Rosetti', attendance: 34800 },
  { match_number: 23, stage: 'group', match_date: '2010-06-23T16:00:00+02:00', home_code: 'GHA', away_code: 'GER', home_score: 0, away_score: 1, venue_slug: 'soccer-city', referee: 'Carlos Simon', attendance: 83400, notes: 'Özil gol. Ambos clasifican' },
  { match_number: 24, stage: 'group', match_date: '2010-06-23T16:00:00+02:00', home_code: 'AUS', away_code: 'SRB', home_score: 2, away_score: 1, venue_slug: 'mbombela-stadium', referee: 'Jorge Larrionda', attendance: 37800 },
  // ── GRUPO E (NED, JPN, DEN, CMR) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '2010-06-14T13:30:00+02:00', home_code: 'NED', away_code: 'DEN', home_score: 2, away_score: 0, venue_slug: 'soccer-city', referee: 'Stéphane Lannoy', attendance: 83400 },
  { match_number: 26, stage: 'group', match_date: '2010-06-14T16:00:00+02:00', home_code: 'JPN', away_code: 'CMR', home_score: 1, away_score: 0, venue_slug: 'free-state-stadium', referee: 'Olegário Benquerença', attendance: 30600 },
  { match_number: 27, stage: 'group', match_date: '2010-06-19T16:00:00+02:00', home_code: 'NED', away_code: 'JPN', home_score: 1, away_score: 0, venue_slug: 'moses-mabhida', referee: 'Héctor Baldassi', attendance: 62000 },
  { match_number: 28, stage: 'group', match_date: '2010-06-19T20:30:00+02:00', home_code: 'CMR', away_code: 'DEN', home_score: 1, away_score: 2, venue_slug: 'loftus-versfeld', referee: 'Yuichi Nishimura', attendance: 38800 },
  { match_number: 29, stage: 'group', match_date: '2010-06-24T20:30:00+02:00', home_code: 'DEN', away_code: 'JPN', home_score: 1, away_score: 3, venue_slug: 'royal-bafokeng', referee: 'Jorge Larrionda', attendance: 27970, notes: 'Honda y Endo dos tiros libres directos espectaculares' },
  { match_number: 30, stage: 'group', match_date: '2010-06-24T20:30:00+02:00', home_code: 'CMR', away_code: 'NED', home_score: 1, away_score: 2, venue_slug: 'green-point-stadium', referee: 'Pablo Pozo', attendance: 63100 },
  // ── GRUPO F (PAR, SVK, NZL, ITA) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '2010-06-14T20:30:00+02:00', home_code: 'ITA', away_code: 'PAR', home_score: 1, away_score: 1, venue_slug: 'green-point-stadium', referee: 'Benito Archundia', attendance: 62900 },
  { match_number: 32, stage: 'group', match_date: '2010-06-15T13:30:00+02:00', home_code: 'NZL', away_code: 'SVK', home_score: 1, away_score: 1, venue_slug: 'royal-bafokeng', referee: 'Jorge Larrionda', attendance: 23900, notes: 'NZL primer Mundial 28 años' },
  { match_number: 33, stage: 'group', match_date: '2010-06-20T13:30:00+02:00', home_code: 'SVK', away_code: 'PAR', home_score: 0, away_score: 2, venue_slug: 'free-state-stadium', referee: 'Eddy Maillet', attendance: 26600 },
  { match_number: 34, stage: 'group', match_date: '2010-06-20T16:00:00+02:00', home_code: 'ITA', away_code: 'NZL', home_score: 1, away_score: 1, venue_slug: 'mbombela-stadium', referee: 'Carlos Batres', attendance: 38700, notes: '★ NZL milagro empate. Shane Smeltz gol al 7. Iaquinta empate penalti' },
  { match_number: 35, stage: 'group', match_date: '2010-06-24T16:00:00+02:00', home_code: 'SVK', away_code: 'ITA', home_score: 3, away_score: 2, venue_slug: 'ellis-park-stadium', referee: 'Howard Webb', attendance: 53400, notes: '★ ITA CAMPEONA VIGENTE ELIMINADA EN GRUPOS. Vittek doblete. Quagliarella gol al 92 ya tarde. Lippi se va' },
  { match_number: 36, stage: 'group', match_date: '2010-06-24T16:00:00+02:00', home_code: 'PAR', away_code: 'NZL', home_score: 0, away_score: 0, venue_slug: 'peter-mokaba', referee: 'Roberto Rosetti', attendance: 34800 },
  // ── GRUPO G (BRA, POR, CIV, PRK) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '2010-06-15T16:00:00+02:00', home_code: 'CIV', away_code: 'POR', home_score: 0, away_score: 0, venue_slug: 'nelson-mandela-bay', referee: 'Jorge Larrionda', attendance: 37000 },
  { match_number: 38, stage: 'group', match_date: '2010-06-15T20:30:00+02:00', home_code: 'BRA', away_code: 'PRK', home_score: 2, away_score: 1, venue_slug: 'ellis-park-stadium', referee: 'Viktor Kassai', attendance: 54700, notes: 'PRK regreso 44 años después de 1966. Maicon golazo' },
  { match_number: 39, stage: 'group', match_date: '2010-06-20T20:30:00+02:00', home_code: 'BRA', away_code: 'CIV', home_score: 3, away_score: 1, venue_slug: 'soccer-city', referee: 'Stéphane Lannoy', attendance: 84300, notes: 'Drogba debuta jugando con mascara facial tras fractura' },
  { match_number: 40, stage: 'group', match_date: '2010-06-21T13:30:00+02:00', home_code: 'POR', away_code: 'PRK', home_score: 7, away_score: 0, venue_slug: 'green-point-stadium', referee: 'Pablo Pozo', attendance: 63600, notes: '★ MAYOR PALIZA del Mundial. Tiago doblete, Cristiano Ronaldo gol' },
  { match_number: 41, stage: 'group', match_date: '2010-06-25T16:00:00+02:00', home_code: 'POR', away_code: 'BRA', home_score: 0, away_score: 0, venue_slug: 'moses-mabhida', referee: 'Benito Archundia', attendance: 62700 },
  { match_number: 42, stage: 'group', match_date: '2010-06-25T16:00:00+02:00', home_code: 'PRK', away_code: 'CIV', home_score: 0, away_score: 3, venue_slug: 'mbombela-stadium', referee: 'Pablo Pozo', attendance: 34700 },
  // ── GRUPO H (ESP, CHI, SUI, HON) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '2010-06-16T13:30:00+02:00', home_code: 'HON', away_code: 'CHI', home_score: 0, away_score: 1, venue_slug: 'mbombela-stadium', referee: 'Eddy Maillet', attendance: 32800 },
  { match_number: 44, stage: 'group', match_date: '2010-06-16T20:30:00+02:00', home_code: 'ESP', away_code: 'SUI', home_score: 0, away_score: 1, venue_slug: 'moses-mabhida', referee: 'Howard Webb', attendance: 62500, notes: '★★ "MEDIA ESPAÑA DA POR PERDIDA LA COPA". Gelson Fernandes gol min 52. Del Bosque mantiene el bloque, decisión clave' },
  { match_number: 45, stage: 'group', match_date: '2010-06-21T16:00:00+02:00', home_code: 'CHI', away_code: 'SUI', home_score: 1, away_score: 0, venue_slug: 'nelson-mandela-bay', referee: 'Khalil Al Ghamdi', attendance: 34900 },
  { match_number: 46, stage: 'group', match_date: '2010-06-21T20:30:00+02:00', home_code: 'ESP', away_code: 'HON', home_score: 2, away_score: 0, venue_slug: 'ellis-park-stadium', referee: 'Yuichi Nishimura', attendance: 54400, notes: 'Villa doblete' },
  { match_number: 47, stage: 'group', match_date: '2010-06-25T20:30:00+02:00', home_code: 'CHI', away_code: 'ESP', home_score: 1, away_score: 2, venue_slug: 'loftus-versfeld', referee: 'Marco Rodríguez', attendance: 42100, notes: 'Villa, Iniesta. ESP gana grupo' },
  { match_number: 48, stage: 'group', match_date: '2010-06-25T20:30:00+02:00', home_code: 'SUI', away_code: 'HON', home_score: 0, away_score: 0, venue_slug: 'free-state-stadium', referee: 'Subkhiddin Mohd Salleh', attendance: 28000 },
  // ── OCTAVOS ── 26-29 jun ─────────────────────────────────
  { match_number: 49, stage: 'r16', match_date: '2010-06-26T16:00:00+02:00', home_code: 'URU', away_code: 'KOR', home_score: 2, away_score: 1, venue_slug: 'nelson-mandela-bay', referee: 'Wolfgang Stark', attendance: 30597, notes: 'Suárez doblete' },
  { match_number: 50, stage: 'r16', match_date: '2010-06-26T20:30:00+02:00', home_code: 'USA', away_code: 'GHA', home_score: 1, away_score: 2, venue_slug: 'royal-bafokeng', referee: 'Viktor Kassai', attendance: 34976, notes: 'Asamoah Gyan gol oro en prórroga. USA fuera' },
  { match_number: 51, stage: 'r16', match_date: '2010-06-27T16:00:00+02:00', home_code: 'GER', away_code: 'ENG', home_score: 4, away_score: 1, venue_slug: 'free-state-stadium', referee: 'Jorge Larrionda', attendance: 40510, notes: '★★ "GOL FANTASMA" DE LAMPARD. Disparo lejano que rebota en larguero, pica detrás de línea, vuelve al campo. Larrionda no concede. ENG humillada' },
  { match_number: 52, stage: 'r16', match_date: '2010-06-27T20:30:00+02:00', home_code: 'ARG', away_code: 'MEX', home_score: 3, away_score: 1, venue_slug: 'soccer-city', referee: 'Roberto Rosetti', attendance: 84377, notes: '★ TEVEZ GOL FUERA DE JUEGO CLARÍSIMO no anulado. Higuaín y Tevez. MEX protesta' },
  { match_number: 53, stage: 'r16', match_date: '2010-06-28T16:00:00+02:00', home_code: 'NED', away_code: 'SVK', home_score: 2, away_score: 1, venue_slug: 'moses-mabhida', referee: 'Alberto Undiano Mallenco', attendance: 61962 },
  { match_number: 54, stage: 'r16', match_date: '2010-06-28T20:30:00+02:00', home_code: 'BRA', away_code: 'CHI', home_score: 3, away_score: 0, venue_slug: 'ellis-park-stadium', referee: 'Howard Webb', attendance: 54096, notes: 'Juan, Luis Fabiano, Robinho' },
  { match_number: 55, stage: 'r16', match_date: '2010-06-29T16:00:00+02:00', home_code: 'PAR', away_code: 'JPN', home_score: 0, away_score: 0, home_score_pk: 5, away_score_pk: 3, venue_slug: 'loftus-versfeld', referee: 'Frank de Bleeckere', attendance: 36742, notes: 'Penaltis. JPN falla Komano (larguero)' },
  { match_number: 56, stage: 'r16', match_date: '2010-06-29T20:30:00+02:00', home_code: 'ESP', away_code: 'POR', home_score: 1, away_score: 0, venue_slug: 'green-point-stadium', referee: 'Héctor Baldassi', attendance: 62955, notes: 'Villa gol min 63. ESP a cuartos' },
  // ── CUARTOS ── 2-3 jul ───────────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '2010-07-02T16:00:00+02:00', home_code: 'NED', away_code: 'BRA', home_score: 2, away_score: 1, venue_slug: 'nelson-mandela-bay', referee: 'Yuichi Nishimura', attendance: 40186, notes: '★ NED REMONTADA HISTORICA. Robinho gol primero, Sneijder doblete remontada. Felipe Melo roja. BRA eliminada' },
  { match_number: 58, stage: 'qf', match_date: '2010-07-02T20:30:00+02:00', home_code: 'URU', away_code: 'GHA', home_score: 1, away_score: 1, home_score_pk: 4, away_score_pk: 2, venue_slug: 'soccer-city', referee: 'Olegário Benquerença', attendance: 84017, notes: '★★★ "MANO DE SUAREZ". GHA penalti último minuto, ASAMOAH GYAN ESTRELLA AL LARGUERO. Penaltis URU 4-2. SUAREZ EXPULSADO. AFRICA ENTRA EN LUTO. La imagen del Mundial' },
  { match_number: 59, stage: 'qf', match_date: '2010-07-03T16:00:00+02:00', home_code: 'ARG', away_code: 'GER', home_score: 0, away_score: 4, venue_slug: 'green-point-stadium', referee: 'Ravshan Irmatov', attendance: 64100, notes: '★ ARG HUMILLACION. Müller, Klose doblete, Friedrich. Maradona despedido después' },
  { match_number: 60, stage: 'qf', match_date: '2010-07-03T20:30:00+02:00', home_code: 'PAR', away_code: 'ESP', home_score: 0, away_score: 1, venue_slug: 'ellis-park-stadium', referee: 'Carlos Batres', attendance: 55359, notes: '★ Villa gol min 83. Cardozo penalti FALLADO con Casillas estrellada en poste y Villa larguero también. ESP a semis' },
  // ── SEMIS ── 6-7 jul ─────────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '2010-07-06T20:30:00+02:00', home_code: 'URU', away_code: 'NED', home_score: 2, away_score: 3, venue_slug: 'green-point-stadium', referee: 'Ravshan Irmatov', attendance: 62479, notes: 'van Bronckhorst golazo desde 30m. Forlán empata zurdazo. Sneijder y Robben definen. NED a final' },
  { match_number: 62, stage: 'sf', match_date: '2010-07-07T20:30:00+02:00', home_code: 'GER', away_code: 'ESP', home_score: 0, away_score: 1, venue_slug: 'moses-mabhida', referee: 'Viktor Kassai', attendance: 60960, notes: '★★ ESP A LA FINAL. CARLES PUYOL CABEZAZO CÓRNER min 73 tras córner Xavi. La imagen: 1,78m de Puyol saltando entre gigantes alemanes. ESP a su primera final' },
  // ── 3er PUESTO ── 10 jul ─────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '2010-07-10T20:30:00+02:00', home_code: 'URU', away_code: 'GER', home_score: 2, away_score: 3, venue_slug: 'nelson-mandela-bay', referee: 'Benito Archundia', attendance: 36254, notes: '★ Müller, Jansen, Khedira. URU 4o lugar, gran Mundial. FORLÁN BALÓN DE ORO MUNDIAL' },
  // ── FINAL ── 11 jul ──────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '2010-07-11T20:30:00+02:00', home_code: 'ESP', away_code: 'NED', home_score: 1, away_score: 0, venue_slug: 'soccer-city', referee: 'Howard Webb', attendance: 84490, notes: '★★★★ ESPAÑA CAMPEONA DEL MUNDO POR PRIMERA VEZ EN SU HISTORIA. GOL DE ANDRES INIESTA MIN 116 EN PRORROGA tras pase de Cesc Fabregas. CASILLAS CAPITAN, levanta la copa. Iniesta se quita camiseta enseña "DANI JARQUE SIEMPRE CON NOSOTROS" (compañero CD Espanyol fallecido 9 ago 2009 por infarto). 14 amarillas + roja Heitinga al 109 (la final más sucia de la historia). NIGEL DE JONG PATADA AL PECHO A XABI ALONSO min 28 sin roja. Howard Webb arbitro. Vicente del Bosque seleccionador. Primer país en ganar Mundial tras perder primer partido' },
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

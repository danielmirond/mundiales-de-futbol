/**
 * Seed los 64 partidos del Mundial Brasil 2014.
 *
 * 32 selecciones, 64 partidos, 12 estadios.
 *
 * Hitos:
 *  - ★★★ ALEMANIA CAMPEONA. Final 1-0 vs ARG en Maracaná. Mario Götze
 *    gol min 113 en prórroga, asistencia Schürrle. Klose retirado tras
 *    el torneo con record 16 goles Mundiales (supera Ronaldo 15).
 *  - ★★★ MINEIRAZO: BRA 1-7 ALE en semifinal en el Mineirão. 5 goles en
 *    18 minutos (11-29). Brasil pierde toda dignidad jugando en casa.
 *    Schürrle, Klose, Toni Kroos, Müller. Marcador final más doloroso
 *    de la historia brasileña.
 *  - BRA pierde 3o puesto 0-3 vs NED. Tercer-cuarto puesto sin brillo.
 *    Felipão entrenador despedido. Dunga sucede.
 *  - SUÁREZ MORDEDURA A CHIELLINI (URU-ITA grupos). FIFA suspende 9
 *    partidos + 4 meses fútbol activo. Récord histórico de sanción.
 *  - JAMES RODRÍGUEZ Bota de Oro y volea contra URU oct (mejor gol
 *    del Mundial). Colombia cuartos, su mejor Mundial.
 *  - ROBBEN bestia: 4 goles, asistencias. NED tercera.
 *  - COSTA RICA SORPRESA: cuartos, eliminada por NED en penaltis.
 *    Navas heroico.
 *  - TIM HOWARD 16 paradas RECORD vs BEL oct (perdió 1-2 prórroga).
 *  - USA elimina al ESP campeón vigente. ESP cae 5-1 vs NED grupos
 *    (Van Persie cabezazo histórico, Robben).
 *  - INGLATERRA y ITALIA eliminadas en grupos. Pirlo se despide
 *    selecciónal.
 *
 * Datos verificados con FIFA archives, Wikipedia, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-2014.ts
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

const YEAR = 2014;

const TEAMS = [
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'COL', name: 'Colombia', conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'CRC', name: 'Costa Rica', conf: 'CONCACAF', flag: '🇨🇷' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'GRE', name: 'Grecia', conf: 'UEFA', flag: '🇬🇷' },
  { code: 'ALG', name: 'Argelia', conf: 'CAF', flag: '🇩🇿' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'NGA', name: 'Nigeria', conf: 'CAF', flag: '🇳🇬' },
  { code: 'ECU', name: 'Ecuador', conf: 'CONMEBOL', flag: '🇪🇨' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'CIV', name: 'Costa de Marfil', conf: 'CAF', flag: '🇨🇮' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'BIH', name: 'Bosnia y Herzegovina', conf: 'UEFA', flag: '🇧🇦' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'CRO', name: 'Croacia', conf: 'UEFA', flag: '🇭🇷' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'AUS', name: 'Australia', conf: 'AFC', flag: '🇦🇺' },
  { code: 'IRN', name: 'Irán', conf: 'AFC', flag: '🇮🇷' },
  { code: 'GHA', name: 'Ghana', conf: 'CAF', flag: '🇬🇭' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'RUS', name: 'Rusia', conf: 'UEFA', flag: '🇷🇺' },
  { code: 'HON', name: 'Honduras', conf: 'CONCACAF', flag: '🇭🇳' },
];

const VENUES = [
  { slug: 'maracana-rio', name: 'Estádio do Maracanã', city: 'Río de Janeiro', country_code: 'BRA', latitude: -22.9122, longitude: -43.2302, surface: 'grass', opened_year: 1950 },
  { slug: 'mineirao', name: 'Mineirão', city: 'Belo Horizonte', country_code: 'BRA', latitude: -19.8658, longitude: -43.9711, surface: 'grass', opened_year: 1965 },
  { slug: 'itaquerao', name: 'Arena Corinthians', city: 'São Paulo', country_code: 'BRA', latitude: -23.5453, longitude: -46.4742, surface: 'grass', opened_year: 2014 },
  { slug: 'castelao-fortaleza', name: 'Estadio Castelão', city: 'Fortaleza', country_code: 'BRA', latitude: -3.8073, longitude: -38.5223, surface: 'grass', opened_year: 1973 },
  { slug: 'fonte-nova', name: 'Arena Fonte Nova', city: 'Salvador', country_code: 'BRA', latitude: -12.9789, longitude: -38.5042, surface: 'grass', opened_year: 2013 },
  { slug: 'beira-rio', name: 'Beira-Rio', city: 'Porto Alegre', country_code: 'BRA', latitude: -30.0653, longitude: -51.2358, surface: 'grass', opened_year: 1969 },
  { slug: 'arena-pantanal', name: 'Arena Pantanal', city: 'Cuiabá', country_code: 'BRA', latitude: -15.6028, longitude: -56.1208, surface: 'grass', opened_year: 2014 },
  { slug: 'arena-amazonia', name: 'Arena da Amazônia', city: 'Manaos', country_code: 'BRA', latitude: -3.0833, longitude: -60.0269, surface: 'grass', opened_year: 2014 },
  { slug: 'arena-pernambuco', name: 'Arena Pernambuco', city: 'Recife', country_code: 'BRA', latitude: -8.0386, longitude: -35.0083, surface: 'grass', opened_year: 2013 },
  { slug: 'mane-garrincha', name: 'Estadio Nacional Mané Garrincha', city: 'Brasilia', country_code: 'BRA', latitude: -15.7833, longitude: -47.8992, surface: 'grass', opened_year: 1974 },
  { slug: 'arena-das-dunas', name: 'Arena das Dunas', city: 'Natal', country_code: 'BRA', latitude: -5.8278, longitude: -35.2125, surface: 'grass', opened_year: 2014 },
  { slug: 'arena-baixada', name: 'Arena da Baixada', city: 'Curitiba', country_code: 'BRA', latitude: -25.4486, longitude: -49.2766, surface: 'grass', opened_year: 1999 },
];

const REFEREES = [
  { full_name: 'Nicola Rizzoli', nationality_code: 'ITA' },
  { full_name: 'Howard Webb', nationality_code: 'ENG' },
  { full_name: 'Cüneyt Çakır', nationality_code: 'TUR' },
  { full_name: 'Ravshan Irmatov', nationality_code: 'UZB' },
  { full_name: 'Marco Rodríguez', nationality_code: 'MEX' },
  { full_name: 'Yuichi Nishimura', nationality_code: 'JPN' },
  { full_name: 'Sandro Ricci', nationality_code: 'BRA' },
  { full_name: 'Jonas Eriksson', nationality_code: 'SWE' },
  { full_name: 'Pedro Proença', nationality_code: 'POR' },
  { full_name: 'Bjorn Kuipers', nationality_code: 'NED' },
  { full_name: 'Joel Aguilar', nationality_code: 'SLV' },
  { full_name: 'Felix Brych', nationality_code: 'GER' },
  { full_name: 'Carlos Vera', nationality_code: 'ECU' },
  { full_name: 'Néstor Pitana', nationality_code: 'ARG' },
  { full_name: 'Wilmar Roldán', nationality_code: 'COL' },
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
  // ── GRUPO A (BRA, MEX, CRO, CMR) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '2014-06-12T17:00:00-03:00', home_code: 'BRA', away_code: 'CRO', home_score: 3, away_score: 1, venue_slug: 'itaquerao', referee: 'Yuichi Nishimura', attendance: 62103, notes: '★ INAUGURAL. Autogol Marcelo min 11 (1er en historia que un brasileño marca contra Brasil). Neymar doblete, Oscar' },
  { match_number: 2,  stage: 'group', match_date: '2014-06-13T13:00:00-03:00', home_code: 'MEX', away_code: 'CMR', home_score: 1, away_score: 0, venue_slug: 'arena-das-dunas', referee: 'Wilmar Roldán', attendance: 39216 },
  { match_number: 3,  stage: 'group', match_date: '2014-06-17T16:00:00-03:00', home_code: 'BRA', away_code: 'MEX', home_score: 0, away_score: 0, venue_slug: 'castelao-fortaleza', referee: 'Cüneyt Çakır', attendance: 60342, notes: 'Ochoa atajadas memorables' },
  { match_number: 4,  stage: 'group', match_date: '2014-06-18T18:00:00-03:00', home_code: 'CMR', away_code: 'CRO', home_score: 0, away_score: 4, venue_slug: 'arena-amazonia', referee: 'Pedro Proença', attendance: 39982 },
  { match_number: 5,  stage: 'group', match_date: '2014-06-23T17:00:00-03:00', home_code: 'CMR', away_code: 'BRA', home_score: 1, away_score: 4, venue_slug: 'mane-garrincha', referee: 'Jonas Eriksson', attendance: 69112 },
  { match_number: 6,  stage: 'group', match_date: '2014-06-23T17:00:00-03:00', home_code: 'CRO', away_code: 'MEX', home_score: 1, away_score: 3, venue_slug: 'arena-pernambuco', referee: 'Ravshan Irmatov', attendance: 41212 },
  // ── GRUPO B (NED, CHI, ESP, AUS) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '2014-06-13T16:00:00-03:00', home_code: 'ESP', away_code: 'NED', home_score: 1, away_score: 5, venue_slug: 'fonte-nova', referee: 'Nicola Rizzoli', attendance: 48173, notes: '★★★ "MASACRE DE SALVADOR". CAMPEÓN VIGENTE HUMILLADO. Van Persie cabezazo histórico estilo "pez voloando", Robben golazo carrera 60m, Sneijder. España 1-5 en su primer partido. Del Bosque sin reaccionar' },
  { match_number: 8,  stage: 'group', match_date: '2014-06-13T19:00:00-03:00', home_code: 'CHI', away_code: 'AUS', home_score: 3, away_score: 1, venue_slug: 'arena-pantanal', referee: 'Noumandiez Doué', attendance: 40275 },
  { match_number: 9,  stage: 'group', match_date: '2014-06-18T16:00:00-03:00', home_code: 'AUS', away_code: 'NED', home_score: 2, away_score: 3, venue_slug: 'beira-rio', referee: 'Djamel Haimoudi', attendance: 42877, notes: 'Cahill golazo' },
  { match_number: 10, stage: 'group', match_date: '2014-06-18T19:00:00-03:00', home_code: 'ESP', away_code: 'CHI', home_score: 0, away_score: 2, venue_slug: 'maracana-rio', referee: 'Marco Rodríguez', attendance: 74101, notes: '★ ESP ELIMINADA EN GRUPOS. Vargas, Aránguiz. Fin de la era dorada española' },
  { match_number: 11, stage: 'group', match_date: '2014-06-23T13:00:00-03:00', home_code: 'AUS', away_code: 'ESP', home_score: 0, away_score: 3, venue_slug: 'arena-baixada', referee: 'Nawaf Shukralla', attendance: 39120, notes: 'Villa último gol oficial con La Roja' },
  { match_number: 12, stage: 'group', match_date: '2014-06-23T13:00:00-03:00', home_code: 'NED', away_code: 'CHI', home_score: 2, away_score: 0, venue_slug: 'itaquerao', referee: 'Howard Webb', attendance: 62996 },
  // ── GRUPO C (COL, GRE, JPN, CIV) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '2014-06-14T13:00:00-03:00', home_code: 'COL', away_code: 'GRE', home_score: 3, away_score: 0, venue_slug: 'mineirao', referee: 'Mark Geiger', attendance: 57174, notes: 'Armero golazo' },
  { match_number: 14, stage: 'group', match_date: '2014-06-14T22:00:00-03:00', home_code: 'CIV', away_code: 'JPN', home_score: 2, away_score: 1, venue_slug: 'arena-pernambuco', referee: 'Enrique Osses', attendance: 40267, notes: 'Drogba entra al 62 y cambia el partido' },
  { match_number: 15, stage: 'group', match_date: '2014-06-19T13:00:00-03:00', home_code: 'COL', away_code: 'CIV', home_score: 2, away_score: 1, venue_slug: 'mane-garrincha', referee: 'Howard Webb', attendance: 68748, notes: 'Quintero, James Rodríguez' },
  { match_number: 16, stage: 'group', match_date: '2014-06-19T19:00:00-03:00', home_code: 'JPN', away_code: 'GRE', home_score: 0, away_score: 0, venue_slug: 'arena-das-dunas', referee: 'Joel Aguilar', attendance: 39485 },
  { match_number: 17, stage: 'group', match_date: '2014-06-24T17:00:00-03:00', home_code: 'JPN', away_code: 'COL', home_score: 1, away_score: 4, venue_slug: 'arena-pantanal', referee: 'Pedro Proença', attendance: 39086, notes: 'James gol y asistencia' },
  { match_number: 18, stage: 'group', match_date: '2014-06-24T17:00:00-03:00', home_code: 'GRE', away_code: 'CIV', home_score: 2, away_score: 1, venue_slug: 'castelao-fortaleza', referee: 'Carlos Vera', attendance: 59095, notes: 'Samaras penalti min 93' },
  // ── GRUPO D (CRC, URU, ITA, ENG) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '2014-06-14T16:00:00-03:00', home_code: 'URU', away_code: 'CRC', home_score: 1, away_score: 3, venue_slug: 'castelao-fortaleza', referee: 'Felix Brych', attendance: 58679, notes: 'CRC remontada histórica' },
  { match_number: 20, stage: 'group', match_date: '2014-06-14T19:00:00-03:00', home_code: 'ENG', away_code: 'ITA', home_score: 1, away_score: 2, venue_slug: 'arena-amazonia', referee: 'Bjorn Kuipers', attendance: 39800, notes: 'Pirlo, Marchisio. Sturridge ENG' },
  { match_number: 21, stage: 'group', match_date: '2014-06-19T16:00:00-03:00', home_code: 'URU', away_code: 'ENG', home_score: 2, away_score: 1, venue_slug: 'itaquerao', referee: 'Carlos Vera', attendance: 62575, notes: 'Suárez doblete (vuelve tras lesión)' },
  { match_number: 22, stage: 'group', match_date: '2014-06-20T13:00:00-03:00', home_code: 'ITA', away_code: 'CRC', home_score: 0, away_score: 1, venue_slug: 'arena-pernambuco', referee: 'Enrique Osses', attendance: 40285, notes: 'Bryan Ruiz gol' },
  { match_number: 23, stage: 'group', match_date: '2014-06-24T13:00:00-03:00', home_code: 'ITA', away_code: 'URU', home_score: 0, away_score: 1, venue_slug: 'arena-das-dunas', referee: 'Marco Rodríguez', attendance: 39575, notes: '★★★ SUAREZ MUERDE A CHIELLINI minuto 80. Diego Godín gol. ITA ELIMINADA. Suárez pena: 9 partidos + 4 meses sin fútbol' },
  { match_number: 24, stage: 'group', match_date: '2014-06-24T13:00:00-03:00', home_code: 'CRC', away_code: 'ENG', home_score: 0, away_score: 0, venue_slug: 'mineirao', referee: 'Djamel Haimoudi', attendance: 57702, notes: 'CRC gana grupo. ENG eliminada con 1 punto' },
  // ── GRUPO E (FRA, SUI, ECU, HON) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '2014-06-15T13:00:00-03:00', home_code: 'SUI', away_code: 'ECU', home_score: 2, away_score: 1, venue_slug: 'mane-garrincha', referee: 'Ravshan Irmatov', attendance: 68351 },
  { match_number: 26, stage: 'group', match_date: '2014-06-15T16:00:00-03:00', home_code: 'FRA', away_code: 'HON', home_score: 3, away_score: 0, venue_slug: 'beira-rio', referee: 'Sandro Ricci', attendance: 43012, notes: 'Benzema doblete' },
  { match_number: 27, stage: 'group', match_date: '2014-06-20T16:00:00-03:00', home_code: 'SUI', away_code: 'FRA', home_score: 2, away_score: 5, venue_slug: 'fonte-nova', referee: 'Bjorn Kuipers', attendance: 51003, notes: 'Benzema, Valbuena' },
  { match_number: 28, stage: 'group', match_date: '2014-06-20T19:00:00-03:00', home_code: 'HON', away_code: 'ECU', home_score: 1, away_score: 2, venue_slug: 'arena-baixada', referee: 'Benjamin Williams', attendance: 39007 },
  { match_number: 29, stage: 'group', match_date: '2014-06-25T13:00:00-03:00', home_code: 'HON', away_code: 'SUI', home_score: 0, away_score: 3, venue_slug: 'arena-amazonia', referee: 'Sandro Ricci', attendance: 39524 },
  { match_number: 30, stage: 'group', match_date: '2014-06-25T17:00:00-03:00', home_code: 'ECU', away_code: 'FRA', home_score: 0, away_score: 0, venue_slug: 'maracana-rio', referee: 'Noumandiez Doué', attendance: 73749 },
  // ── GRUPO F (ARG, BIH, NGA, IRN) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '2014-06-15T19:00:00-03:00', home_code: 'ARG', away_code: 'BIH', home_score: 2, away_score: 1, venue_slug: 'maracana-rio', referee: 'Joel Aguilar', attendance: 74738, notes: 'Messi golazo individual' },
  { match_number: 32, stage: 'group', match_date: '2014-06-16T16:00:00-03:00', home_code: 'IRN', away_code: 'NGA', home_score: 0, away_score: 0, venue_slug: 'arena-baixada', referee: 'Carlos Vera', attendance: 39081 },
  { match_number: 33, stage: 'group', match_date: '2014-06-21T13:00:00-03:00', home_code: 'ARG', away_code: 'IRN', home_score: 1, away_score: 0, venue_slug: 'mineirao', referee: 'Milorad Mažić', attendance: 57698, notes: 'Messi gol min 91 al ángulo' },
  { match_number: 34, stage: 'group', match_date: '2014-06-21T16:00:00-03:00', home_code: 'NGA', away_code: 'BIH', home_score: 1, away_score: 0, venue_slug: 'arena-pantanal', referee: 'Peter O\'Leary', attendance: 39144 },
  { match_number: 35, stage: 'group', match_date: '2014-06-25T17:00:00-03:00', home_code: 'NGA', away_code: 'ARG', home_score: 2, away_score: 3, venue_slug: 'beira-rio', referee: 'Nicola Rizzoli', attendance: 43285, notes: 'Messi doblete' },
  { match_number: 36, stage: 'group', match_date: '2014-06-25T13:00:00-03:00', home_code: 'BIH', away_code: 'IRN', home_score: 3, away_score: 1, venue_slug: 'fonte-nova', referee: 'Carlos Vera', attendance: 48011 },
  // ── GRUPO G (GER, USA, GHA, POR) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '2014-06-16T13:00:00-03:00', home_code: 'GER', away_code: 'POR', home_score: 4, away_score: 0, venue_slug: 'fonte-nova', referee: 'Milorad Mažić', attendance: 51081, notes: 'Müller hat-trick. POR humillado, Pepe roja al 36' },
  { match_number: 38, stage: 'group', match_date: '2014-06-16T19:00:00-03:00', home_code: 'GHA', away_code: 'USA', home_score: 1, away_score: 2, venue_slug: 'arena-das-dunas', referee: 'Jonas Eriksson', attendance: 39760, notes: 'Dempsey gol min 1 (5o más rápido de la historia)' },
  { match_number: 39, stage: 'group', match_date: '2014-06-21T13:00:00-03:00', home_code: 'GER', away_code: 'GHA', home_score: 2, away_score: 2, venue_slug: 'castelao-fortaleza', referee: 'Sandro Ricci', attendance: 59621, notes: 'Klose iguala record Ronaldo (15 goles Mundiales)' },
  { match_number: 40, stage: 'group', match_date: '2014-06-22T18:00:00-03:00', home_code: 'USA', away_code: 'POR', home_score: 2, away_score: 2, venue_slug: 'arena-amazonia', referee: 'Nestor Pitana', attendance: 40123, notes: 'Cristiano Ronaldo asistencia gol Varela min 95' },
  { match_number: 41, stage: 'group', match_date: '2014-06-26T13:00:00-03:00', home_code: 'USA', away_code: 'GER', home_score: 0, away_score: 1, venue_slug: 'arena-pernambuco', referee: 'Ravshan Irmatov', attendance: 41876 },
  { match_number: 42, stage: 'group', match_date: '2014-06-26T13:00:00-03:00', home_code: 'POR', away_code: 'GHA', home_score: 2, away_score: 1, venue_slug: 'mane-garrincha', referee: 'Nawaf Shukralla', attendance: 67540 },
  // ── GRUPO H (BEL, ALG, RUS, KOR) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '2014-06-17T13:00:00-03:00', home_code: 'BEL', away_code: 'ALG', home_score: 2, away_score: 1, venue_slug: 'mineirao', referee: 'Marco Rodríguez', attendance: 56800 },
  { match_number: 44, stage: 'group', match_date: '2014-06-17T19:00:00-03:00', home_code: 'RUS', away_code: 'KOR', home_score: 1, away_score: 1, venue_slug: 'arena-pantanal', referee: 'Nestor Pitana', attendance: 37603 },
  { match_number: 45, stage: 'group', match_date: '2014-06-22T13:00:00-03:00', home_code: 'BEL', away_code: 'RUS', home_score: 1, away_score: 0, venue_slug: 'maracana-rio', referee: 'Felix Brych', attendance: 73819, notes: 'Origi gol min 88' },
  { match_number: 46, stage: 'group', match_date: '2014-06-22T16:00:00-03:00', home_code: 'KOR', away_code: 'ALG', home_score: 2, away_score: 4, venue_slug: 'beira-rio', referee: 'Bjorn Kuipers', attendance: 42732, notes: 'Slimani, Mahrez' },
  { match_number: 47, stage: 'group', match_date: '2014-06-26T17:00:00-03:00', home_code: 'KOR', away_code: 'BEL', home_score: 0, away_score: 1, venue_slug: 'itaquerao', referee: 'Ben Williams', attendance: 61397 },
  { match_number: 48, stage: 'group', match_date: '2014-06-26T17:00:00-03:00', home_code: 'ALG', away_code: 'RUS', home_score: 1, away_score: 1, venue_slug: 'arena-baixada', referee: 'Cüneyt Çakır', attendance: 39311 },
  // ── OCTAVOS ── 28 jun - 1 jul ────────────────────────────
  { match_number: 49, stage: 'r16', match_date: '2014-06-28T13:00:00-03:00', home_code: 'BRA', away_code: 'CHI', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 2, venue_slug: 'mineirao', referee: 'Howard Webb', attendance: 57714, notes: 'Penaltis. Gonzalo Jara estrella el último balón en el poste izquierdo de Cesar' },
  { match_number: 50, stage: 'r16', match_date: '2014-06-28T17:00:00-03:00', home_code: 'COL', away_code: 'URU', home_score: 2, away_score: 0, venue_slug: 'maracana-rio', referee: 'Bjorn Kuipers', attendance: 73804, notes: '★★ JAMES RODRIGUEZ VOLEA DE ORO. Mejor gol del Mundial. Recibe pase pecho, gira al aire, dispara con la cabeza colgando. Imagen del Mundial' },
  { match_number: 51, stage: 'r16', match_date: '2014-06-29T13:00:00-03:00', home_code: 'NED', away_code: 'MEX', home_score: 2, away_score: 1, venue_slug: 'castelao-fortaleza', referee: 'Pedro Proença', attendance: 58817, notes: '★ "NO ERA PENALTI" Robben min 94. Sneijder empata 88, Huntelaar penalti 94. MEX humillada' },
  { match_number: 52, stage: 'r16', match_date: '2014-06-29T17:00:00-03:00', home_code: 'CRC', away_code: 'GRE', home_score: 1, away_score: 1, home_score_pk: 5, away_score_pk: 3, venue_slug: 'arena-pernambuco', referee: 'Ben Williams', attendance: 41242, notes: 'NAVAS héroe atajadas. CRC primera vez en cuartos' },
  { match_number: 53, stage: 'r16', match_date: '2014-06-30T13:00:00-03:00', home_code: 'FRA', away_code: 'NGA', home_score: 2, away_score: 0, venue_slug: 'mane-garrincha', referee: 'Mark Geiger', attendance: 67882, notes: 'Pogba, autogol Yobo' },
  { match_number: 54, stage: 'r16', match_date: '2014-06-30T17:00:00-03:00', home_code: 'GER', away_code: 'ALG', home_score: 2, away_score: 1, venue_slug: 'beira-rio', referee: 'Sandro Ricci', attendance: 43063, notes: 'Schürrle, Özil en prórroga' },
  { match_number: 55, stage: 'r16', match_date: '2014-07-01T13:00:00-03:00', home_code: 'ARG', away_code: 'SUI', home_score: 1, away_score: 0, venue_slug: 'itaquerao', referee: 'Jonas Eriksson', attendance: 63255, notes: 'Di María gol min 118' },
  { match_number: 56, stage: 'r16', match_date: '2014-07-01T17:00:00-03:00', home_code: 'BEL', away_code: 'USA', home_score: 2, away_score: 1, venue_slug: 'fonte-nova', referee: 'Djamel Haimoudi', attendance: 51227, notes: '★ TIM HOWARD 16 PARADAS récord Mundial. De Bruyne, Lukaku. Green gol min 107' },
  // ── CUARTOS ── 4-5 jul ───────────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '2014-07-04T13:00:00-03:00', home_code: 'FRA', away_code: 'GER', home_score: 0, away_score: 1, venue_slug: 'maracana-rio', referee: 'Nestor Pitana', attendance: 74240, notes: 'Hummels cabeza min 13' },
  { match_number: 58, stage: 'qf', match_date: '2014-07-04T17:00:00-03:00', home_code: 'BRA', away_code: 'COL', home_score: 2, away_score: 1, venue_slug: 'castelao-fortaleza', referee: 'Carlos Velasco Carballo', attendance: 60342, notes: 'Thiago Silva, David Luiz. ★ NEYMAR LESIONADO (Zúñiga rodillazo, fractura vértebra). Out hasta final. SIN NEYMAR para semis' },
  { match_number: 59, stage: 'qf', match_date: '2014-07-05T13:00:00-03:00', home_code: 'ARG', away_code: 'BEL', home_score: 1, away_score: 0, venue_slug: 'mane-garrincha', referee: 'Nicola Rizzoli', attendance: 68551, notes: 'Higuaín gol min 8' },
  { match_number: 60, stage: 'qf', match_date: '2014-07-05T17:00:00-03:00', home_code: 'NED', away_code: 'CRC', home_score: 0, away_score: 0, home_score_pk: 4, away_score_pk: 3, venue_slug: 'fonte-nova', referee: 'Ravshan Irmatov', attendance: 51179, notes: '★ "GOLPE TIM KRUL". Van Gaal sustituye portero por Krul justo antes de penaltis para parar. Krul para 2. Pa Navas heroico pero CRC fuera' },
  // ── SEMIS ── 8-9 jul ─────────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '2014-07-08T17:00:00-03:00', home_code: 'BRA', away_code: 'GER', home_score: 1, away_score: 7, venue_slug: 'mineirao', referee: 'Marco Rodríguez', attendance: 58141, notes: '★★★★ "MINEIRAZO" 1-7. Brasil sin Neymar y Silva. 5 GOLES EN 18 MINUTOS (11-29). Klose record 16 goles Mundial. Müller, Khedira, Schürrle (2). Oscar 90+. Marcador mas doloroso historia brasileña. Felipão demolido' },
  { match_number: 62, stage: 'sf', match_date: '2014-07-09T17:00:00-03:00', home_code: 'NED', away_code: 'ARG', home_score: 0, away_score: 0, home_score_pk: 2, away_score_pk: 4, venue_slug: 'itaquerao', referee: 'Cüneyt Çakır', attendance: 63267, notes: 'Penaltis. Sergio Romero atajadas. Vlaar y Sneijder fallan' },
  // ── 3er PUESTO ── 12 jul ─────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '2014-07-12T17:00:00-03:00', home_code: 'BRA', away_code: 'NED', home_score: 0, away_score: 3, venue_slug: 'mane-garrincha', referee: 'Djamel Haimoudi', attendance: 68034, notes: '★ BRA SIN HONOR. Van Persie, Blind, Wijnaldum. Brasil pierde 2 partidos consecutivos con 10 goles encajados (1-7 y 0-3). Felipão despedido' },
  // ── FINAL ── 13 jul ──────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '2014-07-13T16:00:00-03:00', home_code: 'GER', away_code: 'ARG', home_score: 1, away_score: 0, venue_slug: 'maracana-rio', referee: 'Nicola Rizzoli', attendance: 74738, notes: '★★★★ ALEMANIA CAMPEONA DEL MUNDO (4° título, primero como Alemania reunificada). GOL DE MARIO GÖTZE MIN 113 EN PRÓRROGA. Asistencia André Schürrle desde banda izquierda, control pecho + zurdazo. Higuaín y Messi tuvieron oportunidades enormes que no aprovecharon. KLOSE retirado tras el Mundial con 16 goles (record histórico Mundiales). Löw seleccionador. Lahm capitán' },
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

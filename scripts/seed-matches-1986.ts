/**
 * Seed los 52 partidos del Mundial México 1986.
 *
 * Cambio de formato definitivo: 24 selecciones, 6 grupos de 4
 * (36 grupos) + OCTAVOS (8) + cuartos (4) + semis (2) + 3o + final = 52.
 * Top 2 de cada grupo + 4 mejores terceros = 16 a octavos.
 *
 * Mundial historico:
 *  - "MANO DE DIOS" + "GOL DEL SIGLO" (match #47, ARG 2-1 ENG cuartos,
 *    22 jun, Azteca): los dos goles más famosos del fútbol moderno
 *    separados por 4 minutos. Ver historia #1 ya publicada.
 *  - MARADONA Balón de Oro, Argentina campeón. La mejor actuación
 *    individual de la historia (5 goles + 5 asistencias en 7 partidos).
 *  - GARY LINEKER Bota de Oro con 6 goles (sin que ENG pase semis).
 *  - MARRUECOS primer país africano en clasificar a octavos.
 *  - MÉXICO: cuartos en casa, eliminada por FRG en penaltis.
 *  - DINAMARCA "danish dynamite" gana grupo arrasando, cae 1-5 vs ESP
 *    octavos (Butragueño 4 goles).
 *  - "MANO DE DIOS" se acuñó al día siguiente en rueda de prensa
 *    Maradona: "un poco con la cabeza de Maradona y un poco con la
 *    mano de Dios".
 *
 * Datos verificados con FIFA archives, Wikipedia (1986 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1986.ts
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

const YEAR = 1986;

const TEAMS = [
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'DEN', name: 'Dinamarca', conf: 'UEFA', flag: '🇩🇰' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'MAR', name: 'Marruecos', conf: 'CAF', flag: '🇲🇦' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'POR', name: 'Portugal', conf: 'UEFA', flag: '🇵🇹' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
  { code: 'NIR', name: 'Irlanda del Norte', conf: 'UEFA', flag: '🇬🇧' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'CAN', name: 'Canadá', conf: 'CONCACAF', flag: '🇨🇦' },
  { code: 'ALG', name: 'Argelia', conf: 'CAF', flag: '🇩🇿' },
  { code: 'IRQ', name: 'Irak', conf: 'AFC', flag: '🇮🇶' },
];

const VENUES = [
  { slug: 'estadio-azteca', name: 'Estadio Azteca', city: 'Ciudad de México', country_code: 'MEX', latitude: 19.3029, longitude: -99.1505, surface: 'grass', opened_year: 1966 },
  { slug: 'estadio-olimpico-universitario', name: 'Estadio Olímpico Universitario', city: 'Ciudad de México', country_code: 'MEX', latitude: 19.3318, longitude: -99.1819, surface: 'grass', opened_year: 1952 },
  { slug: 'estadio-cuauhtemoc', name: 'Estadio Cuauhtémoc', city: 'Puebla', country_code: 'MEX', latitude: 19.0529, longitude: -98.2406, surface: 'grass', opened_year: 1968 },
  { slug: 'estadio-jalisco', name: 'Estadio Jalisco', city: 'Guadalajara', country_code: 'MEX', latitude: 20.7016, longitude: -103.3284, surface: 'grass', opened_year: 1960 },
  { slug: 'estadio-tres-de-marzo', name: 'Estadio Tres de Marzo', city: 'Zapopan', country_code: 'MEX', latitude: 20.7397, longitude: -103.4007, surface: 'grass', opened_year: 1971 },
  { slug: 'estadio-nou-camp-leon', name: 'Estadio Nou Camp León', city: 'León', country_code: 'MEX', latitude: 21.1213, longitude: -101.6918, surface: 'grass', opened_year: 1967 },
  { slug: 'estadio-sergio-leon-chavez', name: 'Estadio Sergio León Chávez', city: 'Irapuato', country_code: 'MEX', latitude: 20.6783, longitude: -101.3520, surface: 'grass', opened_year: 1962 },
  { slug: 'estadio-corregidora', name: 'Estadio Corregidora', city: 'Querétaro', country_code: 'MEX', latitude: 20.5781, longitude: -100.3892, surface: 'grass', opened_year: 1985 },
  { slug: 'estadio-neza-86', name: 'Estadio Neza 86', city: 'Nezahualcóyotl', country_code: 'MEX', latitude: 19.4034, longitude: -98.9981, surface: 'grass', opened_year: 1985, closed_year: 2002 },
  { slug: 'estadio-luis-dosal-toluca', name: 'Estadio Luis Dosal', city: 'Toluca', country_code: 'MEX', latitude: 19.2820, longitude: -99.6790, surface: 'grass', opened_year: 1954 },
  { slug: 'estadio-tecnologico-monterrey', name: 'Estadio Tecnológico', city: 'Monterrey', country_code: 'MEX', latitude: 25.6815, longitude: -100.3110, surface: 'grass', opened_year: 1950 },
  { slug: 'estadio-universitario-monterrey', name: 'Estadio Universitario', city: 'Monterrey', country_code: 'MEX', latitude: 25.7204, longitude: -100.3127, surface: 'grass', opened_year: 1967 },
];

const REFEREES = [
  { full_name: 'Ali Bin Nasser', nationality_code: 'TUN' },
  { full_name: 'Romualdo Arppi Filho', nationality_code: 'BRA' },
  { full_name: 'Erik Fredriksson', nationality_code: 'SWE' },
  { full_name: 'Joël Quiniou', nationality_code: 'FRA' },
  { full_name: 'Paolo Casarin', nationality_code: 'ITA' },
  { full_name: 'Volker Roth', nationality_code: 'FRG' },
  { full_name: 'Carlos Espósito', nationality_code: 'ARG' },
  { full_name: 'Edwin Picon-Ackong', nationality_code: 'MUS' },
  { full_name: 'Chris Bambridge', nationality_code: 'AUS' },
  { full_name: 'Hernan Silva', nationality_code: 'CHI' },
  { full_name: 'Vojtech Christov', nationality_code: 'TCH' },
  { full_name: 'André Daina', nationality_code: 'SUI' },
  { full_name: 'Jan Keizer', nationality_code: 'NED' },
  { full_name: 'Berny Ulloa', nationality_code: 'CRC' },
  { full_name: 'George Courtney', nationality_code: 'ENG' },
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
  // ── GROUP A (BUL, ITA, ARG, KOR) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '1986-05-31T12:00:00-06:00', home_code: 'BUL', away_code: 'ITA', home_score: 1, away_score: 1, venue_slug: 'estadio-azteca', referee: 'Erik Fredriksson', attendance: 96000, notes: 'Inaugural en Azteca' },
  { match_number: 2,  stage: 'group', match_date: '1986-06-02T12:00:00-06:00', home_code: 'KOR', away_code: 'ARG', home_score: 1, away_score: 3, venue_slug: 'estadio-olimpico-universitario', referee: 'Vojtech Christov', attendance: 60000, notes: 'Maradona arranca con 3 asistencias en su 1er Mundial como capitan' },
  { match_number: 3,  stage: 'group', match_date: '1986-06-05T16:00:00-06:00', home_code: 'ITA', away_code: 'ARG', home_score: 1, away_score: 1, venue_slug: 'estadio-cuauhtemoc', referee: 'Jan Keizer', attendance: 32000, notes: 'Maradona gol' },
  { match_number: 4,  stage: 'group', match_date: '1986-06-05T16:00:00-06:00', home_code: 'KOR', away_code: 'BUL', home_score: 1, away_score: 1, venue_slug: 'estadio-olimpico-universitario', referee: 'Volker Roth', attendance: 32000 },
  { match_number: 5,  stage: 'group', match_date: '1986-06-10T12:00:00-06:00', home_code: 'ARG', away_code: 'BUL', home_score: 2, away_score: 0, venue_slug: 'estadio-olimpico-universitario', referee: 'Berny Ulloa', attendance: 65000 },
  { match_number: 6,  stage: 'group', match_date: '1986-06-10T12:00:00-06:00', home_code: 'ITA', away_code: 'KOR', home_score: 3, away_score: 2, venue_slug: 'estadio-cuauhtemoc', referee: 'David Socha', attendance: 25000 },
  // ── GROUP B (MEX, BEL, PAR, IRQ) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '1986-06-03T12:00:00-06:00', home_code: 'BEL', away_code: 'MEX', home_score: 1, away_score: 2, venue_slug: 'estadio-azteca', referee: 'Carlos Espósito', attendance: 110000, notes: 'México empieza con triunfo en casa. Quirarte y Sanchez goles' },
  { match_number: 8,  stage: 'group', match_date: '1986-06-04T16:00:00-06:00', home_code: 'PAR', away_code: 'IRQ', home_score: 1, away_score: 0, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Jamal Al-Sharif', attendance: 14000 },
  { match_number: 9,  stage: 'group', match_date: '1986-06-07T12:00:00-06:00', home_code: 'MEX', away_code: 'PAR', home_score: 1, away_score: 1, venue_slug: 'estadio-azteca', referee: 'Volker Roth', attendance: 110000 },
  { match_number: 10, stage: 'group', match_date: '1986-06-08T16:00:00-06:00', home_code: 'BEL', away_code: 'IRQ', home_score: 2, away_score: 1, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Berny Ulloa', attendance: 13000 },
  { match_number: 11, stage: 'group', match_date: '1986-06-11T12:00:00-06:00', home_code: 'MEX', away_code: 'IRQ', home_score: 1, away_score: 0, venue_slug: 'estadio-azteca', referee: 'André Daina', attendance: 103000 },
  { match_number: 12, stage: 'group', match_date: '1986-06-11T12:00:00-06:00', home_code: 'BEL', away_code: 'PAR', home_score: 2, away_score: 2, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Bogdan Dochev', attendance: 16000 },
  // ── GROUP C (FRA, URS, CAN, HUN) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1986-06-01T12:00:00-06:00', home_code: 'CAN', away_code: 'FRA', home_score: 0, away_score: 1, venue_slug: 'estadio-nou-camp-leon', referee: 'Carlos Silva', attendance: 65000 },
  { match_number: 14, stage: 'group', match_date: '1986-06-02T16:00:00-06:00', home_code: 'URS', away_code: 'HUN', home_score: 6, away_score: 0, venue_slug: 'estadio-sergio-leon-chavez', referee: 'Edwin Picon-Ackong', attendance: 16000, notes: 'Belanov hat-trick. URS arrolladora' },
  { match_number: 15, stage: 'group', match_date: '1986-06-05T16:00:00-06:00', home_code: 'CAN', away_code: 'HUN', home_score: 0, away_score: 2, venue_slug: 'estadio-nou-camp-leon', referee: 'Edwin Picon-Ackong', attendance: 13000 },
  { match_number: 16, stage: 'group', match_date: '1986-06-05T16:00:00-06:00', home_code: 'FRA', away_code: 'URS', home_score: 1, away_score: 1, venue_slug: 'estadio-nou-camp-leon', referee: 'Romualdo Arppi Filho', attendance: 36000 },
  { match_number: 17, stage: 'group', match_date: '1986-06-09T16:00:00-06:00', home_code: 'HUN', away_code: 'FRA', home_score: 0, away_score: 3, venue_slug: 'estadio-nou-camp-leon', referee: 'David Socha', attendance: 32000, notes: 'Platini gol, Tigana, Carre magique funciona' },
  { match_number: 18, stage: 'group', match_date: '1986-06-09T16:00:00-06:00', home_code: 'URS', away_code: 'CAN', home_score: 2, away_score: 0, venue_slug: 'estadio-sergio-leon-chavez', referee: 'Berny Ulloa', attendance: 12000 },
  // ── GROUP D (BRA, ESP, ALG, NIR) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1986-06-01T12:00:00-06:00', home_code: 'BRA', away_code: 'ESP', home_score: 1, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Christopher Bambridge', attendance: 35000, notes: 'Sócrates gol al 62. Brasil empieza ganando, pero será sombra de 82' },
  { match_number: 20, stage: 'group', match_date: '1986-06-03T16:00:00-06:00', home_code: 'ALG', away_code: 'NIR', home_score: 1, away_score: 1, venue_slug: 'estadio-tres-de-marzo', referee: 'Hernan Silva', attendance: 22000 },
  { match_number: 21, stage: 'group', match_date: '1986-06-06T16:00:00-06:00', home_code: 'BRA', away_code: 'ALG', home_score: 1, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Jamal Al-Sharif', attendance: 51000 },
  { match_number: 22, stage: 'group', match_date: '1986-06-07T16:00:00-06:00', home_code: 'NIR', away_code: 'ESP', home_score: 1, away_score: 2, venue_slug: 'estadio-tres-de-marzo', referee: 'Carlos Silva', attendance: 18000 },
  { match_number: 23, stage: 'group', match_date: '1986-06-12T16:00:00-06:00', home_code: 'BRA', away_code: 'NIR', home_score: 3, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Antonio Marquez', attendance: 51000 },
  { match_number: 24, stage: 'group', match_date: '1986-06-12T16:00:00-06:00', home_code: 'ALG', away_code: 'ESP', home_score: 0, away_score: 3, venue_slug: 'estadio-tres-de-marzo', referee: 'Bogdan Dochev', attendance: 25000 },
  // ── GROUP E (FRG, URU, DEN, SCO) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '1986-06-04T16:00:00-06:00', home_code: 'URU', away_code: 'FRG', home_score: 1, away_score: 1, venue_slug: 'estadio-corregidora', referee: 'Vojtech Christov', attendance: 30000 },
  { match_number: 26, stage: 'group', match_date: '1986-06-04T16:00:00-06:00', home_code: 'SCO', away_code: 'DEN', home_score: 0, away_score: 1, venue_slug: 'estadio-neza-86', referee: 'Ioan Igna', attendance: 19000 },
  { match_number: 27, stage: 'group', match_date: '1986-06-08T12:00:00-06:00', home_code: 'FRG', away_code: 'SCO', home_score: 2, away_score: 1, venue_slug: 'estadio-corregidora', referee: 'Ioan Igna', attendance: 30000 },
  { match_number: 28, stage: 'group', match_date: '1986-06-08T12:00:00-06:00', home_code: 'DEN', away_code: 'URU', home_score: 6, away_score: 1, venue_slug: 'estadio-neza-86', referee: 'Antonio Marquez', attendance: 27000, notes: '★ DANISH DYNAMITE en su mejor versión. Laudrup, Elkjær. URU humillada (Bossio expulsado al 19)' },
  { match_number: 29, stage: 'group', match_date: '1986-06-13T16:00:00-06:00', home_code: 'SCO', away_code: 'URU', home_score: 0, away_score: 0, venue_slug: 'estadio-neza-86', referee: 'Joel Quiniou', attendance: 17000, notes: 'URU 10 jugadores tras expulsion Batista al 0:55' },
  { match_number: 30, stage: 'group', match_date: '1986-06-13T16:00:00-06:00', home_code: 'DEN', away_code: 'FRG', home_score: 2, away_score: 0, venue_slug: 'estadio-corregidora', referee: 'Romualdo Arppi Filho', attendance: 36000, notes: 'DEN gana grupo invicta arrasando' },
  // ── GROUP F (MAR, ENG, POR, POL) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '1986-06-03T16:00:00-06:00', home_code: 'POR', away_code: 'ENG', home_score: 1, away_score: 0, venue_slug: 'estadio-tecnologico-monterrey', referee: 'Volker Roth', attendance: 23000 },
  { match_number: 32, stage: 'group', match_date: '1986-06-02T12:00:00-06:00', home_code: 'POL', away_code: 'MAR', home_score: 0, away_score: 0, venue_slug: 'estadio-universitario-monterrey', referee: 'Vincent Mauro', attendance: 19000 },
  { match_number: 33, stage: 'group', match_date: '1986-06-06T12:00:00-06:00', home_code: 'ENG', away_code: 'MAR', home_score: 0, away_score: 0, venue_slug: 'estadio-tecnologico-monterrey', referee: 'Gabriel Gonzalez', attendance: 21000, notes: 'Bryan Robson lesionado, Wilkins expulsado. ENG hundida' },
  { match_number: 34, stage: 'group', match_date: '1986-06-07T16:00:00-06:00', home_code: 'POL', away_code: 'POR', home_score: 1, away_score: 0, venue_slug: 'estadio-universitario-monterrey', referee: 'Alexei Spirin', attendance: 19000 },
  { match_number: 35, stage: 'group', match_date: '1986-06-11T12:00:00-06:00', home_code: 'ENG', away_code: 'POL', home_score: 3, away_score: 0, venue_slug: 'estadio-universitario-monterrey', referee: 'Andre Daina', attendance: 22000, notes: 'Lineker hat-trick = camino al Bota de Oro' },
  { match_number: 36, stage: 'group', match_date: '1986-06-11T12:00:00-06:00', home_code: 'MAR', away_code: 'POR', home_score: 3, away_score: 1, venue_slug: 'estadio-tres-de-marzo', referee: 'Carlos Espósito', attendance: 18000, notes: '★ MARRUECOS PRIMER PAIS AFRICANO EN CLASIFICAR A OCTAVOS, gana grupo del Mundial' },
  // ── OCTAVOS ── 15-17 jun ─────────────────────────────────
  { match_number: 37, stage: 'r16', match_date: '1986-06-15T12:00:00-06:00', home_code: 'MEX', away_code: 'BUL', home_score: 2, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Berny Ulloa', attendance: 114000, notes: 'México pasa a cuartos en casa. Negrete chilena al 35 = uno de los goles del Mundial' },
  { match_number: 38, stage: 'r16', match_date: '1986-06-15T16:00:00-06:00', home_code: 'URS', away_code: 'BEL', home_score: 3, away_score: 4, venue_slug: 'estadio-jalisco', referee: 'Erik Fredriksson', attendance: 32000, notes: 'BEL remonta 0-2 al min 70, fuera de juego no señalado, Scifo + Belanov hat-trick' },
  { match_number: 39, stage: 'r16', match_date: '1986-06-16T16:00:00-06:00', home_code: 'BRA', away_code: 'POL', home_score: 4, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Volker Roth', attendance: 45000, notes: 'Sócrates, Josimar (golazo desde 30m), Edinho, Careca. Brasil aún mantiene la magia (perderá vs FRA)' },
  { match_number: 40, stage: 'r16', match_date: '1986-06-16T12:00:00-06:00', home_code: 'ARG', away_code: 'URU', home_score: 1, away_score: 0, venue_slug: 'estadio-cuauhtemoc', referee: 'Luigi Agnolin', attendance: 26000, notes: 'Maradona magia. Pasarella ya no juega (no figura en plantilla titular)' },
  { match_number: 41, stage: 'r16', match_date: '1986-06-17T12:00:00-06:00', home_code: 'ITA', away_code: 'FRA', home_score: 0, away_score: 2, venue_slug: 'estadio-olimpico-universitario', referee: 'Carlos Espósito', attendance: 70000, notes: 'Platini y Stopyra. FRA elimina a ITA campeona defensora' },
  { match_number: 42, stage: 'r16', match_date: '1986-06-17T16:00:00-06:00', home_code: 'FRG', away_code: 'MAR', home_score: 1, away_score: 0, venue_slug: 'estadio-universitario-monterrey', referee: 'Gaston Castro', attendance: 19000, notes: 'Matthäus gol al 88. Marruecos cuento de hadas termina, primer país africano a octavos en MUndial' },
  { match_number: 43, stage: 'r16', match_date: '1986-06-18T12:00:00-06:00', home_code: 'ENG', away_code: 'PAR', home_score: 3, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Jamal Al-Sharif', attendance: 98000, notes: 'Lineker doblete (sigue Bota de Oro)' },
  { match_number: 44, stage: 'r16', match_date: '1986-06-18T16:00:00-06:00', home_code: 'ESP', away_code: 'DEN', home_score: 5, away_score: 1, venue_slug: 'estadio-corregidora', referee: 'Vojtech Christov', attendance: 38000, notes: '★ BUTRAGUEÑO 4 GOLES + Goicoechea 1. ESP humilla a la Danish Dynamite que venía arrasando. Mayor goleada en octavos del Mundial' },
  // ── CUARTOS ── 21-22 jun ─────────────────────────────────
  { match_number: 45, stage: 'qf', match_date: '1986-06-21T12:00:00-06:00', home_code: 'BRA', away_code: 'FRA', home_score: 1, away_score: 1, home_score_pk: 3, away_score_pk: 4, venue_slug: 'estadio-jalisco', referee: 'Ioan Igna', attendance: 65000, notes: '★ "El partido del 86" para mucha gente. 1-1 a.e.t. Penaltis: FRA 4-3 BRA. Sócrates falla, Zico (entrante del banco al 70) falla penalti al 73 que era del partido. Brasil ELIMINADO en cuartos por 3o Mundial seguido' },
  { match_number: 46, stage: 'qf', match_date: '1986-06-21T16:00:00-06:00', home_code: 'FRG', away_code: 'MEX', home_score: 0, away_score: 0, home_score_pk: 4, away_score_pk: 1, venue_slug: 'estadio-universitario-monterrey', referee: 'Erik Fredriksson', attendance: 38000, notes: 'MEX cae en penaltis en su tierra. Quirarte y Servin fallan' },
  { match_number: 47, stage: 'qf', match_date: '1986-06-22T12:00:00-06:00', home_code: 'ARG', away_code: 'ENG', home_score: 2, away_score: 1, venue_slug: 'estadio-azteca', referee: 'Ali Bin Nasser', attendance: 114580, notes: '★★★ EL PARTIDO. Maradona 51 = MANO DE DIOS. Maradona 55 = GOL DEL SIGLO (10.8 segundos, 5 ingleses superados, gol vacío). 4 minutos separan los dos goles más famosos del fútbol moderno. Lineker descuenta al 81. Argentina a semis. Ver historia #1' },
  { match_number: 48, stage: 'qf', match_date: '1986-06-22T16:00:00-06:00', home_code: 'ESP', away_code: 'BEL', home_score: 1, away_score: 1, home_score_pk: 4, away_score_pk: 5, venue_slug: 'estadio-cuauhtemoc', referee: 'Carlos Silva', attendance: 45000, notes: 'BEL elimina a ESP en penaltis (Eloy y Senor fallan). Bélgica histórica a semis' },
  // ── SEMIS ── 25 jun ──────────────────────────────────────
  { match_number: 49, stage: 'sf', match_date: '1986-06-25T12:00:00-06:00', home_code: 'FRA', away_code: 'FRG', home_score: 0, away_score: 2, venue_slug: 'estadio-jalisco', referee: 'Luigi Agnolin', attendance: 45000, notes: 'FRG elimina a FRA (revancha de 1982). Brehme + Voller goles' },
  { match_number: 50, stage: 'sf', match_date: '1986-06-25T16:00:00-06:00', home_code: 'ARG', away_code: 'BEL', home_score: 2, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Antonio Marquez', attendance: 110420, notes: '★ MARADONA DOBLETE (min 51 y 63). ARG a final. Maradona suma 5 goles + 5 asistencias en 6 partidos' },
  // ── 3er PUESTO ── 28 jun ─────────────────────────────────
  { match_number: 51, stage: '3rd', match_date: '1986-06-28T12:00:00-06:00', home_code: 'FRA', away_code: 'BEL', home_score: 4, away_score: 2, home_score_pk: null, away_score_pk: null, venue_slug: 'estadio-cuauhtemoc', referee: 'George Courtney', attendance: 22000, notes: '4-2 a.e.t. Era 2-2 al 90' },
  // ── FINAL ── 29 jun ──────────────────────────────────────
  { match_number: 52, stage: 'final', match_date: '1986-06-29T12:00:00-06:00', home_code: 'ARG', away_code: 'FRG', home_score: 3, away_score: 2, venue_slug: 'estadio-azteca', referee: 'Romualdo Arppi Filho', attendance: 114600, notes: '★ ARGENTINA BICAMPEONA MUNDIAL. Brown 1-0 al 23 (cabezazo), Valdano 2-0 al 55. FRG remonta: Rummenigge 2-1 al 74, Völler 2-2 al 80. BURRUCHAGA 3-2 al 84 (pase TELEGRAFIADO de Maradona en la jugada de la final). Maradona Balón de Oro del torneo (5 goles + 5 asistencias en 7 partidos). LA actuación individual más decisiva en una Mundial' },
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

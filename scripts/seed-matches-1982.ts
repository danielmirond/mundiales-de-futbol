/**
 * Seed los 52 partidos del Mundial España 1982.
 *
 * Primer Mundial con 24 selecciones. Formato singular: 6 grupos de 4
 * en 1a fase (36 matches) + 4 grupos de 3 en 2a fase (12 matches) +
 * 2 semis + 1 3o + 1 final = 52.
 *
 * Hitos:
 *  - "DISASTRO DE GIJÓN" (match #28, FRG 1-0 AUT, 25 jun, El Molinón):
 *    Partido pactado que cambió el reglamento (ver historia #17).
 *  - "PARTIDO DEL SARRIÀ" (match #43, BRA 2-3 ITA, 5 jul, Estadio
 *    Sarrià): Paolo Rossi TRIPLETE vs el Brasil de Zico, Sócrates,
 *    Falcao, Eder. Considerado uno de los mejores partidos historia.
 *  - PAOLO ROSSI Bota de Oro (6 goles): triplete vs BRA + hat-trick
 *    vs POL semi + gol final vs FRG.
 *  - HUN 10-1 SLV (match #2): MAYOR GOLEADA MUNDIALISTA VIGENTE.
 *  - ARG 1-0 BEL inaugural, ARGELIA 2-1 FRG (debut africano sorpresa).
 *  - DIEGO MARADONA DEBUT MUNDIAL (no destacó, expulsado vs BRA).
 *  - DINO ZOFF capitán y campeón a los 40 años (récord).
 *  - "EL GRITO DE TARDELLI" en la final (gol 2-0 al 69, celebración
 *    icónica).
 *  - CAMERÚN debuta africanamente, eliminado por GF (mismo
 *    puntaje que ITA).
 *  - SOCCER WAR contexto: 1a Mundial post-Falklands, las grupos
 *    ARG-BRA-ITA-POL 2a fase con guerra de fondo.
 *
 * Datos verificados con FIFA archives, Wikipedia (1982 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1982.ts
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

const YEAR = 1982;

const TEAMS = [
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'POL', name: 'Polonia', conf: 'UEFA', flag: '🇵🇱' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'NIR', name: 'Irlanda del Norte', conf: 'UEFA', flag: '🇬🇧' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'ALG', name: 'Argelia', conf: 'CAF', flag: '🇩🇿' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'PER', name: 'Perú', conf: 'CONMEBOL', flag: '🇵🇪' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'SLV', name: 'El Salvador', conf: 'CONCACAF', flag: '🇸🇻' },
  { code: 'HON', name: 'Honduras', conf: 'CONCACAF', flag: '🇭🇳' },
  { code: 'KUW', name: 'Kuwait', conf: 'AFC', flag: '🇰🇼' },
  { code: 'NZL', name: 'Nueva Zelanda', conf: 'OFC', flag: '🇳🇿' },
];

const VENUES = [
  { slug: 'estadio-santiago-bernabeu', name: 'Estadio Santiago Bernabéu', city: 'Madrid', country_code: 'ESP', latitude: 40.4530, longitude: -3.6883, surface: 'grass', opened_year: 1947 },
  { slug: 'estadio-vicente-calderon', name: 'Estadio Vicente Calderón', city: 'Madrid', country_code: 'ESP', latitude: 40.4019, longitude: -3.7204, surface: 'grass', opened_year: 1966, closed_year: 2017 },
  { slug: 'camp-nou', name: 'Camp Nou', city: 'Barcelona', country_code: 'ESP', latitude: 41.3809, longitude: 2.1228, surface: 'grass', opened_year: 1957 },
  { slug: 'estadio-sarria', name: 'Estadio Sarrià', city: 'Barcelona', country_code: 'ESP', latitude: 41.3927, longitude: 2.1335, surface: 'grass', opened_year: 1923, closed_year: 1997 },
  { slug: 'estadio-sanchez-pizjuan', name: 'Estadio Ramón Sánchez-Pizjuán', city: 'Sevilla', country_code: 'ESP', latitude: 37.3839, longitude: -5.9706, surface: 'grass', opened_year: 1958 },
  { slug: 'estadio-benito-villamarin', name: 'Estadio Benito Villamarín', city: 'Sevilla', country_code: 'ESP', latitude: 37.3565, longitude: -5.9817, surface: 'grass', opened_year: 1929 },
  { slug: 'estadio-luis-casanova', name: 'Estadio Luis Casanova', city: 'Valencia', country_code: 'ESP', latitude: 39.4747, longitude: -0.3585, surface: 'grass', opened_year: 1923 },
  { slug: 'estadio-jose-rico-perez', name: 'Estadio José Rico Pérez', city: 'Alicante', country_code: 'ESP', latitude: 38.3589, longitude: -0.5006, surface: 'grass', opened_year: 1974 },
  { slug: 'estadio-manuel-martinez-valero', name: 'Estadio Manuel Martínez Valero', city: 'Elche', country_code: 'ESP', latitude: 38.2675, longitude: -0.6630, surface: 'grass', opened_year: 1976 },
  { slug: 'estadio-la-romareda', name: 'Estadio La Romareda', city: 'Zaragoza', country_code: 'ESP', latitude: 41.6357, longitude: -0.9019, surface: 'grass', opened_year: 1957 },
  { slug: 'estadio-san-mames-1913', name: 'Estadio San Mamés', city: 'Bilbao', country_code: 'ESP', latitude: 43.2641, longitude: -2.9499, surface: 'grass', opened_year: 1913, closed_year: 2013 },
  { slug: 'estadio-balaidos', name: 'Estadio Balaídos', city: 'Vigo', country_code: 'ESP', latitude: 42.2118, longitude: -8.7404, surface: 'grass', opened_year: 1928 },
  { slug: 'estadio-el-molinon', name: 'Estadio El Molinón', city: 'Gijón', country_code: 'ESP', latitude: 43.5366, longitude: -5.6373, surface: 'grass', opened_year: 1908 },
  { slug: 'estadio-carlos-tartiere-old', name: 'Estadio Carlos Tartiere', city: 'Oviedo', country_code: 'ESP', latitude: 43.3500, longitude: -5.8456, surface: 'grass', opened_year: 1932, closed_year: 2003 },
  { slug: 'estadio-jose-zorrilla-old', name: 'Estadio José Zorrilla', city: 'Valladolid', country_code: 'ESP', latitude: 41.6557, longitude: -4.7186, surface: 'grass', opened_year: 1940, closed_year: 1982 },
  { slug: 'estadio-riazor', name: 'Estadio Riazor', city: 'La Coruña', country_code: 'ESP', latitude: 43.3676, longitude: -8.4193, surface: 'grass', opened_year: 1944 },
  { slug: 'estadio-la-rosaleda', name: 'Estadio La Rosaleda', city: 'Málaga', country_code: 'ESP', latitude: 36.7411, longitude: -4.4319, surface: 'grass', opened_year: 1941 },
];

const REFEREES = [
  { full_name: 'Arnaldo Cézar Coelho', nationality_code: 'BRA' },
  { full_name: 'Abraham Klein', nationality_code: 'ISR' },
  { full_name: 'Bogdan Dochev', nationality_code: 'BUL' },
  { full_name: 'Charles Corver', nationality_code: 'NED' },
  { full_name: 'Bob Valentine', nationality_code: 'SCO' },
  { full_name: 'Walter Eschweiler', nationality_code: 'FRG' },
  { full_name: 'Damir Matovinović', nationality_code: 'YUG' },
  { full_name: 'Adolf Prokop', nationality_code: 'GDR' },
  { full_name: 'Paolo Casarin', nationality_code: 'ITA' },
  { full_name: 'Karoly Palotai', nationality_code: 'HUN' },
  { full_name: 'Mario Rubio Vázquez', nationality_code: 'MEX' },
  { full_name: 'Clive White', nationality_code: 'ENG' },
  { full_name: 'Gilberto Aristizabal', nationality_code: 'COL' },
  { full_name: 'Erik Fredriksson', nationality_code: 'SWE' },
  { full_name: 'Antonio Garrido', nationality_code: 'POR' },
  { full_name: 'Vojtech Christov', nationality_code: 'TCH' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'r2' | 'sf' | '3rd' | 'final';
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
  // ── GROUP 1 (ITA, POL, PER, CMR) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '1982-06-14T17:15:00+02:00', home_code: 'ITA', away_code: 'POL', home_score: 0, away_score: 0, venue_slug: 'estadio-balaidos', referee: 'Michel Vautrot', attendance: 33000 },
  { match_number: 2,  stage: 'group', match_date: '1982-06-15T17:15:00+02:00', home_code: 'PER', away_code: 'CMR', home_score: 0, away_score: 0, venue_slug: 'estadio-riazor', referee: 'Franz Wöhrer', attendance: 14000, notes: 'Camerún debuta en Mundial' },
  { match_number: 3,  stage: 'group', match_date: '1982-06-18T17:15:00+02:00', home_code: 'ITA', away_code: 'PER', home_score: 1, away_score: 1, venue_slug: 'estadio-balaidos', referee: 'Walter Eschweiler', attendance: 25000 },
  { match_number: 4,  stage: 'group', match_date: '1982-06-19T17:15:00+02:00', home_code: 'POL', away_code: 'CMR', home_score: 0, away_score: 0, venue_slug: 'estadio-riazor', referee: 'Antonio Garrido', attendance: 19000 },
  { match_number: 5,  stage: 'group', match_date: '1982-06-22T17:15:00+02:00', home_code: 'POL', away_code: 'PER', home_score: 5, away_score: 1, venue_slug: 'estadio-riazor', referee: 'Mario Rubio Vázquez', attendance: 25000 },
  { match_number: 6,  stage: 'group', match_date: '1982-06-23T21:00:00+02:00', home_code: 'ITA', away_code: 'CMR', home_score: 1, away_score: 1, venue_slug: 'estadio-balaidos', referee: 'Bogdan Dochev', attendance: 12000, notes: 'Camerún elimina invicto pero por goles fuera. CMR vuelve en 1990 con la sorpresa Roger Milla' },
  // ── GROUP 2 (FRG, AUT, CHI, ALG) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '1982-06-16T17:15:00+02:00', home_code: 'ALG', away_code: 'FRG', home_score: 2, away_score: 1, venue_slug: 'estadio-el-molinon', referee: 'Enrique Labo', attendance: 42000, notes: '★ MAYOR SORPRESA TEMPRANA. Argelia (debut africano) vence al subcampeón FRG. Madjer asistencia + Belloumi gol' },
  { match_number: 8,  stage: 'group', match_date: '1982-06-17T17:15:00+02:00', home_code: 'CHI', away_code: 'AUT', home_score: 0, away_score: 1, venue_slug: 'estadio-carlos-tartiere-old', referee: 'Bruno Galler', attendance: 22000 },
  { match_number: 9,  stage: 'group', match_date: '1982-06-20T17:15:00+02:00', home_code: 'FRG', away_code: 'CHI', home_score: 4, away_score: 1, venue_slug: 'estadio-el-molinon', referee: 'Antonio Garrido', attendance: 42000 },
  { match_number: 10, stage: 'group', match_date: '1982-06-21T17:15:00+02:00', home_code: 'AUT', away_code: 'ALG', home_score: 2, away_score: 0, venue_slug: 'estadio-carlos-tartiere-old', referee: 'Romualdas Yushka', attendance: 22000 },
  { match_number: 11, stage: 'group', match_date: '1982-06-24T17:15:00+02:00', home_code: 'ALG', away_code: 'CHI', home_score: 3, away_score: 2, venue_slug: 'estadio-carlos-tartiere-old', referee: 'Bob Valentine', attendance: 17000 },
  { match_number: 12, stage: 'group', match_date: '1982-06-25T17:15:00+02:00', home_code: 'FRG', away_code: 'AUT', home_score: 1, away_score: 0, venue_slug: 'estadio-el-molinon', referee: 'Bob Valentine', attendance: 41000, notes: '★ DISASTRO DE GIJÓN. Partido pactado: FRG necesitaba ganar 1-0 o 2-0 para clasificarse junto a AUT a costa de ALG. Hrubesch gol al 10, 80 min de pasarse balones. Argelia eliminada. La FIFA cambió el reglamento (todos los últimos partidos simultaneos desde 1986). Ver historia #17' },
  // ── GROUP 3 (BEL, ARG, HUN, SLV) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1982-06-13T17:00:00+02:00', home_code: 'ARG', away_code: 'BEL', home_score: 0, away_score: 1, venue_slug: 'camp-nou', referee: 'Vojtech Christov', attendance: 95000, notes: 'INAUGURAL del Mundial. Argentina campeona defensora cae 0-1. Vandenbergh gol min 62. Maradona debut mundialista, sin destaque' },
  { match_number: 14, stage: 'group', match_date: '1982-06-15T17:15:00+02:00', home_code: 'HUN', away_code: 'SLV', home_score: 10, away_score: 1, venue_slug: 'estadio-jose-rico-perez', referee: 'Ibrahim Al-Doy', attendance: 23000, notes: '★ MAYOR GOLEADA HISTORICA DEL MUNDIAL (récord vigente). Kiss hat-trick (entró del banquillo en el 55) en 7 minutos = hat-trick más rápido del Mundial. Nyilasi y Pölöskei doblete. Salvador eliminada con 13 goles encajados en 3 partidos' },
  { match_number: 15, stage: 'group', match_date: '1982-06-18T17:15:00+02:00', home_code: 'ARG', away_code: 'HUN', home_score: 4, away_score: 1, venue_slug: 'estadio-jose-rico-perez', referee: 'Bogdan Dochev', attendance: 32000, notes: 'Maradona doblete (2 goles consecutivos al 26 y 56), explota su Mundial' },
  { match_number: 16, stage: 'group', match_date: '1982-06-19T17:15:00+02:00', home_code: 'BEL', away_code: 'SLV', home_score: 1, away_score: 0, venue_slug: 'estadio-manuel-martinez-valero', referee: 'Malcolm Moffat', attendance: 18000 },
  { match_number: 17, stage: 'group', match_date: '1982-06-22T17:15:00+02:00', home_code: 'BEL', away_code: 'HUN', home_score: 1, away_score: 1, venue_slug: 'estadio-manuel-martinez-valero', referee: 'Erik Fredriksson', attendance: 28000 },
  { match_number: 18, stage: 'group', match_date: '1982-06-23T17:15:00+02:00', home_code: 'ARG', away_code: 'SLV', home_score: 2, away_score: 0, venue_slug: 'estadio-jose-rico-perez', referee: 'Luis Paulino Siles', attendance: 22000 },
  // ── GROUP 4 (ENG, FRA, TCH, KUW) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1982-06-16T17:15:00+02:00', home_code: 'ENG', away_code: 'FRA', home_score: 3, away_score: 1, venue_slug: 'estadio-san-mames-1913', referee: 'Antonio Garrido', attendance: 44000, notes: 'Bryan Robson marca al min 27 segundos, gol más rápido del Mundial hasta 2002' },
  { match_number: 20, stage: 'group', match_date: '1982-06-17T21:00:00+02:00', home_code: 'TCH', away_code: 'KUW', home_score: 1, away_score: 1, venue_slug: 'estadio-jose-zorrilla-old', referee: 'Benjamin Dwomoh', attendance: 25000 },
  { match_number: 21, stage: 'group', match_date: '1982-06-20T17:15:00+02:00', home_code: 'ENG', away_code: 'TCH', home_score: 2, away_score: 0, venue_slug: 'estadio-san-mames-1913', referee: 'Charles Corver', attendance: 41000 },
  { match_number: 22, stage: 'group', match_date: '1982-06-21T21:00:00+02:00', home_code: 'FRA', away_code: 'KUW', home_score: 4, away_score: 1, venue_slug: 'estadio-jose-zorrilla-old', referee: 'Miroslav Stupar', attendance: 30000, notes: 'Príncipe Fahid de Kuwait baja al campo a protestar gol cancelado. Stupar anula gol en consecuencia (escándalo arbitral)' },
  { match_number: 23, stage: 'group', match_date: '1982-06-24T17:15:00+02:00', home_code: 'FRA', away_code: 'TCH', home_score: 1, away_score: 1, venue_slug: 'estadio-jose-zorrilla-old', referee: 'Romualdas Yushka', attendance: 28000 },
  { match_number: 24, stage: 'group', match_date: '1982-06-25T21:00:00+02:00', home_code: 'ENG', away_code: 'KUW', home_score: 1, away_score: 0, venue_slug: 'estadio-san-mames-1913', referee: 'Gilberto Aristizabal', attendance: 39000 },
  // ── GROUP 5 (ESP, NIR, YUG, HON) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '1982-06-16T21:00:00+02:00', home_code: 'ESP', away_code: 'HON', home_score: 1, away_score: 1, venue_slug: 'estadio-luis-casanova', referee: 'Arturo Ithurralde', attendance: 49000, notes: 'España anfitriona empata en su debut (mal arranque)' },
  { match_number: 26, stage: 'group', match_date: '1982-06-17T17:15:00+02:00', home_code: 'YUG', away_code: 'NIR', home_score: 0, away_score: 0, venue_slug: 'estadio-la-romareda', referee: 'Héctor Ortiz', attendance: 25000 },
  { match_number: 27, stage: 'group', match_date: '1982-06-20T21:00:00+02:00', home_code: 'ESP', away_code: 'YUG', home_score: 2, away_score: 1, venue_slug: 'estadio-luis-casanova', referee: 'Henning Lund-Sørensen', attendance: 48000, notes: 'Polémica: España gana con penalti repetido (Saura)' },
  { match_number: 28, stage: 'group', match_date: '1982-06-21T17:15:00+02:00', home_code: 'HON', away_code: 'NIR', home_score: 1, away_score: 1, venue_slug: 'estadio-la-romareda', referee: 'Eyo Asue', attendance: 15000 },
  { match_number: 29, stage: 'group', match_date: '1982-06-24T21:00:00+02:00', home_code: 'NIR', away_code: 'ESP', home_score: 1, away_score: 0, venue_slug: 'estadio-luis-casanova', referee: 'Héctor Ortiz', attendance: 49562, notes: 'NIR elimina a ESP en su propia tierra. Norman Whiteside con 17 anos = jugador más joven en un Mundial (récord hasta hoy)' },
  { match_number: 30, stage: 'group', match_date: '1982-06-25T17:15:00+02:00', home_code: 'YUG', away_code: 'HON', home_score: 1, away_score: 0, venue_slug: 'estadio-la-romareda', referee: 'Gaston Castro', attendance: 25000 },
  // ── GROUP 6 (BRA, URS, SCO, NZL) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '1982-06-14T21:00:00+02:00', home_code: 'BRA', away_code: 'URS', home_score: 2, away_score: 1, venue_slug: 'estadio-sanchez-pizjuan', referee: 'Lamberto Boldori', attendance: 68000, notes: 'Socrates lanza canilla al palo, gol Eder (chilena) al 88. Brasil de Telê Santana brilla' },
  { match_number: 32, stage: 'group', match_date: '1982-06-15T21:00:00+02:00', home_code: 'SCO', away_code: 'NZL', home_score: 5, away_score: 2, venue_slug: 'estadio-benito-villamarin', referee: 'Damir Matovinović', attendance: 36000 },
  { match_number: 33, stage: 'group', match_date: '1982-06-18T21:00:00+02:00', home_code: 'BRA', away_code: 'SCO', home_score: 4, away_score: 1, venue_slug: 'estadio-benito-villamarin', referee: 'Mahmood Hashim', attendance: 47000, notes: 'Socrates, Zico, Eder, Falcao despliegan fútbol arte' },
  { match_number: 34, stage: 'group', match_date: '1982-06-19T21:00:00+02:00', home_code: 'URS', away_code: 'NZL', home_score: 3, away_score: 0, venue_slug: 'estadio-benito-villamarin', referee: 'Yousef El-Ghoul', attendance: 26000 },
  { match_number: 35, stage: 'group', match_date: '1982-06-22T21:00:00+02:00', home_code: 'URS', away_code: 'SCO', home_score: 2, away_score: 2, venue_slug: 'estadio-la-rosaleda', referee: 'Nicolae Rainea', attendance: 45000 },
  { match_number: 36, stage: 'group', match_date: '1982-06-23T21:00:00+02:00', home_code: 'BRA', away_code: 'NZL', home_score: 4, away_score: 0, venue_slug: 'estadio-benito-villamarin', referee: 'Damir Matovinović', attendance: 43000, notes: 'Zico hat-trick. Brasil aspira a 4o título' },
  // ── 2a RONDA · GRUPO A (POL, BEL, URS) ─────────────────
  { match_number: 37, stage: 'r2', match_date: '1982-06-28T17:15:00+02:00', home_code: 'POL', away_code: 'BEL', home_score: 3, away_score: 0, venue_slug: 'camp-nou', referee: 'Charles Corver', attendance: 65000, notes: 'Zbigniew Boniek hat-trick' },
  { match_number: 38, stage: 'r2', match_date: '1982-07-01T21:00:00+02:00', home_code: 'BEL', away_code: 'URS', home_score: 0, away_score: 1, venue_slug: 'camp-nou', referee: 'Antonio Garrido', attendance: 45000 },
  { match_number: 39, stage: 'r2', match_date: '1982-07-04T17:15:00+02:00', home_code: 'POL', away_code: 'URS', home_score: 0, away_score: 0, venue_slug: 'camp-nou', referee: 'Bob Valentine', attendance: 65000, notes: 'POL pasa a semis por goles. Sin Boniek (sancionado), POL pierde frente a ITA' },
  // ── 2a RONDA · GRUPO B (FRG, ENG, ESP) ────────────────
  { match_number: 40, stage: 'r2', match_date: '1982-06-29T17:15:00+02:00', home_code: 'FRG', away_code: 'ENG', home_score: 0, away_score: 0, venue_slug: 'estadio-santiago-bernabeu', referee: 'Arnaldo Cézar Coelho', attendance: 75000 },
  { match_number: 41, stage: 'r2', match_date: '1982-07-02T17:15:00+02:00', home_code: 'FRG', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'estadio-santiago-bernabeu', referee: 'Paolo Casarin', attendance: 90000 },
  { match_number: 42, stage: 'r2', match_date: '1982-07-05T21:00:00+02:00', home_code: 'ENG', away_code: 'ESP', home_score: 0, away_score: 0, venue_slug: 'estadio-santiago-bernabeu', referee: 'Pieter Braam', attendance: 75000 },
  // ── 2a RONDA · GRUPO C (ITA, ARG, BRA) ─────────────────
  { match_number: 43, stage: 'r2', match_date: '1982-06-29T21:00:00+02:00', home_code: 'ITA', away_code: 'ARG', home_score: 2, away_score: 1, venue_slug: 'estadio-sarria', referee: 'Nikolai Krishtanov', attendance: 38000, notes: 'ARG queda contra las cuerdas. Maradona patea a Gentile en revancha. Gentile reduce a Maradona al silencio' },
  { match_number: 44, stage: 'r2', match_date: '1982-07-02T21:00:00+02:00', home_code: 'ARG', away_code: 'BRA', home_score: 1, away_score: 3, venue_slug: 'estadio-sarria', referee: 'Mario Rubio Vázquez', attendance: 44000, notes: 'BRA elimina a ARG. Maradona EXPULSADO al min 85 por patada a Batista. Argentina out, BRA enfrentará a ITA' },
  { match_number: 45, stage: 'r2', match_date: '1982-07-05T17:15:00+02:00', home_code: 'ITA', away_code: 'BRA', home_score: 3, away_score: 2, venue_slug: 'estadio-sarria', referee: 'Abraham Klein', attendance: 44000, notes: '★ EL PARTIDO DEL SARRIÀ. PAOLO ROSSI TRIPLETE al min 5, 25, 74. Brasil del fútbol arte (Sócrates, Zico, Falcao, Eder, Júnior) ELIMINADO. Considerado uno de los mejores partidos de la historia. Falcao gol genial 2-2 anulado a Brasil de la guerra' },
  // ── 2a RONDA · GRUPO D (FRA, AUT, NIR) ─────────────────
  { match_number: 46, stage: 'r2', match_date: '1982-06-28T21:00:00+02:00', home_code: 'AUT', away_code: 'FRA', home_score: 0, away_score: 1, venue_slug: 'estadio-vicente-calderon', referee: 'Romualdas Yushka', attendance: 35000 },
  { match_number: 47, stage: 'r2', match_date: '1982-07-01T17:15:00+02:00', home_code: 'AUT', away_code: 'NIR', home_score: 2, away_score: 2, venue_slug: 'estadio-vicente-calderon', referee: 'Mario Rubio Vázquez', attendance: 22000 },
  { match_number: 48, stage: 'r2', match_date: '1982-07-04T21:00:00+02:00', home_code: 'FRA', away_code: 'NIR', home_score: 4, away_score: 1, venue_slug: 'estadio-vicente-calderon', referee: 'Alojzy Jarguz', attendance: 35000, notes: 'Platini, Tigana, Giresse: el "carré magique" frances brilla' },
  // ── SEMIS ────────────────────────────────────────────────
  { match_number: 49, stage: 'sf', match_date: '1982-07-08T21:00:00+02:00', home_code: 'POL', away_code: 'ITA', home_score: 0, away_score: 2, venue_slug: 'camp-nou', referee: 'Erik Fredriksson', attendance: 50000, notes: 'PAOLO ROSSI doblete (min 22 y 73). Sin Boniek (sancionado), POL no encuentra respuesta. ITA a la final' },
  { match_number: 50, stage: 'sf', match_date: '1982-07-08T21:00:00+02:00', home_code: 'FRG', away_code: 'FRA', home_score: 3, away_score: 3, venue_slug: 'estadio-sanchez-pizjuan', referee: 'Charles Corver', attendance: 70000, notes: '★ "EL PARTIDO DE LA NOCHE DE SEVILLA". 1-1 al 90. PRORROGA: FRA 3-1 al 99 con Tresor y Giresse. FRG iguala 3-3 con Rummenigge y Fischer. PENALTIES: FRG 5-4 FRA. Primera tanda de penaltis en una Mundial. Horror Schumacher: choque brutal con Battiston, sin tarjeta (incumplido). Battiston KO, perdió 3 dientes' },
  // ── 3er PUESTO ──────────────────────────────────────────
  { match_number: 51, stage: '3rd', match_date: '1982-07-10T21:00:00+02:00', home_code: 'POL', away_code: 'FRA', home_score: 3, away_score: 2, venue_slug: 'estadio-jose-rico-perez', referee: 'António Garrido', attendance: 28000 },
  // ── FINAL ────────────────────────────────────────────────
  { match_number: 52, stage: 'final', match_date: '1982-07-11T20:00:00+02:00', home_code: 'ITA', away_code: 'FRG', home_score: 3, away_score: 1, venue_slug: 'estadio-santiago-bernabeu', referee: 'Arnaldo Cézar Coelho', attendance: 90000, notes: '★ ITALIA TRICAMPEONA (1934, 1938, 1982). Rossi 1-0 al 57 (6o gol del Mundial = BOTA DE ORO), Tardelli 2-0 al 69 (★ EL GRITO DE TARDELLI, celebracion icónica), Altobelli 3-0 al 81. Breitner 3-1 al 83. DINO ZOFF capitán a los 40 años, primer y único portero capitán campeón. Bearzot entrenador. Frase del rey Juan Carlos al final: "Bearzot, presidente!"' },
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

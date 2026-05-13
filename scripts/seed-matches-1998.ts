/**
 * Seed los 64 partidos del Mundial Francia 1998.
 *
 * PRIMER MUNDIAL CON 32 SELECCIONES. 8 grupos de 4 (48) + octavos (8)
 * + cuartos (4) + semis (2) + 3o + final = 64. Este formato se
 * mantiene hasta Qatar 2022.
 *
 * Hitos:
 *  - FRANCIA CAMPEONA EN CASA. Zidane doblete en final BRA 0-3 FRA.
 *  - "RONALDO ANTES DE LA FINAL": convulsiones nocturnas, Brasil
 *    pone su nombre en la planilla a última hora. Jugó pero no rindió.
 *  - OWEN GOLAZO vs ARG octavos = mejor gol del Mundial (18 años).
 *  - BECKHAM EXPULSADO por patada a Simeone (después indultado).
 *  - SUKER (CRO) Bota de Oro 6 goles, Croacia tercera en su debut.
 *  - IRAN 2-1 USA, partido cargado político (Khatami vs Clinton).
 *  - "GOLDEN GOAL" se estrena, Blanc (FRA) marca el primero vs PAR.
 *  - JAMAICA "Reggae Boyz" mundial debut.
 *  - DESCHAMPS capitán francés campeón.
 *
 * Datos verificados con FIFA archives, Wikipedia (1998 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1998.ts
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

const YEAR = 1998;

const TEAMS = [
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'CRO', name: 'Croacia', conf: 'UEFA', flag: '🇭🇷' },
  { code: 'NED', name: 'Países Bajos', conf: 'UEFA', flag: '🇳🇱' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'GER', name: 'Alemania', conf: 'UEFA', flag: '🇩🇪' },
  { code: 'DEN', name: 'Dinamarca', conf: 'UEFA', flag: '🇩🇰' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'NGA', name: 'Nigeria', conf: 'CAF', flag: '🇳🇬' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'NOR', name: 'Noruega', conf: 'UEFA', flag: '🇳🇴' },
  { code: 'ROU', name: 'Rumanía', conf: 'UEFA', flag: '🇷🇴' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'CMR', name: 'Camerún', conf: 'CAF', flag: '🇨🇲' },
  { code: 'COL', name: 'Colombia', conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'MAR', name: 'Marruecos', conf: 'CAF', flag: '🇲🇦' },
  { code: 'IRN', name: 'Irán', conf: 'AFC', flag: '🇮🇷' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'JAM', name: 'Jamaica', conf: 'CONCACAF', flag: '🇯🇲' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'JPN', name: 'Japón', conf: 'AFC', flag: '🇯🇵' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'TUN', name: 'Túnez', conf: 'CAF', flag: '🇹🇳' },
  { code: 'ZAF', name: 'Sudáfrica', conf: 'CAF', flag: '🇿🇦' },
  { code: 'KSA', name: 'Arabia Saudí', conf: 'AFC', flag: '🇸🇦' },
];

const VENUES = [
  { slug: 'stade-de-france', name: 'Stade de France', city: 'Saint-Denis', country_code: 'FRA', latitude: 48.9244, longitude: 2.3601, surface: 'grass', opened_year: 1998 },
  { slug: 'parc-des-princes', name: 'Parc des Princes', city: 'París', country_code: 'FRA', latitude: 48.8414, longitude: 2.2530, surface: 'grass', opened_year: 1897 },
  { slug: 'stade-velodrome-marseille', name: 'Stade Vélodrome', city: 'Marsella', country_code: 'FRA', latitude: 43.2696, longitude: 5.3958, surface: 'grass', opened_year: 1937 },
  { slug: 'stade-gerland-lyon', name: 'Stade Gerland', city: 'Lyon', country_code: 'FRA', latitude: 45.7244, longitude: 4.8324, surface: 'grass', opened_year: 1926 },
  { slug: 'stade-la-mosson', name: 'Stade de la Mosson', city: 'Montpellier', country_code: 'FRA', latitude: 43.6219, longitude: 3.8118, surface: 'grass', opened_year: 1972 },
  { slug: 'stade-beaujoire-nantes', name: 'Stade de la Beaujoire', city: 'Nantes', country_code: 'FRA', latitude: 47.2562, longitude: -1.5253, surface: 'grass', opened_year: 1984 },
  { slug: 'stadium-municipal-toulouse', name: 'Stadium Municipal', city: 'Toulouse', country_code: 'FRA', latitude: 43.5832, longitude: 1.4344, surface: 'grass', opened_year: 1937 },
  { slug: 'stade-felix-bollaert', name: 'Stade Félix-Bollaert', city: 'Lens', country_code: 'FRA', latitude: 50.4327, longitude: 2.8158, surface: 'grass', opened_year: 1933 },
  { slug: 'stade-geoffroy-guichard', name: 'Stade Geoffroy-Guichard', city: 'Saint-Étienne', country_code: 'FRA', latitude: 45.4609, longitude: 4.3902, surface: 'grass', opened_year: 1931 },
  { slug: 'parc-lescure', name: 'Parc Lescure', city: 'Burdeos', country_code: 'FRA', latitude: 44.831, longitude: -0.601, surface: 'grass', opened_year: 1924 },
];

const REFEREES = [
  { full_name: 'Said Belqola', nationality_code: 'MAR' },
  { full_name: 'Pierluigi Collina', nationality_code: 'ITA' },
  { full_name: 'Kim Milton Nielsen', nationality_code: 'DEN' },
  { full_name: 'Esfandiar Baharmast', nationality_code: 'USA' },
  { full_name: 'Mario van der Ende', nationality_code: 'NED' },
  { full_name: 'Hugh Dallas', nationality_code: 'SCO' },
  { full_name: 'Marc Batta', nationality_code: 'FRA' },
  { full_name: 'Lucien Bouchardeau', nationality_code: 'NIG' },
  { full_name: 'Markus Merk', nationality_code: 'GER' },
  { full_name: 'Vítor Pereira', nationality_code: 'POR' },
  { full_name: 'Paul Durkin', nationality_code: 'ENG' },
  { full_name: 'Ali Bujsaim', nationality_code: 'UAE' },
  { full_name: 'Toru Kamikawa', nationality_code: 'JPN' },
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
  // ── GROUP A (BRA, MAR, NOR, SCO) ─────────────────────────
  { match_number: 1,  stage: 'group', match_date: '1998-06-10T17:30:00+02:00', home_code: 'BRA', away_code: 'SCO', home_score: 2, away_score: 1, venue_slug: 'stade-de-france', referee: 'José María García-Aranda', attendance: 80000, notes: 'Match inaugural del Mundial. Cesar Sampaio gol min 4, autogol Boyd. Brasil presenta candidatura' },
  { match_number: 2,  stage: 'group', match_date: '1998-06-10T20:30:00+02:00', home_code: 'MAR', away_code: 'NOR', home_score: 2, away_score: 2, venue_slug: 'stade-felix-bollaert', referee: 'Pierluigi Collina', attendance: 38062 },
  { match_number: 3,  stage: 'group', match_date: '1998-06-16T17:30:00+02:00', home_code: 'SCO', away_code: 'NOR', home_score: 1, away_score: 1, venue_slug: 'stade-de-france', referee: 'Toru Kamikawa', attendance: 80800 },
  { match_number: 4,  stage: 'group', match_date: '1998-06-16T20:30:00+02:00', home_code: 'BRA', away_code: 'MAR', home_score: 3, away_score: 0, venue_slug: 'stade-de-france', referee: 'Said Belqola', attendance: 77816 },
  { match_number: 5,  stage: 'group', match_date: '1998-06-23T17:30:00+02:00', home_code: 'BRA', away_code: 'NOR', home_score: 1, away_score: 2, venue_slug: 'stade-velodrome-marseille', referee: 'Esfandiar Baharmast', attendance: 55000, notes: 'NOR remonta. Penalti polemico de Baharmast favoriendo a NOR' },
  { match_number: 6,  stage: 'group', match_date: '1998-06-23T17:30:00+02:00', home_code: 'SCO', away_code: 'MAR', home_score: 0, away_score: 3, venue_slug: 'stade-geoffroy-guichard', referee: 'Ali Bujsaim', attendance: 35500 },
  // ── GROUP B (ITA, CHI, CMR, AUT) ─────────────────────────
  { match_number: 7,  stage: 'group', match_date: '1998-06-11T14:30:00+02:00', home_code: 'ITA', away_code: 'CHI', home_score: 2, away_score: 2, venue_slug: 'parc-lescure', referee: 'Lucien Bouchardeau', attendance: 33500 },
  { match_number: 8,  stage: 'group', match_date: '1998-06-11T17:30:00+02:00', home_code: 'CMR', away_code: 'AUT', home_score: 1, away_score: 1, venue_slug: 'stadium-municipal-toulouse', referee: 'Mario van der Ende', attendance: 33460 },
  { match_number: 9,  stage: 'group', match_date: '1998-06-17T20:30:00+02:00', home_code: 'CHI', away_code: 'AUT', home_score: 1, away_score: 1, venue_slug: 'parc-lescure', referee: 'Epifanio González', attendance: 31800 },
  { match_number: 10, stage: 'group', match_date: '1998-06-17T17:30:00+02:00', home_code: 'ITA', away_code: 'CMR', home_score: 3, away_score: 0, venue_slug: 'stade-de-france', referee: 'Brian Hall', attendance: 77728 },
  { match_number: 11, stage: 'group', match_date: '1998-06-23T17:30:00+02:00', home_code: 'ITA', away_code: 'AUT', home_score: 2, away_score: 1, venue_slug: 'stade-de-france', referee: 'Said Belqola', attendance: 75000 },
  { match_number: 12, stage: 'group', match_date: '1998-06-23T17:30:00+02:00', home_code: 'CHI', away_code: 'CMR', home_score: 1, away_score: 1, venue_slug: 'stade-beaujoire-nantes', referee: 'Pierluigi Collina', attendance: 35000 },
  // ── GROUP C (FRA, ZAF, DEN, KSA) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1998-06-12T20:30:00+02:00', home_code: 'FRA', away_code: 'ZAF', home_score: 3, away_score: 0, venue_slug: 'stade-velodrome-marseille', referee: 'Marcio Rezende', attendance: 55000, notes: 'FRA debut victorioso en su tierra' },
  { match_number: 14, stage: 'group', match_date: '1998-06-12T17:30:00+02:00', home_code: 'KSA', away_code: 'DEN', home_score: 0, away_score: 1, venue_slug: 'stade-felix-bollaert', referee: 'Vagner Mariano', attendance: 38058 },
  { match_number: 15, stage: 'group', match_date: '1998-06-18T17:30:00+02:00', home_code: 'FRA', away_code: 'KSA', home_score: 4, away_score: 0, venue_slug: 'stade-de-france', referee: 'Arturo Brizio', attendance: 75000, notes: 'ZIDANE EXPULSADO al min 70 (pisotón a Al-Sahafi). Suspendido 2 partidos' },
  { match_number: 16, stage: 'group', match_date: '1998-06-18T20:30:00+02:00', home_code: 'ZAF', away_code: 'DEN', home_score: 1, away_score: 1, venue_slug: 'stadium-municipal-toulouse', referee: 'Said Belqola', attendance: 36500 },
  { match_number: 17, stage: 'group', match_date: '1998-06-24T20:30:00+02:00', home_code: 'FRA', away_code: 'DEN', home_score: 2, away_score: 1, venue_slug: 'stade-gerland-lyon', referee: 'Hugh Dallas', attendance: 39100 },
  { match_number: 18, stage: 'group', match_date: '1998-06-24T20:30:00+02:00', home_code: 'ZAF', away_code: 'KSA', home_score: 2, away_score: 2, venue_slug: 'parc-lescure', referee: 'Epifanio González', attendance: 35000 },
  // ── GROUP D (ESP, NGA, PAR, BUL) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1998-06-13T17:30:00+02:00', home_code: 'PAR', away_code: 'BUL', home_score: 0, away_score: 0, venue_slug: 'stade-de-france', referee: 'Bernd Heynemann', attendance: 76000 },
  { match_number: 20, stage: 'group', match_date: '1998-06-13T20:30:00+02:00', home_code: 'NGA', away_code: 'ESP', home_score: 3, away_score: 2, venue_slug: 'stade-la-mosson', referee: 'Mario van der Ende', attendance: 32450, notes: 'ESP cae de inicio. Sunday Oliseh golazo final' },
  { match_number: 21, stage: 'group', match_date: '1998-06-19T17:30:00+02:00', home_code: 'NGA', away_code: 'BUL', home_score: 1, away_score: 0, venue_slug: 'parc-des-princes', referee: 'Lim Kee Chong', attendance: 45500 },
  { match_number: 22, stage: 'group', match_date: '1998-06-19T20:30:00+02:00', home_code: 'ESP', away_code: 'PAR', home_score: 0, away_score: 0, venue_slug: 'stade-felix-bollaert', referee: 'Esfandiar Baharmast', attendance: 38000 },
  { match_number: 23, stage: 'group', match_date: '1998-06-24T17:30:00+02:00', home_code: 'ESP', away_code: 'BUL', home_score: 6, away_score: 1, venue_slug: 'stade-felix-bollaert', referee: 'Kim Milton Nielsen', attendance: 38000, notes: 'Hierro doblete. ESP gana pero queda fuera por diferencia de goles' },
  { match_number: 24, stage: 'group', match_date: '1998-06-24T17:30:00+02:00', home_code: 'NGA', away_code: 'PAR', home_score: 1, away_score: 3, venue_slug: 'stadium-municipal-toulouse', referee: 'Mario Sánchez', attendance: 36500 },
  // ── GROUP E (NED, MEX, BEL, KOR) ─────────────────────────
  { match_number: 25, stage: 'group', match_date: '1998-06-13T14:30:00+02:00', home_code: 'KOR', away_code: 'MEX', home_score: 1, away_score: 3, venue_slug: 'stade-gerland-lyon', referee: 'Gamal Al-Ghandour', attendance: 39000 },
  { match_number: 26, stage: 'group', match_date: '1998-06-13T20:30:00+02:00', home_code: 'NED', away_code: 'BEL', home_score: 0, away_score: 0, venue_slug: 'stade-de-france', referee: 'Pierluigi Collina', attendance: 75000 },
  { match_number: 27, stage: 'group', match_date: '1998-06-20T17:30:00+02:00', home_code: 'BEL', away_code: 'MEX', home_score: 2, away_score: 2, venue_slug: 'parc-lescure', referee: 'José María García-Aranda', attendance: 34500 },
  { match_number: 28, stage: 'group', match_date: '1998-06-20T20:30:00+02:00', home_code: 'NED', away_code: 'KOR', home_score: 5, away_score: 0, venue_slug: 'stade-velodrome-marseille', referee: 'Vagner Mariano', attendance: 55000, notes: 'Cocu, Overmars, Bergkamp, Van Hooijdonk, R. de Boer' },
  { match_number: 29, stage: 'group', match_date: '1998-06-25T17:30:00+02:00', home_code: 'NED', away_code: 'MEX', home_score: 2, away_score: 2, venue_slug: 'stade-geoffroy-guichard', referee: 'Vítor Pereira', attendance: 35500, notes: 'Hernandez gol al 91 que clasifica a MEX' },
  { match_number: 30, stage: 'group', match_date: '1998-06-25T17:30:00+02:00', home_code: 'BEL', away_code: 'KOR', home_score: 1, away_score: 1, venue_slug: 'parc des princes', referee: 'Hugh Dallas', attendance: 36000 },
  // ── GROUP F (GER, IRN, USA, YUG) ─────────────────────────
  { match_number: 31, stage: 'group', match_date: '1998-06-14T17:30:00+02:00', home_code: 'YUG', away_code: 'IRN', home_score: 1, away_score: 0, venue_slug: 'stade-geoffroy-guichard', referee: 'Mario Sánchez', attendance: 31800 },
  { match_number: 32, stage: 'group', match_date: '1998-06-15T17:30:00+02:00', home_code: 'GER', away_code: 'USA', home_score: 2, away_score: 0, venue_slug: 'parc des princes', referee: 'Lucien Bouchardeau', attendance: 43815 },
  { match_number: 33, stage: 'group', match_date: '1998-06-21T17:30:00+02:00', home_code: 'GER', away_code: 'YUG', home_score: 2, away_score: 2, venue_slug: 'stade-felix-bollaert', referee: 'Pierluigi Collina', attendance: 38000 },
  { match_number: 34, stage: 'group', match_date: '1998-06-21T17:30:00+02:00', home_code: 'USA', away_code: 'IRN', home_score: 1, away_score: 2, venue_slug: 'stade-gerland-lyon', referee: 'Urs Meier', attendance: 39000, notes: '★ IRAN-USA cargado politicamente (Khatami vs Clinton). Estrechan manos previas, pero el juego va para Iran. Hamid Estili y Mahdavikia goles' },
  { match_number: 35, stage: 'group', match_date: '1998-06-25T20:30:00+02:00', home_code: 'GER', away_code: 'IRN', home_score: 2, away_score: 0, venue_slug: 'stade-velodrome-marseille', referee: 'Epifanio González', attendance: 55000 },
  { match_number: 36, stage: 'group', match_date: '1998-06-25T20:30:00+02:00', home_code: 'USA', away_code: 'YUG', home_score: 0, away_score: 1, venue_slug: 'stade-de-france', referee: 'Said Belqola', attendance: 75000 },
  // ── GROUP G (ROU, COL, ENG, TUN) ─────────────────────────
  { match_number: 37, stage: 'group', match_date: '1998-06-15T20:30:00+02:00', home_code: 'ENG', away_code: 'TUN', home_score: 2, away_score: 0, venue_slug: 'stade-velodrome-marseille', referee: 'Marc Batta', attendance: 55000 },
  { match_number: 38, stage: 'group', match_date: '1998-06-15T20:30:00+02:00', home_code: 'ROU', away_code: 'COL', home_score: 1, away_score: 0, venue_slug: 'stade-gerland-lyon', referee: 'Mario Sánchez', attendance: 38500 },
  { match_number: 39, stage: 'group', match_date: '1998-06-22T20:30:00+02:00', home_code: 'COL', away_code: 'TUN', home_score: 1, away_score: 0, venue_slug: 'stade-felix-bollaert', referee: 'Edward Lennie', attendance: 38000 },
  { match_number: 40, stage: 'group', match_date: '1998-06-22T20:30:00+02:00', home_code: 'ROU', away_code: 'ENG', home_score: 2, away_score: 1, venue_slug: 'stadium-municipal-toulouse', referee: 'Marc Batta', attendance: 36500, notes: 'Beckham debut. Owen gol pero ENG cae' },
  { match_number: 41, stage: 'group', match_date: '1998-06-26T17:30:00+02:00', home_code: 'ROU', away_code: 'TUN', home_score: 1, away_score: 1, venue_slug: 'stade-de-france', referee: 'Lucien Bouchardeau', attendance: 76000, notes: 'ROU sale "rubio" (todos jugadores tinte amarillo) celebrando clasificación, foto histórica' },
  { match_number: 42, stage: 'group', match_date: '1998-06-26T17:30:00+02:00', home_code: 'COL', away_code: 'ENG', home_score: 0, away_score: 2, venue_slug: 'stade-felix-bollaert', referee: 'Ali Bujsaim', attendance: 41000, notes: 'Anderton y Beckham (FK) goles. Inglaterra pasa' },
  // ── GROUP H (ARG, JPN, CRO, JAM) ─────────────────────────
  { match_number: 43, stage: 'group', match_date: '1998-06-14T14:30:00+02:00', home_code: 'ARG', away_code: 'JPN', home_score: 1, away_score: 0, venue_slug: 'stadium-municipal-toulouse', referee: 'Pierluigi Collina', attendance: 33400, notes: 'Batistuta gol. Japón debut Mundial historico' },
  { match_number: 44, stage: 'group', match_date: '1998-06-14T20:30:00+02:00', home_code: 'JAM', away_code: 'CRO', home_score: 1, away_score: 3, venue_slug: 'stade-felix-bollaert', referee: 'Saad Kameel Mane', attendance: 38000, notes: 'Croacia debut tras independencia 1991. Suker gol' },
  { match_number: 45, stage: 'group', match_date: '1998-06-20T17:30:00+02:00', home_code: 'JPN', away_code: 'CRO', home_score: 0, away_score: 1, venue_slug: 'stade-de-france', referee: 'Rune Pedersen', attendance: 78000 },
  { match_number: 46, stage: 'group', match_date: '1998-06-21T20:30:00+02:00', home_code: 'ARG', away_code: 'JAM', home_score: 5, away_score: 0, venue_slug: 'parc des princes', referee: 'Mansur Razzaqi', attendance: 45500, notes: 'Batistuta hat-trick' },
  { match_number: 47, stage: 'group', match_date: '1998-06-26T20:30:00+02:00', home_code: 'ARG', away_code: 'CRO', home_score: 1, away_score: 0, venue_slug: 'parc des princes', referee: 'Pierluigi Collina', attendance: 45000 },
  { match_number: 48, stage: 'group', match_date: '1998-06-26T20:30:00+02:00', home_code: 'JPN', away_code: 'JAM', home_score: 1, away_score: 2, venue_slug: 'stade-gerland-lyon', referee: 'Lucien Bouchardeau', attendance: 39000 },
  // ── OCTAVOS ── 27 jun - 30 jun ───────────────────────────
  { match_number: 49, stage: 'r16', match_date: '1998-06-27T15:30:00+02:00', home_code: 'ITA', away_code: 'NOR', home_score: 1, away_score: 0, venue_slug: 'stade-velodrome-marseille', referee: 'Bernd Heynemann', attendance: 55000, notes: 'Vieri gol' },
  { match_number: 50, stage: 'r16', match_date: '1998-06-27T20:00:00+02:00', home_code: 'BRA', away_code: 'CHI', home_score: 4, away_score: 1, venue_slug: 'parc des princes', referee: 'Lucien Bouchardeau', attendance: 45000, notes: 'Cesar Sampaio doblete, Ronaldo doblete' },
  { match_number: 51, stage: 'r16', match_date: '1998-06-28T15:30:00+02:00', home_code: 'FRA', away_code: 'PAR', home_score: 1, away_score: 0, venue_slug: 'stade-felix-bollaert', referee: 'Ali Bujsaim', attendance: 38000, notes: '★ "GOLDEN GOAL" SE ESTRENA. LAURENT BLANC marca el primer gol de oro de la historia mundialista al min 113. FRA pasa angustiosa' },
  { match_number: 52, stage: 'r16', match_date: '1998-06-28T20:00:00+02:00', home_code: 'NGA', away_code: 'DEN', home_score: 1, away_score: 4, venue_slug: 'stade-de-france', referee: 'Brian Hall', attendance: 77800, notes: 'Laudrup brillante' },
  { match_number: 53, stage: 'r16', match_date: '1998-06-29T15:30:00+02:00', home_code: 'GER', away_code: 'MEX', home_score: 2, away_score: 1, venue_slug: 'stade-gerland-lyon', referee: 'Vítor Pereira', attendance: 39000 },
  { match_number: 54, stage: 'r16', match_date: '1998-06-29T20:00:00+02:00', home_code: 'NED', away_code: 'YUG', home_score: 2, away_score: 1, venue_slug: 'stadium-municipal-toulouse', referee: 'Hugh Dallas', attendance: 33500, notes: 'Davids gol al 91' },
  { match_number: 55, stage: 'r16', match_date: '1998-06-30T15:30:00+02:00', home_code: 'ROU', away_code: 'CRO', home_score: 0, away_score: 1, venue_slug: 'parc-lescure', referee: 'Marc Batta', attendance: 33500 },
  { match_number: 56, stage: 'r16', match_date: '1998-06-30T20:00:00+02:00', home_code: 'ARG', away_code: 'ENG', home_score: 2, away_score: 2, home_score_pk: 4, away_score_pk: 3, venue_slug: 'stade-geoffroy-guichard', referee: 'Kim Milton Nielsen', attendance: 30600, notes: '★★★ Partido legendario. Batistuta y Zanetti vs Shearer y OWEN (GOLAZO 18 anios desde 30m, considerado mejor gol del Mundial). BECKHAM EXPULSADO al 47 por patada a Simeone (vilipendiado en Inglaterra). Penaltis 4-3 ARG. Batistuta marca' },
  // ── CUARTOS ── 3-4 jul ───────────────────────────────────
  { match_number: 57, stage: 'qf', match_date: '1998-07-03T17:00:00+02:00', home_code: 'FRA', away_code: 'ITA', home_score: 0, away_score: 0, home_score_pk: 4, away_score_pk: 3, venue_slug: 'stade-de-france', referee: 'Hugh Dallas', attendance: 76000, notes: 'Penaltis. Zidane vuelve tras suspension. Di Biagio falla penalti decisivo' },
  { match_number: 58, stage: 'qf', match_date: '1998-07-03T21:00:00+02:00', home_code: 'BRA', away_code: 'DEN', home_score: 3, away_score: 2, venue_slug: 'stade-beaujoire-nantes', referee: 'Toru Kamikawa', attendance: 35500, notes: 'Rivaldo doblete' },
  { match_number: 59, stage: 'qf', match_date: '1998-07-04T17:00:00+02:00', home_code: 'NED', away_code: 'ARG', home_score: 2, away_score: 1, venue_slug: 'stade-velodrome-marseille', referee: 'Arturo Brizio', attendance: 55000, notes: '★ BERGKAMP GOL DEL MUNDIAL (min 89). Pase telegráfico 60m de Frank de Boer, Bergkamp control + giro + remate. Ortega expulsado por cabezazo a Van der Sar tras simular falta' },
  { match_number: 60, stage: 'qf', match_date: '1998-07-04T21:00:00+02:00', home_code: 'GER', away_code: 'CRO', home_score: 0, away_score: 3, venue_slug: 'stade-gerland-lyon', referee: 'Rune Pedersen', attendance: 39000, notes: '★ MAYOR SORPRESA. GER (favorita) cae 0-3. Suker doblete + Jarni. CRO HISTORICAMENTE A SEMIS' },
  // ── SEMIS ── 7-8 jul ─────────────────────────────────────
  { match_number: 61, stage: 'sf', match_date: '1998-07-07T21:00:00+02:00', home_code: 'BRA', away_code: 'NED', home_score: 1, away_score: 1, home_score_pk: 4, away_score_pk: 2, venue_slug: 'stade-velodrome-marseille', referee: 'Ali Bujsaim', attendance: 54000, notes: 'Ronaldo + Kluivert. Penaltis BRA 4-2 NED. Taffarel para 2' },
  { match_number: 62, stage: 'sf', match_date: '1998-07-08T21:00:00+02:00', home_code: 'FRA', away_code: 'CRO', home_score: 2, away_score: 1, venue_slug: 'stade-de-france', referee: 'José María García-Aranda', attendance: 76000, notes: 'LILIAN THURAM doblete (sus dos UNICOS goles internacionales en toda su carrera). Suker gol primero al 46' },
  // ── 3er PUESTO ── 11 jul ─────────────────────────────────
  { match_number: 63, stage: '3rd', match_date: '1998-07-11T21:00:00+02:00', home_code: 'NED', away_code: 'CRO', home_score: 1, away_score: 2, venue_slug: 'parc-des-princes', referee: 'Epifanio González', attendance: 45000, notes: 'Suker gol 6o = BOTA DE ORO 1998. CRO TERCERA en su debut mundialista' },
  // ── FINAL ── 12 jul ──────────────────────────────────────
  { match_number: 64, stage: 'final', match_date: '1998-07-12T21:00:00+02:00', home_code: 'BRA', away_code: 'FRA', home_score: 0, away_score: 3, venue_slug: 'stade-de-france', referee: 'Said Belqola', attendance: 75000, notes: '★ FRANCIA CAMPEONA EN CASA. Zidane doblete con CABEZAZOS (min 27, 45+1) tras 2 corners de Petit y Djorkaeff. Petit 3-0 al 90+3. Bla, "Etoile Rouge" en Champs-Élysées. RONALDO EXTRAÑO antes de la final: convulsiones nocturnas, su nombre en/fuera de la planilla 2 veces. Jugó pero no rindió. Deschamps capitán. Aimé Jacquet entrenador. FRA primer pais en ganar Mundial sin estar en final anterior desde 1934' },
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

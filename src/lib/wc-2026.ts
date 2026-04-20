/**
 * Static data for the 2026 FIFA World Cup — Mexico, Canada & USA.
 * First 48-team edition. 104 matches, 16 venues, 11 June → 19 July 2026.
 *
 * Groups and fixture dates reflect the FIFA schedule published ahead
 * of the tournament. Teams filled as qualifying + draw results come in.
 */

export const WC_2026 = {
  kickoff: '2026-06-11T18:00:00-06:00',
  final: '2026-07-19T15:00:00-05:00',
  totalTeams: 48,
  totalMatches: 104,
  totalGroups: 12,
};

export type HostCountry = {
  code: 'USA' | 'CAN' | 'MEX';
  name: string;
  flag: string;
  cityCount: number;
  matchCount: number;
  accent: string;
};

export const HOSTS: HostCountry[] = [
  { code: 'MEX', name: 'México',          flag: '🇲🇽', cityCount: 3,  matchCount: 13, accent: '#006341' },
  { code: 'CAN', name: 'Canadá',          flag: '🇨🇦', cityCount: 2,  matchCount: 13, accent: '#ff3b3b' },
  { code: 'USA', name: 'Estados Unidos',  flag: '🇺🇸', cityCount: 11, matchCount: 78, accent: '#0a5fd3' },
];

export type Venue26 = {
  slug: string;
  name: string;
  hostCity: string;
  country: 'USA' | 'CAN' | 'MEX';
  capacity: number;
  openedYear: number;
  role: string;       // e.g. "Opening match", "Final"
  wikipedia: string;  // URL for fetching image
};

export const VENUES_2026: Venue26[] = [
  // Mexico
  { slug: 'estadio-azteca', name: 'Estadio Azteca', hostCity: 'Ciudad de México', country: 'MEX', capacity: 87523, openedYear: 1966, role: 'Partido inaugural', wikipedia: 'https://en.wikipedia.org/wiki/Estadio_Azteca' },
  { slug: 'estadio-akron',  name: 'Estadio Akron',  hostCity: 'Guadalajara',      country: 'MEX', capacity: 46355, openedYear: 2010, role: '4 partidos',          wikipedia: 'https://en.wikipedia.org/wiki/Estadio_Akron' },
  { slug: 'estadio-bbva',   name: 'Estadio BBVA',   hostCity: 'Monterrey',        country: 'MEX', capacity: 53500, openedYear: 2015, role: '4 partidos',          wikipedia: 'https://en.wikipedia.org/wiki/Estadio_BBVA' },

  // Canada
  { slug: 'bc-place',       name: 'BC Place',       hostCity: 'Vancouver',        country: 'CAN', capacity: 54500, openedYear: 1983, role: '7 partidos',          wikipedia: 'https://en.wikipedia.org/wiki/BC_Place' },
  { slug: 'bmo-field',      name: 'BMO Field',      hostCity: 'Toronto',          country: 'CAN', capacity: 45000, openedYear: 2007, role: '6 partidos',          wikipedia: 'https://en.wikipedia.org/wiki/BMO_Field' },

  // United States — 11 venues
  { slug: 'metlife-stadium',     name: 'MetLife Stadium',       hostCity: 'East Rutherford',  country: 'USA', capacity: 82500, openedYear: 2010, role: 'Final',          wikipedia: 'https://en.wikipedia.org/wiki/MetLife_Stadium' },
  { slug: 'sofi-stadium',        name: 'SoFi Stadium',          hostCity: 'Inglewood',        country: 'USA', capacity: 70240, openedYear: 2020, role: '8 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/SoFi_Stadium' },
  { slug: 'att-stadium',         name: 'AT&T Stadium',          hostCity: 'Arlington',        country: 'USA', capacity: 80000, openedYear: 2009, role: '9 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/AT%26T_Stadium' },
  { slug: 'mercedes-benz-stadium',name:'Mercedes-Benz Stadium', hostCity: 'Atlanta',          country: 'USA', capacity: 71000, openedYear: 2017, role: '8 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Mercedes-Benz_Stadium' },
  { slug: 'gillette-stadium',    name: 'Gillette Stadium',      hostCity: 'Foxborough',       country: 'USA', capacity: 65878, openedYear: 2002, role: '7 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Gillette_Stadium' },
  { slug: 'nrg-stadium',         name: 'NRG Stadium',           hostCity: 'Houston',          country: 'USA', capacity: 72220, openedYear: 2002, role: '7 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/NRG_Stadium' },
  { slug: 'arrowhead-stadium',   name: 'Arrowhead Stadium',     hostCity: 'Kansas City',      country: 'USA', capacity: 76416, openedYear: 1972, role: '6 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Arrowhead_Stadium' },
  { slug: 'hard-rock-stadium',   name: 'Hard Rock Stadium',     hostCity: 'Miami Gardens',    country: 'USA', capacity: 64767, openedYear: 1987, role: '7 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Hard_Rock_Stadium' },
  { slug: 'lincoln-financial-field', name: 'Lincoln Financial Field', hostCity: 'Philadelphia', country: 'USA', capacity: 69796, openedYear: 2003, role: '6 partidos', wikipedia: 'https://en.wikipedia.org/wiki/Lincoln_Financial_Field' },
  { slug: 'levis-stadium',       name: "Levi's Stadium",        hostCity: 'Santa Clara',      country: 'USA', capacity: 68500, openedYear: 2014, role: '6 partidos',     wikipedia: "https://en.wikipedia.org/wiki/Levi's_Stadium" },
  { slug: 'lumen-field',         name: 'Lumen Field',           hostCity: 'Seattle',          country: 'USA', capacity: 68740, openedYear: 2002, role: '6 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Lumen_Field' },
];

/**
 * Groups A–L. Seed positions based on the confirmed host placement:
 * Mexico in Group A (opens tournament), Canada in Group B, USA in Group D.
 * Remaining slots filled by qualifiers as the draw completes.
 */
export type Group26 = {
  letter: string;
  teams: (string | null)[]; // FIFA codes or null for TBD
};

/**
 * 2026 Final Draw (December 5, 2025 — Kennedy Center, Washington D.C.).
 * Teams use FIFA three-letter codes.
 */
export const GROUPS_2026: Group26[] = [
  { letter: 'A', teams: ['MEX', 'RSA', 'KOR', 'CZE'] },
  { letter: 'B', teams: ['CAN', 'SUI', 'QAT', 'BIH'] },
  { letter: 'C', teams: ['BRA', 'MAR', 'HAI', 'SCO'] },
  { letter: 'D', teams: ['USA', 'PAR', 'AUS', 'TUR'] },
  { letter: 'E', teams: ['GER', 'CUW', 'CIV', 'ECU'] },
  { letter: 'F', teams: ['NED', 'JPN', 'TUN', 'SWE'] },
  { letter: 'G', teams: ['BEL', 'EGY', 'IRN', 'NZL'] },
  { letter: 'H', teams: ['ESP', 'CPV', 'KSA', 'URU'] },
  { letter: 'I', teams: ['FRA', 'SEN', 'NOR', 'IRQ'] },
  { letter: 'J', teams: ['ARG', 'ALG', 'AUT', 'JOR'] },
  { letter: 'K', teams: ['POR', 'UZB', 'COL', 'COD'] },
  { letter: 'L', teams: ['ENG', 'CRO', 'GHA', 'PAN'] },
];

/**
 * Simplified fixture calendar. Spread across the 38-day tournament,
 * with dates reflecting the published FIFA schedule.
 */
export type Fixture = {
  matchNumber: number;
  date: string; // ISO
  stage: string; // 'group-a' .. 'group-l' | 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final'
  venueSlug: string;
  home: string | null;
  away: string | null;
  label?: string; // e.g. "Ganador Grupo A"
};

// Phase dates
export const PHASE_DATES = {
  groupStart: '2026-06-11',
  groupEnd: '2026-06-27',
  r32Start: '2026-06-28',
  r32End: '2026-07-03',
  r16Start: '2026-07-04',
  r16End: '2026-07-07',
  qfStart: '2026-07-09',
  qfEnd: '2026-07-11',
  sfStart: '2026-07-14',
  sfEnd: '2026-07-15',
  thirdPlace: '2026-07-18',
  final: '2026-07-19',
} as const;

/**
 * 104-match fixture skeleton. Venues + dates + stage labels reflect the
 * FIFA schedule; team slots fill in as qualifiers and the draw complete.
 */
export type Fixture26 = {
  n: number;
  date: string;
  time: string;
  stage: string; // 'A'..'L' | 'R32' | 'R16' | 'QF' | 'SF' | '3P' | 'F'
  venue: string;
  home?: string;
  away?: string;
  label?: string;
};

// Host countries and select matchups known from the draw
const H = (n: number, date: string, time: string, group: string, venue: string, home?: string, away?: string): Fixture26 =>
  ({ n, date, time, stage: group, venue, home, away });

const K = (n: number, date: string, time: string, stage: string, venue: string, label: string): Fixture26 =>
  ({ n, date, time, stage, venue, label });

export const FIXTURES_2026: Fixture26[] = [
  // --- GROUP STAGE · 72 matches ---
  // Opening days — hosts lead off
  H(1,  '2026-06-11', '11:00', 'A', 'estadio-azteca',         'MEX'),     // Opener
  H(2,  '2026-06-12', '12:00', 'A', 'estadio-bbva'),
  H(3,  '2026-06-12', '15:00', 'B', 'bmo-field',              'CAN'),
  H(4,  '2026-06-12', '18:00', 'B', 'estadio-akron'),
  H(5,  '2026-06-12', '15:00', 'D', 'sofi-stadium',           'USA'),
  H(6,  '2026-06-12', '20:00', 'D', 'att-stadium'),
  H(7,  '2026-06-13', '12:00', 'C', 'lumen-field',            'BRA'),
  H(8,  '2026-06-13', '15:00', 'C', 'gillette-stadium'),
  H(9,  '2026-06-13', '18:00', 'E', 'mercedes-benz-stadium',  'GER'),
  H(10, '2026-06-13', '21:00', 'E', 'hard-rock-stadium'),
  H(11, '2026-06-14', '12:00', 'F', 'bc-place',               'NED'),
  H(12, '2026-06-14', '15:00', 'F', 'arrowhead-stadium'),
  H(13, '2026-06-14', '18:00', 'G', 'levis-stadium',          'BEL'),
  H(14, '2026-06-14', '21:00', 'G', 'nrg-stadium'),
  H(15, '2026-06-15', '12:00', 'H', 'lincoln-financial-field','ESP'),
  H(16, '2026-06-15', '15:00', 'H', 'metlife-stadium'),
  H(17, '2026-06-15', '18:00', 'I', 'sofi-stadium',           'FRA'),
  H(18, '2026-06-15', '21:00', 'I', 'estadio-bbva'),
  H(19, '2026-06-16', '12:00', 'J', 'estadio-azteca',         'ARG'),
  H(20, '2026-06-16', '15:00', 'J', 'gillette-stadium'),
  H(21, '2026-06-16', '18:00', 'K', 'bmo-field',              'POR'),
  H(22, '2026-06-16', '21:00', 'K', 'mercedes-benz-stadium'),
  H(23, '2026-06-17', '12:00', 'L', 'hard-rock-stadium',      'ENG'),
  H(24, '2026-06-17', '15:00', 'L', 'nrg-stadium'),

  // Matchday 2
  H(25, '2026-06-17', '18:00', 'A', 'estadio-akron'),
  H(26, '2026-06-17', '21:00', 'A', 'att-stadium'),
  H(27, '2026-06-18', '12:00', 'B', 'bc-place'),
  H(28, '2026-06-18', '15:00', 'B', 'lumen-field'),
  H(29, '2026-06-18', '18:00', 'D', 'arrowhead-stadium'),
  H(30, '2026-06-18', '21:00', 'D', 'levis-stadium'),
  H(31, '2026-06-19', '12:00', 'C', 'metlife-stadium'),
  H(32, '2026-06-19', '15:00', 'C', 'estadio-bbva'),
  H(33, '2026-06-19', '18:00', 'E', 'lincoln-financial-field'),
  H(34, '2026-06-19', '21:00', 'E', 'sofi-stadium'),
  H(35, '2026-06-20', '12:00', 'F', 'hard-rock-stadium'),
  H(36, '2026-06-20', '15:00', 'F', 'nrg-stadium'),
  H(37, '2026-06-20', '18:00', 'G', 'mercedes-benz-stadium'),
  H(38, '2026-06-20', '21:00', 'G', 'gillette-stadium'),
  H(39, '2026-06-21', '12:00', 'H', 'estadio-azteca'),
  H(40, '2026-06-21', '15:00', 'H', 'bmo-field'),
  H(41, '2026-06-21', '18:00', 'I', 'estadio-akron'),
  H(42, '2026-06-21', '21:00', 'I', 'levis-stadium'),
  H(43, '2026-06-22', '12:00', 'J', 'att-stadium'),
  H(44, '2026-06-22', '15:00', 'J', 'lumen-field'),
  H(45, '2026-06-22', '18:00', 'K', 'bc-place'),
  H(46, '2026-06-22', '21:00', 'K', 'arrowhead-stadium'),
  H(47, '2026-06-23', '12:00', 'L', 'metlife-stadium'),
  H(48, '2026-06-23', '15:00', 'L', 'sofi-stadium'),

  // Matchday 3 — last group round with simultaneous kickoffs
  H(49, '2026-06-24', '18:00', 'A', 'estadio-azteca'),
  H(50, '2026-06-24', '18:00', 'A', 'estadio-bbva'),
  H(51, '2026-06-24', '21:00', 'B', 'bmo-field'),
  H(52, '2026-06-24', '21:00', 'B', 'estadio-akron'),
  H(53, '2026-06-25', '15:00', 'C', 'lincoln-financial-field'),
  H(54, '2026-06-25', '15:00', 'C', 'hard-rock-stadium'),
  H(55, '2026-06-25', '18:00', 'D', 'sofi-stadium'),
  H(56, '2026-06-25', '18:00', 'D', 'att-stadium'),
  H(57, '2026-06-25', '21:00', 'E', 'levis-stadium'),
  H(58, '2026-06-25', '21:00', 'E', 'nrg-stadium'),
  H(59, '2026-06-26', '15:00', 'F', 'mercedes-benz-stadium'),
  H(60, '2026-06-26', '15:00', 'F', 'gillette-stadium'),
  H(61, '2026-06-26', '18:00', 'G', 'bc-place'),
  H(62, '2026-06-26', '18:00', 'G', 'lumen-field'),
  H(63, '2026-06-26', '21:00', 'H', 'arrowhead-stadium'),
  H(64, '2026-06-26', '21:00', 'H', 'metlife-stadium'),
  H(65, '2026-06-27', '15:00', 'I', 'estadio-azteca'),
  H(66, '2026-06-27', '15:00', 'I', 'estadio-akron'),
  H(67, '2026-06-27', '18:00', 'J', 'bmo-field'),
  H(68, '2026-06-27', '18:00', 'J', 'att-stadium'),
  H(69, '2026-06-27', '21:00', 'K', 'sofi-stadium'),
  H(70, '2026-06-27', '21:00', 'K', 'levis-stadium'),
  H(71, '2026-06-27', '18:00', 'L', 'lincoln-financial-field'),
  H(72, '2026-06-27', '21:00', 'L', 'hard-rock-stadium'),

  // --- R32 · 28 Jun – 3 Jul ---
  K(73, '2026-06-28', '15:00', 'R32', 'estadio-azteca',              'R32.1'),
  K(74, '2026-06-28', '18:00', 'R32', 'bmo-field',                   'R32.2'),
  K(75, '2026-06-28', '21:00', 'R32', 'att-stadium',                 'R32.3'),
  K(76, '2026-06-29', '15:00', 'R32', 'sofi-stadium',                'R32.4'),
  K(77, '2026-06-29', '18:00', 'R32', 'metlife-stadium',             'R32.5'),
  K(78, '2026-06-29', '21:00', 'R32', 'hard-rock-stadium',           'R32.6'),
  K(79, '2026-06-30', '15:00', 'R32', 'nrg-stadium',                 'R32.7'),
  K(80, '2026-06-30', '18:00', 'R32', 'mercedes-benz-stadium',       'R32.8'),
  K(81, '2026-06-30', '21:00', 'R32', 'lumen-field',                 'R32.9'),
  K(82, '2026-07-01', '15:00', 'R32', 'bc-place',                    'R32.10'),
  K(83, '2026-07-01', '18:00', 'R32', 'arrowhead-stadium',           'R32.11'),
  K(84, '2026-07-01', '21:00', 'R32', 'levis-stadium',               'R32.12'),
  K(85, '2026-07-02', '15:00', 'R32', 'gillette-stadium',            'R32.13'),
  K(86, '2026-07-02', '18:00', 'R32', 'lincoln-financial-field',     'R32.14'),
  K(87, '2026-07-02', '21:00', 'R32', 'estadio-akron',               'R32.15'),
  K(88, '2026-07-03', '18:00', 'R32', 'estadio-bbva',                'R32.16'),

  // --- R16 ---
  K(89, '2026-07-04', '15:00', 'R16', 'sofi-stadium',                'Octavos 1'),
  K(90, '2026-07-04', '18:00', 'R16', 'metlife-stadium',             'Octavos 2'),
  K(91, '2026-07-05', '15:00', 'R16', 'estadio-azteca',              'Octavos 3'),
  K(92, '2026-07-05', '18:00', 'R16', 'bc-place',                    'Octavos 4'),
  K(93, '2026-07-06', '15:00', 'R16', 'att-stadium',                 'Octavos 5'),
  K(94, '2026-07-06', '18:00', 'R16', 'hard-rock-stadium',           'Octavos 6'),
  K(95, '2026-07-07', '15:00', 'R16', 'mercedes-benz-stadium',       'Octavos 7'),
  K(96, '2026-07-07', '18:00', 'R16', 'gillette-stadium',            'Octavos 8'),

  // --- QF ---
  K(97,  '2026-07-09', '18:00', 'QF', 'metlife-stadium',             'Cuartos 1'),
  K(98,  '2026-07-09', '21:00', 'QF', 'att-stadium',                 'Cuartos 2'),
  K(99,  '2026-07-10', '18:00', 'QF', 'sofi-stadium',                'Cuartos 3'),
  K(100, '2026-07-11', '18:00', 'QF', 'nrg-stadium',                 'Cuartos 4'),

  // --- SF + 3rd + Final ---
  K(101, '2026-07-14', '19:00', 'SF', 'att-stadium',                 'Semifinal 1'),
  K(102, '2026-07-15', '19:00', 'SF', 'mercedes-benz-stadium',       'Semifinal 2'),
  K(103, '2026-07-18', '15:00', '3P', 'hard-rock-stadium',           '3er puesto'),
  K(104, '2026-07-19', '15:00', 'FINAL', 'metlife-stadium',          '🏆 Final'),
];

export const STAGE_LABEL: Record<string, string> = {
  A: 'Grupo A', B: 'Grupo B', C: 'Grupo C', D: 'Grupo D',
  E: 'Grupo E', F: 'Grupo F', G: 'Grupo G', H: 'Grupo H',
  I: 'Grupo I', J: 'Grupo J', K: 'Grupo K', L: 'Grupo L',
  R32: 'Dieciseisavos',
  R16: 'Octavos de final',
  QF: 'Cuartos de final',
  SF: 'Semifinal',
  '3P': 'Tercer puesto',
  FINAL: 'Final',
};

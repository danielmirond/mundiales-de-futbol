/**
 * Static data for the 2026 FIFA World Cup, Mexico, Canada & USA.
 * First 48-team edition. 104 matches, 16 venues, 11 June → 19 July 2026.
 *
 * Times are LOCAL at the venue (not UTC/ET).
 * Source: official FIFA / Sky Sports schedule published April 2026.
 */

export const WC_2026 = {
  kickoff: '2026-06-11T13:00:00-06:00', // MEX vs RSA, Azteca, 13:00 CST
  final:   '2026-07-19T15:00:00-04:00', // MetLife, 15:00 EDT
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
  { code: 'MEX', name: 'México',         flag: '🇲🇽', cityCount: 3,  matchCount: 13, accent: '#006341' },
  { code: 'CAN', name: 'Canadá',         flag: '🇨🇦', cityCount: 2,  matchCount: 13, accent: '#ff3b3b' },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', cityCount: 11, matchCount: 78, accent: '#0a5fd3' },
];

export type Venue26 = {
  slug: string;
  /** Nombre comercial / habitual del estadio. */
  name: string;
  /**
   * Nombre que FIFA usa durante el torneo (sin patrocinadores).
   * Fuente: Wikipedia "2026 FIFA World Cup" (consultado abr 2026).
   */
  fifaName: string;
  hostCity: string;
  country: 'USA' | 'CAN' | 'MEX';
  /**
   * Aforo oficial Mundial 2026 confirmado por FIFA.
   * Fuente: Wikipedia "2026 FIFA World Cup" (cifras redondeadas FIFA).
   */
  capacity: number;
  openedYear: number;
  role: string;
  wikipedia: string;
};

export const VENUES_2026: Venue26[] = [
  // Mexico
  { slug: 'estadio-azteca', name: 'Estadio Azteca', fifaName: 'Mexico City Stadium', hostCity: 'Ciudad de México', country: 'MEX', capacity: 83000, openedYear: 1966, role: 'Partido inaugural', wikipedia: 'https://en.wikipedia.org/wiki/Estadio_Azteca' },
  { slug: 'estadio-akron',  name: 'Estadio Akron',  fifaName: 'Estadio Guadalajara', hostCity: 'Guadalajara',      country: 'MEX', capacity: 48000, openedYear: 2010, role: '4 partidos',         wikipedia: 'https://en.wikipedia.org/wiki/Estadio_Akron' },
  { slug: 'estadio-bbva',   name: 'Estadio BBVA',   fifaName: 'Estadio Monterrey',   hostCity: 'Monterrey',        country: 'MEX', capacity: 53500, openedYear: 2015, role: '4 partidos',         wikipedia: 'https://en.wikipedia.org/wiki/Estadio_BBVA' },
  // Canada
  { slug: 'bc-place',       name: 'BC Place',       fifaName: 'BC Place Vancouver',  hostCity: 'Vancouver',        country: 'CAN', capacity: 54000, openedYear: 1983, role: '7 partidos',         wikipedia: 'https://en.wikipedia.org/wiki/BC_Place' },
  { slug: 'bmo-field',      name: 'BMO Field',      fifaName: 'Toronto Stadium',     hostCity: 'Toronto',          country: 'CAN', capacity: 45000, openedYear: 2007, role: '6 partidos',         wikipedia: 'https://en.wikipedia.org/wiki/BMO_Field' },
  // United States
  { slug: 'metlife-stadium',          name: 'MetLife Stadium',          fifaName: 'New York New Jersey Stadium', hostCity: 'East Rutherford', country: 'USA', capacity: 82500, openedYear: 2010, role: 'Final',          wikipedia: 'https://en.wikipedia.org/wiki/MetLife_Stadium' },
  { slug: 'sofi-stadium',             name: 'SoFi Stadium',             fifaName: 'Los Angeles Stadium',         hostCity: 'Inglewood',       country: 'USA', capacity: 70000, openedYear: 2020, role: '8 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/SoFi_Stadium' },
  { slug: 'att-stadium',              name: 'AT&T Stadium',             fifaName: 'Dallas Stadium',              hostCity: 'Arlington',       country: 'USA', capacity: 94000, openedYear: 2009, role: '9 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/AT%26T_Stadium' },
  { slug: 'mercedes-benz-stadium',    name: 'Mercedes-Benz Stadium',    fifaName: 'Atlanta Stadium',             hostCity: 'Atlanta',         country: 'USA', capacity: 75000, openedYear: 2017, role: '8 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Mercedes-Benz_Stadium' },
  { slug: 'gillette-stadium',         name: 'Gillette Stadium',         fifaName: 'Boston Stadium',              hostCity: 'Foxborough',      country: 'USA', capacity: 65000, openedYear: 2002, role: '7 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Gillette_Stadium' },
  { slug: 'nrg-stadium',              name: 'NRG Stadium',              fifaName: 'Houston Stadium',             hostCity: 'Houston',         country: 'USA', capacity: 72000, openedYear: 2002, role: '7 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/NRG_Stadium' },
  { slug: 'arrowhead-stadium',        name: 'Arrowhead Stadium',        fifaName: 'Kansas City Stadium',         hostCity: 'Kansas City',     country: 'USA', capacity: 73000, openedYear: 1972, role: '6 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Arrowhead_Stadium' },
  { slug: 'hard-rock-stadium',        name: 'Hard Rock Stadium',        fifaName: 'Miami Stadium',               hostCity: 'Miami Gardens',   country: 'USA', capacity: 65000, openedYear: 1987, role: '7 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Hard_Rock_Stadium' },
  { slug: 'lincoln-financial-field',  name: 'Lincoln Financial Field',  fifaName: 'Philadelphia Stadium',        hostCity: 'Philadelphia',    country: 'USA', capacity: 69000, openedYear: 2003, role: '6 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Lincoln_Financial_Field' },
  { slug: 'levis-stadium',            name: "Levi's Stadium",           fifaName: 'San Francisco Bay Area Stadium', hostCity: 'Santa Clara',  country: 'USA', capacity: 71000, openedYear: 2014, role: '6 partidos',     wikipedia: "https://en.wikipedia.org/wiki/Levi's_Stadium" },
  { slug: 'lumen-field',              name: 'Lumen Field',              fifaName: 'Seattle Stadium',             hostCity: 'Seattle',         country: 'USA', capacity: 69000, openedYear: 2002, role: '6 partidos',     wikipedia: 'https://en.wikipedia.org/wiki/Lumen_Field' },
];

export type Group26 = {
  letter: string;
  teams: (string | null)[];
};

/** 2026 Final Draw, 5 December 2025, Kennedy Center, Washington D.C. */
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
 * Información estática de los 48 equipos clasificados al Mundial 2026.
 * Datos: código FIFA, nombre en español, bandera emoji, confederación.
 *
 * Usado en /2026/grupos, /2026/calendario y otros componentes que
 * necesitan render rápido sin tocar la DB. Para datos vivos (estadísticas,
 * ranking, etc.) seguir usando `getTeamByCode`.
 */
export type Team2026 = {
  code: string;
  name: string;
  flag: string;
  conf: 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
};

export const TEAMS_2026: Record<string, Team2026> = {
  // Anfitriones
  MEX: { code: 'MEX', name: 'México',           flag: '🇲🇽', conf: 'CONCACAF' },
  USA: { code: 'USA', name: 'Estados Unidos',   flag: '🇺🇸', conf: 'CONCACAF' },
  CAN: { code: 'CAN', name: 'Canadá',           flag: '🇨🇦', conf: 'CONCACAF' },
  // CONCACAF resto
  HAI: { code: 'HAI', name: 'Haití',            flag: '🇭🇹', conf: 'CONCACAF' },
  PAN: { code: 'PAN', name: 'Panamá',           flag: '🇵🇦', conf: 'CONCACAF' },
  CUW: { code: 'CUW', name: 'Curazao',          flag: '🇨🇼', conf: 'CONCACAF' },
  // CONMEBOL
  BRA: { code: 'BRA', name: 'Brasil',           flag: '🇧🇷', conf: 'CONMEBOL' },
  ARG: { code: 'ARG', name: 'Argentina',        flag: '🇦🇷', conf: 'CONMEBOL' },
  URU: { code: 'URU', name: 'Uruguay',          flag: '🇺🇾', conf: 'CONMEBOL' },
  COL: { code: 'COL', name: 'Colombia',         flag: '🇨🇴', conf: 'CONMEBOL' },
  ECU: { code: 'ECU', name: 'Ecuador',          flag: '🇪🇨', conf: 'CONMEBOL' },
  PAR: { code: 'PAR', name: 'Paraguay',         flag: '🇵🇾', conf: 'CONMEBOL' },
  // UEFA
  ESP: { code: 'ESP', name: 'España',           flag: '🇪🇸', conf: 'UEFA' },
  FRA: { code: 'FRA', name: 'Francia',          flag: '🇫🇷', conf: 'UEFA' },
  ENG: { code: 'ENG', name: 'Inglaterra',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA' },
  GER: { code: 'GER', name: 'Alemania',         flag: '🇩🇪', conf: 'UEFA' },
  NED: { code: 'NED', name: 'Países Bajos',     flag: '🇳🇱', conf: 'UEFA' },
  POR: { code: 'POR', name: 'Portugal',         flag: '🇵🇹', conf: 'UEFA' },
  CRO: { code: 'CRO', name: 'Croacia',          flag: '🇭🇷', conf: 'UEFA' },
  BEL: { code: 'BEL', name: 'Bélgica',          flag: '🇧🇪', conf: 'UEFA' },
  SUI: { code: 'SUI', name: 'Suiza',            flag: '🇨🇭', conf: 'UEFA' },
  AUT: { code: 'AUT', name: 'Austria',          flag: '🇦🇹', conf: 'UEFA' },
  NOR: { code: 'NOR', name: 'Noruega',          flag: '🇳🇴', conf: 'UEFA' },
  SWE: { code: 'SWE', name: 'Suecia',           flag: '🇸🇪', conf: 'UEFA' },
  CZE: { code: 'CZE', name: 'Chequia',          flag: '🇨🇿', conf: 'UEFA' },
  SCO: { code: 'SCO', name: 'Escocia',          flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf: 'UEFA' },
  BIH: { code: 'BIH', name: 'Bosnia',           flag: '🇧🇦', conf: 'UEFA' },
  TUR: { code: 'TUR', name: 'Turquía',          flag: '🇹🇷', conf: 'UEFA' },
  // CAF
  MAR: { code: 'MAR', name: 'Marruecos',        flag: '🇲🇦', conf: 'CAF' },
  SEN: { code: 'SEN', name: 'Senegal',          flag: '🇸🇳', conf: 'CAF' },
  EGY: { code: 'EGY', name: 'Egipto',           flag: '🇪🇬', conf: 'CAF' },
  TUN: { code: 'TUN', name: 'Túnez',            flag: '🇹🇳', conf: 'CAF' },
  ALG: { code: 'ALG', name: 'Argelia',          flag: '🇩🇿', conf: 'CAF' },
  GHA: { code: 'GHA', name: 'Ghana',            flag: '🇬🇭', conf: 'CAF' },
  CIV: { code: 'CIV', name: 'Costa de Marfil',  flag: '🇨🇮', conf: 'CAF' },
  RSA: { code: 'RSA', name: 'Sudáfrica',        flag: '🇿🇦', conf: 'CAF' },
  COD: { code: 'COD', name: 'RD del Congo',     flag: '🇨🇩', conf: 'CAF' },
  CPV: { code: 'CPV', name: 'Cabo Verde',       flag: '🇨🇻', conf: 'CAF' },
  // AFC
  JPN: { code: 'JPN', name: 'Japón',            flag: '🇯🇵', conf: 'AFC' },
  KOR: { code: 'KOR', name: 'Corea del Sur',    flag: '🇰🇷', conf: 'AFC' },
  IRN: { code: 'IRN', name: 'Irán',             flag: '🇮🇷', conf: 'AFC' },
  AUS: { code: 'AUS', name: 'Australia',        flag: '🇦🇺', conf: 'AFC' },
  KSA: { code: 'KSA', name: 'Arabia Saudí',     flag: '🇸🇦', conf: 'AFC' },
  QAT: { code: 'QAT', name: 'Catar',            flag: '🇶🇦', conf: 'AFC' },
  IRQ: { code: 'IRQ', name: 'Irak',             flag: '🇮🇶', conf: 'AFC' },
  UZB: { code: 'UZB', name: 'Uzbekistán',       flag: '🇺🇿', conf: 'AFC' },
  JOR: { code: 'JOR', name: 'Jordania',         flag: '🇯🇴', conf: 'AFC' },
  // OFC
  NZL: { code: 'NZL', name: 'Nueva Zelanda',    flag: '🇳🇿', conf: 'OFC' },
};

export function getTeam2026(code: string): Team2026 | undefined {
  return TEAMS_2026[code];
}

export const PHASE_DATES = {
  groupStart:  '2026-06-11',
  groupEnd:    '2026-06-27',
  r32Start:    '2026-06-28',
  r32End:      '2026-07-03',
  r16Start:    '2026-07-04',
  r16End:      '2026-07-07',
  qfStart:     '2026-07-09',
  qfEnd:       '2026-07-11',
  sfStart:     '2026-07-14',
  sfEnd:       '2026-07-15',
  thirdPlace:  '2026-07-18',
  final:       '2026-07-19',
} as const;

export type Fixture26 = {
  n: number;
  /** Local date at the venue (YYYY-MM-DD) */
  date: string;
  /** Local kickoff time at the venue (HH:MM, 24h) */
  time: string;
  /** 'A'..'L' for group stage | 'R32' | 'R16' | 'QF' | 'SF' | '3P' | 'FINAL' */
  stage: string;
  venue: string;
  home?: string;
  away?: string;
  label?: string;
};

export const FIXTURES_2026: Fixture26[] = [
  // ─── GROUP STAGE · 72 matches ────────────────────────────────────────────
  // All times LOCAL at the venue. Source: official FIFA schedule Apr 2026.

  // ── Matchday 1 ──────────────────────────────────────────────
  { n:  1, date:'2026-06-11', time:'13:00', stage:'A', venue:'estadio-azteca',         home:'MEX', away:'RSA' },
  { n:  2, date:'2026-06-11', time:'20:00', stage:'A', venue:'estadio-akron',          home:'KOR', away:'CZE' },
  { n:  3, date:'2026-06-12', time:'15:00', stage:'B', venue:'bmo-field',              home:'CAN', away:'BIH' },
  { n:  4, date:'2026-06-12', time:'18:00', stage:'D', venue:'sofi-stadium',           home:'USA', away:'PAR' },
  { n:  5, date:'2026-06-13', time:'12:00', stage:'B', venue:'levis-stadium',          home:'QAT', away:'SUI' },
  { n:  6, date:'2026-06-13', time:'18:00', stage:'C', venue:'metlife-stadium',        home:'BRA', away:'MAR' },
  { n:  7, date:'2026-06-13', time:'21:00', stage:'C', venue:'gillette-stadium',       home:'HAI', away:'SCO' },
  { n:  8, date:'2026-06-13', time:'21:00', stage:'D', venue:'bc-place',               home:'AUS', away:'TUR' },
  { n:  9, date:'2026-06-14', time:'12:00', stage:'E', venue:'nrg-stadium',            home:'GER', away:'CUW' },
  { n: 10, date:'2026-06-14', time:'15:00', stage:'F', venue:'att-stadium',            home:'NED', away:'JPN' },
  { n: 11, date:'2026-06-14', time:'19:00', stage:'E', venue:'lincoln-financial-field',home:'CIV', away:'ECU' },
  { n: 12, date:'2026-06-14', time:'20:00', stage:'F', venue:'estadio-bbva',           home:'SWE', away:'TUN' },
  { n: 13, date:'2026-06-15', time:'12:00', stage:'H', venue:'mercedes-benz-stadium',  home:'ESP', away:'CPV' },
  { n: 14, date:'2026-06-15', time:'12:00', stage:'G', venue:'lumen-field',            home:'BEL', away:'EGY' },
  { n: 15, date:'2026-06-15', time:'18:00', stage:'H', venue:'hard-rock-stadium',      home:'KSA', away:'URU' },
  { n: 16, date:'2026-06-15', time:'18:00', stage:'G', venue:'sofi-stadium',           home:'IRN', away:'NZL' },
  { n: 17, date:'2026-06-16', time:'15:00', stage:'I', venue:'metlife-stadium',        home:'FRA', away:'SEN' },
  { n: 18, date:'2026-06-16', time:'18:00', stage:'I', venue:'gillette-stadium',       home:'IRQ', away:'NOR' },
  { n: 19, date:'2026-06-16', time:'20:00', stage:'J', venue:'arrowhead-stadium',      home:'ARG', away:'ALG' },
  { n: 20, date:'2026-06-16', time:'21:00', stage:'J', venue:'levis-stadium',          home:'AUT', away:'JOR' },
  { n: 21, date:'2026-06-17', time:'12:00', stage:'K', venue:'nrg-stadium',            home:'POR', away:'COD' },
  { n: 22, date:'2026-06-17', time:'15:00', stage:'L', venue:'att-stadium',            home:'ENG', away:'CRO' },
  { n: 23, date:'2026-06-17', time:'19:00', stage:'L', venue:'bmo-field',              home:'GHA', away:'PAN' },
  { n: 24, date:'2026-06-17', time:'20:00', stage:'K', venue:'estadio-azteca',         home:'UZB', away:'COL' },

  // ── Matchday 2 ──────────────────────────────────────────────
  { n: 25, date:'2026-06-18', time:'12:00', stage:'A', venue:'mercedes-benz-stadium',  home:'CZE', away:'RSA' },
  { n: 26, date:'2026-06-18', time:'12:00', stage:'B', venue:'sofi-stadium',           home:'SUI', away:'BIH' },
  { n: 27, date:'2026-06-18', time:'15:00', stage:'B', venue:'bc-place',               home:'CAN', away:'QAT' },
  { n: 28, date:'2026-06-18', time:'19:00', stage:'A', venue:'estadio-akron',          home:'MEX', away:'KOR' },
  { n: 29, date:'2026-06-19', time:'12:00', stage:'D', venue:'lumen-field',            home:'USA', away:'AUS' },
  { n: 30, date:'2026-06-19', time:'18:00', stage:'C', venue:'gillette-stadium',       home:'SCO', away:'MAR' },
  { n: 31, date:'2026-06-19', time:'20:30', stage:'C', venue:'lincoln-financial-field',home:'BRA', away:'HAI' },
  { n: 32, date:'2026-06-19', time:'20:00', stage:'D', venue:'levis-stadium',          home:'TUR', away:'PAR' },
  { n: 33, date:'2026-06-21', time:'12:00', stage:'F', venue:'nrg-stadium',            home:'NED', away:'SWE' },
  { n: 34, date:'2026-06-21', time:'16:00', stage:'E', venue:'bmo-field',              home:'GER', away:'CIV' },
  { n: 35, date:'2026-06-21', time:'19:00', stage:'E', venue:'arrowhead-stadium',      home:'ECU', away:'CUW' },
  { n: 36, date:'2026-06-21', time:'22:00', stage:'F', venue:'estadio-bbva',           home:'TUN', away:'JPN' },
  { n: 37, date:'2026-06-22', time:'12:00', stage:'H', venue:'mercedes-benz-stadium',  home:'ESP', away:'KSA' },
  { n: 38, date:'2026-06-22', time:'12:00', stage:'G', venue:'sofi-stadium',           home:'BEL', away:'IRN' },
  { n: 39, date:'2026-06-22', time:'18:00', stage:'H', venue:'hard-rock-stadium',      home:'URU', away:'CPV' },
  { n: 40, date:'2026-06-22', time:'18:00', stage:'G', venue:'bc-place',               home:'NZL', away:'EGY' },
  { n: 41, date:'2026-06-23', time:'12:00', stage:'J', venue:'att-stadium',            home:'ARG', away:'AUT' },
  { n: 42, date:'2026-06-23', time:'17:00', stage:'I', venue:'lincoln-financial-field',home:'FRA', away:'IRQ' },
  { n: 43, date:'2026-06-23', time:'20:00', stage:'I', venue:'bmo-field',              home:'NOR', away:'SEN' },
  { n: 44, date:'2026-06-23', time:'20:00', stage:'J', venue:'levis-stadium',          home:'JOR', away:'ALG' },
  { n: 45, date:'2026-06-24', time:'12:00', stage:'K', venue:'nrg-stadium',            home:'POR', away:'UZB' },
  { n: 46, date:'2026-06-24', time:'16:00', stage:'L', venue:'gillette-stadium',       home:'ENG', away:'GHA' },
  { n: 47, date:'2026-06-24', time:'19:00', stage:'L', venue:'gillette-stadium',       home:'PAN', away:'CRO' },
  { n: 48, date:'2026-06-24', time:'20:00', stage:'K', venue:'estadio-akron',          home:'COL', away:'COD' },

  // ── Matchday 3 · simultaneous dentro de cada grupo ──────────
  // Grupo B, 12:00 PDT
  { n: 49, date:'2026-06-24', time:'12:00', stage:'B', venue:'bc-place',               home:'SUI', away:'CAN' },
  { n: 50, date:'2026-06-24', time:'12:00', stage:'B', venue:'lumen-field',            home:'BIH', away:'QAT' },
  // Grupo C, 18:00 EDT
  { n: 51, date:'2026-06-24', time:'18:00', stage:'C', venue:'mercedes-benz-stadium',  home:'MAR', away:'HAI' },
  { n: 52, date:'2026-06-24', time:'18:00', stage:'C', venue:'hard-rock-stadium',      home:'SCO', away:'BRA' },
  // Grupo A, 19:00 CST
  { n: 53, date:'2026-06-24', time:'19:00', stage:'A', venue:'estadio-bbva',           home:'RSA', away:'KOR' },
  { n: 54, date:'2026-06-24', time:'19:00', stage:'A', venue:'estadio-azteca',         home:'CZE', away:'MEX' },
  // Grupo E, 16:00 EDT
  { n: 55, date:'2026-06-25', time:'16:00', stage:'E', venue:'lincoln-financial-field',home:'CUW', away:'CIV' },
  { n: 56, date:'2026-06-25', time:'16:00', stage:'E', venue:'metlife-stadium',        home:'ECU', away:'GER' },
  // Grupo F, 18:00 CDT
  { n: 57, date:'2026-06-25', time:'18:00', stage:'F', venue:'arrowhead-stadium',      home:'TUN', away:'NED' },
  { n: 58, date:'2026-06-25', time:'18:00', stage:'F', venue:'att-stadium',            home:'JPN', away:'SWE' },
  // Grupo D, 19:00 PDT
  { n: 59, date:'2026-06-25', time:'19:00', stage:'D', venue:'sofi-stadium',           home:'TUR', away:'USA' },
  { n: 60, date:'2026-06-25', time:'19:00', stage:'D', venue:'levis-stadium',          home:'PAR', away:'AUS' },
  // Grupo I, 15:00 EDT
  { n: 61, date:'2026-06-26', time:'15:00', stage:'I', venue:'gillette-stadium',       home:'NOR', away:'FRA' },
  { n: 62, date:'2026-06-26', time:'15:00', stage:'I', venue:'bmo-field',              home:'SEN', away:'IRQ' },
  // Grupo H, 19:00 CDT / 18:00 CST
  { n: 63, date:'2026-06-26', time:'19:00', stage:'H', venue:'nrg-stadium',            home:'CPV', away:'KSA' },
  { n: 64, date:'2026-06-26', time:'18:00', stage:'H', venue:'estadio-akron',          home:'URU', away:'ESP' },
  // Grupo G, 20:00 PDT
  { n: 65, date:'2026-06-26', time:'20:00', stage:'G', venue:'bc-place',               home:'NZL', away:'BEL' },
  { n: 66, date:'2026-06-26', time:'20:00', stage:'G', venue:'lumen-field',            home:'EGY', away:'IRN' },
  // Grupo L, 17:00 EDT
  { n: 67, date:'2026-06-27', time:'17:00', stage:'L', venue:'metlife-stadium',        home:'PAN', away:'ENG' },
  { n: 68, date:'2026-06-27', time:'17:00', stage:'L', venue:'lincoln-financial-field',home:'CRO', away:'GHA' },
  // Grupo K, 19:30 EDT
  { n: 69, date:'2026-06-27', time:'19:30', stage:'K', venue:'hard-rock-stadium',      home:'COL', away:'POR' },
  { n: 70, date:'2026-06-27', time:'19:30', stage:'K', venue:'mercedes-benz-stadium',  home:'COD', away:'UZB' },
  // Grupo J, 21:00 CDT
  { n: 71, date:'2026-06-27', time:'21:00', stage:'J', venue:'arrowhead-stadium',      home:'ALG', away:'AUT' },
  { n: 72, date:'2026-06-27', time:'21:00', stage:'J', venue:'att-stadium',            home:'JOR', away:'ARG' },

  // ─── R32 · 16 matches ────────────────────────────────────────────────────
  { n: 73, date:'2026-06-28', time:'12:00', stage:'R32', venue:'sofi-stadium',            label:'2º A · 2º B' },
  { n: 74, date:'2026-06-29', time:'15:30', stage:'R32', venue:'gillette-stadium',        label:'1º E · 3er' },
  { n: 75, date:'2026-06-29', time:'19:00', stage:'R32', venue:'estadio-bbva',            label:'1º F · 2º C' },
  { n: 76, date:'2026-06-29', time:'12:00', stage:'R32', venue:'nrg-stadium',             label:'1º C · 2º F' },
  { n: 77, date:'2026-06-30', time:'17:00', stage:'R32', venue:'metlife-stadium',         label:'1º I · 3er' },
  { n: 78, date:'2026-06-30', time:'12:00', stage:'R32', venue:'att-stadium',             label:'2º E · 2º I' },
  { n: 79, date:'2026-06-30', time:'19:00', stage:'R32', venue:'estadio-azteca',          label:'1º A · 3er' },
  { n: 80, date:'2026-07-01', time:'12:00', stage:'R32', venue:'mercedes-benz-stadium',   label:'1º L · 3er' },
  { n: 81, date:'2026-07-01', time:'17:00', stage:'R32', venue:'levis-stadium',           label:'1º D · 3er' },
  { n: 82, date:'2026-07-01', time:'13:00', stage:'R32', venue:'lumen-field',             label:'1º G · 3er' },
  { n: 83, date:'2026-07-02', time:'19:00', stage:'R32', venue:'bmo-field',               label:'2º K · 2º L' },
  { n: 84, date:'2026-07-02', time:'12:00', stage:'R32', venue:'sofi-stadium',            label:'1º H · 2º J' },
  { n: 85, date:'2026-07-02', time:'20:00', stage:'R32', venue:'bc-place',                label:'1º B · 3er' },
  { n: 86, date:'2026-07-03', time:'18:00', stage:'R32', venue:'hard-rock-stadium',       label:'1º J · 2º H' },
  { n: 87, date:'2026-07-03', time:'20:30', stage:'R32', venue:'arrowhead-stadium',       label:'1º K · 3er' },
  { n: 88, date:'2026-07-03', time:'13:00', stage:'R32', venue:'att-stadium',             label:'2º D · 2º G' },

  // ─── R16 · 8 matches ─────────────────────────────────────────────────────
  { n: 89, date:'2026-07-04', time:'17:00', stage:'R16', venue:'lincoln-financial-field', label:'G.M74 · G.M77' },
  { n: 90, date:'2026-07-04', time:'12:00', stage:'R16', venue:'nrg-stadium',             label:'G.M73 · G.M75' },
  { n: 91, date:'2026-07-05', time:'16:00', stage:'R16', venue:'metlife-stadium',         label:'G.M76 · G.M78' },
  { n: 92, date:'2026-07-05', time:'18:00', stage:'R16', venue:'estadio-azteca',          label:'G.M79 · G.M80' },
  { n: 93, date:'2026-07-06', time:'14:00', stage:'R16', venue:'att-stadium',             label:'G.M83 · G.M84' },
  { n: 94, date:'2026-07-06', time:'17:00', stage:'R16', venue:'lumen-field',             label:'G.M81 · G.M82' },
  { n: 95, date:'2026-07-07', time:'12:00', stage:'R16', venue:'mercedes-benz-stadium',   label:'G.M86 · G.M88' },
  { n: 96, date:'2026-07-07', time:'13:00', stage:'R16', venue:'bc-place',                label:'G.M85 · G.M87' },

  // ─── Cuartos ─────────────────────────────────────────────────────────────
  { n:  97, date:'2026-07-09', time:'16:00', stage:'QF', venue:'gillette-stadium',        label:'G.M89 · G.M90' },
  { n:  98, date:'2026-07-10', time:'12:00', stage:'QF', venue:'sofi-stadium',            label:'G.M93 · G.M94' },
  { n:  99, date:'2026-07-11', time:'17:00', stage:'QF', venue:'hard-rock-stadium',       label:'G.M91 · G.M92' },
  { n: 100, date:'2026-07-11', time:'20:00', stage:'QF', venue:'arrowhead-stadium',       label:'G.M95 · G.M96' },

  // ─── Semifinales ─────────────────────────────────────────────────────────
  { n: 101, date:'2026-07-14', time:'14:00', stage:'SF', venue:'att-stadium',             label:'Semifinal 1' },
  { n: 102, date:'2026-07-15', time:'15:00', stage:'SF', venue:'mercedes-benz-stadium',   label:'Semifinal 2' },

  // ─── 3er puesto + Final ──────────────────────────────────────────────────
  { n: 103, date:'2026-07-18', time:'17:00', stage:'3P',    venue:'hard-rock-stadium',    label:'3er puesto' },
  { n: 104, date:'2026-07-19', time:'15:00', stage:'FINAL', venue:'metlife-stadium',      label:'🏆 Final' },
];

export const STAGE_LABEL: Record<string, string> = {
  A: 'Grupo A', B: 'Grupo B', C: 'Grupo C', D: 'Grupo D',
  E: 'Grupo E', F: 'Grupo F', G: 'Grupo G', H: 'Grupo H',
  I: 'Grupo I', J: 'Grupo J', K: 'Grupo K', L: 'Grupo L',
  R32:   'Dieciseisavos',
  R16:   'Octavos de final',
  QF:    'Cuartos de final',
  SF:    'Semifinal',
  '3P':  'Tercer puesto',
  FINAL: 'Final',
};

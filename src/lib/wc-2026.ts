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

export const GROUPS_2026: Group26[] = [
  { letter: 'A', teams: ['MEX', null, null, null] },
  { letter: 'B', teams: ['CAN', null, null, null] },
  { letter: 'C', teams: [null, null, null, null] },
  { letter: 'D', teams: ['USA', null, null, null] },
  { letter: 'E', teams: [null, null, null, null] },
  { letter: 'F', teams: [null, null, null, null] },
  { letter: 'G', teams: [null, null, null, null] },
  { letter: 'H', teams: [null, null, null, null] },
  { letter: 'I', teams: [null, null, null, null] },
  { letter: 'J', teams: [null, null, null, null] },
  { letter: 'K', teams: [null, null, null, null] },
  { letter: 'L', teams: [null, null, null, null] },
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

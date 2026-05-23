/**
 * Resultado canónico de la final.
 * `score`: marcador en 90' (o tras prórroga si la hubo).
 * `extraTime`: true si se decidió en prórroga.
 * `penalties`: marcador de penales si los hubo (5-2 Argentina-Italia 1990, p.ej.)
 *   En el formato de liguilla de 1950, la "final" fue Brasil-Uruguay 1-2.
 */
export type FinalResult = {
  score: string; // "4-2", "0-0 (3-2 pen)", "2-1 (TC)"
  extraTime?: boolean;
  penalties?: string; // "4-2 pen"
};

/**
 * Mejor jugador del torneo (Balón de Oro). Existe oficialmente desde 1982.
 * Antes de eso, lista la elección consensuada por la prensa de la época.
 */
export type BestPlayer = {
  name: string;
  team: string; // país
  official?: boolean; // false antes de 1982 (selección consensuada)
};

export type Tournament = {
  year: number;
  slug: string;
  host: string;
  hostCode: string;
  hostCountries?: string[];
  champion: string;
  championCode: string;
  /** Subcampeón (segundo puesto) */
  runnerUp?: string;
  runnerUpCode?: string;
  /** Tercer puesto */
  third?: string;
  thirdCode?: string;
  /** Cuarto puesto */
  fourth?: string;
  fourthCode?: string;
  /** Resultado de la final */
  finalResult?: FinalResult;
  /** Mejor jugador del torneo (Balón de Oro desde 1982) */
  bestPlayer?: BestPlayer;
  teams: number;
  matches: number;
  goals: number;
  attendance: number;
  startDate: string;
  endDate: string;
  topScorer?: { name: string; goals: number; team: string };
  palette: { from: string; to: string };
  tagline: string;
  /**
   * Descriptor SEO-friendly de cierre.
   * Patrón de uso: «Mundial {host} {year} · Partidos, historia y {seoIconic}».
   * Longer than `tagline`, optimizado para captar el cluster icónico
   * (e.g. "Campeón del Mundial de Maradona", "el del Maracanazo").
   */
  seoIconic: string;
  summary?: string;
  heroImageUrl?: string | null;
};

export const TOURNAMENTS: Tournament[] = [
  {
    year: 1930, slug: '1930-uruguay', host: 'Uruguay', hostCode: 'UY',
    champion: 'Uruguay', championCode: 'UY',
    runnerUp: 'Argentina', runnerUpCode: 'AR',
    third: 'Estados Unidos', thirdCode: 'US',
    fourth: 'Yugoslavia', fourthCode: 'YU',
    finalResult: { score: '4-2' },
    bestPlayer: { name: 'José Nasazzi', team: 'Uruguay', official: false },
    teams: 13, matches: 18, goals: 70, attendance: 590549,
    startDate: '1930-07-13', endDate: '1930-07-30',
    topScorer: { name: 'Guillermo Stábile', goals: 8, team: 'Argentina' },
    palette: { from: '#0a3d91', to: '#f5e6b3' },
    tagline: 'Donde todo empezó',
    seoIconic: 'el primer Mundial de la historia',
  },
  {
    year: 1934, slug: '1934-italia', host: 'Italia', hostCode: 'IT',
    champion: 'Italia', championCode: 'IT',
    runnerUp: 'Checoslovaquia', runnerUpCode: 'CS',
    third: 'Alemania', thirdCode: 'DE',
    fourth: 'Austria', fourthCode: 'AT',
    finalResult: { score: '2-1', extraTime: true },
    bestPlayer: { name: 'Giuseppe Meazza', team: 'Italia', official: false },
    teams: 16, matches: 17, goals: 70, attendance: 363000,
    startDate: '1934-05-27', endDate: '1934-06-10',
    topScorer: { name: 'Oldřich Nejedlý', goals: 5, team: 'Checoslovaquia' },
    palette: { from: '#0b6b3a', to: '#e4002b' },
    tagline: 'El Mundial del Duce',
    seoIconic: 'Italia campeona en plena dictadura fascista',
  },
  {
    year: 1938, slug: '1938-francia', host: 'Francia', hostCode: 'FR',
    champion: 'Italia', championCode: 'IT',
    runnerUp: 'Hungría', runnerUpCode: 'HU',
    third: 'Brasil', thirdCode: 'BR',
    fourth: 'Suecia', fourthCode: 'SE',
    finalResult: { score: '4-2' },
    bestPlayer: { name: 'Leônidas', team: 'Brasil', official: false },
    teams: 15, matches: 18, goals: 84, attendance: 374835,
    startDate: '1938-06-04', endDate: '1938-06-19',
    topScorer: { name: 'Leônidas', goals: 7, team: 'Brasil' },
    palette: { from: '#002654', to: '#ed2939' },
    tagline: 'El último antes de la guerra',
    seoIconic: 'el último Mundial antes de la Segunda Guerra Mundial',
  },
  {
    year: 1950, slug: '1950-brasil', host: 'Brasil', hostCode: 'BR',
    champion: 'Uruguay', championCode: 'UY',
    runnerUp: 'Brasil', runnerUpCode: 'BR',
    third: 'Suecia', thirdCode: 'SE',
    fourth: 'España', fourthCode: 'ES',
    // No hubo final como tal: liguilla cuadrangular. Brasil-Uruguay decisivo.
    finalResult: { score: 'Brasil 1-2 Uruguay (round-robin)' },
    bestPlayer: { name: 'Zizinho', team: 'Brasil', official: false },
    teams: 13, matches: 22, goals: 88, attendance: 1045246,
    startDate: '1950-06-24', endDate: '1950-07-16',
    topScorer: { name: 'Ademir', goals: 9, team: 'Brasil' },
    palette: { from: '#009739', to: '#fedd00' },
    tagline: 'Maracanazo',
    seoIconic: 'el del Maracanazo y la final que silenció a Brasil',
  },
  {
    year: 1954, slug: '1954-suiza', host: 'Suiza', hostCode: 'CH',
    champion: 'Alemania Occidental', championCode: 'DE',
    runnerUp: 'Hungría', runnerUpCode: 'HU',
    third: 'Austria', thirdCode: 'AT',
    fourth: 'Uruguay', fourthCode: 'UY',
    finalResult: { score: '3-2' },
    bestPlayer: { name: 'Ferenc Puskás', team: 'Hungría', official: false },
    teams: 16, matches: 26, goals: 140, attendance: 768607,
    startDate: '1954-06-16', endDate: '1954-07-04',
    topScorer: { name: 'Sándor Kocsis', goals: 11, team: 'Hungría' },
    palette: { from: '#d52b1e', to: '#ffffff' },
    tagline: 'El Milagro de Berna',
    seoIconic: 'el del Milagro de Berna y la primera Alemania campeona',
  },
  {
    year: 1958, slug: '1958-suecia', host: 'Suecia', hostCode: 'SE',
    champion: 'Brasil', championCode: 'BR',
    runnerUp: 'Suecia', runnerUpCode: 'SE',
    third: 'Francia', thirdCode: 'FR',
    fourth: 'Alemania Occidental', fourthCode: 'DE',
    finalResult: { score: '5-2' },
    bestPlayer: { name: 'Didi', team: 'Brasil', official: false },
    teams: 16, matches: 35, goals: 126, attendance: 819810,
    startDate: '1958-06-08', endDate: '1958-06-29',
    topScorer: { name: 'Just Fontaine', goals: 13, team: 'Francia' },
    palette: { from: '#005b99', to: '#ffcd00' },
    tagline: 'Nace Pelé',
    seoIconic: 'el debut mundial de Pelé con 17 años',
  },
  {
    year: 1962, slug: '1962-chile', host: 'Chile', hostCode: 'CL',
    champion: 'Brasil', championCode: 'BR',
    runnerUp: 'Checoslovaquia', runnerUpCode: 'CS',
    third: 'Chile', thirdCode: 'CL',
    fourth: 'Yugoslavia', fourthCode: 'YU',
    finalResult: { score: '3-1' },
    bestPlayer: { name: 'Garrincha', team: 'Brasil', official: false },
    palette: { from: '#d52b1e', to: '#0032a0' },
    teams: 16, matches: 32, goals: 89, attendance: 893172,
    startDate: '1962-05-30', endDate: '1962-06-17',
    // FIFA reconoció empate a 4 goles entre 6 jugadores: Garrincha y Vavá (Brasil),
    // Leonel Sánchez (Chile), Flórián Albert (Hungría), Valentin Ivanov (URSS) y
    // Dražan Jerković (Yugoslavia). Listamos a Garrincha como referencia del torneo.
    topScorer: { name: 'Garrincha / Vavá / Sánchez / Albert / Ivanov / Jerković', goals: 4, team: '-' },
    tagline: 'La Batalla de Santiago',
    seoIconic: 'Brasil bicampeón sin Pelé y la Batalla de Santiago',
  },
  {
    year: 1966, slug: '1966-inglaterra', host: 'Inglaterra', hostCode: 'GB',
    champion: 'Inglaterra', championCode: 'GB',
    runnerUp: 'Alemania Occidental', runnerUpCode: 'DE',
    third: 'Portugal', thirdCode: 'PT',
    fourth: 'URSS', fourthCode: 'SU',
    finalResult: { score: '4-2', extraTime: true },
    bestPlayer: { name: 'Bobby Charlton', team: 'Inglaterra', official: false },
    teams: 16, matches: 32, goals: 89, attendance: 1563135,
    startDate: '1966-07-11', endDate: '1966-07-30',
    topScorer: { name: 'Eusébio', goals: 9, team: 'Portugal' },
    palette: { from: '#012169', to: '#c8102e' },
    tagline: 'It came home',
    seoIconic: 'el del gol fantasma y el único título de Inglaterra',
  },
  {
    year: 1970, slug: '1970-mexico', host: 'México', hostCode: 'MX',
    champion: 'Brasil', championCode: 'BR',
    runnerUp: 'Italia', runnerUpCode: 'IT',
    third: 'Alemania Occidental', thirdCode: 'DE',
    fourth: 'Uruguay', fourthCode: 'UY',
    finalResult: { score: '4-1' },
    bestPlayer: { name: 'Pelé', team: 'Brasil', official: false },
    teams: 16, matches: 32, goals: 95, attendance: 1603975,
    startDate: '1970-05-31', endDate: '1970-06-21',
    topScorer: { name: 'Gerd Müller', goals: 10, team: 'Alemania Occidental' },
    palette: { from: '#006341', to: '#c8102e' },
    tagline: 'La selección más bella de la historia',
    seoIconic: 'el Brasil eterno de Pelé tricampeón en el Azteca',
  },
  {
    year: 1974, slug: '1974-alemania', host: 'Alemania Occidental', hostCode: 'DE',
    champion: 'Alemania Occidental', championCode: 'DE',
    runnerUp: 'Países Bajos', runnerUpCode: 'NL',
    third: 'Polonia', thirdCode: 'PL',
    fourth: 'Brasil', fourthCode: 'BR',
    finalResult: { score: '2-1' },
    bestPlayer: { name: 'Johan Cruyff', team: 'Países Bajos', official: false },
    teams: 16, matches: 38, goals: 97, attendance: 1865753,
    startDate: '1974-06-13', endDate: '1974-07-07',
    topScorer: { name: 'Grzegorz Lato', goals: 7, team: 'Polonia' },
    palette: { from: '#000000', to: '#dd0000' },
    tagline: 'El fútbol total',
    seoIconic: 'el del fútbol total holandés y el Beckenbauer campeón',
  },
  {
    year: 1978, slug: '1978-argentina', host: 'Argentina', hostCode: 'AR',
    champion: 'Argentina', championCode: 'AR',
    runnerUp: 'Países Bajos', runnerUpCode: 'NL',
    third: 'Brasil', thirdCode: 'BR',
    fourth: 'Italia', fourthCode: 'IT',
    finalResult: { score: '3-1', extraTime: true },
    bestPlayer: { name: 'Mario Kempes', team: 'Argentina', official: false },
    teams: 16, matches: 38, goals: 102, attendance: 1545791,
    startDate: '1978-06-01', endDate: '1978-06-25',
    topScorer: { name: 'Mario Kempes', goals: 6, team: 'Argentina' },
    palette: { from: '#75aadb', to: '#f6b40e' },
    tagline: 'Kempes en casa',
    seoIconic: 'Argentina campeón en casa con Kempes',
  },
  {
    year: 1982, slug: '1982-espana', host: 'España', hostCode: 'ES',
    champion: 'Italia', championCode: 'IT',
    runnerUp: 'Alemania Occidental', runnerUpCode: 'DE',
    third: 'Polonia', thirdCode: 'PL',
    fourth: 'Francia', fourthCode: 'FR',
    finalResult: { score: '3-1' },
    bestPlayer: { name: 'Paolo Rossi', team: 'Italia', official: true },
    teams: 24, matches: 52, goals: 146, attendance: 2109723,
    startDate: '1982-06-13', endDate: '1982-07-11',
    topScorer: { name: 'Paolo Rossi', goals: 6, team: 'Italia' },
    palette: { from: '#aa151b', to: '#f1bf00' },
    tagline: 'Paolo Rossi y la noche del Sarrià',
    seoIconic: 'Italia campeona, Rossi 6 goles y Gentile contra Maradona en el Sarrià',
  },
  {
    year: 1986, slug: '1986-mexico', host: 'México', hostCode: 'MX',
    champion: 'Argentina', championCode: 'AR',
    runnerUp: 'Alemania Occidental', runnerUpCode: 'DE',
    third: 'Francia', thirdCode: 'FR',
    fourth: 'Bélgica', fourthCode: 'BE',
    finalResult: { score: '3-2' },
    bestPlayer: { name: 'Diego Maradona', team: 'Argentina', official: true },
    teams: 24, matches: 52, goals: 132, attendance: 2394031,
    startDate: '1986-05-31', endDate: '1986-06-29',
    topScorer: { name: 'Gary Lineker', goals: 6, team: 'Inglaterra' },
    palette: { from: '#006341', to: '#c8102e' },
    tagline: 'La mano de Dios',
    seoIconic: 'Campeón del Mundial de Maradona',
  },
  {
    year: 1990, slug: '1990-italia', host: 'Italia', hostCode: 'IT',
    champion: 'Alemania Occidental', championCode: 'DE',
    runnerUp: 'Argentina', runnerUpCode: 'AR',
    third: 'Italia', thirdCode: 'IT',
    fourth: 'Inglaterra', fourthCode: 'GB',
    finalResult: { score: '1-0' },
    bestPlayer: { name: 'Salvatore Schillaci', team: 'Italia', official: true },
    teams: 24, matches: 52, goals: 115, attendance: 2516215,
    startDate: '1990-06-08', endDate: '1990-07-08',
    topScorer: { name: 'Salvatore Schillaci', goals: 6, team: 'Italia' },
    palette: { from: '#008c45', to: '#cd212a' },
    tagline: 'Notti Magiche',
    seoIconic: 'el de las Notti Magiche y la última Alemania Occidental',
  },
  {
    year: 1994, slug: '1994-estados-unidos', host: 'Estados Unidos', hostCode: 'US',
    champion: 'Brasil', championCode: 'BR',
    runnerUp: 'Italia', runnerUpCode: 'IT',
    third: 'Suecia', thirdCode: 'SE',
    fourth: 'Bulgaria', fourthCode: 'BG',
    finalResult: { score: '0-0', extraTime: true, penalties: '3-2 pen' },
    bestPlayer: { name: 'Romário', team: 'Brasil', official: true },
    teams: 24, matches: 52, goals: 141, attendance: 3597042,
    startDate: '1994-06-17', endDate: '1994-07-17',
    topScorer: { name: 'Hristo Stoichkov / Oleg Salenko', goals: 6, team: '-' },
    palette: { from: '#002868', to: '#bf0a30' },
    tagline: 'Romário · Penales contra Italia',
    seoIconic: 'Brasil tetracampeón con Romário en penales',
  },
  {
    year: 1998, slug: '1998-francia', host: 'Francia', hostCode: 'FR',
    champion: 'Francia', championCode: 'FR',
    runnerUp: 'Brasil', runnerUpCode: 'BR',
    third: 'Croacia', thirdCode: 'HR',
    fourth: 'Países Bajos', fourthCode: 'NL',
    finalResult: { score: '3-0' },
    bestPlayer: { name: 'Ronaldo', team: 'Brasil', official: true },
    teams: 32, matches: 64, goals: 171, attendance: 2785100,
    startDate: '1998-06-10', endDate: '1998-07-12',
    topScorer: { name: 'Davor Šuker', goals: 6, team: 'Croacia' },
    palette: { from: '#002654', to: '#ed2939' },
    tagline: 'Zidane vs. Ronaldo',
    seoIconic: 'el primer título de Francia con Zidane',
  },
  {
    year: 2002, slug: '2002-corea-japon', host: 'Corea del Sur & Japón', hostCode: 'KR',
    hostCountries: ['KR', 'JP'],
    champion: 'Brasil', championCode: 'BR',
    runnerUp: 'Alemania', runnerUpCode: 'DE',
    third: 'Turquía', thirdCode: 'TR',
    fourth: 'Corea del Sur', fourthCode: 'KR',
    finalResult: { score: '2-0' },
    bestPlayer: { name: 'Oliver Kahn', team: 'Alemania', official: true },
    teams: 32, matches: 64, goals: 161, attendance: 2705197,
    startDate: '2002-05-31', endDate: '2002-06-30',
    topScorer: { name: 'Ronaldo', goals: 8, team: 'Brasil' },
    palette: { from: '#c60c30', to: '#003478' },
    tagline: 'Ronaldo redención',
    seoIconic: 'el primer Mundial asiático y la redención de Ronaldo',
  },
  {
    year: 2006, slug: '2006-alemania', host: 'Alemania', hostCode: 'DE',
    champion: 'Italia', championCode: 'IT',
    runnerUp: 'Francia', runnerUpCode: 'FR',
    third: 'Alemania', thirdCode: 'DE',
    fourth: 'Portugal', fourthCode: 'PT',
    finalResult: { score: '1-1', extraTime: true, penalties: '5-3 pen' },
    bestPlayer: { name: 'Zinedine Zidane', team: 'Francia', official: true },
    teams: 32, matches: 64, goals: 147, attendance: 3359439,
    startDate: '2006-06-09', endDate: '2006-07-09',
    topScorer: { name: 'Miroslav Klose', goals: 5, team: 'Alemania' },
    palette: { from: '#000000', to: '#ffce00' },
    tagline: 'El cabezazo de Zidane',
    seoIconic: 'el del cabezazo de Zidane a Materazzi',
  },
  {
    year: 2010, slug: '2010-sudafrica', host: 'Sudáfrica', hostCode: 'ZA',
    champion: 'España', championCode: 'ES',
    runnerUp: 'Países Bajos', runnerUpCode: 'NL',
    third: 'Alemania', thirdCode: 'DE',
    fourth: 'Uruguay', fourthCode: 'UY',
    finalResult: { score: '1-0', extraTime: true },
    bestPlayer: { name: 'Diego Forlán', team: 'Uruguay', official: true },
    teams: 32, matches: 64, goals: 145, attendance: 3178856,
    startDate: '2010-06-11', endDate: '2010-07-11',
    // 4 jugadores empataron a 5 goles (Müller, Villa, Sneijder, Forlán). FIFA
    // entregó la Bota de Oro a Müller por desempate (3 asistencias frente a 1).
    topScorer: { name: 'Thomas Müller', goals: 5, team: 'Alemania' },
    palette: { from: '#007749', to: '#ffb81c' },
    tagline: 'Iniesta, de mi vida',
    seoIconic: 'el de la primera estrella de España con el gol de Iniesta',
  },
  {
    year: 2014, slug: '2014-brasil', host: 'Brasil', hostCode: 'BR',
    champion: 'Alemania', championCode: 'DE',
    runnerUp: 'Argentina', runnerUpCode: 'AR',
    third: 'Países Bajos', thirdCode: 'NL',
    fourth: 'Brasil', fourthCode: 'BR',
    finalResult: { score: '1-0', extraTime: true },
    bestPlayer: { name: 'Lionel Messi', team: 'Argentina', official: true },
    teams: 32, matches: 64, goals: 171, attendance: 3429873,
    startDate: '2014-06-12', endDate: '2014-07-13',
    topScorer: { name: 'James Rodríguez', goals: 6, team: 'Colombia' },
    palette: { from: '#009739', to: '#fedd00' },
    tagline: '7–1 · El Mineirazo',
    seoIconic: 'el del 7-1 de Alemania a Brasil',
  },
  {
    year: 2018, slug: '2018-rusia', host: 'Rusia', hostCode: 'RU',
    champion: 'Francia', championCode: 'FR',
    runnerUp: 'Croacia', runnerUpCode: 'HR',
    third: 'Bélgica', thirdCode: 'BE',
    fourth: 'Inglaterra', fourthCode: 'GB',
    finalResult: { score: '4-2' },
    bestPlayer: { name: 'Luka Modrić', team: 'Croacia', official: true },
    teams: 32, matches: 64, goals: 169, attendance: 3031768,
    startDate: '2018-06-14', endDate: '2018-07-15',
    topScorer: { name: 'Harry Kane', goals: 6, team: 'Inglaterra' },
    palette: { from: '#0039a6', to: '#d52b1e' },
    tagline: 'La Francia joven de Mbappé',
    seoIconic: 'el de la Francia joven de Mbappé bicampeona',
  },
  {
    year: 2022, slug: '2022-qatar', host: 'Qatar', hostCode: 'QA',
    champion: 'Argentina', championCode: 'AR',
    runnerUp: 'Francia', runnerUpCode: 'FR',
    third: 'Croacia', thirdCode: 'HR',
    fourth: 'Marruecos', fourthCode: 'MA',
    finalResult: { score: '3-3', extraTime: true, penalties: '4-2 pen' },
    bestPlayer: { name: 'Lionel Messi', team: 'Argentina', official: true },
    teams: 32, matches: 64, goals: 172, attendance: 3404252,
    startDate: '2022-11-20', endDate: '2022-12-18',
    topScorer: { name: 'Kylian Mbappé', goals: 8, team: 'Francia' },
    palette: { from: '#8a1538', to: '#ffffff' },
    tagline: 'La final más bonita de la historia',
    seoIconic: 'el último Mundial de Messi y la final más dramática',
  },
  {
    year: 2026, slug: '2026-norteamerica', host: 'EE.UU. · Canadá · México', hostCode: 'US',
    hostCountries: ['US', 'CA', 'MX'],
    champion: '-', championCode: 'TBD',
    teams: 48, matches: 104, goals: 0, attendance: 0,
    startDate: '2026-06-11', endDate: '2026-07-19',
    palette: { from: '#0a5fd3', to: '#ff3b3b' },
    tagline: 'El primero de tres sedes',
    seoIconic: 'el primer Mundial de 48 selecciones en tres países',
  },
];

export function getTournament(slugOrYear: string | number): Tournament | undefined {
  if (typeof slugOrYear === 'number') {
    return TOURNAMENTS.find((t) => t.year === slugOrYear);
  }
  return TOURNAMENTS.find((t) => t.slug === slugOrYear || t.year.toString() === slugOrYear);
}

export const WORLD_CUP_2026_KICKOFF = new Date('2026-06-11T20:00:00-06:00');

export const AGGREGATES = {
  editions: TOURNAMENTS.filter((t) => t.year < 2026).length,
  matches: TOURNAMENTS.filter((t) => t.year < 2026).reduce((s, t) => s + t.matches, 0),
  goals: TOURNAMENTS.filter((t) => t.year < 2026).reduce((s, t) => s + t.goals, 0),
  champions: new Set(TOURNAMENTS.filter((t) => t.year < 2026).map((t) => t.champion)).size,
  teams2026: 48,
};

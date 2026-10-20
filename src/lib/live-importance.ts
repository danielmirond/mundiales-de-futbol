import type { Match } from './espn';

/**
 * Cuánto pesa un partido en directo para abrir la web (determinista, sin IA).
 * Suma el peso de la competición y el de los equipos con más tirón en España.
 * Umbrales: portada y deporte 60 (Champions con un grande, LaLiga con Madrid,
 * Barça o Atleti, España); en la página de una competición abre cualquier directo.
 */
const COMP: Record<string, number> = {
  'champions-league': 50, mundial: 60, eurocopa: 60, 'nations-league': 40, 'copa-america': 35, 'mundial-de-clubes': 40,
  laliga: 40, 'copa-del-rey': 35, supercopa: 40, 'premier-league': 30, 'europa-league': 30, 'conference-league': 20,
  'serie-a': 20, bundesliga: 20, 'ligue-1': 15, libertadores: 20, 'champions-femenina': 30, 'liga-f': 20,
  nba: 25, euroliga: 30, 'liga-endesa': 20, 'mundial-de-baloncesto': 50, nfl: 20,
  'seis-naciones': 25, 'mundial-de-rugby': 40, 'mundial-de-balonmano': 40,
};

const TEAMS: [RegExp, number][] = [
  [/^(spain|españa)$/i, 60],
  [/real madrid|barcelona/i, 40],
  [/atl[eé]tico de madrid|atl[eé]tico madrid/i, 30],
  [/athletic|real sociedad|villarreal|real betis|sevilla|valencia|celta|girona/i, 15],
  [/paris saint-germain|^psg$|bayern|manchester city|liverpool|arsenal|chelsea|manchester united|inter(nazionale)?$|juventus|^ac milan/i, 25],
  [/lakers|warriors|celtics|knicks|thunder/i, 10],
];

const teamWeight = (name: string) => TEAMS.reduce((max, [re, w]) => (re.test(name) ? Math.max(max, w) : max), 0);

export function liveWeight(m: Match): number {
  const comp = COMP[m.competition.slug] ?? 10;
  const teams = Math.max(teamWeight(m.home.fullName), teamWeight(m.away.fullName));
  // Igualdad en el marcador: a igualdad de nombre, el partido más vivo.
  const close = m.home.score != null && m.away.score != null && Math.abs(m.home.score - m.away.score) <= 1 ? 3 : 0;
  return comp + teams + close;
}

export const LIVE_THRESHOLD = 60;

import data from '../data/footballcharts.json';

/**
 * Lectura de la copia diaria de football-charts.com (`scripts/footballcharts/snapshot.ts`).
 * Atribución obligatoria: «Data by football-charts.com».
 */
export type FcRow = { pos: number; team: string; pj: number; g: number; e: number; p: number; gf: number; gc: number; dg: number; pts: number; form: string };
export type FcMatch = { date: string; home: string; away: string; score?: string; ht?: string };
export type FcGroup = { season: string; sourceUrl: string; table: FcRow[]; results: FcMatch[]; fixtures: FcMatch[] };
export type FcTeamTiming = { total: number; goals: number[]; late: number; firstHalf: number };
export type FcTiming = { season: string; bins: string[]; matches: number; league: number[]; teams: Record<string, FcTeamTiming> };

const D = data as unknown as { updatedAt: string; groups: Record<string, FcGroup>; timing: Record<string, FcTiming> };

export const FC_HOME = 'https://www.football-charts.com';
export const fcUpdatedAt = () => D.updatedAt;
export const fcGroup = (code: string): FcGroup | undefined => D.groups[code];

/** Liga de ESPN → código de football-charts (solo las que tienen minuto de goles). */
const LEAGUE: Record<string, string> = { 'esp.1': 'spain1', 'esp.2': 'spain2', 'eng.1': 'premier', 'ita.1': 'italy1', 'ger.1': 'germany1', 'fra.1': 'france1' };

/** Nombres que no casan por normalización (clave: id ESPN del equipo). */
const ALIAS: Record<string, string> = {
  '93': 'Ath Bilbao', '1068': 'Atl. Madrid', '90': 'Dep. A Coruna', '131858': 'Celta Vigo B', '20983': 'Real Sociedad B',
  '382': 'Manchester City', '360': 'Manchester Utd', '268': 'B. Monchengladbach', '122': 'FC Koln', '127': 'Hamburger SV',
  '169': 'Rennes', '160': 'PSG', '6851': 'Paris FC',
};

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/\b(fc|cf|afc|ac|as|sc|ssc|rc|rcd|cd|ud|sd|ca|club|calcio|de|hove|albion|city|town)\b/g, '')
    .replace(/[^a-z]/g, '');

/** Minuto de los goles de un equipo de ESPN en su liga, o undefined si no hay datos o el nombre no casa sin ambigüedad. */
export function fcTeamTiming(espnLeague: string | undefined, teamId: string, teamName: string): { league: FcTiming; team: FcTeamTiming; name: string } | undefined {
  const code = espnLeague ? LEAGUE[espnLeague] : undefined;
  const league = code ? D.timing[code] : undefined;
  if (!league) return undefined;
  const names = Object.keys(league.teams);
  let name = ALIAS[teamId];
  if (!name) {
    const n = norm(teamName);
    const exact = names.filter((x) => norm(x) === n);
    const loose = exact.length ? exact : names.filter((x) => norm(x) && (norm(x).includes(n) || n.includes(norm(x))));
    if (loose.length === 1) name = loose[0];
  }
  const team = name ? league.teams[name] : undefined;
  return team ? { league, team, name: name! } : undefined;
}

/**
 * Respaldo de la sección universitaria: API pública de ncaa-api.henrygd.me
 * (datos de ncaa.com, sin clave, 5 peticiones/s por IP). Solo entra si ESPN
 * no responde o viene vacío. Sin fichas: los ids no son los de ESPN.
 */
import type { Ranking } from './espn-rankings';

const API = 'https://ncaa-api.henrygd.me';
const HEADERS = { 'User-Agent': 'mundiales-de-futbol.com' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function get(path: string, revalidate: number): Promise<any | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: HEADERS, next: { revalidate }, signal: AbortSignal.timeout(8000) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

const MONTH: Record<string, string> = { JAN: 'ene', FEB: 'feb', MAR: 'mar', APR: 'abr', MAY: 'may', JUN: 'jun', JUL: 'jul', AUG: 'ago', SEP: 'sep', SEPT: 'sep', OCT: 'oct', NOV: 'nov', DEC: 'dic' };
/** «Through Games OCT. 17, 2026» → « · partidos hasta el 17 oct 2026». */
const updatedEs = (u: unknown) => {
  const m = String(u ?? '').match(/([A-Z]{3,4})\.?\s+(\d{1,2}),\s*(\d{4})/i);
  return m ? ` · partidos hasta el ${m[2]} ${MONTH[m[1].toUpperCase()] ?? m[1]} ${m[3]}` : '';
};

const num = (s: unknown) => Number(String(s ?? '').replace(/[^\d]/g, '')) || 0;

/** Ranking AP (u otro) en el formato de `espn-rankings`. `sport`: `football/fbs`, `basketball-men/d1`, `basketball-women/d1`. */
export async function ncaaRanking(sport: string, ranking = 'associated-press'): Promise<Ranking | null> {
  const d = await get(`/rankings/${sport}/${ranking}`, 3600);
  if (!d?.data?.length) return null;
  return {
    name: 'AP Top 25',
    headline: `AP Top 25${updatedEs(d.updated)}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: d.data.map((x: any) => {
      const school = String(x.SCHOOL ?? '');
      const votes = school.match(/\((\d+)\)\s*$/);
      return {
        rank: num(x.RANK), previous: x['PREVIOUS RANKING'] && x['PREVIOUS RANKING'] !== 'NR' ? num(x['PREVIOUS RANKING']) : 0,
        team: school.replace(/\s*\(\d+\)\s*$/, ''), record: x.RECORD ?? '', points: num(x.POINTS), firstPlace: votes ? Number(votes[1]) : 0,
      };
    }),
  };
}

export type NcaaGame = { id: string; start: number; home: string; away: string; homeScore: string; awayScore: string; state: 'pre' | 'live' | 'final'; period: string; clock: string; network: string };

/** Partidos del día (o de la semana en fútbol americano) según ncaa.com. */
export async function ncaaScoreboard(sport: string): Promise<NcaaGame[]> {
  const d = await get(`/scoreboard/${sport}`, 120);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (d?.games ?? []).map(({ game: g }: any) => ({
    id: String(g.gameID), start: Number(g.startTimeEpoch) * 1000,
    home: g.home?.names?.short ?? '', away: g.away?.names?.short ?? '',
    homeScore: g.home?.score ?? '', awayScore: g.away?.score ?? '',
    state: g.gameState === 'final' ? 'final' : g.gameState === 'live' ? 'live' : 'pre',
    period: g.currentPeriod ?? '', clock: g.contestClock ?? '', network: g.network ?? '',
  })).filter((g: NcaaGame) => g.home && g.away);
}

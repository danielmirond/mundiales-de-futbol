/**
 * Máximos goleadores y asistentes de una competición (ESPN `statistics`).
 * ESPN no incluye el equipo en los líderes: se cruza por id de jugador con las
 * plantillas de todos los equipos (cacheadas 6 h).
 */
import type { Competition } from './competitions';
import { fetchTeams, fetchTeamRoster, type TeamRef } from './espn-team';

const SITE_API = 'https://site.api.espn.com/apis/site/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type Leader = {
  rank: number;
  athleteId: string;
  name: string;
  value: number;
  matches?: number;
  team?: TeamRef;
};
export type Leaders = { season?: string; goals: Leader[]; assists: Leader[] };

const parseMatches = (s: string) => { const m = /Matches:\s*(\d+)/i.exec(s ?? ''); return m ? Number(m[1]) : undefined; };

export async function fetchLeaders(comp: Competition, limit = 30): Promise<Leaders> {
  if (!comp.espn) return { goals: [], assists: [] };
  try {
    const res = await fetch(`${SITE_API}/${comp.espn.sport}/${comp.espn.league}/statistics`, { headers: HEADERS, next: { revalidate: 1800 } });
    if (!res.ok) return { goals: [], assists: [] };
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cats: any[] = Array.isArray(data.stats) ? data.stats : (data.stats?.categories ?? []);
    const pick = (name: string): Leader[] => {
      const c = cats.find((x) => x.name === name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (c?.leaders ?? []).slice(0, limit).map((l: any, i: number) => ({
        rank: i + 1,
        athleteId: String(l.athlete?.id ?? ''),
        name: l.athlete?.displayName ?? l.athlete?.shortName ?? '',
        value: Number(l.value ?? 0),
        matches: parseMatches(l.displayValue),
      }));
    };
    const goals = pick('goalsLeaders'), assists = pick('assistsLeaders');
    // Equipo por id de jugador (plantillas).
    const ids = new Set([...goals, ...assists].map((l) => l.athleteId));
    if (ids.size > 0) {
      const teams = await fetchTeams(comp);
      const rosters = await Promise.all(teams.map(async (t) => ({ t, r: await fetchTeamRoster(comp, t.id) })));
      const byId = new Map<string, TeamRef>();
      for (const { t, r } of rosters) for (const p of r.players) if (p.id) byId.set(p.id, t);
      for (const l of [...goals, ...assists]) l.team = byId.get(l.athleteId);
    }
    return { season: data.season?.displayName, goals, assists };
  } catch {
    return { goals: [], assists: [] };
  }
}

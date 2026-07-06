/**
 * Máximo goleador del Mundial 2026 (Bota de Oro), en vivo desde ESPN.
 *
 * Una sola llamada al scoreboard del torneo trae todos los partidos con sus
 * goles (`competitions[].details`, con goleador, equipo y tipo). Agregamos por
 * jugador; los autogoles no cuentan para el goleador. Cacheado.
 */

import { TEAMS_2026 } from '@/lib/wc-2026';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const TOURNAMENT_RANGE = '20260611-20260719';

export type Scorer = {
  id: string;
  name: string;
  team: string; // código FIFA (BRA, FRA…)
  goals: number;
  penalties: number;
};

export type TopScorers = {
  scorers: Scorer[];
  totalGoals: number;
  matchesPlayed: number;
};

/** Máximos goleadores ordenados (goles desc, luego nombre). */
export async function getTopScorers(limit = 40): Promise<TopScorers> {
  try {
    const res = await fetch(`${ESPN}?dates=${TOURNAMENT_RANGE}&lang=es`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) throw new Error(`ESPN ${res.status}`);
    const data = await res.json();

    const byId = new Map<string, Scorer>();
    let totalGoals = 0;
    let matchesPlayed = 0;

    for (const e of data.events ?? []) {
      if (e.status?.type?.state !== 'post') continue;
      matchesPlayed++;
      const comp = e.competitions?.[0] ?? {};
      const idToAbbr: Record<string, string> = {};
      for (const c of comp.competitors ?? []) {
        if (c.team?.id) idToAbbr[c.team.id] = (c.team.abbreviation ?? '').toUpperCase();
      }
      for (const play of comp.details ?? []) {
        if (!play.scoringPlay) continue;
        const type = String(play.type?.text ?? '');
        // Autogol / gol en propia meta: cuenta en el marcador pero no para el goleador.
        if (/autogol|propia/i.test(type)) continue;
        const athlete = (play.athletesInvolved ?? [])[0];
        if (!athlete?.id) continue;
        totalGoals++;
        const team = idToAbbr[play.team?.id] ?? '';
        const id = String(athlete.id);
        const cur = byId.get(id) ?? { id, name: athlete.displayName ?? '—', team, goals: 0, penalties: 0 };
        cur.goals++;
        if (/penal/i.test(type)) cur.penalties++;
        byId.set(id, cur);
      }
    }

    const scorers = [...byId.values()]
      .sort((a, b) => b.goals - a.goals || b.penalties - a.penalties || a.name.localeCompare(b.name))
      .slice(0, limit);

    return { scorers, totalGoals, matchesPlayed };
  } catch {
    return { scorers: [], totalGoals: 0, matchesPlayed: 0 };
  }
}

export const scorerTeam = (code: string) => TEAMS_2026[code];

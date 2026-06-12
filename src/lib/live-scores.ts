/**
 * Resultados del Mundial 2026 vía la API pública de ESPN (no oficial, sin key).
 * Una sola función que usan el endpoint /api/live-scores (hero) y los
 * componentes de servidor (calendario, grupos).
 */

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

/** Rango completo del torneo (11 jun → 19 jul 2026) para traer todos los partidos. */
export const TOURNAMENT_RANGE = '20260611-20260719';

// Alias ESPN → código FIFA nuestro (solo donde difieran; la mayoría coinciden).
const CODE_ALIAS: Record<string, string> = {};

function norm(abbr: string | undefined): string {
  if (!abbr) return '';
  const up = abbr.toUpperCase();
  return CODE_ALIAS[up] ?? up;
}

export type LiveMatch = {
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  state: 'pre' | 'in' | 'post';
  status: string;
  clock: string | null;
  date: string;
};

/** Clave para emparejar con un fixture (códigos FIFA local-visitante). */
export function scoreKey(home: string | undefined, away: string | undefined): string {
  return `${(home ?? '').toUpperCase()}|${(away ?? '').toUpperCase()}`;
}

/**
 * Devuelve los partidos (con marcador y estado) en el rango dado.
 * `dates`: 'YYYYMMDD' o 'YYYYMMDD-YYYYMMDD'. Por defecto, todo el torneo.
 * Cacheado `revalidate` segundos.
 */
export async function fetchScores(
  dates: string = TOURNAMENT_RANGE,
  revalidate = 60,
): Promise<LiveMatch[]> {
  try {
    const res = await fetch(`${ESPN}?dates=${dates}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`ESPN ${res.status}`);
    const data = await res.json();
    const num = (s: unknown) =>
      s === undefined || s === null || s === '' ? null : Number(s);

    return (data.events ?? []).map((e: any): LiveMatch => {
      const comp = e.competitions?.[0] ?? {};
      const competitors = comp.competitors ?? [];
      const home = competitors.find((c: any) => c.homeAway === 'home');
      const away = competitors.find((c: any) => c.homeAway === 'away');
      return {
        home: norm(home?.team?.abbreviation),
        away: norm(away?.team?.abbreviation),
        homeScore: num(home?.score),
        awayScore: num(away?.score),
        state: (e.status?.type?.state ?? 'pre') as LiveMatch['state'],
        status: e.status?.type?.shortDetail ?? e.status?.type?.description ?? '',
        clock: e.status?.displayClock ?? null,
        date: e.date ?? '',
      };
    });
  } catch {
    return [];
  }
}

/** Construye un mapa clave→partido para buscar el resultado de un fixture. */
export function buildScoreMap(matches: LiveMatch[]): Map<string, LiveMatch> {
  const map = new Map<string, LiveMatch>();
  for (const m of matches) {
    if (m.home && m.away) map.set(scoreKey(m.home, m.away), m);
  }
  return map;
}

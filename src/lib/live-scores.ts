/**
 * Resultados del Mundial 2026 vía la API pública de ESPN (no oficial, sin key).
 * Una sola función que usan el endpoint /api/live-scores (hero) y los
 * componentes de servidor (calendario, grupos).
 */

import { GROUPS_2026, FIXTURES_2026 } from '@/lib/wc-2026';
import archive from '@/data/wc-2026-results.json';

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
  id: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  state: 'pre' | 'in' | 'post';
  status: string;
  clock: string | null;
  date: string;
  /** Nombre del estadio según ESPN (para emparejar cruces de eliminatorias). */
  venue: string;
  /** Penaltis en eliminatorias con empate (null si no hubo tanda). */
  shootoutHome: number | null;
  shootoutAway: number | null;
};

type ArchiveEvent = {
  id: string; date: string; state: 'pre' | 'in' | 'post'; status: string; clock: string | null; venue: string;
  home: { abbr: string; score: number | null; shootout: number | null };
  away: { abbr: string; score: number | null; shootout: number | null };
};

/** 'YYYYMMDD' o 'YYYYMMDD-YYYYMMDD' → ['YYYY-MM-DD', 'YYYY-MM-DD']. */
function parseRange(dates: string): [string, string] {
  const iso = (d: string) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  const [a, b] = dates.split('-');
  return [iso(a), iso(b ?? a)];
}

/**
 * Partidos del archivo 2026 dentro del rango. ESPN filtra `dates` por fecha
 * LOCAL del partido (sedes UTC-4..-7), así que desplazamos 5 h el ISO (UTC)
 * para reproducir esa semántica en los bordes del rango.
 */
function fromArchive(dates: string): LiveMatch[] {
  if (!dates.startsWith('2026')) return [];
  const [from, to] = parseRange(dates);
  const events = (archive as { events: ArchiveEvent[] }).events ?? [];
  return events
    .filter((e) => {
      const local = new Date(new Date(e.date).getTime() - 5 * 3_600_000).toISOString().slice(0, 10);
      return local >= from && local <= to;
    })
    .map((e): LiveMatch => ({
      id: e.id,
      home: norm(e.home.abbr),
      away: norm(e.away.abbr),
      homeScore: e.home.score,
      awayScore: e.away.score,
      state: e.state,
      status: e.status,
      clock: e.clock,
      date: e.date,
      venue: e.venue,
      shootoutHome: e.home.shootout,
      shootoutAway: e.away.shootout,
    }));
}

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
  // Mundial 2026 ya cerrado: ESPN dejó de servirlo por rango de fechas, así que
  // el archivo (snapshot ligero en src/data) es la fuente principal.
  const archived = fromArchive(dates);
  if (archived.length > 0) return archived;
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
        id: String(e.id ?? ''),
        home: norm(home?.team?.abbreviation),
        away: norm(away?.team?.abbreviation),
        homeScore: num(home?.score),
        awayScore: num(away?.score),
        state: (e.status?.type?.state ?? 'pre') as LiveMatch['state'],
        status: e.status?.type?.shortDetail ?? e.status?.type?.description ?? '',
        clock: e.status?.displayClock ?? null,
        date: e.date ?? '',
        venue: comp.venue?.fullName ?? '',
        shootoutHome: num(home?.shootoutScore),
        shootoutAway: num(away?.shootoutScore),
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

export type StandingRow = { code: string; pj: number; pts: number; gf: number; ga: number };

/**
 * Clasificación de un grupo a partir de los resultados ya jugados.
 * Devuelve las filas ordenadas (por pts, diferencia de goles, goles a favor)
 * si ya hay algún partido disputado; si no, en orden de sorteo.
 */
export function groupStandings(
  letter: string,
  scoreMap: Map<string, LiveMatch>,
): StandingRow[] {
  const group = GROUPS_2026.find((g) => g.letter === letter);
  const table = new Map<string, StandingRow>();
  for (const code of group?.teams ?? []) {
    if (code) table.set(code, { code, pj: 0, pts: 0, gf: 0, ga: 0 });
  }
  for (const f of FIXTURES_2026) {
    if (f.stage !== letter || !f.home || !f.away) continue;
    const sc = scoreMap.get(scoreKey(f.home, f.away));
    if (!sc || sc.state === 'pre' || sc.homeScore === null || sc.awayScore === null) continue;
    const h = table.get(f.home);
    const a = table.get(f.away);
    if (!h || !a) continue;
    h.pj++; a.pj++;
    h.gf += sc.homeScore; h.ga += sc.awayScore;
    a.gf += sc.awayScore; a.ga += sc.homeScore;
    if (sc.homeScore > sc.awayScore) h.pts += 3;
    else if (sc.homeScore < sc.awayScore) a.pts += 3;
    else { h.pts++; a.pts++; }
  }
  const rows = [...table.values()];
  if (rows.some((r) => r.pj > 0)) {
    rows.sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf);
  }
  return rows;
}

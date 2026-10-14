/**
 * Capa genérica sobre la API pública de ESPN (sin key) para cualquier
 * competición del registro (`competitions.ts`): marcadores por día y
 * clasificación normalizada por deporte.
 *
 * Notas de la API (verificadas):
 *  - `scoreboard?dates=YYYYMMDD` funciona en todas las ligas; el RANGO
 *    `YYYYMMDD-YYYYMMDD` solo en fifa.world → aquí se pide por día en paralelo.
 *  - Clasificación en `apis/v2/sports/{sport}/{league}/standings`
 *    (puede venir en `children` = grupos/conferencias).
 */
import type { Competition } from './competitions';

const SITE_API = 'https://site.api.espn.com/apis/site/v2/sports';
const V2_API = 'https://site.api.espn.com/apis/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };
const MADRID = 'Europe/Madrid';

export type MatchTeam = {
  /** Id ESPN del equipo (enlace a /equipo/{id}). */
  id?: string;
  abbr: string;
  name: string;
  /** Nombre completo (displayName) — útil para cruzar con otros feeds (WOSTI). */
  fullName: string;
  logo?: string;
  /** Color primario del club (hex sin #) para el placeholder de escudo. */
  color?: string;
  score: number | null;
  /** Goles en la tanda de penaltis, si la hubo. */
  shootout?: number | null;
  record?: string;
};

export type Match = {
  id: string;
  date: string; // ISO (UTC)
  state: 'pre' | 'in' | 'post' | 'ppd';
  status: string; // "FT", "Final", "45'", "Scheduled"…
  /** Nombre de estado ESPN (STATUS_HALFTIME, STATUS_END_PERIOD, STATUS_FINAL_PEN…). */
  statusName?: string;
  /** Periodo en curso (cuarto, parte). */
  period?: number;
  /** Tipo de temporada ESPN: 1 pretemporada, 2 regular, 3 playoffs. */
  seasonType?: number;
  clock?: string;
  home: MatchTeam;
  away: MatchTeam;
  venue?: string;
  /** Slug + nombre de la competición de origen (para listados mixtos). */
  competition: { slug: string; sport: string; name: string };
};

const num = (s: unknown) => (s === undefined || s === null || s === '' ? null : Number(s));

/** Clave de día (YYYY-MM-DD) en hora de Madrid. */
export function madridDateKey(d: Date | number = Date.now()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
/** Claves de día [from, to] (offsets en días respecto a hoy, Madrid). */
export function dayKeys(fromOffset: number, toOffset: number): string[] {
  const keys: string[] = [];
  for (let o = fromOffset; o <= toOffset; o++) keys.push(madridDateKey(Date.now() + o * 86_400_000));
  return keys;
}
const toEspnDate = (key: string) => key.replace(/-/g, '');

function normalizeEvent(e: any, comp: Competition): Match | null {
  const c = e?.competitions?.[0];
  const list: any[] = c?.competitors ?? [];
  const h = list.find((x) => x.homeAway === 'home');
  const a = list.find((x) => x.homeAway === 'away');
  if (!h || !a) return null;
  const team = (x: any): MatchTeam => ({
    abbr: String(x.team?.abbreviation ?? '').toUpperCase(),
    name: x.team?.shortDisplayName ?? x.team?.displayName ?? x.team?.name ?? '',
    fullName: x.team?.displayName ?? x.team?.shortDisplayName ?? x.team?.name ?? '',
    logo: x.team?.logo ?? x.team?.logos?.[0]?.href,
    color: x.team?.color,
    score: num(x.score),
    shootout: num(x.shootoutScore),
    record: x.records?.[0]?.summary,
    id: x.team?.id ? String(x.team.id) : undefined,
  });
  const statusName: string = e.status?.type?.name ?? '';
  const rawState = (e.status?.type?.state ?? 'pre') as Match['state'];
  const state: Match['state'] = /POSTPONED|CANCELED|SUSPENDED|ABANDONED/.test(statusName) ? 'ppd' : rawState;
  return {
    id: String(e.id ?? ''),
    date: e.date ?? '',
    state,
    status: e.status?.type?.shortDetail ?? e.status?.type?.description ?? '',
    statusName,
    period: e.status?.period ? Number(e.status.period) : undefined,
    seasonType: e.season?.type != null ? Number(e.season.type) : undefined,
    clock: e.status?.displayClock,
    home: team(h),
    away: team(a),
    venue: c?.venue?.fullName,
    competition: { slug: comp.slug, sport: comp.sport, name: comp.shortName ?? comp.name },
  };
}

/** Partidos de una competición en un día concreto (clave YYYY-MM-DD). */
export async function fetchDay(comp: Competition, dayKey: string, revalidate = 300): Promise<Match[]> {
  if (!comp.espn) return [];
  try {
    const url = `${SITE_API}/${comp.espn.sport}/${comp.espn.league}/scoreboard?dates=${toEspnDate(dayKey)}`;
    const res = await fetch(url, { headers: HEADERS, next: { revalidate } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events ?? []).map((e: any) => normalizeEvent(e, comp)).filter(Boolean) as Match[];
  } catch {
    return [];
  }
}

/**
 * Partidos de varias competiciones en una ventana de días (en paralelo,
 * deduplicados y ordenados por fecha).
 */
export async function fetchWindow(comps: Competition[], days: string[], revalidate = 300): Promise<Match[]> {
  const jobs = comps.filter((c) => c.espn).flatMap((c) => days.map((d) => fetchDay(c, d, revalidate)));
  const results = await Promise.all(jobs);
  const seen = new Set<string>();
  const out: Match[] = [];
  for (const m of results.flat()) {
    const key = `${m.competition.slug}:${m.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(m);
  }
  return out.sort((x, y) => x.date.localeCompare(y.date));
}

/** Partidos de HOY (hora de Madrid) para un conjunto de competiciones. */
export async function fetchToday(comps: Competition[]): Promise<Match[]> {
  // ESPN indexa por día en hora US; pedimos hoy y mañana y filtramos por Madrid.
  const today = madridDateKey();
  const all = await fetchWindow(comps, dayKeys(0, 1), 120);
  return all.filter((m) => madridDateKey(new Date(m.date)) === today);
}

// ─── Clasificación ───────────────────────────────────────────────

export type StandingRow = {
  rank: number;
  abbr: string;
  name: string;
  logo?: string;
  stats: Record<string, string>;
};
export type StandingGroup = { name: string; rows: StandingRow[] };
export type StandingColumn = { key: string; label: string; title: string };

/** Columnas por deporte (claves = `stats[].name` de ESPN). */
export const STANDING_COLUMNS: Record<string, StandingColumn[]> = {
  soccer: [
    { key: 'gamesPlayed', label: 'PJ', title: 'Partidos jugados' },
    { key: 'wins', label: 'G', title: 'Ganados' },
    { key: 'ties', label: 'E', title: 'Empatados' },
    { key: 'losses', label: 'P', title: 'Perdidos' },
    { key: 'pointsFor', label: 'GF', title: 'Goles a favor' },
    { key: 'pointsAgainst', label: 'GC', title: 'Goles en contra' },
    { key: 'pointDifferential', label: 'DG', title: 'Diferencia de goles' },
    { key: 'points', label: 'Pts', title: 'Puntos' },
  ],
  basketball: [
    { key: 'wins', label: 'G', title: 'Victorias' },
    { key: 'losses', label: 'P', title: 'Derrotas' },
    { key: 'winPercent', label: '%', title: 'Porcentaje de victorias' },
    { key: 'gamesBehind', label: 'Dif', title: 'Partidos de diferencia' },
    { key: 'streak', label: 'Racha', title: 'Racha actual' },
  ],
  football: [
    { key: 'wins', label: 'G', title: 'Ganados' },
    { key: 'losses', label: 'P', title: 'Perdidos' },
    { key: 'ties', label: 'E', title: 'Empatados' },
    { key: 'winPercent', label: '%', title: 'Porcentaje de victorias' },
    { key: 'pointsFor', label: 'PF', title: 'Puntos a favor' },
    { key: 'pointsAgainst', label: 'PC', title: 'Puntos en contra' },
    { key: 'streak', label: 'Racha', title: 'Racha actual' },
  ],
  hockey: [
    { key: 'gamesPlayed', label: 'PJ', title: 'Partidos jugados' },
    { key: 'wins', label: 'G', title: 'Ganados' },
    { key: 'losses', label: 'P', title: 'Perdidos' },
    { key: 'otLosses', label: 'PP', title: 'Perdidos en prórroga o penaltis' },
    { key: 'pointsFor', label: 'GF', title: 'Goles a favor' },
    { key: 'pointsAgainst', label: 'GC', title: 'Goles en contra' },
    { key: 'points', label: 'Pts', title: 'Puntos' },
  ],
  baseball: [
    { key: 'wins', label: 'G', title: 'Ganados' },
    { key: 'losses', label: 'P', title: 'Perdidos' },
    { key: 'winPercent', label: '%', title: 'Porcentaje de victorias' },
    { key: 'gamesBehind', label: 'Dif', title: 'Partidos de diferencia' },
    { key: 'pointsFor', label: 'CA', title: 'Carreras a favor' },
    { key: 'pointsAgainst', label: 'CC', title: 'Carreras en contra' },
    { key: 'streak', label: 'Racha', title: 'Racha actual' },
  ],
  rugby: [
    { key: 'gamesPlayed', label: 'PJ', title: 'Partidos jugados' },
    { key: 'wins', label: 'G', title: 'Ganados' },
    { key: 'ties', label: 'E', title: 'Empatados' },
    { key: 'losses', label: 'P', title: 'Perdidos' },
    { key: 'pointDifferential', label: 'Dif', title: 'Diferencia de puntos' },
    { key: 'points', label: 'Pts', title: 'Puntos' },
  ],
};

export async function fetchStandings(comp: Competition): Promise<{ season?: number; groups: StandingGroup[] }> {
  if (!comp.espn || !comp.hasStandings) return { groups: [] };
  try {
    const res = await fetch(`${V2_API}/${comp.espn.sport}/${comp.espn.league}/standings`, {
      headers: HEADERS, next: { revalidate: 900 },
    });
    if (!res.ok) return { groups: [] };
    const data = await res.json();
    const groupsRaw: any[] = data.children?.length ? data.children : [data];
    const groups: StandingGroup[] = groupsRaw.map((g) => {
      const entries: any[] = g.standings?.entries ?? [];
      const rows: StandingRow[] = entries.map((r, i) => {
        const stats: Record<string, string> = {};
        for (const s of r.stats ?? []) if (s?.name) stats[s.name] = String(s.displayValue ?? s.value ?? '');
        const rank = Number(stats.rank ?? stats.playoffSeed ?? i + 1) || i + 1;
        return {
          rank,
          abbr: String(r.team?.abbreviation ?? ''),
          name: r.team?.shortDisplayName ?? r.team?.displayName ?? '',
          logo: r.team?.logos?.[0]?.href,
          stats,
        };
      }).sort((x, y) => x.rank - y.rank);
      return { name: g.name ?? data.name ?? '', rows };
    }).filter((g) => g.rows.length > 0);
    return { season: data.season?.year, groups };
  } catch {
    return { groups: [] };
  }
}

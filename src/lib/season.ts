/**
 * Temporada completa de una competición (calendario, jornadas, resultados).
 *
 * ESPN no numera las jornadas en fútbol: el scoreboard trae `leagues[0].calendar`
 * (todos los días con partido) y los eventos por día. Aquí se descargan todos
 * los días de la temporada (los pasados con caché larga) y se agrupan en
 * jornadas por bloques: fin de semana (viernes a lunes) y entre semana
 * (martes a jueves). Para baloncesto se agrupa por semana natural.
 */
import type { Competition } from './competitions';
import { fetchDay, madridDateKey, type Match } from './espn';

const SITE_API = 'https://site.api.espn.com/apis/site/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type Matchday = {
  /** Número correlativo (1..n) dentro de la temporada. */
  n: number;
  /** Slug de URL: `jornada-9` (ligas) o `ronda-3` (copas) o `semana-12` (baloncesto). */
  slug: string;
  label: string;
  from: string; // YYYY-MM-DD (Madrid)
  to: string;
  matches: Match[];
  played: number;
  live: number;
};

export type Season = { year?: number; name?: string; days: string[]; matches: Match[]; matchdays: Matchday[] };

/** Días con partido de la temporada en curso (calendario ESPN), en clave Madrid. */
export async function fetchSeasonDays(comp: Competition): Promise<{ year?: number; name?: string; days: string[] }> {
  if (!comp.espn) return { days: [] };
  try {
    const res = await fetch(`${SITE_API}/${comp.espn.sport}/${comp.espn.league}/scoreboard?dates=${madridDateKey().replace(/-/g, '')}`, { headers: HEADERS, next: { revalidate: 3600 } });
    if (!res.ok) return { days: [] };
    const data = await res.json();
    const league = data.leagues?.[0];
    const cal: string[] = Array.isArray(league?.calendar) ? league.calendar : [];
    // El calendario viene en UTC a las 07:00 → la clave de día en Madrid es la misma fecha.
    const days = [...new Set(cal.map((d) => String(d).slice(0, 10)))].sort();
    return { year: league?.season?.year, name: league?.season?.displayName, days };
  } catch {
    return { days: [] };
  }
}

/** Todos los partidos de la temporada (por día, en paralelo; pasados con caché de un día). */
export async function fetchSeason(comp: Competition): Promise<Season> {
  const { year, name, days } = await fetchSeasonDays(comp);
  const today = madridDateKey();
  const results = await Promise.all(days.map((d) => fetchDay(comp, d, d < today ? 86_400 : 300)));
  const seen = new Set<string>();
  const matches: Match[] = [];
  for (const m of results.flat()) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    matches.push(m);
  }
  matches.sort((a, b) => a.date.localeCompare(b.date));
  return { year, name, days, matches, matchdays: groupMatchdays(matches, comp) };
}

/** Clave de bloque: lunes cuenta con el fin de semana anterior; martes-jueves es bloque entre semana. */
function blockKey(key: string, weekly: boolean): string {
  const d = new Date(`${key}T12:00:00Z`);
  const dow = d.getUTCDay();
  // Lunes ISO de la semana
  const monday = new Date(d); monday.setUTCDate(d.getUTCDate() - ((dow + 6) % 7));
  if (weekly) return monday.toISOString().slice(0, 10);
  if (dow === 1) { // lunes → fin de semana anterior
    const prev = new Date(monday); prev.setUTCDate(monday.getUTCDate() - 7);
    return `${prev.toISOString().slice(0, 10)}:fin`;
  }
  if (dow >= 2 && dow <= 4) return `${monday.toISOString().slice(0, 10)}:mid`;
  return `${monday.toISOString().slice(0, 10)}:fin`;
}

const esDate = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short' });
const fmtRange = (from: string, to: string) => {
  const a = esDate.format(new Date(`${from}T12:00:00Z`)), b = esDate.format(new Date(`${to}T12:00:00Z`));
  return from === to ? a : `${a} – ${b}`;
};

/** Agrupa los partidos en jornadas (ligas), rondas (copas) o semanas (baloncesto). */
export function groupMatchdays(matches: Match[], comp: Competition): Matchday[] {
  const weekly = comp.sport !== 'futbol';
  const buckets = new Map<string, Match[]>();
  for (const m of matches) {
    const k = blockKey(madridDateKey(new Date(m.date)), weekly);
    buckets.set(k, [...(buckets.get(k) ?? []), m]);
  }
  const word = weekly ? 'semana' : comp.kind === 'liga' ? 'jornada' : 'ronda';
  const Word = word[0].toUpperCase() + word.slice(1);
  return [...buckets.entries()]
    .sort((a, b) => a[1][0].date.localeCompare(b[1][0].date))
    .map(([, ms], i) => {
      const keys = ms.map((m) => madridDateKey(new Date(m.date))).sort();
      const from = keys[0], to = keys[keys.length - 1];
      return {
        n: i + 1,
        slug: `${word}-${i + 1}`,
        label: weekly ? `Semana del ${esDate.format(new Date(`${from}T12:00:00Z`))}` : `${Word} ${i + 1}`,
        from, to, matches: ms,
        played: ms.filter((m) => m.state === 'post').length,
        live: ms.filter((m) => m.state === 'in').length,
      };
    });
}

export const matchdayRange = (md: Matchday) => fmtRange(md.from, md.to);

/** Jornada «actual»: la que tiene partidos en juego, o la primera con partidos pendientes, o la última. */
export function currentMatchday(mds: Matchday[]): Matchday | undefined {
  return mds.find((m) => m.live > 0) ?? mds.find((m) => m.played < m.matches.length) ?? mds[mds.length - 1];
}
/** Última jornada con algún partido jugado. */
export function lastPlayedMatchday(mds: Matchday[]): Matchday | undefined {
  return [...mds].reverse().find((m) => m.played > 0);
}
export function findMatchday(mds: Matchday[], slug: string): Matchday | undefined {
  return mds.find((m) => m.slug === slug);
}

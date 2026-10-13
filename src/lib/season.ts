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
  /** Partidos aún por jugar o en juego (los aplazados sin fecha no cuentan). */
  pending: number;
};

export type Phase = { label: string; start: string; end: string };
export type Season = { year?: number; name?: string; days: string[]; phases?: Phase[]; matches: Match[]; matchdays: Matchday[] };

/** Etiquetas ESPN de fases → español. */
const PHASE_ES: Record<string, string> = {
  'league phase': 'Fase liga', 'league stage': 'Fase liga', 'group stage': 'Fase de grupos', 'knockout round playoffs': 'Playoff de eliminatorias',
  'round of 32': 'Dieciseisavos', 'rd of 32': 'Dieciseisavos', 'round of 16': 'Octavos de final', 'rd of 16': 'Octavos de final', 'quarterfinals': 'Cuartos de final', 'semifinals': 'Semifinales', 'final': 'Final',
  'qualifying round': 'Ronda previa', 'preliminary round': 'Ronda preliminar', 'first round': 'Primera ronda', 'second round': 'Segunda ronda', 'third round': 'Tercera ronda', 'fourth round': 'Cuarta ronda',
  'regular season': 'Temporada regular', 'playoffs': 'Playoffs', 'play-in': 'Play-in', 'preseason': 'Pretemporada',
};
export const phaseLabelEs = (label: string) => PHASE_ES[label.toLowerCase().trim()] ?? label;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (key: string, n: number) => { const d = new Date(`${key}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return isoDay(d); };

/**
 * Días con partido de la temporada en curso. En ligas ESPN da la lista de
 * días (`calendar`); en torneos da fases con rango de fechas: entonces se
 * consulta una ventana de días alrededor de hoy (solo martes-jueves en las
 * copas europeas, que juegan entre semana).
 */
export async function fetchSeasonDays(comp: Competition): Promise<{ year?: number; name?: string; days: string[]; phases?: Phase[] }> {
  if (!comp.espn) return { days: [] };
  try {
    const res = await fetch(`${SITE_API}/${comp.espn.sport}/${comp.espn.league}/scoreboard?dates=${madridDateKey().replace(/-/g, '')}`, { headers: HEADERS, next: { revalidate: 3600 } });
    if (!res.ok) return { days: [] };
    const data = await res.json();
    const league = data.leagues?.[0];
    const cal: unknown[] = Array.isArray(league?.calendar) ? league.calendar : [];
    const year = league?.season?.year, name = league?.season?.displayName;
    if (cal.length > 0 && typeof cal[0] === 'string') {
      // El calendario viene en UTC a las 07:00 → la clave de día en Madrid es la misma fecha.
      const days = [...new Set((cal as string[]).map((d) => d.slice(0, 10)))].sort();
      return { year, name, days };
    }
    // Torneo: fases con rango. Entradas anidadas en calendar[0].entries.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: any[] = (cal as any[]).flatMap((c) => (Array.isArray(c?.entries) ? c.entries : [c]));
    const phases: Phase[] = entries.filter((e) => e?.label && e?.startDate).map((e) => ({ label: String(e.label), start: String(e.startDate).slice(0, 10), end: String(e.endDate ?? e.startDate).slice(0, 10) }));
    const today = madridDateKey();
    // Copas europeas (fase liga): solo martes-jueves. Copas nacionales: cualquier día.
    const midweekOnly = comp.hasStandings;
    const from = addDays(today, midweekOnly ? -120 : -90), to = addDays(today, 45);
    const days: string[] = [];
    for (let k = from; k <= to; k = addDays(k, 1)) {
      const dow = new Date(`${k}T12:00:00Z`).getUTCDay();
      const inPhase = phases.length === 0 || phases.some((p) => k >= p.start && k <= p.end);
      if (inPhase && (!midweekOnly || (dow >= 2 && dow <= 4))) days.push(k);
    }
    return { year, name, days, phases };
  } catch {
    return { days: [] };
  }
}

/** Todos los partidos de la temporada (por día, en paralelo; pasados con caché de un día). */
export async function fetchSeason(comp: Competition): Promise<Season> {
  const { year, name, days, phases } = await fetchSeasonDays(comp);
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
  return { year, name, days, phases, matches, matchdays: groupMatchdays(matches, comp, phases) };
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

/**
 * Agrupa los partidos en jornadas (ligas), rondas (copas) o semanas (baloncesto).
 *
 * Ligas y fases de liga (hay clasificación): cada equipo juega una vez por
 * jornada, así que se recorre la temporada por fecha y cada partido va a la
 * primera jornada en la que ninguno de los dos ha jugado todavía; un partido
 * aplazado y recuperado meses después cae en su jornada original.
 * Copas por eliminatorias y baloncesto: bloques de fechas (fin de semana /
 * entre semana, o semana natural).
 */
export function groupMatchdays(matches: Match[], comp: Competition, phases?: Phase[]): Matchday[] {
  const weekly = comp.sport !== 'futbol';
  // Un partido «programado» con fecha pasada es un aplazado sin nueva fecha: no cuenta como pendiente.
  const stale = new Date(Date.now() - 36 * 3_600_000).toISOString();
  const out: Matchday[] = [];
  const push = (ms: Match[], label: string, word: string) => {
    ms.sort((a, b) => a.date.localeCompare(b.date));
    const keys = ms.map((m) => madridDateKey(new Date(m.date))).sort();
    const first = keys[0];
    const core = keys.filter((k) => k <= addDays(first, 6));
    const n = out.length + 1;
    out.push({
      n, slug: `${word}-${n}`, label, from: first, to: core[core.length - 1] ?? first, matches: ms,
      played: ms.filter((m) => m.state === 'post').length,
      live: ms.filter((m) => m.state === 'in').length,
      pending: ms.filter((m) => m.state === 'in' || (m.state === 'pre' && m.date >= stale)).length,
    });
  };
  /** Cada equipo juega una vez por jornada: el partido va a la primera jornada libre para ambos. */
  const byTeamOnce = (ms: Match[]): Match[][] => {
    const buckets: Match[][] = []; const teamsIn: Set<string>[] = [];
    const key = (t: Match['home']) => t.id ?? t.abbr;
    for (const m of ms) {
      const h = key(m.home), a = key(m.away);
      let i = buckets.findIndex((_, idx) => !teamsIn[idx].has(h) && !teamsIn[idx].has(a));
      if (i < 0) { i = buckets.length; buckets.push([]); teamsIn.push(new Set()); }
      buckets[i].push(m); teamsIn[i].add(h); teamsIn[i].add(a);
    }
    return buckets;
  };
  const byBlock = (ms: Match[]): Match[][] => {
    const map = new Map<string, Match[]>();
    for (const m of ms) { const k = blockKey(madridDateKey(new Date(m.date)), weekly); map.set(k, [...(map.get(k) ?? []), m]); }
    return [...map.values()].sort((a, b) => a[0].date.localeCompare(b[0].date));
  };

  if (phases && phases.length > 0 && comp.sport === 'futbol') {
    // Torneo: una entrada por fase; la fase liga/grupos se subdivide en jornadas.
    for (const ph of phases) {
      const ms = matches.filter((m) => { const k = madridDateKey(new Date(m.date)); return k >= ph.start && k <= ph.end; });
      if (ms.length === 0) continue;
      const es = phaseLabelEs(ph.label);
      if (/liga|grupos/i.test(es)) byTeamOnce(ms).forEach((b, i) => push(b, `${es} · Jornada ${i + 1}`, 'jornada'));
      else { const blocks = byBlock(ms); blocks.forEach((b, i) => push(b, blocks.length > 1 ? `${es} · ${i === 0 ? 'ida' : i === 1 ? 'vuelta' : `bloque ${i + 1}`}` : es, 'ronda')); }
    }
    return out;
  }
  if (weekly) { byBlock(matches).forEach((b) => push(b, `Semana del ${esDate.format(new Date(`${madridDateKey(new Date(b[0].date))}T12:00:00Z`))}`, 'semana')); return out; }
  if (comp.hasStandings) { byTeamOnce(matches).forEach((b, i) => push(b, `Jornada ${i + 1}`, 'jornada')); return out; }
  byBlock(matches).forEach((b, i) => push(b, `Ronda ${i + 1}`, 'ronda'));
  return out;
}

export const matchdayRange = (md: Matchday) => fmtRange(md.from, md.to);

/** Jornada «actual»: la que tiene partidos en juego, o la primera con partidos pendientes, o la última. */
export function currentMatchday(mds: Matchday[]): Matchday | undefined {
  return mds.find((m) => m.live > 0) ?? mds.find((m) => m.pending > 0) ?? mds[mds.length - 1];
}
/** Última jornada con algún partido jugado. */
export function lastPlayedMatchday(mds: Matchday[]): Matchday | undefined {
  return [...mds].reverse().find((m) => m.played > 0);
}
export function findMatchday(mds: Matchday[], slug: string): Matchday | undefined {
  return mds.find((m) => m.slug === slug);
}

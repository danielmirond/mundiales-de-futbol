/**
 * SportAPI (RapidAPI, espejo de SofaScore). Presupuesto de 50 peticiones/día
 * en el plan de prueba: NO se consulta en runtime. El cron ejecuta
 * `scripts/sportapi/snapshot.ts`, que guarda en `src/data/sportapi-snapshot.json`
 * las jornadas oficiales y las bajas de los partidos próximos; aquí solo se lee.
 */
import snapshotRaw from '@/data/sportapi-snapshot.json';
import { normaliza } from './wosti';

export const SPORTAPI_HOST = 'sportapi7.p.rapidapi.com';

/** Ids de «unique tournament» de SofaScore por slug de competición nuestro. */
export const SPORTAPI_TOURNAMENT: Record<string, number> = {
  laliga: 8, 'laliga-2': 54, 'premier-league': 17, 'serie-a': 23, bundesliga: 35, 'ligue-1': 34,
  'champions-league': 7, 'europa-league': 679, 'conference-league': 17015, 'copa-del-rey': 329,
};

export type SnapshotRoundMatch = { id: number; round: number; date: string; home: string; away: string; homeCode?: string; awayCode?: string };
export type SnapshotMissing = { name: string; reason: string; type: string };
export type SnapshotLineup = { confirmed: boolean; fetchedAt: string; home: { formation?: string; missing: SnapshotMissing[] }; away: { formation?: string; missing: SnapshotMissing[] } };
export type SportapiSnapshot = {
  updatedAt: string;
  competitions: Record<string, { tournamentId: number; seasonId: number; seasonName: string; currentRound: number; totalRounds: number; fetchedRounds: number[]; matches: SnapshotRoundMatch[] }>;
  lineups: Record<string, SnapshotLineup>;
};

const EMPTY: SportapiSnapshot = { updatedAt: '', competitions: {}, lineups: {} };
export const getSportapiSnapshot = (): SportapiSnapshot => (snapshotRaw as unknown as SportapiSnapshot) ?? EMPTY;

export const matchKey = (home: string, away: string) => `${normaliza(home)}|${normaliza(away)}`;

/** Índice clave(local|visitante) → jornada oficial y evento SportAPI, por competición. */
export function officialRounds(compSlug: string): { current: number; total: number; byKey: Map<string, SnapshotRoundMatch> } | null {
  const c = getSportapiSnapshot().competitions[compSlug];
  if (!c || c.matches.length === 0) return null;
  const byKey = new Map<string, SnapshotRoundMatch>();
  for (const m of c.matches) byKey.set(matchKey(m.home, m.away), m);
  return { current: c.currentRound, total: c.totalRounds, byKey };
}

/** Bajas (lesionados, sancionados) de un partido si el snapshot las tiene. */
export function lineupFor(compSlug: string, home: string[], away: string[]): SnapshotLineup | null {
  const r = officialRounds(compSlug);
  if (!r) return null;
  for (const h of home) for (const a of away) {
    const m = r.byKey.get(matchKey(h, a));
    if (m) return getSportapiSnapshot().lineups[String(m.id)] ?? null;
  }
  return null;
}

const dayKey = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
/** Nombres cuya forma corta no comparte tokens con la larga (ESPN «Deportivo» ↔ SofaScore «Deportivo La Coruña»). */
const ALIAS: Record<string, string[]> = { deportivo: ['coruna'], sociedad: ['real sociedad'], sporting: ['gijon'], racing: ['santander'] };
const tokens = (name: string) => { const n = normaliza(name); const set = new Set(n.split(' ').filter((t) => t.length > 2)); for (const a of ALIAS[n] ?? []) a.split(' ').forEach((t) => set.add(t)); return set; };
const overlap = (a: string[], b: string) => { const tb = tokens(b); return a.some((n) => [...tokens(n)].some((t) => tb.has(t))); };

export type OfficialIndex = { current: number; total: number; byDay: Map<string, SnapshotRoundMatch[]> };
/** Índice por día (Madrid) de los partidos del snapshot de una competición. */
export function officialIndex(compSlug: string): OfficialIndex | null {
  const c = getSportapiSnapshot().competitions[compSlug];
  if (!c || c.matches.length === 0) return null;
  const byDay = new Map<string, SnapshotRoundMatch[]>();
  for (const m of c.matches) { const k = dayKey(m.date); byDay.set(k, [...(byDay.get(k) ?? []), m]); }
  return { current: c.currentRound, total: c.totalRounds, byDay };
}

/**
 * Cruza un partido ESPN con el snapshot: mismo día en Madrid (±1 por husos) y
 * equipos coincidentes por código o por solapamiento de tokens del nombre.
 */
export function findOfficial(idx: OfficialIndex, m: { date: string; home: { name: string; fullName: string; abbr: string }; away: { name: string; fullName: string; abbr: string } }): SnapshotRoundMatch | null {
  const d = new Date(m.date).getTime();
  const days = [dayKey(m.date), dayKey(new Date(d - 86_400_000).toISOString()), dayKey(new Date(d + 86_400_000).toISOString())];
  const cands = days.flatMap((k) => idx.byDay.get(k) ?? []);
  const hn = [m.home.fullName, m.home.name], an = [m.away.fullName, m.away.name];
  const exact = cands.find((c) => (c.homeCode && c.homeCode === m.home.abbr && c.awayCode && c.awayCode === m.away.abbr));
  if (exact) return exact;
  const byName = cands.filter((c) => overlap(hn, c.home) && overlap(an, c.away));
  if (byName.length === 1) return byName[0];
  if (byName.length > 1) return byName.sort((a, b) => Math.abs(new Date(a.date).getTime() - d) - Math.abs(new Date(b.date).getTime() - d))[0];
  return null;
}

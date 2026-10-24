import data from '../data/tv-asignaciones.json';
import { getCompetition, type Competition } from './competitions';
import { fetchTeamSchedule, type TeamGame } from './espn-team';
import { normaliza, same } from './wosti';

/**
 * Calculadora «¿cuánto cuesta ver a tu equipo?» (LaLiga + Champions, temporada 2026-27).
 *
 * Reglas de derechos verificadas en las guías de /noticias (LaLiga y Champions):
 *  - LaLiga: cinco partidos por jornada en DAZN y cinco en Movistar Plus+, salvo las
 *    jornadas 4, 15 y 27, enteras de Movistar. Un partido por jornada gratis en DAZN.
 *    Movistar Plus+ Libre emite uno de los suyos por jornada (sin Clásico ni derbis).
 *  - Champions: toda en Movistar Plus+; el plan Libre solo da el partido destacado.
 * El canal de cada partido sale del registro acumulado de WOSTI (tv-asignaciones.json);
 * LaLiga lo fija unas dos semanas antes, así que lo lejano queda «por asignar».
 */
type Asig = { date: string; comp: string; home: string; away: string; op: 'dazn' | 'movistar'; free?: boolean; libre?: boolean };
const ASIG = Object.values((data as unknown as { matches: Record<string, Asig> }).matches);

/** Jornadas enteras de Movistar (fechas de la nota de Movistar Plus+). */
const MOVISTAR_ONLY: [string, string][] = [['2026-09-04', '2026-09-07'], ['2026-12-04', '2026-12-07'], ['2027-03-05', '2027-03-09']];
const madrid = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date(iso));

export type Op = 'dazn' | 'movistar' | 'pendiente';
export type CostMatch = TeamGame & { comp: 'laliga' | 'champions-league'; op: Op; free: boolean; libre: boolean; known: boolean };

export type PlanId = 'gratis' | 'libre' | 'dazn' | 'dazn-libre' | 'm-laliga' | 'm-champions' | 'dazn-m-champions' | 'futbol-total';
/** `share`: parte esperada de los partidos de LaLiga aún sin canal que ve el plan (DAZN tiene 5 de 10 por jornada; gratis y Libre, 1 de 10). */
export type Plan = { id: PlanId; name: string; monthly: number; note: string; affiliate: 'dazn' | 'movistar' | 'ambos'; share: number; sees: (m: CostMatch) => boolean | null };

/** Precios de las guías de LaLiga y Champions (OCU, Mundoplus, webs oficiales). Los de Movistar llevan fibra y móvil. */
export const PLANS: Plan[] = [
  { id: 'gratis', share: 0.1, name: 'DAZN gratis (registro)', monthly: 0, note: 'Un partido de LaLiga por jornada', affiliate: 'dazn', sees: (m) => (m.comp === 'laliga' ? (m.known ? m.free : null) : false) },
  { id: 'libre', share: 0.1, name: 'Movistar Plus+ Libre', monthly: 9.99, note: 'Sin permanencia', affiliate: 'movistar', sees: (m) => (m.known || m.comp === 'champions-league' ? m.libre : null) },
  { id: 'dazn', share: 0.5, name: 'DAZN Fútbol', monthly: 19.99, note: 'Con un año de permanencia (29,99 € sin ella)', affiliate: 'dazn', sees: (m) => (m.comp === 'laliga' ? (m.op === 'pendiente' ? null : m.op === 'dazn') : false) },
  { id: 'dazn-libre', share: 0.6, name: 'DAZN Fútbol + Movistar Plus+ Libre', monthly: 29.98, note: 'Las dos plataformas sin fibra', affiliate: 'ambos', sees: (m) => (m.comp === 'laliga' ? (m.op === 'pendiente' ? null : m.op === 'dazn' || m.libre) : m.libre) },
  { id: 'm-laliga', share: 1, name: 'Movistar Plus+ con LaLiga', monthly: 89, note: 'Con fibra y móvil de Movistar (incluye los canales de DAZN)', affiliate: 'movistar', sees: (m) => m.comp === 'laliga' },
  { id: 'm-champions', share: 0, name: 'Movistar Plus+ con Champions', monthly: 77, note: 'Con fibra y móvil de Movistar', affiliate: 'movistar', sees: (m) => m.comp === 'champions-league' },
  { id: 'dazn-m-champions', share: 0.5, name: 'DAZN Fútbol + Movistar con Champions', monthly: 96.99, note: 'DAZN aparte; Movistar con fibra y móvil', affiliate: 'ambos', sees: (m) => (m.comp === 'champions-league' ? true : m.op === 'pendiente' ? null : m.op === 'dazn') },
  { id: 'futbol-total', share: 1, name: 'Movistar Plus+ Fútbol Total', monthly: 103, note: 'Con fibra y móvil de Movistar: LaLiga, Champions, Copa y Supercopa', affiliate: 'movistar', sees: () => true },
];

function assign(g: TeamGame, comp: CostMatch['comp'], teamNames: string[]): CostMatch {
  const day = madrid(g.date);
  const t = teamNames.map(normaliza);
  const r = normaliza(g.rival);
  const a = ASIG.find((x) => x.comp === comp && madrid(x.date) === day
    && [x.home, x.away].some((n) => t.some((k) => same(k, normaliza(n))))
    && [x.home, x.away].some((n) => same(r, normaliza(n))));
  if (comp === 'champions-league') return { ...g, comp, op: 'movistar', free: false, libre: !!a?.libre, known: true };
  if (a) return { ...g, comp, op: a.op, free: !!a.free, libre: !!a.libre, known: true };
  if (MOVISTAR_ONLY.some(([from, to]) => day >= from && day <= to)) return { ...g, comp, op: 'movistar', free: false, libre: false, known: true };
  return { ...g, comp, op: 'pendiente', free: false, libre: false, known: false };
}

export type PlanResult = { plan: Plan; seen: number; missed: number; unknown: number; total: number; season: number; /** Partidos que verá en toda la temporada, estimando los que faltan por asignar. */ estimate: number };
export type TeamCost = { matches: CostMatch[]; inChampions: boolean; results: PlanResult[]; full: PlanResult; cheapestFull: PlanResult };

/** Meses de la temporada que se pagan (de agosto a mayo). */
export const SEASON_MONTHS = 10;

export async function teamCost(teamId: string, teamNames: string[]): Promise<TeamCost> {
  const laliga = getCompetition('futbol', 'laliga') as Competition;
  const ucl = getCompetition('futbol', 'champions-league') as Competition;
  const [l, c] = await Promise.all([fetchTeamSchedule(laliga, teamId, { fixtures: true }), fetchTeamSchedule(ucl, teamId, { fixtures: true })]);
  const matches = [...l.map((g) => assign(g, 'laliga', teamNames)), ...c.map((g) => assign(g, 'champions-league', teamNames))].sort((a, b) => a.date.localeCompare(b.date));
  const inChampions = c.length > 0;
  const results = PLANS.filter((p) => inChampions || !['m-champions', 'dazn-m-champions'].includes(p.id)).map((plan) => {
    let seen = 0, missed = 0, unknown = 0;
    for (const m of matches) {
      const v = plan.sees(m);
      if (v === null) unknown++; else if (v) seen++; else missed++;
    }
    return { plan, seen, missed, unknown, total: matches.length, season: Math.round(plan.monthly * SEASON_MONTHS * 100) / 100, estimate: Math.round(seen + unknown * plan.share) };
  });
  const full = results.find((r) => r.plan.id === (inChampions ? 'futbol-total' : 'm-laliga'))!;
  const cheapestFull = [...results].filter((r) => r.missed === 0 && r.unknown === 0).sort((a, b) => a.plan.monthly - b.plan.monthly)[0] ?? full;
  return { matches, inChampions, results, full, cheapestFull };
}

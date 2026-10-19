/**
 * Jugadas de un partido de fútbol desde la API «core» de ESPN: casi todas las acciones
 * (pases, regates, entradas, tiros…) llevan coordenadas y el jugador que las hace.
 * De ahí salen el mapa de tiros y el mapa de calor por jugador de la ficha de partido.
 * Coordenadas Opta (0-100): cada equipo ataca de izquierda a derecha; y = 100 es su banda izquierda.
 */
import type { EspnPath } from './wc-2026-match-summary';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CORE = 'https://sports.core.api.espn.com/v2/sports';
const SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const UA = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };
/** Rejilla del mapa de calor: 20 × 13 celdas sobre el campo. */
export const HEAT_GRID = [20, 13] as const;

export type Shot = { x: number; y: number; side: 'home' | 'away'; player: string; minute: string; result: 'goal' | 'on' | 'off' | 'blocked'; header: boolean; penalty: boolean };
export type HeatPlayer = { id: string; name: string; side: 'home' | 'away'; actions: number; grid: number[] };
export type PitchData = { shots: Shot[]; players: HeatPlayer[] };

const SHOT: Record<string, Shot['result']> = { Goal: 'goal', 'Goal - Header': 'goal', 'Goal - Free-kick': 'goal', 'Penalty - Scored': 'goal', 'Shot On Target': 'on', 'Shot Off Target': 'off', 'Shot Blocked': 'blocked', 'Penalty - Saved': 'on', 'Penalty - Missed': 'off' };
/** Acciones que no son de un jugador con balón (saques de banda contados como «Out», pausas…). */
const SKIP = new Set(['Out', 'Corner Awarded', 'Halftime', 'Kickoff', 'Start 2nd Half', 'End Regular Time', 'Start Delay', 'End Delay', 'Deleted After Review', 'Substitution', 'Retired', 'End Extra Time', 'Start Extra Time']);
const idFrom = (ref: string | undefined, key: string) => ref?.match(new RegExp(`/${key}/(\\d+)`))?.[1];

async function getJson(url: string, revalidate: number) {
  try {
    const r = await fetch(url, { headers: UA, next: { revalidate } });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

/** Mapa de tiros y de calor de un partido. `live` acorta la caché a 2 minutos. */
export async function fetchPitchData(espn: EspnPath, id: string, live = false): Promise<PitchData | null> {
  if (espn.sport !== 'soccer' || !/^\d{4,12}$/.test(id)) return null;
  const revalidate = live ? 120 : 86_400;
  const base = `${CORE}/soccer/leagues/${espn.league}/events/${id}/competitions/${id}/plays?limit=1000`;
  const [first, summary] = await Promise.all([getJson(base, revalidate), getJson(`${SITE}/soccer/${espn.league}/summary?event=${id}`, 3600)]);
  if (!first?.items?.length || !summary?.rosters) return null;
  const pages = Math.min(Number(first.pageCount ?? 1), 6);
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => getJson(`${base}&page=${i + 2}`, revalidate)));
  const plays: any[] = [first, ...rest].flatMap((p) => p?.items ?? []);

  const names = new Map<string, string>();
  const sideOfPlayer = new Map<string, 'home' | 'away'>();
  const sideOfTeam = new Map<string, 'home' | 'away'>();
  for (const r of summary.rosters as any[]) {
    const side = r.homeAway === 'home' ? 'home' : 'away';
    sideOfTeam.set(String(r.team?.id), side);
    for (const a of r.roster ?? []) { names.set(String(a.athlete?.id), String(a.athlete?.displayName ?? '')); sideOfPlayer.set(String(a.athlete?.id), side); }
  }

  const [gx, gy] = HEAT_GRID;
  const grids = new Map<string, number[]>();
  const shots: Shot[] = [];
  for (const p of plays) {
    const type = String(p.type?.text ?? '');
    const x = p.fieldPositionX, y = p.fieldPositionY;
    if (typeof x !== 'number' || typeof y !== 'number') continue;
    const who = idFrom(p.participants?.[0]?.athlete?.$ref, 'athletes');
    const result = SHOT[type];
    const side = sideOfTeam.get(idFrom(p.team?.$ref, 'teams') ?? '');
    if (result && side) {
      const text = String(p.text ?? '').toLowerCase();
      shots.push({ x, y, side, player: names.get(who ?? '') ?? '', minute: String(p.clock?.displayValue ?? ''), result, header: /header|head/.test(type.toLowerCase()) || text.includes('header'), penalty: type.startsWith('Penalty') || text.includes('penalty') });
    }
    if (SKIP.has(type) || !who || !names.has(who)) continue;
    const g = grids.get(who) ?? new Array(gx * gy).fill(0);
    g[Math.min(gx - 1, Math.floor((x / 100) * gx)) + Math.min(gy - 1, Math.floor(((100 - y) / 100) * gy)) * gx]++;
    grids.set(who, g);
  }
  const players: HeatPlayer[] = [...grids].map(([pid, grid]) => ({ id: pid, name: names.get(pid)!, side: sideOfPlayer.get(pid)!, actions: grid.reduce((a, b) => a + b, 0), grid }))
    .filter((p) => p.actions >= 15).sort((a, b) => b.actions - a.actions);
  if (!shots.length && !players.length) return null;
  return { shots, players };
}

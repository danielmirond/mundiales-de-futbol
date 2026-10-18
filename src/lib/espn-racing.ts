/**
 * Fórmula 1 (ESPN `racing/f1`): gran premio en curso o próximo con sus
 * sesiones, calendario de la temporada y clasificaciones de pilotos y
 * constructores.
 */
import { countryEs, gpEs } from './i18n-sport';

const SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const V2 = 'https://site.api.espn.com/apis/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type RaceSession = { type: string; label: string; date: string; state: 'pre' | 'in' | 'post'; top: { pos: number; name: string; country?: string }[] };
export type RaceWeekend = { name: string; start: string; end: string; circuit?: string; city?: string; country?: string; sessions: RaceSession[] };
export type RaceCalendarEntry = { name: string; start: string; end: string };
export type DriverRow = { rank: number; name: string; country?: string; points: number };
export type TeamRow = { rank: number; name: string; color?: string; points: number };

const SESSION_ES: Record<string, string> = { FP1: 'Libres 1', FP2: 'Libres 2', FP3: 'Libres 3', SS: 'Clasificación sprint', SR: 'Sprint', Qual: 'Clasificación', Race: 'Carrera' };

async function get(url: string, revalidate: number) {
  try { const r = await fetch(url, { headers: HEADERS, next: { revalidate } }); return r.ok ? r.json() : null; } catch { return null; }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchRaceWeekend(feed: { sport: string; league: string }): Promise<{ weekend: RaceWeekend | null; calendar: RaceCalendarEntry[] }> {
  const d = await get(`${SITE}/${feed.sport}/${feed.league}/scoreboard`, 600);
  const e = d?.events?.[0];
  const calendar: RaceCalendarEntry[] = (d?.leagues?.[0]?.calendar ?? []).map((c: any) => ({ name: gpEs(String(c.label ?? '')), start: String(c.startDate ?? ''), end: String(c.endDate ?? c.startDate ?? '') })).filter((c: RaceCalendarEntry) => c.name);
  if (!e) return { weekend: null, calendar };
  // IndyCar no trae endDate (cada carrera es un solo día): sin él, el fin es el inicio.
  const venue = e.circuit ?? e.competitions?.[0]?.venue;
  const sessions: RaceSession[] = (e.competitions ?? []).map((c: any) => {
    const type = String(c.type?.abbreviation ?? '');
    const top = [...(c.competitors ?? [])].sort((a: any, b: any) => Number(a.order) - Number(b.order)).slice(0, 3)
      .map((x: any) => ({ pos: Number(x.order), name: String(x.athlete?.displayName ?? ''), country: countryEs(x.athlete?.flag?.alt) }));
    return { type, label: SESSION_ES[type] ?? type, date: String(c.date ?? ''), state: (c.status?.type?.state ?? 'pre') as RaceSession['state'], top };
  });
  return {
    weekend: { name: gpEs(String(e.name ?? '')), start: String(e.date ?? ''), end: String(e.endDate ?? e.date ?? ''), circuit: venue?.fullName, city: venue?.address?.city, country: countryEs(venue?.address?.country), sessions },
    calendar,
  };
}

export async function fetchRaceStandings(feed: { sport: string; league: string }): Promise<{ drivers: DriverRow[]; teams: TeamRow[] }> {
  const d = await get(`${V2}/${feed.sport}/${feed.league}/standings`, 1800);
  const kids: any[] = d?.children ?? [];
  const stat = (e: any, ...names: string[]) => { for (const n of names) { const s = (e.stats ?? []).find((x: any) => x.name === n); if (s && s.displayValue != null && String(s.displayValue).trim() !== '') return Number(s.displayValue); } return 0; };
  // F1 separa «Driver Standings» y «Constructor Standings»; IndyCar trae un único bloque «Standings» de pilotos.
  const driverKid = kids.find((k) => /driver/i.test(k.name)) ?? (kids.length === 1 ? kids[0] : undefined);
  const drivers: DriverRow[] = (driverKid?.standings?.entries ?? []).map((e: any) => ({ rank: stat(e, 'rank'), name: String(e.athlete?.displayName ?? ''), country: countryEs(e.athlete?.flag?.alt), points: stat(e, 'championshipPts', 'points') }));
  const teams: TeamRow[] = (kids.find((k) => /constructor/i.test(k.name))?.standings?.entries ?? []).map((e: any) => ({ rank: stat(e, 'rank'), name: String(e.team?.displayName ?? ''), color: e.team?.color, points: stat(e, 'points', 'championshipPts') }));
  return { drivers: drivers.sort((a, b) => a.rank - b.rank), teams: teams.sort((a, b) => a.rank - b.rank) };
}

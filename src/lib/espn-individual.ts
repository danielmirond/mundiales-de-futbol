/**
 * Golf (ESPN `golf/pga|eur|lpga`) y UFC (`mma/ufc`): torneo o velada en
 * curso con su tabla/cartelera y el calendario de la temporada.
 */
import { countryEs } from './i18n-sport';

const SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type GolfRow = { pos: number; name: string; country?: string; score: string; rounds: (string | null)[] };
export type GolfEvent = { name: string; start: string; end: string; state: 'pre' | 'in' | 'post'; course?: string; rows: GolfRow[] };
export type CalendarEntry = { name: string; start: string; end: string };

export type Fighter = { name: string; country?: string; record?: string; winner: boolean };
export type Fight = { id: string; weight: string; date: string; state: 'pre' | 'in' | 'post'; detail: string; a: Fighter; b: Fighter };
export type FightCard = { name: string; date: string; state: 'pre' | 'in' | 'post'; venue?: string; fights: Fight[] };

const WEIGHT_ES: Record<string, string> = {
  Flyweight: 'Peso mosca', Bantamweight: 'Peso gallo', Featherweight: 'Peso pluma', Lightweight: 'Peso ligero', Welterweight: 'Peso wélter',
  Middleweight: 'Peso medio', 'Light Heavyweight': 'Peso semipesado', Heavyweight: 'Peso pesado', Strawweight: 'Peso paja', Catchweight: 'Peso pactado',
};
const weightEs = (w: string) => { const women = /^(women'?s|w)\s+/i.test(w); const base = w.replace(/^(women'?s|w)\s+/i, '').trim(); return `${WEIGHT_ES[base] ?? base}${women ? ' femenino' : ''}`; };
const DETAIL_ES: [RegExp, string][] = [[/^final$/i, 'Final'], [/^ko\/tko/i, 'KO/TKO'], [/submission/i, 'Sumisión'], [/decision/i, 'Decisión'], [/scheduled/i, 'Programado']];
const detailEs = (d: string) => { for (const [re, es] of DETAIL_ES) if (re.test(d)) return d.replace(re, es); return d; };

async function get(url: string, revalidate: number) {
  try { const r = await fetch(url, { headers: HEADERS, next: { revalidate } }); return r.ok ? r.json() : null; } catch { return null; }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
const calOf = (d: any): CalendarEntry[] => (d?.leagues?.[0]?.calendar ?? []).map((c: any) => ({ name: String(c.label ?? ''), start: String(c.startDate ?? ''), end: String(c.endDate ?? '') })).filter((c: CalendarEntry) => c.name);

export async function fetchGolf(feed: { sport: string; league: string }): Promise<{ event: GolfEvent | null; calendar: CalendarEntry[] }> {
  const d = await get(`${SITE}/${feed.sport}/${feed.league}/scoreboard`, 300);
  const e = d?.events?.[0];
  if (!e) return { event: null, calendar: calOf(d) };
  const c = e.competitions?.[0];
  const rows: GolfRow[] = [...(c?.competitors ?? [])].sort((a: any, b: any) => Number(a.order) - Number(b.order)).slice(0, 30).map((x: any) => ({
    pos: Number(x.order), name: String(x.athlete?.displayName ?? ''), country: countryEs(x.athlete?.flag?.alt), score: String(x.score ?? ''),
    rounds: (x.linescores ?? []).map((l: any) => (l?.displayValue != null ? String(l.displayValue) : null)),
  }));
  return { event: { name: String(e.name ?? ''), start: String(e.date ?? ''), end: String(e.endDate ?? ''), state: (e.status?.type?.state ?? 'pre') as GolfEvent['state'], course: c?.venue?.fullName, rows }, calendar: calOf(d) };
}

export async function fetchFightCard(feed: { sport: string; league: string }): Promise<{ card: FightCard | null; calendar: CalendarEntry[] }> {
  const d = await get(`${SITE}/${feed.sport}/${feed.league}/scoreboard`, 300);
  const e = d?.events?.[0];
  if (!e) return { card: null, calendar: calOf(d) };
  const fighter = (x: any): Fighter => ({ name: String(x?.athlete?.displayName ?? ''), country: countryEs(x?.athlete?.flag?.alt), record: x?.records?.[0]?.summary, winner: !!x?.winner });
  // ESPN ordena de la primera pelea a la estelar: se invierte para empezar por el combate principal.
  const fights: Fight[] = [...(e.competitions ?? [])].reverse().map((c: any) => {
    const [x, y] = c.competitors ?? [];
    return { id: String(c.id), weight: weightEs(String(c.type?.abbreviation ?? '')), date: String(c.date ?? ''), state: (c.status?.type?.state ?? 'pre') as Fight['state'], detail: detailEs(String(c.status?.type?.detail ?? '')), a: fighter(x), b: fighter(y) };
  });
  return { card: { name: String(e.name ?? ''), date: String(e.date ?? ''), state: (e.status?.type?.state ?? 'pre') as FightCard['state'], venue: e.competitions?.[0]?.venue?.fullName, fights }, calendar: calOf(d) };
}

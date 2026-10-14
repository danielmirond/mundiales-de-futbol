/**
 * Tenis (ESPN `tennis/atp` y `tennis/wta`): torneos en juego y partidos de
 * individuales del día (hora de Madrid), con sets por jugador.
 */
import { madridDateKey } from './espn';
import { countryEs, tbdEs } from './i18n-sport';

const SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type TennisPlayer = { name: string; country?: string; seed?: number; sets: number[]; winner: boolean };
export type TennisMatch = { id: string; date: string; round: string; state: 'pre' | 'in' | 'post'; status: string; court?: string; a: TennisPlayer; b: TennisPlayer };
export type TennisTournament = { id: string; name: string; start: string; end: string; city?: string; major: boolean; today: TennisMatch[]; recent: TennisMatch[]; upcoming: TennisMatch[] };

const ROUND_ES: [RegExp, string][] = [
  [/^final$/i, 'Final'], [/semifinal/i, 'Semifinales'], [/quarterfinal/i, 'Cuartos de final'], [/round of 16|4th round/i, 'Octavos de final'],
  [/^round (\d)$/i, 'Ronda $1'], [/3rd round/i, 'Tercera ronda'], [/2nd round/i, 'Segunda ronda'], [/1st round/i, 'Primera ronda'], [/qualifying/i, 'Previa'],
];
const roundEs = (r: string) => { for (const [re, es] of ROUND_ES) if (re.test(r)) return /qualifying/i.test(r) ? 'Previa' : r.replace(re, es); return r; };

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchTennis(feed: { sport: string; league: string }): Promise<TennisTournament[]> {
  try {
    const r = await fetch(`${SITE}/${feed.sport}/${feed.league}/scoreboard`, { headers: HEADERS, next: { revalidate: 120 } });
    if (!r.ok) return [];
    const d = await r.json();
    const today = madridDateKey();
    return (d.events ?? []).map((e: any): TennisTournament => {
      const singles = (e.groupings ?? []).find((g: any) => /singles/i.test(g.grouping?.displayName ?? '')) ?? e.groupings?.[0];
      const ms: TennisMatch[] = (singles?.competitions ?? []).map((c: any) => {
        const [x, y] = c.competitors ?? [];
        const p = (z: any): TennisPlayer => ({ name: tbdEs(String(z?.athlete?.displayName ?? 'Por determinar')), country: countryEs(z?.athlete?.flag?.alt), seed: z?.curatedRank?.current ?? (z?.seed ? Number(z.seed) : undefined), sets: (z?.linescores ?? []).map((l: any) => Number(l.value)), winner: !!z?.winner });
        return { id: String(c.id), date: String(c.date ?? c.startDate ?? ''), round: roundEs(String(c.round?.displayName ?? '')), state: (c.status?.type?.state ?? 'pre') as TennisMatch['state'], status: String(c.status?.type?.shortDetail ?? ''), court: c.venue?.court ?? c.venue?.fullName, a: p(x), b: p(y) };
      }).filter((m: TennisMatch) => m.a.name && m.b.name);
      const day = (m: TennisMatch) => madridDateKey(new Date(m.date));
      const sortT = (a: TennisMatch, b: TennisMatch) => a.date.localeCompare(b.date);
      return {
        id: String(e.id), name: String(e.name ?? ''), start: String(e.date ?? ''), end: String(e.endDate ?? ''), city: e.venue?.address?.city ?? e.venue?.fullName, major: !!e.major,
        today: ms.filter((m) => day(m) === today || m.state === 'in').sort(sortT),
        recent: ms.filter((m) => m.state === 'post' && day(m) < today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12),
        upcoming: ms.filter((m) => m.state === 'pre' && day(m) > today).sort(sortT).slice(0, 12),
      };
    });
  } catch {
    return [];
  }
}

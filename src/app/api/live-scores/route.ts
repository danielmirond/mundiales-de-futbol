import { NextResponse } from 'next/server';
import { resolveKnockout } from '@/lib/wc-2026-knockout';

/**
 * Proxy de marcadores en vivo del Mundial 2026 vía la API pública de ESPN
 * (no oficial, sin API key). Devuelve los partidos del día con su marcador
 * y estado, normalizados a los códigos FIFA que usa FIXTURES_2026.
 *
 * Se cachea en el edge ~30s para no martillear a ESPN y dar refresco "en vivo".
 */

export const dynamic = 'force-dynamic';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

// Alias ESPN → código FIFA nuestro (solo donde difieren; la mayoría coinciden).
const CODE_ALIAS: Record<string, string> = {
  // ESPN suele usar los mismos 3-letra; añadir aquí si detectamos divergencias.
};

function norm(abbr: string | undefined): string {
  if (!abbr) return '';
  const up = abbr.toUpperCase();
  return CODE_ALIAS[up] ?? up;
}

type LiveMatch = {
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  state: 'pre' | 'in' | 'post';
  status: string;
  clock: string | null;
  date: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dates = searchParams.get('dates'); // formato YYYYMMDD opcional
  const url = dates ? `${ESPN}?dates=${dates}` : ESPN;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' },
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`ESPN ${res.status}`);
    const data = await res.json();

    const matches: LiveMatch[] = (data.events ?? []).map((e: any) => {
      const comp = e.competitions?.[0] ?? {};
      const competitors = comp.competitors ?? [];
      const home = competitors.find((c: any) => c.homeAway === 'home');
      const away = competitors.find((c: any) => c.homeAway === 'away');
      const stateRaw = e.status?.type?.state ?? 'pre';
      const num = (s: any) => (s === undefined || s === null || s === '' ? null : Number(s));
      return {
        home: norm(home?.team?.abbreviation),
        away: norm(away?.team?.abbreviation),
        homeScore: num(home?.score),
        awayScore: num(away?.score),
        state: stateRaw as LiveMatch['state'],
        status: e.status?.type?.shortDetail ?? e.status?.type?.description ?? '',
        clock: e.status?.displayClock ?? null,
        date: e.date ?? '',
      };
    });

    // Equipos reales de eliminatorias resueltos (fixture n → cruce), para que
    // el hero y demás vistas muestren los cruces en cuanto ESPN los determina.
    const knockout: Record<number, {
      home?: string; away?: string; homeScore: number | null; awayScore: number | null;
      state: string; clock: string | null;
    }> = {};
    try {
      const ko = await resolveKnockout();
      for (const [n, r] of ko) {
        knockout[n] = {
          home: r.home, away: r.away, homeScore: r.homeScore,
          awayScore: r.awayScore, state: r.state, clock: r.clock,
        };
      }
    } catch { /* sin datos KO → hero cae al texto del cuadro */ }

    return NextResponse.json(
      { updatedAt: new Date().toISOString(), matches, knockout },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } },
    );
  } catch (err) {
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), matches: [], knockout: {}, error: String(err) },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

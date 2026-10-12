import { NextResponse } from 'next/server';
import { fetchToday } from '@/lib/espn';
import { liveCompetitions } from '@/lib/competitions';

export const revalidate = 60;

/** Contador de partidos en directo y competiciones con partido hoy (para la navegación). */
export async function GET() {
  try {
    const matches = await fetchToday(liveCompetitions());
    const live = matches.filter((m) => m.state === 'in');
    return NextResponse.json({
      live: live.length,
      total: matches.length,
      liveSlugs: [...new Set(live.map((m) => `${m.competition.sport}/${m.competition.slug}`))],
      todaySlugs: [...new Set(matches.map((m) => `${m.competition.sport}/${m.competition.slug}`))],
    }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } });
  } catch {
    return NextResponse.json({ live: 0, total: 0, liveSlugs: [], todaySlugs: [] });
  }
}

import { NextResponse } from 'next/server';
import { fetchEventSummary } from '@/lib/wc-2026-match-summary';
import { enrichCommentary } from '@/lib/wc-commentary-voice';
import { teamName } from '@/lib/wc-head-to-head';

/**
 * Detalle en vivo de un partido (alineaciones, momentos clave, narración,
 * estadísticas y marcador) para el live-blog de la ficha de partido.
 * Lo consume el componente cliente que hace polling cada ~25s.
 *
 *   GET /api/match-live?event=760438&home=CZE&away=RSA            (Mundial 2026)
 *   GET /api/match-live?event=401882854&sport=soccer&league=esp.1 (portal)
 */
export const dynamic = 'force-dynamic';

const SAFE = /^[a-z0-9._-]+$/i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event') ?? '';
  const home = searchParams.get('home') ?? '';
  const away = searchParams.get('away') ?? '';
  const sport = searchParams.get('sport') ?? 'soccer';
  const league = searchParams.get('league') ?? 'fifa.world';

  if (!event || !SAFE.test(event) || !SAFE.test(sport) || !SAFE.test(league)) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 });
  }

  const summary = await fetchEventSummary({ sport, league }, event, home, away, 15);

  // Voz de cronista (determinista): solo Mundial, con el partido en juego.
  if (summary && league === 'fifa.world' && summary.state === 'in' && summary.hasCommentary) {
    summary.commentary = await enrichCommentary(
      event,
      teamName(home),
      teamName(away),
      summary.commentary,
    );
  }

  return NextResponse.json(
    { updatedAt: new Date().toISOString(), summary },
    { headers: { 'Cache-Control': 's-maxage=15, stale-while-revalidate=30' } },
  );
}

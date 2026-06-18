import { NextResponse } from 'next/server';
import { fetchMatchSummary } from '@/lib/wc-2026-match-summary';

/**
 * Detalle en vivo de un partido (alineaciones, momentos clave, narración,
 * estadísticas y marcador) para el live-blog de la ficha de partido.
 * Lo consume el componente cliente que hace polling cada ~25s.
 *
 *   GET /api/match-live?event=760438&home=CZE&away=RSA
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event') ?? '';
  const home = searchParams.get('home') ?? '';
  const away = searchParams.get('away') ?? '';

  if (!event || !home || !away) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 });
  }

  const summary = await fetchMatchSummary(event, home, away, 15);
  return NextResponse.json(
    { updatedAt: new Date().toISOString(), summary },
    { headers: { 'Cache-Control': 's-maxage=15, stale-while-revalidate=30' } },
  );
}

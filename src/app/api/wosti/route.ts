import { NextResponse } from 'next/server';
import { getWostiFeed } from '@/lib/wosti';

export const revalidate = 3600;

/**
 * Feed WOSTI (fútbol en TV en España) en el formato de la API de RapidAPI.
 * Lo usa Guía TV como respaldo cuando su propia llamada a RapidAPI falla
 * (cuota agotada), antes de caer a su snapshot. Sale del Data Cache: servirlo
 * no gasta cuota.
 */
export async function GET() {
  const { fuente, events } = await getWostiFeed();
  return NextResponse.json(events, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      'X-Wosti-Fuente': fuente,
    },
  });
}

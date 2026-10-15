import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { buildLiveFeed } from '@/lib/live-feed';
import { LiveFeed } from '@/components/feed/live-feed';
import { pageMetadata } from '@/lib/seo';
import { getSport } from '@/lib/competitions';

// Prueba del directo vertical antes de llevarlo a la home: sin enlazar ni indexar.
export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: '/directo', title: 'Directo: lo último del deporte', description: 'Titulares, marcadores y vídeos del día, uno detrás de otro.', noIndex: true });
}

export default async function DirectoPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ d?: string }> }) {
  const { locale } = await params;
  const { d } = await searchParams;
  setRequestLocale(locale);
  const L = locale as Locale;
  // ?d=<deporte>: directo solo de ese deporte (llegada desde su carrusel).
  const sport = d && getSport(d) ? d : undefined;
  const cards = await buildLiveFeed((h) => (L === routing.defaultLocale ? h : `/${L}${h}`), { sport });
  return (
    <main className="pt-28">
      <h1 className="sr-only">Directo: lo último del deporte</h1>
      <LiveFeed cards={cards} />
    </main>
  );
}

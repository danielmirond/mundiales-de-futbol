import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/hero';
import { Countdown } from '@/components/home/countdown';
import { DailyNews } from '@/components/home/daily-news';
import { StatsBand } from '@/components/home/stats-band';
import { EditionsGrid } from '@/components/home/editions-grid';
import { Pillars } from '@/components/home/pillars';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/',
    // Patrón híbrido C: cubre cluster estructural + valor (calendario, historia,
    // archivo) en menos de 60 caracteres.
    title: 'Mundial de Fútbol: 1930-2026 · Calendario, historia y archivo',
    description:
      'Calendario Mundial 2026, historia de las 23 ediciones, ficha de cada jugador y estadio. La enciclopedia mundialista en 5 idiomas.',
    keywords: [
      'Mundial de Fútbol',
      'FIFA World Cup',
      'Mundial 2026',
      'Copa del Mundo',
      'calendario Mundial',
      'historia de los Mundiales',
      'selecciones nacionales',
      'jugadores mundialistas',
      'estadios',
    ],
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Countdown />
      <DailyNews locale={locale as Locale} />
      <StatsBand />
      <EditionsGrid locale={locale as Locale} />
      <Pillars />
    </>
  );
}

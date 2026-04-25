import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/hero';
import { Countdown } from '@/components/home/countdown';
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
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
    keywords: [
      'Mundial de Fútbol',
      'FIFA World Cup',
      'Mundial 2026',
      'Copa del Mundo',
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
      <StatsBand />
      <Countdown />
      <EditionsGrid locale={locale as Locale} />
      <Pillars />
    </>
  );
}

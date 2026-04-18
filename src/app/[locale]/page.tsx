import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/hero';
import { Countdown } from '@/components/home/countdown';
import { StatsBand } from '@/components/home/stats-band';
import { EditionsGrid } from '@/components/home/editions-grid';
import { Pillars } from '@/components/home/pillars';
import type { Locale } from '@/i18n/routing';

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

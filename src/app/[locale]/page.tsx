import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/hero';
import { HomeSchedule } from '@/components/home/home-schedule';
import { HomeGroups } from '@/components/home/home-groups';
import { MovistarHero } from '@/components/affiliate/movistar-banner';
import { DailyNews } from '@/components/home/daily-news';
import { SquadAnnouncements } from '@/components/home/squad-announcements';
import { FeaturedVideoStrip } from '@/components/home/featured-video-strip';
import { StatsBand } from '@/components/home/stats-band';
import { EditionsGrid } from '@/components/home/editions-grid';
import { Pillars } from '@/components/home/pillars';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// SSR: la home incluye noticias con publicación programada y el video
// de convocatoria — necesita evaluarse en runtime, no en build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Metadata por idioma. Child components ya usan useTranslations('home').
const META: Record<string, { title: string; description: string; keywords: string[] }> = {
  es: {
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
  },
  en: {
    title: 'FIFA World Cup: 1930-2026 · Schedule, history and archive',
    description:
      '2026 World Cup schedule, the history of all 23 editions, profile of every player and stadium. The definitive World Cup encyclopedia in 5 languages.',
    keywords: [
      'FIFA World Cup',
      'World Cup 2026',
      '2026 World Cup schedule',
      'World Cup history',
      'national teams',
      'World Cup players',
      'World Cup stadiums',
      'all World Cup editions',
      'World Cup encyclopedia',
    ],
  },
};

const AVAILABLE: readonly string[] = ['es', 'en'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return pageMetadata({
    locale,
    path: '/',
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    availableLocales: AVAILABLE,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <HomeSchedule locale={locale as Locale} />
      <HomeGroups locale={locale as Locale} />
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
          <MovistarHero />
        </div>
      </section>
      <FeaturedVideoStrip />
      <DailyNews locale={locale as Locale} />
      <SquadAnnouncements locale={locale as Locale} />
      <StatsBand />
      <EditionsGrid locale={locale as Locale} />
      <Pillars />
    </>
  );
}

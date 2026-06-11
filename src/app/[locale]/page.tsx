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
    title: 'Mundial 2026 en vivo | Calendario, partidos, resultados y noticias',
    description:
      'Sigue el Mundial 2026 en directo: calendario completo, partidos del día, resultados, los 12 grupos, dónde ver en TV y todas las noticias. Toda la actualidad del Mundial de México, EE. UU. y Canadá.',
    keywords: [
      'Mundial 2026 en vivo',
      'Mundial 2026',
      'calendario Mundial 2026',
      'partidos Mundial 2026',
      'resultados Mundial 2026',
      'grupos Mundial 2026',
      'dónde ver Mundial 2026',
      'noticias Mundial 2026',
      'Copa del Mundo 2026',
    ],
  },
  en: {
    title: 'FIFA World Cup 2026 live | Schedule, matches, results and news',
    description:
      'Follow the 2026 World Cup live: full schedule, today’s matches, results, the 12 groups, where to watch on TV and all the news. Everything on the Mexico, USA and Canada World Cup.',
    keywords: [
      'World Cup 2026 live',
      'World Cup 2026',
      '2026 World Cup schedule',
      'World Cup 2026 matches',
      'World Cup 2026 results',
      'World Cup 2026 groups',
      'where to watch World Cup 2026',
      'World Cup 2026 news',
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

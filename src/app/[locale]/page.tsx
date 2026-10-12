import { setRequestLocale } from 'next-intl/server';
import { PortalHero } from '@/components/portal/portal-hero';
import { TodayBoard } from '@/components/portal/today-board';
import { CompetitionsGrid } from '@/components/portal/competitions-grid';
import { WorldCup2026Closed } from '@/components/portal/wc2026-closed';
import { liveCompetitions } from '@/lib/competitions';
import { MovistarHero } from '@/components/affiliate/movistar-banner';
import { DailyNews } from '@/components/home/daily-news';
import { StatsBand } from '@/components/home/stats-band';
import { EditionsGrid } from '@/components/home/editions-grid';
import { Pillars } from '@/components/home/pillars';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// SSR: la portada es un portal multi-competición con marcadores en directo
// (ESPN) y noticias con publicación programada — runtime, no build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const META: Record<string, { title: string; description: string; keywords: string[] }> = {
  es: {
    title: 'Resultados, calendario y clasificaciones en directo | Fútbol, baloncesto y mundiales',
    description:
      'Partidos de hoy y marcadores en directo de LaLiga, Champions, Premier, NBA, Euroliga y más. Calendario, clasificaciones, noticias y la historia de los Mundiales de fútbol.',
    keywords: [
      'resultados en directo',
      'partidos de hoy',
      'clasificación laliga',
      'resultados champions',
      'partidos nba hoy',
      'calendario fútbol',
      'mundiales de fútbol',
      'Mundial 2026',
    ],
  },
  en: {
    title: 'Live scores, fixtures and standings | Football, basketball and World Cups',
    description:
      'Today’s matches and live scores from LaLiga, Champions League, Premier League, NBA, EuroLeague and more. Fixtures, standings, news and the history of the World Cup.',
    keywords: ['live scores', 'today’s matches', 'laliga standings', 'champions league results', 'nba games today', 'world cup history'],
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

  const L = locale as Locale;
  return (
    <>
      <PortalHero locale={L} />
      {/* Crónicas, previas y agenda del día: justo bajo el hero, que es lo que se busca. */}
      <DailyNews locale={L} />
      <TodayBoard locale={L} competitions={liveCompetitions()} range="today" kicker="Partidos de hoy" title="Todo lo que se juega hoy" limitPerGroup={5} emptyText="Hoy no hay partidos en las competiciones que seguimos. Consulta el calendario de cada competición." />
      <CompetitionsGrid locale={L} />
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
          <MovistarHero />
        </div>
      </section>
      <WorldCup2026Closed locale={L} />
      <StatsBand />
      <EditionsGrid locale={L} />
      <Pillars />
    </>
  );
}

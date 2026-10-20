import { setRequestLocale } from 'next-intl/server';
import { PortalHero } from '@/components/portal/portal-hero';
import { CompetitionsGrid } from '@/components/portal/competitions-grid';
import { MovistarHero } from '@/components/affiliate/movistar-banner';
import { MundialesEntry } from '@/components/home/mundiales-entry';
import { LiveStrip } from '@/components/feed/live-strip';
import { ScoresTicker } from '@/components/portal/scores-ticker';
import { FootballSection, BasketballSection, MotorSection, TennisSection, MoreSportsSection } from '@/components/home/sport-sections';
import { NewsOpening } from '@/components/home/news-opening';
import { AdSlot } from '@/components/affiliate/ad-slot';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// ISR 2 min: portal multi-competición con marcadores en directo
// (ESPN) y noticias con publicación programada — runtime, no build time.
// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 120;

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
      {/* Primera sección: resultados y agenda, con sitio para la cabecera fija. */}
      <div className="pt-[118px] md:pt-[138px]">
        <ScoresTicker locale={L} />
      </div>
      {/* Apertura: la noticia que abre la web, con su entradilla como preview. */}
      <NewsOpening locale={L} />
      <LiveStrip locale={L} className="pt-8" />
      <PortalHero locale={L} />
      {/* Portada por deportes: mosaico de widgets de distintos tamaños y carrusel propio en cada uno. */}
      <FootballSection locale={L} />
      <BasketballSection locale={L} />
      <AdSlot placement="home" className="py-6" />
      <MotorSection locale={L} />
      <TennisSection locale={L} />
      <MoreSportsSection locale={L} />
      <div className="pt-12" />
      <CompetitionsGrid locale={L} />
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12">
          <MovistarHero />
        </div>
      </section>
      {/* El archivo histórico vive en /mundiales: aquí solo una entrada. */}
      <MundialesEntry locale={L} />
    </>
  );
}

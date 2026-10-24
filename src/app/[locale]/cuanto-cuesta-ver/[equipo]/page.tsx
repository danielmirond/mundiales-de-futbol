import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition, type Competition } from '@/lib/competitions';
import { resolveTeam } from '@/lib/espn-team';
import { teamCost } from '@/lib/tv-cost';
import { TvCostView } from '@/components/tools/tv-cost-view';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

// Se recalcula cada hora: el canal de cada jornada llega unas dos semanas antes.
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

type Params = Promise<{ locale: string; equipo: string }>;
const LALIGA = () => getCompetition('futbol', 'laliga') as Competition;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, equipo } = await params;
  const ref = await resolveTeam(LALIGA(), equipo);
  if (!ref) return {};
  return pageMetadata({
    locale,
    path: `/cuanto-cuesta-ver/${ref.slug}`,
    title: `¿Cuánto cuesta ver al ${ref.name} en 2026-27? DAZN, Movistar y qué partidos te pierdes`,
    description: `Calculadora: qué plataformas necesitas para ver todos los partidos del ${ref.name} en LaLiga y Champions, cuánto cuestan y qué te pierdes con cada opción más barata. Partido a partido, con el canal de cada uno.`,
    keywords: [`dónde ver ${ref.name}`, `cuánto cuesta ver al ${ref.name}`, `${ref.name} dazn o movistar`, `partidos ${ref.name} televisión`],
    availableLocales: ['es'],
  });
}

export default async function TvCostPage({ params }: { params: Params }) {
  const { locale, equipo } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;
  const ref = await resolveTeam(LALIGA(), equipo);
  if (!ref) notFound();
  const cost = await teamCost(ref.id, [ref.name]);
  return (
    <main className="pt-28" data-sport="futbol">
      <JsonLd data={breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: '¿Cuánto cuesta ver a tu equipo?', path: '/cuanto-cuesta-ver' }, { name: ref.name, path: `/cuanto-cuesta-ver/${ref.slug}` }])} />
      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="kicker">Calculadora · temporada 2026-27</div>
        <h1 className="t-h1 mt-4 text-[var(--color-fg)]">¿Cuánto cuesta ver al {ref.name}?</h1>
      </header>
      <TvCostView team={ref.name} cost={cost} teamHref={withLocale(L, `/futbol/laliga/equipo/${ref.slug}`)} />
    </main>
  );
}

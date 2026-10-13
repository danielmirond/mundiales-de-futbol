import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchSeason, findMatchday, matchdayRange } from '@/lib/season';
import { getWostiIndex } from '@/lib/wosti';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { MatchdayList, MatchdayPager } from '@/components/portal/matchday-list';
import { resolveCompetition, compBase } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
type Params = Promise<{ locale: string; deporte: string; competicion: string; jornada: string }>;
const SAFE = /^(jornada|ronda|semana)-\d{1,3}$/;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, jornada } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c || !SAFE.test(jornada)) return {};
  const season = await fetchSeason(c);
  const md = findMatchday(season.matchdays, jornada);
  if (!md) return {};
  const done = md.played === md.matches.length;
  return pageMetadata({
    locale, path: `${compBase(c)}/resultados/${md.slug}`,
    title: `${md.label} ${c.shortName ?? c.name}: ${done ? 'resultados y marcadores' : 'partidos, horarios y resultados'}`,
    description: `${md.label} de ${c.name} (${matchdayRange(md)}): ${done ? 'todos los resultados' : 'horarios, canal de televisión y resultados en directo'} de los ${md.matches.length} partidos, con ficha de cada uno.`,
    keywords: [`${md.label.toLowerCase()} ${c.name}`, `resultados ${md.label.toLowerCase()} ${c.name}`, `${c.name} ${md.label.toLowerCase()}`],
    noIndex: !c.espn,
  });
}

export default async function MatchdayPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, jornada } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  if (!SAFE.test(jornada)) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const [season, wosti] = await Promise.all([fetchSeason(c), c.sport === 'futbol' ? getWostiIndex() : Promise.resolve(new Map())]);
  const md = findMatchday(season.matchdays, jornada);
  if (!md) notFound();

  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="resultados" title={`${md.label} de ${c.shortName ?? c.name}`} description={`${matchdayRange(md)} · ${md.matches.length} partidos · ${md.played} jugados${md.live ? ` · ${md.live} en directo` : ''}.`} extraPath={{ name: md.label, path: `${compBase(c)}/resultados/${md.slug}` }} />
      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        <div className="mb-5"><MatchdayPager comp={c} mds={season.matchdays} current={md} locale={L} section="resultados" /></div>
        <MatchdayList comp={c} md={md} locale={L} wosti={wosti} />
      </section>
    </main>
  );
}

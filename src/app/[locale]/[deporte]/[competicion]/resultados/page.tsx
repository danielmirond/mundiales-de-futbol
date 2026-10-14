import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchSeason, lastPlayedMatchday, matchdayRange } from '@/lib/season';
import { getWostiIndex } from '@/lib/wosti';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { MatchdayList, MatchdayPager } from '@/components/portal/matchday-list';
import { resolveCompetition, compBase, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 600;
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  return pageMetadata({
    locale, path: `${compBase(c)}/resultados`,
    title: `Resultados ${c.shortName ?? c.name}: última jornada y todas las anteriores`,
    description: `Resultados de ${c.name} jornada a jornada: marcadores de la última jornada, goleadores en cada ficha y acceso a todas las jornadas de la temporada.`,
    keywords: [`resultados ${c.name}`, `${c.name} resultados`, `resultados jornada ${c.name}`, `marcadores ${c.name}`],
    noIndex: !c.espn,
  });
}

export default async function CompetitionResultsPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const [season, wosti] = await Promise.all([fetchSeason(c), c.sport === 'futbol' ? getWostiIndex() : Promise.resolve(new Map())]);
  const mds = season.matchdays;
  const last = lastPlayedMatchday(mds);
  const played = mds.filter((m) => m.played > 0).reverse();
  const unit = c.sport !== 'futbol' ? 'semana' : c.kind === 'liga' || c.hasStandings ? 'jornada' : 'ronda';

  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="resultados" title={`Resultados de ${c.shortName ?? c.name}`} description={last ? `Última ${unit} disputada: ${last.label} (${matchdayRange(last)}). ${played.length} ${unit}s con resultados esta temporada.` : `Todavía no hay resultados de ${c.name} esta temporada.`} />

      {last && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
          <div className="mb-5"><MatchdayPager comp={c} mds={mds} current={last} locale={L} section="resultados" /></div>
          <MatchdayList comp={c} md={last} locale={L} wosti={wosti} />
        </section>
      )}

      {played.length > 1 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker">Temporada</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Todas las {unit}s</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {played.map((m) => (
              <li key={m.slug}>
                <Link href={withLocale(L, `${compBase(c)}/resultados/${m.slug}`)} className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3 hover:border-[var(--accent)]">
                  <span className="font-semibold text-[var(--color-fg)]">{m.label}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{matchdayRange(m)} · {m.played}/{m.matches.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchSeason, currentMatchday, matchdayRange } from '@/lib/season';
import { fetchEventSummary } from '@/lib/wc-2026-match-summary';
import { madridDateKey, type Match } from '@/lib/espn';
import { Crest } from '@/components/portal/crest';
import { Lineup } from '@/components/match/match-summary';
import { MatchStatus, phaseOf } from '@/components/match/match-status';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { resolveCompetition, compBase, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 300;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  return pageMetadata({
    locale, path: `${compBase(c)}/alineaciones`,
    title: `Alineaciones ${c.shortName ?? c.name}: onces confirmados de la jornada`,
    description: `Alineaciones de ${c.name} jornada a jornada: onces titulares confirmados, formación y suplentes de cada partido en cuanto los publican los clubes, una hora antes del inicio.`,
    keywords: [`alineaciones ${c.name}`, `${c.name} alineaciones`, `onces ${c.name}`, `alineaciones confirmadas ${c.name}`],
    noIndex: !c.espn || c.sport !== 'futbol',
  });
}

export default async function CompetitionLineupsPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const season = await fetchSeason(c);
  const md = currentMatchday(season.matchdays);
  // Partidos de la jornada actual (máx. 12): alineaciones vía resumen ESPN.
  const matches: Match[] = md ? md.matches.slice(0, 12) : [];
  const summaries = await Promise.all(matches.map((m) => fetchEventSummary(c.espn!, m.id, m.home.abbr, m.away.abbr, m.state === 'post' ? 86_400 : 120)));
  const today = madridDateKey();

  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="alineaciones" title={`Alineaciones de ${c.shortName ?? c.name}`} description={md ? `${md.label} (${matchdayRange(md)}). Los onces se confirman una hora antes de cada partido; hasta entonces se muestra la hora y el estado.` : `Todavía no hay partidos programados en ${c.name}.`} />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        <div className="grid gap-5">
          {matches.map((m, i) => {
            const sm = summaries[i];
            const has = !!sm?.hasLineups;
            const phase = phaseOf(m.state, m.statusName, has);
            const href = withLocale(L, `${compBase(c)}/partido/${m.id}`);
            return (
              <article key={m.id} className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
                <header className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border)] px-5 py-3.5">
                  <Link href={href} className="flex items-center gap-2.5 font-semibold text-[var(--color-fg)] hover:text-[var(--accent-ink)]">
                    <Crest src={m.home.logo} abbr={m.home.abbr} color={m.home.color} size="s" />{m.home.name}
                    <span className="n-m px-1 text-[var(--color-fg-subtle)]">{m.state !== 'pre' && m.home.score != null ? `${m.home.score}–${m.away.score}` : 'vs'}</span>
                    {m.away.name}<Crest src={m.away.logo} abbr={m.away.abbr} color={m.away.color} size="s" />
                  </Link>
                  <span className="font-mono text-xs tab-num text-[var(--color-fg-muted)]">{timeFmt.format(new Date(m.date))}{madridDateKey(new Date(m.date)) === today ? ' · hoy' : ''}</span>
                  <span className="ml-auto"><MatchStatus phase={phase} /></span>
                </header>
                {has && sm ? (
                  <div className="grid gap-4 p-4 md:grid-cols-2">
                    <Lineup team={m.home.name} formation={sm.formationHome} starters={sm.startHome} subs={sm.subsHome} />
                    <Lineup team={m.away.name} formation={sm.formationAway} starters={sm.startAway} subs={sm.subsAway} />
                  </div>
                ) : (
                  <p className="px-5 py-4 text-sm text-[var(--color-fg-muted)]">
                    {m.state === 'post' ? 'ESPN no ha publicado los onces de este partido.' : 'Alineaciones por confirmar: los clubes las anuncian una hora antes del inicio.'}{' '}
                    <Link href={href} className="text-[var(--accent-ink)] underline underline-offset-4">Ficha del partido</Link>
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

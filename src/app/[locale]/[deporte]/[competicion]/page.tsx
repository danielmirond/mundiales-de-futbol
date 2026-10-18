import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { competitionsOf, competitionPath, getCompetition } from '@/lib/competitions';
import { TodayBoard } from '@/components/portal/today-board';
import { fetchCompetitionPress } from '@/lib/press-feeds';
import { PressCarousel } from '@/components/portal/press-carousel';
import { StandingsTable } from '@/components/portal/standings-table';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { OpenAcbStats } from '@/components/portal/openacb-stats';
import { RacingHub } from '@/components/portal/racing-hub';
import { TennisHub } from '@/components/portal/tennis-hub';
import { GolfHub, FightHub } from '@/components/portal/individual-hubs';
import { resolveCompetition, withLocale, compBase } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { BoxingHub } from '@/components/portal/boxing-hub';
import { MotoGPHub } from '@/components/portal/motogp-hub';
import { AdSlot } from '@/components/affiliate/ad-slot';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 300;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  const soon = !c.espn && !c.href && !c.stats;
  return pageMetadata({
    locale,
    path: compBase(c),
    title: soon ? `${c.name}: calendario y resultados` : c.stats === 'motogp' ? `${c.name}: clasificación del Mundial, horarios del próximo gran premio y resultados` : c.stats === 'racing' ? `${c.name}: calendario${c.kind === 'mundial' ? ' de grandes premios' : ''}, horarios y clasificación del ${c.kind === 'mundial' ? 'mundial' : 'campeonato'}` : c.stats === 'tennis' ? `${c.name}: torneos en juego, partidos de hoy y resultados` : c.stats === 'golf' ? `${c.name}: torneo en juego, clasificación por vueltas y calendario` : c.stats === 'combat' ? `${c.name}: cartelera, resultados y próximas veladas` : c.stats === 'boxing' ? 'Boxeo: próximas veladas, horario en España y dónde ver cada combate' : c.stats && !c.espn ? `${c.name}: estadísticas avanzadas de equipos, ratings y ritmo` : `${c.name}: resultados, calendario${c.hasStandings ? ' y clasificación' : ''} en directo`,
    description: c.description,
    keywords: c.keywords,
    noIndex: soon,
  });
}

export default async function CompetitionPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const soon = !c.espn && !c.stats;
  const siblings = competitionsOf(s.slug).filter((x) => x.slug !== c.slug && (x.espn || x.href || x.stats));
  const more = (path: string, label: string) => (
    <div className="mx-auto -mt-6 w-full max-w-[1400px] px-6 pb-6 md:px-10">
      <Link href={withLocale(L, `${compBase(c)}/${path}`)} className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">{label} →</Link>
    </div>
  );

  const press = soon ? [] : await fetchCompetitionPress(c);
  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader s={s} c={c} locale={locale} section="inicio" title={c.name} description={c.description} />

      {soon ? (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-[var(--color-fg-muted)]">
            Estamos conectando los datos en directo de <strong className="text-[var(--color-fg)]">{c.name}</strong>. Mientras tanto, puedes seguir el resto de competiciones de {s.name.toLowerCase()}.
          </div>
        </section>
      ) : !c.espn && c.stats === 'openacb' ? (
        <OpenAcbStats />
      ) : !c.espn && c.stats === 'racing' ? (
        <RacingHub comp={c} locale={locale} />
      ) : !c.espn && c.stats === 'motogp' ? (
        <MotoGPHub />
      ) : !c.espn && c.stats === 'tennis' ? (
        <TennisHub comp={c} />
      ) : !c.espn && c.stats === 'golf' ? (
        <GolfHub comp={c} />
      ) : !c.espn && c.stats === 'boxing' ? (
        <BoxingHub locale={L} />
      ) : !c.espn && c.stats === 'combat' ? (
        <FightHub comp={c} />
      ) : (
        <>
          <TodayBoard locale={L} competitions={[c]} range="today" kicker="Hoy" title="Partidos de hoy" emptyText={`Hoy no hay partidos de ${c.name}.`} />
          {more('partidos-hoy', 'Partidos de hoy y mañana')}
          <TodayBoard locale={L} competitions={[c]} range={[1, 10]} kicker="Calendario" title="Próximos partidos" emptyText="Sin partidos programados en los próximos días." limitPerGroup={10} />
          {more('calendario', 'Calendario completo por jornadas')}
          <TodayBoard locale={L} competitions={[c]} range={[-10, -1]} kicker="Resultados" title="Últimos resultados" emptyText="Sin resultados recientes." limitPerGroup={10} />
          {more('resultados', 'Resultados de todas las jornadas')}
          {c.hasStandings && <StandingsTable comp={c} locale={L} />}
          {c.hasStandings && more('clasificacion', 'Clasificación completa')}
        </>
      )}

      <AdSlot placement="competicion" sport={c.sport} className="py-6" />
      {press.length >= 3 && <PressCarousel items={press} title={`Lo último de ${c.shortName ?? c.name} en los medios`} />}

      {siblings.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker mb-3">Más {s.name.toLowerCase()}</div>
          <div className="flex flex-wrap gap-2">
            {siblings.map((x) => (
              <Link key={x.slug} href={withLocale(L, competitionPath(x))} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
                {x.shortName ?? x.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

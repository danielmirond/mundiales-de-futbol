import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, MapPin, Users, ListChecks } from 'lucide-react';
import {
  FIXTURES_2026, TEAMS_2026, VENUES_2026, STAGE_LABEL,
  matchSlug, getFixtureBySlug,
} from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { fetchMatchSummary } from '@/lib/wc-2026-match-summary';
import { MatchSummarySections } from '@/components/match/match-summary';
import { pairSlug } from '@/lib/wc-head-to-head';
import { getMovistarLink } from '@/lib/movistar-match-links';
import { MovistarCintillo } from '@/components/affiliate/movistar-banner';
import { getNewsBySlug } from '@/lib/news';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const MADRID = 'Europe/Madrid';
const dateFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long',
});
const timeFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function names(f: ReturnType<typeof getFixtureBySlug>) {
  const h = f?.home ? TEAMS_2026[f.home] : undefined;
  const a = f?.away ? TEAMS_2026[f.away] : undefined;
  const hn = h?.name ?? f?.home ?? f?.label?.split(/ vs | - /)[0] ?? 'Por decidir';
  const an = a?.name ?? f?.away ?? 'Por decidir';
  return { h, a, hn, an };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const f = getFixtureBySlug(slug);
  if (!f) return pageMetadata({ locale, path: `/2026/partido/${slug}`, title: 'Partido del Mundial 2026', description: '', type: 'article' });
  const { hn, an } = names(f);
  const stage = STAGE_LABEL[f.stage] ?? f.stage;
  return pageMetadata({
    locale,
    path: `/2026/partido/${slug}`,
    title: `${hn} - ${an}: a qué hora, dónde ver y resultado · Mundial 2026`,
    description: `${hn} contra ${an} en el Mundial 2026 (${stage}). Horario en España, dónde verlo en TV, alineaciones, resultado en vivo y datos del partido.`,
    keywords: [
      `${hn} ${an}`, `${hn} - ${an}`, `${hn} ${an} mundial 2026`,
      `${hn} ${an} a qué hora`, `${hn} ${an} dónde ver`, `${hn} ${an} resultado`,
      'mundial 2026',
    ],
    type: 'article',
  });
}

export default async function PartidoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const f = getFixtureBySlug(slug);
  if (!f) notFound();

  const { h, a, hn, an } = names(f);
  const venue = VENUES_2026.find((v) => v.slug === f!.venue);
  const stageLabel = STAGE_LABEL[f!.stage] ?? f!.stage;
  const isGroup = f!.stage.length === 1;
  const ms = new Date(fixtureToUTC(f!)).getTime();

  const scoreMap = buildScoreMap(await fetchScores());
  const sc = scoreMap.get(scoreKey(f!.home, f!.away));
  const played = sc && sc.state !== 'pre' && sc.homeScore !== null && sc.awayScore !== null;
  const live = sc?.state === 'in';

  // Alineaciones, momentos clave y stats (ESPN summary) cuando el partido
  // está en juego o ya jugado. Devuelve null si aún no hay datos.
  const summary =
    sc?.id && (played || live) && f!.home && f!.away
      ? await fetchMatchSummary(sc.id, f!.home, f!.away)
      : null;

  const mov = getMovistarLink(f!.home && f!.away ? `ver-${f!.home.toLowerCase()}-${f!.away.toLowerCase()}-tv-mundial-2026` : '');

  // Artículo previo relacionado, si existe
  const relatedSlug = f!.home && f!.away
    ? [`ver-${f!.home.toLowerCase()}-${f!.away.toLowerCase()}-tv-mundial-2026-grupo-${f!.stage.toLowerCase()}`,
       `h2h-${matchSlug(f!)}-mundial-2026`].find((s) => getNewsBySlug(s))
    : undefined;
  const related = relatedSlug ? getNewsBySlug(relatedSlug) : undefined;

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${hn} - ${an}`,
    sport: 'Soccer',
    startDate: new Date(ms).toISOString(),
    eventStatus: live ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventScheduled',
    location: venue ? { '@type': 'Place', name: venue.name, address: `${venue.hostCity}, ${venue.country}` } : undefined,
    competitor: [
      { '@type': 'SportsTeam', name: hn },
      { '@type': 'SportsTeam', name: an },
    ],
    url: localeUrl(locale, `/2026/partido/${slug}`),
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    superEvent: { '@type': 'SportsEvent', name: 'Copa Mundial de la FIFA 2026' },
  };

  const Side = ({ team, code, name }: { team?: typeof h; code?: string; name: string }) => {
    const inner = (
      <span className="flex flex-1 flex-col items-center gap-2 text-center">
        <span className="text-5xl leading-none md:text-7xl" aria-hidden>{team?.flag ?? '🏳️'}</span>
        <span className="font-display text-xl uppercase leading-tight text-[var(--color-fg)] md:text-3xl">{name}</span>
      </span>
    );
    return code && team ? (
      <Link href={withLocale(locale as Locale, `/selecciones/${code}`)} className="flex-1 transition-colors hover:text-[var(--color-pitch)]">
        {inner}
      </Link>
    ) : <span className="flex-1">{inner}</span>;
  };

  return (
    <article className="pt-32">
      <JsonLd data={[eventLd, breadcrumbLd(locale, [
        { name: 'Inicio', path: '/' },
        { name: 'Mundial 2026', path: '/2026' },
        { name: 'Calendario', path: '/2026/calendario' },
        { name: `${hn} - ${an}`, path: `/2026/partido/${slug}` },
      ])]} />

      <header className="mx-auto w-full max-w-[1000px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/2026/calendario')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Calendario
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {isGroup ? (
            <Link href={withLocale(locale as Locale, `/2026/grupo/${f!.stage.toLowerCase()}`)} className="hover:underline">
              {stageLabel}
            </Link>
          ) : <span>{stageLabel}</span>}
          <span className="text-[var(--color-fg-subtle)]">· Mundial 2026</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {hn} <span className="text-[var(--color-fg-subtle)]">·</span> {an}
        </h1>
      </header>

      {/* Tarjeta del partido */}
      <section className="mx-auto mt-10 w-full max-w-[1000px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-10">
          <div className="flex items-center gap-3">
            <Side team={h} code={f!.home} name={hn} />
            <span className="shrink-0 px-2 text-center">
              {played ? (
                <span className="font-display tab-num text-4xl text-[var(--color-fg)] md:text-6xl">
                  {sc!.homeScore}<span className="mx-1 text-[var(--color-fg-subtle)]">-</span>{sc!.awayScore}
                </span>
              ) : (
                <span className="font-display text-2xl text-[var(--color-fg-subtle)]">vs</span>
              )}
              {live && (
                <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--color-flame)]">{sc!.clock || 'EN VIVO'}</div>
              )}
              {played && !live && (
                <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--color-fg-subtle)]">Final</div>
              )}
            </span>
            <Side team={a} code={f!.away} name={an} />
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
            <div className="bg-[var(--color-bg)] p-4 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Fecha</div>
              <div className="mt-1 text-sm font-medium text-[var(--color-fg)] capitalize">{dateFmt.format(ms)}</div>
            </div>
            <div className="bg-[var(--color-bg)] p-4 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Hora (España)</div>
              <div className="mt-1 text-sm font-medium text-[var(--color-fg)] tab-num">{timeFmt.format(ms)} h</div>
            </div>
            <div className="bg-[var(--color-bg)] p-4 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Fase</div>
              <div className="mt-1 text-sm font-medium text-[var(--color-fg)]">{stageLabel}</div>
            </div>
          </div>

          {venue && (
            <Link href={withLocale(locale as Locale, `/estadios/${venue.slug}`)} className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]">
              <MapPin className="h-3.5 w-3.5" /> {venue.name} · {venue.hostCity}, {venue.country}
            </Link>
          )}
        </div>
      </section>

      {/* Dónde ver */}
      <section className="mx-auto mt-8 w-full max-w-[1000px] px-6 md:px-10">
        <MovistarCintillo href={mov.href} context={`${hn} - ${an}`} matchId={mov.matchId} />
      </section>

      {/* Alineaciones · momentos clave · estadísticas (si hay datos) */}
      {summary && (
        <MatchSummarySections
          summary={summary}
          homeName={hn}
          awayName={an}
          homeFlag={h?.flag ?? '🏳️'}
          awayFlag={a?.flag ?? '🏳️'}
          live={!!live}
        />
      )}

      {/* Enlaces */}
      <section className="mx-auto mt-8 w-full max-w-[1000px] px-6 md:px-10">
        <div className="flex flex-wrap gap-3">
          {f!.home && h && (
            <Link href={withLocale(locale as Locale, `/selecciones/${f!.home}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              <Users className="h-4 w-4" /> Selección {hn}
            </Link>
          )}
          {f!.away && a && (
            <Link href={withLocale(locale as Locale, `/selecciones/${f!.away}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              <Users className="h-4 w-4" /> Selección {an}
            </Link>
          )}
          {isGroup && (
            <Link href={withLocale(locale as Locale, `/2026/grupo/${f!.stage.toLowerCase()}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              <ListChecks className="h-4 w-4" /> {stageLabel}
            </Link>
          )}
          {f!.home && f!.away && (
            <Link href={withLocale(locale as Locale, `/historial/${pairSlug(f!.home, f!.away)}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              <ListChecks className="h-4 w-4" /> Historial {hn}-{an}
            </Link>
          )}
          {related && (
            <Link href={withLocale(locale as Locale, `/noticias/${related.slug}`)} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90">
              Previa y análisis <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </Link>
          )}
        </div>
      </section>
    </article>
  );
}

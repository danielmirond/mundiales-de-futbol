import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Tv,
  Ticket,
} from 'lucide-react';
import {
  FIXTURES_2026,
  TEAMS_2026,
  VENUES_2026,
  STAGE_LABEL,
  GROUPS_2026,
  type Fixture26,
} from '@/lib/wc-2026';
import { SEDES_2026 } from '@/lib/wc-2026-sedes';
import { ICONIC_MATCHES } from '@/lib/match-iconic';
import { HISTORIAS } from '@/lib/historias';
import { type Match } from '@/lib/data/matches';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { MatchCard } from '@/components/edition/match-card';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Genera las 104 páginas estáticas, una por partido del Mundial 2026.
 * Multiplicado por 5 locales → 520 páginas pre-renderizadas.
 */
export function generateStaticParams() {
  return FIXTURES_2026.flatMap((f) =>
    routing.locales.map((locale) => ({ locale, n: String(f.n) })),
  );
}

// ───────────────────────────────────────────────────────────────────
// Adapters
// ───────────────────────────────────────────────────────────────────

/**
 * Convierte un Fixture26 (pre-torneo) al shape `Match` que MatchCard
 * espera. Cuando los partidos se hayan jugado, este adapter se
 * sustituirá por una query a Supabase que devuelva el Match real con
 * `home_score`, `away_score`, eventos, etc.
 */
function fixtureToMatch(f: Fixture26): Match {
  const venue = VENUES_2026.find((v) => v.slug === f.venue);
  const home = f.home ? TEAMS_2026[f.home] : undefined;
  const away = f.away ? TEAMS_2026[f.away] : undefined;
  const stageDb = mapStage(f.stage);

  return {
    match_number: f.n,
    stage: stageDb,
    match_date: `${f.date}T${f.time}:00`,
    home_code: f.home ?? 'TBD',
    away_code: f.away ?? 'TBD',
    home_score: null,
    away_score: null,
    home_score_pk: null,
    away_score_pk: null,
    winner_code: null,
    home_team: home
      ? { name_official: home.name, flag_emoji: home.flag }
      : { name_official: f.label ?? 'TBD', flag_emoji: '🏳️' },
    away_team: away
      ? { name_official: away.name, flag_emoji: away.flag }
      : { name_official: f.label ?? 'TBD', flag_emoji: '🏳️' },
    venue: venue
      ? { name: venue.name, city: venue.hostCity }
      : null,
    referee: null,
  };
}

/**
 * Convierte el stage de Fixture26 (A..L, R32, R16, QF, SF, 3P, FINAL)
 * al stage canónico de la tabla matches en Supabase.
 */
function mapStage(s: string): string {
  if (s.length === 1) return 'group'; // 'A'..'L'
  if (s === 'R32') return 'r32';
  if (s === 'R16') return 'r16';
  if (s === 'QF') return 'qf';
  if (s === 'SF') return 'sf';
  if (s === '3P') return '3rd';
  if (s === 'FINAL') return 'final';
  return s.toLowerCase();
}

// ───────────────────────────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; n: string }>;
}) {
  const { locale, n } = await params;
  const num = parseInt(n, 10);
  const fixture = FIXTURES_2026.find((f) => f.n === num);
  if (!fixture) return {};

  const home = fixture.home ? TEAMS_2026[fixture.home] : null;
  const away = fixture.away ? TEAMS_2026[fixture.away] : null;
  const stageLabel = STAGE_LABEL[fixture.stage] ?? fixture.stage;
  const venue = VENUES_2026.find((v) => v.slug === fixture.venue);
  const iconic = ICONIC_MATCHES[`2026:${num}`];

  const titleBase = iconic
    ? iconic
    : home && away
      ? `${home.name} vs ${away.name}`
      : fixture.label ?? `Partido ${num}`;

  const dateHumanES = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(fixture.date));

  const description =
    home && away
      ? `${home.name} vs ${away.name}, ${stageLabel} del Mundial 2026, ${dateHumanES} a las ${fixture.time} (hora local) en ${venue?.name ?? 'sede por confirmar'} (${venue?.hostCity ?? ''}). Calendario, horario, dónde ver, alineaciones y historia.`
      : `${stageLabel} del Mundial 2026, ${dateHumanES} a las ${fixture.time} en ${venue?.name ?? 'sede por confirmar'}. Equipos por confirmar.`;

  return pageMetadata({
    locale,
    path: `/2026/partido/${num}`,
    title: `${titleBase} · ${stageLabel} Mundial 2026`,
    description,
    keywords: [
      `Mundial 2026 partido ${num}`,
      home ? `${home.name} Mundial 2026` : 'Mundial 2026',
      away ? `${away.name} Mundial 2026` : 'Mundial 2026',
      `${stageLabel} Mundial 2026`,
      `dónde ver ${home?.name ?? ''} ${away?.name ?? ''} Mundial 2026`.trim(),
      'calendario Mundial 2026',
    ].filter(Boolean),
    type: 'article',
  });
}

// ───────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────

export default async function Wc2026MatchPage({
  params,
}: {
  params: Promise<{ locale: string; n: string }>;
}) {
  const { locale, n } = await params;
  const num = parseInt(n, 10);
  setRequestLocale(locale);

  const fixture = FIXTURES_2026.find((f) => f.n === num);
  if (!fixture) notFound();

  const tBack = await getTranslations('matchCard');
  const t = await getTranslations('pages.wc2026.partido');

  const match = fixtureToMatch(fixture);
  const stageLabel = STAGE_LABEL[fixture.stage] ?? fixture.stage;
  const venue = VENUES_2026.find((v) => v.slug === fixture.venue);
  const iconic = ICONIC_MATCHES[`2026:${num}`];
  const home = fixture.home ? TEAMS_2026[fixture.home] : null;
  const away = fixture.away ? TEAMS_2026[fixture.away] : null;

  // Partido anterior / siguiente del mismo equipo (si hay equipos).
  const teamCodes = [fixture.home, fixture.away].filter(Boolean) as string[];
  const fixturesOfTeam = (code: string) =>
    FIXTURES_2026.filter((f) => f.home === code || f.away === code);
  const prevSameTeam = home
    ? fixturesOfTeam(home.code).filter((f) => f.n < num).slice(-1)[0]
    : undefined;
  const nextSameTeam = home
    ? fixturesOfTeam(home.code).find((f) => f.n > num)
    : undefined;

  // Otros partidos del mismo día.
  const sameDayMatches = FIXTURES_2026.filter(
    (f) => f.date === fixture.date && f.n !== num,
  );

  // Grupo del partido (si es fase de grupos).
  const group =
    fixture.stage.length === 1
      ? GROUPS_2026.find((g) => g.letter === fixture.stage)
      : null;

  // Historia editorial relacionada (mismo año + algún team code).
  const linkedStory = HISTORIAS.find((h) => {
    if (!h.slug.includes('2026')) return false;
    return teamCodes.some((c) => h.slug.toLowerCase().includes(c.toLowerCase()));
  });

  // JSON-LD SportsEvent específico del partido.
  const url = localeUrl(locale, `/2026/partido/${num}`);
  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name:
      home && away
        ? `${home.name} vs ${away.name} · ${stageLabel} Mundial 2026`
        : `${fixture.label ?? `Partido ${num}`} · Mundial 2026`,
    sport: 'Football (Association)',
    startDate: `${fixture.date}T${fixture.time}:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: venue
      ? {
          '@type': 'StadiumOrArena',
          name: venue.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: venue.hostCity,
            addressCountry: venue.country,
          },
        }
      : undefined,
    competitor: [
      home && {
        '@type': 'SportsTeam',
        name: home.name,
        url: localeUrl(locale, `/selecciones/${home.code}`),
      },
      away && {
        '@type': 'SportsTeam',
        name: away.name,
        url: localeUrl(locale, `/selecciones/${away.code}`),
      },
    ].filter(Boolean),
    superEvent: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      url: localeUrl(locale, '/2026'),
    },
    url,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          eventLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Calendario', path: '/2026/calendario' },
            {
              name:
                home && away ? `${home.name} vs ${away.name}` : `Partido ${num}`,
              path: `/2026/partido/${num}`,
            },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/calendario')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
          {t('backToCalendar')}
        </Link>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.3em]">
          <span className="text-[var(--color-pitch)]">{t('matchNumber', { n: num })}</span>
          <span className="text-[var(--color-fg-muted)]">·</span>
          <span className="text-[var(--color-fg-muted)]">{stageLabel}</span>
          {iconic && (
            <>
              <span className="text-[var(--color-fg-muted)]">·</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--color-sun)]">
                <Trophy className="h-3 w-3" />
                {iconic}
              </span>
            </>
          )}
        </div>

        <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
          {home && away ? (
            <>
              <span className="text-[var(--color-fg)]">{home.name}</span>
              <br />
              <span className="text-[var(--color-fg-subtle)]">vs</span>{' '}
              <span className="text-[var(--color-fg)]">{away.name}</span>
            </>
          ) : (
            fixture.label ?? `Partido ${num}`
          )}
        </h1>

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <div className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Intl.DateTimeFormat(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date(fixture.date))}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{fixture.time} {t('localTime')}</span>
          </div>
          {venue && (
            <Link
              href={withLocale(
                locale as Locale,
                `/2026/sedes/${
                  SEDES_2026.find((s) => s.venueSlug === venue.slug)?.citySlug ?? venue.slug
                }`,
              )}
              className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-pitch)]"
            >
              <MapPin className="h-4 w-4" />
              <span>{venue.name} · {venue.hostCity}</span>
            </Link>
          )}
        </dl>
      </header>

      {/* Match card central con tabs */}
      <section className="mx-auto mt-12 w-full max-w-[1200px] px-6 md:px-10">
        <MatchCard
          match={match}
          tournamentYear={2026}
          tournamentSlug="2026-norteamerica"
          locale={locale as Locale}
          variant="full"
        />
      </section>

      {/* Acciones rápidas pre-match */}
      <section className="mx-auto mt-10 grid w-full max-w-[1200px] gap-3 px-6 md:grid-cols-2 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/donde-ver')}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
        >
          <span className="inline-flex items-center gap-3">
            <Tv className="h-5 w-5 text-[var(--color-pitch)]" />
            <span className="font-display text-base uppercase">
              {t('whereToWatch')}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/2026/entradas')}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
        >
          <span className="inline-flex items-center gap-3">
            <Ticket className="h-5 w-5 text-[var(--color-pitch)]" />
            <span className="font-display text-base uppercase">
              {t('tickets')}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </section>

      {/* Grupo del partido (si fase de grupos) */}
      {group && (
        <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('groupLabel')} {group.letter}
          </div>
          <h2 className="mt-2 font-display text-2xl uppercase">
            {t('otherTeamsInGroup')}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {group.teams.filter((c): c is string => c !== null).map((code) => {
              const team = TEAMS_2026[code];
              if (!team) return null;
              const inMatch = code === fixture.home || code === fixture.away;
              return (
                <li key={code}>
                  <Link
                    href={withLocale(locale as Locale, `/selecciones/${code}`)}
                    className={`flex items-center gap-3 rounded-2xl border bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]/40 ${
                      inMatch
                        ? 'border-[var(--color-pitch)]/40'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <span aria-hidden className="text-3xl">{team.flag}</span>
                    <span>
                      <span className="block font-display text-sm uppercase leading-tight">
                        {team.name}
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                        {team.code}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Otros partidos del mismo día */}
      {sameDayMatches.length > 0 && (
        <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('sameDay')}
          </div>
          <h2 className="mt-2 font-display text-2xl uppercase">
            {t('otherMatchesToday')}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sameDayMatches.slice(0, 6).map((f) => {
              const h = f.home ? TEAMS_2026[f.home] : null;
              const a = f.away ? TEAMS_2026[f.away] : null;
              return (
                <li key={f.n}>
                  <Link
                    href={withLocale(locale as Locale, `/2026/partido/${f.n}`)}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]/40"
                  >
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className="text-xl">{h?.flag ?? '🏳️'}</span>
                      <span className="font-mono text-xs uppercase tracking-[0.15em]">
                        {h?.code ?? 'TBD'} <span className="text-[var(--color-fg-subtle)]">vs</span> {a?.code ?? 'TBD'}
                      </span>
                      <span aria-hidden className="text-xl">{a?.flag ?? '🏳️'}</span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                      {f.time}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Anterior / siguiente del mismo equipo */}
      {(prevSameTeam || nextSameTeam) && home && (
        <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('teamJourney', { team: home.name })}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {prevSameTeam ? (
              <Link
                href={withLocale(locale as Locale, `/2026/partido/${prevSameTeam.n}`)}
                className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
                  {t('previousMatch')}
                </span>
                <span className="font-display text-base uppercase">
                  {prevSameTeam.home && prevSameTeam.away
                    ? `${TEAMS_2026[prevSameTeam.home]?.name ?? prevSameTeam.home} vs ${TEAMS_2026[prevSameTeam.away]?.name ?? prevSameTeam.away}`
                    : prevSameTeam.label ?? `Partido ${prevSameTeam.n}`}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                  {prevSameTeam.date} · {prevSameTeam.time}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextSameTeam ? (
              <Link
                href={withLocale(locale as Locale, `/2026/partido/${nextSameTeam.n}`)}
                className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 text-right transition-colors hover:border-[var(--color-pitch)]/40"
              >
                <span className="inline-flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  {t('nextMatch')}
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </span>
                <span className="font-display text-base uppercase">
                  {nextSameTeam.home && nextSameTeam.away
                    ? `${TEAMS_2026[nextSameTeam.home]?.name ?? nextSameTeam.home} vs ${TEAMS_2026[nextSameTeam.away]?.name ?? nextSameTeam.away}`
                    : nextSameTeam.label ?? `Partido ${nextSameTeam.n}`}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                  {nextSameTeam.date} · {nextSameTeam.time}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}
    </article>
  );
}

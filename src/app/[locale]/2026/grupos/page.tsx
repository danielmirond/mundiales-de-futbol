import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import {
  GROUPS_2026,
  FIXTURES_2026,
  VENUES_2026,
  TEAMS_2026,
  getTeam2026,
} from '@/lib/wc-2026';
import { fetchScores, buildScoreMap, groupStandings } from '@/lib/live-scores';
import { DaznBanner } from '@/components/affiliate/dazn-banner';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.grupos' });
  return pageMetadata({
    locale,
    path: '/2026/grupos',
    title: t('title'),
    description: t('description'),
    availableLocales: ['es', 'en'],
    keywords:
      locale === 'en'
        ? [
            '2026 World Cup groups',
            'World Cup 2026 group stage',
            '2026 World Cup draw',
            'Group A B C D World Cup 2026',
            '12 groups 48 teams 2026',
            '2026 FIFA World Cup teams',
          ]
        : [
            'grupos Mundial 2026',
            'sorteo Mundial 2026',
            'grupo A B C D Mundial 2026',
            'equipos clasificados Mundial 2026',
            'fase de grupos Mundial 2026',
          ],
  });
}

const STAGE_LABEL: Record<string, string> = {
  J1: 'Jornada 1',
  J2: 'Jornada 2',
  J3: 'Jornada 3',
};

function fmtShortDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
  }).format(d);
}

export default async function GroupsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.grupos' });

  const venueBySlug = new Map(VENUES_2026.map((v) => [v.slug, v]));
  const scoreMap = buildScoreMap(await fetchScores());

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'en' ? '2026 World Cup groups' : 'Grupos Mundial 2026',
    url: localeUrl(locale, '/2026/grupos'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      locale === 'en'
        ? 'The 12 groups of the 2026 World Cup with all 48 qualified teams, host cities and group-stage schedule.'
        : 'Los 12 grupos del Mundial 2026 con los 48 equipos clasificados, sedes y calendario de la fase de grupos.',
    hasPart: GROUPS_2026.map((g) => ({
      '@type': 'WebPage',
      name: (locale === 'en' ? 'Group ' : 'Grupo ') + g.letter,
      url: localeUrl(locale, `/2026/grupo/${g.letter}`),
    })),
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: locale === 'en' ? 'Home' : 'Inicio', path: '/' },
            { name: locale === 'en' ? 'World Cup 2026' : 'Mundial 2026', path: '/2026' },
            { name: locale === 'en' ? 'Groups' : 'Grupos', path: '/2026/grupos' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
        </Link>

        <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('kicker')}
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('h1Line1')}<br />{t('h1Line2')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t('intro')}
        </p>
      </header>

      <div className="mx-auto mt-10 w-full max-w-[1100px] px-6 md:px-10">
        <DaznBanner creative="leaderboard" />
      </div>

      <div className="mx-auto mt-12 w-full max-w-[1400px] px-6 md:px-10">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GROUPS_2026.map((g) => {
            const rows = groupStandings(g.letter, scoreMap);
            const played = rows.some((r) => r.pj > 0);
            const groupFixtures = FIXTURES_2026.filter(
              (f) => f.stage === g.letter,
            );
            // Sedes únicas de los 6 partidos del grupo
            const groupVenues = Array.from(
              new Set(groupFixtures.map((f) => f.venue)),
            )
              .map((slug) => venueBySlug.get(slug))
              .filter(Boolean);

            return (
              <li key={g.letter} className="flex h-full flex-col gap-5 bg-[var(--color-bg)] p-6 md:p-7">
                  <div className="flex items-baseline justify-between">
                    <Link
                      href={withLocale(locale as Locale, `/2026/grupo/${g.letter}`)}
                      className="font-display text-5xl uppercase leading-none text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)] md:text-6xl"
                    >
                      {g.letter}
                    </Link>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                      {t('matchesCount', { count: groupFixtures.length })}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {played && (
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                        <span className="w-5" aria-hidden />
                        <span className="flex-1" />
                        <span className="w-6 text-end">PJ</span>
                        <span className="w-6 text-end">Pts</span>
                      </li>
                    )}
                    {rows.map((r) => {
                      const tm = getTeam2026(r.code);
                      return (
                        <li key={r.code} className="flex items-center gap-3">
                          <Link
                            href={withLocale(locale as Locale, `/selecciones/${r.code}`)}
                            className="flex min-w-0 flex-1 items-center gap-3 transition-colors hover:text-[var(--color-pitch)]"
                          >
                            <span aria-hidden className="text-xl">{tm?.flag}</span>
                            <span className="flex-1 truncate text-sm font-medium text-[var(--color-fg)]">
                              {tm?.name ?? r.code}
                            </span>
                          </Link>
                          {played ? (
                            <>
                              <span className="w-6 text-end font-mono text-xs tab-num text-[var(--color-fg-subtle)]">
                                {r.pj}
                              </span>
                              <span className="w-6 text-end font-mono text-sm font-bold tab-num text-[var(--color-fg)]">
                                {r.pts}
                              </span>
                            </>
                          ) : (
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                              {tm?.conf}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {groupVenues.length > 0 && (
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--color-border)] pt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                      <MapPin className="h-3 w-3" />
                      {groupVenues
                        .slice(0, 3)
                        .map((v) => v!.hostCity)
                        .join(' · ')}
                      {groupVenues.length > 3
                        ? ` · +${groupVenues.length - 3}`
                        : ''}
                    </div>
                  )}

                  <Link
                    href={withLocale(locale as Locale, `/2026/grupo/${g.letter}`)}
                    className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-pitch)]"
                  >
                    {t('groupCardCta')}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                  </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Cómo se clasifica */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('qualifyKicker')}
          </div>
          <h2 className="mt-3 font-display text-3xl uppercase leading-tight md:text-4xl">
            {t('qualifyTitle')}
          </h2>
          {locale === 'en' ? (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              Each group plays 6 matches in a round-robin (everyone vs everyone).
              The <strong className="text-[var(--color-fg)]">top two</strong> of every
              group (24 teams) and the <strong className="text-[var(--color-fg)]">eight best third-placed sides</strong>{' '}
              across the 12 groups advance — 32 teams in total — to the new Round of
              32, played from 28 June to 3 July.
            </p>
          ) : (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              Cada grupo juega 6 partidos en un round-robin (todos contra todos).
              Pasan los <strong className="text-[var(--color-fg)]">2 primeros</strong>
              de cada grupo (24 equipos) y los <strong className="text-[var(--color-fg)]">8 mejores terceros</strong>
              del torneo (entre 12 posibles). Total: 32 equipos a una ronda
              eliminatoria de dieciseisavos (R32) que se disputa del 28 de junio
              al 3 de julio.
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {locale === 'en' ? 'Schedule by phase' : 'Calendario por fase'}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {locale === 'en' ? '16 host venues' : '16 sedes'}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import {
  GROUPS_2026,
  FIXTURES_2026,
  VENUES_2026,
  TEAMS_2026,
  getTeam2026,
} from '@/lib/wc-2026';
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
  return pageMetadata({
    locale,
    path: '/2026/grupos',
    title: 'Grupos Mundial 2026: A-L con los 48 equipos, sedes y calendario',
    description:
      'Los 12 grupos del Mundial 2026 (A-L) con los 48 equipos, banderas, sedes de cada partido y calendario completo de la fase de grupos.',
    keywords: [
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

  const venueBySlug = new Map(VENUES_2026.map((v) => [v.slug, v]));

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Grupos Mundial 2026',
    url: localeUrl(locale, '/2026/grupos'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Los 12 grupos del Mundial 2026 con los 48 equipos clasificados, sedes y calendario de la fase de grupos.',
    hasPart: GROUPS_2026.map((g) => ({
      '@type': 'WebPage',
      name: `Grupo ${g.letter}`,
      url: localeUrl(locale, `/2026/grupo/${g.letter}`),
    })),
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Grupos', path: '/2026/grupos' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          12 grupos · 48 equipos · 72 partidos de grupos
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Los 12 grupos del<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Sorteo final celebrado el 5 de diciembre de 2025 en el Kennedy Center
          de Washington D.C. Pasan los 2 primeros de cada grupo + los 8 mejores
          terceros, total 32 equipos a una eliminatoria de dieciseisavos
          (R32) inédita en Mundiales.
        </p>
      </header>

      <div className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GROUPS_2026.map((g) => {
            const teams = (g.teams.filter(Boolean) as string[])
              .map((c) => getTeam2026(c))
              .filter(Boolean);
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
              <li key={g.letter} className="bg-[var(--color-bg)]">
                <Link
                  href={withLocale(
                    locale as Locale,
                    `/2026/grupo/${g.letter}`,
                  )}
                  className="group flex h-full flex-col gap-5 p-6 transition-colors hover:bg-[var(--color-bg-2)] md:p-7"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-5xl uppercase leading-none text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)] md:text-6xl">
                      {g.letter}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                      {groupFixtures.length} partidos
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {teams.map((t) => (
                      <li
                        key={t!.code}
                        className="flex items-center gap-3"
                      >
                        <span aria-hidden className="text-xl">
                          {t!.flag}
                        </span>
                        <span className="text-sm font-medium text-[var(--color-fg)]">
                          {t!.name}
                        </span>
                        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                          {t!.conf}
                        </span>
                      </li>
                    ))}
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

                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">
                    Calendario, tabla y sedes
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                  </span>
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
            Cómo se clasifica a la R32
          </div>
          <h2 className="mt-3 font-display text-3xl uppercase leading-tight md:text-4xl">
            48 equipos, 32 a la fase de eliminación
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            Cada grupo juega 6 partidos en un round-robin (todos contra todos).
            Pasan los <strong className="text-[var(--color-fg)]">2 primeros</strong>
            de cada grupo (24 equipos) y los <strong className="text-[var(--color-fg)]">8 mejores terceros</strong>
            del torneo (entre 12 posibles). Total: 32 equipos a una ronda
            eliminatoria de dieciseisavos (R32) que se disputa del 28 de junio
            al 3 de julio.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Calendario por fase
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              16 sedes
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}

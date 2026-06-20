import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getFormatter } from 'next-intl/server';
import { ArrowLeft, Trophy, Users, Activity, Target, CalendarDays } from 'lucide-react';
import { TOURNAMENTS } from '@/lib/tournaments';
import { getTournamentBySlug } from '@/lib/data/tournaments';
import { routing, type Locale } from '@/i18n/routing';
import { MatchesList } from '@/components/edition/matches-list';
import { EditionStandings } from '@/components/edition/edition-standings';
import { ArchiveVideos } from '@/components/edition/archive-videos';
import { PressWall } from '@/components/edition/press-wall';
import { EditionTimeline } from '@/components/edition/edition-timeline';
import { EditionStory } from '@/components/edition/edition-story';
import { EditionFamousGoals } from '@/components/edition/edition-famous-goals';
import { JsonLd, breadcrumbLd, SEO } from '@/lib/seo';

export function generateStaticParams() {
  return TOURNAMENTS.flatMap((t) =>
    routing.locales.map((locale) => ({ locale, slug: t.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTournamentBySlug(slug, locale);
  if (!t) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  // Patrón SEO confirmado: "Mundial {host} {year} - Partidos, historia y {seoIconic}".
  // Captura dos clusters: el estructural (Mundial 1986) y el icónico
  // (Campeón del Mundial de Maradona, el del Maracanazo, etc.).
  const tournamentRow = TOURNAMENTS.find((row) => row.slug === t.slug);
  const seoIconic = tournamentRow?.seoIconic ?? t.tagline;
  const title = `Mundial ${t.host} ${t.year} · Partidos, historia y ${seoIconic}`;
  const description = t.summary
    ? `${t.tagline}. ${t.summary}`
    : `Mundial ${t.host} ${t.year}: ${seoIconic}. Calendario, plantillas, partidos y crónica.`;
  const url =
    locale === routing.defaultLocale
      ? `${siteUrl}/ediciones/${t.slug}`
      : `${siteUrl}/${locale}/ediciones/${t.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}/ediciones/${t.slug}`
            : `${siteUrl}/${l}/ediciones/${t.slug}`,
        ]),
      ),
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Mundial de Fútbol',
      images: t.heroImageUrl ? [{ url: t.heroImageUrl, width: 1200, height: 675, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: t.heroImageUrl ? [t.heroImageUrl] : undefined,
    },
  };
}

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTournamentBySlug(slug, locale);
  if (!t) notFound();

  const format = await getFormatter();
  const upcoming = t.year >= 2026;

  const editionUrl =
    locale === routing.defaultLocale
      ? `${SEO.siteUrl}/ediciones/${t.slug}`
      : `${SEO.siteUrl}/${locale}/ediciones/${t.slug}`;

  // SportsEvent schema for the tournament. Discover-friendly fields:
  // startDate/endDate, location, organizer, and (where applicable) winner.
  const eventLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `Copa Mundial de la FIFA ${t.year}`,
    alternateName: [`FIFA World Cup ${t.year}`, `Mundial ${t.year}`],
    sport: 'Football (Association)',
    url: editionUrl,
    description: t.summary ?? t.tagline,
    startDate: t.startDate || `${t.year}-01-01`,
    endDate: t.endDate || `${t.year}-12-31`,
    eventStatus: upcoming
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Country',
      name: t.host,
    },
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    image: t.heroImageUrl,
  };
  if (!upcoming && t.champion && t.champion !== '-') {
    eventLd.winner = { '@type': 'SportsTeam', name: t.champion };
  }

  return (
    <div className="relative">
      <JsonLd
        data={[
          eventLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Ediciones', path: '/ediciones' },
            { name: `${t.year} · ${t.host}`, path: `/ediciones/${t.slug}` },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="relative flex min-h-[70svh] flex-col justify-end overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          {t.heroImageUrl && (
            <div className="absolute right-[-6%] top-[14%] bottom-[14%] aspect-square opacity-35 md:right-[4%] md:opacity-60">
              <Image
                src={t.heroImageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-contain"
                style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.3))' }}
                unoptimized
              />
            </div>
          )}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${t.palette.from}66, ${t.palette.to}55 50%, transparent)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/ediciones')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> 1930-2026
          </Link>
          <div
            className="mt-6 font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: t.palette.from }}
          >
            FIFA World Cup
          </div>
          <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.88]">
            <span className="block tab-num text-[var(--color-fg)]">{t.year}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${t.palette.from}, ${t.palette.to})` }}
            >
              {t.host}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-fg-muted)] md:text-2xl">
            {t.tagline}
          </p>
          {t.summary && (
            <p className="mt-3 max-w-2xl text-base italic leading-relaxed text-[var(--color-fg-subtle)]">
              {t.summary}
            </p>
          )}
        </div>
      </section>

      <EditionTimeline currentYear={t.year} locale={locale as Locale} />

      {/* Stats */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Trophy, label: 'Campeón', value: upcoming ? '-' : t.champion },
            { Icon: Users, label: 'Selecciones', value: String(t.teams) },
            { Icon: Activity, label: 'Partidos', value: t.matches ? format.number(t.matches) : '-' },
            { Icon: Target, label: 'Goles', value: t.goals ? format.number(t.goals) : '-' },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-3 bg-[var(--color-bg-2)] p-6 md:p-8">
              <Icon className="h-5 w-5" style={{ color: t.palette.from }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {label}
              </span>
              <span className="font-display text-4xl text-[var(--color-fg)] md:text-5xl">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Meta */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-fluid-h2 uppercase">Datos clave</h2>
            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-5 text-base">
              <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Sede
              </dt>
              <dd>{t.host}</dd>
              <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Fechas
              </dt>
              <dd className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[var(--color-fg-muted)]" />
                {t.startDate}, {t.endDate}
              </dd>
              {!upcoming && (
                <>
                  {t.runnerUp && (
                    <>
                      <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        Subcampeón
                      </dt>
                      <dd>{t.runnerUp}</dd>
                    </>
                  )}
                  {t.finalResult && (
                    <>
                      <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        Final
                      </dt>
                      <dd className="font-mono text-sm">
                        {t.champion} {t.finalResult.score} {t.runnerUp}
                        {t.finalResult.penalties && (
                          <span className="ms-2 text-[var(--color-fg-muted)]">
                            ({t.finalResult.penalties})
                          </span>
                        )}
                        {t.finalResult.extraTime && !t.finalResult.penalties && (
                          <span className="ms-2 text-[var(--color-fg-muted)]">(prórroga)</span>
                        )}
                      </dd>
                    </>
                  )}
                  {(t.third || t.fourth) && (
                    <>
                      <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        3.º · 4.º
                      </dt>
                      <dd>
                        {t.third ?? '-'} · {t.fourth ?? '-'}
                      </dd>
                    </>
                  )}
                  <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    Asistencia total
                  </dt>
                  <dd>{format.number(t.attendance)}</dd>
                  {t.topScorer && (
                    <>
                      <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        Máximo goleador
                      </dt>
                      <dd>
                        {t.topScorer.name} · <span className="text-[var(--color-fg-muted)]">{t.topScorer.team}</span> · {t.topScorer.goals} goles
                      </dd>
                    </>
                  )}
                  {t.bestPlayer && (
                    <>
                      <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        {t.bestPlayer.official ? 'Balón de Oro' : 'Mejor jugador'}
                      </dt>
                      <dd>
                        {t.bestPlayer.name} · <span className="text-[var(--color-fg-muted)]">{t.bestPlayer.team}</span>
                        {!t.bestPlayer.official && (
                          <span className="ms-2 text-xs text-[var(--color-fg-subtle)]">(antes del Balón de Oro oficial)</span>
                        )}
                      </dd>
                    </>
                  )}
                </>
              )}
            </dl>
          </div>
          <aside className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
              Próximamente
            </div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-fg-muted)]">
              <li>• Plantillas de las {t.teams} selecciones</li>
              <li>• Eventos minuto a minuto (goles, tarjetas, cambios)</li>
              <li>• Mapas de tiros con xG (StatsBomb)</li>
              <li>• Vídeos históricos (archive.org)</li>
              <li>• Crónicas editoriales y reportajes</li>
            </ul>
          </aside>
        </div>
      </section>

      <EditionStory year={t.year} />

      <EditionFamousGoals year={t.year} tournamentSlug={t.slug} locale={locale} />

      <PressWall year={t.year} locale={locale} />

      <ArchiveVideos year={t.year} locale={locale} />

      <MatchesList year={t.year} slug={slug} locale={locale as Locale} />

      <EditionStandings year={t.year} locale={locale as Locale} />
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, MapPin, Trophy } from 'lucide-react';
import { Countdown } from '@/components/home/countdown';
import { getTournament } from '@/lib/tournaments';
import { getAllVenues } from '@/lib/data/venues';
import { routing, type Locale } from '@/i18n/routing';
import { VENUES_2026, HOSTS, GROUPS_2026, PHASE_DATES, WC_2026 } from '@/lib/wc-2026';
import { WC2026Calendar } from '@/components/edition/wc2026-calendar';
import { WC2026Bracket } from '@/components/edition/wc2026-bracket';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

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
  const t = await getTranslations({ locale, namespace: 'pages.wc2026' });
  return pageMetadata({
    locale,
    path: '/2026',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
  });
}

type FaqItem = { q: string; a: string };

export default async function NorthAmerica2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.wc2026' });
  const tournament = getTournament(2026)!;

  // Pull venue hero images from DB
  const allVenues = await getAllVenues();
  const venueImages = new Map(
    allVenues.map((v) => [v.slug, v.hero_image_url]),
  );

  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: t('eventLdName'),
    alternateName: ['FIFA World Cup 2026', 'Mundial 2026'],
    sport: 'Football (Association)',
    startDate: WC_2026.kickoff,
    endDate: WC_2026.final,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: HOSTS.map((h) => ({
      '@type': 'Country',
      name: h.name,
    })),
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: localeUrl(locale, '/2026'),
    description: t('eventLdDescription'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div>
      <JsonLd
        data={[
          eventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.mundial'), path: '/2026' },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 50% at 50% 0%, ${tournament.palette.from}55 0%, transparent 60%), radial-gradient(40% 60% at 90% 10%, ${tournament.palette.to}55 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('hero.kicker')}
          </div>
          <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.88]">
            <span className="block text-[var(--color-fg)]">{t('hero.h1Country')}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${tournament.palette.from}, ${tournament.palette.to})` }}
            >
              {t('hero.h1Year')}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-fg-muted)] md:text-2xl">
            {t('hero.intro')}
          </p>
        </div>
      </section>

      <Countdown />

      {/* Host countries */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('hosts.kicker')}
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {t('hosts.h2')}
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {HOSTS.map((h) => (
            <div key={h.code} className="relative overflow-hidden bg-[var(--color-bg-2)] p-8 md:p-10">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{ background: `radial-gradient(80% 60% at 50% 0%, ${h.accent} 0%, transparent 80%)` }}
              />
              <div className="relative">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl">{h.flag}</span>
                  <span className="font-display text-4xl uppercase leading-none">{h.name}</span>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      {t('hosts.citiesLabel')}
                    </div>
                    <div className="mt-1 font-display text-5xl tab-num">{h.cityCount}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      {t('hosts.matchesLabel')}
                    </div>
                    <div className="mt-1 font-display text-5xl tab-num">{h.matchCount}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 16 venues grid */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {t('venues.kicker')}
            </div>
            <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
              {t('venues.h2')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {t('venues.ctaGuide')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/estadios')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('venues.ctaAll')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {VENUES_2026.map((v) => {
            const img = venueImages.get(v.slug);
            return (
              <Link
                key={v.slug}
                href={withLocale(locale as Locale, `/estadios/${v.slug}`)}
                className="group relative aspect-[4/5] flex flex-col justify-end overflow-hidden bg-[var(--color-bg)]"
              >
                {img && (
                  <Image
                    src={img}
                    alt={v.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-pitch)]">
                    {v.country} · {v.hostCity}
                  </div>
                  <div className="mt-1 font-display text-lg uppercase leading-tight text-white">
                    {v.name}
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-white/60">
                    {v.capacity.toLocaleString()} · {v.role}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 12 groups */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {t('groups.kicker')}
            </div>
            <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
              {t('groups.h2')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
              {t('groups.description')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {t('groups.ctaAll')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('groups.ctaCalendar')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {GROUPS_2026.map((g) => (
            <Link
              key={g.letter}
              href={withLocale(locale as Locale, `/2026/grupo/${g.letter}`)}
              className="group flex flex-col gap-3 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl uppercase text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                  {g.letter}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  {t('groups.cardLabel')}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm">
                {g.teams.map((code, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                      {i + 1}.
                    </span>
                    {code ? (
                      <span className="text-[var(--color-fg)]">{code}</span>
                    ) : (
                      <span className="text-[var(--color-fg-subtle)] italic">{t('groups.tbd')}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* Phase timeline */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('phases.kicker')}
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          {t('phases.h2')}
        </h2>

        <div className="mt-10 grid gap-px bg-[var(--color-border)] overflow-hidden rounded-3xl border border-[var(--color-border)] md:grid-cols-5">
          <Phase
            label={t('phases.items.groups.label')}
            dates={t('phases.items.groups.dates')}
            count={t('phases.items.groups.count')}
          />
          <Phase
            label={t('phases.items.r32.label')}
            dates={t('phases.items.r32.dates')}
            count={t('phases.items.r32.count')}
          />
          <Phase
            label={t('phases.items.r16qf.label')}
            dates={t('phases.items.r16qf.dates')}
            count={t('phases.items.r16qf.count')}
          />
          <Phase
            label={t('phases.items.sf.label')}
            dates={t('phases.items.sf.dates')}
            count={t('phases.items.sf.count')}
          />
          <Phase
            label={t('phases.items.final.label')}
            dates={`${PHASE_DATES.thirdPlace.slice(8)} y ${PHASE_DATES.final.slice(8)} ${t('phases.items.final.datesSuffix')}`}
            count={t('phases.items.final.count')}
            highlight
          />
        </div>

        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-6 py-4">
            <Trophy className="h-5 w-5 text-[var(--color-pitch)]" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)]">
              {t('phases.finalPill')}
            </span>
          </div>
        </div>
      </section>

      <WC2026Bracket />
      <WC2026Calendar locale={locale as Locale} />

      {/* FAQ, preguntas de alto volumen sobre el Mundial 2026.
          Empareja con FAQPage JSON-LD para captar Rich Snippets. */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-20 md:px-10 md:py-28">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('faq.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('faq.h2')}
        </h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {faqItems.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-8 pb-24 flex flex-wrap justify-center gap-3">
        <Link
          href={withLocale(locale as Locale, '/2026/donde-ver')}
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          {t('ctaBottom.dondeVer')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/2026/entradas')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.entradas')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/2026/convocatorias')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.convocatorias')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/2026/listas')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.listas')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/2026/mascotas')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.mascotas')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/2026/fan-zone')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.fanZone')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.panini')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <Link
          href={withLocale(locale as Locale, '/ediciones/2026-norteamerica')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('ctaBottom.ficha')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

function Phase({
  label,
  dates,
  count,
  highlight,
}: {
  label: string;
  dates: string;
  count: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-6"
      style={{
        background: highlight ? 'color-mix(in oklch, var(--color-pitch) 8%, var(--color-bg-2))' : 'var(--color-bg-2)',
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: highlight ? 'var(--color-pitch)' : 'var(--color-fg-subtle)' }}
      >
        {dates}
      </div>
      <div className="font-display text-xl uppercase text-[var(--color-fg)]">{label}</div>
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]">
        <MapPin className="h-3 w-3" />
        {count}
      </div>
    </div>
  );
}

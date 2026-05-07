import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ExternalLink, Tv, Globe, Wifi, AlertTriangle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
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
  const t = await getTranslations({ locale, namespace: 'pages.dondeVer' });
  return pageMetadata({
    locale,
    path: '/2026/donde-ver',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
  });
}

// ─── Datos no-traducibles ───────────────────────────────────────────
// Las strings (sub/price/coverage/extras) viven en messages/<locale>.json
// bajo pages.dondeVer.platformsList.<key>. Las URLs y nombres de marca
// de plataforma quedan en código (no se traducen).

type PlatformRow = {
  key: 'rtve' | 'movistar' | 'dazn';
  name: string;
  url: string;
  primary: boolean;
};
const PLATAFORMAS: readonly PlatformRow[] = [
  { key: 'rtve', name: 'RTVE', url: 'https://www.rtve.es', primary: true },
  { key: 'movistar', name: 'Movistar Plus+', url: 'https://www.movistar.es/movistar-plus', primary: true },
  { key: 'dazn', name: 'DAZN', url: 'https://www.dazn.com/es-ES/welcome', primary: false },
];

// matchday y fecha no se traducen.
type MatchRow = { key: 'm1' | 'm2' | 'm3'; matchday: string; fecha: string };
const PARTIDOS_ES: readonly MatchRow[] = [
  { key: 'm1', matchday: 'J1', fecha: '15 jun 2026' },
  { key: 'm2', matchday: 'J2', fecha: '22 jun 2026' },
  { key: 'm3', matchday: 'J3', fecha: '26 jun 2026' },
];

type FaqItem = { q: string; a: string };

// ────────────────────────────────────────────────────────────────────

export default async function DondeVerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.dondeVer' });

  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('articleHeadline'),
    description: t('articleDescription'),
    author: { '@type': 'Organization', name: 'Mundial de Fútbol' },
    publisher: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: localeUrl(locale, '/'),
    },
    datePublished: '2026-04-26',
    dateModified: '2026-04-26',
    mainEntityOfPage: localeUrl(locale, '/2026/donde-ver'),
  };

  return (
    <article className="relative">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.mundial'), path: '/2026' },
            { name: t('breadcrumb.dondeVer'), path: '/2026/donde-ver' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.15), transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/2026')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
          </Link>

          <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Tv className="h-4 w-4" />
            <span>{t('kicker')}</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            {t('h1Line1')}<br />{t('h1Line2')}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Plataformas */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('platforms.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('platforms.h2')}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLATAFORMAS.map((p) => (
            <a
              key={p.key}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col gap-4 rounded-3xl border p-6 transition-colors md:p-7 ${
                p.primary
                  ? 'border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/5 via-[var(--color-bg-2)] to-[var(--color-bg-2)] hover:border-[var(--color-pitch)]/50'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-2)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              {p.primary && (
                <span className="inline-flex w-fit rounded-full bg-[var(--color-pitch)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-black">
                  {t('platforms.primaryBadge')}
                </span>
              )}
              <h3 className="font-display text-2xl uppercase leading-tight text-[var(--color-fg)]">
                {p.name}
              </h3>
              <p className="text-sm text-[var(--color-fg-muted)]">{t(`platformsList.${p.key}.sub`)}</p>
              <div className="font-mono text-base text-[var(--color-pitch)]">{t(`platformsList.${p.key}.price`)}</div>
              <div className="space-y-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                <p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    {t('platforms.coverageLabel')}
                  </span>
                  <br />
                  {t(`platformsList.${p.key}.coverage`)}
                </p>
                <p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    {t('platforms.extrasLabel')}
                  </span>
                  <br />
                  {t(`platformsList.${p.key}.extras`)}
                </p>
              </div>
              <div className="mt-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                {t('platforms.ctaSite')} <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* España en el Mundial */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('matches.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('matches.h2')}
        </h2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {PARTIDOS_ES.map((p) => (
            <li key={p.key} className="bg-[var(--color-bg)] p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl text-[var(--color-fg-subtle)]">
                    {p.matchday}
                  </span>
                  <h3 className="font-display text-xl uppercase text-[var(--color-fg)] md:text-2xl">
                    {t(`matchesList.${p.key}.rival`)}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {p.fecha}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{t(`matchesList.${p.key}.intent`)}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                {t(`matchesList.${p.key}.sede`)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Link
            href={withLocale(locale as Locale, '/selecciones/ESP')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
          >
            {t('matches.fichaCta')}
          </Link>
        </div>
      </section>

      {/* Desde el extranjero */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('abroad.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('abroad.h2')}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          {t('abroad.intro')}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <Globe className="h-5 w-5 text-[var(--color-pitch)]" />
            <h3 className="mt-4 font-display text-lg uppercase">{t('abroad.ueGeoportH3')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {t('abroad.ueGeoportBody')}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <Wifi className="h-5 w-5 text-[var(--color-pitch)]" />
            <h3 className="mt-4 font-display text-lg uppercase">{t('abroad.esimUsaH3')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {t('abroad.esimUsaBody')}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <Tv className="h-5 w-5 text-[var(--color-pitch)]" />
            <h3 className="mt-4 font-display text-lg uppercase">{t('abroad.localUsaH3')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {t('abroad.localUsaBody')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
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

      {/* Disclaimer */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">{t('disclaimer.strong')}</strong>{' '}
            {t('disclaimer.body')}
          </p>
        </div>
      </section>
    </article>
  );
}

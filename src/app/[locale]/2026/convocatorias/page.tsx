import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
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
  const t = await getTranslations({ locale, namespace: 'pages.convocatorias2026.meta' });
  return pageMetadata({
    locale,
    path: '/2026/convocatorias',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
    type: 'article',
  });
}

// Datos no-traducibles. Las notas explicativas viven en JSON bajo
// pages.convocatorias2026.squad.notes.<year>.
type SizeHistoryRow = { year: number; size: number; hasNote?: boolean };
const SIZE_HISTORY: readonly SizeHistoryRow[] = [
  { year: 1982, size: 22 },
  { year: 1998, size: 22 },
  { year: 2002, size: 23 },
  { year: 2006, size: 23 },
  { year: 2010, size: 23 },
  { year: 2014, size: 23 },
  { year: 2018, size: 23 },
  { year: 2022, size: 26, hasNote: true },
  { year: 2026, size: 26, hasNote: true },
];

// Códigos y banderas no son traducibles. Nombre y `expected` viven en JSON.
type FederationRow = { code: string; flag: string };
const FEDERATIONS_NEXT_LIST: readonly FederationRow[] = [
  { code: 'ESP', flag: '🇪🇸' },
  { code: 'ARG', flag: '🇦🇷' },
  { code: 'BRA', flag: '🇧🇷' },
  { code: 'FRA', flag: '🇫🇷' },
  { code: 'GER', flag: '🇩🇪' },
  { code: 'POR', flag: '🇵🇹' },
  { code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'NED', flag: '🇳🇱' },
];

type TimelineItem = { date: string; title: string; detail: string };
type FaqItem = { q: string; a: string };

export default async function Convocatorias2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.convocatorias2026' });

  const timelineItems = (t.raw('timeline.items') as TimelineItem[]) ?? [];
  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('articleHeadline'),
    description: t('articleDescription'),
    url: localeUrl(locale, '/2026/convocatorias'),
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
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
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.mundial'), path: '/2026' },
            { name: t('breadcrumb.convocatorias'), path: '/2026/convocatorias' },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <FileText className="h-4 w-4" />
          <span>{t('kicker')}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('h1Line1')}<br />{t('h1Line2')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t('intro')}
        </p>
      </header>

      {/* Timeline 3 hitos */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
          {timelineItems.map((tl) => (
            <div key={tl.date} className="bg-[var(--color-bg-2)] p-7 md:p-8">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                <Calendar className="h-3 w-3" />
                {tl.date}
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-tight text-[var(--color-fg)] md:text-2xl">
                {tl.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {tl.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Datos del squad */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Users className="inline h-3 w-3 mr-2" />
          {t('squad.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {t('squad.h2')}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          {t.rich('squad.intro', {
            strong: (chunks) => <strong className="text-[var(--color-fg)]">{chunks}</strong>,
          })}
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">{t('squad.tableYear')}</th>
                <th className="px-4 py-4 text-right">{t('squad.tableSize')}</th>
                <th className="px-4 py-4">{t('squad.tableNote')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {SIZE_HISTORY.map((row) => (
                <tr
                  key={row.year}
                  className={`hover:bg-[var(--color-bg-2)]/40 ${
                    row.year === 2026 ? 'bg-[var(--color-pitch)]/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono tab-num text-[var(--color-fg)]">
                    {row.year}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-fg)]">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-fg-muted)]">
                    {row.hasNote ? t(`squad.notes.${row.year}`) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reemplazos por lesión */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Shield className="inline h-3 w-3 mr-2" />
          {t('replacements.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {t('replacements.h2')}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {t('replacements.allowedLabel')}
            </div>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight">
              {t('replacements.allowedTitle')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {t('replacements.allowedBody')}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-7">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              {t('replacements.forbiddenLabel')}
            </div>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight">
              {t('replacements.forbiddenTitle')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {t('replacements.forbiddenBody')}
            </p>
          </div>
        </div>
      </section>

      {/* Cuándo lo dirá cada federación */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('federations.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {t('federations.h2')}
        </h2>
        <p className="mt-6 max-w-3xl text-base text-[var(--color-fg-muted)]">
          {t('federations.intro')}
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {FEDERATIONS_NEXT_LIST.map((f) => (
            <li
              key={f.code}
              className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <span aria-hidden className="text-3xl">
                {f.flag}
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-xl uppercase leading-none text-[var(--color-fg)]">
                    {t(`federations.items.${f.code}.name`)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    {f.code}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  {t(`federations.items.${f.code}.expected`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('faq.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {t('faq.h2')}
        </h2>

        <ul className="mt-10 space-y-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {faqItems.map((item) => (
            <li key={item.q} className="bg-[var(--color-bg)] p-6 md:p-7">
              <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] md:text-xl">
                {item.q}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                {item.a}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          {t('faq.sourceNote')}
        </p>
      </section>

      {/* CTA hub */}
      <section className="mx-auto mb-24 mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('ctaHub.kicker')}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {t('ctaHub.calendario')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('ctaHub.grupos')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('ctaHub.sedes')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/selecciones/ESP/grupo-h')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('ctaHub.espGrupoH')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

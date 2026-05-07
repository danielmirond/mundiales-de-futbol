import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ExternalLink, Ticket, AlertTriangle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

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
  const t = await getTranslations({ locale, namespace: 'pages.entradas' });
  return pageMetadata({
    locale,
    path: '/2026/entradas',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
  });
}

// ─── Datos no-traducibles ───────────────────────────────────────────
// Las strings (name/when/desc) viven en messages/<locale>.json bajo
// pages.entradas.phases.<key>. Los flags `closed` y el orden quedan en código.

type PhaseRow = { key: 'p1' | 'p2' | 'p3' | 'p4'; n: number; closed: boolean };
const PHASES: readonly PhaseRow[] = [
  { key: 'p1', n: 1, closed: true },
  { key: 'p2', n: 2, closed: true },
  { key: 'p3', n: 3, closed: true },
  { key: 'p4', n: 4, closed: false },
];

type PriceRow = {
  key: 'groupCat3' | 'groupCat1' | 'r16' | 'qf' | 'sfCat3' | 'third' | 'finalCat3' | 'finalCat1';
  from: string;
  to: string;
};
const PRICES: readonly PriceRow[] = [
  { key: 'groupCat3', from: '120 $', to: '1.200 $' },
  { key: 'groupCat1', from: '300 $', to: '1.200 $' },
  { key: 'r16', from: '180 $', to: '1.500 $' },
  { key: 'qf', from: '550 $', to: '2.500 $' },
  { key: 'sfCat3', from: '930 $', to: '-' },
  { key: 'third', from: '300 $', to: '1.500 $' },
  { key: 'finalCat3', from: '1.490 $', to: '-' },
  { key: 'finalCat1', from: '6.730 $', to: '7.875 $' },
];

type HospitalityRow = {
  key: 'fifaPavilion' | 'championsClub' | 'pitchsideLounge' | 'suitesPrivate';
  from: string;
};
const HOSPITALITY: readonly HospitalityRow[] = [
  { key: 'fifaPavilion', from: '1.350 $/partido' },
  { key: 'championsClub', from: '2.500 $/partido' },
  { key: 'pitchsideLounge', from: '6.000 $/partido' },
  { key: 'suitesPrivate', from: 'hasta 73.200 $' },
];

type FaqItem = { q: string; a: string };
type HowToStep = { name: string; text: string };

// ────────────────────────────────────────────────────────────────────

export default async function EntradasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.entradas' });

  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];
  const howToSteps = (t.raw('howTo.steps') as HowToStep[]) ?? [];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // HowTo schema, guía paso a paso para comprar.
  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howTo.name'),
    description: t('howTo.description'),
    totalTime: 'PT15M',
    step: howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(i === 0 ? { url: 'https://www.fifa.com/tickets' } : {}),
    })),
  };

  return (
    <article className="relative">
      <JsonLd
        data={[
          faqLd,
          howToLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.mundial'), path: '/2026' },
            { name: t('breadcrumb.entradas'), path: '/2026/entradas' },
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
            <Ticket className="h-4 w-4" />
            <span>{t('kicker')}</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            {t('h1Line1')}<br />{t('h1Line2')}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            {t('intro')}
          </p>

          <a
            href="https://www.fifa.com/tickets"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Ticket className="h-4 w-4" />
            {t('ctaPrimary')}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      {/* Aviso de seguridad */}
      <section className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">{t('securityNotice.strong')}</strong> {t('securityNotice.body')}
          </p>
        </div>
      </section>

      {/* Fases de venta */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('phasesSection.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('phasesSection.h2')}
        </h2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {PHASES.map((p) => (
            <li key={p.key} className="bg-[var(--color-bg)] p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl text-[var(--color-fg-subtle)]">
                    {String(p.n).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">
                    {t(`phases.${p.key}.name`)}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                    {t(`phases.${p.key}.when`)}
                  </span>
                  {p.closed ? (
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      {t('statusLabels.closed')}
                    </span>
                  ) : (
                    <span className="rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)]">
                      {t('statusLabels.open')}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                {t(`phases.${p.key}.desc`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Precios */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('pricesSection.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('pricesSection.h2')}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          {t('pricesSection.intro')}
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-5 py-4">{t('pricesTable.stage')}</th>
                <th className="px-5 py-4">{t('pricesTable.from')}</th>
                <th className="px-5 py-4">{t('pricesTable.to')}</th>
                <th className="hidden px-5 py-4 md:table-cell">{t('pricesTable.notes')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {PRICES.map((p) => (
                <tr key={p.key} className="hover:bg-[var(--color-bg-2)]/40">
                  <td className="px-5 py-4 font-medium text-[var(--color-fg)]">{t(`prices.${p.key}.stage`)}</td>
                  <td className="px-5 py-4 font-mono text-[var(--color-pitch)]">{p.from}</td>
                  <td className="px-5 py-4 font-mono text-[var(--color-fg-muted)]">{p.to}</td>
                  <td className="hidden px-5 py-4 text-[var(--color-fg-muted)] md:table-cell">{t(`prices.${p.key}.notes`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          {t('pricesSection.footer')}
        </p>
      </section>

      {/* Hospitality */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('hospitalitySection.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('hospitalitySection.h2')}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          {t('hospitalitySection.intro')}
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {HOSPITALITY.map((h) => (
            <li
              key={h.key}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">
                  {t(`hospitality.${h.key}.name`)}
                </h3>
                <span className="font-mono text-xs text-[var(--color-pitch)]">{h.from}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {t(`hospitality.${h.key}.perks`)}
              </p>
            </li>
          ))}
        </ul>
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

      {/* CTA final */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-center md:p-14">
          <Ticket className="mx-auto h-10 w-10 text-[var(--color-pitch)]" />
          <h2 className="mt-6 font-display text-3xl uppercase leading-tight md:text-4xl">
            {t('ctaFinal.h2')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {t('ctaFinal.intro')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://www.fifa.com/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {t('ctaFinal.ctaTickets')} <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://hospitality.fifa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('ctaFinal.ctaHospitality')} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

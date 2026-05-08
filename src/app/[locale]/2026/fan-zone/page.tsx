import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Sofa, Volume2, Headphones, Beer } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { AmazonCard } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const PICK = (id: number) => AMAZON_PRODUCTS.find((p) => p.id === id)!;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.fanZone' });
  return pageMetadata({
    locale,
    path: '/2026/fan-zone',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
  });
}

type FaqItem = { q: string; a: string };
type Testimonial = { autor: string; contexto: string; quote: string };

// ────────────────────────────────────────────────────────────────────

export default async function FanZonePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.fanZone' });

  // Productos por capítulo
  const tvs = [PICK(13), PICK(14), PICK(15)]; // Hisense, Samsung QLED, LG OLED
  const proyector = PICK(16);
  const audios = [PICK(17), PICK(60), PICK(61)]; // Q700C, Q800D, Q990F
  const auriculares = PICK(62);
  const appleTv = PICK(63);

  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];
  const testimonials = ['t1', 't2', 't3'].map((key) => ({
    key,
    ...(t.raw(`testimonials.items.${key}`) as Testimonial),
  }));

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
    mainEntityOfPage: localeUrl(locale, '/2026/fan-zone'),
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
    <article className="relative">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.mundial'), path: '/2026' },
            { name: t('breadcrumb.fanZone'), path: '/2026/fan-zone' },
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
                'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.18), transparent 60%)',
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
            <Sofa className="h-4 w-4" />
            <span>{t('kicker')}</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            {t('h1Line1')}<br />{t('h1Line2')}<br />{t('h1Line3')}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Capítulo 1: La pantalla */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('chapter1.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('chapter1.h2')}
        </h2>

        <div className="mt-8 max-w-3xl space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
          <p>{t('chapter1.para1')}</p>
          <p>{t('chapter1.para2')}</p>
          <p>{t('chapter1.para3')}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tvs.map((tv) => (
            <AmazonCard key={tv.id} product={tv} variant="default" />
          ))}
        </div>

        <details className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('chapter1.proyectorSummary')}
          </summary>
          <div className="mt-4 grid gap-5 md:grid-cols-[2fr_1fr]">
            <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
              {t('chapter1.proyectorBody')}
            </p>
            <AmazonCard product={proyector} variant="default" />
          </div>
        </details>
      </section>

      {/* Capítulo 2: El sonido */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 text-[var(--color-pitch)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('chapter2.kicker')}
          </span>
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('chapter2.h2')}
        </h2>

        <div className="mt-8 max-w-3xl space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
          <p>{t('chapter2.para1')}</p>
          <p>{t('chapter2.para2')}</p>
          <p>{t('chapter2.para3')}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {audios.map((a) => (
            <AmazonCard key={a.id} product={a} variant="default" />
          ))}
        </div>
      </section>

      {/* Capítulo 3: Auriculares (sin agotar al de al lado) */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-center gap-3">
          <Headphones className="h-5 w-5 text-[var(--color-pitch)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('chapter3.kicker')}
          </span>
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('chapter3.h2')}
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
            <p>{t('chapter3.para1')}</p>
            <p>{t('chapter3.para2')}</p>
            <p>{t('chapter3.para3')}</p>
          </div>
          <AmazonCard product={auriculares} variant="featured" />
        </div>
      </section>

      {/* Testimonios */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('testimonials.kicker')}
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('testimonials.h2')}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          {t('testimonials.intro')}
        </p>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((tt) => (
            <li
              key={tt.key}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6"
            >
              <p className="text-base italic leading-relaxed text-[var(--color-fg)] md:text-lg">
                «{tt.quote}»
              </p>
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <div className="font-display text-base uppercase text-[var(--color-fg)]">
                  {tt.autor}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {tt.contexto}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          {t('testimonials.sourceNote')}
        </p>
      </section>

      {/* Apple TV / Streaming */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-center gap-3">
          <Beer className="h-5 w-5 text-[var(--color-pitch)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('chapter5.kicker')}
          </span>
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          {t('chapter5.h2')}
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.5fr]">
          <AmazonCard product={appleTv} variant="default" />
          <div className="space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
            <p>{t('chapter5.para1')}</p>
            <p>{t('chapter5.para2')}</p>
          </div>
        </div>
      </section>

      {/* Comunidad / cierre */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-8 md:p-14">
          <h2 className="font-display text-fluid-h2 uppercase leading-tight">
            {t('community.h2')}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            {t('community.intro')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/donde-ver')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              {t('community.ctaDondeVer')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('community.ctaCalendario')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/historias')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              {t('community.ctaHistorias')}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
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

      <div className="h-24" />
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { HOSPITALITY_FAQ } from '@/lib/wc-2026-hospitality';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/hospitality/faq',
    title: 'FAQ hospitality Mundial 2026 · Quién vende, precios, reembolsos',
    description:
      'Preguntas frecuentes sobre el hospitality oficial del Mundial 2026: quién vende (On Location), precios mínimos, moneda, reembolsos, plan de pagos, reventa, qué pasa si tu selección es eliminada, suites privadas y código de vestimenta.',
    keywords: [
      'faq hospitality mundial 2026',
      'preguntas hospitality fifa',
      'reembolso hospitality',
      'plan pagos fifa hospitality',
      'reventa hospitality mundial',
    ],
    type: 'article',
  });
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOSPITALITY_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'FAQ', path: '/2026/hospitality/faq' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/hospitality')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Hospitality Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <HelpCircle className="mr-2 inline h-3 w-3" /> Preguntas frecuentes
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          FAQ hospitality Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las dudas más habituales sobre los paquetes hospitality oficiales:
          quién los vende, precios mínimos, política de cancelación, plan de
          pagos, reventa y qué pasa si tu selección es eliminada en la fase
          de grupos.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] space-y-4 px-6 md:px-10">
        {HOSPITALITY_FAQ.map((item, i) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
          >
            <summary className="flex cursor-pointer items-baseline justify-between gap-3 font-display text-lg uppercase">
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-[var(--color-pitch)]">{String(i + 1).padStart(2, '0')}</span>
                <span>{item.q}</span>
              </span>
              <span className="font-mono text-xl text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">{item.a}</p>
          </details>
        ))}
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/hospitality/productos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Productos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/precios')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/sedes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por sede
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/selecciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por selección
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

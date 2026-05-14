import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { HOSPITALITY_PRODUCTS, fifaProductUrl } from '@/lib/wc-2026-hospitality';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/hospitality/productos',
    title: 'Productos hospitality Mundial 2026 · SM, VS, FMT, MM, MEL, Suites',
    description:
      'Los 7 productos hospitality oficiales del Mundial 2026: Single Match, Venue Series, Follow My Team, Multi-Match, MEL, Private Suites y PP-Suites. Audiencia, precios y qué incluye cada uno.',
    keywords: [
      'productos hospitality fifa',
      'single match hospitality',
      'venue series mundial 2026',
      'follow my team mundial',
      'multi-match bundle',
      'match experience light',
      'private suites mundial',
    ],
    type: 'article',
  });
}

export default async function ProductosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Productos hospitality Mundial 2026',
            url: localeUrl(locale, '/2026/hospitality/productos'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Productos', path: '/2026/hospitality/productos' },
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
          <Sparkles className="mr-2 inline h-3 w-3" /> 7 productos oficiales
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Qué hospitality elegir
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Tres preguntas para acertar producto: ¿cuántos partidos quieres
          ver, en qué ciudades, y con qué presupuesto? La respuesta te lleva
          a uno de estos 7 productos oficiales de FIFA Hospitality.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] space-y-5 px-6 md:px-10">
        {HOSPITALITY_PRODUCTS.map((p) => (
          <div key={p.id} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">{p.id}</div>
                <h2 className="mt-1 font-display text-2xl uppercase">{p.name}</h2>
              </div>
              {p.priceFromUsd && (
                <div className="font-mono text-base text-[var(--color-pitch)]">
                  desde {p.priceFromUsd.toLocaleString('es-ES')} USD
                  {p.priceCeilingUsd && (
                    <span className="text-[var(--color-fg-subtle)]"> · hasta {p.priceCeilingUsd.toLocaleString('es-ES')} USD</span>
                  )}
                </div>
              )}
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {p.audience}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">{p.description}</p>

            <div className="mt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Detalles</div>
              <ul className="mt-2 grid gap-1.5 md:grid-cols-2">
                {p.details.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-[var(--color-fg-muted)]">
                    <span className="text-[var(--color-pitch)]">·</span>{d}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={fifaProductUrl(p)}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Ver en FIFA Hospitality
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/hospitality/precios')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/private-suites')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Private Suites
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/sedes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por sede
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/selecciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por selección
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/faq')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

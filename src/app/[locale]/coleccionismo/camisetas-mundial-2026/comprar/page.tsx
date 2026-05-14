import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ShoppingCart, ShieldCheck } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { RETAILERS } from '@/lib/wc-2026-kits-info';

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
    path: '/coleccionismo/camisetas-mundial-2026/comprar',
    title: 'Dónde comprar camisetas del Mundial 2026 · Amazon, adidas, Nike, Puma',
    description:
      'Los mejores retailers para comprar camisetas oficiales del Mundial 2026 con envío a España: Amazon España (afiliación nuus-21 activa), adidas.es, Nike.com, Puma, Fútbol Emotion y Corner Football. Pros, contras y comisiones.',
    keywords: [
      'donde comprar camiseta Mundial 2026',
      'amazon camiseta Mundial 2026',
      'adidas mundial 2026 españa',
      'nike mundial 2026 españa',
      'futbol emotion camiseta seleccion',
      'comprar camiseta seleccion españa',
    ],
    type: 'article',
  });
}

export default async function ComprarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dónde comprar camisetas del Mundial 2026',
    url: localeUrl(locale, '/coleccionismo/camisetas-mundial-2026/comprar'),
    inLanguage: locale,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Camisetas Mundial 2026', path: '/coleccionismo/camisetas-mundial-2026' },
            { name: 'Dónde comprar', path: '/coleccionismo/camisetas-mundial-2026/comprar' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Camisetas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingCart className="mr-2 inline h-3 w-3" /> Retailers verificados
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Dónde comprar tu camiseta del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          {RETAILERS.length} retailers verificados con envío a España. Solo
          incluimos los que tienen stock oficial confirmado por la marca técnica
          o por contrato de distribución. Si una camiseta sale a menos de 35 €,
          es casi siempre falsificación: <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones')} className="underline">cómo detectarlas</Link>.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] space-y-4 px-6 md:px-10">
        {RETAILERS.map((r) => (
          <div
            key={r.id}
            className={`rounded-3xl border bg-[var(--color-bg-2)] p-6 md:p-7 ${
              r.affiliateActive ? 'border-[var(--color-pitch)]/40' : 'border-[var(--color-border)]'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl uppercase">{r.name}</h2>
              {r.affiliateActive && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                  <ShieldCheck className="h-3 w-3" /> Afiliación activa
                </span>
              )}
            </div>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
              {r.description}
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  ✓ Pros
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                  {r.pros.map((p) => (
                    <li key={p} className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">
                  ✗ Contras
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                  {r.cons.map((c) => (
                    <li key={c} className="flex gap-2"><span className="text-red-500">−</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href={r.hub}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                Ir a {r.name}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                Envío: {r.countriesShipping.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Authentic vs Replica
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Cómo detectar copias
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

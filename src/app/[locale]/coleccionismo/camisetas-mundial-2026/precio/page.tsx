import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Banknote, TrendingUp } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { KIT_TIERS } from '@/lib/wc-2026-kits-info';

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
    path: '/coleccionismo/camisetas-mundial-2026/precio',
    title: 'Precio camisetas Mundial 2026 · Réplica 70-100€, Authentic 130-180€',
    description:
      'Cuánto cuesta una camiseta del Mundial 2026: niño (50-80€), réplica (70-100€), authentic (130-180€) y match worn (3000-50000€). Precios oficiales por marca y tipo de camiseta.',
    keywords: [
      'precio camiseta Mundial 2026',
      'cuanto cuesta camiseta seleccion',
      'precio camiseta authentic',
      'precio camiseta replica',
      'precio camiseta adidas mundial',
      'precio camiseta nike mundial',
    ],
    type: 'article',
  });
}

export default async function PrecioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Precio camisetas Mundial 2026',
    url: localeUrl(locale, '/coleccionismo/camisetas-mundial-2026/precio'),
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
            { name: 'Precio', path: '/coleccionismo/camisetas-mundial-2026/precio' },
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
          <Banknote className="mr-2 inline h-3 w-3" /> Tabla de precios oficiales
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Cuánto cuesta una camiseta del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las camisetas oficiales del Mundial 2026 se venden en 4 tipologías
          con rangos de precio muy distintos. La diferencia entre una réplica
          y una authentic son 60-100 €, pero el salto en tecnología textil y
          fit es real. Aquí va el desglose por tipo.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] space-y-5 px-6 md:px-10">
        {KIT_TIERS.map((tier) => (
          <div
            key={tier.id}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl uppercase">{tier.name}</h2>
              <div className="font-mono text-xl text-[var(--color-pitch)]">
                {tier.priceRangeEur[0]}–{tier.priceRangeEur[1]} €
              </div>
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              {tier.audience}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
              {tier.fabricNotes}
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {(Object.entries(tier.techByBrand) as [string, string][]).map(([brand, tech]) => (
                <div
                  key={brand}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    {brand}
                  </div>
                  <div className="mt-1.5 text-sm font-semibold">{tech}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                Fit
              </div>
              <div className="mt-1.5 text-sm text-[var(--color-fg-muted)]">{tier.fitNotes}</div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  ✓ Bueno para
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                  {tier.goodFor.map((g) => (
                    <li key={g} className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">
                  ✗ No para
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                  {tier.notGoodFor.map((g) => (
                    <li key={g} className="flex gap-2"><span className="text-red-500">−</span>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Detalles técnicos
              </div>
              <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-muted)]">
                {tier.details.map((d) => (
                  <li key={d} className="flex gap-2"><span className="text-[var(--color-pitch)]">·</span>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <TrendingUp className="mr-2 inline h-3 w-3" /> Evolución del precio
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase">¿Por qué este precio?</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Las RRP (Recommended Retail Prices) de adidas, Nike y Puma para
            camisetas selección llevan subiendo un 8-12 % por ciclo desde
            Catar 2022. En 2022 la réplica adulto eran 90 € y la authentic
            150 €. En 2026 hablamos de 100 € y 180 €. Las marcas justifican
            la subida en el uso creciente de poliéster reciclado certificado
            y en el nuevo tejido prensado en lugar de cosido para reducir
            peso y mejorar la transpiración.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            En 2-3 meses tras el Mundial, las réplicas caen 20-30 % en
            outlets y marketplaces. Las authentics se mantienen porque son
            de tirada limitada. Las camisetas match-worn de jugadores
            estrella (Mbappé, Vinícius, Bellingham, Pedri) se subastan
            entre 5.000 y 50.000 € en mercados como Sotheby&apos;s o GOAT.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Authentic vs Replica
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/tallas')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Tallas
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Detectar falsas
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

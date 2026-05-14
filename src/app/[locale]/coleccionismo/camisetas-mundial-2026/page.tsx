import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  Shirt,
  ShoppingCart,
  Banknote,
  Sparkles,
  Ruler,
  AlertTriangle,
} from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { TEAM_KITS_2026 } from '@/lib/team-kit-2026';
import {
  CLUSTER_PAGES,
  RETAILERS,
  KIT_TIERS,
} from '@/lib/wc-2026-kits-info';

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
    path: '/coleccionismo/camisetas-mundial-2026',
    title: 'Camisetas Mundial 2026 · 48 selecciones, dónde comprar y precios',
    description:
      'Las camisetas oficiales del Mundial 2026: 48 selecciones con su marca técnica (Adidas, Nike, Puma, Hummel, Kelme, etc.), precios actualizados, dónde comprar con afiliación oficial, authentic vs replica, tallas y cómo detectar falsificaciones.',
    keywords: [
      'camisetas Mundial 2026',
      'camiseta oficial Mundial 2026',
      'comprar camiseta Mundial 2026',
      'precio camiseta Mundial 2026',
      'authentic replica Mundial 2026',
      'tallas camiseta selección',
      'falsificación camiseta Mundial',
      'Adidas Mundial 2026',
      'Nike Mundial 2026',
      'Puma Mundial 2026',
    ],
    type: 'article',
  });
}

function pageIcon(slug: string) {
  const map: Record<string, React.ReactNode> = {
    comprar: <ShoppingCart className="h-5 w-5 text-[var(--color-pitch)]" />,
    precio: <Banknote className="h-5 w-5 text-[var(--color-pitch)]" />,
    'authentic-vs-replica': <Sparkles className="h-5 w-5 text-[var(--color-pitch)]" />,
    tallas: <Ruler className="h-5 w-5 text-[var(--color-pitch)]" />,
    falsificaciones: <AlertTriangle className="h-5 w-5 text-[var(--color-pitch)]" />,
  };
  return map[slug] ?? <Shirt className="h-5 w-5 text-[var(--color-pitch)]" />;
}

export default async function CamisetasMundial2026Pillar({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const url = localeUrl(locale, '/coleccionismo/camisetas-mundial-2026');
  const subPages = CLUSTER_PAGES.filter((p) => p.slug !== '');

  // Agrupa las 48 selecciones por marca técnica.
  const byBrand: Record<string, string[]> = {};
  for (const code of Object.keys(TEAMS_2026)) {
    const kit = TEAM_KITS_2026[code];
    const brand = kit?.brand ?? 'Otros';
    if (!byBrand[brand]) byBrand[brand] = [];
    byBrand[brand].push(code);
  }
  const brandOrder = Object.keys(byBrand).sort((a, b) => byBrand[b].length - byBrand[a].length);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Camisetas oficiales del Mundial 2026',
    description: 'Las 48 selecciones con su marca técnica oficial, dónde comprar y precios.',
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: subPages.length,
      itemListElement: subPages.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: localeUrl(locale, p.pathname),
      })),
    },
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Camisetas Mundial 2026', path: '/coleccionismo/camisetas-mundial-2026' },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Shirt className="mr-2 inline h-3 w-3" /> Coleccionismo · Mundial 2026
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Camisetas<br />
          <span className="text-[var(--color-pitch)]">Mundial 2026</span>
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Las 48 selecciones del Mundial 2026 con su marca técnica oficial, dónde
          comprarlas con stock verificado, precios actualizados a mayo 2026 y guía
          para distinguir camiseta auténtica de réplica. Cuando esté disponible la
          afiliación Awin/CJ, los enlaces se actualizarán automáticamente.
        </p>
      </header>

      {/* Sub-páginas grid */}
      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Guías especializadas
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          {subPages.length} sub-páginas del cluster
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subPages.map((p) => (
            <li key={p.slug}>
              <Link
                href={withLocale(locale as Locale, p.pathname)}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
              >
                <div className="flex items-start justify-between">
                  {pageIcon(p.slug)}
                  <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
                <h3 className="font-display text-base uppercase leading-tight text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Resumen visual de tiers de precio */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          De réplica a match worn
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          4 niveles, 4 precios, 4 públicos
        </h2>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {KIT_TIERS.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-display text-lg uppercase">{t.name}</div>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                {t.audience}
              </p>
              <div className="mt-4 font-display text-2xl tab-num text-[var(--color-pitch)]">
                {t.id === 'match-worn' ? '3.000 - 50.000 €' : `${t.priceRangeEur[0]}-${t.priceRangeEur[1]} €`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reparto por marca */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Reparto por marca técnica
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          Las 48 selecciones, agrupadas
        </h2>

        <div className="mt-8 space-y-5">
          {brandOrder.map((brand) => (
            <div key={brand}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg uppercase">{brand}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  {byBrand[brand].length} selecciones
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {byBrand[brand]
                  .sort((a, b) => (TEAMS_2026[a]?.name ?? a).localeCompare(TEAMS_2026[b]?.name ?? b))
                  .map((code) => {
                    const team = TEAMS_2026[code];
                    return (
                      <li key={code}>
                        <Link
                          href={withLocale(locale as Locale, `/selecciones/${code}/camisetas`)}
                          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-1.5 text-xs transition-colors hover:border-[var(--color-pitch)]/40"
                        >
                          <span aria-hidden className="text-base">{team?.flag}</span>
                          <span className="text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]">
                            {team?.name ?? code}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Retailers cards */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Dónde comprar
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase md:text-3xl">
          {RETAILERS.length} retailers verificados
        </h2>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {RETAILERS.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border bg-[var(--color-bg-2)] p-5 ${
                r.affiliateActive ? 'border-[var(--color-pitch)]/40' : 'border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-base uppercase">{r.name}</h3>
                {r.affiliateActive && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    afiliación activa
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-[var(--color-fg-muted)] line-clamp-2">
                {r.description}
              </p>
              <a
                href={r.hub}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-pitch)] hover:underline"
              >
                Ir a {r.name} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          Algunos enlaces son de afiliación. Si compras desde aquí recibimos una pequeña
          comisión que financia esta cobertura editorial. <Link className="underline" href={withLocale(locale as Locale, '/aviso-afiliados')}>Aviso completo</Link>.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-10">
          <h2 className="font-display text-2xl uppercase">Sigue con el coleccionismo Mundial 2026</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Panini Mundial 2026
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/lego-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              LEGO Mundial 2026
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/normas-estadios')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Normas en estadios
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Hub Mundial 2026
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  Shirt,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { TEAMS_2026 } from '@/lib/wc-2026';
import {
  TEAM_KITS_2026,
  BRAND_BY_TEAM,
  brandTeamCounts,
  type KitBrand,
} from '@/lib/team-kit-2026';

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
    title:
      'Camisetas Mundial 2026: las 48 selecciones con marca técnica, precio y dónde comprar',
    description:
      'Catálogo completo de las camisetas oficiales del Mundial 2026 (Estados Unidos, Canadá, México). Las 48 selecciones con su marca técnica (adidas, Nike, Puma, Hummel, Macron…), precios RRP, fechas de lanzamiento y enlaces a Amazon España, adidas.es, nike.com y tiendas oficiales de federación.',
    keywords: [
      'camisetas mundial 2026',
      'camisetas copa del mundo 2026',
      'camiseta oficial mundial 2026',
      'camiseta selecciones mundial 2026',
      'camiseta adidas mundial 2026',
      'camiseta nike mundial 2026',
      'camiseta puma mundial 2026',
      'precio camiseta mundial 2026',
      'cuanto cuesta camiseta mundial 2026',
      'donde comprar camiseta mundial 2026',
      'camiseta españa mundial 2026',
      'camiseta argentina mundial 2026',
      'camiseta brasil mundial 2026',
      'camiseta mexico mundial 2026',
    ],
    type: 'article',
  });
}

const CONFEDERATIONS: { code: string; label: string; expectedTeams: number }[] = [
  { code: 'UEFA', label: 'UEFA · Europa', expectedTeams: 16 },
  { code: 'CONCACAF', label: 'CONCACAF · Norteamérica', expectedTeams: 6 },
  { code: 'CONMEBOL', label: 'CONMEBOL · Sudamérica', expectedTeams: 6 },
  { code: 'CAF', label: 'CAF · África', expectedTeams: 9 },
  { code: 'AFC', label: 'AFC · Asia', expectedTeams: 8 },
  { code: 'OFC', label: 'OFC · Oceanía', expectedTeams: 1 },
];

// ───────────────────────────────────────────────────────────────────
// Página
// ───────────────────────────────────────────────────────────────────

export default async function CamisetasMundial2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const url = localeUrl(locale, '/coleccionismo/camisetas-mundial-2026');
  const teamCodes = Object.keys(TEAMS_2026);
  const brandCounts = brandTeamCounts();
  const verifiedKits = Object.values(TEAM_KITS_2026).filter((k) => !k.unverified);

  // ItemList JSON-LD: Google le da peso de cara a Sitelinks y filtros.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Camisetas oficiales Mundial 2026',
    description:
      'Catálogo de camisetas oficiales de las 48 selecciones del Mundial 2026 con marca técnica, precios y enlaces de compra.',
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: teamCodes.length,
      itemListElement: teamCodes.map((code, i) => {
        const t = TEAMS_2026[code];
        return {
          '@type': 'ListItem',
          position: i + 1,
          name: `Camiseta ${t.name} Mundial 2026`,
          url: localeUrl(locale, `/selecciones/${code}/camisetas`),
        };
      }),
    },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          itemListLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            {
              name: 'Camisetas Mundial 2026',
              path: '/coleccionismo/camisetas-mundial-2026',
            },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Shirt className="mr-2 inline h-3 w-3" />
          Coleccionismo · Camisetas oficiales
        </div>
        <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
          Camisetas
          <br />
          Mundial 2026
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Las 48 selecciones del Mundial 2026 reparten su patrocinio técnico
          entre <strong>{brandCounts[0]?.brand}</strong> ({brandCounts[0]?.count}{' '}
          equipos), <strong>{brandCounts[1]?.brand}</strong>{' '}
          ({brandCounts[1]?.count}), <strong>{brandCounts[2]?.brand}</strong>{' '}
          ({brandCounts[2]?.count}) y siete marcas más. Aquí el catálogo completo
          con marca, precio RRP y enlaces de compra ordenados por afiliación
          activa.
        </p>
      </header>

      {/* Stats marca */}
      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Reparto por marca técnica
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Quién viste a quién en 2026
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brandCounts.map((b) => (
            <li
              key={b.brand}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-display text-xl uppercase text-[var(--color-fg)]">
                {b.brand}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                {b.count} selecciones
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Top verificadas (CTA destacado) */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Sparkles className="mr-2 inline h-3 w-3" />
          Drops verificados con precio y disponibilidad
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Las {verifiedKits.length} camisetas en venta hoy
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Camisetas con drop oficial publicado por la marca técnica y stock
          confirmado. Precios RRP en EUR y enlaces directos a Amazon España (con
          afiliación <code>nuus-21</code>) y a la web oficial de la marca.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verifiedKits.map((kit) => {
            const t = TEAMS_2026[kit.teamCode];
            const home = kit.kits.find((k) => k.variant === 'home');
            return (
              <li key={kit.teamCode}>
                <Link
                  href={withLocale(
                    locale as Locale,
                    `/selecciones/${kit.teamCode}/camisetas`,
                  )}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-2xl">
                        {t?.flag}
                      </span>
                      <span className="font-display text-lg uppercase">
                        {t?.name}
                      </span>
                    </div>
                    <span className="rounded-full bg-[var(--color-pitch)]/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                      {kit.brand}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">
                    {kit.intro.slice(0, 140)}
                    {kit.intro.length > 140 ? '…' : ''}
                  </p>
                  <div className="mt-auto flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    {home?.priceEur && (
                      <span className="font-display text-base tab-num text-[var(--color-pitch)]">
                        Desde {home.priceEur} €
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 group-hover:text-[var(--color-pitch)]">
                      Ver detalles
                      <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Las 48 selecciones agrupadas por confederación */}
      <section className="mx-auto mt-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Cobertura completa
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Las 48 selecciones del Mundial 2026
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Catálogo completo agrupado por confederación. Las marcadas con{' '}
          <ShieldCheck className="inline h-3.5 w-3.5 text-[var(--color-pitch)]" />{' '}
          tienen drop confirmado y enlaces de compra activos. El resto irán
          completándose conforme las marcas técnicas publiquen el material
          oficial antes del 11 de junio.
        </p>

        <div className="mt-12 space-y-12">
          {CONFEDERATIONS.map((conf) => {
            const teamsInConf = teamCodes.filter(
              (c) => TEAMS_2026[c]?.conf === conf.code,
            );
            return (
              <div key={conf.code}>
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                  {conf.label} · {teamsInConf.length} selecciones
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {teamsInConf.map((code) => {
                    const t = TEAMS_2026[code];
                    const kit = TEAM_KITS_2026[code];
                    const brand = BRAND_BY_TEAM[code];
                    const verified = kit && !kit.unverified;
                    return (
                      <li key={code}>
                        <Link
                          href={withLocale(
                            locale as Locale,
                            `/selecciones/${code}/camisetas`,
                          )}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-3.5 transition-colors hover:border-[var(--color-pitch)]/40"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span aria-hidden className="text-lg">
                              {t?.flag}
                            </span>
                            <span className="truncate text-sm">{t?.name}</span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                            {brand}
                            {verified && (
                              <ShieldCheck
                                aria-label="Drop verificado"
                                className="h-3 w-3 text-[var(--color-pitch)]"
                              />
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA hub */}
      <section className="mx-auto mb-24 mt-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">
            Sigue el calendario del Mundial 2026
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Calendario por fase
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Grupos A-L
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Cromos Panini
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/lego-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Sets LEGO
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            <ShoppingCart className="mr-1 inline h-3 w-3" /> Algunos enlaces son
            de afiliación. Si compras desde aquí, recibimos una pequeña
            comisión que financia esta cobertura editorial. Detalles en{' '}
            <Link
              href={withLocale(locale as Locale, '/aviso-afiliados')}
              className="underline"
            >
              aviso de afiliados
            </Link>
            .
          </p>
        </div>
      </section>
    </article>
  );
}

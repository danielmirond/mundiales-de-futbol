import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ShieldCheck, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { TEAM_KITS_2026 } from '@/lib/team-kit-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Comparador de precios de las camisetas oficiales del Mundial 2026.
 *
 * SEO objetivo:
 *  - "precio camiseta mundial 2026"
 *  - "cuanto cuesta camiseta mundial 2026"
 *  - "camiseta mundial 2026 mas cara / mas barata"
 *  - "comparar precios camisetas mundial 2026"
 *
 * Datos: lee `TEAM_KITS_2026` para extraer el precio home replica de cada
 * seleccion. Sin precio = excluida. Ordenacion de mas cara a mas barata.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/camisetas-mundial-2026/precio',
    title:
      'Precio de las camisetas Mundial 2026: cuánto cuesta cada selección y dónde es más barata',
    description:
      'Comparador completo de precios de las camisetas oficiales del Mundial 2026. RRP en EUR de réplica home, comparación entre marcas (adidas, Nike, Puma) y enlaces a las tiendas con afiliación activa.',
    keywords: [
      'precio camiseta mundial 2026',
      'cuanto cuesta camiseta mundial 2026',
      'camiseta mundial 2026 mas barata',
      'camiseta mundial 2026 mas cara',
      'comparar precios camisetas mundial 2026',
      'precio camiseta españa mundial 2026',
      'precio camiseta argentina mundial 2026',
      'replica vs authentic precio',
    ],
    type: 'article',
  });
}

type Row = {
  teamCode: string;
  teamName: string;
  brand: string;
  priceEur: number;
  url: string;
};

export default async function PrecioCamisetas({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Extraer RRP de home replica para cada seleccion verificada con precio
  const rows: Row[] = [];
  for (const kit of Object.values(TEAM_KITS_2026)) {
    if (kit.unverified) continue;
    const home = kit.kits.find((k) => k.variant === 'home' && k.priceEur != null);
    if (!home || home.priceEur == null) continue;
    const t = TEAMS_2026[kit.teamCode];
    if (!t) continue;
    rows.push({
      teamCode: kit.teamCode,
      teamName: t.name,
      brand: kit.brand,
      priceEur: home.priceEur,
      url: `/selecciones/${kit.teamCode}/camisetas`,
    });
  }

  // Ordenado de mas cara a mas barata (las mas caras suelen ser interes
  // de coleccionistas; las baratas, de fans que comparan).
  rows.sort((a, b) => b.priceEur - a.priceEur);

  // Stats agregadas
  const min = Math.min(...rows.map((r) => r.priceEur));
  const max = Math.max(...rows.map((r) => r.priceEur));
  const avg = Math.round(rows.reduce((acc, r) => acc + r.priceEur, 0) / rows.length);
  const cheapest = rows.filter((r) => r.priceEur === min);
  const mostExpensive = rows.filter((r) => r.priceEur === max);

  // Stats por marca
  const byBrand: Record<string, { count: number; sum: number }> = {};
  for (const r of rows) {
    if (!byBrand[r.brand]) byBrand[r.brand] = { count: 0, sum: 0 };
    byBrand[r.brand].count++;
    byBrand[r.brand].sum += r.priceEur;
  }
  const brandStats = Object.entries(byBrand).map(([brand, s]) => ({
    brand,
    count: s.count,
    avg: Math.round(s.sum / s.count),
  }));

  const url = localeUrl(locale, '/coleccionismo/camisetas-mundial-2026/precio');

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      'Precio de las camisetas Mundial 2026: cuánto cuesta cada selección',
    description: `Comparador de precios de ${rows.length} camisetas oficiales del Mundial 2026. RRP entre ${min} € y ${max} €.`,
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-11',
    mainEntityOfPage: url,
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            {
              name: 'Camisetas Mundial 2026',
              path: '/coleccionismo/camisetas-mundial-2026',
            },
            {
              name: 'Precio',
              path: '/coleccionismo/camisetas-mundial-2026/precio',
            },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Camisetas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Wallet className="mr-2 inline h-3 w-3" />
          Comparador de precios · {rows.length} camisetas
        </div>

        <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
          Cuánto cuesta
          <br />
          una camiseta
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El RRP (precio recomendado de venta) de la camiseta home réplica
          del Mundial 2026 va de los <strong>{min} €</strong> a los{' '}
          <strong>{max} €</strong> según selección y marca técnica. La media
          ronda los <strong>{avg} €</strong>. Las versiones auténticas
          (tecnología jugador) cuestan entre 130 € y 150 € en función de la
          marca. Aquí el comparador completo.
        </p>
      </header>

      {/* Stats cards */}
      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              Más cara
            </div>
            <div className="mt-3 font-display text-3xl tab-num text-[var(--color-pitch)]">
              {max} €
            </div>
            <div className="mt-2 text-sm text-[var(--color-fg-muted)]">
              {mostExpensive.map((r) => r.teamName).join(', ')}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              <TrendingDown className="mr-1 inline h-3 w-3" />
              Más barata
            </div>
            <div className="mt-3 font-display text-3xl tab-num text-[var(--color-pitch)]">
              {min} €
            </div>
            <div className="mt-2 text-sm text-[var(--color-fg-muted)]">
              {cheapest.map((r) => r.teamName).join(', ')}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Promedio réplica
            </div>
            <div className="mt-3 font-display text-3xl tab-num text-[var(--color-pitch)]">
              {avg} €
            </div>
            <div className="mt-2 text-sm text-[var(--color-fg-muted)]">
              {rows.length} selecciones verificadas
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Auténtica
            </div>
            <div className="mt-3 font-display text-3xl tab-num text-[var(--color-pitch)]">
              130-150 €
            </div>
            <div className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Tecnología jugador (HEAT.RDY, Dri-FIT ADV, dryCELL Pro)
            </div>
          </div>
        </div>
      </section>

      {/* Promedio por marca */}
      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Promedio por marca técnica
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          ¿Quién cobra más por su réplica?
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brandStats.map((b) => (
            <li
              key={b.brand}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-display text-xl uppercase">{b.brand}</div>
              <div className="mt-3 font-display text-2xl tab-num text-[var(--color-pitch)]">
                {b.avg} €
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {b.count} selecciones
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Ranking completo */}
      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShieldCheck className="mr-2 inline h-3 w-3" />
          Ranking RRP réplica home
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Las {rows.length} camisetas, de más cara a más barata
        </h2>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              <tr className="border-b border-[var(--color-border)]">
                <th className="py-3 pr-4 text-left">#</th>
                <th className="py-3 pr-4 text-left">Selección</th>
                <th className="py-3 pr-4 text-left">Marca</th>
                <th className="py-3 pr-4 text-right">RRP</th>
                <th className="py-3 pl-4 text-right" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const t = TEAMS_2026[r.teamCode];
                return (
                  <tr
                    key={r.teamCode}
                    className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-2)]"
                  >
                    <td className="py-3 pr-4 font-mono text-[var(--color-fg-subtle)] tab-num">
                      {i + 1}
                    </td>
                    <td className="py-3 pr-4">
                      <span aria-hidden className="mr-2 text-lg">{t?.flag}</span>
                      <Link
                        href={withLocale(locale as Locale, r.url)}
                        className="font-medium hover:text-[var(--color-pitch)]"
                      >
                        {r.teamName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                      {r.brand}
                    </td>
                    <td className="py-3 pr-4 text-right font-display tab-num text-[var(--color-pitch)]">
                      {r.priceEur} €
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Link
                        href={withLocale(locale as Locale, r.url)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
                      >
                        Comprar
                        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Nota editorial */}
      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-10">
          <h2 className="font-display text-xl uppercase">Réplica vs auténtica</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
            <p>
              <strong>Réplica fan</strong> (90-100 €): tela poliéster reciclado
              estándar, tecnología básica de absorción (AEROREADY, Dri-FIT,
              dryCELL), corte holgado, etiquetas en interior. Es la versión
              que usa la mayoría de aficionados y la que enlazamos por defecto
              en las páginas por selección.
            </p>
            <p>
              <strong>Auténtica jugador</strong> (130-150 €): tela técnica más
              ligera y elástica (HEAT.RDY de adidas, Dri-FIT ADV de Nike,
              dryCELL Pro de Puma), corte ajustado, escudo y patches termo-
              sellados (no bordados). Es exactamente la que viste el jugador
              en partido.
            </p>
            <p>
              <strong>Personalización</strong>: poner el nombre y el dorsal de
              un jugador (Yamal 19, Vinicius Jr. 7, Mbappé 10) suele añadir
              entre 15 y 30 € sobre el precio base, tanto en tienda oficial
              de marca como en Amazon.
            </p>
            <p>
              <strong>Talla niño</strong>: 60-80 € según marca, con la misma
              tecnología básica que la réplica adulta.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-24 mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Otros caminos</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/adidas')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Las adidas (15)
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/nike')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
            >
              Las Nike (15)
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/puma')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
            >
              Las Puma (9)
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
            >
              Ver las 48
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            Enlaces de afiliación · ver{' '}
            <Link href={withLocale(locale as Locale, '/aviso-afiliados')} className="underline">
              aviso de afiliados
            </Link>
            .
          </p>
        </div>
      </section>
    </article>
  );
}

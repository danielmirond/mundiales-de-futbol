import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Banknote, TrendingUp } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { HOSPITALITY_PRODUCTS, HOSPITALITY_CITIES } from '@/lib/wc-2026-hospitality';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/hospitality/precios',
    title: 'Precios hospitality Mundial 2026 · Desde 1.800 USD hasta 500.000 USD',
    description:
      'Tabla completa de precios oficiales del hospitality Mundial 2026: Match Experience Light (1.800 USD), Single Match (2.500 USD), Venue Series (8.275 USD), Follow My Team (6.500 USD), Multi-Match (5.800 USD), Private Suites (43.200 USD) y PP-Suites (120.000 USD).',
    keywords: [
      'precio hospitality mundial 2026',
      'cuanto cuesta hospitality fifa',
      'precio single match',
      'precio venue series',
      'precio private suite mundial',
      'cuanto cuesta follow my team',
    ],
    type: 'article',
  });
}

const SORTED_CITIES_BY_PRICE = [...HOSPITALITY_CITIES].sort((a, b) => a.priceFromUsd - b.priceFromUsd);

export default async function PreciosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Precios hospitality Mundial 2026',
            url: localeUrl(locale, '/2026/hospitality/precios'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Precios', path: '/2026/hospitality/precios' },
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
          <Banknote className="mr-2 inline h-3 w-3" /> Tabla de precios oficial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Cuánto cuesta el hospitality del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Los precios oficiales arrancan en <strong>1.800 USD por persona</strong>
          {' '}(MEL) y trepan hasta <strong>medio millón</strong> en PP-Suites.
          Esta es la tabla completa por producto + el coste mínimo de
          asistencia por sede.
        </p>
      </header>

      {/* Tabla por producto */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Precios por producto</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Producto</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">Desde</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Hasta</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Audiencia</th>
              </tr>
            </thead>
            <tbody>
              {[...HOSPITALITY_PRODUCTS].sort((a, b) => (a.priceFromUsd ?? 0) - (b.priceFromUsd ?? 0)).map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-[var(--color-bg)]/40' : ''}>
                  <td className="px-5 py-3 font-mono text-xs uppercase tracking-[0.15em]">
                    <span className="text-[var(--color-pitch)]">{p.id}</span> · {p.name}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg)]">
                    {p.priceFromUsd ? `${p.priceFromUsd.toLocaleString('es-ES')} USD` : '—'}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">
                    {p.priceCeilingUsd ? `${p.priceCeilingUsd.toLocaleString('es-ES')} USD` : '—'}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{p.audience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Precio por ciudad */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Precio mínimo por sede (Single Match)</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Ordenado de más barato a más caro. Los precios escalan con la
          ronda (octavos cuesta más que fase de grupos) y con la demanda de
          la ciudad. La final en MetLife arranca en ~9.000 USD.
        </p>

        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Ciudad</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Estadio</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">Desde</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Partidos</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_CITIES_BY_PRICE.map((c, i) => (
                <tr key={c.citySlug} className={i % 2 === 0 ? 'bg-[var(--color-bg)]/40' : ''}>
                  <td className="px-5 py-3">
                    <Link href={withLocale(locale as Locale, `/2026/hospitality/sedes/${c.citySlug}`)} className="font-semibold hover:text-[var(--color-pitch)]">
                      {c.cityName}
                    </Link>
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      {c.countryCode}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{c.stadiumName}</td>
                  <td className="px-5 py-3 text-[var(--color-pitch)]">{c.priceFromUsd.toLocaleString('es-ES')} USD</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <TrendingUp className="mr-2 inline h-3 w-3" /> Sobre los precios
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase">¿Por qué tan caro?</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            El hospitality oficial NO es la entrada normal. Incluye asiento
            premium garantizado (categoría 1), lounge con catering chef-driven,
            barra libre 3 h antes y 1 h después del partido, programa de
            entretenimiento y regalo conmemorativo. La diferencia con una
            entrada normal de FIFA Tickets es ~5x el precio, pero la
            experiencia es completamente distinta.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Las <strong>Private Suites</strong> son el escalón corporate:
            8-20 personas, cocina y bar privados, baño dentro de la suite.
            Si vas con un grupo grande, el precio por persona se acerca al
            de un Single Match individual pero con privacidad total.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase">Plan de pagos</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            On Location ofrece pago en 3-6 cuotas SIN intereses para
            paquetes superiores a 5.000 USD. La primera cuota es del 30 %
            (no reembolsable) y el resto se distribuye hasta marzo 2026.
            Si cancelas tras la segunda cuota pierdes el 50 % de lo pagado.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/hospitality/productos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Productos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/private-suites')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Private Suites
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/sedes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por sede
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

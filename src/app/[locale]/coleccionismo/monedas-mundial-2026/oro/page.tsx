import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Crown } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { COINS_MEXICO } from '@/lib/wc-2026-coins';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const ORO = COINS_MEXICO.filter((c) => c.metal === 'oro');

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/monedas-mundial-2026/oro',
    title: 'Monedas de oro Mundial 2026 · Banxico edición $25 MXN ley 0.999',
    description:
      'Las 4 monedas de oro fino del Banco de México para el Mundial 2026: ley 0.999, peso ½ onza, valor facial $25 MXN, ~2.500 USD precio Casa de Moneda. Tirada de 5.000 piezas por diseño (CDMX, Guadalajara, Monterrey, México anfitrión).',
    keywords: [
      'monedas oro mundial 2026',
      'moneda oro fino mundial 2026',
      'oro banxico mundial 2026',
      'moneda oro 25 pesos mundial',
      'oro fino ley 0.999 mundial 2026',
      'casa moneda mexico oro mundial',
      'moneda oro coleccionista mundial',
    ],
    type: 'article',
  });
}

export default async function OroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Monedas de oro Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026/oro'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
            { name: 'Oro', path: '/coleccionismo/monedas-mundial-2026/oro' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Monedas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-sun)]">
          <Crown className="mr-2 inline h-3 w-3" /> Premium · Edición limitada
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Monedas de oro Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las 4 monedas de oro fino del Banco de México son el producto top
          de la colección Mundial 2026. <strong>Ley 0.999</strong>, peso
          <strong> ½ onza troy</strong> (15,55 g), valor facial $25 MXN, valor
          real de mercado <strong>~2.500 USD</strong> por pieza. Tirada
          <strong> ultra-limitada: 5.000 piezas por diseño</strong>, 20.000
          monedas en total para el set completo.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Especificaciones técnicas</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[500px] text-sm">
            <tbody>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Metal</th>
                <td className="px-5 py-3 text-[var(--color-fg)]">Oro fino ley 0.999 (99,9% pureza)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Peso</th>
                <td className="px-5 py-3 text-[var(--color-fg)]">½ onza troy (15,55 g)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Diámetro</th>
                <td className="px-5 py-3 text-[var(--color-fg)]">27 mm</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Acabado</th>
                <td className="px-5 py-3 text-[var(--color-fg)]">Proof (espejo + relieve mate)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Valor facial</th>
                <td className="px-5 py-3 text-[var(--color-pitch)]">$25 MXN</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Precio Casa de Moneda</th>
                <td className="px-5 py-3 text-[var(--color-pitch)]">~2.500 USD</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tirada por diseño</th>
                <td className="px-5 py-3 text-[var(--color-fg)]">5.000 piezas</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tirada total set 4</th>
                <td className="px-5 py-3 text-[var(--color-fg)]">20.000 monedas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Las 4 piezas */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Las 4 piezas</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {ORO.map((c) => (
            <div key={c.id} className="rounded-3xl border border-[var(--color-sun)]/40 bg-[var(--color-bg-2)] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-sun)]">
                {c.theme}
              </div>
              <h3 className="mt-2 font-display text-xl uppercase">{c.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {c.designDescription}
              </p>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  {c.mintageUnits.toLocaleString('es-ES')} piezas
                </span>
                <span className="font-mono text-sm text-[var(--color-pitch)]">
                  ~{c.marketPriceUsd?.toLocaleString('es-ES')} USD
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué comprar oro */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">Por qué invertir en las monedas de oro</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            <p>
              <strong>1. Valor del oro como respaldo</strong>. Cada moneda
              contiene ½ onza de oro puro. Con la cotización actual del oro
              en ~5.000 USD/onza, el contenido metálico ya cubre ~2.500 USD
              del precio. Es decir, el sobrecoste numismático es mínimo.
            </p>
            <p>
              <strong>2. Tirada ultra-limitada</strong>. Solo 5.000 piezas por
              diseño. Comparado con la plata (100.000 piezas) o las bimetálicas
              (5 millones), la rareza es 1.000 veces mayor. Eso garantiza
              demanda sostenida en el mercado de coleccionistas.
            </p>
            <p>
              <strong>3. Precedente histórico Banxico 1986</strong>. Las
              monedas de oro emitidas para México 86 (40 años atrás) se
              subastan hoy entre <strong>3.000 y 8.000 USD</strong> según
              conservación. La proyección razonable para las del Mundial 2026
              a 5-10 años vista: <strong>5.000-12.000 USD por pieza</strong>.
            </p>
            <p>
              <strong>4. Doble vínculo: Mundial + México anfitrión</strong>.
              México es el único país que habrá organizado tres Mundiales
              (1970, 1986 y 2026). Esa narrativa histórica refuerza el
              atractivo coleccionista de la serie.
            </p>
          </div>
        </div>
      </section>

      {/* Riesgos */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-red-500/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase text-red-500">Riesgos a considerar</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li className="flex gap-2"><span className="text-red-500">−</span><strong>Liquidez limitada</strong>: si quieres vender pronto, los compradores especializados no son muchos. Conviene mantener mínimo 3-5 años.</li>
            <li className="flex gap-2"><span className="text-red-500">−</span><strong>Volatilidad del precio del oro</strong>: el valor de mercado fluctúa con la cotización internacional. Una caída del oro afecta directamente.</li>
            <li className="flex gap-2"><span className="text-red-500">−</span><strong>Falsificaciones</strong>: en mercados de reventa hay copias chinas con baño de oro. Solo comprar a través de Casa de Moneda con certificado.</li>
            <li className="flex gap-2"><span className="text-red-500">−</span><strong>Custodia</strong>: 4 monedas de oro = 10.000 USD físicos. Considera caja de seguridad bancaria o caja fuerte casera.</li>
          </ul>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/donde-comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/plata')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Plata
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/banxico')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Banxico
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

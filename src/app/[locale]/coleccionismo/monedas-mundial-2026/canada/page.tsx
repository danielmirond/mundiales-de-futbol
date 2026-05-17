import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, MapPin } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { COINS_CANADA } from '@/lib/wc-2026-coins';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/monedas-mundial-2026/canada',
    title: 'Moneda Canadá Mundial 2026 · Loonie $1 CAD Royal Canadian Mint',
    description:
      'La moneda oficial canadiense del Mundial 2026: loonie $1 CAD emitido por la Royal Canadian Mint en versión tradicional y coloreada. Tirada de 3 millones (1M tradicional + 2M coloreada). Cómo conseguirla y precios de sets coleccionista.',
    keywords: [
      'moneda canada mundial 2026',
      'loonie mundial 2026',
      'royal canadian mint world cup',
      'dolar canadiense mundial 2026',
      'moneda 1 cad world cup 2026',
      'loonie coloreado world cup',
    ],
    type: 'article',
  });
}

const COIN = COINS_CANADA[0];

export default async function CanadaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Moneda Canadá Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026/canada'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
            { name: 'Canadá', path: '/coleccionismo/monedas-mundial-2026/canada' },
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

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          🇨🇦 Royal Canadian Mint
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          La moneda canadiense del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          La <strong>Royal Canadian Mint (mint.ca)</strong> emitió el 14 de
          mayo de 2026 un loonie conmemorativo del Mundial 2026: dólar
          canadiense oficial de 1 CAD en dos variantes (tradicional sin color
          y coloreada). Tirada total de <strong>3 millones de piezas</strong>:
          1 millón en versión tradicional + 2 millones con color.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Especificaciones</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[500px] text-sm">
            <tbody>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Emisor</th>
                <td className="px-5 py-3">Royal Canadian Mint (mint.ca)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Metal</th>
                <td className="px-5 py-3">Aleación bimetálica (bronce sobre acero) — versión coloreada con esmalte sobre el balón</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Valor facial</th>
                <td className="px-5 py-3 text-[var(--color-pitch)]">$1 CAD</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tirada total</th>
                <td className="px-5 py-3">3.000.000 piezas</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Versión tradicional</th>
                <td className="px-5 py-3">1.000.000 piezas (circulación general en bancos)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Versión coloreada</th>
                <td className="px-5 py-3">2.000.000 piezas (online + tienda física Mint)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Fecha de lanzamiento</th>
                <td className="px-5 py-3">14 de mayo de 2026</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Diseño</th>
                <td className="px-5 py-3">{COIN.designDescription}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Versiones */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Dos versiones, dos audiencias</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              Versión tradicional
            </div>
            <h3 className="mt-2 font-display text-lg uppercase">Loonie sin color</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Diseño grabado en aleación estándar del dólar canadiense. Acabado
              brillante (proof-like). Pensado para circulación general y
              coleccionismo básico. Disponible en cualquier banco canadiense.
            </p>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                1.000.000 piezas
              </span>
              <span className="font-mono text-sm text-[var(--color-pitch)]">$1 CAD</span>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Versión coloreada · ediciones de coleccionista
            </div>
            <h3 className="mt-2 font-display text-lg uppercase">Loonie con color</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Esmalte aplicado sobre el balón estilizado del diseño. Acabado
              especial. Vendido solo a través de la Royal Canadian Mint (online
              + tienda física). Sets de coleccionista con estuche oficial
              cuestan entre 15 y 30 CAD. La pieza más codiciada de la emisión
              canadiense.
            </p>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                2.000.000 piezas
              </span>
              <span className="font-mono text-sm text-[var(--color-pitch)]">
                15-30 CAD (set)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dónde comprarla */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <MapPin className="mr-2 inline h-3 w-3" /> Cómo conseguirla
          </div>
          <h2 className="mt-3 font-display text-xl uppercase">Canales oficiales</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-fg-muted)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-pitch)]">+</span>
              <span><strong>Royal Canadian Mint online (mint.ca)</strong>: la fuente principal para versión coloreada en estuche. Envío internacional disponible a USA, México y Europa. Sets desde 15 CAD.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-pitch)]">+</span>
              <span><strong>Tienda física Mint en Ottawa</strong>: la sede tiene tour visitable y la mayor disponibilidad de las series coloreadas. Ideal si combinas con turismo en Ottawa.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-pitch)]">+</span>
              <span><strong>Bancos canadienses</strong>: BMO, RBC, TD, Scotiabank, CIBC. Distribuyen la versión tradicional en circulación general. Sin coste extra sobre el valor facial $1 CAD.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-pitch)]">+</span>
              <span><strong>Distribuidores autorizados</strong>: numismáticas canadienses certificadas por la Royal Mint. Lista en mint.ca.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/banxico')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Banxico
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/donde-comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/oro')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Oro
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

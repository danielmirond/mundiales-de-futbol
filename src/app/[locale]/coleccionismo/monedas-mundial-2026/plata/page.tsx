import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { COINS_MEXICO } from '@/lib/wc-2026-coins';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const PLATA = COINS_MEXICO.filter((c) => c.metal === 'plata');

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/monedas-mundial-2026/plata',
    title: 'Monedas de plata Mundial 2026 · Banxico edición $10 MXN ley 0.999',
    description:
      'Las 4 monedas de plata fina del Banco de México para el Mundial 2026: ley 0.999, peso 1 onza, valor facial $10 MXN, ~60 USD precio Casa de Moneda. Tirada de 100.000 piezas por diseño (CDMX, Guadalajara, Monterrey, México anfitrión).',
    keywords: [
      'monedas plata mundial 2026',
      'moneda plata fina mundial 2026',
      'plata banxico mundial 2026',
      'moneda plata 10 pesos mundial',
      'plata ley 0.999 mundial 2026',
      'casa moneda mexico plata mundial',
    ],
    type: 'article',
  });
}

export default async function PlataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Monedas de plata Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026/plata'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
            { name: 'Plata', path: '/coleccionismo/monedas-mundial-2026/plata' },
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
          <Sparkles className="mr-2 inline h-3 w-3" /> Plata fina ley 0.999
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Monedas de plata Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las 4 monedas de plata fina del Banco de México son el escalón
          intermedio entre las bimetálicas de circulación general y las
          de oro premium. <strong>Ley 0.999</strong>, peso <strong>1 onza
          troy</strong> (31,1 g), valor facial $10 MXN, valor real de
          mercado <strong>~60 USD</strong> por pieza. Tirada de
          <strong> 100.000 piezas por diseño</strong>: la opción más
          equilibrada para coleccionistas entusiastas.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Especificaciones técnicas</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[500px] text-sm">
            <tbody>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Metal</th>
                <td className="px-5 py-3">Plata fina ley 0.999 (99,9% pureza)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Peso</th>
                <td className="px-5 py-3">1 onza troy (31,1 g)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Diámetro</th>
                <td className="px-5 py-3">40 mm</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Acabado</th>
                <td className="px-5 py-3">Proof (espejo + relieve mate)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Valor facial</th>
                <td className="px-5 py-3 text-[var(--color-pitch)]">$10 MXN</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Precio Casa de Moneda</th>
                <td className="px-5 py-3 text-[var(--color-pitch)]">~60 USD</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tirada por diseño</th>
                <td className="px-5 py-3">100.000 piezas</td>
              </tr>
              <tr>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tirada total set 4</th>
                <td className="px-5 py-3">400.000 monedas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Las 4 piezas */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Las 4 piezas</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {PLATA.map((c) => (
            <div key={c.id} className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
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
                  ~{c.marketPriceUsd} USD
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué plata */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">Por qué empezar por la plata</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            <p>
              <strong>1. Precio accesible</strong>. A 60 USD por moneda, las 4
              piezas de plata cuestan menos de 250 USD. Para entrar al
              coleccionismo numismático del Mundial 2026 con metal precioso
              real, es la opción más barata.
            </p>
            <p>
              <strong>2. Acabado proof excepcional</strong>. La Casa de Moneda
              de México es reconocida internacionalmente por la calidad de su
              acabado proof. El relieve mate sobre fondo espejo en estas
              monedas es de los mejores del mundo.
            </p>
            <p>
              <strong>3. Revalorización razonable</strong>. Las monedas de
              plata del Mundial México 1986 hoy se cotizan entre 80 y 300 USD,
              entre 1,3x y 5x el precio original. Las del Mundial 2026
              previsiblemente seguirán patrón similar.
            </p>
            <p>
              <strong>4. Tirada limitada pero asequible</strong>. 100.000
              piezas por diseño es suficiente para garantizar acceso a la
              compra pero limitado para mantener interés coleccionista.
            </p>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/oro')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Oro
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/donde-comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
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

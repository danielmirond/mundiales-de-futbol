import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Building2 } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { COINS_MEXICO, type CoinEdition } from '@/lib/wc-2026-coins';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/monedas-mundial-2026/banxico',
    title: 'Monedas Banxico Mundial 2026 · Las 12 piezas oficiales del Banco de México',
    description:
      'Las 12 monedas conmemorativas del Banco de México para el Mundial 2026 acuñadas por la Casa de Moneda de México: 4 bimetálicas $20 MXN, 4 de plata fina $10 MXN y 4 de oro fino $25 MXN. Detalle por diseño, sede, especificación técnica y dónde comprarlas.',
    keywords: [
      'monedas banxico mundial 2026',
      'banco de mexico monedas mundial',
      'casa de moneda mexico mundial 2026',
      '12 monedas mundial 2026',
      'monedas conmemorativas banxico 2026',
      'banxico edicion mundial fifa',
    ],
    type: 'article',
  });
}

function Card({ c, accent }: { c: CoinEdition; accent: 'pitch' | 'sun' | 'fg-subtle' }) {
  const accentClass =
    accent === 'sun'
      ? 'border-[var(--color-sun)]/40 text-[var(--color-sun)]'
      : accent === 'pitch'
      ? 'border-[var(--color-pitch)]/40 text-[var(--color-pitch)]'
      : 'border-[var(--color-border)] text-[var(--color-fg-subtle)]';
  return (
    <div className={`rounded-2xl border bg-[var(--color-bg-2)] p-5 ${accentClass}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em]">{c.theme}</div>
      <h4 className="mt-1 font-display text-base uppercase text-[var(--color-fg)]">{c.name}</h4>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono text-sm text-[var(--color-pitch)]">${c.faceValue} {c.currency}</span>
        {c.marketPriceUsd && (
          <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
            ~{c.marketPriceUsd.toLocaleString('es-ES')} USD mercado
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{c.designDescription}</p>
      <div className="mt-3 font-mono text-[10px] text-[var(--color-fg-subtle)]">
        {c.mintageUnits.toLocaleString('es-ES')} piezas
      </div>
    </div>
  );
}

export default async function BanxicoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const bimet = COINS_MEXICO.filter((c) => c.metal === 'bimetalica');
  const plata = COINS_MEXICO.filter((c) => c.metal === 'plata');
  const oro = COINS_MEXICO.filter((c) => c.metal === 'oro');

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Monedas Banxico Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026/banxico'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
            { name: 'Banxico', path: '/coleccionismo/monedas-mundial-2026/banxico' },
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
          <Building2 className="mr-2 inline h-3 w-3" /> Banco de México · Casa de Moneda
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Las 12 monedas Banxico del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          El <strong>Banco de México (Banxico)</strong> acuñó a través de la
          <strong> Casa de Moneda de México (cmm.gob.mx)</strong> una colección
          de 12 piezas para celebrar el Mundial 2026. Es la mayor emisión
          numismática mexicana en un evento deportivo desde el Mundial México
          1986. Tres bloques de cuatro piezas cada uno (bimetálicas, plata y
          oro), todas siguiendo la misma arquitectura temática: las 3 sedes
          mexicanas + el país anfitrión.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">
          Bimetálicas · cuño corriente $20 MXN
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          La versión de circulación general. Núcleo cuproniquel + anillo
          aluminio bronce. 5 millones de piezas por diseño. Disponibles en
          sucursales bancarias mexicanas a partir del 18 de mayo.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {bimet.map((c) => (
            <Card key={c.id} c={c} accent="fg-subtle" />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">
          Plata fina · proof $10 MXN
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Plata ley 0.999, 1 onza troy, acabado proof. 100.000 piezas por
          diseño. ~60 USD precio Casa de Moneda. Más detalle en{' '}
          <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/plata')} className="underline">
            la página de plata
          </Link>.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {plata.map((c) => (
            <Card key={c.id} c={c} accent="pitch" />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">
          Oro fino · proof $25 MXN
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Oro ley 0.999, ½ onza troy, acabado proof. <strong>Solo 5.000
          piezas por diseño</strong>. ~2.500 USD precio Casa de Moneda. Más
          detalle en{' '}
          <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/oro')} className="underline">
            la página de oro
          </Link>.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {oro.map((c) => (
            <Card key={c.id} c={c} accent="sun" />
          ))}
        </div>
      </section>

      {/* Comparativa con 1986 */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">El precedente: Banxico México 1986</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Banxico ya emitió una serie similar para el Mundial México 1986,
            considerada una de las colecciones numismáticas más bellas del
            siglo XX por la simbiosis entre cultura prehispánica y deporte
            moderno. Las monedas de oro de aquella serie (acuñadas hace 40
            años) se subastan hoy entre <strong>3.000 y 8.000 USD</strong>{' '}
            según conservación. Las de plata, entre 80 y 300 USD. El
            patrón está claro: las emisiones Banxico para Mundiales
            revalorizan con consistencia.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            La gran diferencia: en 1986 México era el único anfitrión. En
            2026 lo comparte con USA y Canadá, lo que añade narrativa
            histórica (México es el primer país que organiza tres
            Mundiales: 1970, 1986 y 2026) y refuerza el atractivo
            coleccionista de la nueva serie.
          </p>
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
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/oro')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Oro
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/plata')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Plata
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/canada')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Canadá
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

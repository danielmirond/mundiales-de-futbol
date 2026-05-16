import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Coins, ShieldCheck, Banknote, ShoppingBag, Crown, Sparkles, Building2 } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { COINS_MEXICO, COINS_CANADA, ALL_COINS, CLUSTER_PAGES, type CoinEdition } from '@/lib/wc-2026-coins';

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
    path: '/coleccionismo/monedas-mundial-2026',
    title: 'Monedas conmemorativas Mundial 2026 · Banxico (México) y Royal Canadian Mint',
    description:
      'Las 13 monedas oficiales del Mundial 2026: 12 piezas emitidas por Banxico (4 bimetálicas $20 MXN, 4 plata $10, 4 oro $25) + 1 dólar canadiense de la Royal Canadian Mint. Diseño, denominación, tirada y dónde comprarlas.',
    keywords: [
      'monedas conmemorativas mundial 2026',
      'monedas del mundial 2026',
      'monedas banxico mundial 2026',
      'monedas plata mundial 2026',
      'monedas oro mundial 2026',
      'donde comprar monedas mundial 2026',
      'casa de moneda mexico mundial',
      'royal canadian mint world cup 2026',
    ],
    type: 'article',
  });
}

const META = [
  { label: 'México · Banxico', value: '12 piezas', detail: '4 bimetálicas $20 + 4 plata $10 + 4 oro $25' },
  { label: 'Canadá · Royal Mint', value: '1 dólar', detail: '3 millones (1M tradicional + 2M coloreada)' },
  { label: 'USA · US Mint', value: 'Pendiente', detail: 'Sin anuncio oficial a 16 may 2026' },
];

function CoinCard({ coin }: { coin: CoinEdition }) {
  const isRare = coin.metal === 'oro' || coin.metal === 'plata';
  return (
    <div
      className={`rounded-2xl border bg-[var(--color-bg-2)] p-5 ${
        isRare ? 'border-[var(--color-pitch)]/40' : 'border-[var(--color-border)]'
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {coin.metal}
          </div>
          <h3 className="mt-1 font-display text-base uppercase leading-tight">{coin.name}</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-[var(--color-pitch)]">
            ${coin.faceValue} {coin.currency}
          </div>
          {coin.marketPriceUsd && (
            <div className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
              ~{coin.marketPriceUsd.toLocaleString('es-ES')} USD mercado
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{coin.designDescription}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        <span>{coin.mintageUnits.toLocaleString('es-ES')} piezas</span>
        <span>·</span>
        <span>{coin.theme}</span>
      </div>
    </div>
  );
}

export default async function MonedasPillar({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Monedas conmemorativas Mundial 2026',
    url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026'),
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: ALL_COINS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
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
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Coins className="mr-2 inline h-3 w-3" /> Numismática oficial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-6xl">
          Monedas conmemorativas Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las 13 monedas oficiales emitidas por bancos centrales de los países
          anfitriones para celebrar el Mundial 2026. <strong>México (Banxico)</strong>
          lanzó el 13 de mayo una colección de 12 piezas (bimetálicas, plata
          fina y oro). <strong>Canadá (Royal Canadian Mint)</strong> emite un
          loonie conmemorativo desde el 14 de mayo. <strong>Estados Unidos (US Mint)</strong>
          aún no ha confirmado emisión propia.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          <ShieldCheck className="h-3 w-3" /> Solo bancos centrales y casas de moneda oficiales · Sin reventa de imitación
        </div>
      </header>

      {/* Resumen visual */}
      <section className="mx-auto mt-10 w-full max-w-[1100px] px-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {META.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {m.label}
              </div>
              <div className="mt-1 font-display text-2xl">{m.value}</div>
              <div className="mt-1 text-sm text-[var(--color-fg-muted)]">{m.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-páginas del cluster */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Explora el cluster</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {CLUSTER_PAGES.filter((p) => p.slug !== '').map((p) => {
            const icons: Record<string, typeof ShoppingBag> = {
              'donde-comprar': ShoppingBag,
              precio: Banknote,
              oro: Crown,
              plata: Sparkles,
              banxico: Building2,
              canada: Coins,
            };
            const Icon = icons[p.slug] ?? Coins;
            return (
              <Link
                key={p.slug}
                href={withLocale(locale as Locale, p.path)}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
              >
                <Icon className="h-5 w-5 text-[var(--color-pitch)]" />
                <div className="mt-3 font-display text-base uppercase">{p.title}</div>
                <div className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)] group-hover:text-[var(--color-pitch)]">
                  Ver detalle <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* México */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">🇲🇽 México · Banxico</h2>
        <p className="mt-2 text-base leading-relaxed text-[var(--color-fg-muted)]">
          Banxico puso en circulación 12 monedas conmemorativas el 13 de mayo
          de 2026: cuatro bimetálicas de cuño corriente con valor nominal de
          <strong> $20 MXN</strong>, cuatro de plata fina ley 0.999 con valor
          de <strong>$10 MXN</strong> y cuatro de oro ley 0.999 con valor de
          <strong> $25 MXN</strong>. Cada conjunto incluye 3 monedas dedicadas
          a las ciudades sede (CDMX, Guadalajara, Monterrey) y 1 diseño general
          de México como país anfitrión.
        </p>

        {/* Bimetálicas */}
        <h3 className="mt-8 font-display text-xl uppercase">Bimetálicas · cuño corriente $20 MXN</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {COINS_MEXICO.filter((c) => c.metal === 'bimetalica').map((c) => (
            <CoinCard key={c.id} coin={c} />
          ))}
        </div>

        {/* Plata */}
        <h3 className="mt-10 font-display text-xl uppercase">Plata fina · proof $10 MXN (edición limitada)</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {COINS_MEXICO.filter((c) => c.metal === 'plata').map((c) => (
            <CoinCard key={c.id} coin={c} />
          ))}
        </div>

        {/* Oro */}
        <h3 className="mt-10 font-display text-xl uppercase">Oro fino · proof $25 MXN (5.000 piezas)</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {COINS_MEXICO.filter((c) => c.metal === 'oro').map((c) => (
            <CoinCard key={c.id} coin={c} />
          ))}
        </div>
      </section>

      {/* Canadá */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">🇨🇦 Canadá · Royal Canadian Mint</h2>
        <p className="mt-2 text-base leading-relaxed text-[var(--color-fg-muted)]">
          La Royal Canadian Mint emitió el 14 de mayo un loonie conmemorativo
          del Mundial 2026. La tirada total es de <strong>3 millones de piezas</strong>:
          1 millón en versión tradicional sin color y 2 millones con color (acabado
          tipo "popout").
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {COINS_CANADA.map((c) => (
            <CoinCard key={c.id} coin={c} />
          ))}
        </div>
      </section>

      {/* USA */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">🇺🇸 Estados Unidos · US Mint</h2>
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
            La US Mint no ha confirmado a fecha de 16 de mayo de 2026 una
            emisión oficial de moneda conmemorativa del Mundial 2026.
            Estados Unidos sí ha aprobado en el pasado monedas de eventos
            similares (Coin Act 2024 para Soccer Olympics LA28), pero la
            del Mundial 2026 no aparece en la agenda anunciada de la
            US Mint. Actualizaremos esta página si se confirma.
          </p>
        </div>
      </section>

      {/* Dónde comprar */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Banknote className="mr-2 inline h-3 w-3" /> Dónde comprarlas
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase">Compra oficial</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-display text-base uppercase">México</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--color-fg-muted)]">
                <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Las <strong>bimetálicas $20</strong> estarán en el sistema bancario tres días hábiles después de la circulación (16-19 mayo).</li>
                <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Las de <strong>plata $10</strong> y <strong>oro $25</strong> a partir de la segunda quincena de mayo en la <strong>Casa de Moneda de México</strong> y el <strong>Museo Interactivo de Economía (MIDE)</strong>.</li>
                <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Distribuidores autorizados Banxico: ver lista oficial en banxico.org.mx</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">Canadá</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--color-fg-muted)]">
                <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Las <strong>monedas $1 CAD</strong> en circulación a partir del 14 de mayo a través de bancos canadienses.</li>
                <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Versiones especiales (sets de coleccionista, presentadas en estuches) en la <strong>tienda online de la Royal Canadian Mint</strong> (mint.ca) y distribuidores autorizados.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Más coleccionismo Mundial 2026</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Panini cromos
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Camisetas oficiales
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/lego-mundial-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              LEGO sets
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/hospitality')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Hospitality
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

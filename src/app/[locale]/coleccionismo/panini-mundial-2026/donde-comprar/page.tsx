import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { AmazonProductGrid } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

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
    path: '/coleccionismo/panini-mundial-2026/donde-comprar',
    title: 'Dónde comprar el álbum Panini Mundial 2026: España, USA, México y LATAM',
    description:
      'Guía oficial de tiendas físicas y online donde comprar el álbum Panini Mundial 2026 en España, Estados Unidos, México, Argentina, Reino Unido y resto de LATAM. Walmart, Target, Panini.es, Amazon y kioscos.',
    keywords: [
      'dónde comprar álbum panini mundial 2026',
      'donde comprar el album del mundial 2026 en estados unidos',
      'álbum panini mundial 2026 walmart',
      'álbum panini mundial 2026 target',
      'panini mundial 2026 amazon',
      'álbum panini mundial 2026 carrefour',
      'panini.es comprar',
    ],
    type: 'article',
  });
}

const STORES_BY_COUNTRY = [
  {
    country: 'España',
    flag: '🇪🇸',
    guide: '/coleccionismo/panini-mundial-2026/donde-comprar/espana',
    online: [
      { name: 'Panini.es', url: 'https://www.panini.es/shp_esp_es/fifa-world-cup-2026-official-sticker-collection-lbum-colecci-n-oficial-panini-005460aew-es01.html', note: 'Tienda oficial Panini · envío gratis península desde 20 €' },
      { name: 'Amazon España', url: 'https://www.amazon.es/s?k=panini+mundial+2026+album', note: 'Envío Prime 24-48 h · ASIN B0GWW5LTGR' },
      { name: 'El Corte Inglés', url: 'https://www.elcorteingles.es', note: 'Tapa blanda + tapa dura coleccionista' },
      { name: 'FNAC', url: 'https://www.fnac.es', note: 'Sobres por unidad y caja completa' },
    ],
    offline: [
      'Kioscos y prensa de toda España',
      'Carrefour (sobres en zona caja)',
      'Toys "R" Us / Juguettos',
      'Casa del Libro',
      'Librerías independientes',
    ],
  },
  {
    country: 'Estados Unidos',
    flag: '🇺🇸',
    guide: '/coleccionismo/panini-mundial-2026/donde-comprar/usa',
    online: [
      { name: 'Panini America', url: 'https://store.paniniamerica.net', note: 'Tienda oficial USA, álbumes y starter packs' },
      { name: 'Amazon US', url: 'https://www.amazon.com/s?k=panini+world+cup+2026+sticker', note: 'Disponible con Prime' },
      { name: 'Target.com', url: 'https://www.target.com', note: 'Disponibilidad en tienda física variable' },
      { name: 'Walmart.com', url: 'https://www.walmart.com', note: 'Pickup en tienda + envío 2 días' },
    ],
    offline: [
      'Target (zona toys + sports collectibles)',
      'Walmart (zona kids + entertainment)',
      'Hobby Lobby',
      'Hobby Lobby Sports',
      'GameStop (algunas localizaciones)',
      '7-Eleven (sobres sueltos)',
    ],
  },
  {
    country: 'México',
    flag: '🇲🇽',
    guide: '/coleccionismo/panini-mundial-2026/donde-comprar/mexico',
    online: [
      { name: 'Mercado Libre MX', url: 'https://listado.mercadolibre.com.mx/panini-mundial-2026', note: 'Vendedores oficiales y particulares' },
      { name: 'Amazon México', url: 'https://www.amazon.com.mx/s?k=panini+mundial+2026', note: 'Envío Prime' },
      { name: 'Liverpool', url: 'https://www.liverpool.com.mx', note: 'En catálogo desde mayo 2026' },
    ],
    offline: [
      'Sanborns (kioscos en cafetería + librería)',
      'Walmart México',
      'Soriana',
      'Bodega Aurrerá',
      'Liverpool',
      'Sumesa',
      'OXXO (sobres sueltos)',
    ],
  },
  {
    country: 'Argentina',
    flag: '🇦🇷',
    online: [
      { name: 'Mercado Libre AR', url: 'https://listado.mercadolibre.com.ar/panini-mundial-2026', note: 'Principal canal online' },
      { name: 'Tienda Mosca (oficial)', url: 'https://www.tiendamosca.com.ar', note: 'Distribuidor oficial Argentina' },
    ],
    offline: [
      'Kioscos y librerías de toda Argentina',
      'Coto',
      'Carrefour Argentina',
      'Disco / Jumbo',
      'Musimundo',
      'Garbarino (algunas sucursales)',
    ],
  },
  {
    country: 'Reino Unido',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    online: [
      { name: 'Panini UK', url: 'https://store.panini.co.uk', note: 'Tienda oficial' },
      { name: 'Amazon UK', url: 'https://www.amazon.co.uk/s?k=panini+world+cup+2026', note: 'Prime' },
      { name: 'WHSmith', url: 'https://www.whsmith.co.uk', note: 'Online + tiendas estación' },
    ],
    offline: [
      'WHSmith',
      'Tesco',
      'Sainsbury\'s',
      'Asda',
      'Smyths Toys',
      'Newsagents (kioscos)',
    ],
  },
  {
    country: 'Colombia',
    flag: '🇨🇴',
    online: [
      { name: 'Mercado Libre CO', url: 'https://listado.mercadolibre.com.co/panini-mundial-2026', note: 'Vendedores oficiales' },
      { name: 'Rappi', url: 'https://www.rappi.com.co', note: 'Express en kioscos asociados' },
    ],
    offline: [
      'Éxito',
      'Carulla',
      'Olímpica',
      'Falabella',
      'Pricesmart',
      'Librerías Panamericana',
    ],
  },
  {
    country: 'Ecuador',
    flag: '🇪🇨',
    online: [
      { name: 'albumesycromos.com.ec', url: 'https://albumesycromos.com.ec', note: 'Tienda especializada' },
      { name: 'Mercado Libre EC', url: 'https://listado.mercadolibre.com.ec/panini-mundial-2026', note: 'Versiones tapa blanda, dura y oro' },
    ],
    offline: [
      'Supermaxi',
      'Mi Comisariato',
      'AKI',
      'Pycca',
      'Tía',
      'Fybeca',
      'Juguetón',
      'Coral',
    ],
  },
];

export default async function DondeComprarPanini({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const albumProducts = AMAZON_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes('panini'),
  );

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dónde comprar el álbum Panini Mundial 2026 en cada país',
    description:
      'Guía completa de tiendas físicas y online donde comprar el álbum Panini Mundial 2026 en 7 países: España, USA, México, Argentina, Reino Unido, Colombia y Ecuador.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    dateModified: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/donde-comprar'),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Dónde comprar', path: '/coleccionismo/panini-mundial-2026/donde-comprar' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingBag className="h-4 w-4" />
          <span>Tiendas oficiales · 7 países</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Dónde comprar el<br />Panini 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Guía actualizada de tiendas online y físicas donde encontrar el
          álbum, sobres y caja completa del Panini Mundial 2026 en España,
          Estados Unidos, México, Argentina, Reino Unido, Colombia y Ecuador.
        </p>
      </header>

      <div className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10 space-y-10">
        {STORES_BY_COUNTRY.map((country) => (
          <section
            key={country.country}
            id={country.country.toLowerCase()}
            className="scroll-mt-32 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-10"
          >
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              <span aria-hidden className="mr-3 text-3xl">{country.flag}</span>
              {country.country}
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  Online
                </div>
                <ul className="mt-4 space-y-3">
                  {country.online.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-baseline gap-2 text-base font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                      >
                        {s.name}
                        <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </a>
                      <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                        {s.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  Tiendas físicas
                </div>
                <ul className="mt-4 space-y-2">
                  {country.offline.map((s) => (
                    <li key={s} className="text-base text-[var(--color-fg-muted)]">
                      <span className="mr-2 text-[var(--color-fg-subtle)]">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {'guide' in country && country.guide && (
              <Link
                href={withLocale(locale as Locale, country.guide)}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Guía detallada de {country.country} con precios
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
            )}
          </section>
        ))}
      </div>

      {albumProducts.length > 0 && (
        <AmazonProductGrid
          products={albumProducts}
          title="Atajo: cómpralo en Amazon"
          subtitle="Si vives en España, el álbum está disponible en Amazon con envío Prime."
        />
      )}

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Más sobre el álbum</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Precio por país</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cuando-sale')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Cuándo sale</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/coca-cola')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Promo Coca-Cola</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

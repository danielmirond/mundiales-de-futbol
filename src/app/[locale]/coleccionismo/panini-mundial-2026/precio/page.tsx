import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Tag } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/precio',
    title:
      'Álbum Panini Mundial 2026 precio: cuánto cuesta en España, USA y México',
    description:
      'Precio oficial del álbum Panini Mundial 2026 por país: España (5 €), Estados Unidos ($4-6), México (~80 MXN), Argentina, Reino Unido y Ecuador. Precio del sobre, caja y edición tapa dura.',
    keywords: [
      'álbum panini mundial 2026 precio',
      'precio álbum panini mundial 2026 en dolares',
      'cuánto cuesta el álbum panini mundial 2026',
      'precio sobre panini mundial 2026',
      'precio caja panini mundial 2026',
      'álbum panini mundial 2026 precio tapa dura',
    ],
    type: 'article',
  });
}

const PRICES_BY_COUNTRY = [
  {
    country: 'España',
    flag: '🇪🇸',
    album: '5 €',
    pack: '~1 €',
    box: '80 € (50 sobres + álbum)',
    hardcover: '~15 €',
    completion: '800-1.200 €',
    where: 'Panini.es, Amazon.es, El Corte Inglés, FNAC, kioscos',
  },
  {
    country: 'Estados Unidos',
    flag: '🇺🇸',
    album: '$4,99',
    pack: '$0,99 - $1,29',
    box: '$49,99 (50 sobres)',
    hardcover: '$19,99',
    completion: '$900-1.300',
    where: 'Target, Walmart, Hobby Lobby, Amazon US, Panini America',
  },
  {
    country: 'México',
    flag: '🇲🇽',
    album: '~80 MXN',
    pack: '~25 MXN',
    box: '~1.250 MXN',
    hardcover: '~250 MXN',
    completion: '15.000-22.000 MXN',
    where: 'Sanborns, Walmart, Soriana, Liverpool, kioscos',
  },
  {
    country: 'Argentina',
    flag: '🇦🇷',
    album: '~3.500 ARS',
    pack: '~1.000 ARS',
    box: '~50.000 ARS',
    hardcover: '~12.000 ARS',
    completion: '600.000-900.000 ARS',
    where: 'Kioscos, librerías, supermercados, Mercado Libre',
  },
  {
    country: 'Reino Unido',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    album: '£3,99',
    pack: '£0,90',
    box: '£45',
    hardcover: '£14,99',
    completion: '£800-1.000',
    where: 'WHSmith, Tesco, Sainsbury\'s, Amazon UK',
  },
  {
    country: 'Ecuador',
    flag: '🇪🇨',
    album: '$3,50 / $15 / $30',
    pack: '$1,20',
    box: '$124,80 (104 sobres)',
    hardcover: '$15 (premium) / $30 (oro)',
    completion: '$140-200',
    where: 'Supermaxi, Fybeca, Mi Comisariato, Mercado Libre',
  },
  {
    country: 'Colombia',
    flag: '🇨🇴',
    album: '~12.000 COP',
    pack: '~4.000 COP',
    box: '~200.000 COP',
    hardcover: '~50.000 COP',
    completion: '2.500.000-4.000.000 COP',
    where: 'Éxito, Carulla, Olímpica, Falabella, Rappi',
  },
];

export default async function PrecioPanini2026({
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
    headline: 'Álbum Panini Mundial 2026 precio: cuánto cuesta en cada país',
    description:
      'Tabla comparativa de precios del álbum Panini Mundial 2026 en 7 países. Precio del álbum, sobres, caja y tapa dura, además del coste estimado para completar la colección.',
    author: { '@type': 'Organization', name: SEO.siteName },
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    dateModified: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/precio'),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Precio', path: '/coleccionismo/panini-mundial-2026/precio' },
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
          <Tag className="h-4 w-4" />
          <span>Precio · 7 países</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Cuánto cuesta el<br />álbum Panini 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Precio oficial del álbum, sobres, caja y edición tapa dura del Panini
          Mundial 2026 en España, Estados Unidos, México, Argentina, Reino
          Unido, Ecuador y Colombia. Estimación de coste para completar la
          colección entera (980 cromos) en cada mercado.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">País</th>
                <th className="px-4 py-4">Álbum</th>
                <th className="px-4 py-4">Sobre</th>
                <th className="px-4 py-4 hidden md:table-cell">Caja</th>
                <th className="px-4 py-4 hidden lg:table-cell">Tapa dura</th>
                <th className="px-4 py-4 hidden xl:table-cell">Completar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {PRICES_BY_COUNTRY.map((p) => (
                <tr key={p.country} className="hover:bg-[var(--color-bg-2)]/40">
                  <td className="px-4 py-3 font-mono text-[var(--color-fg)]">
                    <span className="mr-2" aria-hidden>{p.flag}</span>
                    {p.country}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{p.album}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{p.pack}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)] hidden md:table-cell">{p.box}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)] hidden lg:table-cell">{p.hardcover}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)] hidden xl:table-cell">{p.completion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Precios verificados a 2 mayo 2026. Las cifras de «Completar» asumen
          coleccionar sin intercambios; con grupos de Telegram y Wallapop el
          coste suele bajar entre un 30 % y un 50 %.
        </p>
      </section>

      {albumProducts.length > 0 && (
        <AmazonProductGrid
          products={albumProducts}
          title="Comprar el álbum oficial"
          subtitle="Disponible en Amazon España con envío Prime."
        />
      )}

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Profundiza en el coleccionismo</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Dónde comprar <ArrowRight className="inline h-3 w-3" /></Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Cromos más caros</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/tapa-dura')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Edición tapa dura</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

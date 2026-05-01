import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, BookMarked } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

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
    path: '/coleccionismo/panini-mundial-2026/tapa-dura',
    title:
      'Álbum Panini Mundial 2026 tapa dura: edición coleccionista, lujo y oro',
    description:
      'Edición tapa dura del álbum Panini Mundial 2026: precio, tirada limitada, edición de lujo numerada y versión "oro". Comparativa con la tapa blanda y guía para coleccionistas serios.',
    keywords: [
      'álbum panini mundial 2026 tapa dura',
      'panini mundial 2026 hardcover',
      'edición coleccionista panini 2026',
      'panini lujo tapa dura mundial',
      'panini mundial 2026 oro',
    ],
    type: 'article',
  });
}

const EDITIONS = [
  {
    name: 'Tapa blanda (estándar)',
    price: '5 € / $4,99 / £3,99',
    units: 'Sin límite',
    quality: 'Cubierta de cartón flexible · Encuadernado grapado · Páginas papel 90 gr',
    target: 'El gran público. La que se vende en kioscos.',
  },
  {
    name: 'Tapa dura premium',
    price: '~15 € / $19,99 / £14,99',
    units: 'Tirada amplia',
    quality: 'Cartoné rígido · Encuadernado cosido · Páginas papel 110 gr',
    target: 'Coleccionista que quiere durabilidad. Aguanta abrir y cerrar mil veces sin desmoronarse.',
  },
  {
    name: 'Tapa dura oro / lujo',
    price: '~30 € / $39 / 50 € España',
    units: '1.500 unidades numeradas (España)',
    quality: 'Cartoné con detalles oro · Encuadernado cosido lujo · Caja rígida de presentación',
    target: 'Coleccionista premium. Pieza para vitrina, no para llenar.',
  },
  {
    name: 'Edición «Top Class» XXL',
    price: '60-80 €',
    units: 'Tirada limitada por país',
    quality: 'Formato XXL (40×30 cm aprox) · Cartoné rígido · Para cromos en gran formato',
    target: 'Coleccionista hardcore que quiere la edición más exclusiva.',
  },
];

export default async function TapaDura({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Álbum Panini Mundial 2026 tapa dura: ediciones, precios y tirada',
    description: 'Comparativa de las 4 ediciones del Panini Mundial 2026: tapa blanda, tapa dura premium, oro/lujo y Top Class XXL.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/tapa-dura'),
  };

  return (
    <article className="pt-32">
      <JsonLd data={[articleLd, breadcrumbLd(locale, [
        { name: 'Inicio', path: '/' },
        { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
        { name: 'Tapa dura', path: '/coleccionismo/panini-mundial-2026/tapa-dura' },
      ])]} />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <BookMarked className="h-4 w-4" /><span>Ediciones especiales</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">Tapa dura,<br />lujo y oro</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Más allá de la tapa blanda popular, Panini ofrece tres ediciones premium del álbum Mundial 2026: tapa dura estándar, tapa dura oro/lujo numerada y la XXL «Top Class». Aquí las cuatro versiones, precios y tirada.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10 space-y-6">
        {EDITIONS.map((e, i) => (
          <article key={e.name} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl uppercase md:text-3xl">{e.name}</h2>
              <span className="font-mono text-sm text-[var(--color-pitch)]">{e.price}</span>
            </div>
            <dl className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Tirada</dt>
                <dd className="mt-1 text-sm text-[var(--color-fg)]">{e.units}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Acabado</dt>
                <dd className="mt-1 text-sm text-[var(--color-fg)]">{e.quality}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-[var(--color-fg-muted)]">
              <strong className="text-[var(--color-fg)]">Para quién:</strong> {e.target}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">¿Cuál te conviene?</h2>
          <p className="mt-4 text-sm text-[var(--color-fg-muted)] md:text-base">
            Si vas a llenar el álbum entero, la <strong className="text-[var(--color-fg)]">tapa dura premium</strong> es la apuesta razonable: solo paga 10-15 € extra y aguanta 30 años en la estantería sin que se rompan las páginas. La oro/lujo es para mostrar (vitrina, regalo) más que para llenar. La Top Class XXL es nicho hardcore.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Dónde comprar</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Precio por país</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

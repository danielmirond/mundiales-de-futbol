import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/donde-comprar/espana',
    title: 'Dónde comprar el álbum del Mundial 2026 en España: Carrefour, El Corte Inglés, kioscos y Panini.es',
    description:
      'Guía para comprar el álbum Panini Mundial 2026 en España: Carrefour, El Corte Inglés, FNAC, Alcampo, kioscos, Amazon.es y Panini.es. Precio del álbum (5 €), del sobre (~1 €), de la caja y de la edición tapa dura, con el sitio más barato para cada formato.',
    keywords: [
      'donde comprar album mundial 2026 españa',
      'album mundial 2026 carrefour',
      'album mundial 2026 el corte ingles',
      'precio album mundial 2026 españa',
      'cuanto cuesta el album del mundial 2026 en españa',
      'sobres mundial 2026 españa',
      'album mundial 2026 tapa dura españa',
      'panini mundial 2026 españa',
    ],
    type: 'article',
  });
}

const RETAILERS = [
  {
    nombre: 'Carrefour',
    formato: 'Caja 50 sobres + álbum · sobres sueltos · tapa blanda y dura',
    precio: '~80 € caja · ~1 €/sobre · 5 € álbum',
    notas:
      'El canal más versátil en España: vende la caja completa, sobres sueltos y los dos formatos de álbum, sin tarjeta de socio. Es el retailer más buscado para el álbum y suele lanzar promociones de sobres en las primeras semanas.',
    pros: ['Todos los formatos', 'Sin membresía', 'Cobertura nacional y online'],
    cons: ['Stock irregular de la caja en algunas tiendas'],
  },
  {
    nombre: 'El Corte Inglés',
    formato: 'Álbum tapa dura premium · sobres sueltos',
    precio: '~15 € tapa dura · ~1 €/sobre',
    notas:
      'La opción de referencia para la edición de tapa dura, con stock más estable que kioscos cuando el resto se queda sin existencias. Disponible en tienda y en elcorteingles.es.',
    pros: ['Tapa dura estable', 'Compra online y recogida en tienda'],
    cons: ['No siempre tiene caja completa'],
  },
  {
    nombre: 'Kioscos y prensa',
    formato: 'Sobres sueltos · álbum tapa blanda',
    precio: '~1 €/sobre · 5 € álbum',
    notas:
      'El canal clásico del coleccionismo en España y el primero en tener producto el día de lanzamiento. Imbatible para comprar sobres sueltos del tirón e ir completando, aunque no suelen vender la caja.',
    pros: ['Disponibilidad inmediata', 'Ideal para sobres sueltos', 'En cada barrio'],
    cons: ['Sin caja completa', 'Más caro por cromo a largo plazo'],
  },
  {
    nombre: 'FNAC',
    formato: 'Álbum tapa dura · sobres sueltos',
    precio: '~15 € tapa dura · ~1 €/sobre',
    notas:
      'Alternativa a El Corte Inglés para la tapa dura, con buena disponibilidad online en fnac.es. Suele mantener stock de álbumes cuando los kioscos agotan.',
    pros: ['Tapa dura y sobres', 'Web fiable'],
    cons: ['No vende la caja de 50'],
  },
  {
    nombre: 'Alcampo / hipermercados',
    formato: 'Caja, sobres sueltos y álbum',
    precio: '~80 € caja · ~1 €/sobre · 5 € álbum',
    notas:
      'Como Carrefour, los grandes hipermercados (Alcampo, Eroski) venden caja, sobres y álbum sin membresía. Buena opción para hacer acopio de sobres en una sola compra.',
    pros: ['Caja y sobres juntos', 'Sin membresía'],
    cons: ['No es el más barato por cromo'],
  },
  {
    nombre: 'Amazon España',
    formato: 'Caja completa, álbum y packs de sobres',
    precio: 'Precio variable · envío Prime',
    notas:
      'La vía más cómoda para comprar la caja de 50 sobres online y recibirla en 24-48 h con Prime. Compara siempre el precio por sobre, porque fluctúa con la demanda.',
    pros: ['Caja completa a domicilio', 'Envío rápido Prime'],
    cons: ['Precio variable según demanda', 'Cuidado con vendedores terceros'],
  },
  {
    nombre: 'Panini.es (oficial)',
    formato: 'Todos los formatos · ediciones especiales (oro, tapa dura)',
    precio: 'Precio oficial directo · envío',
    notas:
      'La tienda oficial de Panini en España vende álbum, caja, bricks y las ediciones especiales (oro coleccionista, tapa dura de lujo) que a veces solo están aquí. Ideal para pre-órdenes y para verificar que el producto es original.',
    pros: ['Ediciones limitadas', 'Producto 100 % oficial', 'Pre-órdenes'],
    cons: ['Coste de envío', 'Plazos de entrega más largos'],
  },
];

const FAQ = [
  {
    q: '¿Dónde se compra el álbum del Mundial 2026 en España?',
    a: 'En España el álbum Panini Mundial 2026 se vende en Carrefour, Alcampo y otros hipermercados, en El Corte Inglés y FNAC (sobre todo la tapa dura), en kioscos y papelerías (sobres sueltos), en Amazon.es (caja completa con Prime) y en la tienda oficial Panini.es. Carrefour es la opción más completa porque tiene caja, sobres y álbum sin necesidad de tarjeta de socio.',
  },
  {
    q: '¿Cuánto cuesta el álbum del Mundial 2026 en España?',
    a: 'El álbum de tapa blanda cuesta alrededor de 5 €, el sobre de 5 cromos ronda 1 € y la caja de 50 sobres con álbum se mueve sobre los 80 €. La edición de tapa dura está en torno a 15 €. Completar la colección entera comprando solo sobres puede costar entre 800 y 1.200 €, aunque con intercambios (Wallapop, grupos de Telegram) baja mucho.',
  },
  {
    q: '¿Tiene Carrefour el álbum del Mundial 2026?',
    a: 'Sí. Carrefour es uno de los principales puntos de venta del álbum Panini Mundial 2026 en España: vende la caja de 50 sobres, sobres sueltos y el álbum en tapa blanda y dura, tanto en hipermercado como en Carrefour online. Suele lanzar promociones de sobres en las primeras semanas del torneo.',
  },
  {
    q: '¿Hay álbum de tapa dura del Mundial 2026 en España?',
    a: 'Sí. La edición de tapa dura (alrededor de 15 €) se encuentra sobre todo en El Corte Inglés, FNAC y Panini.es. Es la preferida de los coleccionistas por su mejor encuadernación y durabilidad, y porque mantiene mejor el valor de la colección.',
  },
  {
    q: '¿Cuánto cuesta completar el álbum del Mundial 2026?',
    a: 'Comprando únicamente sobres y sin hacer intercambios, completar el álbum entero puede costar entre 800 y 1.200 € en España por culpa de los cromos repetidos. La forma inteligente de abaratarlo es comprar los cromos que faltan sueltos al final y usar grupos de intercambio, que reducen el coste entre un 30 % y un 50 %.',
  },
  {
    q: '¿Hay álbum digital o virtual del Mundial 2026?',
    a: 'Sí, Panini ofrece una versión digital de la colección además de la física. Tienes el detalle de cómo funciona, los códigos y las diferencias con el álbum de papel en nuestra guía del álbum digital del Mundial 2026.',
  },
];

export default async function DondeComprarEspana({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dónde comprar el álbum del Mundial 2026 en España: 7 canales comparados',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-06-15',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/donde-comprar/espana'),
    inLanguage: 'es-ES',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Dónde comprar', path: '/coleccionismo/panini-mundial-2026/donde-comprar' },
            {
              name: 'España',
              path: '/coleccionismo/panini-mundial-2026/donde-comprar/espana',
            },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Dónde comprar
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingCart className="h-4 w-4" />
          <span>España · 7 canales comparados</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Álbum Mundial 2026<br />en España
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Dónde comprar el álbum Panini Mundial 2026 en España: <strong className="text-[var(--color-fg)]">Carrefour</strong> y los hipermercados ganan en variedad y caja completa, <strong className="text-[var(--color-fg)]">El Corte Inglés</strong> y <strong className="text-[var(--color-fg)]">FNAC</strong> en tapa dura, los <strong className="text-[var(--color-fg)]">kioscos</strong> en sobres sueltos. Comparativa de los 7 canales con precios reales en euros.
        </p>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10 space-y-4">
        {RETAILERS.map((r) => (
          <article
            key={r.nombre}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl uppercase">{r.nombre}</h2>
              <span className="font-mono tab-num text-[var(--color-pitch)]">{r.precio}</span>
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {r.formato}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {r.notas}
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                  Pros
                </div>
                <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-muted)]">
                  {r.pros.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
                  Contras
                </div>
                <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-muted)]">
                  {r.cons.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">
          Lo que más se pregunta
        </h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <AmazonProductGrid
        products={AMAZON_PRODUCTS.filter((p) =>
          /panini|cromos|álbum mundial|sobres/i.test(p.title) && p.worldCupYear === 2026,
        ).slice(0, 8)}
        title="Comprar online (Amazon España, envío Prime)"
        subtitle="Si tu tienda se queda sin stock de la caja o de la tapa dura, Amazon España la envía en 24-48 h. Afiliación."
      />

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Más del cluster Panini</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Precios oficiales
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/tapa-dura')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Edición tapa dura
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/digital')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Álbum digital
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Cuántos cromos tiene
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Dónde comprar (todos)
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

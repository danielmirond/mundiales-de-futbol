import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/donde-comprar/usa',
    title:
      'Dónde comprar el álbum Panini Mundial 2026 en Estados Unidos: Walgreens, Target, Walmart y Amazon',
    description:
      'Guía completa para comprar el álbum Panini Mundial 2026 en Estados Unidos: Walgreens, Target, Walmart, Amazon, Dick\'s Sporting Goods y Panini Store. Precios actualizados de stickers, sobres y álbum (paperback, hardcover, gold edition), con consejos sobre disponibilidad por estado y dónde encontrar la tapa dura.',
    keywords: [
      'where to buy panini world cup 2026 album USA',
      'panini world cup 2026 album walgreens',
      'panini world cup 2026 album target',
      'panini world cup 2026 album walmart',
      'panini world cup 2026 album amazon',
      'panini world cup 2026 hard cover where to buy',
      'panini world cup 2026 album near me',
      'fifa world cup 2026 sticker album USA',
      'donde comprar album mundial 2026 estados unidos',
      'panini world cup hardcover album USA',
    ],
    type: 'article',
  });
}

const RETAILERS = [
  {
    nombre: 'Walgreens',
    formato: 'Sobres sueltos + álbum paperback',
    precio: 'Sobres $1.99–$2.99 · Álbum $7.99',
    notas:
      'El retailer con más cobertura nacional para el álbum del Mundial 2026. Inventario rotativo: cada lunes y jueves reciben nuevos sobres en tienda. Algunas Walgreens tienen exclusivos de la edición USA (sticker exclusivo con stars-and-stripes).',
    pros: ['Cobertura nacional (>9.000 tiendas)', 'Sobres sueltos a precio bajo', 'Reposición frecuente'],
    cons: ['Stock irregular por tienda', 'Tapa dura solo bajo pedido en algunas regiones', 'Precio variable entre estados'],
  },
  {
    nombre: 'Target',
    formato: 'Box de 50 sobres + álbum paperback / hardcover',
    precio: 'Box ~$59.99 · Hardcover album ~$14.99',
    notas:
      'La cadena con mejor inventario de la tapa dura (hardcover) en USA. El box de 50 sobres es la mejor relación precio/cromo. Stock especialmente bueno en el sur de Florida, Texas y California.',
    pros: ['Mejor lugar para encontrar hardcover', 'Box de 50 sobres ahorra ~$30 vs sueltos', 'App Target Circle ofrece descuentos del 10-15%'],
    cons: ['Cantidad limitada de hardcover por tienda', 'Precio del box puede subir tras agotamiento'],
  },
  {
    nombre: 'Walmart',
    formato: 'Sobres + álbum paperback',
    precio: 'Sobres $1.99 · Álbum $6.99',
    notas:
      'El más asequible para sobres sueltos. Disponibilidad nacional pero rotación más lenta que Walgreens. La app Walmart+ permite reserva y delivery same-day en muchas zonas urbanas.',
    pros: ['Precios más bajos del mercado en sobres sueltos', 'Delivery same-day con Walmart+', 'Stock predecible en zonas con alta demanda hispana'],
    cons: ['No suele tener hardcover', 'Reposición más lenta entre envíos'],
  },
  {
    nombre: 'Amazon US',
    formato: 'Box + álbum + edición coleccionista',
    precio: 'Box $69.99 · Hardcover $19.99 · Gold ed. $99.99',
    notas:
      'El único retailer con stock garantizado de la edición dorada (Gold Edition) y otros formatos premium. Prime ofrece envío en 24-48h. Amazon a veces tiene packs combinados (álbum + caja + protector) con descuento.',
    pros: ['Stock garantizado de Gold Edition', 'Envío Prime 24-48h', 'Reviews verificadas por compradores'],
    cons: ['Precios premium vs físico', 'Resellers third-party suben precios cerca del torneo'],
  },
  {
    nombre: 'Dick\'s Sporting Goods',
    formato: 'Sobres + álbum + accesorios coleccionista',
    precio: 'Sobres $2.49 · Álbum $9.99',
    notas:
      'Cobertura más limitada (~700 tiendas) pero la única cadena de tiendas deportivas que mantiene un display dedicado del Mundial. Suele tener fundas protectoras y carpetas que en Walgreens / Target no aparecen.',
    pros: ['Accesorios coleccionista (fundas, carpetas)', 'Personal de tienda con conocimiento del producto', 'Promos cruzadas con merchandising oficial'],
    cons: ['Menor cobertura geográfica', 'Precios un poco más altos'],
  },
  {
    nombre: 'Panini Store (oficial)',
    formato: 'Todos los formatos + ediciones exclusivas',
    precio: 'Variable según producto',
    notas:
      'La tienda online oficial de Panini USA. Único punto de venta con TODAS las ediciones disponibles (paperback, hardcover, gold, platinum). Suele lanzar bundles exclusivos web-only. Envío estándar 5-7 días.',
    pros: ['Cobertura completa de ediciones', 'Bundles exclusivos online', 'Atención al cliente especializada'],
    cons: ['Envío más lento (5-7 días)', 'Sin descuentos cruzados con apps de retailer'],
  },
];

const FAQ = [
  {
    q: '¿Cuál es el retailer más barato para comprar el álbum Panini Mundial 2026 en USA?',
    a: 'Walmart tiene los sobres sueltos al precio más bajo ($1.99). Target tiene la mejor relación calidad-precio en box de 50 sobres (~$59.99). Para la edición hardcover, Target sigue siendo el más asequible (~$14.99 en tienda).',
  },
  {
    q: '¿Dónde encuentro la tapa dura (hardcover) del álbum Mundial 2026 en USA?',
    a: 'Target tiene la mayor disponibilidad de hardcover en tienda. Amazon US lo tiene online con stock garantizado (~$19.99 + Prime). Panini Store oficial es el otro punto fiable. Walgreens y Walmart típicamente NO tienen hardcover en stock regular.',
  },
  {
    q: '¿Cuántos cromos tiene el álbum del Mundial 2026?',
    a: 'El álbum tiene 670 cromos en total: 48 escudos de selecciones, 18 estadios de las sedes y 604 cromos de jugadores (alrededor de 12-13 por equipo). Cada sobre estándar contiene 5 cromos. Para completar el álbum necesitas aproximadamente 134 sobres (con suerte y truques con amigos: 90-100).',
  },
  {
    q: '¿Puedo comprar el álbum Mundial 2026 en Costco?',
    a: 'Costco USA ha tenido stock intermitente del box de 50 sobres en algunas zonas (sobre todo Texas, California y Florida) pero NO es un canal regular. Costco Mexico sí es un canal principal allí. Verifica disponibilidad llamando a tu Costco local antes de visitar.',
  },
  {
    q: '¿Cuándo sale el álbum Panini Mundial 2026 en USA?',
    a: 'El álbum Panini Mundial 2026 está disponible en USA desde abril de 2026. Los stickers se reponen semanalmente hasta el final del torneo (19 de julio de 2026). Después de la final, el stock decrece rápidamente — recomendable completar la colección durante el torneo.',
  },
];

export default async function DondeComprarUsaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      'Dónde comprar el álbum Panini Mundial 2026 en Estados Unidos: Walgreens, Target, Walmart y Amazon',
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/donde-comprar/usa'),
    datePublished: '2026-05-22',
    dateModified: '2026-05-22',
    author: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Dónde comprar', path: '/coleccionismo/panini-mundial-2026/donde-comprar' },
            { name: 'Estados Unidos', path: '/coleccionismo/panini-mundial-2026/donde-comprar/usa' },
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

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingCart className="h-4 w-4" />
          <span>Estados Unidos · Panini World Cup 2026</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.95]">
          Dónde comprar el álbum Mundial 2026 en Estados Unidos
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Guía completa para coleccionistas en USA: <strong>Walgreens</strong> domina la cobertura nacional con sobres sueltos, <strong>Target</strong> tiene la mejor relación calidad-precio en el box de 50 y la mayor disponibilidad de hardcover, <strong>Walmart</strong> es el más asequible en sobres sueltos, <strong>Amazon US</strong> garantiza stock de la Gold Edition y <strong>Dick's Sporting Goods</strong> añade accesorios coleccionista.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Los 6 retailers principales en USA</h2>
        <div className="mt-6 grid gap-5">
          {RETAILERS.map((r) => (
            <article
              key={r.nombre}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl uppercase">{r.nombre}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {r.formato}
                </span>
              </div>
              <p className="mt-3 font-mono text-sm tab-num text-[var(--color-fg)]">
                {r.precio}
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {r.notas}
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    Pros
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-muted)]">
                    {r.pros.map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
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
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Cómo decidir</h2>
        <div className="mt-5 space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 text-base leading-relaxed text-[var(--color-fg)]">
          <p>
            <strong>Si buscas el precio más bajo en sobres sueltos</strong> → Walmart ($1.99) o Walgreens ($1.99–$2.49).
          </p>
          <p>
            <strong>Si quieres rentabilizar la colección con un box</strong> → Target (~$59.99 por 50 sobres). Sale a $1.20 por sobre vs $1.99 sueltos.
          </p>
          <p>
            <strong>Si buscas la tapa dura (hardcover)</strong> → Target en tienda o Amazon US online. Ambos rondan los $14.99–$19.99.
          </p>
          <p>
            <strong>Si coleccionas ediciones premium (Gold, Platinum)</strong> → Panini Store oficial o Amazon US. Son canales únicos.
          </p>
          <p>
            <strong>Si vives en el sur (Florida, Texas, California)</strong> → mejor disponibilidad. La demanda hispana asegura reposiciones más frecuentes y mejores precios.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <summary className="cursor-pointer font-display text-base uppercase tracking-tight text-[var(--color-fg)] group-open:text-[var(--color-pitch)]">
                {f.q}
              </summary>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue por aquí</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar/mexico')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Dónde comprar en México
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar/brasil')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Dónde comprar en Brasil
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Precio del álbum
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/tapa-dura')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Tapa dura / Hardcover
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene')}
              className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Cuántos cromos tiene
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

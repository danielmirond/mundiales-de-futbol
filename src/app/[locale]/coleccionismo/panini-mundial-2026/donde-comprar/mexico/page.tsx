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
    path: '/coleccionismo/panini-mundial-2026/donde-comprar/mexico',
    title: 'Dónde comprar el álbum del Mundial 2026 en México: Costco, Sam\'s, Oxxo y Walmart',
    description:
      'Guía completa para comprar el álbum Panini Mundial 2026 en México: Costco, Sam\'s Club, Oxxo, Walmart, Sanborns, Soriana y Panini México. Precios actualizados de la caja, sobres sueltos y álbum (tapa blanda, dura y oro), con consejo sobre dónde sale más barato cada formato.',
    keywords: [
      'donde comprar album mundial 2026 mexico',
      'album mundial 2026 costco',
      'album mundial 2026 sams',
      'album mundial 2026 oxxo',
      'album mundial 2026 walmart',
      'precio album mundial 2026 mexico',
      'cuanto cuesta el album del mundial 2026 en el oxxo',
      'panini mundial 2026 mexico',
    ],
    type: 'article',
  });
}

const RETAILERS = [
  {
    nombre: 'Costco México',
    formato: 'Caja 50 sobres + álbum tapa dura',
    precio: '~1.099 MXN',
    notas:
      'El mejor precio por cromo (~1,75 MXN/cromo). Solo socios Costco. Stock limitado, suele agotarse en las primeras semanas.',
    pros: ['Precio más bajo por cromo', 'Suele incluir tapa dura'],
    cons: ['Requiere membresía', 'No hay sobres sueltos'],
  },
  {
    nombre: 'Sam\'s Club',
    formato: 'Caja 50 sobres + álbum tapa blanda',
    precio: '~1.149 MXN',
    notas:
      'Segunda opción mejor en precio. Membresía Sam\'s requerida. Stock más amplio que Costco en la mayoría de regiones.',
    pros: ['Precio competitivo', 'Mejor stock que Costco'],
    cons: ['Requiere membresía Sam\'s'],
  },
  {
    nombre: 'Oxxo',
    formato: 'Sobres sueltos · álbum tapa blanda',
    precio: '25-30 MXN/sobre · 80 MXN álbum',
    notas:
      'Cobertura nacional total: hay >20.000 tiendas Oxxo en México. Disponibilidad inmediata, no hay caja completa pero es lo más cómodo para sobres sueltos.',
    pros: ['Disponibilidad nacional', 'Sin membresía', 'Pago en efectivo / Spin'],
    cons: ['Más caro por cromo (5-6 MXN)', 'No hay caja, solo sobres'],
  },
  {
    nombre: 'Walmart México',
    formato: 'Caja, sobres sueltos, álbum tapa blanda y dura',
    precio: '~1.250 MXN caja · 30 MXN sobre · 80-150 MXN álbum',
    notas:
      'La opción más versátil: vende caja, sobres y álbumes. Sin membresía. Precios un poco superiores a Costco/Sam\'s pero más accesibles.',
    pros: ['Variedad de formatos', 'Sin membresía', 'Cobertura nacional'],
    cons: ['No es el más barato'],
  },
  {
    nombre: 'Sanborns',
    formato: 'Álbum tapa dura premium · sobres sueltos',
    precio: '150 MXN álbum tapa dura · 25 MXN sobre',
    notas:
      'Punto de venta histórico para coleccionistas mexicanos. Suelen tener tapa dura cuando otros se quedan sin stock.',
    pros: ['Tapa dura premium estable', 'Conservadores con el stock'],
    cons: ['No vende caja completa'],
  },
  {
    nombre: 'Soriana',
    formato: 'Sobres sueltos, álbum tapa blanda',
    precio: '25-28 MXN/sobre · 80 MXN álbum',
    notas:
      'Distribución regional fuerte en norte y bajío. Sin caja completa, formato 100% sobres sueltos.',
    pros: ['Disponibilidad rápida', 'Sin membresía'],
    cons: ['No hay caja'],
  },
  {
    nombre: 'Panini.com.mx (oficial)',
    formato: 'Todos los formatos · ediciones especiales',
    precio: 'Precio oficial directo · envío',
    notas:
      'Panini México vende online álbum tapa dura, oro coleccionista (tirada limitada), caja completa y bricks (10 cajas). Algunas ediciones especiales solo aquí.',
    pros: ['Ediciones limitadas', 'Stock garantizado', 'Pre-órdenes'],
    cons: ['Coste de envío', 'Tiempos de entrega 5-7 días'],
  },
];

const FAQ = [
  {
    q: '¿Dónde sale más barato el álbum del Mundial 2026 en México?',
    a: 'Costco México y Sam\'s Club tienen el mejor precio por cromo (1.099-1.149 MXN por caja de 50 sobres con álbum), aproximadamente 1,75-2,30 MXN/cromo. Si no tienes membresía, Walmart México es la opción más equilibrada (~1.250 MXN). Para compra inmediata sin membresía, Oxxo o Soriana sobre suelto.',
  },
  {
    q: '¿Cuánto cuesta el álbum del Mundial 2026 en el Oxxo?',
    a: 'En Oxxo el álbum tapa blanda cuesta alrededor de 80 MXN y el sobre con 5 cromos entre 25 y 30 MXN. No venden la caja completa, solo álbum y sobres sueltos. Es la opción más cómoda por cobertura nacional pero la más cara por cromo.',
  },
  {
    q: '¿Costco México sigue vendiendo el álbum del Mundial 2026?',
    a: 'Sí, Costco México distribuye la caja Panini Mundial 2026 desde el lanzamiento. El stock se renueva semanalmente pero hay alta rotación: en algunos clubes la caja llega y se agota el mismo día. Pregunta en atención al cliente o consulta la app Costco México.',
  },
  {
    q: '¿Hay diferencia entre el álbum tapa blanda y tapa dura en México?',
    a: 'Sí. La tapa blanda (~80 MXN) es la versión estándar. La tapa dura (~150 MXN) tiene mayor durabilidad, mejor encuadernación y suele incluir 6-8 cromos extra de bienvenida. Los coleccionistas prefieren tapa dura porque mantiene mejor el valor.',
  },
  {
    q: '¿Sams Club o Costco tiene mejor precio?',
    a: 'Costco suele tener 50 MXN menos que Sam\'s en la caja completa. Sin embargo, Sam\'s tiene mejor stock y reposiciones más frecuentes. Recomendación: si encuentras stock en Costco, Costco. Si Costco está agotado, Sam\'s.',
  },
  {
    q: '¿Cuándo llega el álbum del Mundial 2026 a México?',
    a: 'Panini México lanzó el álbum el 2 de mayo de 2026. Está disponible en todos los retailers grandes desde esa fecha. Las ediciones especiales (oro, lujo numerada) llegan 1-2 semanas después.',
  },
];

export default async function DondeComprarMexico({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dónde comprar el álbum del Mundial 2026 en México: 7 retailers comparados',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/donde-comprar/mexico'),
    inLanguage: 'es-MX',
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
              name: 'México',
              path: '/coleccionismo/panini-mundial-2026/donde-comprar/mexico',
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
          <span>México · 7 retailers comparados</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Álbum Mundial 2026<br />en México
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Dónde comprar el álbum Panini Mundial 2026 en México con el mejor precio: <strong className="text-[var(--color-fg)]">Costco</strong> y <strong className="text-[var(--color-fg)]">Sam\'s Club</strong> ganan en caja completa (~1.099-1.149 MXN), <strong className="text-[var(--color-fg)]">Oxxo</strong> y <strong className="text-[var(--color-fg)]">Walmart</strong> en accesibilidad sin membresía. Comparativa actualizada de los 7 canales con precios y observaciones reales.
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
          /panini|cromos|álbum mundial|sobres/i.test(p.title),
        ).slice(0, 4)}
        title="Comprar online (Amazon México disponible vía España)"
        subtitle="Si tu retailer mexicano se queda sin stock, Amazon España envía a México con tarifa internacional. Afiliación nuus-21."
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
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Dónde comprar (todos)
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/caja-50-sobres')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Caja 50 sobres
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

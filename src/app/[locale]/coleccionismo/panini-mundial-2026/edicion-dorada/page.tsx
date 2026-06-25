import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Crown, Star } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/edicion-dorada',
    title:
      'Álbum dorado Panini Mundial 2026 · Edición oro, tapa dorada y coleccionista numerada',
    description:
      'El álbum dorado del Mundial 2026: tapa dura dorada con láminas oro coleccionista (1.500 unidades en España), edición oro lujo numerada, plata y caja premium. Precio, dónde comprar (Panini Store, Amazon), qué incluye cada edición y cómo distinguir las verdaderas ediciones limitadas. Álbum oro, dorado, tapa dorada y panini gold del Mundial 2026.',
    keywords: [
      'album dorado mundial 2026',
      'album dorado mundial',
      'álbum mundial 2026 dorado',
      'álbum dorado del mundial 2026',
      'album mundial dorado',
      'album panini dorado mundial 2026',
      'album panini mundial 2026 dorado',
      'album mundial 2026 panini dorado',
      'panini dorado',
      'album panini dorado',
      'album dorado panini',
      'album dorado panini mundial 2026',
      'album panini dorado 2026',
      'panini album dorado',
      'panini edicion dorada',
      'album panini mundial 2026 edicion dorada',
      'album mundial 2026 edicion dorada',
      'álbum panini mundial 2026 gold',
      'panini gold',
      'album oro mundial 2026',
      'album mundial 2026 oro',
      'album oro mundial',
      'album de oro mundial',
      'album de oro mundial 2026',
      'album mundial 2026 de oro',
      'album fifa 2026 dorado',
      'álbum del mundial dorado',
      'album del mundial dorado',
      'album del mundial 2026 tapa dorada',
      'album mundial 2026 tapa dorada',
      'album mundial dorado 2026',
      'panini tapa dorada',
      'tapa dorada mundial 2026',
      'álbum tapa dorada mundial 2026',
      'album tapa dorada mundial 2026',
      'album tapa dorada 2026',
      'album dorado 2026',
      'álbum dorado 2026',
      'cromos dorados mundial 2026',
      'cromos dorados panini',
      'cromos dorados mundial',
      'cromos dorados panini mundial 2026',
      'edicion limitada mundial 2026 panini',
      'album lujo mundial 2026',
      'album numerado mundial 2026',
    ],
    type: 'article',
  });
}

const EDICIONES = [
  {
    nombre: 'Oro coleccionista',
    tirada: '1.500 unidades en España',
    precio: '~30 €',
    incluye: [
      'Cubierta troquelada con baño de oro',
      'Páginas con borde dorado',
      '12 cromos foil de cabezas de serie incluidos',
      'Caja rígida de presentación',
      'Certificado de autenticidad numerado',
    ],
    detalle:
      'La edición tope del Mundial 2026 en España. Tirada limitada de 1.500 ejemplares con número impreso en certificado. Para coleccionistas y regalo high-end. Distribución: Panini.es y FNAC selectos.',
    rareza: 'Muy alta',
  },
  {
    nombre: 'Lujo numerada',
    tirada: '5.000 unidades global',
    precio: '~60-80 €',
    incluye: [
      'Cubierta de piel sintética premium',
      'Sobrecubierta dorada extraíble',
      'Página de firmas FIFA/Panini',
      '24 cromos foil + holograma incluidos de bienvenida',
      'Set de protectores de página',
      'Lapicero metálico marca-cromos',
    ],
    detalle:
      'Edición global más exclusiva. Numerada del 1/5000 al 5000/5000. Sólo en Panini.com (España, USA, México, Brasil). El precio sube en mercado secundario tras lanzamiento.',
    rareza: 'Extremadamente alta',
  },
  {
    nombre: 'Plata especial',
    tirada: '~10.000 España',
    precio: '~18 €',
    incluye: [
      'Cubierta plateada metalizada',
      '6 cromos foil incluidos',
      'Sin caja rígida',
    ],
    detalle:
      'Versión intermedia entre tapa dura estándar y oro. Más accesible en stock que la oro pero igualmente especial. Distribución: Panini.es y kioscos premium.',
    rareza: 'Media-alta',
  },
  {
    nombre: 'Caja premium con álbum dorado',
    tirada: 'Limitada por país',
    precio: '~120 €',
    incluye: [
      'Álbum oro coleccionista',
      'Caja completa de 50 sobres',
      'Set de 5 cromos exclusivos numerados',
      'Caja de regalo coleccionista',
    ],
    detalle:
      'Pack regalo definitivo. Sale a unos 0,40 €/cromo + valor del álbum oro. La caja de regalo en sí ya es coleccionable.',
    rareza: 'Alta',
  },
];

const FAQ = [
  {
    q: '¿Existe un álbum dorado del Mundial 2026?',
    a: 'Sí. La edición «oro coleccionista» del álbum Panini Mundial 2026 tiene tirada limitada de 1.500 unidades en España con cubierta troquelada y baño de oro real, páginas con borde dorado y certificado numerado. Precio: alrededor de 30 € en Panini.es. Para más allá hay también ediciones lujo numerada (5.000 globales, ~60-80 €) y plata (~18 €).',
  },
  {
    q: '¿Cuánto cuesta el álbum oro del Mundial 2026?',
    a: 'El álbum oro coleccionista cuesta unos 30 € en Panini.es España. La edición lujo numerada (más exclusiva, 5.000 globales) ronda los 60-80 €. La plata especial unos 18 €. La caja premium con álbum dorado y 50 sobres incluidos cuesta sobre 120 €.',
  },
  {
    q: '¿Dónde comprar el álbum dorado / edición especial?',
    a: 'Panini.es es el canal oficial principal. Algunos FNAC selectos lo distribuyen también. La edición lujo numerada solo en Panini.com (España, USA, México, Brasil). Cuidado con copias en Mercado Libre y AliExpress: hay réplicas que no son edición oficial Panini.',
  },
  {
    q: '¿Cómo distinguir un álbum oro auténtico de una copia?',
    a: 'Los álbumes oro auténticos llevan: certificado numerado individual (X/1500 en España), holograma Panini en contraportada, baño de oro genuino (no impresión metalizada barata), QR code que valida la edición en Panini.com, y caja rígida de presentación. Si falta cualquiera de estos elementos, es probablemente copia.',
  },
  {
    q: '¿Vale la pena comprar la edición oro o lujo?',
    a: 'Para coleccionistas serios, sí: la tirada limitada y la calidad de fabricación las convierten en activo coleccionable. Históricamente, las ediciones oro de Mundiales pasados (Brasil 2014 oro, Rusia 2018 oro) se revalorizaron 200-400 % en 5-7 años. Para uso casual, la versión tapa dura estándar (~15 €) cubre la misma colección de cromos.',
  },
  {
    q: '¿La edición oro tiene los mismos cromos que la estándar?',
    a: 'Sí. Las páginas internas son idénticas: 980 cromos, 112 páginas, mismas categorías (capitanes foil, holograma, FIFA Legends). Lo que cambia son la cubierta, los acabados de página y la inclusión de cromos de bienvenida que en la versión estándar habría que conseguir aparte.',
  },
];

export default async function EdicionDorada({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Álbum dorado Panini Mundial 2026: oro, lujo numerada y plata explicadas',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/edicion-dorada'),
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
            {
              name: 'Edición dorada',
              path: '/coleccionismo/panini-mundial-2026/edicion-dorada',
            },
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
          <Crown className="h-4 w-4" />
          <span>Ediciones especiales · oro · lujo · plata</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Álbum dorado<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Las ediciones especiales del álbum Panini Mundial 2026: <strong className="text-[var(--color-fg)]">oro coleccionista</strong> (1.500 unidades en España, ~30 €), <strong className="text-[var(--color-fg)]">lujo numerada</strong> (5.000 globales, ~60-80 €) y plata especial (~18 €). Cómo se diferencian de la tapa dura estándar, qué incluye cada una y cómo asegurarte de que tu copia es auténtica.
        </p>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10 space-y-4">
        {EDICIONES.map((e) => (
          <article
            key={e.nombre}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl uppercase">{e.nombre}</h2>
              <span className="font-mono tab-num text-[var(--color-pitch)]">{e.precio}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              <span>Tirada · {e.tirada}</span>
              <span className="text-[var(--color-pitch)]">Rareza · {e.rareza}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {e.detalle}
            </p>
            <div className="mt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                <Star className="inline h-3 w-3 mr-1" />
                Incluye
              </div>
              <ul className="mt-3 grid gap-1.5 md:grid-cols-2 text-sm text-[var(--color-fg-muted)]">
                {e.incluye.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">FAQ</h2>
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
          /panini|tapa dura|álbum mundial|oro|premium/i.test(p.title),
        ).slice(0, 4)}
        title="Comprar versión premium / tapa dura"
        subtitle="Las ediciones tapa dura y especiales del álbum Panini Mundial 2026 también están en Amazon España (afiliación nuus-21)."
      />

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/tapa-dura')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Tapa dura estándar
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Cromos más caros
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Precios oficiales
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

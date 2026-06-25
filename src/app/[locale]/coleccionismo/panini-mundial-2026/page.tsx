import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Music,
  ExternalLink,
} from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { AmazonProductGrid } from '@/components/affiliate/amazon-card';
import { AmazonBuyWidget } from '@/components/affiliate/amazon-buy-widget';
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
  const t = await getTranslations({ locale, namespace: 'pages.panini' });
  return pageMetadata({
    locale,
    path: '/coleccionismo/panini-mundial-2026',
    title: t('title'),
    description: t('description'),
    keywords: [
      'álbum Panini Mundial 2026',
      'cromos Mundial 2026',
      'sobres Panini Mundial 2026',
      'precio cromos Panini 2026',
      'app digital Panini Mundial 2026',
      'códigos cromos virtuales Mundial 2026',
      'cromos más caros Panini Mundial',
      'Lamine Yamal Endrick rookie Panini',
      'edición especial Panini',
      'intercambio cromos Mundial',
    ],
    type: 'article',
  });
}

// ─── Datos verificados (Panini.es, Primicias EC, Publimetro MX, abr 2026) ─

const FACTS = [
  { label: 'Selecciones', value: '48' },
  { label: 'Cromos confirmados', value: '980' },
  { label: 'Páginas del álbum', value: '112' },
  { label: 'Cromos especiales', value: '68' },
];

const PRICES = [
  {
    region: 'España (Panini.es)',
    album: '5 €',
    pack: '~1 €',
    box: '80 € (50 sobres)',
    note: 'Caja con álbum incluido. Envío gratis península desde 20 €.',
  },
  {
    region: 'Ecuador (puntos oficiales)',
    album: '$3,50 / $15 / $30',
    pack: '$1,20',
    box: '$124,80 (104 sobres)',
    note: 'Tres versiones: tapa blanda, tapa dura premium y dura oro.',
  },
  {
    region: 'México (referencia)',
    album: '~80 MXN',
    pack: '~25 MXN',
    box: '~1.250 MXN',
    note: 'Disponible en kioscos, Sanborns y Walmart.',
  },
];

const HARD_STICKERS = [
  {
    name: 'Lamine Yamal',
    team: 'España',
    why: 'Primera Copa del Mundo. El rookie europeo del torneo. Cotización mercado secundario superará la de Mbappé en 2018.',
    rarity: 'Alta',
  },
  {
    name: 'Endrick',
    team: 'Brasil',
    why: 'Promesa brasileña en su primer Mundial. Categoría rookie clásica, históricamente las que más se revalorizan.',
    rarity: 'Alta',
  },
  {
    name: 'Lionel Messi',
    team: 'Argentina',
    why: 'Campeón vigente y posible despedida mundialista. Cromo de cierre de carrera con valor sentimental fuerte.',
    rarity: 'Media-Alta',
  },
  {
    name: 'Cristiano Ronaldo',
    team: 'Portugal',
    why: 'Quinto y último Mundial confirmado. Despedida oficial.',
    rarity: 'Media-Alta',
  },
  {
    name: 'Kylian Mbappé',
    team: 'Francia',
    why: 'Capitán de Francia, Bota de Oro 2022 (8 goles). Cromos en categoría iconic class y/o foil.',
    rarity: 'Media-Alta',
  },
  {
    name: 'Foil capitanes',
    team: '12 países cabeza de serie',
    why: '12 cromos en material foil de los capitanes de cada grupo cabeza de serie. Dificultad estadística alta.',
    rarity: 'Alta',
  },
  {
    name: 'Logo FIFA Trophy holograma',
    team: 'Especial',
    why: 'Cromo holograma del trofeo. Pieza icónica que en Qatar 2022 llegó a 60-100 € en mercado secundario.',
    rarity: 'Muy alta',
  },
  {
    name: 'Extra Stickers (4 colores)',
    team: 'Limitada',
    why: '20 cromos exclusivos en 4 variantes de color (80 totales). Inserción aleatoria 1 cada 100 sobres aprox.',
    rarity: 'Muy alta',
  },
];

const FAQ = [
  {
    q: '¿Cuándo salió el álbum Panini del Mundial 2026?',
    a: 'El álbum oficial salió a la venta el 30 de abril de 2026 en España (Panini.es) y el 2 de mayo en Latinoamérica. Es la mayor colección Panini de la historia: 980 cromos en 112 páginas, con 68 especiales en material premium. La fecha cumple el patrón de Panini de lanzar 6 semanas antes del partido inaugural (11 de junio en el Estadio Azteca).',
  },
  {
    q: '¿Cuánto cuesta el álbum del Mundial 2026?',
    a: 'En la web oficial Panini.es: 5 € la tapa blanda. Caja completa de 50 sobres con álbum incluido: 80 €. En Ecuador hay tres versiones: tapa blanda $3,50, tapa dura premium $15 y tapa dura oro $30. Sobres individuales en torno a 1 €/$1,20.',
  },
  {
    q: '¿Cuánto cuesta completar la colección entera?',
    a: 'Estimaciones serias hablan de entre 800 y 1.200 € sin intercambios. Con grupos de Telegram y Wallapop activos, el coste baja a 400-600 €. La caja de 50 sobres trae 250 cromos sin garantía de no repetidos, así que estadísticamente cubre el 35-50 % del álbum.',
  },
  {
    q: '¿Dónde comprar los cromos en España?',
    a: 'En kioscos y prensa, Carrefour, Toys R Us, El Corte Inglés, FNAC, Casa del Libro y librerías independientes. Online: Panini.es (la oficial), Amazon España, Mercadolibre y Wallapop para cromos sueltos. Los grupos de Telegram «Panini España 2026» son el principal canal de intercambio.',
  },
  {
    q: '¿Cómo funciona la app digital Panini Mundial 2026?',
    a: 'La app oficial «FIFA Panini Digital Album» permite coleccionar versión virtual gratis, intercambiar con coleccionistas globales, montar un Dream Team y acceder a contenido exclusivo mediante códigos promocionales. Cada sobre físico incluye un código de un solo uso con cromos virtuales adicionales. Sportsing News y TyC Sports han publicado packs de códigos comunitarios para cromos digitales gratis.',
  },
  {
    q: '¿Cuáles son los cromos más caros y más difíciles?',
    a: 'Los Extra Stickers (20 cromos en 4 variantes de color, frecuencia 1/100 sobres), el holograma del Trofeo FIFA, los foil de capitanes cabeza de serie, los rookie de Lamine Yamal y Endrick. Algunas estimaciones sitúan ciertas combinaciones (Yamal + Messi en mercado secundario hispano) por encima de los 100.000 pesos colombianos / 25 € por unidad en marketplace.',
  },
  {
    q: '¿Hay edición especial coleccionista?',
    a: 'Sí. Panini publica habitualmente: tapa blanda (la popular), tapa dura/hardcover, edición lujo limitada por país (1.200-2.500 unidades) y edición «Top Class» XXL. La de Qatar 2022 (1.200 unidades) cotiza hoy por encima de 500 € en mercado secundario. La de 2026 sigue el mismo patrón.',
  },
  {
    q: '¿Hay canción oficial?',
    a: 'Sí. Emilio Estefan presentó el 1 de mayo de 2026 el álbum musical oficial del Mundial 2026 con la canción principal «Love Always Wins». Es la primera vez que Panini coordina lanzamiento de cromos y banda sonora oficial en la misma semana.',
  },
  {
    q: '¿Vale la pena comprar la caja entera de sobres?',
    a: 'Estadísticamente sí. Una caja de 50 sobres trae 250 cromos sin repetidos garantizados, equivalente al 25-50 % del álbum según suerte. Comprándolo paquete a paquete sale entre un 30 % y un 60 % más caro y con muchas más repeticiones. Para coleccionistas serios, la caja es la opción dominante.',
  },
  {
    q: '¿Cómo funcionan los intercambios?',
    a: 'En España los grupos de Telegram «Panini Mundial 2026 ES» y Wallapop son los canales más activos. Se publica el listado de «tengo / falto» y se intercambia por correo postal o presencialmente en ferias. Ética habitual: 1×1 (un cromo por uno tuyo) salvo los foil y especiales (3×1 o 5×1) y los cromos rookie/holograma (negociación abierta).',
  },
];

export default async function PaniniMundial2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Productos Panini ya en catálogo (álbum 2026 verificado + cajas)
  const paniniProducts = AMAZON_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes('panini') ||
      p.title.toLowerCase().includes('cromo') ||
      p.title.toLowerCase().includes('adrenalyn'),
  );

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Panini Mundial 2026: 980 cromos, 112 páginas, app digital y dónde comprar',
    description:
      'Guía completa del álbum Panini Mundial 2026: salido el 30 abril 2026, 980 cromos en 112 páginas, 68 especiales en material premium, app digital con códigos, los cromos más caros y dónde comprar en España, México y Ecuador.',
    author: { '@type': 'Organization', name: 'Mundial de Fútbol' },
    publisher: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: localeUrl(locale, '/'),
    },
    datePublished: '2026-04-26',
    dateModified: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026'),
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
    <article className="relative">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.15), transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/2026')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
          </Link>

          <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Sparkles className="h-4 w-4" />
            <span>Coleccionismo · Mundial 2026</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            Panini<br />Mundial 2026
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            La mayor colección Panini de la historia: <strong className="text-[var(--color-fg)]">980 cromos</strong>{' '}
            en 112 páginas, con 68 especiales en material premium. A la venta
            desde el 30 de abril de 2026 en España y el 2 de mayo en
            Latinoamérica. Salida oficial confirmada por Panini.
          </p>
        </div>
      </section>

      {/* Confirmación de salida */}
      <section className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex gap-4 rounded-2xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-5 md:p-6">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--color-pitch)]" />
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
              <strong className="text-[var(--color-fg)]">Ya a la venta.</strong>{' '}
              El álbum oficial está disponible desde el 30 de abril en{' '}
              <a
                href="https://www.panini.es/shp_esp_es/fifa-world-cup-2026-official-sticker-collection-lbum-colecci-n-oficial-panini-005460aew-es01.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-fg)] underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
              >
                Panini.es <ExternalLink className="inline h-3 w-3" />
              </a>{' '}
              y en Amazon España. Esta página se actualiza con datos verificados
              cada semana.
            </p>
          </div>
        </div>

        <AmazonBuyWidget asin="B0GXFB4BJ5" heading="Empieza la colección" />
      </section>

      {/* Datos rápidos */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Datos rápidos
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          La colección 2026 en cifras
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((s) => (
            <div key={s.label} className="bg-[var(--color-bg-2)] p-6 md:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {s.label}
              </span>
              <span className="mt-3 block font-display text-4xl text-[var(--color-fg)] md:text-5xl">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Amazon */}
      {paniniProducts.length > 0 && (
        <AmazonProductGrid
          products={paniniProducts}
          title="Cómpralo en Amazon"
          subtitle="Álbum oficial Panini Mundial 2026 ya disponible. Envío Prime en 24-48 h en España."
        />
      )}

      {/* Precios por país */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Precios oficiales · 2026
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Precios por país
        </h2>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">Mercado</th>
                <th className="px-4 py-4">Álbum</th>
                <th className="px-4 py-4">Sobre</th>
                <th className="px-4 py-4 hidden md:table-cell">Caja</th>
                <th className="px-4 py-4 hidden lg:table-cell">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {PRICES.map((p) => (
                <tr key={p.region} className="hover:bg-[var(--color-bg-2)]/40">
                  <td className="px-4 py-3 font-mono text-[var(--color-fg)]">
                    {p.region}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{p.album}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{p.pack}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)] hidden md:table-cell">{p.box}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-fg-subtle)] hidden lg:table-cell">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* App digital + canción oficial */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-8">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Smartphone className="h-4 w-4" />
              <span>App digital</span>
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase leading-tight md:text-3xl">
              FIFA Panini Digital Album
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
              Versión digital gratuita oficial. Permite coleccionar cromos
              virtuales, intercambiar con coleccionistas globales, montar un
              Dream Team y desbloquear contenido exclusivo. Cada sobre físico
              incluye un código de un solo uso con cromos digitales
              adicionales. Sportsing News, TyC Sports y otros medios publican
              packs de códigos promocionales gratuitos cada semana.
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-8">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Music className="h-4 w-4" />
              <span>Canción oficial</span>
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase leading-tight md:text-3xl">
              «Love Always Wins»
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
              Emilio Estefan presentó el 1 de mayo de 2026 el álbum musical
              oficial del Mundial 2026 con la canción principal «Love Always
              Wins». Es la primera vez que Panini coordina lanzamiento de
              cromos y banda sonora oficial en la misma semana, una jugada de
              marketing dirigida al público latino primario del torneo
              (anfitriones México + EE. UU. y dos selecciones rivales de
              Argentina y Brasil entre las favoritas).
            </p>
          </div>
        </div>
      </section>

      {/* Cromos más buscados */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Top cromos del torneo
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Los más caros y más difíciles
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Selección de los cromos con más demanda y mayor cotización en
          mercado secundario, según las primeras valoraciones publicadas por
          Infobae, Portafolio y Huffington Post (abril-mayo 2026).
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {HARD_STICKERS.map((c) => (
            <li
              key={c.name}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg uppercase text-[var(--color-fg)]">
                  {c.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {c.team}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {c.why}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Rareza
                <span className="text-[var(--color-fg)]">{c.rarity}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Lo que más se pregunta
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Fuentes: Panini.es (web oficial) · Primicias.ec · Publimetro MX ·
          Huffington Post España · Infobae · TyC Sports · Sporting News.
          Última verificación: 2 mayo 2026.
        </p>
      </section>

      {/* Cluster Panini · sub-páginas */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Profundiza · 8 guías
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Cluster Panini Mundial 2026
        </h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene', kicker: 'Desglose', title: '980 cromos · qué incluye' },
            { href: '/coleccionismo/panini-mundial-2026/precio', kicker: 'Precio', title: 'Cuánto cuesta en cada país' },
            { href: '/coleccionismo/panini-mundial-2026/donde-comprar', kicker: 'Tiendas', title: 'Dónde comprar (7 países)' },
            { href: '/coleccionismo/panini-mundial-2026/donde-comprar/mexico', kicker: 'México', title: 'Costco, Sam’s, Oxxo, Walmart' },
            { href: '/coleccionismo/panini-mundial-2026/donde-comprar/brasil', kicker: 'Brasil', title: 'Panini.com.br, livrarias, bancas' },
            { href: '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026', kicker: 'Brasil', title: 'Figurinhas Copa 2026' },
            { href: '/coleccionismo/panini-mundial-2026/caja-50-sobres', kicker: 'Caja', title: 'Caja 50 sobres · ROI' },
            { href: '/coleccionismo/panini-mundial-2026/cuando-sale', kicker: 'Calendario', title: 'Fechas por mercado' },
            { href: '/coleccionismo/panini-mundial-2026/digital', kicker: 'App', title: 'Álbum digital + códigos' },
            { href: '/coleccionismo/panini-mundial-2026/tapa-dura', kicker: 'Premium', title: 'Tapa dura, oro y XXL' },
            { href: '/coleccionismo/panini-mundial-2026/edicion-dorada', kicker: 'Edición especial', title: 'Álbum dorado y lujo' },
            { href: '/coleccionismo/panini-mundial-2026/cromos-mas-caros', kicker: 'Top 10', title: 'Cromos más caros' },
            { href: '/coleccionismo/panini-mundial-2026/check-list-cromos', kicker: 'Check list', title: '980 cromos numerados' },
            { href: '/coleccionismo/panini-mundial-2026/coca-cola', kicker: 'Promo', title: '12 cromos Coca-Cola' },
            { href: '/coleccionismo/panini-mundial-2026/topps-vs-panini', kicker: 'Comparativa', title: 'Topps vs Panini 2026' },
          ].map((s) => (
            <li key={s.href} className="bg-[var(--color-bg)]">
              <Link
                href={withLocale(locale as Locale, s.href)}
                className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-[var(--color-bg-2)]"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {s.kicker}
                </span>
                <span className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] group-hover:text-[var(--color-pitch)] transition-colors">
                  {s.title}
                </span>
                <span className="mt-auto inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Leer guía
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA hub */}
      <section className="mx-auto mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más del Mundial 2026
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/convocatorias')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Convocatorias
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Calendario por fase
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              12 grupos
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              16 sedes
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

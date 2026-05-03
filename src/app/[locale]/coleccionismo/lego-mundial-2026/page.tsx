import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Boxes, ExternalLink, Star } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// Enlace a la categoría LEGO oficial (sin afiliado externo).
const LEGO_CATEGORY_URL =
  'https://www.lego.com/en-us/categories/football/football-gifts-toys';

// Helper Amazon Associates con tag nuus-21 (Amazon España).
// Los ASINs son DIFERENTES entre Amazon.com (USA) y Amazon.es (España):
// el mismo set tiene un ASIN distinto en cada marketplace. Para los sets con ASIN
// .es confirmado, enlace directo. Para el resto, búsqueda en .es por número de set
// (siempre funciona y conserva el tracking de afiliación).
const AMAZON_TAG = 'nuus-21';
function amazonByAsin(asin: string): string {
  return `https://www.amazon.es/dp/${asin}?tag=${AMAZON_TAG}`;
}
function amazonSearch(setNumber: number): string {
  return `https://www.amazon.es/s?k=lego+${setNumber}+mundial&tag=${AMAZON_TAG}`;
}
function amazonForSet(set: { id: number; asin?: string }): string {
  return set.asin ? amazonByAsin(set.asin) : amazonSearch(set.id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/lego-mundial-2026',
    title: 'LEGO Mundial 2026: los 10 sets oficiales con Messi, Ronaldo, Mbappé y Vinicius',
    description:
      'Catálogo completo de la colección LEGO FIFA World Cup 2026: 10 sets oficiales con Messi (43011, 43015, 43018), Cristiano Ronaldo (43012, 43016), Mbappé (43013), Vinícius Jr (43027), el Trofeo 1:1 (43020 · 2.842 piezas), el emblema oficial (43032) y la camiseta USA (43033). Precios, números de set, ASINs Amazon, fechas de lanzamiento y dónde comprar.',
    keywords: [
      'lego mundial 2026',
      'lego fifa world cup 2026',
      'lego copa del mundo 2026',
      'lego messi 2026',
      'lego cristiano ronaldo 2026',
      'lego mbappe 2026',
      'lego vinicius 2026',
      'lego soccer legend',
      'lego football highlights',
      'lego trophy 43020',
      'lego messi celebration 43018',
      'set 43015 messi',
      'set 43016 ronaldo',
      'set 43032 emblema mundial',
      'lego mundial 2026 precio',
    ],
    type: 'article',
  });
}

type LegoSet = {
  id: number;
  category: 'highlight' | 'legend' | 'premium' | 'merch';
  title: string;
  subtitle: string;
  pieces: number;
  price: string;
  priceUSD: number;
  ages: string;
  release: string;
  description: string;
  legoSlug?: string;
  /** ASIN Amazon (cuando esté confirmado). Si presente, prefiere link Amazon. */
  asin?: string;
  iconic?: boolean;
};

const LEGO_SETS: LegoSet[] = [
  {
    id: 43020,
    category: 'premium',
    title: 'FIFA World Cup · Official Trophy',
    subtitle: 'Réplica 1:1 del trofeo · 2.842 piezas',
    pieces: 2842,
    price: '199,99 $ / 179,99 €',
    priceUSD: 199.99,
    ages: '12+',
    release: 'Marzo 2026 (pre-order activa)',
    description:
      'Réplica 1:1 del Trofeo de la Copa del Mundo FIFA con 36 cm de altura y 2.842 piezas. Compartimento secreto en la esfera superior con el logo del Mundial 2026 dentro. Minifigura LEGO exclusiva con mini-trofeo y placa con todos los campeones desde 1974. Es la primera vez que LEGO usa tantas piezas en color oro real (laqueado y moldeado) en un solo set.',
    iconic: true,
  },
  {
    id: 43018,
    category: 'premium',
    title: 'Lionel Messi · Celebration',
    subtitle: 'Set premium wall display · 14+',
    pieces: 0,
    price: '199,99 $',
    priceUSD: 199.99,
    ages: '14+',
    release: '1 junio 2026',
    description:
      'El segundo set tope de gama de la colección: Messi Celebration en formato wall display. Reproduce el momento del 18 de diciembre de 2022 cuando Messi alza la Copa del Mundo en Doha. Pieza pensada para AFOL y fans del Mundial 2022. Llega 10 días antes del partido inaugural en el Estadio Azteca.',
    iconic: true,
  },
  {
    id: 43015,
    category: 'legend',
    title: 'Lionel Messi · Soccer Legend',
    subtitle: 'Buildable figure · 958 piezas',
    pieces: 958,
    price: '79,99 $',
    priceUSD: 79.99,
    ages: '12+',
    release: '1 mayo 2026',
    description:
      'Figura buildable de Messi en pose de victoria apuntando al cielo (gol marcado) o en pose de regate dinámico. 958 piezas. Base con la albiceleste argentina, placa con firma y CR-style stats. Set complementario al 43016 (Cristiano).',
    iconic: true,
  },
  {
    id: 43016,
    category: 'legend',
    title: 'Cristiano Ronaldo · Soccer Legend',
    subtitle: 'Buildable figure · 854 piezas',
    pieces: 854,
    price: '79,99 $',
    priceUSD: 79.99,
    ages: '12+',
    release: '1 mayo 2026',
    description:
      'Figura buildable de Cristiano de 25 × 23 × 13 cm con dos posibilidades de construcción: pose «Siuuu» de celebración o chilena (bicycle kick). 854 piezas. Cara co-moldeada, dorsal 7, balón nuevo elemento, gran fondo CR7 y placa de firma. Es la primera vez que Cristiano y Messi coexisten oficialmente en LEGO.',
    iconic: true,
  },
  {
    id: 43011,
    category: 'highlight',
    title: 'Lionel Messi · Soccer Highlights',
    subtitle: 'Diorama · 500 piezas',
    pieces: 500,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena con base que forma la inicial de Messi, los colores de la albiceleste argentina, dorsal 10 grande, red de portería y mini-construcción de hitos de carrera. Minifigura Messi en pose goleadora y placa con stats. Easter eggs ocultos por toda la pieza. 500 piezas, 13 cm alto × 24 cm ancho.',
  },
  {
    id: 43012,
    category: 'highlight',
    title: 'Cristiano Ronaldo · Soccer Highlights',
    subtitle: 'Diorama · escena Siuuu',
    pieces: 0,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena «Siuuu» con Cristiano celebrando un gol. Base con forma de letra en colores portugueses. Minifigura LEGO con la 7 al pecho y placa identificativa con stats.',
    asin: 'B0FPXGJL6H',
  },
  {
    id: 43013,
    category: 'highlight',
    title: 'Kylian Mbappé · Soccer Highlights',
    subtitle: 'Diorama · 490 piezas',
    pieces: 490,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena de Mbappé en carrera explosiva con la 10 de Francia. Base con la inicial de Mbappé, colores azules de Les Bleus y dorsal 10 buildable. Minifigura LEGO en pose goleadora con placa de stats y firma. 490 piezas.',
  },
  {
    id: 43027,
    category: 'highlight',
    title: 'Vinícius Jr · Soccer Highlights',
    subtitle: 'Diorama · 510 piezas',
    pieces: 510,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena de Vini Jr con base en forma de la inicial V, colores verde-amarillo de Brasil y dorsal 7. Minifigura LEGO con su corte característico, pose goleadora y placa con stats y firma. Easter eggs de su carrera. 510 piezas.',
  },
  {
    id: 43032,
    category: 'merch',
    title: 'FIFA World Cup 2026 · Official Emblem',
    subtitle: 'Logo oficial display',
    pieces: 298,
    price: '24,99 $',
    priceUSD: 24.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Reproducción semi-3D del Trofeo del Mundial con un panel plano colorido y el «26» del logo oficial FIFA. 298 piezas. Base de display dedicada y gancho para colgar en pared. Exclusiva de LEGO.com / LEGO Store.',
  },
  {
    id: 43033,
    category: 'merch',
    title: 'U.S. Soccer National Team Jersey',
    subtitle: 'Camiseta USA en LEGO',
    pieces: 167,
    price: '24,99 $',
    priceUSD: 24.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Reproducción de la camiseta titular de Estados Unidos para el Mundial 2026 (anfitriones) en formato wall display. 167 piezas. Exclusiva de LEGO.com / LEGO Store. Pensado para el mercado USA pero coleccionable.',
  },
];

const FAQ = [
  {
    q: '¿Cuántos sets LEGO Mundial 2026 hay?',
    a: 'Diez sets oficiales en la colección LEGO Editions FIFA World Cup 2026. Se dividen en cuatro categorías: dos «Football Legend» (Messi 43015 y Cristiano 43016, 79,99 $), cuatro «Football Highlights» (Messi 43011, Cristiano 43012, Mbappé 43013, Vinicius 43027 a 29,99 $), dos sets premium display (Trophy oficial 43020 y Messi Celebration 43018 a 199,99 $) y dos merchandising (emblema 43032 y camiseta USA 43033 a 24,99 $).',
  },
  {
    q: '¿Cuándo salen los LEGO del Mundial 2026?',
    a: 'El Trophy 43020 abrió pre-order en marzo de 2026. Los Football Legend (43015, 43016), Football Highlights (43011, 43012, 43013, 43027), emblema (43032) y camiseta USA (43033) llegan el 1 de mayo. El Messi Celebration (43018) wall display sale el 1 de junio. Distribución global: USA, España, Reino Unido y Alemania primero; LATAM (México, Argentina, Brasil) 1-2 semanas más tarde.',
  },
  {
    q: '¿Cuánto cuesta el set LEGO de Messi?',
    a: 'Messi tiene tres sets en la colección: «Football Highlights» 43011 a 29,99 $ (500 piezas), «Football Legend» 43015 a 79,99 $ (958 piezas, figura buildable) y «Messi Celebration» 43018 a 199,99 $ (wall display premium, sale el 1 de junio). Cristiano Ronaldo tiene equivalencia en los dos primeros: 43012 (29,99 $) y 43016 (79,99 $, 854 piezas).',
  },
  {
    q: '¿Dónde comprar los LEGO del Mundial 2026?',
    a: 'LEGO.com es el canal oficial principal con stock garantizado y los exclusivos (emblema 43032 y camiseta USA 43033 SOLO aquí). Amazon vende los demás sets (los enlazamos arriba con afiliación nuus-21). FNAC, El Corte Inglés y Toys’R’Us reciben stock a partir del 5-15 de mayo. En México: Liverpool, Sears, Costco. En Brasil: Ri Happy, Lojas Americanas.',
  },
  {
    q: '¿Cuál es el LEGO más caro y más barato del Mundial 2026?',
    a: 'Los más caros son el Trophy oficial 43020 (2.842 piezas) y el Messi Celebration 43018, ambos a 199,99 $ / 179,99 €. Los más asequibles son el FIFA World Cup 2026 Official Emblem (43032, 298 piezas) y la camiseta USA (43033, 167 piezas), ambos a 24,99 $ y exclusivos de LEGO.com. En el rango medio están las Football Legend de Messi y Cristiano (79,99 $) y los Football Highlights (29,99 $).',
  },
  {
    q: '¿Cuántas piezas tiene el set LEGO Trophy 43020?',
    a: '2.842 piezas. Es la primera vez en la historia de LEGO que se utilizan tantas piezas en color oro real (laqueado y moldeado) en un solo set. Mide 36 cm de altura, recomendado para 12+. Incluye un compartimento secreto en la esfera superior con el logo del Mundial 2026 dentro y una placa con todos los campeones desde 1974. ASIN Amazon: B0FMYYGFQF.',
  },
  {
    q: '¿Qué jugadores aparecen en LEGO Mundial 2026?',
    a: 'Los cuatro embajadores de la colección son Lionel Messi (Argentina, 3 sets: 43011, 43015, 43018), Cristiano Ronaldo (Portugal, 2 sets: 43012, 43016), Kylian Mbappé (Francia, set 43013) y Vinícius Jr (Brasil, set 43027).',
  },
  {
    q: '¿Hay set LEGO de la selección española para el Mundial 2026?',
    a: 'No en la primera ola. Esta primera tanda solo incluye un set de selección nacional: USA (anfitriona, set 43033). LEGO podría ampliar la colección con más selecciones cabezas de serie según ventas, una vez avance el torneo. Es la dinámica habitual de LEGO Editions: lanzar una primera ola, medir ventas y ampliar.',
  },
];

export default async function LegoMundial2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'LEGO Mundial 2026: los 9 sets oficiales con Messi, Ronaldo, Mbappé y Vinicius',
    description:
      'Catálogo completo y precios de la colección LEGO FIFA World Cup 2026.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-04',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/lego-mundial-2026'),
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
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'LEGO Mundial 2026', path: '/coleccionismo/lego-mundial-2026' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Coleccionismo
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Boxes className="h-4 w-4" />
          <span>9 sets oficiales · LEGO Editions</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          LEGO Mundial<br />2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          La colección oficial LEGO × FIFA World Cup 2026 trae <strong className="text-[var(--color-fg)]">10 sets</strong> con los cuatro grandes embajadores: <strong className="text-[var(--color-fg)]">Messi, Cristiano Ronaldo, Mbappé y Vinícius Jr</strong>. Dos sets premium a 199,99 $: el <strong className="text-[var(--color-fg)]">Trofeo del Mundial 1:1 (43020, 2.842 piezas)</strong> ya con pre-order activa desde marzo, y el <strong className="text-[var(--color-fg)]">Messi Celebration (43018)</strong> que llega el 1 de junio. El resto sale el 1 de mayo. Precios desde 24,99 $.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={LEGO_CATEGORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90"
          >
            Ver toda la colección en LEGO.com
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <ul className="mt-12 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Sets totales', value: '10' },
            { label: 'Precio mínimo', value: '24,99 $' },
            { label: 'Trophy 1:1', value: '2.842 piezas' },
            { label: 'Lanzamiento', value: '1 mayo 2026' },
          ].map((f) => (
            <li
              key={f.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {f.label}
              </div>
              <div className="mt-2 font-display text-2xl tab-num text-[var(--color-pitch)]">
                {f.value}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="relative aspect-[2/1] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-yellow-400 via-amber-500 to-red-600">
          <Image
            src="https://commons.wikimedia.org/wiki/Special:FilePath/LEGO_logo.svg?width=1200"
            alt="Logo oficial de LEGO, marca que ha lanzado nueve sets dedicados al Mundial 2026 con Messi, Ronaldo, Mbappé y Vinicius Jr"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain p-16 md:p-24"
            unoptimized
          />
          <span className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-red-600">
            × FIFA 2026
          </span>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Catálogo completo
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">Los 9 sets uno a uno</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LEGO_SETS.map((s) => (
            <article
              key={s.id}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    <span>Set {s.id}</span>
                    <span>·</span>
                    <span>Edad {s.ages}</span>
                    {s.pieces > 0 && (
                      <>
                        <span>·</span>
                        <span>{s.pieces} piezas</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{s.release}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl uppercase text-[var(--color-fg)]">
                    {s.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                    {s.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl tab-num text-[var(--color-pitch)]">
                    {s.price}
                  </div>
                  {s.iconic && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-pitch)]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                      <Star className="h-3 w-3" />
                      Top
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {s.description}
              </p>

              {s.category === 'merch' ? (
                <a
                  href={LEGO_CATEGORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  Exclusiva LEGO.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <a
                  href={amazonForSet(s)}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  {s.asin ? 'Comprar en Amazon.es' : 'Ver en Amazon.es'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs text-[var(--color-fg-subtle)]">
          Enlaces a Amazon España con afiliación nuus-21. Los ASINs son globales (mismos en .com/.es/.de) pero la disponibilidad puede variar; si Amazon.es no tiene stock, te redirige a la búsqueda del producto. Para los exclusivos LEGO.com (emblema 43032 y camiseta USA 43033) el botón va directo a la tienda oficial.
        </p>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Football Highlights',
              count: 4,
              price: '29,99 $',
              detail: 'Dioramas para 10+ con minifigura. Messi, Cristiano, Mbappé, Vinicius.',
            },
            {
              label: 'Football Legend',
              count: 2,
              price: '79,99 $',
              detail: 'Buildable figures 854-958 piezas. Messi y Cristiano.',
            },
            {
              label: 'Merchandising',
              count: 2,
              price: '24,99 $',
              detail: 'Emblema (43032) y camiseta USA (43033). Exclusivos LEGO.com.',
            },
            {
              label: 'Premium Display',
              count: 2,
              price: '199,99 $',
              detail: 'Trofeo 1:1 (43020 · 2.842 piezas) y Messi Celebration (43018).',
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {c.label}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-display text-3xl tab-num">{c.count}</span>
                <span className="font-mono text-xs tab-num text-[var(--color-fg-muted)]">
                  desde {c.price}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
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

      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-7 md:p-10 text-center">
          <h2 className="font-display text-2xl uppercase">Comprar en LEGO.com</h2>
          <p className="mt-3 max-w-xl mx-auto text-[var(--color-fg-muted)]">
            Stock garantizado del catálogo completo y exclusiva del Messi Celebration. Envío oficial LEGO con tracking.
          </p>
          <a
            href={LEGO_CATEGORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90"
          >
            Ver colección Mundial 2026
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando coleccionismo</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Panini Mundial 2026
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Cromos más caros
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Figurinhas Copa 2026
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/favoritos-ganar-mundial')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Favoritos al Mundial
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

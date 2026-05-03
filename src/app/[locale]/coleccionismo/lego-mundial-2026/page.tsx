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

// Helper Amazon Associates con tag nuus-21 (programa propio del proyecto).
const AMAZON_TAG = 'nuus-21';
function amazon(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
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
    title: 'LEGO Mundial 2026: los 9 sets oficiales con Messi, Ronaldo, Mbappé y Vinicius',
    description:
      'Catálogo completo de la colección LEGO FIFA World Cup 2026: nueve sets oficiales con Messi (43015), Cristiano Ronaldo (43016), Mbappé (43013), Vinícius Jr (43027), el emblema oficial (43032), camiseta USA y el set premium Messi Celebration (1.427 piezas, 199,99 $). Precios, números de set, fechas de lanzamiento y dónde comprar.',
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
    id: 43015,
    category: 'legend',
    title: 'Lionel Messi · Soccer Legend',
    subtitle: 'Buildable figure articulada',
    pieces: 0,
    price: '79,99 $',
    priceUSD: 79.99,
    ages: '18+',
    release: '1 mayo 2026',
    description:
      'Figura articulable de Messi de unos 25 cm en pose de remate. Base con la senyera celeste y blanca y placa identificativa. Articulación de hombros, codos y rodillas para variantes de pose. Set complementario al 43016 (Cristiano).',
    iconic: true,
  },
  {
    id: 43016,
    category: 'legend',
    title: 'Cristiano Ronaldo · Soccer Legend',
    subtitle: 'Buildable figure articulada',
    pieces: 0,
    price: '79,99 $',
    priceUSD: 79.99,
    ages: '18+',
    release: '1 mayo 2026',
    description:
      'Figura articulable de Cristiano de unos 25 cm en pose de chilena. Base con los colores rojo-verde portugueses y placa identificativa. Es la primera vez que Cristiano y Messi coexisten en una línea LEGO oficial.',
    iconic: true,
  },
  {
    id: 43011,
    category: 'highlight',
    title: 'Lionel Messi · Football Highlights',
    subtitle: 'Diorama escena icónica',
    pieces: 0,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena cinemática de Messi con la copa en alto, montada sobre base con forma de letra. Incluye minifigura LEGO con los colores argentinos. Detalles del trofeo, la cinta de capitán y placa de coleccionista.',
  },
  {
    id: 43012,
    category: 'highlight',
    title: 'Cristiano Ronaldo · Football Highlights',
    subtitle: 'Diorama escena icónica',
    pieces: 0,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena «Siuuu» con Cristiano celebrando un gol. Base con forma de letra en colores portugueses. Minifigura LEGO con la 7 al pecho y placa identificativa.',
  },
  {
    id: 43013,
    category: 'highlight',
    title: 'Kylian Mbappé · Football Highlights',
    subtitle: 'Diorama escena icónica',
    pieces: 0,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Escena de Mbappé en su carrera explosiva con la 10 de Francia. Base con forma de letra con franjas azules. Incluye minifigura LEGO y placa coleccionista.',
  },
  {
    id: 43027,
    category: 'highlight',
    title: 'Vinícius Jr · Football Highlights',
    subtitle: 'Diorama escena icónica',
    pieces: 0,
    price: '29,99 $',
    priceUSD: 29.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Vini Jr en mitad de un regate con los colores brasileños. Base con forma de letra en verde-amarillo. Minifigura LEGO con su corte de pelo característico y placa identificativa.',
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
      'Reproducción del logo oficial del Mundial 2026 con la copa estilizada y los colores corporativos del torneo. 298 piezas, formato display de mesa o estantería. Es el set más asequible de la línea, ideal como entrada al cluster.',
  },
  {
    id: 43030,
    category: 'merch',
    title: 'U.S. Soccer National Team Jersey',
    subtitle: 'Camiseta USA en LEGO',
    pieces: 167,
    price: '24,99 $',
    priceUSD: 24.99,
    ages: '10+',
    release: '1 mayo 2026',
    description:
      'Reproducción de la camiseta titular de Estados Unidos para el Mundial 2026 (anfitriones) en formato wall display. 167 piezas. Pensado para mercado USA pero coleccionable como pieza temática del torneo.',
  },
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
    asin: 'B0FMYYGFQF',
    iconic: true,
  },
];

const FAQ = [
  {
    q: '¿Cuántos sets LEGO Mundial 2026 hay?',
    a: 'Nueve sets oficiales en la colección LEGO Editions FIFA World Cup 2026. Se dividen en cuatro categorías: dos «Football Legend» (figuras articuladas, 79,99 $), cuatro «Football Highlights» (dioramas, 29,99 $), dos sets de merchandising temático (emblema y camiseta USA, 24,99 $) y un set premium «Official Trophy» (43020) con 2.842 piezas en réplica 1:1 a 199,99 $ / 179,99 €.',
  },
  {
    q: '¿Cuándo salen los LEGO del Mundial 2026?',
    a: 'El Trophy 43020 abrió pre-order en marzo de 2026. Los ocho sets restantes (Football Legend, Highlights, emblema y camiseta USA) llegan el 1 de mayo de 2026. Distribución global: USA, España, Reino Unido y Alemania primero; LATAM (México, Argentina, Brasil) 1-2 semanas más tarde.',
  },
  {
    q: '¿Cuánto cuesta el set LEGO de Messi?',
    a: 'Messi tiene dos sets en la colección: el «Football Highlights» 43011 a 29,99 $ (diorama escena icónica) y el «Football Legend» 43015 a 79,99 $ (figura articulada de 25 cm). El set tope de gama, el LEGO Trophy oficial (43020), no es de Messi sino una réplica 1:1 del trofeo del Mundial: 2.842 piezas a 199,99 $.',
  },
  {
    q: '¿Dónde comprar los LEGO del Mundial 2026?',
    a: 'LEGO.com es el canal oficial principal con stock garantizado. Amazon España, FNAC, El Corte Inglés y Toys’R’Us reciben stock a partir del 5-15 de mayo. En México: Liverpool, Sears y Costco. En Brasil: Ri Happy y Lojas Americanas. En Argentina: Distribuidores oficiales de LEGO.',
  },
  {
    q: '¿Cuál es el LEGO más caro y más barato del Mundial 2026?',
    a: 'El más caro es el Trophy oficial 43020 (réplica 1:1 con 2.842 piezas) a 199,99 $ / 179,99 €. Los más asequibles son el FIFA World Cup 2026 Official Emblem (43032, 298 piezas) y la camiseta USA, ambos a 24,99 $ (≈23 €). En el rango medio están las figuras Football Legend de Messi y Cristiano (79,99 $) y los dioramas Football Highlights (29,99 $).',
  },
  {
    q: '¿Cuántas piezas tiene el set LEGO Trophy 43020?',
    a: '2.842 piezas. Es la primera vez en la historia de LEGO que se utilizan tantas piezas en color oro real (laqueado y moldeado) en un solo set. Mide 36 cm de altura, recomendado para 12+. Incluye un compartimento secreto en la esfera superior con el logo del Mundial 2026 dentro y una placa con todos los campeones desde 1974.',
  },
  {
    q: '¿Qué jugadores aparecen en LEGO Mundial 2026?',
    a: 'Los cuatro embajadores de la colección son Lionel Messi (Argentina), Cristiano Ronaldo (Portugal), Kylian Mbappé (Francia) y Vinícius Jr (Brasil). Cada uno tiene su set individual «Football Highlights» a 29,99 $. Messi y Cristiano además tienen su versión premium «Football Legend» (79,99 $) y Messi añade el set tope con su Celebration de 199,99 $.',
  },
  {
    q: '¿Hay set LEGO de la selección española para el Mundial 2026?',
    a: 'No en la primera ola. Esta primera tanda solo incluye un set de selección nacional: USA (anfitriona). LEGO podría ampliar la colección con más selecciones cabezas de serie según ventas, una vez avance el torneo. Es la dinámica habitual de LEGO Editions: lanzar una primera ola, medir ventas y ampliar.',
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
          La colección oficial LEGO × FIFA World Cup 2026 trae <strong className="text-[var(--color-fg)]">nueve sets</strong> con los cuatro grandes embajadores: <strong className="text-[var(--color-fg)]">Messi, Cristiano Ronaldo, Mbappé y Vinícius Jr</strong>. Precios desde 24,99 $ (emblema oficial) hasta los 199,99 $ del set premium Messi Celebration con 1.427 piezas. Pre-órdenes abiertas, llegada a tiendas el 1 de mayo y el set tope el 1 de junio, justo antes del partido inaugural en el Estadio Azteca.
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
            { label: 'Sets totales', value: '9' },
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

              {s.asin ? (
                <a
                  href={amazon(s.asin)}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  Comprar en Amazon
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <a
                  href={LEGO_CATEGORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  Ver en LEGO.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs text-[var(--color-fg-subtle)]">
          Enlaces a Amazon España con afiliación nuus-21 cuando hay ASIN confirmado, y a LEGO.com en el resto. Precios y disponibilidad pueden variar por región.
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
              detail: 'Buildable figures articulables 25 cm. Messi y Cristiano.',
            },
            {
              label: 'Merchandising',
              count: 2,
              price: '24,99 $',
              detail: 'Emblema oficial 43032 y camiseta USA.',
            },
            {
              label: 'Premium Trophy 1:1',
              count: 1,
              price: '199,99 $',
              detail: 'Réplica del trofeo, 2.842 piezas, 36 cm. Set 43020.',
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

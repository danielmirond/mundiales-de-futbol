import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
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
  const t = await getTranslations({ locale, namespace: 'pages.panini' });
  return pageMetadata({
    locale,
    path: '/coleccionismo/panini-mundial-2026',
    title: t('title'),
    description:
      t('description'),
    keywords: [
      'álbum Panini Mundial 2026',
      'cromos Mundial 2026',
      'sobres Panini Mundial 2026',
      'cuándo sale álbum Mundial 2026',
      'precio cromos Panini 2026',
      'intercambio cromos Mundial',
      'edición especial Panini',
    ],
  });
}

const FAQ = [
  {
    q: '¿Cuándo sale el álbum Panini del Mundial 2026?',
    a: 'Panini suele lanzar el álbum oficial entre 4 y 6 semanas antes del partido inaugural. Para Qatar 2022 salió el 11 de octubre de 2022 (primer partido el 20 de noviembre). Para 2026, la fecha previsible es la primera quincena de mayo, antes del 11 de junio.',
  },
  {
    q: '¿Cuánto costará el álbum del Mundial 2026?',
    a: 'Los precios históricos: álbum tapa blanda 2-4 €, sobres 1 € (5 cromos), caja completa de 50 sobres 50-65 €. Para 2026 se espera continuidad con incrementos del 5-10%. La colección completa suele rondar los 670-700 cromos, con coste de coleccionar entera entre 300 € y 600 € según suerte.',
  },
  {
    q: '¿Dónde comprar cromos Panini Mundial 2026?',
    a: 'Los canales habituales: kioscos y tiendas de prensa, librerías, Carrefour, Toys R Us, El Corte Inglés, y online en Amazon ES y la tienda oficial de Panini. Para cromos sueltos o intercambios: Mercadolibre/Wallapop, Cardmarket y comunidades de Telegram especializadas.',
  },
  {
    q: '¿Cuáles son los cromos más buscados del Mundial?',
    a: 'Históricamente los cromos rookie de jóvenes promesas que luego son estrellas (Mbappé en 2018, Yamal/Endrick en 2026), los cromos legendarios (Pelé, Maradona en eds. especiales), las parejas de capitanes, los cromos hologramas/foil de los 32-48 equipos, y las llamadas "leyendas" o "iconos" de la edición.',
  },
  {
    q: '¿Hay edición especial coleccionista?',
    a: 'Panini suele publicar varias versiones: tapa blanda (la popular), tapa dura/hardcover, edición lujo coleccionista limitada, ediciones por país y la "Top Class" o XXL. La edición lujo de Qatar 2022 (1.200 unidades) cuesta hoy más de 500 € en mercado secundario.',
  },
  {
    q: '¿Vale la pena comprar la caja entera de sobres?',
    a: 'Estadísticamente sí: una caja de 50 sobres trae 250 cromos sin repetidos (con suerte) y completa entre el 35 % y el 50 % del álbum. Comprándolo paquete a paquete sale más caro y con más repes. Para coleccionistas serios la caja es la mejor opción.',
  },
  {
    q: '¿Cómo funcionan los intercambios?',
    a: 'En España los grupos de Telegram y Wallapop son los canales más activos. Se publica el listado de "tengo / falto" y se intercambia por correo postal o presencialmente en ferias. La ética habitual: 1×1 (un cromo por uno tuyo), salvo legends/foils que valen 3×1 o 5×1.',
  },
];

export default async function PaniniMundial2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Productos Panini ya en catálogo (de momento Qatar 2022 verificado)
  const paniniProducts = AMAZON_PRODUCTS.filter(
    (p) => p.title.toLowerCase().includes('panini') || p.title.toLowerCase().includes('cromo'),
  );

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Panini Mundial 2026: álbum, cromos, precios y dónde comprar',
    description:
      'Guía completa del álbum Panini para el Mundial 2026: fecha de salida, precios, ediciones especiales, cromos más buscados e intercambios.',
    author: { '@type': 'Organization', name: 'Mundial de Fútbol' },
    publisher: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: localeUrl(locale, '/'),
    },
    datePublished: '2026-04-26',
    dateModified: '2026-04-26',
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
            La colección oficial de cromos del primer Mundial de 48 selecciones.
            Fecha de salida, precios, ediciones especiales, cromos más buscados
            y dónde encontrarlos en España. Actualizado a abril 2026.
          </p>
        </div>
      </section>

      {/* Aviso fecha salida */}
      <section className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">El álbum oficial 2026 todavía no está a la venta.</strong>{' '}
            Salida prevista la primera quincena de mayo. Mientras tanto, dejamos
            referencia del Panini Qatar 2022 (mismo formato, último Mundial), y
            actualizaremos esta página con ASIN del álbum 2026 en cuanto esté disponible.
          </p>
        </div>
      </section>

      {/* Datos clave */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Datos rápidos
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          La colección 2026 en cifras
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Selecciones', value: '48' },
            { label: 'Cromos previstos', value: '~700' },
            { label: 'Sobres × cromos', value: '5' },
            { label: 'Precio sobre', value: '~1 €' },
          ].map((s) => (
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
          title="Comprar Panini en Amazon"
          subtitle="Mientras esperamos el álbum oficial 2026, las colecciones de Mundiales anteriores siguen disponibles para coleccionistas."
        />
      )}

      {/* Cromos más buscados */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Top cromos del torneo
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Los más buscados (predicción)
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          A falta de oficial, estos son los cromos que históricamente generan más
          tirones de demanda y se valoran por encima del resto:
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            { name: 'Lamine Yamal', team: 'España', why: 'Promesa europea, primer Mundial' },
            { name: 'Endrick', team: 'Brasil', why: 'Rookie 2006, primer Mundial' },
            { name: 'Lionel Messi', team: 'Argentina', why: 'Despedida (probable último Mundial)' },
            { name: 'Cristiano Ronaldo', team: 'Portugal', why: 'Despedida confirmada (último)' },
            { name: 'Kylian Mbappé', team: 'Francia', why: 'Capitán + iconic class' },
            { name: 'Pedri', team: 'España', why: 'Primer Mundial completo (no jugó 22 lesionado)' },
            { name: 'Foil capitanes', team: '12 grupos', why: 'Edición foil de los 12 capitanes cabeza de serie' },
            { name: 'Logo FIFA Trophy', team: 'Especial', why: 'Cromo holograma del trofeo, siempre top' },
          ].map((c) => (
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
      </section>

      <div className="h-24" />
    </article>
  );
}

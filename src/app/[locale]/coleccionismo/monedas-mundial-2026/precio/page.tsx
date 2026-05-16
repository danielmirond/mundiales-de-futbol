import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Banknote, TrendingUp } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { COINS_MEXICO, COINS_CANADA } from '@/lib/wc-2026-coins';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/monedas-mundial-2026/precio',
    title: 'Precio de las monedas del Mundial 2026 · Bimetálicas, plata y oro Banxico',
    description:
      'Cuánto cuestan las monedas conmemorativas del Mundial 2026: bimetálicas $20 MXN al precio facial, plata $10 MXN (~60 USD mercado), oro $25 MXN (~2.500 USD mercado). Tabla completa con revalorización esperada.',
    keywords: [
      'precio monedas mundial 2026',
      'cuanto cuestan monedas mundial 2026',
      'precio moneda banxico mundial',
      'precio moneda plata mundial 2026',
      'precio moneda oro mundial 2026',
      'valor monedas mundial 2026',
      'cuanto vale moneda mundial 2026',
    ],
    type: 'article',
  });
}

const TIPOS = [
  {
    nombre: 'Bimetálicas',
    facial: '$20 MXN',
    facialUsd: '~1 USD',
    mercado: 'Precio facial sin sobrecoste',
    tirada: '5 millones × 4 diseños = 20 millones',
    audiencia: 'Para empezar la colección. Coleccionismo casual.',
    revalorizacion: 'Mínima los primeros 5 años. Las del Mundial 1986 hoy se cotizan a 5-10x facial.',
  },
  {
    nombre: 'Plata fina',
    facial: '$10 MXN',
    facialUsd: '~0,5 USD facial',
    mercado: '~60 USD por unidad (precio Casa de Moneda con estuche)',
    tirada: '100.000 × 4 diseños = 400.000',
    audiencia: 'Coleccionista entusiasta. Buen equilibrio precio / valor.',
    revalorizacion: '10-30% el primer año. Vinculada al precio internacional de la plata.',
  },
  {
    nombre: 'Oro fino',
    facial: '$25 MXN',
    facialUsd: '~1,5 USD facial',
    mercado: '~2.500 USD por unidad (precio Casa de Moneda con estuche y certificado)',
    tirada: '5.000 × 4 diseños = 20.000',
    audiencia: 'Coleccionista premium / inversor.',
    revalorizacion: 'Histórico Mundial 1986: 3.000-8.000 USD según conservación. Proyección 2030: 5.000-12.000 USD.',
  },
  {
    nombre: 'Loonie canadiense',
    facial: '$1 CAD',
    facialUsd: '~0,7 USD',
    mercado: 'Precio facial (versión tradicional) · 5-15 CAD (versión coloreada en set)',
    tirada: '1M tradicional + 2M coloreada = 3M total',
    audiencia: 'Colección complementaria. Recuerdo del torneo en Canadá.',
    revalorizacion: 'Las versiones coloreadas en estuche oficial pueden alcanzar 20-30 CAD en 3-5 años.',
  },
];

const SETS = [
  {
    nombre: 'Set 3 monedas plata (CDMX + Guadalajara + Monterrey)',
    precio: '~180 USD',
    detalle: 'Las 3 ciudades sede mexicanas en plata fina, estuche oficial Casa de Moneda.',
  },
  {
    nombre: 'Set 4 monedas plata completo',
    precio: '~240 USD',
    detalle: 'Las 4 monedas de plata $10 (CDMX + Guadalajara + Monterrey + México anfitrión).',
  },
  {
    nombre: 'Set 4 monedas oro completo',
    precio: '~10.000 USD',
    detalle: 'Las 4 monedas de oro $25 en estuche premium con certificado individual. Edición numerada.',
  },
  {
    nombre: 'Set 12 monedas completo (bimetálicas + plata + oro)',
    precio: '~10.300 USD',
    detalle: 'La colección entera Banxico en estuche grande. Limitado a 1.000 sets numerados.',
  },
];

export default async function PrecioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Precio de las monedas del Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026/precio'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
            { name: 'Precio', path: '/coleccionismo/monedas-mundial-2026/precio' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Monedas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Banknote className="mr-2 inline h-3 w-3" /> Tabla de precios oficial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Cuánto cuestan las monedas del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Los precios oficiales arrancan en el valor facial de <strong>$20 MXN</strong>
          (~1 USD) para las bimetálicas y trepan hasta <strong>2.500 USD</strong>
          por las monedas de oro fino. Aquí está el desglose por tipo + sets
          recomendados.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Precio por tipo de moneda</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tipo</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">Facial</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">Mercado</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tirada</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Audiencia</th>
              </tr>
            </thead>
            <tbody>
              {TIPOS.map((t, i) => (
                <tr key={t.nombre} className={i % 2 === 0 ? 'bg-[var(--color-bg)]/40' : ''}>
                  <td className="px-5 py-3 font-display text-sm uppercase">{t.nombre}</td>
                  <td className="px-5 py-3 text-[var(--color-pitch)]">
                    {t.facial}
                    <div className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{t.facialUsd}</div>
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg)]">{t.mercado}</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{t.tirada}</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{t.audiencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Revalorización */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <TrendingUp className="mr-2 inline h-3 w-3" /> Revalorización esperada
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase">¿Suben de precio con el tiempo?</h2>
          <div className="mt-4 space-y-3">
            {TIPOS.map((t) => (
              <div key={t.nombre} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="font-display text-sm uppercase">{t.nombre}</div>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{t.revalorizacion}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong>Comparativa histórica</strong>: Banxico emitió en 1985-1986
            una serie similar para México 86. Las monedas de oro de esa serie
            (acuñadas hace 40 años) se subastan hoy entre <strong>3.000 y 8.000 USD</strong> según
            conservación y diseño específico. Las de plata, entre 80 y 300 USD.
            Si Banxico mantiene el patrón, las del Mundial 2026 son apuesta
            sólida para coleccionistas a 5-10 años vista.
          </p>
        </div>
      </section>

      {/* Sets coleccionista */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Sets coleccionista (precio orientativo)</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          La Casa de Moneda de México ofrece estuches pre-armados con varias
          monedas. Útil para comprar todo de una vez sin perseguir piezas
          sueltas.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {SETS.map((s) => (
            <div key={s.nombre} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-base uppercase">{s.nombre}</h3>
                <span className="font-mono text-base text-[var(--color-pitch)]">{s.precio}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{s.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/donde-comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/oro')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Oro
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/plata')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Plata
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/banxico')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Banxico
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/canada')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Canadá
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Sparkles, Layers, Star } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene',
    title: 'Cuántos cromos tiene el álbum del Mundial 2026: 980 piezas y 68 especiales',
    description:
      'El álbum Panini Mundial 2026 tiene 980 cromos en 112 páginas: 23 por selección × 48 selecciones, más 68 cromos especiales (foil capitanes, holograma trofeo, leyendas FIFA, Extra Stickers). Desglose completo y comparativa con Mundiales anteriores.',
    keywords: [
      'cuantos cromos tiene el album del mundial 2026',
      'cuantas figuritas tiene el album del mundial 2026',
      'cuantas estampas tiene el album del mundial 2026',
      'quantas figurinhas tem no album da copa de 2026',
      'how many stickers world cup 2026 album',
      'paginas album panini mundial 2026',
      'cromos especiales mundial 2026',
    ],
    type: 'article',
  });
}

const BREAKDOWN = [
  {
    section: 'Selecciones',
    count: 1104,
    detail: '23 cromos × 48 selecciones (escudo + 22 jugadores). Es el bloque mayoritario del álbum.',
    note: 'En la práctica el álbum imprime 912 (19 por selección) y deja huecos para que la edición refleje convocatorias finales.',
  },
  {
    section: 'Cromos especiales (68)',
    count: 68,
    detail: 'Foil de los 12 capitanes cabeza de serie · holograma del Trofeo FIFA · 20 Extra Stickers en 4 variantes de color (las más raras del álbum) · 12 cromos Coca-Cola (botellas) · cromos FIFA Legends · momentos icónicos · póster fin de álbum.',
    note: '20 son ultra-raros (1 por cada 100 sobres en algunas variantes).',
  },
  {
    section: 'Pegatinas Coca-Cola',
    count: 12,
    detail: 'Cromos exclusivos en doble página que solo se obtienen comprando botellas Coca-Cola promocionales desde mediados de mayo 2026.',
    note: 'Cuentan dentro del total especial pero requieren un canal externo.',
  },
];

const COMPARATIVA = [
  { year: 1970, host: 'México', stickers: 271, teams: 16 },
  { year: 1982, host: 'España', stickers: 427, teams: 24 },
  { year: 1990, host: 'Italia', stickers: 446, teams: 24 },
  { year: 1998, host: 'Francia', stickers: 568, teams: 32, note: 'Primera con 32 equipos' },
  { year: 2010, host: 'Sudáfrica', stickers: 638, teams: 32 },
  { year: 2014, host: 'Brasil', stickers: 640, teams: 32 },
  { year: 2018, host: 'Rusia', stickers: 670, teams: 32 },
  { year: 2022, host: 'Catar', stickers: 670, teams: 32, note: 'Mismo formato que 2018' },
  { year: 2026, host: 'USA·MEX·CAN', stickers: 980, teams: 48, note: 'Mayor álbum de la historia' },
];

const FAQ = [
  {
    q: '¿Cuántos cromos tiene el álbum del Mundial 2026?',
    a: 'El álbum Panini Mundial 2026 tiene 980 cromos en total, repartidos en 112 páginas. Es el mayor álbum de la historia, un 46 % más grande que los Mundiales 2018 y 2022 (670 cromos cada uno). El crecimiento responde a la expansión del torneo a 48 selecciones.',
  },
  {
    q: '¿Cuántos cromos por selección hay en el álbum?',
    a: 'En la versión española estándar hay 19 cromos por selección (escudo + 18 jugadores), aunque la cifra teórica de la convocatoria FIFA son 26 jugadores. La diferencia se cubre con Update Stickers que Panini saca después del lanzamiento, con jugadores y dorsales finales.',
  },
  {
    q: '¿Cuántos cromos especiales tiene el álbum?',
    a: 'Hay 68 cromos especiales en material premium: 12 foil de capitanes cabeza de serie, holograma del Trofeo FIFA, 20 Extra Stickers en 4 variantes de color (las más raras: 1 por cada 100 sobres en algunas), 12 cromos Coca-Cola exclusivos de botellas, FIFA Legends y póster final.',
  },
  {
    q: '¿Cuántas páginas tiene el álbum?',
    a: '112 páginas en la versión tapa blanda y tapa dura estándar. Las ediciones especiales (oro/dorado, lujo numerada) pueden añadir páginas con material extra de coleccionista, pero el tronco del álbum mantiene siempre las 112 páginas.',
  },
  {
    q: '¿Cuánto cuesta completar el álbum del Mundial 2026?',
    a: 'Completar el álbum sin intercambios cuesta entre 800 y 1.200 € en España (980 cromos / 5 por sobre × 1 €/sobre, asumiendo repeticiones estadísticas reales). Con grupos de Telegram y plataformas de intercambio (Wallapop, Cardmarket) baja a 350-500 €. La caja de 50 sobres a 80 € cubre solo el 35-50 % del álbum.',
  },
  {
    q: '¿Es más grande que el álbum del Mundial Qatar 2022?',
    a: 'Sí. Qatar 2022 tenía 670 cromos en 80 páginas. El Mundial 2026 tiene 980 cromos en 112 páginas: 310 cromos más y 32 páginas extras. Cifras oficiales Panini.',
  },
];

export default async function CuantosCromosTiene({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '¿Cuántos cromos tiene el álbum del Mundial 2026? 980 piezas y 68 especiales',
    description: 'Desglose completo de los 980 cromos del álbum Panini Mundial 2026 + comparativa histórica.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene'),
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
              name: 'Cuántos cromos tiene',
              path: '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene',
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
          <Layers className="h-4 w-4" />
          <span>Desglose oficial · 980 cromos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          ¿Cuántos cromos
          <br />tiene el álbum?
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El álbum Panini Mundial 2026 trae <strong className="text-[var(--color-fg)]">980 cromos</strong> repartidos en{' '}
          <strong className="text-[var(--color-fg)]">112 páginas</strong>: 19 por cada una de las 48 selecciones, más 68 cromos especiales (foil de capitanes, holograma del Trofeo FIFA, Extra Stickers, FIFA Legends y la promo Coca-Cola). Es el mayor álbum mundialista de la historia, un 46 % superior a los 670 de Qatar 2022.
        </p>

        <ul className="mt-12 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Cromos totales', value: '980' },
            { label: 'Páginas', value: '112' },
            { label: 'Selecciones', value: '48' },
            { label: 'Especiales', value: '68' },
          ].map((f) => (
            <li
              key={f.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {f.label}
              </div>
              <div className="mt-2 font-display text-3xl tab-num text-[var(--color-pitch)]">
                {f.value}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Sparkles className="inline h-3 w-3 mr-2" />
          Desglose
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">Cómo se reparten los 980 cromos</h2>

        <div className="mt-8 space-y-4">
          {BREAKDOWN.map((b) => (
            <article
              key={b.section}
              className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:grid-cols-[5rem_1fr] md:items-start md:p-8"
            >
              <div className="font-display text-4xl tab-num text-[var(--color-pitch)] md:text-5xl">
                {b.count}
              </div>
              <div>
                <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">
                  {b.section}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                  {b.detail}
                </p>
                <p className="mt-3 font-mono text-xs text-[var(--color-fg-subtle)]">
                  Nota · {b.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Star className="inline h-3 w-3 mr-2" />
          Comparativa
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">
          Cómo se compara con álbumes anteriores
        </h2>
        <p className="mt-4 max-w-3xl text-[var(--color-fg-muted)]">
          La expansión del Mundial a 48 selecciones convierte el álbum 2026 en el mayor de la historia. Por contexto: hubo que esperar 56 años, desde México 1970 (271 cromos), para llegar a los 980 actuales.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-2)]">
              <tr>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Mundial
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Sede
                </th>
                <th className="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Selecciones
                </th>
                <th className="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Cromos
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Hito
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {COMPARATIVA.map((row) => (
                <tr
                  key={row.year}
                  className={row.year === 2026 ? 'bg-[var(--color-pitch)]/5' : ''}
                >
                  <td className="px-5 py-3 font-mono tab-num">{row.year}</td>
                  <td className="px-5 py-3">{row.host}</td>
                  <td className="px-5 py-3 text-right font-mono tab-num">{row.teams}</td>
                  <td className="px-5 py-3 text-right font-mono tab-num font-semibold">
                    {row.stickers}
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--color-fg-muted)]">
                    {row.note ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        title="Comprar el álbum y los cromos"
        subtitle="Caja oficial, sobres sueltos y álbum tapa blanda/dura disponibles en Amazon España (afiliación nuus-21)."
      />

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando el cluster</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Cuánto cuesta
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Cromos más caros
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/digital')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Versión digital
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/coca-cola')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Promo Coca-Cola
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

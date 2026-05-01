import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Crown, Star } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/cromos-mas-caros',
    title:
      'Cromos más caros y difíciles del Panini Mundial 2026: rookies, foil y holograma',
    description:
      'Los cromos más caros y difíciles del álbum Panini Mundial 2026: Lamine Yamal y Endrick (rookies), Messi y Cristiano Ronaldo (despedida), foil de capitanes, holograma del Trofeo y Extra Stickers en 4 colores. Cotización en mercado secundario.',
    keywords: [
      'cromos más caros panini mundial 2026',
      'cromos más difíciles panini mundial 2026',
      'cromos rookie panini mundial 2026',
      'cromo lamine yamal panini',
      'cromo messi panini 2026',
      'cromo holograma trofeo fifa',
    ],
    type: 'article',
  });
}

const STICKERS = [
  { rank: 1, name: 'Extra Stickers (4 colores)', team: 'Limitada', why: '20 cromos exclusivos en 4 variantes de color (80 totales). Inserción aleatoria 1 por cada 100 sobres. Los más raros del álbum.', price: '50-200 € unidad', rarity: 'Muy alta' },
  { rank: 2, name: 'Logo FIFA Trophy holograma', team: 'Especial', why: 'Cromo holograma del trofeo. En Qatar 2022 llegó a 60-100 € en mercado secundario. Pieza icónica.', price: '80-150 €', rarity: 'Muy alta' },
  { rank: 3, name: 'Lamine Yamal · rookie', team: 'España', why: 'Primera Copa del Mundo. Promesa europea, se proyecta como el cromo rookie más valioso del torneo, comparable al Mbappé 2018.', price: '40-100 €', rarity: 'Alta' },
  { rank: 4, name: 'Endrick · rookie', team: 'Brasil', why: 'Promesa brasileña en su primer Mundial. Categoría rookie clásica. Histórico: los rookies brasileños son los que más se revalorizan.', price: '30-80 €', rarity: 'Alta' },
  { rank: 5, name: 'Foil capitanes (12 países)', team: '12 cabezas de serie', why: 'Capitanes en material foil de los 12 grupos cabeza de serie. Estadística: salir en 1 de cada 30 sobres aprox.', price: '15-50 € c/u', rarity: 'Alta' },
  { rank: 6, name: 'Lionel Messi · despedida', team: 'Argentina', why: 'Posible último Mundial. Cromo de cierre de carrera con valor sentimental enorme entre coleccionistas argentinos.', price: '25-70 €', rarity: 'Media-alta' },
  { rank: 7, name: 'Cristiano Ronaldo · despedida', team: 'Portugal', why: 'Quinto y último Mundial confirmado. Demanda en mercado portugués e internacional.', price: '20-60 €', rarity: 'Media-alta' },
  { rank: 8, name: 'Kylian Mbappé · iconic', team: 'Francia', why: 'Capitán de Francia, Bota de Oro 2022 (8 goles). Cromos en categoría iconic class y/o foil. Ídolo global.', price: '15-40 €', rarity: 'Media' },
  { rank: 9, name: 'Pedri · primer Mundial completo', team: 'España', why: 'Tras lesión en 2022, primer Mundial completo. Cromo «debut sénior» con tracción en mercado español.', price: '8-20 €', rarity: 'Media' },
  { rank: 10, name: 'Cromos Cabo Verde (toda la selección)', team: 'Cabo Verde', why: 'Primera Copa del Mundo de la historia de Cabo Verde. Toda la plantilla son cromos «debut sénior» y atraen a coleccionistas africanos y caboverdianos en diáspora.', price: '5-15 € c/u', rarity: 'Media' },
];

const FAQ = [
  { q: '¿Cuánto cuesta el cromo más caro del Panini Mundial 2026?', a: 'Los Extra Stickers en color «especial» (1/100 sobres) cotizan entre 50 y 200 € por unidad en mercado secundario, según el jugador. El holograma del Trofeo FIFA llega a los 100-150 €. Estos precios son las primeras valoraciones publicadas a 2 mayo 2026 (Infobae, Portafolio).' },
  { q: '¿Por qué Lamine Yamal vale más que Messi?', a: 'Económicamente todavía no, pero la PROYECCIÓN es esa. Los cromos rookie de jóvenes promesas son los que más se revalorizan a 5-10 años. Mbappé 2018 (rookie) hoy vale más que Mbappé 2022. Yamal sigue ese patrón.' },
  { q: '¿Dónde verificar el precio real de los cromos?', a: 'Cardmarket (Europa), eBay (USA), Mercado Libre (LATAM) y Catawiki para subastas. Los grupos de Telegram «Panini Mundial 2026 ES» también tienen un sistema de precio comunitario (1×1 estándar, 3×1 para foils, negociación libre para top).' },
];

export default async function CromosMasCaros({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Top 10 cromos más caros y difíciles del Panini Mundial 2026',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros'),
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <article className="pt-32">
      <JsonLd data={[articleLd, faqLd, breadcrumbLd(locale, [
        { name: 'Inicio', path: '/' },
        { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
        { name: 'Cromos más caros', path: '/coleccionismo/panini-mundial-2026/cromos-mas-caros' },
      ])]} />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Crown className="h-4 w-4" /><span>Top 10 · valor mercado</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">Los cromos<br />más caros</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Cotización estimada en mercado secundario de los 10 cromos más caros y difíciles del álbum Panini Mundial 2026, según primeras valoraciones publicadas por Infobae, Portafolio y Huffington Post (mayo 2026).
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10 space-y-3">
        {STICKERS.map((s) => (
          <article key={s.rank} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl tab-num text-[var(--color-fg-subtle)]">#{String(s.rank).padStart(2, '0')}</span>
                <h3 className="font-display text-xl uppercase text-[var(--color-fg)] md:text-2xl">{s.name}</h3>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">{s.team}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{s.why}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-[var(--color-fg-subtle)]">Precio mercado <span className="text-[var(--color-fg)]">{s.price}</span></span>
              <span className="text-[var(--color-fg-subtle)]">Rareza <span className="text-[var(--color-fg)]">{s.rarity}</span></span>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">Preguntas frecuentes</div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">Lo que más se pregunta</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Precio por país</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/tapa-dura')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Edición tapa dura</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

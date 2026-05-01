import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Swords } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/topps-vs-panini',
    title:
      'Topps vs Panini Mundial 2026: ¿qué álbum elegir? Comparativa coleccionista',
    description:
      'Comparativa entre el álbum Panini Mundial 2026 (oficial FIFA) y la línea de cartas Topps World Cup 2026: precios, formato, cobertura, valor de inversión y cuál te conviene si eres coleccionista nuevo o veterano.',
    keywords: [
      'topps world cup 2026',
      'topps vs panini mundial 2026',
      'topps mundial 2026',
      'topps fifa 2026',
      'cartas topps mundial 2026',
    ],
    type: 'article',
  });
}

const COMPARISON = [
  { feature: 'Tipo de producto', panini: 'Álbum + cromos adhesivos (sticker album)', topps: 'Cartas coleccionables (trading cards) + álbum carpeta' },
  { feature: 'Licencia FIFA', panini: 'Sí, oficial FIFA y FIFPro', topps: 'Sí, licencia FIFA paralela' },
  { feature: 'Total cromos/cartas', panini: '980 cromos en 112 páginas', topps: 'Set base ~400 cartas + variantes y especiales' },
  { feature: 'Categorías especiales', panini: '68 cromos premium + Extra Stickers (1/100) + Coca-Cola exclusivos', topps: 'Refractor, autógrafos numerados, parallels (oro, rojo, azul, etc.)' },
  { feature: 'Precio sobre', panini: '~1 €', topps: '~3-5 € (pack de 8 cartas)' },
  { feature: 'Tipo de mercado', panini: 'Coleccionismo popular masivo, álbum tradicional', topps: 'Coleccionismo premium / inversión, cartas individuales' },
  { feature: 'Mercado secundario', panini: 'Wallapop, Mercado Libre, Telegram, Cardmarket', topps: 'eBay, COMC, PWCC (subastas tipo NBA cards)' },
  { feature: 'Audiencia', panini: 'Familias, kioscos, niños y nostálgicos', topps: 'Coleccionistas USA-style, traders, inversores' },
  { feature: 'Versión digital', panini: 'FIFA Panini Digital Album (gratis, app)', topps: 'Topps Disney+ NFT no aplica para Mundial; existen NFT Topps Bunt' },
  { feature: 'Coste para completar', panini: '800-1.200 € sin intercambios', topps: '500-3.000 € según categorías y autógrafos' },
];

export default async function ToppsPanini({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: 'Topps vs Panini Mundial 2026: comparativa para coleccionistas',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/topps-vs-panini'),
  };

  return (
    <article className="pt-32">
      <JsonLd data={[articleLd, breadcrumbLd(locale, [
        { name: 'Inicio', path: '/' },
        { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
        { name: 'Topps vs Panini', path: '/coleccionismo/panini-mundial-2026/topps-vs-panini' },
      ])]} />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Swords className="h-4 w-4" /><span>Comparativa coleccionismo</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">Topps vs<br />Panini 2026</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Por primera vez en años, Topps lanza una línea oficial paralela al álbum Panini para el Mundial 2026. Aquí la comparativa completa: precios, formato, mercado secundario y cuál encaja mejor con tu perfil de coleccionista.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4 w-[28%]">Característica</th>
                <th className="px-4 py-4">Panini</th>
                <th className="px-4 py-4 hidden md:table-cell">Topps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {COMPARISON.map((c) => (
                <tr key={c.feature} className="hover:bg-[var(--color-bg-2)]/40 align-top">
                  <td className="px-4 py-4 font-mono text-xs text-[var(--color-fg-subtle)] uppercase tracking-widest">{c.feature}</td>
                  <td className="px-4 py-4 text-[var(--color-fg-muted)]">{c.panini}</td>
                  <td className="px-4 py-4 text-[var(--color-fg-muted)] hidden md:table-cell">{c.topps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-8">
            <h2 className="font-display text-2xl uppercase">Quédate con Panini si...</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-fg-muted)]">
              <li>· Eres coleccionista nostálgico (creciste con Panini en cada Mundial).</li>
              <li>· Quieres llenar UN álbum de cabo a rabo, no acumular cartas individuales.</li>
              <li>· Tu presupuesto es limitado y prefieres entrada baja (1 € sobre).</li>
              <li>· Vas a coleccionar con tus hijos / sobrinos.</li>
              <li>· Quieres comunidad masiva en español (Telegram, Wallapop).</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-8">
            <h2 className="font-display text-2xl uppercase">Quédate con Topps si...</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-fg-muted)]">
              <li>· Vienes del coleccionismo USA (NBA, NFL, MLB cards) y quieres familiaridad de formato.</li>
              <li>· Te interesan los autógrafos numerados, refractors y parallels.</li>
              <li>· Coleccionar cartas como inversión a largo plazo está en tu plan.</li>
              <li>· Te gusta el «pack opening» como experiencia (¿qué saldrá?).</li>
              <li>· Tu mercado de venta es eBay USA o subastas premium.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">¿Y si quieres ambos?</h2>
          <p className="mt-4 text-sm text-[var(--color-fg-muted)] md:text-base">
            La estrategia óptima de coleccionismo serio: <strong className="text-[var(--color-fg)]">Panini para llenar el álbum tradicional</strong> (memoria + comunidad masiva) <strong className="text-[var(--color-fg)]">+ Topps en cartas selectivas</strong> de tus jugadores favoritos en versión refractor o autografiada (inversión a 5-10 años). El total ronda los 1.200-2.000 € sin contar autógrafos premium.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Cromos más caros</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Pillar Panini 2026</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

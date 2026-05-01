import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/cuando-sale',
    title: 'Cuándo sale el álbum Panini Mundial 2026: fechas por país',
    description:
      'Cuándo sale el álbum Panini Mundial 2026 en cada mercado: España (30 abril), Estados Unidos (30 abril), México (2 mayo), Latinoamérica, Reino Unido y Adrenalyn XL. Calendario oficial de lanzamientos.',
    keywords: [
      'cuándo sale el álbum panini mundial 2026',
      'fecha de lanzamiento panini mundial 2026',
      'cuando sale el album panini mundial 2026 en usa',
      'álbum mundial 2026 panini cuando sale',
      'panini adrenalyn xl mundial 2026 fecha',
    ],
    type: 'article',
  });
}

const RELEASES = [
  { country: 'España', flag: '🇪🇸', date: '30 abril 2026', via: 'Panini.es y kioscos · Día 1 disponible online y en El Corte Inglés' },
  { country: 'Estados Unidos', flag: '🇺🇸', date: '30 abril 2026', via: 'Panini America (paniniamerica.net) y Target · Walmart desde 5 mayo' },
  { country: 'Reino Unido', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', date: '30 abril 2026', via: 'WHSmith, Tesco y Sainsbury\'s · Sticker pack incluido en revistas Match el día 1' },
  { country: 'Latinoamérica (oficial)', flag: '🌎', date: '2 mayo 2026', via: 'México, Argentina, Colombia, Chile, Ecuador, Perú · Lanzamiento simultáneo' },
  { country: 'México', flag: '🇲🇽', date: '2 mayo 2026', via: 'Sanborns y Walmart · Promoción Coca-Cola desde mediados de mayo' },
  { country: 'Argentina', flag: '🇦🇷', date: '2 mayo 2026', via: 'Distribuidor oficial Tienda Mosca · Kioscos a partir del 5 mayo' },
  { country: 'Brasil', flag: '🇧🇷', date: '2 mayo 2026', via: 'Distribuidores oficiales · Versión adaptada (con Neymar excluido)' },
  { country: 'Colombia', flag: '🇨🇴', date: '2 mayo 2026', via: 'Éxito, Carulla y Olímpica' },
  { country: 'Resto del mundo', flag: '🌍', date: 'Mayo 2026 (rolling)', via: 'África, Asia y Oceanía con calendario escalonado en mayo' },
];

const RELATED_DATES = [
  {
    label: 'Adrenalyn XL Mundial 2026',
    date: '15 mayo 2026',
    detail: 'La línea de cromos coleccionables tipo trading card de Panini, con cartas estadísticas y especiales. Va en paralelo al álbum stickers tradicional.',
  },
  {
    label: 'Promoción Coca-Cola',
    date: 'Mediados de mayo 2026',
    detail: '12 cromos exclusivos en doble página. Aparecen dentro de etiquetas seleccionadas de botellas Coca-Cola desde mediados de mayo.',
  },
  {
    label: 'App digital FIFA Panini Digital Album',
    date: 'Disponible desde 30 abril',
    detail: 'Versión virtual gratuita para iOS y Android. Cada sobre físico incluye un código de un solo uso para cromos digitales adicionales.',
  },
  {
    label: 'Edición tapa dura premium',
    date: 'Mayo-junio 2026',
    detail: 'Lanzamiento secundario de la edición de lujo coleccionista (tapa dura, edición numerada, 1.500 unidades).',
  },
  {
    label: 'Cierre de colección',
    date: '11 junio 2026',
    detail: 'Tras el partido inaugural Mundial 2026 (México vs Sudáfrica en el Estadio Azteca), la demanda de los cromos rookie y especiales se dispara. Es el último momento para pillar caja a precio retail.',
  },
];

export default async function CuandoSale({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cuándo sale el álbum Panini Mundial 2026: fechas oficiales por país',
    description: 'Calendario completo de lanzamientos del álbum Panini Mundial 2026: España y USA el 30 abril, LATAM el 2 mayo, Adrenalyn XL en mayo, promo Coca-Cola y app digital.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    dateModified: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/cuando-sale'),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Cuándo sale', path: '/coleccionismo/panini-mundial-2026/cuando-sale' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Calendar className="h-4 w-4" />
          <span>Calendario de lanzamientos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">Cuándo sale el<br />Panini 2026</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Salida confirmada el <strong className="text-[var(--color-fg)]">30 de abril de 2026</strong> en España, Estados Unidos y Reino Unido. Latinoamérica recibió el lanzamiento dos días después. Calendario completo por país, junto a las fechas de Adrenalyn XL, app digital y promo Coca-Cola.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">Mercado</th>
                <th className="px-4 py-4">Fecha</th>
                <th className="px-4 py-4 hidden md:table-cell">Canal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {RELEASES.map((r) => (
                <tr key={r.country} className="hover:bg-[var(--color-bg-2)]/40">
                  <td className="px-4 py-3 font-mono text-[var(--color-fg)]"><span aria-hidden className="mr-2">{r.flag}</span>{r.country}</td>
                  <td className="px-4 py-3 text-[var(--color-pitch)]">{r.date}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-fg-muted)] hidden md:table-cell">{r.via}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">Fechas asociadas</div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">Lanzamientos relacionados</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {RELATED_DATES.map((d) => (
            <li key={d.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg uppercase text-[var(--color-fg)]">{d.label}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">{d.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{d.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Dónde comprar</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Precio por país</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/digital')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">App digital</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

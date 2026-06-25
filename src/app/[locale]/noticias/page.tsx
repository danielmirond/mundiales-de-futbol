import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Newspaper } from 'lucide-react';
import { NEWS_ITEMS, relativeTimeEs, newsImageUrl, newsImageAlt, type NewsCategory } from '@/lib/news';

// SSR: el filtro publishedAt <= now necesita evaluarse en cada request,
// no en build time, para que los artículos programados aparezcan solos.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  panini: 'Panini',
  convocatorias: 'Convocatorias',
  sedes: 'Sedes',
  entradas: 'Entradas',
  jugadores: 'Jugadores',
  mascotas: 'Mascotas',
  ceremonia: 'Ceremonia',
  polemica: 'Polémica',
  tv: 'TV / Streaming',
  patrocinios: 'Patrocinios',
  amistosos: 'Amistosos',
  lesiones: 'Lesiones',
  tecnico: 'Cuerpo técnico',
  general: 'General',
  historica: 'Historia',
  curiosa: 'Curiosidades',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/noticias',
    title:
      'Noticias Mundial 2026: Panini, convocatorias, sedes, TV y mucho más',
    description:
      'Lo último del Mundial 2026 contado en propio: convocatorias, álbum Panini, sedes, entradas, partido inaugural, derechos de TV y polémicas. Resumen editorial con citas a fuentes verificadas.',
    keywords: [
      'noticias Mundial 2026',
      'últimas noticias Copa Mundial 2026',
      'novedades Mundial 2026',
      'álbum Panini Mundial 2026 noticia',
      'convocatoria Mundial 2026 noticia',
      'partido inaugural Mundial 2026',
    ],
  });
}

export default async function NoticiasIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Publicación programada: solo mostrar artículos con publishedAt en el pasado
  const now = new Date().toISOString();
  const items = [...NEWS_ITEMS]
    .filter((n) => n.publishedAt <= now)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Noticias Mundial 2026',
    url: localeUrl(locale, '/noticias'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Cobertura editorial diaria de noticias del Mundial de Fútbol 2026 (Norteamérica).',
    hasPart: items.map((n) => ({
      '@type': 'NewsArticle',
      headline: n.title,
      datePublished: n.publishedAt,
      url: localeUrl(locale, `/noticias/${n.slug}`),
    })),
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Noticias', path: '/noticias' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Inicio
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Newspaper className="h-4 w-4" />
          <span>Noticias · Mundial 2026</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Noticias del<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Lo último del Mundial 2026 contado en formato editorial propio.
          Convocatorias, álbum Panini, sedes, derechos de TV, polémicas y
          datos verificados con citas a las fuentes originales.
        </p>
      </header>

      <ul className="mx-auto mt-16 grid w-full max-w-[1400px] gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] px-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {items.map((n) => (
          <li key={n.slug} className="bg-[var(--color-bg)]">
            <Link
              href={withLocale(locale as Locale, `/noticias/${n.slug}`)}
              className="group flex h-full flex-col overflow-hidden transition-colors hover:bg-[var(--color-bg-2)]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-2)]">
                {/* Placeholder siempre visible detrás de la foto */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in oklch, var(--color-pitch) 12%, var(--color-bg-2)), var(--color-bg-2))`,
                  }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--color-pitch)] opacity-70">
                    {CATEGORY_LABELS[n.category]}
                  </span>
                  <span className="font-display text-5xl font-semibold uppercase text-[var(--color-fg)] opacity-[0.06] leading-none text-center px-4 line-clamp-2">
                    {n.title}
                  </span>
                </div>
                <Image
                  src={newsImageUrl(n)}
                  alt={newsImageAlt(n)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <span className="absolute left-3 top-3 rounded-full bg-[var(--color-pitch)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-black z-10">
                  {CATEGORY_LABELS[n.category]}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {relativeTimeEs(n.publishedAt)}
                </span>

                <h2 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] group-hover:text-[var(--color-pitch)] transition-colors md:text-xl">
                  {n.title}
                </h2>

                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">
                  {n.summary}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">
                  Leer artículo completo
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="h-24" />
    </div>
  );
}

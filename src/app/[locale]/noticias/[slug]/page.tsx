import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { marked } from 'marked';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import {
  NEWS_ITEMS,
  getNewsBySlug,
  getLocalizedNews,
  getRelatedNews,
  relativeTimeEs,
  newsImageUrl,
  newsImageAlt,
  type NewsCategory,
} from '@/lib/news';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { MovistarCintillo } from '@/components/affiliate/movistar-banner';
import { DaznBanner } from '@/components/affiliate/dazn-banner';
import { getMovistarLink } from '@/lib/movistar-match-links';

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

export function generateStaticParams() {
  return NEWS_ITEMS.flatMap((n) =>
    routing.locales.map((locale) => ({ locale, slug: n.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  const loc = getLocalizedNews(item, locale);
  // Locales disponibles: siempre español + los que tengan i18n rellenado.
  const availableLocales = ['es', ...Object.keys(item.i18n ?? {})];

  return pageMetadata({
    locale,
    path: `/noticias/${item.slug}`,
    title: loc.title,
    description: loc.summary,
    type: 'article',
    publishedTime: item.publishedAt,
    modifiedTime: item.modifiedAt ?? item.publishedAt,
    availableLocales,
    keywords: [
      `Mundial 2026 ${CATEGORY_LABELS[item.category]}`,
      'noticias Mundial 2026',
      loc.title.split(':')[0].trim(),
    ],
  });
}

export default async function NoticiaDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const loc = getLocalizedNews(item, locale);
  const related = getRelatedNews(slug, 3);
  const url = localeUrl(locale, `/noticias/${item.slug}`);

  // Movistar Plus+ match link (specific ficha or generic fallback)
  const movistarLink = getMovistarLink(slug);
  // El cintillo M+ se muestra en TODOS los artículos: en los de horario/TV
  // con el link y thumbnail del partido, y en el resto con el cintillo general.
  const showMovistarCard = true;

  // NewsArticle JSON-LD (recomendado para Google News y Discover).
  // image: usamos la URL del OG dinámico (opengraph-image.tsx adyacente)
  // que garantiza 1200×675, en lugar de la URL Wikimedia original que
  // conserva el aspect ratio del archivo y suele NO ser 16:9.
  const ogImageUrl = `${SEO.siteUrl}${
    locale === routing.defaultLocale
      ? `/noticias/${item.slug}/opengraph-image`
      : `/${locale}/noticias/${item.slug}/opengraph-image`
  }`;
  // Mapeo de categoría → sección editorial (articleSection requerido por Google)
  const ARTICLE_SECTIONS: Record<string, string> = {
    convocatorias: 'Convocatorias',
    historica: 'Historia del fútbol',
    curiosa: 'Curiosidades',
    sedes: 'Sedes y estadios',
    tv: 'Televisión y streaming',
    jugadores: 'Jugadores',
    amistosos: 'Partidos y amistosos',
    lesiones: 'Lesiones',
    polemica: 'Polémicas',
    patrocinios: 'Patrocinios',
    panini: 'Álbum Panini',
    entradas: 'Entradas',
    general: 'Mundial 2026',
  };

  const newsArticleLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    // Campos obligatorios Google News
    headline: loc.title,                              // máx 110 chars
    description: loc.summary,
    datePublished: item.publishedAt,                  // ISO 8601 completo con Z
    dateModified: item.modifiedAt ?? item.publishedAt,
    // Identificación
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: locale,
    // Imagen: OG dinámico 1200×675 garantizado — Google requiere ≥696px ancho
    image: [
      {
        '@type': 'ImageObject',
        url: ogImageUrl,
        width: 1200,
        height: 675,
        representativeOfPage: true,
      },
      // Imagen real del artículo si existe (alternativa para Rich Results)
      ...(item.image ? [{
        '@type': 'ImageObject',
        url: item.image.url,
        caption: item.image.alt,
      }] : []),
    ],
    // Publisher: Organization con logo válido (Google requiere logo ≤ 600×60)
    publisher: {
      '@type': 'Organization',
      name: SEO.siteName,
      url: SEO.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO.siteUrl}/icon.svg`,
        width: 60,
        height: 60,
      },
      sameAs: [SEO.siteUrl],
    },
    // Author: Organization (redacción propia). Google acepta Person u Organization.
    author: [
      {
        '@type': 'Organization',
        name: SEO.siteName,
        url: SEO.siteUrl,
      },
    ],
    // Sección editorial (articleSection mejora clasificación en Google News)
    articleSection: ARTICLE_SECTIONS[item.category] ?? 'Mundial 2026',
    // Acceso libre (importante para Google News)
    isAccessibleForFree: true,
    // Tema principal
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
      location: {
        '@type': 'Country',
        name: 'United States, Mexico, Canada',
      },
    },
    // Fuentes — usamos citation como array de CreativeWork (válido en schema.org)
    citation: [
      {
        '@type': 'NewsArticle',
        name: item.sourceName,
        url: item.sourceUrl,
      },
      ...(item.sourcesSecondary ?? []).map((s) => ({
        '@type': 'NewsArticle',
        name: s.name,
        url: s.url,
      })),
    ],
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          newsArticleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Noticias', path: '/noticias' },
            { name: loc.title, path: `/noticias/${item.slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[900px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/noticias')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Noticias
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em]">
          <span className="rounded-full bg-[var(--color-pitch)]/10 px-3 py-1 text-[var(--color-pitch)]">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[var(--color-fg-subtle)]">
            <Calendar className="h-3 w-3" />
            {relativeTimeEs(item.publishedAt)}
          </span>
        </div>

        <h1 className="mt-6 font-display text-4xl uppercase leading-[1] text-[var(--color-fg)] md:text-5xl">
          {loc.title}
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {loc.summary}
        </p>
      </header>

      {/* Hero image (16:9) — foto propia o tarjeta de marca generada */}
      <figure className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <Image
            src={newsImageUrl(item)}
            alt={newsImageAlt(item)}
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
        {(item.image?.credit || item.image?.license) && (
          <figcaption className="mt-3 px-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            {item.image.credit}
            {item.image.credit && item.image.license ? ' · ' : ''}
            {item.image.license}
          </figcaption>
        )}
      </figure>

      {/* Video embed (si la noticia tiene youtubeVideoId) */}
      {item.youtubeVideoId && (
        <section className="mx-auto mt-10 w-full max-w-[900px] px-6 md:px-10">
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeVideoId}?rel=0&modestbranding=1`}
                title={loc.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              Video oficial · YouTube
            </p>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="mx-auto mt-12 w-full max-w-[900px] px-6 md:px-10">
        <div
          className="
            article-body
            text-base leading-relaxed text-[var(--color-fg)] md:text-lg
            [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:leading-tight [&_h2]:text-[var(--color-fg)] [&_h2]:md:text-3xl
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:uppercase [&_h3]:leading-tight [&_h3]:text-[var(--color-fg)]
            [&_p]:mb-5 [&_p]:last:mb-0
            [&_strong]:font-semibold [&_strong]:text-[var(--color-fg)]
            [&_em]:italic [&_em]:text-[var(--color-fg-muted)]
            [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:pl-0 [&_ul]:list-none
            [&_ul_li]:flex [&_ul_li]:gap-2 [&_ul_li]:before:content-['—'] [&_ul_li]:before:text-[var(--color-pitch)] [&_ul_li]:before:flex-none
            [&_ol]:my-4 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal
            [&_ol_li]:pl-1
            [&_a]:text-[var(--color-pitch)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-80
            [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-pitch)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--color-fg-muted)] [&_blockquote]:my-6
            [&_hr]:my-8 [&_hr]:border-[var(--color-border)]
            [&_code]:font-mono [&_code]:text-sm [&_code]:bg-[var(--color-bg-2)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
          "
          dangerouslySetInnerHTML={{
            __html: (marked.parse(loc.body, { gfm: true, breaks: false }) as string)
              // Enlaces de afiliado (AWIN/Movistar) → sponsored + nueva pestaña.
              .replace(
                /<a href="(https:\/\/www\.awin1\.com[^"]*)"/g,
                '<a href="$1" target="_blank" rel="sponsored nofollow noopener noreferrer"',
              ),
          }}
        />
      </section>

      {/* Movistar Plus+ cintillo oficial — en todos los artículos */}
      {showMovistarCard && (
        <section className="mx-auto mt-10 w-full max-w-[900px] px-6 md:px-10">
          <MovistarCintillo
            href={movistarLink.href}
            context={movistarLink.label || undefined}
            matchId={movistarLink.matchId}
          />
        </section>
      )}

      {/* Banner DAZN — en las piezas de "cuándo juega" (dónde ver) */}
      {slug.startsWith('cuando-juega-') && (
        <section className="mx-auto mt-6 w-full max-w-[900px] px-6 md:px-10">
          <DaznBanner creative="leaderboard" />
        </section>
      )}

      {/* Fuentes */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Fuentes
          </div>
          <ul className="mt-4 space-y-3 text-sm md:text-base">
            <li>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-2 font-medium text-[var(--color-fg)] underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
              >
                {item.sourceName}
                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
              </a>
              <span className="ml-2 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Fuente principal · {item.sourceLang}
              </span>
            </li>
            {item.sourcesSecondary?.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-2 text-[var(--color-fg-muted)] underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
                >
                  {s.name}
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            Resumen y body editorial propio. Citamos las fuentes originales y
            enlazamos al artículo de cada medio. No reproducimos su contenido.
          </p>
        </div>
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más sobre {CATEGORY_LABELS[item.category]}
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Relacionadas
          </h2>

          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={withLocale(locale as Locale, `/noticias/${r.slug}`)}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/40"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    {relativeTimeEs(r.publishedAt)}
                  </span>
                  <h3 className="font-display text-base uppercase leading-tight text-[var(--color-fg)] group-hover:text-[var(--color-pitch)] transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)] line-clamp-3">
                    {r.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue al día</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/noticias')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Todas las noticias
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Hub Mundial 2026
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Calendario por fase
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

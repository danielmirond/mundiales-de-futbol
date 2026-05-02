import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import {
  NEWS_ITEMS,
  getNewsBySlug,
  getRelatedNews,
  relativeTimeEs,
  type NewsCategory,
} from '@/lib/news';
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
  general: 'General',
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

  return pageMetadata({
    locale,
    path: `/noticias/${item.slug}`,
    title: item.title,
    description: item.summary,
    type: 'article',
    publishedTime: item.publishedAt,
    modifiedTime: item.modifiedAt ?? item.publishedAt,
    keywords: [
      `Mundial 2026 ${CATEGORY_LABELS[item.category]}`,
      'noticias Mundial 2026',
      item.title.split(':')[0].trim(),
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

  const related = getRelatedNews(slug, 3);
  const url = localeUrl(locale, `/noticias/${item.slug}`);

  // NewsArticle JSON-LD (recomendado para Google News y Discover).
  const newsArticleLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary,
    datePublished: item.publishedAt,
    dateModified: item.modifiedAt ?? item.publishedAt,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    publisher: {
      '@type': 'Organization',
      name: SEO.siteName,
      url: SEO.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO.siteUrl}/icon.svg`,
      },
    },
    author: {
      '@type': 'Organization',
      name: SEO.siteName,
      url: SEO.siteUrl,
    },
    citation: [
      {
        '@type': 'CreativeWork',
        name: item.sourceName,
        url: item.sourceUrl,
      },
      ...(item.sourcesSecondary ?? []).map((s) => ({
        '@type': 'CreativeWork',
        name: s.name,
        url: s.url,
      })),
    ],
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          newsArticleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Noticias', path: '/noticias' },
            { name: item.title, path: `/noticias/${item.slug}` },
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
          {item.title}
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {item.summary}
        </p>
      </header>

      {/* Body */}
      <section className="mx-auto mt-12 w-full max-w-[900px] px-6 md:px-10">
        <div className="prose-base space-y-6 text-base leading-relaxed text-[var(--color-fg)] md:text-lg [&_strong]:text-[var(--color-fg)]">
          {item.body.split('\n\n').map((para, i) => (
            <p
              key={i}
              dangerouslySetInnerHTML={{
                __html: para
                  .trim()
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
          ))}
        </div>
      </section>

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

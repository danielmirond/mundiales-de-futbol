import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { NEWS_ITEMS } from '@/lib/news';
import { NewsCard, autoVariant } from '@/components/news/news-card';

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
    name: 'Noticias',
    url: localeUrl(locale, '/noticias'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Crónicas, previas, agenda y clasificaciones de fútbol y baloncesto, y la actualidad de los Mundiales.',
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
          Crónicas, previas, agenda del día y clasificación semanal de las
          competiciones que seguimos, más la actualidad de los Mundiales.
        </p>
      </header>

      <div className="mx-auto mt-14 grid w-full max-w-[1400px] grid-cols-12 gap-x-7 gap-y-11 px-6 md:px-10">
        {items.map((n, i) => (
          <div key={n.slug} className={i === 0 ? 'col-span-12' : 'col-span-12 sm:col-span-6 lg:col-span-4'}>
            <NewsCard n={n} locale={locale as Locale} variant={i === 0 ? 'feat' : autoVariant(n)} priority={i === 0} />
          </div>
        ))}
      </div>

      <div className="h-24" />
    </div>
  );
}

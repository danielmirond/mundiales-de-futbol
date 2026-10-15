import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { NEWS_ITEMS } from '@/lib/news';
import { NewsCard, autoVariant } from '@/components/news/news-card';

// ISR 5 min: el filtro publishedAt <= now se reevalúa en cada regeneración,
// no en build time, para que los artículos programados aparezcan solos.
// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 300;
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
      'Noticias de fútbol y baloncesto: crónicas, previas, agenda y clasificaciones',
    description:
      'Crónicas, previas, agenda del día y clasificación semanal de LaLiga, Champions, Premier, NBA y el resto de competiciones que seguimos, más la actualidad de los Mundiales.',
    keywords: [
      'noticias fútbol',
      'crónicas laliga',
      'previas partidos',
      'partidos de hoy',
      'clasificación laliga',
      'noticias nba',
      'noticias mundiales',
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
    .filter((n) => Date.parse(n.publishedAt) <= Date.parse(now))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

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

        <div className="kicker mt-8 flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          <span>Lo último</span>
        </div>
        <h1 className="t-h1 mt-4 text-[var(--color-fg)]">Noticias</h1>
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

import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Boxes, ExternalLink, Star } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// Enlace a la categoría LEGO oficial (sin afiliado externo).
const LEGO_CATEGORY_URL =
  'https://www.lego.com/en-us/categories/football/football-gifts-toys';

// Helper Amazon Associates con tag nuus-21 (Amazon España).
// Los ASINs son DIFERENTES entre Amazon.com (USA) y Amazon.es (España):
// el mismo set tiene un ASIN distinto en cada marketplace. Para los sets con ASIN
// .es confirmado, enlace directo. Para el resto, búsqueda en .es por número de set
// (siempre funciona y conserva el tracking de afiliación).
const AMAZON_TAG = 'nuus-21';
function amazonByAsin(asin: string): string {
  return `https://www.amazon.es/dp/${asin}?tag=${AMAZON_TAG}`;
}
function amazonSearch(setNumber: number): string {
  return `https://www.amazon.es/s?k=lego+${setNumber}+mundial&tag=${AMAZON_TAG}`;
}
function amazonForSet(set: { id: number; asin?: string }): string {
  return set.asin ? amazonByAsin(set.asin) : amazonSearch(set.id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.legoMundial2026.meta' });
  return pageMetadata({
    locale,
    path: '/coleccionismo/lego-mundial-2026',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
    type: 'article',
  });
}

type LegoSet = {
  id: number;
  category: 'highlight' | 'legend' | 'premium' | 'merch';
  pieces: number;
  price: string;
  priceUSD: number;
  ages: string;
  asin?: string;
  iconic?: boolean;
};

// Datos no-traducibles. Los textos (title/subtitle/description/release) viven
// en messages/<locale>.json bajo pages.legoMundial2026.sets.s<id>.
const LEGO_SETS: LegoSet[] = [
  { id: 43020, category: 'premium', pieces: 2842, price: '199,99 $ / 179,99 €', priceUSD: 199.99, ages: '12+', iconic: true },
  { id: 43018, category: 'premium', pieces: 0, price: '199,99 $', priceUSD: 199.99, ages: '14+', iconic: true },
  { id: 43015, category: 'legend', pieces: 958, price: '79,99 $', priceUSD: 79.99, ages: '12+', iconic: true },
  { id: 43016, category: 'legend', pieces: 854, price: '79,99 $', priceUSD: 79.99, ages: '12+', iconic: true },
  { id: 43011, category: 'highlight', pieces: 500, price: '29,99 $', priceUSD: 29.99, ages: '10+' },
  { id: 43012, category: 'highlight', pieces: 0, price: '29,99 $', priceUSD: 29.99, ages: '10+', asin: 'B0FPXGJL6H' },
  { id: 43013, category: 'highlight', pieces: 490, price: '29,99 $', priceUSD: 29.99, ages: '10+' },
  { id: 43027, category: 'highlight', pieces: 510, price: '29,99 $', priceUSD: 29.99, ages: '10+' },
  { id: 43032, category: 'merch', pieces: 298, price: '24,99 $', priceUSD: 24.99, ages: '10+' },
  { id: 43033, category: 'merch', pieces: 167, price: '24,99 $', priceUSD: 24.99, ages: '10+' },
];

const CATEGORY_SUMMARY = [
  { key: 'highlights', count: 4, price: '29,99 $' },
  { key: 'legend', count: 2, price: '79,99 $' },
  { key: 'merch', count: 2, price: '24,99 $' },
  { key: 'premium', count: 2, price: '199,99 $' },
] as const;

type FaqItem = { q: string; a: string };

export default async function LegoMundial2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.legoMundial2026' });

  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('articleHeadline'),
    description: t('articleDescription'),
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-04',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/lego-mundial-2026'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
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
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.coleccionismo'), path: '/coleccionismo/panini-mundial-2026' },
            { name: t('breadcrumb.lego'), path: '/coleccionismo/lego-mundial-2026' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Boxes className="h-4 w-4" />
          <span>{t('kicker')}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('h1Line1')}<br />{t('h1Line2')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t.rich('intro', {
            strong: (chunks) => <strong className="text-[var(--color-fg)]">{chunks}</strong>,
          })}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={LEGO_CATEGORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90"
          >
            {t('ctaLego')}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <ul className="mt-12 grid gap-3 md:grid-cols-4">
          {(['total', 'minPrice', 'trophy', 'launch'] as const).map((key) => (
            <li
              key={key}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {t(`stats.${key}.label`)}
              </div>
              <div className="mt-2 font-display text-2xl tab-num text-[var(--color-pitch)]">
                {t(`stats.${key}.value`)}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="relative aspect-[2/1] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-yellow-400 via-amber-500 to-red-600">
          <Image
            src="https://commons.wikimedia.org/wiki/Special:FilePath/LEGO_logo.svg?width=1200"
            alt={t('heroImageAlt')}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain p-16 md:p-24"
            unoptimized
          />
          <span className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-red-600">
            {t('heroBadge')}
          </span>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('catalog.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">{t('catalog.h2')}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LEGO_SETS.map((s) => {
            const setKey = `sets.s${s.id}`;
            return (
              <article
                key={s.id}
                className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      <span>{t('catalog.setLabel')} {s.id}</span>
                      <span>·</span>
                      <span>{t('catalog.ageLabel')} {s.ages}</span>
                      {s.pieces > 0 && (
                        <>
                          <span>·</span>
                          <span>{s.pieces} {t('catalog.piecesLabel')}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{t(`${setKey}.release`)}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl uppercase text-[var(--color-fg)]">
                      {t(`${setKey}.title`)}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                      {t(`${setKey}.subtitle`)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl tab-num text-[var(--color-pitch)]">
                      {s.price}
                    </div>
                    {s.iconic && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-pitch)]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                        <Star className="h-3 w-3" />
                        {t('catalog.topLabel')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {t(`${setKey}.description`)}
                </p>

                {s.category === 'merch' ? (
                  <a
                    href={LEGO_CATEGORY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                  >
                    {t('exclusiveLego')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <a
                    href={amazonForSet(s)}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                  >
                    {s.asin ? t('buyAmazon') : t('viewAmazon')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-[var(--color-fg-subtle)]">
          {t('affiliateNotice')}
        </p>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_SUMMARY.map((c) => (
            <div
              key={c.key}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {t(`categories.${c.key}.label`)}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-display text-3xl tab-num">{c.count}</span>
                <span className="font-mono text-xs tab-num text-[var(--color-fg-muted)]">
                  {t('categories.desde')} {c.price}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                {t(`categories.${c.key}.detail`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('faq.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">{t('faq.h2')}</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {faqItems.map(({ q, a }) => (
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

      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-7 md:p-10 text-center">
          <h2 className="font-display text-2xl uppercase">{t('ctaBlock.h2')}</h2>
          <p className="mt-3 max-w-xl mx-auto text-[var(--color-fg-muted)]">
            {t('ctaBlock.intro')}
          </p>
          <a
            href={LEGO_CATEGORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90"
          >
            {t('ctaBlock.cta')}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">{t('related.h2')}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              {t('related.panini')}
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              {t('related.cromosCaros')}
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              {t('related.figurinhas')}
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/favoritos-ganar-mundial')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              {t('related.favoritos')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

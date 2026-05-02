import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Shirt, Star } from 'lucide-react';
import {
  JERSEY_HISTORIES,
  getJerseyHistory,
  type JerseyEntry,
} from '@/lib/wc-jerseys';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { AmazonProductGrid } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return JERSEY_HISTORIES.flatMap((h) =>
    routing.locales.map((locale) => ({ locale, code: h.teamCode })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const history = getJerseyHistory(code);
  if (!history) return {};

  const title = `Camisetas ${history.teamName} en Mundiales: evolución 1930-2026`;
  const description = `Historia y evolución de las camisetas de ${history.teamName} (${history.nickname}) en cada Mundial: marca técnica, color, jugadores icónicos y modelos retro. Desde el debut hasta el Mundial 2026.`;

  return pageMetadata({
    locale,
    path: `/selecciones/${code}/camisetas`,
    title,
    description,
    keywords: [
      `camisetas ${history.teamName} Mundial`,
      `evolución camiseta ${history.teamName}`,
      `${history.nickname} historia camisetas`,
      `camiseta retro ${history.teamName}`,
      `kit ${history.teamName} 2026`,
    ],
    type: 'article',
  });
}

function JerseyCard({ j, baseColor }: { j: JerseyEntry; baseColor: string }) {
  return (
    <article className="grid gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:grid-cols-[280px_1fr] md:p-8">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        {j.imageUrl ? (
          <Image
            src={j.imageUrl}
            alt={j.imageAlt ?? `Camiseta ${j.year}`}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${j.primaryColor}, ${j.secondaryColor ?? baseColor})`,
            }}
          >
            <Shirt className="h-16 w-16 text-white opacity-50" />
          </div>
        )}
        {j.iconic && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-pitch)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-black">
            <Star className="h-3 w-3" />
            Icónica
          </span>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-3 font-mono text-xs uppercase tracking-[0.3em]">
          <span className="font-display text-3xl tab-num text-[var(--color-pitch)]">
            {j.year}
          </span>
          <span className="text-[var(--color-fg-subtle)]">·</span>
          <span className="text-[var(--color-fg)]">{j.brand}</span>
          <span className="text-[var(--color-fg-subtle)]">·</span>
          <span className="text-[var(--color-fg-subtle)]">{j.variant}</span>
        </div>

        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg)]">
          {j.description}
        </p>

        {j.wornBy && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            <Star className="h-3 w-3" />
            {j.wornBy}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="h-3 w-3 rounded-full border border-[var(--color-border)]"
              style={{ background: j.primaryColor }}
            />
            {j.primaryColor}
          </span>
          {j.secondaryColor && (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="h-3 w-3 rounded-full border border-[var(--color-border)]"
                style={{ background: j.secondaryColor }}
              />
              {j.secondaryColor}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function CamisetasPorSeleccion({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const history = getJerseyHistory(code);
  const team = TEAMS_2026[code];
  if (!history || !team) notFound();

  // Productos Amazon relacionados (camisetas retro de la selección).
  const relatedJerseys = AMAZON_PRODUCTS.filter(
    (p) => p.teamCode === code && p.category === 'ropa',
  );

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Camisetas ${history.teamName} en Mundiales: evolución 1930-2026`,
    description: history.intro,
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, `/selecciones/${code}/camisetas`),
    about: {
      '@type': 'SportsTeam',
      name: history.teamName,
      sport: 'Football (Association)',
    },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Selecciones', path: '/selecciones' },
            { name: history.teamName, path: `/selecciones/${code}` },
            { name: 'Camisetas', path: `/selecciones/${code}/camisetas` },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, `/selecciones/${code}`)}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {history.teamName}
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <span className="text-5xl" aria-hidden>{team.flag}</span>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Shirt className="inline h-3 w-3 mr-2" />
              Evolución de camisetas · {history.nickname}
            </div>
            <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
              Camisetas<br />{history.teamName}
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {history.intro}
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10 space-y-6">
        {history.jerseys.map((j) => (
          <JerseyCard key={`${j.year}-${j.variant}`} j={j} baseColor={history.baseColor} />
        ))}
      </section>

      {relatedJerseys.length > 0 && (
        <AmazonProductGrid
          products={relatedJerseys}
          title={`Comprar camisetas de ${history.teamName}`}
          subtitle="Réplicas oficiales y retros disponibles en Amazon España, con afiliación nuus-21."
        />
      )}

      <section className="mx-auto mt-20 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">
            Camisetas de otras selecciones
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {JERSEY_HISTORIES.filter((h) => h.teamCode !== code).map((h) => {
              const t = TEAMS_2026[h.teamCode];
              return (
                <li key={h.teamCode}>
                  <Link
                    href={withLocale(locale as Locale, `/selecciones/${h.teamCode}/camisetas`)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                  >
                    <span aria-hidden>{t?.flag}</span>
                    {h.teamName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Goal } from 'lucide-react';
import { getTopScorers } from '@/lib/data/players';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { RecordTable } from '@/components/records/record-table';

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
    path: '/records/maximos-goleadores',
    title: 'Máximos goleadores Mundiales · Klose, Ronaldo, Müller, Pelé y todos los demás',
    description:
      'Ranking histórico de los máximos goleadores de los Mundiales: Miroslav Klose (16), Ronaldo Nazário (15), Gerd Müller (14), Just Fontaine (13). Top 30 con foto, país y goles.',
    keywords: [
      'máximos goleadores Mundial historia',
      'Klose 16 goles Mundial',
      'Ronaldo Nazário Mundial goles',
      'Just Fontaine 13 goles 1958',
      'goleadores Copa del Mundo ranking',
      'top scorers FIFA World Cup',
    ],
  });
}

export default async function MaxGoleadoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getTopScorers(30);

  // ItemList JSON-LD
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Máximos goleadores en la historia de los Mundiales',
    numberOfItems: players.length,
    itemListElement: players.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: (p.known_as && p.known_as.trim()) || p.full_name,
        nationality: p.nationality_code,
        url: localeUrl(locale, `/jugadores/${p.slug}`),
      },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          itemListLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Récords', path: '/records' },
            { name: 'Máximos goleadores', path: '/records/maximos-goleadores' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/records')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Récords mundialistas
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-emerald-300">
          <Goal className="h-4 w-4" />
          <span>Top 30 · 1930 — 2022</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Máximos<br />goleadores
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Los 30 jugadores con más goles en toda la historia de los Mundiales. Klose lidera con 16 desde Sudáfrica 2010; Ronaldo (15) y Müller (14) completan el podio. Just Fontaine sigue siendo el goleador absoluto en una sola edición: 13 en Suecia 1958.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="goles"
          locale={locale}
          columns={[
            { label: 'Goles', value: (p) => p.goals, primary: true },
            { label: 'Mund.', value: (p) => p.wc_count, hideOnMobile: false },
            { label: 'Min.', value: (p) => p.total_minutes, hideOnMobile: true },
            { label: 'Asist.', value: (p) => p.assists, hideOnMobile: true },
          ]}
        />
      </section>

      {/* Cross-link a otros récords */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más récords
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Sigue explorando
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            <CrossLink locale={locale} href="/records/mas-mundiales-jugados" label="Más Mundiales jugados" />
            <CrossLink locale={locale} href="/records/mas-minutos" label="Más minutos disputados" />
            <CrossLink locale={locale} href="/palmares" label="Palmarés completo" />
          </ul>
        </div>
      </section>

      <div className="h-24" />
    </article>
  );
}

function CrossLink({
  locale,
  href,
  label,
}: {
  locale: string;
  href: string;
  label: string;
}) {
  return (
    <li>
      <Link
        href={withLocale(locale as Locale, href)}
        className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
      >
        <span className="font-medium text-[var(--color-fg)]">{label}</span>
        <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
      </Link>
    </li>
  );
}

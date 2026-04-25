import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, AlertOctagon } from 'lucide-react';
import { getPlayersByReds } from '@/lib/data/players';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
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
    path: '/records/mas-rojas',
    title: 'Más expulsiones en Mundiales · Tarjetas rojas históricas',
    description:
      'Los jugadores expulsados con tarjeta roja en la historia de los Mundiales. Pocos repiten: la roja en una Copa del Mundo es casi siempre una decisión irreversible.',
    keywords: [
      'más expulsiones Mundiales',
      'tarjetas rojas Mundial historia',
      'jugadores expulsados Copa del Mundo',
      'récord rojas Mundial',
    ],
  });
}

export default async function MasRojasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getPlayersByReds(20);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jugadores con más tarjetas rojas en Mundiales',
    numberOfItems: players.length,
    itemListElement: players.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: (p.known_as && p.known_as.trim()) || p.full_name,
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
            { name: 'Más expulsados', path: '/records/mas-rojas' },
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

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-red-300">
          <AlertOctagon className="h-4 w-4" />
          <span>Lista completa · expulsiones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Más<br />expulsados
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          La roja en un Mundial es casi siempre el final de un torneo. Solo unos pocos jugadores han sido expulsados en distintas ediciones —Rigobert Song es el caso más conocido—. Aquí están todos.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="rojas"
          locale={locale}
          columns={[
            { label: 'Rojas', value: (p) => p.reds, primary: true },
            { label: 'Amar.', value: (p) => p.yellows, hideOnMobile: false },
            { label: 'Mund.', value: (p) => p.wc_count, hideOnMobile: true },
          ]}
        />
      </section>

      <div className="h-24" />
    </article>
  );
}

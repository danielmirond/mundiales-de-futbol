import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Goal } from 'lucide-react';
import { getPlayersByOwnGoals } from '@/lib/data/players';
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
    path: '/records/goles-en-propia',
    title: 'Goles en propia puerta en Mundiales · Lista histórica',
    description:
      'Los autogoles en la historia de los Mundiales: jugadores que marcaron contra su selección en una Copa del Mundo. Curiosidades, finales perdidas y errores legendarios.',
    keywords: [
      'gol en propia Mundial',
      'autogoles Copa del Mundo historia',
      'Andrés Escobar autogol 1994',
      'Jimmy Dickinson 1954 propia',
      'errores Mundiales en propia',
    ],
  });
}

export default async function GolesPropiaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getPlayersByOwnGoals(30);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Goles en propia puerta en Mundiales',
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
            { name: 'Goles en propia', path: '/records/goles-en-propia' },
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

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">
          <Goal className="h-4 w-4 rotate-180" />
          <span>Lista completa · autogoles</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Goles<br />en propia
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El autogol más caro de la historia mundialista lo cometió Andrés Escobar contra Estados Unidos en 1994 (Colombia eliminada en la fase de grupos). Diez días después, Escobar fue asesinado en Medellín. Aquí, todos los autogoles oficiales del torneo desde 1930.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="autogoles"
          locale={locale}
          columns={[
            { label: 'Propias', value: (p) => p.own_goals, primary: true },
            { label: 'Goles', value: (p) => p.goals, hideOnMobile: false },
            { label: 'Mund.', value: (p) => p.wc_count, hideOnMobile: true },
          ]}
        />
      </section>

      <div className="h-24" />
    </article>
  );
}

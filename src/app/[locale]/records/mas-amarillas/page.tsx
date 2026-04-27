import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Square } from 'lucide-react';
import { getPlayersByYellows } from '@/lib/data/players';
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
    path: '/records/mas-amarillas',
    title: 'Más tarjetas amarillas en Mundiales · Ranking histórico',
    description:
      'Los jugadores con más tarjetas amarillas acumuladas en la historia de los Mundiales: Mascherano lidera con 7. El reverso del fair play.',
    keywords: [
      'más tarjetas amarillas Mundial',
      'Mascherano tarjetas Mundiales',
      'récord amarillas Copa del Mundo',
      'jugadores más amonestados Mundiales',
    ],
  });
}

export default async function MasAmarillasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getPlayersByYellows(20);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jugadores con más tarjetas amarillas en Mundiales',
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
            { name: 'Más tarjetas amarillas', path: '/records/mas-amarillas' },
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

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-yellow-300">
          <Square className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>Top 20 · amonestaciones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Más tarjetas<br />amarillas
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          La cara B del fair play. Javier Mascherano lidera la lista histórica con siete amarillas, varias de ellas en finales y semifinales. La amarilla, en un Mundial, es siempre una decisión: faltar a una entrada para no perder al rival.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="amarillas"
          locale={locale}
          columns={[
            { label: 'Amarillas', value: (p) => p.yellows, primary: true },
            { label: 'Rojas', value: (p) => p.reds, hideOnMobile: false },
            { label: 'Mund.', value: (p) => p.wc_count, hideOnMobile: true },
          ]}
        />
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          Datos extraídos de los partidos con eventos minuto a minuto
          registrados en nuestra base. La cobertura es completa desde el
          Mundial 1994; los Mundiales anteriores pueden tener tarjetas no
          contabilizadas si el reporte oficial era escueto.
        </p>
      </section>

      <div className="h-24" />
    </article>
  );
}

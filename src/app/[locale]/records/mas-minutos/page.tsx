import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Clock } from 'lucide-react';
import { getPlayersByMinutes } from '@/lib/data/players';
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
    path: '/records/mas-minutos',
    title: 'Más minutos en Mundiales · Ranking histórico de minutos disputados',
    description:
      'Los 30 jugadores con más minutos disputados en la historia de los Mundiales. Cuantificamos las carreras mundialistas reales: minutos en cancha, no convocatorias.',
    keywords: [
      'jugador con más minutos Mundiales',
      'récord minutos Copa del Mundo',
      'Lothar Matthäus minutos Mundiales',
      'top minutos jugados Mundial',
    ],
  });
}

export default async function MasMinutosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getPlayersByMinutes(30);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jugadores con más minutos en Mundiales',
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
            { name: 'Más minutos disputados', path: '/records/mas-minutos' },
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

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-amber-300">
          <Clock className="h-4 w-4" />
          <span>Top 30 · minutos en cancha</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Más minutos<br />disputados
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Más allá de las convocatorias, los minutos reales en cancha. Paolo Maldini mantuvo el récord histórico durante dos décadas con 2.217 minutos en 23 partidos (1990-2002), hasta que Lionel Messi lo superó en Qatar 2022. Lothar Matthäus, por su parte, conserva el récord de partidos jugados con 25 (1982-1998), ahora también empatado por Messi con 26.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="minutos"
          locale={locale}
          columns={[
            { label: 'Min.', value: (p) => p.total_minutes, primary: true },
            { label: 'Mund.', value: (p) => p.wc_count, hideOnMobile: false },
            { label: 'Goles', value: (p) => p.goals, hideOnMobile: true },
          ]}
        />
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          Récord absoluto: Lionel Messi (Argentina) superó en la final de Qatar
          2022 los 2.217 minutos de Paolo Maldini. La cobertura minute-by-minute
          de nuestra base es completa desde 1994; los Mundiales anteriores
          pueden infraestimar minutos cuando el reporte oficial no detallaba
          tiempos de sustitución.
        </p>
      </section>

      <div className="h-24" />
    </article>
  );
}

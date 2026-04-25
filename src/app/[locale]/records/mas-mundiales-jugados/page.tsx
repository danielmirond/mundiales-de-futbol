import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getTopPlayers } from '@/lib/data/players';
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
    path: '/records/mas-mundiales-jugados',
    title: 'Jugadores con más Mundiales · Carbajal, Matthäus, Maldini, Messi y Ronaldo',
    description:
      'Ranking de los jugadores que más Mundiales han disputado: Antonio Carbajal y Lothar Matthäus (5), Lionel Messi y Cristiano Ronaldo (5), más los grandes supervivientes de cada generación.',
    keywords: [
      'jugadores con más Mundiales jugados',
      'Carbajal 5 Mundiales',
      'Matthäus 5 Mundiales',
      'Messi cinco Mundiales',
      'Cristiano Ronaldo Mundiales',
      'jugadores más participaciones Copa del Mundo',
    ],
  });
}

export default async function MasMundialesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getTopPlayers(30);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jugadores con más Mundiales disputados',
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
            { name: 'Más Mundiales jugados', path: '/records/mas-mundiales-jugados' },
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

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-sky-300">
          <Calendar className="h-4 w-4" />
          <span>Top 30 · más participaciones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Más Mundiales<br />jugados
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Solo cinco jugadores en la historia han disputado cinco Mundiales: Antonio Carbajal (México, 1950-1966), Lothar Matthäus (Alemania, 1982-1998), Rafael Márquez (México, 2002-2018), Lionel Messi (Argentina, 2006-2022) y Cristiano Ronaldo (Portugal, 2006-2022). Messi añade un sexto en 2026 si llega.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="Mundiales"
          locale={locale}
          columns={[
            { label: 'Mundiales', value: (p) => p.wc_count, primary: true },
            { label: 'Goles', value: (p) => p.goals, hideOnMobile: false },
            { label: 'Min.', value: (p) => p.total_minutes, hideOnMobile: true },
          ]}
        />
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más récords
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Sigue explorando
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            <li>
              <Link
                href={withLocale(locale as Locale, '/records/maximos-goleadores')}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
              >
                <span className="font-medium text-[var(--color-fg)]">Máximos goleadores</span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
              </Link>
            </li>
            <li>
              <Link
                href={withLocale(locale as Locale, '/records/mas-minutos')}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
              >
                <span className="font-medium text-[var(--color-fg)]">Más minutos disputados</span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
              </Link>
            </li>
            <li>
              <Link
                href={withLocale(locale as Locale, '/palmares')}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
              >
                <span className="font-medium text-[var(--color-fg)]">Palmarés completo</span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <div className="h-24" />
    </article>
  );
}

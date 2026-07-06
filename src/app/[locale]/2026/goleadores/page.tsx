import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Target, ListTree, CalendarDays } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { getTopScorers } from '@/lib/wc-2026-top-scorers';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const tName = (c: string) => TEAMS_2026[c]?.name ?? c;
const tFlag = (c: string) => TEAMS_2026[c]?.flag ?? '🏳️';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/goleadores',
    title: 'Máximo goleador del Mundial 2026: tabla de goleadores y Bota de Oro',
    description:
      'Tabla de máximos goleadores del Mundial 2026 actualizada en directo: quién lidera la Bota de Oro, goles de cada jugador y penaltis. Se actualiza solo tras cada partido.',
    keywords: [
      'maximo goleador mundial 2026',
      'goleadores mundial 2026',
      'bota de oro mundial 2026',
      'pichichi mundial 2026',
      'tabla de goleadores mundial 2026',
      'máximo goleador copa mundial 2026',
      'quién va de máximo goleador del mundial',
    ],
    type: 'website',
  });
}

export default async function GoleadoresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;

  const { scorers, totalGoals, matchesPlayed } = await getTopScorers();
  const leader = scorers[0];
  const pageUrl = localeUrl(locale, '/2026/goleadores');

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 pt-28">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Mundial 2026', path: '/2026' },
          { name: 'Goleadores', path: '/2026/goleadores' },
        ])}
      />
      {leader && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Máximos goleadores del Mundial 2026',
            inLanguage: locale,
            url: pageUrl,
            numberOfItems: scorers.length,
            itemListElement: scorers.slice(0, 10).map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `${s.name} (${tName(s.team)})`,
            })),
          }}
        />
      )}

      <nav className="mb-6 text-sm text-[var(--color-fg-muted)]">
        <Link href={withLocale(L, '/2026')} className="inline-flex items-center gap-1 hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-4 w-4" /> Mundial 2026
        </Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <Target className="mr-1 inline h-3 w-3" /> Bota de Oro · en directo
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Máximo goleador del Mundial 2026
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--color-fg-muted)]">
          {scorers.length === 0 ? (
            <>La tabla de goleadores se actualizará en cuanto rueden los primeros partidos del Mundial 2026.</>
          ) : (
            <>
              Tabla de máximos goleadores del Mundial 2026, actualizada en directo tras cada partido.
              Van <strong className="text-[var(--color-fg)]">{totalGoals} goles</strong> en{' '}
              <strong className="text-[var(--color-fg)]">{matchesPlayed} partidos</strong>, y la Bota de Oro
              la lidera{' '}
              <strong className="text-[var(--color-fg)]">
                {leader.name}
              </strong>{' '}
              ({tName(leader.team)}).
            </>
          )}
        </p>
      </header>

      {scorers.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                <th className="px-3 py-3 text-center">#</th>
                <th className="px-3 py-3">Jugador</th>
                <th className="px-3 py-3">Selección</th>
                <th className="px-3 py-3 text-center">Goles</th>
                <th className="hidden px-3 py-3 text-center sm:table-cell">Penaltis</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((s, i) => {
                const rank = i + 1;
                const tied = i > 0 && scorers[i - 1].goals === s.goals;
                return (
                  <tr
                    key={s.id}
                    className={`border-t border-[var(--color-border)] ${rank <= 3 ? 'bg-[var(--color-bg-2)]' : ''}`}
                  >
                    <td className="px-3 py-3 text-center font-display tab-num text-lg text-[var(--color-fg-subtle)]">
                      {tied ? '' : rank}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[var(--color-fg)]">{s.name}</td>
                    <td className="px-3 py-3">
                      <Link
                        href={withLocale(L, `/selecciones/${s.team}`)}
                        className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
                      >
                        <span aria-hidden>{tFlag(s.team)}</span>
                        <span className="truncate">{tName(s.team)}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center font-display tab-num text-lg text-[var(--color-fg)]">
                      {s.goals}
                    </td>
                    <td className="hidden px-3 py-3 text-center tab-num text-[var(--color-fg-subtle)] sm:table-cell">
                      {s.penalties || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-[var(--color-fg-subtle)]">
        Los autogoles no computan para el goleador. Datos en vivo; se recalcula tras cada partido.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={withLocale(L, '/2026/cuadro')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          <ListTree className="h-4 w-4" /> Cuadro y cruces
        </Link>
        <Link
          href={withLocale(L, '/2026/calendario')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          <CalendarDays className="h-4 w-4" /> Calendario y resultados
        </Link>
        <Link
          href={withLocale(L, '/2026/partidos-hoy')}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Partidos de hoy <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Trophy } from 'lucide-react';
import { TOURNAMENTS } from '@/lib/tournaments';
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
    path: '/palmares',
    title: 'Palmarés Mundial · Todos los campeones de la Copa del Mundo (1930-2022)',
    description:
      'Palmarés histórico de la Copa Mundial de la FIFA: 22 ediciones desde Uruguay 1930 hasta Qatar 2022. Campeón, subcampeón, tercer puesto, resultado de la final, máximo goleador y Balón de Oro de cada Mundial.',
    keywords: [
      'palmarés Mundial',
      'campeones Copa del Mundo',
      'finales Mundiales lista',
      'subcampeones Mundial',
      'máximos goleadores Mundial historia',
      'Balón de Oro Mundial',
      'todos los Mundiales 1930-2022',
    ],
  });
}

const PLAYED = TOURNAMENTS.filter((t) => t.year < 2026);

// Conteo de títulos por país (para la sección de campeonas)
function buildChampionTally() {
  const tally = new Map<string, { name: string; titles: number[] }>();
  for (const t of PLAYED) {
    const key = t.champion;
    const cur = tally.get(key) ?? { name: t.champion, titles: [] };
    cur.titles.push(t.year);
    tally.set(key, cur);
  }
  return [...tally.values()].sort((a, b) => b.titles.length - a.titles.length);
}

// Conteo de finales perdidas por país
function buildRunnerUpTally() {
  const tally = new Map<string, { name: string; runnerUps: number[] }>();
  for (const t of PLAYED) {
    if (!t.runnerUp) continue;
    const cur = tally.get(t.runnerUp) ?? { name: t.runnerUp, runnerUps: [] };
    cur.runnerUps.push(t.year);
    tally.set(t.runnerUp, cur);
  }
  return [...tally.values()].sort((a, b) => b.runnerUps.length - a.runnerUps.length);
}

export default async function PalmaresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const champions = buildChampionTally();
  const runners = buildRunnerUpTally();

  // JSON-LD: ItemList con cada Mundial
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Palmarés Mundial 1930-2022',
    description: 'Todos los campeones, subcampeones y resultados de la Copa Mundial de la FIFA.',
    numberOfItems: PLAYED.length,
    itemListElement: PLAYED.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SportsEvent',
        name: `Mundial ${t.year} ${t.host}`,
        startDate: t.startDate,
        endDate: t.endDate,
        location: { '@type': 'Country', name: t.host },
        winner: { '@type': 'SportsTeam', name: t.champion },
        url: localeUrl(locale, `/ediciones/${t.slug}`),
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
            { name: 'Palmarés', path: '/palmares' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>Palmarés · 1930 — 2022</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Palmarés<br />Mundial
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          22 ediciones, 8 selecciones campeonas, 21 finales y un Maracanazo de liguilla. Todos los datos canónicos de la Copa Mundial masculina, edición por edición.
        </p>
      </header>

      {/* Tabla principal */}
      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">Año</th>
                <th className="px-4 py-4">Sede</th>
                <th className="px-4 py-4">Campeón</th>
                <th className="px-4 py-4">Resultado</th>
                <th className="px-4 py-4">Subcampeón</th>
                <th className="hidden px-4 py-4 lg:table-cell">3.º</th>
                <th className="hidden px-4 py-4 lg:table-cell">4.º</th>
                <th className="hidden px-4 py-4 xl:table-cell">Máx. goleador</th>
                <th className="hidden px-4 py-4 xl:table-cell">Mejor jugador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[...PLAYED].reverse().map((t) => {
                const fr = t.finalResult;
                const score = fr ? (fr.penalties ? `${fr.score} (${fr.penalties})` : fr.extraTime && !fr.penalties ? `${fr.score} (TC)` : fr.score) : '—';
                return (
                  <tr key={t.year} className="hover:bg-[var(--color-bg-2)]/40">
                    <td className="px-4 py-4 font-display text-2xl tab-num text-[var(--color-fg)] md:text-3xl">
                      {t.year}
                    </td>
                    <td className="px-4 py-4 text-[var(--color-fg-muted)]">{t.host}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={withLocale(locale as Locale, `/ediciones/${t.slug}`)}
                        className="inline-flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                      >
                        <Trophy className="h-3.5 w-3.5 text-[var(--color-pitch)]" />
                        {t.champion}
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[var(--color-fg-muted)] md:text-sm">
                      {score}
                    </td>
                    <td className="px-4 py-4 text-[var(--color-fg-muted)]">{t.runnerUp ?? '—'}</td>
                    <td className="hidden px-4 py-4 text-[var(--color-fg-muted)] lg:table-cell">{t.third ?? '—'}</td>
                    <td className="hidden px-4 py-4 text-[var(--color-fg-muted)] lg:table-cell">{t.fourth ?? '—'}</td>
                    <td className="hidden px-4 py-4 xl:table-cell">
                      {t.topScorer ? (
                        <span className="text-[var(--color-fg-muted)]">
                          {t.topScorer.name.split('/')[0].trim()}{' '}
                          <span className="font-mono text-xs text-[var(--color-pitch)]">
                            {t.topScorer.goals}
                          </span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="hidden px-4 py-4 xl:table-cell">
                      {t.bestPlayer ? (
                        <span className="text-[var(--color-fg-muted)]">
                          {t.bestPlayer.name}
                          {!t.bestPlayer.official && (
                            <span className="ms-1 text-xs text-[var(--color-fg-subtle)]">*</span>
                          )}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-xs text-[var(--color-fg-subtle)]">
          TC = título conseguido en prórroga · pen = penales · * mejor jugador antes de la creación oficial del Balón de Oro (1982)
        </p>
      </section>

      {/* Campeones */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <h2 className="font-display text-fluid-h2 uppercase leading-none">
          Selecciones campeonas
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--color-fg-muted)]">
          Solo 8 selecciones han ganado un Mundial en 22 ediciones. Brasil, Italia y Alemania concentran 13 de las 22 estrellas.
        </p>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {champions.map((c) => (
            <li key={c.name} className="bg-[var(--color-bg)] p-6 md:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-xl uppercase text-[var(--color-fg)]">{c.name}</span>
                <span className="font-display text-3xl tab-num text-[var(--color-pitch)]">
                  {c.titles.length}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-[var(--color-fg-muted)]">
                {c.titles.sort((a, b) => a - b).map((y) => (
                  <span key={y} className="tab-num">{y}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Subcampeones */}
      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <h2 className="font-display text-fluid-h2 uppercase leading-none">
          Las eternas finalistas
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--color-fg-muted)]">
          Países que han llegado a una final mundialista. Países Bajos, tres veces subcampeón, ostenta el récord absoluto sin haber ganado ninguna copa.
        </p>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {runners.map((r) => (
            <li key={r.name} className="bg-[var(--color-bg)] p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-base uppercase text-[var(--color-fg)] md:text-lg">{r.name}</span>
                <span className="font-display text-2xl tab-num text-[var(--color-fg-muted)]">
                  {r.runnerUps.length}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] text-[var(--color-fg-subtle)]">
                {r.runnerUps.sort((a, b) => a - b).map((y) => (
                  <span key={y} className="tab-num">{y}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-24" />
    </article>
  );
}

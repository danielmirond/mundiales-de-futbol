import Link from 'next/link';
import { ArrowRight, ListChecks } from 'lucide-react';
import { GROUPS_2026, getTeam2026 } from '@/lib/wc-2026';
import { fetchScores, buildScoreMap, groupStandings } from '@/lib/live-scores';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/** Sección de la home: los 12 grupos con su clasificación (puntos). */
export async function HomeGroups({ locale }: { locale: Locale }) {
  const scoreMap = buildScoreMap(await fetchScores());

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <ListChecks className="h-4 w-4" />
              Grupos
            </div>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-5xl">
              Los 12 grupos · clasificación
            </h2>
          </div>
          <Link
            href={withLocale(locale, '/2026/grupos')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Ver grupos completos
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GROUPS_2026.map((g) => {
            const rows = groupStandings(g.letter, scoreMap);
            return (
              <li key={g.letter} className="flex h-full flex-col gap-4 bg-[var(--color-bg)] p-6">
                <div className="flex items-baseline justify-between">
                  <Link
                    href={withLocale(locale, `/2026/grupo/${g.letter}`)}
                    className="font-display text-3xl uppercase leading-none text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)]"
                  >
                    Grupo {g.letter}
                  </Link>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                    PJ · Pts
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {rows.map((r) => {
                    const tm = getTeam2026(r.code);
                    return (
                      <li key={r.code} className="flex items-center gap-2.5">
                        <Link
                          href={withLocale(locale, `/selecciones/${r.code}`)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 transition-colors hover:text-[var(--color-pitch)]"
                        >
                          <span aria-hidden className="text-lg">{tm?.flag}</span>
                          <span className="truncate text-sm font-medium text-[var(--color-fg)]">
                            {tm?.name ?? r.code}
                          </span>
                        </Link>
                        <span className="font-mono text-[11px] tab-num text-[var(--color-fg-subtle)]">
                          {r.pj}
                        </span>
                        <span className="w-6 text-end font-mono text-sm font-bold tab-num text-[var(--color-fg)]">
                          {r.pts}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

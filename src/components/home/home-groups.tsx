import Link from 'next/link';
import { ArrowRight, ListChecks } from 'lucide-react';
import { GROUPS_2026, getTeam2026, FIXTURES_2026 } from '@/lib/wc-2026';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type Row = { code: string; pj: number; pts: number; gf: number; ga: number };

/** Clasificación de un grupo a partir de los resultados ya jugados. */
function standings(letter: string, scoreMap: ReturnType<typeof buildScoreMap>): Row[] {
  const group = GROUPS_2026.find((g) => g.letter === letter);
  const table = new Map<string, Row>();
  for (const code of (group?.teams ?? [])) {
    if (code) table.set(code, { code, pj: 0, pts: 0, gf: 0, ga: 0 });
  }
  for (const f of FIXTURES_2026) {
    if (f.stage !== letter || !f.home || !f.away) continue;
    const sc = scoreMap.get(scoreKey(f.home, f.away));
    if (!sc || sc.state === 'pre' || sc.homeScore === null || sc.awayScore === null) continue;
    const h = table.get(f.home);
    const a = table.get(f.away);
    if (!h || !a) continue;
    h.pj++; a.pj++;
    h.gf += sc.homeScore; h.ga += sc.awayScore;
    a.gf += sc.awayScore; a.ga += sc.homeScore;
    if (sc.homeScore > sc.awayScore) h.pts += 3;
    else if (sc.homeScore < sc.awayScore) a.pts += 3;
    else { h.pts++; a.pts++; }
  }
  const rows = [...table.values()];
  const anyPlayed = rows.some((r) => r.pj > 0);
  if (anyPlayed) {
    rows.sort((x, y) =>
      y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf,
    );
  }
  return rows;
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
            const rows = standings(g.letter, scoreMap);
            return (
              <li key={g.letter} className="bg-[var(--color-bg)]">
                <Link
                  href={withLocale(locale, `/2026/grupo/${g.letter}`)}
                  className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl uppercase leading-none text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                      Grupo {g.letter}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                      PJ · Pts
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {rows.map((r) => {
                      const tm = getTeam2026(r.code);
                      return (
                        <li key={r.code} className="flex items-center gap-2.5">
                          <span aria-hidden className="text-lg">{tm?.flag}</span>
                          <span className="truncate text-sm font-medium text-[var(--color-fg)]">
                            {tm?.name ?? r.code}
                          </span>
                          <span className="ms-auto font-mono text-[11px] tab-num text-[var(--color-fg-subtle)]">
                            {r.pj}
                          </span>
                          <span className="w-6 text-end font-mono text-sm font-bold tab-num text-[var(--color-fg)]">
                            {r.pts}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

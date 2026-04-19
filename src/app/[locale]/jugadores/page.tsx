import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getTopPlayers, getTopScorers, displayPlayerName } from '@/lib/data/players';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export default async function PlayersIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [top, scorers] = await Promise.all([
    getTopPlayers(60),
    getTopScorers(20),
  ]);

  return (
    <article className="pt-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Archivo · Jugadores
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {top.length}+ jugadores
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
          Todos los que han jugado un Mundial con datos event-level (StatsBomb).
          Ordenados por apariciones y minutos. 2.093 jugadores totales en la base.
        </p>
      </div>

      {/* Top scorers highlight */}
      {scorers.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Máximos goleadores
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            Bota de oro
          </h2>
          <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {scorers.slice(0, 10).map((p) => (
              <Link
                key={p.id}
                href={withLocale(locale as Locale, `/jugadores/${p.slug}`)}
                className="group relative flex flex-col gap-3 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-4xl tab-num text-[var(--color-pitch)]">
                    {p.goals}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    {p.nationality_code}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-fg)]">
                    {displayPlayerName(p)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    {p.wc_count}× mundial · {Math.round(p.total_minutes / 90)} partidos
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All players by appearances */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Más apariciones
        </div>
        <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
          Jugadores más presentes
        </h2>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                <th className="p-4 w-8 text-right">#</th>
                <th className="p-4">Jugador</th>
                <th className="p-4">Selección</th>
                <th className="p-4 hidden md:table-cell">Posición</th>
                <th className="p-4 hidden md:table-cell text-right">Mundiales</th>
                <th className="p-4 text-right">Minutos</th>
                <th className="p-4 text-right">Goles</th>
              </tr>
            </thead>
            <tbody>
              {top.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <td className="p-4 text-right font-mono text-[10px] tracking-widest text-[var(--color-fg-subtle)] tab-num">
                    {i + 1}
                  </td>
                  <td className="p-4">
                    <Link
                      href={withLocale(locale as Locale, `/jugadores/${p.slug}`)}
                      className="font-medium text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)]"
                    >
                      {displayPlayerName(p)}
                    </Link>
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--color-fg-muted)]">
                    {p.nationality_code ?? '—'}
                  </td>
                  <td className="p-4 hidden md:table-cell text-[var(--color-fg-muted)]">
                    {p.position ?? '—'}
                  </td>
                  <td className="p-4 hidden md:table-cell text-right tab-num text-[var(--color-fg)]">
                    {p.wc_count}
                  </td>
                  <td className="p-4 text-right tab-num text-[var(--color-fg)]">
                    {p.total_minutes.toLocaleString()}′
                  </td>
                  <td className="p-4 text-right tab-num">
                    {p.goals > 0 ? (
                      <span className="font-semibold text-[var(--color-pitch)]">{p.goals}</span>
                    ) : (
                      <span className="text-[var(--color-fg-subtle)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

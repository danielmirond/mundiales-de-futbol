import Link from 'next/link';
import { routing, type Locale } from '@/i18n/routing';
import { editionFinalRanking } from '@/lib/wc-head-to-head';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const POS_LABEL: Record<number, string> = {
  1: 'Campeón',
  2: 'Subcampeón',
  3: 'Tercero',
  4: 'Cuarto',
};

/**
 * Clasificación final de la edición (1.º campeón → último), derivada del
 * histórico real. Cubre la intención "Mundial {año} posiciones finales".
 */
export function EditionStandings({ year, locale }: { year: number; locale: Locale }) {
  const rows = editionFinalRanking(year);
  if (rows.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Clasificación final
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-[0.95]">
        Posiciones finales · {year}
      </h2>

      <div className="mt-10 overflow-x-auto rounded-3xl border border-[var(--color-border)]">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="bg-[var(--color-bg-2)] font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              <th className="px-3 py-3 text-left">#</th>
              <th className="px-3 py-3 text-left">Selección</th>
              <th className="px-3 py-3 text-left">Posición</th>
              <th className="px-2 py-3 text-center" title="Partidos jugados">PJ</th>
              <th className="px-2 py-3 text-center">G</th>
              <th className="px-2 py-3 text-center">E</th>
              <th className="px-2 py-3 text-center">P</th>
              <th className="px-2 py-3 text-center" title="Goles a favor / en contra">GF/GC</th>
              <th className="px-3 py-3 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.code}
                className={`border-t border-[var(--color-border)] ${
                  r.rank <= 4 ? 'bg-[var(--color-pitch)]/5' : 'odd:bg-[var(--color-bg)] even:bg-[var(--color-bg-2)]/40'
                }`}
              >
                <td className="px-3 py-2.5 font-mono tab-num text-[var(--color-fg-subtle)]">{r.rank}</td>
                <td className="px-3 py-2.5">
                  <Link
                    href={withLocale(locale, `/selecciones/${r.code}`)}
                    className="inline-flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                  >
                    <span aria-hidden>{r.flag}</span>
                    {r.name}
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-[var(--color-fg-muted)]">
                  {POS_LABEL[r.rank] ?? r.stage}
                </td>
                <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.played}</td>
                <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.wins}</td>
                <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.draws}</td>
                <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-muted)]">{r.losses}</td>
                <td className="px-2 py-2.5 text-center tab-num text-[var(--color-fg-subtle)]">
                  {r.goalsFor}/{r.goalsAgainst}
                </td>
                <td className="px-3 py-2.5 text-center font-mono tab-num font-semibold text-[var(--color-pitch)]">
                  {r.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
        Orden: campeón, subcampeón, tercero y cuarto por las finales; el resto por fase alcanzada y
        puntos (3 por victoria). Puntos a 3 para comparación homogénea entre ediciones.
      </p>
    </section>
  );
}

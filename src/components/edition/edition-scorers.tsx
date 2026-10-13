import Link from 'next/link';
import type { EditionScorer } from '@/lib/data/edition-scorers';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Goleadores de la edición (con el Bota de Oro del torneo como referencia cuando lo hay). */
export function EditionScorers({ rows, locale, accent, topScorer }: { rows: EditionScorer[]; locale: Locale; accent?: string; topScorer?: { name: string; goals: number; team?: string } }) {
  if (rows.length === 0 && !topScorer) return null;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="kicker" style={accent ? { color: accent } : undefined}>Goles</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Goleadores de la edición</h2>
      {topScorer && <p className="mt-2 text-[var(--color-fg-muted)]">Bota de Oro: <strong className="text-[var(--color-fg)]">{topScorer.name}</strong>{topScorer.team ? ` (${topScorer.team})` : ''}, {topScorer.goals} goles.</p>}
      {rows.length > 0 && (
        <div className="mt-6 max-w-[720px] overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="w-11 px-2 py-3 text-center font-medium">#</th><th className="px-2 py-3 text-left font-medium">Jugador</th><th className="px-2 py-3 text-left font-medium">Selección</th><th className="px-2 py-3 text-center font-medium">Goles</th><th className="hidden px-2 py-3 text-center font-medium sm:table-cell">Pen.</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.slug ?? r.name} className="border-t border-[var(--color-border)]">
                  <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{i + 1}</td>
                  <td className="h-11 px-2 font-medium text-[var(--color-fg)]">{r.slug ? <Link href={withLocale(locale, `/jugadores/${r.slug}`)} className="hover:text-[var(--accent-ink)]">{r.name}</Link> : r.name}</td>
                  <td className="h-11 px-2 text-[var(--color-fg-muted)]"><Link href={withLocale(locale, `/selecciones/${r.team_code}`)} className="hover:text-[var(--color-fg)]">{r.team_code}</Link></td>
                  <td className="h-11 px-2 text-center text-[15px] font-semibold tab-num text-[var(--color-fg)]">{r.goals}</td>
                  <td className="hidden h-11 px-2 text-center tab-num text-[var(--color-fg-muted)] sm:table-cell">{r.penalties || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

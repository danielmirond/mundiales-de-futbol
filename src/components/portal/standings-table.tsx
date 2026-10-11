import { fetchStandings, STANDING_COLUMNS } from '@/lib/espn';
import type { Competition } from '@/lib/competitions';

/** Clasificación genérica (grupos/conferencias) con columnas por deporte. */
export async function StandingsTable({ comp }: { comp: Competition }) {
  const { season, groups } = await fetchStandings(comp);
  if (groups.length === 0) return null;
  const cols = STANDING_COLUMNS[comp.espn?.sport ?? 'soccer'] ?? STANDING_COLUMNS.soccer;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">Clasificación{season ? ` · ${season}` : ''}</div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">Clasificación de {comp.shortName ?? comp.name}</h2>
      <div className={`mt-8 grid gap-8 ${groups.length > 1 ? 'lg:grid-cols-2' : ''}`}>
        {groups.map((g) => (
          <div key={g.name}>
            {groups.length > 1 && (
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">{g.name}</h3>
            )}
            <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                    <th className="px-3 py-3 text-center">#</th>
                    <th className="px-3 py-3">Equipo</th>
                    {cols.map((c) => <th key={c.key} className="px-2 py-3 text-center" title={c.title}>{c.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r) => (
                    <tr key={`${g.name}-${r.abbr}-${r.rank}`} className="border-t border-[var(--color-border)]">
                      <td className="px-3 py-2.5 text-center font-mono tab-num text-[var(--color-fg-subtle)]">{r.rank}</td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-2 font-medium text-[var(--color-fg)]">
                          {r.logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.logo} alt="" width={20} height={20} loading="lazy" className="h-5 w-5 object-contain" />
                          )}
                          <span className="truncate">{r.name}</span>
                        </span>
                      </td>
                      {cols.map((c) => (
                        <td key={c.key} className={`px-2 py-2.5 text-center tab-num ${c.key === 'points' || c.key === 'winPercent' ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                          {r.stats[c.key] ?? '–'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

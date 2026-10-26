import type { Competition } from '@/lib/competitions';
import { hbLeague, type HbMatch } from '@/lib/balonmano';

const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const done = (m: HbMatch) => m.state === 'Finished' && m.score;

function Line({ m }: { m: HbMatch }) {
  const d = new Date(m.date);
  return (
    <li className="grid grid-cols-[92px_1fr_auto_1fr] items-center gap-3 px-4 py-2.5 text-sm">
      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">{dayFmt.format(d)}{done(m) ? '' : ` · ${timeFmt.format(d)}`}</span>
      <span className={`truncate text-right ${done(m) && m.score![0] > m.score![1] ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg)]'}`}>{m.home}</span>
      <span className="font-display tab-num min-w-[3.6rem] text-center text-lg text-[var(--color-fg)]">{done(m) ? `${m.score![0]}-${m.score![1]}` : '–'}</span>
      <span className={`truncate ${done(m) && m.score![1] > m.score![0] ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg)]'}`}>{m.away}</span>
    </li>
  );
}

/** Próximos partidos (desde hace 3 h, por si alguno está en juego). Server component: se calcula en cada regeneración. */
function upcoming(ms: HbMatch[]): HbMatch[] {
  const from = Date.now() - 3 * 3_600_000;
  return ms.filter((m) => !done(m) && Date.parse(m.date) >= from).slice(0, 12);
}

/** Balonmano (Highlightly): clasificación por grupos, últimos resultados y próximos partidos. */
export function BalonmanoHub({ comp }: { comp: Competition }) {
  const l = hbLeague(comp.slug);
  if (!l) return null;
  const played = l.matches.filter((m) => done(m));
  const lastDay = played.length ? Math.max(...played.map((m) => Date.parse(m.date))) : 0;
  const recent = played.filter((m) => lastDay - Date.parse(m.date) <= 4 * 86_400_000);
  const next = upcoming(l.matches);
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-8">
          {l.groups.map((g) => (
            <div key={g.name} className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
              <div className="border-b border-[var(--color-border)] px-4 py-3 kicker">{l.groups.length > 1 ? g.name.replace(/^.*,\s*/, '') : 'Clasificación'}</div>
              <table className="w-full text-sm">
                <thead className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                  <tr className="border-b border-[var(--color-border)]"><th className="px-3 py-2 text-left">#</th><th className="px-2 py-2 text-left">Equipo</th><th className="px-2 py-2 text-right">PJ</th><th className="hidden px-2 py-2 text-right sm:table-cell">G</th><th className="hidden px-2 py-2 text-right sm:table-cell">E</th><th className="hidden px-2 py-2 text-right sm:table-cell">P</th><th className="hidden px-2 py-2 text-right md:table-cell">Goles</th><th className="px-3 py-2 text-right">Pts</th></tr>
                </thead>
                <tbody className="tab-num">
                  {g.rows.map((r) => (
                    <tr key={r.team} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-3 py-2 text-[var(--color-fg-muted)]">{r.pos}</td>
                      <td className="px-2 py-2 font-semibold text-[var(--color-fg)]">{r.team}</td>
                      <td className="px-2 py-2 text-right">{r.pj}</td>
                      <td className="hidden px-2 py-2 text-right sm:table-cell">{r.g}</td><td className="hidden px-2 py-2 text-right sm:table-cell">{r.e}</td><td className="hidden px-2 py-2 text-right sm:table-cell">{r.p}</td>
                      <td className="hidden px-2 py-2 text-right md:table-cell">{r.gf}:{r.gc}</td>
                      <td className="px-3 py-2 text-right font-display text-base text-[var(--color-fg)]">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <div className="grid content-start gap-8">
          {recent.length > 0 && (
            <div>
              <div className="sub-label mb-2">Últimos resultados</div>
              <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">{recent.map((m) => <Line key={m.id} m={m} />)}</ul>
            </div>
          )}
          {next.length > 0 && (
            <div>
              <div className="sub-label mb-2">Próximos partidos <span className="normal-case tracking-normal">(hora peninsular)</span></div>
              <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">{next.map((m) => <Line key={m.id} m={m} />)}</ul>
            </div>
          )}
        </div>
      </div>
      <p className="mt-8 font-mono text-[11px] text-[var(--color-fg-subtle)]">Datos: Highlightly · se actualiza a diario.</p>
    </div>
  );
}

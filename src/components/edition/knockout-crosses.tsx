import { TEAMS_2026 } from '@/lib/wc-2026';
import { getKnockoutRounds } from '@/lib/wc-2026-knockout';

const tName = (c: string) => TEAMS_2026[c]?.name ?? c;
const tFlag = (c: string) => TEAMS_2026[c]?.flag ?? '🏳️';

function fmtDay(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(iso));
  } catch {
    return '';
  }
}
function fmtHour(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

/**
 * Cruces REALES de eliminatorias (en vivo, ESPN), ronda a ronda. Se actualiza
 * solo: muestra los equipos reales en cuanto se determinan y el marcador.
 */
export async function KnockoutCrosses() {
  const rounds = await getKnockoutRounds();
  if (rounds.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Cruces · en directo
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        Los enfrentamientos, ronda a ronda
      </h2>

      <div className="mt-8 space-y-10">
        {rounds.map((r) => (
          <div key={r.key}>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                {r.label}
              </span>
              <span className="font-mono text-xs tab-num text-[var(--color-fg-subtle)]">
                {r.matches.length}
              </span>
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {r.matches.map((m) => {
                const played = m.state === 'post' && m.homeScore != null && m.awayScore != null;
                const live = m.state === 'in';
                const homeWin = played && m.homeScore! > m.awayScore!;
                const awayWin = played && m.awayScore! > m.homeScore!;
                return (
                  <div
                    key={m.id || `${m.home}-${m.away}`}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      <span>{fmtDay(m.date)}</span>
                      {live ? (
                        <span className="text-[var(--color-flame)]">🔴 {m.clock || 'EN VIVO'}</span>
                      ) : played ? (
                        <span>Final</span>
                      ) : (
                        <span className="tab-num">{fmtHour(m.date)} h</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-2 truncate text-sm ${homeWin ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                        <span>{tFlag(m.home)}</span>{tName(m.home)}
                      </span>
                      <span className="shrink-0 font-display tab-num text-xl text-[var(--color-fg)]">
                        {played || live ? `${m.homeScore ?? 0}-${m.awayScore ?? 0}` : 'vs'}
                      </span>
                      <span className={`flex items-center justify-end gap-2 truncate text-sm ${awayWin ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                        {tName(m.away)}<span>{tFlag(m.away)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { getKnockoutRounds, koWinner, wentToShootout } from '@/lib/wc-2026-knockout';
import { ROUND_META } from '@/components/edition/knockout-round-landing';
import { routing, type Locale } from '@/i18n/routing';

const tName = (c: string) => TEAMS_2026[c]?.name ?? c;
const tFlag = (c: string) => TEAMS_2026[c]?.flag ?? '🏳️';

function withLocale(locale: Locale, href: string) {
  return locale === routing.defaultLocale ? href : `/${locale}${href}`;
}

function fmtDay(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      timeZone: 'Europe/Madrid', day: 'numeric', month: 'short',
    }).format(new Date(iso));
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
 * Cruces REALES de eliminatorias (en vivo, ESPN), ronda a ronda hasta la final.
 * Muestra los equipos en cuanto se determinan (bandera, nombre, marcador,
 * estado) y enlaza a la página de cada partido; mientras tanto, el texto del
 * cuadro ("2º A · 2º B").
 */
export async function KnockoutCrosses({ locale }: { locale: Locale }) {
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
              {ROUND_META[r.key] ? (
                <Link
                  href={withLocale(locale, `/2026/${ROUND_META[r.key].slug}`)}
                  className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
                >
                  {r.label}
                </Link>
              ) : (
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                  {r.label}
                </span>
              )}
              <span className="font-mono text-xs tab-num text-[var(--color-fg-subtle)]">
                {r.matches.length}
              </span>
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {r.matches.map((m) => {
                const resolved = !!m.home && !!m.away;
                const played = m.state === 'post' && m.homeScore != null && m.awayScore != null;
                const live = m.state === 'in';
                const winner = played ? koWinner(m) : null;
                const homeWin = winner === 'home';
                const awayWin = winner === 'away';
                const pens = wentToShootout(m);

                const card = (
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]">
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
                    {resolved ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className={`flex items-center gap-2 truncate text-sm ${homeWin ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                          <span>{tFlag(m.home!)}</span>{tName(m.home!)}
                        </span>
                        <span className="flex shrink-0 flex-col items-center">
                          <span className="font-display tab-num text-xl text-[var(--color-fg)]">
                            {played || live ? `${m.homeScore ?? 0}-${m.awayScore ?? 0}` : 'vs'}
                          </span>
                          {pens && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                              {m.shootoutHome}-{m.shootoutAway} pen.
                            </span>
                          )}
                        </span>
                        <span className={`flex items-center justify-end gap-2 truncate text-sm ${awayWin ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                          {tName(m.away!)}<span>{tFlag(m.away!)}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-1 text-center text-sm text-[var(--color-fg-subtle)]">
                        {m.label || 'Por definir'}
                      </div>
                    )}
                  </div>
                );

                // Enlazamos siempre a la página del partido (partido-N); ahí se
                // resuelven equipos, alineaciones y narración en directo.
                return (
                  <Link
                    key={m.n}
                    href={withLocale(locale, `/2026/partido/${m.slug}`)}
                    className="block"
                  >
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

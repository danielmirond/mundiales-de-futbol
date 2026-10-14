import type { Competition } from '@/lib/competitions';
import { fetchGolf, fetchFightCard } from '@/lib/espn-individual';

const MADRID = 'Europe/Madrid';
const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, day: 'numeric', month: 'short' });
const dayTime = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

function Calendar({ entries, sport, title }: { entries: { name: string; start: string; end: string }[]; sport: string; title: string }) {
  const now = new Date().getTime();
  const upcoming = entries.filter((c) => new Date(c.end).getTime() >= now).slice(0, 12);
  if (upcoming.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10" data-sport={sport}>
      <div className="kicker">Calendario</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{title}</h2>
      <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((c, i) => (
          <li key={c.name + c.start} className={`flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3 bg-[var(--color-bg-2)] ${i === 0 ? 'border-[var(--accent)]' : 'border-[var(--color-border)]'}`}>
            <span className="min-w-0 truncate text-sm font-medium text-[var(--color-fg)]">{c.name}</span>
            <span className="shrink-0 font-mono text-[11px] tab-num text-[var(--color-fg-muted)]">{dayFmt.format(new Date(c.start))}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Golf: torneo en curso o próximo con la tabla y el calendario. */
export async function GolfHub({ comp }: { comp: Competition }) {
  if (!comp.feed) return null;
  const { event, calendar } = await fetchGolf(comp.feed);
  return (
    <>
      {event && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10" data-sport="golf">
          <div className="kicker">{event.state === 'in' ? 'En juego' : event.state === 'post' ? 'Último torneo' : 'Próximo torneo'}</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{event.name}</h2>
          <p className="mt-2 text-[var(--color-fg-muted)]">{event.course ? `${event.course} · ` : ''}{dayFmt.format(new Date(event.start))} – {dayFmt.format(new Date(event.end))}</p>
          {event.rows.length > 0 && event.state !== 'pre' ? (
            <div className="mt-6 overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
              <table className="w-full border-collapse text-sm">
                <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="w-11 px-2 py-3 text-center font-medium">#</th><th className="px-2 py-3 text-left font-medium">Jugador</th><th className="px-2 py-3 text-center font-medium">Total</th>{[1, 2, 3, 4].map((r) => <th key={r} className="hidden px-2 py-3 text-center font-medium sm:table-cell">R{r}</th>)}</tr></thead>
                <tbody>
                  {event.rows.map((r) => (
                    <tr key={r.name} className="border-t border-[var(--color-border)]">
                      <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{r.pos}</td>
                      <td className="h-11 px-2 font-medium text-[var(--color-fg)]">{r.name}{r.country ? <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{r.country}</span> : null}</td>
                      <td className="h-11 px-2 text-center text-[15px] font-semibold tab-num text-[var(--color-fg)]">{r.score === 'E' ? 'Par' : r.score}</td>
                      {[0, 1, 2, 3].map((i) => <td key={i} className="hidden h-11 px-2 text-center tab-num text-[var(--color-fg-muted)] sm:table-cell">{r.rounds[i] ?? '–'}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--color-fg-muted)]">La tabla aparecerá cuando empiece la primera vuelta.</p>
          )}
        </section>
      )}
      <Calendar entries={calendar} sport="golf" title={`Próximos torneos del ${comp.name}`} />
    </>
  );
}

/** UFC: velada en curso o la última, con la cartelera de la estelar hacia abajo, y próximas veladas. */
export async function FightHub({ comp }: { comp: Competition }) {
  if (!comp.feed) return null;
  const { card, calendar } = await fetchFightCard(comp.feed);
  return (
    <>
      {card && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10" data-sport="combate">
          <div className="kicker">{card.state === 'in' ? 'Velada en curso' : card.state === 'post' ? 'Última velada' : 'Próxima velada'}</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{card.name}</h2>
          <p className="mt-2 text-[var(--color-fg-muted)]">{card.venue ? `${card.venue} · ` : ''}{dayTime.format(new Date(card.date))} (hora peninsular)</p>
          <ul className="mt-6 divide-y divide-[var(--color-border)] overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            {card.fights.map((f, i) => (
              <li key={f.id} className="grid gap-2 px-5 py-4 md:grid-cols-[180px_1fr_140px] md:items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{i === 0 ? 'Combate estelar · ' : ''}{f.weight}</span>
                <span className="grid gap-1">
                  {[f.a, f.b].map((x) => (
                    <span key={x.name} className={`flex items-center gap-2 ${x.winner ? 'font-semibold text-[var(--color-fg)]' : f.state === 'post' ? 'text-[var(--color-fg-muted)]' : 'text-[var(--color-fg)]'}`}>
                      {x.name}{x.record ? <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{x.record}</span> : null}{x.country ? <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{x.country}</span> : null}{x.winner ? <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-win)]">gana</span> : null}
                    </span>
                  ))}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-fg-muted)] md:text-right">{f.state === 'in' ? <span className="inline-flex items-center gap-1.5 text-[var(--color-live-ink)]"><i className="pulse" />En curso</span> : f.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Calendar entries={calendar} sport="combate" title="Próximas veladas" />
    </>
  );
}

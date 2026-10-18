import { fetchMotoGP, type MotoStanding, type MotoCategory } from '@/lib/motogp';
import { madridDateKey } from '@/lib/espn';

const MADRID = 'Europe/Madrid';
const dayTime = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', day: 'numeric', month: 'short' });

function StandingsTable({ rows, full }: { rows: MotoStanding[]; full?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
      <table className="w-full border-collapse text-sm">
        <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
          <th className="w-11 px-2 py-3 text-center font-medium">#</th><th className="px-2 py-3 text-left font-medium">Piloto</th>
          {full && <th className="hidden px-2 py-3 text-left font-medium md:table-cell">Equipo</th>}
          {full && <th className="px-2 py-3 text-center font-medium" title="Victorias en carrera">V</th>}
          {full && <th className="px-2 py-3 text-center font-medium" title="Podios en carrera">Pod.</th>}
          <th className="px-2 py-3 text-center font-medium">Pts</th>
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className={`border-t border-[var(--color-border)] ${r.countryIso === 'ES' ? 'bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]' : ''}`}>
              <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{r.pos}</td>
              <td className="h-11 px-2 font-medium text-[var(--color-fg)]">
                <span className="flex items-center gap-2">{r.name}{r.country ? <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{r.country}</span> : null}</span>
              </td>
              {full && <td className="hidden h-11 px-2 text-[var(--color-fg-muted)] md:table-cell">{r.team}</td>}
              {full && <td className="h-11 px-2 text-center tab-num text-[var(--color-fg-muted)]">{r.wins}</td>}
              {full && <td className="h-11 px-2 text-center tab-num text-[var(--color-fg-muted)]">{r.podiums}</td>}
              <td className="h-11 px-2 text-center text-[15px] font-semibold tab-num text-[var(--color-fg)]">{r.points.toLocaleString('es-ES')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** MotoGP: líder y clasificación de las tres categorías, último gran premio, próximo con horarios y calendario. */
export async function MotoGPHub() {
  const d = await fetchMotoGP();
  if (!d) {
    return (
      <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
        <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-[var(--color-fg-muted)]">Los datos del Mundial de MotoGP no están disponibles en este momento. Vuelve a intentarlo en unos minutos.</p>
      </section>
    );
  }
  const [lead, second] = d.standings.MotoGP;
  const today = madridDateKey();
  const left = d.calendar.filter((e) => !e.finished).length;

  return (
    <>
      {lead && second && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pt-10 md:px-10" data-sport="motor">
          <div className="kicker">Mundial {d.year}</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{lead.name} lidera con {lead.points.toLocaleString('es-ES')} puntos</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            {second.name} es segundo a {(lead.points - second.points).toLocaleString('es-ES')} {lead.points - second.points === 1 ? 'punto' : 'puntos'}. {lead.name} suma {lead.wins} {lead.wins === 1 ? 'victoria' : 'victorias'} y {lead.podiums} podios en carrera; {second.name}, {second.wins} {second.wins === 1 ? 'victoria' : 'victorias'} y {second.podiums} podios.
            {left > 0 ? ` Quedan ${left} ${left === 1 ? 'gran premio' : 'grandes premios'}.` : ''}
          </p>
        </section>
      )}

      {d.next && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10" data-sport="motor">
          <div className="kicker">Próximo gran premio</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{d.next.event.name}</h2>
          <p className="mt-2 text-[var(--color-fg-muted)]">{d.next.event.circuit} · {dayFmt.format(new Date(d.next.event.start))} – {dayFmt.format(new Date(d.next.event.end))}</p>
          {d.next.sessions.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
              <ul className="divide-y divide-[var(--color-border)]">
                {d.next.sessions.map((s) => (
                  <li key={s.label + s.date} className={`grid grid-cols-[150px_1fr] items-center gap-4 px-5 py-3 ${s.type === 'RAC' || s.type === 'SPR' ? 'font-semibold' : ''}`}>
                    <span className="font-mono text-[12px] tab-num text-[var(--color-fg-muted)]">{dayTime.format(new Date(s.date))}</span>
                    <span className="text-sm text-[var(--color-fg)]">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Hora peninsular · en Canarias, una hora menos</p>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-10" data-sport="motor">
        <div className="kicker">Clasificación</div>
        <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Mundial de MotoGP</h2>
        <div className="mt-5"><StandingsTable rows={d.standings.MotoGP} full /></div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {(['Moto2', 'Moto3'] as MotoCategory[]).map((c) => d.standings[c].length > 0 && (
            <div key={c}><h3 className="sub-label mb-3">{c}</h3><StandingsTable rows={d.standings[c]} /></div>
          ))}
        </div>
      </section>

      {d.last && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-10" data-sport="motor">
          <div className="kicker">Último gran premio</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{d.last.event.name}</h2>
          <p className="mt-2 text-[var(--color-fg-muted)]">{d.last.event.circuit}{d.last.sprint[0] ? ` · Sprint: ganó ${d.last.sprint[0].name}` : ''}</p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {d.last.race.slice(0, 3).map((p) => (
              <li key={p.pos} className={`rounded-[18px] border p-5 ${p.pos === 1 ? 'border-[var(--color-gold)] bg-[color-mix(in_oklab,var(--color-gold)_10%,transparent)]' : 'border-[var(--color-border)] bg-[var(--color-bg-2)]'}`}>
                <div className="n-xl leading-none text-[var(--color-fg)]">{p.pos}.º</div>
                <div className="mt-2 text-[17px] font-semibold text-[var(--color-fg)]">{p.name}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{[p.team, p.pos === 1 ? p.time : p.gap].filter(Boolean).join(' · ')}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {d.calendar.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10" data-sport="motor">
          <div className="kicker">Temporada {d.year}</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Calendario de MotoGP</h2>
          <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {d.calendar.map((e, i) => {
              const isNext = d.next?.event.id === e.id;
              return (
                <li key={e.id} className={`flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3 ${isNext ? 'border-[var(--accent)]' : 'border-[var(--color-border)]'} ${e.finished && e.end < today ? 'opacity-60' : ''} bg-[var(--color-bg-2)]`}>
                  <span className="min-w-0"><span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">R{i + 1} · </span><span className="text-sm font-medium text-[var(--color-fg)]">{e.name.replace(/^Gran Premio de /, 'GP de ')}</span></span>
                  <span className="shrink-0 font-mono text-[11px] tab-num text-[var(--color-fg-muted)]">{dayFmt.format(new Date(e.start))}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: MotoGP · actualizado cada 30 minutos</p>
        </section>
      )}
    </>
  );
}

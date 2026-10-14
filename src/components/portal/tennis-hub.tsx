import type { Competition } from '@/lib/competitions';
import { fetchTennis, type TennisMatch } from '@/lib/espn-tennis';

const MADRID = 'Europe/Madrid';
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short' });

function Player({ p, m, sets }: { p: TennisMatch['a']; m: TennisMatch; sets: number }) {
  return (
    <span className={`flex items-center gap-3 ${p.winner ? 'font-semibold text-[var(--color-fg)]' : m.state === 'post' ? 'text-[var(--color-fg-muted)]' : 'text-[var(--color-fg)]'}`}>
      <span className="min-w-0 flex-1 truncate text-[14.5px]">{p.name}{p.seed ? <span className="ml-1.5 font-mono text-[10px] text-[var(--color-fg-subtle)]">({p.seed})</span> : null}{p.country ? <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">{p.country}</span> : null}</span>
      <span className="flex gap-2 tab-num">{Array.from({ length: sets }, (_, i) => <span key={i} className="w-4 text-center font-display text-[18px] leading-none">{Number.isFinite(p.sets[i]) ? p.sets[i] : ''}</span>)}</span>
    </span>
  );
}

function TennisRow({ m, showDay = false }: { m: TennisMatch; showDay?: boolean }) {
  const live = m.state === 'in';
  const sets = Math.max(m.a.sets.length, m.b.sets.length);
  return (
    <li className="grid grid-cols-[64px_1fr] items-center gap-4 px-5 py-3">
      <span className={`grid gap-1 font-mono text-[12px] tab-num ${live ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>
        {live ? <span className="inline-flex items-center gap-1.5"><i className="pulse" />Vivo</span> : m.state === 'post' ? (showDay ? dayFmt.format(new Date(m.date)) : 'Final') : (showDay ? dayFmt.format(new Date(m.date)) : timeFmt.format(new Date(m.date)))}
      </span>
      <span className="grid gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{m.round}{m.court ? ` · ${m.court}` : ''}</span>
        <Player p={m.a} m={m} sets={sets} />
        <Player p={m.b} m={m} sets={sets} />
      </span>
    </li>
  );
}

/** Tenis: torneos en juego del circuito con partidos de hoy, últimos resultados y próximos. */
export async function TennisHub({ comp }: { comp: Competition }) {
  if (!comp.feed) return null;
  const tournaments = (await fetchTennis(comp.feed)).filter((t) => t.today.length + t.recent.length + t.upcoming.length > 0);
  if (tournaments.length === 0) {
    return <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10"><div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-[var(--color-fg-muted)]">No hay torneos {comp.name} en juego esta semana.</div></section>;
  }
  const list = (title: string, ms: TennisMatch[], showDay: boolean) => ms.length > 0 && (
    <div>
      <div className="sub-label mb-2">{title}</div>
      <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">{ms.map((m) => <TennisRow key={m.id} m={m} showDay={showDay} />)}</ul>
    </div>
  );
  return (
    <>
      {tournaments.map((t) => (
        <section key={t.id} className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10" data-sport="tenis">
          <div className="kicker">{t.major ? 'Grand Slam' : comp.name}{t.city ? ` · ${t.city}` : ''}</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{t.name}</h2>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{dayFmt.format(new Date(t.start))} – {dayFmt.format(new Date(t.end))} · individuales</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {list('Hoy', t.today, false) || <p className="text-sm text-[var(--color-fg-muted)]">Hoy no hay partidos programados en este torneo.</p>}
            <div className="grid gap-6">
              {list('Próximos', t.upcoming, true)}
              {list('Últimos resultados', t.recent, true)}
            </div>
          </div>
        </section>
      ))}
      <p className="mx-auto w-full max-w-[1400px] px-6 pb-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] md:px-10">Horarios en hora peninsular · fuente ESPN</p>
    </>
  );
}

import type { MatchSummary, LineupPlayer, MatchEvent, CommentaryLine } from '@/lib/wc-2026-match-summary';
import { Icon, type IconName } from '@/components/ui/icon';

const KIND_ICON: Record<MatchEvent['kind'], IconName> = {
  goal: 'gol', yellow: 'amarilla', red: 'roja', sub: 'cambio', var: 'var', other: 'programado',
};
const eventIcon = (e: MatchEvent): IconName => {
  if (e.kind === 'goal' && /propia|own/i.test(e.type)) return 'autogol';
  if (e.kind === 'goal' && /penal/i.test(e.type)) return 'penalti';
  if (e.kind === 'red' && /segunda|second/i.test(e.type)) return 'dobleamarilla';
  return KIND_ICON[e.kind];
};

const SectionTitle = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="t-h2 scroll-mt-40 text-[var(--color-fg)]">{children}</h2>
);

export function Lineup({ team, flag, formation, starters, subs }: { team: string; flag?: string; formation: string | null; starters: LineupPlayer[]; subs: LineupPlayer[] }) {
  return (
    <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="t-h3 text-[var(--color-fg)]">{flag ? `${flag} ` : ''}{team}</h3>
        {formation && <span className="font-mono text-xs tab-num text-[var(--accent-ink)]">{formation}</span>}
      </div>
      <ul className="mt-4 space-y-1.5">
        {starters.map((p, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="n-pos inline-grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[var(--color-bg)] tab-num">{p.jersey || '·'}</span>
            <span className="flex-1 truncate text-[var(--color-fg)]">{p.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">{p.pos}</span>
          </li>
        ))}
      </ul>
      {subs.length > 0 && (
        <>
          <div className="sub-label mt-5">Suplentes</div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-fg-muted)]">{subs.map((p) => p.name).join(' · ')}</p>
        </>
      )}
    </div>
  );
}

/** Narración minuto a minuto: gol y roja en tarjeta destacada; periodos como separadores. */
function Commentary({ lines, live, events }: { lines: CommentaryLine[]; live: boolean; events: MatchEvent[] }) {
  const ordered = [...lines].reverse();
  const highlight = (c: CommentaryLine) => events.find((e) => (e.kind === 'goal' || e.kind === 'red') && e.minute && e.minute === c.minute && (e.players.some((p) => c.text.includes(p)) || /gol|goal|roja|red card/i.test(c.text)));
  const isPeriod = (c: CommentaryLine) => !c.minute && /descanso|final|comienza|inicio|half|kick|end of|segunda parte|primera parte|cuarto/i.test(c.text) && c.text.length < 90;
  return (
    <section id="narracion" className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10">
      <div className="flex items-center gap-3">
        <SectionTitle>Narración</SectionTitle>
        {live && <span className="st live"><i className="pulse" />En directo</span>}
      </div>
      <ol className="mt-6">
        {ordered.map((c, i) => {
          const ev = highlight(c);
          if (isPeriod(c)) return <li key={i} className="my-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]"><span className="h-px flex-1 bg-[var(--color-border)]" />{c.text}<span className="h-px flex-1 bg-[var(--color-border)]" /></li>;
          if (ev) return (
            <li key={i} className="my-2 flex gap-4 rounded-[14px] border border-[var(--color-border-strong)] bg-[var(--color-bg-2)] p-4">
              <span className="inline-flex h-7 min-w-[2.75rem] items-center justify-center gap-1.5 rounded-full bg-[var(--color-bg)] px-2 font-mono text-[11px] tab-num text-[var(--color-fg)]"><Icon name={eventIcon(ev)} size={13} />{c.minute}</span>
              <span className="text-[15px] leading-relaxed text-[var(--color-fg)]">{c.text}</span>
            </li>
          );
          return (
            <li key={i} className="flex gap-4 border-l border-[var(--color-border)] pl-4 pb-4 last:pb-0">
              <span className="-ml-[1.4rem] mt-0.5 inline-grid h-7 min-w-[2.75rem] flex-shrink-0 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 font-mono text-[10px] tab-num text-[var(--accent-ink)]">{c.minute || '·'}</span>
              <span className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{c.text}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Estadística comparada en barras enfrentadas (local izquierda, visitante derecha). */
function StatBar({ label, home, away }: { label: string; home: string; away: string }) {
  const n = (v: string) => { const x = parseFloat(String(v).replace(',', '.').replace('%', '')); return Number.isFinite(x) ? x : 0; };
  const h = n(home), a = n(away), total = h + a || 1;
  const hp = Math.round((h / total) * 100), ap = 100 - hp;
  const strong = (x: number, y: number) => (x > y ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]');
  return (
    <li className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3 py-2.5 text-sm">
      <span className={`text-left tab-num ${strong(h, a)}`}>{home}</span>
      <span className="grid gap-1.5">
        <span className="text-center text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{label}</span>
        <span className="grid grid-cols-2 gap-1">
          <span className="flex justify-end overflow-hidden rounded-l-full bg-[var(--color-surface)]"><span className="h-1.5 rounded-l-full" style={{ width: `${hp}%`, background: h >= a ? 'var(--accent)' : 'var(--color-fg-subtle)' }} /></span>
          <span className="flex overflow-hidden rounded-r-full bg-[var(--color-surface)]"><span className="h-1.5 rounded-r-full" style={{ width: `${ap}%`, background: a > h ? 'var(--accent)' : 'var(--color-fg-subtle)' }} /></span>
        </span>
      </span>
      <span className={`text-right tab-num ${strong(a, h)}`}>{away}</span>
    </li>
  );
}

export function MatchSummarySections({
  summary, homeName, awayName, homeFlag = '', awayFlag = '', live = false, sport = 'futbol',
}: { summary: MatchSummary; homeName: string; awayName: string; homeFlag?: string; awayFlag?: string; live?: boolean; sport?: string }) {
  // Orden según estado: previa → alineaciones primero; en directo → narración; final → momentos.
  const stats = summary.hasStats && (
    <section id="estadisticas" className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10" data-sport={sport}>
      <SectionTitle>Estadísticas</SectionTitle>
      <div className="mt-6 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-5 py-3">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          <span>{homeFlag} {homeName}</span><span>{awayName} {awayFlag}</span>
        </div>
        <ul className="divide-y divide-[var(--color-border)]">{summary.stats.map((s) => <StatBar key={s.key} label={s.label} home={s.home} away={s.away} />)}</ul>
      </div>
    </section>
  );
  const events = summary.hasEvents && (
    <section id="momentos" data-sport={sport} className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10">
      <SectionTitle>{sport === 'futbol' ? 'Momentos clave' : 'Jugadas de anotación'}</SectionTitle>
      <ul className="mt-6 space-y-2">
        {summary.events.map((e, i) => (
          <li key={i} className={`flex items-start gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3 ${e.side === 'away' ? 'flex-row-reverse text-right' : ''}`}>
            <span className="n-pos inline-grid h-7 min-w-[2.75rem] place-items-center rounded-full bg-[var(--color-bg)] px-2 tab-num">{e.minute || '·'}</span>
            <Icon name={eventIcon(e)} size={18} className={`mt-1 shrink-0 ${e.kind === 'goal' ? 'text-[var(--color-win)]' : 'text-[var(--color-fg)]'}`} />
            <span className="flex-1 text-sm text-[var(--color-fg-muted)]">
              <span className="font-medium text-[var(--color-fg)]">{e.type}</span>
              {e.players.length > 0 && <> · {e.players.join(' → ')}</>}
              {e.players.length === 0 && e.text && sport !== 'futbol' && <span className="mt-1 block text-[13px]">{e.text}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
  const commentary = summary.hasCommentary && <Commentary lines={summary.commentary} live={live} events={summary.events} />;
  const lineups = summary.hasLineups && (
    <section id="alineaciones" className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10" data-sport={sport}>
      <SectionTitle>{sport === 'baloncesto' ? 'Quintetos' : 'Alineaciones'}</SectionTitle>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Lineup team={homeName} flag={homeFlag} formation={summary.formationHome} starters={summary.startHome} subs={summary.subsHome} />
        <Lineup team={awayName} flag={awayFlag} formation={summary.formationAway} starters={summary.startAway} subs={summary.subsAway} />
      </div>
    </section>
  );
  const order = summary.state === 'pre' ? [lineups, stats, events, commentary] : live ? [commentary, events, stats, lineups] : [events, stats, commentary, lineups];
  return <>{order.map((s, i) => <span key={i} className="contents">{s}</span>)}</>;
}

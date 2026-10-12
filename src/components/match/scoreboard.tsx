import Link from 'next/link';
import { Crest } from '@/components/portal/crest';
import { Icon } from '@/components/ui/icon';
import { ChannelChips } from '@/components/portal/channel-chips';
import { MatchStatus, phaseOf, type MatchPhase } from './match-status';
import type { MatchSummary, MatchEvent, SummarySide } from '@/lib/wc-2026-match-summary';

const dateFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' });
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export type ScoreboardData = {
  sport: string;
  competition: { name: string; href?: string; round?: string };
  summary: MatchSummary;
  channels?: string[];
  teamHref?: (id: string) => string;
};

/** Reloj largo para la ficha: `67′`, `Desc.`, `4.º C · 3:12`. */
export function clockLabel(s: MatchSummary, sport: string): string {
  if (/HALFTIME/.test(s.statusName ?? '')) return 'Descanso';
  if (sport === 'baloncesto' && s.period) return `${s.period}.º C · ${s.clock ?? ''}`.trim();
  return (s.clock ?? '').replace(/'$/, '′');
}

const scorers = (events: MatchEvent[], side: 'home' | 'away') =>
  events.filter((e) => e.kind === 'goal' && e.side === side).map((e) => ({ name: e.players[0] ?? e.type, minute: e.minute, own: /propia|own/i.test(e.type) }));

function LargeTeam({ t, teamHref }: { t: SummarySide; teamHref?: (id: string) => string }) {
  const inner = (
    <>
      <Crest src={t.logo} abbr={t.abbr} color={t.color} size="xl" />
      <span className="font-display text-[28px] uppercase leading-[0.9] tracking-[0.01em] md:text-[40px]">{t.name}</span>
    </>
  );
  const cls = 'grid justify-items-center gap-3.5 text-center text-[var(--color-fg)]';
  return t.id && teamHref ? <Link href={teamHref(t.id)} className={`${cls} hover:text-[var(--accent-ink)]`}>{inner}</Link> : <span className={cls}>{inner}</span>;
}

/**
 * Marcador grande (cabecera de la ficha de partido · sistema 08).
 * Kicker + estado, equipos con escudo, dígitos --num-xxl, reloj, goleadores,
 * meta de fecha, estadio y canal.
 */
export function ScoreboardLarge({ sport, competition, summary: s, channels = [], teamHref }: ScoreboardData) {
  const h = s.header!;
  const phase = phaseOf(s.state, s.statusName, s.hasLineups);
  const scored = s.state !== 'pre' && s.homeScore != null && s.awayScore != null;
  const ms = h.date ? new Date(h.date).getTime() : 0;
  const pens = h.home.shootout != null && h.away.shootout != null ? `${h.home.shootout}-${h.away.shootout} en penaltis` : null;
  return (
    <div
      data-sport={sport}
      className="rounded-[28px] border border-[var(--color-border)] px-5 pb-6 pt-6 md:px-10 md:pb-7 md:pt-8"
      style={{ background: 'radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%), var(--color-bg-2)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="kicker">{competition.name}{competition.round ? ` · ${competition.round}` : ''}</span>
        <MatchStatus phase={phase} />
      </div>
      <div className="my-7 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-7">
        <LargeTeam t={h.home} teamHref={teamHref} />
        <div className="grid justify-items-center gap-3">
          {scored ? (
            <div className={`n-xxl flex items-center gap-3 md:gap-4 ${s.state === 'in' ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg)]'}`}>
              <span>{s.homeScore}</span><span className="text-[0.45em] text-[var(--color-fg-subtle)]">–</span><span>{s.awayScore}</span>
            </div>
          ) : (
            <div className="n-xl text-[var(--color-fg-subtle)]">{phase === 'ppd' ? '—' : 'vs'}</div>
          )}
          {s.state === 'in' && (
            <span className="flex items-center gap-2 font-mono text-[15px] font-semibold tracking-[0.06em] text-[var(--color-live-ink)]"><i className="pulse" />{clockLabel(s, sport)}</span>
          )}
          {pens && <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{pens}</span>}
          {!scored && ms > 0 && <span className="font-mono text-[13px] tab-num text-[var(--color-fg-muted)]">{timeFmt.format(ms)} h</span>}
        </div>
        <LargeTeam t={h.away} teamHref={teamHref} />
      </div>
      {sport === 'futbol' && s.hasEvents && (
        <div className="grid grid-cols-2 gap-x-12 gap-y-1.5 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-fg-muted)]">
          <div className="grid gap-1.5">
            {scorers(s.events, 'home').map((g, i) => <span key={i} className="inline-flex items-center gap-2"><Icon name={g.own ? 'autogol' : 'gol'} className="text-[var(--color-win)]" />{g.name} <b className="font-mono text-xs font-medium text-[var(--color-fg-subtle)]">{g.minute}</b></span>)}
          </div>
          <div className="grid justify-items-end gap-1.5 text-right">
            {scorers(s.events, 'away').map((g, i) => <span key={i} className="inline-flex items-center gap-2"><Icon name={g.own ? 'autogol' : 'gol'} className="text-[var(--color-win)]" />{g.name} <b className="font-mono text-xs font-medium text-[var(--color-fg-subtle)]">{g.minute}</b></span>)}
          </div>
        </div>
      )}
      {sport === 'baloncesto' && h.home.linescores && h.home.linescores.length > 0 && (
        <Quarters home={h.home} away={h.away} period={s.period} live={s.state === 'in'} homeTotal={s.homeScore} awayTotal={s.awayScore} />
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-fg-muted)]">
        {ms > 0 && <span className="inline-flex items-center gap-2 capitalize"><Icon name="cal" />{dateFmt.format(ms)} · {timeFmt.format(ms)}</span>}
        {h.venue && <span className="inline-flex items-center gap-2"><Icon name="estadio" />{h.venue}</span>}
        <span className="inline-flex items-center gap-2"><Icon name="tv" /><ChannelChips channels={channels} sport={sport} venue={undefined} max={3} /></span>
      </div>
    </div>
  );
}

function Quarters({ home, away, period, live, homeTotal, awayTotal }: { home: { name: string; linescores?: number[] }; away: { name: string; linescores?: number[] }; period?: number; live: boolean; homeTotal: number | null; awayTotal: number | null }) {
  const n = Math.max(home.linescores?.length ?? 0, away.linescores?.length ?? 0);
  const label = (i: number) => (i < 4 ? `${i + 1}.º` : `P${i - 3}`);
  const row = (t: { name: string; linescores?: number[] }, total: number | null) => (
    <tr>
      <td className="py-2.5 pr-2 text-left font-medium text-[var(--color-fg)]">{t.name}</td>
      {Array.from({ length: n }, (_, i) => (
        <td key={i} className={`px-1.5 py-2.5 text-center tab-num ${live && period === i + 1 ? 'font-semibold text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>{t.linescores?.[i] ?? '–'}</td>
      ))}
      <td className="n-m px-1.5 py-2.5 text-center text-[22px] text-[var(--color-fg)]">{total ?? '–'}</td>
    </tr>
  );
  return (
    <table className="mt-2 w-full border-collapse border-t border-[var(--color-border)] text-[13px]">
      <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="py-2 text-left font-medium">Equipo</th>{Array.from({ length: n }, (_, i) => <th key={i} className="px-1.5 py-2 font-medium">{label(i)}</th>)}<th className="px-1.5 py-2 font-medium">Total</th></tr></thead>
      <tbody className="[&_tr]:border-t [&_tr]:border-[var(--color-border)]">{row(home, homeTotal)}{row(away, awayTotal)}</tbody>
    </table>
  );
}

/** Marcador medio (hero de portada): partido destacado. */
export function ScoreboardMedium({ sport, kicker, home, away, homeScore, awayScore, state, clock, channels = [], href }: {
  sport: string; kicker: string; home: { abbr: string; name: string; logo?: string; color?: string }; away: { abbr: string; name: string; logo?: string; color?: string };
  homeScore: number | null; awayScore: number | null; state: string; clock?: string; channels?: string[]; href: string;
}) {
  const scored = state !== 'pre' && homeScore != null && awayScore != null;
  return (
    <Link href={href} data-sport={sport} className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-border-strong)] md:p-6">
      <span className="flex items-center gap-3 text-[18px] font-semibold leading-[1.1] text-[var(--color-fg)]"><Crest src={home.logo} abbr={home.abbr} color={home.color} size="l" />{home.name}</span>
      <span className="grid justify-items-center gap-2">
        <span className="kicker">{kicker}</span>
        <span className={`n-xl ${state === 'in' ? 'text-[var(--color-live-ink)]' : scored ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-subtle)]'}`}>{scored ? `${homeScore}–${awayScore}` : 'vs'}</span>
        {state === 'in' && clock ? <span className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-live-ink)]"><i className="pulse" />{clock}</span> : <ChannelChips channels={channels} sport={sport} max={1} />}
      </span>
      <span className="flex items-center justify-end gap-3 text-right text-[18px] font-semibold leading-[1.1] text-[var(--color-fg)]">{away.name}<Crest src={away.logo} abbr={away.abbr} color={away.color} size="l" /></span>
    </Link>
  );
}

/** Marcador pequeño (cabecera pegajosa en móvil mientras se lee la narración). */
export function ScoreboardSmall({ sport, summary: s, phase }: { sport: string; summary: MatchSummary; phase: MatchPhase }) {
  const h = s.header!;
  const last = [...s.events].reverse().find((e) => e.kind === 'goal' || e.kind === 'red') ?? s.events[s.events.length - 1];
  const scored = s.state !== 'pre' && s.homeScore != null && s.awayScore != null;
  return (
    <div data-sport={sport} className="grid gap-1.5 rounded-[14px] border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] px-4 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <Crest src={h.home.logo} abbr={h.home.abbr} color={h.home.color} size="s" />
        <span className="font-mono text-xs font-semibold tracking-[0.06em]">{h.home.abbr}</span>
        <span className="font-display text-[28px] leading-none tab-num text-[var(--color-fg)]">{scored ? `${s.homeScore}–${s.awayScore}` : 'vs'}</span>
        <span className="font-mono text-xs font-semibold tracking-[0.06em]">{h.away.abbr}</span>
        <Crest src={h.away.logo} abbr={h.away.abbr} color={h.away.color} size="s" />
        <span className={`ml-auto flex items-center gap-1.5 font-mono text-xs font-semibold ${s.state === 'in' ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>
          {s.state === 'in' ? <><i className="pulse" />{clockLabel(s, sport)}</> : phase === 'ft' ? 'Final' : phase === 'ppd' ? 'Aplazado' : h.date ? `${timeFmt.format(new Date(h.date))} h` : ''}
        </span>
      </div>
      {last && (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-fg-subtle)]">
          <Icon name={last.kind === 'red' ? 'roja' : last.kind === 'goal' ? 'gol' : 'programado'} size={12} className={last.kind === 'goal' ? 'text-[var(--color-win)]' : ''} />
          {last.minute} {last.players[0] ?? last.type} · último evento
        </div>
      )}
    </div>
  );
}

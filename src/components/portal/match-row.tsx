import Link from 'next/link';
import type { Match } from '@/lib/espn';
import { Crest } from './crest';
import { ChannelChips } from './channel-chips';

const MADRID = 'Europe/Madrid';
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('es', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short' });

/** Reloj corto: `67′` en fútbol, `4.º 3:12` en baloncesto. */
export function shortClock(m: Pick<Match, 'clock' | 'period' | 'statusName' | 'competition'>): string {
  if (/HALFTIME/.test(m.statusName ?? '')) return 'Desc.';
  if (m.competition.sport === 'baloncesto' && m.period) return `${m.period}.º ${m.clock ?? ''}`.trim();
  const c = (m.clock ?? '').replace(/'$/, '′');
  return c || 'En vivo';
}

function TeamName({ t, win, teamHref }: { t: Match['home']; win: boolean; teamHref?: (id: string) => string }) {
  const cls = `nm min-w-0 truncate ${win ? 'font-semibold text-[var(--color-fg)]' : ''}`;
  return t.id && teamHref ? (
    <Link href={teamHref(t.id)} className={`${cls} relative z-10 hover:text-[var(--accent-ink)]`}>{t.name}</Link>
  ) : <span className={cls}>{t.name}</span>;
}

/**
 * Fila de partido (sistema de diseño · 07). Una sola fila para todos los
 * deportes y estados. La fila entera enlaza a la ficha; los nombres enlazan
 * al equipo. Escritorio: `72px | equipos | 230px`; móvil: equipos apilados.
 */
export function MatchRow({
  m, showDay = false, showCompetition = false, channels = [], href, teamHref, chipMax = 2,
}: {
  m: Match; showDay?: boolean; showCompetition?: boolean; channels?: string[]; href?: string;
  /** Enlace a la ficha de equipo por id ESPN. */
  teamHref?: (id: string) => string;
  /** Chips de canal visibles en escritorio (1 en tableros a dos columnas). */
  chipMax?: number;
}) {
  const live = m.state === 'in';
  const ppd = m.state === 'ppd';
  const played = m.state === 'post' && m.home.score != null && m.away.score != null;
  const pre = !live && !played && !ppd;
  const homeWin = played && m.home.score! > m.away.score!;
  const awayWin = played && m.away.score! > m.home.score!;
  const ms = new Date(m.date).getTime();
  const pens = played && m.home.shootout != null && m.away.shootout != null ? `${m.home.shootout}-${m.away.shootout} pen.` : null;
  const sport = m.competition.sport;

  const timeCell = live ? (
    <><i className="pulse" />{shortClock(m)}</>
  ) : ppd ? 'Aplaz.' : played ? (showDay ? dayFmt.format(ms) : 'Final') : (showDay ? `${dayFmt.format(ms)} ${timeFmt.format(ms)}` : timeFmt.format(ms));

  const crest = (t: Match['home'], size: 'm' | 's') => <Crest src={t.logo} abbr={t.abbr} color={t.color} size={size} />;
  const tone = pre || live ? 'text-[var(--color-fg)]' : ppd ? 'text-[var(--color-fg-subtle)]' : 'text-[var(--color-fg-muted)]';
  const chips = <ChannelChips channels={channels} sport={sport} venue={m.venue} max={chipMax} compact />;

  return (
    <li className={`relative transition-colors hover:bg-[var(--color-surface)] ${live ? 'is-live' : ''}`}>
      {href && <Link href={href} className="absolute inset-0 z-0" aria-label={`${m.home.name} - ${m.away.name}`} />}

      {/* Escritorio */}
      <div className={`hidden min-h-[60px] items-center gap-4 px-5 md:grid ${chipMax > 1 ? 'md:grid-cols-[72px_minmax(0,1fr)_230px]' : 'md:grid-cols-[72px_minmax(0,1fr)_minmax(120px,auto)]'}`}>
        <span className={`flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.04em] tab-num ${live ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>{timeCell}</span>
        <span className="grid grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-3">
          <span className={`flex min-w-0 items-center gap-2.5 text-[15px] ${tone}`}>{crest(m.home, 'm')}<TeamName t={m.home} win={homeWin} teamHref={teamHref} /></span>
          <span className={`text-center ${played || live ? `n-m ${live ? 'text-[var(--color-live-ink)]' : ''}` : 'font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]'}`}>
            {played || live ? `${m.home.score ?? 0}–${m.away.score ?? 0}` : ppd ? '—' : 'vs'}
            {pens && <small className="block font-mono text-[9px] tracking-[0.06em] text-[var(--color-fg-subtle)]">{pens}</small>}
          </span>
          <span className={`flex min-w-0 items-center justify-end gap-2.5 text-right text-[15px] ${tone}`}><TeamName t={m.away} win={awayWin} teamHref={teamHref} />{crest(m.away, 'm')}</span>
        </span>
        <span className="relative z-10 flex min-w-0 items-center justify-end gap-2">
          {ppd ? <span className="ch tbd">Nueva fecha por confirmar</span> : chips}
          {showCompetition && <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] xl:inline">{m.competition.name}</span>}
        </span>
      </div>

      {/* Móvil */}
      <div className="grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-3 md:hidden">
        <span className={`grid justify-items-center gap-1 text-center font-mono text-[12px] tab-num ${live ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>{timeCell}</span>
        <span className="grid gap-1.5">
          <span className={`flex items-center gap-2 text-[14.5px] ${tone}`}>{crest(m.home, 's')}<TeamName t={m.home} win={homeWin} teamHref={teamHref} /></span>
          <span className={`flex items-center gap-2 text-[14.5px] ${tone}`}>{crest(m.away, 's')}<TeamName t={m.away} win={awayWin} teamHref={teamHref} /></span>
        </span>
        <span className={`grid gap-1.5 text-right font-display text-[19px] leading-5 tab-num ${live ? 'text-[var(--color-live-ink)]' : ''}`}>
          {(played || live) ? <><span>{m.home.score ?? 0}</span><span>{m.away.score ?? 0}</span></> : null}
        </span>
        <span className="relative z-10 col-start-2 col-end-4 mt-1 flex min-w-0 items-center gap-1.5">
          {ppd ? <span className="ch tbd">Nueva fecha por confirmar</span> : <ChannelChips channels={channels} sport={sport} venue={m.venue} max={1} />}
          {pens && <span className="font-mono text-[9px] text-[var(--color-fg-subtle)]">{pens}</span>}
          {showCompetition && <span className="ml-auto shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{m.competition.name}</span>}
        </span>
      </div>
    </li>
  );
}

/** Lista de partidos con cabecera (`.mlist`): kicker de competición, título y enlace. */
export function MatchList({
  sport, kicker, title, more, children,
}: { sport: string; kicker?: React.ReactNode; title?: React.ReactNode; more?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <div data-sport={sport} className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
      {(kicker || title || more) && (
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-3.5">
          {kicker && <span className="kicker">{kicker}</span>}
          {title && <span className="text-[15px] font-semibold text-[var(--color-fg)]">{title}</span>}
          {more && <Link href={more.href} className="ml-auto font-mono text-[11px] tracking-[0.06em] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]">{more.label}</Link>}
        </div>
      )}
      <ul className="divide-y divide-[var(--color-border)]">{children}</ul>
    </div>
  );
}

import type { Match } from '@/lib/espn';

const MADRID = 'Europe/Madrid';
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('es', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short' });

// Icono de respaldo por deporte cuando ESPN no da logo (p. ej. rivales de
// pretemporada o equipos modestos de Copa).
const SPORT_FALLBACK: Record<string, string> = {
  futbol: '⚽', baloncesto: '🏀', rugby: '🏉', balonmano: '🤾', motor: '🏎️', tenis: '🎾',
};

function Logo({ src, alt, sport }: { src?: string; alt: string; sport: string }) {
  // Logos de ESPN (a.espncdn.com) — <img> plano: pequeños y sin optimizar.
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={24} height={24} loading="lazy" className="h-6 w-6 shrink-0 object-contain" />
  ) : (
    <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center text-xs">{SPORT_FALLBACK[sport] ?? '🏟️'}</span>
  );
}

/** Fila de partido genérica (cualquier deporte): equipos, marcador, estado y canal (si se sabe). */
export function MatchRow({
  m, showDay = false, showCompetition = false, channels = [],
}: { m: Match; showDay?: boolean; showCompetition?: boolean; channels?: string[] }) {
  const played = m.state === 'post' && m.home.score != null && m.away.score != null;
  const live = m.state === 'in';
  const homeWin = played && m.home.score! > m.away.score!;
  const awayWin = played && m.away.score! > m.home.score!;
  const ms = new Date(m.date).getTime();
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="w-16 shrink-0 text-center font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">
        {live ? (
          <span className="text-[var(--color-flame)]">🔴 {m.clock || 'EN VIVO'}</span>
        ) : played ? (
          <span>{showDay ? dayFmt.format(ms) : 'Final'}</span>
        ) : (
          <span className="tab-num">{showDay ? `${dayFmt.format(ms)} · ` : ''}{timeFmt.format(ms)}</span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <span className={`flex min-w-0 items-center gap-2 text-sm ${homeWin ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
          <Logo src={m.home.logo} alt={m.home.name} sport={m.competition.sport} /><span className="truncate">{m.home.name}</span>
        </span>
        <span className="shrink-0 font-display tab-num text-lg text-[var(--color-fg)]">
          {played || live ? `${m.home.score ?? 0}-${m.away.score ?? 0}` : 'vs'}
        </span>
        <span className={`flex min-w-0 items-center justify-end gap-2 text-sm ${awayWin ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
          <span className="truncate">{m.away.name}</span><Logo src={m.away.logo} alt={m.away.name} sport={m.competition.sport} />
        </span>
      </span>
      {channels.length > 0 && (
        <span
          className="hidden shrink-0 items-center gap-1 md:flex"
          title={`Dónde ver: ${channels.join(', ')}`}
          aria-label={`Dónde ver: ${channels.join(', ')}`}
        >
          <span aria-hidden className="text-xs">📺</span>
          {channels.slice(0, 2).map((c) => (
            <span key={c} className="max-w-[9rem] truncate rounded-full border border-[var(--color-border)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)]">
              {c}
            </span>
          ))}
          {channels.length > 2 && <span className="font-mono text-[9px] text-[var(--color-fg-subtle)]">+{channels.length - 2}</span>}
        </span>
      )}
      {showCompetition && (
        <span className="hidden w-28 shrink-0 truncate text-end font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] sm:block">
          {m.competition.name}
        </span>
      )}
    </li>
  );
}

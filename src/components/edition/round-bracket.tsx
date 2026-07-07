import Link from 'next/link';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { TREE } from '@/lib/wc-2026-bracket';
import { resolveKnockout, koWinner, wentToShootout } from '@/lib/wc-2026-knockout';
import { routing, type Locale } from '@/i18n/routing';

const tFlag = (c?: string) => (c && TEAMS_2026[c]?.flag) || '🏳️';
const tName = (c?: string) => (c && TEAMS_2026[c]?.name) || c || '';
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

// Profundidad (0 = Final) → clave de ronda.
const DEPTH_ROUND = ['FINAL', 'SF', 'QF', 'R16', 'R32'];
const ROUND_LABEL: Record<string, string> = {
  R32: 'Dieciseisavos', R16: 'Octavos', QF: 'Cuartos', SF: 'Semifinales', FINAL: 'Final',
};

/** Orden vertical de partidos por profundidad, recorriendo el árbol in-order. */
function orderByDepth(): Record<number, number[]> {
  const per: Record<number, number[]> = {};
  const dfs = (n: number, depth: number) => {
    const kids = TREE[n];
    (per[depth] ??= []);
    if (kids) {
      dfs(kids[0], depth + 1);
      per[depth].push(n);
      dfs(kids[1], depth + 1);
    } else {
      per[depth].push(n);
    }
  };
  dfs(104, 0);
  return per;
}

/**
 * Cuadro (bracket) visual de una ronda hacia la final, con equipos reales en
 * vivo. Columnas: ronda de partida → … → Final. Se resuelve con ESPN.
 */
export async function RoundBracket({ locale, fromRound }: { locale: Locale; fromRound: string }) {
  const resolved = await resolveKnockout();
  const per = orderByDepth();
  const startDepth = DEPTH_ROUND.indexOf(fromRound);
  if (startDepth < 0) return null;

  // Columnas de la ronda de partida (mayor profundidad) hacia la Final (0).
  const columns: { round: string; ns: number[] }[] = [];
  for (let d = startDepth; d >= 0; d--) {
    columns.push({ round: DEPTH_ROUND[d], ns: per[d] ?? [] });
  }

  const Node = ({ n }: { n: number }) => {
    const r = resolved.get(n);
    const home = r?.home;
    const away = r?.away;
    const played = r?.state === 'post' && r.homeScore != null && r.awayScore != null;
    const live = r?.state === 'in';
    const winner = played && r ? koWinner(r) : null;
    const pens = r ? wentToShootout(r) : false;
    const resolvedTie = !!home && !!away;

    const Team = ({ code, side }: { code?: string; side: 'home' | 'away' }) => {
      const isWinner = winner === side;
      const score = side === 'home' ? r?.homeScore : r?.awayScore;
      return (
        <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 ${isWinner ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
          <span className="flex min-w-0 items-center gap-1.5">
            <span aria-hidden>{tFlag(code)}</span>
            <span className={`truncate text-xs ${isWinner ? 'font-semibold' : ''}`}>{tName(code) || '—'}</span>
          </span>
          {(played || live) && (
            <span className={`tab-num text-xs ${isWinner ? 'font-bold' : ''}`}>{score ?? 0}</span>
          )}
        </div>
      );
    };

    const inner = resolvedTie ? (
      <>
        <Team code={home} side="home" />
        <div className="h-px bg-[var(--color-border)]" />
        <Team code={away} side="away" />
        {pens && (
          <div className="border-t border-[var(--color-border)] px-2.5 py-0.5 text-center font-mono text-[8px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {r!.shootoutHome}-{r!.shootoutAway} pen.
          </div>
        )}
      </>
    ) : (
      <div className="px-2.5 py-3 text-center text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        Por definir
      </div>
    );

    const cls = `w-[150px] shrink-0 overflow-hidden rounded-lg border bg-[var(--color-bg-2)] ${live ? 'border-[var(--color-flame)]/60' : 'border-[var(--color-border)]'}`;
    return resolvedTie ? (
      <Link href={withLocale(locale, `/2026/partido/partido-${n}`)} className={`${cls} block transition-colors hover:border-[var(--color-pitch)]`}>
        {inner}
      </Link>
    ) : (
      <div className={cls}>{inner}</div>
    );
  };

  return (
    <div className="mt-6 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-5">
        {columns.map((col) => (
          <div key={col.round} className="flex flex-col">
            <div className="mb-2 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              {ROUND_LABEL[col.round]}
            </div>
            <div className="flex flex-1 flex-col justify-around gap-2">
              {col.ns.map((n) => (
                <Node key={n} n={n} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

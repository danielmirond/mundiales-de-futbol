import { displayName, type LineupPlayer } from '@/lib/data/match-detail';

function groupByPosition(players: LineupPlayer[]) {
  const groups: Record<string, LineupPlayer[]> = { GK: [], DF: [], MF: [], FW: [] };
  for (const p of players) {
    const k = (p.position ?? 'MF') as keyof typeof groups;
    (groups[k] ?? groups.MF).push(p);
  }
  return groups;
}

export function StartingXI({
  players,
  teamName,
  flag,
}: {
  players: LineupPlayer[];
  teamName: string;
  flag: string | null;
}) {
  const starters = players.filter((p) => p.starter);
  const bench = players.filter((p) => !p.starter);
  const byPos = groupByPosition(starters);

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{flag ?? '🏳️'}</span>
        <div>
          <div className="font-display text-2xl uppercase leading-none">{teamName}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
            XI titular
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {(['GK', 'DF', 'MF', 'FW'] as const).map((pos) => {
          const list = byPos[pos];
          if (!list || list.length === 0) return null;
          return (
            <div key={pos}>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                {pos}
              </div>
              <ul className="grid gap-1">
                {list.map((p) => (
                  <li key={p.player_id} className="flex items-baseline gap-3 text-sm">
                    <span className="w-6 text-right font-mono text-[var(--color-fg-subtle)] tab-num">
                      {p.shirt_number ?? '—'}
                    </span>
                    <span className="text-[var(--color-fg)]">{displayName(p.player)}</span>
                    {p.sub_off_minute !== null && (
                      <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                        ↓ {p.sub_off_minute}′
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {bench.length > 0 && (
        <details className="mt-6 border-t border-[var(--color-border)] pt-4">
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
            Banquillo ({bench.length})
          </summary>
          <ul className="mt-4 grid gap-1">
            {bench.map((p) => (
              <li key={p.player_id} className="flex items-baseline gap-3 text-sm text-[var(--color-fg-muted)]">
                <span className="w-6 text-right font-mono text-[var(--color-fg-subtle)] tab-num">
                  {p.shirt_number ?? '—'}
                </span>
                <span>{displayName(p.player)}</span>
                {p.sub_on_minute !== null && (
                  <span className="font-mono text-xs text-[var(--color-pitch)]">
                    ↑ {p.sub_on_minute}′
                  </span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

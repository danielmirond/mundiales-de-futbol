'use client';
import { useMemo, useState } from 'react';
import type { HeatPlayer } from '@/lib/espn-plays';
import { PW, PH, PP, PitchLines } from './pitch';

/** Suavizado 3 × 3 de la rejilla para que el mapa no se vea a cuadros sueltos. */
function smooth(g: number[], gx: number, gy: number) {
  return g.map((_, i) => {
    const cx = i % gx, cy = Math.floor(i / gx);
    let s = 0, w = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= gx || y >= gy) continue;
      const k = dx === 0 && dy === 0 ? 4 : dx === 0 || dy === 0 ? 2 : 1;
      s += g[x + y * gx] * k; w += k;
    }
    return s / w;
  });
}

export function HeatmapPicker({ players, grid, homeName, awayName, initial }: { players: HeatPlayer[]; grid: readonly [number, number]; homeName: string; awayName: string; initial?: string }) {
  const [sel, setSel] = useState(initial ?? players[0]?.id ?? '');
  const p = players.find((x) => x.id === sel) ?? players[0];
  const [gx, gy] = grid;
  const cells = useMemo(() => (p ? smooth(p.grid, gx, gy) : []), [p, gx, gy]);
  if (!p) return null;
  const max = Math.max(...cells) || 1;
  const cw = (PW - 2 * PP) / gx, ch = (PH - 2 * PP) / gy;
  return (
    <div>
      <label className="flex flex-wrap items-center gap-3 text-[13px] text-[var(--color-fg-muted)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Jugador</span>
        <select id="mapa-calor-jugador" value={p.id} onChange={(e) => setSel(e.target.value)} className="max-w-full rounded-[10px] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-1.5 text-[var(--color-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
          {[['home', homeName], ['away', awayName]].map(([side, team]) => (
            <optgroup key={side} label={team}>
              {players.filter((x) => x.side === side).map((x) => <option key={x.id} value={x.id}>{x.name} ({x.actions} acciones)</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <svg viewBox={`0 0 ${PW} ${PH}`} className="mt-3 block h-auto w-full" role="img" aria-label={`Mapa de calor de ${p.name}`}>
        <rect width={PW} height={PH} rx={14} fill="oklch(0.22 0.03 150)" />
        {cells.map((v, i) => v > 0 && (
          <rect key={i} x={PP + (i % gx) * cw} y={PP + Math.floor(i / gx) * ch} width={cw + 0.5} height={ch + 0.5} fill="oklch(0.80 0.19 55)" opacity={Math.pow(v / max, 0.65)} />
        ))}
        <PitchLines />
        <text x={PW - PP - 14} y={PH - PP - 14} textAnchor="end" fontFamily="var(--font-mono)" fontSize={18} fill="var(--color-fg)" opacity={0.8}>ataca →</text>
      </svg>
    </div>
  );
}

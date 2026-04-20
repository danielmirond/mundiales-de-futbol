import { FIXTURES_2026 } from '@/lib/wc-2026';

type Slot = {
  n: number;
  label: string;
  sub?: string;
  home?: string;
  away?: string;
};

function slotsForStage(stage: string): Slot[] {
  return FIXTURES_2026.filter((f) => f.stage === stage).map((f) => ({
    n: f.n,
    label: f.label ?? (f.home && f.away ? `${f.home} vs ${f.away}` : 'TBD vs TBD'),
    sub: f.date,
    home: f.home,
    away: f.away,
  }));
}

/**
 * Stylised KO bracket — R32 → R16 → QF → SF → Final.
 * 3rd place sits separately below the main graph.
 * SVG-based, responsive via viewBox.
 */
export function WC2026Bracket() {
  const r32 = slotsForStage('R32');
  const r16 = slotsForStage('R16');
  const qf = slotsForStage('QF');
  const sf = slotsForStage('SF');
  const fi = slotsForStage('FINAL');
  const p3 = slotsForStage('3P');

  // Layout parameters (viewBox 1400 × 900)
  const W = 1400;
  const H = 900;
  const colX = [40, 280, 540, 800, 1070]; // R32, R16, QF, SF, Final
  const colWidth = 220;
  const slotH = 44;
  const slotGap = 8;

  // Distribute 16 R32 in two columns of 8 each (left/right halves)
  // Left bracket: 8 slots stacked
  // Right bracket: 8 slots stacked (mirrored)
  // ...Simplified: render all 16 in one column for clarity.

  function yForIndex(i: number, total: number) {
    const topPadding = 60;
    const available = H - topPadding * 2;
    const step = available / (total - 1 || 1);
    return topPadding + i * step;
  }

  function SlotBox({
    x, y, w, h, label, home, away, highlight,
  }: {
    x: number; y: number; w: number; h: number;
    label: string; home?: string; away?: string; highlight?: boolean;
  }) {
    return (
      <g>
        <rect
          x={x} y={y} width={w} height={h} rx={8}
          fill={highlight ? 'rgba(0,255,133,0.08)' : 'rgba(255,255,255,0.03)'}
          stroke={highlight ? 'var(--color-pitch)' : 'rgba(255,255,255,0.12)'}
          strokeWidth="1"
        />
        <text
          x={x + 10}
          y={y + 18}
          fontFamily="'Geist Mono', ui-monospace, monospace"
          fontSize="9"
          fill="var(--color-fg-subtle)"
          letterSpacing="1"
        >
          {label.toUpperCase()}
        </text>
        <text
          x={x + 10}
          y={y + h - 12}
          fontFamily="'Geist', ui-sans-serif, system-ui"
          fontSize="12"
          fill="var(--color-fg)"
          fontWeight="500"
        >
          {home && away ? `${home} vs ${away}` : 'TBD · TBD'}
        </text>
      </g>
    );
  }

  function Connector({
    x1, y1, x2, y2,
  }: { x1: number; y1: number; x2: number; y2: number }) {
    const midX = (x1 + x2) / 2;
    return (
      <path
        d={`M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
    );
  }

  return (
    <section id="bracket" className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Bracket · eliminatorias
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        Camino a MetLife
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
        Nuevo formato a 48 equipos: una R32 inédita precede a los octavos. En total, 32 partidos
        eliminatorios hasta la final en Nueva York.
      </p>

      <div className="mt-10 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full min-w-[900px] h-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]"
        >
          {/* Connectors */}
          {r32.map((_, i) => (
            <Connector
              key={`c32-${i}`}
              x1={colX[0] + colWidth}
              y1={yForIndex(i, 16)}
              x2={colX[1]}
              y2={yForIndex(Math.floor(i / 2), 8)}
            />
          ))}
          {r16.map((_, i) => (
            <Connector
              key={`c16-${i}`}
              x1={colX[1] + colWidth}
              y1={yForIndex(i, 8)}
              x2={colX[2]}
              y2={yForIndex(Math.floor(i / 2), 4)}
            />
          ))}
          {qf.map((_, i) => (
            <Connector
              key={`cqf-${i}`}
              x1={colX[2] + colWidth}
              y1={yForIndex(i, 4)}
              x2={colX[3]}
              y2={yForIndex(Math.floor(i / 2), 2)}
            />
          ))}
          {sf.map((_, i) => (
            <Connector
              key={`csf-${i}`}
              x1={colX[3] + colWidth}
              y1={yForIndex(i, 2)}
              x2={colX[4]}
              y2={yForIndex(0, 1)}
            />
          ))}

          {/* R32 */}
          {r32.map((s, i) => (
            <SlotBox
              key={`r32-${i}`}
              x={colX[0]} y={yForIndex(i, 16) - slotH / 2} w={colWidth} h={slotH}
              label={`R32 · ${i + 1}`}
              home={s.home} away={s.away}
            />
          ))}
          {/* R16 */}
          {r16.map((s, i) => (
            <SlotBox
              key={`r16-${i}`}
              x={colX[1]} y={yForIndex(i, 8) - slotH / 2} w={colWidth} h={slotH}
              label={`Octavos · ${i + 1}`}
              home={s.home} away={s.away}
            />
          ))}
          {/* QF */}
          {qf.map((s, i) => (
            <SlotBox
              key={`qf-${i}`}
              x={colX[2]} y={yForIndex(i, 4) - slotH / 2} w={colWidth} h={slotH}
              label={`Cuartos · ${i + 1}`}
              home={s.home} away={s.away}
            />
          ))}
          {/* SF */}
          {sf.map((s, i) => (
            <SlotBox
              key={`sf-${i}`}
              x={colX[3]} y={yForIndex(i, 2) - slotH / 2} w={colWidth} h={slotH}
              label={`Semifinal · ${i + 1}`}
              home={s.home} away={s.away}
            />
          ))}
          {/* Final */}
          {fi.map((s, i) => (
            <SlotBox
              key={`final-${i}`}
              x={colX[4]} y={yForIndex(0, 1) - slotH / 2} w={colWidth} h={slotH + 10}
              label={'🏆 FINAL · 19 JUL'}
              home={s.home} away={s.away}
              highlight
            />
          ))}

          {/* Column headers */}
          {[
            { x: colX[0] + colWidth / 2, label: 'R32 · 28 JUN — 3 JUL' },
            { x: colX[1] + colWidth / 2, label: 'OCTAVOS · 4 — 7 JUL' },
            { x: colX[2] + colWidth / 2, label: 'CUARTOS · 9 — 11 JUL' },
            { x: colX[3] + colWidth / 2, label: 'SEMIS · 14 — 15 JUL' },
            { x: colX[4] + colWidth / 2, label: 'FINAL' },
          ].map((h, i) => (
            <text
              key={i}
              x={h.x}
              y={28}
              textAnchor="middle"
              fontFamily="'Geist Mono', ui-monospace, monospace"
              fontSize="10"
              fill="var(--color-pitch)"
              letterSpacing="1.2"
            >
              {h.label}
            </text>
          ))}
        </svg>
      </div>

      {p3[0] && (
        <div className="mt-8 flex flex-col items-center gap-1 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
            3er puesto · 18 jul · Hard Rock Stadium
          </div>
          <div className="font-display text-xl uppercase text-[var(--color-fg)]">
            {p3[0].home && p3[0].away ? `${p3[0].home} vs ${p3[0].away}` : 'Perdedor SF1 vs Perdedor SF2'}
          </div>
        </div>
      )}
    </section>
  );
}

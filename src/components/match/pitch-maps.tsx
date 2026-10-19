import { fetchPitchData, HEAT_GRID, type Shot } from '@/lib/espn-plays';
import type { EspnPath } from '@/lib/wc-2026-match-summary';
import { PW, PH, PP, px, py, HOME, AWAY, PitchLines } from './pitch';
import { HeatmapPicker } from './heatmap-picker';

const last = (n: string) => n.trim().split(/\s+/).slice(-1)[0];
const RESULT_ES: Record<Shot['result'], string> = { goal: 'gol', on: 'a puerta', off: 'fuera', blocked: 'bloqueado' };

/**
 * «Tiros y mapa de calor» de la ficha de partido de fútbol (ESPN, jugadas con coordenadas).
 * Mapa de tiros con cada equipo atacando hacia un lado y mapa de calor por jugador con selector.
 */
export async function MatchPitchMaps({ espn, id, live, homeName, awayName }: { espn: EspnPath; id: string; live?: boolean; homeName: string; awayName: string }) {
  const data = await fetchPitchData(espn, id, live);
  if (!data) return null;
  const { shots, players } = data;
  // El local ataca hacia la izquierda (giro de 180°); el visitante, hacia la derecha.
  const pos = (s: Shot) => (s.side === 'home' ? { x: px(100 - s.x), y: py(s.y) } : { x: px(s.x), y: py(100 - s.y) });
  const tally = (side: Shot['side']) => {
    const t = shots.filter((s) => s.side === side);
    return `${t.length} tiros · ${t.filter((s) => s.result === 'goal' || s.result === 'on').length} a puerta`;
  };
  // Etiquetas de los goles: arriba, abajo, a un lado o al otro, la primera que no pise a las anteriores.
  const boxes: { x: number; y: number; w: number }[] = [];
  const labels = new Map<number, { x: number; y: number; anchor: 'middle' | 'start' | 'end' }>();
  shots.forEach((s, i) => {
    if (s.result !== 'goal') return;
    const { x, y } = pos(s);
    const w = (last(s.player).length + s.minute.length + 1) * 11;
    const tries = [{ x, y: y - 22, anchor: 'middle' as const, cx: x }, { x, y: y + 34, anchor: 'middle' as const, cx: x }, { x: x + 20, y: y + 6, anchor: 'start' as const, cx: x + 20 + w / 2 }, { x: x - 20, y: y + 6, anchor: 'end' as const, cx: x - 20 - w / 2 }];
    const ok = tries.find((t) => boxes.every((b) => Math.abs(b.x - t.cx) > (b.w + w) / 2 || Math.abs(b.y - t.y) > 22)) ?? tries[0];
    boxes.push({ x: ok.cx, y: ok.y, w });
    labels.set(i, ok);
  });
  const scorer = shots.find((s) => s.result === 'goal')?.player;
  const initial = players.find((p) => p.name === scorer)?.id;
  return (
    <section id="mapas" className="mx-auto mt-10 w-full max-w-[1000px] scroll-mt-28 px-6 md:px-10" aria-labelledby="mapas-titulo">
      <div className="kicker">Sobre el campo</div>
      <h2 id="mapas-titulo" className="t-h2 mt-2 text-[var(--color-fg)]">Tiros y mapa de calor</h2>
      {shots.length > 0 && (
        <div className="mt-5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 md:p-5">
          <h3 className="sub-label">Mapa de tiros</h3>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox={`0 0 ${PW} ${PH}`} className="block h-auto w-full min-w-[520px]" role="img" aria-label={`Mapa de tiros del ${homeName}-${awayName}`}>
              <rect width={PW} height={PH} rx={14} fill="oklch(0.30 0.06 150)" />
              <PitchLines />
              <text x={PP + 14} y={PP + 30} fontFamily="var(--font-mono)" fontSize={18} fill="var(--color-fg)" opacity={0.8}>← ataca {homeName}</text>
              <text x={PW - PP - 14} y={PP + 30} textAnchor="end" fontFamily="var(--font-mono)" fontSize={18} fill="var(--color-fg)" opacity={0.8}>ataca {awayName} →</text>
              {shots.map((s, i) => {
                const { x, y } = pos(s);
                const col = s.side === 'home' ? HOME : AWAY;
                const goal = s.result === 'goal';
                return (
                  <g key={i}>
                    <title>{`${s.minute} ${s.player}: ${RESULT_ES[s.result]}${s.header ? ' (de cabeza)' : ''}${s.penalty ? ' (penalti)' : ''}`}</title>
                    <circle cx={x} cy={y} r={goal ? 15 : 10} fill={goal || s.result === 'on' ? col : 'none'} stroke={col} strokeWidth={3} strokeDasharray={s.result === 'blocked' ? '4 3' : undefined} />
                    {goal && labels.get(i) && <text x={labels.get(i)!.x} y={labels.get(i)!.y} textAnchor={labels.get(i)!.anchor} fontSize={20} fontWeight={600} fill="var(--color-fg)" paintOrder="stroke" stroke="oklch(0.30 0.06 150)" strokeWidth={5}>{last(s.player)} {s.minute}</text>}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-[var(--color-fg-muted)]">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: HOME }} />{homeName}: {tally('home')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: AWAY }} />{awayName}: {tally('away')}</span>
            <span>Círculo grande: gol · relleno: a puerta · hueco: fuera · discontinuo: bloqueado</span>
          </div>
        </div>
      )}
      {players.length > 0 && (
        <div className="mt-4 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 md:p-5">
          <h3 className="sub-label mb-3">Mapa de calor</h3>
          <HeatmapPicker players={players} grid={HEAT_GRID} homeName={homeName} awayName={awayName} initial={initial} />
          <p className="mt-3 text-[12px] text-[var(--color-fg-subtle)]">Cada jugador aparece atacando hacia la derecha. Cuenta todas sus acciones con balón: pases, controles, regates, entradas, despejes y tiros.</p>
        </div>
      )}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Datos: ESPN</p>
    </section>
  );
}

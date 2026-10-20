import { nflWinProb, nflTeam } from '@/lib/nfl-advanced';

const W = 900, H = 300, L = 44, R = 16, T = 18, B = 34;

/** Probabilidad de victoria jugada a jugada (nflverse) en la ficha de un partido de la NFL terminado. */
export function NflWinProbChart({ espnId }: { espnId: string }) {
  const g = nflWinProb(espnId);
  if (!g) return null;
  const home = nflTeam(g.home), away = nflTeam(g.away);
  const end = Math.max(3600, ...g.pts.map((p) => p[0]));
  const x = (t: number) => L + (t / end) * (W - L - R);
  const y = (w: number) => T + (1 - w) * (H - T - B);
  const line = g.pts.map(([t, w], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)} ${y(w).toFixed(1)}`).join(' ');
  const first = g.pts[0], last = g.pts[g.pts.length - 1];
  const area = `${line} L${x(last[0]).toFixed(1)} ${y(0.5)} L${x(first[0]).toFixed(1)} ${y(0.5)} Z`;
  const hc = home?.color ?? 'var(--accent)', ac = away?.color ?? 'var(--color-fg-muted)';
  // Momento de mayor giro: la jugada que más movió la probabilidad.
  let swing = { t: 0, d: 0 };
  for (let i = 1; i < g.pts.length; i++) { const d = Math.abs(g.pts[i][1] - g.pts[i - 1][1]); if (d > swing.d) swing = { t: g.pts[i][0], d }; }
  const atSwing = g.scores.find((s) => Math.abs(s.t - swing.t) < 30);
  const quarters = [900, 1800, 2700, 3600].filter((q) => q <= end);
  const wpAt = (t: number) => g.pts.reduce((acc, p) => (p[0] <= t ? p[1] : acc), g.pts[0][1]);
  return (
    <section id="probabilidad" className="mx-auto mt-10 w-full max-w-[1000px] scroll-mt-28 px-6 md:px-10" aria-labelledby="wp-titulo">
      <div className="kicker">Partido, jugada a jugada</div>
      <h2 id="wp-titulo" className="t-h2 mt-2 text-[var(--color-fg)]">Probabilidad de victoria</h2>
      <div className="mt-5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 md:p-5">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[560px]" role="img" aria-label={`Probabilidad de victoria de ${home?.name ?? g.home} y ${away?.name ?? g.away} durante el partido`}>
            <defs>
              <clipPath id="wp-top"><rect x={L} y={T} width={W - L - R} height={y(0.5) - T} /></clipPath>
              <clipPath id="wp-bot"><rect x={L} y={y(0.5)} width={W - L - R} height={H - B - y(0.5)} /></clipPath>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--color-border)" strokeDasharray={v === 0.5 ? undefined : '3 4'} />
                <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-fg-subtle)">{`${Math.round(Math.max(v, 1 - v) * 100)} %`}</text>
              </g>
            ))}
            {quarters.map((q, i) => (
              <g key={q}>
                <line x1={x(q)} x2={x(q)} y1={T} y2={H - B} stroke="var(--color-border)" />
                <text x={x(q) - (x(q) - x(i ? quarters[i - 1] : 0)) / 2} y={H - 12} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-fg-subtle)">{`${i + 1}.º cuarto`}</text>
              </g>
            ))}
            {end > 3600 && <text x={(x(3600) + x(end)) / 2} y={H - 12} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-fg-subtle)">Prórroga</text>}
            <path d={area} fill={hc} opacity={0.28} clipPath="url(#wp-top)" />
            <path d={area} fill={ac} opacity={0.28} clipPath="url(#wp-bot)" />
            <path d={line} fill="none" stroke="var(--color-fg)" strokeWidth={2} />
            {g.scores.map((s, i) => (
              <circle key={i} cx={x(s.t)} cy={y(wpAt(s.t))} r={4} fill={s.team === g.home ? hc : ac} stroke="var(--color-bg-2)" strokeWidth={1.5}>
                <title>{s.text}</title>
              </circle>
            ))}
            <text x={L + 8} y={T + 14} fontSize={12} fontWeight={600} fill="var(--color-fg)">{home?.name ?? g.home}</text>
            <text x={L + 8} y={H - B - 8} fontSize={12} fontWeight={600} fill="var(--color-fg)">{away?.name ?? g.away}</text>
          </svg>
        </div>
        <p className="mt-3 text-[13px] text-[var(--color-fg-muted)]">
          Por encima de la línea central, ventaja de {home?.nick ?? g.home}; por debajo, de {away?.nick ?? g.away}. Cada punto es una anotación.
          {atSwing ? ` El momento que más cambió el partido: ${atSwing.text}.` : ''}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Datos: nflverse (CC BY 4.0)</p>
      </div>
    </section>
  );
}

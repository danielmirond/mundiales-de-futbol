import { displayName, type LineupPlayer } from '@/lib/data/match-detail';

type Cat = 'GK' | 'DF' | 'MF' | 'FW';

function group(players: LineupPlayer[]) {
  const g: Record<Cat, LineupPlayer[]> = { GK: [], DF: [], MF: [], FW: [] };
  for (const p of players) {
    const c = (p.position ?? 'MF') as Cat;
    (g[c] ?? g.MF).push(p);
  }
  // Stable-ish horizontal order: by shirt number ascending
  (Object.keys(g) as Cat[]).forEach((k) => {
    g[k].sort((a, b) => (a.shirt_number ?? 99) - (b.shirt_number ?? 99));
  });
  return g;
}

function formationLabel(g: Record<Cat, LineupPlayer[]>) {
  const df = g.DF.length;
  const mf = g.MF.length;
  const fw = g.FW.length;
  if (df + mf + fw === 0) return '-';
  return [df, mf, fw].filter((n) => n > 0).join('-');
}

// Pitch in FIFA-ish proportions: 105m × 68m.
const PITCH_W = 105;
const PITCH_H = 68;

// Compute Y coordinates evenly spread across the pitch for N players.
function distributeY(n: number, pad = 6) {
  if (n <= 0) return [];
  if (n === 1) return [PITCH_H / 2];
  const usable = PITCH_H - pad * 2;
  return Array.from({ length: n }, (_, i) => pad + (usable * i) / (n - 1));
}

type Side = 'left' | 'right';

function xsByCategory(side: Side) {
  // Left side owns x ∈ [0..52.5], attacks right.
  // Right side owns x ∈ [52.5..105], attacks left.
  if (side === 'left') {
    return { GK: 4, DF: 17, MF: 32, FW: 46 };
  }
  return { GK: 101, DF: 88, MF: 73, FW: 59 };
}

function PlayerMarker({
  x,
  y,
  p,
  fill,
  ring,
}: {
  x: number;
  y: number;
  p: LineupPlayer;
  fill: string;
  ring: string;
}) {
  const r = 2.8;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 0.6} fill="none" stroke={ring} strokeWidth="0.35" />
      <circle cx={x} cy={y} r={r} fill={fill} stroke="#ffffff" strokeWidth="0.25" />
      <text
        x={x}
        y={y + 0.9}
        textAnchor="middle"
        fontFamily="'Geist Mono', ui-monospace, monospace"
        fontSize="2.4"
        fontWeight="600"
        fill="#ffffff"
      >
        {p.shirt_number ?? ''}
      </text>
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fontFamily="'Geist Mono', ui-monospace, monospace"
        fontSize="1.85"
        fill="#f5f6f8"
        style={{ paintOrder: 'stroke' }}
        stroke="#000000"
        strokeOpacity="0.55"
        strokeWidth="0.6"
      >
        {truncate(displayName(p.player), 18)}
      </text>
    </g>
  );
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  const parts = s.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}. ${parts.slice(1).join(' ')}`.slice(0, max);
  }
  return s.slice(0, max - 1) + '…';
}

function TeamOnSide({
  side,
  players,
  paletteFrom,
  paletteTo,
}: {
  side: Side;
  players: LineupPlayer[];
  paletteFrom: string;
  paletteTo: string;
}) {
  const g = group(players);
  const xs = xsByCategory(side);

  const fill = side === 'left' ? paletteFrom : paletteTo;
  const ring = side === 'left' ? paletteFrom : paletteTo;

  // GK always single player at mid-y
  const gkY = distributeY(g.GK.length);

  // Other rows: distribute based on count
  const dfY = distributeY(g.DF.length, 5);
  const mfY = distributeY(g.MF.length, 6);
  const fwY = distributeY(g.FW.length, 8);

  return (
    <g>
      {g.GK.map((p, i) => (
        <PlayerMarker key={p.player_id} x={xs.GK} y={gkY[i]} p={p} fill={fill} ring={ring} />
      ))}
      {g.DF.map((p, i) => (
        <PlayerMarker key={p.player_id} x={xs.DF} y={dfY[i]} p={p} fill={fill} ring={ring} />
      ))}
      {g.MF.map((p, i) => (
        <PlayerMarker key={p.player_id} x={xs.MF} y={mfY[i]} p={p} fill={fill} ring={ring} />
      ))}
      {g.FW.map((p, i) => (
        <PlayerMarker key={p.player_id} x={xs.FW} y={fwY[i]} p={p} fill={fill} ring={ring} />
      ))}
    </g>
  );
}

export function PitchFormation({
  homeStarters,
  awayStarters,
  homeName,
  awayName,
  homeFlag,
  awayFlag,
  paletteFrom = '#00FF85',
  paletteTo = '#FF3B3B',
}: {
  homeStarters: LineupPlayer[];
  awayStarters: LineupPlayer[];
  homeName: string;
  awayName: string;
  homeFlag?: string | null;
  awayFlag?: string | null;
  paletteFrom?: string;
  paletteTo?: string;
}) {
  const homeGroup = group(homeStarters);
  const awayGroup = group(awayStarters);
  const homeFormation = formationLabel(homeGroup);
  const awayFormation = formationLabel(awayGroup);

  return (
    <figure className="relative mx-auto w-full max-w-[1400px]">
      <svg
        viewBox={`0 0 ${PITCH_W} ${PITCH_H}`}
        className="block w-full h-auto rounded-3xl border border-[var(--color-border)]"
        style={{ background: '#0a1f12' }}
        role="img"
        aria-label="Alineaciones sobre el terreno de juego"
      >
        {/* Subtle grass stripes */}
        <defs>
          <pattern id="stripes" width="10.5" height="68" patternUnits="userSpaceOnUse">
            <rect width="10.5" height="68" fill="#0a1f12" />
            <rect width="10.5" height="68" fill="#0d2618" opacity="0.55" x="5.25" />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <rect width={PITCH_W} height={PITCH_H} fill="url(#stripes)" />

        {/* Pitch lines */}
        <g fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.22">
          <rect x="0.3" y="0.3" width={PITCH_W - 0.6} height={PITCH_H - 0.6} />
          {/* Halfway line */}
          <line x1={PITCH_W / 2} y1="0" x2={PITCH_W / 2} y2={PITCH_H} />
          {/* Center circle */}
          <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="9.15" />
          <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="0.3" fill="rgba(255,255,255,0.4)" />
          {/* Left penalty area */}
          <rect x="0" y="13.85" width="16.5" height="40.3" />
          <rect x="0" y="24.85" width="5.5" height="18.3" />
          <circle cx="11" cy={PITCH_H / 2} r="0.3" fill="rgba(255,255,255,0.4)" />
          {/* Right penalty area */}
          <rect x={PITCH_W - 16.5} y="13.85" width="16.5" height="40.3" />
          <rect x={PITCH_W - 5.5} y="24.85" width="5.5" height="18.3" />
          <circle cx={PITCH_W - 11} cy={PITCH_H / 2} r="0.3" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* Vignette overlay */}
        <rect width={PITCH_W} height={PITCH_H} fill="url(#vignette)" />

        {/* Team labels top corners */}
        <text
          x="2"
          y="3.5"
          fontFamily="'Geist Mono', ui-monospace, monospace"
          fontSize="2"
          fill="rgba(255,255,255,0.85)"
          letterSpacing="0.35"
        >
          {`${homeFlag ?? ''} ${homeName.toUpperCase()}  ·  ${homeFormation}`.trim()}
        </text>
        <text
          x={PITCH_W - 2}
          y="3.5"
          textAnchor="end"
          fontFamily="'Geist Mono', ui-monospace, monospace"
          fontSize="2"
          fill="rgba(255,255,255,0.85)"
          letterSpacing="0.35"
        >
          {`${awayFormation}  ·  ${awayName.toUpperCase()} ${awayFlag ?? ''}`.trim()}
        </text>

        {/* Players */}
        <TeamOnSide side="left" players={homeStarters} paletteFrom={paletteFrom} paletteTo={paletteTo} />
        <TeamOnSide side="right" players={awayStarters} paletteFrom={paletteFrom} paletteTo={paletteTo} />
      </svg>
    </figure>
  );
}

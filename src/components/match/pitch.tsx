/** Campo de 105 × 68 m (en decímetros) para mapas de tiros y de calor; sin estado, vale en servidor y cliente. */
export const PW = 1050;
export const PH = 680;
export const PP = 20;
export const px = (x: number) => PP + (x / 100) * (PW - 2 * PP);
export const py = (y: number) => PP + (y / 100) * (PH - 2 * PP);
export const HOME = 'oklch(0.80 0.14 230)';
export const AWAY = 'oklch(0.82 0.15 70)';

export function PitchLines() {
  const line = 'rgba(255,255,255,0.22)';
  return (
    <g fill="none" stroke={line} strokeWidth={2}>
      <rect x={PP} y={PP} width={PW - 2 * PP} height={PH - 2 * PP} />
      <line x1={PW / 2} y1={PP} x2={PW / 2} y2={PH - PP} />
      <circle cx={PW / 2} cy={PH / 2} r={88} />
      <rect x={PP} y={PH / 2 - 198} width={160} height={396} />
      <rect x={PW - PP - 160} y={PH / 2 - 198} width={160} height={396} />
      <rect x={PP} y={PH / 2 - 90} width={55} height={180} />
      <rect x={PW - PP - 55} y={PH / 2 - 90} width={55} height={180} />
      <line x1={PP - 8} y1={PH / 2 - 36} x2={PP - 8} y2={PH / 2 + 36} strokeWidth={6} />
      <line x1={PW - PP + 8} y1={PH / 2 - 36} x2={PW - PP + 8} y2={PH / 2 + 36} strokeWidth={6} />
    </g>
  );
}

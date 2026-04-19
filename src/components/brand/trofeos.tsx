import { cn } from '@/lib/utils';

type Props = { size?: number; className?: string; showLabel?: boolean };

/**
 * Variant 4 — "Trofeos Neón".
 * Original SVG shapes from the brand kit zip, rendered in neon green
 * outline with a soft glow drop-shadow.
 */
export function Trofeos({ size = 260, className, showLabel = true }: Props) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-4', className)}>
      <div
        className="flex items-end gap-5"
        style={{ filter: 'drop-shadow(0 0 14px rgba(0,255,133,0.45))' }}
      >
        {/* Trophy A — Jules Rimet silhouette */}
        <svg
          width={size * 0.42}
          height={size * 0.68}
          viewBox="0 0 68 110"
          fill="none"
          stroke="rgba(245, 246, 248, 0.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Jules Rimet trophy"
        >
          <path d="M20 16 C20 38, 24 58, 34 62 C44 58, 48 38, 48 16 Z" />
          <path d="M20 22 C10 22, 8 34, 16 40" />
          <path d="M48 22 C58 22, 60 34, 52 40" />
          <path d="M30 62 L30 74 L38 74 L38 62" />
          <path d="M22 74 L46 74 L48 84 L20 84 Z" />
          <path d="M18 84 L50 84 L52 94 L16 94 Z" />
          <circle cx="34" cy="32" r="3" />
          <path d="M26 20 L42 20" opacity="0.5" />
        </svg>

        {/* Trophy B — modern FIFA World Cup silhouette */}
        <svg
          width={size * 0.42}
          height={size * 0.68}
          viewBox="0 0 68 110"
          fill="none"
          stroke="var(--color-pitch, #00FF85)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="FIFA World Cup trophy"
        >
          <path d="M26 12 L42 12 L44 22 L40 56 C40 62, 36 66, 34 66 C32 66, 28 62, 28 56 L24 22 Z" />
          <path d="M24 22 C16 22, 14 30, 20 36" />
          <path d="M44 22 C52 22, 54 30, 48 36" />
          <path d="M30 66 L30 78 L38 78 L38 66" />
          <ellipse cx="34" cy="82" rx="14" ry="3" />
          <rect x="22" y="84" width="24" height="6" />
          <ellipse cx="34" cy="92" rx="18" ry="3" />
          <path d="M30 32 L38 32 M30 40 L38 40" opacity="0.5" />
        </svg>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center gap-1 text-center">
          <div
            className="font-display uppercase leading-none text-[var(--color-fg)]"
            style={{ fontSize: size * 0.14, letterSpacing: '-0.02em' }}
          >
            22 Mundiales de Fútbol
          </div>
        </div>
      )}
    </div>
  );
}

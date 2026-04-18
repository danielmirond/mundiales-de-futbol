import { cn } from '@/lib/utils';

type Props = {
  size?: number;
  className?: string;
  variant?: 'solid' | 'outline';
};

/**
 * Variant 1 — "Sello Técnico de Datos".
 * Chronograph-bezel inspired circle mark with 60 tick marks around the rim,
 * filled green disc, and the "22" numeral in bold display type.
 */
export function LogomarkSeal({ size = 48, className, variant = 'solid' }: Props) {
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Mundiales de Fútbol — 22 ediciones"
      className={cn('block', className)}
    >
      {/* Tick marks around the rim */}
      <g stroke="var(--color-pitch, #00FF85)" strokeWidth="2.5" strokeLinecap="round">
        {ticks.map((angle) => {
          const major = angle % 30 === 0;
          const y1 = 8;
          const y2 = major ? 20 : 14;
          return (
            <line
              key={angle}
              x1="100"
              y1={y1}
              x2="100"
              y2={y2}
              transform={`rotate(${angle} 100 100)`}
              opacity={major ? 1 : 0.55}
            />
          );
        })}
      </g>

      {/* Filled disc */}
      {variant === 'solid' ? (
        <circle cx="100" cy="100" r="72" fill="var(--color-pitch, #00FF85)" />
      ) : (
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="var(--color-pitch, #00FF85)"
          strokeWidth="3"
        />
      )}

      {/* 22 numeral */}
      <text
        x="100"
        y="104"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Bebas Neue', Impact, system-ui, sans-serif"
        fontWeight="700"
        fontSize="90"
        letterSpacing="-2"
        fill={variant === 'solid' ? '#000' : 'var(--color-pitch, #00FF85)'}
      >
        22
      </text>
    </svg>
  );
}

/**
 * Horizontal lockup: seal + "MUNDIALES DE FÚTBOL" wordmark.
 */
export function LogomarkLockup({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-4', className)}>
      <LogomarkSeal size={size} />
      <div className="flex flex-col leading-none font-display uppercase">
        <span className="text-[1.7em]" style={{ fontSize: size * 0.52, letterSpacing: '-0.01em' }}>
          Mundiales
        </span>
        <span
          className="text-[var(--color-fg-muted)]"
          style={{ fontSize: size * 0.32, letterSpacing: '0.05em', marginTop: 2 }}
        >
          de Fútbol
        </span>
      </div>
    </div>
  );
}

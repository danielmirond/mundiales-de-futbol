import { cn } from '@/lib/utils';

type Props = { size?: number; className?: string; ticks?: number };

/**
 * Variant 3, "Línea de Tiempo Cinematográfica".
 * Wordmark above a dotted timeline ending with a glowing green dot ("now").
 */
export function TimelineMark({ size = 64, className, ticks = 12 }: Props) {
  const dots = Array.from({ length: ticks }, (_, i) => i);
  const dotSize = Math.max(2, size * 0.04);
  const endDotSize = size * 0.1;

  return (
    <div className={cn('inline-flex flex-col gap-4', className)}>
      <span
        className="font-display uppercase leading-none text-[var(--color-fg)]"
        style={{ fontSize: size, letterSpacing: '-0.02em' }}
      >
        Mundiales de Fútbol
      </span>
      <div className="flex items-center gap-[6px]">
        {dots.map((i) => (
          <span
            key={i}
            className="block rounded-full bg-[var(--color-fg-subtle)]"
            style={{ width: dotSize, height: dotSize }}
          />
        ))}
        <span
          className="block rounded-full bg-[var(--color-pitch)]"
          style={{
            width: endDotSize,
            height: endDotSize,
            boxShadow: `0 0 ${endDotSize * 1.6}px ${endDotSize * 0.2}px rgba(0,255,133,0.7)`,
          }}
        />
      </div>
    </div>
  );
}

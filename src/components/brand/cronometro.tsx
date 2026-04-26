import { cn } from '@/lib/utils';

type Props = { size?: number; className?: string };

/**
 * Variant 2, "Cronómetro Técnico".
 * Horizontal lockup with temporal data on the left and the wordmark on the right.
 */
export function Cronometro({ size = 64, className }: Props) {
  return (
    <div className={cn('inline-flex items-center gap-6 text-[var(--color-fg)]', className)}>
      <div className="flex flex-col items-end leading-none">
        <div className="flex items-center gap-2 font-display uppercase" style={{ fontSize: size * 0.42 }}>
          <span>1930</span>
          <span style={{ width: size * 0.3, height: 2, background: 'var(--color-pitch)' }} />
          <span>2026</span>
        </div>
        <div
          className="mt-1 font-mono"
          style={{
            fontSize: size * 0.18,
            color: 'var(--color-pitch)',
            letterSpacing: '0.1em',
          }}
        >
          &apos;22
        </div>
      </div>

      <div className="h-[1.1em] w-px bg-[var(--color-border-strong)]" style={{ height: size * 0.9 }} />

      <div className="flex flex-col leading-none font-display uppercase">
        <span style={{ fontSize: size * 0.6, letterSpacing: '-0.01em' }}>Mundiales</span>
        <span
          className="text-[var(--color-fg-muted)]"
          style={{ fontSize: size * 0.36, letterSpacing: '0.05em', marginTop: 2 }}
        >
          de Fútbol
        </span>
      </div>
    </div>
  );
}

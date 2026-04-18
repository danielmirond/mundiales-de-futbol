import { cn } from '@/lib/utils';

type Props = { size?: number; className?: string; showLabel?: boolean };

/**
 * Variant 4 — "Trofeos Neón".
 * Stylised pair of the Jules Rimet and FIFA World Cup trophies in neon
 * outline. Not a 1:1 replica — a recognisable silhouette pair.
 */
export function Trofeos({ size = 260, className, showLabel = true }: Props) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-4', className)}>
      <svg
        width={size}
        height={size * 0.7}
        viewBox="0 0 400 280"
        role="img"
        aria-label="Jules Rimet & FIFA World Cup trophies"
        style={{ filter: 'drop-shadow(0 0 14px rgba(0,255,133,0.45))' }}
      >
        <g
          fill="none"
          stroke="var(--color-pitch, #00FF85)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* ——— Jules Rimet (left) ——— */}
          {/* Hexagonal base */}
          <path d="M50 260 L50 248 L60 238 L150 238 L160 248 L160 260 Z" />
          <line x1="50" y1="248" x2="160" y2="248" />
          <line x1="60" y1="238" x2="150" y2="238" />
          {/* Short neck/stem */}
          <path d="M85 238 L85 220 L125 220 L125 238" />
          {/* Cup body with flanking wings */}
          <path d="M72 220 L92 198 L118 198 L138 220 Z" />
          {/* Winged Nike figure (stylised) */}
          <path d="M105 200 C105 185, 95 178, 92 165 C95 170, 100 172, 105 175" />
          <path d="M105 200 C105 185, 115 178, 118 165 C115 170, 110 172, 105 175" />
          {/* Body + head */}
          <path d="M100 195 L100 160 Q105 150 110 160 L110 195" />
          <circle cx="105" cy="150" r="6" />
          {/* Arms holding trophy bowl */}
          <path d="M100 168 Q85 155 82 140" />
          <path d="M110 168 Q125 155 128 140" />
          <path d="M80 140 Q90 132 105 132 Q120 132 130 140" />

          {/* ——— FIFA World Cup (right) ——— */}
          {/* Cylindrical tiered base */}
          <ellipse cx="290" cy="260" rx="60" ry="8" />
          <path d="M236 260 L236 250 L344 250 L344 260" />
          <ellipse cx="290" cy="250" rx="54" ry="7" />
          <path d="M245 250 L245 235 L335 235 L335 250" />
          <ellipse cx="290" cy="235" rx="45" ry="6" />
          {/* Spiralling figures holding the globe */}
          <path d="M262 235 Q266 200 280 175 Q288 150 300 130" />
          <path d="M318 235 Q314 200 300 175 Q292 150 280 130" />
          {/* Horizontal rings suggesting the spiral */}
          <path d="M270 205 Q290 215 312 205" />
          <path d="M272 180 Q290 190 308 180" />
          <path d="M276 155 Q290 165 304 155" />
          {/* Globe on top */}
          <circle cx="290" cy="105" r="26" />
          <path d="M264 105 Q290 93 316 105" />
          <path d="M264 105 Q290 117 316 105" />
          <line x1="290" y1="79" x2="290" y2="131" />
          <path d="M278 82 Q278 105 278 128" />
          <path d="M302 82 Q302 105 302 128" />
          {/* Neon glow dot crown */}
          <circle cx="290" cy="74" r="3" fill="var(--color-pitch, #00FF85)" stroke="none" />
        </g>
      </svg>

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

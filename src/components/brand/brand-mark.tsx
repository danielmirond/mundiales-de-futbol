import { cn } from '@/lib/utils';

/**
 * Símbolo de Mundiales (línea marcador): dos fichas de un marcador de
 * paletas. Toma `currentColor`, así que en cada sección lleva el acento de su
 * deporte; el corte horizontal es una máscara, no un trazo del color del
 * fondo, para que funcione sobre foto y en cualquier tema.
 */
export function BrandSymbol({ size = 24, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cn('block shrink-0', className)}
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <mask id="mundiales-split">
          <rect width="24" height="24" fill="#fff" />
          <rect y="11.25" width="24" height="1.5" fill="#000" />
        </mask>
      </defs>
      <g mask="url(#mundiales-split)" fill="currentColor">
        <rect x="1.5" y="2" width="9.5" height="20" rx="2.2" />
        <rect x="13" y="2" width="9.5" height="20" rx="2.2" />
      </g>
    </svg>
  );
}

/**
 * Logotipo completo: símbolo + MUNDIALES en Bebas, y opcionalmente la
 * sección (FÚTBOL, BALONCESTO, 1930–2026…) en el color del acento.
 */
export function BrandLockup({ section, size = 'm', className }: { section?: string; size?: 's' | 'm' | 'l'; className?: string }) {
  const S = { s: { sym: 20, text: 'text-[22px]' }, m: { sym: 22, text: 'text-[26px] md:text-[28px]' }, l: { sym: 30, text: 'text-[36px]' } }[size];
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <BrandSymbol size={S.sym} className="text-[var(--accent)]" />
      <span className={cn('font-display leading-none tracking-[0.03em] text-[var(--color-fg)] pt-[0.12em]', S.text)}>MUNDIALES</span>
      {section && <span className={cn('font-display leading-none tracking-[0.03em] text-[var(--accent)] pt-[0.12em]', S.text, section.length > 10 && 'max-[430px]:hidden')}>{section}</span>}
    </span>
  );
}

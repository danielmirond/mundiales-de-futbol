import { inkFor } from '@/lib/color';

type Size = 's' | 'm' | 'l' | 'xl';
const PX: Record<Size, number> = { s: 20, m: 24, l: 40, xl: 88 };

/**
 * Escudo con placeholder de color del club. Sin logo (o si ESPN falla al cargar)
 * se ve un disco con el color primario del equipo y su abreviatura, con el
 * texto en negro o blanco según contraste. El placeholder va siempre debajo
 * de la imagen: si el PNG no carga, se ve el disco (estado de fallo sin JS).
 */
export function Crest({ src, abbr, color, size = 'm', alt = '' }: { src?: string; abbr: string; color?: string; size?: Size; alt?: string }) {
  const px = PX[size];
  const c = color ? (color.startsWith('#') ? color : `#${color}`) : undefined;
  const style = c ? ({ '--c': c, '--ci': inkFor(c) } as React.CSSProperties) : undefined;
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: px, height: px }}>
      <i className={`crest ${size === 'm' ? '' : size} absolute inset-0`} style={style} aria-hidden>{abbr.slice(0, 3)}</i>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} width={px} height={px} loading="lazy" className="relative h-full w-full object-contain" />
      )}
    </span>
  );
}

/**
 * Set de iconos propio del portal (sistema de diseño, pantalla 04).
 * Trazo 1.5 px sobre rejilla de 24, mismo grosor que Lucide para convivir.
 * Deportes toman el acento (`currentColor`); eventos usan colores semánticos.
 */
export const ICON_PATHS = {
  // deportes
  futbol: '<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.7 2.7-1.4 4.4H9.7l-1.4-4.4z"/><path d="M12 3v4.6M15.7 10.3l4.4-1.5M14.3 14.7l2.7 3.8M9.7 14.7L7 18.5M8.3 10.3L3.9 8.8"/>',
  baloncesto: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.7 5.6c3 2.7 3 10.1 0 12.8M18.3 5.6c-3 2.7-3 10.1 0 12.8"/>',
  rugby: '<ellipse cx="12" cy="12" rx="9.5" ry="5.6" transform="rotate(-38 12 12)"/><path d="M8.6 15.4l6.8-6.8M10 12.6l1.4 1.4M11.5 11.1l1.4 1.4M13 9.6l1.4 1.4"/>',
  balonmano: '<circle cx="12" cy="12" r="9"/><path d="M4.6 8.6c4.2 1.2 10.6 1.2 14.8 0M4.6 15.4c4.2-1.2 10.6-1.2 14.8 0M12 3c-2.6 3-2.6 15 0 18"/>',
  tenis: '<circle cx="12" cy="12" r="9"/><path d="M5.4 5.8c3.3 3.4 3.3 9 0 12.4M18.6 5.8c-3.3 3.4-3.3 9 0 12.4"/>',
  motor: '<path d="M5 21V3.5"/><path d="M5 4h14v10H5"/><path d="M5 4h3.5v3.3H5zM12 4h3.5v3.3H12zM8.5 7.3H12v3.4H8.5zM15.5 7.3H19v3.4h-3.5zM5 10.7h3.5V14H5zM12 10.7h3.5V14H12z" style="fill:currentColor;stroke:none"/>',
  ciclismo: '<circle cx="6" cy="16" r="3.8"/><circle cx="18" cy="16" r="3.8"/><path d="M6 16l3.6-6.5h6.2L18 16M9.6 9.5L12.5 16H6M14.2 6.5h2.6l-1 3"/>',
  atletismo: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.6M10 2.5h4M12 2.5V6M17.6 7.4l1.6-1.6"/>',
  golf: '<path d="M8 20.5V3l9 4-9 4"/><ellipse cx="10" cy="20.5" rx="6" ry="1.5"/>',
  mas: '<circle cx="5.5" cy="12" r="1.3" style="fill:currentColor"/><circle cx="12" cy="12" r="1.3" style="fill:currentColor"/><circle cx="18.5" cy="12" r="1.3" style="fill:currentColor"/>',
  // estados
  programado: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alineaciones: '<path d="M8 3.5L3 6.5l2 4 2-1V20h10V9.5l2 1 2-4-5-3c-.6 1.4-2.1 2.4-4 2.4S8.6 4.9 8 3.5z"/>',
  descanso: '<path d="M9 6v12M15 6v12"/>',
  prorroga: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  penaltis: '<path d="M3 17V6h18v11"/><path d="M3 10.5h18M8 6v11M13 6v11M18 6v11" style="opacity:.45"/><circle cx="12" cy="20.5" r="1" style="fill:currentColor"/>',
  final: '<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.6 2.6L16 9.6"/>',
  aplazado: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M9.5 15h5M12.5 13l2 2-2 2"/>',
  suspendido: '<circle cx="12" cy="12" r="9"/><path d="M5.7 18.3L18.3 5.7"/>',
  // eventos
  gol: '<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.7 2.7-1.4 4.4H9.7l-1.4-4.4z"/>',
  autogol: '<circle cx="12" cy="12" r="9" style="stroke:var(--color-loss)"/><path d="M12 7.6l3.7 2.7-1.4 4.4H9.7l-1.4-4.4z" style="stroke:var(--color-loss)"/><path d="M4 20L20 4" style="stroke:var(--color-loss)"/>',
  penalti: '<path d="M3 15V5h18v10"/><circle cx="12" cy="19.5" r="1.6" style="fill:currentColor"/>',
  amarilla: '<rect x="7" y="3.5" width="10" height="17" rx="1.6" transform="rotate(8 12 12)" style="fill:var(--color-gold);stroke:none"/>',
  roja: '<rect x="7" y="3.5" width="10" height="17" rx="1.6" transform="rotate(8 12 12)" style="fill:var(--color-loss);stroke:none"/>',
  dobleamarilla: '<rect x="4.5" y="4" width="9" height="15" rx="1.5" transform="rotate(-6 9 11.5)" style="fill:var(--color-gold);stroke:none"/><rect x="10.5" y="5" width="9" height="15" rx="1.5" transform="rotate(8 15 12.5)" style="fill:var(--color-loss);stroke:var(--color-bg-2);stroke-width:1.5"/>',
  cambio: '<path d="M8 20V5M4.5 8.5L8 5l3.5 3.5" style="stroke:var(--color-win)"/><path d="M16 4v15M12.5 15.5L16 19l3.5-3.5" style="stroke:var(--color-loss)"/>',
  var: '<rect x="3" y="4.5" width="18" height="12.5" rx="1.6"/><path d="M9 21h6M12 17v4"/><text x="12" y="13.2" text-anchor="middle" style="font:700 5.6px var(--font-mono);fill:currentColor;stroke:none;letter-spacing:.3px">VAR</text>',
  triple: '<path d="M4.5 7.5h15M6.8 7.5l1.6 9h7.2l1.6-9"/><path d="M9.4 7.5l1 9M14.6 7.5l-1 9" style="opacity:.45"/><text x="12" y="5" text-anchor="middle" style="font:700 5px var(--font-mono);fill:currentColor;stroke:none">3</text>',
  falta: '<path d="M2.5 11.5a5 5 0 1010 0V9h9v3.2h-5.6"/><circle cx="7.5" cy="11.5" r="1.4"/>',
  tiempomuerto: '<path d="M5 6.5h14M12 6.5V20" style="stroke-width:2.4"/>',
  // utilitarios
  pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 2.5l3 3.5 3-3.5"/>',
  estadio: '<path d="M3 9c0-2 4-3.5 9-3.5S21 7 21 9v6c0 2-4 3.5-9 3.5S3 17 3 15z"/><path d="M3 9c0 2 4 3.5 9 3.5S21 11 21 9"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  buscar: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  trofeo: '<path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M7 6H4.5a2.5 2.5 0 002.8 3.8M17 6h2.5a2.5 2.5 0 01-2.8 3.8M12 14v3.5M8.5 20.5h7l-.8-3h-5.4z"/>',
  noticias: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7 9h10M7 12.5h10M7 16h6"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

/**
 * El navegador serializa `<circle … />` como `<circle …></circle>`; para que
 * la hidratación de `dangerouslySetInnerHTML` coincida con el SSR, se
 * normalizan las etiquetas autocerradas.
 */
const normalize = (svg: string) => svg.replace(/<(\w+)([^>]*?)\s*\/>/g, '<$1$2></$1>');
const HTML: Record<string, string> = Object.fromEntries(Object.entries(ICON_PATHS).map(([k, v]) => [k, normalize(v)]));

/** Icono del set propio. `size` en px (por defecto 16). */
export function Icon({ name, size = 16, className, title }: { name: IconName; size?: number; className?: string; title?: string }) {
  const d = HTML[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={className}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + d }}
    />
  );
}

/** Icono de deporte por slug (desconocido → «más deportes»). */
export const SPORT_ICON: Record<string, IconName> = {
  futbol: 'futbol', baloncesto: 'baloncesto', rugby: 'rugby', balonmano: 'balonmano', tenis: 'tenis',
  motor: 'motor', ciclismo: 'ciclismo', atletismo: 'atletismo', golf: 'golf',
};
export const sportIcon = (slug: string): IconName => SPORT_ICON[slug] ?? 'mas';

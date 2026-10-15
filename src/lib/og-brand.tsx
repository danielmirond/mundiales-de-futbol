/**
 * Marca para las imágenes sociales (Satori/ImageResponse no lee CSS ni
 * oklch): símbolo de marcador con divs y MUNDIALES, en hex aproximados de
 * los acentos de deporte del sistema.
 */
export const SPORT_HEX: Record<string, string> = {
  futbol: '#4ede80', baloncesto: '#f5a04a', rugby: '#b48cf0', balonmano: '#7fa8f0', tenis: '#4fd6d6',
  motor: '#f0609e', 'futbol-americano': '#f08a5a', hockey: '#9cc8f0', beisbol: '#f07a7a', golf: '#a8d860',
  combate: '#f0605a', archivo: '#f2cf4a',
};

export function OgSymbol({ color, size = 40, bg = '#05060a' }: { color: string; size?: number; bg?: string }) {
  const w = size * 0.4, h = size * 0.84, r = size * 0.09;
  return (
    <div style={{ display: 'flex', position: 'relative', width: size, height: size }}>
      <div style={{ position: 'absolute', left: size * 0.06, top: size * 0.08, width: w, height: h, borderRadius: r, background: color }} />
      <div style={{ position: 'absolute', left: size * 0.54, top: size * 0.08, width: w, height: h, borderRadius: r, background: color }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: size * 0.47, height: Math.max(2, size * 0.06), background: bg }} />
    </div>
  );
}

export function OgBrand({ color, section, size = 40 }: { color: string; section?: string; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <OgSymbol color={color} size={size} />
      <div style={{ display: 'flex', fontSize: size * 1.05, fontWeight: 800, letterSpacing: '-0.01em', color: '#f5f6f8' }}>MUNDIALES</div>
      {section ? <div style={{ display: 'flex', fontSize: size * 1.05, fontWeight: 800, color }}>{section}</div> : null}
    </div>
  );
}

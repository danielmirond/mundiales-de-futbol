/** Luminancia relativa (WCAG) de un color hex. */
export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
/** Negro (#05060a) o blanco, el que contraste más sobre `hex`. */
export function inkFor(hex: string): string {
  try {
    const l = luminance(hex);
    return contrast(l, luminance('#05060a')) > contrast(l, luminance('#ffffff')) ? '#05060a' : '#fff';
  } catch {
    return '#fff';
  }
}

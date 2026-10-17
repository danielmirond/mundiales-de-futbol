import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/** Logo del publisher para el JSON-LD (raster, 512 × 512; guardarraíl T6 pide ≥ 112). Mismo símbolo que el icono de la app. */
export function GET() {
  const tile = { position: 'absolute' as const, top: 97, width: 154, height: 318, borderRadius: 37, background: '#4ede80' };
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#05060a' }}>
        <div style={{ ...tile, left: 85 }} />
        <div style={{ ...tile, left: 273 }} />
        <div style={{ position: 'absolute', left: 57, right: 57, top: 242, height: 28, background: '#05060a' }} />
      </div>
    ),
    { width: 512, height: 512, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  );
}

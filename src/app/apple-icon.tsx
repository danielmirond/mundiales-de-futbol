import { ImageResponse } from 'next/og';

// Icono de inicio en iOS (180 × 180): el símbolo de marcador sobre fondo de marca.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const tile = { position: 'absolute' as const, top: 34, width: 54, height: 112, borderRadius: 13, background: '#4ede80' };
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#05060a' }}>
        <div style={{ ...tile, left: 30 }} />
        <div style={{ ...tile, left: 96 }} />
        <div style={{ position: 'absolute', left: 20, right: 20, top: 85, height: 10, background: '#05060a' }} />
      </div>
    ),
    size,
  );
}

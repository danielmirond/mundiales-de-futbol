import { ImageResponse } from 'next/og';

/**
 * Default Open Graph image (1200×675, 16:9).
 *
 * Convención Next.js App Router: cualquier página bajo `[locale]` que no
 * defina `openGraph.images` recibe automáticamente esta imagen al
 * renderizarse en redes sociales y en Google Discover.
 *
 * Generada en build (no requiere asset estático).
 */

export const runtime = 'edge';
export const alt = 'Mundial de Fútbol — La enciclopedia definitiva de los Mundiales de Fútbol';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'linear-gradient(135deg, #05060a 0%, #0b0d14 50%, #101319 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#f5f6f8',
          position: 'relative',
        }}
      >
        {/* Glow superior */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(78, 222, 128, 0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Línea pitch top-left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#4ede80',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '22px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#4ede80',
              display: 'flex',
            }}
          >
            FIFA World Cup · 1930 — 2026
          </div>
        </div>

        {/* Título central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '156px',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Mundial
          </div>
          <div
            style={{
              fontSize: '156px',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #4ede80 0%, #b5ff85 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            de Fútbol
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontFamily: 'monospace',
            fontSize: '22px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9ea3ad',
          }}
        >
          <div style={{ display: 'flex' }}>mundiales-de-futbol.com</div>
          <div style={{ display: 'flex', color: '#4ede80' }}>
            23 ediciones · 5 idiomas
          </div>
        </div>
      </div>
    ),
    size,
  );
}

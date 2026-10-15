import { ImageResponse } from 'next/og';
import { OgBrand, SPORT_HEX } from '@/lib/og-brand';

/**
 * Imagen social por defecto (1200×675, 16:9) con la marca Mundiales
 * multideporte: símbolo de marcador, lema y el color de cada deporte.
 * Cualquier página bajo `[locale]` sin `openGraph.images` propia la usa.
 */

export const runtime = 'edge';
export const alt = 'Mundiales: resultados, calendario y dónde ver todos los deportes';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';

const SPORTS: [string, string][] = [['futbol', 'Fútbol'], ['baloncesto', 'Baloncesto'], ['motor', 'Motor'], ['tenis', 'Tenis'], ['rugby', 'Rugby'], ['archivo', 'Mundiales 1930–2026']];

export default async function OpengraphImage() {
  const green = SPORT_HEX.futbol;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px', background: '#05060a', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#f5f6f8' }}>
        <OgBrand color={green} size={48} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', fontSize: '96px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}>Todo lo que se juega,</div>
          <div style={{ display: 'flex', fontSize: '96px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', color: green }}>en un tablero.</div>
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', fontSize: '24px', color: '#a3a8b2' }}>
          {SPORTS.map(([slug, name]) => (
            <div key={slug} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', width: '14px', height: '14px', borderRadius: '4px', background: SPORT_HEX[slug] }} />
              {name}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

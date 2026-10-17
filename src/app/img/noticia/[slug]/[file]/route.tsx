import { ImageResponse } from 'next/og';
import { getNewsBySlug } from '@/lib/news';

export const runtime = 'edge';

/**
 * Recortes de la foto de una noticia para el `image` del NewsArticle:
 * 16x9.png, 4x3.png y 1x1.png, todos de 1200 px de ancho o más (guardarraíles
 * T7 e IM6). La foto va a sangre, sin texto ni logo (IM4).
 */
const SIZES: Record<string, { width: number; height: number }> = {
  '16x9.png': { width: 1600, height: 900 },
  '4x3.png': { width: 1600, height: 1200 },
  '1x1.png': { width: 1200, height: 1200 },
};

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params;
  const size = SIZES[file];
  const item = getNewsBySlug(slug);
  if (!size || !item?.image?.url) return new Response('Not found', { status: 404 });
  const res = await fetch(item.image.url, { headers: { 'User-Agent': 'mundiales-de-futbol.com (contacto@mundiales-de-futbol.com)' } });
  if (!res.ok) return new Response('Not found', { status: 404 });
  const photo = await res.arrayBuffer();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#05060a' }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={photo as unknown as string} width={size.width} height={size.height} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
      </div>
    ),
    { ...size, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  );
}

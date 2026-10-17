import { getNewsBySlug } from '@/lib/news';

export const runtime = 'nodejs';

/**
 * Recortes de la foto de una noticia para el `image` del NewsArticle:
 * 16x9.jpg, 4x3.jpg y 1x1.jpg, todos de 1200 px de ancho o más (guardarraíles
 * T7 e IM6), en JPEG progresivo ligero (IM5) y sin texto ni logo (IM4).
 * El recorte busca la zona con más interés de la foto para no decapitar al sujeto (IM7).
 */
const SIZES: Record<string, { width: number; height: number }> = {
  '16x9.jpg': { width: 1600, height: 900 },
  '4x3.jpg': { width: 1600, height: 1200 },
  '1x1.jpg': { width: 1200, height: 1200 },
};

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params;
  const size = SIZES[file];
  const item = getNewsBySlug(slug);
  if (!size || !item?.image?.url) return new Response('Not found', { status: 404 });
  const res = await fetch(item.image.url, { headers: { 'User-Agent': 'mundiales-de-futbol.com (contacto@mundiales-de-futbol.com)' } });
  if (!res.ok) return new Response('Not found', { status: 404 });
  const sharp = (await import('sharp')).default;
  const out = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(size.width, size.height, { fit: 'cover', position: sharp.strategy.attention })
    .toColourspace('srgb')
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(out), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

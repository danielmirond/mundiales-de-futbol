import { NextResponse } from 'next/server';
import { HISTORIAS } from '@/lib/historias';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

/**
 * Google News Sitemap.
 *
 * Especificación: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 *
 * Reglas que aplicamos:
 *  - Solo incluimos artículos publicados en los **últimos 2 días** (regla
 *    estricta de Google News). Históricamente añadimos también las historias
 *    que se publican hoy mismo aunque la zona horaria del sitio no coincida.
 *  - URL canónica con prefijo del idioma por defecto (es).
 *  - Idioma `es`, nombre de publicación "Mundial de Fútbol".
 *  - Lo regeneramos en cada request → siempre fresco.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1h

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 48h
  const today = now.toISOString().slice(0, 10);

  const recent = HISTORIAS.filter((h) => {
    // Solo historias publicadas: publishDate <= today
    if (h.publishDate > today) return false;
    const pub = new Date(h.publishDate + 'T08:00:00Z');
    return pub >= cutoff;
  });

  const urls = recent
    .map((h) => {
      const loc = `${SITE}/historias/${h.slug}`;
      const pubDate = `${h.publishDate}T08:00:00+00:00`;
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>Mundial de Fútbol</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(h.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

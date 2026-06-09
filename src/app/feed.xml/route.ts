import { NextResponse } from 'next/server';
import { getLatestNews } from '@/lib/news';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

/**
 * Feed RSS 2.0 — todas las noticias publicadas del Mundial 2026.
 *
 * Diferencias con `news.xml` (que es un Google News Sitemap):
 *  - Este es un RSS 2.0 estándar, consumible por lectores (Feedly, Inoreader…),
 *    agregadores y Discover/PubSubHubbub.
 *  - Incluye <description> (resumen editorial), enlace canónico, autor/fuente
 *    y <enclosure> con la imagen de portada cuando existe.
 *  - Sin límite de 48 h: lista todas las noticias YA publicadas (publishedAt <= now),
 *    ordenadas de más reciente a más antigua, hasta un máximo de 200.
 *  - <pubDate> en formato RFC-822 (el que exige la spec de RSS).
 *
 * Regenerado en cada request (force-dynamic) para respetar la publicación programada.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** ISO 8601 → RFC-822 (formato obligatorio en <pubDate> de RSS 2.0). */
function toRfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function GET() {
  // getLatestNews ya aplica el filtro published() (publishedAt <= now) y ordena desc.
  const items = getLatestNews(200);

  const lastBuild = items.length > 0 ? toRfc822(items[0].publishedAt) : new Date().toUTCString();

  const rssItems = items
    .map((n) => {
      const link = `${SITE}/noticias/${n.slug}`;
      const enclosure = n.image?.url
        ? `\n      <enclosure url="${escapeXml(n.image.url)}" type="image/jpeg" />`
        : '';
      return `    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${toRfc822(n.publishedAt)}</pubDate>
      <category>${escapeXml(n.category)}</category>
      <source url="${escapeXml(n.sourceUrl)}">${escapeXml(n.sourceName)}</source>${enclosure}
      <description>${escapeXml(n.summary)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mundiales de Fútbol — Noticias del Mundial 2026</title>
    <link>${SITE}/noticias</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Toda la actualidad del Mundial de Fútbol 2026: partidos, selecciones, sedes, dónde verlo en TV y mucho más.</description>
    <language>es</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

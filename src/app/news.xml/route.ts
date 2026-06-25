import { NextResponse } from 'next/server';
import { HISTORIAS } from '@/lib/historias';
import { NEWS_ITEMS } from '@/lib/news';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

/**
 * Google News Sitemap — spec: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 *
 * Reglas:
 *  - Solo artículos publicados en las últimas 48 h (regla estricta de Google News).
 *  - publication_date usa la ISO-8601 COMPLETA del artículo (con hora), no solo la fecha.
 *    Esto asegura orden correcto entre artículos del mismo día y es lo que Google recomienda.
 *  - Máximo 1.000 URLs por sitemap (limitación de Google).
 *  - Regenerado en cada request (force-dynamic) con caché de 1 hora en CDN.
 *  - Se ordena por publication_date desc para que los más recientes vayan primero.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cachear en Vercel Edge — queremos siempre fresco

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type NewsEntry = {
  loc: string;
  isoDate: string; // ISO 8601 completo, e.g. "2026-06-05T09:00:00+00:00"
  title: string;
};

function renderNewsUrl(item: NewsEntry): string {
  return `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>mundiales-de-futbol.com</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${item.isoDate}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`;
}

export async function GET() {
  const now = new Date();
  const cutoffMs = now.getTime() - 48 * 60 * 60 * 1000; // 48 horas exactas

  const entries: NewsEntry[] = [];

  // 1. Noticias editoriales propias (NEWS_ITEMS) — publicadas en últimas 48 h
  for (const n of NEWS_ITEMS) {
    const pubMs = new Date(n.publishedAt).getTime();
    if (pubMs < cutoffMs) continue;
    if (pubMs > now.getTime()) continue; // no publicar futuros

    entries.push({
      loc: `${SITE}/noticias/${n.slug}`,
      isoDate: n.publishedAt.replace('Z', '+00:00'), // "Z" → "+00:00" per spec
      title: n.title,
    });
  }

  // 2. Historias del calendario editorial — publicadas en últimas 48 h
  for (const h of HISTORIAS) {
    // publishDate es YYYY-MM-DD; asumimos publicación a las 08:00 UTC
    const isoFull = `${h.publishDate}T08:00:00+00:00`;
    const pubMs = new Date(isoFull).getTime();
    if (pubMs < cutoffMs) continue;
    if (pubMs > now.getTime()) continue;

    entries.push({
      loc: `${SITE}/historias/${h.slug}`,
      isoDate: isoFull,
      title: h.title,
    });
  }

  // Ordenar por fecha desc (más reciente primero) y limitar a 1.000
  entries.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  const limited = entries.slice(0, 1000);

  const urls = limited.map(renderNewsUrl).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Sin caché CDN para que siempre se regenere fresco
      'Cache-Control': 'no-store, max-age=0',
      // Pero sí indicamos a Google que puede revalidar cada hora
      'X-Robots-Tag': 'noindex',
    },
  });
}

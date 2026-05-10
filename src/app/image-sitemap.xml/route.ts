import { NextResponse } from 'next/server';
import { HISTORIAS } from '@/lib/historias';
import { NEWS_ITEMS } from '@/lib/news';

/**
 * Image sitemap separado del sitemap de URLs.
 *
 * Por qué separado:
 *  - Google Discover prioriza páginas con imágenes 1200×675+ correctamente
 *    declaradas. Un image sitemap dedicado le hace más fácil al crawler
 *    indexarlas y entender su contexto editorial.
 *  - Los `<image:image>` no anidados en `<url>` son útiles para imágenes
 *    "huérfanas" (galería, hero del 2026), pero la práctica recomendada
 *    es agruparlas bajo la URL donde aparecen.
 *  - Mantenemos `src/app/sitemap.ts` puro para URLs canónicas y este
 *    endpoint dedicado para imágenes con licencia/atribución.
 *
 * Spec: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 *
 * Endpoint: `/image-sitemap.xml`
 *
 * Cobertura inicial:
 *  - Historias publicadas (cover.url + alt + credit)
 *  - Noticias con imagen declarada (image.url + alt + credit)
 *
 * Excluye intencionalmente:
 *  - OG dinámicos (servidos por opengraph-image.tsx, no son imágenes
 *    con licencia atribuible)
 *  - Imágenes generadas en runtime (mascotas SVG, marcas)
 *  - Imágenes de afiliados (Amazon CDN), por copyright del retailer
 */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

type ImageEntry = {
  /** URL canónica de la página donde aparece la imagen */
  pageUrl: string;
  /** URL absoluta de la imagen */
  imageUrl: string;
  /** Caption descriptivo */
  caption: string;
  /** Atribución / licencia (e.g. "Wikimedia Commons · CC BY-SA") */
  license?: string;
  /** Título de la imagen (mostrado en thumbnails) */
  title?: string;
};

function escape(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildEntries(): ImageEntry[] {
  const today = new Date().toISOString().slice(0, 10);
  const entries: ImageEntry[] = [];

  // Historias publicadas (las del calendario editorial cuya fecha ya pasó)
  for (const h of HISTORIAS) {
    if (h.publishDate > today) continue;
    if (!h.cover?.url) continue;
    entries.push({
      pageUrl: `${SITE}/historias/${h.slug}`,
      imageUrl: h.cover.url,
      caption: h.cover.alt ?? h.title,
      title: h.title,
      license: h.cover.credit
        ? `${h.cover.credit}${h.cover.license ? ' · ' + h.cover.license : ''}`
        : undefined,
    });
  }

  // Noticias con imagen
  for (const n of NEWS_ITEMS) {
    if (!n.image?.url) continue;
    entries.push({
      pageUrl: `${SITE}/noticias/${n.slug}`,
      imageUrl: n.image.url,
      caption: n.image.alt ?? n.title,
      title: n.title,
      license: n.image.credit
        ? `${n.image.credit}${n.image.license ? ' · ' + n.image.license : ''}`
        : undefined,
    });
  }

  return entries;
}

function renderXml(entries: ImageEntry[]): string {
  const xml: string[] = [];
  xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  xml.push(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  );

  // Agrupa por pageUrl para evitar duplicar `<url>` cuando una página
  // tenga varias imágenes en el futuro (galería, etc.).
  const byPage = new Map<string, ImageEntry[]>();
  for (const e of entries) {
    if (!byPage.has(e.pageUrl)) byPage.set(e.pageUrl, []);
    byPage.get(e.pageUrl)!.push(e);
  }

  for (const [pageUrl, items] of byPage) {
    xml.push('  <url>');
    xml.push(`    <loc>${escape(pageUrl)}</loc>`);
    for (const item of items) {
      xml.push('    <image:image>');
      xml.push(`      <image:loc>${escape(item.imageUrl)}</image:loc>`);
      if (item.caption) xml.push(`      <image:caption>${escape(item.caption)}</image:caption>`);
      if (item.title) xml.push(`      <image:title>${escape(item.title)}</image:title>`);
      if (item.license) xml.push(`      <image:license>${escape(item.license)}</image:license>`);
      xml.push('    </image:image>');
    }
    xml.push('  </url>');
  }

  xml.push('</urlset>');
  return xml.join('\n');
}

export async function GET() {
  const entries = buildEntries();
  const body = renderXml(entries);
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
}

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
 *
 *  Además de historias del calendario editorial, añadimos guías pillar
 *  con `datePublished` reciente (lanzamientos noticiosos pre-Mundial: el
 *  álbum Panini saliendo a la venta, las fechas FIFA de convocatorias,
 *  etc.). La regla de 48h se aplica igual y limita el riesgo.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1h

type NewsItem = {
  loc: string;
  publishDate: string; // YYYY-MM-DD
  title: string;
};

/**
 * Guías pillar con carácter noticioso (lanzamientos del Mundial 2026).
 * Cada entrada se mantendrá en news.xml durante las 48h siguientes a
 * `publishDate`. Mover a un día más antiguo o eliminarlo cuando el ciclo
 * noticioso pase.
 */
const FEATURED_GUIDES: NewsItem[] = [
  // Panini Mundial 2026: pillar + 8 sub-páginas. Lanzamiento del álbum
  // (30 abril en España y USA, 2 mayo en LATAM) genera el ciclo noticioso
  // de mayor demanda actual.
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026`,
    publishDate: '2026-05-02',
    title:
      'Panini Mundial 2026: 980 cromos, 112 páginas, app digital y dónde comprar',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/precio`,
    publishDate: '2026-05-02',
    title:
      'Álbum Panini Mundial 2026 precio: cuánto cuesta en España, USA y México',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/donde-comprar`,
    publishDate: '2026-05-02',
    title:
      'Dónde comprar el álbum Panini Mundial 2026: España, USA, México y LATAM',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/cuando-sale`,
    publishDate: '2026-05-02',
    title:
      'Cuándo sale el álbum Panini Mundial 2026: fechas oficiales por país',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/digital`,
    publishDate: '2026-05-02',
    title:
      'Álbum Panini Mundial 2026 digital: app, códigos virtuales y cómo funciona',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/tapa-dura`,
    publishDate: '2026-05-02',
    title:
      'Álbum Panini Mundial 2026 tapa dura: edición coleccionista, lujo y oro',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/cromos-mas-caros`,
    publishDate: '2026-05-02',
    title:
      'Cromos más caros y difíciles del Panini Mundial 2026: Top 10 del torneo',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/coca-cola`,
    publishDate: '2026-05-02',
    title:
      'Promo Coca-Cola Panini Mundial 2026: 12 cromos exclusivos en botellas',
  },
  {
    loc: `${SITE}/coleccionismo/panini-mundial-2026/topps-vs-panini`,
    publishDate: '2026-05-02',
    title: 'Topps vs Panini Mundial 2026: comparativa coleccionista',
  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderNewsUrl(item: NewsItem): string {
  const pubDate = `${item.publishDate}T08:00:00+00:00`;
  return `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>Mundial de Fútbol</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`;
}

export async function GET() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 48h
  const today = now.toISOString().slice(0, 10);

  // 1. Historias del calendario editorial publicadas en las últimas 48h.
  const recentHistorias: NewsItem[] = HISTORIAS.filter((h) => {
    if (h.publishDate > today) return false;
    const pub = new Date(h.publishDate + 'T08:00:00Z');
    return pub >= cutoff;
  }).map((h) => ({
    loc: `${SITE}/historias/${h.slug}`,
    publishDate: h.publishDate,
    title: h.title,
  }));

  // 2. Guías pillar con publishDate dentro de la ventana de 48h.
  const recentGuides: NewsItem[] = FEATURED_GUIDES.filter((g) => {
    if (g.publishDate > today) return false;
    const pub = new Date(g.publishDate + 'T08:00:00Z');
    return pub >= cutoff;
  });

  const urls = [...recentHistorias, ...recentGuides]
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
    .map(renderNewsUrl)
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

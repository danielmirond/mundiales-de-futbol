/**
 * Lectura/escritura de piezas en src/lib/news.ts (array NEWS_ITEMS).
 * Inserta al principio; si el slug existe, REEMPLAZA en su sitio (antirrefrito
 * 72 h del manual: una URL por hecho, que se actualiza; nunca una segunda).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const NEWS_PATH = join(process.cwd(), 'src/lib/news.ts');
const MARKER = 'export const NEWS_ITEMS: NewsItem[] = [\n';

export type Piece = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  kind?: 'cronica' | 'previa' | 'agenda' | 'clasificacion';
  competition?: { name: string; sport: string; slug: string };
  sourceName: string;
  sourceUrl: string;
  sourceLang: 'es' | 'en';
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  image?: { url: string; alt: string; credit?: string; license?: string };
};

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

export function serialize(p: Piece): string {
  const img = p.image
    ? `    image: {\n      url: ${JSON.stringify(p.image.url)},\n      alt: ${JSON.stringify(p.image.alt)},\n` +
      (p.image.credit ? `      credit: ${JSON.stringify(p.image.credit)},\n` : '') +
      (p.image.license ? `      license: ${JSON.stringify(p.image.license)},\n` : '') + '    },\n'
    : '';
  return `  {
    slug: '${p.slug}',
    title: ${JSON.stringify(p.title)},
    summary: ${JSON.stringify(p.summary)},
    body: \`${esc(p.body)}\`,
    category: '${p.category}',
${p.kind ? `    kind: '${p.kind}',\n` : ''}${p.competition ? `    competition: ${JSON.stringify(p.competition)},\n` : ''}    sourceName: ${JSON.stringify(p.sourceName)},
    sourceUrl: ${JSON.stringify(p.sourceUrl)},
    sourceLang: '${p.sourceLang}',
    publishedAt: '${p.publishedAt}',
${p.modifiedAt ? `    modifiedAt: '${p.modifiedAt}',\n` : ''}    author: ${JSON.stringify(p.author)},
${img}  },\n`;
}

const blockRe = (slug: string) => new RegExp(`  \\{\\n    slug: '${slug}',[\\s\\S]*?\\n  \\},\\n`);

export function readNews(): string {
  return readFileSync(NEWS_PATH, 'utf8');
}
export function exists(src: string, slug: string): boolean {
  return src.includes(`slug: '${slug}'`);
}
/** Fecha de publicación original de un slug ya presente (para conservarla al refrescar). */
export function publishedAtOf(src: string, slug: string): string | null {
  const m = src.match(new RegExp(`slug: '${slug}',[\\s\\S]*?publishedAt: '([^']+)'`));
  return m?.[1] ?? null;
}

/** Inserta (al principio) o reemplaza in situ. Devuelve el fuente nuevo. */
export function upsert(src: string, piece: Piece): { src: string; action: 'inserted' | 'replaced' } {
  if (exists(src, piece.slug)) {
    const out = src.replace(blockRe(piece.slug), serialize(piece));
    if (out === src) throw new Error(`No se pudo localizar el bloque de ${piece.slug}`);
    return { src: out, action: 'replaced' };
  }
  const idx = src.indexOf(MARKER);
  if (idx === -1) throw new Error('No se encontró el marcador NEWS_ITEMS en news.ts');
  const at = idx + MARKER.length;
  return { src: src.slice(0, at) + serialize(piece) + src.slice(at), action: 'inserted' };
}

export function writeNews(src: string) {
  writeFileSync(NEWS_PATH, src, 'utf8');
}

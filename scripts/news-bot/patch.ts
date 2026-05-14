/**
 * Inserta uno o más `GeneratedNews` al inicio del array `NEWS_ITEMS`
 * de `src/lib/news.ts`, preservando el resto del archivo. Si un slug
 * ya existe, lo descarta.
 *
 * Estrategia:
 *  - Localizar la línea `export const NEWS_ITEMS: NewsItem[] = [`.
 *  - Insertar los nuevos objetos a continuación, con sangría correcta.
 *  - Dejar el resto del archivo intacto.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type { GeneratedNews } from './types';

const NEWS_FILE = path.resolve(
  process.cwd(),
  'src/lib/news.ts',
);

function escapeJs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function serializeNewsItem(n: GeneratedNews): string {
  return `  {
    slug: '${n.slug.replace(/'/g, "\\'")}',
    title:
      ${JSON.stringify(n.title)},
    summary:
      ${JSON.stringify(n.summary)},
    body: \`${escapeJs(n.body)}\`,
    category: '${n.category}',
    sourceName: ${JSON.stringify(n.sourceName)},
    sourceUrl: ${JSON.stringify(n.sourceUrl)},
    sourceLang: '${n.sourceLang}',
    publishedAt: '${n.publishedAt}',${
    n.sourcesSecondary && n.sourcesSecondary.length > 0
      ? `\n    sourcesSecondary: ${JSON.stringify(n.sourcesSecondary, null, 2)
          .replace(/\n/g, '\n    ')},`
      : ''
  }
  },`;
}

export async function patchNewsFile(items: GeneratedNews[]): Promise<{
  inserted: number;
  skipped: number;
  skippedSlugs: string[];
}> {
  const original = await fs.readFile(NEWS_FILE, 'utf8');

  // Filtrar slugs existentes
  const existingSlugs = [...original.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const fresh = items.filter((i) => !existingSlugs.includes(i.slug));
  const skipped = items.length - fresh.length;
  const skippedSlugs = items
    .filter((i) => existingSlugs.includes(i.slug))
    .map((i) => i.slug);

  if (fresh.length === 0) {
    return { inserted: 0, skipped, skippedSlugs };
  }

  const marker = 'export const NEWS_ITEMS: NewsItem[] = [';
  const idx = original.indexOf(marker);
  if (idx < 0) throw new Error(`No encontré marker "${marker}" en news.ts`);
  const insertAt = idx + marker.length;
  const insertion = '\n' + fresh.map(serializeNewsItem).join('\n');
  const next = original.slice(0, insertAt) + insertion + original.slice(insertAt);
  await fs.writeFile(NEWS_FILE, next, 'utf8');
  return { inserted: fresh.length, skipped, skippedSlugs };
}

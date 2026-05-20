/**
 * Enriquecimiento de `JERSEY_HISTORIES` con imágenes y ASIN de Amazon ES.
 *
 * Para cada camiseta del catálogo:
 *   1. Construye query "{teamName} {year} camiseta {brand} retro".
 *   2. Fetch a https://www.amazon.es/s?k=... con User-Agent de navegador.
 *   3. Parsea el HTML para sacar el primer `[data-asin]` → image + title.
 *   4. Vuelca sidecar `src/lib/wc-jerseys.amazon.json` con
 *      `{ "{teamCode}-{year}-{variant}": { asin, imageUrl, title } }`.
 *
 * Política editorial: las imágenes Amazon están licenciadas para uso
 * en sitios de afiliados (Amazon Associates ToS sección "Specifications").
 * NO usamos imágenes de adidas.com / nike.com / puma.com (copyright).
 *
 * Uso: npx tsx scripts/enrich-jerseys-amazon.ts
 *
 * Limitaciones:
 *   - Amazon a veces sirve captcha o sin resultados (anti-bot). El script
 *     marca esos como needsReview y los puedes reintentar luego.
 *   - El primer resultado no siempre es la camiseta exacta. Para
 *     verificación humana, el script imprime el título para que detectes
 *     mismatches (ej. una taza con escudo en lugar de la camiseta).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JERSEY_HISTORIES, type JerseyEntry } from '../src/lib/wc-jerseys';

// Cargar .env.local (opcional, por si hay overrides futuros)
const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const AMAZON_TAG = 'nuus-21';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';

type EnrichedJersey = {
  key: string;
  query: string;
  asin: string;
  imageUrl: string;
  title: string;
  productUrl: string;
};

function buildQuery(teamName: string, year: number, brand: string): string {
  // "camiseta retro" maximiza la probabilidad de encontrar réplicas
  // históricas en lugar de productos genéricos.
  return `${teamName} ${year} camiseta ${brand} retro`;
}

function buildSearchUrl(query: string): string {
  const q = encodeURIComponent(query);
  return `https://www.amazon.es/s?k=${q}&i=sporting&tag=${AMAZON_TAG}`;
}

function entryKey(teamCode: string, j: JerseyEntry): string {
  return `${teamCode}-${j.year}-${j.variant}`;
}

/**
 * Parsea el primer resultado de búsqueda de Amazon ES.
 * Robusto a cambios menores de HTML: busca por atributos data-* estables.
 */
/**
 * Itera por todos los resultados de la búsqueda y devuelve el primero
 * que pase el filtro de calidad. Sin filtro acabábamos asignando
 * "Umbro England Rugby" a una camiseta de Inglaterra 1966 de fútbol.
 */
function parseFirstResult(
  html: string,
  filters: { teamNameLower: string; year: number },
): { asin: string; imageUrl: string; title: string } | null {
  const blockRe = /<div[^>]+data-asin="([A-Z0-9]{10})"[^>]+data-component-type="s-search-result"([\s\S]*?)(?=<div[^>]+data-asin="[A-Z0-9]{10}"|<\/span><\/div><\/div><\/div><\/span><\/div>)/g;
  const candidates: Array<{ asin: string; imageUrl: string; title: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(html)) !== null) {
    const asin = match[1];
    const body = match[2];
    const imgMatch = body.match(/<img[^>]+class="s-image"[^>]+src="([^"]+)"/);
    if (!imgMatch) continue;
    const h2Match = body.match(/<h2[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/);
    const title = h2Match ? h2Match[1].trim() : '';
    if (!title) continue;
    candidates.push({ asin, imageUrl: imgMatch[1], title });
    if (candidates.length >= 10) break;
  }

  // Filtro de calidad ESTRICTO. Antes el fallback laxo asignaba la
  // camiseta de España 2026 a casi todas las búsquedas porque era
  // el resultado dominante de Amazon. Mejor sin imagen que con imagen
  // equivocada.
  const BAD = /\b(rugby|baloncesto|basketball|nfl|nba|tennis|tenis|f1|copa\s+(?!mundial|del\s+mundo))\b/i;
  // Sinónimos por selección (inglés ↔ español ↔ código FIFA).
  const synonyms: Record<string, string[]> = {
    argentina: ['argentina', 'albiceleste'],
    brasil: ['brasil', 'brazil'],
    espa: ['españa', 'spain', 'la roja'],
    alemania: ['alemania', 'germany', 'deutschland', 'dfb'],
    italia: ['italia', 'italy'],
    francia: ['francia', 'france'],
    países: ['países bajos', 'holanda', 'netherlands', 'holland', 'oranje'],
    holanda: ['países bajos', 'holanda', 'netherlands', 'holland', 'oranje'],
    inglaterra: ['inglaterra', 'england'],
    uruguay: ['uruguay'],
    méxico: ['méxico', 'mexico'],
  };
  const teamKey = Object.keys(synonyms).find((k) =>
    filters.teamNameLower.startsWith(k),
  );
  const teamSynonyms = teamKey
    ? synonyms[teamKey]
    : [filters.teamNameLower];

  // Para kits anteriores a 2024 exigimos que el título mencione el año
  // o palabras tipo "retro"/"vintage". Sin esto, "España 1982" mapea
  // a la camiseta de España 2026 (que es el match dominante en Amazon ES).
  const isHistorical = filters.year < 2024;
  const retroSignals = ['retro', 'vintage', 'classic', 'leyendas', String(filters.year)];

  for (const c of candidates) {
    const t = c.title.toLowerCase();
    if (BAD.test(c.title)) continue;
    if (!teamSynonyms.some((s) => t.includes(s))) continue;
    if (isHistorical && !retroSignals.some((r) => t.includes(r.toLowerCase()))) {
      continue;
    }
    return c;
  }
  return null;
}

async function searchAmazon(query: string): Promise<{ html: string; status: number }> {
  const url = buildSearchUrl(query);
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.5',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  const html = await res.text();
  return { html, status: res.status };
}

async function main() {
  const out: Record<string, EnrichedJersey> = {};
  const review: Array<{ key: string; query: string; reason: string }> = [];

  for (const h of JERSEY_HISTORIES) {
    for (const j of h.jerseys) {
      const key = entryKey(h.teamCode, j);
      const query = buildQuery(h.teamName, j.year, j.brand);
      try {
        const { html, status } = await searchAmazon(query);
        if (status !== 200) {
          review.push({ key, query, reason: `HTTP ${status}` });
          console.log(`❌ ${key.padEnd(20)} HTTP ${status}`);
          continue;
        }
        // Detecta captcha
        if (
          html.includes('captcha') ||
          html.includes('Type the characters you see') ||
          html.length < 5000
        ) {
          review.push({ key, query, reason: 'captcha o respuesta corta' });
          console.log(`🤖 ${key.padEnd(20)} CAPTCHA`);
          // Pausa larga si entramos en captcha
          await new Promise((r) => setTimeout(r, 5000));
          continue;
        }
        const parsed = parseFirstResult(html, {
          teamNameLower: h.teamName.toLowerCase(),
          year: j.year,
        });
        if (!parsed) {
          review.push({ key, query, reason: 'sin resultados parseables' });
          console.log(`⚠️  ${key.padEnd(20)} sin resultados`);
          continue;
        }
        const productUrl = `https://www.amazon.es/dp/${parsed.asin}?tag=${AMAZON_TAG}`;
        out[key] = { key, query, ...parsed, productUrl };
        console.log(
          `✅ ${key.padEnd(20)} ${parsed.asin}  ${parsed.title.slice(0, 60)}`,
        );
      } catch (err) {
        review.push({ key, query, reason: (err as Error).message });
        console.error(`❌ ${key}`, (err as Error).message);
      }
      // 2.5s entre búsquedas — Amazon ES mete captcha tras ~15 requests
      // si bajamos de ese ritmo. Lento pero seguro.
      await new Promise((r) => setTimeout(r, 2500));
    }
  }

  const sidecarPath = resolve(process.cwd(), 'src/lib/wc-jerseys.amazon.json');
  writeFileSync(
    sidecarPath,
    JSON.stringify(
      {
        _meta: { lastUpdated: new Date().toISOString().slice(0, 10), tag: AMAZON_TAG },
        ...out,
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );
  console.log(`\n📝 ${Object.keys(out).length} camisetas enriquecidas en ${sidecarPath}`);
  if (review.length > 0) {
    console.log(`\n🔍 ${review.length} pendientes de revisión:`);
    for (const r of review) {
      console.log(`   - ${r.key} (${r.reason}) — query: "${r.query}"`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

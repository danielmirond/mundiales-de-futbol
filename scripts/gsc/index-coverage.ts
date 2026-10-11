/**
 * Cobertura de indexación vía URL Inspection API de Search Console.
 *
 * El informe agregado de "Indexación de páginas" NO existe en la API: el único
 * modo de saber si una URL está "Rastreada: actualmente sin indexar" es
 * inspeccionarla una a una (cuota: 2.000 URLs/día por propiedad, 600/min).
 *
 * Para no quemar cuota, por defecto sólo inspecciona las URLs del sitemap que
 * NO han tenido ninguna impresión en los últimos 90 días (si tiene impresiones,
 * está indexada). Con --all inspecciona todas.
 *
 * La clave NUNCA va al repo:
 *   GSC_SA_JSON   → contenido JSON de la cuenta de servicio (GitHub Secrets)
 *   GSC_SA_PATH   → ruta a un fichero .json (uso local)
 *
 * Uso:
 *   GSC_SA_PATH=~/Desktop/mundiales-500017-xxx.json npx tsx scripts/gsc/index-coverage.ts
 *   ... --limit 500        → tope de inspecciones esta ejecución
 *   ... --all              → no filtra por impresiones
 *   ... --no-cache         → ignora la caché de inspecciones previas
 *   ... --urls a.txt       → inspecciona una lista propia (una URL por línea)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createSign } from 'node:crypto';

const SITE = process.env.GSC_SITE ?? 'https://mundiales-de-futbol.com/';
const SITEMAP = process.env.GSC_SITEMAP ?? new URL('/sitemap.xml', SITE).href;
const OUT_DIR = join(process.cwd(), 'gsc');
const CACHE_FILE = join(OUT_DIR, 'inspect-cache.json');
const CACHE_TTL_DAYS = 7;
const CONCURRENCY = 6;

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
};
const LIMIT = Number(arg('--limit') ?? 1800);
const ALL = process.argv.includes('--all');
const USE_CACHE = !process.argv.includes('--no-cache');
const URLS_FILE = arg('--urls');

type SA = { client_email: string; private_key: string; token_uri: string };

function loadSA(): SA {
  if (process.env.GSC_SA_JSON) return JSON.parse(process.env.GSC_SA_JSON);
  const p = process.env.GSC_SA_PATH;
  if (p) return JSON.parse(readFileSync(p.replace(/^~/, process.env.HOME ?? ''), 'utf8'));
  throw new Error('Falta GSC_SA_JSON o GSC_SA_PATH');
}

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');

async function getToken(sa: SA): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    b64({ alg: 'RS256', typ: 'JWT' }) +
    '.' +
    b64({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    });
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const jwt = unsigned + '.' + signer.sign(sa.private_key).toString('base64url');
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No se pudo obtener token: ' + JSON.stringify(data));
  return data.access_token;
}

/** URLs del sitemap; sigue índices de sitemaps si los hay. */
async function sitemapUrls(url: string, seen = new Set<string>()): Promise<string[]> {
  if (seen.has(url)) return [];
  seen.add(url);
  const xml = await (await fetch(url)).text();
  const isIndex = /<sitemapindex/i.test(xml);
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (!isIndex) return locs;
  const out: string[] = [];
  for (const s of locs) out.push(...(await sitemapUrls(s, seen)));
  return out;
}

const dayStr = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

/** Páginas con al menos una impresión en 90 días → indexadas con certeza. */
async function pagesWithImpressions(token: string): Promise<Set<string>> {
  const seen = new Set<string>();
  for (let start = 0; ; start += 25000) {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: dayStr(90),
          endDate: dayStr(2),
          dimensions: ['page'],
          rowLimit: 25000,
          startRow: start,
        }),
      },
    );
    const data = (await res.json()) as { rows?: { keys: string[] }[] };
    const rows = data.rows ?? [];
    for (const r of rows) seen.add(r.keys[0]);
    if (rows.length < 25000) break;
  }
  return seen;
}

type Inspection = {
  url: string;
  verdict?: string;
  coverageState?: string;
  robotsTxtState?: string;
  indexingState?: string;
  pageFetchState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  referringUrls?: number;
  checkedAt: string;
  error?: string;
};

async function inspect(token: string, url: string): Promise<Inspection> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      // en-US para que coverageState devuelva cadenas estables (se traducen al imprimir).
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: 'en-US' }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    const data = (await res.json()) as any;
    if (!res.ok) {
      return { url, checkedAt: new Date().toISOString(), error: data?.error?.message ?? `HTTP ${res.status}` };
    }
    const i = data?.inspectionResult?.indexStatusResult ?? {};
    return {
      url,
      verdict: i.verdict,
      coverageState: i.coverageState,
      robotsTxtState: i.robotsTxtState,
      indexingState: i.indexingState,
      pageFetchState: i.pageFetchState,
      lastCrawlTime: i.lastCrawlTime,
      googleCanonical: i.googleCanonical,
      userCanonical: i.userCanonical,
      referringUrls: i.referringUrls?.length ?? 0,
      checkedAt: new Date().toISOString(),
    };
  }
  return { url, checkedAt: new Date().toISOString(), error: 'Agotados los reintentos (429/5xx)' };
}

async function pool<T, R>(items: T[], n: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
        if (i % 50 === 0) process.stderr.write(`[gsc] ${i + 1}/${items.length}\n`);
      }
    }),
  );
  return out;
}

const ES: Record<string, string> = {
  'Submitted and indexed': 'Enviada e indexada',
  'Indexed, not submitted in sitemap': 'Indexada, no enviada en sitemap',
  'Crawled - currently not indexed': 'Rastreada: actualmente sin indexar',
  'Discovered - currently not indexed': 'Detectada: actualmente sin indexar',
  'Duplicate without user-selected canonical': 'Duplicada sin canónica seleccionada por el usuario',
  'Duplicate, Google chose different canonical than user':
    'Duplicada: Google eligió una canónica distinta a la del usuario',
  'Alternate page with proper canonical tag': 'Página alternativa con etiqueta canónica correcta',
  'Page with redirect': 'Página con redirección',
  'Excluded by ‘noindex’ tag': 'Excluida por etiqueta noindex',
  'Blocked by robots.txt': 'Bloqueada por robots.txt',
  'Not found (404)': 'No encontrada (404)',
  'Soft 404': 'Soft 404',
  'URL is unknown to Google': 'URL desconocida para Google',
};
const label = (s?: string) => (s ? (ES[s] ?? s) : 'Sin dato');

async function main() {
  const sa = loadSA();
  const token = await getToken(sa);

  let candidates: string[];
  let total = 0;
  let indexedByTraffic = 0;

  if (URLS_FILE) {
    candidates = readFileSync(URLS_FILE, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
    total = candidates.length;
  } else {
    const urls = [...new Set(await sitemapUrls(SITEMAP))];
    total = urls.length;
    if (ALL) {
      candidates = urls;
    } else {
      const withTraffic = await pagesWithImpressions(token);
      indexedByTraffic = urls.filter((u) => withTraffic.has(u)).length;
      candidates = urls.filter((u) => !withTraffic.has(u));
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const cache: Record<string, Inspection> =
    USE_CACHE && existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf8')) : {};
  const fresh = (i?: Inspection) =>
    !!i && !i.error && Date.now() - Date.parse(i.checkedAt) < CACHE_TTL_DAYS * 86_400_000;

  const pending = candidates.filter((u) => !fresh(cache[u]));
  const toCheck = pending.slice(0, LIMIT);
  const skipped = pending.length - toCheck.length;

  console.error(
    `[gsc] sitemap: ${total} · candidatas: ${candidates.length} · en caché: ${candidates.length - pending.length} · a inspeccionar: ${toCheck.length}${skipped > 0 ? ` · fuera de cuota esta ejecución: ${skipped}` : ''}`,
  );

  const results = await pool(toCheck, CONCURRENCY, (u) => inspect(token, u));
  for (const r of results) cache[r.url] = r;
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

  const all = candidates.map((u) => cache[u]).filter(Boolean);
  const groups = new Map<string, Inspection[]>();
  for (const r of all) {
    const k = r.error ? `ERROR: ${r.error}` : (r.coverageState ?? 'Sin dato');
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(r);
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);

  const notIndexed = groups.get('Crawled - currently not indexed') ?? [];
  const discovered = groups.get('Discovered - currently not indexed') ?? [];
  const path = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
  const crawl = (r: Inspection) => (r.lastCrawlTime ? r.lastCrawlTime.slice(0, 10) : 'nunca');

  const md = [
    `# Cobertura de indexación · ${SITE} · ${dayStr(0)}`,
    ``,
    `URLs en sitemap: **${total}**`,
    ...(ALL || URLS_FILE ? [] : [`Con impresiones en 90 días (indexadas): **${indexedByTraffic}**`]),
    `Inspeccionadas (acumulado en caché): **${all.length}**`,
    ...(skipped > 0 ? [`Pendientes por cuota diaria: **${skipped}** → vuelve a lanzar mañana`] : []),
    ``,
    `## Resumen por estado`,
    ...sorted.map(([k, v]) => `- **${v.length}** · ${label(k)}`),
    ``,
    `## Rastreada: actualmente sin indexar (${notIndexed.length})`,
    `Google la ha rastreado y ha decidido no indexarla: señal de calidad/valor percibido bajo o de duplicidad de plantilla.`,
    ``,
    ...(notIndexed.length
      ? notIndexed
          .sort((a, b) => (b.lastCrawlTime ?? '').localeCompare(a.lastCrawlTime ?? ''))
          .map((r) => `- \`${path(r.url)}\` · último rastreo ${crawl(r)} · ${r.referringUrls} enlaces internos detectados`)
      : ['_Ninguna._']),
    ``,
    `## Detectada: actualmente sin indexar (${discovered.length})`,
    `Google la conoce pero aún no la ha rastreado: suele ser presupuesto de rastreo o enlazado interno pobre.`,
    ``,
    ...(discovered.length
      ? discovered.map((r) => `- \`${path(r.url)}\` · ${r.referringUrls} enlaces internos detectados`)
      : ['_Ninguna._']),
    ``,
  ].join('\n');

  const stamp = dayStr(0);
  writeFileSync(join(OUT_DIR, `index-coverage-${stamp}.md`), md);
  writeFileSync(
    join(OUT_DIR, `index-coverage-${stamp}.json`),
    JSON.stringify({ site: SITE, total, indexedByTraffic, inspected: all.length, results: all }, null, 2),
  );
  writeFileSync(
    join(OUT_DIR, `crawled-not-indexed-${stamp}.csv`),
    ['url,estado,ultimo_rastreo,enlaces_internos', ...[...notIndexed, ...discovered].map(
      (r) => `${r.url},"${label(r.coverageState)}",${r.lastCrawlTime ?? ''},${r.referringUrls}`,
    )].join('\n'),
  );
  console.error(`[gsc] Informe en gsc/index-coverage-${stamp}.md`);
  console.log(md);
}

main();

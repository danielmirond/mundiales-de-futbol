/**
 * ¿Hay que bloquear algo? Informe para decidir Disallow / noindex.
 *
 * Por patrón de URL (plantilla de ruta), cruza:
 *   - URLs en los sitemaps (cuántas)
 *   - URLs con impresiones en 28 días (cuántas, impresiones, clics)
 *   - URL Inspection de una muestra por patrón (estado de cobertura)
 * Además: estado de los sitemaps enviados, URLs con parámetros o fuera de
 * sitemap que reciben impresiones, y URLs ya cubiertas por un Disallow que
 * siguen saliendo en búsqueda.
 *
 * Uso: GSC_SA_JSON=… npx tsx scripts/gsc/bloqueo.ts [--per 6] [--limit 450]
 */
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSA, getToken, query } from './report';

const SITE = process.env.GSC_SITE ?? 'https://mundiales-de-futbol.com/';
const ORIGIN = SITE.replace(/\/$/, '');
const arg = (n: string, d: number) => { const i = process.argv.indexOf(n); return i === -1 ? d : Number(process.argv[i + 1]); };
const PER = arg('--per', 6);
const LIMIT = arg('--limit', 450);
const dayStr = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

// Segmentos estáticos = nombres de carpeta del app router.
const STATIC = new Set<string>();
(function walk(d: string) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (!statSync(p).isDirectory()) continue;
    if (!f.startsWith('[') && !f.startsWith('(') && !f.startsWith('_')) STATIC.add(f);
    walk(p);
  }
})(join(process.cwd(), 'src/app'));
const SPORTS = ['futbol', 'baloncesto', 'rugby', 'tenis', 'motor', 'golf', 'combate', 'balonmano', 'padel', 'hockey', 'beisbol', 'futbol-americano'];
SPORTS.forEach((s) => STATIC.add(s));

function pattern(u: string): string {
  const url = new URL(u);
  const segs = url.pathname.split('/').filter(Boolean);
  const out: string[] = [];
  segs.forEach((s, i) => {
    if (i === 0 && ['en', 'pt', 'fr', 'ar'].includes(s)) out.push(s);
    else if (STATIC.has(s)) out.push(s);
    else if (i === 1 && SPORTS.includes(segs[0])) out.push('{comp}');
    else out.push('*');
  });
  return '/' + out.join('/') + (url.search ? '?…' : '');
}

const rules = async () => {
  const txt = await (await fetch(ORIGIN + '/robots.txt')).text();
  return txt.split('\n').filter((l) => /^disallow:/i.test(l)).map((l) => l.split(':')[1].trim()).filter(Boolean)
    .map((r) => new RegExp('^' + r.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')));
};

async function sitemapUrls(url: string, seen = new Set<string>()): Promise<string[]> {
  if (seen.has(url)) return [];
  seen.add(url);
  const xml = await (await fetch(url)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (/<sitemapindex/.test(xml)) return (await Promise.all(locs.map((l) => sitemapUrls(l, seen)))).flat();
  return locs;
}

async function inspect(token: string, url: string) {
  for (let a = 0; a < 4; a++) {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: 'en-US' }),
    });
    if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 2000 * (a + 1))); continue; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = (await res.json()) as any;
    if (!res.ok) return { url, state: `error: ${d?.error?.message ?? res.status}` };
    const i = d?.inspectionResult?.indexStatusResult ?? {};
    return { url, state: (i.coverageState as string) ?? 'desconocido', canonical: i.googleCanonical as string | undefined, lastCrawl: i.lastCrawlTime as string | undefined };
  }
  return { url, state: 'error: reintentos' };
}

async function main() {
  const token = await getToken(loadSA());
  const lines: string[] = [`# ¿Bloquear algo? · ${dayStr(0)}`, ''];
  const out: Record<string, unknown> = {};

  // 1) Sitemaps enviados.
  const sm = await (await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`, { headers: { Authorization: 'Bearer ' + token } })).json();
  lines.push('## Sitemaps en GSC', '', '| Sitemap | Último leído | Errores | Avisos | Enviadas |', '|---|---|---|---|---|');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const s of (sm.sitemap ?? []) as any[])
    lines.push(`| ${s.path.replace(ORIGIN, '')} | ${s.lastDownloaded?.slice(0, 10) ?? '—'} | ${s.errors ?? 0} | ${s.warnings ?? 0} | ${(s.contents ?? []).map((c: { type: string; submitted: string }) => `${c.type}: ${c.submitted}`).join(', ')} |`);
  out.sitemaps = sm.sitemap;

  // 2) Sitemap real y GSC (28 días).
  const smUrls = [...new Set((await Promise.all([`${ORIGIN}/sitemap.xml`, `${ORIGIN}/news.xml`].map((u) => sitemapUrls(u)))).flat())];
  const smSet = new Set(smUrls);
  const pages = await query(token, { startDate: dayStr(30), endDate: dayStr(2), dimensions: ['page'], rowLimit: 25000 });
  const dis = await rules();
  const pathOf = (u: string) => { const x = new URL(u); return x.pathname + x.search; };

  type Agg = { sitemap: number; withImp: number; imp: number; clk: number; outside: number };
  const agg = new Map<string, Agg>();
  const get = (p: string) => agg.get(p) ?? (agg.set(p, { sitemap: 0, withImp: 0, imp: 0, clk: 0, outside: 0 }), agg.get(p)!);
  for (const u of smUrls) get(pattern(u)).sitemap++;
  for (const r of pages) {
    const a = get(pattern(r.keys[0]));
    a.withImp++; a.imp += r.impressions; a.clk += r.clicks;
    if (!smSet.has(r.keys[0])) a.outside++;
  }

  // 3) Inspección por muestra (por patrón, mezcla de URLs con y sin impresiones).
  const impSet = new Set(pages.map((r) => r.keys[0]));
  const byPat = new Map<string, string[]>();
  for (const u of smUrls) { const p = pattern(u); (byPat.get(p) ?? byPat.set(p, []).get(p)!).push(u); }
  const sample: string[] = [];
  for (const [, us] of [...byPat].sort((a, b) => b[1].length - a[1].length)) {
    const noImp = us.filter((u) => !impSet.has(u)), yes = us.filter((u) => impSet.has(u));
    const pick = [...noImp.sort(() => Math.random() - 0.5).slice(0, Math.ceil(PER / 2)), ...yes.sort(() => Math.random() - 0.5).slice(0, Math.floor(PER / 2))];
    sample.push(...pick.slice(0, PER));
  }
  const res: Awaited<ReturnType<typeof inspect>>[] = [];
  const S = sample.slice(0, LIMIT);
  for (let i = 0; i < S.length; i += 5) {
    res.push(...(await Promise.all(S.slice(i, i + 5).map((u) => inspect(token, u)))));
    if (i % 50 === 0) process.stderr.write(`[gsc] ${i + 1}/${S.length}\n`);
  }
  const states = new Map<string, Record<string, number>>();
  for (const r of res) { const p = pattern(r.url); const m = states.get(p) ?? states.set(p, {}).get(p)!; m[r.state] = (m[r.state] ?? 0) + 1; }
  const short = (s: string) => s.replace('Submitted and indexed', 'indexada').replace('Crawled - currently not indexed', 'rastreada-no-ind').replace('Discovered - currently not indexed', 'descubierta-no-ind').replace('URL is unknown to Google', 'desconocida').replace("Excluded by ‘noindex’ tag", 'noindex').replace('Duplicate, Google chose different canonical than user', 'dup-canónica-google').replace('Alternate page with proper canonical tag', 'alternativa-canónica').replace('Page with redirect', 'redirección').replace('Blocked by robots.txt', 'bloq-robots').replace('Not found (404)', '404').replace('Soft 404', 'soft-404');

  lines.push('', '## Por patrón de URL', '', 'Sitemap = URLs en sitemap · Con imp. = URLs con impresiones en 28 d · Fuera = con impresiones pero no en sitemap · Muestra = estado en URL Inspection', '',
    '| Patrón | Sitemap | Con imp. | % con imp. | Impr. | Clics | Fuera | Muestra |', '|---|---|---|---|---|---|---|---|');
  for (const [p, a] of [...agg].sort((x, y) => (y[1].sitemap + y[1].withImp) - (x[1].sitemap + x[1].withImp))) {
    if (a.sitemap + a.withImp < 3) continue;
    const st = Object.entries(states.get(p) ?? {}).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${short(k)} ${v}`).join(', ');
    lines.push(`| \`${p}\` | ${a.sitemap} | ${a.withImp} | ${a.sitemap ? Math.round((100 * a.withImp) / a.sitemap) + ' %' : '—'} | ${a.imp} | ${a.clk} | ${a.outside} | ${st} |`);
  }

  // 4) Rarezas.
  const blockedYet = pages.filter((r) => dis.some((re) => re.test(pathOf(r.keys[0]))));
  const params = pages.filter((r) => r.keys[0].includes('?'));
  const outside = pages.filter((r) => !smSet.has(r.keys[0]) && !/\/(en|pt|fr|ar)(\/|$)/.test(new URL(r.keys[0]).pathname.slice(0, 4)));
  lines.push('', `## Con impresiones pese al Disallow: ${blockedYet.length}`, '');
  for (const r of blockedYet.sort((a, b) => b.impressions - a.impressions).slice(0, 25)) lines.push(`- ${pathOf(r.keys[0])} · ${r.impressions} imp · ${r.clicks} clics`);
  lines.push('', `## Con parámetros: ${params.length}`, '');
  for (const r of params.sort((a, b) => b.impressions - a.impressions).slice(0, 25)) lines.push(`- ${pathOf(r.keys[0])} · ${r.impressions} imp`);
  lines.push('', `## Con impresiones y fuera del sitemap (sin ediciones): ${outside.length}`, '');
  for (const r of outside.sort((a, b) => b.impressions - a.impressions).slice(0, 40)) lines.push(`- ${pathOf(r.keys[0])} · ${r.impressions} imp · ${r.clicks} clics`);
  const odd = res.filter((r) => /404|soft|redirect|error|robots|canonical/i.test(r.state));
  lines.push('', `## Muestra: estados problemáticos (${odd.length})`, '');
  for (const r of odd.slice(0, 60)) lines.push(`- ${pathOf(r.url)} · ${short(r.state)}${'canonical' in r && r.canonical && r.canonical !== r.url ? ` → ${r.canonical.replace(ORIGIN, '')}` : ''}`);

  out.patterns = Object.fromEntries(agg); out.states = Object.fromEntries(states); out.inspections = res;
  mkdirSync(join(process.cwd(), 'gsc'), { recursive: true });
  writeFileSync(join(process.cwd(), 'gsc', `bloqueo-${dayStr(0)}.json`), JSON.stringify(out, null, 2));
  writeFileSync(join(process.cwd(), 'gsc', `bloqueo-${dayStr(0)}.md`), lines.join('\n'));
  console.log(lines.join('\n'));
}

main().catch((e) => { console.error(e); process.exit(1); });

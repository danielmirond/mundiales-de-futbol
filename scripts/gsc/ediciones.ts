/**
 * Indexación de las ediciones no españolas (/en, /pt, /fr, /ar).
 *
 * Desde el 2026-11-01 llevan X-Robots-Tag: noindex. Antes de cerrarlas en
 * robots.txt hay que esperar a que Google las saque del índice (si se bloquea
 * el rastreo antes, nunca ve el noindex y se quedan indexadas).
 *
 * Saca, por edición: impresiones y clics por semana (12 semanas), páginas con
 * impresiones en los últimos 7 días, e inspecciona (URL Inspection) las que
 * tuvieron impresiones en 90 días + las portadas de cada edición.
 *
 * Uso: GSC_SA_JSON=… npx tsx scripts/gsc/ediciones.ts [--limit 300]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSA, getToken, query } from './report';

const SITE = process.env.GSC_SITE ?? 'https://mundiales-de-futbol.com/';
const ORIGIN = SITE.replace(/\/$/, '');
const LOCALES = ['en', 'pt', 'fr', 'ar'] as const;
const arg = (n: string) => {
  const i = process.argv.indexOf(n);
  return i === -1 ? undefined : process.argv[i + 1];
};
const LIMIT = Number(arg('--limit') ?? 300);
const dayStr = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
const localeOf = (u: string) => u.replace(ORIGIN, '').match(/^\/(en|pt|fr|ar)(\/|$)/)?.[1];

const filter = (loc: string) => ({
  dimensionFilterGroups: [
    { filters: [{ dimension: 'page', operator: 'includingRegex', expression: `^${ORIGIN}/${loc}(/|$)` }] },
  ],
});

async function inspect(token: string, url: string) {
  for (let a = 0; a < 4; a++) {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: 'en-US' }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000 * (a + 1)));
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = (await res.json()) as any;
    if (!res.ok) return { url, error: d?.error?.message ?? `HTTP ${res.status}` };
    const i = d?.inspectionResult?.indexStatusResult ?? {};
    return {
      url,
      verdict: i.verdict as string | undefined,
      coverageState: i.coverageState as string | undefined,
      indexingState: i.indexingState as string | undefined,
      robotsTxtState: i.robotsTxtState as string | undefined,
      lastCrawlTime: i.lastCrawlTime as string | undefined,
    };
  }
  return { url, error: 'reintentos agotados' };
}

async function main() {
  const token = await getToken(loadSA());
  const out: Record<string, unknown> = { generatedAt: new Date().toISOString() };
  const lines: string[] = [`# Ediciones no españolas · ${dayStr(0)}`, ''];

  // 1) Tendencia semanal por edición (12 semanas).
  lines.push('## Impresiones / clics por semana', '', '| Semana | ' + LOCALES.join(' | ') + ' |', '|---|' + LOCALES.map(() => '---').join('|') + '|');
  const weekly: Record<string, Record<string, { imp: number; clk: number }>> = {};
  for (const loc of LOCALES) {
    const rows = await query(token, { startDate: dayStr(86), endDate: dayStr(2), dimensions: ['date'], rowLimit: 200, ...filter(loc) });
    for (const r of rows) {
      const d = new Date(r.keys[0]);
      const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86_400_000).toISOString().slice(0, 10);
      weekly[monday] ??= {};
      weekly[monday][loc] ??= { imp: 0, clk: 0 };
      weekly[monday][loc].imp += r.impressions;
      weekly[monday][loc].clk += r.clicks;
    }
  }
  for (const w of Object.keys(weekly).sort())
    lines.push(`| ${w} | ` + LOCALES.map((l) => (weekly[w][l] ? `${weekly[w][l].imp} / ${weekly[w][l].clk}` : '0')).join(' | ') + ' |');
  out.weekly = weekly;

  // 2) Páginas con impresiones (90 días y 7 días).
  const pages90: { url: string; imp: number; clk: number }[] = [];
  const pages7 = new Map<string, number>();
  for (const loc of LOCALES) {
    for (const r of await query(token, { startDate: dayStr(90), endDate: dayStr(2), dimensions: ['page'], rowLimit: 5000, ...filter(loc) }))
      pages90.push({ url: r.keys[0], imp: r.impressions, clk: r.clicks });
    for (const r of await query(token, { startDate: dayStr(9), endDate: dayStr(2), dimensions: ['page'], rowLimit: 5000, ...filter(loc) }))
      pages7.set(r.keys[0], r.impressions);
  }
  pages90.sort((a, b) => b.imp - a.imp);
  lines.push('', '## Páginas con impresiones', '', '| Edición | 90 días | últimos 7 días |', '|---|---|---|');
  for (const loc of LOCALES)
    lines.push(`| ${loc} | ${pages90.filter((p) => localeOf(p.url) === loc).length} | ${[...pages7.keys()].filter((u) => localeOf(u) === loc).length} |`);
  out.pages90 = pages90;
  out.pages7 = Object.fromEntries(pages7);

  // 3) URL Inspection de las páginas con tráfico + portadas.
  const targets = [...new Set([...LOCALES.map((l) => `${ORIGIN}/${l}`), ...pages90.map((p) => p.url)])].slice(0, LIMIT);
  const results: Awaited<ReturnType<typeof inspect>>[] = [];
  for (let i = 0; i < targets.length; i += 5) {
    results.push(...(await Promise.all(targets.slice(i, i + 5).map((u) => inspect(token, u)))));
    if (i % 50 === 0) process.stderr.write(`[gsc] ${i + 1}/${targets.length}\n`);
  }
  const tally: Record<string, Record<string, number>> = {};
  for (const r of results) {
    const loc = localeOf(r.url) ?? '?';
    const state = 'error' in r && r.error ? `error: ${r.error}` : ('coverageState' in r ? r.coverageState : undefined) ?? 'desconocido';
    tally[loc] ??= {};
    tally[loc][state] = (tally[loc][state] ?? 0) + 1;
  }
  lines.push('', `## Estado en el índice (${results.length} URLs inspeccionadas)`, '');
  for (const loc of LOCALES) {
    lines.push(`### /${loc}`);
    for (const [s, n] of Object.entries(tally[loc] ?? {}).sort((a, b) => b[1] - a[1])) lines.push(`- ${s}: ${n}`);
    lines.push('');
  }
  const stillIndexed = results.filter((r) => 'verdict' in r && r.verdict === 'PASS');
  lines.push(`**Siguen indexadas:** ${stillIndexed.length} de ${results.length}`, '');
  for (const r of stillIndexed.slice(0, 40)) lines.push(`- ${r.url.replace(ORIGIN, '')} (último rastreo ${'lastCrawlTime' in r ? r.lastCrawlTime?.slice(0, 10) : '?'})`);
  out.inspections = results;
  out.tally = tally;

  mkdirSync(join(process.cwd(), 'gsc'), { recursive: true });
  writeFileSync(join(process.cwd(), 'gsc', `ediciones-${dayStr(0)}.json`), JSON.stringify(out, null, 2));
  writeFileSync(join(process.cwd(), 'gsc', `ediciones-${dayStr(0)}.md`), lines.join('\n'));
  console.log(lines.join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

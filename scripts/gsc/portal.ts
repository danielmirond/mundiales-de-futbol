/**
 * Search Console por secciones del portal (tras el giro post-Mundial).
 * Compara los últimos 14 días con los 14 anteriores por sección y lista las
 * mejores URLs y consultas de cada una. Escribe gsc/portal-<fecha>.md/.json.
 *   GSC_SA_JSON="$(cat key.json)" npx tsx scripts/gsc/portal.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSA, getToken, query } from './report';

const SITE = process.env.GSC_SITE ?? 'https://mundiales-de-futbol.com/';
const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
const path = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

const SECTIONS: [string, RegExp][] = [
  ['Portada', /^\/(en|fr|pt|ar)?\/?$/],
  ['Partidos de hoy', /^\/((en|fr|pt|ar)\/)?partidos-hoy/],
  ['Fútbol · competiciones', /^\/((en|fr|pt|ar)\/)?futbol\/[^/]+\/?(partidos-hoy|calendario|resultados|alineaciones|clasificacion|goleadores)?(\/.*)?$/],
  ['Fútbol · partidos', /\/futbol\/[^/]+\/partido\//],
  ['Fútbol · equipos', /\/futbol\/[^/]+\/equipo\//],
  ['Baloncesto', /^\/((en|fr|pt|ar)\/)?baloncesto/],
  ['Otros deportes', /^\/((en|fr|pt|ar)\/)?(motor|tenis|rugby|futbol-americano|hockey|beisbol|balonmano)/],
  ['Noticias', /\/noticias/],
  ['Mundial 2026', /\/2026(\/|$)/],
  ['Archivo Mundiales', /\/(mundiales|ediciones|selecciones|palmares|historial|historias|jugadores|goles-famosos|estadios|galeria|records|coleccionismo|2030)(\/|$)/],
];
const sectionOf = (p: string) => {
  // Orden: partidos y equipos antes que «competiciones».
  for (const name of ['Fútbol · partidos', 'Fútbol · equipos']) { const re = SECTIONS.find((s) => s[0] === name)![1]; if (re.test(p)) return name; }
  return SECTIONS.find(([n, re]) => !['Fútbol · partidos', 'Fútbol · equipos'].includes(n) && re.test(p))?.[0] ?? 'Otras';
};

(async () => {
  const token = await getToken(loadSA());
  const cur = { startDate: day(15), endDate: day(2) }, prev = { startDate: day(29), endDate: day(16) };
  const [pc, pp, pq] = await Promise.all([
    query(token, { ...cur, dimensions: ['page'], rowLimit: 5000 }),
    query(token, { ...prev, dimensions: ['page'], rowLimit: 5000 }),
    query(token, { ...cur, dimensions: ['page', 'query'], rowLimit: 5000 }),
  ]);
  type Agg = { clicks: number; impressions: number; prevClicks: number; prevImpr: number; pages: number; top: { p: string; clicks: number; impressions: number; pos: number }[]; queries: Map<string, { clicks: number; impressions: number }> };
  const agg = new Map<string, Agg>();
  const get = (k: string) => { let a = agg.get(k); if (!a) { a = { clicks: 0, impressions: 0, prevClicks: 0, prevImpr: 0, pages: 0, top: [], queries: new Map() }; agg.set(k, a); } return a; };
  for (const r of pc) { const p = path(r.keys[0]); const a = get(sectionOf(p)); a.clicks += r.clicks; a.impressions += r.impressions; a.pages++; a.top.push({ p, clicks: r.clicks, impressions: r.impressions, pos: r.position }); }
  for (const r of pp) { const a = get(sectionOf(path(r.keys[0]))); a.prevClicks += r.clicks; a.prevImpr += r.impressions; }
  for (const r of pq) { const a = get(sectionOf(path(r.keys[0]))); const q = a.queries.get(r.keys[1]) ?? { clicks: 0, impressions: 0 }; q.clicks += r.clicks; q.impressions += r.impressions; a.queries.set(r.keys[1], q); }

  const pct = (a: number, b: number) => (b === 0 ? (a > 0 ? 'nuevo' : '—') : `${a >= b ? '+' : ''}${Math.round(((a - b) / b) * 100)}%`);
  const rows = [...agg.entries()].sort((a, b) => b[1].impressions - a[1].impressions);
  const md: string[] = [`# Search Console por secciones · ${cur.startDate} → ${cur.endDate} (vs ${prev.startDate} → ${prev.endDate})`, '',
    '| Sección | URLs con impresiones | Clics | Δ clics | Impresiones | Δ impr. |', '| --- | --- | --- | --- | --- | --- |',
    ...rows.map(([k, a]) => `| ${k} | ${a.pages} | ${a.clicks} | ${pct(a.clicks, a.prevClicks)} | ${a.impressions} | ${pct(a.impressions, a.prevImpr)} |`), ''];
  for (const [k, a] of rows) {
    md.push(`## ${k}`, '', '**URLs**', '', ...a.top.sort((x, y) => y.impressions - x.impressions).slice(0, 8).map((t) => `- ${t.p} · ${t.clicks} clics · ${t.impressions} impr. · pos ${t.pos.toFixed(1)}`), '',
      '**Consultas**', '', ...[...a.queries.entries()].sort((x, y) => y[1].impressions - x[1].impressions).slice(0, 8).map(([q, v]) => `- ${q} · ${v.clicks} clics · ${v.impressions} impr.`), '');
  }
  const dir = join(process.cwd(), 'gsc'); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `portal-${cur.endDate}.md`), md.join('\n'));
  writeFileSync(join(dir, `portal-${cur.endDate}.json`), JSON.stringify({ cur, prev, sections: rows.map(([k, a]) => ({ section: k, ...a, queries: [...a.queries.entries()].slice(0, 30) })) }, null, 1));
  console.log(md.slice(0, rows.length + 4).join('\n'));
})();

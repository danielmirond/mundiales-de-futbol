/**
 * Google Discover: qué contenidos entran y cuáles se pinchan. Últimos N días
 * (por defecto 90) con `type: 'discover'` (Discover no da consultas, solo
 * URL). Cruza las noticias con su título, tipo y competición para ver qué
 * patrones funcionan. Escribe gsc/discover-<fecha>.md/.json.
 *   GSC_SA_JSON="$(cat key.json)" npx tsx scripts/gsc/discover.ts [--days 90]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSA, getToken, query } from './report';
import { NEWS_ITEMS, newsKind, NEWS_KIND_LABEL } from '../../src/lib/news';

const i = process.argv.indexOf('--days');
const DAYS = i >= 0 ? Number(process.argv[i + 1]) : 90;
const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
const path = (u: string) => decodeURI(u.replace(/^https?:\/\/[^/]+/, '') || '/');
const bySlug = new Map(NEWS_ITEMS.map((n) => [n.slug, n]));

const SECTIONS: [string, RegExp][] = [
  ['Noticias', /\/noticias\//],
  ['Fútbol · partidos', /\/partido\//],
  ['Equipos', /\/equipo\//],
  ['Mundial 2026', /\/2026(\/|$)/],
  ['Selecciones', /\/selecciones\//],
  ['Historias', /\/historias\//],
  ['Récords y palmarés', /\/(records|palmares)\//],
  ['Ediciones', /\/ediciones\//],
  ['Jugadores', /\/jugadores\//],
  ['Estadios', /\/estadios\//],
  ['Portal deportes', /^\/((en|fr|pt|ar)\/)?(futbol|baloncesto|rugby|motor|tenis|futbol-americano|hockey|beisbol|golf|combate)\//],
];
const sectionOf = (p: string) => SECTIONS.find(([, re]) => re.test(p))?.[0] ?? 'Otras';
const pct = (c: number, i: number) => (i ? `${((c / i) * 100).toFixed(1)}%` : '—');

type Agg = { pages: number; clicks: number; impressions: number };
const add = (m: Map<string, Agg>, k: string, r: { clicks: number; impressions: number }) => {
  const a = m.get(k) ?? { pages: 0, clicks: 0, impressions: 0 };
  a.pages++; a.clicks += r.clicks; a.impressions += r.impressions; m.set(k, a);
};
const table = (title: string, m: Map<string, Agg>, label: string) => [
  `## ${title}`, '', `| ${label} | URLs | Clics | Impresiones | CTR | Impr./URL |`, '| --- | --- | --- | --- | --- | --- |',
  ...[...m.entries()].sort((a, b) => b[1].impressions - a[1].impressions)
    .map(([k, a]) => `| ${k} | ${a.pages} | ${a.clicks} | ${a.impressions} | ${pct(a.clicks, a.impressions)} | ${Math.round(a.impressions / a.pages)} |`), ''];

(async () => {
  const token = await getToken(loadSA());
  const range = { startDate: day(DAYS + 2), endDate: day(2) };
  const [pages, dates] = await Promise.all([
    query(token, { ...range, type: 'discover', dimensions: ['page'], rowLimit: 5000 }),
    query(token, { ...range, type: 'discover', dimensions: ['date'], rowLimit: 500 }),
  ]);
  const rows = pages.map((r) => {
    const p = path(r.keys[0]);
    const slug = p.match(/\/noticias\/([^/?#]+)/)?.[1];
    const n = slug ? bySlug.get(slug) : undefined;
    return {
      path: p, section: sectionOf(p), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr,
      title: n?.title, kind: n ? NEWS_KIND_LABEL[newsKind(n)] : undefined, competition: n?.competition?.name ?? n?.category,
      publishedAt: n?.publishedAt, titleLen: n?.title.length, hasImage: n ? Boolean(n.image) : undefined,
    };
  }).sort((a, b) => b.impressions - a.impressions);

  const bySection = new Map<string, Agg>(), byKind = new Map<string, Agg>(), byComp = new Map<string, Agg>(), byLen = new Map<string, Agg>(), byImg = new Map<string, Agg>();
  for (const r of rows) {
    add(bySection, r.section, r);
    if (r.title) {
      add(byKind, r.kind ?? '—', r);
      add(byComp, r.competition ?? '—', r);
      add(byLen, r.titleLen! < 60 ? '< 60' : r.titleLen! < 80 ? '60-79' : r.titleLen! < 100 ? '80-99' : '≥ 100', r);
      add(byImg, r.hasImage ? 'Con foto propia' : 'Tarjeta de marca', r);
    }
  }
  const tot = rows.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 });
  const weeks = new Map<string, { c: number; i: number }>();
  for (const d of dates) { const w = d.keys[0].slice(0, 8) + (Number(d.keys[0].slice(8)) <= 15 ? '01-15' : '16-31'); const x = weeks.get(w) ?? { c: 0, i: 0 }; x.c += d.clicks; x.i += d.impressions; weeks.set(w, x); }

  const md = [
    `# Google Discover · ${range.startDate} → ${range.endDate}`, '',
    `${rows.length} URLs con impresiones · ${tot.c} clics · ${tot.i} impresiones · CTR ${pct(tot.c, tot.i)}`, '',
    '## Evolución (quincenas)', '', '| Periodo | Clics | Impresiones | CTR |', '| --- | --- | --- | --- |',
    ...[...weeks.entries()].sort().map(([w, x]) => `| ${w} | ${x.c} | ${x.i} | ${pct(x.c, x.i)} |`), '',
    ...table('Por sección', bySection, 'Sección'),
    ...table('Noticias por tipo', byKind, 'Tipo'),
    ...table('Noticias por competición', byComp, 'Competición'),
    ...table('Noticias por longitud del titular', byLen, 'Caracteres'),
    ...table('Noticias por imagen', byImg, 'Imagen'),
    '## Top 40 URLs', '', '| URL | Titular | Tipo | Clics | Impr. | CTR |', '| --- | --- | --- | --- | --- | --- |',
    ...rows.slice(0, 40).map((r) => `| ${r.path} | ${r.title ?? ''} | ${r.kind ?? r.section} | ${r.clicks} | ${r.impressions} | ${pct(r.clicks, r.impressions)} |`), '',
    '## Mejor CTR (≥ 500 impresiones)', '',
    ...rows.filter((r) => r.impressions >= 500).sort((a, b) => b.ctr - a.ctr).slice(0, 15).map((r) => `- ${pct(r.clicks, r.impressions)} · ${r.impressions} impr. · ${r.title ?? r.path}`), '',
    '## Peor CTR (≥ 500 impresiones)', '',
    ...rows.filter((r) => r.impressions >= 500).sort((a, b) => a.ctr - b.ctr).slice(0, 15).map((r) => `- ${pct(r.clicks, r.impressions)} · ${r.impressions} impr. · ${r.title ?? r.path}`), '',
  ];
  const dir = join(process.cwd(), 'gsc'); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `discover-${range.endDate}.md`), md.join('\n'));
  writeFileSync(join(dir, `discover-${range.endDate}.json`), JSON.stringify({ range, total: tot, rows }, null, 1));
  console.log(md.join('\n'));
})();

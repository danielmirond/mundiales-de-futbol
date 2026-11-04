/**
 * Inserta las guías «Dónde ver» redactadas (JSON) en src/lib/news.ts y las
 * registra en src/data/watch-guides.json (competición o «sport:<slug>» → slug).
 *
 * Uso: npx tsx scripts/watch-guides/insert.ts <dir-con-json> [--dry] [--only a,b]
 * Valida antes de escribir; una pieza con errores no entra.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readNews, upsert, writeNews, exists, publishedAtOf, type Piece } from '../daily-content/news-io';
import { COMPETITIONS, SPORTS } from '../../src/lib/competitions';

type Draft = Piece & { watchKey: string; label: string; imageFile?: string; dudas?: string[] };

const dir = process.argv[2];
const DRY = process.argv.includes('--dry');
const onlyArg = process.argv.indexOf('--only');
const ONLY = onlyArg > -1 ? new Set(process.argv[onlyArg + 1].split(',')) : null;
const MAP_PATH = join(process.cwd(), 'src/data/watch-guides.json');

const drafts: Draft[] = readdirSync(dir).filter((f) => /^[A-Z]-.*\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as Draft[]);
let src = readNews();
const newSlugs = new Set(drafts.map((d) => d.slug));
const compPaths = new Set(COMPETITIONS.map((c) => `/${c.sport}/${c.slug}`));
const sportPaths = new Set(SPORTS.map((s) => `/${s.slug}`));
// Secciones reales del sitio: cada carpeta de src/app/[locale] que no es dinámica.
const APP = join(process.cwd(), 'src/app/[locale]');
const SECTIONS = readdirSync(APP).filter((d) => !d.startsWith('[') && statSync(join(APP, d)).isDirectory());
const STATIC = new Set(['/', ...SECTIONS.map((d) => `/${d}`)]);
const inSection = (path: string) => SECTIONS.some((d) => path.startsWith(`/${d}/`)) && !path.startsWith('/noticias/');

function validate(d: Draft): string[] {
  const e: string[] = [];
  const keyOk = d.watchKey.startsWith('sport:') ? SPORTS.some((s) => `sport:${s.slug}` === d.watchKey) : COMPETITIONS.some((c) => c.slug === d.watchKey);
  if (!keyOk) e.push(`watchKey desconocido: ${d.watchKey}`);
  if (!/^donde-ver-[a-z0-9-]+$/.test(d.slug) || d.slug.length > 95) e.push(`slug inválido: ${d.slug}`);
  if (d.title.length < 50 || d.title.length > 110) e.push(`titular de ${d.title.length} caracteres`);
  if (/[¿?¡!]/.test(d.title) || /^\d/.test(d.title)) e.push('titular con signos o empieza por número');
  if (/\b(DAZN|Movistar|RTVE|Teledeporte|HBO|Eurosport|Prime Video|Apple|YouTube)\b/i.test(d.title)) e.push('el titular nombra la plataforma (da la respuesta)');
  const words = d.body.split(/\s+/).length;
  if (words < 300) e.push(`cuerpo corto: ${words} palabras`);
  if (!d.image?.url || !d.image.alt || !d.image.credit || !d.image.license) e.push('falta foto o sus datos');
  if (d.image && /\b(NC|ND)\b/.test(d.image.license ?? '')) e.push(`licencia no válida: ${d.image.license}`);
  const links = [...d.body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  const internal = links.filter((u) => u.startsWith('/'));
  if (internal.length < 2) e.push(`solo ${internal.length} enlaces internos`);
  for (const u of internal) {
    const path = u.split('#')[0].replace(/\/$/, '') || '/';
    const ok = STATIC.has(path) || compPaths.has(path) || sportPaths.has(path) || /^\/(futbol|baloncesto)\/[a-z0-9-]+\/equipo\//.test(path)
      || (path.startsWith('/noticias/') && (exists(src, path.slice(10)) || newSlugs.has(path.slice(10)))) || inSection(path);
    if (!ok) e.push(`enlace interno roto: ${u}`);
  }
  const aff = links.filter((u) => u.includes('awin1.com'));
  for (const u of aff) if (!/awinmid=(126263|114230)&awinaffid=2898755&ued=https%3A%2F%2Fwww\.(dazn\.com|movistarplus\.es)/.test(u)) e.push(`enlace de afiliado raro: ${u.slice(0, 120)}`);
  const hasAffNote = /comisión/.test(d.body);
  if (aff.length && !hasAffNote) e.push('enlaces de afiliado sin aviso');
  if (!aff.length && hasAffNote) e.push('aviso de afiliación sin enlaces de afiliado');
  if (/\b(en definitiva|sin duda|cabe destacar|a continuación|es importante destacar)\b/i.test(d.body)) e.push('muletilla de plantilla');
  return e;
}

// Hora de publicación: escalonada hacia atrás desde ahora, un minuto por pieza.
const base = Date.now() - 5 * 60_000;
const madrid = (ms: number) => {
  const d = new Date(ms + 3600_000); // CET (+01:00) hasta finales de marzo
  return d.toISOString().slice(0, 19) + '+01:00';
};

const map: Record<string, { slug: string; label: string }> = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
let ok = 0;
drafts.forEach((d, i) => {
  if (ONLY && !ONLY.has(d.watchKey)) return;
  const errs = validate(d);
  if (errs.length) { console.log(`✗ ${d.watchKey} · ${d.slug}\n   - ${errs.join('\n   - ')}`); return; }
  const piece: Piece = {
    slug: d.slug, title: d.title, summary: d.summary, body: d.body.trim(), category: d.category || 'general',
    competition: d.competition, sourceName: d.sourceName, sourceUrl: d.sourceUrl, sourceLang: d.sourceLang === 'en' ? 'en' : 'es',
    publishedAt: publishedAtOf(src, d.slug) ?? madrid(base - i * 60_000), author: 'Redacción Mundiales', image: d.image, sourcesSecondary: d.sourcesSecondary,
  };
  if (exists(src, d.slug)) piece.modifiedAt = madrid(Date.now());
  const r = upsert(src, piece);
  src = r.src;
  map[d.watchKey] = { slug: d.slug, label: d.label };
  ok++;
  console.log(`✓ ${d.watchKey} · ${r.action} · ${d.body.split(/\s+/).length} palabras · ${d.title}`);
});
console.log(`\n${ok}/${ONLY ? ONLY.size : drafts.length} válidas`);
if (!DRY && ok) {
  writeNews(src);
  writeFileSync(MAP_PATH, JSON.stringify(Object.fromEntries(Object.entries(map).sort()), null, 2) + '\n');
}

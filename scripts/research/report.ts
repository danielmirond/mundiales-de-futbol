/**
 * Orquesta la investigación diaria y genera un report Markdown
 * en `research/YYYY-MM-DD.md`.
 *
 *  pnpm run research          → genera el report del día
 *  pnpm run research --dry    → no escribe disco, sólo imprime resumen
 *
 * El report incluye:
 *  1. Top queries Google Trends (daily + realtime) por geo
 *  2. Top videos YouTube (search + trending) por idioma/región
 *  3. Cobertura: queries que ya tienen URL en el sitemap interno
 *  4. Sugerencias priorizadas (noticia / historia / guía / video respuesta)
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  GEOS,
  type ContentSuggestion,
  type ResearchReport,
  type TrendItem,
  isMundialRelated,
  slugify,
  todayISO,
} from './lib';
import { fetchAllGoogleTrends } from './google-trends';
import { fetchAllYouTube } from './youtube';

// Cargamos el corpus interno (URLs ya cubiertas)
import { TOURNAMENTS } from '../../src/lib/tournaments';
import { HISTORIAS } from '../../src/lib/historias';
import { SEDES_2026 } from '../../src/lib/wc-2026-sedes';
import { GROUPS_2026, TEAMS_2026 } from '../../src/lib/wc-2026';
import { NEWS_ITEMS } from '../../src/lib/news';
import { SQUADS_2026 } from '../../src/lib/wc-2026-squads';
import { JERSEY_HISTORIES } from '../../src/lib/wc-jerseys';

const SITE_PATHS: string[] = (() => {
  const out: string[] = [
    '/',
    '/ediciones',
    '/jugadores',
    '/selecciones',
    '/estadios',
    '/2026',
    '/2026/entradas',
    '/2026/donde-ver',
    '/2026/fan-zone',
    '/2026/sedes',
    '/2026/grupos',
    '/2026/calendario',
    '/2026/convocatorias',
    '/2026/listas',
    '/2026/mascotas',
    '/coleccionismo/panini-mundial-2026',
    '/coleccionismo/panini-mundial-2026/precio',
    '/coleccionismo/panini-mundial-2026/donde-comprar',
    '/coleccionismo/panini-mundial-2026/cuando-sale',
    '/coleccionismo/panini-mundial-2026/digital',
    '/coleccionismo/panini-mundial-2026/tapa-dura',
    '/coleccionismo/panini-mundial-2026/cromos-mas-caros',
    '/coleccionismo/panini-mundial-2026/coca-cola',
    '/coleccionismo/panini-mundial-2026/topps-vs-panini',
    '/historias',
    '/galeria',
    '/palmares',
    '/records',
    '/noticias',
  ];
  for (const t of TOURNAMENTS) out.push(`/ediciones/${t.slug}`);
  for (const s of SEDES_2026) out.push(`/2026/sedes/${s.citySlug}`);
  for (const sq of SQUADS_2026) out.push(`/2026/listas/${sq.teamCode}`);
  for (const h of JERSEY_HISTORIES) out.push(`/selecciones/${h.teamCode}/camisetas`);
  for (const g of GROUPS_2026) out.push(`/2026/grupo/${g.letter}`);
  for (const h of HISTORIAS) out.push(`/historias/${h.slug}`);
  for (const n of NEWS_ITEMS) out.push(`/noticias/${n.slug}`);
  for (const code of Object.keys(TEAMS_2026)) out.push(`/selecciones/${code}`);
  return out;
})();

// ────────────────────────────────────────────────────────────────────────────
// Cobertura
// ────────────────────────────────────────────────────────────────────────────

/**
 * Diccionario de sinónimos cross-language. Mapea términos en inglés/portugués/
 * francés/alemán/italiano/japonés/coreano a sus equivalentes en español, que
 * es el idioma de los slugs internos del site.
 *
 * Esto reduce los falsos negativos: "world cup 2026 schedule" debe
 * considerarse cubierto por `/2026/calendario`, no como un gap nuevo.
 */
const CROSS_LANG_MAP: Record<string, string> = {
  // Generic World Cup references
  'world cup': 'mundial',
  'fifa world cup': 'mundial',
  'copa do mundo': 'mundial',
  'copa mundo': 'mundial',
  'coupe du monde': 'mundial',
  'mondiali': 'mundial',
  'wm': 'mundial',
  'wereldbeker': 'mundial',
  // Schedule / calendar
  schedule: 'calendario',
  fixtures: 'calendario',
  calendário: 'calendario',
  calendrier: 'calendario',
  spielplan: 'calendario',
  // Host cities / venues
  'host cities': 'sedes',
  'host city': 'sedes',
  venues: 'sedes',
  stadiums: 'estadios',
  'cidades-sede': 'sedes',
  'villes hôtes': 'sedes',
  'villes hotes': 'sedes',
  // Tickets
  tickets: 'entradas',
  ticket: 'entradas',
  ingresso: 'entradas',
  ingressos: 'entradas',
  billets: 'entradas',
  biglietti: 'entradas',
  // Mascots
  mascot: 'mascotas',
  mascots: 'mascotas',
  mascote: 'mascotas',
  mascotes: 'mascotas',
  mascotte: 'mascotas',
  mascottes: 'mascotas',
  maskottchen: 'mascotas',
  // Groups
  groups: 'grupos',
  'group draw': 'grupos sorteo',
  groupes: 'grupos',
  gruppen: 'grupos',
  // Squad lists
  squad: 'lista',
  squads: 'listas',
  lineup: 'lista',
  'liste équipe': 'lista',
  kader: 'lista',
  convocação: 'convocatoria',
  convocações: 'convocatorias',
  // Jerseys
  jersey: 'camiseta',
  jerseys: 'camisetas',
  shirt: 'camiseta',
  kit: 'camiseta',
  camisa: 'camiseta',
  camisas: 'camisetas',
  maillot: 'camiseta',
  trikot: 'camiseta',
  // Teams hosts
  usa: 'estados-unidos',
  canada: 'canada',
  // Stickers
  stickers: 'cromos',
  figurinhas: 'cromos',
  vignettes: 'cromos',
  // Country names common
  spain: 'espana',
  brazil: 'brasil',
  argentina: 'argentina',
  germany: 'alemania',
  france: 'francia',
  england: 'inglaterra',
  italy: 'italia',
  netherlands: 'paises-bajos',
};

/**
 * Aplica el mapa de sinónimos a un texto: reemplaza cada llave (frase EN/PT/FR/…)
 * por su equivalente ES, en orden de longitud descendente para evitar
 * solapamientos.
 */
function translateForCoverage(query: string): string {
  let q = query.toLowerCase();
  const entries = Object.entries(CROSS_LANG_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of entries) {
    q = q.replaceAll(from, to);
  }
  return q;
}

function alreadyCovered(query: string): string | null {
  // Variante normalizada por slug y otra cross-language traducida a ES.
  const variants = [slugify(query), slugify(translateForCoverage(query))];
  for (const slug of variants) {
    const tokens = slug.split('-').filter((t) => t.length >= 4);
    if (tokens.length === 0) continue;
    for (const path of SITE_PATHS) {
      const lp = path.toLowerCase();
      const hits = tokens.filter((t) => lp.includes(t)).length;
      // 2+ tokens significativos coincidentes → cubierto
      if (hits >= Math.min(2, tokens.length)) return path;
    }
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// Agregación + scoring
// ────────────────────────────────────────────────────────────────────────────

function aggregateByLanguage(items: TrendItem[]) {
  const map = new Map<string, Map<string, { score: number; geos: Set<string>; samples: TrendItem[] }>>();
  for (const it of items) {
    const lang = it.language || 'unknown';
    if (!map.has(lang)) map.set(lang, new Map());
    const queryNorm = it.query.toLowerCase().trim();
    const langMap = map.get(lang)!;
    const cur = langMap.get(queryNorm) ?? { score: 0, geos: new Set<string>(), samples: [] };
    const geoWeight = GEOS.find((g) => g.code === it.geo)?.weight ?? 1;
    cur.score += (it.score || 1) * geoWeight;
    cur.geos.add(it.geo);
    cur.samples.push(it);
    langMap.set(queryNorm, cur);
  }
  const out: Record<string, Array<{ query: string; score: number; geos: string[]; samples: TrendItem[] }>> = {};
  for (const [lang, langMap] of map) {
    const arr = [...langMap.entries()]
      .map(([query, v]) => ({ query, score: v.score, geos: [...v.geos], samples: v.samples }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
    out[lang] = arr;
  }
  return out;
}

function buildSuggestions(items: TrendItem[]): { suggestions: ContentSuggestion[]; covered: ResearchReport['alreadyCovered'] } {
  const covered: ResearchReport['alreadyCovered'] = [];
  const map = new Map<string, ContentSuggestion>();

  for (const it of items) {
    if (!isMundialRelated(it.query) && !it.articles?.length && !it.videoTitle) continue;
    const baseQuery = (it.query || it.videoTitle || '').trim();
    if (!baseQuery) continue;

    const matchedPath = alreadyCovered(baseQuery);
    if (matchedPath) {
      covered.push({ query: baseQuery, matchUrl: matchedPath });
      continue;
    }

    const slug = slugify(baseQuery);
    if (!slug) continue;

    const key = `${it.language}::${slug}`;
    const geoWeight = GEOS.find((g) => g.code === it.geo)?.weight ?? 1;
    const sourceWeight =
      it.source === 'google-trends-daily' ? 1.2 :
      it.source === 'google-trends-realtime' ? 1.0 :
      it.source === 'youtube-trending' ? 1.1 :
      0.9;
    const addScore = (it.score || 1) * geoWeight * sourceWeight;

    const existing = map.get(key);
    if (existing) {
      existing.score += addScore;
      if (!existing.geos.includes(it.geo)) existing.geos.push(it.geo);
      existing.evidence.push(it);
      continue;
    }

    const type = pickType(baseQuery, it);
    map.set(key, {
      topic: baseQuery,
      type,
      slugSuggestion: slug,
      language: it.language || 'unknown',
      geos: [it.geo],
      score: addScore,
      reason: reasoning(baseQuery, it),
      proposedPath: pickProposedPath(type, slug, it.language),
      evidence: [it],
    });
  }

  const suggestions = [...map.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  return { suggestions, covered };
}

function pickType(query: string, it: TrendItem): ContentSuggestion['type'] {
  const q = query.toLowerCase();
  if (it.source.startsWith('youtube')) {
    if (/(highlight|gol|goles|resumen|reaction|reacción)/i.test(q)) return 'video';
    return 'youtube-respuesta';
  }
  if (/panini|cromos|sticker|figurinha|álbum|album/i.test(q)) return 'guía';
  if (/historia|leyenda|cuando|quien|por qué|por que|why|when|who/i.test(q)) return 'historia';
  if (/precio|donde|cómo|como|comprar|ticket|entrada/i.test(q)) return 'guía';
  return 'noticia';
}

function pickProposedPath(type: ContentSuggestion['type'], slug: string, _language: string): string {
  switch (type) {
    case 'noticia':
      return `/noticias/${slug}`;
    case 'historia':
      return `/historias/${slug}`;
    case 'guía':
      return `/coleccionismo/panini-mundial-2026/${slug}`;
    case 'cluster':
      return `/coleccionismo/${slug}`;
    case 'video':
    case 'youtube-respuesta':
      return `/historias/${slug}`;
  }
}

function reasoning(query: string, it: TrendItem): string {
  const parts: string[] = [];
  if (it.source === 'google-trends-daily') parts.push(`Google Trends daily ${it.geo} con ${it.score.toLocaleString()} búsquedas`);
  if (it.source === 'google-trends-realtime') parts.push(`Google Trends realtime ${it.geo} (sports)`);
  if (it.source === 'youtube-search') parts.push(`YouTube top búsqueda en ${it.language || it.geo}: ${it.score.toLocaleString()} views`);
  if (it.source === 'youtube-trending') parts.push(`YouTube trending sports ${it.geo}: ${it.score.toLocaleString()} views`);
  if (it.articles?.length) parts.push(`${it.articles.length} artículos noticiosos referenciando "${query}"`);
  if (it.videoTitle && it.videoTitle !== query) parts.push(`Video viral: ${it.videoTitle}`);
  return parts.join(' · ');
}

// ────────────────────────────────────────────────────────────────────────────
// Render Markdown
// ────────────────────────────────────────────────────────────────────────────

function renderMarkdown(report: ResearchReport): string {
  const lines: string[] = [];
  lines.push(`# Research diario · ${report.date}`);
  lines.push('');
  lines.push(`Generado: ${report.generatedAt}`);
  lines.push(`Geos cubiertas: ${report.geosCovered.join(', ')}`);
  lines.push(`Trends totales: ${report.trendItems.length}`);
  lines.push(`Sugerencias: ${report.suggestions.length}`);
  lines.push(`Ya cubiertas: ${report.alreadyCovered.length}`);
  lines.push('');

  // 1. Sugerencias priorizadas
  lines.push('## 🟢 Sugerencias priorizadas');
  lines.push('');
  if (report.suggestions.length === 0) {
    lines.push('_Sin trends del Mundial detectadas hoy._');
  } else {
    lines.push('| # | Tipo | Topic | Lang | Geos | Score | Path propuesto |');
    lines.push('|---|------|-------|------|------|-------|----------------|');
    report.suggestions.forEach((s, i) => {
      lines.push(
        `| ${i + 1} | ${s.type} | ${s.topic} | ${s.language} | ${s.geos.join(',')} | ${Math.round(s.score).toLocaleString()} | \`${s.proposedPath}\` |`,
      );
    });
    lines.push('');
    lines.push('### Detalle');
    lines.push('');
    report.suggestions.slice(0, 15).forEach((s, i) => {
      lines.push(`#### ${i + 1}. ${s.topic}`);
      lines.push(`- **Tipo**: ${s.type}`);
      lines.push(`- **Slug**: \`${s.slugSuggestion}\``);
      lines.push(`- **Path**: \`${s.proposedPath}\``);
      lines.push(`- **Razón**: ${s.reason}`);
      if (s.evidence[0]?.videoUrl) {
        lines.push(`- **Vídeo top**: [${s.evidence[0].videoTitle}](${s.evidence[0].videoUrl}) · ${s.evidence[0].channelTitle}`);
      }
      if (s.evidence[0]?.articles?.length) {
        const a = s.evidence[0].articles![0];
        lines.push(`- **Artículo referencia**: [${a.title}](${a.url}) · ${a.source}`);
      }
      lines.push('');
    });
  }

  // 2. Top por idioma
  lines.push('## 🌐 Top queries por idioma');
  lines.push('');
  for (const [lang, items] of Object.entries(report.topByLanguage)) {
    if (items.length === 0) continue;
    lines.push(`### ${lang.toUpperCase()}`);
    lines.push('');
    items.slice(0, 15).forEach((it) => {
      lines.push(`- **${it.query}** — ${Math.round(it.score).toLocaleString()} (${it.geos.join(', ')})`);
    });
    lines.push('');
  }

  // 3. Cobertura existente
  if (report.alreadyCovered.length > 0) {
    lines.push('## ✅ Trends ya cubiertas en el site');
    lines.push('');
    const seen = new Set<string>();
    report.alreadyCovered.forEach((c) => {
      const key = `${c.query}::${c.matchUrl}`;
      if (seen.has(key)) return;
      seen.add(key);
      lines.push(`- "${c.query}" → \`${c.matchUrl}\``);
    });
    lines.push('');
  }

  return lines.join('\n');
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  const dry = process.argv.includes('--dry');
  // eslint-disable-next-line no-console
  console.log(`[research] iniciando · dry=${dry}`);

  const [trendsItems, ytItems] = await Promise.all([
    fetchAllGoogleTrends(),
    fetchAllYouTube(),
  ]);

  // eslint-disable-next-line no-console
  console.log(`[research] google-trends=${trendsItems.length} · youtube=${ytItems.length}`);

  const all: TrendItem[] = [...trendsItems, ...ytItems];
  const topByLanguage = aggregateByLanguage(all);
  const { suggestions, covered } = buildSuggestions(all);

  const report: ResearchReport = {
    generatedAt: new Date().toISOString(),
    date: todayISO(),
    geosCovered: GEOS.map((g) => g.code),
    trendItems: all,
    topByLanguage,
    suggestions,
    alreadyCovered: covered,
  };

  const md = renderMarkdown(report);

  if (dry) {
    // eslint-disable-next-line no-console
    console.log(md);
    return;
  }

  const dir = join(process.cwd(), 'research');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const outMd = join(dir, `${report.date}.md`);
  const outJson = join(dir, `${report.date}.json`);
  writeFileSync(outMd, md, 'utf8');
  writeFileSync(outJson, JSON.stringify(report, null, 2), 'utf8');
  // eslint-disable-next-line no-console
  console.log(`[research] escrito ${outMd}`);
  // eslint-disable-next-line no-console
  console.log(`[research] escrito ${outJson}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[research] FATAL', err);
  process.exit(1);
});

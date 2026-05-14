/**
 * Filtra y puntúa items RSS para quedarnos solo con los relevantes
 * al Mundial 2026. Combina:
 *
 *  1. Keyword match (Mundial 2026, FIFA, World Cup 2026...) — gating
 *  2. Entity match (48 selecciones + 16 ciudades sede + productos) — boost
 *  3. Peso del feed (FIFA oficial > medios secundarios)
 *  4. Recencia (items >48h pierden score)
 *
 * Output: items ordenados por score descendente, sin duplicados.
 */

import { FEEDS } from './feeds';
import type { FeedItem, ScoredItem } from './types';

// ───────────────────────────────────────────────────────────────────
// Vocabularios
// ───────────────────────────────────────────────────────────────────

const KEYWORDS_CORE = [
  // Mundial 2026 / nombres del torneo
  'mundial 2026',
  'mundial-2026',
  'world cup 2026',
  'fifa world cup 2026',
  'copa do mundo 2026',
  'coupe du monde 2026',
  'weltmeisterschaft 2026',
  'mondiale 2026',
  'canamex',
  'canadá méxico estados unidos',
  'canada mexico united states',
  'fwc26',
  'fwc2026',
];

const KEYWORDS_AMBIENT = [
  // No son gating, solo aportan contexto
  'fifa',
  'on location',
  'panini',
  'mascota',
  'mascot',
  'sorteo',
  'draw',
  'clasificación mundialista',
  'qualifier',
  'qualifiers',
  'qualifying',
];

const TEAMS_ES = [
  'argentina', 'brasil', 'españa', 'francia', 'inglaterra', 'alemania',
  'portugal', 'italia', 'países bajos', 'holanda', 'bélgica', 'croacia',
  'estados unidos', 'méxico', 'canadá', 'uruguay', 'colombia', 'ecuador',
  'paraguay', 'chile', 'perú', 'venezuela', 'marruecos', 'senegal', 'egipto',
  'argelia', 'túnez', 'ghana', 'costa de marfil', 'sudáfrica', 'camerún',
  'nigeria', 'japón', 'corea', 'irán', 'arabia saudí', 'australia', 'catar',
  'qatar', 'irak', 'uzbekistán', 'jordania', 'turquía', 'noruega', 'suecia',
  'suiza', 'austria', 'chequia', 'escocia', 'bosnia', 'nueva zelanda',
  'panamá', 'curazao', 'haití', 'cabo verde',
];

const TEAMS_EN = [
  'argentina', 'brazil', 'spain', 'france', 'england', 'germany',
  'portugal', 'italy', 'netherlands', 'belgium', 'croatia',
  'united states', 'mexico', 'canada', 'uruguay', 'colombia', 'ecuador',
  'paraguay', 'chile', 'peru', 'venezuela', 'morocco', 'senegal', 'egypt',
  'algeria', 'tunisia', 'ghana', 'ivory coast', 'south africa', 'cameroon',
  'nigeria', 'japan', 'south korea', 'iran', 'saudi arabia', 'australia', 'qatar',
  'iraq', 'uzbekistan', 'jordan', 'turkey', 'norway', 'sweden',
  'switzerland', 'austria', 'czechia', 'scotland', 'bosnia', 'new zealand',
  'panama', 'curacao', 'haiti', 'cape verde',
];

const VENUES = [
  'atlanta', 'boston', 'dallas', 'houston', 'kansas city',
  'los angeles', 'los ángeles', 'sofi stadium', 'metlife',
  'miami', 'new york', 'nueva york', 'philadelphia', 'filadelfia',
  'seattle', 'san francisco', 'bay area', 'toronto', 'vancouver',
  'guadalajara', 'azteca', 'estadio akron', 'estadio bbva', 'monterrey',
  'ciudad de méxico', 'mexico city',
];

const PRODUCTS = [
  'hospitality', 'private suite', 'follow my team', 'venue series',
  'single match', 'pp-suite', 'panini', 'cromos', 'figurinhas', 'stickers',
  'camiseta', 'jersey', 'kit', 'maillot', 'álbum',
];

const STOPLIST = [
  // Temáticas distintas que generan ruido alto
  'sub-20', 'sub-17', 'sub-15', 'u20', 'u17', 'femenino', 'femenil',
  "women's", 'mundial femenino', 'mundial 2030', 'world cup 2030',
  'champions league', 'champions cup', 'libertadores', 'sudamericana',
  'mundial de clubes 2025',
];

// ───────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function matchAny(haystack: string, needles: string[]): string[] {
  const hits: string[] = [];
  for (const n of needles) {
    const normalized = normalize(n);
    if (haystack.includes(normalized)) hits.push(n);
  }
  return hits;
}

function recencyMultiplier(pubDate: string): number {
  const now = Date.now();
  const t = new Date(pubDate).getTime();
  if (isNaN(t)) return 0.5;
  const hours = (now - t) / 3600_000;
  if (hours < 6) return 1.0;
  if (hours < 24) return 0.95;
  if (hours < 48) return 0.85;
  if (hours < 72) return 0.65;
  if (hours < 168) return 0.4; // 1 week
  return 0.15;
}

// ───────────────────────────────────────────────────────────────────
// Scorer
// ───────────────────────────────────────────────────────────────────

export function scoreItem(item: FeedItem): ScoredItem | null {
  const corpus = normalize(`${item.title} ${item.contentSnippet ?? ''} ${item.content ?? ''}`);

  // Stoplist: si menciona temáticas excluidas, descartar a menos que core domine
  const stopHits = matchAny(corpus, STOPLIST);

  // Keyword core: gating obligatorio (a no ser que el feed sea wc-2026)
  const feed = FEEDS.find((f) => f.id === item.feedId);
  const isWc2026Scope = feed?.scope === 'wc-2026';
  const keywordHits = matchAny(corpus, KEYWORDS_CORE);
  if (!isWc2026Scope && keywordHits.length === 0) return null;
  if (stopHits.length > 0 && keywordHits.length === 0) return null;

  // Ambient
  const ambientHits = matchAny(corpus, KEYWORDS_AMBIENT);
  // Teams
  const teamHits = [...matchAny(corpus, TEAMS_ES), ...matchAny(corpus, TEAMS_EN)];
  // Venues
  const venueHits = matchAny(corpus, VENUES);
  // Products
  const productHits = matchAny(corpus, PRODUCTS);

  // Score base
  let score = 0;
  score += keywordHits.length * 25;
  score += ambientHits.length * 4;
  score += teamHits.length * 8;
  score += venueHits.length * 8;
  score += productHits.length * 10;

  // Feed weight
  score *= feed?.weight ?? 1.0;

  // Recency
  score *= recencyMultiplier(item.pubDate);

  // Penalización suave si scope general y solo 1 keyword
  if (feed?.scope === 'general-sport' && keywordHits.length === 1 && teamHits.length === 0) {
    score *= 0.5;
  }

  // wc-2026 scope siempre tiene un mínimo de score
  if (isWc2026Scope && score < 15) score = 15;

  // Dejar fuera lo muy bajo
  if (score < 12) return null;

  return {
    ...item,
    score: Math.round(score * 100) / 100,
    matches: {
      keyword: keywordHits,
      teams: teamHits,
      venues: venueHits,
      products: productHits,
    },
  };
}

export function filterAndScore(items: FeedItem[]): ScoredItem[] {
  const scored: ScoredItem[] = [];
  const seenHashes = new Set<string>();
  // Dedup adicional por título normalizado (mismo título cross-feed)
  const seenTitles = new Set<string>();
  for (const item of items) {
    if (seenHashes.has(item.hash)) continue;
    seenHashes.add(item.hash);
    const titleKey = normalize(item.title).replace(/[^a-z0-9 ]/g, '').slice(0, 80);
    if (seenTitles.has(titleKey)) continue;
    seenTitles.add(titleKey);
    const s = scoreItem(item);
    if (s) scored.push(s);
  }
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

// CLI directo
if (import.meta.url === `file://${process.argv[1]}`) {
  void (async () => {
    const { fetchAllFeeds } = await import('./fetch');
    const items = await fetchAllFeeds();
    const scored = filterAndScore(items);
    console.log(`[filter] ${scored.length} relevant items out of ${items.length} total\n`);
    for (const s of scored.slice(0, 20)) {
      console.log(`  ${String(s.score).padStart(6)} · [${s.feedId}] ${s.title.slice(0, 90)}`);
      if (s.matches.teams.length > 0) console.log(`         teams: ${s.matches.teams.slice(0, 3).join(', ')}`);
      if (s.matches.venues.length > 0) console.log(`         venues: ${s.matches.venues.slice(0, 3).join(', ')}`);
    }
  })();
}

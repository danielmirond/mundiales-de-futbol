/**
 * Capa de investigación diaria para descubrir contenido viral
 * sobre el Mundial 2026 y recomendar piezas editoriales.
 *
 * Tres fuentes:
 *  1. Google Trends — `dailytrends` + `realtimetrends` por región.
 *  2. YouTube Data API v3 — búsquedas con queries semilla, ordenadas por
 *     viewCount en las últimas 24-48 h, y trending de la categoría Sport.
 *  3. Cruce con sitemap del propio site para detectar GAPS.
 *
 * El report final es Markdown bajo `research/YYYY-MM-DD.md`.
 */

// ────────────────────────────────────────────────────────────────────────────
// Geos relevantes para 2026
// ────────────────────────────────────────────────────────────────────────────

export type Geo = {
  code: string; // ISO Alpha-2 (Google Trends/YouTube regionCode)
  language: string; // ISO 639-1 (hl param Google Trends)
  hl: string; // hl combinado (en-US, es-MX, es-AR…)
  tz: number; // offset en minutos (Google Trends pide tz)
  label: string;
  group: 'host' | 'latam' | 'europa' | 'asia-oceania' | 'africa';
  // Pondera el peso de la geo cuando ranqueamos sugerencias finales.
  weight: number;
};

export const GEOS: Geo[] = [
  // Host countries
  { code: 'US', language: 'en', hl: 'en-US', tz: 240, label: 'Estados Unidos', group: 'host', weight: 1.4 },
  { code: 'MX', language: 'es', hl: 'es-MX', tz: 360, label: 'México', group: 'host', weight: 1.4 },
  { code: 'CA', language: 'en', hl: 'en-CA', tz: 300, label: 'Canadá', group: 'host', weight: 1.2 },
  // LatAm hispano (lectores principales del site)
  { code: 'AR', language: 'es', hl: 'es-AR', tz: 180, label: 'Argentina', group: 'latam', weight: 1.3 },
  { code: 'CO', language: 'es', hl: 'es-CO', tz: 300, label: 'Colombia', group: 'latam', weight: 1.0 },
  { code: 'CL', language: 'es', hl: 'es-CL', tz: 240, label: 'Chile', group: 'latam', weight: 0.9 },
  { code: 'PE', language: 'es', hl: 'es-PE', tz: 300, label: 'Perú', group: 'latam', weight: 0.9 },
  { code: 'EC', language: 'es', hl: 'es-EC', tz: 300, label: 'Ecuador', group: 'latam', weight: 0.8 },
  { code: 'UY', language: 'es', hl: 'es-UY', tz: 180, label: 'Uruguay', group: 'latam', weight: 0.9 },
  { code: 'BR', language: 'pt', hl: 'pt-BR', tz: 180, label: 'Brasil', group: 'latam', weight: 1.3 },
  // Europa / España (mercado principal)
  { code: 'ES', language: 'es', hl: 'es-ES', tz: -60, label: 'España', group: 'europa', weight: 1.5 },
  { code: 'GB', language: 'en', hl: 'en-GB', tz: 0, label: 'Reino Unido', group: 'europa', weight: 1.1 },
  { code: 'FR', language: 'fr', hl: 'fr-FR', tz: -60, label: 'Francia', group: 'europa', weight: 1.0 },
  { code: 'DE', language: 'de', hl: 'de-DE', tz: -60, label: 'Alemania', group: 'europa', weight: 1.0 },
  { code: 'IT', language: 'it', hl: 'it-IT', tz: -60, label: 'Italia', group: 'europa', weight: 0.9 },
  { code: 'PT', language: 'pt', hl: 'pt-PT', tz: 0, label: 'Portugal', group: 'europa', weight: 1.0 },
  // Asia / Oceania
  { code: 'JP', language: 'ja', hl: 'ja-JP', tz: -540, label: 'Japón', group: 'asia-oceania', weight: 0.7 },
  { code: 'KR', language: 'ko', hl: 'ko-KR', tz: -540, label: 'Corea del Sur', group: 'asia-oceania', weight: 0.7 },
  { code: 'AU', language: 'en', hl: 'en-AU', tz: -600, label: 'Australia', group: 'asia-oceania', weight: 0.7 },
  // Africa
  { code: 'MA', language: 'fr', hl: 'fr-MA', tz: 0, label: 'Marruecos', group: 'africa', weight: 0.9 },
];

// ────────────────────────────────────────────────────────────────────────────
// Queries semilla por idioma
// ────────────────────────────────────────────────────────────────────────────

export const SEED_QUERIES: Record<string, string[]> = {
  es: [
    'mundial 2026',
    'fifa 2026',
    'copa del mundo 2026',
    'mundial 2026 entradas',
    'panini mundial 2026',
    'cromos mundial 2026',
    'mascota mundial 2026',
    'sedes mundial 2026',
    'lista mundial 2026',
    'convocatoria mundial 2026',
    'camiseta mundial 2026',
    'selección españa mundial',
    'argentina mundial 2026',
    'méxico mundial 2026',
    'donde ver mundial 2026',
    'fan zone mundial 2026',
  ],
  en: [
    'world cup 2026',
    'fifa 2026',
    'world cup 2026 tickets',
    'world cup 2026 schedule',
    'world cup 2026 host cities',
    'world cup 2026 mascots',
    'panini world cup 2026',
    'world cup 2026 stickers',
    'usa world cup 2026',
    'canada world cup 2026',
    'world cup 2026 jerseys',
    'world cup 2026 group draw',
    'fan zone world cup 2026',
  ],
  pt: [
    'copa do mundo 2026',
    'fifa 2026',
    'álbum panini 2026',
    'figurinhas copa 2026',
    'brasil copa 2026',
    'mascotes copa 2026',
    'sedes copa 2026',
    'convocação seleção 2026',
    'ingressos copa 2026',
  ],
  fr: [
    'coupe du monde 2026',
    'fifa 2026',
    'panini coupe du monde 2026',
    'maillot équipe de france 2026',
    'liste équipe de france 2026',
    'billets coupe du monde 2026',
    'mascottes coupe du monde 2026',
  ],
  de: [
    'wm 2026',
    'fifa 2026',
    'wm 2026 tickets',
    'wm 2026 spielplan',
    'wm 2026 trikot',
    'wm 2026 maskottchen',
    'panini wm 2026',
  ],
  it: [
    'mondiali 2026',
    'fifa 2026',
    'biglietti mondiali 2026',
    'panini mondiali 2026',
    'maglia italia 2026',
  ],
  ja: ['ワールドカップ 2026', 'fifa 2026', 'パニーニ ワールドカップ'],
  ko: ['월드컵 2026', 'fifa 2026', '월드컵 2026 일정'],
};

// Detección de relevancia: dos niveles.
//   STRONG  → frases inequívocas del Mundial 2026/2030 → match positivo.
//   WEAK    → tokens ambiguos ("ticket", "panini") que sólo cuentan si
//             además aparece alguna referencia al Mundial en el texto.
export const STRONG_TOKENS = [
  'world cup 2026',
  'world cup 2030',
  'mundial 2026',
  'mundial 2030',
  'fifa 2026',
  'fifa 2030',
  'fifa world cup',
  'fifa world',
  'copa do mundo 2026',
  'copa do mundo 2030',
  'copa mundo 2026',
  'coupe du monde 2026',
  'coupe du monde 2030',
  'mondiali 2026',
  'mondiali 2030',
  'wm 2026',
  'wm 2030',
  'wm2026',
  'wereldbeker 2026',
  'ワールドカップ 2026',
  'ワールドカップ2026',
  '월드컵 2026',
  '2026 월드컵',
  '世界杯 2026',
  '2026 世界杯',
  'panini mundial',
  'panini world cup',
  'panini wc',
  'panini wm',
  'panini coupe du monde',
  'panini copa do mundo',
  'panini mondiali',
  'panini fifa',
  'maple the moose',
  'zayu mascot',
  'clutch the eagle',
];

// Tokens que requieren co-ocurrencia con un strong token o con "2026"/"2030"
// y un termino futbolero. Útil cuando el RSS recorta la query a "panini" sólo.
export const WEAK_TOKENS_WITH_YEAR = [
  'panini',
  'topps match attax',
  'cromos',
  'figurinhas',
  'stickers',
  'mascot',
  'maskottchen',
  'fan zone',
  'fan festival',
  'host city',
  'host cities',
  'sedes',
  'cidades-sede',
  'jersey',
  'camiseta',
  'maillot',
  'trikot',
];

export function isMundialRelated(text: string): boolean {
  const t = text.toLowerCase();
  if (STRONG_TOKENS.some((tok) => t.includes(tok))) return true;
  // Co-ocurrencia: weak token + año Mundial 2026/2030
  const hasYear = /(2026|2030)/.test(t);
  if (hasYear && WEAK_TOKENS_WITH_YEAR.some((tok) => t.includes(tok))) return true;
  return false;
}

// ────────────────────────────────────────────────────────────────────────────
// Tipos de salida
// ────────────────────────────────────────────────────────────────────────────

export type TrendItem = {
  query: string;
  geo: string;
  language: string;
  source: 'google-trends-daily' | 'google-trends-realtime' | 'youtube-search' | 'youtube-trending';
  /** Métrica heurística (búsquedas estimadas, views, score relativo). */
  score: number;
  /** Sólo YouTube. */
  videoId?: string;
  videoTitle?: string;
  videoUrl?: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  /** Sólo Google Trends. */
  relatedQueries?: string[];
  articles?: Array<{ title: string; url: string; source: string }>;
};

export type ResearchReport = {
  generatedAt: string; // ISO
  date: string; // YYYY-MM-DD
  geosCovered: string[];
  trendItems: TrendItem[];
  /** Top queries agregadas por idioma. */
  topByLanguage: Record<string, Array<{ query: string; score: number; geos: string[]; samples: TrendItem[] }>>;
  /** Sugerencias finales priorizadas. */
  suggestions: ContentSuggestion[];
  /** Queries que ya tienen URL en el sitemap (cobertura). */
  alreadyCovered: Array<{ query: string; matchUrl: string }>;
};

export type ContentSuggestion = {
  /** Query/topic que generó la sugerencia. */
  topic: string;
  /** Tipo recomendado de pieza. */
  type: 'noticia' | 'historia' | 'guía' | 'cluster' | 'video' | 'youtube-respuesta';
  /** Slug propuesto (ascii-safe). */
  slugSuggestion: string;
  /** Idioma origen del trend. */
  language: string;
  /** Geos donde rankeó. */
  geos: string[];
  /** Score agregado. */
  score: number;
  /** Razonamiento corto. */
  reason: string;
  /** Path del site al que iría (sin host). */
  proposedPath: string;
  /** Fuentes (videos / articles) que respaldan la sugerencia. */
  evidence: TrendItem[];
};

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Minimal sleep
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

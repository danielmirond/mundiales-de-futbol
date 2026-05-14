/**
 * Tipos compartidos del news-bot.
 *
 * Pipeline:
 *   RSS feed → FeedItem → ScoredItem (filtrado) → GeneratedNews → NewsItem (en news.ts)
 */

export type FeedSource = {
  /** ID único del feed (alias en logs). */
  id: string;
  /** Nombre human del medio. */
  name: string;
  /** URL del RSS/Atom. */
  url: string;
  /** Idioma del medio (no del resumen final). */
  lang: 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';
  /** País / región del medio (para diversidad editorial). */
  region: string;
  /**
   * Categoría del feed para tuning de filtros.
   * 'general-sport'  = deportes en general (ruido alto, requiere keyword)
   * 'soccer'         = fútbol (ruido medio)
   * 'wc-2026'        = específicamente Mundial 2026 (ruido bajo)
   */
  scope: 'general-sport' | 'soccer' | 'wc-2026';
  /** Peso para scoring final (1.0 = normal, ≥1.5 = fuente preferente). */
  weight?: number;
};

/** Item crudo del RSS. */
export type FeedItem = {
  feedId: string;
  feedName: string;
  feedLang: 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';
  title: string;
  link: string;
  pubDate: string; // ISO
  /** Descripción / lead del feed (puede incluir HTML). */
  contentSnippet?: string;
  /** Cuerpo completo si el feed lo expone. */
  content?: string;
  /** Categorías del feed. */
  categories?: string[];
  /** Hash para dedup. */
  hash: string;
};

/** Item con score post-filtrado. */
export type ScoredItem = FeedItem & {
  score: number;
  matches: {
    keyword: string[];
    teams: string[];
    venues: string[];
    products: string[];
  };
};

/** NewsItem generado por Claude listo para patchar `src/lib/news.ts`. */
export type GeneratedNews = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: NewsCategory;
  sourceName: string;
  sourceUrl: string;
  sourceLang: 'es' | 'en' | 'pt' | 'fr';
  publishedAt: string;
  sourcesSecondary?: { name: string; url: string }[];
};

export type NewsCategory =
  | 'panini'
  | 'convocatorias'
  | 'sedes'
  | 'entradas'
  | 'jugadores'
  | 'mascotas'
  | 'ceremonia'
  | 'polemica'
  | 'tv'
  | 'patrocinios'
  | 'general';

/** Estado persistente entre runs (dedup). */
export type BotState = {
  /** Hashes de items ya procesados (independientemente de si se publicaron). */
  processedHashes: string[];
  /** Slugs ya publicados (también filtra colisiones). */
  publishedSlugs: string[];
  /** Última ejecución ISO. */
  lastRunAt: string;
};

/**
 * YouTube Data API v3 — search.list y videos.list (mostPopular).
 * Requiere YOUTUBE_API_KEY (cuota: 10.000 unidades/día gratis).
 *
 *  - search.list:    100 unidades/llamada
 *  - videos.list:    1 unidad/llamada
 *
 * Estrategia: para cada idioma, lanzamos 1 search.list por query semilla con
 * order=viewCount, publishedAfter=ahora-48h, regionCode preferido. Después
 * para todas las regiones, 1 videos.list mostPopular categoría 17 (sports)
 * y filtramos por relevancia con `isMundialRelated`.
 */

import { GEOS, SEED_QUERIES, isMundialRelated, wait, type TrendItem } from './lib';

const API = 'https://www.googleapis.com/youtube/v3';

function apiKey(): string | null {
  const k = process.env.YOUTUBE_API_KEY;
  return k && k.length > 5 ? k : null;
}

type YTSearchItem = {
  id: { videoId?: string; kind?: string };
  snippet: {
    title: string;
    description?: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails?: { medium?: { url: string }; high?: { url: string }; default?: { url: string } };
  };
};
type YTSearchResponse = { items?: YTSearchItem[] };

type YTVideoItem = {
  id: string;
  snippet: {
    title: string;
    description?: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails?: { medium?: { url: string }; high?: { url: string } };
    categoryId?: string;
  };
  statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
};
type YTVideoResponse = { items?: YTVideoItem[] };

function thumb(t: YTSearchItem['snippet']['thumbnails']) {
  return t?.high?.url ?? t?.medium?.url ?? t?.default?.url;
}

async function ytFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[youtube] ${res.status} ${res.statusText} :: ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[youtube] fetch error', (e as Error).message);
    return null;
  }
}

/**
 * search.list por query semilla, top videos de las últimas 48h.
 */
export async function searchByQuery(
  query: string,
  language: string,
  regionCode?: string,
): Promise<TrendItem[]> {
  const key = apiKey();
  if (!key) return [];
  const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  const params = new URLSearchParams({
    key,
    part: 'snippet',
    q: query,
    type: 'video',
    order: 'viewCount',
    maxResults: '15',
    publishedAfter: since,
    relevanceLanguage: language,
    safeSearch: 'none',
  });
  if (regionCode) params.set('regionCode', regionCode);
  const data = await ytFetch<YTSearchResponse>(`${API}/search?${params.toString()}`);
  if (!data?.items?.length) return [];
  const items: TrendItem[] = [];
  for (const it of data.items) {
    if (!it.id.videoId) continue;
    const haystack = `${it.snippet.title} ${it.snippet.description ?? ''}`;
    if (!isMundialRelated(haystack)) continue;
    items.push({
      query,
      geo: regionCode ?? 'global',
      language,
      source: 'youtube-search',
      score: 0, // se rellena tras videos.list (viewCount)
      videoId: it.id.videoId,
      videoTitle: it.snippet.title,
      videoUrl: `https://www.youtube.com/watch?v=${it.id.videoId}`,
      channelTitle: it.snippet.channelTitle,
      publishedAt: it.snippet.publishedAt,
      thumbnailUrl: thumb(it.snippet.thumbnails),
    });
  }
  return items;
}

/**
 * mostPopular, categoría sports (17), por región.
 */
export async function trendingSportsForRegion(regionCode: string): Promise<TrendItem[]> {
  const key = apiKey();
  if (!key) return [];
  const params = new URLSearchParams({
    key,
    part: 'snippet,statistics',
    chart: 'mostPopular',
    maxResults: '20',
    regionCode,
    videoCategoryId: '17',
  });
  const data = await ytFetch<YTVideoResponse>(`${API}/videos?${params.toString()}`);
  if (!data?.items?.length) return [];
  const items: TrendItem[] = [];
  for (const v of data.items) {
    const haystack = `${v.snippet.title} ${v.snippet.description ?? ''}`;
    if (!isMundialRelated(haystack)) continue;
    items.push({
      query: v.snippet.title,
      geo: regionCode,
      language: '', // desconocido
      source: 'youtube-trending',
      score: parseInt(v.statistics?.viewCount ?? '0', 10),
      videoId: v.id,
      videoTitle: v.snippet.title,
      videoUrl: `https://www.youtube.com/watch?v=${v.id}`,
      channelTitle: v.snippet.channelTitle,
      publishedAt: v.snippet.publishedAt,
      thumbnailUrl: thumb(v.snippet.thumbnails),
    });
  }
  return items;
}

/**
 * Tras un search.list, muchas veces queremos enriquecer con statistics
 * (viewCount). Una sola llamada videos.list para hasta 50 IDs.
 */
export async function enrichWithStats(items: TrendItem[]): Promise<TrendItem[]> {
  const key = apiKey();
  if (!key) return items;
  const ids = items.map((i) => i.videoId).filter((x): x is string => Boolean(x));
  if (ids.length === 0) return items;
  // Tope de 50 IDs por petición — chunkeamos.
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50));
  const stats = new Map<string, number>();
  for (const chunk of chunks) {
    const params = new URLSearchParams({
      key,
      part: 'statistics',
      id: chunk.join(','),
    });
    const data = await ytFetch<YTVideoResponse>(`${API}/videos?${params.toString()}`);
    if (!data?.items) continue;
    for (const v of data.items) {
      stats.set(v.id, parseInt(v.statistics?.viewCount ?? '0', 10));
    }
    await wait(300);
  }
  return items.map((it) => ({
    ...it,
    score: it.videoId && stats.has(it.videoId) ? (stats.get(it.videoId) ?? it.score) : it.score,
  }));
}

export async function fetchAllYouTube(): Promise<TrendItem[]> {
  const key = apiKey();
  if (!key) {
    // eslint-disable-next-line no-console
    console.warn('[youtube] YOUTUBE_API_KEY no definida — saltando módulo YouTube.');
    return [];
  }

  const all: TrendItem[] = [];

  // 1) search.list por query semilla en cada idioma
  for (const [language, queries] of Object.entries(SEED_QUERIES)) {
    // Una región representativa por idioma para cada query
    const region = pickRegionForLanguage(language);
    for (const q of queries) {
      const items = await searchByQuery(q, language, region);
      all.push(...items);
      await wait(250); // gentle
    }
  }

  // 2) trending sports por región
  for (const geo of GEOS) {
    const items = await trendingSportsForRegion(geo.code);
    all.push(...items);
    await wait(250);
  }

  // 3) enriquecer search items con viewCount
  const enriched = await enrichWithStats(all.filter((i) => i.source === 'youtube-search'));
  const enrichedById = new Map(enriched.map((i) => [i.videoId!, i]));
  return all.map((it) => (it.videoId && enrichedById.has(it.videoId) ? enrichedById.get(it.videoId)! : it));
}

function pickRegionForLanguage(language: string): string | undefined {
  switch (language) {
    case 'es':
      return 'ES';
    case 'en':
      return 'US';
    case 'pt':
      return 'BR';
    case 'fr':
      return 'FR';
    case 'de':
      return 'DE';
    case 'it':
      return 'IT';
    case 'ja':
      return 'JP';
    case 'ko':
      return 'KR';
    default:
      return undefined;
  }
}

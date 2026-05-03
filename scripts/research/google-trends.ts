/**
 * Google Trends — endpoint público del Trending Now (2024+).
 *
 *   https://trends.google.com/trending/rss?geo=XX
 *
 * Devuelve XML RSS con namespace `ht:` (Google Trends). No requiere API key.
 * El antiguo `dailytrends` JSON fue descontinuado en 2024.
 *
 * El parseo se hace con regex porque el XML es predecible y no merece la pena
 * añadir una dependencia de XML.
 */

import { GEOS, isMundialRelated, wait, type Geo, type TrendItem } from './lib';

const BASE = 'https://trends.google.com/trending/rss';

function parseTrafficStr(s: string): number {
  // "200+" → 200  ·  "5K+" → 5000  ·  "2M+" → 2_000_000
  const m = /(\d+(?:[.,]\d+)?)([KM]?)/.exec(s.trim());
  if (!m) return 0;
  const n = parseFloat(m[1].replace(',', '.'));
  if (m[2] === 'K') return Math.round(n * 1_000);
  if (m[2] === 'M') return Math.round(n * 1_000_000);
  return Math.round(n);
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function pick(xml: string, tag: string): string | undefined {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
  return m ? decode(m[1]) : undefined;
}

function pickAll(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(decode(m[1]));
  return out;
}

type ParsedItem = {
  query: string;
  traffic: number;
  newsItems: Array<{ title: string; url: string; source: string }>;
};

function parseRss(xml: string): ParsedItem[] {
  const itemBlocks = pickAll(xml, 'item');
  const out: ParsedItem[] = [];
  for (const block of itemBlocks) {
    const query = pick(block, 'title');
    if (!query) continue;
    const traffic = parseTrafficStr(pick(block, 'ht:approx_traffic') ?? '0');
    const newsBlocks = pickAll(block, 'ht:news_item');
    const newsItems = newsBlocks
      .map((nb) => ({
        title: pick(nb, 'ht:news_item_title') ?? '',
        url: pick(nb, 'ht:news_item_url') ?? '',
        source: pick(nb, 'ht:news_item_source') ?? '',
      }))
      .filter((n) => n.title && n.url);
    out.push({ query, traffic, newsItems });
  }
  return out;
}

async function fetchRss(geo: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}?geo=${geo}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Accept: 'application/rss+xml,application/xml,text/xml,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function fetchTrendsForGeo(geo: Geo): Promise<TrendItem[]> {
  const xml = await fetchRss(geo.code);
  if (!xml) return [];
  const parsed = parseRss(xml);
  const items: TrendItem[] = [];
  for (const p of parsed) {
    const articleTitles = p.newsItems.map((n) => n.title).join(' ');
    const haystack = `${p.query} ${articleTitles}`.toLowerCase();
    if (!isMundialRelated(haystack)) continue;
    items.push({
      query: p.query,
      geo: geo.code,
      language: geo.language,
      source: 'google-trends-daily',
      score: p.traffic || 100,
      articles: p.newsItems.slice(0, 5),
    });
  }
  return items;
}

export async function fetchAllGoogleTrends(): Promise<TrendItem[]> {
  const all: TrendItem[] = [];
  for (const geo of GEOS) {
    const items = await fetchTrendsForGeo(geo);
    all.push(...items);
    // Rate limit suave
    await wait(500);
  }
  return all;
}

/**
 * Lee los feeds RSS configurados en `feeds.ts` y normaliza los items
 * a `FeedItem`. Cada item recibe un hash MD5 sobre (feed + título + url)
 * para dedup.
 *
 * Uso directo:
 *   tsx scripts/news-bot/fetch.ts
 *   tsx scripts/news-bot/fetch.ts --only fifa-es,marca-seleccion
 */

import crypto from 'node:crypto';
import Parser from 'rss-parser';
import { FEEDS, getFeedsBy } from './feeds';
import type { FeedItem, FeedSource } from './types';

const parser = new Parser({
  headers: {
    // Algunos feeds requieren UA realista
    'User-Agent': 'Mozilla/5.0 (compatible; MundialesDeFutbolBot/1.0; +https://mundiales-de-futbol.com)',
  },
  timeout: 15000,
});

function hashItem(feedId: string, title: string, link: string): string {
  return crypto
    .createHash('md5')
    .update(`${feedId}::${title.toLowerCase().trim()}::${link}`)
    .digest('hex');
}

export async function fetchFeed(feed: FeedSource): Promise<FeedItem[]> {
  try {
    const parsed = await parser.parseURL(feed.url);
    const items: FeedItem[] = [];
    for (const item of parsed.items ?? []) {
      const title = (item.title ?? '').trim();
      const link = (item.link ?? '').trim();
      if (!title || !link) continue;
      items.push({
        feedId: feed.id,
        feedName: feed.name,
        feedLang: feed.lang,
        title,
        link,
        pubDate: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        contentSnippet: item.contentSnippet ?? '',
        content: (item as { content?: string }).content ?? '',
        categories: item.categories ?? [],
        hash: hashItem(feed.id, title, link),
      });
    }
    return items;
  } catch (err) {
    console.warn(`[fetch] feed ${feed.id} failed:`, (err as Error).message);
    return [];
  }
}

export async function fetchAllFeeds(opts: { onlyIds?: string[] } = {}): Promise<FeedItem[]> {
  const feeds = opts.onlyIds ? getFeedsBy({ ids: opts.onlyIds }) : FEEDS;
  const results = await Promise.allSettled(feeds.map((f) => fetchFeed(f)));
  const all: FeedItem[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value);
  }
  return all;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  const onlyIds = arg ? arg.replace('--only=', '').split(',') : undefined;
  const t0 = Date.now();
  fetchAllFeeds({ onlyIds }).then((items) => {
    const dt = Date.now() - t0;
    console.log(`[fetch] ${items.length} items from ${onlyIds ? onlyIds.length : FEEDS.length} feeds in ${dt}ms`);
    // resumen por feed
    const byFeed = new Map<string, number>();
    for (const i of items) byFeed.set(i.feedId, (byFeed.get(i.feedId) ?? 0) + 1);
    for (const [feedId, n] of [...byFeed.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${feedId.padEnd(20)} ${n}`);
    }
  });
}

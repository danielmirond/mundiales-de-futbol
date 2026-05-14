/**
 * Orchestrator del news-bot.
 *
 *   tsx scripts/news-bot/index.ts
 *
 * Pipeline:
 *   1. fetch — RSS de feeds.ts
 *   2. filter — keyword/entity scoring
 *   3. dedup — vs state.json (slugs ya publicados + hashes procesados)
 *   4. limit — top N por score (default 5)
 *   5. generate — Claude API redacta NewsItem en español
 *   6. patch — inserta al inicio de news.ts
 *   7. state — actualiza state.json
 *
 * Variables de entorno:
 *   ANTHROPIC_API_KEY  obligatorio
 *   NEWS_BOT_LIMIT     opcional, default 5
 *   NEWS_BOT_DRY       opcional, si '1' no patcha ni guarda estado
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchAllFeeds } from './fetch';
import { filterAndScore } from './filter';
import { generateNewsItem } from './generate';
import { patchNewsFile } from './patch';
import type { BotState, GeneratedNews, ScoredItem } from './types';

const STATE_FILE = path.resolve(process.cwd(), 'scripts/news-bot/state.json');

async function loadState(): Promise<BotState> {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw) as BotState;
  } catch {
    return { processedHashes: [], publishedSlugs: [], lastRunAt: '' };
  }
}

async function saveState(state: BotState): Promise<void> {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

async function main() {
  const limit = Number(process.env.NEWS_BOT_LIMIT ?? '5');
  const dry = process.env.NEWS_BOT_DRY === '1';

  console.log(`[news-bot] start · limit=${limit} dry=${dry}`);

  const state = await loadState();
  const seenHashes = new Set(state.processedHashes);
  const seenSlugs = new Set(state.publishedSlugs);

  // 1) fetch
  const t0 = Date.now();
  const all = await fetchAllFeeds();
  console.log(`[news-bot] fetched ${all.length} items in ${Date.now() - t0}ms`);

  // 2) filter
  const scored = filterAndScore(all);
  console.log(`[news-bot] ${scored.length} items pass filter`);

  // 3) dedup vs estado
  const fresh = scored.filter((s) => !seenHashes.has(s.hash));
  console.log(`[news-bot] ${fresh.length} fresh (no procesados antes)`);

  // 4) limit por score
  const top = fresh.slice(0, limit);
  if (top.length === 0) {
    console.log('[news-bot] nada nuevo, salida sin cambios');
    return;
  }
  console.log('\n[news-bot] top candidatos:');
  for (const t of top) {
    console.log(`  ${String(t.score).padStart(6)} · [${t.feedId}] ${t.title.slice(0, 90)}`);
  }

  // 5) generate
  const generated: GeneratedNews[] = [];
  const newProcessed: string[] = [];
  for (const item of top) {
    newProcessed.push(item.hash);
    try {
      console.log(`\n[news-bot] generando: ${item.title.slice(0, 60)}...`);
      const result = await generateNewsItem(item);
      if ('skip' in result) {
        console.log(`  ⊘ skip: ${result.reason}`);
        continue;
      }
      if (seenSlugs.has(result.slug)) {
        console.log(`  ⊘ slug ya publicado: ${result.slug}`);
        continue;
      }
      generated.push(result);
      console.log(`  ✓ ${result.slug}`);
    } catch (err) {
      console.warn(`  ✗ error generando: ${(err as Error).message}`);
    }
  }

  if (generated.length === 0) {
    console.log('\n[news-bot] no se generaron noticias publicables');
    if (!dry) {
      await saveState({
        processedHashes: [...state.processedHashes, ...newProcessed].slice(-5000),
        publishedSlugs: state.publishedSlugs,
        lastRunAt: new Date().toISOString(),
      });
    }
    return;
  }

  // 6) patch
  if (dry) {
    console.log(`\n[news-bot] DRY: ${generated.length} noticias generadas, NO se patchea news.ts`);
    for (const g of generated) {
      console.log(`  ${g.slug}`);
      console.log(`  → ${g.title}`);
      console.log(`  → ${g.summary.slice(0, 120)}...`);
    }
    return;
  }

  const result = await patchNewsFile(generated);
  console.log(`\n[news-bot] patch · inserted=${result.inserted} skipped=${result.skipped}`);
  if (result.skippedSlugs.length > 0) {
    console.log(`  skipped (duplicado en news.ts): ${result.skippedSlugs.join(', ')}`);
  }

  // 7) state
  await saveState({
    processedHashes: [...state.processedHashes, ...newProcessed].slice(-5000),
    publishedSlugs: [
      ...state.publishedSlugs,
      ...generated.map((g) => g.slug),
    ].slice(-2000),
    lastRunAt: new Date().toISOString(),
  });

  console.log('\n[news-bot] done');
}

main().catch((err) => {
  console.error('[news-bot] FATAL:', err);
  process.exit(1);
});

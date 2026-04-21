/**
 * Fetch mascot + official match ball images from Wikipedia for every
 * World Cup listed in WIKIPEDIA_ASSET_TITLES. Populates the
 * static TournamentStory objects on next import by writing to a
 * generated JSON file that the component reads alongside the text.
 *
 * Usage:
 *   npx tsx scripts/ingest-tournament-assets.ts
 */

import { WIKIPEDIA_ASSET_TITLES } from '../src/lib/tournament-stories';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HEADERS = {
  'User-Agent': 'mundiales-de-futbol/1.0 (daniel.mirond@gmail.com)',
  Accept: 'application/json',
};

async function fetchImage(title: string): Promise<string | null> {
  try {
    const t = encodeURIComponent(title.replace(/ /g, '_'));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${t}`, { headers: HEADERS });
    if (!res.ok) return null;
    const data = (await res.json()) as { originalimage?: { source: string }; thumbnail?: { source: string }; type?: string };
    if (data.type === 'disambiguation') return null;
    return data.originalimage?.source ?? data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function main() {
  console.log(`Fetching mascot + ball images for ${Object.keys(WIKIPEDIA_ASSET_TITLES).length} mundials…`);
  const out: Record<number, { mascot?: string; ball?: string }> = {};

  for (const [yearStr, titles] of Object.entries(WIKIPEDIA_ASSET_TITLES)) {
    const year = Number(yearStr);
    const entry: { mascot?: string; ball?: string } = {};
    if (titles.mascot) {
      const img = await fetchImage(titles.mascot);
      if (img) entry.mascot = img;
      console.log(`  ${year} mascot: ${img ? '✓' : '✗'} ${titles.mascot}`);
      await new Promise((r) => setTimeout(r, 120));
    }
    if (titles.ball) {
      const img = await fetchImage(titles.ball);
      if (img) entry.ball = img;
      console.log(`  ${year} ball:   ${img ? '✓' : '✗'} ${titles.ball}`);
      await new Promise((r) => setTimeout(r, 120));
    }
    if (entry.mascot || entry.ball) out[year] = entry;
  }

  const file = resolve(process.cwd(), 'src/lib/tournament-assets.json');
  writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`\n✓ Wrote ${file}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

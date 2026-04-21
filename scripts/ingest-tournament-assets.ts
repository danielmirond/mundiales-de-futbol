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

async function fetchImage(...candidates: string[]): Promise<string | null> {
  for (const title of candidates.filter(Boolean)) {
    for (const host of ['en.wikipedia.org', 'es.wikipedia.org']) {
      try {
        const t = encodeURIComponent(title.replace(/ /g, '_'));
        const res = await fetch(`https://${host}/api/rest_v1/page/summary/${t}`, {
          headers: HEADERS,
        });
        if (!res.ok) continue;
        const data = (await res.json()) as {
          originalimage?: { source: string };
          thumbnail?: { source: string };
          type?: string;
        };
        if (data.type === 'disambiguation') continue;
        const src = data.originalimage?.source ?? data.thumbnail?.source;
        if (src) return src;
      } catch {
        continue;
      }
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  return null;
}

// Per-year fallback title variations for items whose default title failed.
const EXTRA_MASCOT_TITLES: Record<number, string[]> = {
  1966: ['World Cup Willie', 'World_Cup_Willie', 'Willie (mascot)'],
  1970: ['Juanito (1970 Mascot)', 'Juanito (football mascot)', 'Juanito_(mascota)', 'Copa Mundial de Fútbol de 1970'],
  1974: ['Tip und Tap', 'Tip_und_Tap', 'Tip and Tap (mascots)', 'Copa Mundial de Fútbol de 1974'],
  1982: ['Naranjito', 'Naranjito_(mascota)', 'Naranjito (mascot)'],
  1994: ['Striker the World Cup Pup', 'Striker (1994 FIFA World Cup mascot)'],
  1998: ['Footix', 'Footix_(mascota)'],
  2026: ['Zayu', 'Maik (mascot)', 'Clutch (mascot)', 'Mascotas de la Copa Mundial de Fútbol de 2026'],
};

const EXTRA_BALL_TITLES: Record<number, string[]> = {
  1990: ['Adidas Etrusco Unico', 'Adidas Etrusco', 'Etrusco Unico'],
  2006: ['Adidas Teamgeist', '+Teamgeist', 'Adidas +Teamgeist'],
};

async function main() {
  console.log(`Fetching mascot + ball images for ${Object.keys(WIKIPEDIA_ASSET_TITLES).length} mundials…`);
  const out: Record<number, { mascot?: string; ball?: string }> = {};

  for (const [yearStr, titles] of Object.entries(WIKIPEDIA_ASSET_TITLES)) {
    const year = Number(yearStr);
    const entry: { mascot?: string; ball?: string } = {};

    const mascotTitles = [
      ...(titles.mascot ? [titles.mascot] : []),
      ...(EXTRA_MASCOT_TITLES[year] ?? []),
    ];
    const ballTitles = [
      ...(titles.ball ? [titles.ball] : []),
      ...(EXTRA_BALL_TITLES[year] ?? []),
    ];

    if (mascotTitles.length > 0) {
      const img = await fetchImage(...mascotTitles);
      if (img) entry.mascot = img;
      console.log(`  ${year} mascot: ${img ? '✓' : '✗'}`);
    }
    if (ballTitles.length > 0) {
      const img = await fetchImage(...ballTitles);
      if (img) entry.ball = img;
      console.log(`  ${year} ball:   ${img ? '✓' : '✗'}`);
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

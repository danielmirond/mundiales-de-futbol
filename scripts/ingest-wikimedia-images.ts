/**
 * Fetch hero images from Wikipedia / Wikimedia Commons for:
 *
 *   1. Top 200 players by total minutes     → players.photo_url
 *   2. 22 World Cup editions                → tournaments.hero_image_url
 *   3. Every venue in the DB                → venues.hero_image_url
 *
 * Uses the REST summary endpoint, which respects redirects and returns
 * the page's hero image + originalimage. Good enough for a first pass.
 *
 * Usage: npx tsx scripts/ingest-wikimedia-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const HEADERS = {
  'User-Agent': 'mundiales-de-futbol/1.0 (https://mundiales-de-futbol.com; daniel.mirond@gmail.com)',
  Accept: 'application/json',
};

type Summary = {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  description?: string;
  extract?: string;
  type?: string; // 'standard' | 'disambiguation' | 'no-extract'
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchSummary(title: string): Promise<Summary | null> {
  try {
    const t = encodeURIComponent(title.replace(/ /g, '_'));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${t}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return null;
    const data = (await res.json()) as Summary;
    if (data.type === 'disambiguation') return null;
    return data;
  } catch {
    return null;
  }
}

async function fetchImage(title: string): Promise<string | null> {
  const s = await fetchSummary(title);
  if (!s) return null;
  const src = s.originalimage?.source ?? s.thumbnail?.source ?? null;
  return src ?? null;
}

// ---------- PLAYERS ----------
async function ingestPlayers() {
  console.log('\n🏃 Ingesting player photos…');
  const { data: players, error } = await supabase
    .from('player_stats')
    .select('id, slug, full_name, known_as, nationality_code, total_minutes, photo_url')
    .gt('total_minutes', 90)
    .order('total_minutes', { ascending: false })
    .limit(250);

  if (error) throw error;
  if (!players) return;

  const toProcess = players.filter((p) => !p.photo_url);
  console.log(`  ${toProcess.length} players pending photos (skipping already-set).`);

  let done = 0;
  let found = 0;
  for (const p of toProcess) {
    // Try preferred candidates in order.
    const candidates = [
      p.known_as,
      p.full_name,
      p.known_as && p.nationality_code ? `${p.known_as} (footballer)` : null,
    ].filter(Boolean) as string[];

    let url: string | null = null;
    for (const title of candidates) {
      url = await fetchImage(title);
      if (url) break;
      await sleep(80);
    }

    if (url) {
      found++;
      await supabase.from('players').update({ photo_url: url }).eq('id', p.id);
    }

    done++;
    if (done % 10 === 0) {
      process.stdout.write(`\r  ${done}/${toProcess.length}  found=${found}`);
    }
    await sleep(100); // be nice to Wikipedia
  }
  process.stdout.write('\n');
  console.log(`  ✓ ${found}/${toProcess.length} player photos saved.`);
}

// ---------- TOURNAMENTS ----------
async function ingestTournaments() {
  console.log('\n🏆 Ingesting tournament hero images (emblems / posters)…');
  const { data, error } = await supabase
    .from('tournaments')
    .select('year, slug, hero_image_url')
    .order('year', { ascending: true });
  if (error) throw error;
  if (!data) return;

  const toProcess = data.filter((t) => !t.hero_image_url);
  console.log(`  ${toProcess.length} editions pending image.`);

  let found = 0;
  for (const t of toProcess) {
    const title = `${t.year} FIFA World Cup`;
    const url = await fetchImage(title);
    if (url) {
      found++;
      await supabase.from('tournaments').update({ hero_image_url: url }).eq('year', t.year);
      console.log(`  ✓ ${t.year}: ${url.slice(0, 80)}…`);
    } else {
      console.log(`  ⨯ ${t.year}: no image`);
    }
    await sleep(200);
  }
  console.log(`  ✓ ${found}/${toProcess.length} tournament images saved.`);
}

// ---------- VENUES ----------
async function ingestVenues() {
  console.log('\n🏟  Ingesting venue hero images…');
  const { data, error } = await supabase
    .from('venues')
    .select('id, slug, name, city, country_code, hero_image_url');
  if (error) throw error;
  if (!data) return;

  const toProcess = data.filter((v) => !v.hero_image_url);
  console.log(`  ${toProcess.length} venues pending image.`);

  let found = 0;
  for (const v of toProcess) {
    // Try a few candidate titles to maximise hits.
    const candidates = [v.name, v.city ? `${v.name} (${v.city})` : null, `${v.name} stadium`].filter(
      Boolean,
    ) as string[];
    let url: string | null = null;
    for (const title of candidates) {
      url = await fetchImage(title);
      if (url) break;
      await sleep(80);
    }
    if (url) {
      found++;
      await supabase.from('venues').update({ hero_image_url: url }).eq('id', v.id);
      console.log(`  ✓ ${v.name}: ${url.slice(0, 80)}…`);
    } else {
      console.log(`  ⨯ ${v.name}: no image`);
    }
    await sleep(150);
  }
  console.log(`  ✓ ${found}/${toProcess.length} venue images saved.`);
}

async function main() {
  const args = process.argv.slice(2);
  const all = args.length === 0 || args.includes('--all');
  if (all || args.includes('--tournaments')) await ingestTournaments();
  if (all || args.includes('--venues')) await ingestVenues();
  if (all || args.includes('--players')) await ingestPlayers();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

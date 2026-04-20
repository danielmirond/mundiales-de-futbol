/**
 * Seed the 16 host venues of the 2026 World Cup into the `venues` table.
 * Also runs a quick Wikipedia image fetch for any venue without one.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { VENUES_2026 } from '../src/lib/wc-2026';

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

async function fetchImage(title: string): Promise<string | null> {
  try {
    const t = encodeURIComponent(title.replace(/ /g, '_'));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${t}`, {
      headers: { 'User-Agent': 'mundiales-de-futbol/1.0 (daniel.mirond@gmail.com)' },
    });
    if (!res.ok) return null;
    const data = await res.json() as { originalimage?: { source: string }; thumbnail?: { source: string } };
    return data.originalimage?.source ?? data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('Seeding 16 × 2026 venues…');
  const rows = VENUES_2026.map((v) => ({
    slug: v.slug,
    name: v.name,
    city: v.hostCity,
    country_code: v.country,
    capacity_history: { 2026: v.capacity },
    opened_year: v.openedYear,
  }));

  await supabase.from('venues').upsert(rows, { onConflict: 'slug', ignoreDuplicates: false });
  console.log(`  ✓ ${rows.length} venues upserted.`);

  console.log('\nFetching missing images from Wikipedia…');
  const { data: current } = await supabase
    .from('venues')
    .select('id, slug, hero_image_url, name')
    .in('slug', VENUES_2026.map((v) => v.slug));

  let found = 0;
  for (const v of current ?? []) {
    if (v.hero_image_url) continue;
    const meta = VENUES_2026.find((m) => m.slug === v.slug);
    if (!meta) continue;
    const titleFromUrl = meta.wikipedia.split('/').pop() ?? meta.name;
    const img = await fetchImage(decodeURIComponent(titleFromUrl));
    if (img) {
      await supabase.from('venues').update({ hero_image_url: img }).eq('id', v.id);
      console.log(`  ✓ ${v.name}`);
      found++;
    } else {
      console.log(`  ⨯ ${v.name}`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`\n✓ ${found} images fetched.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

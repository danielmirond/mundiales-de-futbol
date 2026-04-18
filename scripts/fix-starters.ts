/**
 * One-shot fix for match_lineups.starter — infer starters from existing data
 * without re-downloading from StatsBomb.
 *
 * A starter is a player who played some minutes AND was not subbed on.
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

async function main() {
  console.log('Loading match_lineups…');
  const all: Array<{ match_id: string; team_code: string; player_id: string; minutes_played: number | null; sub_on_minute: number | null; starter: boolean }> = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('match_lineups')
      .select('match_id, team_code, player_id, minutes_played, sub_on_minute, starter')
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  console.log(`  ✓ ${all.length} rows`);

  // Compute correct starter value
  const updates = all
    .map((r) => ({
      ...r,
      newStarter: (r.minutes_played ?? 0) > 0 && r.sub_on_minute === null,
    }))
    .filter((r) => r.newStarter !== r.starter);

  console.log(`Updating ${updates.length} rows where starter flag differs…`);

  const chunkSize = 200;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    const upserts = chunk.map((r) => ({
      match_id: r.match_id,
      team_code: r.team_code,
      player_id: r.player_id,
      starter: r.newStarter,
    }));
    const { error } = await supabase
      .from('match_lineups')
      .upsert(upserts, { onConflict: 'match_id,team_code,player_id' });
    if (error) {
      console.error('chunk error:', error.message);
      throw error;
    }
    process.stdout.write(`\r  ${Math.min(i + chunkSize, updates.length)}/${updates.length}`);
  }
  process.stdout.write('\n');

  console.log(`✓ Done. ${updates.length} starter flags updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

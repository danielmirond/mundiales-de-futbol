/**
 * Set teams.successor_code and teams.dissolved_year for defunct nations
 * so the app can display unified views (e.g. GER = FRG + GER).
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

// Historical team → modern successor. FIFA-approved continuations.
const SUCCESSIONS: Array<{ code: string; name: string; successor: string; dissolved: number }> = [
  { code: 'FRG', name: 'Alemania Occidental', successor: 'GER', dissolved: 1990 },
  { code: 'GDR', name: 'Alemania Oriental',   successor: 'GER', dissolved: 1990 },
  { code: 'URS', name: 'Unión Soviética',     successor: 'RUS', dissolved: 1991 },
  { code: 'TCH', name: 'Checoslovaquia',      successor: 'CZE', dissolved: 1992 },
  { code: 'YUG', name: 'Yugoslavia',          successor: 'SRB', dissolved: 2003 },
  { code: 'SCG', name: 'Serbia y Montenegro', successor: 'SRB', dissolved: 2006 },
  { code: 'ZAI', name: 'Zaire',               successor: 'COD', dissolved: 1997 },
  { code: 'DEI', name: 'Indias Orientales Neerlandesas', successor: 'IDN', dissolved: 1949 },
];

async function main() {
  for (const s of SUCCESSIONS) {
    // Make sure the successor team exists (CZE, SRB, COD, IDN might be new)
    await supabase
      .from('teams')
      .upsert({ code: s.successor, name_official: s.successor }, {
        onConflict: 'code',
        ignoreDuplicates: true,
      });

    const { error } = await supabase
      .from('teams')
      .update({ successor_code: s.successor, dissolved_year: s.dissolved })
      .eq('code', s.code);

    if (error) console.error(`  ✗ ${s.code}: ${error.message}`);
    else console.log(`  ✓ ${s.code} (${s.name}) → ${s.successor} (${s.dissolved})`);
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Ensure all 48 teams of the 2026 WC draw exist in the teams table with
 * proper Spanish names + confederation + flag emoji.
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

type T = { code: string; name: string; conf: string; flag: string };

const TEAMS: T[] = [
  // Group A
  { code: 'MEX', name: 'México',           conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'RSA', name: 'Sudáfrica',        conf: 'CAF',      flag: '🇿🇦' },
  { code: 'KOR', name: 'Corea del Sur',    conf: 'AFC',      flag: '🇰🇷' },
  { code: 'CZE', name: 'República Checa',  conf: 'UEFA',     flag: '🇨🇿' },
  // Group B
  { code: 'CAN', name: 'Canadá',           conf: 'CONCACAF', flag: '🇨🇦' },
  { code: 'SUI', name: 'Suiza',            conf: 'UEFA',     flag: '🇨🇭' },
  { code: 'QAT', name: 'Qatar',            conf: 'AFC',      flag: '🇶🇦' },
  { code: 'BIH', name: 'Bosnia y Herzegovina', conf: 'UEFA', flag: '🇧🇦' },
  // Group C
  { code: 'BRA', name: 'Brasil',           conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'MAR', name: 'Marruecos',        conf: 'CAF',      flag: '🇲🇦' },
  { code: 'HAI', name: 'Haití',            conf: 'CONCACAF', flag: '🇭🇹' },
  { code: 'SCO', name: 'Escocia',          conf: 'UEFA',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  // Group D
  { code: 'USA', name: 'Estados Unidos',   conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'PAR', name: 'Paraguay',         conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'AUS', name: 'Australia',        conf: 'AFC',      flag: '🇦🇺' },
  { code: 'TUR', name: 'Turquía',          conf: 'UEFA',     flag: '🇹🇷' },
  // Group E
  { code: 'GER', name: 'Alemania',         conf: 'UEFA',     flag: '🇩🇪' },
  { code: 'CUW', name: 'Curazao',          conf: 'CONCACAF', flag: '🇨🇼' },
  { code: 'CIV', name: 'Costa de Marfil',  conf: 'CAF',      flag: '🇨🇮' },
  { code: 'ECU', name: 'Ecuador',          conf: 'CONMEBOL', flag: '🇪🇨' },
  // Group F
  { code: 'NED', name: 'Países Bajos',     conf: 'UEFA',     flag: '🇳🇱' },
  { code: 'JPN', name: 'Japón',            conf: 'AFC',      flag: '🇯🇵' },
  { code: 'TUN', name: 'Túnez',            conf: 'CAF',      flag: '🇹🇳' },
  { code: 'SWE', name: 'Suecia',           conf: 'UEFA',     flag: '🇸🇪' },
  // Group G
  { code: 'BEL', name: 'Bélgica',          conf: 'UEFA',     flag: '🇧🇪' },
  { code: 'EGY', name: 'Egipto',           conf: 'CAF',      flag: '🇪🇬' },
  { code: 'IRN', name: 'Irán',             conf: 'AFC',      flag: '🇮🇷' },
  { code: 'NZL', name: 'Nueva Zelanda',    conf: 'OFC',      flag: '🇳🇿' },
  // Group H
  { code: 'ESP', name: 'España',           conf: 'UEFA',     flag: '🇪🇸' },
  { code: 'CPV', name: 'Cabo Verde',       conf: 'CAF',      flag: '🇨🇻' },
  { code: 'KSA', name: 'Arabia Saudí',     conf: 'AFC',      flag: '🇸🇦' },
  { code: 'URU', name: 'Uruguay',          conf: 'CONMEBOL', flag: '🇺🇾' },
  // Group I
  { code: 'FRA', name: 'Francia',          conf: 'UEFA',     flag: '🇫🇷' },
  { code: 'SEN', name: 'Senegal',          conf: 'CAF',      flag: '🇸🇳' },
  { code: 'NOR', name: 'Noruega',          conf: 'UEFA',     flag: '🇳🇴' },
  { code: 'IRQ', name: 'Irak',             conf: 'AFC',      flag: '🇮🇶' },
  // Group J
  { code: 'ARG', name: 'Argentina',        conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'ALG', name: 'Argelia',          conf: 'CAF',      flag: '🇩🇿' },
  { code: 'AUT', name: 'Austria',          conf: 'UEFA',     flag: '🇦🇹' },
  { code: 'JOR', name: 'Jordania',         conf: 'AFC',      flag: '🇯🇴' },
  // Group K
  { code: 'POR', name: 'Portugal',         conf: 'UEFA',     flag: '🇵🇹' },
  { code: 'UZB', name: 'Uzbekistán',       conf: 'AFC',      flag: '🇺🇿' },
  { code: 'COL', name: 'Colombia',         conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'COD', name: 'RD del Congo',     conf: 'CAF',      flag: '🇨🇩' },
  // Group L
  { code: 'ENG', name: 'Inglaterra',       conf: 'UEFA',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'CRO', name: 'Croacia',          conf: 'UEFA',     flag: '🇭🇷' },
  { code: 'GHA', name: 'Ghana',            conf: 'CAF',      flag: '🇬🇭' },
  { code: 'PAN', name: 'Panamá',           conf: 'CONCACAF', flag: '🇵🇦' },
];

async function main() {
  console.log(`Upserting ${TEAMS.length} 2026 teams…`);
  const rows = TEAMS.map((t) => ({
    code: t.code,
    name_official: t.name,
    confederation: t.conf,
    flag_emoji: t.flag,
  }));
  // upsert WITHOUT ignoreDuplicates so we update names/conf/flag for existing
  const { error } = await supabase.from('teams').upsert(rows, { onConflict: 'code' });
  if (error) throw error;
  console.log(`  ✓ ${rows.length} teams ready.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

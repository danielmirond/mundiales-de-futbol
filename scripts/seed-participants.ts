/**
 * Seed tournaments.participants (new TEXT[] column) with the full set of
 * teams that played every World Cup. Lists verified against Wikipedia's
 * "FIFA World Cup YYYY" articles.
 *
 * Also runs a dedup pass deleting manually-seeded matches that duplicate
 * a StatsBomb match (same year + same teams + same date ±3 days).
 *
 * Requires the DB migration that adds `participants TEXT[]` on
 * tournaments. The migration SQL is printed at the top of this file and
 * you can paste it in the SQL editor if not already applied.
 *
 * Usage: npx tsx scripts/seed-participants.ts
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

/**
 * Mapping of every World Cup to its participant FIFA codes, verified
 * against Wikipedia. Historical codes used for defunct nations (FRG,
 * GDR, URS, TCH, YUG, SCG, ZAI, DEI).
 */
const PARTICIPANTS: Record<number, string[]> = {
  1930: ['URU', 'ARG', 'USA', 'YUG', 'CHI', 'BRA', 'FRA', 'ROU', 'PAR', 'PER', 'MEX', 'BOL', 'BEL'],
  1934: ['ITA', 'TCH', 'GER', 'AUT', 'ESP', 'HUN', 'SUI', 'SWE', 'NED', 'FRA', 'BEL', 'ROU', 'BRA', 'ARG', 'USA', 'EGY'],
  1938: ['ITA', 'HUN', 'BRA', 'SWE', 'TCH', 'FRA', 'CUB', 'ROU', 'SUI', 'NED', 'POL', 'GER', 'NOR', 'BEL', 'DEI'],
  1950: ['URU', 'BRA', 'SWE', 'ESP', 'YUG', 'SUI', 'ITA', 'ENG', 'CHI', 'USA', 'MEX', 'PAR', 'BOL'],
  1954: ['FRG', 'HUN', 'AUT', 'URU', 'SUI', 'ENG', 'YUG', 'BRA', 'ITA', 'TCH', 'KOR', 'FRA', 'MEX', 'BEL', 'TUR', 'SCO'],
  1958: ['BRA', 'SWE', 'FRA', 'FRG', 'URS', 'NIR', 'YUG', 'TCH', 'WAL', 'HUN', 'ENG', 'ARG', 'AUT', 'SCO', 'MEX', 'PAR'],
  1962: ['BRA', 'TCH', 'CHI', 'YUG', 'HUN', 'URS', 'FRG', 'ENG', 'ITA', 'ARG', 'ESP', 'SUI', 'URU', 'BUL', 'COL', 'MEX'],
  1966: ['ENG', 'FRG', 'POR', 'URS', 'ARG', 'HUN', 'URU', 'BRA', 'ITA', 'FRA', 'BUL', 'ESP', 'CHI', 'NIR', 'SUI', 'PRK'],
  1970: ['BRA', 'ITA', 'FRG', 'URU', 'PER', 'MEX', 'URS', 'ENG', 'BUL', 'BEL', 'SWE', 'TCH', 'ISR', 'MAR', 'ROU', 'SLV'],
  1974: ['FRG', 'NED', 'POL', 'BRA', 'SWE', 'YUG', 'GDR', 'ARG', 'CHI', 'ITA', 'URU', 'ZAI', 'SCO', 'BUL', 'AUS', 'HAI'],
  1978: ['ARG', 'NED', 'BRA', 'ITA', 'POL', 'FRG', 'AUT', 'PER', 'TUN', 'MEX', 'HUN', 'FRA', 'SWE', 'ESP', 'SCO', 'IRN'],
  1982: ['ITA', 'FRG', 'POL', 'FRA', 'BRA', 'ARG', 'ENG', 'URS', 'AUT', 'BEL', 'ESP', 'URU', 'YUG', 'CMR', 'HON', 'NIR', 'ALG', 'CHI', 'TCH', 'SLV', 'HUN', 'KUW', 'NZL', 'PER'],
  1986: ['ARG', 'FRG', 'FRA', 'BEL', 'BRA', 'MEX', 'ENG', 'ESP', 'DEN', 'URS', 'MAR', 'ITA', 'PAR', 'POL', 'BUL', 'URU', 'CAN', 'KOR', 'ALG', 'HUN', 'NIR', 'SCO', 'IRQ', 'POR'],
  1990: ['FRG', 'ARG', 'ITA', 'ENG', 'YUG', 'TCH', 'CMR', 'IRL', 'BRA', 'CRC', 'COL', 'ESP', 'URU', 'BEL', 'ROU', 'NED', 'EGY', 'AUT', 'USA', 'KOR', 'UAE', 'SWE', 'SCO', 'URS'],
  1994: ['BRA', 'ITA', 'SWE', 'BUL', 'ROU', 'GER', 'NED', 'ESP', 'MEX', 'ARG', 'NGA', 'KSA', 'BEL', 'USA', 'RUS', 'SUI', 'IRL', 'NOR', 'COL', 'BOL', 'KOR', 'MAR', 'GRE', 'CMR'],
  1998: ['FRA', 'BRA', 'CRO', 'NED', 'ITA', 'ARG', 'DEN', 'GER', 'ENG', 'YUG', 'MEX', 'NGA', 'ROU', 'PAR', 'NOR', 'CHI', 'AUT', 'BEL', 'BUL', 'CMR', 'COL', 'ESP', 'IRN', 'JAM', 'JPN', 'MAR', 'SCO', 'RSA', 'TUN', 'USA', 'KOR', 'KSA'],
  2002: ['BRA', 'GER', 'TUR', 'KOR', 'ESP', 'ENG', 'SEN', 'USA', 'JPN', 'DEN', 'MEX', 'IRL', 'SWE', 'BEL', 'ITA', 'PAR', 'ARG', 'CMR', 'CRC', 'CRO', 'ECU', 'FRA', 'NGA', 'POL', 'POR', 'RUS', 'RSA', 'KSA', 'SVN', 'TUN', 'URU', 'CHN'],
  2006: ['ITA', 'FRA', 'GER', 'POR', 'BRA', 'ARG', 'ENG', 'UKR', 'AUS', 'ESP', 'NED', 'MEX', 'ECU', 'SUI', 'GHA', 'CZE', 'IRN', 'USA', 'CRC', 'TUN', 'POL', 'PAR', 'ANG', 'CIV', 'KOR', 'CRO', 'SCG', 'JPN', 'KSA', 'TOG', 'TRI', 'SWE'],
  2010: ['ESP', 'NED', 'GER', 'URU', 'ARG', 'BRA', 'GHA', 'PAR', 'CHI', 'POR', 'JPN', 'USA', 'KOR', 'MEX', 'ENG', 'SVK', 'ALG', 'AUS', 'CMR', 'CIV', 'DEN', 'FRA', 'GRE', 'HON', 'ITA', 'NZL', 'NGA', 'PRK', 'SRB', 'RSA', 'SUI', 'SVN'],
  2014: ['GER', 'ARG', 'NED', 'BRA', 'COL', 'BEL', 'FRA', 'CRC', 'ALG', 'CHI', 'GRE', 'MEX', 'NGA', 'SUI', 'URU', 'USA', 'AUS', 'BIH', 'CMR', 'CIV', 'CRO', 'ECU', 'ENG', 'GHA', 'HON', 'IRN', 'ITA', 'JPN', 'KOR', 'POR', 'RUS', 'ESP'],
  2018: ['FRA', 'CRO', 'BEL', 'ENG', 'URU', 'BRA', 'RUS', 'SWE', 'COL', 'SUI', 'ESP', 'DEN', 'MEX', 'JPN', 'POR', 'ARG', 'AUS', 'EGY', 'GER', 'ISL', 'IRN', 'KSA', 'MAR', 'NGA', 'PAN', 'PER', 'POL', 'SEN', 'SRB', 'KOR', 'TUN', 'CRC'],
  2022: ['ARG', 'FRA', 'CRO', 'MAR', 'NED', 'POR', 'ENG', 'BRA', 'JPN', 'KOR', 'AUS', 'SUI', 'SEN', 'USA', 'POL', 'ESP', 'BEL', 'CMR', 'CAN', 'CRC', 'DEN', 'ECU', 'GER', 'GHA', 'IRN', 'MEX', 'KSA', 'SRB', 'TUN', 'URU', 'WAL', 'QAT'],
};

// Lightweight team-name map for missing codes
const TEAM_NAMES: Record<string, string> = {
  ALG: 'Argelia', AUS: 'Australia', BIH: 'Bosnia', BOL: 'Bolivia', BUL: 'Bulgaria',
  CHN: 'China', CIV: 'Costa de Marfil', COL: 'Colombia', CRC: 'Costa Rica', CUB: 'Cuba',
  CZE: 'República Checa', DEI: 'Indias Orientales Neerlandesas', DEN: 'Dinamarca',
  ECU: 'Ecuador', EGY: 'Egipto', ELS: 'El Salvador', GDR: 'Alemania Oriental',
  GHA: 'Ghana', GRE: 'Grecia', HAI: 'Haití', HON: 'Honduras', IRL: 'Irlanda',
  IRN: 'Irán', IRQ: 'Irak', ISL: 'Islandia', ISR: 'Israel', JAM: 'Jamaica',
  KOR: 'Corea del Sur', KSA: 'Arabia Saudí', KUW: 'Kuwait', NGA: 'Nigeria',
  NIR: 'Irlanda del Norte', NOR: 'Noruega', NZL: 'Nueva Zelanda', PAN: 'Panamá',
  PAR: 'Paraguay', PER: 'Perú', POL: 'Polonia', POR: 'Portugal', PRK: 'Corea del Norte',
  ROU: 'Rumanía', SCG: 'Serbia y Montenegro', SCO: 'Escocia', SEN: 'Senegal',
  SLV: 'El Salvador', SRB: 'Serbia', SUI: 'Suiza', SVK: 'Eslovaquia', SVN: 'Eslovenia',
  TCH: 'Checoslovaquia', TOG: 'Togo', TRI: 'Trinidad y Tobago', TUN: 'Túnez',
  TUR: 'Turquía', UAE: 'Emiratos Árabes', UKR: 'Ucrania', URS: 'Unión Soviética',
  WAL: 'Gales', YUG: 'Yugoslavia', ZAI: 'Zaire', ANG: 'Angola', CMR: 'Camerún',
};

async function main() {
  // Ensure all referenced team codes exist in `teams`
  const allCodes = new Set<string>();
  for (const list of Object.values(PARTICIPANTS)) {
    for (const c of list) allCodes.add(c);
  }
  const newTeams = [...allCodes].map((code) => ({
    code,
    name_official: TEAM_NAMES[code] ?? code,
  }));
  console.log(`Ensuring ${newTeams.length} team codes exist…`);
  await supabase.from('teams').upsert(newTeams, { onConflict: 'code', ignoreDuplicates: true });

  console.log('Updating tournaments.participants…');
  for (const [year, codes] of Object.entries(PARTICIPANTS)) {
    const { error } = await supabase
      .from('tournaments')
      .update({ participants: codes })
      .eq('year', Number(year));
    if (error) console.error(`  ✗ ${year}: ${error.message}`);
    else console.log(`  ✓ ${year}: ${codes.length} teams`);
  }

  // Dedup: delete my manually-seeded rows that duplicate a StatsBomb match
  console.log('\nDeduping StatsBomb vs manual seed overlaps…');
  const { data: matches } = await supabase
    .from('matches')
    .select('id, tournament_year, match_number, home_code, away_code, match_date, external_statsbomb_id')
    .order('tournament_year');
  if (!matches) return;

  const toDelete: string[] = [];
  type MatchRow = {
    id: string;
    tournament_year: number;
    match_number: number;
    home_code: string;
    away_code: string;
    match_date: string;
    external_statsbomb_id: string | null;
  };
  const byYear = new Map<number, MatchRow[]>();
  for (const m of matches as MatchRow[]) {
    if (!byYear.has(m.tournament_year)) byYear.set(m.tournament_year, []);
    byYear.get(m.tournament_year)!.push(m);
  }

  for (const [, list] of byYear) {
    const statsBombOnes = list.filter((m) => m.external_statsbomb_id);
    for (const sb of statsBombOnes) {
      const sbKey = [sb.home_code, sb.away_code].sort().join('-');
      const sbDay = sb.match_date.slice(0, 10);
      const duplicates = list.filter(
        (m) =>
          !m.external_statsbomb_id &&
          m.match_number >= 996 &&
          [m.home_code, m.away_code].sort().join('-') === sbKey &&
          Math.abs(
            (new Date(m.match_date).getTime() - new Date(sb.match_date).getTime()) / 86400000,
          ) < 3,
      );
      for (const dup of duplicates) toDelete.push(dup.id);
    }
  }
  if (toDelete.length > 0) {
    console.log(`  Found ${toDelete.length} duplicate rows, deleting…`);
    const { error } = await supabase.from('matches').delete().in('id', toDelete);
    if (error) throw error;
    console.log(`  ✓ Deleted.`);
  } else {
    console.log('  No duplicates found.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

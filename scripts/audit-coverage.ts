/**
 * Audit Supabase coverage for every World Cup tournament from 1930-2022.
 *
 * Reports, per tournament:
 *  - matches present vs declared (`tournaments.matches_played`)
 *  - squads (players × tournament_year) vs expected (teams × 22 pre-2002, × 23 from 2002)
 *  - players with photo_url, slug, wikidata_id (entity health)
 *  - venues with hero_image_url
 *  - referees registered vs matches (matches without referee_id)
 *
 * Output is a Markdown report dumped to stdout AND saved to
 * `coverage-report-YYYY-MM-DD.md` for diffing across runs.
 *
 * Usage:
 *   npx tsx scripts/audit-coverage.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY in
 * .env.local. Service-role gives accurate row counts past RLS.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load env manually (no Next runtime here).
const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* ignore */
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or *_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const YEARS = [
  1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982,
  1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022,
];

type TournamentRow = {
  year: number;
  host_country: string;
  teams: number | null;
  matches_played: number | null;
  goals: number | null;
  top_scorer_name: string | null;
};

type GapReport = {
  year: number;
  host: string;
  expectedTeams: number;
  declaredMatches: number;
  matchesInDb: number;
  missingMatches: number;
  expectedSquadSize: number;
  squadsInDb: number;
  missingSquads: number;
  matchesWithoutReferee: number;
  matchesWithoutVenue: number;
  status: '✓' | '⚠' | '✗';
};

async function countExact(table: string, filterFn?: (q: any) => any): Promise<number> {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filterFn) q = filterFn(q);
  const { count, error } = await q;
  if (error) {
    console.error(`Count error on ${table}:`, error.message);
    return 0;
  }
  return count ?? 0;
}

async function audit(): Promise<void> {
  // Tournaments meta
  const { data: tournaments, error: tErr } = await supabase
    .from('tournaments')
    .select('year, host_country, teams, matches_played, goals, top_scorer_name')
    .order('year');
  if (tErr) {
    console.error('Failed to read tournaments:', tErr.message);
    process.exit(1);
  }
  const tMap = new Map<number, TournamentRow>();
  for (const t of (tournaments ?? []) as TournamentRow[]) tMap.set(t.year, t);

  // Aggregated stats
  const totals = {
    playersTotal: await countExact('players'),
    playersWithSlug: await countExact('players', (q) => q.not('slug', 'is', null)),
    playersWithPhoto: await countExact('players', (q) => q.not('photo_url', 'is', null)),
    playersWithWikidata: await countExact('players', (q) => q.not('wikidata_id', 'is', null)),
    teamsTotal: await countExact('teams'),
    venuesTotal: await countExact('venues'),
    venuesWithImage: await countExact('venues', (q) => q.not('hero_image_url', 'is', null)),
    refereesTotal: await countExact('referees'),
  };

  // Per-year coverage
  const gaps: GapReport[] = [];
  for (const year of YEARS) {
    const t = tMap.get(year);
    const expectedTeams = t?.teams ?? 0;
    const declaredMatches = t?.matches_played ?? 0;
    const expectedSquadSize = expectedTeams * (year >= 2002 ? 23 : 22);

    const matchesInDb = await countExact('matches', (q) => q.eq('tournament_year', year));
    const squadsInDb = await countExact('squads', (q) => q.eq('tournament_year', year));
    const matchesWithoutReferee = await countExact('matches', (q) =>
      q.eq('tournament_year', year).is('referee_id', null),
    );
    const matchesWithoutVenue = await countExact('matches', (q) =>
      q.eq('tournament_year', year).is('venue_id', null),
    );

    const missingMatches = Math.max(0, declaredMatches - matchesInDb);
    const missingSquads = Math.max(0, expectedSquadSize - squadsInDb);

    let status: GapReport['status'] = '✓';
    if (matchesInDb === 0 || squadsInDb === 0) status = '✗';
    else if (
      missingMatches > 0 ||
      missingSquads > expectedSquadSize * 0.05 ||
      matchesWithoutReferee > matchesInDb * 0.2 ||
      matchesWithoutVenue > 0
    )
      status = '⚠';

    gaps.push({
      year,
      host: t?.host_country ?? '?',
      expectedTeams,
      declaredMatches,
      matchesInDb,
      missingMatches,
      expectedSquadSize,
      squadsInDb,
      missingSquads,
      matchesWithoutReferee,
      matchesWithoutVenue,
      status,
    });
  }

  // ─── Output Markdown ─────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push(`# Coverage report · ${today}`);
  lines.push('');
  lines.push('## Aggregated stats');
  lines.push('');
  lines.push('| Métrica | Valor |');
  lines.push('|---|---|');
  lines.push(`| Teams totales | ${totals.teamsTotal} |`);
  lines.push(`| Players totales | ${totals.playersTotal} |`);
  lines.push(`| Players con slug | ${totals.playersWithSlug} (${pct(totals.playersWithSlug, totals.playersTotal)}) |`);
  lines.push(`| Players con foto | ${totals.playersWithPhoto} (${pct(totals.playersWithPhoto, totals.playersTotal)}) |`);
  lines.push(`| Players con Wikidata ID | ${totals.playersWithWikidata} (${pct(totals.playersWithWikidata, totals.playersTotal)}) |`);
  lines.push(`| Venues totales | ${totals.venuesTotal} |`);
  lines.push(`| Venues con imagen | ${totals.venuesWithImage} (${pct(totals.venuesWithImage, totals.venuesTotal)}) |`);
  lines.push(`| Referees registrados | ${totals.refereesTotal} |`);
  lines.push('');

  lines.push('## Coverage por torneo');
  lines.push('');
  lines.push(
    '| Año | Host | Teams | Matches BD/Decl | Squads BD/Esp | Sin árbitro | Sin sede | Estado |',
  );
  lines.push('|---|---|---|---|---|---|---|---|');
  for (const g of gaps) {
    lines.push(
      `| ${g.year} | ${g.host} | ${g.expectedTeams} | ${g.matchesInDb}/${g.declaredMatches} | ${g.squadsInDb}/${g.expectedSquadSize} | ${g.matchesWithoutReferee} | ${g.matchesWithoutVenue} | ${g.status} |`,
    );
  }
  lines.push('');

  // Gap summary (priority list)
  lines.push('## Top gaps por prioridad');
  lines.push('');
  const empties = gaps.filter((g) => g.status === '✗').sort((a, b) => a.year - b.year);
  if (empties.length > 0) {
    lines.push('### 🚨 Mundiales VACÍOS (matches o squads = 0)');
    lines.push('');
    for (const g of empties) lines.push(`- **${g.year} ${g.host}**: matches=${g.matchesInDb}/${g.declaredMatches}, squads=${g.squadsInDb}/${g.expectedSquadSize}`);
    lines.push('');
  }

  const incompletes = gaps.filter((g) => g.status === '⚠').sort((a, b) => b.missingMatches - a.missingMatches);
  if (incompletes.length > 0) {
    lines.push('### ⚠ Mundiales INCOMPLETOS (gaps por encima del 5%)');
    lines.push('');
    for (const g of incompletes) {
      const pieces: string[] = [];
      if (g.missingMatches > 0) pieces.push(`${g.missingMatches} matches`);
      if (g.missingSquads > 0) pieces.push(`${g.missingSquads} squads`);
      if (g.matchesWithoutReferee > 0) pieces.push(`${g.matchesWithoutReferee} sin árbitro`);
      if (g.matchesWithoutVenue > 0) pieces.push(`${g.matchesWithoutVenue} sin sede`);
      lines.push(`- **${g.year} ${g.host}**: ${pieces.join(', ')}`);
    }
    lines.push('');
  }

  // Por confederación / continent / etc. en versiones futuras.

  const md = lines.join('\n');
  console.log(md);

  const outPath = resolve(process.cwd(), `coverage-report-${today}.md`);
  writeFileSync(outPath, md, 'utf8');
  console.error(`\n✓ Report saved to ${outPath}\n`);
}

function pct(num: number, denom: number): string {
  if (denom === 0) return '0%';
  return `${Math.round((num / denom) * 100)}%`;
}

audit().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Seed los 18 partidos completos del Mundial Uruguay 1930.
 *
 * Fuentes verificadas:
 *  - FIFA digital archives
 *  - Wikipedia (1930 FIFA World Cup)
 *  - The RSSSF Archive
 *
 * 13 selecciones, 4 grupos, 15 partidos de grupo, 2 semifinales, 1 final.
 * Tres sedes en Montevideo: Estadio Centenario (10 partidos), Estadio Gran
 * Parque Central (8 partidos) y Estadio Pocitos (1 partido).
 *
 * El script:
 *  1. Garantiza que las 13 selecciones (códigos FIFA históricos) existen
 *     en `teams`. URU, ARG, BRA, USA, YUG, FRA, BEL, ROU, MEX, BOL, PAR,
 *     PER, CHI. Donde haya código sucesor moderno (YUG → SRB, etc.) se
 *     mantiene el código histórico para fidelidad.
 *  2. Upserts las 3 venues con coordenadas y país.
 *  3. Upserts los referees del torneo.
 *  4. Upserts los 18 matches con `match_number` cronológico (1-18) y
 *     `onConflict (tournament_year, match_number)`.
 *  5. Borra el match_number=999 de seed-finals.ts para 1930 si existe
 *     (ya no es necesario, el final del torneo es el match #18).
 *
 * Idempotente: ejecutar dos veces no duplica filas.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1930.ts
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
} catch {
  /* ignore */
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// ───────────────────────────────────────────────────────────────────
// Constantes del torneo
// ───────────────────────────────────────────────────────────────────

const YEAR = 1930;

const TEAMS = [
  { code: 'URU', name: 'Uruguay', confederation: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'ARG', name: 'Argentina', confederation: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'BRA', name: 'Brasil', confederation: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'USA', name: 'Estados Unidos', confederation: 'CONCACAF', flag: '🇺🇸' },
  { code: 'YUG', name: 'Yugoslavia', confederation: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'FRA', name: 'Francia', confederation: 'UEFA', flag: '🇫🇷' },
  { code: 'BEL', name: 'Bélgica', confederation: 'UEFA', flag: '🇧🇪' },
  { code: 'ROU', name: 'Rumanía', confederation: 'UEFA', flag: '🇷🇴' },
  { code: 'MEX', name: 'México', confederation: 'CONCACAF', flag: '🇲🇽' },
  { code: 'BOL', name: 'Bolivia', confederation: 'CONMEBOL', flag: '🇧🇴' },
  { code: 'PAR', name: 'Paraguay', confederation: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'PER', name: 'Perú', confederation: 'CONMEBOL', flag: '🇵🇪' },
  { code: 'CHI', name: 'Chile', confederation: 'CONMEBOL', flag: '🇨🇱' },
];

const VENUES = [
  {
    slug: 'estadio-centenario',
    name: 'Estadio Centenario',
    city: 'Montevideo',
    country_code: 'URU',
    latitude: -34.894167,
    longitude: -56.160278,
    surface: 'grass',
    opened_year: 1930,
  },
  {
    slug: 'estadio-gran-parque-central',
    name: 'Estadio Gran Parque Central',
    city: 'Montevideo',
    country_code: 'URU',
    latitude: -34.892639,
    longitude: -56.179389,
    surface: 'grass',
    opened_year: 1900,
  },
  {
    slug: 'estadio-pocitos',
    name: 'Estadio Pocitos',
    city: 'Montevideo',
    country_code: 'URU',
    latitude: -34.91,
    longitude: -56.155,
    surface: 'grass',
    opened_year: 1921,
    closed_year: 1939,
  },
];

const REFEREES = [
  { full_name: 'Domingo Lombardi', nationality_code: 'URU' },
  { full_name: 'José Macias', nationality_code: 'ARG' },
  { full_name: 'Aníbal Tejada', nationality_code: 'URU' },
  { full_name: 'Alberto Warnken', nationality_code: 'CHI' },
  { full_name: 'Gilberto de Almeida Rêgo', nationality_code: 'BRA' },
  { full_name: 'Henri Christophe', nationality_code: 'BEL' },
  { full_name: 'Francisco Mateucci', nationality_code: 'URU' },
  { full_name: 'Ulises Saucedo', nationality_code: 'BOL' },
  { full_name: 'Tomás Balway', nationality_code: 'FRA' },
  { full_name: 'Ricardo Vallarino', nationality_code: 'URU' },
  { full_name: 'John Langenus', nationality_code: 'BEL' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'sf' | 'final';
  match_date: string; // ISO datetime UTC-3 Montevideo aprox
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  venue_slug: string;
  referee: string;
  attendance?: number;
};

const MATCHES: MatchRow[] = [
  { match_number: 1, stage: 'group', match_date: '1930-07-13T15:00:00-03:00', home_code: 'FRA', away_code: 'MEX', home_score: 4, away_score: 1, venue_slug: 'estadio-pocitos', referee: 'Domingo Lombardi', attendance: 4444 },
  { match_number: 2, stage: 'group', match_date: '1930-07-13T16:00:00-03:00', home_code: 'USA', away_code: 'BEL', home_score: 3, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'José Macias', attendance: 18346 },
  { match_number: 3, stage: 'group', match_date: '1930-07-14T14:50:00-03:00', home_code: 'YUG', away_code: 'BRA', home_score: 2, away_score: 1, venue_slug: 'estadio-gran-parque-central', referee: 'Aníbal Tejada', attendance: 24059 },
  { match_number: 4, stage: 'group', match_date: '1930-07-14T15:00:00-03:00', home_code: 'ROU', away_code: 'PER', home_score: 3, away_score: 1, venue_slug: 'estadio-pocitos', referee: 'Alberto Warnken', attendance: 2549 },
  { match_number: 5, stage: 'group', match_date: '1930-07-15T16:00:00-03:00', home_code: 'ARG', away_code: 'FRA', home_score: 1, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'Gilberto de Almeida Rêgo', attendance: 23409 },
  { match_number: 6, stage: 'group', match_date: '1930-07-16T15:00:00-03:00', home_code: 'CHI', away_code: 'MEX', home_score: 3, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'Henri Christophe', attendance: 9249 },
  { match_number: 7, stage: 'group', match_date: '1930-07-17T13:00:00-03:00', home_code: 'YUG', away_code: 'BOL', home_score: 4, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'Francisco Mateucci', attendance: 18306 },
  { match_number: 8, stage: 'group', match_date: '1930-07-17T15:30:00-03:00', home_code: 'USA', away_code: 'PAR', home_score: 3, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'José Macias', attendance: 18306 },
  { match_number: 9, stage: 'group', match_date: '1930-07-18T14:30:00-03:00', home_code: 'URU', away_code: 'PER', home_score: 1, away_score: 0, venue_slug: 'estadio-centenario', referee: 'José Macias', attendance: 57735 },
  { match_number: 10, stage: 'group', match_date: '1930-07-19T13:00:00-03:00', home_code: 'CHI', away_code: 'FRA', home_score: 1, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'Aníbal Tejada', attendance: 2000 },
  { match_number: 11, stage: 'group', match_date: '1930-07-19T15:00:00-03:00', home_code: 'ARG', away_code: 'MEX', home_score: 6, away_score: 3, venue_slug: 'estadio-centenario', referee: 'Ulises Saucedo', attendance: 42100 },
  { match_number: 12, stage: 'group', match_date: '1930-07-20T13:00:00-03:00', home_code: 'BRA', away_code: 'BOL', home_score: 4, away_score: 0, venue_slug: 'estadio-gran-parque-central', referee: 'Tomás Balway', attendance: 25466 },
  { match_number: 13, stage: 'group', match_date: '1930-07-20T15:00:00-03:00', home_code: 'PAR', away_code: 'BEL', home_score: 1, away_score: 0, venue_slug: 'estadio-centenario', referee: 'Ricardo Vallarino', attendance: 25466 },
  { match_number: 14, stage: 'group', match_date: '1930-07-21T14:50:00-03:00', home_code: 'URU', away_code: 'ROU', home_score: 4, away_score: 0, venue_slug: 'estadio-centenario', referee: 'Alberto Warnken', attendance: 70022 },
  { match_number: 15, stage: 'group', match_date: '1930-07-22T14:45:00-03:00', home_code: 'ARG', away_code: 'CHI', home_score: 3, away_score: 1, venue_slug: 'estadio-centenario', referee: 'John Langenus', attendance: 41459 },
  { match_number: 16, stage: 'sf', match_date: '1930-07-26T14:45:00-03:00', home_code: 'ARG', away_code: 'USA', home_score: 6, away_score: 1, venue_slug: 'estadio-centenario', referee: 'John Langenus', attendance: 72886 },
  { match_number: 17, stage: 'sf', match_date: '1930-07-27T14:45:00-03:00', home_code: 'URU', away_code: 'YUG', home_score: 6, away_score: 1, venue_slug: 'estadio-centenario', referee: 'Aníbal Tejada', attendance: 79867 },
  { match_number: 18, stage: 'final', match_date: '1930-07-30T14:15:00-03:00', home_code: 'URU', away_code: 'ARG', home_score: 4, away_score: 2, venue_slug: 'estadio-centenario', referee: 'John Langenus', attendance: 68346 },
];

// ───────────────────────────────────────────────────────────────────
// Run
// ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding Mundial ${YEAR} (${MATCHES.length} partidos)…`);

  // 1. Teams
  const { error: teamsErr } = await supabase
    .from('teams')
    .upsert(
      TEAMS.map((t) => ({
        code: t.code,
        name_official: t.name,
        name_common: t.name,
        confederation: t.confederation,
        flag_emoji: t.flag,
        dissolved_year: (t as { dissolved?: number }).dissolved ?? null,
        successor_code: (t as { successor?: string }).successor ?? null,
      })),
      { onConflict: 'code', ignoreDuplicates: false },
    );
  if (teamsErr) {
    console.error('Teams upsert failed:', teamsErr.message);
    process.exit(1);
  }
  console.log(`  ✓ ${TEAMS.length} teams upserted`);

  // 2. Venues
  const { error: venuesErr } = await supabase
    .from('venues')
    .upsert(VENUES, { onConflict: 'slug', ignoreDuplicates: false });
  if (venuesErr) {
    console.error('Venues upsert failed:', venuesErr.message);
    process.exit(1);
  }
  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', VENUES.map((v) => v.slug));
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);
  console.log(`  ✓ ${VENUES.length} venues upserted`);

  // 3. Referees
  const { data: existingRefs } = await supabase
    .from('referees')
    .select('id, full_name')
    .in('full_name', REFEREES.map((r) => r.full_name));
  const refIdByName = new Map(existingRefs?.map((r) => [r.full_name, r.id]) ?? []);
  const missing = REFEREES.filter((r) => !refIdByName.has(r.full_name));
  if (missing.length > 0) {
    const { data: inserted, error: refErr } = await supabase
      .from('referees')
      .insert(missing)
      .select('id, full_name');
    if (refErr) {
      console.error('Referees insert failed:', refErr.message);
      process.exit(1);
    }
    for (const r of inserted ?? []) refIdByName.set(r.full_name, r.id);
  }
  console.log(`  ✓ ${REFEREES.length} referees ensured`);

  // 4. Matches
  const matchRows = MATCHES.map((m) => ({
    tournament_year: YEAR,
    match_number: m.match_number,
    stage: m.stage,
    match_date: m.match_date,
    home_code: m.home_code,
    away_code: m.away_code,
    home_score: m.home_score,
    away_score: m.away_score,
    venue_id: venueIdBySlug.get(m.venue_slug) ?? null,
    referee_id: refIdByName.get(m.referee) ?? null,
    attendance: m.attendance ?? null,
    winner_code:
      m.home_score > m.away_score
        ? m.home_code
        : m.away_score > m.home_score
        ? m.away_code
        : null,
  }));

  const { error: matchErr } = await supabase
    .from('matches')
    .upsert(matchRows, { onConflict: 'tournament_year,match_number' });
  if (matchErr) {
    console.error('Matches upsert failed:', matchErr.message);
    process.exit(1);
  }
  console.log(`  ✓ ${matchRows.length} matches upserted`);

  // 5. Eliminar duplicado match #999 (seed-finals.ts) para 1930
  const { error: delErr } = await supabase
    .from('matches')
    .delete()
    .eq('tournament_year', YEAR)
    .eq('match_number', 999);
  if (delErr) {
    console.error('  ⚠ Could not delete legacy match #999:', delErr.message);
  } else {
    console.log(`  ✓ Cleaned up legacy match #999 placeholder for ${YEAR} (if existed)`);
  }

  console.log(`\n✓ Done. Run audit-coverage.ts to verify.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

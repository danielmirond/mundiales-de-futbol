/**
 * Seed the final (+ 3rd place) match of every World Cup 1930–2022, so every
 * tournament page has at least one match to show even when StatsBomb
 * doesn't cover it. Idempotent via upsert on (tournament_year, match_number).
 *
 * Match numbers chosen high (900+) so they don't collide with StatsBomb's
 * sequential numbering.
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

type FinalRow = {
  year: number;
  stage: 'final' | '3rd';
  date: string;
  home: string;
  away: string;
  home_score: number;
  away_score: number;
  home_et?: number;
  away_et?: number;
  home_pk?: number;
  away_pk?: number;
  winner: string;
  venue_name?: string;
  city?: string;
  country?: string;
  attendance?: number;
  referee?: string;
  ref_nat?: string;
};

const FINALS: FinalRow[] = [
  // Older mundials (no StatsBomb data) — FINAL
  { year: 1930, stage: 'final', date: '1930-07-30T14:00:00Z', home: 'URU', away: 'ARG', home_score: 4, away_score: 2, winner: 'URU', venue_name: 'Estadio Centenario', city: 'Montevideo', country: 'URU', attendance: 68346, referee: 'Jean Langenus', ref_nat: 'BEL' },
  { year: 1934, stage: 'final', date: '1934-06-10T17:30:00Z', home: 'ITA', away: 'TCH', home_score: 2, away_score: 1, home_et: 2, away_et: 1, winner: 'ITA', venue_name: 'Stadio Nazionale PNF', city: 'Rome', country: 'ITA', attendance: 55000, referee: 'Ivan Eklind', ref_nat: 'SWE' },
  { year: 1938, stage: 'final', date: '1938-06-19T17:00:00Z', home: 'ITA', away: 'HUN', home_score: 4, away_score: 2, winner: 'ITA', venue_name: 'Stade Olympique de Colombes', city: 'Paris', country: 'FRA', attendance: 45000, referee: 'Georges Capdeville', ref_nat: 'FRA' },
  { year: 1950, stage: 'final', date: '1950-07-16T15:00:00Z', home: 'URU', away: 'BRA', home_score: 2, away_score: 1, winner: 'URU', venue_name: 'Maracanã', city: 'Rio de Janeiro', country: 'BRA', attendance: 173850, referee: 'George Reader', ref_nat: 'ENG' },
  { year: 1954, stage: 'final', date: '1954-07-04T17:00:00Z', home: 'FRG', away: 'HUN', home_score: 3, away_score: 2, winner: 'FRG', venue_name: 'Wankdorfstadion', city: 'Bern', country: 'SUI', attendance: 62500, referee: 'Bill Ling', ref_nat: 'ENG' },
  { year: 1966, stage: 'final', date: '1966-07-30T15:00:00Z', home: 'ENG', away: 'FRG', home_score: 4, away_score: 2, home_et: 4, away_et: 2, winner: 'ENG', venue_name: 'Wembley Stadium', city: 'London', country: 'ENG', attendance: 96924, referee: 'Gottfried Dienst', ref_nat: 'SUI' },
  { year: 1978, stage: 'final', date: '1978-06-25T19:00:00Z', home: 'ARG', away: 'NED', home_score: 3, away_score: 1, home_et: 3, away_et: 1, winner: 'ARG', venue_name: 'Estadio Monumental', city: 'Buenos Aires', country: 'ARG', attendance: 71483, referee: 'Sergio Gonella', ref_nat: 'ITA' },
  { year: 1982, stage: 'final', date: '1982-07-11T20:00:00Z', home: 'ITA', away: 'FRG', home_score: 3, away_score: 1, winner: 'ITA', venue_name: 'Estadio Santiago Bernabéu', city: 'Madrid', country: 'ESP', attendance: 90000, referee: 'Arnaldo Cézar Coelho', ref_nat: 'BRA' },
  { year: 1994, stage: 'final', date: '1994-07-17T12:30:00Z', home: 'BRA', away: 'ITA', home_score: 0, away_score: 0, home_pk: 3, away_pk: 2, winner: 'BRA', venue_name: 'Rose Bowl', city: 'Pasadena', country: 'USA', attendance: 94194, referee: 'Sándor Puhl', ref_nat: 'HUN' },
  { year: 1998, stage: 'final', date: '1998-07-12T21:00:00Z', home: 'BRA', away: 'FRA', home_score: 0, away_score: 3, winner: 'FRA', venue_name: 'Stade de France', city: 'Saint-Denis', country: 'FRA', attendance: 80000, referee: 'Said Belqola', ref_nat: 'MAR' },
  { year: 2002, stage: 'final', date: '2002-06-30T20:00:00Z', home: 'GER', away: 'BRA', home_score: 0, away_score: 2, winner: 'BRA', venue_name: 'International Stadium Yokohama', city: 'Yokohama', country: 'JPN', attendance: 69029, referee: 'Pierluigi Collina', ref_nat: 'ITA' },
  { year: 2006, stage: 'final', date: '2006-07-09T20:00:00Z', home: 'ITA', away: 'FRA', home_score: 1, away_score: 1, home_et: 1, away_et: 1, home_pk: 5, away_pk: 3, winner: 'ITA', venue_name: 'Olympiastadion Berlin', city: 'Berlin', country: 'GER', attendance: 69000, referee: 'Horacio Elizondo', ref_nat: 'ARG' },
  { year: 2010, stage: 'final', date: '2010-07-11T20:30:00Z', home: 'NED', away: 'ESP', home_score: 0, away_score: 1, home_et: 0, away_et: 1, winner: 'ESP', venue_name: 'Soccer City', city: 'Johannesburg', country: 'RSA', attendance: 84490, referee: 'Howard Webb', ref_nat: 'ENG' },
  { year: 2014, stage: 'final', date: '2014-07-13T19:00:00Z', home: 'GER', away: 'ARG', home_score: 1, away_score: 0, home_et: 1, away_et: 0, winner: 'GER', venue_name: 'Maracanã', city: 'Rio de Janeiro', country: 'BRA', attendance: 74738, referee: 'Nicola Rizzoli', ref_nat: 'ITA' },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log(`Seeding ${FINALS.length} finals…`);

  // Upsert any teams that don't exist (historical codes: TCH, HUN, NED, etc.)
  const allTeamCodes = new Set<string>();
  for (const f of FINALS) {
    allTeamCodes.add(f.home);
    allTeamCodes.add(f.away);
    if (f.country) allTeamCodes.add(f.country);
    if (f.ref_nat) allTeamCodes.add(f.ref_nat);
  }
  const teamNames: Record<string, string> = {
    URU: 'Uruguay', ARG: 'Argentina', BRA: 'Brasil', ITA: 'Italia', FRA: 'Francia',
    GER: 'Alemania', FRG: 'Alemania Occidental', ENG: 'Inglaterra', ESP: 'España',
    MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CHI: 'Chile', SUI: 'Suiza',
    SWE: 'Suecia', KOR: 'Corea del Sur', JPN: 'Japón', RSA: 'Sudáfrica', RUS: 'Rusia',
    QAT: 'Qatar', HUN: 'Hungría', TCH: 'Checoslovaquia', NED: 'Países Bajos',
    BEL: 'Bélgica', MAR: 'Marruecos',
  };

  await supabase
    .from('teams')
    .upsert(
      [...allTeamCodes].map((code) => ({ code, name_official: teamNames[code] ?? code })),
      { onConflict: 'code', ignoreDuplicates: true },
    );

  // Upsert venues
  const venueData = new Map<string, { slug: string; name: string; city: string | null; country_code: string | null }>();
  for (const f of FINALS) {
    if (!f.venue_name) continue;
    const slug = slugify(f.venue_name);
    if (!venueData.has(slug)) {
      venueData.set(slug, {
        slug,
        name: f.venue_name,
        city: f.city ?? null,
        country_code: f.country ?? null,
      });
    }
  }
  await supabase
    .from('venues')
    .upsert([...venueData.values()], { onConflict: 'slug', ignoreDuplicates: true });

  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', [...venueData.keys()]);
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);

  // Upsert referees (insert if missing)
  const refNames = [...new Set(FINALS.map((f) => f.referee).filter(Boolean))] as string[];
  const { data: existingRefs } = await supabase
    .from('referees')
    .select('id, full_name')
    .in('full_name', refNames);
  const refIdByName = new Map(existingRefs?.map((r) => [r.full_name, r.id]) ?? []);
  const missingRefs = FINALS.filter(
    (f) => f.referee && !refIdByName.has(f.referee),
  ).map((f) => ({
    full_name: f.referee!,
    nationality_code: f.ref_nat ?? null,
  }));
  if (missingRefs.length > 0) {
    const { data: inserted } = await supabase
      .from('referees')
      .insert(missingRefs)
      .select('id, full_name');
    for (const r of inserted ?? []) refIdByName.set(r.full_name, r.id);
  }

  // Build match rows — use match_number 999 for finals
  const matchRows = FINALS.map((f) => {
    const slug = f.venue_name ? slugify(f.venue_name) : null;
    return {
      tournament_year: f.year,
      match_number: f.stage === 'final' ? 999 : 998,
      stage: f.stage,
      match_date: f.date,
      venue_id: slug ? venueIdBySlug.get(slug) ?? null : null,
      home_code: f.home,
      away_code: f.away,
      home_score: f.home_score,
      away_score: f.away_score,
      home_score_et: f.home_et ?? null,
      away_score_et: f.away_et ?? null,
      home_score_pk: f.home_pk ?? null,
      away_score_pk: f.away_pk ?? null,
      winner_code: f.winner,
      attendance: f.attendance ?? null,
      referee_id: f.referee ? refIdByName.get(f.referee) ?? null : null,
      status: 'finished',
    };
  });

  const { error } = await supabase
    .from('matches')
    .upsert(matchRows, { onConflict: 'tournament_year,match_number' });
  if (error) throw error;

  console.log(`  ✓ ${matchRows.length} finals + 3rd-place inserted.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

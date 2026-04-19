/**
 * Seed semifinals + 3rd-place match for every World Cup that lacks
 * StatsBomb coverage. Uses match_numbers 996 (SF1), 997 (SF2) and 998
 * (3rd place), leaving 999 for the final (already seeded).
 *
 * Mundiales sin coverage StatsBomb: 1930, 1934, 1938, 1950, 1954, 1966,
 * 1978, 1982, 1994, 1998, 2002, 2006, 2010, 2014.
 *
 * Skipped where the format didn't have a conventional SF (1950 final
 * group-round, 1978 / 1982 final groups).
 *
 * Usage: npx tsx scripts/seed-historical-ko.ts
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

type MatchRow = {
  year: number;
  stage: 'sf' | '3rd';
  match_number: number; // 996, 997, 998
  date: string;
  home: string;
  away: string;
  home_score: number;
  away_score: number;
  home_et?: number;
  away_et?: number;
  home_pk?: number;
  away_pk?: number;
  winner: string | null;
  venue_name?: string;
  city?: string;
  country?: string;
  attendance?: number;
};

const MATCHES: MatchRow[] = [
  // 1930 — semifinals. No 3rd-place match (the two losers didn't play it).
  { year: 1930, stage: 'sf', match_number: 996, date: '1930-07-26T12:00:00Z', home: 'ARG', away: 'USA', home_score: 6, away_score: 1, winner: 'ARG', venue_name: 'Estadio Centenario', city: 'Montevideo', country: 'URU', attendance: 72886 },
  { year: 1930, stage: 'sf', match_number: 997, date: '1930-07-27T12:00:00Z', home: 'URU', away: 'YUG', home_score: 6, away_score: 1, winner: 'URU', venue_name: 'Estadio Centenario', city: 'Montevideo', country: 'URU', attendance: 72886 },

  // 1934
  { year: 1934, stage: 'sf', match_number: 996, date: '1934-06-03T16:30:00Z', home: 'TCH', away: 'GER', home_score: 3, away_score: 1, winner: 'TCH', venue_name: 'Stadio Nazionale PNF', city: 'Rome', country: 'ITA' },
  { year: 1934, stage: 'sf', match_number: 997, date: '1934-06-03T16:30:00Z', home: 'ITA', away: 'AUT', home_score: 1, away_score: 0, winner: 'ITA', venue_name: 'Stadio San Siro', city: 'Milan', country: 'ITA' },
  { year: 1934, stage: '3rd', match_number: 998, date: '1934-06-07T17:30:00Z', home: 'GER', away: 'AUT', home_score: 3, away_score: 2, winner: 'GER', venue_name: 'Stadio Giorgio Ascarelli', city: 'Naples', country: 'ITA' },

  // 1938
  { year: 1938, stage: 'sf', match_number: 996, date: '1938-06-16T17:00:00Z', home: 'ITA', away: 'BRA', home_score: 2, away_score: 1, winner: 'ITA', venue_name: 'Stade Vélodrome', city: 'Marseille', country: 'FRA' },
  { year: 1938, stage: 'sf', match_number: 997, date: '1938-06-16T17:00:00Z', home: 'HUN', away: 'SWE', home_score: 5, away_score: 1, winner: 'HUN', venue_name: 'Parc des Princes', city: 'Paris', country: 'FRA' },
  { year: 1938, stage: '3rd', match_number: 998, date: '1938-06-19T15:00:00Z', home: 'BRA', away: 'SWE', home_score: 4, away_score: 2, winner: 'BRA', venue_name: 'Parc Lescure', city: 'Bordeaux', country: 'FRA' },

  // 1954
  { year: 1954, stage: 'sf', match_number: 996, date: '1954-06-30T17:00:00Z', home: 'FRG', away: 'AUT', home_score: 6, away_score: 1, winner: 'FRG', venue_name: 'St. Jakob Stadium', city: 'Basel', country: 'SUI' },
  { year: 1954, stage: 'sf', match_number: 997, date: '1954-06-30T18:00:00Z', home: 'HUN', away: 'URU', home_score: 4, away_score: 2, home_et: 4, away_et: 2, winner: 'HUN', venue_name: 'Stade Olympique de la Pontaise', city: 'Lausanne', country: 'SUI' },
  { year: 1954, stage: '3rd', match_number: 998, date: '1954-07-03T17:00:00Z', home: 'AUT', away: 'URU', home_score: 3, away_score: 1, winner: 'AUT', venue_name: 'Hardturm', city: 'Zürich', country: 'SUI' },

  // 1966
  { year: 1966, stage: 'sf', match_number: 996, date: '1966-07-25T19:30:00Z', home: 'ENG', away: 'POR', home_score: 2, away_score: 1, winner: 'ENG', venue_name: 'Wembley Stadium', city: 'London', country: 'ENG' },
  { year: 1966, stage: 'sf', match_number: 997, date: '1966-07-25T19:30:00Z', home: 'FRG', away: 'URS', home_score: 2, away_score: 1, winner: 'FRG', venue_name: 'Goodison Park', city: 'Liverpool', country: 'ENG' },
  { year: 1966, stage: '3rd', match_number: 998, date: '1966-07-28T19:30:00Z', home: 'POR', away: 'URS', home_score: 2, away_score: 1, winner: 'POR', venue_name: 'Wembley Stadium', city: 'London', country: 'ENG' },

  // 1994
  { year: 1994, stage: 'sf', match_number: 996, date: '1994-07-13T16:00:00Z', home: 'BUL', away: 'ITA', home_score: 1, away_score: 2, winner: 'ITA', venue_name: 'Giants Stadium', city: 'East Rutherford', country: 'USA' },
  { year: 1994, stage: 'sf', match_number: 997, date: '1994-07-13T16:00:00Z', home: 'BRA', away: 'SWE', home_score: 1, away_score: 0, winner: 'BRA', venue_name: 'Rose Bowl', city: 'Pasadena', country: 'USA' },
  { year: 1994, stage: '3rd', match_number: 998, date: '1994-07-16T16:00:00Z', home: 'SWE', away: 'BUL', home_score: 4, away_score: 0, winner: 'SWE', venue_name: 'Rose Bowl', city: 'Pasadena', country: 'USA' },

  // 1998
  { year: 1998, stage: 'sf', match_number: 996, date: '1998-07-07T21:00:00Z', home: 'BRA', away: 'NED', home_score: 1, away_score: 1, home_et: 1, away_et: 1, home_pk: 4, away_pk: 2, winner: 'BRA', venue_name: 'Stade Vélodrome', city: 'Marseille', country: 'FRA' },
  { year: 1998, stage: 'sf', match_number: 997, date: '1998-07-08T21:00:00Z', home: 'FRA', away: 'CRO', home_score: 2, away_score: 1, winner: 'FRA', venue_name: 'Stade de France', city: 'Saint-Denis', country: 'FRA' },
  { year: 1998, stage: '3rd', match_number: 998, date: '1998-07-11T21:00:00Z', home: 'CRO', away: 'NED', home_score: 2, away_score: 1, winner: 'CRO', venue_name: 'Parc des Princes', city: 'Paris', country: 'FRA' },

  // 2002
  { year: 2002, stage: 'sf', match_number: 996, date: '2002-06-25T12:00:00Z', home: 'GER', away: 'KOR', home_score: 1, away_score: 0, winner: 'GER', venue_name: 'Seoul World Cup Stadium', city: 'Seoul', country: 'KOR' },
  { year: 2002, stage: 'sf', match_number: 997, date: '2002-06-26T12:00:00Z', home: 'BRA', away: 'TUR', home_score: 1, away_score: 0, winner: 'BRA', venue_name: 'Saitama Stadium', city: 'Saitama', country: 'JPN' },
  { year: 2002, stage: '3rd', match_number: 998, date: '2002-06-29T12:00:00Z', home: 'TUR', away: 'KOR', home_score: 3, away_score: 2, winner: 'TUR', venue_name: 'Daegu World Cup Stadium', city: 'Daegu', country: 'KOR' },

  // 2006
  { year: 2006, stage: 'sf', match_number: 996, date: '2006-07-04T20:00:00Z', home: 'GER', away: 'ITA', home_score: 0, away_score: 2, home_et: 0, away_et: 2, winner: 'ITA', venue_name: 'Signal Iduna Park', city: 'Dortmund', country: 'GER' },
  { year: 2006, stage: 'sf', match_number: 997, date: '2006-07-05T20:00:00Z', home: 'POR', away: 'FRA', home_score: 0, away_score: 1, winner: 'FRA', venue_name: 'Allianz Arena', city: 'Munich', country: 'GER' },
  { year: 2006, stage: '3rd', match_number: 998, date: '2006-07-08T20:00:00Z', home: 'GER', away: 'POR', home_score: 3, away_score: 1, winner: 'GER', venue_name: 'Mercedes-Benz Arena', city: 'Stuttgart', country: 'GER' },

  // 2010
  { year: 2010, stage: 'sf', match_number: 996, date: '2010-07-06T20:30:00Z', home: 'URU', away: 'NED', home_score: 2, away_score: 3, winner: 'NED', venue_name: 'Cape Town Stadium', city: 'Cape Town', country: 'RSA' },
  { year: 2010, stage: 'sf', match_number: 997, date: '2010-07-07T20:30:00Z', home: 'GER', away: 'ESP', home_score: 0, away_score: 1, winner: 'ESP', venue_name: 'Moses Mabhida Stadium', city: 'Durban', country: 'RSA' },
  { year: 2010, stage: '3rd', match_number: 998, date: '2010-07-10T20:30:00Z', home: 'URU', away: 'GER', home_score: 2, away_score: 3, winner: 'GER', venue_name: 'Nelson Mandela Bay Stadium', city: 'Port Elizabeth', country: 'RSA' },

  // 2014 — Mineirazo + the other SF
  { year: 2014, stage: 'sf', match_number: 996, date: '2014-07-08T17:00:00Z', home: 'BRA', away: 'GER', home_score: 1, away_score: 7, winner: 'GER', venue_name: 'Estádio Mineirão', city: 'Belo Horizonte', country: 'BRA', attendance: 58141 },
  { year: 2014, stage: 'sf', match_number: 997, date: '2014-07-09T17:00:00Z', home: 'NED', away: 'ARG', home_score: 0, away_score: 0, home_et: 0, away_et: 0, home_pk: 2, away_pk: 4, winner: 'ARG', venue_name: 'Arena de São Paulo', city: 'São Paulo', country: 'BRA' },
  { year: 2014, stage: '3rd', match_number: 998, date: '2014-07-12T17:00:00Z', home: 'BRA', away: 'NED', home_score: 0, away_score: 3, winner: 'NED', venue_name: 'Estádio Nacional', city: 'Brasília', country: 'BRA' },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const TEAM_NAMES: Record<string, string> = {
  URU: 'Uruguay', ARG: 'Argentina', BRA: 'Brasil', ITA: 'Italia', FRA: 'Francia',
  GER: 'Alemania', FRG: 'Alemania Occidental', ENG: 'Inglaterra', ESP: 'España',
  MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CHI: 'Chile', SUI: 'Suiza',
  SWE: 'Suecia', KOR: 'Corea del Sur', JPN: 'Japón', RSA: 'Sudáfrica', RUS: 'Rusia',
  QAT: 'Qatar', HUN: 'Hungría', TCH: 'Checoslovaquia', NED: 'Países Bajos',
  BEL: 'Bélgica', MAR: 'Marruecos', POR: 'Portugal', URS: 'Unión Soviética',
  YUG: 'Yugoslavia', AUT: 'Austria', BUL: 'Bulgaria', TUR: 'Turquía',
  POL: 'Polonia', CRO: 'Croacia',
};

async function main() {
  console.log(`Seeding ${MATCHES.length} historical knockout matches…`);

  // Ensure all team codes exist
  const codes = new Set<string>();
  for (const m of MATCHES) {
    codes.add(m.home);
    codes.add(m.away);
    if (m.country) codes.add(m.country);
  }
  await supabase
    .from('teams')
    .upsert(
      [...codes].map((c) => ({ code: c, name_official: TEAM_NAMES[c] ?? c })),
      { onConflict: 'code', ignoreDuplicates: true },
    );

  // Venues
  const venueMap = new Map<string, { slug: string; name: string; city: string | null; country_code: string | null }>();
  for (const m of MATCHES) {
    if (!m.venue_name) continue;
    const slug = slugify(m.venue_name);
    if (!venueMap.has(slug)) {
      venueMap.set(slug, {
        slug,
        name: m.venue_name,
        city: m.city ?? null,
        country_code: m.country ?? null,
      });
    }
  }
  await supabase
    .from('venues')
    .upsert([...venueMap.values()], { onConflict: 'slug', ignoreDuplicates: true });

  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', [...venueMap.keys()]);
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);

  // Build match rows
  const rows = MATCHES.map((m) => ({
    tournament_year: m.year,
    match_number: m.match_number,
    stage: m.stage,
    match_date: m.date,
    venue_id: m.venue_name ? venueIdBySlug.get(slugify(m.venue_name)) ?? null : null,
    home_code: m.home,
    away_code: m.away,
    home_score: m.home_score,
    away_score: m.away_score,
    home_score_et: m.home_et ?? null,
    away_score_et: m.away_et ?? null,
    home_score_pk: m.home_pk ?? null,
    away_score_pk: m.away_pk ?? null,
    winner_code: m.winner,
    attendance: m.attendance ?? null,
    status: 'finished',
  }));

  const { error } = await supabase
    .from('matches')
    .upsert(rows, { onConflict: 'tournament_year,match_number' });
  if (error) throw error;

  console.log(`  ✓ ${rows.length} KO matches inserted/updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

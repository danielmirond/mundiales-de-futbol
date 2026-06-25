/**
 * Seed los 26 partidos del Mundial Suiza 1954.
 *
 * Formato singular: 4 grupos de 4 con cabezas de serie pero solo
 * 4 partidos por grupo (no 6) — cabezas no jugaban entre sí. Total:
 * 16 partidos fase grupos + 2 playoffs de desempate (FRG-TUR, SUI-ITA)
 * + 4 cuartos + 2 semis + 1 tercer puesto + 1 final = 26.
 *
 * Mundial historico:
 *  - Hungria llegaba imbatida desde 1950 (Honved, Puskas, Kocsis,
 *    Hidegkuti, Zakarias) — la "Aranycsapat" (Equipo de Oro). Goleo
 *    a FRG 8-3 en grupos.
 *  - "Battle of Bern" cuartos HUN 4-2 BRA: 3 expulsiones + pelea en
 *    el tunel post-partido.
 *  - "Wunder von Bern" (Milagro de Berna) final FRG 3-2 HUN en
 *    Wankdorfstadion: Hungria iba 2-0 al min 8, FRG remontó. Gol del
 *    titulo Helmut Rahn al min 84. Es la base de la pelicula
 *    Das Wunder von Bern (2003), uno de los momentos fundacionales
 *    de la identidad nacional alemana post-WWII.
 *
 * Datos verificados con FIFA archives, Wikipedia (1954 FIFA World Cup),
 * thesoccerworldcups.com, The RSSSF Archive.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1954.ts
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

const YEAR = 1954;

const TEAMS = [
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'TUR', name: 'Turquía', conf: 'UEFA', flag: '🇹🇷' },
  { code: 'KOR', name: 'Corea del Sur', conf: 'AFC', flag: '🇰🇷' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
];

const VENUES = [
  { slug: 'wankdorfstadion', name: 'Wankdorfstadion', city: 'Berna', country_code: 'SUI', latitude: 46.9633, longitude: 7.4647, surface: 'grass', opened_year: 1925, closed_year: 2001 },
  { slug: 'st-jakob-stadion', name: 'St. Jakob Stadion', city: 'Basilea', country_code: 'SUI', latitude: 47.5419, longitude: 7.6204, surface: 'grass', opened_year: 1954, closed_year: 1998 },
  { slug: 'stade-olympique-lausanne', name: 'Stade Olympique de la Pontaise', city: 'Lausana', country_code: 'SUI', latitude: 46.5366, longitude: 6.6263, surface: 'grass', opened_year: 1904 },
  { slug: 'hardturm', name: 'Hardturm', city: 'Zúrich', country_code: 'SUI', latitude: 47.3953, longitude: 8.5078, surface: 'grass', opened_year: 1929, closed_year: 2007 },
  { slug: 'stade-des-charmilles', name: 'Stade des Charmilles', city: 'Ginebra', country_code: 'SUI', latitude: 46.2102, longitude: 6.1242, surface: 'grass', opened_year: 1930, closed_year: 2008 },
  { slug: 'stadio-cornaredo', name: 'Stadio Cornaredo', city: 'Lugano', country_code: 'SUI', latitude: 46.0234, longitude: 8.9576, surface: 'grass', opened_year: 1951 },
];

const REFEREES = [
  { full_name: 'William Ling', nationality_code: 'ENG' },
  { full_name: 'Charlie Faultless', nationality_code: 'SCO' },
  { full_name: 'Mervyn Griffiths', nationality_code: 'WAL' },
  { full_name: 'Arthur Ellis', nationality_code: 'ENG' },
  { full_name: 'Manuel Asensi', nationality_code: 'ESP' },
  { full_name: 'Ramon Vincenti Azon', nationality_code: 'ESP' },
  { full_name: 'Raymond Vincenti', nationality_code: 'FRA' },
  { full_name: 'Vasa Stefanović', nationality_code: 'YUG' },
  { full_name: 'Esteban Marino', nationality_code: 'URU' },
  { full_name: 'Vincenzo Orlandini', nationality_code: 'ITA' },
  { full_name: 'Carl Erich Steiner', nationality_code: 'AUT' },
  { full_name: 'Laurent Franken', nationality_code: 'BEL' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'playoff' | 'qf' | 'sf' | '3rd' | 'final';
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  home_et?: number;
  away_et?: number;
  venue_slug: string;
  referee: string;
  attendance?: number;
  notes?: string;
};

const MATCHES: MatchRow[] = [
  // ─── Grupo 1 (BRA, FRA, YUG, MEX) ────────────────────────
  { match_number: 1, stage: 'group', match_date: '1954-06-16T17:00:00+01:00', home_code: 'YUG', away_code: 'FRA', home_score: 1, away_score: 0, venue_slug: 'stade-olympique-lausanne', referee: 'Arthur Ellis', attendance: 16000 },
  { match_number: 2, stage: 'group', match_date: '1954-06-16T17:00:00+01:00', home_code: 'BRA', away_code: 'MEX', home_score: 5, away_score: 0, venue_slug: 'stade-des-charmilles', referee: 'Raymond Vincenti', attendance: 13470 },
  { match_number: 3, stage: 'group', match_date: '1954-06-19T17:00:00+01:00', home_code: 'FRA', away_code: 'MEX', home_score: 3, away_score: 2, venue_slug: 'stade-des-charmilles', referee: 'Manuel Asensi', attendance: 19000 },
  { match_number: 4, stage: 'group', match_date: '1954-06-19T18:00:00+01:00', home_code: 'BRA', away_code: 'YUG', home_score: 1, away_score: 1, home_et: 1, away_et: 1, venue_slug: 'stade-olympique-lausanne', referee: 'William Ling', attendance: 20500 },
  // ─── Grupo 2 (HUN, FRG, TUR, KOR) ────────────────────────
  { match_number: 5, stage: 'group', match_date: '1954-06-17T17:00:00+01:00', home_code: 'HUN', away_code: 'KOR', home_score: 9, away_score: 0, venue_slug: 'hardturm', referee: 'Raymond Vincenti', attendance: 13000 },
  { match_number: 6, stage: 'group', match_date: '1954-06-17T18:00:00+01:00', home_code: 'FRG', away_code: 'TUR', home_score: 4, away_score: 1, venue_slug: 'wankdorfstadion', referee: 'Vasa Stefanović', attendance: 28000 },
  { match_number: 7, stage: 'group', match_date: '1954-06-20T18:00:00+01:00', home_code: 'HUN', away_code: 'FRG', home_score: 8, away_score: 3, venue_slug: 'st-jakob-stadion', referee: 'William Ling', attendance: 56000, notes: 'Aplastante victoria de Hungria, pero Sepp Herberger (DT FRG) reservó deliberadamente 5 titulares pensando en cuartos. Ferenc Puskas se lesionó en este partido (entrada de Werner Liebrich) y jugó la final mermado' },
  { match_number: 8, stage: 'group', match_date: '1954-06-20T18:00:00+01:00', home_code: 'TUR', away_code: 'KOR', home_score: 7, away_score: 0, venue_slug: 'stade-des-charmilles', referee: 'Esteban Marino', attendance: 4000 },
  { match_number: 9, stage: 'playoff', match_date: '1954-06-23T18:00:00+01:00', home_code: 'FRG', away_code: 'TUR', home_score: 7, away_score: 2, venue_slug: 'hardturm', referee: 'Arthur Ellis', attendance: 17000, notes: 'Playoff desempate por segunda plaza grupo 2' },
  // ─── Grupo 3 (URU, AUT, TCH, SCO) ────────────────────────
  { match_number: 10, stage: 'group', match_date: '1954-06-16T18:00:00+01:00', home_code: 'AUT', away_code: 'SCO', home_score: 1, away_score: 0, venue_slug: 'hardturm', referee: 'Laurent Franken', attendance: 25000 },
  { match_number: 11, stage: 'group', match_date: '1954-06-16T18:00:00+01:00', home_code: 'URU', away_code: 'TCH', home_score: 2, away_score: 0, venue_slug: 'wankdorfstadion', referee: 'Vincenzo Orlandini', attendance: 20500 },
  { match_number: 12, stage: 'group', match_date: '1954-06-19T18:00:00+01:00', home_code: 'AUT', away_code: 'TCH', home_score: 5, away_score: 0, venue_slug: 'hardturm', referee: 'Vincenzo Orlandini', attendance: 26000 },
  { match_number: 13, stage: 'group', match_date: '1954-06-19T18:00:00+01:00', home_code: 'URU', away_code: 'SCO', home_score: 7, away_score: 0, venue_slug: 'st-jakob-stadion', referee: 'Esteban Marino', attendance: 36000 },
  // ─── Grupo 4 (ENG, ITA, SUI, BEL) ────────────────────────
  { match_number: 14, stage: 'group', match_date: '1954-06-17T18:00:00+01:00', home_code: 'ENG', away_code: 'BEL', home_score: 4, away_score: 4, home_et: 4, away_et: 4, venue_slug: 'st-jakob-stadion', referee: 'Emil Schmetzer', attendance: 14000 },
  { match_number: 15, stage: 'group', match_date: '1954-06-17T18:00:00+01:00', home_code: 'SUI', away_code: 'ITA', home_score: 2, away_score: 1, venue_slug: 'stade-olympique-lausanne', referee: 'Mario Vianna', attendance: 43000 },
  { match_number: 16, stage: 'group', match_date: '1954-06-20T18:00:00+01:00', home_code: 'ENG', away_code: 'SUI', home_score: 2, away_score: 0, venue_slug: 'wankdorfstadion', referee: 'Istvan Zsolt', attendance: 43500 },
  { match_number: 17, stage: 'group', match_date: '1954-06-20T18:00:00+01:00', home_code: 'ITA', away_code: 'BEL', home_score: 4, away_score: 1, venue_slug: 'stadio-cornaredo', referee: 'Carl Erich Steiner', attendance: 24000 },
  { match_number: 18, stage: 'playoff', match_date: '1954-06-23T18:00:00+01:00', home_code: 'SUI', away_code: 'ITA', home_score: 4, away_score: 1, venue_slug: 'st-jakob-stadion', referee: 'Mervyn Griffiths', attendance: 30000, notes: 'Playoff desempate por segunda plaza grupo 4. Suiza, anfitriona, pasa a cuartos' },
  // ─── Cuartos ──────────────────────────────────────────────
  { match_number: 19, stage: 'qf', match_date: '1954-06-26T17:00:00+01:00', home_code: 'FRG', away_code: 'YUG', home_score: 2, away_score: 0, venue_slug: 'stade-des-charmilles', referee: 'Istvan Zsolt', attendance: 17000 },
  { match_number: 20, stage: 'qf', match_date: '1954-06-26T17:00:00+01:00', home_code: 'HUN', away_code: 'BRA', home_score: 4, away_score: 2, venue_slug: 'wankdorfstadion', referee: 'Arthur Ellis', attendance: 40000, notes: 'La "Battle of Bern" - 3 expulsiones (Bozsik HUN, Nilton Santos BRA, Humberto Tozzi BRA) y pelea en el tunel post-partido con bofetadas entre Sebes, Puskas y los brasileños' },
  { match_number: 21, stage: 'qf', match_date: '1954-06-27T17:00:00+01:00', home_code: 'AUT', away_code: 'SUI', home_score: 7, away_score: 5, venue_slug: 'stade-olympique-lausanne', referee: 'Charlie Faultless', attendance: 31000, notes: 'Mayor goleo en un cuartos de final de la historia del Mundial (12 goles totales). Suiza iba 3-0 al 19, Austria empatò al 25 y siguió' },
  { match_number: 22, stage: 'qf', match_date: '1954-06-26T17:00:00+01:00', home_code: 'URU', away_code: 'ENG', home_score: 4, away_score: 2, venue_slug: 'st-jakob-stadion', referee: 'Karl Wyssling', attendance: 28000 },
  // ─── Semis ────────────────────────────────────────────────
  { match_number: 23, stage: 'sf', match_date: '1954-06-30T18:00:00+01:00', home_code: 'FRG', away_code: 'AUT', home_score: 6, away_score: 1, venue_slug: 'st-jakob-stadion', referee: 'Vincenzo Orlandini', attendance: 58000 },
  { match_number: 24, stage: 'sf', match_date: '1954-06-30T18:00:00+01:00', home_code: 'HUN', away_code: 'URU', home_score: 4, away_score: 2, home_et: 4, away_et: 2, venue_slug: 'stade-olympique-lausanne', referee: 'William Ling', attendance: 37000, notes: 'Primer Mundial donde Uruguay pierde. URU venia invicto en Mundiales 1930-1950 (final 1930, no jugó 1934 y 1938, final 1950). Doblete Kocsis en la prórroga' },
  // ─── 3er puesto ───────────────────────────────────────────
  { match_number: 25, stage: '3rd', match_date: '1954-07-03T18:00:00+01:00', home_code: 'AUT', away_code: 'URU', home_score: 3, away_score: 1, venue_slug: 'hardturm', referee: 'Raymond Vincenti', attendance: 33500 },
  // ─── FINAL ────────────────────────────────────────────────
  { match_number: 26, stage: 'final', match_date: '1954-07-04T17:00:00+01:00', home_code: 'FRG', away_code: 'HUN', home_score: 3, away_score: 2, venue_slug: 'wankdorfstadion', referee: 'William Ling', attendance: 62500, notes: 'El "Wunder von Bern" / Milagro de Berna. Hungria iba 2-0 al min 8 (Puskas 6, Czibor 8). FRG remonta: Morlock 10, Rahn 18, Rahn 84 (gol del titulo). Gol anulado a Puskas al 87 por fuera de juego, decisión disputada hasta hoy. Pelicula Das Wunder von Bern (2003) basada en este partido' },
];

async function main() {
  console.log(`Seeding Mundial ${YEAR} (${MATCHES.length} partidos)…`);

  await supabase.from('teams').upsert(
    TEAMS.map((t) => ({
      code: t.code,
      name_official: t.name,
      name_common: t.name,
      confederation: t.conf,
      flag_emoji: t.flag,
      dissolved_year: (t as { dissolved?: number }).dissolved ?? null,
      successor_code: (t as { successor?: string }).successor ?? null,
    })),
    { onConflict: 'code', ignoreDuplicates: false },
  );
  console.log(`  ✓ ${TEAMS.length} teams upserted`);

  await supabase.from('venues').upsert(VENUES, { onConflict: 'slug', ignoreDuplicates: false });
  const { data: venueRows } = await supabase
    .from('venues')
    .select('id, slug')
    .in('slug', VENUES.map((v) => v.slug));
  const venueIdBySlug = new Map(venueRows?.map((v) => [v.slug, v.id]) ?? []);
  console.log(`  ✓ ${VENUES.length} venues upserted`);

  const allRefs = new Set([...REFEREES.map((r) => r.full_name), ...MATCHES.map((m) => m.referee)]);
  const refList = [...allRefs].map((name) => {
    const known = REFEREES.find((r) => r.full_name === name);
    return known ?? { full_name: name, nationality_code: null };
  });
  const { data: existingRefs } = await supabase
    .from('referees')
    .select('id, full_name')
    .in('full_name', refList.map((r) => r.full_name));
  const refIdByName = new Map(existingRefs?.map((r) => [r.full_name, r.id]) ?? []);
  const missing = refList.filter((r) => !refIdByName.has(r.full_name));
  if (missing.length > 0) {
    const { data: inserted } = await supabase.from('referees').insert(missing).select('id, full_name');
    for (const r of inserted ?? []) refIdByName.set(r.full_name, r.id);
  }
  console.log(`  ✓ ${refList.length} referees ensured`);

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

  const { error } = await supabase
    .from('matches')
    .upsert(matchRows, { onConflict: 'tournament_year,match_number' });
  if (error) {
    console.error('Matches upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`  ✓ ${matchRows.length} matches upserted`);

  await supabase.from('matches').delete().eq('tournament_year', YEAR).eq('match_number', 999);
  console.log(`  ✓ Cleaned up legacy match #999 placeholder for ${YEAR}`);

  console.log(`\n✓ Done. Run audit-coverage.ts to verify.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

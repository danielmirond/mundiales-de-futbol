/**
 * Seed los 32 partidos del Mundial Chile 1962.
 *
 * 16 selecciones en 4 grupos de 4: 24 partidos fase de grupos +
 * 4 cuartos + 2 semis + 1 tercer puesto + 1 final = 32.
 *
 * Mundial historico:
 *  - "BATTLE OF SANTIAGO" (match #9, CHI 2-0 ITA, 2 jun): partido mas
 *    violento de la historia mundialista hasta entonces, 2 expulsiones
 *    + intervencion policial. Origen indirecto del sistema de tarjetas
 *    amarilla/roja que Ken Aston (arbitro) inventaria 4 anios despues
 *    (ver historia #23 ya publicada)
 *  - PELÉ SE LESIONA en el segundo partido de Brasil (vs Checoslovaquia,
 *    grupo) y no juega mas en el torneo. Brasil gana el Mundial sin el.
 *  - GARRINCHA EMERGE como figura del torneo. Doblete en cuartos
 *    (BRA 3-1 ENG) y doblete en semis (BRA 4-2 CHI). Bota de Oro
 *    compartida (4 goles).
 *  - Brasil BICAMPEON consecutivo. Primer bicampeon desde Italia 1934-38.
 *  - Chile TERCERO, su mejor resultado mundialista.
 *
 * Datos verificados con FIFA archives, Wikipedia (1962 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1962.ts
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

const YEAR = 1962;

const TEAMS = [
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'COL', name: 'Colombia', conf: 'CONMEBOL', flag: '🇨🇴' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
];

const VENUES = [
  { slug: 'estadio-nacional-chile', name: 'Estadio Nacional Julio Martínez Prádanos', city: 'Santiago', country_code: 'CHI', latitude: -33.4646, longitude: -70.6105, surface: 'grass', opened_year: 1938 },
  { slug: 'estadio-sausalito', name: 'Estadio Sausalito', city: 'Viña del Mar', country_code: 'CHI', latitude: -33.0162, longitude: -71.5499, surface: 'grass', opened_year: 1929 },
  { slug: 'estadio-el-teniente', name: 'Estadio El Teniente', city: 'Rancagua', country_code: 'CHI', latitude: -34.1729, longitude: -70.7402, surface: 'grass', opened_year: 1945 },
  { slug: 'estadio-carlos-dittborn', name: 'Estadio Carlos Dittborn', city: 'Arica', country_code: 'CHI', latitude: -18.4866, longitude: -70.3097, surface: 'grass', opened_year: 1962 },
];

const REFEREES = [
  { full_name: 'Ken Aston', nationality_code: 'ENG' },
  { full_name: 'Nikolai Latyshev', nationality_code: 'URS' },
  { full_name: 'Sergio Bustamante', nationality_code: 'CHI' },
  { full_name: 'Leo Horn', nationality_code: 'NED' },
  { full_name: 'Pierre Schwinte', nationality_code: 'FRA' },
  { full_name: 'Andrey Bayev', nationality_code: 'URS' },
  { full_name: 'Cesare Jonni', nationality_code: 'ITA' },
  { full_name: 'Bobby Davidson', nationality_code: 'SCO' },
  { full_name: 'John Etzel Filho', nationality_code: 'BRA' },
  { full_name: 'Branko Tesanic', nationality_code: 'YUG' },
  { full_name: 'Albert Dusch', nationality_code: 'FRG' },
  { full_name: 'Arturo Yamasaki', nationality_code: 'PER' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'qf' | 'sf' | '3rd' | 'final';
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  venue_slug: string;
  referee: string;
  attendance?: number;
  notes?: string;
};

const MATCHES: MatchRow[] = [
  // ── GROUP 1 (URS, YUG, URU, COL) ── Arica ────────────────
  { match_number: 1,  stage: 'group', match_date: '1962-05-30T15:00:00-04:00', home_code: 'URU', away_code: 'COL', home_score: 2, away_score: 1, venue_slug: 'estadio-carlos-dittborn', referee: 'Albert Dusch', attendance: 7908 },
  { match_number: 2,  stage: 'group', match_date: '1962-05-30T15:00:00-04:00', home_code: 'URS', away_code: 'YUG', home_score: 2, away_score: 0, venue_slug: 'estadio-carlos-dittborn', referee: 'John Etzel Filho', attendance: 15000 },
  { match_number: 3,  stage: 'group', match_date: '1962-06-02T15:00:00-04:00', home_code: 'YUG', away_code: 'URU', home_score: 3, away_score: 1, venue_slug: 'estadio-carlos-dittborn', referee: 'Andrey Bayev', attendance: 8800 },
  { match_number: 4,  stage: 'group', match_date: '1962-06-03T15:00:00-04:00', home_code: 'URS', away_code: 'COL', home_score: 4, away_score: 4, venue_slug: 'estadio-carlos-dittborn', referee: 'Branko Tesanic', attendance: 8000, notes: 'Marcos Coll marca el unico gol olimpico (de saque de esquina directo) en la historia del Mundial al min 68' },
  { match_number: 5,  stage: 'group', match_date: '1962-06-06T15:00:00-04:00', home_code: 'URS', away_code: 'URU', home_score: 2, away_score: 1, venue_slug: 'estadio-carlos-dittborn', referee: 'Cesare Jonni', attendance: 9973 },
  { match_number: 6,  stage: 'group', match_date: '1962-06-07T15:00:00-04:00', home_code: 'YUG', away_code: 'COL', home_score: 5, away_score: 0, venue_slug: 'estadio-carlos-dittborn', referee: 'Bobby Davidson', attendance: 7167 },
  // ── GROUP 2 (CHI, FRG, ITA, SUI) ── Santiago ──────────────
  { match_number: 7,  stage: 'group', match_date: '1962-05-30T15:00:00-04:00', home_code: 'CHI', away_code: 'SUI', home_score: 3, away_score: 1, venue_slug: 'estadio-nacional-chile', referee: 'Ken Aston', attendance: 65006 },
  { match_number: 8,  stage: 'group', match_date: '1962-05-31T15:00:00-04:00', home_code: 'FRG', away_code: 'ITA', home_score: 0, away_score: 0, venue_slug: 'estadio-nacional-chile', referee: 'Bobby Davidson', attendance: 65440 },
  { match_number: 9,  stage: 'group', match_date: '1962-06-02T15:00:00-04:00', home_code: 'CHI', away_code: 'ITA', home_score: 2, away_score: 0, venue_slug: 'estadio-nacional-chile', referee: 'Ken Aston', attendance: 66057, notes: '★ BATTLE OF SANTIAGO. Partido mas violento de la historia mundialista hasta entonces. 2 expulsiones italianas (Ferrini min 8, David min 41), Sanchez rompe nariz a Maschio (no expulsado), policia entra al campo 3 veces. Inspiracion para tarjetas amarilla/roja (Aston, 1966)' },
  { match_number: 10, stage: 'group', match_date: '1962-06-03T15:00:00-04:00', home_code: 'FRG', away_code: 'SUI', home_score: 2, away_score: 1, venue_slug: 'estadio-nacional-chile', referee: 'Leo Horn', attendance: 64922 },
  { match_number: 11, stage: 'group', match_date: '1962-06-06T15:00:00-04:00', home_code: 'FRG', away_code: 'CHI', home_score: 2, away_score: 0, venue_slug: 'estadio-nacional-chile', referee: 'Bobby Davidson', attendance: 67224 },
  { match_number: 12, stage: 'group', match_date: '1962-06-07T15:00:00-04:00', home_code: 'ITA', away_code: 'SUI', home_score: 3, away_score: 0, venue_slug: 'estadio-nacional-chile', referee: 'Branko Tesanic', attendance: 59828 },
  // ── GROUP 3 (BRA, TCH, MEX, ESP) ── Viña del Mar ──────────
  { match_number: 13, stage: 'group', match_date: '1962-05-30T15:00:00-04:00', home_code: 'BRA', away_code: 'MEX', home_score: 2, away_score: 0, venue_slug: 'estadio-sausalito', referee: 'Arturo Yamasaki', attendance: 10484, notes: 'Pelé asistencia + gol' },
  { match_number: 14, stage: 'group', match_date: '1962-05-31T15:00:00-04:00', home_code: 'TCH', away_code: 'ESP', home_score: 1, away_score: 0, venue_slug: 'estadio-sausalito', referee: 'Nikolai Latyshev', attendance: 12700 },
  { match_number: 15, stage: 'group', match_date: '1962-06-02T15:00:00-04:00', home_code: 'BRA', away_code: 'TCH', home_score: 0, away_score: 0, venue_slug: 'estadio-sausalito', referee: 'Pierre Schwinte', attendance: 14794, notes: 'PELÉ SE LESIONA en el min 25 (rotura muscular muslo). No vuelve a jugar el torneo. Brasil ganara el Mundial sin el' },
  { match_number: 16, stage: 'group', match_date: '1962-06-03T15:00:00-04:00', home_code: 'ESP', away_code: 'MEX', home_score: 1, away_score: 0, venue_slug: 'estadio-sausalito', referee: 'Arturo Yamasaki', attendance: 10000 },
  { match_number: 17, stage: 'group', match_date: '1962-06-06T15:00:00-04:00', home_code: 'BRA', away_code: 'ESP', home_score: 2, away_score: 1, venue_slug: 'estadio-sausalito', referee: 'Sergio Bustamante', attendance: 18715, notes: 'Amarildo (sustituto de Pelé) marca los 2 goles brasileños al 72 y 86' },
  { match_number: 18, stage: 'group', match_date: '1962-06-07T15:00:00-04:00', home_code: 'MEX', away_code: 'TCH', home_score: 3, away_score: 1, venue_slug: 'estadio-sausalito', referee: 'Andrey Bayev', attendance: 11000, notes: 'Mexico primera victoria en un Mundial desde 1930. TCH ya estaba clasificada' },
  // ── GROUP 4 (HUN, ENG, ARG, BUL) ── Rancagua ──────────────
  { match_number: 19, stage: 'group', match_date: '1962-05-30T15:00:00-04:00', home_code: 'ARG', away_code: 'BUL', home_score: 1, away_score: 0, venue_slug: 'estadio-el-teniente', referee: 'Bobby Davidson', attendance: 7134 },
  { match_number: 20, stage: 'group', match_date: '1962-05-31T15:00:00-04:00', home_code: 'HUN', away_code: 'ENG', home_score: 2, away_score: 1, venue_slug: 'estadio-el-teniente', referee: 'Leo Horn', attendance: 7938 },
  { match_number: 21, stage: 'group', match_date: '1962-06-03T15:00:00-04:00', home_code: 'ENG', away_code: 'ARG', home_score: 3, away_score: 1, venue_slug: 'estadio-el-teniente', referee: 'Nikolai Latyshev', attendance: 9794 },
  { match_number: 22, stage: 'group', match_date: '1962-06-03T15:00:00-04:00', home_code: 'HUN', away_code: 'BUL', home_score: 6, away_score: 1, venue_slug: 'estadio-el-teniente', referee: 'Cesare Jonni', attendance: 7442 },
  { match_number: 23, stage: 'group', match_date: '1962-06-06T15:00:00-04:00', home_code: 'ARG', away_code: 'HUN', home_score: 0, away_score: 0, venue_slug: 'estadio-el-teniente', referee: 'Albert Dusch', attendance: 7945 },
  { match_number: 24, stage: 'group', match_date: '1962-06-07T15:00:00-04:00', home_code: 'ENG', away_code: 'BUL', home_score: 0, away_score: 0, venue_slug: 'estadio-el-teniente', referee: 'Pierre Schwinte', attendance: 5700 },
  // ── CUARTOS ── 10 junio ──────────────────────────────────
  { match_number: 25, stage: 'qf', match_date: '1962-06-10T15:00:00-04:00', home_code: 'YUG', away_code: 'FRG', home_score: 1, away_score: 0, venue_slug: 'estadio-nacional-chile', referee: 'Arturo Yamasaki', attendance: 63324 },
  { match_number: 26, stage: 'qf', match_date: '1962-06-10T15:00:00-04:00', home_code: 'BRA', away_code: 'ENG', home_score: 3, away_score: 1, venue_slug: 'estadio-sausalito', referee: 'Pierre Schwinte', attendance: 17736, notes: 'Doblete de Garrincha (min 31, 59). Inicia su explosion en el torneo, sustituyendo el liderazgo ofensivo que dejo Pelé lesionado' },
  { match_number: 27, stage: 'qf', match_date: '1962-06-10T15:00:00-04:00', home_code: 'CHI', away_code: 'URS', home_score: 2, away_score: 1, venue_slug: 'estadio-carlos-dittborn', referee: 'Leo Horn', attendance: 17268 },
  { match_number: 28, stage: 'qf', match_date: '1962-06-10T15:00:00-04:00', home_code: 'TCH', away_code: 'HUN', home_score: 1, away_score: 0, venue_slug: 'estadio-el-teniente', referee: 'Nikolai Latyshev', attendance: 11690 },
  // ── SEMIS ── 13 junio ────────────────────────────────────
  { match_number: 29, stage: 'sf', match_date: '1962-06-13T15:00:00-04:00', home_code: 'BRA', away_code: 'CHI', home_score: 4, away_score: 2, venue_slug: 'estadio-nacional-chile', referee: 'Arturo Yamasaki', attendance: 76594, notes: 'Doblete de Garrincha (min 9, 32) + Vavá doblete. Garrincha expulsado al 83 por pegarle un balonazo a un fan; en una decision controvertida, FIFA le permite jugar la final' },
  { match_number: 30, stage: 'sf', match_date: '1962-06-13T15:00:00-04:00', home_code: 'TCH', away_code: 'YUG', home_score: 3, away_score: 1, venue_slug: 'estadio-sausalito', referee: 'Albert Dusch', attendance: 5890 },
  // ── 3er PUESTO ── 16 junio ───────────────────────────────
  { match_number: 31, stage: '3rd', match_date: '1962-06-16T14:30:00-04:00', home_code: 'CHI', away_code: 'YUG', home_score: 1, away_score: 0, venue_slug: 'estadio-nacional-chile', referee: 'Arturo Yamasaki', attendance: 66697, notes: 'Tercer puesto historico para Chile, mejor resultado mundialista nunca' },
  // ── FINAL ── 17 junio ────────────────────────────────────
  { match_number: 32, stage: 'final', match_date: '1962-06-17T14:00:00-04:00', home_code: 'BRA', away_code: 'TCH', home_score: 3, away_score: 1, venue_slug: 'estadio-nacional-chile', referee: 'Nikolai Latyshev', attendance: 68679, notes: 'Brasil BICAMPEON CONSECUTIVO (primero desde Italia 34-38). Goles Amarildo 17, Zito 69, Vava 78. Garrincha juega tras controversia disciplinaria. Pelé en el banquillo, lesionado. Brasil gana sin su 10 titular' },
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

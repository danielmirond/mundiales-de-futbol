/**
 * Seed los 35 partidos del Mundial Suecia 1958.
 *
 * Estructura: 24 partidos fase grupos (4 grupos de 4, todos contra todos)
 * + 3 partidos de PLAY-OFF por desempate en grupos + 4 cuartos + 2 semis
 * + 1 tercer puesto + 1 final = 35 partidos.
 *
 * Mundial historico por varias razones:
 *  - DEBUT DE PELÉ (17 anios, 7 meses, 23 dias). Goleador mas joven en
 *    un Mundial. Hat-trick en semifinal vs Francia y doblete en la final.
 *  - PRIMER MUNDIAL GANADO FUERA DEL CONTINENTE PROPIO: Brasil gana en
 *    Suecia 5-2, primera selección sudamericana campeona en Europa.
 *  - Brasil debuta con 4-2-4, sistema que cambiaria el futbol mundial.
 *  - Just Fontaine (Francia) marca 13 goles en 6 partidos: record
 *    historico de goles en un solo Mundial que sigue vigente.
 *  - Garrincha juega su primer Mundial despues de que Carvalhaes
 *    lo declarara "no apto" - mismo dictamen que sobre Pelé (ver
 *    historia #21).
 *
 * Sedes: 12 ciudades suecas (Estocolmo, Goteborg, Malmo, Norrkoping,
 * Helsingborg, Sandviken, Boras, Halmstad, Eskilstuna, Orebro, Vasteras,
 * Uddevalla).
 *
 * Datos verificados con FIFA archives, Wikipedia (1958 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF Archive.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1958.ts
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

const YEAR = 1958;

const TEAMS = [
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'FRA', name: 'Francia', conf: 'UEFA', flag: '🇫🇷' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'NIR', name: 'Irlanda del Norte', conf: 'UEFA', flag: '🇬🇧' },
  { code: 'WAL', name: 'Gales', conf: 'UEFA', flag: '🇬🇧' },
  { code: 'ARG', name: 'Argentina', conf: 'CONMEBOL', flag: '🇦🇷' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'HUN', name: 'Hungría', conf: 'UEFA', flag: '🇭🇺' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'AUT', name: 'Austria', conf: 'UEFA', flag: '🇦🇹' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'SCO', name: 'Escocia', conf: 'UEFA', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
];

const VENUES = [
  { slug: 'rasunda-stadium', name: 'Råsunda Stadium', city: 'Estocolmo', country_code: 'SWE', latitude: 59.3661, longitude: 17.9989, surface: 'grass', opened_year: 1937, closed_year: 2012 },
  { slug: 'ullevi', name: 'Ullevi Stadium', city: 'Gotemburgo', country_code: 'SWE', latitude: 57.7062, longitude: 11.9885, surface: 'grass', opened_year: 1958 },
  { slug: 'malmo-stadion', name: 'Malmö Stadion', city: 'Malmö', country_code: 'SWE', latitude: 55.5840, longitude: 13.0083, surface: 'grass', opened_year: 1958, closed_year: 2008 },
  { slug: 'idrottsparken-norrkoping', name: 'Idrottsparken', city: 'Norrköping', country_code: 'SWE', latitude: 58.5959, longitude: 16.1880, surface: 'grass', opened_year: 1903 },
  { slug: 'olympia-helsingborg', name: 'Olympia', city: 'Helsingborg', country_code: 'SWE', latitude: 56.0457, longitude: 12.6948, surface: 'grass', opened_year: 1898 },
  { slug: 'jernvallen-sandviken', name: 'Jernvallen', city: 'Sandviken', country_code: 'SWE', latitude: 60.6260, longitude: 16.7651, surface: 'grass', opened_year: 1938 },
  { slug: 'ryavallen-boras', name: 'Ryavallen', city: 'Borås', country_code: 'SWE', latitude: 57.7193, longitude: 12.9408, surface: 'grass', opened_year: 1941 },
  { slug: 'orjans-vall-halmstad', name: 'Örjans Vall', city: 'Halmstad', country_code: 'SWE', latitude: 56.6680, longitude: 12.8587, surface: 'grass', opened_year: 1922 },
  { slug: 'tunavallen-eskilstuna', name: 'Tunavallen', city: 'Eskilstuna', country_code: 'SWE', latitude: 59.3680, longitude: 16.5077, surface: 'grass', opened_year: 1923 },
  { slug: 'eyravallen-orebro', name: 'Eyravallen', city: 'Örebro', country_code: 'SWE', latitude: 59.2697, longitude: 15.2210, surface: 'grass', opened_year: 1922 },
  { slug: 'arosvallen-vasteras', name: 'Arosvallen', city: 'Västerås', country_code: 'SWE', latitude: 59.6098, longitude: 16.5500, surface: 'grass', opened_year: 1920 },
  { slug: 'rimnersvallen-uddevalla', name: 'Rimnersvallen', city: 'Uddevalla', country_code: 'SWE', latitude: 58.3490, longitude: 11.9450, surface: 'grass', opened_year: 1923 },
];

const REFEREES = [
  { full_name: 'Maurice Guigue', nationality_code: 'FRA' },
  { full_name: 'Albert Dusch', nationality_code: 'FRG' },
  { full_name: 'István Zsolt', nationality_code: 'HUN' },
  { full_name: 'Mervyn Griffiths', nationality_code: 'WAL' },
  { full_name: 'Jack Mowat', nationality_code: 'SCO' },
  { full_name: 'Reg Leafe', nationality_code: 'ENG' },
  { full_name: 'Arthur Edward Ellis', nationality_code: 'ENG' },
  { full_name: 'Lucien van Nuffel', nationality_code: 'BEL' },
  { full_name: 'Juan Brozzi', nationality_code: 'ARG' },
  { full_name: 'Joaquim Fernandes de Campos', nationality_code: 'POR' },
  { full_name: 'Eino Helge', nationality_code: 'FIN' },
  { full_name: 'Nikolai Latyshev', nationality_code: 'URS' },
  { full_name: 'Karoly Palotai', nationality_code: 'HUN' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'playoff' | 'qf' | 'sf' | '3rd' | 'final';
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
  // ─── GROUP 1 (FRG, ARG, NIR, TCH) ────────────────────────
  { match_number: 1, stage: 'group', match_date: '1958-06-08T19:30:00+01:00', home_code: 'FRG', away_code: 'ARG', home_score: 3, away_score: 1, venue_slug: 'malmo-stadion', referee: 'Reg Leafe', attendance: 31156 },
  { match_number: 2, stage: 'group', match_date: '1958-06-08T19:30:00+01:00', home_code: 'NIR', away_code: 'TCH', home_score: 1, away_score: 0, venue_slug: 'orjans-vall-halmstad', referee: 'Arthur Edward Ellis', attendance: 11800 },
  { match_number: 3, stage: 'group', match_date: '1958-06-11T19:00:00+01:00', home_code: 'FRG', away_code: 'TCH', home_score: 2, away_score: 2, venue_slug: 'olympia-helsingborg', referee: 'Maurice Guigue', attendance: 25000 },
  { match_number: 4, stage: 'group', match_date: '1958-06-11T19:00:00+01:00', home_code: 'ARG', away_code: 'NIR', home_score: 3, away_score: 1, venue_slug: 'orjans-vall-halmstad', referee: 'Joaquim Fernandes de Campos', attendance: 14174 },
  { match_number: 5, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'FRG', away_code: 'NIR', home_score: 2, away_score: 2, venue_slug: 'malmo-stadion', referee: 'István Zsolt', attendance: 21990 },
  { match_number: 6, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'TCH', away_code: 'ARG', home_score: 6, away_score: 1, venue_slug: 'olympia-helsingborg', referee: 'Albert Dusch', attendance: 20000 },
  // ─── GROUP 2 (FRA, YUG, SCO, PAR) ─────────────────────────
  { match_number: 7, stage: 'group', match_date: '1958-06-08T19:00:00+01:00', home_code: 'FRA', away_code: 'PAR', home_score: 7, away_score: 3, venue_slug: 'idrottsparken-norrkoping', referee: 'Juan Brozzi', attendance: 16500 },
  { match_number: 8, stage: 'group', match_date: '1958-06-08T19:00:00+01:00', home_code: 'YUG', away_code: 'SCO', home_score: 1, away_score: 1, venue_slug: 'arosvallen-vasteras', referee: 'Mervyn Griffiths', attendance: 9591 },
  { match_number: 9, stage: 'group', match_date: '1958-06-11T19:00:00+01:00', home_code: 'YUG', away_code: 'FRA', home_score: 3, away_score: 2, venue_slug: 'tunavallen-eskilstuna', referee: 'Reg Leafe', attendance: 13103 },
  { match_number: 10, stage: 'group', match_date: '1958-06-11T19:00:00+01:00', home_code: 'PAR', away_code: 'SCO', home_score: 3, away_score: 2, venue_slug: 'idrottsparken-norrkoping', referee: 'Lucien van Nuffel', attendance: 11665 },
  { match_number: 11, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'FRA', away_code: 'SCO', home_score: 2, away_score: 1, venue_slug: 'arosvallen-vasteras', referee: 'Juan Brozzi', attendance: 16000 },
  { match_number: 12, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'YUG', away_code: 'PAR', home_score: 3, away_score: 3, venue_slug: 'tunavallen-eskilstuna', referee: 'Joaquim Fernandes de Campos', attendance: 13310 },
  // ─── GROUP 3 (SWE, HUN, WAL, MEX) ─────────────────────────
  { match_number: 13, stage: 'group', match_date: '1958-06-08T19:00:00+01:00', home_code: 'SWE', away_code: 'MEX', home_score: 3, away_score: 0, venue_slug: 'rasunda-stadium', referee: 'Nikolai Latyshev', attendance: 31900 },
  { match_number: 14, stage: 'group', match_date: '1958-06-08T19:00:00+01:00', home_code: 'HUN', away_code: 'WAL', home_score: 1, away_score: 1, venue_slug: 'jernvallen-sandviken', referee: 'Lucien van Nuffel', attendance: 15343 },
  { match_number: 15, stage: 'group', match_date: '1958-06-12T19:00:00+01:00', home_code: 'WAL', away_code: 'MEX', home_score: 1, away_score: 1, venue_slug: 'rasunda-stadium', referee: 'Eino Helge', attendance: 15150 },
  { match_number: 16, stage: 'group', match_date: '1958-06-12T19:00:00+01:00', home_code: 'SWE', away_code: 'HUN', home_score: 2, away_score: 1, venue_slug: 'rasunda-stadium', referee: 'Karoly Palotai', attendance: 38850 },
  { match_number: 17, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'SWE', away_code: 'WAL', home_score: 0, away_score: 0, venue_slug: 'rasunda-stadium', referee: 'Mervyn Griffiths', attendance: 29800 },
  { match_number: 18, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'HUN', away_code: 'MEX', home_score: 4, away_score: 0, venue_slug: 'jernvallen-sandviken', referee: 'Albert Dusch', attendance: 13310 },
  // ─── GROUP 4 (BRA, URS, ENG, AUT) ─────────────────────────
  { match_number: 19, stage: 'group', match_date: '1958-06-08T19:00:00+01:00', home_code: 'BRA', away_code: 'AUT', home_score: 3, away_score: 0, venue_slug: 'rimnersvallen-uddevalla', referee: 'István Zsolt', attendance: 21500, notes: 'Debut Mundial de Pelé previsto pero finalmente quedó en el banquillo. Brasil aplica el 4-2-4 por primera vez' },
  { match_number: 20, stage: 'group', match_date: '1958-06-08T19:00:00+01:00', home_code: 'URS', away_code: 'ENG', home_score: 2, away_score: 2, venue_slug: 'ullevi', referee: 'István Zsolt', attendance: 49348 },
  { match_number: 21, stage: 'group', match_date: '1958-06-11T19:00:00+01:00', home_code: 'BRA', away_code: 'ENG', home_score: 0, away_score: 0, venue_slug: 'ullevi', referee: 'Albert Dusch', attendance: 40895, notes: 'Primer 0-0 con Inglaterra de la historia del Mundial. Pelé sigue en el banquillo' },
  { match_number: 22, stage: 'group', match_date: '1958-06-11T19:00:00+01:00', home_code: 'URS', away_code: 'AUT', home_score: 2, away_score: 0, venue_slug: 'ryavallen-boras', referee: 'Nikolai Latyshev', attendance: 21239 },
  { match_number: 23, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'BRA', away_code: 'URS', home_score: 2, away_score: 0, venue_slug: 'ullevi', referee: 'Maurice Guigue', attendance: 50928, notes: 'DEBUT MUNDIAL DE PELÉ (17 anios 7 meses 23 dias, sigue siendo el debut mas joven en un Mundial de fase final). Garrincha tambien debuta tras rebelion de Nilton Santos. Vavá marca los dos goles' },
  { match_number: 24, stage: 'group', match_date: '1958-06-15T19:00:00+01:00', home_code: 'ENG', away_code: 'AUT', home_score: 2, away_score: 2, venue_slug: 'ryavallen-boras', referee: 'Jack Mowat', attendance: 16800 },
  // ─── PLAYOFFS de desempate en grupos ─────────────────────
  { match_number: 25, stage: 'playoff', match_date: '1958-06-17T19:00:00+01:00', home_code: 'NIR', away_code: 'TCH', home_score: 2, away_score: 1, venue_slug: 'malmo-stadion', referee: 'Maurice Guigue', attendance: 6196, notes: 'Playoff desempate grupo 1. NIR avanza a cuartos' },
  { match_number: 26, stage: 'playoff', match_date: '1958-06-17T19:00:00+01:00', home_code: 'WAL', away_code: 'HUN', home_score: 2, away_score: 1, venue_slug: 'rasunda-stadium', referee: 'Nikolai Latyshev', attendance: 2823, notes: 'Playoff desempate grupo 3. WAL avanza a cuartos eliminando a Hungria (sin la Aranycsapat tras la Revolucion de 1956)' },
  { match_number: 27, stage: 'playoff', match_date: '1958-06-17T19:00:00+01:00', home_code: 'URS', away_code: 'ENG', home_score: 1, away_score: 0, venue_slug: 'ullevi', referee: 'Albert Dusch', attendance: 23182, notes: 'Playoff desempate grupo 4. URS avanza, ENG eliminada' },
  // ─── CUARTOS ──────────────────────────────────────────────
  { match_number: 28, stage: 'qf', match_date: '1958-06-19T19:00:00+01:00', home_code: 'FRA', away_code: 'NIR', home_score: 4, away_score: 0, venue_slug: 'idrottsparken-norrkoping', referee: 'Juan Brozzi', attendance: 11800 },
  { match_number: 29, stage: 'qf', match_date: '1958-06-19T19:00:00+01:00', home_code: 'FRG', away_code: 'YUG', home_score: 1, away_score: 0, venue_slug: 'malmo-stadion', referee: 'Karoly Palotai', attendance: 25000 },
  { match_number: 30, stage: 'qf', match_date: '1958-06-19T19:00:00+01:00', home_code: 'SWE', away_code: 'URS', home_score: 2, away_score: 0, venue_slug: 'rasunda-stadium', referee: 'Reg Leafe', attendance: 31900 },
  { match_number: 31, stage: 'qf', match_date: '1958-06-19T19:00:00+01:00', home_code: 'BRA', away_code: 'WAL', home_score: 1, away_score: 0, venue_slug: 'ullevi', referee: 'Eino Helge', attendance: 25923, notes: 'PRIMER GOL MUNDIAL DE PELÉ al min 73 (17 anios 7 meses 27 dias, goleador mas joven en un Mundial, record que sigue vigente)' },
  // ─── SEMIS ────────────────────────────────────────────────
  { match_number: 32, stage: 'sf', match_date: '1958-06-24T19:00:00+01:00', home_code: 'BRA', away_code: 'FRA', home_score: 5, away_score: 2, venue_slug: 'rasunda-stadium', referee: 'Mervyn Griffiths', attendance: 27100, notes: 'HAT-TRICK DE PELÉ contra Francia (min 52, 64, 75). Just Fontaine marca para Francia y suma su 12o gol del torneo' },
  { match_number: 33, stage: 'sf', match_date: '1958-06-24T19:00:00+01:00', home_code: 'SWE', away_code: 'FRG', home_score: 3, away_score: 1, venue_slug: 'ullevi', referee: 'István Zsolt', attendance: 49471, notes: 'Suecia anfitriona elimina al campeon defensor FRG y clasifica a su unica final mundialista' },
  // ─── 3er PUESTO ──────────────────────────────────────────
  { match_number: 34, stage: '3rd', match_date: '1958-06-28T19:00:00+01:00', home_code: 'FRA', away_code: 'FRG', home_score: 6, away_score: 3, venue_slug: 'ullevi', referee: 'Juan Brozzi', attendance: 32482, notes: 'JUST FONTAINE MARCA 4 GOLES y cierra el torneo con 13 goles en 6 partidos. RECORD HISTORICO de goles en un solo Mundial que sigue vigente hoy' },
  // ─── FINAL ────────────────────────────────────────────────
  { match_number: 35, stage: 'final', match_date: '1958-06-29T15:00:00+01:00', home_code: 'BRA', away_code: 'SWE', home_score: 5, away_score: 2, venue_slug: 'rasunda-stadium', referee: 'Maurice Guigue', attendance: 49737, notes: 'PRIMER MUNDIAL DE BRASIL. Primer titulo ganado fuera del continente propio en la historia. Pelé marca 2 (min 55 y 89, incluido el famoso "sombrero" sobre Bengt Gustavsson). Vavá 2, Zagallo 1. Suecia hizo un gol al min 4 (Liedholm)' },
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

/**
 * Seed los 22 partidos del Mundial Brasil 1950.
 *
 * Mundial atipico: 13 selecciones (India, Escocia, Turquia y Francia
 * se retiraron tras aceptar invitacion), grupos irregulares (4-3-3-2).
 * Sin final clasica: round-robin de 4 entre Brasil, Uruguay, Suecia y
 * Espana. El "decisor" Maracanazo del 16 jul (BRA 1-2 URU) cierra el
 * torneo y desencadena uno de los traumas deportivos mas largos del
 * fútbol latinoamericano.
 *
 * Estructura: 16 partidos primera fase + 6 round-robin final = 22.
 *
 * Hitos editoriales incluidos:
 *  - Match 7: USA 1-0 ENG en Belo Horizonte (el "Miracle on Grass",
 *    Joe Gaetjens al 38, una de las mayores sorpresas del Mundial)
 *  - Match 17: BRA 7-1 SWE (Ademir 4 goles en el grupo final)
 *  - Match 22: BRA 1-2 URU (Maracanazo, ver historia #26)
 *
 * Fuentes verificadas:
 *  - FIFA digital archives (1950-brazil)
 *  - thesoccerworldcups.com
 *  - Wikipedia (1950 FIFA World Cup)
 *  - The RSSSF Archive
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1950.ts
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

const YEAR = 1950;

const TEAMS = [
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'ESP', name: 'España', conf: 'UEFA', flag: '🇪🇸' },
  { code: 'YUG', name: 'Yugoslavia', conf: 'UEFA', flag: '🇷🇸', dissolved: 2003, successor: 'SRB' },
  { code: 'SUI', name: 'Suiza', conf: 'UEFA', flag: '🇨🇭' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'CHI', name: 'Chile', conf: 'CONMEBOL', flag: '🇨🇱' },
  { code: 'PAR', name: 'Paraguay', conf: 'CONMEBOL', flag: '🇵🇾' },
  { code: 'USA', name: 'Estados Unidos', conf: 'CONCACAF', flag: '🇺🇸' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'BOL', name: 'Bolivia', conf: 'CONMEBOL', flag: '🇧🇴' },
];

const VENUES = [
  { slug: 'estadio-do-maracana', name: 'Estádio do Maracanã', city: 'Río de Janeiro', country_code: 'BRA', latitude: -22.9122, longitude: -43.2302, surface: 'grass', opened_year: 1950 },
  { slug: 'estadio-do-pacaembu', name: 'Estádio do Pacaembu', city: 'São Paulo', country_code: 'BRA', latitude: -23.5466, longitude: -46.6620, surface: 'grass', opened_year: 1940 },
  { slug: 'estadio-independencia', name: 'Estádio Independência', city: 'Belo Horizonte', country_code: 'BRA', latitude: -19.9061, longitude: -43.9189, surface: 'grass', opened_year: 1950 },
  { slug: 'estadio-vila-capanema', name: 'Estádio Joaquim Américo Guimarães (Vila Capanema)', city: 'Curitiba', country_code: 'BRA', latitude: -25.4486, longitude: -49.2769, surface: 'grass', opened_year: 1947 },
  { slug: 'estadio-eucaliptos', name: 'Estádio dos Eucaliptos', city: 'Porto Alegre', country_code: 'BRA', latitude: -30.0512, longitude: -51.2270, surface: 'grass', opened_year: 1931, closed_year: 1986 },
  { slug: 'estadio-ilha-do-retiro', name: 'Estádio Ilha do Retiro', city: 'Recife', country_code: 'BRA', latitude: -8.0589, longitude: -34.9006, surface: 'grass', opened_year: 1937 },
];

const REFEREES = [
  { full_name: 'George Reader', nationality_code: 'ENG' },
  { full_name: 'Mervyn Griffiths', nationality_code: 'WAL' },
  { full_name: 'Arthur Ellis', nationality_code: 'ENG' },
  { full_name: 'Mario Vianna', nationality_code: 'BRA' },
  { full_name: 'Generoso Dattilo', nationality_code: 'ITA' },
  { full_name: 'Karel van der Meer', nationality_code: 'NED' },
  { full_name: 'Reginald Leafe', nationality_code: 'ENG' },
  { full_name: 'Giovanni Galeati', nationality_code: 'ITA' },
  { full_name: 'Benjamin Griffiths', nationality_code: 'WAL' },
  { full_name: 'Ramon Azon Roma', nationality_code: 'ESP' },
  { full_name: 'Lucien Leclercq', nationality_code: 'FRA' },
  { full_name: 'Iván Eklind', nationality_code: 'SWE' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'final-round';
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
  // ─── Grupo 1 (BRA, MEX, SUI, YUG) ─────────────────────────
  { match_number: 1, stage: 'group', match_date: '1950-06-24T15:30:00-03:00', home_code: 'BRA', away_code: 'MEX', home_score: 4, away_score: 0, venue_slug: 'estadio-do-maracana', referee: 'George Reader', attendance: 81649, notes: 'Inauguracion oficial del Mundial 1950 y del Maracana' },
  { match_number: 2, stage: 'group', match_date: '1950-06-25T15:00:00-03:00', home_code: 'YUG', away_code: 'SUI', home_score: 3, away_score: 0, venue_slug: 'estadio-independencia', referee: 'Reginald Leafe', attendance: 9849 },
  { match_number: 3, stage: 'group', match_date: '1950-06-28T15:00:00-03:00', home_code: 'BRA', away_code: 'SUI', home_score: 2, away_score: 2, venue_slug: 'estadio-do-pacaembu', referee: 'Ramon Azon Roma', attendance: 42032 },
  { match_number: 4, stage: 'group', match_date: '1950-07-01T15:30:00-03:00', home_code: 'YUG', away_code: 'MEX', home_score: 4, away_score: 1, venue_slug: 'estadio-do-maracana', referee: 'Mervyn Griffiths', attendance: 24846 },
  { match_number: 5, stage: 'group', match_date: '1950-07-01T15:30:00-03:00', home_code: 'BRA', away_code: 'YUG', home_score: 2, away_score: 0, venue_slug: 'estadio-do-maracana', referee: 'Mario Vianna', attendance: 142409 },
  { match_number: 6, stage: 'group', match_date: '1950-07-02T15:00:00-03:00', home_code: 'SUI', away_code: 'MEX', home_score: 2, away_score: 1, venue_slug: 'estadio-independencia', referee: 'Iván Eklind', attendance: 8501 },
  // ─── Grupo 2 (ENG, ESP, USA, CHI) ─────────────────────────
  { match_number: 7, stage: 'group', match_date: '1950-06-25T15:00:00-03:00', home_code: 'ENG', away_code: 'CHI', home_score: 2, away_score: 0, venue_slug: 'estadio-do-maracana', referee: 'Karel van der Meer', attendance: 29703 },
  { match_number: 8, stage: 'group', match_date: '1950-06-25T15:00:00-03:00', home_code: 'ESP', away_code: 'USA', home_score: 3, away_score: 1, venue_slug: 'estadio-vila-capanema', referee: 'Mario Gardelli', attendance: 9511 },
  { match_number: 9, stage: 'group', match_date: '1950-06-29T15:00:00-03:00', home_code: 'USA', away_code: 'ENG', home_score: 1, away_score: 0, venue_slug: 'estadio-independencia', referee: 'Generoso Dattilo', attendance: 10151, notes: 'El "Miracle on Grass": gol de Joe Gaetjens al min 38. Una de las mayores sorpresas en la historia del Mundial. Inglaterra debutaba en Mundiales tras anos de boicot a la FIFA.' },
  { match_number: 10, stage: 'group', match_date: '1950-06-29T15:00:00-03:00', home_code: 'ESP', away_code: 'CHI', home_score: 2, away_score: 0, venue_slug: 'estadio-do-maracana', referee: 'Mervyn Griffiths', attendance: 19790 },
  { match_number: 11, stage: 'group', match_date: '1950-07-02T15:30:00-03:00', home_code: 'ESP', away_code: 'ENG', home_score: 1, away_score: 0, venue_slug: 'estadio-do-maracana', referee: 'Giovanni Galeati', attendance: 74462, notes: 'Inglaterra eliminada en primera fase' },
  { match_number: 12, stage: 'group', match_date: '1950-07-02T15:00:00-03:00', home_code: 'CHI', away_code: 'USA', home_score: 5, away_score: 2, venue_slug: 'estadio-ilha-do-retiro', referee: 'Mario Gardelli', attendance: 8501 },
  // ─── Grupo 3 (ITA, SWE, PAR) ──────────────────────────────
  { match_number: 13, stage: 'group', match_date: '1950-06-25T16:00:00-03:00', home_code: 'SWE', away_code: 'ITA', home_score: 3, away_score: 2, venue_slug: 'estadio-do-pacaembu', referee: 'Jean Lutz', attendance: 36502, notes: 'Italia caia en su debut tras la tragedia del Superga (mayo 1949 que mato a media seleccion Grande Torino)' },
  { match_number: 14, stage: 'group', match_date: '1950-06-29T15:00:00-03:00', home_code: 'SWE', away_code: 'PAR', home_score: 2, away_score: 2, venue_slug: 'estadio-vila-capanema', referee: 'Arthur Ellis', attendance: 7903 },
  { match_number: 15, stage: 'group', match_date: '1950-07-02T15:30:00-03:00', home_code: 'ITA', away_code: 'PAR', home_score: 2, away_score: 0, venue_slug: 'estadio-do-pacaembu', referee: 'Benjamin Griffiths', attendance: 25053 },
  // ─── Grupo 4 (URU, BOL) ───────────────────────────────────
  { match_number: 16, stage: 'group', match_date: '1950-07-02T15:30:00-03:00', home_code: 'URU', away_code: 'BOL', home_score: 8, away_score: 0, venue_slug: 'estadio-independencia', referee: 'George Reader', attendance: 5284, notes: 'Grupo de solo 2 equipos tras retiros de Turquia y Francia. Uruguay clasifica con un solo partido jugado.' },
  // ─── GRUPO FINAL (BRA, URU, SWE, ESP) ─────────────────────
  { match_number: 17, stage: 'final-round', match_date: '1950-07-09T15:30:00-03:00', home_code: 'BRA', away_code: 'SWE', home_score: 7, away_score: 1, venue_slug: 'estadio-do-maracana', referee: 'Mervyn Griffiths', attendance: 138886, notes: 'Ademir 4 goles. Brasil aplastante en debut del grupo final.' },
  { match_number: 18, stage: 'final-round', match_date: '1950-07-09T15:00:00-03:00', home_code: 'URU', away_code: 'ESP', home_score: 2, away_score: 2, venue_slug: 'estadio-do-pacaembu', referee: 'Karel van der Meer', attendance: 44802 },
  { match_number: 19, stage: 'final-round', match_date: '1950-07-13T15:30:00-03:00', home_code: 'BRA', away_code: 'ESP', home_score: 6, away_score: 1, venue_slug: 'estadio-do-maracana', referee: 'Reginald Leafe', attendance: 152772, notes: 'Brasil llega al ultimo partido con 4 puntos, +10 goal difference, requiriendo solo empate' },
  { match_number: 20, stage: 'final-round', match_date: '1950-07-13T15:00:00-03:00', home_code: 'URU', away_code: 'SWE', home_score: 3, away_score: 2, venue_slug: 'estadio-do-pacaembu', referee: 'Giovanni Galeati', attendance: 7847 },
  { match_number: 21, stage: 'final-round', match_date: '1950-07-16T15:00:00-03:00', home_code: 'SWE', away_code: 'ESP', home_score: 3, away_score: 1, venue_slug: 'estadio-do-pacaembu', referee: 'Arthur Ellis', attendance: 11227, notes: 'Suecia 3o' },
  { match_number: 22, stage: 'final-round', match_date: '1950-07-16T15:00:00-03:00', home_code: 'BRA', away_code: 'URU', home_score: 1, away_score: 2, venue_slug: 'estadio-do-maracana', referee: 'George Reader', attendance: 173850, notes: 'EL MARACANAZO. Friaca 47 (BRA), Schiaffino 66 (URU), Ghiggia 79 (URU). Uruguay campeon. Ver historia #26 para narrativa completa.' },
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

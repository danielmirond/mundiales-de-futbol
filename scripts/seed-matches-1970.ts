/**
 * Seed los 32 partidos del Mundial México 1970.
 *
 * 16 selecciones en 4 grupos: 24 grupos + 4 cuartos + 2 semis +
 * 1 tercer puesto + 1 final = 32 partidos.
 *
 * Mundial considerado por muchos el MEJOR DE LA HISTORIA:
 *  - BRASIL ETERNO: Pelé, Tostão, Jairzinho, Rivelino, Gerson, Carlos
 *    Alberto. Equipo más completo de la historia. Bicampeón mundial
 *    (3a estrella) y se queda en propiedad la Copa Jules Rimet
 *    (regalo de FIFA al país que ganara su 3o título; robada en 1983
 *    nunca recuperada).
 *  - "GOL DEL SIGLO" (match #32 final BRA 4-1 ITA, min 86): jugada
 *    colectiva de Brasil con 9 toques que termina con Carlos Alberto
 *    rematando desde la derecha tras pase telegrafiado de Pelé sin
 *    mirar. Cierra el Mundial brasileño más perfecto.
 *  - "PARTIDO DEL SIGLO" (match #29 semi ITA 4-3 FRG a.e.t. en Azteca):
 *    5 goles en la prórroga. Beckenbauer juega con brazo roto en
 *    cabestrillo. Gerd Müller marca 2 goles, Rivera marca el 4-3
 *    final al 111. Considerado uno de los mejores partidos de la
 *    historia del fútbol.
 *  - JAIRZINHO marca en TODOS los partidos del torneo (7 partidos, 7
 *    goles, RÉCORD VIGENTE).
 *  - "EL ABRAZO" Pelé-Bobby Moore en BRA 1-0 ENG (match #16): foto
 *    de Mexican Smile, icono del fair play mundialista.
 *  - PRIMERA vez con TARJETAS amarilla/roja en Mundial (Ken Aston,
 *    sistema aprobado 1968 → estreno 1970, ver historia #23).
 *  - PRIMERA vez con SUSTITUCIONES (2 por equipo) en Mundial.
 *
 * Datos verificados con FIFA archives, Wikipedia (1970 FIFA World Cup),
 * thesoccerworldcups.com, RSSSF.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-matches-1970.ts
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

const YEAR = 1970;

const TEAMS = [
  { code: 'BRA', name: 'Brasil', conf: 'CONMEBOL', flag: '🇧🇷' },
  { code: 'ITA', name: 'Italia', conf: 'UEFA', flag: '🇮🇹' },
  { code: 'FRG', name: 'Alemania Occidental', conf: 'UEFA', flag: '🇩🇪', dissolved: 1990, successor: 'GER' },
  { code: 'URU', name: 'Uruguay', conf: 'CONMEBOL', flag: '🇺🇾' },
  { code: 'PER', name: 'Perú', conf: 'CONMEBOL', flag: '🇵🇪' },
  { code: 'MEX', name: 'México', conf: 'CONCACAF', flag: '🇲🇽' },
  { code: 'ENG', name: 'Inglaterra', conf: 'UEFA', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'URS', name: 'Unión Soviética', conf: 'UEFA', flag: '🇷🇺', dissolved: 1991, successor: 'RUS' },
  { code: 'TCH', name: 'Checoslovaquia', conf: 'UEFA', flag: '🇨🇿', dissolved: 1992, successor: 'CZE' },
  { code: 'ROU', name: 'Rumanía', conf: 'UEFA', flag: '🇷🇴' },
  { code: 'BUL', name: 'Bulgaria', conf: 'UEFA', flag: '🇧🇬' },
  { code: 'MAR', name: 'Marruecos', conf: 'CAF', flag: '🇲🇦' },
  { code: 'BEL', name: 'Bélgica', conf: 'UEFA', flag: '🇧🇪' },
  { code: 'SWE', name: 'Suecia', conf: 'UEFA', flag: '🇸🇪' },
  { code: 'ISR', name: 'Israel', conf: 'AFC', flag: '🇮🇱' },
  { code: 'SLV', name: 'El Salvador', conf: 'CONCACAF', flag: '🇸🇻' },
];

const VENUES = [
  { slug: 'estadio-azteca', name: 'Estadio Azteca', city: 'Ciudad de México', country_code: 'MEX', latitude: 19.3029, longitude: -99.1505, surface: 'grass', opened_year: 1966 },
  { slug: 'estadio-jalisco', name: 'Estadio Jalisco', city: 'Guadalajara', country_code: 'MEX', latitude: 20.7016, longitude: -103.3284, surface: 'grass', opened_year: 1960 },
  { slug: 'estadio-nou-camp-leon', name: 'Estadio Nou Camp León', city: 'León', country_code: 'MEX', latitude: 21.1213, longitude: -101.6918, surface: 'grass', opened_year: 1967 },
  { slug: 'estadio-cuauhtemoc', name: 'Estadio Cuauhtémoc', city: 'Puebla', country_code: 'MEX', latitude: 19.0529, longitude: -98.2406, surface: 'grass', opened_year: 1968 },
  { slug: 'estadio-luis-dosal-toluca', name: 'Estadio Luis Dosal', city: 'Toluca', country_code: 'MEX', latitude: 19.2820, longitude: -99.6790, surface: 'grass', opened_year: 1954 },
];

const REFEREES = [
  { full_name: 'Kurt Tschenscher', nationality_code: 'FRG' },
  { full_name: 'Rudolf Glöckner', nationality_code: 'GDR' },
  { full_name: 'Antonio Sbardella', nationality_code: 'ITA' },
  { full_name: 'Diego de Leo', nationality_code: 'MEX' },
  { full_name: 'Arturo Yamasaki', nationality_code: 'PER' },
  { full_name: 'Henry Landauer', nationality_code: 'USA' },
  { full_name: 'Ferdinand Marschall', nationality_code: 'AUT' },
  { full_name: 'Roger Machin', nationality_code: 'FRA' },
  { full_name: 'Sandor Lemesic', nationality_code: 'YUG' },
  { full_name: 'Tofiq Bahramov', nationality_code: 'URS' },
  { full_name: 'Angel Coerezza', nationality_code: 'ARG' },
  { full_name: 'Abraham Klein', nationality_code: 'ISR' },
  { full_name: 'Andriy Bostan', nationality_code: 'TCH' },
];

type MatchRow = {
  match_number: number;
  stage: 'group' | 'qf' | 'sf' | '3rd' | 'final';
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
  // ── GROUP 1 (MEX, URS, BEL, SLV) ── Azteca / Puebla ─────
  { match_number: 1,  stage: 'group', match_date: '1970-05-31T12:00:00-06:00', home_code: 'MEX', away_code: 'URS', home_score: 0, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Kurt Tschenscher', attendance: 107000, notes: 'Match inaugural. Tschenscher SACA LA PRIMERA TARJETA AMARILLA DE LA HISTORIA DE LOS MUNDIALES (Cantor / Lovchev URS al min 39)' },
  { match_number: 2,  stage: 'group', match_date: '1970-06-03T16:00:00-06:00', home_code: 'BEL', away_code: 'SLV', home_score: 3, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Arturo Yamasaki', attendance: 92000 },
  { match_number: 3,  stage: 'group', match_date: '1970-06-06T16:00:00-06:00', home_code: 'URS', away_code: 'BEL', home_score: 4, away_score: 1, venue_slug: 'estadio-azteca', referee: 'Rudolf Scheurer', attendance: 70000 },
  { match_number: 4,  stage: 'group', match_date: '1970-06-07T12:00:00-06:00', home_code: 'MEX', away_code: 'SLV', home_score: 4, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Ali Hussain Kandil', attendance: 103000 },
  { match_number: 5,  stage: 'group', match_date: '1970-06-10T16:00:00-06:00', home_code: 'URS', away_code: 'SLV', home_score: 2, away_score: 0, venue_slug: 'estadio-cuauhtemoc', referee: 'Rudolf Glöckner', attendance: 47000 },
  { match_number: 6,  stage: 'group', match_date: '1970-06-11T16:00:00-06:00', home_code: 'MEX', away_code: 'BEL', home_score: 1, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Angel Coerezza', attendance: 105000, notes: 'México clasifica a cuartos por primera vez en su historia' },
  // ── GROUP 2 (URU, ITA, SWE, ISR) ── Puebla / Toluca ─────
  { match_number: 7,  stage: 'group', match_date: '1970-06-02T16:00:00-06:00', home_code: 'URU', away_code: 'ISR', home_score: 2, away_score: 0, venue_slug: 'estadio-cuauhtemoc', referee: 'Diego de Leo', attendance: 20654 },
  { match_number: 8,  stage: 'group', match_date: '1970-06-03T16:00:00-06:00', home_code: 'ITA', away_code: 'SWE', home_score: 1, away_score: 0, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Henry Landauer', attendance: 13433 },
  { match_number: 9,  stage: 'group', match_date: '1970-06-06T16:00:00-06:00', home_code: 'ITA', away_code: 'URU', home_score: 0, away_score: 0, venue_slug: 'estadio-cuauhtemoc', referee: 'Rudolf Scheurer', attendance: 29968 },
  { match_number: 10, stage: 'group', match_date: '1970-06-07T16:00:00-06:00', home_code: 'ISR', away_code: 'SWE', home_score: 1, away_score: 1, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Andriy Bostan', attendance: 9624 },
  { match_number: 11, stage: 'group', match_date: '1970-06-10T16:00:00-06:00', home_code: 'SWE', away_code: 'URU', home_score: 1, away_score: 0, venue_slug: 'estadio-cuauhtemoc', referee: 'Diego de Leo', attendance: 18163 },
  { match_number: 12, stage: 'group', match_date: '1970-06-11T16:00:00-06:00', home_code: 'ITA', away_code: 'ISR', home_score: 0, away_score: 0, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Ferdinand Marschall', attendance: 9890 },
  // ── GROUP 3 (BRA, ENG, ROU, TCH) ── Guadalajara ─────────
  { match_number: 13, stage: 'group', match_date: '1970-06-02T16:00:00-06:00', home_code: 'ENG', away_code: 'ROU', home_score: 1, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Vital Loraux', attendance: 50560 },
  { match_number: 14, stage: 'group', match_date: '1970-06-03T16:00:00-06:00', home_code: 'BRA', away_code: 'TCH', home_score: 4, away_score: 1, venue_slug: 'estadio-jalisco', referee: 'Ramón Barreto', attendance: 52897, notes: 'Pelé prueba de chilena, Jairzinho doblete' },
  { match_number: 15, stage: 'group', match_date: '1970-06-06T16:00:00-06:00', home_code: 'ROU', away_code: 'TCH', home_score: 2, away_score: 1, venue_slug: 'estadio-jalisco', referee: 'Bob Davidson', attendance: 56818 },
  { match_number: 16, stage: 'group', match_date: '1970-06-07T12:00:00-06:00', home_code: 'BRA', away_code: 'ENG', home_score: 1, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Abraham Klein', attendance: 66000, notes: '★ EL ABRAZO PELÉ-BOBBY MOORE. Banks le hace a Pelé la PARADA DEL SIGLO (cabezazo abajo de Pelé desde 5m, desviado al palo). Jairzinho marca el unico gol. Foto Mexican Smile al final' },
  { match_number: 17, stage: 'group', match_date: '1970-06-10T16:00:00-06:00', home_code: 'BRA', away_code: 'ROU', home_score: 3, away_score: 2, venue_slug: 'estadio-jalisco', referee: 'Ferdinand Marschall', attendance: 50804, notes: 'Pelé marca 2 + Jairzinho 1 (sigue su racha)' },
  { match_number: 18, stage: 'group', match_date: '1970-06-11T16:00:00-06:00', home_code: 'ENG', away_code: 'TCH', home_score: 1, away_score: 0, venue_slug: 'estadio-jalisco', referee: 'Roger Machin', attendance: 49292 },
  // ── GROUP 4 (PER, FRG, BUL, MAR) ── León ────────────────
  { match_number: 19, stage: 'group', match_date: '1970-06-02T16:00:00-06:00', home_code: 'PER', away_code: 'BUL', home_score: 3, away_score: 2, venue_slug: 'estadio-nou-camp-leon', referee: 'Aurelio Angonese', attendance: 13765, notes: 'Peru pierde 0-2 al descanso, remonta tras terremoto que destruyo Yungay (50.000 muertos) 5 dias antes' },
  { match_number: 20, stage: 'group', match_date: '1970-06-03T16:00:00-06:00', home_code: 'FRG', away_code: 'MAR', home_score: 2, away_score: 1, venue_slug: 'estadio-nou-camp-leon', referee: 'Laurens van Ravens', attendance: 12942, notes: 'MAR primera selección africana (excepto Egipto 1934) en debutar en Mundial' },
  { match_number: 21, stage: 'group', match_date: '1970-06-06T16:00:00-06:00', home_code: 'PER', away_code: 'MAR', home_score: 3, away_score: 0, venue_slug: 'estadio-nou-camp-leon', referee: 'Andriy Bostan', attendance: 13537 },
  { match_number: 22, stage: 'group', match_date: '1970-06-07T16:00:00-06:00', home_code: 'FRG', away_code: 'BUL', home_score: 5, away_score: 2, venue_slug: 'estadio-nou-camp-leon', referee: 'Jose Maria Codesal', attendance: 12710, notes: 'Gerd Müller hat-trick' },
  { match_number: 23, stage: 'group', match_date: '1970-06-10T16:00:00-06:00', home_code: 'FRG', away_code: 'PER', home_score: 3, away_score: 1, venue_slug: 'estadio-nou-camp-leon', referee: 'Aurelio Angonese', attendance: 17875, notes: 'Müller hat-trick (sera Bota de Oro con 10)' },
  { match_number: 24, stage: 'group', match_date: '1970-06-11T16:00:00-06:00', home_code: 'BUL', away_code: 'MAR', home_score: 1, away_score: 1, venue_slug: 'estadio-nou-camp-leon', referee: 'Rudolf Scheurer', attendance: 12299 },
  // ── CUARTOS ── 14 jun ────────────────────────────────────
  { match_number: 25, stage: 'qf', match_date: '1970-06-14T12:00:00-06:00', home_code: 'URU', away_code: 'URS', home_score: 1, away_score: 0, home_et: 1, away_et: 0, venue_slug: 'estadio-azteca', referee: 'Laurens van Ravens', attendance: 70000, notes: 'Esparrago gol min 117 prorroga' },
  { match_number: 26, stage: 'qf', match_date: '1970-06-14T16:00:00-06:00', home_code: 'ITA', away_code: 'MEX', home_score: 4, away_score: 1, venue_slug: 'estadio-luis-dosal-toluca', referee: 'Rudolf Scheurer', attendance: 26851, notes: 'MEX iba 1-0 al descanso (gonzález 13). Italia despierta segundo tiempo. Riva 2, Domenghini, Rivera' },
  { match_number: 27, stage: 'qf', match_date: '1970-06-14T16:00:00-06:00', home_code: 'BRA', away_code: 'PER', home_score: 4, away_score: 2, venue_slug: 'estadio-jalisco', referee: 'Vital Loraux', attendance: 54233, notes: 'Pelé asistencia (no marca), Jairzinho 1' },
  { match_number: 28, stage: 'qf', match_date: '1970-06-14T16:00:00-06:00', home_code: 'FRG', away_code: 'ENG', home_score: 3, away_score: 2, home_et: 3, away_et: 2, venue_slug: 'estadio-nou-camp-leon', referee: 'Ángel Coerezza', attendance: 23357, notes: 'ENG iba 2-0 al 50. Bonetti (sustituto de Banks enfermo) falla en los 3 goles. Beckenbauer empata desde 30m. Müller 3-2 prorroga. Revancha de la final 1966' },
  // ── SEMIS ── 17 jun ──────────────────────────────────────
  { match_number: 29, stage: 'sf', match_date: '1970-06-17T16:00:00-06:00', home_code: 'ITA', away_code: 'FRG', home_score: 4, away_score: 3, home_et: 4, away_et: 3, venue_slug: 'estadio-azteca', referee: 'Arturo Yamasaki', attendance: 102444, notes: '★ EL PARTIDO DEL SIGLO. 1-0 Boninsegna min 8. FRG empata Schnellinger min 90 sumando 3 minutos descuento. PRORROGA: Müller 2-1 (94), Burgnich 2-2 (98), Riva 3-2 (104), Müller 3-3 (110), Rivera 4-3 (111). 5 goles en prorroga. Beckenbauer juega con BRAZO ROTO EN CABESTRILLO. Placa en Azteca conmemorativa' },
  { match_number: 30, stage: 'sf', match_date: '1970-06-17T16:00:00-06:00', home_code: 'BRA', away_code: 'URU', home_score: 3, away_score: 1, venue_slug: 'estadio-jalisco', referee: 'José Luis Cantor', attendance: 51261, notes: 'Brasil revancha del Maracanazo 20 anios antes. Pelé asistencia, Rivelino, Jairzinho (sigue racha)' },
  // ── 3er PUESTO ── 20 jun ─────────────────────────────────
  { match_number: 31, stage: '3rd', match_date: '1970-06-20T16:00:00-06:00', home_code: 'FRG', away_code: 'URU', home_score: 1, away_score: 0, venue_slug: 'estadio-azteca', referee: 'Antonio Sbardella', attendance: 104403 },
  // ── FINAL ── 21 jun ──────────────────────────────────────
  { match_number: 32, stage: 'final', match_date: '1970-06-21T12:00:00-06:00', home_code: 'BRA', away_code: 'ITA', home_score: 4, away_score: 1, venue_slug: 'estadio-azteca', referee: 'Rudolf Glöckner', attendance: 107412, notes: '★ BRASIL ETERNO TRICAMPEON. Pelé 1-0 al 18 (cabezazo), Boninsegna 1-1 al 37, Gerson 2-1 al 66, Jairzinho 3-1 al 71 (gol en TODOS los partidos = record vigente), CARLOS ALBERTO 4-1 al 86 ★ EL GOL DEL SIGLO ★ (jugada coral, 9 toques, pase telegrafiado Pelé sin mirar, remate Alberto desde la derecha). Brasil se queda en propiedad la Copa Jules Rimet (regalo FIFA al tricampeon; robada 1983 nunca recuperada)' },
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

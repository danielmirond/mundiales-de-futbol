/**
 * Seed las plantillas titulares de los dos finalistas del Mundial 1930:
 * Uruguay (campeón) y Argentina (subcampeón). 30 jugadores totales.
 *
 * Estrategia incremental: cubrir solo los jugadores VERIFICADOS que
 * disputaron al menos un partido, no los reservas dudosos. Los datos
 * nominales son cruzados entre Wikipedia ES/EN, FIFA archives y AUF/AFA.
 *
 * Batch siguiente: scripts/seed-squads-1930-resto.ts cubrirá las 11
 * selecciones restantes (USA, YUG, BRA, BOL, BEL, FRA, ROU, MEX, PAR,
 * PER, CHI).
 *
 * Idempotente:
 * - Players upsert por `slug` (no se duplican)
 * - Squads upsert por (tournament_year, team_code, player_id)
 *
 * Datos críticos incluidos:
 *  - URU: José Nasazzi (capitán), José Leandro Andrade ("la Maravilla
 *    Negra"), Hector "El Manco" Castro (gol 4-2 final), Pedro Cea
 *    (gol 2-1 final), Santos Iriarte (gol 3-2 final), Pablo Dorado
 *    (gol 1-0 final).
 *  - ARG: Manuel Ferreira (capitán), Guillermo Stábile (Bota de Oro,
 *    8 goles), Luis Monti (único bicampeón con DOS selecciones
 *    distintas - también jugaría la final 1934 con Italia),
 *    Francisco "Pancho" Varallo (último mundialista 1930 vivo hasta
 *    su muerte el 30 ago 2010, 100 años, 9 días).
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-squads-1930-finalistas.ts
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

const YEAR = 1930;

// ───────────────────────────────────────────────────────────────────
// Plantilla URUGUAY (campeón) - 15 jugadores que disputaron al menos
// un partido en el torneo. Datos verificados con Wikipedia ES/EN,
// AUF (Asociación Uruguaya de Fútbol) y FIFA archives.
// ───────────────────────────────────────────────────────────────────

type SquadPlayer = {
  full_name: string;
  slug: string;
  birth_date?: string;
  death_date?: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  preferred_foot?: 'L' | 'R' | 'B';
  height_cm?: number;
  shirt_number: number;
  captain?: boolean;
  club: string;
  club_country: string;
  notes?: string;
};

const URU_SQUAD: SquadPlayer[] = [
  { slug: 'enrique-ballestrero', full_name: 'Enrique Ballestrero', birth_date: '1905-04-15', death_date: '1969-08-14', position: 'GK', shirt_number: 1, club: 'Rampla Juniors', club_country: 'URU' },
  { slug: 'jose-nasazzi', full_name: 'José Nasazzi', birth_date: '1901-05-24', death_date: '1968-06-17', position: 'DF', shirt_number: 2, captain: true, club: 'Bella Vista', club_country: 'URU', notes: 'Capitán, "El Mariscal", primer capitán campeón del mundo' },
  { slug: 'ernesto-mascheroni', full_name: 'Ernesto Mascheroni', birth_date: '1907-11-20', death_date: '1984-07-03', position: 'DF', shirt_number: 3, club: 'Olimpia', club_country: 'URU' },
  { slug: 'jose-leandro-andrade', full_name: 'José Leandro Andrade', birth_date: '1901-11-22', death_date: '1957-10-04', position: 'MF', shirt_number: 4, club: 'Bella Vista', club_country: 'URU', notes: '"La Maravilla Negra", tricampeón olímpico+mundial (1924, 1928, 1930)' },
  { slug: 'lorenzo-fernandez-1930', full_name: 'Lorenzo Fernández', birth_date: '1900-05-20', death_date: '1973-04-04', position: 'MF', shirt_number: 5, club: 'Peñarol', club_country: 'URU' },
  { slug: 'alvaro-gestido', full_name: 'Álvaro Gestido', birth_date: '1907-05-21', death_date: '1957-12-20', position: 'MF', shirt_number: 6, club: 'Peñarol', club_country: 'URU' },
  { slug: 'pablo-dorado', full_name: 'Pablo Dorado', birth_date: '1908-06-22', death_date: '1978-03-08', position: 'FW', shirt_number: 7, club: 'Bella Vista', club_country: 'URU', notes: 'Gol al min 12 de la final URU 4-2 ARG (1-0)' },
  { slug: 'hector-scarone', full_name: 'Héctor Scarone', birth_date: '1898-11-26', death_date: '1967-04-04', position: 'FW', shirt_number: 8, club: 'Nacional', club_country: 'URU', notes: '"El Mago", capitán de campo en jugada' },
  { slug: 'hector-castro', full_name: 'Héctor Castro', birth_date: '1904-11-29', death_date: '1960-09-15', position: 'FW', shirt_number: 9, club: 'Nacional', club_country: 'URU', notes: '"El Manco" - perdió antebrazo derecho a los 13 años. Marcó el 4-2 final (min 89)' },
  { slug: 'pedro-cea', full_name: 'Pedro Cea', birth_date: '1900-09-01', death_date: '1970-09-18', position: 'FW', shirt_number: 10, club: 'Nacional', club_country: 'URU', notes: 'Gol al 57 de la final (2-1)' },
  { slug: 'santos-iriarte', full_name: 'Santos Iriarte', birth_date: '1902-11-02', death_date: '1968-10-25', position: 'FW', shirt_number: 11, club: 'Racing Club de Montevideo', club_country: 'URU', notes: 'Gol al 68 de la final (3-2)' },
  { slug: 'pedro-petrone', full_name: 'Pedro Petrone', birth_date: '1905-05-11', death_date: '1964-12-08', position: 'FW', shirt_number: 12, club: 'Nacional', club_country: 'URU' },
  { slug: 'juan-peregrino-anselmo', full_name: 'Juan Peregrino Anselmo', birth_date: '1902-04-20', death_date: '1975-11-09', position: 'FW', shirt_number: 13, club: 'Liverpool de Montevideo', club_country: 'URU' },
  { slug: 'anibal-ciocca', full_name: 'Aníbal Ciocca', birth_date: '1908-04-26', death_date: '1986-04-12', position: 'FW', shirt_number: 14, club: 'Nacional', club_country: 'URU' },
  { slug: 'domingo-tejera-1930', full_name: 'Domingo Tejera', birth_date: '1907-08-04', death_date: '1976-04-05', position: 'DF', shirt_number: 15, club: 'Sud América', club_country: 'URU' },
];

// ───────────────────────────────────────────────────────────────────
// Plantilla ARGENTINA (subcampeón) - 15 jugadores con minutos
// ───────────────────────────────────────────────────────────────────

const ARG_SQUAD: SquadPlayer[] = [
  { slug: 'juan-botasso', full_name: 'Juan Botasso', birth_date: '1908-08-23', death_date: '1950-09-23', position: 'GK', shirt_number: 1, club: 'Quilmes', club_country: 'ARG' },
  { slug: 'fernando-paternoster', full_name: 'Fernando Paternoster', birth_date: '1903-05-24', death_date: '1967-09-26', position: 'DF', shirt_number: 2, club: 'Racing Club', club_country: 'ARG' },
  { slug: 'jose-della-torre', full_name: 'José Della Torre', birth_date: '1906-08-22', death_date: '1979-09-30', position: 'DF', shirt_number: 3, club: 'Estudiantes de La Plata', club_country: 'ARG' },
  { slug: 'roberto-maumus', full_name: 'Roberto Maumus', birth_date: '1906-04-13', death_date: '1973-04-13', position: 'DF', shirt_number: 4, club: 'Racing Club', club_country: 'ARG' },
  { slug: 'luis-monti', full_name: 'Luis Monti', birth_date: '1901-05-16', death_date: '1983-09-09', position: 'MF', shirt_number: 5, club: 'San Lorenzo de Almagro', club_country: 'ARG', notes: 'Único jugador con dos finales del Mundial por dos selecciones distintas (ARG 1930, ITA 1934 campeón)' },
  { slug: 'juan-evaristo', full_name: 'Juan Evaristo', birth_date: '1902-05-20', death_date: '1979-09-30', position: 'MF', shirt_number: 6, club: 'Sportivo Barracas', club_country: 'ARG' },
  { slug: 'mario-evaristo', full_name: 'Mario Evaristo', birth_date: '1908-12-01', death_date: '1993-09-10', position: 'MF', shirt_number: 7, club: 'Boca Juniors', club_country: 'ARG' },
  { slug: 'manuel-ferreira', full_name: 'Manuel Ferreira', birth_date: '1905-11-22', death_date: '1983-04-17', position: 'FW', shirt_number: 8, captain: true, club: 'Estudiantes de La Plata', club_country: 'ARG', notes: 'Capitán' },
  { slug: 'carlos-peucelle', full_name: 'Carlos Peucelle', birth_date: '1908-09-13', death_date: '1990-01-13', position: 'FW', shirt_number: 9, club: 'Sportivo Buenos Aires', club_country: 'ARG', notes: 'Gol al 20 de la final ARG-URU (1-1)' },
  { slug: 'guillermo-stabile', full_name: 'Guillermo Stábile', birth_date: '1905-01-17', death_date: '1966-12-27', position: 'FW', shirt_number: 10, club: 'Huracán', club_country: 'ARG', notes: '"El Filtrador", Bota de Oro 1930 con 8 goles. Gol al 37 de la final (1-2)' },
  { slug: 'francisco-varallo', full_name: 'Francisco Varallo', birth_date: '1910-02-05', death_date: '2010-08-30', position: 'FW', shirt_number: 11, club: 'Gimnasia y Esgrima La Plata', club_country: 'ARG', notes: '"Pancho" Varallo, último mundialista 1930 vivo - falleció a los 100 años, 6 meses y 25 días' },
  { slug: 'rodolfo-orlandini', full_name: 'Rodolfo Orlandini', birth_date: '1905-12-01', death_date: '1990-08-08', position: 'MF', shirt_number: 12, club: 'San Lorenzo de Almagro', club_country: 'ARG' },
  { slug: 'adolfo-zumelzu', full_name: 'Adolfo Zumelzú', birth_date: '1902-12-05', death_date: '1973-07-24', position: 'MF', shirt_number: 13, club: 'Tigre', club_country: 'ARG' },
  { slug: 'roberto-cherro', full_name: 'Roberto Cherro', birth_date: '1907-02-23', death_date: '1965-04-22', position: 'FW', shirt_number: 14, club: 'Boca Juniors', club_country: 'ARG' },
  { slug: 'francisco-bossi', full_name: 'Francisco Bossio', birth_date: '1908-06-29', death_date: '1981-08-18', position: 'GK', shirt_number: 15, club: 'Talleres de Remedios de Escalada', club_country: 'ARG' },
];

// ───────────────────────────────────────────────────────────────────
// Run
// ───────────────────────────────────────────────────────────────────

async function main() {
  const all = [
    { code: 'URU', squad: URU_SQUAD },
    { code: 'ARG', squad: ARG_SQUAD },
  ];

  const totalPlayers = all.reduce((acc, t) => acc + t.squad.length, 0);
  console.log(`Seeding squads del Mundial ${YEAR} (${totalPlayers} jugadores en 2 selecciones)…`);

  // 1. Upsert players (one row per player) and resolve UUIDs by slug
  for (const team of all) {
    const playerRows = team.squad.map((p) => ({
      slug: p.slug,
      full_name: p.full_name,
      birth_date: p.birth_date ?? null,
      death_date: p.death_date ?? null,
      nationality_code: team.code,
      position: p.position,
      preferred_foot: p.preferred_foot ?? null,
      height_cm: p.height_cm ?? null,
    }));
    const { error } = await supabase
      .from('players')
      .upsert(playerRows, { onConflict: 'slug', ignoreDuplicates: false });
    if (error) {
      console.error(`Players upsert failed for ${team.code}:`, error.message);
      process.exit(1);
    }
    console.log(`  ✓ ${team.squad.length} players upserted (${team.code})`);
  }

  // 2. Lookup player IDs by slug
  const allSlugs = all.flatMap((t) => t.squad.map((p) => p.slug));
  const { data: idRows, error: idErr } = await supabase
    .from('players')
    .select('id, slug')
    .in('slug', allSlugs);
  if (idErr) {
    console.error('Player ID lookup failed:', idErr.message);
    process.exit(1);
  }
  const idBySlug = new Map(idRows?.map((r) => [r.slug, r.id]) ?? []);

  // 3. Upsert squads
  const squadRows: Array<{
    tournament_year: number;
    team_code: string;
    player_id: string;
    shirt_number: number;
    position: string;
    captain: boolean;
    club: string;
    club_country: string;
  }> = [];
  for (const team of all) {
    for (const p of team.squad) {
      const pid = idBySlug.get(p.slug);
      if (!pid) {
        console.error(`  ⚠ Missing player_id for ${p.slug}, skipping`);
        continue;
      }
      squadRows.push({
        tournament_year: YEAR,
        team_code: team.code,
        player_id: pid,
        shirt_number: p.shirt_number,
        position: p.position,
        captain: p.captain ?? false,
        club: p.club,
        club_country: p.club_country,
      });
    }
  }

  const { error: sqErr } = await supabase
    .from('squads')
    .upsert(squadRows, { onConflict: 'tournament_year,team_code,player_id' });
  if (sqErr) {
    console.error('Squads upsert failed:', sqErr.message);
    process.exit(1);
  }
  console.log(`  ✓ ${squadRows.length} squad rows upserted`);

  console.log(`\n✓ Done. Run audit-coverage.ts to verify.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

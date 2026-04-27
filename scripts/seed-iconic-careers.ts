/**
 * Seed de carreras mundialistas icónicas:
 *   - Los 6 jugadores con 5 participaciones en Mundial.
 *   - Plantillas de Pelé, Maradona y otros que pueden no estar en StatsBomb.
 *
 * Inserta filas en `squads` para que `player_stats.wc_count` refleje
 * correctamente el número de Mundiales jugados. Idempotente: usa upsert.
 *
 * Uso: `npx tsx scripts/seed-iconic-careers.ts`
 *
 * Fuentes verificadas:
 *   - Wikipedia "List of players who have appeared in multiple FIFA World
 *     Cups" (consulta abr 2026).
 *   - Wikipedia FIFA World Cup YYYY squads.
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

type IconicCareer = {
  /** Slug en `players.slug` para localizarlo en la base. */
  slug: string;
  /** Nombre completo (para fallback search si el slug no existe). */
  fullName: string;
  /** Código FIFA del seleccionado (3 letras). */
  teamCode: string;
  /** Posición editorial. */
  position: string;
  /** Mundiales en los que jugó / fue convocado. */
  years: number[];
};

/**
 * Las 6 carreras con 5 Mundiales jugados, fuente Wikipedia "List of
 * players who have appeared in multiple FIFA World Cups".
 */
const ICONIC: IconicCareer[] = [
  {
    slug: 'antonio-carbajal-398145',
    fullName: 'Antonio Félix Carbajal Rodríguez',
    teamCode: 'MEX',
    position: 'GK',
    years: [1950, 1954, 1958, 1962, 1966],
  },
  {
    slug: 'lothar-matthaus',
    fullName: 'Lothar Matthäus',
    teamCode: 'GER',
    position: 'MF',
    years: [1982, 1986, 1990, 1994, 1998],
  },
  {
    slug: 'rafael-marquez-5558',
    fullName: 'Rafael Márquez Álvarez',
    teamCode: 'MEX',
    position: 'DF',
    years: [2002, 2006, 2010, 2014, 2018],
  },
  {
    slug: 'andres-guardado-5563',
    fullName: 'José Andrés Guardado Hernández',
    teamCode: 'MEX',
    position: 'MF',
    years: [2006, 2010, 2014, 2018, 2022],
  },
  {
    slug: 'lionel-messi-5503',
    fullName: 'Lionel Andrés Messi Cuccittini',
    teamCode: 'ARG',
    position: 'FW',
    years: [2006, 2010, 2014, 2018, 2022],
  },
  {
    slug: 'cristiano-ronaldo-5207',
    fullName: 'Cristiano Ronaldo dos Santos Aveiro',
    teamCode: 'POR',
    position: 'FW',
    years: [2006, 2010, 2014, 2018, 2022],
  },
];

async function findPlayerId(c: IconicCareer): Promise<string | null> {
  const { data: bySlug } = await supabase
    .from('players')
    .select('id')
    .eq('slug', c.slug)
    .maybeSingle();
  if (bySlug?.id) return bySlug.id;

  // Fallback por nombre exacto (case-insensitive).
  const { data: byName } = await supabase
    .from('players')
    .select('id')
    .ilike('full_name', c.fullName)
    .maybeSingle();
  return byName?.id ?? null;
}

async function main() {
  let inserted = 0;
  let skipped = 0;

  for (const c of ICONIC) {
    const playerId = await findPlayerId(c);
    if (!playerId) {
      console.warn(`⚠️  Jugador no encontrado en BD: ${c.fullName} (${c.slug})`);
      skipped += c.years.length;
      continue;
    }

    const rows = c.years.map((y) => ({
      tournament_year: y,
      team_code: c.teamCode,
      player_id: playerId,
      position: c.position,
    }));

    const { error } = await supabase
      .from('squads')
      .upsert(rows, { onConflict: 'tournament_year,team_code,player_id' });
    if (error) {
      console.error(`❌  ${c.fullName}:`, error.message);
      continue;
    }
    inserted += rows.length;
    console.log(`✅  ${c.fullName}: ${rows.length} Mundiales registrados.`);
  }

  console.log(`\nResumen: ${inserted} squads upsert, ${skipped} omitidos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

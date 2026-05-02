/**
 * Seed de jugadores históricos legendarios que faltan en `players`.
 *
 * Inserta 10 leyendas mundialistas (campeones España 2010, defensas
 * italianos, atacantes brasileños y los "GOATs" europeos) en la tabla
 * `players` para que aparezcan en /jugadores/[slug] y los rankings
 * de records.
 *
 * Después de insertar, ejecuta `seed-iconic-careers.ts` para añadir
 * sus participaciones en Mundiales (squads).
 *
 * Uso: `npx tsx scripts/seed-historical-legends.ts`
 *
 * Idempotente: usa upsert por `slug`.
 *
 * Fuentes: Wikipedia ES + EN.
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

type LegendPlayer = {
  slug: string;
  fullName: string;
  knownAs: string;
  nationalityCode: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  birthDate: string; // YYYY-MM-DD
  /** Mundiales en los que jugó realmente (no convocatorias sin minutos). */
  worldCupYears: number[];
  /** Equipo (FIFA code) en los Mundiales. */
  teamCode: string;
};

const LEGENDS: LegendPlayer[] = [
  {
    slug: 'iker-casillas-fernandez',
    fullName: 'Iker Casillas Fernández',
    knownAs: 'Iker Casillas',
    nationalityCode: 'ESP',
    position: 'GK',
    birthDate: '1981-05-20',
    worldCupYears: [2002, 2006, 2010, 2014],
    teamCode: 'ESP',
  },
  {
    slug: 'xavi-hernandez-creus',
    fullName: 'Xavier Hernández Creus',
    knownAs: 'Xavi',
    nationalityCode: 'ESP',
    position: 'MF',
    birthDate: '1980-01-25',
    worldCupYears: [2002, 2006, 2010, 2014],
    teamCode: 'ESP',
  },
  {
    slug: 'carles-puyol-saforcada',
    fullName: 'Carles Puyol Saforcada',
    knownAs: 'Puyol',
    nationalityCode: 'ESP',
    position: 'DF',
    birthDate: '1978-04-13',
    worldCupYears: [2002, 2006, 2010],
    teamCode: 'ESP',
  },
  {
    slug: 'paolo-maldini',
    fullName: 'Paolo Cesare Maldini',
    knownAs: 'Paolo Maldini',
    nationalityCode: 'ITA',
    position: 'DF',
    birthDate: '1968-06-26',
    worldCupYears: [1990, 1994, 1998, 2002],
    teamCode: 'ITA',
  },
  {
    slug: 'gianluigi-buffon',
    fullName: 'Gianluigi Buffon',
    knownAs: 'Gigi Buffon',
    nationalityCode: 'ITA',
    position: 'GK',
    birthDate: '1978-01-28',
    worldCupYears: [2002, 2006, 2010, 2014],
    teamCode: 'ITA',
  },
  {
    slug: 'zinedine-zidane',
    fullName: 'Zinedine Zidane',
    knownAs: 'Zidane',
    nationalityCode: 'FRA',
    position: 'MF',
    birthDate: '1972-06-23',
    worldCupYears: [1998, 2002, 2006],
    teamCode: 'FRA',
  },
  {
    slug: 'ronaldo-luis-nazario-de-lima',
    fullName: 'Ronaldo Luís Nazário de Lima',
    knownAs: 'Ronaldo',
    nationalityCode: 'BRA',
    position: 'FW',
    birthDate: '1976-09-18',
    worldCupYears: [1994, 1998, 2002, 2006],
    teamCode: 'BRA',
  },
  {
    slug: 'ronaldo-de-assis-moreira',
    fullName: 'Ronaldo de Assis Moreira',
    knownAs: 'Ronaldinho',
    nationalityCode: 'BRA',
    position: 'FW',
    birthDate: '1980-03-21',
    worldCupYears: [2002, 2006, 2010],
    teamCode: 'BRA',
  },
  {
    slug: 'miroslav-klose',
    fullName: 'Miroslav Józef Klose',
    knownAs: 'Miroslav Klose',
    nationalityCode: 'GER',
    position: 'FW',
    birthDate: '1978-06-09',
    worldCupYears: [2002, 2006, 2010, 2014],
    teamCode: 'GER',
  },
  {
    slug: 'steven-gerrard',
    fullName: 'Steven George Gerrard',
    knownAs: 'Steven Gerrard',
    nationalityCode: 'ENG',
    position: 'MF',
    birthDate: '1980-05-30',
    worldCupYears: [2006, 2010, 2014],
    teamCode: 'ENG',
  },
];

async function main() {
  let upserted = 0;
  let squadsAdded = 0;

  for (const legend of LEGENDS) {
    // 1. Upsert player.
    const { data: player, error: pErr } = await supabase
      .from('players')
      .upsert(
        {
          slug: legend.slug,
          full_name: legend.fullName,
          known_as: legend.knownAs,
          nationality_code: legend.nationalityCode,
          position: legend.position,
          birth_date: legend.birthDate,
        },
        { onConflict: 'slug' },
      )
      .select('id, full_name')
      .single();

    if (pErr || !player) {
      console.error(`❌ ${legend.fullName}:`, pErr?.message ?? 'sin datos');
      continue;
    }
    upserted++;
    console.log(`✅ ${legend.fullName} → ${player.id}`);

    // 2. Add squads for each World Cup played.
    const squadRows = legend.worldCupYears.map((y) => ({
      tournament_year: y,
      team_code: legend.teamCode,
      player_id: player.id,
      position: legend.position,
    }));

    const { error: sErr } = await supabase
      .from('squads')
      .upsert(squadRows, { onConflict: 'tournament_year,team_code,player_id' });

    if (sErr) {
      console.error(`   ⚠️ squads error:`, sErr.message);
    } else {
      squadsAdded += squadRows.length;
      console.log(`   ↳ ${squadRows.length} Mundiales registrados`);
    }
  }

  console.log(`\nResumen: ${upserted} jugadores upserted, ${squadsAdded} squads añadidos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

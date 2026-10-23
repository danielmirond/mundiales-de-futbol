/* eslint-disable @typescript-eslint/no-explicit-any -- JSON externo sin tipar */
/**
 * Copia diaria de football-charts.com (Data by football-charts.com):
 *  - Primera y Segunda Federación (ESPN no las tiene): clasificación, resultados
 *    y próximos partidos de cada grupo.
 *  - Minuto de los goles (tramos de 15') de las ligas con ficha de equipo.
 *
 * API sin clave: 300 peticiones/día y 20/min por IP → ~27 peticiones, a 3,5 s.
 * Se actualiza una vez al día (~06:00 UTC); todas las horas vienen en UTC.
 * Si una petición falla se conserva lo anterior de ese grupo o liga.
 *
 * Uso: npx tsx scripts/footballcharts/snapshot.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API = 'https://footballcharts-backend.onrender.com/api/v1';
const OUT = 'src/data/footballcharts.json';
const GROUPS = ['primera1', 'primera2', 'segunda1', 'segunda2', 'segunda3', 'segunda4', 'segunda5'];
const TIMING = ['spain1', 'spain2', 'premier', 'italy1', 'germany1', 'france1'];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let calls = 0;
async function get(path: string): Promise<any | null> {
  for (let i = 0; i < 3; i++) {
    if (calls++) await sleep(3500);
    try {
      const r = await fetch(`${API}${path}`, { headers: { 'User-Agent': 'mundiales-de-futbol.com snapshot' }, signal: AbortSignal.timeout(90_000) });
      if (r.ok) return await r.json();
      if (r.status === 429) await sleep(30_000);
      else return null;
    } catch {
      /* Render despierta el backend en frío: reintento */
    }
  }
  return null;
}

/** Hora UTC «HH:MM(:SS)» + fecha → ISO; sin hora, mediodía UTC. */
const iso = (date: string, time?: string | null) => `${date}T${(time || '12:00').slice(0, 5)}:00Z`;

async function main() {
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { groups: {}, timing: {} };
const out: any = { updatedAt: new Date().toISOString(), attribution: 'Data by football-charts.com', groups: { ...prev.groups }, timing: { ...prev.timing } };

const meta = await get('/leagues/');
const leagues: any[] = meta?.leagues ?? [];
const seasonOf = (code: string) => leagues.find((l) => l.league === code)?.seasons?.[0];

for (const code of GROUPS) {
  const season = seasonOf(code);
  if (!season) continue;
  const [table, results, fixtures] = [await get(`/leagues/${code}/table/?season=${season}`), await get(`/leagues/${code}/results/?season=${season}`), await get(`/leagues/${code}/fixtures/`)];
  if (!table?.table || !results?.matches) { console.log(`${code}: sin datos, se conserva lo anterior`); continue; }
  out.groups[code] = {
    season,
    sourceUrl: table.source_url ?? results.source_url,
    table: table.table.map((r: any) => ({
      pos: r.position, team: r.team, pj: r.played, g: r.won, e: r.drawn, p: r.lost,
      gf: r.goals_for, gc: r.goals_against, dg: r.goal_difference, pts: r.points, form: r.last_5_form ?? '',
    })),
    results: results.matches.map((m: any) => ({
      date: m.kickoff_utc ?? iso(m.date, m.time), home: m.homeTeam, away: m.awayTeam, score: m.score, ht: m.ht_result,
    })),
    fixtures: (fixtures?.matches ?? []).map((m: any) => ({ date: iso(m.match_date, m.time), home: m.home_team, away: m.away_team })),
  };
  console.log(`${code}: ${out.groups[code].table.length} equipos, ${out.groups[code].results.length} resultados, ${out.groups[code].fixtures.length} próximos`);
}

for (const code of TIMING) {
  const season = seasonOf(code);
  const t = season ? await get(`/leagues/${code}/goal-timing/?season=${season}`) : null;
  if (!t?.data) { console.log(`${code}: minuto de goles sin datos`); continue; }
  out.timing[code] = {
    season,
    bins: t.time_bins,
    matches: t.stats?.match_count ?? 0,
    league: t.stats?.period_totals ?? [],
    teams: Object.fromEntries(t.data.map((x: any) => [x.team, { total: x.total, goals: x.goals, late: x.late_share_pct, firstHalf: x.first_half_pct }])),
  };
  console.log(`${code}: minuto de goles de ${t.data.length} equipos (${t.stats?.match_count} partidos)`);
}

writeFileSync(OUT, JSON.stringify(out) + '\n');
console.log(`${calls} peticiones · ${OUT}`);
}

main();

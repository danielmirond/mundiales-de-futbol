/* eslint-disable @typescript-eslint/no-explicit-any -- JSON externo sin tipar */
/**
 * Copia diaria de balonmano desde Highlightly (handball.highlightly.net, plan
 * gratuito: 100 peticiones/día; sus condiciones permiten usar y guardar los datos,
 * sin apuestas ni reventa del acceso). Clasificación y partidos de la Liga Asobal,
 * Liga Guerreras, Champions de la EHF y European League.
 *
 * La API solo devuelve una ventana de partidos (unas jornadas alrededor de hoy):
 * aquí se ACUMULAN por id para tener la temporada completa con el tiempo.
 * ~10 peticiones por ejecución. Si algo falla se conserva lo anterior.
 *
 * Uso: npx tsx --env-file=.env.local scripts/balonmano/snapshot.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API = 'https://handball.highlightly.net';
const OUT = 'src/data/balonmano.json';
const KEY = process.env.HIGHLIGHTLY_API_KEY;

/** slug de competición del portal → liga y temporada en Highlightly (temporada = año en que acaba). */
export const LEAGUES: Record<string, { id: number; season: number }> = {
  'liga-asobal': { id: 88437, season: 2026 },
  'liga-guerreras': { id: 92692, season: 2026 },
  'champions-ehf': { id: 112265, season: 2026 },
  'ehf-european-league': { id: 124179, season: 2026 },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let calls = 0;
async function get(path: string): Promise<any | null> {
  for (let i = 0; i < 2; i++) {
    if (calls++) await sleep(1200);
    try {
      const r = await fetch(`${API}${path}`, { headers: { 'x-rapidapi-key': KEY! }, signal: AbortSignal.timeout(40_000) });
      if (r.ok) return await r.json();
      console.log(`${path}: HTTP ${r.status}`);
      if (r.status !== 429) return null;
      await sleep(15_000);
    } catch { /* reintento */ }
  }
  return null;
}

const score = (s: string | null | undefined) => {
  const m = String(s ?? '').match(/(\d+)\s*-\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] as [number, number] : null;
};

async function main() {
  if (!KEY) { console.log('Falta HIGHLIGHTLY_API_KEY'); return; }
  const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { leagues: {} };
  const out: any = { updatedAt: new Date().toISOString(), source: 'Highlightly', leagues: { ...prev.leagues } };

  for (const [slug, { id, season }] of Object.entries(LEAGUES)) {
    const old = prev.leagues?.[slug] ?? {};
    const st = await get(`/standings?leagueId=${id}&season=${season}`);
    const groups = (st?.groups ?? []).map((g: any) => ({
      name: String(g.name ?? '').replace(/\s*\d{2}\/\d{2}/, '').trim(),
      rows: (g.standings ?? []).map((r: any) => ({ pos: r.position, team: r.team?.name, logo: r.team?.logo, pj: r.gamesPlayed, g: r.wins, e: r.draws, p: r.loses, gf: r.scoredGoals, gc: r.receivedGoals, pts: r.points })),
    }));
    const matches: Record<string, any> = Object.fromEntries((old.matches ?? []).map((m: any) => [String(m.id), m]));
    for (let offset = 0; offset < 400; offset += 100) {
      const d = await get(`/matches?leagueId=${id}&season=${season}&limit=100&offset=${offset}`);
      for (const m of d?.data ?? []) {
        matches[String(m.id)] = {
          id: m.id, date: m.date, week: m.week ?? null, home: m.homeTeam?.name, away: m.awayTeam?.name,
          state: m.state?.description ?? '', score: score(m.state?.score?.current), half: score(m.state?.score?.firstHalf),
        };
      }
      if (!d?.data || (d.pagination?.totalCount ?? 0) <= offset + 100) break;
    }
    out.leagues[slug] = {
      season, groups: groups.length ? groups : old.groups ?? [],
      matches: Object.values(matches).sort((a: any, b: any) => a.date.localeCompare(b.date)),
    };
    console.log(`${slug}: ${groups.length} grupos, ${Object.keys(matches).length} partidos acumulados`);
  }
  writeFileSync(OUT, JSON.stringify(out) + '\n');
  console.log(`${calls} peticiones · ${OUT}`);
}

main();

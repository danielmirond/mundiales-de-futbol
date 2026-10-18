/**
 * Copia de la trayectoria de pilotos de F1 desde Jolpica (sucesora de Ergast).
 * Pilotos: la parrilla del año en curso más los españoles y leyendas de LISTA.
 * Jolpica pide no pasar de 4 peticiones por segundo y 500 por hora: una cada 350 ms.
 *   npx tsx scripts/f1/snapshot.ts [--only alonso,sainz]
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { F1Driver, F1Snapshot, F1Season } from '../../src/lib/f1-history';

const OUT = join(process.cwd(), 'src/data/f1-pilotos.json');
const API = 'https://api.jolpi.ca/ergast/f1';
const GAP = 350;
/** Españoles y leyendas que se buscan aunque no estén en la parrilla actual. */
const LISTA = ['alonso', 'sainz', 'de_la_rosa', 'alguersuari', 'merhi', 'gene', 'michael_schumacher', 'senna', 'prost', 'vettel', 'raikkonen', 'button', 'rosberg', 'ricciardo', 'perez', 'bottas'];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function get(path: string): Promise<any> {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(`${API}${path}`, { headers: { 'User-Agent': 'mundiales-de-futbol.com (contacto@mundiales-de-futbol.com)' }, signal: AbortSignal.timeout(20_000) });
      await sleep(GAP);
      if (r.status === 429) { await sleep(5_000 * (i + 1)); continue; }
      if (!r.ok) return null;
      return (await r.json())?.MRData;
    } catch { await sleep(2_000 * (i + 1)); }
  }
  return null;
}
const total = async (path: string) => Number((await get(`${path}${path.includes('?') ? '&' : '?'}limit=1`))?.total ?? 0);
const firstRace = async (path: string) => {
  const r = (await get(`${path}?limit=1`))?.RaceTable?.Races?.[0];
  return r ? { season: Number(r.season), race: String(r.raceName) } : undefined;
};
const lastRace = async (path: string) => {
  const n = await total(path);
  if (!n) return undefined;
  const r = (await get(`${path}?limit=1&offset=${n - 1}`))?.RaceTable?.Races?.[0];
  return r ? { season: Number(r.season), race: String(r.raceName) } : undefined;
};
const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function driver(id: string): Promise<F1Driver | null> {
  const d = (await get(`/drivers/${id}.json`))?.DriverTable?.Drivers?.[0];
  if (!d) return null;
  const st = await get(`/drivers/${id}/driverstandings.json?limit=100`);
  const seasons: F1Season[] = ((st?.StandingsTable?.StandingsLists ?? []) as any[]).map((l) => {
    const x = l.DriverStandings?.[0] ?? {};
    return { season: Number(l.season), position: x.position ? Number(x.position) : null, points: Number(x.points ?? 0), wins: Number(x.wins ?? 0), teams: (x.Constructors ?? []).map((c: any) => String(c.name)) };
  });
  const [starts, wins, p2, p3, poles] = [
    await total(`/drivers/${id}/results.json`), await total(`/drivers/${id}/results/1.json`), await total(`/drivers/${id}/results/2.json`),
    await total(`/drivers/${id}/results/3.json`), await total(`/drivers/${id}/grid/1/results.json`),
  ];
  const name = `${d.givenName} ${d.familyName}`;
  return {
    id, slug: slugify(name), name, code: d.code, number: d.permanentNumber, nationality: d.nationality, birth: d.dateOfBirth,
    starts, wins, podiums: wins + p2 + p3, poles, titles: seasons.filter((s) => s.position === 1).map((s) => s.season),
    firstRace: await firstRace(`/drivers/${id}/results.json`),
    firstWin: wins ? await firstRace(`/drivers/${id}/results/1.json`) : undefined,
    lastWin: wins ? await lastRace(`/drivers/${id}/results/1.json`) : undefined,
    seasons,
  };
}

(async () => {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
  const grid = only ? [] : ((await get(`/${new Date().getUTCFullYear()}/drivers.json?limit=60`))?.DriverTable?.Drivers ?? []).map((x: any) => String(x.driverId));
  const ids = only ?? [...new Set([...grid, ...LISTA])];
  const prev: F1Snapshot = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { updatedAt: '', drivers: [] };
  const byId = new Map(prev.drivers.map((x) => [x.id, x]));
  for (const id of ids) {
    const x = await driver(id);
    if (x) { byId.set(id, x); console.log(`${x.name}: ${x.starts} carreras, ${x.wins} victorias, ${x.titles.length} títulos`); }
    else console.log(`${id}: sin datos (se conserva lo anterior)`);
  }
  const out: F1Snapshot = { updatedAt: new Date().toISOString(), drivers: [...byId.values()].sort((a, b) => b.wins - a.wins || b.starts - a.starts) };
  writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`${out.drivers.length} pilotos → ${OUT}`);
})();

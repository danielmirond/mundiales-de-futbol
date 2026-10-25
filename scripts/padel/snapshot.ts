/* eslint-disable @typescript-eslint/no-explicit-any -- JSON externo sin tipar */
/**
 * Copia diaria de pádel profesional (Premier Padel / FIP) desde Padel API
 * (padelapi.org, plan gratuito: uso comercial permitido, 50.000 peticiones/mes).
 * Ranking oficial masculino y femenino, torneos de la temporada (Major, P1, P2 y
 * Finals) con sus campeones, y cuadro del torneo en juego y del último jugado.
 * ~30 peticiones por ejecución. Si algo falla se conserva lo anterior.
 *
 * Uso: npx tsx --env-file=.env.local scripts/padel/snapshot.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API = 'https://padelapi.org/api';
const OUT = 'src/data/padel.json';
const TOKEN = process.env.PADELAPI_TOKEN;
const LEVELS = new Set(['major', 'p1', 'p2', 'finals']);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let calls = 0;
async function get(path: string): Promise<any | null> {
  for (let i = 0; i < 3; i++) {
    if (calls++) await sleep(700);
    try {
      const r = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' }, signal: AbortSignal.timeout(40_000) });
      if (r.ok) return await r.json();
      if (r.status === 429) { await sleep(20_000); continue; }
      console.log(`${path}: HTTP ${r.status}`);
      return null;
    } catch { /* reintento */ }
  }
  return null;
}

const pair = (team: any[] | undefined) => (team ?? []).map((p) => ({ id: p.id, name: p.name }));

async function allPages(path: string): Promise<any[]> {
  const out: any[] = [];
  for (let page = 1; page <= 6; page++) {
    const d = await get(`${path}${path.includes('?') ? '&' : '?'}per_page=50&page=${page}`);
    if (!d?.data) break;
    out.push(...d.data);
    if (page >= (d.meta?.last_page ?? 1)) break;
  }
  return out;
}

async function main() {
  if (!TOKEN) { console.log('Falta PADELAPI_TOKEN'); return; }
  const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
  const out: any = { ...prev, updatedAt: new Date().toISOString(), source: 'Padel API (padelapi.org)' };

  // Ranking oficial (top 40 de cada categoría).
  for (const cat of ['men', 'women']) {
    const d = await get(`/rankings?category=${cat}&per_page=40`);
    if (d?.data?.length) out[`ranking_${cat}`] = { date: d.data[0].date, rows: d.data.map((r: any) => ({ id: r.id, name: r.name, country: r.nationality, pos: r.ranking, diff: r.ranking_diff, points: r.points })) };
  }

  // Temporada en curso: la más reciente con torneos.
  const seasons = (await get('/seasons?per_page=20'))?.data ?? [];
  const season = [...seasons].sort((a: any, b: any) => String(b.year ?? b.name).localeCompare(String(a.year ?? a.name)))[0];
  const tournaments = season ? (await allPages(`/seasons/${season.id}/tournaments`)).filter((t: any) => LEVELS.has(t.level)) : [];
  if (tournaments.length) {
    const list: any[] = [];
    for (const t of tournaments.sort((a: any, b: any) => a.start_date.localeCompare(b.start_date))) {
      let winners = null;
      if (t.status === 'finished') {
        const old = prev.tournaments?.find((x: any) => x.id === t.id);
        if (old?.winners) winners = old.winners;
        else {
          const d = await get(`/tournaments/${t.id}`);
          const w = (d?.data ?? d)?.winners;
          if (w) winners = { men: pair(w.men), women: pair(w.women) };
        }
      }
      list.push({ id: t.id, name: t.name, level: t.level, status: t.status, start: t.start_date, end: t.end_date, location: t.location, country: t.country, photo: t.photo_url, winners });
    }
    out.season = season.year ?? season.name;
    out.tournaments = list;
  }

  // Cuadros: torneo en juego (o el próximo) y el último terminado.
  const live = out.tournaments?.find((t: any) => t.status === 'live') ?? out.tournaments?.find((t: any) => t.status === 'pending');
  const last = [...(out.tournaments ?? [])].reverse().find((t: any) => t.status === 'finished');
  out.draws = {};
  for (const t of [live, last].filter(Boolean)) {
    const ms = await allPages(`/tournaments/${t.id}/matches?sort=round`);
    out.draws[t.id] = ms.filter((m: any) => m.draw === 'main' && m.status !== 'bye').map((m: any) => ({
      id: m.id, category: m.category, round: m.round, roundName: m.round_name, date: m.played_at, status: m.status,
      score: Array.isArray(m.score) ? m.score.map((s: any) => [s.team_1, s.team_2]) : null, winner: m.winner,
      team1: pair(m.players?.team_1), team2: pair(m.players?.team_2),
    }));
  }
  out.current = live?.id ?? null;
  out.last = last?.id ?? null;

  writeFileSync(OUT, JSON.stringify(out) + '\n');
  console.log(`padel: ${calls} peticiones · temporada ${out.season} · ${out.tournaments?.length ?? 0} torneos · en juego ${live?.name ?? '—'} · último ${last?.name ?? '—'}`);
}

main();

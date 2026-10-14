/**
 * Snapshot de TheSportsDB: fundación, nombres alternativos, web y redes del
 * club y ficha del estadio (aforo, inauguración, coordenadas) para cada equipo
 * de las competiciones ESPN del registro. Sin imágenes ni descripciones
 * (licencia y contenido duplicado).
 *
 * Clave gratuita «123»: 30 peticiones/minuto → una cada ~2,1 s. Incremental:
 * solo consulta equipos sin dato o con más de 30 días (o todos con --refresh).
 *   npx tsx scripts/thesportsdb/snapshot.ts [--max 400] [--comps laliga,nba] [--refresh]
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { COMPETITIONS, type Competition } from '../../src/lib/competitions';
import type { ClubEntry, ClubFacts, TsdbSnapshot } from '../../src/lib/thesportsdb';

const OUT = join(process.cwd(), 'src/data/thesportsdb-snapshot.json');
const KEY = process.env.THESPORTSDB_KEY || '123';
const API = `https://www.thesportsdb.com/api/v1/json/${KEY}`;
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const STALE_MS = 30 * 86_400_000;
const GAP_MS = 2_100;

const args = process.argv.slice(2);
const arg = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const MAX = Number(arg('--max') ?? 400);
const ONLY = arg('--comps')?.split(',');
const REFRESH = args.includes('--refresh');

const SPORT: Record<string, string> = { soccer: 'Soccer', basketball: 'Basketball', football: 'American Football', hockey: 'Ice Hockey', baseball: 'Baseball', rugby: 'Rugby' };
/** Primero las ligas con más tráfico; el resto en orden del registro. */
const PRIORITY = ['laliga', 'premier-league', 'serie-a', 'bundesliga', 'ligue-1', 'laliga-2', 'nba', 'euroliga', 'liga-f', 'champions-league', 'nfl', 'eredivisie', 'primeira-liga', 'mls', 'liga-mx'];

/** Nombres de ESPN que TheSportsDB no encuentra (ESPN abrevia: «Deportivo», «Athletic Club»). */
const ALIAS: Record<string, string[]> = {
  'soccer:90': ['Deportivo de A Coruña'],
  'soccer:93': ['Athletic Bilbao'],
  'soccer:96': ['Deportivo Alavés'],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let last = 0;
async function tsdb(path: string): Promise<any> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const wait = last + GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    last = Date.now();
    const res = await fetch(`${API}/${path}`, { headers: { 'User-Agent': 'mundiales-de-futbol.com snapshot' } });
    if (res.status === 429) { await sleep(60_000); continue; }
    if (!res.ok) return null;
    const txt = await res.text();
    try { return JSON.parse(txt); } catch { return null; }
  }
  return null;
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9 ]+/g, ' ')
  .split(/\s+/).filter((w) => w && !['fc', 'cf', 'sc', 'afc', 'ac', 'cd', 'ud', 'sd', 'rc', 'rcd', 'club', 'de', 'del', 'la', 'the', 'calcio', 'sv', 'vfb', 'vfl', 'fk', 'sk'].includes(w))
  .join(' ');

function pick(cands: any[], espnId: string, names: string[]): any | null {
  const byId = cands.find((t) => String(t.idESPN ?? '') === espnId);
  if (byId) return byId;
  const wanted = new Set(names.map(norm).filter(Boolean));
  const named = cands.filter((t) => [t.strTeam, ...String(t.strTeamAlternate ?? '').split(',')].some((n: string) => wanted.has(norm(n ?? ''))));
  return named.length === 1 ? named[0] : null;
}

const int = (v: unknown) => { const n = parseInt(String(v ?? ''), 10); return Number.isFinite(n) && n > 0 ? n : undefined; };
const url = (v: unknown) => { const s = String(v ?? '').trim(); if (!s || /\s/.test(s) || !s.includes('.')) return undefined; return /^https?:\/\//.test(s) ? s : `https://${s}`; };
const list = (v: unknown) => { const a = String(v ?? '').split(',').map((x) => x.trim()).filter(Boolean); return a.length ? a : undefined; };

/** Id de canal (UC…) a partir de la URL del canal: necesario para su feed RSS. */
async function youtubeChannel(u: string): Promise<string | undefined> {
  const direct = u.match(/\/channel\/(UC[\w-]{22})/)?.[1];
  if (direct) return direct;
  try {
    const html = await (await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'es' } })).text();
    return html.match(/"externalId":"(UC[\w-]{22})"/)?.[1] ?? html.match(/youtube\.com\/channel\/(UC[\w-]{22})/)?.[1];
  } catch { return undefined; }
}

async function facts(t: any): Promise<ClubFacts> {
  const out: ClubFacts = {
    tsdbId: String(t.idTeam),
    formed: int(t.intFormedYear),
    alternate: list(t.strTeamAlternate),
    website: url(t.strWebsite),
    social: { instagram: url(t.strInstagram), x: url(t.strTwitter), facebook: url(t.strFacebook), youtube: url(t.strYoutube) },
    checkedAt: new Date().toISOString(),
  };
  if (!Object.values(out.social!).some(Boolean)) delete out.social;
  if (out.social?.youtube) out.youtubeChannelId = await youtubeChannel(out.social.youtube);
  if (t.idVenue && t.idVenue !== '0') {
    const v = (await tsdb(`lookupvenue.php?id=${t.idVenue}`))?.venues?.[0];
    if (v?.strVenue) {
      const [lat, lng] = String(v.strMap ?? '').split(',').map((x) => parseFloat(x));
      out.venue = {
        name: v.strVenue, alternate: list(v.strVenueAlternate), capacity: int(v.intCapacity), opened: int(v.intFormedYear),
        location: v.strLocation || undefined,
        ...(Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : {}),
      };
    }
  }
  return out;
}

async function espnTeams(c: Competition): Promise<{ id: string; name: string; short: string }[]> {
  try {
    const j = await (await fetch(`${ESPN}/${c.espn!.sport}/${c.espn!.league}/teams?limit=200`)).json();
    return (j?.sports?.[0]?.leagues?.[0]?.teams ?? []).map((x: any) => ({ id: String(x.team?.id ?? ''), name: x.team?.displayName ?? '', short: x.team?.shortDisplayName ?? '' })).filter((t: any) => t.id && t.name);
  } catch { return []; }
}

(async () => {
  const snap: TsdbSnapshot = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { updatedAt: '', source: 'https://www.thesportsdb.com', teams: {} };
  const comps = COMPETITIONS.filter((c) => c.espn && SPORT[c.espn.sport] && !c.href && (!ONLY || ONLY.includes(c.slug)))
    .sort((a, b) => (PRIORITY.indexOf(a.slug) + 1 || 99) - (PRIORITY.indexOf(b.slug) + 1 || 99));
  const queue: { key: string; sport: string; id: string; names: string[] }[] = [];
  const seen = new Set<string>();
  for (const c of comps) {
    for (const t of await espnTeams(c)) {
      const key = `${c.espn!.sport}:${t.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const prev = snap.teams[key];
      if (!REFRESH && prev && Date.now() - Date.parse(prev.checkedAt) < STALE_MS) continue;
      queue.push({ key, sport: c.espn!.sport, id: t.id, names: [t.name, t.short, ...(ALIAS[key] ?? [])] });
    }
  }
  const todo = queue.slice(0, MAX);
  console.log(`TheSportsDB: ${seen.size} equipos en ${comps.length} competiciones; ${queue.length} pendientes, ${todo.length} en esta pasada`);
  let hit = 0, miss = 0;
  const save = () => { snap.updatedAt = new Date().toISOString(); writeFileSync(OUT, JSON.stringify(snap, null, 1) + '\n'); };
  for (const [i, q] of todo.entries()) {
    let chosen: any = null;
    for (const n of [...new Set(q.names.filter(Boolean))]) {
      const cands = ((await tsdb(`searchteams.php?t=${encodeURIComponent(n)}`))?.teams ?? []).filter((t: any) => t.strSport === SPORT[q.sport]);
      chosen = pick(cands, q.id, q.names);
      if (chosen) break;
    }
    const entry: ClubEntry = chosen ? await facts(chosen) : { miss: true, checkedAt: new Date().toISOString() };
    snap.teams[q.key] = entry;
    if (chosen) hit++; else miss++;
    if ((i + 1) % 25 === 0) { save(); console.log(`  ${i + 1}/${todo.length} · ${hit} cruzados, ${miss} sin cruce`); }
  }
  save();
  console.log(`Hecho: ${hit} cruzados, ${miss} sin cruce. Total en snapshot: ${Object.keys(snap.teams).length}`);
})();

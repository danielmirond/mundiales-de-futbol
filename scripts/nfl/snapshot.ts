/**
 * Datos avanzados de la NFL desde nflverse (CC-BY 4.0; https://github.com/nflverse/nflverse-data):
 * probabilidad de victoria jugada a jugada de cada partido terminado (por id de ESPN) y
 * ranking de quarterbacks por EPA y CPOE. Escribe src/data/nfl-advanced.json.
 *   npx tsx scripts/nfl/snapshot.ts [--season 2026]
 */
import { gunzipSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const SEASON = Number(args.includes('--season') ? args[args.indexOf('--season') + 1] : new Date().getUTCMonth() < 2 ? new Date().getUTCFullYear() - 1 : new Date().getUTCFullYear());
const REL = 'https://github.com/nflverse/nflverse-data/releases/download';
const OUT = join(process.cwd(), 'src/data/nfl-advanced.json');

/** CSV con comillas (RFC 4180) → filas como objetos. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (ch !== '\r') f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
const num = (s: string | undefined) => (s === undefined || s === '' || s === 'NA' ? null : Number(s));

async function get(url: string, gz = false) {
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  return (gz ? gunzipSync(buf) : buf).toString('utf8');
}

(async () => {
  const games = parseCsv(await get(`${REL}/schedules/games.csv`)).filter((g) => Number(g.season) === SEASON);
  const teamRows = parseCsv(await get(`${REL}/teams/teams_colors_logos.csv`));
  const teams = Object.fromEntries(teamRows.map((t) => [t.team_abbr, { name: t.team_name, nick: t.team_nick, color: t.team_color }]));
  const players = parseCsv(await get(`${REL}/players/players.csv`));
  const fullName = new Map(players.map((p) => [p.gsis_id, { name: p.display_name, espn: p.espn_id }]));
  const espnOf = new Map(games.map((g) => [g.game_id, g.espn]));
  const pbp = parseCsv(await get(`${REL}/pbp/play_by_play_${SEASON}.csv.gz`, true));
  console.log(`${games.length} partidos, ${pbp.length} jugadas`);

  // 1. Probabilidad de victoria del local, jugada a jugada (solo cuando cambia ≥ 0,5 puntos).
  const wp: Record<string, { home: string; away: string; final: [number, number]; pts: [number, number][]; scores: { t: number; team: string; text: string }[] }> = {};
  const byGame = new Map<string, Record<string, string>[]>();
  for (const p of pbp) { const a = byGame.get(p.game_id) ?? []; a.push(p); byGame.set(p.game_id, a); }
  for (const [gid, plays] of byGame) {
    const espn = espnOf.get(gid);
    const g = games.find((x) => x.game_id === gid);
    if (!espn || !g || g.home_score === '' || g.home_score === 'NA') continue; // solo terminados
    const pts: [number, number][] = []; let last = -1;
    const scores: { t: number; team: string; text: string }[] = [];
    let ph = 0, pa = 0;
    for (const p of plays) {
      const t = num(p.game_seconds_remaining); const w = num(p.home_wp);
      if (t === null || w === null) continue;
      const el = 3600 - t; // segundos jugados (la prórroga queda por encima de 3600)
      if (Math.abs(w - last) >= 0.005) { pts.push([Math.max(0, Math.round(el)), Math.round(w * 1000) / 1000]); last = w; }
      const h = num(p.total_home_score) ?? ph, a = num(p.total_away_score) ?? pa;
      if (h !== ph || a !== pa) {
        const team = h !== ph ? g.home_team : g.away_team;
        const kind = p.touchdown === '1' ? 'TD' : p.field_goal_result === 'made' ? 'FG' : p.safety === '1' ? 'Safety' : (h - ph + a - pa) <= 2 ? 'Extra' : 'Anota';
        if (kind !== 'Extra') scores.push({ t: Math.round(el), team, text: `${kind} ${team} (${a}-${h})` });
        ph = h; pa = a;
      }
    }
    if (pts.length > 10) wp[espn] = { home: g.home_team, away: g.away_team, final: [Number(g.away_score), Number(g.home_score)], pts, scores };
  }

  // 2. Quarterbacks: EPA por jugada en sus jugadas de pase o carrera propia y CPOE medio.
  const qb = new Map<string, { id: string; name: string; team: string; plays: number; epa: number; cpoeSum: number; cpoeN: number; games: Set<string> }>();
  for (const p of pbp) {
    if (p.season_type !== 'REG' || p.qb_dropback !== '1' || !p.passer_player_id && !p.rusher_player_id) continue;
    const id = p.passer_player_id || p.rusher_player_id; const name = p.passer_player_name || p.rusher_player_name;
    const e = num(p.qb_epa); if (e === null || !id) continue;
    const r = qb.get(id) ?? { id, name, team: p.posteam, plays: 0, epa: 0, cpoeSum: 0, cpoeN: 0, games: new Set<string>() };
    r.plays++; r.epa += e; r.team = p.posteam; r.games.add(p.game_id);
    const c = num(p.cpoe); if (c !== null) { r.cpoeSum += c; r.cpoeN++; }
    qb.set(id, r);
  }
  const weeks = Math.max(...pbp.map((p) => Number(p.week) || 0));
  const min = Math.max(40, weeks * 20);
  const qbs = [...qb.values()].filter((r) => r.plays >= min)
    .map((r) => ({ name: fullName.get(r.id)?.name || r.name, espnId: fullName.get(r.id)?.espn || undefined, team: r.team, plays: r.plays, games: r.games.size, epa: Math.round((r.epa / r.plays) * 1000) / 1000, cpoe: r.cpoeN ? Math.round((r.cpoeSum / r.cpoeN) * 10) / 10 : null }))
    .sort((a, b) => b.epa - a.epa);

  writeFileSync(OUT, `${JSON.stringify({ updatedAt: new Date().toISOString(), season: SEASON, week: weeks, minPlays: min, teams, qbs, wp })}\n`);
  console.log(`Semana ${weeks}: ${Object.keys(wp).length} partidos con probabilidad, ${qbs.length} quarterbacks (mínimo ${min} jugadas)`);
})();

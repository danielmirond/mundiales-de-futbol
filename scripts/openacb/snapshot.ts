/**
 * Snapshot de OpenACB (Liga Endesa): equipos de la temporada en curso con
 * estadísticas avanzadas y ritmo por cuartos. Tres descargas, sin token.
 *   npx tsx scripts/openacb/snapshot.ts [--season 2027]
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OPENACB_RAW, OPENACB_REPO, type AcbTeam, type AcbPace, type OpenAcbSnapshot } from '../../src/lib/openacb';

const OUT = join(process.cwd(), 'src/data/openacb-snapshot.json');
const args = process.argv.slice(2);
const i = args.indexOf('--season');
// Temporada OpenACB = año en que termina (2026-27 → 2027). Por defecto, la que toque por fecha.
const now = new Date();
const SEASON = i >= 0 ? Number(args[i + 1]) : now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear();

const get = async (name: string) => {
  const res = await fetch(`${OPENACB_RAW}/${name}`);
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  return res.json();
};
const KEEP: (keyof AcbTeam)[] = ['team', 'teamId', 'season', 'games', 'wins', 'losses', 'ppg', 'opp_ppg', 'pace', 'ortg', 'drtg', 'netRtg', 'efg', 'ts', 'threeRate', 'threePct', 'tovRate', 'orbPct', 'drbPct', 'ftRate', 'astRate', 'rpg', 'apg'];

(async () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [teamsAll, pace, logos] = await Promise.all([get('teams.json'), get(`teampace-${SEASON}.json`).catch(() => []), get('team-logos.json').catch(() => ({}))]);
  const teams: AcbTeam[] = (teamsAll as any[])
    .filter((t) => t.season === SEASON && (t.competitionStage ?? 'all') === 'all')
    .map((t) => { const o: any = {}; for (const k of KEEP) o[k] = t[k]; const logo = (logos as Record<string, string>)[t.team]; if (logo) o.logo = String(logo).trim(); return o as AcbTeam; })
    .sort((a, b) => b.netRtg - a.netRtg);
  const paceRows: AcbPace[] = (pace as any[]).map((p) => ({ team: p.team, teamId: p.teamId, games: p.games, quarters: p.quarters, bestQ: p.bestQ, worstQ: p.worstQ }));
  if (teams.length === 0) { console.error(`OpenACB: sin equipos para la temporada ${SEASON}`); process.exit(1); }
  const snap: OpenAcbSnapshot = { updatedAt: new Date().toISOString(), source: OPENACB_REPO, season: SEASON, seasonName: `${SEASON - 1}-${String(SEASON).slice(2)}`, teams, pace: paceRows };
  writeFileSync(OUT, JSON.stringify(snap, null, 1) + '\n');
  console.log(`OpenACB ${snap.seasonName}: ${teams.length} equipos, ${paceRows.length} con ritmo por cuartos`);
})();

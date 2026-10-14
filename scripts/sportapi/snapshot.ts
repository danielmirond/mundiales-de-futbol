/**
 * Snapshot de SportAPI dentro del presupuesto del plan de prueba (50 peticiones AL MES;
 * la cabecera x-ratelimit-requests-reset marca ~30 días):
 *   --budget N   peticiones máximas en esta ejecución (por defecto 40)
 *   --comps a,b  competiciones (por defecto laliga,champions-league)
 *   --lineups    además, bajas de los partidos de las próximas 30 h
 *   --weekday N  solo se ejecuta ese día de la semana (Madrid; 1 = lunes)
 *
 * Estrategia: 1 llamada para la temporada, 1 para las jornadas, y después
 * las jornadas que falten en el snapshot (de la actual hacia fuera), más la
 * actual y la siguiente siempre (reprogramaciones). Se detiene cuando el
 * presupuesto o la cuota restante (cabecera x-ratelimit) se agota.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SPORTAPI_HOST, SPORTAPI_TOURNAMENT, type SportapiSnapshot, type SnapshotRoundMatch, type SnapshotLineup } from '../../src/lib/sportapi';

const KEY = process.env.RAPIDAPI_SPORTAPI_KEY ?? '';
const OUT = join(process.cwd(), 'src/data/sportapi-snapshot.json');
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const BUDGET = Number(opt('--budget', '40'));
const COMPS = opt('--comps', 'laliga,champions-league').split(',').map((s) => s.trim()).filter(Boolean);
const WANT_LINEUPS = args.includes('--lineups');

if (!KEY) { console.error('Falta RAPIDAPI_SPORTAPI_KEY'); process.exit(1); }
const WEEKDAY = args.includes('--weekday') ? Number(opt('--weekday', '1')) : null;
if (WEEKDAY != null) {
  const dow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })).getDay();
  if (dow !== WEEKDAY) { console.log(`SportAPI: hoy no toca (solo el día ${WEEKDAY}).`); process.exit(0); }
}

let used = 0; let remaining = Infinity;
async function get<T>(path: string): Promise<T | null> {
  if (used >= BUDGET || remaining <= 3) return null;
  used++;
  const res = await fetch(`https://${SPORTAPI_HOST}${path}`, { headers: { 'x-rapidapi-key': KEY, 'x-rapidapi-host': SPORTAPI_HOST } });
  const rem = Number(res.headers.get('x-ratelimit-requests-remaining') ?? NaN);
  if (!Number.isNaN(rem)) remaining = rem;
  if (!res.ok) { console.warn(`  ${res.status} ${path}`); return null; }
  return (await res.json()) as T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const toMatch = (e: any): SnapshotRoundMatch | null => {
  const round = Number(e?.roundInfo?.round);
  if (!round || !e?.startTimestamp) return null;
  return { id: Number(e.id), round, date: new Date(e.startTimestamp * 1000).toISOString(), home: String(e.homeTeam?.name ?? ''), away: String(e.awayTeam?.name ?? ''), homeCode: e.homeTeam?.nameCode ? String(e.homeTeam.nameCode) : undefined, awayCode: e.awayTeam?.nameCode ? String(e.awayTeam.nameCode) : undefined };
};

(async () => {
  const snap: SportapiSnapshot = JSON.parse(readFileSync(OUT, 'utf8'));
  for (const slug of COMPS) {
    const tid = SPORTAPI_TOURNAMENT[slug];
    if (!tid) { console.warn(`Sin id SportAPI para ${slug}`); continue; }
    const cur = snap.competitions[slug];
    let seasonId = cur?.seasonId, seasonName = cur?.seasonName ?? '';
    if (!seasonId) {
      const s = await get<any>(`/api/v1/unique-tournament/${tid}/seasons`);
      if (!s?.seasons?.[0]) continue;
      seasonId = Number(s.seasons[0].id); seasonName = String(s.seasons[0].name ?? '');
    }
    const r = await get<any>(`/api/v1/unique-tournament/${tid}/season/${seasonId}/rounds`);
    if (!r) continue;
    const currentRound = Number(r.currentRound?.round ?? 1);
    const rounds: number[] = (r.rounds ?? []).map((x: any) => Number(x.round)).filter(Boolean);
    const entry = snap.competitions[slug] ?? { tournamentId: tid, seasonId, seasonName, currentRound, totalRounds: rounds.length, fetchedRounds: [], matches: [] };
    entry.seasonId = seasonId; entry.seasonName = seasonName; entry.currentRound = currentRound; entry.totalRounds = rounds.length;
    // Orden: actual, siguiente, anterior, y después las que falten, alternando hacia fuera.
    const order: number[] = [currentRound, currentRound + 1, currentRound - 1];
    for (let d = 2; d <= rounds.length; d++) { order.push(currentRound + d, currentRound - d); }
    const todo = [...new Set(order)].filter((n) => rounds.includes(n) && (Math.abs(n - currentRound) <= 1 || !entry.fetchedRounds.includes(n)));
    for (const n of todo) {
      const ev = await get<any>(`/api/v1/unique-tournament/${tid}/season/${seasonId}/events/round/${n}`);
      if (!ev) break;
      const ms = (ev.events ?? []).map(toMatch).filter(Boolean) as SnapshotRoundMatch[];
      entry.matches = [...entry.matches.filter((m) => m.round !== n), ...ms].sort((a, b) => a.round - b.round || a.date.localeCompare(b.date));
      if (!entry.fetchedRounds.includes(n)) entry.fetchedRounds.push(n);
      entry.fetchedRounds.sort((a, b) => a - b);
      console.log(`${slug} · jornada ${n}: ${ms.length} partidos (quedan ${remaining})`);
    }
    snap.competitions[slug] = entry;
  }

  if (WANT_LINEUPS) {
    const now = Date.now(), horizon = now + 30 * 3_600_000;
    const soon = Object.values(snap.competitions).flatMap((c) => c.matches).filter((m) => { const t = new Date(m.date).getTime(); return t >= now - 3 * 3_600_000 && t <= horizon; });
    for (const m of soon) {
      const prev = snap.lineups[String(m.id)];
      if (prev?.confirmed) continue; // ya confirmadas: no gastar
      const l = await get<any>(`/api/v1/event/${m.id}/lineups`);
      if (!l) break;
      const side = (s: any) => ({ formation: s?.formation ? String(s.formation) : undefined, missing: (s?.missingPlayers ?? []).map((p: any) => ({ name: String(p.player?.name ?? ''), reason: String(p.reason ?? p.description ?? ''), type: String(p.type ?? '') })) });
      const lineup: SnapshotLineup = { confirmed: !!l.confirmed, fetchedAt: new Date().toISOString(), home: side(l.home), away: side(l.away) };
      snap.lineups[String(m.id)] = lineup;
      console.log(`bajas ${m.home} - ${m.away}: ${lineup.home.missing.length}+${lineup.away.missing.length}${lineup.confirmed ? ' · onces confirmados' : ''}`);
    }
    // Limpieza: alineaciones de partidos de hace más de 3 días.
    for (const [id, l] of Object.entries(snap.lineups)) if (new Date(l.fetchedAt).getTime() < now - 3 * 86_400_000) delete snap.lineups[id];
  }

  snap.updatedAt = new Date().toISOString();
  writeFileSync(OUT, JSON.stringify(snap, null, 1) + '\n');
  console.log(`Peticiones usadas: ${used} · cuota restante: ${remaining}`);
})();

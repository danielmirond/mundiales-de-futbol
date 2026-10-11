/**
 * Snapshot LIGERO del Mundial 2026 desde ESPN (por día: el rango de fechas dejó
 * de funcionar al cerrar la temporada). Guarda solo lo que consumen
 * live-scores (marcador, penaltis, estado, sede) y top-scorers (goleadores) en
 * src/data/wc-2026-results.json, para que cuadro, goleadores, cruces y fichas
 * sirvan el archivo sin depender de ESPN en vivo y sin engordar los bundles edge.
 *
 * Uso: node scripts/wc-2026/snapshot-espn.mjs
 */
import { writeFileSync } from 'node:fs';
const UA = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };
const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=';
const num = (s) => (s === undefined || s === null || s === '' ? null : Number(s));
const days = [];
for (let d = new Date('2026-06-11T00:00:00Z'); d <= new Date('2026-07-19T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
  days.push(d.toISOString().slice(0, 10).replace(/-/g, ''));
}
const byId = new Map();
for (const day of days) {
  const res = await fetch(BASE + day, { headers: UA });
  if (!res.ok) { console.error('HTTP', res.status, day); continue; }
  const j = await res.json();
  for (const e of j.events ?? []) {
    const comp = e.competitions?.[0] ?? {};
    const side = (ha) => {
      const c = (comp.competitors ?? []).find((x) => x.homeAway === ha) ?? {};
      return {
        id: String(c.team?.id ?? ''), abbr: String(c.team?.abbreviation ?? '').toUpperCase(),
        name: c.team?.displayName ?? '', score: num(c.score), shootout: num(c.shootoutScore), winner: !!c.winner,
      };
    };
    const scorers = (comp.details ?? []).filter((p) => p.scoringPlay).map((p) => ({
      athleteId: String(p.athletesInvolved?.[0]?.id ?? ''), name: p.athletesInvolved?.[0]?.displayName ?? '',
      teamId: String(p.team?.id ?? ''), type: String(p.type?.text ?? ''), clock: p.clock?.displayValue ?? '',
    })).filter((s) => s.athleteId);
    byId.set(String(e.id), {
      id: String(e.id), date: e.date, state: e.status?.type?.state ?? 'post',
      status: e.status?.type?.shortDetail ?? '', clock: e.status?.displayClock ?? null,
      venue: comp.venue?.fullName ?? '', home: side('home'), away: side('away'), scorers,
    });
  }
}
const events = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
writeFileSync('src/data/wc-2026-results.json', JSON.stringify({ snapshotAt: new Date().toISOString(), events }) + '\n');
console.log(`eventos: ${events.length} · jugados: ${events.filter((e) => e.state === 'post').length} · goles: ${events.reduce((a, e) => a + e.scorers.length, 0)}`);

/**
 * Copia de la UFC desde Cito API dentro de la cuota gratuita (500 consultas al MES).
 *   npx tsx scripts/ufc/snapshot.ts [--budget 40] [--monthly 450]
 *
 * Orden de prioridad, parando cuando se acaba el presupuesto de la ejecución o del mes:
 *   1. Rankings, si tienen más de 6 días (1-2 consultas).
 *   2. Lista de veladas, si tiene más de 2 días o ya pasó una velada próxima (2).
 *   3. Veladas: las 4 últimas disputadas que no estén guardadas como terminadas, y las 2
 *      próximas si su cartelera tiene más de 4 días (2 consultas cada una).
 *   4. Luchadores: campeones, LISTA y quienes pelearon el combate estelar o por un título
 *      de las veladas guardadas; se refrescan si han peleado después de su copia (3 cada uno).
 * El contador del mes se guarda en la propia copia (`usage`).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fetchUfcRankings, fetchUfcEvents, fetchUfcEvent, fetchUfcFighter } from '../../src/lib/cito-ufc';
import type { UfcSnapshot } from '../../src/lib/ufc-data';

const OUT = join(process.cwd(), 'src/data/ufc-snapshot.json');
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const BUDGET = Number(opt('--budget', '40'));
const MONTHLY = Number(opt('--monthly', '450'));
/** Luchadores que se siguen aunque no sean campeones ni estén en un combate estelar. */
const LISTA = ['ilia-topuria', 'aleksandre-topuria', 'joel-alvarez'];
const DAY = 86_400_000;

if (!process.env.CITO_API_KEY) { console.error('Falta CITO_API_KEY'); process.exit(1); }
const snap: UfcSnapshot = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { updatedAt: '', usage: { month: '', calls: 0 }, eventDetails: {}, fighters: {} };
const now = Date.now();
const iso = new Date(now).toISOString();
const month = iso.slice(0, 7);
// Los «sin ficha» se reintentan cada mes (pudo ser un fallo de red).
if (snap.usage.month !== month) { snap.usage = { month, calls: 0 }; snap.missing = []; }
// --retry-missing: vuelve a intentar los «sin ficha» de este mes.
if (args.includes('--retry-missing')) snap.missing = [];

let spent = 0;
/** Lo que Cito dice que queda del mes (cabecera x-ratelimit-monthly-remaining). */
let monthlyRemaining = Infinity;
const left = () => Math.min(BUDGET - spent, MONTHLY - snap.usage.calls, monthlyRemaining - 50);
// Cito admite 10 consultas por minuto: en serie, una cada 6,5 s, y si llega un 429 se espera lo que pida.
const GAP = 6_500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let queue: Promise<unknown> = Promise.resolve();
const realFetch = globalThis.fetch;
async function citoFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  for (let i = 0; i < 3; i++) {
    if (left() <= 0) throw new Error('sin presupuesto');
    const r = await realFetch(input, init);
    await sleep(GAP);
    const rem = Number(r.headers.get('x-ratelimit-monthly-remaining'));
    if (Number.isFinite(rem) && r.headers.has('x-ratelimit-monthly-remaining')) { monthlyRemaining = rem; snap.usage.calls = Math.max(snap.usage.calls, 500 - rem); }
    if (r.status === 429) { await sleep(1000 * Number(r.headers.get('retry-after') ?? 60)); continue; }
    spent++;
    return r;
  }
  throw new Error('429 persistente');
}
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  if (!String(input).includes('citoapi.com')) return realFetch(input, init);
  const p = queue.then(() => citoFetch(input, init));
  queue = p.catch(() => undefined);
  return p;
}) as typeof fetch;
const age = (at?: string) => (at ? now - Date.parse(at) : Infinity);

(async () => {
  // 1. Rankings
  if (age(snap.rankings?.at) > 6 * DAY && left() >= 2) {
    let system = 'media';
    let divs = await fetchUfcRankings('media');
    if (!divs) { system = 'meta'; divs = await fetchUfcRankings('meta'); }
    if (divs) { snap.rankings = { at: iso, system, divisions: divs }; console.log(`Rankings (${system}): ${divs.length} divisiones`); }
  }
  // 2. Lista de veladas
  const passed = (snap.events?.upcoming ?? []).some((e) => Date.parse(e.startsAt) + 8 * 3600_000 < now);
  if ((age(snap.events?.at) > 2 * DAY || passed) && left() >= 2) {
    const ev = await fetchUfcEvents();
    if (ev) { snap.events = { at: iso, ...ev }; console.log(`Veladas: ${ev.upcoming.length} próximas, ${ev.recent.length} recientes`); }
  }
  // 3. Veladas
  const want = [
    ...(snap.events?.recent ?? []).slice(0, 4).filter((e) => snap.eventDetails[e.slug]?.status !== 'completed'),
    ...(snap.events?.upcoming ?? []).slice(0, 2).filter((e) => age(snap.eventDetails[e.slug]?.fetchedAt) > 4 * DAY),
  ];
  for (const e of want) {
    if (left() < 2) break;
    const d = await fetchUfcEvent(e.slug);
    if (d) { snap.eventDetails[e.slug] = { ...d, fetchedAt: iso }; console.log(`Velada ${d.title}: ${d.bouts.length} combates (${d.status})`); }
  }
  // Solo las 12 veladas más recientes
  const keep = Object.values(snap.eventDetails).sort((a, b) => b.startsAt.localeCompare(a.startsAt)).slice(0, 12).map((e) => e.slug);
  for (const k of Object.keys(snap.eventDetails)) if (!keep.includes(k)) delete snap.eventDetails[k];
  // 4. Luchadores: cuándo pelearon por última vez en una velada guardada
  const lastFight = new Map<string, string>();
  const targets = new Set<string>(LISTA);
  for (const d of snap.rankings?.divisions ?? []) for (const r of d.rows) if (r.champion) targets.add(r.slug);
  for (const ev of Object.values(snap.eventDetails)) {
    ev.bouts.forEach((b, i) => {
      if (i === 0 || b.title) { targets.add(b.a.slug); targets.add(b.b.slug); }
      if (ev.status === 'completed') for (const s of [b.a.slug, b.b.slug]) if ((lastFight.get(s) ?? '') < ev.startsAt) lastFight.set(s, ev.startsAt);
    });
  }
  const missing = new Set(snap.missing ?? []);
  const stale = [...targets].filter((s) => s && !missing.has(s)).filter((s) => {
    const f = snap.fighters[s];
    return !f || (lastFight.get(s) ?? '') > f.fetchedAt || age(f.fetchedAt) > 45 * DAY;
  }).sort((a, b) => Number(Boolean(snap.fighters[a])) - Number(Boolean(snap.fighters[b])));
  for (const s of stale) {
    if (left() < 3) break;
    const f = await fetchUfcFighter(s);
    if (f) { snap.fighters[s] = { ...f, fetchedAt: iso }; console.log(`Luchador ${f.name} (${f.record})`); }
    else { missing.add(s); console.log(`${s}: sin ficha en Cito`); }
  }
  // Fichas a medio hacer de los debutantes (nombre = slug, sin división): se completan con la velada.
  for (const f of Object.values(snap.fighters)) {
    if (f.name !== f.slug && f.division) continue;
    for (const ev of Object.values(snap.eventDetails)) for (const bt of ev.bouts) for (const c of [bt.a, bt.b]) {
      if (c.slug !== f.slug) continue;
      if (f.name === f.slug) f.name = c.name;
      if (!f.division) f.division = bt.division;
    }
  }
  snap.missing = [...missing];
  snap.updatedAt = iso;
  writeFileSync(OUT, `${JSON.stringify(snap)}\n`);
  console.log(`Consultas: ${spent} en esta ejecución, ${snap.usage.calls} en ${month} (tope ${MONTHLY}). Luchadores pendientes: ${stale.filter((s) => !missing.has(s) && snap.fighters[s]?.fetchedAt !== iso).length}`);
})();

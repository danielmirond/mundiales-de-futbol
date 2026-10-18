/**
 * Radar Discover de deportes con DiscoverSnoop (livepages, últimas N horas).
 * Para la redacción diaria: qué entra hoy en Discover España, con qué molde de titular,
 * qué entidades suben, qué funciona fuera y no aparece en España (hueco) y qué
 * ya tenemos cubierto. No se publica nada de aquí: es material de trabajo.
 *   npx tsx --env-file=$HOME/discoversnoop-analytics/.env.local scripts/research/discover-radar.ts [horas=24]
 * Salida: .cache/discover-radar/AAAA-MM-DD.md (fuera de git: son titulares de terceros).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NEWS_ITEMS } from '../../src/lib/news';

const BASE = 'https://api.discoversnoop.com';
const HOURS = Number(process.argv[2] ?? 24);
const MARKETS: [string, string][] = [['ES', 'España'], ['MX', 'México'], ['AR', 'Argentina'], ['US', 'EE. UU.'], ['GB', 'Reino Unido'], ['IT', 'Italia'], ['FR', 'Francia'], ['DE', 'Alemania'], ['BR', 'Brasil']];
const SOCIAL = /(^|\.)(x|twitter|threads|youtube|instagram|facebook|tiktok)\.(com|net)$/i;
const OWN = /mundiales-de-futbol\.com/i;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ds(path: string, params: Record<string, string | number> = {}): Promise<any[]> {
  const u = new URL(`/${path}`, BASE);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v));
  for (let i = 0; i < 5; i++) {
    const r = await fetch(u, { headers: { Authorization: `Bearer ${process.env.DISCOVERSNOOP_TOKEN}` } });
    const j: any = await r.json().catch(() => null);
    const env = Array.isArray(j) ? j[0] : j;
    if (r.status === 403 || /too many/i.test(String(env?.transaction_state ?? ''))) { await sleep(4000 * (i + 1)); continue; }
    const d = env?.data ?? env?.results ?? [];
    return Array.isArray(d) ? d : Object.values(d);
  }
  return [];
}

const sc = (p: any) => Number(p.score_decimal ?? p.score ?? 0);
/** En España el título original; fuera, la traducción al castellano de DiscoverSnoop. */
const title = (p: any) => String((p._es ? p.title_original : p.title_spanish) || p.title || '').replace(/\s+Ver en.*$/, '').trim();
const host = (p: any) => String(p.publisher_url || '').toLowerCase().replace(/^www\./, '');
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
/** Entidades genéricas (son categorías, no protagonistas): no cuentan para cubierto ni hueco. */
const GENERIC = /^(deporte|esport|deportes|f[uú]tbol|futbol|tenis|ciclismo|baloncesto|b[aà]squet|carrera|carreras|jugador de tenis|futbolista|entrenador|f[oó]rmula 1|motociclismo|atletismo|correr|sport|soccer|football|basketball|tennis|calcio|fu[ßs]ball|boxing|boxeo)$/i;
const ents = (p: any) => ((p.entities ?? []) as any[]).map((e) => String(e.entity ?? e)).filter((e) => e && !GENERIC.test(e.trim()));

/** Molde del titular (mismas familias que el panel de DiscoverSnoop Analytics). */
function molde(t: string): string {
  const s = t.toLowerCase();
  if (/\b(pisos?|villa|mansi[oó]n|yate|fortuna|patrimonio|millones|propiedad|inmobiliar|chalet|finca|inmuebles?|ladrillo|empresas?|invierte|sueldo)\b/.test(s)) return 'Dinero con cara';
  if (/\b(r[eé]cord|el m[aá]s|la m[aá]s|ins[oó]lito|nunca visto|curios)\b/.test(s)) return 'Récord / curiosidad';
  if (/\b(hijo|hija|padre|madre|herman|mujer|esposa|famili|novia|marido)\b/.test(s)) return 'Familia';
  if (/\(\d{2}\s*a[ñn]os\)|,\s*\d{2}\s*a[ñn]os|leyenda|retir|ex-?(futbolista|ciclista|tenista|jugador|piloto)/.test(s)) return 'Cita de leyenda (edad/cargo)';
  if (/\b(detenid|accidente|lesi[oó]n|muere|fallec|investig|amañ|dopaje|sanci[oó]n|sanciona|multa|suspend|puerta cerrada)\b/.test(s)) return 'Suceso / sanción';
  if (/["“«:]/.test(t)) return 'Declaración';
  if (/\b(horario|d[oó]nde ver|a qu[eé] hora|tv|televisi[oó]n)\b/.test(s)) return 'Servicio';
  return 'Otro';
}

(async () => {
  if (!process.env.DISCOVERSNOOP_TOKEN) { console.error('Falta DISCOVERSNOOP_TOKEN (usa --env-file=$HOME/discoversnoop-analytics/.env.local)'); process.exit(1); }
  const cats = await ds('categories_list');
  const SPORT = new Set(['26', '805', '1271', '1025', '1026', '1027']);
  for (const c of cats) if (String(c.rootcategory) === '26') SPORT.add(String(c.id));

  const byMarket: Record<string, { all: any[]; sport: any[] }> = {};
  for (const [code] of MARKETS) {
    const rows = (await ds('livepages', { country: code, hours: HOURS, lines: 4000 })).map((p) => ({ ...p, _es: code === 'ES' }));
    byMarket[code] = { all: rows, sport: rows.filter((p) => SPORT.has(String(p.category)) && !SOCIAL.test(host(p))).sort((a, b) => sc(b) - sc(a)) };
    console.log(`${code}: ${rows.length} páginas, ${byMarket[code].sport.length} de deportes`);
    await sleep(800);
  }

  // Lo nuestro de los últimos 7 días, para marcar «ya cubierto».
  const weekAgo = Date.now() - 7 * 86_400_000;
  const ours = NEWS_ITEMS.filter((n: any) => Date.parse(n.publishedAt) > weekAgo).map((n: any) => norm(`${n.title} ${n.slug.replace(/-/g, ' ')}`));
  const covered = (e: string) => e.length > 3 && ours.some((o) => o.includes(norm(e)));

  const es = byMarket.ES.sport;
  const esEnts = new Set(es.flatMap((p) => ents(p).map(norm)));
  const esText = norm(es.map(title).join(' | '));
  const L: string[] = [];
  const day = new Date().toISOString().slice(0, 10);
  L.push(`# Radar Discover · ${day} · últimas ${HOURS} h`, '');

  // 1. España
  L.push(`## España: lo que entra en Discover Deportes (${es.length} páginas)`, '');
  const moldes = new Map<string, number>();
  for (const p of es) moldes.set(molde(title(p)), (moldes.get(molde(title(p))) ?? 0) + 1);
  L.push(`Moldes: ${[...moldes].sort((a, b) => b[1] - a[1]).map(([m, n]) => `${m} ${n}`).join(' · ')}`, '');
  L.push('| # | Score | Molde | Titular | Medio | Entidades | Ya lo tocamos (7 días) |', '|---|---|---|---|---|---|---|');
  es.slice(0, 30).forEach((p, i) => {
    const e = ents(p).slice(0, 3);
    L.push(`| ${i + 1} | ${sc(p).toFixed(1)} | ${molde(title(p))} | ${title(p).replace(/\|/g, '/').slice(0, 120)} | ${host(p)} | ${e.join(', ')} | ${ents(p).filter(covered).join(', ')} |`);
  });

  // 2. Entidades que suben en España
  const entScore = new Map<string, { s: number; n: number }>();
  for (const p of es) for (const e of ents(p)) { const x = entScore.get(e) ?? { s: 0, n: 0 }; x.s += sc(p); x.n++; entScore.set(e, x); }
  L.push('', '## Entidades con más tirón en España', '');
  L.push([...entScore].sort((a, b) => b[1].s - a[1].s).slice(0, 25).map(([e, x]) => `${e} (${x.n}${covered(e) ? ', cubierto' : ''})`).join(' · '));

  // 3. Hueco internacional: funciona fuera y ninguna página española de deportes lo menciona
  L.push('', '## Hueco internacional (fuera sí, en España no)', '');
  for (const [code, name] of MARKETS.slice(1)) {
    const gaps = byMarket[code].sport.filter((p) => {
      const e = ents(p);
      return e.length > 0 && !e.some((x) => esEnts.has(norm(x)) || esText.includes(norm(x)));
    }).slice(0, 6);
    if (!gaps.length) continue;
    L.push(`### ${name}`);
    for (const p of gaps) L.push(`- ${title(p).slice(0, 140)} — ${host(p)} · ${ents(p).slice(0, 3).join(', ')}${ents(p).some(covered) ? ' · cubierto' : ''} · ${p.url}`);
    L.push('');
  }

  // 4. Nosotros en Discover
  const mine = MARKETS.flatMap(([c]) => byMarket[c].all.filter((p) => OWN.test(String(p.url)) || OWN.test(host(p))).map((p) => ({ c, p })));
  L.push('## mundiales-de-futbol.com en Discover', '');
  L.push(mine.length ? mine.map(({ c, p }) => `- ${c}: ${title(p)} (score ${sc(p).toFixed(1)}) ${p.url}`).join('\n') : '- Ninguna pieza nuestra en el feed en estas horas.');

  const dir = join(process.cwd(), '.cache/discover-radar');
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `${day}.md`);
  writeFileSync(out, `${L.join('\n')}\n`);
  console.log(`Radar → ${out}`);
})();

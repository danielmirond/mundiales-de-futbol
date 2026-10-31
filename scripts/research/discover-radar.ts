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
const GENERIC = /^(deporte|esport|deportes|f[uú]tbol|futbol|tenis|ciclismo|baloncesto|b[aà]squet|carrera|carreras|jugador de tenis|futbolista|entrenador|f[oó]rmula 1|motociclismo|atletismo|correr|sport|soccer|football|basketball|tennis|calcio|fu[ßs]ball|boxing|boxeo|sports|esportes|futebol|desporto|fussball|motorsport|racing|nba|nfl|formula racing)$/i;
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

  // 1b. Lo que sigue vivo en la última hora (Discover lo está sirviendo ahora)
  const lastSeen = Math.max(...es.map((p) => Date.parse(String(p.lastviewed ?? '').replace(' ', 'T')) || 0));
  const live = es.filter((p) => (Date.parse(String(p.lastviewed ?? '').replace(' ', 'T')) || 0) >= lastSeen - 3_600_000);
  L.push('', `## España: vivas en la última hora (${live.length} páginas)`, '');
  for (const p of live.slice(0, 15)) L.push(`- ${sc(p).toFixed(1)} · ${molde(title(p))} · ${title(p).slice(0, 120)} — ${host(p)}${ents(p).some(covered) ? ' · cubierto' : ''}`);

  // 1c. Patrones de titular medidos hoy en España (media de score con el rasgo y sin él)
  const FEATS: [string, (t: string, p: any) => boolean][] = [
    ['Cita entre comillas', (s) => /["“”«»]/.test(s)],
    ['Dos puntos', (s) => s.includes(':')],
    ['Más de 90 caracteres', (s) => s.length > 90],
    ['Entidad en las 5 primeras palabras', (s, p) => ents(p).some((e) => norm(s.split(/\s+/).slice(0, 5).join(' ')).includes(norm(e.split(' ')[0])))],
    ['Edad o cargo («, 38 años», «(38 años)»)', (s) => /\d{2}\s*a[ñn]os/.test(s)],
    ['Fuera del campo (dinero, casa, familia)', (s) => ['Dinero con cara', 'Familia'].includes(molde(s))],
    ['Cifra en el titular', (s) => /\d/.test(s)],
    ['Pregunta', (s) => /[¿?]/.test(s)],
  ];
  const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  L.push('', '## Patrones de titular que funcionan hoy en España', '', '| Rasgo | Páginas con él | Score medio con / sin | Ratio |', '|---|---|---|---|');
  for (const [name, f] of FEATS) {
    const yes = es.filter((p) => f(title(p), p)).map(sc), no = es.filter((p) => !f(title(p), p)).map(sc);
    const r = mean(no) ? mean(yes) / mean(no) : 0;
    L.push(`| ${name} | ${yes.length} | ${mean(yes).toFixed(2)} / ${mean(no).toFixed(2)} | ${r.toFixed(1)}× ${r >= 1.3 ? '✅' : r <= 0.7 ? '⛔' : ''} |`);
  }
  L.push('', 'Usa en cada titular al menos un rasgo ✅ y ninguno ⛔ (salvo que la historia lo exija).');

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

  // 3b. Hueco internacional por entidad: suma de score fuera (varios mercados) frente a España
  const esEntScore = new Map<string, number>();
  for (const p of es) for (const e of ents(p)) esEntScore.set(norm(e), (esEntScore.get(norm(e)) ?? 0) + sc(p));
  const intl = new Map<string, { s: number; c: Set<string>; best: any }>();
  for (const [code] of MARKETS.slice(1)) for (const p of byMarket[code].sport) for (const e of ents(p)) {
    const x = intl.get(e) ?? { s: 0, c: new Set<string>(), best: null };
    x.s += sc(p); x.c.add(code); if (!x.best || sc(p) > sc(x.best)) x.best = p; intl.set(e, x);
  }
  const rowsGap = [...intl].map(([e, x]) => ({ e, ...x, es: esEntScore.get(norm(e)) ?? (esText.includes(norm(e)) ? 0.1 : 0) }))
    .filter((x) => x.s >= 15 && x.es <= x.s * 0.1).sort((a, b) => b.s - a.s).slice(0, 25);
  L.push('## Hueco internacional por entidad (fuera suma mucho, en España ≤10 %)', '', '| Entidad | Score fuera | Mercados | Score ES | Mejor pieza | URL |', '|---|---|---|---|---|---|');
  for (const x of rowsGap) L.push(`| ${x.e} | ${x.s.toFixed(1)} | ${[...x.c].join(',')} | ${x.es.toFixed(1)} | ${title(x.best).replace(/\|/g, '/').slice(0, 100)} (${host(x.best)}) | ${x.best.url} |`);
  L.push('', 'Prioriza las entidades con interés en España (español implicado, club o estrella conocida, deporte con audiencia aquí) y el ángulo fuera del campo. Descarta NFL, MLB, NCAA, lucha libre y política local.', '');

  // 5. Google Trends España: búsquedas de deporte que suben ahora (Trending Now, últimas 24 h, categoría 17 = Deportes)
  L.push('## Google Trends España · Deportes (últimas 24 h)', '');
  try {
    const body = new URLSearchParams({ 'f.req': JSON.stringify([[['i0OFE', JSON.stringify([null, null, 'ES', 0, 'es', 24, 1]), null, 'generic']]]) });
    const r = await fetch('https://trends.google.com/_/TrendsUi/data/batchexecute?hl=es', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body });
    const line = (await r.text()).split('\n').find((l) => l.startsWith('[["wrb.fr"'));
    const rows: any[] = line ? (JSON.parse(JSON.parse(line)[0][2])?.[1] ?? []) : [];
    const now = Date.now() / 1000;
    // Cubierto si alguna variante de la búsqueda tiene todas sus partes (equipo A, equipo B…) en una pieza nuestra de 7 días.
    const STOP = /^(rcd|cf|fc|club|de|futbol|del|la|el|vs|v|ac|sc|cd|ud|real)$/;
    const coveredQ = (qs: string[]) => qs.some((q) => {
      const parts = norm(q).split(/\s+[-–]\s+|\s+vs\.?\s+/).map((s) => s.split(/\s+/).filter((w) => w.length > 2 && !STOP.test(w))[0]).filter(Boolean);
      return parts.length > 0 && ours.some((o) => parts.every((w) => o.includes(w)));
    });
    const sport = rows.filter((x) => (x[10] ?? []).includes(17)).sort((a, b) => (b[6] ?? 0) - (a[6] ?? 0));
    L.push('| Búsqueda | Volumen | Subida | Empezó | Activa | Relacionadas | En Discover ES | Lo mencionamos (7 días) |', '|---|---|---|---|---|---|---|---|');
    for (const x of sport.slice(0, 30)) {
      const term = String(x[0]);
      const rel = ((x[9] ?? []) as string[]).filter((q) => q !== term).slice(0, 3).join(', ');
      const inDs = esText.includes(norm(term)) || ((x[9] ?? []) as string[]).some((q) => q.length > 4 && esText.includes(norm(q)));
      L.push(`| ${term} | ${x[6] ?? '?'}+ | ${x[8] ?? '?'} % | hace ${Math.max(0, Math.round((now - (x[3]?.[0] ?? now)) / 3600))} h | ${x[4] ? 'no' : 'sí'} | ${rel} | ${inDs ? 'sí' : 'no'} | ${coveredQ([term, ...((x[9] ?? []) as string[])]) ? 'sí' : ''} |`);
    }
    L.push('', `${sport.length} búsquedas de deporte en tendencia (de ${rows.length} en total). Si una activa y con volumen no tiene pieza nuestra, se sirve: horario y dónde ver si es un partido o carrera por jugar; resultado y claves si ya se jugó; quién es y por qué se le busca si es una persona. El titular responde a lo que se busca (aquí sí es búsqueda, no Discover).`, '');
  } catch (e) {
    L.push(`- No se pudo leer Google Trends: ${String(e).slice(0, 120)}`, '');
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

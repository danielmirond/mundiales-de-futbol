/**
 * Pipeline de contenidos diarios — DETERMINISTA (sin IA, coste cero).
 *
 * Piezas (todas firmadas "Redacción Mundiales de Fútbol", seudónimo declarado):
 *   --hoy           Partidos de hoy por deporte (fútbol, baloncesto): hora + canal.
 *   --cronicas      Crónica breve de cada partido JUGADO (ayer y hoy) en las
 *                   competiciones prioritarias: marcador, goleadores, momentos,
 *                   datos y efecto en la clasificación.
 *   --previa        Previa del partido destacado de hoy/mañana.
 *   --clasificacion Clasificación comentada por liga (pensada para lunes).
 *   --all           Todo lo anterior.   --dry  No escribe.   --refresh  Reescribe lo existente.
 *
 * Datos: ESPN (resultados, resúmenes, clasificación) y WOSTI (canal). Imagen:
 * Wikimedia Commons con licencia libre (sede del partido), con crédito.
 * Control de volumen (MC1 del manual): crónicas y previas solo en
 * competiciones prioritarias; una URL por hecho (antirrefrito).
 */
import { COMPETITIONS, liveCompetitions, competitionPath, type Competition } from '../../src/lib/competitions';
import { fetchWindow, fetchStandings, dayKeys, type Match } from '../../src/lib/espn';
import { getWostiIndex, channelsFor } from '../../src/lib/wosti';
import { fetchEventSummary } from '../../src/lib/wc-2026-match-summary';
import { findImage, type CommonsImage } from './commons';
import { readNews, upsert, writeNews, exists, publishedAtOf, type Piece } from './news-io';
import { seedFrom, pick, prose, plural, fmtDayLong, fmtTime, dayKey, cap, assertTitle, V } from './voice';
import { renderCronica, renderPrevia, REGISTERS, type CronicaCtx, type Side } from './registers';

// ── Contexto de cada equipo: puesto/puntos, último resultado y siguiente partido ──
const windowCache = new Map<string, Promise<Match[]>>();
const compWindow = (c: Competition, from: number, to: number) => {
  const k = `${c.slug}:${from}:${to}`;
  if (!windowCache.has(k)) windowCache.set(k, fetchWindow([c], dayKeys(from, to), 300));
  return windowCache.get(k)!;
};
const sameTeam = (a: string, b: string) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x === y || x.includes(y) || y.includes(x); };
async function sideCtx(c: Competition, team: { name: string; fullName: string }, ref: Match): Promise<Side> {
  const side: Side = { name: team.name };
  if (c.hasStandings) {
    const { groups } = await fetchStandings(c);
    const r = groups.flatMap((g) => g.rows).find((x) => sameTeam(team.fullName, x.name) || sameTeam(team.name, x.name));
    if (r) { side.rank = r.rank; side.points = r.stats.points; side.record = r.stats.wins != null ? `${r.stats.wins}G-${r.stats.ties ?? 0}E-${r.stats.losses}P` : undefined; }
  }
  const past = (await compWindow(c, -9, -1)).filter((m) => m.state === 'post' && m.id !== ref.id && (sameTeam(m.home.name, team.name) || sameTeam(m.away.name, team.name)));
  const last = past[past.length - 1];
  if (last) {
    const isHome = sameTeam(last.home.name, team.name);
    const gf = isHome ? last.home.score! : last.away.score!, ga = isHome ? last.away.score! : last.home.score!;
    const rival = isHome ? last.away.name : last.home.name;
    side.last = `de ${gf > ga ? 'ganar' : gf < ga ? 'perder' : 'empatar'} ${gf}-${ga} ${gf === ga ? 'con' : gf > ga ? 'a' : 'ante'} ${rival}`;
  }
  const future = (await compWindow(c, 1, 10)).filter((m) => m.state === 'pre' && (sameTeam(m.home.name, team.name) || sameTeam(m.away.name, team.name)));
  const next = future[0];
  if (next) {
    const isHome = sameTeam(next.home.name, team.name);
    side.next = `${isHome ? 'recibe a' : 'visita a'} ${isHome ? next.away.name : next.home.name} el ${fmtDayLong(new Date(next.date))}`;
  }
  return side;
}

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry') || !!process.env.DAILY_DRY;
const REFRESH = args.has('--refresh');
const ALL = args.has('--all');
const AUTHOR = 'Redacción Mundiales de Fútbol';
const SITE = 'https://mundiales-de-futbol.com';
const PRIORITY = ['laliga', 'champions-league', 'europa-league', 'premier-league', 'nba'];
/** Crónicas: solo fútbol prioritario y con tope diario (MC1: nada de series desde feeds). */
const CRONICA_COMPS = ['laliga', 'champions-league', 'europa-league', 'premier-league'];
const MAX_CRONICAS = 8;
const prio = (slug: string) => { const i = PRIORITY.indexOf(slug); return i === -1 ? 99 : i; };
const SPORT_NAME: Record<string, string> = { futbol: 'fútbol', baloncesto: 'baloncesto' };

const usedImages = new Set<string>();
async function imageFor(query: string, alt: string): Promise<Piece['image'] | undefined> {
  const img: CommonsImage | null = await findImage(query, alt, usedImages);
  if (!img) return undefined;
  usedImages.add(img.url);
  return { url: img.url, alt: img.alt, credit: img.credit, license: img.license };
}

const espnEventUrl = (c: Competition, id: string) =>
  c.espn?.sport === 'basketball'
    ? `https://www.espn.com/nba/game/_/gameId/${id}`
    : `https://www.espn.com/soccer/match/_/gameId/${id}`;
const fichaPath = (m: Match) => `/${m.competition.sport}/${m.competition.slug}/partido/${m.id}`;
const compOf = (m: Match) => COMPETITIONS.find((c) => c.sport === m.competition.sport && c.slug === m.competition.slug)!;
const score = (m: Match) => `${m.home.score ?? 0}-${m.away.score ?? 0}`;

// ─────────────────────────────────────────────────────────────────────────────
// 1) Partidos de hoy por deporte
async function buildHoy(sport: string, now: Date): Promise<Piece | null> {
  const comps = liveCompetitions(sport);
  const todayKey = dayKey(now);
  const all = await fetchWindow(comps, dayKeys(0, 1), 60);
  const rows = all.filter((m) => dayKey(new Date(m.date)) === todayKey);
  if (rows.length === 0) return null;
  const wosti = sport === 'futbol' ? await getWostiIndex() : new Map();
  const dep = SPORT_NAME[sport] ?? sport;
  const dia = fmtDayLong(now);
  const slug = `partidos-${sport}-hoy-${todayKey}`;
  const rnd = seedFrom(slug);

  // Partido destacado: primero por competición prioritaria, luego el último (prime time).
  const featured = rows.find((m) => PRIORITY.includes(m.competition.slug)) ?? rows[rows.length - 1];
  const groups = new Map<string, Match[]>();
  for (const m of rows) groups.set(m.competition.slug, [...(groups.get(m.competition.slug) ?? []), m]);

  const sections = [...groups.entries()].map(([slugC, ms]) => {
    const c = compOf(ms[0]);
    const lines = ms.map((m) => {
      const ch = sport === 'futbol' ? channelsFor(wosti, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]) : [];
      const tv = ch.length ? ` · 📺 ${ch.slice(0, 2).join(' / ')}` : '';
      const st = m.state === 'post' ? ` — **final ${score(m)}**` : m.state === 'in' ? ` — **en juego, ${score(m)}**` : '';
      return `- **[${m.home.name} - ${m.away.name}](${fichaPath(m)})** — ${fmtTime(new Date(m.date))} h${tv}${st}`;
    });
    return `## ${c.flag ? `${c.flag} ` : ''}${c.name}\n\n${lines.join('\n')}\n\nCalendario y clasificación en la [página de ${c.shortName ?? c.name}](${competitionPath(c)}).`;
  });

  const intro = pick(rnd, V.hoyIntro)(rows.length, dep, dia);
  const focus = `El partido que más miradas reúne es el **[${featured.home.name} - ${featured.away.name}](${fichaPath(featured)})** (${compOf(featured).name}, ${fmtTime(new Date(featured.date))} h).`;
  const body = `${intro} ${focus}\n\n${sections.join('\n\n')}\n\n${pick(rnd, V.hoyCierre)} Toda la jornada, con marcadores en directo, en [partidos de hoy](/partidos-hoy).`;

  const compsNames = prose([...groups.keys()].sort((a, b) => prio(a) - prio(b)).slice(0, 3).map((s) => compOf(groups.get(s)![0]).shortName ?? compOf(groups.get(s)![0]).name));
  const title = `Partidos de ${dep} hoy, ${dia}: horarios y dónde ver ${compsNames}`;
  assertTitle(title, 'Partidos');
  const summary = `Agenda de ${dep} de hoy ${dia}: ${rows.length} ${plural(rows.length, 'partido', 'partidos')} con horario en hora española y canal de televisión. Destaca ${featured.home.name} - ${featured.away.name}.`;
  const image = await imageFor(featured.venue || `${featured.home.fullName} estadio`, `${featured.venue || featured.home.fullName}, escenario del ${featured.home.name} - ${featured.away.name}`);

  const src = readNews();
  return {
    slug, title, summary, body, category: 'tv',
    sourceName: 'ESPN', sourceUrl: espnEventUrl(compOf(featured), featured.id), sourceLang: 'en',
    publishedAt: publishedAtOf(src, slug) ?? now.toISOString(),
    modifiedAt: now.toISOString(), author: AUTHOR, image,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) Crónicas de partidos jugados (ayer y hoy, competiciones prioritarias)
async function buildCronicas(now: Date): Promise<Piece[]> {
  const comps = COMPETITIONS.filter((c) => CRONICA_COMPS.includes(c.slug) && c.espn);
  const played = (await fetchWindow(comps, dayKeys(-1, 0), 60))
    .filter((m) => m.state === 'post' && m.home.score != null)
    .sort((a, b) => prio(a.competition.slug) - prio(b.competition.slug) || b.date.localeCompare(a.date));
  const out: Piece[] = [];
  const src = readNews();
  for (const m of played) {
    if (out.length >= MAX_CRONICAS) break;
    const c = compOf(m);
    const slug = `cronica-${slugify(m.home.name)}-${slugify(m.away.name)}-${m.id}`;
    if (exists(src, slug) && !REFRESH) continue; // ya contada: no se duplica (RF1)
    const s = await fetchEventSummary(c.espn!, m.id);
    const rnd = seedFrom(slug);
    const hs = m.home.score!, as = m.away.score!;

    // Goles con autor/minuto; autogol (ESPN lo acredita al beneficiado) y penalti etiquetados.
    const isOwn = (g: { type: string; text: string }) => /autogol|propia|own goal/i.test(`${g.type} ${g.text}`);
    const isPen = (g: { type: string; text: string }) => /penal/i.test(`${g.type} ${g.text}`);
    const goals = (s?.events ?? []).filter((e) => e.kind === 'goal').map((g) => ({
      player: g.players[0] ?? 'gol', minute: g.minute,
      team: g.side ? (g.side === 'home' ? m.home.name : m.away.name) : '', own: isOwn(g), pen: isPen(g),
    }));
    const byPlayer = new Map<string, number>();
    for (const g of goals) if (g.player && !g.own) byPlayer.set(g.player, (byPlayer.get(g.player) ?? 0) + 1);
    const [topScorer, topN] = [...byPlayer.entries()].sort((a, b) => b[1] - a[1])[0] ?? [undefined, 0];
    const statPair = (key: string): [string, string] | undefined => { const st = s?.stats.find((x) => x.key === key); return st && st.home !== '—' ? [st.home, st.away] : undefined; };
    const r0 = (p?: [string, string]): [string, string] | undefined => p && [String(Math.round(Number(p[0]))), String(Math.round(Number(p[1])))];
    const ctx: CronicaCtx = {
      comp: c.name, compShort: c.shortName ?? c.name, compPath: competitionPath(c), fichaPath: fichaPath(m),
      home: await sideCtx(c, m.home, m), away: await sideCtx(c, m.away, m),
      hs, as, goals, topScorer, topN,
      possession: r0(statPair('possessionPct')), shots: statPair('totalShots'), onTarget: statPair('shotsOnTarget'), corners: statPair('wonCorners'),
      yellows: (s?.events ?? []).filter((e) => e.kind === 'yellow').length,
      reds: (s?.events ?? []).filter((e) => e.kind === 'red').map((e) => e.players[0] ?? '').filter(Boolean),
      subs: (s?.events ?? []).filter((e) => e.kind === 'sub').length,
      channels: channelsFor(await getWostiIndex(), m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]),
      date: new Date(m.date),
    };
    const reg = pick(rnd, REGISTERS);
    const { title, entity, summary, body } = renderCronica(reg, ctx, rnd);
    assertTitle(title, entity);
    const image = await imageFor(m.venue || `${m.home.fullName} estadio`, `${m.venue || m.home.fullName}, donde se jugó el ${m.home.name} - ${m.away.name}`);
    out.push({
      slug, title, summary, body, category: 'general',
      sourceName: 'ESPN', sourceUrl: espnEventUrl(c, m.id), sourceLang: 'en',
      publishedAt: publishedAtOf(src, slug) ?? now.toISOString(), modifiedAt: REFRESH ? now.toISOString() : undefined,
      author: AUTHOR, image,
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) Previa del partido destacado (hoy o mañana)
async function buildPrevia(now: Date): Promise<Piece | null> {
  const comps = COMPETITIONS.filter((c) => PRIORITY.includes(c.slug) && c.espn && c.espn.sport === 'soccer');
  const upcoming = (await fetchWindow(comps, dayKeys(0, 1), 60)).filter((m) => m.state === 'pre');
  if (upcoming.length === 0) return null;
  // Destacado: ambos equipos en la mitad alta de la tabla, si hay tabla; si no, el primero por prioridad.
  let best: { m: Match; score: number } | null = null;
  for (const m of upcoming) {
    const c = compOf(m);
    let sc = PRIORITY.length - PRIORITY.indexOf(c.slug);
    if (c.hasStandings) {
      const { groups } = await fetchStandings(c);
      const rows = groups.flatMap((g) => g.rows);
      const rank = (n: string) => rows.find((r) => n.toLowerCase().includes(r.name.toLowerCase()) || r.name.toLowerCase().includes(n.toLowerCase()))?.rank ?? 99;
      sc += Math.max(0, 20 - rank(m.home.name)) + Math.max(0, 20 - rank(m.away.name));
    }
    if (!best || sc > best.score) best = { m, score: sc };
  }
  const m = best!.m; const c = compOf(m);
  const slug = `previa-${slugify(m.home.name)}-${slugify(m.away.name)}-${m.id}`;
  const rnd = seedFrom(slug);
  const { title, entity, summary, body } = renderPrevia({
    home: await sideCtx(c, m.home, m), away: await sideCtx(c, m.away, m),
    comp: c.name, compShort: c.shortName ?? c.name, compPath: competitionPath(c), fichaPath: fichaPath(m),
    date: new Date(m.date), venue: m.venue,
    channels: channelsFor(await getWostiIndex(), m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]),
  }, rnd);
  assertTitle(title, entity);
  const image = await imageFor(m.venue || `${m.home.fullName} estadio`, `${m.venue || m.home.fullName}, sede del ${m.home.name} - ${m.away.name}`);
  const src = readNews();
  return { slug, title, summary, body, category: 'general', sourceName: 'ESPN', sourceUrl: espnEventUrl(c, m.id), sourceLang: 'en', publishedAt: publishedAtOf(src, slug) ?? now.toISOString(), modifiedAt: REFRESH ? now.toISOString() : undefined, author: AUTHOR, image };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4) Clasificación comentada (semanal) por liga prioritaria con tabla
async function buildClasificacion(now: Date): Promise<Piece[]> {
  const out: Piece[] = [];
  const week = isoWeek(now);
  const src = readNews();
  for (const c of COMPETITIONS.filter((x) => PRIORITY.includes(x.slug) && x.espn && x.hasStandings && x.kind === 'liga')) {
    const slug = `clasificacion-${c.slug}-semana-${week}`;
    if (exists(src, slug) && !REFRESH) continue;
    const { season, groups } = await fetchStandings(c);
    if (groups.length === 0) continue;
    const rnd = seedFrom(slug);
    const basketball = c.espn!.sport === 'basketball';
    const sections = groups.map((g) => {
      const top = g.rows.slice(0, basketball ? 8 : 6);
      const lines = top.map((r) => basketball
        ? `${r.rank}. **${r.name}** — ${r.stats.wins}-${r.stats.losses}${r.stats.gamesBehind && r.stats.gamesBehind !== '-' ? ` (a ${r.stats.gamesBehind})` : ''}`
        : `${r.rank}. **${r.name}** — ${r.stats.points} pts (${r.stats.wins}G-${r.stats.ties}E-${r.stats.losses}P, ${r.stats.pointDifferential})`);
      const bottom = basketball ? '' : `\n\nEn la zona baja: ${prose(g.rows.slice(-3).map((r) => `${r.name} (${r.stats.points} pts)`))}.`;
      return `## ${groups.length > 1 ? g.name : 'La tabla'}\n\n${lines.join('\n')}${bottom}`;
    });
    const lider = groups[0].rows[0];
    const pts = Number(lider.stats.points ?? lider.stats.wins);
    const intro = pick(rnd, V.clasifIntro)(c.name, lider.name, pts);
    const body = `${intro}\n\n${sections.join('\n\n')}\n\nLa clasificación completa, con todos los equipos y los próximos partidos, está en la [página de ${c.shortName ?? c.name}](${competitionPath(c)}).`;
    const title = `${c.name}: así queda la clasificación esta semana, con ${lider.name} líder`;
    assertTitle(title, c.name);
    const summary = `${intro} Tabla comentada de ${c.name}${season ? ` ${season}` : ''}: cabeza, zona baja y enlace a la clasificación completa.`;
    const image = await imageFor(`${lider.name} estadio`, `Estadio de ${lider.name}, líder de ${c.name}`);
    out.push({ slug, title, summary, body, category: 'general', sourceName: 'ESPN', sourceUrl: `https://www.espn.com/${basketball ? 'nba/standings' : `soccer/standings/_/league/${c.espn!.league}`}`, sourceLang: 'en', publishedAt: publishedAtOf(src, slug) ?? now.toISOString(), modifiedAt: REFRESH ? now.toISOString() : undefined, author: AUTHOR, image });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-${String(Math.ceil(((t.getTime() - y.getTime()) / 86400000 + 1) / 7)).padStart(2, '0')}`;
}

async function main() {
  const now = process.env.DAILY_DATE ? new Date(`${process.env.DAILY_DATE}T09:00:00Z`) : new Date();
  const pieces: Piece[] = [];
  if (ALL || args.has('--hoy')) for (const sport of ['futbol', 'baloncesto']) { const p = await buildHoy(sport, now); if (p) pieces.push(p); }
  if (ALL || args.has('--cronicas')) pieces.push(...(await buildCronicas(now)));
  if (ALL || args.has('--previa')) { const p = await buildPrevia(now); if (p) pieces.push(p); }
  if (ALL || args.has('--clasificacion')) pieces.push(...(await buildClasificacion(now)));

  console.log(`[daily-content] ${pieces.length} pieza(s) generadas.`);
  for (const p of pieces) console.log(`  · ${p.slug} — "${p.title}" (${p.title.length} chars, ${p.body.split(/\s+/).length} palabras${p.image ? ', con foto' : ', sin foto'})`);
  if (DRY) { for (const p of pieces) console.log(`\n----- ${p.slug} -----\n${p.body}\n`); return; }

  let src = readNews();
  let ins = 0, rep = 0;
  for (const p of pieces) {
    if (exists(src, p.slug) && !REFRESH && !p.slug.startsWith('partidos-')) continue;
    const r = upsert(src, p); src = r.src; r.action === 'inserted' ? ins++ : rep++;
  }
  writeNews(src);
  console.log(`[daily-content] insertadas ${ins} · refrescadas ${rep} → src/lib/news.ts`);
}

main().catch((e) => { console.error(e); process.exit(1); });

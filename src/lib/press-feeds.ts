/**
 * Titulares de prensa por competición desde RSS de medios españoles e
 * internacionales (verificados 2026-10-15). Solo titular, medio, hora,
 * miniatura que el propio feed publica y enlace al original: no se copia
 * texto. Caché 30 min.
 *
 * Dos tipos de feed:
 *  - `comps`: feed dedicado a esas competiciones → entra todo.
 *  - `sport`: feed general del deporte → solo los titulares que mencionan la
 *    competición o alguno de sus equipos (nombres de ESPN).
 */
import type { Competition } from './competitions';
import { fetchTeams } from './espn-team';

/** `api`: ruta de la API de noticias de ESPN (deporte/liga); su RSS no trae imágenes y la API sí. */
export type PressFeed = { id: string; name: string; url: string; region: 'ES' | 'INT'; lang: string; comps?: string[]; sport?: string[]; api?: string };
export type PressItem = { title: string; link: string; date: string; source: string; region: 'ES' | 'INT'; lang: string; image?: string };

const MARCA = 'https://e00-marca.uecdn.es/rss';
// AS: las URLs antiguas (as.com/rss/…) sirven contenido congelado de 2022.
const AS = 'https://feeds.as.com/mrss-s/pages/as/site/as.com/section';
export const PRESS_FEEDS: PressFeed[] = [
  // ── España ──
  { id: 'marca-laliga', name: 'Marca', url: `${MARCA}/futbol/primera-division.xml`, region: 'ES', lang: 'es', comps: ['laliga'] },
  { id: 'marca-laliga2', name: 'Marca', url: `${MARCA}/futbol/segunda-division.xml`, region: 'ES', lang: 'es', comps: ['laliga-2'] },
  { id: 'marca-ucl', name: 'Marca', url: `${MARCA}/futbol/champions-league.xml`, region: 'ES', lang: 'es', comps: ['champions-league'] },
  { id: 'marca-premier', name: 'Marca', url: `${MARCA}/futbol/premier-league.xml`, region: 'ES', lang: 'es', comps: ['premier-league'] },
  { id: 'marca-intl', name: 'Marca', url: `${MARCA}/futbol/futbol-internacional.xml`, region: 'ES', lang: 'es', sport: ['futbol'] },
  { id: 'marca-nba', name: 'Marca', url: `${MARCA}/baloncesto/nba.xml`, region: 'ES', lang: 'es', comps: ['nba'] },
  { id: 'marca-acb', name: 'Marca', url: `${MARCA}/baloncesto/acb.xml`, region: 'ES', lang: 'es', comps: ['liga-endesa'] },
  { id: 'marca-euroliga', name: 'Marca', url: `${MARCA}/baloncesto/euroliga.xml`, region: 'ES', lang: 'es', comps: ['euroliga'] },
  { id: 'marca-basket', name: 'Marca', url: `${MARCA}/baloncesto.xml`, region: 'ES', lang: 'es', sport: ['baloncesto'] },
  { id: 'marca-f1', name: 'Marca', url: `${MARCA}/motor/formula1.xml`, region: 'ES', lang: 'es', comps: ['formula-1'] },
  { id: 'marca-motogp', name: 'Marca', url: `${MARCA}/motor/motogp.xml`, region: 'ES', lang: 'es', comps: ['motogp'] },
  { id: 'marca-tenis', name: 'Marca', url: `${MARCA}/tenis.xml`, region: 'ES', lang: 'es', comps: ['atp', 'wta'] },
  { id: 'as-laliga', name: 'AS', url: `${AS}/futbol/subsection/primera/`, region: 'ES', lang: 'es', comps: ['laliga'] },
  { id: 'as-laliga2', name: 'AS', url: `${AS}/futbol/subsection/segunda/`, region: 'ES', lang: 'es', comps: ['laliga-2'] },
  { id: 'as-ucl', name: 'AS', url: `${AS}/futbol/subsection/champions/`, region: 'ES', lang: 'es', comps: ['champions-league'] },
  { id: 'as-intl', name: 'AS', url: `${AS}/futbol/subsection/internacional/`, region: 'ES', lang: 'es', sport: ['futbol'] },
  { id: 'as-nba', name: 'AS', url: `${AS}/baloncesto/subsection/nba/`, region: 'ES', lang: 'es', comps: ['nba'] },
  { id: 'as-acb', name: 'AS', url: `${AS}/baloncesto/subsection/acb/`, region: 'ES', lang: 'es', comps: ['liga-endesa'] },
  { id: 'as-f1', name: 'AS', url: `${AS}/motor/subsection/formula_1/`, region: 'ES', lang: 'es', comps: ['formula-1'] },
  { id: 'as-motogp', name: 'AS', url: `${AS}/motor/subsection/motociclismo/`, region: 'ES', lang: 'es', comps: ['motogp'] },
  { id: 'as-tenis', name: 'AS', url: `${AS}/tenis/portada/`, region: 'ES', lang: 'es', comps: ['atp', 'wta'] },
  { id: 'md-futbol', name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/rss/futbol.xml', region: 'ES', lang: 'es', sport: ['futbol'] },
  { id: 'md-basket', name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/rss/baloncesto.xml', region: 'ES', lang: 'es', sport: ['baloncesto'] },
  { id: 'md-motor', name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/rss/motor.xml', region: 'ES', lang: 'es', sport: ['motor'] },
  { id: 'md-tenis', name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/rss/tenis.xml', region: 'ES', lang: 'es', comps: ['atp', 'wta'] },
  { id: 'elpais-deportes', name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/deportes/portada', region: 'ES', lang: 'es', sport: ['futbol', 'baloncesto', 'motor', 'tenis', 'rugby', 'golf'] },
  // ── Internacional ──
  { id: 'bbc-football', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', region: 'INT', lang: 'en', sport: ['futbol'] },
  { id: 'bbc-premier', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/premier-league/rss.xml', region: 'INT', lang: 'en', comps: ['premier-league'] },
  { id: 'bbc-european', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/european/rss.xml', region: 'INT', lang: 'en', sport: ['futbol'] },
  { id: 'bbc-f1', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml', region: 'INT', lang: 'en', comps: ['formula-1'] },
  { id: 'bbc-tennis', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/tennis/rss.xml', region: 'INT', lang: 'en', comps: ['atp', 'wta'] },
  { id: 'bbc-rugby', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/rugby-union/rss.xml', region: 'INT', lang: 'en', sport: ['rugby'] },
  { id: 'bbc-basket', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/basketball/rss.xml', region: 'INT', lang: 'en', sport: ['baloncesto'] },
  { id: 'bbc-golf', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/golf/rss.xml', region: 'INT', lang: 'en', comps: ['pga-tour', 'dp-world-tour', 'lpga'] },
  { id: 'guardian-pl', name: 'The Guardian', url: 'https://www.theguardian.com/football/premierleague/rss', region: 'INT', lang: 'en', comps: ['premier-league'] },
  { id: 'guardian-laliga', name: 'The Guardian', url: 'https://www.theguardian.com/football/laligafootball/rss', region: 'INT', lang: 'en', comps: ['laliga'] },
  { id: 'guardian-seriea', name: 'The Guardian', url: 'https://www.theguardian.com/football/serieafootball/rss', region: 'INT', lang: 'en', comps: ['serie-a'] },
  { id: 'guardian-bundesliga', name: 'The Guardian', url: 'https://www.theguardian.com/football/bundesligafootball/rss', region: 'INT', lang: 'en', comps: ['bundesliga'] },
  { id: 'guardian-ligue1', name: 'The Guardian', url: 'https://www.theguardian.com/football/ligue1football/rss', region: 'INT', lang: 'en', comps: ['ligue-1'] },
  { id: 'guardian-ucl', name: 'The Guardian', url: 'https://www.theguardian.com/football/championsleague/rss', region: 'INT', lang: 'en', comps: ['champions-league'] },
  { id: 'guardian-nba', name: 'The Guardian', url: 'https://www.theguardian.com/sport/nba/rss', region: 'INT', lang: 'en', comps: ['nba'] },
  { id: 'guardian-nfl', name: 'The Guardian', url: 'https://www.theguardian.com/sport/nfl/rss', region: 'INT', lang: 'en', comps: ['nfl'] },
  { id: 'guardian-f1', name: 'The Guardian', url: 'https://www.theguardian.com/sport/formulaone/rss', region: 'INT', lang: 'en', comps: ['formula-1'] },
  { id: 'guardian-rugby', name: 'The Guardian', url: 'https://www.theguardian.com/sport/rugby-union/rss', region: 'INT', lang: 'en', sport: ['rugby'] },
  { id: 'guardian-tennis', name: 'The Guardian', url: 'https://www.theguardian.com/sport/tennis/rss', region: 'INT', lang: 'en', comps: ['atp', 'wta'] },
  { id: 'guardian-golf', name: 'The Guardian', url: 'https://www.theguardian.com/sport/golf/rss', region: 'INT', lang: 'en', comps: ['pga-tour', 'dp-world-tour', 'lpga'] },
  { id: 'espn-nba', name: 'ESPN', url: 'https://www.espn.com/espn/rss/nba/news', region: 'INT', lang: 'en', comps: ['nba'], api: 'basketball/nba' },
  { id: 'espn-nfl', name: 'ESPN', url: 'https://www.espn.com/espn/rss/nfl/news', region: 'INT', lang: 'en', comps: ['nfl'], api: 'football/nfl' },
  { id: 'espn-nhl', name: 'ESPN', url: 'https://www.espn.com/espn/rss/nhl/news', region: 'INT', lang: 'en', comps: ['nhl'], api: 'hockey/nhl' },
  { id: 'espn-mlb', name: 'ESPN', url: 'https://www.espn.com/espn/rss/mlb/news', region: 'INT', lang: 'en', comps: ['mlb'], api: 'baseball/mlb' },
  { id: 'espn-soccer', name: 'ESPN', url: 'https://www.espn.com/espn/rss/soccer/news', region: 'INT', lang: 'en', sport: ['futbol'], api: 'soccer/all' },
  { id: 'espn-f1', name: 'ESPN', url: 'https://www.espn.com/espn/rss/f1/news', region: 'INT', lang: 'en', comps: ['formula-1'], api: 'racing/f1' },
  { id: 'espn-golf', name: 'ESPN', url: 'https://www.espn.com/espn/rss/golf/news', region: 'INT', lang: 'en', comps: ['pga-tour', 'dp-world-tour', 'lpga'], api: 'golf/pga' },
  { id: 'espn-tennis', name: 'ESPN', url: 'https://www.espn.com/espn/rss/tennis/news', region: 'INT', lang: 'en', comps: ['atp', 'wta'], api: 'tennis/atp' },
  { id: 'espn-boxing', name: 'ESPN', url: 'https://www.espn.com/espn/rss/boxing/news', region: 'INT', lang: 'en', comps: ['boxeo'] },
  { id: 'bbc-boxing', name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/boxing/rss.xml', region: 'INT', lang: 'en', comps: ['boxeo'] },
  { id: 'guardian-boxing', name: 'The Guardian', url: 'https://www.theguardian.com/sport/boxing/rss', region: 'INT', lang: 'en', comps: ['boxeo'] },
  { id: 'boxingnews', name: 'Boxing News', url: 'https://www.boxingnewsonline.net/feed/', region: 'INT', lang: 'en', comps: ['boxeo'] },
  { id: 'espn-mma', name: 'ESPN', url: 'https://www.espn.com/espn/rss/mma/news', region: 'INT', lang: 'en', comps: ['ufc'], api: 'mma/ufc' },
  { id: 'gazzetta-seriea', name: 'La Gazzetta dello Sport', url: 'https://www.gazzetta.it/dynamic-feed/rss/section/Calcio/Serie-A.xml', region: 'INT', lang: 'it', comps: ['serie-a'] },
  { id: 'gazzetta-calcio', name: 'La Gazzetta dello Sport', url: 'https://www.gazzetta.it/rss/calcio.xml', region: 'INT', lang: 'it', sport: ['futbol'] },
  { id: 'kicker-bundesliga', name: 'kicker', url: 'https://newsfeed.kicker.de/news/bundesliga', region: 'INT', lang: 'de', comps: ['bundesliga'] },
  { id: 'ole-primera', name: 'Olé', url: 'https://www.ole.com.ar/rss/futbol-primera/', region: 'INT', lang: 'es', comps: ['liga-argentina'] },
  { id: 'ge-futebol', name: 'ge (Globo)', url: 'https://ge.globo.com/rss/ge/futebol/', region: 'INT', lang: 'pt', sport: ['futbol'] },
  { id: 'sky-football', name: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', region: 'INT', lang: 'en', sport: ['futbol'] },
  { id: 'motorsport-f1', name: 'Motorsport.com', url: 'https://www.motorsport.com/rss/f1/news/', region: 'INT', lang: 'en', comps: ['formula-1'] },
  { id: 'motorsport-motogp', name: 'Motorsport.com', url: 'https://www.motorsport.com/rss/motogp/news/', region: 'INT', lang: 'en', comps: ['motogp'] },
];

/** Términos extra por competición para filtrar los feeds generales. */
const TERMS: Record<string, string[]> = {
  laliga: ['LaLiga', 'La Liga', 'Liga EA'],
  'laliga-2': ['LaLiga Hypermotion', 'Segunda División'],
  'premier-league': ['Premier League', 'Premier'],
  'serie-a': ['Serie A'],
  bundesliga: ['Bundesliga'],
  'ligue-1': ['Ligue 1'],
  'champions-league': ['Champions League', 'Champions', 'Liga de Campeones'],
  'europa-league': ['Europa League'],
  'conference-league': ['Conference League'],
  'copa-del-rey': ['Copa del Rey'],
  supercopa: ['Supercopa'],
  'liga-f': ['Liga F'],
  'champions-femenina': ['Champions femenina', "Women's Champions League"],
  'fa-cup': ['FA Cup'],
  'carabao-cup': ['Carabao Cup', 'League Cup'],
  'coppa-italia': ['Coppa Italia'],
  'dfb-pokal': ['DFB-Pokal', 'DFB Pokal'],
  'copa-de-francia': ['Coupe de France', 'Copa de Francia'],
  eredivisie: ['Eredivisie'],
  'primeira-liga': ['Primeira Liga', 'Liga Portugal'],
  'super-lig': ['Süper Lig', 'Super Lig'],
  mls: ['MLS'],
  'liga-mx': ['Liga MX'],
  brasileirao: ['Brasileirão', 'Brasileirao', 'Série A'],
  'liga-argentina': ['Liga Profesional'],
  libertadores: ['Libertadores'],
  championship: ['Championship'],
  euroliga: ['Euroliga', 'EuroLeague', 'Euroleague'],
  'liga-endesa': ['Liga Endesa', 'ACB'],
  wnba: ['WNBA'],
  'seis-naciones': ['Seis Naciones', 'Six Nations'],
  'top-14': ['Top 14'],
  'premiership-rugby': ['Premiership'],
  urc: ['United Rugby Championship', 'URC'],
  'rugby-championship': ['Rugby Championship'],
  motogp: ['MotoGP'],
};

const decode = (s: string) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))?.[1];

function parse(xml: string, f: PressFeed): PressItem[] {
  return [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi)].map(([, it]) => {
    const link = decode(tag(it, 'link') ?? tag(it, 'guid') ?? '');
    // La imagen más grande que ofrezca el feed (Guardian trae varias; BBC sirve 240 px → se pide 976).
    const media = [...it.matchAll(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*>/gi)].map(([t]) => ({
      url: t.match(/url="([^"]+)"/i)?.[1], w: Number(t.match(/width="(\d+)"/i)?.[1] ?? 0), image: !/type="(?!image)/i.test(t),
    })).filter((m) => m.url && m.image).sort((a, b) => b.w - a.w);
    const img = media[0]?.url?.replace(/(ichef\.bbci\.co\.uk\/[^/]+\/[^/]+\/)\d+\//, '$1976/');
    const d = new Date(decode(tag(it, 'pubDate') ?? tag(it, 'dc:date') ?? ''));
    return {
      title: decode(tag(it, 'title') ?? ''), link, date: Number.isNaN(d.getTime()) ? '' : d.toISOString(),
      source: f.name, region: f.region, lang: f.lang, image: img ? img.replace(/&amp;/g, '&') : undefined,
    };
  }).filter((x) => x.title && /^https?:\/\//.test(x.link));
}

/** Noticias de ESPN por su API (titular, enlace, fecha y foto de cabecera). */
async function fetchEspnNews(f: PressFeed): Promise<PressItem[]> {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${f.api}/news?limit=25`, { next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];
  const j = (await res.json()) as { articles?: { headline?: string; published?: string; links?: { web?: { href?: string } }; images?: { type?: string; url?: string; width?: number }[] }[] };
  return (j.articles ?? []).map((a) => {
    const imgs = (a.images ?? []).filter((i) => i.url);
    const img = imgs.find((i) => i.type === 'header') ?? imgs.sort((x, y) => (y.width ?? 0) - (x.width ?? 0))[0];
    return { title: a.headline ?? '', link: a.links?.web?.href ?? '', date: a.published ? new Date(a.published).toISOString() : '', source: f.name, region: f.region, lang: f.lang, image: img?.url };
  }).filter((x) => x.title && /^https?:\/\//.test(x.link));
}

async function fetchFeed(f: PressFeed): Promise<PressItem[]> {
  if (f.api) {
    const viaApi = await fetchEspnNews(f).catch(() => [] as PressItem[]);
    if (viaApi.length) return viaApi;
  }
  try {
    const res = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mundiales-de-futbol.com)' }, next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return parse(await res.text(), f);
  } catch {
    return [];
  }
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Titulares recientes (≤ 72 h) de una competición, mezclando prensa española
 * e internacional, sin duplicados. Vacío si no hay feeds para su deporte.
 */
export async function fetchCompetitionPress(c: Competition, limit = 16): Promise<PressItem[]> {
  const dedicated = PRESS_FEEDS.filter((f) => f.comps?.includes(c.slug));
  const general = PRESS_FEEDS.filter((f) => f.sport?.includes(c.sport));
  if (dedicated.length === 0 && general.length === 0) return [];

  // Filtro para feeds generales: nombre de la competición y de sus equipos.
  const teams = general.length && c.espn ? await fetchTeams(c) : [];
  const terms = [...new Set([...(TERMS[c.slug] ?? []), c.name, ...(c.shortName ? [c.shortName] : []),
    ...teams.flatMap((t) => [t.name]).filter((n) => n.length >= 4)])];
  const re = terms.length ? new RegExp(`\\b(${terms.map((t) => escapeRe(fold(t))).join('|')})\\b`, 'i') : null;

  const [ded, gen] = await Promise.all([
    Promise.all(dedicated.map(fetchFeed)).then((x) => x.flat()),
    Promise.all(general.map(fetchFeed)).then((x) => x.flat().filter((i) => re?.test(fold(i.title)))),
  ]);
  const cutoff = Date.now() - 72 * 3_600_000;
  const seen = new Set<string>();
  const fresh = (xs: PressItem[]) => xs
    .filter((i) => !i.date || Date.parse(i.date) >= cutoff)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .filter((i) => { const k = fold(i.title).replace(/[^a-z0-9]+/g, ' ').slice(0, 70); if (seen.has(k) || seen.has(i.link)) return false; seen.add(k); seen.add(i.link); return true; });
  // Primero los feeds dedicados a la competición; los generales filtrados solo rellenan.
  const pool = [...fresh(ded), ...fresh(gen)];

  // Reparto por medio (turnos) para que ninguno cope el carrusel, y mitad
  // internacional como máximo si hay de las dos regiones.
  const pick = (region: PressItem['region'], n: number) => {
    const bySrc = new Map<string, PressItem[]>();
    for (const i of pool) if (i.region === region) bySrc.set(i.source, [...(bySrc.get(i.source) ?? []), i]);
    const queues = [...bySrc.values()];
    const out: PressItem[] = [];
    while (out.length < n && queues.some((q) => q.length)) for (const q of queues) { const x = q.shift(); if (x && out.length < n) out.push(x); }
    return out;
  };
  const int = pick('INT', Math.floor(limit / 2));
  const es = pick('ES', limit - int.length);
  const rest = es.length < limit - int.length ? pick('INT', limit - es.length).slice(int.length) : [];
  return [...es, ...int, ...rest].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

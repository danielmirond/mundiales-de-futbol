/**
 * Directo de la home en formato vertical (una tarjeta por pantalla): mezcla
 * titulares de prensa por competición, piezas propias, marcadores del día y
 * vídeos de los canales oficiales de los grandes clubes. Todo de fuentes que
 * ya usa el portal; sin IA. Caché por fuente (prensa 30 min, ESPN 2-5 min).
 */
import { createHash } from 'node:crypto';
import { getCompetition, competitionsOf, type Competition } from './competitions';
import { PRESS_FEEDS } from './press-feeds';
import { activeCampaigns, type Campaign } from './campaigns';
import { fetchCompetitionPress } from './press-feeds';
import { fetchWindow, dayKeys, type Match } from './espn';
import { getLatestNews, newsImageUrl, newsKind, NEWS_KIND_LABEL } from './news';
import { clubFacts } from './thesportsdb';

export type FeedCard =
  | { kind: 'press'; id: string; title: string; source: string; date: string; href: string; image?: string; comp: string; sport: string; lang: string }
  | { kind: 'news'; id: string; title: string; summary: string; date: string; href: string; image: string; label: string; sport: string }
  | { kind: 'score'; id: string; date: string; href: string; comp: string; sport: string; match: Match }
  | { kind: 'video'; id: string; date: string; team: string; channelId: string; channelUrl?: string; sport: string; color?: string }
  | { kind: 'ad'; id: string; date: string; sport: string; campaign: Campaign };

/** Competiciones que alimentan el directo, en orden de interés para el lector español. */
const COMPS: [string, string][] = [
  ['futbol', 'laliga'], ['futbol', 'champions-league'], ['futbol', 'premier-league'], ['baloncesto', 'nba'],
  ['motor', 'formula-1'], ['tenis', 'atp'], ['futbol', 'serie-a'], ['baloncesto', 'euroliga'], ['motor', 'motogp'],
];
/** Canales oficiales para las tarjetas de vídeo (deporte ESPN, id de equipo ESPN, nombre). */
const CLUB_VIDEOS: [string, string, string][] = [
  ['soccer', '86', 'Real Madrid'], ['soccer', '83', 'FC Barcelona'], ['soccer', '1068', 'Atlético de Madrid'], ['soccer', '93', 'Athletic Club'],
];

/** Intercala listas (a, b, c, a, b, c…) para que no salgan diez tarjetas iguales seguidas. */
function interleave<T>(lists: T[][]): T[] {
  const qs = lists.map((l) => [...l]);
  const out: T[] = [];
  while (qs.some((q) => q.length)) for (const q of qs) { const x = q.shift(); if (x) out.push(x); }
  return out;
}

/** Competiciones de un deporte con prensa o datos ESPN, hasta 8. */
function sportComps(sport: string): Competition[] {
  const withPress = new Set(PRESS_FEEDS.flatMap((f) => f.comps ?? []));
  return competitionsOf(sport).filter((c) => !c.href && (withPress.has(c.slug) || c.espn)).slice(0, 8);
}

/**
 * Tarjetas del directo. Sin `sport`, la mezcla general de la portada; con
 * `sport`, solo ese deporte (sus competiciones, piezas y marcadores).
 */
export async function buildLiveFeed(withLocale: (h: string) => string, opts: { sport?: string } = {}): Promise<FeedCard[]> {
  const { sport } = opts;
  const comps = sport ? sportComps(sport) : COMPS.map(([s, c]) => getCompetition(s, c)).filter(Boolean) as Competition[];

  const [pressLists, matches] = await Promise.all([
    // Dentro de cada competición, primero prensa española (el lector es de aquí) y con foto.
    Promise.all(comps.map(async (c) => (await fetchCompetitionPress(c, 8))
      .sort((a, b) => Number(b.region === 'ES') - Number(a.region === 'ES') || Number(Boolean(b.image)) - Number(Boolean(a.image)))
      .map((i): FeedCard => ({
      kind: 'press', id: i.link, title: i.title, source: i.source, date: i.date, href: i.link, image: i.image,
      comp: c.shortName ?? c.name, sport: c.sport, lang: i.lang,
    })))),
    fetchWindow(comps.filter((c) => c.espn), dayKeys(-1, 0), 120),
  ]);

  // Marcadores: en juego primero, luego terminados de hoy y ayer.
  const scores: FeedCard[] = matches
    .filter((m) => m.state === 'in' || m.state === 'post')
    .sort((a, b) => (a.state === 'in' ? -1 : 0) - (b.state === 'in' ? -1 : 0) || b.date.localeCompare(a.date))
    .slice(0, 10)
    .map((m) => ({ kind: 'score', id: `${m.competition.slug}-${m.id}`, date: m.date, comp: m.competition.name, sport: m.competition.sport,
      href: withLocale(`/${m.competition.sport}/${m.competition.slug}/partido/${m.id}`), match: m }));

  // Propias: las piezas editoriales (kind 'noticia', últimas 72 h) tienen hueco
  // reservado para que las crónicas y previas automáticas no las desplacen.
  const pool = getLatestNews(80).filter((n) => !sport || (n.competition?.sport ?? 'futbol') === sport);
  const since = new Date(Date.now() - 72 * 3600_000).toISOString();
  const editorial = pool.filter((n) => newsKind(n) === 'noticia' && n.publishedAt >= since).slice(0, 6);
  const auto = pool.filter((n) => !editorial.includes(n)).slice(0, 12 - editorial.length);
  // Alterna una propia y una automática, empezando por la propia.
  const ordered = Array.from({ length: Math.max(editorial.length, auto.length) }, (_, i) => [editorial[i], auto[i]])
    .flat()
    .filter((n): n is (typeof pool)[number] => Boolean(n));
  const news: FeedCard[] = ordered.slice(0, 12).map((n) => ({
    kind: 'news', id: n.slug, title: n.title, summary: n.summary, date: n.publishedAt, href: withLocale(`/noticias/${n.slug}`),
    image: newsImageUrl(n), label: NEWS_KIND_LABEL[newsKind(n)], sport: n.competition?.sport ?? 'futbol',
  }));

  const videos: FeedCard[] = (sport && sport !== 'futbol' ? [] : CLUB_VIDEOS).map(([sport, id, team]) => {
    const f = clubFacts(sport, id);
    return f?.youtubeChannelId ? { kind: 'video' as const, id: `yt-${id}`, date: '', team, channelId: f.youtubeChannelId, channelUrl: f.social?.youtube, sport: 'futbol' } : null;
  }).filter(Boolean) as FeedCard[];

  // Prensa: una competición tras otra; dentro, del más reciente al más antiguo.
  const press = interleave(pressLists);
  const seen = new Set<string>();
  const dedup = (c: FeedCard) => (seen.has(c.id) ? false : (seen.add(c.id), true));

  // Ritmo: 3 de prensa, 1 propia, 1 marcador; un vídeo cada ~8 tarjetas.
  const out: FeedCard[] = [];
  let p = 0, n = 0, s = 0, v = 0;
  while (p < press.length || n < news.length || s < scores.length) {
    for (let k = 0; k < 3 && p < press.length; k++) out.push(press[p++]);
    if (n < news.length) out.push(news[n++]);
    if (s < scores.length) out.push(scores[s++]);
    if (out.length >= 8 * (v + 1) && v < videos.length) out.push(videos[v++]);
  }
  // Publicidad: una campaña activa cada 9 tarjetas, alternando entre las disponibles.
  const ads = activeCampaigns('directo', sport);
  const final: FeedCard[] = [];
  out.filter(dedup).slice(0, 80).forEach((c, i) => {
    final.push(c);
    if (ads.length && (i + 1) % 9 === 0) { const a = ads[((i + 1) / 9 - 1) % ads.length]; final.push({ kind: 'ad', id: `${a.id}-${i}`, date: '', sport: sport ?? 'futbol', campaign: a }); }
  });
  // Id corto y estable por tarjeta (clave de las reacciones): tipo + hash del origen.
  return final.map((c) => ({ ...c, id: `${c.kind[0]}-${createHash('sha1').update(c.id).digest('hex').slice(0, 16)}` }));
}


/**
 * Catálogo de feeds RSS para el news-bot.
 *
 * Filosofía: maximizar diversidad geográfica e idiomática manteniendo
 * calidad editorial. Los feeds con `scope: 'wc-2026'` son los preferentes
 * porque ya pre-filtran el tema. Los `general-sport` requieren filtro fuerte
 * por keyword.
 *
 * Añadir un feed nuevo:
 *   1. Verifica que el feed devuelve XML válido (`curl -I <url>`).
 *   2. Pega aquí con id único.
 *   3. Asigna scope y weight realista.
 *   4. Ejecuta `tsx scripts/news-bot/fetch.ts --only=<id>` para validar.
 *
 * Si un feed deja de funcionar, NO borrar la entrada: marcarla con
 * `broken: 'razón'` y mover al bloque de feeds desactivados al final.
 */

import type { FeedSource } from './types';

export const FEEDS: FeedSource[] = [
  // ──────────────────────────────────────────
  // España (mercado prioritario SEO)
  // ──────────────────────────────────────────
  {
    id: 'marca-seleccion',
    name: 'Marca · Selección España',
    url: 'https://e00-marca.uecdn.es/rss/futbol/seleccion.xml',
    lang: 'es',
    region: 'ES',
    scope: 'wc-2026',
    weight: 1.8,
  },
  {
    id: 'marca-futbol',
    name: 'Marca · Fútbol',
    url: 'https://e00-marca.uecdn.es/rss/futbol.xml',
    lang: 'es',
    region: 'ES',
    scope: 'soccer',
    weight: 1.5,
  },
  {
    id: 'as-futbol',
    name: 'AS · Fútbol',
    url: 'https://as.com/rss/futbol/portada.xml',
    lang: 'es',
    region: 'ES',
    scope: 'soccer',
    weight: 1.4,
  },
  {
    id: 'mundo-deportivo',
    name: 'Mundo Deportivo · Fútbol',
    url: 'https://www.mundodeportivo.com/rss/futbol.xml',
    lang: 'es',
    region: 'ES',
    scope: 'soccer',
    weight: 1.3,
  },

  // ──────────────────────────────────────────
  // Reino Unido / USA
  // ──────────────────────────────────────────
  {
    id: 'guardian-football',
    name: 'The Guardian · Football',
    url: 'https://www.theguardian.com/football/rss',
    lang: 'en',
    region: 'UK',
    scope: 'soccer',
    weight: 1.3,
  },
  {
    id: 'bbc-football',
    name: 'BBC Sport · Football',
    url: 'http://feeds.bbci.co.uk/sport/football/rss.xml',
    lang: 'en',
    region: 'UK',
    scope: 'soccer',
    weight: 1.3,
  },
  {
    id: 'espn-soccer',
    name: 'ESPN · Soccer',
    url: 'https://www.espn.com/espn/rss/soccer/news',
    lang: 'en',
    region: 'US',
    scope: 'soccer',
    weight: 1.2,
  },

  // ──────────────────────────────────────────
  // Sudamérica
  // ──────────────────────────────────────────
  {
    id: 'globo-esporte',
    name: 'GE · Globo Esporte',
    url: 'https://ge.globo.com/dynamo/futebol/copa-do-mundo/rss2.xml',
    lang: 'pt',
    region: 'BR',
    scope: 'wc-2026',
    weight: 1.6,
  },
  {
    id: 'ole-ar',
    name: 'Olé',
    url: 'https://www.ole.com.ar/rss/futbol-internacional/',
    lang: 'es',
    region: 'AR',
    scope: 'soccer',
    weight: 1.2,
  },

  // ──────────────────────────────────────────
  // Europa continental
  // ──────────────────────────────────────────
  {
    id: 'gazzetta-mondiali',
    name: 'Gazzetta dello Sport · Mondiali',
    url: 'https://www.gazzetta.it/rss/Mondiali.xml',
    lang: 'it',
    region: 'IT',
    scope: 'wc-2026',
    weight: 1.8,
  },
  {
    id: 'gazzetta-home',
    name: 'Gazzetta dello Sport · Home',
    url: 'https://www.gazzetta.it/rss/home.xml',
    lang: 'it',
    region: 'IT',
    scope: 'general-sport',
    weight: 1.0,
  },

  // ──────────────────────────────────────────
  // CONCACAF + sudamérica adicional
  // ──────────────────────────────────────────
  {
    id: 'infobae-deportes',
    name: 'Infobae · Deportes',
    url: 'https://www.infobae.com/arc/outboundfeeds/rss/category/deportes/',
    lang: 'es',
    region: 'AR',
    scope: 'soccer',
    weight: 1.1,
  },
];

/**
 * Feeds desactivados (mantener listado para historial y eventual recuperación).
 * Cuando un feed se arregle, mover de vuelta al array principal.
 */
export const FEEDS_BROKEN: (FeedSource & { broken: string })[] = [
  {
    id: 'fifa-es',
    name: 'FIFA.com (ES)',
    url: 'https://www.fifa.com/api/feeds/rss.xml?language=es',
    lang: 'es',
    region: 'global',
    scope: 'wc-2026',
    weight: 2.0,
    broken: 'XML inválido (Invalid character in entity name). FIFA no mantiene RSS público estable.',
  },
  {
    id: 'fifa-en',
    name: 'FIFA.com (EN)',
    url: 'https://www.fifa.com/api/feeds/rss.xml?language=en',
    lang: 'en',
    region: 'global',
    scope: 'wc-2026',
    weight: 2.0,
    broken: 'Feed not recognized as RSS 1 or 2.',
  },
  {
    id: 'as-mundial',
    name: 'AS · Mundial 2026',
    url: 'https://as.com/rss/tag/copa_mundial_2026.xml',
    lang: 'es',
    region: 'ES',
    scope: 'wc-2026',
    weight: 1.8,
    broken: '404 — pattern de tag RSS no disponible en AS.',
  },
  {
    id: 'sport-futbol',
    name: 'Sport · Fútbol',
    url: 'https://www.sport.es/rss/futbol/seleccion-espanola/rss.xml',
    lang: 'es',
    region: 'ES',
    scope: 'soccer',
    weight: 1.2,
    broken: '404 — URL antigua. Sport movió su RSS a otro path; pendiente investigar.',
  },
  {
    id: 'lequipe-football',
    name: "L'Équipe · Football",
    url: 'https://www.lequipe.fr/rss/actu_rss_Football.xml',
    lang: 'fr',
    region: 'FR',
    scope: 'soccer',
    weight: 1.3,
    broken: "404 — L'Équipe deshabilitó este feed. Buscar alternativa.",
  },
  {
    id: 'kicker-de',
    name: 'Kicker · Fußball',
    url: 'https://www.kicker.de/news.rss',
    lang: 'de',
    region: 'DE',
    scope: 'soccer',
    weight: 1.1,
    broken: '403 — Kicker bloquea bots de RSS.',
  },
  {
    id: 'tyc-sports',
    name: 'TyC Sports',
    url: 'https://www.tycsports.com/rss/futbol.xml',
    lang: 'es',
    region: 'AR',
    scope: 'soccer',
    weight: 1.3,
    broken: '404',
  },
  {
    id: 'goal-en',
    name: 'Goal.com (EN)',
    url: 'https://www.goal.com/feeds/en/news',
    lang: 'en',
    region: 'global',
    scope: 'soccer',
    weight: 1.1,
    broken: '404 — Goal descontinuó RSS.',
  },
  {
    id: 'gazzetta-calcio',
    name: 'Gazzetta · Calcio (sección)',
    url: 'https://www.gazzetta.it/rss/Calcio.xml',
    lang: 'it',
    region: 'IT',
    scope: 'soccer',
    weight: 1.0,
    broken: '404 — la URL específica de Calcio no existe. Cubrimos con Mondiali + Home (ambos activos)',
  },
  {
    id: 'medio-tiempo-mx',
    name: 'Medio Tiempo',
    url: 'https://www.mediotiempo.com/rss',
    lang: 'es',
    region: 'MX',
    scope: 'soccer',
    weight: 1.3,
    broken: '404',
  },
  {
    id: 'record-mx',
    name: 'Récord México',
    url: 'https://www.record.com.mx/rss',
    lang: 'es',
    region: 'MX',
    scope: 'soccer',
    weight: 1.4,
    broken: '404',
  },
];

export function getFeedsBy(filter: { scope?: FeedSource['scope']; lang?: FeedSource['lang']; ids?: string[] }) {
  return FEEDS.filter((f) => {
    if (filter.ids && !filter.ids.includes(f.id)) return false;
    if (filter.scope && f.scope !== filter.scope) return false;
    if (filter.lang && f.lang !== filter.lang) return false;
    return true;
  });
}

/**
 * Política de indexación (2026-10-25), a partir de la inspección de Search Console:
 * el portal (equipos, subpáginas de competición) estaba «Detectada / desconocida»
 * en un 85-100 %, las crónicas automáticas casi nunca entraban (1 de 33) y el
 * sitemap pedía 9.147 URLs. Se indexa lo que aporta y el resto va `noindex, follow`
 * (el usuario las sigue viendo y los enlaces siguen pasando autoridad).
 *
 * Una sola regla para metadatos y sitemap: ninguna URL del sitemap lleva noindex.
 */

/** Competiciones con subpáginas indexables (calendario, resultados, clasificación). */
export const MAIN_COMPS = new Set([
  'laliga', 'laliga-2', 'premier-league', 'serie-a', 'bundesliga', 'ligue-1', 'champions-league', 'europa-league',
  'copa-del-rey', 'liga-f', 'nba', 'euroliga', 'nfl', 'formula-1', 'motogp',
]);

/** Ligas cuyas fichas de equipo (solo la principal) se indexan. */
export const TEAM_INDEX_COMPS = new Set(['laliga', 'premier-league', 'serie-a', 'bundesliga', 'ligue-1', 'nba']);

/** Crónicas automáticas que se mantienen indexables. */
export const AUTO_NEWS_INDEX_COMPS = new Set(['laliga', 'champions-league', 'nba']);

const SPORTS = /^(futbol|baloncesto|futbol-americano|rugby|hockey|beisbol|motor|tenis|golf|combate|balonmano)$/;

/** ¿Se indexa esta ruta (sin prefijo de idioma)? */
export function isIndexablePath(path: string): boolean {
  const p = path.replace(/\/+$/, '').split('/').filter(Boolean);
  if (p.length < 3 || !SPORTS.test(p[0])) return true; // portada, deportes, competiciones, archivo, noticias…
  const [, comp, section, , sub] = p;
  if (section === 'equipo') return !sub && TEAM_INDEX_COMPS.has(comp);
  if (['partidos-hoy', 'alineaciones', 'goleadores', 'lesionados', 'jugador'].includes(section)) return false;
  if (section === 'partido') return MAIN_COMPS.has(comp);
  if (section === 'resultados' && p.length > 3) return false; // resultados/jornada-N
  if (['calendario', 'resultados', 'clasificacion'].includes(section)) return MAIN_COMPS.has(comp);
  return true; // luchador, evento, rankings, salarios, piloto, velada…
}

/** Piezas del bot diario (plantillas deterministas), reconocibles por el slug. */
const AUTO_SLUG = /^(?:(?:cronica|previa)-.+-\d{6,}|partidos-[a-z-]+-hoy-\d{4}-\d{2}-\d{2}|clasificacion-.+-semana-\d+|nfl-semana-\d+|nba-resultados-\d{4}-\d{2}-\d{2})$/;

export const isAutoNews = (slug: string) => AUTO_SLUG.test(slug);

/** ¿Se indexa esta noticia? Las del bot solo en LaLiga, Champions y NBA, y nunca las agendas o tablas semanales. */
export function isIndexableNews(n: { slug: string; competition?: { slug: string } }): boolean {
  if (!isAutoNews(n.slug)) return true;
  if (/^(partidos-|clasificacion-)/.test(n.slug)) return false;
  return AUTO_NEWS_INDEX_COMPS.has(n.competition?.slug ?? '');
}

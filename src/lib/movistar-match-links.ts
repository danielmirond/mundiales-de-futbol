/**
 * Movistar Plus+ · AWIN match affiliate links
 *
 * Programa AWIN: afiliado 2898755 / anunciante Movistar Plus+ 114230
 *
 * Thumbnail por partido: https://www.movistarplus.es/recorte/n/mod_de/MLIGBARD{matchId}
 * Fuente: HTML oficial movistarplus.es/deportes/futbol/mundial
 *
 * Precios verificados (jun 2026):
 *  · OTT Movistar Plus+ (sin fibra):  9,99 €/mes
 *  · Movistar Fútbol Total (con fibra+móvil): 50 €/mes IVA incl.
 */

export type MovistarMatchLink = {
  label: string;
  href: string;
  /** ID del partido en Movistar Plus+ → thumbnail MLIGBARD{matchId} */
  matchId?: string;
};

const AWIN_BASE = 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=';
const M_BASE    = 'https://www.movistarplus.es';

/** Construye URL AWIN a partir de la URL directa de M+ */
function awin(path: string): string {
  return AWIN_BASE + encodeURIComponent(M_BASE + path);
}

/** URL del thumbnail oficial del partido (CDN Movistar Plus+) */
export function getMatchThumbnail(matchId: string): string {
  return `${M_BASE}/recorte/n/mod_de/MLIGBARD${matchId}`;
}

export const MOVISTAR_MATCH_LINKS: Record<string, MovistarMatchLink> = {

  // ── Jornada 1 ────────────────────────────────────────────────────────────

  'ver-mexico-sudafrica-tv-online-mundial-2026-horario-grupo-b': {
    label: 'México vs Sudáfrica',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/mexico-sudafrica/ficha?tipo=E&id=4318260'),
    matchId: '4318260',
  },

  'ver-haiti-escocia-tv-mundial-2026-grupo-b': {
    label: 'Haití vs Escocia',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/haiti-escocia/ficha?tipo=E&id=4318287'),
    matchId: '4318287',
  },

  'ver-brasil-marruecos-tv-mundial-2026-grupo-b': {
    label: 'Brasil vs Marruecos',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/brasil-marruecos/ficha?tipo=E&id=4318286'),
    matchId: '4318286',
  },

  'ver-australia-turquia-tv-mundial-2026-grupo-c': {
    label: 'Australia vs Turquía',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/australia-turquia/ficha?tipo=E&id=4318294'),
    matchId: '4318294',
  },

  'ver-usa-paraguay-tv-online-mundial-2026-horario-grupo-c': {
    label: 'Estados Unidos vs Paraguay',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/estados-unidos-paraguay/ficha?tipo=E&id=4318293'),
    matchId: '4318293',
  },

  'ver-alemania-curacao-tv-mundial-2026-grupo-d': {
    label: 'Alemania vs Curazao',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/alemania-curazao/ficha?tipo=E&id=4318300'),
    matchId: '4318300',
  },

  'ver-paises-bajos-japon-tv-mundial-2026-grupo-e': {
    label: 'Países Bajos vs Japón',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/paises-bajos-japon/ficha?tipo=E&id=4318307'),
    matchId: '4318307',
  },

  'ver-corea-del-sur-republica-checa-tv-online-mundial-2026-horario-grupo-e': {
    label: 'Corea del Sur vs Chequia',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/corea-del-sur-chequia/ficha?tipo=E&id=4318261'),
    matchId: '4318261',
  },

  'ver-canada-bosnia-tv-online-mundial-2026-horario-grupo-f': {
    label: 'Canadá vs Bosnia-Herzegovina',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/canada-bosnia-y-herzegovina/ficha?tipo=E&id=4318267'),
    matchId: '4318267',
  },

  'ver-qatar-suiza-tv-mundial-2026-grupo-a': {
    label: 'Catar vs Suiza',
    href: awin('/deportes/futbol-internacional/mundial-2026-2026/catar-suiza/ficha?tipo=E&id=4318268'),
    matchId: '4318268',
  },

  // ── Añadir aquí el resto de jornadas conforme lleguen las fichas ──────────
  // Formato:
  // 'slug-del-articulo': {
  //   label: 'Equipo A vs Equipo B',
  //   href: awin('/deportes/futbol-internacional/mundial-2026-2026/[slug-m+]/ficha?tipo=E&id=[id]'),
  //   matchId: '[id]',
  // },
};

/** URL genérica del Mundial en M+ (fallback) */
export const DEFAULT_MOVISTAR_HREF = awin('/deportes/futbol/mundial');

/** Enlace de afiliado de DAZN (programa AWIN propio de DAZN, campaña Mundial 2026). */
export const DAZN_AFFILIATE_HREF =
  'https://www.awin1.com/cread.php?awinmid=126263&awinaffid=2898755&campaign=SMSWC2026';

export function getMovistarLink(slug: string): MovistarMatchLink {
  return MOVISTAR_MATCH_LINKS[slug] ?? { label: '', href: DEFAULT_MOVISTAR_HREF };
}

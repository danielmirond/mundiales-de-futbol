/**
 * Movistar Plus+ · AWIN match affiliate links
 *
 * Programa AWIN: afiliado 2898755 / anunciante Movistar Plus+ 114230
 *
 * Cada entrada: slug del artículo → { label, href }
 *   - href: URL de AWIN que redirige a la ficha del partido en movistarplus.es
 *   - label: nombre del partido para el copy del componente
 *
 * Añadir nuevos partidos cuando Movistar Plus+ publique las fichas:
 *   1. Obtener URL directa del partido en movistarplus.es
 *   2. Envolver con AWIN: https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=[encoded_url]
 *   3. Añadir entrada con el slug del artículo correspondiente
 *
 * URL genérica del Mundial (fallback cuando no hay ficha de partido):
 *   https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol%2Fmundial
 */

export type MovistarMatchLink = {
  /** Nombre legible del partido, usado en el copy del CTA */
  label: string;
  /** URL AWIN completa (no la URL directa de movistarplus.es) */
  href: string;
};

/**
 * Lookup: slug del artículo → datos del enlace de afiliado.
 *
 * Si un slug no está aquí, los componentes usan el DEFAULT_MOVISTAR_HREF.
 */
export const MOVISTAR_MATCH_LINKS: Record<string, MovistarMatchLink> = {

  // ── Jornada 1 (10-15 junio) ──────────────────────────────────────────────

  'ver-mexico-sudafrica-tv-online-mundial-2026-horario-grupo-b': {
    label: 'México vs Sudáfrica',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fmexico-sudafrica%2Fficha%3Ftipo%3DE%26id%3D4318260',
  },

  'ver-haiti-escocia-tv-mundial-2026-grupo-b': {
    label: 'Haití vs Escocia',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fhaiti-escocia%2Fficha%3Ftipo%3DE%26id%3D4318287',
  },

  'ver-brasil-marruecos-tv-mundial-2026-grupo-b': {
    label: 'Brasil vs Marruecos',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fbrasil-marruecos%2Fficha%3Ftipo%3DE%26id%3D4318286',
  },

  'ver-australia-turquia-tv-mundial-2026-grupo-c': {
    label: 'Australia vs Turquía',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Faustralia-turquia%2Fficha%3Ftipo%3DE%26id%3D4318294',
  },

  'ver-usa-paraguay-tv-online-mundial-2026-horario-grupo-c': {
    label: 'Estados Unidos vs Paraguay',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Festados-unidos-paraguay%2Fficha%3Ftipo%3DE%26id%3D4318293',
  },

  'ver-alemania-curacao-tv-mundial-2026-grupo-d': {
    label: 'Alemania vs Curazao',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Falemania-curazao%2Fficha%3Ftipo%3DE%26id%3D4318300',
  },

  'ver-paises-bajos-japon-tv-mundial-2026-grupo-e': {
    label: 'Países Bajos vs Japón',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fpaises-bajos-japon%2Fficha%3Ftipo%3DE%26id%3D4318307',
  },

  'ver-corea-del-sur-republica-checa-tv-online-mundial-2026-horario-grupo-e': {
    label: 'Corea del Sur vs Rep. Checa',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fcorea-del-sur-chequia%2Fficha%3Ftipo%3DE%26id%3D4318261',
  },

  'ver-canada-bosnia-tv-online-mundial-2026-horario-grupo-f': {
    label: 'Canadá vs Bosnia-Herzegovina',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fcanada-bosnia-y-herzegovina%2Fficha%3Ftipo%3DE%26id%3D4318267',
  },

  'ver-qatar-suiza-tv-mundial-2026-grupo-a': {
    label: 'Catar vs Suiza',
    href: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol-internacional%2Fmundial-2026-2026%2Fcatar-suiza%2Fficha%3Ftipo%3DE%26id%3D4318268',
  },

  // ── Añadir aquí conforme lleguen más fichas de Movistar Plus+ ─────────────
  // Formato: 'slug-del-articulo': { label: 'Equipo A vs Equipo B', href: 'https://www.awin1.com/...' },

};

/** URL genérica del Mundial en Movistar Plus+ (fallback) */
export const DEFAULT_MOVISTAR_HREF =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol%2Fmundial';

/**
 * Devuelve el enlace de Movistar Plus+ para un slug dado.
 * Si no hay ficha específica, devuelve el enlace genérico del Mundial.
 */
export function getMovistarLink(slug: string): MovistarMatchLink {
  return (
    MOVISTAR_MATCH_LINKS[slug] ?? {
      label: undefined as unknown as string,
      href: DEFAULT_MOVISTAR_HREF,
    }
  );
}

/**
 * Guías de «dónde ver» por competición (piezas de /noticias con enlaces de afiliado).
 * Las fichas de partido y las páginas de competición enlazan a la suya; si una
 * competición no tiene guía propia, enlazan a la general.
 */
export const WATCH_GUIDE_GENERAL = 'donde-ver-deporte-espana-2026-27-canales-precios-laliga-champions-nba-f1';

const BY_COMPETITION: Record<string, { slug: string; label: string }> = {
  laliga: { slug: 'donde-ver-laliga-2026-27-movistar-dazn-precios-jornadas-exclusivas-clasico', label: 'LaLiga' },
  'champions-league': { slug: 'donde-ver-champions-league-2026-27-espana-movistar-precios-final-metropolitano', label: 'la Champions' },
  'europa-league': { slug: 'donde-ver-champions-league-2026-27-espana-movistar-precios-final-metropolitano', label: 'la Europa League' },
  'conference-league': { slug: 'donde-ver-champions-league-2026-27-espana-movistar-precios-final-metropolitano', label: 'la Conference League' },
  'laliga-2': { slug: 'donde-ver-laliga-hypermotion-2026-27-dazn-movistar-precios-autonomicas', label: 'LaLiga Hypermotion' },
  'premier-league': { slug: 'donde-ver-premier-league-espana-2026-27-dazn-movistar-precios-serie-a-bundesliga', label: 'la Premier League' },
  'serie-a': { slug: 'donde-ver-premier-league-espana-2026-27-dazn-movistar-precios-serie-a-bundesliga', label: 'la Serie A' },
  bundesliga: { slug: 'donde-ver-premier-league-espana-2026-27-dazn-movistar-precios-serie-a-bundesliga', label: 'la Bundesliga' },
  'liga-f': { slug: 'donde-ver-liga-f-champions-femenina-2026-27-dazn-tve-disney-gratis', label: 'la Liga F' },
  'champions-femenina': { slug: 'donde-ver-liga-f-champions-femenina-2026-27-dazn-tve-disney-gratis', label: 'la Champions femenina' },
  nfl: { slug: 'donde-ver-nfl-espana-2026-dazn-game-pass-precios-horarios-bernabeu', label: 'la NFL' },
  nba: { slug: 'nba-2026-27-donde-ver-espana-dazn-prime-video-estreno-hugo-gonzalez-aldama', label: 'la NBA' },
  euroliga: { slug: 'donde-ver-euroliga-2026-27-espana-movistar-precios-real-madrid-barca', label: 'la Euroliga' },
  'liga-endesa': { slug: 'donde-ver-liga-endesa-2026-27-dazn-movistar-gratis-autonomicas', label: 'la Liga Endesa' },
  'formula-1': { slug: 'donde-ver-f1-motogp-espana-2026-dazn-precios-carreras-que-quedan', label: 'la Fórmula 1' },
  motogp: { slug: 'donde-ver-f1-motogp-espana-2026-dazn-precios-carreras-que-quedan', label: 'MotoGP' },
  atp: { slug: 'donde-ver-tenis-espana-atp-finals-copa-davis-alcaraz-movistar-hbo-max', label: 'el tenis' },
  wta: { slug: 'donde-ver-tenis-espana-atp-finals-copa-davis-alcaraz-movistar-hbo-max', label: 'el tenis' },
  ufc: { slug: 'donde-ver-ufc-boxeo-espana-hbo-max-eurosport-dazn-topuria-canelo', label: 'la UFC' },
  boxeo: { slug: 'donde-ver-ufc-boxeo-espana-hbo-max-eurosport-dazn-topuria-canelo', label: 'el boxeo' },
};

/** Guía de la competición, o la general con el nombre de la competición. */
export function watchGuideFor(compSlug: string, compName: string) {
  return BY_COMPETITION[compSlug] ?? { slug: WATCH_GUIDE_GENERAL, label: compName };
}

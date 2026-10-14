/**
 * Registro de deportes y competiciones del portal.
 *
 * Cada competición con `espn` definido tiene datos EN VIVO (scoreboard y, si
 * `hasStandings`, clasificación) vía la API pública de ESPN. Solo se registran
 * slugs de ESPN verificados; lo que aún no tiene fuente fiable va sin `espn`
 * y se muestra como "próximamente" (noindex) en lugar de inventar datos.
 *
 * Rutas: /[deporte]  y  /[deporte]/[competicion]  (ver src/app/[locale]/[deporte]).
 */

export type SportSlug = 'futbol' | 'baloncesto' | 'rugby' | 'balonmano' | 'motor' | 'tenis' | 'futbol-americano' | 'hockey' | 'beisbol' | 'golf' | 'combate';

export type Sport = {
  slug: SportSlug;
  name: string;
  /** Emoji heredado (archivo histórico); el portal usa `Icon` del set propio. */
  emoji: string;
  description: string;
};

export type CompetitionKind = 'liga' | 'copa' | 'torneo' | 'mundial';

export type Competition = {
  slug: string;
  name: string;
  shortName?: string;
  sport: SportSlug;
  kind: CompetitionKind;
  /** Mapeo ESPN: `sport` (soccer, basketball, rugby…) y `league` (esp.1…). */
  espn?: { sport: string; league: string; dateRange?: boolean };
  hasStandings: boolean;
  /** Plantilla alternativa cuando no es un partido local-visitante de ESPN: estadísticas OpenACB, tenis o motor. */
  stats?: 'openacb' | 'tennis' | 'racing' | 'golf' | 'combat';
  /** Ruta ESPN para las plantillas `tennis` y `racing` (no entran en los tableros de partidos). */
  feed?: { sport: string; league: string };
  flag?: string;
  /** Si la competición ya vive en otra sección (p. ej. el Mundial 2026 en /2026). */
  href?: string;
  description: string;
  keywords: string[];
};

export const SPORTS: Sport[] = [
  { slug: 'futbol', name: 'Fútbol', emoji: '⚽', description: 'Ligas, copas y torneos de selecciones: resultados, calendario y clasificaciones en directo.' },
  { slug: 'baloncesto', name: 'Baloncesto', emoji: '🏀', description: 'NBA y Euroliga: marcadores, calendario y clasificación.' },
  { slug: 'rugby', name: 'Rugby', emoji: '🏉', description: 'Seis Naciones y Mundial de rugby.' },
  { slug: 'balonmano', name: 'Balonmano', emoji: '🤾', description: 'Mundial y Europeo de balonmano.' },
  { slug: 'motor', name: 'Motor', emoji: '🏎️', description: 'Fórmula 1 y MotoGP: calendario y clasificación del mundial.' },
  { slug: 'tenis', name: 'Tenis', emoji: '🎾', description: 'Circuitos ATP y WTA: torneos en juego y partidos del día.' },
  { slug: 'futbol-americano', name: 'Fútbol americano', emoji: '🏈', description: 'NFL: resultados, calendario por semanas y clasificación por conferencias.' },
  { slug: 'hockey', name: 'Hockey hielo', emoji: '🏒', description: 'NHL: marcadores, calendario y clasificación.' },
  { slug: 'beisbol', name: 'Béisbol', emoji: '⚾', description: 'MLB: resultados, calendario y clasificación.' },
  { slug: 'golf', name: 'Golf', emoji: '⛳', description: 'PGA Tour, DP World Tour y LPGA: torneo en juego, tabla por vueltas y calendario.' },
  { slug: 'combate', name: 'Combate', emoji: '🥊', description: 'UFC: cartelera de cada velada, resultados y próximas fechas.' },
];

const SOCCER = (league: string, dateRange = false) => ({ sport: 'soccer', league, dateRange });

export const COMPETITIONS: Competition[] = [
  // ─── Fútbol · ligas ─────────────────────────────────────────────
  { slug: 'laliga', name: 'LaLiga', sport: 'futbol', kind: 'liga', espn: SOCCER('esp.1'), hasStandings: true, flag: '🇪🇸',
    description: 'Resultados, calendario y clasificación de LaLiga en directo, jornada a jornada.', keywords: ['laliga', 'resultados laliga', 'clasificación laliga', 'calendario laliga', 'partidos laliga hoy'] },
  { slug: 'laliga-2', name: 'LaLiga Hypermotion', shortName: 'LaLiga 2', sport: 'futbol', kind: 'liga', espn: SOCCER('esp.2'), hasStandings: true, flag: '🇪🇸',
    description: 'Resultados, calendario y clasificación de Segunda División (LaLiga Hypermotion).', keywords: ['segunda división', 'laliga hypermotion', 'clasificación segunda', 'resultados segunda división'] },
  { slug: 'premier-league', name: 'Premier League', sport: 'futbol', kind: 'liga', espn: SOCCER('eng.1'), hasStandings: true, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    description: 'Resultados, calendario y clasificación de la Premier League inglesa en directo.', keywords: ['premier league', 'resultados premier', 'clasificación premier league', 'partidos premier hoy'] },
  { slug: 'serie-a', name: 'Serie A', sport: 'futbol', kind: 'liga', espn: SOCCER('ita.1'), hasStandings: true, flag: '🇮🇹',
    description: 'Resultados, calendario y clasificación de la Serie A italiana.', keywords: ['serie a', 'calcio', 'clasificación serie a', 'resultados serie a'] },
  { slug: 'bundesliga', name: 'Bundesliga', sport: 'futbol', kind: 'liga', espn: SOCCER('ger.1'), hasStandings: true, flag: '🇩🇪',
    description: 'Resultados, calendario y clasificación de la Bundesliga alemana.', keywords: ['bundesliga', 'clasificación bundesliga', 'resultados bundesliga'] },
  { slug: 'ligue-1', name: 'Ligue 1', sport: 'futbol', kind: 'liga', espn: SOCCER('fra.1'), hasStandings: true, flag: '🇫🇷',
    description: 'Resultados, calendario y clasificación de la Ligue 1 francesa.', keywords: ['ligue 1', 'clasificación ligue 1', 'resultados ligue 1'] },
  // ─── Fútbol · copas europeas ────────────────────────────────────
  { slug: 'champions-league', name: 'Champions League', shortName: 'Champions', sport: 'futbol', kind: 'copa', espn: SOCCER('uefa.champions'), hasStandings: true,
    description: 'Resultados, calendario, fase liga y eliminatorias de la Champions League en directo.', keywords: ['champions league', 'resultados champions', 'clasificación champions', 'partidos champions hoy'] },
  { slug: 'europa-league', name: 'Europa League', sport: 'futbol', kind: 'copa', espn: SOCCER('uefa.europa'), hasStandings: true,
    description: 'Resultados, calendario y clasificación de la Europa League.', keywords: ['europa league', 'resultados europa league', 'clasificación europa league'] },
  { slug: 'conference-league', name: 'Conference League', sport: 'futbol', kind: 'copa', espn: SOCCER('uefa.europa.conf'), hasStandings: true,
    description: 'Resultados, calendario y clasificación de la Conference League.', keywords: ['conference league', 'resultados conference league'] },
  { slug: 'copa-del-rey', name: 'Copa del Rey', sport: 'futbol', kind: 'copa', espn: SOCCER('esp.copa_del_rey'), hasStandings: false, flag: '🇪🇸',
    description: 'Resultados y calendario de la Copa del Rey, eliminatoria a eliminatoria.', keywords: ['copa del rey', 'resultados copa del rey', 'sorteo copa del rey', 'partidos copa del rey'] },
  // ─── Fútbol · selecciones y torneos ─────────────────────────────
  { slug: 'mundial', name: 'Mundial 2026', sport: 'futbol', kind: 'mundial', espn: SOCCER('fifa.world', true), hasStandings: false, href: '/2026',
    description: 'Copa Mundial de la FIFA 2026: cuadro, resultados, goleadores e historia.', keywords: ['mundial 2026'] },
  { slug: 'eurocopa', name: 'Eurocopa', sport: 'futbol', kind: 'torneo', espn: SOCCER('uefa.euro'), hasStandings: true,
    description: 'Eurocopa: resultados, grupos y cuadro del Campeonato de Europa de selecciones.', keywords: ['eurocopa', 'resultados eurocopa', 'grupos eurocopa', 'cuadro eurocopa'] },
  { slug: 'copa-america', name: 'Copa América', sport: 'futbol', kind: 'torneo', espn: SOCCER('conmebol.america'), hasStandings: true,
    description: 'Copa América: resultados, grupos y cuadro.', keywords: ['copa américa', 'resultados copa américa', 'grupos copa américa'] },
  { slug: 'mundial-de-clubes', name: 'Mundial de Clubes', sport: 'futbol', kind: 'mundial', espn: SOCCER('fifa.cwc'), hasStandings: true,
    description: 'Mundial de Clubes de la FIFA: resultados, grupos y cuadro.', keywords: ['mundial de clubes', 'resultados mundial de clubes', 'cuadro mundial de clubes'] },
  { slug: 'nations-league', name: 'Nations League', sport: 'futbol', kind: 'torneo', espn: SOCCER('uefa.nations'), hasStandings: true,
    description: 'UEFA Nations League: resultados, grupos y clasificación.', keywords: ['nations league', 'resultados nations league', 'clasificación nations league'] },
  // ─── Baloncesto ─────────────────────────────────────────────────
  { slug: 'nba', name: 'NBA', sport: 'baloncesto', kind: 'liga', espn: { sport: 'basketball', league: 'nba' }, hasStandings: true, flag: '🇺🇸',
    description: 'NBA: marcadores en directo, calendario y clasificación por conferencias.', keywords: ['nba', 'resultados nba', 'clasificación nba', 'partidos nba hoy'] },
  { slug: 'euroliga', name: 'Euroliga', sport: 'baloncesto', kind: 'liga', espn: { sport: 'basketball', league: 'euroleague' }, hasStandings: true,
    description: 'Euroliga de baloncesto: marcadores, calendario y clasificación.', keywords: ['euroliga', 'resultados euroliga', 'clasificación euroliga'] },
  { slug: 'liga-endesa', name: 'Liga Endesa', shortName: 'Liga Endesa', sport: 'baloncesto', kind: 'liga', hasStandings: false, stats: 'openacb', flag: '🇪🇸',
    description: 'Liga Endesa (ACB): estadísticas avanzadas de los 18 equipos actualizadas cada semana, ratings, ritmo y cuatro factores.', keywords: ['liga endesa', 'acb', 'estadísticas liga endesa', 'liga endesa equipos', 'baloncesto acb'] },
  { slug: 'mundial-de-baloncesto', name: 'Mundial de Baloncesto', sport: 'baloncesto', kind: 'mundial', hasStandings: false,
    description: 'Copa del Mundo FIBA de baloncesto.', keywords: ['mundial de baloncesto', 'mundial fiba'] },
  // ─── Rugby ──────────────────────────────────────────────────────
  { slug: 'seis-naciones', name: 'Seis Naciones', sport: 'rugby', kind: 'torneo', espn: { sport: 'rugby', league: '180659' }, hasStandings: true,
    description: 'Torneo de las Seis Naciones: resultados, calendario y clasificación.', keywords: ['seis naciones', 'six nations', 'resultados seis naciones'] },
  { slug: 'mundial-de-rugby', name: 'Mundial de Rugby', sport: 'rugby', kind: 'mundial', hasStandings: false,
    description: 'Copa Mundial de Rugby.', keywords: ['mundial de rugby'] },
  // ─── Balonmano ──────────────────────────────────────────────────
  { slug: 'mundial-de-balonmano', name: 'Mundial de Balonmano', sport: 'balonmano', kind: 'mundial', hasStandings: false,
    description: 'Campeonato Mundial de Balonmano.', keywords: ['mundial de balonmano'] },
  // ─── Motor ──────────────────────────────────────────────────────
  { slug: 'formula-1', name: 'Fórmula 1', shortName: 'F1', sport: 'motor', kind: 'mundial', hasStandings: false, stats: 'racing', feed: { sport: 'racing', league: 'f1' },
    description: 'Mundial de Fórmula 1: calendario de grandes premios y clasificación de pilotos.', keywords: ['fórmula 1', 'f1', 'calendario f1', 'clasificación f1'] },
  { slug: 'motogp', name: 'MotoGP', sport: 'motor', kind: 'mundial', hasStandings: false,
    description: 'Mundial de MotoGP: calendario y clasificación.', keywords: ['motogp', 'calendario motogp', 'clasificación motogp'] },
  // ─── Tenis ──────────────────────────────────────────────────────
  { slug: 'atp', name: 'ATP', sport: 'tenis', kind: 'torneo', hasStandings: false, stats: 'tennis', feed: { sport: 'tennis', league: 'atp' },
    description: 'Circuito ATP: torneos y ranking.', keywords: ['atp', 'ranking atp'] },
  { slug: 'wta', name: 'WTA', sport: 'tenis', kind: 'torneo', hasStandings: false, stats: 'tennis', feed: { sport: 'tennis', league: 'wta' },
    description: 'Circuito WTA: torneos y ranking.', keywords: ['wta', 'ranking wta'] },
  // ─── Fútbol americano, hockey y béisbol (ESPN) ──────────────────
  { slug: 'nfl', name: 'NFL', sport: 'futbol-americano', kind: 'liga', espn: { sport: 'football', league: 'nfl' }, hasStandings: true, flag: '🇺🇸',
    description: 'NFL: resultados en directo, calendario semana a semana y clasificación por conferencias.', keywords: ['nfl', 'resultados nfl', 'clasificación nfl', 'partidos nfl hoy', 'calendario nfl'] },
  { slug: 'nhl', name: 'NHL', sport: 'hockey', kind: 'liga', espn: { sport: 'hockey', league: 'nhl' }, hasStandings: true, flag: '🇺🇸',
    description: 'NHL: marcadores en directo, calendario y clasificación por conferencias.', keywords: ['nhl', 'resultados nhl', 'clasificación nhl', 'partidos nhl hoy'] },
  { slug: 'mlb', name: 'MLB', sport: 'beisbol', kind: 'liga', espn: { sport: 'baseball', league: 'mlb' }, hasStandings: true, flag: '🇺🇸',
    description: 'MLB: resultados, calendario, playoffs y clasificación de la Liga Americana y la Nacional.', keywords: ['mlb', 'resultados mlb', 'clasificación mlb', 'playoffs mlb', 'serie mundial'] },
  // ─── Golf y combate (plantillas propias) ────────────────────────
  { slug: 'pga-tour', name: 'PGA Tour', sport: 'golf', kind: 'torneo', hasStandings: false, stats: 'golf', feed: { sport: 'golf', league: 'pga' }, flag: '🇺🇸',
    description: 'PGA Tour: torneo en juego con la tabla por vueltas y calendario de la temporada.', keywords: ['pga tour', 'golf pga', 'clasificación pga', 'torneo de golf'] },
  { slug: 'dp-world-tour', name: 'DP World Tour', sport: 'golf', kind: 'torneo', hasStandings: false, stats: 'golf', feed: { sport: 'golf', league: 'eur' },
    description: 'DP World Tour (circuito europeo): torneo en juego, tabla y calendario, con los golfistas españoles.', keywords: ['dp world tour', 'circuito europeo de golf', 'golf europeo'] },
  { slug: 'lpga', name: 'LPGA', sport: 'golf', kind: 'torneo', hasStandings: false, stats: 'golf', feed: { sport: 'golf', league: 'lpga' },
    description: 'LPGA: circuito femenino de golf, torneo en juego y calendario.', keywords: ['lpga', 'golf femenino', 'torneo lpga'] },
  { slug: 'ufc', name: 'UFC', sport: 'combate', kind: 'torneo', hasStandings: false, stats: 'combat', feed: { sport: 'mma', league: 'ufc' },
    description: 'UFC: cartelera completa de cada velada, resultados con el método de victoria y próximas veladas.', keywords: ['ufc', 'resultados ufc', 'cartelera ufc', 'próxima velada ufc'] },
  // ─── Baloncesto femenino ───────────────────────────────────────
  { slug: 'wnba', name: 'WNBA', sport: 'baloncesto', kind: 'liga', espn: { sport: 'basketball', league: 'wnba' }, hasStandings: true, flag: '🇺🇸',
    description: 'WNBA: marcadores, calendario y clasificación de la liga femenina de baloncesto.', keywords: ['wnba', 'resultados wnba', 'clasificación wnba'] },
];

export const KIND_LABEL: Record<CompetitionKind, string> = {
  liga: 'Ligas', copa: 'Copas', torneo: 'Torneos de selecciones', mundial: 'Mundiales',
};

export function getSport(slug: string): Sport | undefined {
  return SPORTS.find((s) => s.slug === slug);
}
export function getCompetition(sport: string, slug: string): Competition | undefined {
  return COMPETITIONS.find((c) => c.sport === sport && c.slug === slug);
}
export function competitionsOf(sport: string): Competition[] {
  return COMPETITIONS.filter((c) => c.sport === sport);
}
/** Competiciones con datos en vivo (ESPN) y sin redirección a otra sección. */
export function liveCompetitions(sport?: string): Competition[] {
  return COMPETITIONS.filter((c) => c.espn && !c.href && (!sport || c.sport === sport));
}
export const competitionPath = (c: Competition) => c.href ?? `/${c.sport}/${c.slug}`;

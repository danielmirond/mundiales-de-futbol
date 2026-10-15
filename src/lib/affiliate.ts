/**
 * Enlaces de afiliado (Awin, publisher 2898755) de las plataformas que
 * emiten deporte en España. Todo enlace que salga de aquí lleva
 * rel="sponsored" y se marca como afiliado en la interfaz.
 */
const awin = (mid: number, url: string) => `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=2898755&ued=${encodeURIComponent(url)}`;

export const MOVISTAR_AFF = awin(114230, 'https://www.movistarplus.es/deportes');
export const DAZN_AFF = awin(126263, 'https://www.dazn.com/es-ES/home');
export const DAZN_NFL_AFF = awin(126263, 'https://www.dazn.com/nfl-game-pass');

export type Platform = 'movistar' | 'dazn';
export const PLATFORM_LABEL: Record<Platform, string> = { movistar: 'Movistar Plus+', dazn: 'DAZN' };
export const PLATFORM_URL: Record<Platform, string> = { movistar: MOVISTAR_AFF, dazn: DAZN_AFF };

/** Plataforma de pago (afiliada) a la que pertenece un canal de TV, si alguna. */
export function platformOf(channel: string): Platform | null {
  if (/dazn/i.test(channel)) return 'dazn';
  if (/movistar|^m\+|\bm\.\s?|#vamos|liga de campeones|laliga tv|ellas v|vamos/i.test(channel)) return 'movistar';
  return null;
}

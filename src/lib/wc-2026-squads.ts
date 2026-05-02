/**
 * Convocatorias del Mundial 2026 por selección.
 *
 * Reglas FIFA:
 *  - Lista provisional (35-55 jugadores) entrega 11 mayo 2026.
 *  - Lista definitiva (23-26 jugadores con 3 porteros obligatorios)
 *    entrega 1 junio 2026.
 *  - Reemplazos por lesión hasta 24 h antes del primer partido del equipo.
 *
 * Cómo actualizar este archivo:
 *  1. Cuando una federación anuncie su lista provisional, cambia
 *     `status` a 'provisional' y añade los nombres a `players[]`.
 *  2. Cuando publique la lista definitiva, cambia a 'final'.
 *  3. Actualiza `announcedAt` y `announcementSource` con URL real.
 *  4. Si hay reemplazo por lesión, marca el jugador con `replacedBy`
 *     dentro del array `players` (mantenemos histórico).
 */

import { TEAMS_2026 } from './wc-2026';

export type Player2026 = {
  /** Dorsal (1-26). null hasta que la federación lo confirme. */
  shirt: number | null;
  /** Nombre completo o el más usado del jugador. */
  name: string;
  /** Posición: GK, DF, MF, FW. */
  position: 'GK' | 'DF' | 'MF' | 'FW';
  /** Club al momento del anuncio. */
  club: string;
  /** País del club (código FIFA o nombre breve). */
  clubCountry: string;
  /** Edad al inicio del Mundial (11 jun 2026). */
  age: number;
  /** Mundiales anteriores disputados (debutante = 0). */
  previousWcs: number;
  /** Capitán. */
  captain?: boolean;
  /** Si el jugador entra como reemplazo por lesión, slug del que sustituye. */
  replacementFor?: string;
  /** Notas editoriales (lesión, debate convocatoria, etc.). */
  note?: string;
};

export type SquadStatus = 'pending' | 'provisional' | 'final';

export type Squad2026 = {
  /** Código FIFA de la selección. */
  teamCode: string;
  /** Estado de la convocatoria. */
  status: SquadStatus;
  /** Seleccionador. */
  coach?: string;
  /** Nacionalidad del seleccionador. */
  coachNationality?: string;
  /** Fecha del anuncio (ISO 8601). */
  announcedAt?: string;
  /** Fuente del anuncio (URL, normalmente la federación oficial). */
  announcementSource?: string;
  /** Nombre del medio si la fuente es prensa. */
  announcementSourceName?: string;
  /** Resumen editorial propio del anuncio. */
  summary?: string;
  /** Lista de convocados (orden por dorsal). */
  players: Player2026[];
  /** Capitán confirmado. */
  captainName?: string;
  /** Sede del primer partido del equipo. */
  firstMatch?: { date: string; opponent: string; venue: string };
};

/**
 * Squads de las 48 selecciones. Inicialmente todas en 'pending'.
 * Se rellenan a partir del 5 mayo conforme cada federación anuncie.
 */
export const SQUADS_2026: Squad2026[] = Object.keys(TEAMS_2026).map(
  (teamCode) => ({
    teamCode,
    status: 'pending',
    players: [],
  }),
);

export function getSquadByTeam(teamCode: string): Squad2026 | undefined {
  return SQUADS_2026.find((s) => s.teamCode === teamCode);
}

/** Selecciones cuya lista ya ha sido anunciada (provisional o final). */
export function getAnnouncedSquads(): Squad2026[] {
  return SQUADS_2026.filter((s) => s.status !== 'pending')
    .sort((a, b) =>
      (b.announcedAt ?? '').localeCompare(a.announcedAt ?? ''),
    );
}

/** Selecciones aún sin anunciar lista. */
export function getPendingSquads(): Squad2026[] {
  return SQUADS_2026.filter((s) => s.status === 'pending');
}

export const STATUS_LABELS: Record<SquadStatus, string> = {
  pending: 'Por anunciar',
  provisional: 'Lista provisional',
  final: 'Lista definitiva',
};

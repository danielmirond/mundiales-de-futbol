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
  /** URL absoluta de la foto del jugador. Preferentemente Wikimedia Commons. */
  photoUrl?: string;
  /** Slug interno del jugador (para enlazar a `/jugadores/{slug}`). */
  playerSlug?: string;
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

// ───────────────────────────────────────────────────────────────────
// Metadata de las convocatorias anunciadas
// ───────────────────────────────────────────────────────────────────
//
// Última actualización: 2026-05-20. Fuentes cruzadas: ESPN, Olympics.com,
// federaciones oficiales, Wikipedia. Players[] se completa por selección
// según vamos verificando rosters (ver `scripts/research/squads-2026/`).
//
// Política editorial:
//  - `status` solo se marca cuando la federación oficial confirma.
//  - `announcementSource` apunta preferentemente a la federación; si
//    no hay nota oficial, link al medio que la publicó primero.
//  - `players` puede estar vacío con `status === 'final'` mientras
//    completamos verificación de los 26 nombres. La página muestra
//    el estado del anuncio aunque no tenga jugadores listados todavía.

type SquadMeta = Omit<Squad2026, 'teamCode' | 'players'>;

const SQUAD_METADATA: Record<string, SquadMeta> = {
  // ─── LISTAS FINALES (26 jugadores) ─────────────────────────────
  BIH: {
    status: 'final',
    coach: 'Sergej Barbarez',
    announcedAt: '2026-05-11',
    announcementSourceName: 'NSBiH',
    announcementSource: 'https://nsbih.ba/',
  },
  SWE: {
    status: 'final',
    coach: 'Graham Potter',
    coachNationality: 'ENG',
    announcedAt: '2026-05-12',
    announcementSourceName: 'Svenska Fotbollförbundet',
    announcementSource: 'https://www.svenskfotboll.se/',
  },
  NZL: {
    status: 'final',
    coach: 'Darren Bazeley',
    announcedAt: '2026-05-14',
    announcementSourceName: 'New Zealand Football',
    announcementSource: 'https://www.nzfootball.co.nz/',
  },
  FRA: {
    status: 'final',
    coach: 'Didier Deschamps',
    announcedAt: '2026-05-14',
    announcementSourceName: 'FFF',
    announcementSource: 'https://www.fff.fr/',
  },
  BEL: {
    status: 'final',
    coach: 'Rudi Garcia',
    coachNationality: 'FRA',
    announcedAt: '2026-05-15',
    announcementSourceName: 'URBSFA',
    announcementSource: 'https://www.belgianfootball.be/',
  },
  CIV: {
    status: 'final',
    coach: 'Emerse Faé',
    announcedAt: '2026-05-15',
    announcementSourceName: 'FIF',
    announcementSource: 'https://fif.ci/',
  },
  JPN: {
    status: 'final',
    coach: 'Hajime Moriyasu',
    announcedAt: '2026-05-15',
    announcementSourceName: 'JFA',
    announcementSource: 'https://www.jfa.jp/',
  },
  TUN: {
    status: 'final',
    coach: 'Sabri Lamouchi',
    announcedAt: '2026-05-15',
    announcementSourceName: 'FTF',
    announcementSource: 'https://ftf.org.tn/',
  },
  HAI: {
    status: 'final',
    coach: 'Sébastien Migné',
    coachNationality: 'FRA',
    announcedAt: '2026-05-15',
    announcementSourceName: 'FHF',
    announcementSource: 'https://fhfhaiti.com/',
  },
  KOR: {
    status: 'final',
    coach: 'Hong Myung-bo',
    announcedAt: '2026-05-16',
    announcementSourceName: 'KFA',
    announcementSource: 'https://www.kfa.or.kr/',
  },
  BRA: {
    status: 'final',
    coach: 'Carlo Ancelotti',
    coachNationality: 'ITA',
    announcedAt: '2026-05-18',
    announcementSourceName: 'CBF',
    announcementSource: 'https://www.cbf.com.br/',
  },
  AUT: {
    status: 'final',
    coach: 'Ralf Rangnick',
    coachNationality: 'GER',
    announcedAt: '2026-05-18',
    announcementSourceName: 'ÖFB',
    announcementSource: 'https://www.oefb.at/',
  },
  CPV: {
    status: 'final',
    coach: 'Bubista',
    announcedAt: '2026-05-18',
    announcementSourceName: 'FCF',
    announcementSource: 'https://www.fcf.cv/',
  },
  CRO: {
    status: 'final',
    coach: 'Zlatko Dalić',
    announcedAt: '2026-05-18',
    announcementSourceName: 'HNS',
    announcementSource: 'https://hns-cff.hr/',
  },
  CUW: {
    status: 'final',
    coach: 'Dick Advocaat',
    coachNationality: 'NED',
    announcedAt: '2026-05-18',
    announcementSourceName: 'FFK',
    announcementSource: 'https://ffk.cw/',
  },
  COD: {
    status: 'final',
    coach: 'Sébastien Desabre',
    coachNationality: 'FRA',
    announcedAt: '2026-05-18',
    announcementSourceName: 'FECOFA',
    announcementSource: 'https://fecofa.cd/',
  },
  SUI: {
    status: 'final',
    coach: 'Murat Yakın',
    announcedAt: '2026-05-19',
    announcementSourceName: 'ASF/SFV',
    announcementSource: 'https://www.football.ch/',
  },
  SCO: {
    status: 'final',
    coach: 'Steve Clarke',
    announcedAt: '2026-05-19',
    announcementSourceName: 'Scottish FA',
    announcementSource: 'https://www.scottishfa.co.uk/',
  },
  POR: {
    status: 'final',
    coach: 'Roberto Martínez',
    coachNationality: 'ESP',
    announcedAt: '2026-05-19',
    announcementSourceName: 'FPF',
    announcementSource: 'https://www.fpf.pt/',
  },
  ESP: {
    status: 'final',
    coach: 'Luis de la Fuente',
    announcedAt: '2026-05-25',
    announcementSourceName: 'RFEF',
    announcementSource: 'https://rfef.es/',
  },
  MAR: {
    status: 'final',
    coach: 'Mohamed Ouahbi',
    announcedAt: '2026-05-26',
    announcementSourceName: 'FRMF',
    announcementSource: 'https://www.frmf.ma/',
  },
  USA: {
    status: 'final',
    coach: 'Mauricio Pochettino',
    coachNationality: 'ARG',
    announcedAt: '2026-05-26',
    announcementSourceName: 'U.S. Soccer',
    announcementSource: 'https://www.ussoccer.com/',
  },
  PAN: {
    status: 'final',
    coach: 'Thomas Christiansen',
    coachNationality: 'DEN',
    announcedAt: '2026-05-26',
    announcementSourceName: 'FEPAFUT',
    announcementSource: 'https://fepafut.com/',
  },

  // ─── PRELISTAS (35-55 jugadores) ───────────────────────────────
  UZB: {
    status: 'provisional',
    coach: 'Fabio Cannavaro',
    coachNationality: 'ITA',
    announcedAt: '2026-05-05',
    announcementSourceName: 'UFA',
    announcementSource: 'https://uff.uz/',
  },
  ARG: {
    status: 'provisional',
    coach: 'Lionel Scaloni',
    announcedAt: '2026-05-11',
    announcementSourceName: 'AFA',
    announcementSource: 'https://www.afa.com.ar/',
  },
  MEX: {
    status: 'provisional',
    coach: 'Javier Aguirre',
    announcedAt: '2026-05-12',
    announcementSourceName: 'FMF',
    announcementSource: 'https://miseleccion.mx/',
  },
  CZE: {
    status: 'provisional',
    coach: 'Miroslav Koubek',
    announcedAt: '2026-05-12',
    announcementSourceName: 'FAČR',
    announcementSource: 'https://fotbal.cz/',
  },
  QAT: {
    status: 'provisional',
    coach: 'Julen Lopetegui',
    coachNationality: 'ESP',
    announcedAt: '2026-05-12',
    announcementSourceName: 'QFA',
    announcementSource: 'https://www.qfa.qa/',
  },
  COL: {
    status: 'provisional',
    coach: 'Néstor Lorenzo',
    coachNationality: 'ARG',
    announcedAt: '2026-05-14',
    announcementSourceName: 'FCF',
    announcementSource: 'https://fcf.com.co/',
  },
  IRN: {
    status: 'provisional',
    coach: 'Amir Ghalenoei',
    announcedAt: '2026-05-18',
    announcementSourceName: 'IRIFF',
    announcementSource: 'https://www.ffiri.ir/',
  },
  JOR: {
    status: 'provisional',
    coach: 'Jamal Sellami',
    coachNationality: 'MAR',
    announcedAt: '2026-05-18',
    announcementSourceName: 'JFA',
    announcementSource: 'https://www.jfa.com.jo/',
  },
  TUR: {
    status: 'provisional',
    coach: 'Vincenzo Montella',
    coachNationality: 'ITA',
    announcedAt: '2026-05-18',
    announcementSourceName: 'TFF',
    announcementSource: 'https://www.tff.org/',
  },
  GHA: {
    status: 'provisional',
    coach: 'Carlos Queiroz',
    coachNationality: 'POR',
    announcedAt: '2026-05-26',
    announcementSourceName: 'GFA',
    announcementSource: 'https://ghanafa.org/',
  },
};

/**
 * Squads de las 48 selecciones. Las que aparecen en SQUAD_METADATA
 * arrancan con su estado anunciado y entrenador; el resto quedan en
 * 'pending' a la espera de anuncio oficial.
 *
 * Última auditoría: 2026-05-20 (28 de 48 selecciones anunciadas).
 */
// ───────────────────────────────────────────────────────────────────
// Sidecar de jugadores (generado por research-agent, verificado a mano)
// ───────────────────────────────────────────────────────────────────
//
// El sidecar `wc-2026-squads.players.json` contiene los 26 jugadores
// por selección con datos cruzados de ESPN, federaciones oficiales,
// Olympics.com y Wikipedia. Lo fusionamos aquí para que las páginas
// `/2026/listas/{code}` rendericen las plantillas completas.
//
// Las federaciones suelen publicar los dorsales tarde (a veces el
// día anterior al primer partido), así que `shirt` puede ser `null`
// incluso con la lista cerrada — la UI muestra "—" en ese caso.
import playerSidecar from './wc-2026-squads.players.json';
// Sidecar de fotos generado por `scripts/fetch-player-photos.ts`. Vacío
// es válido — la UI cae a un avatar con iniciales cuando no hay foto.
import photoSidecar from './wc-2026-squads.photos.json';

type PlayerSidecarRoster = {
  captainName?: string;
  players: Array<Omit<Player2026, 'note' | 'replacementFor'>>;
};
const PLAYER_SIDECAR = playerSidecar as Record<string, PlayerSidecarRoster | unknown>;

function rosterFor(teamCode: string): PlayerSidecarRoster | null {
  const entry = PLAYER_SIDECAR[teamCode];
  if (
    entry &&
    typeof entry === 'object' &&
    'players' in entry &&
    Array.isArray((entry as PlayerSidecarRoster).players)
  ) {
    return entry as PlayerSidecarRoster;
  }
  return null;
}

type PhotoEntry = { photoUrl: string; sourceTitle?: string };
const PHOTO_BY_SLUG = photoSidecar as Record<string, PhotoEntry | unknown>;
function photoFor(playerSlug: string | undefined): string | undefined {
  if (!playerSlug) return undefined;
  const entry = PHOTO_BY_SLUG[playerSlug];
  if (entry && typeof entry === 'object' && 'photoUrl' in entry) {
    return (entry as PhotoEntry).photoUrl;
  }
  return undefined;
}

export const SQUADS_2026: Squad2026[] = Object.keys(TEAMS_2026).map(
  (teamCode) => {
    const meta = SQUAD_METADATA[teamCode];
    const roster = rosterFor(teamCode);
    // Hidrata cada jugador con su `photoUrl` del sidecar de fotos.
    const players: Player2026[] = (roster?.players ?? []).map((p) => {
      const photo = photoFor(p.playerSlug);
      return photo ? { ...p, photoUrl: photo } : (p as Player2026);
    });
    return {
      teamCode,
      players,
      ...(roster?.captainName ? { captainName: roster.captainName } : {}),
      ...(meta ?? { status: 'pending' as const }),
    };
  },
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

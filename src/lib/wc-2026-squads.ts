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
  NED: {
    status: 'final',
    coach: 'Ronald Koeman',
    announcedAt: '2026-05-27',
    announcementSourceName: 'KNVB',
    announcementSource: 'https://www.knvb.nl/',
  },

  // ─── PRELISTAS (35-55 jugadores) ───────────────────────────────
  UZB: {
    status: 'final',
    coach: 'Fabio Cannavaro',
    coachNationality: 'ITA',
    announcedAt: '2026-05-29',
    announcementSourceName: 'UFA',
    announcementSource: 'https://colombiaone.com/2026/05/29/fabio-cannavaro-uzbekistan-squad-world-cup/',
    summary: 'Uzbekistán debuta en un Mundial con Fabio Cannavaro al mando. Eldor Shomurodov (AS Roma) lidera el ataque y Abdukodir Khusanov (Manchester City) es el jugador más valioso de la plantilla. Se enfrentan a Portugal, Colombia y R.D. Congo en el Grupo K.',
    firstMatch: { date: '2026-06-15', opponent: 'Colombia', venue: 'Levi\'s Stadium, Santa Clara' },
  },
  // ─── NUEVOS AÑADIDOS: equipos que faltan (ALG, AUS, ECU, EGY, IRQ, KSA, NOR, PAR, RSA + updates) ─
  NOR: {
    status: 'final',
    coach: 'Ståle Solbakken',
    announcedAt: '2026-06-01',
    announcementSourceName: 'NFF',
    announcementSource: 'https://www.fotball.no/',
    summary: 'Noruega vuelve a un Mundial por primera vez desde Francia 1998 con Erling Haaland como gran estrella. Martin Ødegaard (Arsenal) es el capitán. Es el debut mundialista de toda la generación, incluido el duo Haaland-Ødegaard. Grupo I con Francia, Senegal e Irak.',
    firstMatch: { date: '2026-06-18', opponent: 'Senegal', venue: 'Gillette Stadium, Boston' },
  },
  CAN: {
    status: 'final',
    coach: 'Jesse Marsch',
    coachNationality: 'USA',
    announcedAt: '2026-06-01',
    announcementSourceName: 'Canada Soccer',
    announcementSource: 'https://www.canadasoccer.com/',
    summary: 'Canadá repite como coanfitrión en el Grupo B con Qatar, Suiza y Bosnia. Alphonso Davies (Bayern) y Jonathan David (Atlético) forman la columna vertebral. Jesse Marsch buscará revancha tras la eliminación de 2022.',
    firstMatch: { date: '2026-06-12', opponent: 'Bosnia', venue: 'BC Place, Vancouver' },
  },
  COL: {
    status: 'final',
    coach: 'Néstor Lorenzo',
    coachNationality: 'ARG',
    announcedAt: '2026-06-01',
    announcementSourceName: 'FCF',
    announcementSource: 'https://fcf.com.co/',
    summary: 'Colombia llega al Mundial con James Rodríguez como capitán y Luis Díaz (Liverpool) como gran referente ofensivo. Jhon Durán (Aston Villa) es la gran apuesta joven. Grupo K con Portugal, Uzbekistán y R.D. Congo.',
    firstMatch: { date: '2026-06-15', opponent: 'Uzbekistán', venue: 'Levi\'s Stadium, Santa Clara' },
  },
  SEN: {
    status: 'final',
    coach: 'Aliou Cissé',
    announcedAt: '2026-06-01',
    announcementSourceName: 'FSF',
    announcementSource: 'https://www.fsf.sn/',
    summary: 'Senegal se presenta con Sadio Mané (Al-Nassr) como líder indiscutible y Nicolas Jackson (Chelsea) en ascenso. Kalidou Koulibaly encabeza la defensa. Grupo I con Francia, Noruega e Irak.',
    firstMatch: { date: '2026-06-18', opponent: 'Francia', venue: 'Gillette Stadium, Boston' },
  },
  ALG: {
    status: 'final',
    coach: 'Vladimir Petković',
    coachNationality: 'SUI',
    announcedAt: '2026-05-31',
    announcementSourceName: 'FAF',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/vladimir-petkovi-s-official-algeria-squad-for-the-2026-fifa-world-cup-2026-05-31',
    summary: 'Argelia regresa al Mundial por primera vez desde 2014. Sin Mahrez (retirado), Riyad Mahrez fue sustituido como referencia por Yacine Brahimi y el emergente Saïd Benrahma (West Ham). Grupo J con Argentina, Austria y Jordania.',
    firstMatch: { date: '2026-06-16', opponent: 'Argentina', venue: 'Arrowhead Stadium, Kansas City' },
  },
  AUS: {
    status: 'final',
    coach: 'Tony Popovic',
    announcedAt: '2026-06-01',
    announcementSourceName: 'Football Australia',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/tony-popovic-s-official-australia-squad-for-the-2026-fifa-world-cup-2026-06-01',
    summary: 'Australia llega con Mat Ryan en portería y Mitchell Duke como referencia. La gran incógnita es la confirmación de Socceroo Martin Boyle. Tony Popovic toma el relevo de Graham Arnold. Grupo D con EE.UU., Turquía y Paraguay.',
    firstMatch: { date: '2026-06-14', opponent: 'Turquía', venue: 'SoFi Stadium, Los Ángeles' },
  },
  ECU: {
    status: 'final',
    coach: 'Sebastián Beccacece',
    coachNationality: 'ARG',
    announcedAt: '2026-06-01',
    announcementSourceName: 'FEF',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/sebasti%C3%A1n-beccacece-s-official-ecuador-squad-for-the-2026-fifa-world-cup-2026-06-01',
    summary: 'Ecuador repite mundialista con Enner Valencia como capitán en lo que podría ser su último gran torneo. Añade la promesa Kendry Páez (Chelsea). Grupo E con Alemania, Costa de Marfil y Curazao.',
    firstMatch: { date: '2026-06-15', opponent: 'Costa de Marfil', venue: 'NRG Stadium, Houston' },
  },
  EGY: {
    status: 'final',
    coach: 'Ihab Galal',
    announcedAt: '2026-06-01',
    announcementSourceName: 'EFA',
    announcementSource: 'https://www.efa.com.eg/',
    summary: 'Egipto regresa al Mundial con Mohamed Salah (Liverpool) como gran estrella en lo que probablemente sea su única Copa del Mundo. Grupo G con Bélgica, Nueva Zelanda e Irán.',
    firstMatch: { date: '2026-06-16', opponent: 'Nueva Zelanda', venue: 'Lumen Field, Seattle' },
  },
  IRQ: {
    status: 'final',
    coach: 'Graham Arnold',
    coachNationality: 'AUS',
    announcedAt: '2026-06-01',
    announcementSourceName: 'IFA',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/graham-arnold-s-official-iraq-squad-for-the-2026-fifa-world-cup-2026-06-01',
    summary: 'Iraq vuelve al Mundial por primera vez desde 1986 bajo las órdenes del australiano Graham Arnold. Mohanad Ali y Amjad Attwan son los referentes ofensivos. Grupo I con Francia, Noruega y Senegal.',
    firstMatch: { date: '2026-06-18', opponent: 'Noruega', venue: 'Gillette Stadium, Boston' },
  },
  KSA: {
    status: 'final',
    coach: 'Roberto Mancini',
    coachNationality: 'ITA',
    announcedAt: '2026-06-01',
    announcementSourceName: 'SAFF',
    announcementSource: 'https://www.thesaff.com.sa/',
    summary: 'Arabia Saudí participa bajo la batuta de Roberto Mancini. Salem Al-Dawsari (Al-Hilal) es el alma creativa del equipo que sorprendió al mundo venciendo a Argentina 2-1 en Qatar 2022. Grupo H con España, Uruguay y Cabo Verde.',
    firstMatch: { date: '2026-06-26', opponent: 'Cabo Verde', venue: 'NRG Stadium, Houston' },
  },
  PAR: {
    status: 'final',
    coach: 'Gustavo Alfaro',
    coachNationality: 'ARG',
    announcedAt: '2026-06-01',
    announcementSourceName: 'APF',
    announcementSource: 'https://www.apf.org.py/',
    summary: 'Paraguay regresa al Mundial con Gustavo Alfaro al mando y Miguel Almirón como referencia creativa. Richard Sánchez (Club América) lidera el mediocampo. Grupo D con EE.UU., Turquía y Australia.',
    firstMatch: { date: '2026-06-14', opponent: 'EE.UU.', venue: 'MetLife Stadium, New York' },
  },
  RSA: {
    status: 'final',
    coach: 'Hugo Broos',
    coachNationality: 'BEL',
    announcedAt: '2026-06-01',
    announcementSourceName: 'SAFA',
    announcementSource: 'https://www.safa.net/general-news/broos-names-final-bafana-squad-for-the-2026-fifa-world-cup/',
    summary: 'Sudáfrica vuelve al Mundial 16 años después de ser anfitriona. Percy Tau y Themba Zwane son los referentes. El técnico belga Hugo Broos ha renovado la plantilla con talento joven. Grupo A con México, Corea del Sur y Chequia.',
    firstMatch: { date: '2026-06-11', opponent: 'México', venue: 'Estadio Azteca, Ciudad de México' },
  },
  GHA: {
    status: 'final',
    coach: 'Carlos Queiroz',
    coachNationality: 'POR',
    announcedAt: '2026-05-27',
    announcementSourceName: 'GFA',
    announcementSource: 'https://ghanafa.org/carlos-queiroz-names-2026-fifa-world-cup-squad',
    summary: 'Ghana llega con Carlos Queiroz al mando y Mohammed Kudus (West Ham) como gran estrella. Thomas Partey (Arsenal) ancla el centro del campo. La convocatoria incluyó la sustitución de Djiku por Luckassen por lesión. Grupo L con Inglaterra, Croacia y Panamá.',
    firstMatch: { date: '2026-06-17', opponent: 'Croacia', venue: 'Lincoln Financial Field, Filadelfia' },
  },
  IRN: {
    status: 'final',
    coach: 'Amir Ghalenoei',
    announcedAt: '2026-05-29',
    announcementSourceName: 'IRIFF',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/amir-ghalenoei-s-official-iran-squad-for-the-2026-fifa-world-cup-2026-06-01',
    summary: 'Irán llega con Mehdi Taremi (Inter) y Sardar Azmoun (Roma) como dupla de ataque. Ali Karimi (no el legendario, sino el joven Valencia) es la gran promesa. Grupo G con Bélgica, Nueva Zelanda y Egipto.',
    firstMatch: { date: '2026-06-17', opponent: 'Bélgica', venue: 'Lumen Field, Seattle' },
  },
  CZE: {
    status: 'final',
    coach: 'Ivan Hašek',
    announcedAt: '2026-06-01',
    announcementSourceName: 'FAČR',
    announcementSource: 'https://fotbal.cz/',
    summary: 'Chequia llega al Mundial con Tomáš Souček (West Ham) y Patrik Schick (Bayer Leverkusen) como pilares. Ivan Hašek completó el recambio generacional. Grupo A con México, Corea del Sur y Sudáfrica.',
    firstMatch: { date: '2026-06-11', opponent: 'Corea del Sur', venue: 'SoFi Stadium, Los Ángeles' },
  },
  ARG: {
    status: 'final',
    coach: 'Lionel Scaloni',
    announcedAt: '2026-05-28',
    announcementSourceName: 'AFA',
    announcementSource: 'https://www.afa.com.ar/',
  },
  ENG: {
    status: 'final',
    coach: 'Thomas Tuchel',
    coachNationality: 'GER',
    announcedAt: '2026-05-22',
    announcementSourceName: 'The FA',
    announcementSource: 'https://www.thefa.com/',
  },
  GER: {
    status: 'final',
    coach: 'Julian Nagelsmann',
    announcedAt: '2026-05-21',
    announcementSourceName: 'DFB',
    announcementSource: 'https://www.dfb.de/',
  },
  MEX: {
    status: 'final',
    coach: 'Javier Aguirre',
    announcedAt: '2026-06-01',
    announcementSourceName: 'FMF / beIN Sports',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/javier-aguirre-and-mexico-s-official-squad-for-the-2026-fifa-world-cup-2026-06-01',
    summary: 'México abre el Mundial como anfitrión el 11 de junio. Guillermo Ochoa se convierte en el primer jugador en disputar seis Mundiales. Santiago Giménez (AC Milan) y Raúl Jiménez (Fulham) forman la dupla atacante más letal en décadas.',
    firstMatch: { date: '2026-06-11', opponent: 'Sudáfrica', venue: 'Estadio Azteca, Ciudad de México' },
  },
  // CZE moved to final block above (Ivan Hašek)
  QAT: {
    status: 'final',
    coach: 'Julen Lopetegui',
    coachNationality: 'ESP',
    announcedAt: '2026-06-01',
    announcementSourceName: 'QFA / beIN Sports',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/julen-lopetegui-s-official-squad-for-qatar-at-the-2026-fifa-world-cup-2026-06-01',
    summary: 'Catar regresa al Mundial con Lopetegui al mando tras el desastroso debut en 2022. Akram Afif (Al-Sadd) es la estrella y Almoez Ali el goleador histórico. Grupo B con Bosnia, Suiza y Canadá.',
    firstMatch: { date: '2026-06-12', opponent: 'Suiza', venue: 'BC Place, Vancouver' },
  },
  // COL moved to final block above
  // IRN moved to final block above
  JOR: {
    status: 'final',
    coach: 'Jamal Sellami',
    coachNationality: 'TUN',
    announcedAt: '2026-05-19',
    announcementSourceName: 'JFA',
    announcementSource: 'https://www.jfa.com.jo/',
    summary: 'Jordania debuta en el Mundial con Musa Al-Taamari (Rennes) como estrella ofensiva. El equipo se clasificó tras 3-0 a Omán. Primer Mundial de la historia para los Nashama. Grupo J con Argentina, Austria y Argelia.',
    firstMatch: { date: '2026-06-16', opponent: 'Argentina', venue: 'Arrowhead Stadium, Kansas City' },
  },
  TUR: {
    status: 'final',
    coach: 'Vincenzo Montella',
    coachNationality: 'ITA',
    announcedAt: '2026-06-02',
    announcementSourceName: 'TFF / beIN Sports',
    announcementSource: 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/vincenzo-montella-s-official-turkey-squad-for-the-2026-fifa-world-cup-2026-06-02',
    summary: 'Turquía regresa al Mundial con Hakan Çalhanoğlu (Inter) como capitán y Arda Güler (Real Madrid) y Kenan Yıldız (Juventus) como las grandes promesas generacionales. Primer Mundial turco desde 2002. Grupo D con EE.UU., Paraguay y Australia.',
    firstMatch: { date: '2026-06-14', opponent: 'Australia', venue: 'SoFi Stadium, Los Ángeles' },
  },
  // GHA moved to final block above
  URU: {
    status: 'final',
    coach: 'Marcelo Bielsa',
    coachNationality: 'ARG',
    announcedAt: '2026-05-31',
    announcementSourceName: 'AUF',
    announcementSource: 'https://www.auf.org.uy/',
    summary:
      'Bielsa cerró el 31 de mayo de 2026 la lista de 26 con dos grandes titulares: la ausencia de Luis Suárez —primer Mundial sin él desde Sudáfrica 2010— y el regreso de Fernando Muslera tras su retiro internacional para disputar su quinto Mundial, récord histórico uruguayo. Nahitan Nández también queda fuera por motivos extrafutbolísticos. Federico Valverde recibe la capitanía. Sorpresas al alza: Federico Viñas (Real Oviedo) y Rodrigo Zalazar (Braga).',
    firstMatch: { date: '2026-06-26', opponent: 'España', venue: 'Estadio Akron, Guadalajara' },
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

export const STATUS_LABELS_EN: Record<SquadStatus, string> = {
  pending: 'To be announced',
  provisional: 'Preliminary list',
  final: 'Final squad',
};

export function getStatusLabel(status: SquadStatus, locale: string): string {
  return locale === 'en' ? STATUS_LABELS_EN[status] : STATUS_LABELS[status];
}

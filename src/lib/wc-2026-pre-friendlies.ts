/**
 * Amistosos pre-Mundial 2026 por selección.
 *
 * Ventana oficial FIFA: 1-9 junio 2026 (siete días antes del partido
 * inaugural el 11 de junio). Algunas selecciones también juegan
 * amistosos en mayo durante la concentración previa.
 *
 * Cada selección suele jugar 1-2 amistosos en la ventana FIFA. Los
 * amistosos pueden ser contra otras participantes del Mundial o contra
 * selecciones no clasificadas (más comunes para los grandes).
 *
 * Estructura:
 *  - `homeCode` y `awayCode`: códigos FIFA del primer y segundo equipo.
 *  - `venue` y `city`: estadio y ciudad del amistoso.
 *  - `country`: país sede del partido (puede no coincidir con home/away).
 *  - `result`: null si aún no se ha jugado, scores si ya jugado.
 *  - `status`: 'scheduled' (futuro) o 'played' (pasado).
 *  - `notes`: contexto editorial opcional (ubicación, ronda preparatoria).
 *
 * Última actualización: 19 mayo 2026.
 * Las selecciones añaden amistosos en las próximas semanas; este archivo
 * debe actualizarse continuamente hasta el 10 de junio.
 */

export type FriendlyStatus = 'scheduled' | 'played';

export type PreFriendly = {
  /** ISO 8601 con offset local. */
  date: string;
  homeCode: string;
  awayCode: string;
  venue?: string;
  city?: string;
  /** Código de país del estadio anfitrión. */
  country?: string;
  result?: { home: number; away: number } | null;
  status: FriendlyStatus;
  notes?: string;
};

export const PRE_FRIENDLIES: PreFriendly[] = [
  // ─────────────────────────────────────────────────────────
  // 🇧🇷 BRASIL
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-05-27T20:30:00-03:00',
    homeCode: 'BRA',
    awayCode: 'COL',
    venue: 'Estádio do Maracanã',
    city: 'Río de Janeiro',
    country: 'BRA',
    status: 'scheduled',
    notes: 'Primer amistoso de la era Ancelotti tras la lista definitiva. Reedición del cuartos del Mundial 2014',
  },
  {
    date: '2026-06-04T19:00:00-04:00',
    homeCode: 'BRA',
    awayCode: 'SUI',
    venue: 'Lincoln Financial Field',
    city: 'Filadelfia',
    country: 'USA',
    status: 'scheduled',
    notes: 'Última prueba antes del debut Mundial. Mismo estadio donde Brasil jugará vs Haití el 19 jun',
  },

  // ─────────────────────────────────────────────────────────
  // 🇵🇹 PORTUGAL
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T20:45:00+01:00',
    homeCode: 'POR',
    awayCode: 'CHI',
    venue: 'Estádio do Dragão',
    city: 'Oporto',
    country: 'POR',
    status: 'scheduled',
    notes: 'Despedida portuguesa antes de viajar a Estados Unidos',
  },
  {
    date: '2026-06-10T19:30:00+01:00',
    homeCode: 'POR',
    awayCode: 'NGA',
    venue: 'Estádio José Alvalade',
    city: 'Lisboa',
    country: 'POR',
    status: 'scheduled',
    notes: 'Última prueba en territorio europeo antes del debut vs RD Congo',
  },

  // ─────────────────────────────────────────────────────────
  // 🇧🇪 BÉLGICA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T18:00:00+02:00',
    homeCode: 'BEL',
    awayCode: 'SVK',
    venue: 'King Baudouin Stadium',
    city: 'Bruselas',
    country: 'BEL',
    status: 'scheduled',
    notes: 'Despedida belga. Eslovaquia (no clasificada) como sparring',
  },
  {
    date: '2026-06-09T20:00:00+02:00',
    homeCode: 'BEL',
    awayCode: 'AUS',
    venue: 'Lotto Park',
    city: 'Bruselas',
    country: 'BEL',
    status: 'scheduled',
    notes: 'Australia (no clasificada) en el estadio del Anderlecht',
  },

  // ─────────────────────────────────────────────────────────
  // 🇭🇹 HAITÍ
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-02T19:00:00-04:00',
    homeCode: 'HAI',
    awayCode: 'NZL',
    venue: 'Inter Miami Stadium',
    city: 'Miami',
    country: 'USA',
    status: 'scheduled',
    notes: 'Concentración Haití en Florida antes del Mundial. Imagen Sébastien Migné',
  },
  {
    date: '2026-06-05T19:00:00-04:00',
    homeCode: 'HAI',
    awayCode: 'PER',
    venue: 'DRV PNK Stadium',
    city: 'Fort Lauderdale',
    country: 'USA',
    status: 'scheduled',
    notes: 'Última prueba antes del debut histórico vs Escocia',
  },

  // ─────────────────────────────────────────────────────────
  // 🇨🇮 COSTA DE MARFIL
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-04T19:00:00+01:00',
    homeCode: 'MAR',
    awayCode: 'CIV',
    venue: 'Estadio Príncipe Moulay Abdellah',
    city: 'Casablanca',
    country: 'MAR',
    status: 'scheduled',
    notes: 'Doble derby africano: Marruecos (Grupo C) vs Costa de Marfil (Grupo E). Ambos clasificados',
  },
  {
    date: '2026-06-09T19:00:00+00:00',
    homeCode: 'SEN',
    awayCode: 'CIV',
    venue: 'Stade Abdoulaye Wade',
    city: 'Diamniadio',
    country: 'SEN',
    status: 'scheduled',
    notes: 'Senegal (Grupo G) vs Costa de Marfil. Último antes del Mundial',
  },

  // ─────────────────────────────────────────────────────────
  // 🇯🇵 JAPÓN
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-04T19:30:00+09:00',
    homeCode: 'JPN',
    awayCode: 'KOR',
    venue: 'Tokyo Stadium',
    city: 'Tokio',
    country: 'JPN',
    status: 'scheduled',
    notes: '★ Derby asiático histórico. JPN-KOR amistoso último antes del Mundial',
  },
  {
    date: '2026-06-08T19:30:00+09:00',
    homeCode: 'JPN',
    awayCode: 'PRK',
    venue: 'Toyota Stadium',
    city: 'Toyota',
    country: 'JPN',
    status: 'scheduled',
    notes: 'Corea del Norte (no clasificada). Cierre japonés antes del viaje a Los Angeles',
  },

  // ─────────────────────────────────────────────────────────
  // 🇫🇷 FRANCIA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-05T21:00:00+02:00',
    homeCode: 'FRA',
    awayCode: 'ISL',
    venue: 'Allianz Riviera',
    city: 'Niza',
    country: 'FRA',
    status: 'scheduled',
    notes: 'Islandia (no clasificada). Concentración Clairefontaine previa',
  },
  {
    date: '2026-06-09T21:00:00+02:00',
    homeCode: 'FRA',
    awayCode: 'TUR',
    venue: 'Stade de France',
    city: 'Saint-Denis',
    country: 'FRA',
    status: 'scheduled',
    notes: 'Turquía (no clasificada) en Stade de France. Despedida francesa',
  },

  // ─────────────────────────────────────────────────────────
  // 🇦🇷 ARGENTINA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T21:00:00-04:00',
    homeCode: 'ARG',
    awayCode: 'ECU',
    venue: 'Hard Rock Stadium',
    city: 'Miami',
    country: 'USA',
    status: 'scheduled',
    notes: 'Concentración Argentina en Miami previa al Mundial. Reedición Copa América 2024',
  },
  {
    date: '2026-06-10T21:00:00-04:00',
    homeCode: 'ARG',
    awayCode: 'JAM',
    venue: 'Soldier Field',
    city: 'Chicago',
    country: 'USA',
    status: 'scheduled',
    notes: 'Jamaica (no clasificada). Última prueba antes del viaje a Kansas City',
  },

  // ─────────────────────────────────────────────────────────
  // 🇪🇸 ESPAÑA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T21:00:00+02:00',
    homeCode: 'ESP',
    awayCode: 'AUT',
    venue: 'Estadio Municipal de Mendizorroza',
    city: 'Vitoria',
    country: 'ESP',
    status: 'scheduled',
    notes: 'Austria (no clasificada). Despedida en territorio español',
  },
  {
    date: '2026-06-10T21:00:00-04:00',
    homeCode: 'ESP',
    awayCode: 'EGY',
    venue: 'Lincoln Financial Field',
    city: 'Filadelfia',
    country: 'USA',
    status: 'scheduled',
    notes: 'Egipto (no clasificada) en Estados Unidos. Última prueba antes del debut vs Cabo Verde',
  },

  // ─────────────────────────────────────────────────────────
  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGLATERRA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T20:00:00+01:00',
    homeCode: 'ENG',
    awayCode: 'WAL',
    venue: 'Wembley Stadium',
    city: 'Londres',
    country: 'ENG',
    status: 'scheduled',
    notes: 'Derby británico. Gales (no clasificada) en Wembley. Despedida Tuchel',
  },
  {
    date: '2026-06-09T20:00:00-04:00',
    homeCode: 'ENG',
    awayCode: 'JAM',
    venue: 'TQL Stadium',
    city: 'Cincinnati',
    country: 'USA',
    status: 'scheduled',
    notes: 'Concentración inglesa en Florida pre-Mundial',
  },

  // ─────────────────────────────────────────────────────────
  // 🇩🇪 ALEMANIA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T20:45:00+02:00',
    homeCode: 'GER',
    awayCode: 'SUI',
    venue: 'Allianz Arena',
    city: 'Múnich',
    country: 'GER',
    status: 'scheduled',
    notes: 'Suiza (clasificada Grupo B) en estadio Bayern. Doble cita para preparación',
  },
  {
    date: '2026-06-10T20:45:00+02:00',
    homeCode: 'GER',
    awayCode: 'NED',
    venue: 'Signal Iduna Park',
    city: 'Dortmund',
    country: 'GER',
    status: 'scheduled',
    notes: 'Países Bajos (Grupo F) en Westfalenstadion. Despedida alemana',
  },

  // ─────────────────────────────────────────────────────────
  // 🇳🇱 PAÍSES BAJOS
  // ─────────────────────────────────────────────────────────
  // Recíproco con GER ya listado arriba
  {
    date: '2026-06-04T20:45:00+02:00',
    homeCode: 'NED',
    awayCode: 'SCO',
    venue: 'Johan Cruijff ArenA',
    city: 'Ámsterdam',
    country: 'NED',
    status: 'scheduled',
    notes: 'Escocia (Grupo L) en estadio del Ajax',
  },

  // ─────────────────────────────────────────────────────────
  // 🇲🇽 MÉXICO (anfitrión)
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-04T21:00:00-06:00',
    homeCode: 'MEX',
    awayCode: 'CMR',
    venue: 'BBVA Stadium',
    city: 'Monterrey',
    country: 'MEX',
    status: 'scheduled',
    notes: 'Camerún (no clasificada) en BBVA. Despedida del Tri en casa',
  },
  {
    date: '2026-06-08T21:00:00-06:00',
    homeCode: 'MEX',
    awayCode: 'CHI',
    venue: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'MEX',
    status: 'scheduled',
    notes: 'Chile (no clasificada) en Akron. Pre-debut inaugural del Mundial el 11 jun en Azteca',
  },

  // ─────────────────────────────────────────────────────────
  // 🇺🇸 ESTADOS UNIDOS (anfitrión)
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-06T20:00:00-05:00',
    homeCode: 'USA',
    awayCode: 'IRL',
    venue: 'Soldier Field',
    city: 'Chicago',
    country: 'USA',
    status: 'scheduled',
    notes: 'Irlanda (no clasificada). Despedida Pochettino y Pulisic',
  },
  {
    date: '2026-06-10T20:00:00-04:00',
    homeCode: 'USA',
    awayCode: 'CRC',
    venue: 'Allegiant Stadium',
    city: 'Las Vegas',
    country: 'USA',
    status: 'scheduled',
    notes: 'Costa Rica (no clasificada) en Las Vegas. Última prueba antes del debut vs Paraguay',
  },

  // ─────────────────────────────────────────────────────────
  // 🇨🇦 CANADÁ (anfitrión)
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-04T20:00:00-04:00',
    homeCode: 'CAN',
    awayCode: 'UKR',
    venue: 'BMO Field',
    city: 'Toronto',
    country: 'CAN',
    status: 'scheduled',
    notes: 'Ucrania (no clasificada) en Toronto, sede de Canadá en el Mundial',
  },
  {
    date: '2026-06-08T20:00:00-07:00',
    homeCode: 'CAN',
    awayCode: 'AUT',
    venue: 'BC Place',
    city: 'Vancouver',
    country: 'CAN',
    status: 'scheduled',
    notes: 'Austria (no clasificada) en Vancouver, otra sede canadiense',
  },

  // ─────────────────────────────────────────────────────────
  // 🇸🇪 SUECIA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-05T19:00:00+02:00',
    homeCode: 'SWE',
    awayCode: 'POL',
    venue: 'Friends Arena',
    city: 'Estocolmo',
    country: 'SWE',
    status: 'scheduled',
    notes: 'Polonia (no clasificada) en estadio nacional. Despedida Potter',
  },

  // ─────────────────────────────────────────────────────────
  // 🇲🇦 MARRUECOS
  // ─────────────────────────────────────────────────────────
  // Recíproco con CIV ya listado arriba (4 jun en Casablanca)
  {
    date: '2026-06-08T19:00:00+01:00',
    homeCode: 'MAR',
    awayCode: 'GHA',
    venue: 'Stade Mohamed V',
    city: 'Casablanca',
    country: 'MAR',
    status: 'scheduled',
    notes: 'Ghana (Grupo L) en Casablanca. Doble cita africana',
  },

  // ─────────────────────────────────────────────────────────
  // 🇭🇷 CROACIA
  // ─────────────────────────────────────────────────────────
  {
    date: '2026-06-04T20:45:00+02:00',
    homeCode: 'CRO',
    awayCode: 'AUT',
    venue: 'Stadion Maksimir',
    city: 'Zagreb',
    country: 'CRO',
    status: 'scheduled',
    notes: 'Austria (no clasificada). Despedida Modric, Dalic',
  },
  {
    date: '2026-06-08T20:45:00+02:00',
    homeCode: 'CRO',
    awayCode: 'EGY',
    venue: 'Stadion Maksimir',
    city: 'Zagreb',
    country: 'CRO',
    status: 'scheduled',
    notes: 'Egipto (no clasificada). Doble cita en Maksimir',
  },

  // ─────────────────────────────────────────────────────────
  // 🇳🇿 NUEVA ZELANDA
  // ─────────────────────────────────────────────────────────
  // Recíproco con HAI ya listado arriba
  {
    date: '2026-06-06T19:00:00-04:00',
    homeCode: 'NZL',
    awayCode: 'TUN',
    venue: 'Citi Field',
    city: 'Nueva York',
    country: 'USA',
    status: 'scheduled',
    notes: 'Túnez (Grupo F) en Nueva York',
  },

  // ─────────────────────────────────────────────────────────
  // 🇹🇳 TÚNEZ
  // ─────────────────────────────────────────────────────────
  // Recíproco con NZL ya listado arriba
  {
    date: '2026-06-04T19:00:00+01:00',
    homeCode: 'TUN',
    awayCode: 'COD',
    venue: 'Stade Hammadi Agrebi',
    city: 'Radès',
    country: 'TUN',
    status: 'scheduled',
    notes: 'RD Congo (Grupo K) en Radès. Despedida tunecina',
  },
];

/**
 * Devuelve los amistosos en los que participa una selección (como home
 * o away) ordenados cronológicamente.
 */
export function getFriendliesByTeam(teamCode: string): PreFriendly[] {
  return PRE_FRIENDLIES.filter((f) => f.homeCode === teamCode || f.awayCode === teamCode).sort(
    (a, b) => a.date.localeCompare(b.date),
  );
}

/**
 * Devuelve todos los amistosos ordenados cronológicamente.
 */
export function getAllFriendlies(): PreFriendly[] {
  return [...PRE_FRIENDLIES].sort((a, b) => a.date.localeCompare(b.date));
}

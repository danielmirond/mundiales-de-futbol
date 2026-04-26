/**
 * Partidos con nombre propio en la cultura mundialista.
 * Cuando un partido tiene `iconic`, el `<title>` cambia de patrón:
 *
 *   normal  → "Argentina - Inglaterra | Mundial México 1986 partido de cuartos"
 *   iconic  → "La Mano de Dios, Argentina 2-1 Inglaterra | Mundial 1986"
 *
 * Esto captura clusters de búsqueda de altísimo volumen
 * (Maracanazo, Mineirazo, Mano de Dios, gol de Iniesta, etc.)
 *
 * Clave: `${tournament_year}:${match_number}` (los partidos
 * del Mundial X están numerados del 1 al N en orden cronológico).
 */
export const ICONIC_MATCHES: Record<string, string> = {
  // 1950 Brasil, Maracanazo (final del round-robin: Uruguay 2-1 Brasil)
  '1950:22': 'El Maracanazo',

  // 1954 Suiza, Milagro de Berna (final: Alemania 3-2 Hungría)
  '1954:26': 'El Milagro de Berna',

  // 1958 Suecia, Pelé hace su primer gol mundialista (cuartos: Brasil 1-0 Gales)
  '1958:24': 'La irrupción de Pelé',

  // 1966 Inglaterra, Final con gol fantasma (Inglaterra 4-2 Alemania F.)
  '1966:32': 'El gol fantasma de Wembley',

  // 1970 México, Brasil eterno (final: Brasil 4-1 Italia)
  '1970:32': 'El Brasil eterno de Pelé',

  // 1974 Alemania, Final del fútbol total (Alemania 2-1 Holanda)
  '1974:38': 'La final del fútbol total',

  // 1978 Argentina, Final en casa (Argentina 3-1 Holanda, prórroga)
  '1978:38': 'Argentina campeón con Kempes',

  // 1982 España, Brasil-Italia (Italia 3-2 con triplete de Paolo Rossi)
  '1982:43': 'El triplete de Paolo Rossi',

  // 1986 México, Argentina vs Inglaterra (cuartos)
  '1986:39': 'La Mano de Dios y el Gol del Siglo',
  // Final: Argentina 3-2 Alemania F.
  '1986:52': 'La Copa de Maradona',

  // 1990 Italia, Semifinal Argentina-Italia (penales) en Nápoles
  '1990:50': 'Maradona en el San Paolo',
  // Final: Alemania F. 1-0 Argentina (penal de Brehme)
  '1990:52': 'La final del penal de Brehme',

  // 1994 USA, Final por penales Brasil 0-0 Italia (Baggio falla)
  '1994:52': 'El penal de Baggio',

  // 1998 Francia, Final: Francia 3-0 Brasil con Zidane
  '1998:64': 'La noche de Zidane',

  // 2006 Alemania, Final: Italia 1-1 Francia (penales), cabezazo
  '2006:64': 'El cabezazo de Zidane a Materazzi',

  // 2010 Sudáfrica, Final: España 1-0 Holanda (Iniesta 116')
  '2010:64': 'El gol de Iniesta',

  // 2014 Brasil, Semifinal Brasil 1-7 Alemania
  '2014:61': 'El Mineirazo: Brasil 1-7 Alemania',

  // 2018 Rusia, Octavos: Argentina-Francia 3-4 (Mbappé)
  '2018:50': 'La irrupción de Mbappé',

  // 2022 Qatar, Argentina 2-1 Arabia Saudí (sorpresa)
  '2022:8': 'La sorpresa saudí',
  // Final: Argentina 3-3 Francia (4-2 pen)
  '2022:64': 'La final más dramática de la historia',
};

export function getIconicName(year: number, matchNumber: number): string | undefined {
  return ICONIC_MATCHES[`${year}:${matchNumber}`];
}

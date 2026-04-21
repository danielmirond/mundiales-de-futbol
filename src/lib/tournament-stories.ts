/**
 * Rich editorial data per World Cup — mascot, match ball, anthem,
 * innovations, key moments and curiosities. Used by the "Historia"
 * section on every /ediciones/[slug]. Image URLs point to Wikimedia
 * Commons where available; can be populated by an ingester later.
 */

export type MascotInfo = {
  name: string;
  description: string;
  image?: string;
};

export type BallInfo = {
  name: string;
  maker?: string;
  description: string;
  image?: string;
};

export type AnthemInfo = {
  title: string;
  artist: string;
  youtubeId?: string;
};

export type KeyMoment = {
  title: string;
  text: string;
};

export type TournamentStory = {
  year: number;
  mascot?: MascotInfo;
  ball?: BallInfo;
  anthem?: AnthemInfo;
  innovations: string[];
  moments: KeyMoment[];
};

/**
 * Wikipedia page titles used to auto-fetch images for mascots/balls
 * via the Wikipedia REST API. Keep these here so the ingester script
 * can resolve them in one shot.
 */
export const WIKIPEDIA_ASSET_TITLES: Record<number, { mascot?: string; ball?: string }> = {
  1966: { mascot: 'World Cup Willie' },
  1970: { mascot: 'Juanito (mascot)',          ball: 'Adidas Telstar' },
  1974: { mascot: 'Tip and Tap',               ball: 'Adidas Telstar Durlast' },
  1978: { mascot: 'Gauchito (mascot)',         ball: 'Adidas Tango' },
  1982: { mascot: 'Naranjito',                 ball: 'Adidas Tango España' },
  1986: { mascot: 'Pique (mascot)',            ball: 'Adidas Azteca' },
  1990: { mascot: 'Ciao (mascot)',             ball: 'Adidas Etrusco Unico' },
  1994: { mascot: 'Striker (mascot)',          ball: 'Adidas Questra' },
  1998: { mascot: 'Footix',                    ball: 'Adidas Tricolore' },
  2002: { mascot: 'Ato, Kaz and Nik',          ball: 'Adidas Fevernova' },
  2006: { mascot: 'Goleo VI',                  ball: 'Adidas +Teamgeist' },
  2010: { mascot: 'Zakumi',                    ball: 'Adidas Jabulani' },
  2014: { mascot: 'Fuleco',                    ball: 'Adidas Brazuca' },
  2018: { mascot: 'Zabivaka',                  ball: 'Adidas Telstar 18' },
  2022: { mascot: "La'eeb",                    ball: 'Adidas Al Rihla' },
  2026: { mascot: 'Maik, Zayu and Clutch',     ball: 'Adidas Trionda' },
};

export const STORIES: TournamentStory[] = [
  {
    year: 1930,
    innovations: [
      'Primer Mundial de la historia. 13 equipos participantes, todos por invitación.',
      'Se construye el Estadio Centenario para albergar el torneo.',
      'Francia juega el primer partido contra México y Laurent marca el primer gol.',
    ],
    moments: [
      { title: 'El primer gol del Mundial', text: 'Lucien Laurent (Francia) lo marca en el min. 19 del Francia 4-1 México. Tenía 23 años.' },
      { title: 'Uruguay, primer campeón', text: 'Con 4-2 sobre Argentina ante 68.346 espectadores en el Centenario, Uruguay se proclama campeón del mundo inaugural.' },
    ],
  },

  {
    year: 1934,
    innovations: [
      'Primer Mundial con formato de eliminación directa desde octavos.',
      'Italia clasifica por primera vez via eliminatorias clasificatorias.',
      'Uruguay se niega a defender el título en protesta por la escasa participación europea en 1930.',
    ],
    moments: [
      { title: 'Final en prórroga', text: 'Italia 2-1 Checoslovaquia tras 90 min empatados 1-1. Schiavio marca en el 95.' },
    ],
  },

  {
    year: 1938,
    innovations: [
      'Último mundial antes de la Segunda Guerra Mundial (1939-1945).',
      'Austria se retira por la anexión nazi; se incorpora Suecia por invitación.',
      'Italia se convierte en el primer bicampeón consecutivo.',
    ],
    moments: [
      { title: 'Hat-trick en final', text: 'No ocurre, pero Piola anota doblete en la final. Brasil queda 3º con Leônidas como máximo goleador del torneo.' },
    ],
  },

  {
    year: 1950,
    innovations: [
      'Primer Mundial tras la guerra. Alemania y Japón excluidos.',
      'Único Mundial que no tuvo final propiamente dicha: grupo final de 4 equipos.',
      'El "Maracanazo" — Uruguay gana la última jornada en el estadio más grande del mundo.',
    ],
    moments: [
      { title: 'Maracanazo', text: 'Uruguay 2-1 Brasil ante 173.850 espectadores (oficial) / ~200.000 reales. Ghiggia marca en el min 79 el gol que enmudece al Maracaná.' },
      { title: 'Inglaterra elimina en grupos por USA 1-0', text: 'Uno de los mayores batacazos: Joe Gaetjens marca el gol histórico.' },
    ],
  },

  {
    year: 1954,
    innovations: [
      'Primer Mundial televisado en Europa.',
      'Récord histórico de goles por partido: 5,38.',
      'Alemania Occidental vuelve a la competición tras la guerra.',
    ],
    moments: [
      { title: 'El Milagro de Berna', text: 'Alemania 3-2 Hungría, remontando 0-2 contra los invencibles magiares. Rahn marca el gol del título.' },
      { title: 'Kocsis, bota de oro', text: 'El húngaro marca 11 goles en 5 partidos.' },
    ],
  },

  {
    year: 1958,
    innovations: [
      'Primer Mundial con Pelé (17 años).',
      'Brasil usa por primera vez el 4-2-4 que revolucionaría el fútbol.',
      'Just Fontaine marca 13 goles, récord histórico en un solo Mundial.',
    ],
    moments: [
      { title: 'Nace Pelé', text: 'Con 17 años, marca doblete en la final y triplete en semis. Se convierte en icono global al instante.' },
      { title: '13 de Fontaine', text: 'El francés bate el récord absoluto de goles en un solo Mundial: imbatido hasta hoy.' },
    ],
  },

  {
    year: 1962,
    innovations: [
      'Primer Mundial en un país devastado por terremoto (Chile, 1960).',
      'Pelé se lesiona en el grupo; Garrincha lidera el bi-campeonato de Brasil.',
      'La Batalla de Santiago (Chile-Italia) marca un nuevo récord de violencia.',
    ],
    moments: [
      { title: 'Garrincha, sin Pelé', text: 'Lesionado su compañero, la Alegría del Pueblo lleva a Brasil al título con actuaciones antológicas.' },
      { title: 'La Batalla de Santiago', text: 'Chile 2-0 Italia con dos expulsados, puñetazos y patadas. David Coleman (BBC) lo describe como "el partido más estúpido".' },
    ],
  },

  {
    year: 1966,
    innovations: [
      'Primer Mundial con mascota oficial: World Cup Willie.',
      'Inglaterra campeón en casa, único título inglés hasta hoy.',
      'Hat-trick en final por primera vez (Hurst).',
    ],
    moments: [
      { title: '"They think it\'s all over"', text: 'Kenneth Wolstenholme narra el cuarto gol de Hurst y dice la frase inmortal del fútbol inglés.' },
      { title: 'El gol fantasma de Wembley', text: 'Hurst marca con un remate al larguero que bota en línea de gol. ¿Entró o no? 60 años de debate.' },
    ],
  },

  {
    year: 1970,
    innovations: [
      'Primer Mundial transmitido en color a nivel global.',
      'Primer uso de tarjetas amarilla y roja.',
      'Se estrena el cambio de jugadores (antes estaba prohibido).',
      'Brasil tricampeón — se queda definitivamente con la Jules Rimet.',
    ],
    moments: [
      { title: 'La mejor selección de la historia', text: 'Brasil arrasa con Pelé, Rivelino, Tostão, Gérson y Jairzinho. Final 4-1 Italia.' },
      { title: 'Inglaterra-Alemania, cuartos', text: 'Alemania remonta 2-0 a Inglaterra. Revancha de 1966.' },
    ],
  },

  {
    year: 1974,
    innovations: [
      'Debut del actual trofeo FIFA World Cup (tras retirar la Jules Rimet).',
      'Primera transmisión por satélite en directo.',
      'Holanda revoluciona con el Fútbol Total de Cruyff y Michels.',
    ],
    moments: [
      { title: 'Cruyff vs. eficiencia alemana', text: 'Holanda juega un fútbol nunca visto pero Alemania gana 2-1 la final con Breitner y Müller.' },
      { title: 'Zaire 0-9 Yugoslavia', text: 'La mayor derrota de un africano en un Mundial. Traumática para el fútbol africano.' },
    ],
  },

  {
    year: 1978,
    innovations: [
      'Dictadura militar argentina usa el Mundial como propaganda.',
      'Primera Copa con cámaras aéreas desde dirigibles.',
      'Los papelitos del Monumental nacen como tradición.',
    ],
    moments: [
      { title: 'Kempes, bota de oro en casa', text: 'El Matador marca 6 goles incluyendo doblete en final. Primer título argentino.' },
      { title: 'Argentina 6-0 Perú sospechoso', text: 'El resultado que Argentina necesitaba para clasificar por goles. Sigue envuelto en polémica política.' },
    ],
  },

  {
    year: 1982,
    innovations: [
      'Primer Mundial con 24 equipos (antes 16).',
      'Primer uso de reloj electrónico en estadios.',
      'España debuta como sede, 45 años después de la guerra civil.',
    ],
    moments: [
      { title: 'Paolo Rossi vs Brasil', text: 'Italia 3-2 Brasil con triplete de Rossi, venido del castigo por el escándalo del totonero. Eliminó al mejor Brasil.' },
      { title: 'Kuwait se planta contra Francia', text: 'El jeque Fahad Al-Sabah entra al campo a protestar un gol. Se repite la jugada.' },
    ],
  },

  {
    year: 1986,
    innovations: [
      'Estadio Azteca, primer estadio en albergar dos finales (1970 y 1986).',
      'Maradona define el Mundial con dos jugadas históricas en un mismo partido.',
      'Se consolida el 4-4-2 como formación estándar.',
    ],
    moments: [
      { title: 'La Mano de Dios', text: 'Maradona marca con la mano contra Inglaterra (cuartos). El árbitro no lo ve. 1-0.' },
      { title: 'El Gol del Siglo', text: 'Minutos después, Maradona regatea a 5 ingleses desde su campo. Mejor gol jamás marcado en un Mundial.' },
      { title: 'Final épica', text: 'Argentina 3-2 Alemania Occidental con Burruchaga marcando a 6 min del final.' },
    ],
  },

  {
    year: 1990,
    innovations: [
      'Balón Etrusco Unico — primer diseño multicolor.',
      'Mínimo histórico de goles/partido (2,21).',
      'Se consolida el juego defensivo extremo ("catenaccio" italiano).',
    ],
    moments: [
      { title: 'Camerún sorprende', text: 'Los Leones Indomables eliminan a Argentina en el partido inaugural. Primera participación africana en cuartos.' },
      { title: 'Maradona llora', text: 'Argentina pierde la final 0-1 con gol de penalti de Brehme en el min 85. Maradona llora desconsolado.' },
      { title: 'Notti Magiche', text: 'El himno de Italia 90 queda en el imaginario colectivo como sinónimo de mundial romántico.' },
    ],
  },

  {
    year: 1994,
    innovations: [
      'Primer Mundial en Estados Unidos — país sin tradición futbolística.',
      'Récord absoluto de asistencia: 3,58 millones.',
      'Primera final decidida por penales (Baggio falla el último).',
      'Tres puntos por victoria (antes 2) para animar el ataque.',
    ],
    moments: [
      { title: 'Baggio falla el penal', text: 'La final Brasil-Italia 0-0 se define 3-2 por penales. El Divino Codino envía el suyo a las nubes.' },
      { title: 'Maradona, positivo', text: 'Expulsado del torneo tras dar positivo por efedrina. Fin de su carrera mundialista.' },
      { title: 'Andrés Escobar, asesinado', text: 'Tras marcarse un gol en propia, el defensor colombiano es asesinado a su regreso.' },
    ],
  },

  {
    year: 1998,
    innovations: [
      'Primer Mundial con 32 equipos (antes 24).',
      'Primer oro galo, contra Brasil 3-0.',
      'Polémica del "caso Ronaldo" horas antes de la final.',
    ],
    moments: [
      { title: 'El misterio de Ronaldo', text: 'R9 sufre un ataque horas antes de la final. Juega pero desaparece. 0-3 que nadie olvida.' },
      { title: 'Zidane, dos de cabeza', text: 'El 10 francés marca doblete con la cabeza. Nacimiento del Zizou mito.' },
      { title: 'Argentina-Inglaterra', text: 'Beckham expulsado por una patada boba. Owen marca gol antológico. Argentina pasa en penales.' },
    ],
  },

  {
    year: 2002,
    innovations: [
      'Primer Mundial en Asia. Primer Mundial con dos países sede.',
      'Corea del Sur llega a semifinales (4º). Récord asiático.',
      'Las polémicas arbitrales contra Italia y España marcan el recuerdo.',
    ],
    moments: [
      { title: 'Ronaldo redención', text: 'R9 vuelve de la lesión y marca 8 goles incluyendo doblete en final. Penta para Brasil.' },
      { title: 'Corea del Sur 4º', text: 'Guus Hiddink lleva a los coreanos a semis tras eliminar a Italia y España. Sorpresa histórica.' },
      { title: 'Senegal elimina a Francia', text: 'Francia, campeona vigente, cae 0-1 en el inaugural contra Senegal. Retour au vestiaire.' },
    ],
  },

  {
    year: 2006,
    innovations: [
      'Balón Teamgeist con 14 paneles (antes 32).',
      'Italia gana su 4º título, tras el escándalo del Calciopoli.',
      'Alemania se reinventa con el "Sommermärchen".',
    ],
    moments: [
      { title: 'El cabezazo de Zidane', text: 'En la final, Zidane golpea con la cabeza a Materazzi en el pecho. Expulsión, Italia gana por penales.' },
      { title: 'Italia ai rigori', text: 'Cannavaro levanta la Copa en Berlín. Cuarto título azzurro, 24 años después del último.' },
      { title: 'Sommermärchen', text: 'Alemania, 3ª, vive un mes de euforia pacífica. Klinsmann rehace la imagen del fútbol alemán.' },
    ],
  },

  {
    year: 2010,
    innovations: [
      'Primer Mundial en África.',
      'Vuvuzelas — el sonido que definió la Copa (para bien o mal).',
      'Balón Jabulani, criticadísimo por porteros.',
      'España debuta como campeona mundial con fútbol de posesión.',
    ],
    moments: [
      { title: 'Iniesta, de mi vida', text: 'El manchego marca el único gol de la final en el min 116. Primer título español, 116 años después de fundarse la Federación.' },
      { title: 'Mano de Suárez', text: 'Uruguay-Ghana en cuartos. Suárez detiene con la mano un gol en la última jugada. Se va expulsado, pero Gyan falla el penal.' },
      { title: 'Paul el pulpo', text: 'El pulpo adivino acierta los 8 partidos que pronostica. Alemania sube al podio en parte gracias a él.' },
    ],
  },

  {
    year: 2014,
    innovations: [
      'Debut de la tecnología de gol en línea (goal-line technology).',
      'Spray evanescente para marcar barreras.',
      'Brasil recibe la humillación más grande de su historia.',
    ],
    moments: [
      { title: 'Mineirazo', text: 'Brasil 1-7 Alemania en semifinales. El Mineirão asiste al peor momento deportivo de Brasil (peor que Maracanazo según muchos).' },
      { title: 'Götze en el 113', text: 'El supersuplente marca de volea en la prórroga. Alemania 1-0 Argentina. El 4º título alemán.' },
      { title: 'James, la revelación', text: 'Colombiano con 6 goles se lleva la bota de oro. Golazo de volea vs Uruguay en octavos.' },
    ],
  },

  {
    year: 2018,
    innovations: [
      'Debut del VAR (Video Assistant Referee).',
      'Francia, jovencísima, con Mbappé (19) y Griezmann.',
      'Croacia llega a su primera final.',
    ],
    moments: [
      { title: 'Mbappé vs Argentina', text: 'El francés con 19 años destroza a Argentina en octavos. Primer joven en marcar doblete en un Mundial desde Pelé 1958.' },
      { title: 'Croacia, cenicienta', text: 'Con Modrić como genio, elimina a Rusia (local), Dinamarca e Inglaterra para llegar a la final.' },
      { title: 'Rusia sorprende', text: 'Local elimina a España en penales. Cherchesov se vuelve héroe nacional.' },
    ],
  },

  {
    year: 2022,
    innovations: [
      'Primer Mundial en Oriente Medio.',
      'Primer Mundial en noviembre-diciembre (clima).',
      'Semi-automatic offside — tecnología de fuera de juego con IA.',
      'Estadio desmontable (974, hecho con contenedores).',
    ],
    moments: [
      { title: 'La final más bonita', text: 'Argentina 3-3 Francia. Triplete de Mbappé vs doblete de Messi. 4-2 a Argentina en penales. 36 años después del último.' },
      { title: 'Saudí elimina a Argentina', text: 'Día 1. Arabia 2-1 Argentina con golazo de Al-Dawsari. Mayor sorpresa histórica.' },
      { title: 'Marruecos, 4º', text: 'Primer país africano/árabe en llegar a semifinales. Elimina a España y Portugal.' },
    ],
  },

  {
    year: 2026,
    innovations: [
      'Primer Mundial con 48 equipos (antes 32).',
      'Primer Mundial con tres países sede.',
      'Nuevo formato: 12 grupos de 4 → R32 inédita → R16 → cuartos → semis → final.',
      'Estadio Azteca, primer estadio en tres Mundiales (1970, 1986, 2026).',
    ],
    moments: [
      { title: 'Por escribirse', text: 'El Mundial arranca el 11 de junio de 2026 en el Azteca. México inaugura.' },
    ],
  },
];

export function getStory(year: number): TournamentStory | undefined {
  return STORIES.find((s) => s.year === year);
}

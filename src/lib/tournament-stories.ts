/**
 * Rich editorial data per World Cup — mascot, match ball, anthem,
 * innovations, key moments, controversies, nostalgia and curiosities.
 * Used by the "Historia" section on every /ediciones/[slug]. Image URLs
 * point to Wikimedia Commons where available; can be populated by an
 * ingester later.
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

export type BestGoal = {
  /** Short title for the goal. */
  title: string;
  scorer: string;
  /** FIFA code of the scoring team. */
  team: string;
  /** FIFA code of the opponent. */
  against: string;
  /** Stage label ("Final", "Cuartos", "Grupos", …). */
  stage: string;
  /** Match minute as displayed, optional. */
  minute?: string;
  /** Short narrative of why this goal is remembered. */
  description: string;
  /** Optional YouTube video ID for embed. When missing, the UI falls
   *  back to a YouTube search link built from `youtubeSearch`. */
  youtubeId?: string;
  /** Search string used to link out to YouTube when no embed is set. */
  youtubeSearch?: string;
};

export type TournamentStory = {
  year: number;
  mascot?: MascotInfo;
  ball?: BallInfo;
  anthem?: AnthemInfo;
  innovations: string[];
  moments: KeyMoment[];
  /** Polémicas, escándalos, sospechas, decisiones arbitrales discutidas. */
  controversies?: KeyMoment[];
  /** Recuerdos sensoriales: narradores, jingles, cromos, rituales, prensa. */
  nostalgia?: KeyMoment[];
  /** Curiosidades rápidas — datos que se quedan grabados. */
  trivia?: string[];
  /** The defining, canonical goal of the edition. */
  bestGoal?: BestGoal;
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
    bestGoal: {
      title: 'El gol que iguala la primera final',
      scorer: 'Pedro Cea',
      team: 'URU',
      against: 'ARG',
      stage: 'Final',
      minute: "57'",
      description:
        'Argentina iba 2-1 y mandaba. Cea empata en el 57 para Uruguay, que arrollaría después 4-2. El gol que encarriló el primer título mundial de la historia.',
      youtubeSearch: 'Pedro Cea gol final Uruguay Argentina 1930',
    },
    innovations: [
      'Primer Mundial de la historia. 13 equipos participantes, todos por invitación.',
      'Se construye el Estadio Centenario para albergar el torneo.',
      'Francia juega el primer partido contra México y Laurent marca el primer gol.',
    ],
    moments: [
      { title: 'El primer gol del Mundial', text: 'Lucien Laurent (Francia) lo marca en el min. 19 del Francia 4-1 México. Tenía 23 años.' },
      { title: 'Uruguay, primer campeón', text: 'Con 4-2 sobre Argentina ante 68.346 espectadores en el Centenario, Uruguay se proclama campeón del mundo inaugural.' },
    ],
    controversies: [
      { title: 'El boicot europeo', text: 'Sólo 4 selecciones europeas (Francia, Bélgica, Yugoslavia, Rumanía) aceptan cruzar el Atlántico. Inglaterra, Alemania, Italia, España y Países Bajos dicen que no. FIFA amenaza con sanciones que nunca se aplican.' },
      { title: 'Dos balones, una final', text: 'Argentina y Uruguay no se ponen de acuerdo sobre el balón de la final. Se juega el primer tiempo con uno argentino (2-1 a la Albiceleste) y el segundo con uno uruguayo (4-2 final charrúa). El belga Jean Langenus arbitra con corbata, gorra y petición de escolta policial.' },
    ],
    nostalgia: [
      { title: 'Crónicas por cable', text: 'Europa leía los resultados un día tarde en diarios de papel. No hubo radio en directo, sólo crónica escrita desde Montevideo vía telegrama transatlántico.' },
      { title: 'El Conte Verde', text: 'Jules Rimet viajó 3 semanas en barco con la copa en su maleta. Rumanía, Francia, Bélgica y Yugoslavia embarcaron en el mismo trasatlántico: se entrenaban en cubierta.' },
    ],
    trivia: [
      'Estados Unidos acabó 3º — último podio estadounidense hasta hoy.',
      'Lucien Laurent marcó el primer gol del primer Mundial a las 15:19 del 13 de julio de 1930.',
      'Bolivia viajó con camisetas que deletreaban "VIVA URUGUAY" una letra por jugador al formar fila.',
    ],
  },

  {
    year: 1934,
    bestGoal: {
      title: 'El gol que dio la prórroga',
      scorer: 'Angelo Schiavio',
      team: 'ITA',
      against: 'TCH',
      stage: 'Final',
      minute: "95'",
      description:
        'Final 1-1. Schiavio culmina una internada central, casi sin fuerzas, y bate al portero Plánička en el minuto 95. Primer título italiano. Pozzo lloró en el banquillo.',
      youtubeSearch: 'Schiavio gol final Italia Checoslovaquia 1934',
    },
    innovations: [
      'Primer Mundial con formato de eliminación directa desde octavos.',
      'Italia clasifica por primera vez via eliminatorias clasificatorias.',
      'Uruguay se niega a defender el título en protesta por la escasa participación europea en 1930.',
    ],
    moments: [
      { title: 'Final en prórroga', text: 'Italia 2-1 Checoslovaquia tras 90 min empatados 1-1. Schiavio marca en el 95.' },
    ],
    controversies: [
      { title: 'El Mundial de Mussolini', text: 'Il Duce convirtió el torneo en escaparate fascista. Camisas negras en las gradas, saludo romano en las formaciones, y la sospecha —nunca probada pero recurrente— de que los árbitros de SF Italia-Austria y final Italia-Checoslovaquia recibieron "orientaciones" del régimen.' },
      { title: 'Uruguay no va', text: 'El campeón vigente se niega a defender el título. Represalia histórica por el plantón europeo en 1930. Único campeón que jamás disputó el Mundial siguiente.' },
      { title: 'El anfitrión clasifica', text: 'Italia tuvo que jugar eliminatoria a pesar de ser anfitrión — única vez en la historia del torneo.' },
    ],
    nostalgia: [
      { title: 'Radio a válvulas', text: 'Primeras transmisiones mundiales por radio simultánea a toda Europa. Familias enteras alrededor del aparato de madera, chistera EIAR (Italia) y BBC (GB) lanzando crónica en directo.' },
      { title: 'Gli Azzurri de Pozzo', text: 'Vittorio Pozzo, técnico doble campeón, inmortaliza a Meazza, Schiavio y Orsi en la memoria italiana. La plantilla incluía "oriundi" —argentinos con pasaporte italiano como Monti, que había perdido la final de 1930 con Argentina—.' },
    ],
    trivia: [
      'Único Mundial sin ningún país latinoamericano en semifinales.',
      'Italia y Checoslovaquia empataron la final; ambas selecciones jugaron con pantalones rotos en la prórroga y debieron cambiárselos en el descanso.',
    ],
  },

  {
    year: 1938,
    bestGoal: {
      title: 'La chilena del Hombre de Goma',
      scorer: 'Leônidas da Silva',
      team: 'BRA',
      against: 'POL',
      stage: 'Octavos',
      description:
        'Brasil-Polonia 6-5 en prórroga — uno de los mejores partidos de la historia. Leônidas marca con una chilena tras rompérsele la bota y seguir descalzo. Cuatro goles totales del acróbata brasileño.',
      youtubeSearch: 'Leonidas chilena Brasil Polonia 1938',
    },
    innovations: [
      'Último mundial antes de la Segunda Guerra Mundial (1939-1945).',
      'Austria se retira por la anexión nazi; se incorpora Suecia por invitación.',
      'Italia se convierte en el primer bicampeón consecutivo.',
    ],
    moments: [
      { title: 'Hat-trick en final', text: 'No ocurre, pero Piola anota doblete en la final. Brasil queda 3º con Leônidas como máximo goleador del torneo.' },
    ],
    controversies: [
      { title: 'El Anschluss se lleva a Austria', text: 'La Wunderteam austriaca, favorita, desaparece en marzo de 1938 tras la anexión nazi. Sus mejores jugadores son forzados a incorporarse a la selección alemana que queda eliminada de inmediato por Suiza.' },
      { title: 'Leônidas en el banquillo', text: 'Brasil deja al "Hombre de Goma" descansando para "reservarlo para la final" asumiendo que pasaría la semi contra Italia. Perdieron 2-1. Uno de los errores tácticos más famosos del fútbol.' },
      { title: 'Italia de negro', text: 'Mussolini ordena a los azzurri jugar la semifinal con camiseta fascista negra. Los franceses del Parque de los Príncipes pitan al entrar; los italianos ganan igual.' },
    ],
    nostalgia: [
      { title: 'Leônidas, el acróbata', text: 'El delantero brasileño popularizó la chilena —los narradores la llamaban "bicicleta"—. Jugaba con unas botas tan desgastadas que se le salían en pleno partido: contra Polonia marcó un gol descalzo.' },
      { title: 'Última foto en placa', text: 'Las instantáneas de este Mundial serían las últimas en placa de vidrio. Cuando acabó el torneo, el mundo tenía un año exacto antes de que Hitler invadiera Polonia.' },
    ],
    trivia: [
      'Cuba debutó y llegó a cuartos — única participación cubana en un Mundial.',
      'Las Indias Orientales Neerlandesas (hoy Indonesia) debutaron y fueron eliminadas 6-0 por Hungría: único partido asiático del torneo durante 16 años.',
      'Vittorio Pozzo es, aún hoy, el único técnico bicampeón mundial.',
    ],
  },

  {
    year: 1950,
    bestGoal: {
      title: 'Ghiggia silencia al Maracaná',
      scorer: 'Alcides Ghiggia',
      team: 'URU',
      against: 'BRA',
      stage: 'Final (grupo final)',
      minute: "79'",
      description:
        'Brasil 1-0, Maracaná delirante. Ghiggia se lleva una pared con Pérez, ve que Barbosa le anticipa el centro y remata al primer palo. 2-1 definitivo. 200.000 personas mudas. "Tres personas silenciaron el Maracaná: Frank Sinatra, Juan Pablo II y yo".',
      youtubeSearch: 'Ghiggia gol Maracanazo Uruguay Brasil 1950',
    },
    innovations: [
      'Primer Mundial tras la guerra. Alemania y Japón excluidos.',
      'Único Mundial que no tuvo final propiamente dicha: grupo final de 4 equipos.',
      'El "Maracanazo" — Uruguay gana la última jornada en el estadio más grande del mundo.',
    ],
    moments: [
      { title: 'Maracanazo', text: 'Uruguay 2-1 Brasil ante 173.850 espectadores (oficial) / ~200.000 reales. Ghiggia marca en el min 79 el gol que enmudece al Maracaná.' },
      { title: 'Inglaterra elimina en grupos por USA 1-0', text: 'Uno de los mayores batacazos: Joe Gaetjens marca el gol histórico.' },
    ],
    controversies: [
      { title: 'Escocia se queda en casa', text: 'Los escoceses renuncian a viajar porque no ganaron el British Home Championship — su asociación prometió ir solo si eran campeones británicos. Perdieron contra Inglaterra y cumplieron palabra.' },
      { title: 'India descalzos', text: 'India clasificó pero se retiró al prohibirle FIFA jugar sin botas. Sumado al retiro de Turquía y Escocia, el grupo de Uruguay quedó solo con Bolivia. Uruguay llega al grupo final habiendo jugado un partido.' },
      { title: 'La prensa carioca ya tenía el titular', text: 'O Mundo publicó al día siguiente "A mis amigos les mostraré la medalla de campeón del mundo" firmado por el alcalde de Río. Llegaron a prensar discos con el himno de la victoria brasileña.' },
    ],
    nostalgia: [
      { title: 'El silencio del Maracaná', text: '"Moacir Barbosa, guardameta marcado para toda la vida": 50 años después repitió su frase "la pena máxima en Brasil son 30 años, yo llevo 50". Ari Barroso, compositor en cabina, se calló para siempre. El país entró en luto colectivo y cambió su camiseta blanca por la amarilla.' },
      { title: 'Radios Telefunken en cada café', text: 'Casi nadie tenía radio en casa. Brasil se amontonaba en cafés, bares y balcones pegados al aparato. La frase "2 a 1 — Uruguay campeón" se oyó en todas las ondas, pero en Río nadie quería creerla.' },
      { title: '"Alcides Ghiggia"', text: 'Tres personas han silenciado el Maracaná, decía Ghiggia: Frank Sinatra, Juan Pablo II y yo. Su carrera entera se reduce —injustamente— a ese gol de 1950.' },
    ],
    trivia: [
      'Único Mundial sin final formal: se decidió en un grupo final de 4 equipos.',
      'La prensa inglesa creyó que USA 1-0 Inglaterra era un error del teletipo y publicó 10-1.',
      'Joe Gaetjens, el autor del gol americano, era cocinero haitiano y estudiante. Años después sería asesinado por la dictadura de Duvalier en Haití.',
    ],
  },

  {
    year: 1954,
    bestGoal: {
      title: '"Rahn schießt — TOR! TOR! TOR!"',
      scorer: 'Helmut Rahn',
      team: 'FRG',
      against: 'HUN',
      stage: 'Final',
      minute: "84'",
      description:
        'Hungría 2-0 al cuarto de hora; Alemania empata y aguanta. En el 84, Schäfer centra, Lantos rechaza corto y Rahn remata cruzado desde 18 metros. El Milagro de Berna. Herbert Zimmermann entra a la leyenda con el grito a pelo en la radio alemana.',
      youtubeSearch: 'Helmut Rahn Milagro Berna gol final 1954',
    },
    innovations: [
      'Primer Mundial televisado en Europa.',
      'Récord histórico de goles por partido: 5,38.',
      'Alemania Occidental vuelve a la competición tras la guerra.',
    ],
    moments: [
      { title: 'El Milagro de Berna', text: 'Alemania 3-2 Hungría, remontando 0-2 contra los invencibles magiares. Rahn marca el gol del título.' },
      { title: 'Kocsis, bota de oro', text: 'El húngaro marca 11 goles en 5 partidos.' },
    ],
    controversies: [
      { title: 'La sospecha alemana', text: 'Años después se confirmó que varios jugadores alemanes recibieron "inyecciones de vitamina C" antes de la final. Las pruebas forenses de los 90 revelaron que eran metanfetaminas (Pervitin). La "hazaña" del Milagro de Berna vive con esa sombra.' },
      { title: 'La Batalla de Berna', text: 'Brasil 2-4 Hungría en cuartos, con tres expulsiones y batalla general en el vestuario. La policía suiza tuvo que entrar a separar. Nunca identificaron al brasileño que golpeó a Puskás con una botella.' },
      { title: 'Puskás renquea', text: 'El capitán húngaro jugó la final con el tobillo partido por una patada alemana en la fase de grupos. Marcó, pero no pudo correr. Hungría seguía invicta desde 1950.' },
    ],
    nostalgia: [
      { title: '"Tor! Tor! Tor! Tor!"', text: 'Herbert Zimmermann narrando el gol de Rahn en el minuto 84 es la narración más reproducida de la radio alemana de posguerra. Una generación entera identifica ese grito con el renacer psicológico de Alemania Occidental.' },
      { title: 'Puskás, Kocsis y la Hungría mítica', text: 'La "Aranycsapat" (Equipo de Oro) húngara venía de 32 partidos invictos y la medalla olímpica de Helsinki 1952. La final perdida es, todavía hoy, herida nacional.' },
      { title: 'Pocos televisores, muchos vecinos', text: 'Alemania tenía apenas 40.000 televisores. La gente se agolpaba en escaparates de electrodomésticos y cafés. Es el primer Mundial que quedó grabado en vídeo — algunos minutos todavía existen.' },
    ],
    trivia: [
      'Récord absoluto de goles por partido en un Mundial: 5,38 (140 goles en 26 partidos).',
      'Austria 7-5 Suiza en cuartos: récord de más goles en un partido mundialista.',
      'Hungría marcó 17 goles en 3 partidos camino a la final y aun así perdió.',
    ],
  },

  {
    year: 1958,
    bestGoal: {
      title: 'Pelé levanta, gira, define',
      scorer: 'Pelé',
      team: 'BRA',
      against: 'SWE',
      stage: 'Final',
      minute: "55'",
      description:
        'Pelé recibe de espaldas en el área, controla con el pecho, levanta el balón por encima de Bengt Gustavsson con el empeine y antes de que toque el suelo lo remata de volea al ángulo. 17 años. La final que lo convirtió en dios.',
      youtubeSearch: 'Pele gol final Suecia 1958 control pecho volea',
    },
    innovations: [
      'Primer Mundial con Pelé (17 años).',
      'Brasil usa por primera vez el 4-2-4 que revolucionaría el fútbol.',
      'Just Fontaine marca 13 goles, récord histórico en un solo Mundial.',
    ],
    moments: [
      { title: 'Nace Pelé', text: 'Con 17 años, marca doblete en la final y triplete en semis. Se convierte en icono global al instante.' },
      { title: '13 de Fontaine', text: 'El francés bate el récord absoluto de goles en un solo Mundial: imbatido hasta hoy.' },
    ],
    controversies: [
      { title: 'Pelé casi queda fuera', text: 'El psicólogo del equipo brasileño, Dr. João Carvalhaes, rechazó a Pelé en los tests por "infantilismo manifiesto". Didí y el entrenador Vicente Feola lo impusieron igual. El doctor pasó a la historia como el hombre que casi deja a Pelé fuera.' },
      { title: 'URSS y el fútbol "amateur"', text: 'Primer Mundial soviético. Yashin, la Araña Negra, deslumbra. Años de sospechas sobre profesionalismo encubierto bajo figura de "futbolista-soldado".' },
    ],
    nostalgia: [
      { title: 'Just Fontaine con botas prestadas', text: 'El delantero francés rompió sus botas en el primer partido y jugó el resto con las de su compañero Stéphane Bruey. Marcó 13 goles en 6 partidos. Nadie ha vuelto a acercarse.' },
      { title: 'Garrincha, alegría del pueblo', text: 'Las piernas torcidas de Manuel "Mané" dos Santos marcan la memoria visual del fútbol brasileño. Regates imposibles, vida trágica después. Murió alcoholizado a los 49 años. Pelé dijo: "Garrincha era más amado que yo".' },
      { title: 'Primeras figuritas para coleccionar', text: 'El álbum sueco de 1958 inicia la cultura del cromo mundialista. Pelé #18, Fontaine #5: los cromos que todavía se pagan a cuatro cifras en subastas.' },
    ],
    trivia: [
      'Único Mundial con los 4 semifinalistas representando 4 ligas distintas de 4 países distintos.',
      'Pelé es el futbolista más joven en ganar un Mundial: 17 años, 249 días.',
      'Just Fontaine marcó en los 6 partidos que disputó — único en haberlo hecho.',
    ],
  },

  {
    year: 1962,
    bestGoal: {
      title: 'Garrincha sin Pelé',
      scorer: 'Garrincha',
      team: 'BRA',
      against: 'ENG',
      stage: 'Cuartos',
      minute: "53'",
      description:
        'Con Pelé lesionado, Garrincha carga a Brasil. Disparo de exterior con efecto desde el borde del área que entra por la escuadra contrario. Segundo gol de su doblete; el tercero lo puso de cabeza. La Alegría del Pueblo humilla a la Inglaterra de Ramsey.',
      youtubeSearch: 'Garrincha gol Inglaterra 1962 cuartos',
    },
    innovations: [
      'Primer Mundial en un país devastado por terremoto (Chile, 1960).',
      'Pelé se lesiona en el grupo; Garrincha lidera el bi-campeonato de Brasil.',
      'La Batalla de Santiago (Chile-Italia) marca un nuevo récord de violencia.',
    ],
    moments: [
      { title: 'Garrincha, sin Pelé', text: 'Lesionado su compañero, la Alegría del Pueblo lleva a Brasil al título con actuaciones antológicas.' },
      { title: 'La Batalla de Santiago', text: 'Chile 2-0 Italia con dos expulsados, puñetazos y patadas. David Coleman (BBC) lo describe como "el partido más estúpido".' },
    ],
    controversies: [
      { title: 'Ken Aston no vio nada', text: 'El árbitro inglés de Chile-Italia estuvo a punto de suspender el partido. Leonel Sánchez partió la nariz a Humberto Maschio de un izquierdazo que el árbitro, de espaldas, nunca vio. La policía chilena tuvo que entrar al campo tres veces.' },
      { title: 'Dos periodistas italianos y la prensa antichilena', text: 'Antes del torneo, dos corresponsales de La Nazione publicaron crónicas describiendo Chile como "país de borrachos". El país hirvió. Los italianos pagaron el precio en el campo.' },
      { title: 'El "goal-average" inventado aquí', text: 'Por primera vez un Mundial usa diferencia de goles como criterio de desempate. Argentina quedó eliminada por ello frente a Inglaterra: el sistema llegó para quedarse.' },
    ],
    nostalgia: [
      { title: 'Chile, tras el terremoto', text: 'En 1960 el terremoto de Valdivia (9,5 Richter) había destruido media provincia. Carlos Dittborn, alma organizativa, dijo aquello de "porque no tenemos nada, lo haremos todo". Murió un mes antes del torneo. Chile acabó 3º: catarsis nacional pura.' },
      { title: 'Pelé se lesiona en el grupo', text: 'Contra Checoslovaquia, Pelé sufre un desgarro. Juega en modo fantasma; los rivales checos, caballerosos, no le empujan siquiera. Garrincha lleva a Brasil al bicampeonato prácticamente solo.' },
    ],
    trivia: [
      'Ken Aston, el árbitro de la Batalla, inventaría 4 años después las tarjetas amarilla y roja tras ver un semáforo en Kensington High Street.',
      'Brasil ganó la copa con Pelé jugando sólo 2 partidos — único campeón en haber "descansado" la final y la semifinal.',
      'Un perro invadió el campo en Inglaterra-Brasil y Jimmy Greaves le atrapó a cuatro patas. El perro se orinó encima del inglés.',
    ],
  },

  {
    year: 1966,
    bestGoal: {
      title: 'Eusébio derriba a Corea del Norte',
      scorer: 'Eusébio',
      team: 'POR',
      against: 'PRK',
      stage: 'Cuartos',
      minute: "59'",
      description:
        'Portugal 0-3 a los 25 min en Goodison Park. Eusébio carga solo con la remontada: 4 goles consecutivos, dos de penal, dos en jugada. Su 4º fue un zurdazo desde la frontal, cruzado. Remontada 5-3. "La Pantera Negra" en su partido eterno.',
      youtubeSearch: 'Eusebio four goals Portugal North Korea 1966',
    },
    innovations: [
      'Primer Mundial con mascota oficial: World Cup Willie.',
      'Inglaterra campeón en casa, único título inglés hasta hoy.',
      'Hat-trick en final por primera vez (Hurst).',
    ],
    moments: [
      { title: '"They think it\'s all over"', text: 'Kenneth Wolstenholme narra el cuarto gol de Hurst y dice la frase inmortal del fútbol inglés.' },
      { title: 'El gol fantasma de Wembley', text: 'Hurst marca con un remate al larguero que bota en línea de gol. ¿Entró o no? 60 años de debate.' },
    ],
    controversies: [
      { title: '¿Entró o no entró?', text: 'El 2-2 de Inglaterra-Alemania Oeste tras el remate de Hurst al larguero. Análisis Oxford 1995 y MIT 2016 dicen que NO entró. Hurst mantiene que sí hasta hoy. Los alemanes llaman a cualquier gol dudoso "Wembley-Tor" desde entonces.' },
      { title: 'Rattín expulsado sin entender', text: 'Argentina-Inglaterra en cuartos: el capitán argentino Antonio Rattín, expulsado por "violencia de gestos" hacia el árbitro alemán Rudolf Kreitlein —sin tarjetas aún—. Rattín no hablaba alemán. La expulsión marcó el antagonismo Argentina-Inglaterra durante décadas.' },
      { title: 'La copa robada', text: 'La Jules Rimet desapareció del Westminster Central Hall cuatro meses antes del torneo. La encontró un perro collie llamado Pickles bajo un seto de Upper Norwood. Scotland Yard quedó en ridículo.' },
    ],
    nostalgia: [
      { title: 'World Cup Willie, el primer merch', text: 'El león con la Union Jack fue la primera mascota de la historia. Peluches, tazas, figuritas, discos — el merchandising moderno nace aquí. Lonnie Donegan le dedicó una canción que sonó todo el verano del 66.' },
      { title: 'Eusébio llora en semifinal', text: '"La Pantera Negra" de Mozambique jugaba por Portugal. Marcó 9 goles (bota de oro) y se fue entre lágrimas tras perder contra Inglaterra 1-2. Sigue siendo el momento más visto del fútbol portugués previo a Cristiano.' },
      { title: 'La BBC en blanco y negro', text: 'Wolstenholme narrando para 32,3 millones de británicos —récord de audiencia TV en UK que duró hasta 1998—. "Some people are on the pitch, they think it\'s all over... IT IS NOW!" resonó en cada pub.' },
    ],
    trivia: [
      'Corea del Norte eliminó a Italia 1-0 en fase de grupos — del trauma los italianos no se recuperaron hasta 1970.',
      'Pickles, el perro que encontró la copa, murió 1 año después estrangulado al engancharse su correa persiguiendo a un gato.',
      'Hurst sigue siendo el único futbolista con hat-trick en una final de Mundial.',
    ],
  },

  {
    year: 1970,
    bestGoal: {
      title: 'El 4-1 perfecto — el mejor gol colectivo de la historia',
      scorer: 'Carlos Alberto',
      team: 'BRA',
      against: 'ITA',
      stage: 'Final',
      minute: "86'",
      description:
        'Nueve pases tocan a ocho brasileños distintos. Clodoaldo recorre medio campo regateando a cuatro italianos, Rivelino abre a la izquierda, Jairzinho empuja al centro, Pelé da el pase ciego perfecto al vacío — sin mirar — y Carlos Alberto llega lanzado desde atrás para fusilar. El gol que define el Jogo Bonito y el fútbol total brasileño.',
      youtubeSearch: 'Carlos Alberto gol final Brasil Italia 1970',
    },
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
    controversies: [
      { title: 'Bobby Moore detenido en Bogotá', text: 'Cuatro días antes del debut, el capitán inglés fue arrestado por el presunto robo de un brazalete de esmeraldas en una joyería del hotel Tequendama. Detenido 4 días. Siempre se sospechó un montaje para desestabilizar a Inglaterra. Lo soltaron justo para viajar a México.' },
      { title: 'Horarios para la tele europea', text: 'Los partidos se jugaban a mediodía mexicano (40°C, 2.200m altura) para encajar con el prime time europeo. FIFA cedió a las cadenas; los jugadores sufrieron deshidratación histórica.' },
      { title: 'La Jules Rimet desaparece para siempre', text: 'Brasil se la quedó por ganar 3 Mundiales. La copia original fue robada en 1983 de la sede de la CBF en Río y nunca apareció. Se sospecha fundida y vendida como oro.' },
    ],
    nostalgia: [
      { title: 'México 70 en COLOR', text: 'El primer Mundial transmitido mundialmente en color. Para una generación, los verdes del Azteca, el amarillo canarinho y las banderas mexicanas son EL recuerdo cromático del fútbol. Quien lo vio en blanco y negro no olvida "descubrirlo" en color años después.' },
      { title: 'El Panini completo', text: '1970 consolida el álbum Panini moderno: 288 cromos. "Te cambio 2 Pelé por 1 Beckenbauer" se escuchó en cada patio del mundo. Los Panini del 70 hoy se rematan por miles de euros.' },
      { title: 'Banks paró lo imparable', text: 'La atajada de Gordon Banks al cabezazo de Pelé contra Inglaterra es, junto a Maradona vs Ingleses, el vídeo más reproducido de la historia mundialista. Pelé: "Marqué, ya había gritado gol". Banks: "Solo salí del suelo a recogerlo".' },
      { title: '"Partido del Siglo"', text: 'Italia-Alemania semi, 4-3 en prórroga. El Azteca tiene placa conmemorativa en el marcador: "Azteca dedica al fútbol este gran estadio en memoria del Partido del Siglo". Once goles en prórroga jamás vistos.' },
    ],
    trivia: [
      'Brasil jugó con camiseta amarilla en TODOS sus partidos — primer campeón que no necesitó cambiarse de equipación.',
      'Pelé: único jugador con 3 Mundiales ganados (1958, 1962, 1970). Récord que nadie ha igualado.',
      'Tarjetas amarilla y roja debutaron en el partido inaugural: Kurt Tschenscher (árbitro) no las mostró a nadie.',
    ],
  },

  {
    year: 1974,
    bestGoal: {
      title: 'Alemania no había tocado el balón',
      scorer: 'Johan Neeskens',
      team: 'NED',
      against: 'FRG',
      stage: 'Final',
      minute: "2'",
      description:
        'Kick-off, 16 pases holandeses, Cruyff baja hacia el área, Vogts le pone la pierna. Penal en el minuto 2. Neeskens lo clava contra el palo izquierdo de Maier. Alemania todavía no había tocado el balón — tuvo que sacar de centro para estrenar partido. Acabarían ganando 2-1.',
      youtubeSearch: 'Neeskens penalty final Holanda Alemania 1974',
    },
    innovations: [
      'Debut del actual trofeo FIFA World Cup (tras retirar la Jules Rimet).',
      'Primera transmisión por satélite en directo.',
      'Holanda revoluciona con el Fútbol Total de Cruyff y Michels.',
    ],
    moments: [
      { title: 'Cruyff vs. eficiencia alemana', text: 'Holanda juega un fútbol nunca visto pero Alemania gana 2-1 la final con Breitner y Müller.' },
      { title: 'Zaire 0-9 Yugoslavia', text: 'La mayor derrota de un africano en un Mundial. Traumática para el fútbol africano.' },
    ],
    controversies: [
      { title: 'Las dos Alemanias cara a cara', text: 'Única vez en la historia que RFA y RDA se enfrentan oficialmente. Sparwasser marca el 1-0 para la República Democrática. Alemania Oriental celebra como si hubiera ganado el Mundial; Occidental pasa de grupo igual y... acaba campeona del mundo.' },
      { title: 'La patada de Johan Neeskens', text: 'En la final, Cruyff baja a Vogts a medio campo; Neeskens marca penal al minuto 2 sin que Alemania hubiese tocado el balón. Los alemanes se ofendieron tanto que, según Beckenbauer, "decidieron que tenían que ganar como venganza a tanta arrogancia".' },
      { title: 'Zaire, la humillación africana', text: 'Mwepu Ilunga despejó la barrera de una falta directa antes de que Brasil rematara. El árbitro pensó que no entendía las reglas. Años después reveló que lo hacía adrede: los jugadores zaireños no habían cobrado sus primas del dictador Mobutu.' },
    ],
    nostalgia: [
      { title: 'La Naranja Mecánica', text: 'Cruyff 14, Neeskens, Rep, Rensenbrink — la camiseta naranja y el fútbol total se vuelven religión estética. "Ganar el corazón vale más que ganar la copa", dirán los holandeses en bucle. Oranje jamás la ganaría.' },
      { title: 'El Cruyff Turn nace', text: 'Contra Suecia, Cruyff hace el giro sobre sí mismo dejando a Jan Olsson. Se reproduce en todos los patios del mundo. Olsson dice: "Estuve orgulloso ese día — me hizo famoso"'},
      { title: 'Nuevo trofeo Silvio Gazzaniga', text: 'La copa FIFA que conocemos hoy debuta aquí. Más moderna, más abstracta. Gazzaniga cobró 75.000 liras por el encargo — los mismos italianos lloraron por no poder levantarla en la final.' },
    ],
    trivia: [
      'Cruyff llevaba el 14 porque el Ajax numeraba por orden alfabético de reserva — no por posición. Se convirtió en icono.',
      'Haití (primera participación mundial) perdió 0-7 con Polonia pero fue primer país caribeño en el torneo.',
      'Kazimierz Deyna (Polonia) fue el único jugador en anotar en los dos partidos contra las dos Alemanias.',
    ],
  },

  {
    year: 1978,
    bestGoal: {
      title: 'El Matador se inventa el 3-1',
      scorer: 'Mario Kempes',
      team: 'ARG',
      against: 'NED',
      stage: 'Final',
      minute: "105'",
      description:
        'Prórroga. Bertoni encuentra a Kempes en el área; el Matador entra en carrera, el balón le bota por tres piernas holandesas, se recompone y define al palo largo superando a Jongbloed en el suelo. 3-1 que encarrila el primer título argentino. Pelo al viento, papelitos del Monumental. 115 minutos del desempate celebratorio más intenso del fútbol argentino.',
      youtubeSearch: 'Kempes gol 3-1 final Argentina Holanda 1978',
    },
    innovations: [
      'Dictadura militar argentina usa el Mundial como propaganda.',
      'Primera Copa con cámaras aéreas desde dirigibles.',
      'Los papelitos del Monumental nacen como tradición.',
    ],
    moments: [
      { title: 'Kempes, bota de oro en casa', text: 'El Matador marca 6 goles incluyendo doblete en final. Primer título argentino.' },
      { title: 'Argentina 6-0 Perú sospechoso', text: 'El resultado que Argentina necesitaba para clasificar por goles. Sigue envuelto en polémica política.' },
    ],
    controversies: [
      { title: 'ESMA a cuatro cuadras del Monumental', text: 'Mientras Kempes levantaba la copa, a 400 metros del estadio funcionaba el mayor centro clandestino de detención y tortura de la dictadura de Videla. El fútbol tapó los vuelos de la muerte. Hoy la ESMA es Museo de Memoria y Sitio UNESCO.' },
      { title: 'Argentina 6-0 Perú, eternamente sospechoso', text: 'Argentina necesitaba ganar por 4+ goles para eliminar a Brasil y jugar la final. Marcó 6. El arquero peruano Ramón Quiroga era argentino naturalizado. Cuatro décadas después, excomandante peruano confirmó ante la justicia argentina un pacto: Videla envió 35.000 toneladas de grano gratis al régimen de Morales Bermúdez. Sigue sin cerrarse.' },
      { title: 'Cruyff no vino', text: 'Johan Cruyff, figura total del fútbol, renunció al Mundial. Durante décadas se atribuyó a protesta política; en 2008 reveló la verdad: había sufrido un intento de secuestro en Barcelona meses antes y no quiso separarse de su familia.' },
      { title: 'Holanda no saluda a Videla', text: 'Rensenbrink y compañía se negaron a estrecharle la mano al dictador antes de la final. Rensenbrink estrelló un disparo al poste al minuto 90 — si entra, Argentina no gana su primer Mundial.' },
    ],
    nostalgia: [
      { title: 'Los papelitos del Monumental', text: 'Argentina salió a la final bajo una lluvia de papelitos rotos de la tribuna. No se había visto antes. Hoy sigue siendo marca de identidad de la hinchada argentina cuando la "scaloneta" juega en el Monumental.' },
      { title: 'Kempes y su melena', text: 'El Matador, único argentino del plantel jugando fuera (Valencia), con su pelo al viento, bota de oro, figura del torneo. Su gol en la final con la botella de coca que cae al campo y él la regatea es leyenda.' },
      { title: 'Gauchito el Mundialito', text: 'Mascota simpática con pañuelo celeste, gorra de gaucho y pequeño fusta. Se vendió en peluche, parche, sticker, libreta escolar. Toda una generación argentina lo tuvo en su cuarto.' },
    ],
    trivia: [
      'Rob Rensenbrink (Holanda) marcó el gol oficialmente considerado número 1000 del Mundial.',
      'Mario Kempes jugó con botas Puma sin logo — había firmado contrato con Adidas pero se negó a usarlas en el último momento.',
      'Primer Mundial televisado en diferido en España — aún bajo control franquista hasta 1975, TVE tardó en liberalizar la emisión deportiva.',
    ],
  },

  {
    year: 1982,
    bestGoal: {
      title: "L'urlo di Tardelli",
      scorer: 'Marco Tardelli',
      team: 'ITA',
      against: 'FRG',
      stage: 'Final',
      minute: "69'",
      description:
        'Scirea avanza, pared con Rossi, devolución a Tardelli que remata de zurda rozando el área. El gol es bonito pero la celebración se hace mito: Tardelli corre hacia el banquillo con los brazos al cielo, la boca abierta, gritando con todo el cuerpo. La foto del fútbol italiano. Pertini, el presidente, saltando en la tribuna.',
      youtubeSearch: 'Tardelli gol celebración final Italia Alemania 1982',
    },
    innovations: [
      'Primer Mundial con 24 equipos (antes 16).',
      'Primer uso de reloj electrónico en estadios.',
      'España debuta como sede, 45 años después de la guerra civil.',
    ],
    moments: [
      { title: 'Paolo Rossi vs Brasil', text: 'Italia 3-2 Brasil con triplete de Rossi, venido del castigo por el escándalo del totonero. Eliminó al mejor Brasil.' },
      { title: 'Kuwait se planta contra Francia', text: 'El jeque Fahad Al-Sabah entra al campo a protestar un gol. Se repite la jugada.' },
    ],
    controversies: [
      { title: 'El Desastre de Gijón', text: 'Alemania 1-0 Austria: ambos equipos sabían que con ese resultado pasaban a costa de Argelia. Los alemanes marcan al 10\', y los 80 minutos restantes se jugaron a ralentí, con pases horizontales y público pitando. Los argelinos ondearon billetes en las gradas. A partir de 1986, FIFA obliga a jugar los últimos partidos de grupo simultáneos.' },
      { title: 'Schumacher destroza a Battiston', text: 'Alemania-Francia en SF: el portero Harald Schumacher embiste a Patrick Battiston sin mirar el balón. Brecha en la cara, 3 dientes perdidos, 3 vértebras dañadas, entrada en coma. El árbitro holandés Corver no mostró ni amarilla. Encuesta en Le Monde: Schumacher pasó a ser el alemán más odiado en Francia desde Hitler.' },
      { title: 'El partido que paró el jeque', text: 'Kuwait-Francia: los franceses marcan un gol que los kuwaitíes no oyeron el pitido del árbitro. El jeque Fahad Al-Sabah (hermano del emir) entró al campo y ordenó retirar al equipo. El árbitro ruso Stupar anuló el gol — único caso de injerencia real aceptada por un árbitro en un Mundial.' },
    ],
    nostalgia: [
      { title: 'Naranjito divide a España', text: 'La naranja antropomórfica vestida con el traje de la Roja fue adorada por los niños y abucheada por los adultos ("ridícula"). Tuvo dibujos animados, canción, comic y álbum. Hoy es icono retro de culto en España.' },
      { title: '"Mundial 82" suena en cada feria', text: 'El himno oficial cantado por Plácido Domingo y el popular "Vamos vamos al Mundial" de Juan Pardo se oyeron todo el verano. Estribillos que siguen saliendo en mercadillos y radio fórmula española.' },
      { title: 'Paolo Rossi, la leyenda del perdonado', text: 'Pablito venía suspendido 2 años por el escándalo "Totonero" (apuestas). Italia lo llevó igual. Sin un gol en las 4 primeras jornadas, explotó contra Brasil: triplete, gol en semi, gol en final. Bota de oro y Balón de Oro. Murió en 2020.' },
      { title: 'Álbum Panini masivo', text: 'Primera gran oleada de cromos Panini en España. Los niños cambiaban figuritas en los patios y la palabra "repes" entró en el diccionario familiar. Santillana, Arconada, Juanito — el Panini del 82 hoy se paga en eBay a dos cifras por sobre.' },
    ],
    trivia: [
      'Primer Mundial a 24 equipos — dos fases de grupos, sin octavos aún.',
      'Italia ganó la final con el portero Dino Zoff de 40 años — el más veterano en levantar la copa.',
      'Arconada fue portada en España por no encajar con Inglaterra — pero Italia le metió tres en la final.',
    ],
  },

  {
    year: 1986,
    bestGoal: {
      title: 'El Gol del Siglo',
      scorer: 'Diego Armando Maradona',
      team: 'ARG',
      against: 'ENG',
      stage: 'Cuartos',
      minute: "55'",
      description:
        'Recibe en su campo, se da media vuelta sobre Beardsley y Reid, acelera por la derecha regateando a Butcher (dos veces), Fenwick y define dejando a Shilton en el suelo. 11 segundos, 10 toques, 60 metros, 5 ingleses mareados. Víctor Hugo Morales narrando: "Barrilete cósmico, ¿de qué planeta viniste?". El mejor gol de la historia por elección FIFA en 2002. No hay debate.',
      youtubeSearch: 'Maradona Gol del Siglo Inglaterra 1986',
    },
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
    controversies: [
      { title: 'Colombia renuncia, México hereda', text: 'Colombia tenía la sede. En 1982 renunció por crisis económica. FIFA adjudicó a México en 6 meses — a pesar de que el terremoto del 19 de septiembre de 1985 (>10.000 muertos) había destrozado la ciudad 8 meses antes del pitazo inicial.' },
      { title: '"Yo no la vi", dijo el árbitro', text: 'Ali Bin Nasser (Túnez) reconoció años después que no vio la mano. El linier búlgaro Bogdan Dotchev se justificó: "El árbitro estaba más cerca que yo — si él validó, yo no podía anular". Maradona, en 2005: "La metí con la mano de Dios — y con la cabeza de Diego".' },
      { title: 'Argentina-Inglaterra: el partido político', text: 'Cuatro años después de la Guerra de las Malvinas. Maradona dijo después: "No era un partido de fútbol, era una revancha. Aunque dijéramos antes que el fútbol no tenía nada que ver, sabíamos que sí. Muchos pibes argentinos habían muerto allí".' },
    ],
    nostalgia: [
      { title: '"Barrilete cósmico"', text: 'Víctor Hugo Morales narrando el Gol del Siglo: "Genio, genio, genio... ¡ta-ta-ta-ta-ta-ta-ta... Gooooooooooool! ¡Gooooooooooool! ¡Quiero llorar, Santo Dios, viva el fútbol! ¡Qué partido, qué jugador, qué regate! ¡Barrilete cósmico, ¿de qué planeta viniste para dejar en el camino a tanto inglés?!". Icono absoluto del periodismo deportivo latinoamericano.' },
      { title: 'La Ola se hace mundial', text: 'La "Mexican wave" se populariza mundialmente desde el Azteca. México 86 la exportó a todos los estadios del planeta.' },
      { title: 'Pique, bigote y sombrero', text: 'Chile mexicano con bigote y sombrero charro, vestido al estilo mariachi. Peluche en cada habitación infantil del continente americano. Naming acertado: "Pique" por picante y por picar el balón.' },
      { title: 'Álbum Panini con relieve', text: 'El Panini 86 incluye un diseño nuevo en el escudo: relieve plateado, banderitas brillantes en los equipos clasificados para octavos. Nadie completó el álbum sin perder la paga semanal completa.' },
    ],
    trivia: [
      'Maradona tocó el balón 8 veces en el Gol del Siglo. Duró 11 segundos.',
      'Único Mundial en el que se jugaron dos fases de grupos Y octavos (formato experimental).',
      'Primera mascota 100% masculina: Pique llegó 20 años tarde al sexismo mundialista.',
    ],
  },

  {
    year: 1990,
    anthem: {
      title: "Un'estate italiana",
      artist: 'Edoardo Bennato & Gianna Nannini',
      youtubeId: 'EvcvDGK6N3U',
    },
    bestGoal: {
      title: 'Maradona asiste, Caniggia define',
      scorer: 'Claudio Caniggia',
      team: 'ARG',
      against: 'BRA',
      stage: 'Octavos',
      minute: "81'",
      description:
        'Brasil dominaba el partido. Maradona recibe en el centro del campo, regatea con el cuerpo a Alemão, Dunga y Ricardo Rocha en 25 metros, y mete pase en profundidad al hueco. Caniggia gana el mano a mano a Taffarel superándolo por la izquierda y define a puerta vacía. 1-0 definitivo. Argentina a cuartos eliminando a la favorita.',
      youtubeSearch: 'Maradona asistencia Caniggia gol Argentina Brasil 1990',
    },
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
    controversies: [
      { title: 'El Mundial más aburrido', text: '2,21 goles por partido — mínimo histórico. El pase atrás al portero todavía era legal y Alemania, Argentina e Inglaterra lo usaron con descaro. FIFA cambió la regla en 1992 por culpa de este torneo.' },
      { title: 'El penal fantasma de Brehme', text: 'Final Argentina-Alemania: Rudi Völler cae en el área por un roce mínimo de Sensini al minuto 85. El árbitro Edgardo Codesal (mexicano) pita penal. Brehme marca. Maradona, en rueda de prensa, le dijo al árbitro "hijo de la gran puta" en directo. Sigue discutido.' },
      { title: 'Dos expulsados argentinos', text: 'Mismo partido, Monzón y Dezotti expulsados. Argentina acaba la final con 9 hombres. Primera vez que un equipo es expulsado en una final.' },
    ],
    nostalgia: [
      { title: '"Notti Magiche"', text: 'El himno Nannini-Bennato es el recuerdo sonoro que ata a los niños de los 80/90 al fútbol. "Notti magiche / inseguendo un gol / sotto il cielo / di un\'estate italiana". Se oye todavía en cada homenaje noventero italiano.' },
      { title: '"Nessun Dorma" y la BBC', text: 'Pavarotti cantando "Nessun dorma" para la BBC como sintonía. El himno de Puccini se asocia para siempre con el fútbol en Reino Unido. El disco de Los 3 Tenores se vendió 14 millones de copias — récord de clásica.' },
      { title: 'Schillaci, "occhi di pazzo"', text: 'Totò Schillaci — siciliano, suplente, 6 goles, bota de oro. Sus ojos desorbitados cada vez que marcaba son ICON de aquel verano. Italia lo perdió hace 1 año (2024) y el país lloró.' },
      { title: 'Roger Milla baila', text: 'El camerunés de 38 años marcaba goles y corría al banderín del córner a bailar makossa. Primera celebración coreografiada viralizada. Camerún en cuartos, insólito.' },
      { title: 'Gazza llora', text: 'Inglaterra-Alemania SF: Paul Gascoigne ve amarilla que le hubiera hecho perderse la final. Llora desconsolado. Gary Lineker mira al banquillo y hace el gesto "ojo al chico". La foto recorre el mundo y lanza el renacer del fútbol inglés moderno.' },
    ],
    trivia: [
      'Ciao, la mascota: un stick-man de cubos tricolores. La mascota más minimalista de la historia.',
      'Schillaci: bota de oro sin haber sido titular al principio.',
      'Yugoslavia jugó su último Mundial como tal — 2 años después empezaría la guerra.',
    ],
  },

  {
    year: 1994,
    bestGoal: {
      title: 'El Maradona árabe',
      scorer: 'Saeed Al-Owairan',
      team: 'KSA',
      against: 'BEL',
      stage: 'Grupos',
      minute: "5'",
      description:
        'Al-Owairan recibe en su campo, se lleva por delante a 5 belgas (Van der Elst dos veces), atraviesa 70 metros sin que nadie le toque y define solo ante Preud\'homme. Arabia Saudí gana 1-0 y pasa por primera vez en su historia a octavos. El único gol mundialista comparable al Gol del Siglo de Maradona.',
      youtubeSearch: 'Al Owairan gol Arabia Belgica 1994 Maradona arabe',
    },
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
    controversies: [
      { title: '"Me cortaron las piernas"', text: 'Maradona da positivo por efedrina tras Argentina 2-1 Nigeria. Lo acompaña una enfermera a orinar del césped a la cabina, imagen icónica. Expulsado del torneo, se despide con "me cortaron las piernas". Argentina cae en octavos sin él.' },
      { title: 'Andrés Escobar, asesinado en Medellín', text: 'El defensor colombiano se marca un autogol contra EEUU en fase de grupos. Diez días después de regresar, es asesinado a balazos en el parking de una discoteca de Medellín. Humberto Castro Muñoz, su asesino, dispara 6 tiros gritando "¡gol, gol, gol!" a cada uno. Cumple 11 años de cárcel.' },
      { title: 'Leonardo codazo a Tab Ramos', text: 'Brasil-USA octavos: Leonardo le da un codazo brutal a Ramos que le fractura el cráneo en 3 lugares. FIFA le sanciona 4 partidos. El brasileño se perdió el resto del Mundial.' },
    ],
    nostalgia: [
      { title: 'Baggio mira al cielo', text: 'La imagen del Divino Codino de espaldas, cabeza agachada, tras fallar el penal decisivo. La final 0-0 es criticada pero la secuencia final resume todo: Baresi falla, Massaro falla, Baggio tira arriba. Brasil 3-2. Baggio: "Sigue siendo mi peor pesadilla".' },
      { title: 'Bebeto mece al bebé', text: 'Brasil-Holanda cuartos. Bebeto marca y corre a la banda simulando mecer a un bebé —su hijo había nacido 2 días antes—. Romário y Mazinho se suman. Celebración replicada en patios escolares durante 30 años.' },
      { title: 'El sol de Chicago, Dallas, Orlando', text: 'Mediodía, 40°C, humedad brutal. Los jugadores caían como moscas. Brasil-Holanda 3-2 en Dallas bajo temperaturas brutales. FIFA atendía al prime time europeo: 3am en Tokio, las 12 del mediodía en Texas.' },
      { title: 'El peinado de Valderrama', text: 'Carlos "El Pibe" Valderrama y su melena rubia encrespada como icono noventero. Pelo, cintas de colores, postal que quedó grabada. Colombia se fue en primera ronda, él sigue siendo recuerdo eterno.' },
      { title: 'USA 94 y el nacimiento de la MLS', text: 'Dos años después nace la Major League Soccer como condición de FIFA a EE.UU. para albergar el torneo. David Beckham llegó 13 años después y popularizó el fútbol en América como nunca.' },
    ],
    trivia: [
      'Oleg Salenko (Rusia) marca 5 goles a Camerún — única vez en un Mundial. En toda su carrera marcó 40.',
      'Récord de asistencia por partido: 68.991. En 2026 (48 equipos) podría superarse.',
      'Primera final de la historia sin goles en 120 minutos.',
    ],
  },

  {
    year: 1998,
    anthem: {
      title: 'La Copa de la Vida',
      artist: 'Ricky Martin',
      youtubeId: 'pmU_xF4yWmY',
    },
    bestGoal: {
      title: 'Tres toques perfectos',
      scorer: 'Dennis Bergkamp',
      team: 'NED',
      against: 'ARG',
      stage: 'Cuartos',
      minute: "89'",
      description:
        'Pase largo de 60 metros de Frank de Boer. Bergkamp lo controla con el exterior del pie derecho, lo desvía con el mismo pie para pasar a Ayala y, antes de que el balón toque el suelo, lo remata de volea también con la derecha al palo lejano. Tres toques con la misma pierna en cuatro segundos. Jack van Gelder, narrando en la TV holandesa, pierde la cabeza con un "DENNIS BERGKAMP!" que se vuelve meme.',
      youtubeSearch: 'Bergkamp gol Holanda Argentina 1998 tres toques',
    },
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
    controversies: [
      { title: 'El caso Ronaldo', text: 'A 4 horas de la final, Ronaldo sufre una convulsión. Lo dejan fuera. Zagallo lo mete tarde bajo presión —se rumorea— de Nike (contrato de 400M con la CBF). R9 juega en trance, Brasil pierde 0-3. 25 años después siguen saliendo teorías. El propio Ronaldo: "Nunca sabré qué me pasó ese día".' },
      { title: 'Beckham expulsado por Simeone', text: 'Argentina-Inglaterra octavos. Simeone entra fuerte; Beckham, en el suelo, le da una patadita al aire. Roja directa. Inglaterra pierde en penales. Durante meses, efigies de Beckham se queman en pubs ingleses. Su imagen pública sólo se salvaría años después en el Madrid.' },
      { title: 'Iván Zamorano se pone el "+"', text: 'Sin anécdota polémica pero sí visual: Zamorano se puso el dorsal "1+8" al ceder el 9 a Salas. Único dorsal sumatorio de la historia.' },
    ],
    nostalgia: [
      { title: '"Go Go Go Ale Ale Ale"', text: 'Ricky Martin en Stade de France cantando "La Copa de la Vida" en la ceremonia de clausura. Primera vez que un latino lidera la banda sonora mundialista. Se convirtió en el himno latinoamericano de los 90 finales.' },
      { title: 'Zidane, el hijo de Argel', text: 'Hijo de padres cabileños, crecido en La Castellane (Marsella). En la final marca 2 goles de cabeza en 27 minutos. Campeón del mundo con Francia. El gesto de los Campos Elíseos con su cara proyectada en el Arco del Triunfo es la postal del 98.' },
      { title: 'Álbum Panini agotado', text: 'France 98 vende los álbumes más valiosos del coleccionismo. La figurita de Ronaldo, Batistuta o Zidane sigue siendo la más cotizada. Las tiendas españolas cerraban con "No hay sobres hasta el martes" escrito en los escaparates.' },
      { title: 'Owen, el chaval del 98', text: 'Michael Owen, 18 años, marca gol antológico contra Argentina desde medio campo. Esprint desde su propio campo hasta batir a Roa. Icono pop inglés instantáneo.' },
      { title: 'Footix y el gallo', text: 'El gallo azul con cresta roja en el pecho se convirtió en la mascota más exportada. Serie de dibujos animados, colonia, peluche, figuritas de M&M\'s. "Footix" sigue siendo término despectivo en francés para hincha oportunista.' },
    ],
    trivia: [
      'Primer Mundial con 32 equipos — formato que durará 28 años (hasta 2026).',
      'Laurent Blanc besaba la calva del portero Barthez antes de cada partido. Ritual famosísimo.',
      'Croacia debutó como país independiente (separada de Yugoslavia en 1991) y acabó 3º.',
    ],
  },

  {
    year: 2002,
    anthem: {
      title: 'Boom',
      artist: 'Anastacia',
      youtubeId: 'WdcuhpLedS8',
    },
    bestGoal: {
      title: '¿Lanzamiento o centro?',
      scorer: 'Ronaldinho',
      team: 'BRA',
      against: 'ENG',
      stage: 'Cuartos',
      minute: "50'",
      description:
        'Falta directa a 40 metros del área inglesa. Ronaldinho levanta el balón por encima de David Seaman, que está fuera de palos. Entra por el ángulo lejano. 2-1 para Brasil. "¿Lo tiraste o fue centro?" le preguntaron mil veces. Él siempre sonreía y nunca lo aclaró. Seaman se retiró meses después.',
      youtubeSearch: 'Ronaldinho falta gol Seaman Inglaterra 2002',
    },
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
    controversies: [
      { title: 'Byron Moreno y Al-Ghandour', text: 'Italia-Corea octavos: el ecuatoriano Byron Moreno anula un gol legal a Tommasi, no pita un penal clarísimo y expulsa a Totti. En cuartos, el egipcio Al-Ghandour anula DOS goles legales a España (Joaquín y Morientes). Ninguno volvió a arbitrar un Mundial. Italia y España siguen considerándolo el mayor atraco arbitral mundialista.' },
      { title: 'Francia, defensora sin goles', text: 'Zidane, lesionado en un amistoso contra Corea 4 días antes del Mundial, se pierde dos partidos. Francia, campeona y Balón de Oro (Zidane) y Bota de Oro (Henry), se va eliminada en primera ronda sin marcar ningún gol. La mayor debacle de un campeón defensor.' },
      { title: 'Rivaldo, simulación para el Oscar', text: 'Brasil-Turquía: Unsal le pega un pelotazo a Rivaldo en la pierna. Rivaldo se tira al suelo agarrándose la cara. Unsal, rojo. Primera multa FIFA por simular de la historia.' },
    ],
    nostalgia: [
      { title: '"Oh Necessary Oh"', text: 'El cántico de los "Red Devils" coreanos, 600.000 hinchas rojos en cada plaza, pintura roja en los rostros. Guus Hiddink como santo nacional. En Seúl la ciudad se paralizó durante semanas — parecía revolución pacífica.' },
      { title: 'El corte de pelo de Ronaldo', text: 'R9 se rasuró una "M" en la frente para desviar la atención de la enfermedad de su hijo —dijo después—. Doblete en la final contra Alemania. 8 goles totales. Redención absoluta tras la convulsión del 98.' },
      { title: 'Kahn en el área', text: 'Oliver Kahn, guante dorado, concede su único error del torneo en la final. Suelta el balón, Ronaldo marca. La foto de Kahn sentado en el poste con la cabeza baja, solo, es una de las más tristes del fútbol moderno.' },
      { title: 'Partidos a horarios infernales', text: 'En Europa: 8:30 y 13:30. Las aulas y oficinas se llenaron de radios. En Argentina y Brasil: 4am y 7am. Los niños iban al cole tras haber visto el partido al alba.' },
    ],
    trivia: [
      'Primer Mundial fuera de Europa/América.',
      'Turquía, semifinalista, no volvió a clasificarse a otro Mundial hasta... aún no lo ha conseguido.',
      'Único Mundial con dos países coorganizadores.',
      'Senegal eliminó al campeón Francia con un gol de Papa Bouba Diop (también fallecido joven, en 2020).',
    ],
  },

  {
    year: 2006,
    anthem: {
      title: 'The Time of Our Lives',
      artist: 'Il Divo & Toni Braxton',
      youtubeId: 'Xt5TGxnaBSc',
    },
    bestGoal: {
      title: 'La pierna cambiada de Maxi',
      scorer: 'Maxi Rodríguez',
      team: 'ARG',
      against: 'MEX',
      stage: 'Octavos',
      minute: "98'",
      description:
        'Octavos en prórroga, 1-1. Sorín centra desde la izquierda, Maxi espera el bote, controla con el pecho y remata de volea con pierna cambiada (zurda) al palo lejano superando a Sánchez. Clavado al ángulo. Maradona saltando en el palco como un pibe. Cada argentino recuerda dónde estaba ese instante.',
      youtubeSearch: 'Maxi Rodriguez gol Mexico octavos Mundial 2006',
    },
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
    controversies: [
      { title: '"Préférerais tua sorella"', text: 'Final Italia-Francia: Materazzi agarra la camiseta a Zidane; intercambian palabras. "Preferirei tua sorella" (lectura labial confirmada años después). Zidane le da un cabezazo en el pecho. Roja. Último partido de su carrera terminó con él caminando al vestuario junto a la Copa y sin mirarla.' },
      { title: '17 tarjetas en Portugal-Holanda', text: 'Arbitrado por el ruso Valentin Ivanov, el partido terminó con 16 amarillas y 4 rojas — récord mundialista. Sepp Blatter dijo: "Ivanov debería haberse mostrado una amarilla a sí mismo por no controlar el partido".' },
      { title: 'Calciopoli de fondo', text: 'Italia fue campeona mientras en Italia explotaba el escándalo Calciopoli (Juve, Milan, Lazio). Moggi, director de la Juve, había manipulado designaciones arbitrales. Cannavaro y Buffon venían de la Juve. El título se saboreó con gusto amargo.' },
      { title: 'El sobre FIFA', text: 'Años después (2015) saldría a la luz que Alemania pudo haber pagado 6,7M a FIFA para que le dieran la sede 2006. Beckenbauer imputado; falleció en 2024 con el caso sin resolver. El Sommermärchen tiene su sombra.' },
    ],
    nostalgia: [
      { title: 'Fan fests en la Puerta de Brandeburgo', text: 'Millones de alemanes tomaron las calles de Berlín sin miedo a mostrar la bandera. Primera vez desde la guerra que Alemania ondeó sus colores sin complejos. Un sommermärchen ("cuento de verano") romántico y pacífico.' },
      { title: '"The Sommermärchen" documental', text: 'Sönke Wortmann siguió a la selección alemana de Klinsmann con cámara fija y acceso total. La película es culto en Alemania. Lahm, Schweinsteiger, Klose, Podolski convertidos en ídolos pop.' },
      { title: 'Goleo VI, el león incómodo', text: 'La mascota más criticada: un león sin pantalones. Los alemanes nunca la aceptaron. La empresa juguetera NICI quebró por el fracaso de merchandising. Único caso de mascota que lleva a la empresa a la ruina.' },
      { title: 'Materazzi y la camiseta adidas', text: 'Materazzi agarrando la camiseta a Zidane quedó en millones de videojuegos, GIFs y parodias. "Head-butt Zidane" se convirtió en meme pre-meme en foros futboleros.' },
    ],
    trivia: [
      'Italia ganó la final por penales: Trezeguet (que marcó el Golden Goal en la Eurocopa 2000 contra Italia) falla. Revancha retardada.',
      'Último Mundial de Zidane y Figo — también último de Ronaldo (R9, 3 participaciones 1998/2002/2006).',
      'Portugal-Holanda: 4 rojas y 16 amarillas — récord absoluto.',
    ],
  },

  {
    year: 2010,
    anthem: {
      title: 'Waka Waka (This Time for Africa)',
      artist: 'Shakira & Freshlyground',
      youtubeId: 'pRpeEdMmmQ0',
    },
    bestGoal: {
      title: 'El gol "de três dedos"',
      scorer: 'Maicon',
      team: 'BRA',
      against: 'PRK',
      stage: 'Grupos',
      minute: "55'",
      description:
        'Maicon recibe en línea de fondo, con ángulo casi cerrado. Todos esperan el centro. El brasileño dispara con exterior del pie derecho ("três dedos"), el balón dibuja una parábola imposible y se cuela por el palo corto. Ri Myong-guk, el portero norcoreano, ni lo ve. "No lo intentó, le salió así" dijeron en Brasil — Maicon siempre juró que lo buscó.',
      youtubeSearch: 'Maicon gol Corea Norte tres dedos Mundial 2010',
    },
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
    controversies: [
      { title: 'La mano de Suárez', text: 'Uruguay-Ghana cuartos, prórroga, min 120. Ghana remata, el balón va a gol; Suárez lo saca con las dos manos. Roja directa, penal. Gyan lo falla. Uruguay gana por penales. Suárez celebra en el túnel "como gol". Africa entera se siente robada; Ghana era el último africano vivo en un Mundial africano.' },
      { title: 'Lampard y el gol fantasma', text: 'Alemania-Inglaterra octavos: Lampard golpea, el balón pega en el larguero y bota 1 metro dentro. El árbitro uruguayo Larrionda no da gol. Años después, Sepp Blatter admite que este partido empujó la goal-line technology (llegaría en 2014).' },
      { title: 'Vuvuzela o el infierno acústico', text: 'La trompeta sudafricana (120 dB, más que una motosierra) se convierte en el sonido del torneo. BBC y ESPN tuvieron que aplicar filtros acústicos. Pacientes con audífonos se los quitaban para ver partidos. FIFA estuvo a punto de prohibirlas.' },
    ],
    nostalgia: [
      { title: '"Dani Jarque, siempre con nosotros"', text: 'Iniesta marca el gol de la final y se quita la camiseta: debajo, mensaje al compañero español Dani Jarque, muerto 11 meses antes con 26 años. El manchego celebra llorando. Amarilla del árbitro pero icono eterno del fútbol español.' },
      { title: 'Paul el pulpo', text: 'El pulpo de Oberhausen (Alemania) acertó los 8 partidos que le consultaron, incluida la final. Muere meses después. Convertido en meme pre-memes, tuvo homenajes oficiales y un "funeral" televisado. Marruecos pidió pulpos suyos en el 2022.' },
      { title: '"Waka Waka" en cada boda', text: 'Shakira + Freshlyground crean el himno mundialista más reproducido de la historia — más de 3.500M de visitas en YouTube. El baile "Waka Waka" en cada verbena y boda del verano 2010 en el mundo entero.' },
      { title: 'Forlán, Bota de Oro sin título', text: 'Diego Forlán lidera a Uruguay al 4º puesto, su mejor resultado en 40 años. Balón de Oro del torneo. Sin copa, pero con respeto eterno de todo el continente latinoamericano.' },
      { title: '8 culés en el once', text: 'España gana con 8 jugadores del Barça en el once tipo (Piqué, Puyol, Busquets, Xavi, Iniesta, Pedro, Villa, también Fàbregas del Arsenal). Récord imposible de igualar.' },
    ],
    trivia: [
      'España es el primer campeón que comienza el Mundial perdiendo (0-1 contra Suiza en la primera jornada).',
      'Sudáfrica: único anfitrión eliminado en primera ronda hasta hoy.',
      'La final entre España y Holanda tuvo 14 amarillas, récord. Howard Webb (árbitro) admitió después haberse excedido.',
    ],
  },

  {
    year: 2014,
    anthem: {
      title: 'We Are One (Ole Ola)',
      artist: 'Pitbull, Jennifer Lopez & Claudia Leitte',
      youtubeId: 'TGtWWb9emYI',
    },
    bestGoal: {
      title: 'Control de pecho, media vuelta, volea al ángulo',
      scorer: 'James Rodríguez',
      team: 'COL',
      against: 'URU',
      stage: 'Octavos',
      minute: "28'",
      description:
        'Abel Aguilar cabecea hacia atrás desde el borde del área. James, de espaldas a la portería, controla con el pecho dentro del círculo, se gira en el aire y, antes de que el balón toque el suelo, lo remata de volea al ángulo izquierdo de Muslera. El balón pega en el larguero y entra. Premio Puskás 2014. Fichaje al Madrid 10 días después por 80 millones.',
      youtubeSearch: 'James Rodriguez gol Uruguay volea Puskas 2014',
    },
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
    controversies: [
      { title: 'El mordisco de Suárez a Chiellini', text: 'Uruguay-Italia primera ronda. Suárez muerde en el hombro a Chiellini — tercera vez que muerde en su carrera (Bakkal en el PSV, Ivanović en el Liverpool, Chiellini ahora). Sanción: 9 partidos y 4 meses. El uruguayo vio el partido siguiente por TV desde Barcelona recién fichado.' },
      { title: 'Protestas anti-Mundial', text: 'Brasil se llena de manifestaciones "Não vai ter Copa". Millones en las calles protestando por los 11.000M gastados en estadios mientras faltaban hospitales. El Mineirão, donde cayó el 1-7, fue símbolo del descontento.' },
      { title: 'El gol fantasma no-existente', text: 'Francia-Honduras: primer gol validado en la historia por goal-line technology. Karim Benzema marca, el balón pega en el larguero y rebota a manos del portero hondureño... que cae con el balón 15cm tras la línea. La tecnología lo captó.' },
    ],
    nostalgia: [
      { title: 'Mineirazo, la herida abierta', text: '"1-7" se convierte en insulto en Brasil. El Mineirão asiste al peor día de la historia canarinho. Thiago Silva y Neymar ausentes. David Luiz llorando. Julio César que todavía no supera. En 2026 hubo "retorno simbólico" — ganaron 2-0 y la prensa tituló "2-0 no borra el 1-7".' },
      { title: 'Mascherano salva a Argentina', text: 'SF Holanda-Argentina, último segundo de prórroga: Robben va a marcar, Mascherano se tira a la pierna derecha y saca el balón. En el vestuario: "Hoy te convertís en héroe, loco". Quedó inmortalizado en el fútbol argentino.' },
      { title: 'Fuleco armadillo', text: 'Mascota del armadillo de tres bandas, especie brasileña en peligro de extinción. Se vendieron millones de peluches pero su causa conservacionista quedó relegada — crítica de ambientalistas.' },
      { title: 'James Rodríguez entra al mundo', text: 'Vs Uruguay: control de pecho, media vuelta, remate de volea al ángulo. Mejor gol del Mundial. Los colombianos lo bailaron con ritmo vallenato por semanas. Fichaje al Real Madrid 10 días después por 80M.' },
    ],
    trivia: [
      'Klose (16) supera a Ronaldo (15) como máximo goleador histórico de Mundiales.',
      'Alemania es la primera selección europea que gana un Mundial en Sudamérica.',
      'Rojo, rojo: Argentina jugó con el rojo de visitante por primera vez desde 1993 — la final se jugó con su segunda equipación azul-oscura.',
    ],
  },

  {
    year: 2018,
    anthem: {
      title: 'Live It Up',
      artist: 'Nicky Jam, Will Smith & Era Istrefi',
      youtubeId: 'CGyEd0aKWZE',
    },
    bestGoal: {
      title: 'Pavard desempata desde la frontal',
      scorer: 'Benjamin Pavard',
      team: 'FRA',
      against: 'ARG',
      stage: 'Octavos',
      minute: "57'",
      description:
        'Argentina ganaba 2-1. Lucas Hernández centra por bajo desde la izquierda, el balón viene cruzado y Pavard, con 22 años, conecta volea de pierna cambiada (derecha) desde la frontal del área. El balón dibuja una parábola que se cuela por la escuadra lejana de Armani. 2-2. Francia gana 4-3 con Mbappé desatado. Premio Puskás 2018.',
      youtubeSearch: 'Pavard gol Argentina volea Puskas 2018',
    },
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
    controversies: [
      { title: 'Boicot diplomático a Rusia', text: 'Muchos líderes occidentales no asistieron por el envenenamiento del exespía Sergei Skripal (Salisbury, marzo 2018). Theresa May no viajó, Trump sí. Macron sólo fue a la final — y acabó en la foto bajo la lluvia besando la copa con Putin al lado.' },
      { title: '20 penales pitados por el VAR', text: 'Récord histórico. El VAR debutó y multiplicó los penales. Cristiano vs España: 3-3, penal señalado por el VAR. Francia-Australia primer gol validado por VAR. Croacia sintió que varios penales concedidos a Francia fueron dudosos — incluida el del 2-1 en la final.' },
      { title: 'Dopaje de estado ruso', text: 'Tras el informe McLaren (Sochi 2014) se destapó el dopaje estatal ruso. Sin embargo, los futbolistas rusos no fueron investigados; jugaron con normalidad. La selección anfitriona llegó a cuartos como milagro deportivo — sombra inevitable.' },
    ],
    nostalgia: [
      { title: '"It\'s coming home"', text: 'Inglaterra en semifinal 28 años después. El himno de 1996 vuelve viral. Calvos, pintas y "It\'s coming home" en cada pub y cada bar de Magaluf. Pierden contra Croacia en prórroga. El meme quedó para siempre — todavía se usa cada vez que algo NO pasa.' },
      { title: 'Modrić en el lodo', text: 'Croacia jugó 3 prórrogas en fase eliminatoria (Dinamarca, Rusia, Inglaterra). Modrić, 33 años, jugó todas. Llegó a la final agotado — perdieron 2-4 con Francia. Balón de Oro del torneo. Nadie ha vuelto a aguantar una carga tan brutal.' },
      { title: 'Francia multicultural', text: 'Gol al francés Umtiti (hijo de cameruneses), Mbappé (camerunés-argelino), Kanté (mali), Pogba (guineano)... La celebración del Arco del Triunfo se sintió victoria de la banlieue. Debates culturales en Europa.' },
      { title: 'Zabivaka y Moscú', text: 'El lobo con gafas de aviador inmortalizó la calidez rusa del torneo. Fan fests en la Plaza Roja; murales en cada estación del metro. Moscú quedó para muchos occidentales como ciudad amable — 3,5 años antes de la invasión a Ucrania.' },
    ],
    trivia: [
      'Alemania, vigente, eliminada en fase de grupos — primera vez desde 1938.',
      'Mbappé, 19 años: segundo adolescente en marcar en una final de un Mundial (el primero fue Pelé, 1958).',
      'Panamá debutó; Arabia Saudí perdió 0-5 con Rusia en el inaugural.',
    ],
  },

  {
    year: 2022,
    anthem: {
      title: 'Hayya Hayya (Better Together)',
      artist: 'Trinidad Cardona, Davido & AISHA',
      youtubeId: 'Tx6_14yezXU',
    },
    bestGoal: {
      title: 'La chilena de Richarlison',
      scorer: 'Richarlison',
      team: 'BRA',
      against: 'SRB',
      stage: 'Grupos',
      minute: "73'",
      description:
        'Vinicius Jr. centra desde la izquierda, Richarlison controla con el pecho de espaldas a la portería, deja botar el balón, salta y remata de chilena sobre su propio cuerpo. Entra pegado al palo izquierdo. El "Pombo" haciendo de Pelé en Lusail. Premio Puskás 2022.',
      youtubeSearch: 'Richarlison chilena gol Serbia Puskas 2022',
    },
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
    controversies: [
      { title: 'Qatargate y los 6.500 muertos', text: 'Según The Guardian, 6.500 trabajadores migrantes murieron en obras desde 2010. Qatar cuestionó los datos. FIFA no los investigó. El torneo se celebró bajo escrutinio ético permanente — el recuerdo queda con esa mancha estructural.' },
      { title: 'Brazalete arcoíris prohibido', text: 'FIFA amenazó con amarilla a capitanes que llevaran el brazalete "OneLove". Inglaterra, Alemania, Bélgica y otros 6 se plegaron. La selección alemana se tapó la boca en la foto oficial en protesta — perdieron con Japón el mismo día, titulares dijeron que fue "karma".' },
      { title: 'La final más espectacular... con polémica', text: 'Di María cae al suelo en el 21\' y se pita penal que algunos discuten. Mbappé convierte tres goles. Argentina gana 4-2 en penales. Tras el pitazo final, Kolo Muani falló mano a mano y el Martínez tapó. La "Dibu" celebra el Globo de Oro con gesto obsceno — FIFA multa pero no le quita el premio.' },
      { title: 'Corrupción FIFA (Qatargate europeo)', text: 'En diciembre de 2022, mientras se jugaba el Mundial, la policía belga detuvo a la eurodiputada Eva Kaili y otros por sobornos de Qatar. Tres dirigentes marroquíes cayeron también. El Mundial se vivió con ese telón de fondo de sobornos institucionales.' },
    ],
    nostalgia: [
      { title: '"Muchaaaachos, ahora nos volvimo\' a ilusionar"', text: 'El hit de La Mosca Tsé-Tsé versionado por Fernando Romero se convirtió en himno argentino absoluto. Se cantó en Doha, Buenos Aires y en cualquier esquina del mundo. Millones escucharon la canción una vez al día durante meses.' },
      { title: 'Messi besa la copa', text: 'Diego Maradona murió en noviembre 2020. Messi gana 36 años después del último título (1986). En la entrega, alzó la Copa mientras Qatar le ponía un "bisht" (túnica árabe) — fotografía más vista del año 2022. Premio a Balón de Oro del torneo.' },
      { title: 'Scaloneta y la figurita de Messi', text: 'El álbum Panini 2022 se agotó en Argentina 2 días antes de la inauguración del Mundial. La figurita de Messi se rematé por reventa a 35.000 pesos. Todos querían el "cromo del capitán".' },
      { title: 'Marruecos en semis', text: 'Primer país africano/árabe en llegar a semifinales. Tras cada victoria, jugadores abrazaban a sus madres en el campo. Bandera palestina en cada celebración. Escena que marcó al mundo árabe para una generación.' },
      { title: '"Dibu" Martínez', text: 'Emiliano "Dibu" Martínez atajó el mano a mano final de Kolo Muani y dos penales en la tanda. Provocaba a los rivales con gestos inmortales. Personaje mitificado en Argentina — "al dibu no le gana nadie".' },
    ],
    trivia: [
      'Primer Mundial en noviembre-diciembre. El clima (40° en junio) obligó.',
      'Messi superó a Pelé en goles mundialistas (13 vs 12) y alcanzó a Maradona en copas ganadas (1-1).',
      'Arabia Saudí ganó un único partido del torneo: contra Argentina, la campeona.',
      'Estadio 974: desmontable, hecho con 974 contenedores (número del prefijo internacional de Qatar). Ya no existe.',
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
    controversies: [
      { title: 'Inflación del formato', text: '48 equipos, 104 partidos, más de 40 días. Críticos acusan a FIFA de sacrificar calidad por ingresos. Los clubes europeos amenazan con no liberar jugadores a futuros torneos.' },
      { title: 'Distancias continentales', text: 'De Vancouver a Monterrey son 4.000 km; de Monterrey a Miami otros 2.400. Algunas selecciones de Grupo recorren más kilómetros que de Londres a Tokio. La huella de carbono del Mundial más "grande" de la historia.' },
      { title: 'Entradas más caras de la historia', text: 'Boleto más barato de la final: ~$2.000. Entrada de fase de grupos más barata: $60. FIFA criticada por elitización. Los estadios se llenarán de corporativos americanos, no de aficionados del fútbol-país.' },
    ],
    nostalgia: [
      { title: 'El Azteca, el templo', text: 'Único estadio en albergar 3 Mundiales (1970, 1986, 2026). Donde Pelé levantó la copa por tercera vez y donde Maradona firmó el Gol del Siglo. Vuelve con 83.000 asientos y la mística intacta — "Cuauhtémoc" para los mexicanos.' },
      { title: '¿La última de Messi?', text: 'El argentino tendría 39 años cumplidos. Declaró "probablemente no" pero la Scaloneta lo necesita. Cristiano, 41, también quiere jugar. Nunca dos "eras" se habían despedido en el mismo Mundial.' },
      { title: 'USA/México/Canadá', text: 'Continente americano unido por primera vez. 6 ciudades americanas, 3 mexicanas, 2 canadienses. Retro y moderno: Azteca y SoFi Stadium (Los Ángeles, donde se juega la Super Bowl).' },
    ],
    trivia: [
      '104 partidos totales — récord absoluto.',
      'México inaugura el 11 de junio de 2026 en el Azteca; final en MetLife Stadium (Nueva Jersey) el 19 de julio.',
      'Tres mascotas — una por país: Zayu (jaguar MEX), Clutch (águila USA), Maik (alce CAN).',
      'Toronto estreno como sede Mundial. Atlanta y Miami también.',
    ],
  },
];

export function getStory(year: number): TournamentStory | undefined {
  return STORIES.find((s) => s.year === year);
}

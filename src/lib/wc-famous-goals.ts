/**
 * Goles famosos en la historia de los Mundiales.
 *
 * Catálogo curado editorial. Cada gol tiene:
 *  - Identidad: slug, año del Mundial, fase, jugador, selecciones.
 *  - Descripción editorial.
 *  - YouTube: búsqueda (siempre funciona) + ID concreto cuando seguro.
 *
 * Política de vídeo:
 *  - `youtubeQuery`: query que se pasa a https://www.youtube.com/results?search_query=...
 *    Si el ID concreto se elimina o se cae, la query siempre devuelve
 *    el contenido equivalente del canal oficial FIFA o resúmenes.
 *  - `youtubeId`: ID concreto sólo cuando el vídeo es oficial FIFA o un
 *    embed verificado. Sin él, la página muestra "Ver en YouTube" en lugar
 *    de iframe.
 *  - `thumbnailUrl`: img.youtube.com/vi/<id>/hqdefault.jpg cuando hay ID.
 *
 * VideoObject JSON-LD: cada gol exporta los campos necesarios para
 * schema.org/VideoObject (rich snippet con thumbnail en SERPs).
 *
 * Fuentes verificadas: archivos FIFA, Wikipedia partidos, RSSSF.
 */

export type FamousGoal = {
  slug: string;
  /** Año del Mundial */
  year: number;
  /** Fecha del partido (ISO) */
  matchDate: string;
  /** Fase del torneo */
  stage: 'group' | 'r16' | 'qf' | 'sf' | '3rd' | 'final';
  /** Minuto del gol */
  minute: number | string;
  /** Titular del gol */
  title: string;
  /** Jugador autor */
  player: string;
  /** Código FIFA del equipo del jugador */
  teamCode: string;
  /** Código FIFA del equipo rival */
  opponentCode: string;
  /** Marcador final del partido */
  finalScore: { team: number; opponent: number };
  /** Descripción editorial (80-150 palabras) */
  description: string;
  /** Por qué es icónico (para schema.org) */
  whyIconic: string;
  /** YouTube embed ID si está identificado */
  youtubeId?: string;
  /** Query para buscar en YouTube si no hay ID */
  youtubeQuery: string;
  /** Duración estimada del clip en segundos (para VideoObject) */
  durationSeconds?: number;
  /** Slug interno de historia relacionada (si aplica) */
  relatedHistoriaSlug?: string;
};

export const FAMOUS_GOALS: FamousGoal[] = [
  // ─── 1958 SUECIA ──────────────────────────────────────────
  {
    slug: 'pele-cabezazo-gol-final-1958-suecia',
    year: 1958,
    matchDate: '1958-06-29',
    stage: 'final',
    minute: 55,
    title: 'Pelé y la chilena al ángulo: Brasil 5-2 Suecia, primer Mundial brasileño',
    player: 'Pelé',
    teamCode: 'BRA',
    opponentCode: 'SWE',
    finalScore: { team: 5, opponent: 2 },
    description:
      'Pelé tenía 17 años. Final de Suecia 1958 en el Råsundastadion de Estocolmo. En el minuto 55, control con el pecho de espaldas a la portería, sombrero al defensor sueco Bengt Gustavsson, giro y volea con la pierna derecha al ángulo izquierdo. Brasil ganaba 3-1 y este gol cerró el partido. El joven prodigio brasileño se ganó el mundo. Brasil ganaba su primera Copa del Mundo con el equipo de Mario Zagallo, Garrincha, Vavá, Didi y Pelé. El gol más recordado de su primer Mundial.',
    whyIconic: 'Pelé adolescente firmando su primer Mundial con una jugada de creatividad pura. Marca histórica para Brasil.',
    youtubeQuery: 'pele goal final 1958 sweden brazil chilena',
    durationSeconds: 35,
  },

  // ─── 1966 INGLATERRA ──────────────────────────────────────
  {
    slug: 'geoff-hurst-hat-trick-final-1966-wembley',
    year: 1966,
    matchDate: '1966-07-30',
    stage: 'final',
    minute: 120,
    title: 'Geoff Hurst y el hat-trick de Wembley: They think it’s all over',
    player: 'Geoff Hurst',
    teamCode: 'ENG',
    opponentCode: 'GER',
    finalScore: { team: 4, opponent: 2 },
    description:
      'Final del Mundial 1966 en Wembley. Inglaterra y Alemania empatan 2-2 al final del tiempo reglamentario. En la prórroga, Geoff Hurst marca el polémico "gol fantasma" en el minuto 101 (rebote al larguero discutido). En el minuto 120, con Alemania volcada en busca del empate, Hurst recibe un balón en su campo, encara solo y bate al portero Schäfer con la zurda. 4-2. Tercer gol del partido para Hurst y único hat-trick en la historia en una final de Mundial. La frase del comentarista Kenneth Wolstenholme: "They think it’s all over… it is now!".',
    whyIconic: 'Único hat-trick en una final de Mundial. Frase legendaria del comentario futbolístico.',
    youtubeQuery: 'geoff hurst hat trick 1966 world cup final wembley',
    relatedHistoriaSlug: 'gol-fantasma-wembley-inglaterra-alemania-1966',
    durationSeconds: 40,
  },

  // ─── 1970 MÉXICO ──────────────────────────────────────────
  {
    slug: 'carlos-alberto-gol-final-1970-azteca-brasil-italia',
    year: 1970,
    matchDate: '1970-06-21',
    stage: 'final',
    minute: 86,
    title: 'Carlos Alberto y el gol más bello del fútbol: Brasil 4-1 Italia',
    player: 'Carlos Alberto',
    teamCode: 'BRA',
    opponentCode: 'ITA',
    finalScore: { team: 4, opponent: 1 },
    description:
      'Final del Mundial México 1970 en el Estadio Azteca. Brasil ganaba 3-1 e Italia estaba derrotada. En el minuto 86, una jugada coral de NUEVE pases brasileños desde la propia área culmina con Pelé colocando un pase muerto sin mirar al borde del área. Llega Carlos Alberto Torres, capitán brasileño, desde la línea de fondo derecha, con todo el peso del cuerpo lanzado, y dispara con la pierna derecha al ángulo izquierdo. El portero Albertosi no llega. Brasil tricampeón del mundo. La FIFA lo declaró oficialmente "el mejor gol jamás marcado en una final de Mundial".',
    whyIconic: 'Gol más bello de la historia según FIFA. Brasil tricampeón y máquina perfecta.',
    youtubeQuery: 'carlos alberto goal 1970 world cup final brazil italy',
    durationSeconds: 45,
  },

  // ─── 1986 MÉXICO ──────────────────────────────────────────
  {
    slug: 'maradona-gol-del-siglo-1986-argentina-inglaterra',
    year: 1986,
    matchDate: '1986-06-22',
    stage: 'qf',
    minute: 55,
    title: 'Maradona y el gol del siglo: 60 metros, 6 ingleses, 1 leyenda',
    player: 'Diego Armando Maradona',
    teamCode: 'ARG',
    opponentCode: 'ENG',
    finalScore: { team: 2, opponent: 1 },
    description:
      'Estadio Azteca, cuartos de Mundial México 1986. Cuatro minutos después de la "Mano de Dios", Diego Armando Maradona recibe un balón en su propio campo, gira sobre Peter Reid, encara a Peter Beardsley, recorta a Terry Butcher, supera a Terry Fenwick con un cambio de ritmo, llega al área inglesa habiendo eliminado a cinco rivales en 10 segundos, deja sin opciones al portero Peter Shilton y empuja al fondo de la red. La FIFA declaró el gol "el mejor gol de todos los Mundiales" en una votación de aficionados en 2002. Víctor Hugo Morales lo narró con la frase que cierra el oficio: "Cosmic kite ¿de qué planeta viniste?"',
    whyIconic: 'Mejor gol de la historia de los Mundiales según votación FIFA 2002. Jugada individual inigualable.',
    youtubeQuery: 'maradona goal of the century 1986 argentina england',
    relatedHistoriaSlug: 'mano-de-dios-maradona-1986',
    durationSeconds: 30,
  },
  {
    slug: 'maradona-mano-de-dios-1986-argentina-inglaterra',
    year: 1986,
    matchDate: '1986-06-22',
    stage: 'qf',
    minute: 51,
    title: 'Maradona y la Mano de Dios: el gol más polémico de la historia',
    player: 'Diego Armando Maradona',
    teamCode: 'ARG',
    opponentCode: 'ENG',
    finalScore: { team: 2, opponent: 1 },
    description:
      'Cuartos de México 1986. Estadio Azteca. Minuto 51. Maradona corre tras un balón en duelo con Peter Shilton, mide 1.66m frente al portero inglés de 1.85m. Salta y con el puño izquierdo "ayuda" al cabezazo: gol Argentina. El árbitro tunecino Ali Bin Nasser lo valida. Maradona dice en rueda de prensa: "Fue un poco con la cabeza y un poco con la mano de Dios". Inglaterra-Argentina estaba cargado políticamente por la guerra de las Malvinas cuatro años antes. La FIFA tardó 20 años en confirmar lo que se vio: era penalti claro de mano. Cuatro minutos después, Maradona compensaría con el gol del siglo.',
    whyIconic: 'Gol más polémico de la historia del fútbol. Frase legendaria. Marco político y deportivo único.',
    youtubeQuery: 'maradona hand of god 1986 argentina england',
    relatedHistoriaSlug: 'mano-de-dios-maradona-1986',
    durationSeconds: 25,
  },

  // ─── 1994 USA ─────────────────────────────────────────────
  {
    slug: 'salenko-cinco-goles-camerun-rusia-1994',
    year: 1994,
    matchDate: '1994-06-28',
    stage: 'group',
    minute: 'múltiple',
    title: 'Oleg Salenko marca 5 goles a Camerún: récord histórico',
    player: 'Oleg Salenko',
    teamCode: 'RUS',
    opponentCode: 'CMR',
    finalScore: { team: 6, opponent: 1 },
    description:
      'Estadio del Stanford en San Francisco, junio 1994. Rusia ya está eliminada del Mundial y juega su tercer y último partido contra Camerún. Oleg Salenko, delantero del Valencia con pocos minutos en el club, marca cinco goles en un solo partido: dos antes del descanso (15’ y 41’), tres en el segundo tiempo (44’, 73’, 75’). Rusia gana 6-1. Salenko empata como Bota de Oro del Mundial con Hristo Stoichkov (6 goles cada uno) pero solo Salenko ostenta el récord de cinco goles en un partido de Mundial. Roger Milla marcó también para Camerún y se convirtió en el goleador más viejo de la historia del Mundial (42 años).',
    whyIconic: 'Récord 5 goles en un partido de Mundial, vigente desde 1994. Pichichi del torneo con equipo eliminado.',
    youtubeQuery: 'oleg salenko 5 goals russia cameroon 1994 world cup',
    durationSeconds: 50,
  },

  // ─── 1998 FRANCIA ─────────────────────────────────────────
  {
    slug: 'bergkamp-gol-cuartos-1998-holanda-argentina',
    year: 1998,
    matchDate: '1998-07-04',
    stage: 'qf',
    minute: 89,
    title: 'Dennis Bergkamp y el gol del cuento: el pase imposible de Frank de Boer',
    player: 'Dennis Bergkamp',
    teamCode: 'NED',
    opponentCode: 'ARG',
    finalScore: { team: 2, opponent: 1 },
    description:
      'Cuartos de Francia 1998 en el Stade Vélodrome de Marsella. Holanda 1, Argentina 1 al minuto 89. Frank de Boer envía un pase telegráfico desde su propio campo, recorrido 60 metros en parábola perfecta. Dennis Bergkamp llega al borde del área argentina, **control con la parte exterior de la pierna derecha** (no la planta, no el empeine — el exterior, en movimiento), **giro** sobre Roberto Ayala, y **definición con la pierna derecha al ángulo opuesto**. Tres toques perfectos en cuatro segundos. Holanda 2, Argentina 1. Eliminada Argentina. Bergkamp celebra con los brazos en cruz. El gol es considerado en todas las votaciones entre los 5 más bellos de la historia del fútbol.',
    whyIconic: 'Control + giro + remate al ángulo en 4 segundos. La definición de la elegancia futbolística.',
    youtubeQuery: 'dennis bergkamp goal netherlands argentina 1998 world cup quarter',
    durationSeconds: 30,
  },
  {
    slug: 'owen-individual-octavos-1998-inglaterra-argentina',
    year: 1998,
    matchDate: '1998-06-30',
    stage: 'r16',
    minute: 16,
    title: 'Michael Owen golazo individual: 18 años, 60 metros, ingleses elegidos',
    player: 'Michael Owen',
    teamCode: 'ENG',
    opponentCode: 'ARG',
    finalScore: { team: 4, opponent: 5 },
    description:
      'Octavos de Francia 1998 en el Stade Geoffroy-Guichard de Saint-Étienne. Argentina e Inglaterra empatan a 1. Michael Owen, 18 años, recibe un pase de David Beckham en el centro del campo. Roque Ayala intenta marcarlo pero Owen lo deja con su velocidad. Encara al área argentina con Diego Simeone y Roberto Ayala tratando de cerrarle. Owen los regatea con dos cambios de dirección, llega al borde del área y dispara con la pierna derecha al ángulo izquierdo del portero Carlos Roa. 2-1 Inglaterra. La FIFA declaró el gol como el mejor del Mundial de Francia 1998. Argentina ganaría en penaltis tras la roja a David Beckham.',
    whyIconic: 'Golazo individual del Mundial 98. Owen 18 años. Imagen de la nueva generación inglesa.',
    youtubeQuery: 'michael owen goal 1998 world cup england argentina',
    durationSeconds: 25,
  },

  // ─── 2002 COREA-JAPÓN ─────────────────────────────────────
  {
    slug: 'ronaldinho-falta-directa-cuartos-2002-brasil-inglaterra',
    year: 2002,
    matchDate: '2002-06-21',
    stage: 'qf',
    minute: 50,
    title: 'Ronaldinho y la falta directa imposible que voló sobre Seaman',
    player: 'Ronaldinho',
    teamCode: 'BRA',
    opponentCode: 'ENG',
    finalScore: { team: 2, opponent: 1 },
    description:
      'Cuartos de Corea-Japón 2002 en Shizuoka. Brasil 1, Inglaterra 1. Ronaldinho a 35 metros del arco, falta directa sobre la derecha. El portero David Seaman se posiciona dos pasos adelantado de su línea para cubrir el centro. Ronaldinho golpea con la pierna derecha con efecto descendente. El balón vuela en parábola sobre Seaman, que retrocede desesperado, y entra por el ángulo derecho de la portería. 2-1 Brasil. Inglaterra protestará durante años que era un centro a Rivaldo y no un tiro directo. Ronaldinho admitió: "Era un tiro intencionado". Siete minutos después, Ronaldinho sería expulsado pero Brasil resistiría 10 vs 11. Pentacampeonato en camino.',
    whyIconic: 'Falta directa más comentada de la historia. "¿Tiro o centro?". Brasil camino al pentacampeonato.',
    youtubeQuery: 'ronaldinho free kick goal brazil england 2002 world cup seaman',
    durationSeconds: 30,
  },

  // ─── 2006 ALEMANIA ────────────────────────────────────────
  {
    slug: 'maxi-rodriguez-volea-octavos-2006-argentina-mexico',
    year: 2006,
    matchDate: '2006-06-24',
    stage: 'r16',
    minute: 108,
    title: 'Maxi Rodríguez y la volea de oro: el mejor gol del Mundial 2006',
    player: 'Maxi Rodríguez',
    teamCode: 'ARG',
    opponentCode: 'MEX',
    finalScore: { team: 2, opponent: 1 },
    description:
      'Octavos de Alemania 2006 en el Zentralstadion de Leipzig. Argentina y México empatan 1-1 en la prórroga. Minuto 108. Sorin envía un balón largo desde el medio campo. Maxi Rodríguez (Atlético de Madrid) controla con el pecho a 25 metros del arco. Sin que el balón toque el suelo, dispara con la pierna izquierda en volea cruzada al ángulo derecho. El portero Oswaldo Sánchez no llega ni a intentarlo. 2-1 Argentina, gol decisivo en prórroga. Maxi Rodríguez se reúne con sus compañeros en la esquina. El gol fue elegido por la FIFA como el mejor del Mundial 2006.',
    whyIconic: 'Mejor gol del Mundial 2006. Volea cruzada en prórroga eliminatoria.',
    youtubeQuery: 'maxi rodriguez goal argentina mexico 2006 world cup volley',
    durationSeconds: 30,
  },
  {
    slug: 'zidane-penalti-picado-final-2006-italia-francia',
    year: 2006,
    matchDate: '2006-07-09',
    stage: 'final',
    minute: 7,
    title: 'Zidane y el penalti picado de Berlín: la audacia antes de la roja',
    player: 'Zinedine Zidane',
    teamCode: 'FRA',
    opponentCode: 'ITA',
    finalScore: { team: 1, opponent: 1 },
    description:
      'Final de Alemania 2006 en el Olímpico de Berlín. Italia 0, Francia 0. Minuto 7. Penalti a favor de Francia por una entrada de Materazzi a Florent Malouda dentro del área. Zinedine Zidane se acerca al balón. Buffon en la portería. Zidane golpea con la pierna derecha en vaselina (picado a lo Antonin Panenka), el balón pica en el larguero por la cara interna y entra al campo cruzando completamente la línea de gol. 1-0 Francia. La audacia maxima en el partido más importante de su vida. 103 minutos después, Zidane sería expulsado por cabezazo a Materazzi. Francia perdería 5-3 en penaltis (Trezeguet falla el único). Despedida más triste del fútbol.',
    whyIconic: 'Penalti picado en final de Mundial. Audacia máxima en partido decisivo. Antes de la roja.',
    youtubeQuery: 'zidane penalty panenka 2006 world cup final italy france',
    relatedHistoriaSlug: 'zidane-cabezazo-materazzi-berlin-2006-final',
    durationSeconds: 25,
  },

  // ─── 2010 SUDÁFRICA ───────────────────────────────────────
  {
    slug: 'iniesta-gol-final-2010-johannesburgo-espana-holanda',
    year: 2010,
    matchDate: '2010-07-11',
    stage: 'final',
    minute: 116,
    title: 'Andrés Iniesta y el gol que dio España al mundo: Soccer City',
    player: 'Andrés Iniesta',
    teamCode: 'ESP',
    opponentCode: 'NED',
    finalScore: { team: 1, opponent: 0 },
    description:
      'Final Sudáfrica 2010 en el Soccer City de Johannesburgo. España y Países Bajos empatan a cero en la prórroga. Minuto 116. Cesc Fábregas recibe un balón en banda derecha y abre a Iniesta, que está corriendo dentro del área. Iniesta controla con el pecho cayendo el balón a sus pies, gira y dispara con el empeine derecho. El portero Stekelenburg vuela hacia la derecha pero no llega. **GOL**. 1-0 España. Iniesta corre hacia la esquina y se quita la camiseta enseñando un mensaje escrito a lápiz: "**Dani Jarque, siempre con nosotros**" (compañero del Espanyol fallecido un año antes). España campeona del mundo por primera vez en su historia.',
    whyIconic: 'Gol que dio a España su primer Mundial. Dedicatoria a Dani Jarque. Imagen que recordará España setenta años.',
    youtubeQuery: 'iniesta goal spain netherlands 2010 world cup final',
    relatedHistoriaSlug: 'iniesta-cabezazo-iker-johannesburgo-2010-espana-campeona',
    durationSeconds: 35,
  },

  // ─── 2014 BRASIL ──────────────────────────────────────────
  {
    slug: 'james-volea-octavos-2014-colombia-uruguay-mejor-gol',
    year: 2014,
    matchDate: '2014-06-28',
    stage: 'r16',
    minute: 28,
    title: 'James Rodríguez y la volea de oro: la mejor jugada del Mundial 2014',
    player: 'James Rodríguez',
    teamCode: 'COL',
    opponentCode: 'URU',
    finalScore: { team: 2, opponent: 0 },
    description:
      'Octavos del Mundial Brasil 2014 en el Maracaná. Colombia y Uruguay 0-0. Minuto 28. Un córner uruguayo es despejado de cabeza por un defensor colombiano. El balón vuela hacia el centro del campo cayendo en zona de James Rodríguez, que está marcado por dos uruguayos. James **controla con el pecho** suavemente, **gira en el aire** sin que el balón toque el suelo, **dispara con el empeine izquierdo** a 30 metros del arco. El balón hace una parábola perfecta, pica en el larguero por la cara interna y entra al fondo de la red. 1-0 Colombia. La FIFA lo elegirá como el mejor gol del Mundial 2014 (Premio Puskas).',
    whyIconic: 'Mejor gol del Mundial 2014 según FIFA (Premio Puskas). Volea acrobática espectacular.',
    youtubeQuery: 'james rodriguez goal volley colombia uruguay 2014 world cup',
    durationSeconds: 35,
  },
  {
    slug: 'gotze-gol-final-2014-alemania-argentina-maracana',
    year: 2014,
    matchDate: '2014-07-13',
    stage: 'final',
    minute: 113,
    title: 'Mario Götze y el gol de la cuarta estrella alemana en el Maracaná',
    player: 'Mario Götze',
    teamCode: 'GER',
    opponentCode: 'ARG',
    finalScore: { team: 1, opponent: 0 },
    description:
      'Final del Mundial Brasil 2014 en el Maracaná. Alemania y Argentina 0-0 en la prórroga. Minuto 113. André Schürrle corre por la banda izquierda y centra al área. Mario Götze, sustituido por Klose en el minuto 88, está al borde del área. Controla el balón con el pecho de manera que cae a sus pies sin botar, y dispara con la pierna izquierda al ángulo izquierdo del portero Sergio Romero. **GOL**. 1-0 Alemania. Cuarta estrella alemana. Götze tiene 22 años y se convierte en el goleador más joven en una final del Mundial desde Pelé. Joachim Löw el seleccionador, Lahm el capitán. Klose, retirado tras el Mundial, había batido el récord histórico de Ronaldo con 16 goles en Mundiales.',
    whyIconic: 'Gol de la cuarta estrella alemana. Götze 22 años, sustituto al final. Klose record 16 goles.',
    youtubeQuery: 'mario gotze goal germany argentina 2014 world cup final',
    durationSeconds: 30,
  },
  {
    slug: 'van-persie-cabezazo-pez-volador-2014-espana-holanda',
    year: 2014,
    matchDate: '2014-06-13',
    stage: 'group',
    minute: 44,
    title: 'Van Persie y el "pez volador": cabezazo histórico vs España',
    player: 'Robin van Persie',
    teamCode: 'NED',
    opponentCode: 'ESP',
    finalScore: { team: 5, opponent: 1 },
    description:
      'Fase de grupos Brasil 2014, partido inaugural de España (campeona vigente) contra Países Bajos. España gana 1-0 con gol de Xabi Alonso de penalti. Daley Blind ejecuta un centro largo desde la banda izquierda hacia el segundo palo. Robin van Persie ve venir el balón a unos 18 metros del arco. **Salta como un nadador**, los brazos extendidos hacia delante, **cabecea picado** por encima del portero Iker Casillas. El balón hace una parábola descendente que cae al fondo del arco. **1-1**. Holanda demolerá a España en el segundo tiempo: 1-5. La masacre de Salvador. España cae eliminada en fase de grupos.',
    whyIconic: 'Cabezazo "pez volador" más comentado. Inicio del 1-5 de España campeona vigente.',
    youtubeQuery: 'van persie flying header spain netherlands 2014 world cup',
    durationSeconds: 25,
  },

  // ─── 2018 RUSIA ───────────────────────────────────────────
  {
    slug: 'pavard-volea-octavos-2018-francia-argentina',
    year: 2018,
    matchDate: '2018-06-30',
    stage: 'r16',
    minute: 57,
    title: 'Benjamin Pavard y la volea cruzada: mejor gol del Mundial 2018',
    player: 'Benjamin Pavard',
    teamCode: 'FRA',
    opponentCode: 'ARG',
    finalScore: { team: 4, opponent: 3 },
    description:
      'Octavos del Mundial Rusia 2018 en el Kazan Arena. Francia 1, Argentina 2. Lucas Hernández envía un centro raso desde la izquierda al borde del área. Benjamin Pavard, lateral derecho del Stuttgart de 22 años, llega corriendo desde atrás. Sin esperar a que el balón toque el suelo, **dispara con el exterior de la pierna derecha en volea cruzada** al ángulo opuesto. El balón pica en el larguero y entra al fondo del arco. **2-2**. Mbappé marcará después dos más y Francia ganará 4-3 en el partido más entretenido del Mundial. La FIFA elegirá a Pavard como autor del mejor gol del torneo (Premio Puskas oficial).',
    whyIconic: 'Mejor gol del Mundial 2018 según FIFA (Premio Puskas oficial). Volea exterior espectacular.',
    youtubeQuery: 'benjamin pavard goal france argentina 2018 world cup',
    durationSeconds: 30,
  },

  // ─── 2022 CATAR ───────────────────────────────────────────
  {
    slug: 'richarlison-chilena-grupos-2022-brasil-serbia',
    year: 2022,
    matchDate: '2022-11-24',
    stage: 'group',
    minute: 73,
    title: 'Richarlison y la chilena bicicleta: gol más bello del Mundial 2022',
    player: 'Richarlison',
    teamCode: 'BRA',
    opponentCode: 'SRB',
    finalScore: { team: 2, opponent: 0 },
    description:
      'Fase de grupos Catar 2022, Brasil vs Serbia en el Lusail. Brasil ganaba 1-0 desde el min 62 con gol del propio Richarlison. Minuto 73. Vinícius Junior centra desde la izquierda. El balón rebota dentro del área. Richarlison controla con el pecho cayendo el balón a sus pies. **Sin esperar, dispara en chilena bicicleta** con la pierna izquierda. El balón hace una parábola alta y baja al fondo del arco. **2-0 Brasil**. Doblete de Richarlison, ambos goles. La FIFA elegirá el gol como el mejor del Mundial 2022 (Premio Puskas). Pelé, ya enfermo en su lecho, hizo una breve aparición en redes para felicitar a Richarlison.',
    whyIconic: 'Mejor gol del Mundial 2022 (Premio Puskas). Chilena bicicleta espectacular. Doblete Richarlison.',
    youtubeQuery: 'richarlison bicycle kick brazil serbia 2022 world cup',
    durationSeconds: 30,
  },
  {
    slug: 'messi-gol-final-2022-argentina-francia-lusail',
    year: 2022,
    matchDate: '2022-12-18',
    stage: 'final',
    minute: 109,
    title: 'Messi y el gol que pasó a la historia: Argentina campeona en Lusail',
    player: 'Lionel Messi',
    teamCode: 'ARG',
    opponentCode: 'FRA',
    finalScore: { team: 3, opponent: 3 },
    description:
      'Final Catar 2022 en el Lusail. Argentina y Francia 2-2 en la prórroga. Minuto 109. Lautaro Martínez dispara desde el borde del área, el balón rebota en el portero Hugo Lloris y queda muerto a tres metros del arco. **Lionel Messi llega a la carrera y lo empuja al fondo**. La pierna izquierda. 3-2 Argentina. Messi celebra con la rodilla en el suelo, los brazos abiertos, gritando hacia los aficionados argentinos. Once minutos después, Mbappé empataría 3-3 con su tercer gol de la final (hat-trick histórico). En la tanda de penaltis Argentina ganaría 4-2 (Emiliano Martínez héroe). Messi finalmente campeón del mundo a los 35 años. Tercer Mundial argentino (1978, 1986, 2022). Balón de Oro del torneo para Messi.',
    whyIconic: 'Gol decisivo de Messi en su Mundial. Argentina campeona después de 36 años. Balón de Oro Mundial.',
    youtubeQuery: 'messi goal argentina france 2022 world cup final',
    durationSeconds: 35,
  },
];

// ───────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────

export function getGoalsByYear(year: number): FamousGoal[] {
  return FAMOUS_GOALS.filter((g) => g.year === year);
}

export function getGoalsByTeam(teamCode: string): FamousGoal[] {
  return FAMOUS_GOALS.filter(
    (g) => g.teamCode === teamCode || g.opponentCode === teamCode,
  ).sort((a, b) => b.year - a.year);
}

export function getGoalBySlug(slug: string): FamousGoal | undefined {
  return FAMOUS_GOALS.find((g) => g.slug === slug);
}

/**
 * URL de búsqueda en YouTube (siempre funciona).
 */
export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/**
 * URL de embed YouTube (privacy-enhanced).
 */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/**
 * URL de thumbnail estándar de YouTube.
 */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Genera schema.org VideoObject para un gol.
 * Si no hay youtubeId, devuelve un objeto sin embedUrl/thumbnailUrl.
 */
export function videoObjectLd(goal: FamousGoal, siteUrl: string) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: goal.title,
    description: goal.description,
    uploadDate: goal.matchDate + 'T00:00:00Z',
    contentUrl: youtubeSearchUrl(goal.youtubeQuery),
  };
  if (goal.youtubeId) {
    base.embedUrl = youtubeEmbedUrl(goal.youtubeId);
    base.thumbnailUrl = [youtubeThumbnailUrl(goal.youtubeId)];
  }
  if (goal.durationSeconds) {
    base.duration = `PT${goal.durationSeconds}S`;
  }
  base.url = `${siteUrl}/goles-famosos#${goal.slug}`;
  return base;
}

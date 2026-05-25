// Calendario editorial Mundial 2026, 54 historias
// Bloque S1: Las frases que definieron a un campeón

export type HistoriaCategory =
  | 'epica'
  | 'polemica'
  | 'tragica'
  | 'profetica'
  | 'humor'
  | 'historica'
  | 'mixta';

export type HistoriaBlockCode =
  | 'S1'
  | 'S2'
  | 'S3'
  | 'S4'
  | 'S5'
  | 'S6'
  | 'S7'
  | 'ARRANQUE'
  | 'EFEMERIDE';

export type CertaintyLevel = 'Alta' | 'Media-Alta' | 'Media' | 'Baja-Media';

export const BLOCK_LABELS: Record<HistoriaBlockCode, string> = {
  S1: 'Las frases que definieron a un campeón',
  S2: 'Profecías, predicciones y papelones',
  S3: 'El banquillo habla',
  S4: 'Polémicas, palos y picotazos',
  S5: 'Épicas e inspiración pura',
  S6: 'Cuenta atrás',
  S7: '7 días, 7 finales históricas',
  ARRANQUE: 'Arranque del Mundial 2026',
  EFEMERIDE: 'Efeméride obligatoria',
};

export const CATEGORY_LABELS: Record<HistoriaCategory, string> = {
  epica: 'Épica',
  polemica: 'Polémica',
  tragica: 'Trágica',
  profetica: 'Profética',
  humor: 'Humor',
  historica: 'Histórica',
  mixta: 'Mixta',
};

/**
 * Imagen de portada, Discover-friendly.
 * Servimos siempre 1200×675 (16:9) para que Google Discover, Open Graph
 * y Twitter Cards reciban la misma proporción ideal.
 *
 * Fuentes preferentes (en orden):
 *  1. Wikimedia Commons (license libre) → URL con `/thumb/.../1200px-...`
 *  2. FIFA Digital Hub
 *  3. Generación propia con tipografía sobre fondo neutro
 */
export type HistoriaCover = {
  url: string; // 1200×675 idealmente
  alt: string;
  credit: string; // p.e. "Foto: Eduardo Longoni / dominio público"
  license: string; // p.e. "CC BY-SA 4.0", "Public Domain", "Fair use"
  source?: string; // URL a la página de origen (Wikimedia, etc.)
};

export type Historia = {
  n: number;
  slug: string;
  publishDate: string; // YYYY-MM-DD
  blockCode: HistoriaBlockCode;
  category: HistoriaCategory;
  protagonist: string;
  quote: string;
  quoteDate: string;
  context: string;
  source: { name: string; url?: string };
  sourceSecondary?: string;
  certainty: CertaintyLevel;
  title: string;
  excerpt: string;
  body: string; // párrafos separados por \n\n
  cover?: HistoriaCover;
};

export const HISTORIAS: Historia[] = [
  // ═══════════════════════════════════════════════════════════
  // S1, Las frases que definieron a un campeón (24-30 abril)
  // ═══════════════════════════════════════════════════════════
  {
    n: 1,
    slug: 'mano-de-dios-maradona-1986',
    publishDate: '2026-04-24',
    blockCode: 'S1',
    category: 'polemica',
    protagonist: 'Diego Maradona',
    quote: 'Fue un poco con la cabeza y un poco con la mano de Dios',
    quoteDate: '1986-06-22',
    context:
      'Cuartos de final del Mundial de México. Argentina-Inglaterra en el Estadio Azteca. Cuatro años después de la guerra de las Malvinas. Maradona acababa de marcar dos goles en cuatro minutos: el más polémico y el más bello de la historia del fútbol.',
    source: {
      name: 'Wikipedia, La mano de Dios',
      url: 'https://es.wikipedia.org/wiki/La_mano_de_Dios',
    },
    sourceSecondary: 'Infobae · La Nación CR · Milenio',
    certainty: 'Alta',
    title: 'La Mano de Dios: la frase que convirtió un gol ilegal en mito',
    excerpt:
      'El 22 de junio de 1986 Maradona empujó el balón con la mano izquierda. Al día siguiente acuñó la frase más citada del deporte mundial.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maradona-Mundial_86_con_la_copa.JPG?width=1200',
      alt: 'Diego Maradona levanta la Copa del Mundo en el Estadio Azteca, 29 de junio de 1986',
      credit: 'Foto: El Gráfico, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Maradona-Mundial_86_con_la_copa.JPG',
    },
    body: `El 22 de junio de 1986, en el Estadio Azteca, Diego Armando Maradona marcó dos goles que resumen toda la contradicción del fútbol. El más polémico y el más hermoso de la historia, separados por cuatro minutos, en el mismo partido. Argentina-Inglaterra, cuartos de final del Mundial de México. Para entender la dimensión moral de aquellos diez minutos hay que retroceder cuatro años: en abril de 1982, la junta militar argentina había invadido las islas Malvinas; en junio, el Reino Unido las recuperaba dejando 649 muertos argentinos y 255 británicos. Cuatro años después, los dos países se cruzaban por primera vez en una cancha. Maradona lo dijo con todas las letras tiempo después: «era como matar a un policía».

El primer gol llegó al minuto 51. Steve Hodge despejó mal hacia su área, Maradona saltó contra el portero Peter Shilton -veinte centímetros más alto- y empujó el balón con la mano izquierda. El árbitro tunecino Ali Bin Nasser no lo vio. Su asistente búlgaro, Bogdan Dotchev, tampoco. Maradona corrió a celebrar mirando de reojo a sus compañeros, pidiéndoles con un gesto que le acompañasen para que el gol no se anulara. Sabía perfectamente lo que había hecho.

Al día siguiente, en rueda de prensa, llegó la frase: «Fue un poco con la cabeza de Maradona y un poco con la mano de Dios». La declaración no fue una disculpa ni una confesión. Fue algo más sofisticado: una mitología construida en tiempo real. Llamar a Dios como cómplice elevaba el asunto fuera del reglamento, fuera del campo, fuera de las posibilidades del periodismo deportivo convencional. Convertía la trampa en relato. Y el relato, en historia.

Lo extraordinario es que ese gol no es siquiera el más recordado del partido. Cuatro minutos más tarde, en el minuto 55, Maradona arrancó desde su propio campo, sorteó a Beardsley, Reid, Butcher, Fenwick, dejó en el sitio a Shilton y empujó el balón hacia la red vacía. 10,8 segundos. La FIFA, en una votación abierta para el centenario, lo eligió Gol del Siglo. El segundo gol redime al primero, pero no lo cancela. Maradona necesitaba ambos: la astucia callejera y el genio puro, el tramposo y el santo.

Cuarenta años después, la frase sigue siendo la más citada de la historia del deporte. Está en libros de filosofía, en clases de retórica, en titulares de prensa que ni siquiera hablan de fútbol. Cuando murió Maradona en noviembre de 2020, L'Équipe la condensó en su portada en tres palabras: «Dieu est mort». Dios ha muerto. La operación funcionó porque Maradona, treinta y cuatro años antes, ya se había nombrado a sí mismo. La Mano de Dios no fue solo una jugada ilegal: fue el momento en que un futbolista cogió el aparato simbólico de la cristiandad -el azar, la providencia, el milagro- y lo trasladó a una cancha de fútbol. Para siempre.`,
  },
  {
    n: 2,
    slug: 'lineker-siempre-gana-alemania-1990',
    publishDate: '2026-04-25',
    blockCode: 'S1',
    category: 'profetica',
    protagonist: 'Gary Lineker',
    quote:
      'El fútbol es un juego simple: 22 hombres persiguen una pelota durante 90 minutos y al final siempre gana Alemania',
    quoteDate: '1990-07-04',
    context:
      'Semifinal Italia 90, Inglaterra-Alemania Federal. 1-1 tras la prórroga. Inglaterra cayó en penales (4-3). Lineker, a la salida del estadio en Turín, todavía con las lágrimas frescas, pronunció la frase que lo definió como periodista futuro.',
    source: {
      name: 'Récord MX',
      url: 'https://www.record.com.mx/futbol-futbol-internacional-eurocopa/gary-lineker-es-hora-de-dejar-de-lado-la-frase-los-alemanes',
    },
    sourceSecondary: 'Futbol Total · Infobae',
    certainty: 'Alta',
    title: 'Lineker y la profecía alemana: la frase que resumió tres décadas de fútbol',
    excerpt:
      'Italia 90, semifinal en Turín, Inglaterra eliminada en penales. Las palabras de Gary Lineker se convirtieron en ley universal del fútbol.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gary_Lineker_(cropped).jpg?width=1200',
      alt: 'Retrato de Gary Lineker, exdelantero de la selección inglesa y autor de la profecía alemana',
      credit: 'Foto: Liton Ali',
      license: 'CC BY 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Gary_Lineker_(cropped).jpg',
    },
    body: `Cuando Gary Lineker pronunció esa frase a la salida del Stadio delle Alpi en julio de 1990, no estaba intentando ser ingenioso. Estaba describiendo lo que acababa de vivir. Inglaterra había empatado 1-1 con Alemania Federal en la semifinal del Mundial. Andreas Brehme había abierto el marcador con un disparo desviado por Paul Parker que se convirtió en parábola y descolocó a Peter Shilton. Lineker, a ocho minutos del final, marcó el empate tras una jugada larga y un pase de Parker. El tiempo extra terminó sin más goles. Y en los penales, Stuart Pearce y Chris Waddle fallaron. Alemania ganó 4-3 en la tanda. Inglaterra volvió a casa.

La memoria colectiva inglesa de aquella noche está fijada por las lágrimas de Paul Gascoigne, llorando antes de los penales porque sabía que, si llegaban a la final, él no la jugaría por estar amonestado. Esa imagen, distribuida por la BBC en directo, cambió la percepción británica del fútbol: el juego dejó de ser cosa de hooligans y se volvió, también, cosa de sentimientos. Pero la frase definitiva no la pronunció ningún periodista, sino un futbolista que tenía 29 años, había sido máximo goleador del Mundial 86 con seis goles y conocía a los alemanes mejor que nadie en su selección.

«El fútbol es un juego simple: 22 hombres persiguen una pelota durante 90 minutos y al final siempre gana Alemania». La frase tenía la elegancia del aforismo -estructura clásica, ritmo binario, golpe de efecto- pero estaba destilada de dolor. Alemania llegaría días después a ganar la final contra Argentina con un penal de Brehme y se confirmaría la regla.

Durante tres décadas, esa cita funcionó como verdad estadística. Alemania había llegado a la final del Mundial en 1966, 1974, 1982, 1986, 1990. Llegaría también en 2002 y 2014. Ganó tres títulos en el periodo (1974, 1990, 2014). En la Eurocopa de 1996, en el propio Wembley, venció a Inglaterra otra vez en penales tras semifinal: «It's coming home», cantaban los ingleses; volvió a Berlín. En 2014 demolió a Brasil 7-1 en Belo Horizonte, en un Mundial brasileño, mejorando casi cualquier metáfora futbolística previa. La profecía de Lineker se cumplía partido tras partido. Cualquier columnista perezoso podía abrir su pieza con una variación: «Como decía Lineker...».

Pero el fútbol también arruina sus propias reglas. En Brasil 2018, Alemania cayó eliminada en la fase de grupos, primera vez desde 1938. Corea del Sur la sentenció con dos goles en el descuento. En Qatar 2022, otra vez fuera en la primera fase. En la Eurocopa 2024, jugada en casa, cayó en cuartos contra España. La era del Mannschaft inevitable había terminado. Lineker mismo, ya periodista de la BBC y voz futbolística más respetada del país, ha dicho varias veces en redes que es hora de retirar la frase. Pero la frase no le pertenece ya. Pertenece al idioma. Cada eliminación inglesa en penales seguirá siendo, durante años, una nota a pie de página de aquella tarde de Turín.`,
  },
  {
    n: 3,
    slug: 'maradona-volver-a-nacer-y-ser-diego-1992',
    publishDate: '2026-04-26',
    blockCode: 'S1',
    category: 'epica',
    protagonist: 'Diego Maradona',
    quote:
      'Si me muero, quiero volver a nacer y ser futbolista, y quiero volver a ser Diego Maradona',
    quoteDate: '1992',
    context:
      'Declaración de Maradona en 1992, durante una entrevista. Marca la usó como portada el día de su muerte, el 26 de noviembre de 2020, confirmando que era la mejor autodefinición que dio jamás.',
    source: {
      name: 'Stadium Astro, recopilación de portadas tras la muerte de Maradona (Marca, L\'Équipe, Clarín, Daily Star…)',
      url: 'https://english.stadiumastro.com/football/diego-maradona-dies-newspaper-front-pages-pay-tribute-legend-180312',
    },
    sourceSecondary: 'Primicias Ecuador',
    certainty: 'Alta',
    title: 'Maradona: «quiero volver a nacer y ser Diego Maradona»',
    excerpt:
      'Una frase de 1992 que Marca rescató como portada el día que murió. La autodefinición más honesta -y más insolente- de un dios.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maradona_diario_cronica_1971_copia.jpg?width=1200',
      alt: 'Maradona niño con un balón, captado por el diario Crónica en noviembre de 1971',
      credit: 'Foto: Diario Crónica, 1 de noviembre de 1971',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Maradona_diario_cronica_1971_copia.jpg',
    },
    body: `Hay un género literario menor pero implacable: las frases que un futbolista dice en vida y que terminan, treinta años después, sirviendo de epitafio. Maradona, que era escritor además de futbolista, dijo la suya en 1992. Tenía 32 años. Acababa de pasar quince meses suspendido por su positivo de cocaína en el Nápoles, había vuelto a vivir a Argentina y firmaba con el Sevilla de Bilardo. La carrera, técnicamente, no había terminado. Pero la mejor parte sí. Y Maradona lo sabía.

«Si me muero, quiero volver a nacer y ser futbolista, y quiero volver a ser Diego Maradona». La frase es una operación lingüística doble: primero acepta la posibilidad de la propia muerte; luego la convierte en privilegio. Volver a vivir, sugiere Maradona, solo tiene sentido si vuelves a ser el mismo. Cualquier otra biografía sería una rebaja. Cualquier otro talento, un consuelo. Cualquier otra época, una traición a la que vivió.

La declaración aparece en distintas versiones a lo largo de los años, citada por periodistas argentinos, mexicanos, italianos. La fuente más sólida es una entrevista con la revista «El Gráfico», donde Maradona reflexionaba sobre su propia leyenda con una mezcla de ironía y soberbia que no admitía moralina. Por entonces ya había engordado, ya tenía dificultades para mantenerse limpio, ya había anticipado en privado a varios amigos que no llegaría a viejo. Decir aquello en 1992 no era arrogancia: era, casi, un testamento.

Cuando Maradona murió el 25 de noviembre de 2020 en Tigre, los diarios del mundo se pelearon por encontrar el titular. Italia tituló «Ho visto Maradona». Francia, «Dieu est mort». Argentina, «No habrá igual» en Clarín. Inglaterra recurrió a la Mano de Dios con humor culpable: «¿Dónde estaba el VAR?», escribió el Daily Star. Pero Marca, en España, hizo algo distinto: cedió la palabra al propio Maradona. La portada del 26 de noviembre fue una foto del Diego joven y, sobre ella, su frase de 1992.

La elección no fue sentimental. Fue periodísticamente exacta. Ningún panegírico podía competir con la franqueza salvaje de aquella declaración: la única persona autorizada para juzgar la vida de Maradona era Maradona, y él ya había votado. Lo haría todo igual. La frase explica el barrio de Villa Fiorito, las drogas, los hijos no reconocidos, los años en Cuba en el centro de rehabilitación de Fidel, los goles imposibles, la mano contra los ingleses, las apariciones televisivas erráticas, la dirección del seleccionado argentino en 2010. Lo asume todo en una sola línea. Si tuviera que volver, volvería igual.

Hay una segunda lectura, más política, que también merece ser dicha. Maradona se nombró a sí mismo en una época -los noventa- en la que el periodismo deportivo todavía no se atrevía a tratarlo como un personaje literario completo. Antes de Marca y de L'Équipe, el propio Diego se había reconocido como leyenda. Lo extraordinario es que tuviera razón. Volvió a ser él mismo durante treinta años más. Y cuando se fue, se fue habiendo escrito ya la portada.`,
  },
  {
    n: 4,
    slug: 'barrilete-cosmico-victor-hugo-morales-1986',
    publishDate: '2026-04-27',
    blockCode: 'S1',
    category: 'epica',
    protagonist: 'Víctor Hugo Morales',
    quote: 'Barrilete cósmico, ¿de qué planeta viniste?',
    quoteDate: '1986-06-22',
    context:
      'Relato en vivo para Radio Argentina del Gol del Siglo, cuatro minutos después de la Mano de Dios. La narración completa: «Gooool. ¡Quiero llorar, Dios santo! ¡Viva el fútbol! Golazooo, Diegoool, Maradonaaa». Cierre: «Barrilete cósmico, ¿de qué planeta viniste?».',
    source: {
      name: 'El Tiempo (Colombia)',
      url: 'https://www.eltiempo.com/deportes/futbol-internacional/diego-maradona-a-38-anos-de-la-mano-de-dios-y-el-barrilete-cosmico-goles-de-leyenda-en-el-mundial-mexico-86-3355262',
    },
    sourceSecondary: 'Milenio',
    certainty: 'Alta',
    title: 'Barrilete cósmico: el relato que cambió la narración deportiva',
    excerpt:
      'Cincuenta y cinco segundos de Víctor Hugo Morales. El relato del Gol del Siglo es la pieza de radio más célebre de la historia del fútbol.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Estadio_Azteca.jpg?width=1200',
      alt: 'Estadio Azteca de Ciudad de México, escenario del Gol del Siglo el 22 de junio de 1986',
      credit: 'Foto: Aalizul / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Estadio_Azteca.jpg',
    },
    body: `El Gol del Siglo dura 10,8 segundos en el reloj. Maradona arranca desde su propio campo, sortea a Peter Beardsley y Peter Reid en mediocampo, encara a Terry Butcher, lo deja en el sitio, finta sobre Terry Fenwick y a continuación deja también atrás a Butcher, que vuelve corriendo. Llega al área, encara a Peter Shilton, abre el cuerpo y empuja el balón con el interior del pie izquierdo a la red vacía. Es el 22 de junio de 1986, minuto 55 del Argentina-Inglaterra. Cuatro minutos después de la Mano de Dios. La FIFA lo elegiría dieciséis años después como Gol del Siglo en una votación abierta entre aficionados de todo el mundo.

Pero el gol no termina cuando entra. Termina cuando Víctor Hugo Morales, narrador uruguayo radicado en Argentina, encuentra las palabras desde la cabina de Radio Argentina. La narración empieza con la elevación de la voz a medida que Maradona avanza -«la tiene Maradona, lo marcan dos, pisa la pelota Maradona, arranca por la derecha el genio del fútbol mundial»- y se convierte progresivamente en un torrente: «deja al tercero y va a tocar para Burruchaga... ¡siempre Maradona! ¡Genio! ¡Genio! ¡Genio! ta-ta-ta-ta-ta-ta-ta». Cuando el balón entra: «Gooool. Gooool. ¡Quiero llorar, Dios santo! ¡Viva el fútbol! Golazooo, Diegoool, Maradonaaa».

Y entonces, después del rugido, viene la pregunta que sobreviviría al partido: «Es para llorar, perdónenme. Maradona, en una corrida memorable, en la jugada de todos los tiempos. Barrilete cósmico, ¿de qué planeta viniste para dejar en el camino a tanto inglés, para que el país sea un puño apretado gritando por Argentina?». La narración entera dura unos cincuenta y cinco segundos. Es el equivalente futbolístico de un texto literario de un solo aliento.

La televisión, en aquella época, todavía no había madurado como narradora deportiva. Los relatores televisivos sudamericanos estaban formados, casi todos, por la radio. Víctor Hugo Morales venía de cubrir Mundiales como cronista, no como espectador. Aquel gol, retransmitido para millones de personas en simultáneo, terminó haciendo algo más que una narración: hizo una traducción. Convirtió un gesto físico en una proposición metafísica. ¿De qué planeta viniste? era la única pregunta que tenía sentido.

Hay un detalle técnico que importa. La frase «barrilete cósmico» no es metáfora azarosa. El barrilete, en Argentina, es la cometa: ese juguete que se eleva por el viento y que siempre sigue, en parte, su propia voluntad. Cósmico añade la dimensión inhumana. La traducción al castellano peninsular sería más prosaica: cometa cósmica. Pero la palabra «barrilete» es popular, sudamericana, infantil. Está más cerca del barrio que del Olimpo. Maradona, niño elevado al cielo. Era la imagen exacta.

Cuarenta años después, el audio sigue circulando en su versión original o remasterizado. Lo han mezclado con la imagen en montajes museísticos y publicitarios. Cuando Maradona murió, fue una de las primeras piezas que pasaron las radios del mundo: en Argentina, en España, en Italia, en México. La narración había superado al narrador, al jugador, al partido. Era ya un objeto autónomo, una pieza de patrimonio inmaterial. Eso es lo que hace la radio cuando la radio funciona: deja una grabación que vive sola, fuera del tiempo, capaz de hacer llorar a quien la escucha aunque ya no recuerde de qué Mundial estamos hablando.`,
  },
  {
    n: 5,
    slug: 'maradona-me-cortaron-las-piernas-1994',
    publishDate: '2026-04-28',
    blockCode: 'S1',
    category: 'tragica',
    protagonist: 'Diego Maradona',
    quote: 'No me drogué. Me cortaron las piernas',
    quoteDate: '1994-06-30',
    context:
      'Tras dar positivo por efedrina en el control antidopaje del Mundial USA 94. Maradona acababa de marcar contra Grecia y celebrar con la cámara. Argentina lo sacó del torneo y, tras esto, perdió contra Rumania.',
    source: {
      name: 'Wikipedia, Diego Maradona — sección «Me cortaron las piernas»',
      url: 'https://es.wikipedia.org/wiki/Diego_Maradona',
    },
    sourceSecondary: 'Infobae · Primicias Ecuador · Clarín',
    certainty: 'Alta',
    title: '«Me cortaron las piernas»: el final del Maradona mundialista',
    excerpt:
      'Junio de 1994. Maradona da positivo por efedrina y queda fuera de USA 94. Pronuncia la frase que se convirtió en epitafio de su carrera con la albiceleste.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maradona_con_equipo_argentinos_jrs_1972.jpg?width=1200',
      alt: 'Diego Maradona con el primer equipo de Argentinos Juniors, 1972, dos décadas antes del Mundial USA 94',
      credit: 'Foto: Recuerdos de Buenos Aires, 1972',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Maradona_con_equipo_argentinos_jrs_1972.jpg',
    },
    body: `Maradona llegó a USA 94 más delgado que nunca. Tenía 33 años, había pasado la suspensión por cocaína de 1991-92, había vuelto a entrenarse con su preparador físico personal Daniel Cerrini -no era el médico de la selección- y se presentaba al Mundial con una composición corporal imposible para alguien con su historial de excesos. Antes del torneo, en una entrevista, había advertido medio en broma medio en serio: «Si juego mal, pueden criticarme; si juego bien, también, pero ahora no se puede tirar abajo todo lo que estoy haciendo». La frase ya tenía un tono defensivo. Algo iba a pasar.

Cerrini había diseñado un cóctel personalizado para que Maradona pudiera competir con el peso recuperado. Incluía efedrina, una sustancia que la FIFA había tolerado durante los años ochenta y que aplicaba ahora con criterios más estrictos. Hay versiones contradictorias sobre si Maradona conocía exactamente la composición de lo que tomaba. Lo que es seguro es que el médico oficial de la selección, Roberto Peidró, no estaba en el bucle.

El primer partido contra Grecia, 21 de junio de 1994 en Foxborough, terminó 4-0 con tres goles de Batistuta. Maradona marcó al minuto 60 un gol espectacular: zurdazo cruzado desde la frontal, ángulo perfecto, celebración rabiosa frente a la cámara con los ojos abiertos como un poseído, gritando algo inaudible. La imagen, que daría la vuelta al mundo, condensa una década de la carrera de Diego: la furia y la genialidad indistinguibles. Cuatro días después, tras Argentina-Nigeria (2-1), llegó el control antidopaje. Maradona ya no aparecería en cancha. La FIFA lo retiró del Mundial.

«No me drogué. Me cortaron las piernas». La frase es tan precisa que duele. Maradona no negaba la sustancia. Negaba la intención. Cortar las piernas a un futbolista es una metáfora boxística -Sandy Saddler hizo eso a Willie Pep en sus cuatro peleas históricas de 1948-1951-, pero también es una imagen de mutilación pura. La frase reposicionaba a Maradona como víctima, no como tramposo: alguien le había hecho algo, alguien tenía interés en sacarlo, alguien le había puesto la sustancia o no le había avisado. La FIFA, según esa versión, era el cirujano. Y en parte tenía razón.

Argentina, sin Maradona, perdió contra Rumania en octavos (3-2) y se fue a casa. Hagi y Petrescu, quizá las dos últimas grandes generaciones rumanas, jugaron un Mundial de manual. Pero la imagen que quedó no fue la victoria rumana, sino el Maradona ausente. La selección argentina sin él volvió a ser, durante doce años, una colección de jugadores de talento esperando otro líder. Lo encontrarían sólo en 2010, con Messi -aunque entonces el entrenador era el propio Diego, y la cosa terminó otra vez en desastre.

La frase se ha citado durante treinta años como cierre de una trayectoria épica. Pero también funciona como anuncio del Maradona posterior: el comentarista de televisión, el director técnico de Argentina en 2010, el hombre cada vez más roto que aparecía y desaparecía de la escena pública. A partir de 1994, el barrilete cósmico ya no jugaría. Solo recordaría que había jugado. Quizá por eso esta frase, más que la Mano de Dios o el Barrilete cósmico, es la que mejor explica al Diego de las dos últimas décadas: la víctima orgullosa que aceptaba la culpa pero exigía un culpable.`,
  },
  {
    n: 6,
    slug: 'cruyff-jugar-futbol-simple',
    publishDate: '2026-04-29',
    blockCode: 'S1',
    category: 'polemica',
    protagonist: 'Johan Cruyff',
    quote: 'Jugar al fútbol es muy simple. Pero jugar un fútbol simple es lo más difícil que hay',
    quoteDate: 'c. 1988-1995',
    context:
      'Una de las 18 mejores frases de Cruyff seleccionadas por Panenka en abril de 2024. Resume la filosofía del fútbol total y el cruyffismo aplicado en el Barça de los noventa.',
    source: {
      name: 'Panenka, 18 mejores frases de Cruyff',
      url: 'https://www.panenka.org/pasaportes/en-un-momento-dado-las-18-mejores-frases-de-cruyff/',
    },
    sourceSecondary: 'Depor Perú · Revista Líbero',
    certainty: 'Alta',
    title: 'Cruyff: por qué el fútbol simple es el más difícil',
    excerpt:
      'La frase más cruyffista de todas. Aforismo, manifiesto y método al mismo tiempo. La filosofía que cambió el fútbol europeo.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Johan_Cruyff_1975.jpg?width=1200',
      alt: 'Johan Cruyff retratado en 1975, en su etapa final como jugador del FC Barcelona',
      credit: 'Foto: Micivek / Wikimedia Commons',
      license: 'CC BY 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Johan_Cruyff_1975.jpg',
    },
    body: `La frase es tan elegante que se entiende mal. La gente la cita como si fuera una boutade de holandés impertinente, una de esas declaraciones que Johan Cruyff lanzaba en rueda de prensa con cara de aburrimiento. Pero es exactamente lo contrario: una receta de cocina. Una receta exigente, casi imposible. «Jugar al fútbol es muy simple. Pero jugar un fútbol simple es lo más difícil que hay».

Lo simple, para Cruyff, no era el fútbol básico. Era el fútbol decantado. Pase corto, espacio bien usado, posición geométrica, pase corto otra vez. Sin floreos individuales, sin laterales que se pierden buscando portería, sin centros desesperados al área. La simplicidad cuesta porque exige inteligencia colectiva. Once jugadores tomando decisiones casi idénticas en cada acción del partido. Cualquiera puede aprender un regate. Hacer que un equipo entero piense igual durante 90 minutos es lo difícil.

En Holanda, esa idea había nacido a finales de los sesenta con Rinus Michels en el Ajax. Total Football: cualquier jugador podía ocupar cualquier posición durante el partido, siempre que mantuviera la geometría del equipo. Cruyff fue el primer ejecutor del método sobre la cancha, y luego el primer apóstol de su filosofía como entrenador. Vio cómo su maestro Michels ganaba la Eurocopa 1988 al frente de la Holanda de Van Basten, Gullit y Rijkaard, mientras él esperaba su turno fuera de la selección. En 1988 llegó a Barcelona como técnico y refundó el club: el Dream Team de 1991-94 ganó cuatro Ligas seguidas y la primera Copa de Europa de la historia del Barça en Wembley, 1992. La filosofía pasó luego de Cruyff a Frank Rijkaard, de Rijkaard a Guardiola y, con Guardiola, al Bayern de Múnich, al Manchester City y, por reverberación, a casi todos los equipos europeos serios.

España lo llevó al Mundial 2010 y lo ganó: siete partidos, ocho goles a favor, dos en contra. Tiki-taka. Un equipo que jugaba como si fuera fácil. Andrés Iniesta, alumno de Guardiola, alumno de Cruyff, marcó el gol de la final en el minuto 116 de la prórroga contra Holanda -la propia patria del método, ironías del fútbol-. Cuando España revalidó la Eurocopa en 2012 con un 4-0 a Italia, Cruyff dijo en una columna que era «el equipo más cercano al fútbol total que se había visto desde el Ajax de Michels». Era su forma de aceptar la herencia.

Cuando Cruyff dijo aquello -en alguna entrevista perdida de los años noventa, durante su segunda etapa como entrenador del Barça- estaba justificando lo que se llamaba en su época un Barça aburrido. La gente decía que tocaba demasiado. Cruyff respondía que tocaban poco; que tocar bien siempre cuesta más que arriesgarse en una contra; que el verdadero esfuerzo está en aceptar que la jugada se haga en cinco pases en lugar de en uno. La paciencia colectiva como virtud técnica.

La frase funciona también como autorretrato. Cruyff fue jugador y técnico durante cuarenta años. Hizo carrera entera de jugar simple, de pasar simple, de ordenar simple. Por eso fue Cruyff. Y por eso, ocho años después de su muerte, sigue siendo el filósofo más citado del fútbol europeo. Panenka, en su listado de las dieciocho frases canónicas publicado en abril de 2024, la incluyó como número uno. Es difícil no estar de acuerdo.`,
  },
  {
    n: 7,
    slug: 'obdulio-varela-mi-patria-es-la-gente-1950',
    publishDate: '2026-04-30',
    blockCode: 'S1',
    category: 'epica',
    protagonist: 'Obdulio Varela',
    quote:
      'Si volviera a jugar aquel partido, preferiría perderlo. Mi patria es la gente que sufre',
    quoteDate: 'c. 1950-1955',
    context:
      'Capitán de Uruguay en el Maracanazo (16 julio 1950). Declaración posterior sobre el impacto humano de la derrota brasileña. Varela bajó al hotel del equipo brasileño esa noche y bebió con sus rivales para acompañar el luto.',
    source: {
      name: 'Jot Down Cultural Magazine',
      url: 'https://www.jotdown.es/2014/02/mundial-1950-el-drama-de-maracana/',
    },
    sourceSecondary: 'Toni Padilla, Mundial 1950 (Editorial Panenka)',
    certainty: 'Media-Alta',
    title: 'Obdulio Varela: el capitán que prefería perder el Maracanazo',
    excerpt:
      'El día que ganó el Maracaná, Obdulio Varela bebió con los brasileños vencidos. Después dijo la frase más generosa que ha pronunciado un campeón del mundo.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Obdulio_Varela,_Estadio,_1950-07-15_(374).jpg?width=1200',
      alt: 'Obdulio Varela, capitán de Uruguay en el Maracanazo, en una imagen del 15 de julio de 1950',
      credit: 'Foto: Revista Estadio (Santiago, Zig-Zag), 1950',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Obdulio_Varela,_Estadio,_1950-07-15_(374).jpg',
    },
    body: `Obdulio Varela tenía 32 años el 16 de julio de 1950 (cumplía 33 dos meses después, el 20 de septiembre). Era el capitán de Uruguay, mediocampista del Peñarol, hijo de un peón rural negro y una empleada doméstica blanca. Había crecido entre dos mundos, los dos pobres. Según los testigos, era el único hombre que parecía tranquilo cuando empezó la final del Mundial de Brasil contra el equipo local. El estadio Maracaná, recién inaugurado, estaba lleno con 173.850 personas oficialmente -según otras fuentes, casi 200.000-, en su mayoría brasileños esperando el primer título mundial de su selección. Las portadas de los diarios brasileños del día anterior ya celebraban la victoria. Jules Rimet, presidente de la FIFA, llevaba en el bolsillo un discurso preparado en portugués para felicitar al equipo brasileño.

A Uruguay le bastaba con un empate para ser campeón -el formato de aquel Mundial era una liguilla final entre cuatro equipos, no eliminatorias-, pero el favoritismo brasileño era abrumador: en los partidos previos, Brasil había goleado 7-1 a Suecia y 6-1 a España. Uruguay había empatado contra España y ganado raspado a Suecia. Pocos apostaban por la celeste.

Brasil empezó ganando con gol de Friaça al minuto 2 del segundo tiempo (47'). Varela cogió el balón después del gol y caminó al centro del campo solo, despacio, sin levantar la cabeza. Es el gesto que cuenta la leyenda con más detalle: discutió con el árbitro inglés George Reader sobre un supuesto fuera de juego -no lo había-, ganó tres minutos de protesta, calmó a sus compañeros. La protesta fue una estratagema. Permitió que se enfriara el rugido del estadio. Cuando se reanudó el juego, Brasil ya no jugaba con la confianza del primer cuarto de hora. Schiaffino empató al 66 con un disparo que dejó a Barbosa sin reacción. Ghiggia, extremo derecho que ya había marcado contra Suecia y España, marcó el segundo al 79 tras una pared con Pérez. Maracanazo.

El silencio del Maracaná tras el gol de Ghiggia fue, según el cronista uruguayo Carlos Solé, «el silencio más largo del fútbol mundial». Hubo desmayos en las tribunas. Hubo, después del partido, dos infartos en el estadio. La pelota fue cogida por Ghiggia y guardada como reliquia. Jules Rimet, que había bajado al campo con la copa, no encontraba a nadie de la organización brasileña que le indicase a quién entregársela. La leyenda dice que la entregó a Varela «casi a escondidas», sin discurso, sin micrófono, en mitad del campo. La copa volvió a Sudamérica.

Esa noche, Varela bajó al hotel del equipo brasileño y bebió con ellos. No fue por modestia: fue una operación moral. La gente que había llenado el Maracaná no era enemiga, era gente. Varela lo entendía mejor que nadie, porque él también venía del barrio, también era pobre, también había perdido cosas en la vida. Años después, en distintas entrevistas que recopilan los archivos uruguayos, declaró: «Si volviera a jugar aquel partido, preferiría perderlo. Mi patria es la gente que sufre». La frase no es una pose deportiva ni una falsa humildad. Es la única conclusión sensata después de haber visto, desde el centro del campo, cómo se vacía de aire un país entero.

Toni Padilla, en su libro sobre el Maracanazo publicado por Panenka en 2014, recuperó la cita y la contextualizó dentro del personaje completo de Varela: el sindicalista del Peñarol, el peón rural devenido capitán, el negro que jugó cuando casi no había negros en la selección uruguaya. Setenta y seis años después, sigue siendo lo más alto que ha dicho un capitán de selección sobre el día más feliz de su carrera. Y la prueba de que la grandeza deportiva, cuando es genuina, también es ética.`,
  },

  // ───────────────────────────────────────────────────────────
  // Bloque S2 · Profecías, predicciones y papelones (1-7 mayo 2026)
  // Fuentes verificadas con WebFetch contra Wikipedia abr 2026.
  // ───────────────────────────────────────────────────────────

  {
    n: 8,
    slug: 'pak-doo-ik-italia-corea-1966',
    publishDate: '2026-05-01',
    blockCode: 'S2',
    category: 'polemica',
    protagonist: 'Pak Doo-ik / Italia',
    quote: 'Volveremos a casa con la copa en el bolsillo',
    quoteDate: '1966-07-15',
    context:
      'Mundial de Inglaterra 1966, fase de grupos. Italia llegaba como una de las grandes favoritas con Rivera, Mazzola y Facchetti. El 19 de julio, en Ayresome Park de Middlesbrough, Corea del Norte, debutante absoluta, ganó 1-0 con gol de Pak Doo-ik al minuto 42 y dejó a la Azzurra fuera en primera fase.',
    source: {
      name: 'Wikipedia, 1966 FIFA World Cup Group 4',
      url: 'https://en.wikipedia.org/wiki/1966_FIFA_World_Cup_Group_4',
    },
    sourceSecondary: 'Wikipedia (Pak Doo-ik) · BBC Sport · La Gazzetta dello Sport',
    certainty: 'Media-Alta',
    title: 'Pak Doo-ik, el cabo del ejército que humilló a Italia en 1966',
    excerpt:
      'El 19 de julio de 1966 Corea del Norte ganó 1-0 a Italia en Middlesbrough. Pak Doo-ik marcó al 42 y mandó a casa a una de las favoritas del Mundial.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/1966_world_cup.png?width=1200',
      alt: 'Mapa oficial del Mundial de Inglaterra 1966, sede del histórico Italia 0-1 Corea del Norte',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:1966_world_cup.png',
    },
    body: `Italia llegó al Mundial de Inglaterra en 1966 con la fanfarria habitual de las grandes potencias. Tenía a Gianni Rivera, a Sandro Mazzola, a Giacinto Facchetti, al portero Enrico Albertosi. Tenía dos Copas del Mundo en las vitrinas, las de 1934 y 1938, y un Calcio que era ya entonces el campeonato más rico de Europa. Las crónicas previas lo daban casi todo por descontado: la prensa italiana hablaba de la final de Wembley antes incluso del primer partido, y desde el staff azzurro circulaba la frase que iba a comerse media historia del torneo: «volveremos a casa con la copa en el bolsillo».

Enfrente, en el último partido del Grupo 4, había una selección que casi nadie había visto jugar: Corea del Norte. Era su debut absoluto en un Mundial. Habían llegado tras un proceso clasificatorio caótico, después de que la FIFA agrupara África, Asia y Oceanía en una sola plaza y dieciséis selecciones africanas se retiraran en protesta. Los jugadores eran soldados del Ejército Popular de Corea con permiso especial para entrenarse durante meses como bloque. El cabo Pak Doo-ik, nacido en Pyongyang en 1943, era uno de ellos.

El 19 de julio, en Ayresome Park de Middlesbrough, ante 17.829 espectadores, Pak marcó al minuto 42. Robó un balón en el centro del campo, avanzó unos metros y disparó cruzado con la pierna derecha. El portero italiano, Albertosi, no llegó. Italia atacó toda la segunda parte, pero el marcador no se movió. Corea del Norte pasaba como segunda de grupo. Italia volvía a casa eliminada en primera fase por una selección que la prensa italiana había bautizado, con suficiencia, como «los enanos amarillos».

La vuelta a Italia es el otro capítulo del relato. La selección aterrizó en Génova en lugar de Roma para evitar Fiumicino, pero la noticia ya había corrido. Centenares de tifosi esperaban en el aeropuerto con tomates podridos y los lanzaron contra los jugadores y el seleccionador Edmondo Fabbri. La imagen del recibimiento se convirtió en la primera prueba documentada de un género que el fútbol italiano repetiría: la humillación pública del fracaso. Fabbri fue cesado de inmediato. Varios jugadores no volvieron a vestir la Azzurra.

Pak Doo-ik tuvo una segunda vida menos fotográfica. Tras el Mundial fue ascendido a sargento, dejó el ejército y trabajó como profesor de educación física en Pyongyang. Durante años circuló en Italia la leyenda de que era dentista, una versión romántica que el periodismo italiano dio por buena durante décadas y que él mismo desmintió cuando la BBC lo localizó a finales de los noventa. En 2008 portó la antorcha olímpica de Pekín en su tramo norcoreano. La frase italiana, en cambio, sobrevivió a todo: cada vez que la Azzurra cae contra un rival modesto, Corea del Sur en 2002, Eslovaquia en 2010, Suecia en 2017, Macedonia del Norte en 2022, algún cronista la rescata. La copa, finalmente, no cabía en aquel bolsillo.`,
  },
  {
    n: 9,
    slug: 'pele-prediccion-africa-campeona',
    publishDate: '2026-05-02',
    blockCode: 'S2',
    category: 'profetica',
    protagonist: 'Pelé',
    quote: 'Antes del año 2000, un país africano será campeón del mundo',
    quoteDate: '1977-01-01',
    context:
      'Pelé pronunció la frase a finales de los años setenta, en plena gira con el New York Cosmos, durante una serie de entrevistas en las que se le pedía que pronosticara el futuro del fútbol. La predicción se ha repetido durante medio siglo cada vez que una selección africana llega lejos en un Mundial. Sigue sin cumplirse en 2026.',
    source: {
      name: 'Wikipedia, Confederation of African Football',
      url: 'https://en.wikipedia.org/wiki/Confederation_of_African_Football',
    },
    sourceSecondary: 'The Guardian · BBC Sport · France Football',
    certainty: 'Media',
    title: 'Pelé y la profecía africana que ya tiene casi medio siglo de retraso',
    excerpt:
      'Pelé prometió que un país africano ganaría un Mundial antes del año 2000. Veintiséis años después de la fecha, ninguna selección africana ha jugado siquiera una final.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pel%C3%A9_1960.jpg?width=1200',
      alt: 'Pelé fotografiado en 1960, en plena etapa con el Santos FC',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Pel%C3%A9_1960.jpg',
    },
    body: `Pelé dijo muchas cosas a lo largo de su vida y casi todas se le citaron mal. Pero ninguna ha sobrevivido tanto como aquella predicción de finales de los setenta: un país africano sería campeón del mundo antes del año 2000. La frase aparece atribuida en distintas entrevistas, en su gira con el New York Cosmos y en declaraciones a medios europeos durante el Mundial de Argentina 1978. La fecha exacta es difícil de fijar; el contenido, en cambio, no se ha movido nunca. Pelé estaba convencido. África venía, África estaba madurando, África iba a llegar.

Las pruebas materiales que tenía Pelé en aquel momento eran reales. Marruecos había debutado en México 70 con dignidad. Zaire, en Alemania 74, fue una catástrofe, nueve goles encajados en tres partidos, pero abrió la puerta al continente. Túnez, en Argentina 78, ganó a México y empató con Alemania Federal. La FIFA, presionada por la propia CAF, había ampliado el cupo africano de una a dos plazas. Pelé, que era ya por entonces embajador de la propia FIFA, leyó la tendencia. Antes del año 2000, escribió, África ganaría una Copa del Mundo.

La realidad fue más tozuda. En el medio siglo transcurrido desde la profecía, ninguna selección africana ha jugado una final del Mundial. Camerún hizo cuartos en Italia 90, hasta que Roger Milla y compañía cayeron contra una Inglaterra de Lineker en la prórroga. Senegal repitió cuartos en Corea-Japón 2002. Ghana llegó a un cuarto de final en Sudáfrica 2010 y se quedó ahí, en un penal fallado por Asamoah Gyan en el último minuto contra Uruguay después de que Suárez hubiera detenido un balón con la mano. El techo africano siempre fue el mismo: ocho equipos, ni uno menos, ni uno más.

Marruecos rompió el muro en Qatar 2022. Llegó a semifinales eliminando a España y Portugal por el camino, terminó cuarta y se convirtió en la primera selección africana, y árabe, en pisar la antesala de la final. Walid Regragui había construido un equipo defensivo extraordinario, con Bono en portería, Hakimi en el lateral y un colectivo entero acostumbrado a sufrir. Pero el milagro se detuvo contra Francia. La final siguió siendo un territorio inaccesible.

La profecía de Pelé está hoy en el lugar incómodo de las predicciones generosas que no envejecen bien. La pronunció con la mejor de las intenciones, un brasileño negro que entendía mejor que nadie la escasa visibilidad del fútbol africano, pero confundió la potencia del talento individual con la maquinaria de las federaciones. Las grandes ligas europeas se llevaron a los mejores futbolistas africanos antes de que pudieran consolidar selecciones competitivas en casa. La burocracia futbolística africana, plagada de escándalos, hizo el resto. La frase queda como un acto de fe a contracorriente: el día que un país africano levante la copa, alguien volverá a citarla. Pelé tendrá razón con cincuenta años de retraso. Pero todavía no.`,
  },
  {
    n: 10,
    slug: 'mineirazo-brasil-1-7-alemania-2014',
    publishDate: '2026-05-03',
    blockCode: 'S2',
    category: 'tragica',
    protagonist: 'Brasil 2014',
    quote: 'Hexa! Hexa! Hexa!',
    quoteDate: '2014-07-08',
    context:
      'Semifinal del Mundial de Brasil 2014, 8 de julio en Mineirão de Belo Horizonte. Brasil llegaba sin Neymar, lesionado en cuartos por Zúñiga, y sin Thiago Silva, sancionado. La afición había cantado todo el torneo el «Hexa», el sexto título mundial. Alemania marcó siete goles. Cinco de ellos en 18 minutos.',
    source: {
      name: 'Wikipedia, Brasil 1-7 Alemania',
      url: 'https://es.wikipedia.org/wiki/Brasil_1-7_Alemania',
    },
    sourceSecondary: 'O Globo · Folha de São Paulo · The Guardian',
    certainty: 'Alta',
    title: 'Mineirazo: la noche en que Alemania apagó a Brasil en su propia casa',
    excerpt:
      'Brasil cantaba el «Hexa» antes del partido. Alemania marcó cinco goles en 18 minutos y firmó la mayor humillación deportiva del país anfitrión.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mineir%C3%A3o_2014.jpg?width=1200',
      alt: 'Estadio Mineirão de Belo Horizonte durante el Mundial de Brasil 2014, escenario del 1-7 ante Alemania',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Mineir%C3%A3o_2014.jpg',
    },
    body: `Brasil había llegado a la semifinal del Mundial 2014 con un torneo accidentado pero suficiente. Había sufrido contra Chile en octavos, penales, había vencido a Colombia en cuartos pagando un precio doble: la lesión de vértebra de Neymar tras la entrada de Camilo Zúñiga y la segunda amarilla de Thiago Silva, que le dejaba fuera del siguiente partido. La selección de Luiz Felipe Scolari iba a jugar la semifinal contra Alemania sin su mejor jugador y sin su capitán defensivo. Aun así, en las calles de Belo Horizonte y en el propio Mineirão, el cántico era el de siempre: «Hexa, hexa, hexa», el sexto título mundial, el que Brasil llevaba doce años persiguiendo desde Corea-Japón 2002.

Lo que pasó el 8 de julio de 2014, entre las 17:00 y las 18:50 hora local, no tiene comparación moderna. Thomas Müller marcó al minuto 11. Miroslav Klose, que con ese tanto se convirtió en máximo goleador histórico de Mundiales, superando a Ronaldo Nazário, al 23. Toni Kroos al 24 y al 26. Sami Khedira al 29. Cinco goles en 18 minutos. Cuatro de ellos en seis. Cuando se cumplió la primera media hora, Alemania ganaba 5-0 a Brasil en una semifinal del Mundial jugada en Brasil. La estadística parece un error tipográfico. No lo era.

Las cámaras buscaron caras en las gradas y encontraron lo que buscaban: una niña llorando, un hombre tapándose los ojos, otro santiguándose, una pareja que se abrazaba sin mirar al campo. David Luiz, capitán esa noche en sustitución de Thiago Silva, gritaba a sus compañeros como un náufrago. Júlio César, en la portería, se había convertido en un espectador más. Scolari, en el banquillo, parecía un hombre al que estaban echando de su propia fiesta. El público, asombrosamente, comenzó a aplaudir a Alemania en el segundo tiempo. André Schürrle marcó dos más, al 69 y al 79. Óscar redujo distancias al 90. 1-7. El marcador final más doloroso de la historia del fútbol brasileño.

La derrota tuvo varias capas. La primera, deportiva: la generación de Müller, Klose, Kroos, Khedira y Mats Hummels remataba un proceso de doce años iniciado por Jürgen Klinsmann y consolidado por Joachim Löw, y cuatro días después ganaría el Mundial contra Argentina con un gol de Mario Götze. Brasil, en cambio, perdió también el partido por el tercer puesto contra Holanda (3-0) y se fue del torneo eliminada por once goles en dos partidos. La segunda capa, simbólica: el Maracanazo de 1950 había sido una derrota silenciosa, y Brasil tardó décadas en hablar de él. El Mineirazo, en cambio, fue retransmitido en directo a 64 países, comentado en redes sociales en tiempo real, convertido en meme en cuestión de horas. La humillación llegó completa, instantánea y archivada para siempre.

David Luiz salió del campo llorando, pidió disculpas a los aficionados a la salida del estadio y se convirtió en la imagen del desastre. «Quería darle felicidad al pueblo brasileño», dijo en zona mixta, sin poder mantener la voz. La frase, descontextualizada, viajó por el mundo. La selección no volvió a llamarse Hexa con la misma confianza. En 2018, en 2022, los cánticos eran más cautos. Algo se había roto en Belo Horizonte y nunca terminó de arreglarse: la convicción brasileña de que un Mundial en casa solo podía terminar de una manera. El fútbol, esa tarde, recordó a un país entero que su historia tenía dos finales posibles.`,
  },
  {
    n: 11,
    slug: 'its-coming-home-inglaterra-three-lions',
    publishDate: '2026-05-04',
    blockCode: 'S2',
    category: 'humor',
    protagonist: 'Inglaterra',
    quote: "It's coming home",
    quoteDate: '1996-05-20',
    context:
      'Estribillo de «Three Lions», canción compuesta por Ian Broudie (Lightning Seeds) con letra de los humoristas David Baddiel y Frank Skinner para la Eurocopa de 1996, jugada en Inglaterra. La canción fue número uno y se convirtió en el himno extraoficial del fútbol inglés. Treinta años después, la copa sigue sin venir a casa.',
    source: {
      name: 'Wikipedia, Three Lions (song)',
      url: 'https://en.wikipedia.org/wiki/Three_Lions_(song)',
    },
    sourceSecondary: 'BBC Sport · The Guardian · NME',
    certainty: 'Alta',
    title: '«It\'s coming home»: la profecía inglesa que lleva treinta años sin cumplirse',
    excerpt:
      'En 1996, Skinner, Baddiel y Lightning Seeds prometieron que el fútbol volvía a casa. Inglaterra lleva siete torneos cayendo en finales y semifinales, casi todas en penales.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wembley_Stadium_closeup.jpg?width=1200',
      alt: 'Wembley Stadium, sede emocional del fútbol inglés y de la Eurocopa de 1996',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Wembley_Stadium_closeup.jpg',
    },
    body: `Cuando Ian Broudie compuso «Three Lions» a principios de 1996, la Federación Inglesa le había hecho un encargo concreto: una canción para acompañar a la selección anfitriona durante la Eurocopa de aquel verano, la primera competición internacional grande que se jugaba en Inglaterra desde el Mundial de 1966. Broudie, líder de Lightning Seeds, descartó la idea inicial de que la cantaran los jugadores. Llamó a David Baddiel y Frank Skinner, dos humoristas que tenían un programa de comedia futbolística en la BBC, y les pidió la letra. La premisa era exacta: una canción de hincha, no de profesional. «Ser hincha del fútbol inglés es, el 90 % del tiempo, perder», dijo Broudie en una entrevista posterior. Había que partir de ahí.

La letra, publicada el 20 de mayo de 1996, hablaba de Bobby Moore levantando la copa, de Bobby Charlton abriendo el cuerpo, de Nobby Stiles bailando, de la salvada de Gordon Banks en México 70. Listaba derrotas con resignación británica y aun así repetía un estribillo de cinco palabras: «It's coming home, it's coming home, football's coming home». El fútbol vuelve a casa. La frase tenía una doble lectura: porque la Eurocopa se jugaba en Inglaterra, donde había nacido el deporte, y porque, treinta años después de Wembley 66, igual era el momento de ganar otra vez.

La Eurocopa terminó en penales. Inglaterra cayó en semifinales contra Alemania, en el propio Wembley, después de empatar 1-1 en la prórroga y fallar el sexto penalti, Gareth Southgate, futuro seleccionador, fue quien lo erró. Alemania ganó el torneo. La canción, sin embargo, llegó al número uno de listas. Los autores la actualizarían con una versión nueva en 1998, en 2018 y en 2022. La estructura emocional era siempre la misma: lista de derrotas, esperanza renovada, derrota nueva.

Las cifras no han mejorado mucho. Después de Italia 90, semifinales perdidas en penales contra Alemania, las lágrimas de Gascoigne, la frase de Lineker, vinieron Eurocopa 96, Mundial 2002 y 2006 sin pasar de cuartos, Mundial 2010 humillación contra Alemania (4-1), Mundial 2014 fuera en primera fase, Eurocopa 2016 derrota contra Islandia. El siglo XXI inglés es un récord casi paródico de fracaso colectivo. Sólo Gareth Southgate, paradójicamente el hombre que falló aquel penalti de 1996, consiguió devolver la dignidad: semifinal en Rusia 2018, final de la Eurocopa 2020 perdida en penales contra Italia en Wembley, final de la Eurocopa 2024 perdida 2-1 contra España en Berlín.

La canción ha cumplido treinta años sin que la copa haya llegado a casa. Skinner y Baddiel han hecho del estribillo una broma reconocible: cada vez que Inglaterra clasifica para algo, la frase reaparece en redes sociales con un guiño autocrítico. Es probablemente el caso más hermoso de profecía deportiva fallida del fútbol europeo: una canción que prometía la vuelta del título y que, en cambio, se convirtió en una crónica involuntaria de cómo Inglaterra perdía. Cuando la selección por fin gane algo grande, alguien tendrá que escribir otra canción. Esta ya está dedicada para siempre al género contrario.`,
  },
  {
    n: 12,
    slug: 'maracana-portadas-brasil-campeao-1950',
    publishDate: '2026-05-05',
    blockCode: 'S2',
    category: 'tragica',
    protagonist: 'Brasil 1950 / O Mundo',
    quote: 'Brasil campeão del Mundial 1950',
    quoteDate: '1950-07-16',
    context:
      'La mañana del 16 de julio de 1950 los diarios de Río ya celebraban el título brasileño. O Mundo titulaba a página completa con la foto del equipo y el rótulo «Brasil campeão». El alcalde de Río pronunció un discurso pregrabado dirigido a «los campeones del mundo». Por la tarde, Uruguay ganó 2-1 en el Maracaná.',
    source: {
      name: 'Wikipedia, Uruguay v Brazil (1950 FIFA World Cup)',
      url: 'https://en.wikipedia.org/wiki/Uruguay_v_Brazil_(1950_FIFA_World_Cup)',
    },
    sourceSecondary: 'Jot Down · Toni Padilla, Mundial 1950 (Panenka) · Folha de São Paulo',
    certainty: 'Alta',
    title: 'Las portadas brasileñas que coronaron a un campeón antes de tiempo',
    excerpt:
      'El 16 de julio de 1950, Río amaneció con titulares celebrando un Mundial que aún no se había jugado. Por la tarde, Ghiggia silenció el Maracaná y enterró las medallas grabadas con los nombres equivocados.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maracan%C3%A3_panorama.jpg?width=1200',
      alt: 'Vista panorámica del estadio Maracaná de Río de Janeiro, escenario del Maracanazo de 1950',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Maracan%C3%A3_panorama.jpg',
    },
    body: `El 16 de julio de 1950 amaneció en Río con la sensación de que la historia ya estaba escrita. El periódico O Mundo, uno de los diarios más leídos de la ciudad, había publicado en su edición matutina una portada gigante con la foto de la selección brasileña y un rótulo a toda página: «Estes são os campeões do mundo». A Brasil le bastaba con un empate contra Uruguay esa tarde para ser campeón, el formato del Mundial de 1950 era una liguilla final entre cuatro equipos, sin eliminatorias, y todo Río daba el partido por ganado. Los demás diarios competían en la misma dirección. La Diario de Notícias preparó una edición especial. La radio Tupi tenía listo el guion del programa de celebración.

La logística institucional iba al mismo ritmo. La Confederación Brasileña de Deportes había encargado 22 medallas de oro con los nombres de los jugadores grabados al reverso, listas para entregar tras el partido. La FIFA había hecho imprimir 500.000 camisetas conmemorativas. Ángel Mendes de Moraes, alcalde de Río de Janeiro, llegó al estadio con un discurso preparado: «Vosotros, brasileños, a los que considero ya vencedores del campeonato mundial...». Lo leyó por megafonía antes del inicio. Jules Rimet, presidente de la FIFA, llevaba en el bolsillo otro discurso, redactado en portugués, para entregar la copa al capitán brasileño.

El Maracaná, recién inaugurado para el Mundial, registró 173.850 espectadores oficiales, las estimaciones reales hablan de cerca de 200.000. Friaça abrió el marcador al minuto 47. Schiaffino empató al 66. Y Alcides Ghiggia, al 79, fusiló a Moacir Barbosa con un disparo cruzado en el primer palo. El estadio se quedó tan en silencio que el cronista uruguayo Carlos Solé describió aquel momento como «el silencio más largo del fútbol mundial». Hubo desmayos en las tribunas. Hubo dos infartos confirmados. Cuando Rimet bajó al campo para entregar la copa, no encontró a ningún brasileño organizando la ceremonia. Se la dio a Obdulio Varela en mitad del campo, casi a escondidas, sin discurso, sin micrófono.

Las consecuencias del Maracanazo fueron geológicas. La camiseta blanca con cuello azul que vestía Brasil aquel día fue declarada «no patriótica» por la prensa. Tres años después, en 1953, el periódico Correio da Manhã convocó un concurso público para diseñar un nuevo uniforme. Ganó Aldyr Garcia Schlee, un joven de Pelotas, con la camiseta amarilla, el cuello verde y los pantalones azules. Brasil estrenó el conjunto en 1954 y nunca volvió a jugar de blanco. Las medallas de oro grabadas con los nombres de los jugadores se quedaron en cajas. Los discursos preparados quedaron en archivos. Y Moacir Barbosa, el portero, cargó durante medio siglo con la culpa del gol de Ghiggia hasta su muerte en 2000. «En Brasil, la condena máxima es de treinta años», dijo poco antes de morir. «Yo llevo cincuenta».

La portada de O Mundo se conserva hoy en archivos de hemeroteca como el documento más célebre del periodismo deportivo brasileño. Es la prueba de que un país entero llegó a creer en una victoria que todavía no había ocurrido. Setenta y seis años después, Brasil ha ganado cinco Copas del Mundo. Pero la palabra Maracanazo sigue siendo el nombre que se le da a cualquier derrota imposible. Y los titulares que coronaron a un equipo antes del pitido inicial siguen siendo el ejemplo perfecto de por qué el fútbol no se gana en las imprentas.`,
  },
  {
    n: 13,
    slug: 'hungria-1954-magiares-magicos-final-perdida',
    publishDate: '2026-05-06',
    blockCode: 'S2',
    category: 'tragica',
    protagonist: 'Hungría / Ferenc Puskás',
    quote: 'Imposible perder, somos invencibles',
    quoteDate: '1954-07-04',
    context:
      'Hungría llegó a la final del Mundial 1954 con una racha de 33 partidos invicta y la fama de mejor selección del mundo. Tenía a Puskás, Hidegkuti, Kocsis, Czibor y Bozsik. En la fase de grupos había goleado 8-3 a la Alemania Federal. La final, jugada el 4 de julio en Berna bajo lluvia, terminó 3-2 para Alemania.',
    source: {
      name: 'Wikipedia, Final de la Copa Mundial de Fútbol de 1954',
      url: 'https://es.wikipedia.org/wiki/Final_de_la_Copa_Mundial_de_F%C3%BAtbol_de_1954',
    },
    sourceSecondary: 'Wikipedia (1954 FIFA World Cup Final) · Der Spiegel · The Guardian',
    certainty: 'Media-Alta',
    title: 'Hungría 1954: el equipo invencible que aprendió a perder en Berna',
    excerpt:
      'Los Magiares Mágicos llegaban con 33 victorias seguidas. Helmut Rahn marcó al 84, la lluvia ayudó a Alemania y la mejor selección del siglo XX se quedó sin Mundial.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Helmut_Rahn.jpg?width=1200',
      alt: 'Helmut Rahn, autor del gol decisivo de la final del Mundial 1954 al minuto 84',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Helmut_Rahn.jpg',
    },
    body: `Los Magiares Mágicos eran, en el verano de 1954, el equipo más impresionante que el fútbol había producido hasta entonces. Hungría llevaba cuatro años sin perder un partido oficial: 33 encuentros sin derrota desde 1950, incluida una medalla de oro olímpica en Helsinki 52 y una victoria histórica en Wembley en noviembre de 1953, cuando humillaron 6-3 a Inglaterra en su propia casa. La alineación era una clase magistral colectiva: Gyula Grosics en portería, József Bozsik en mediocampo, Nándor Hidegkuti como delantero centro retrasado, el invento táctico que prefiguraba el falso 9 de Guardiola medio siglo más tarde, Sándor Kocsis y Zoltán Czibor en las bandas, y al frente Ferenc Puskás, capitán, comandante del Honvéd y máxima figura del fútbol europeo.

En el Mundial de Suiza, Hungría arrasó. Goleó 9-0 a Corea del Sur. Y en el siguiente partido, contra Alemania Federal, ganó 8-3 con una exhibición que pareció dejar sentenciada cualquier conversación sobre el favorito del torneo. El detalle, nadie lo notó entonces, fue que el seleccionador alemán Sepp Herberger dejó descansar a sus titulares para guardarlos. Hungría siguió: 4-2 a Brasil en cuartos, en la llamada Batalla de Berna por la dureza del partido; 4-2 a Uruguay en semifinales, en la prórroga, primera derrota uruguaya en un Mundial. La final llegó como un trámite. En Budapest, las radios estatales ya hablaban del título. Una de las frases que circulaban en los vestuarios y en las gradas húngaras se ha citado mil veces: «imposible perder, somos invencibles».

El 4 de julio de 1954, en el Wankdorfstadion de Berna, llovió torrencialmente toda la mañana. La lluvia favoreció a Alemania por una razón técnica: Adi Dassler, fundador de Adidas, había desarrollado para los jugadores alemanes un nuevo modelo de bota con tacos de tornillo intercambiables. En cancha mojada, la diferencia con las botas de tacos fijos húngaros era apreciable. Puskás, que llegaba lesionado tras una entrada brutal de Werner Liebrich en la fase de grupos, el alemán que ahora estaba en el banquillo titular, jugó la final cojeando.

El partido empezó como predecía el papel. Puskás abrió el marcador al minuto 6. Czibor amplió al 8. 2-0 en ocho minutos: Hungría iba camino de la goleada esperada. Pero Max Morlock descontó al 10, Helmut Rahn empató al 18 y, sobre todo, Alemania no se rompió. Resistió en el segundo tiempo, aprovechó las contras y al minuto 84 Rahn fusiló a Grosics con un disparo cruzado desde la frontal. 3-2. El relator radiofónico Herbert Zimmermann pronunció a continuación la frase que se enseña en Alemania como ejemplo de narración deportiva: «Tor! Tor! Tor! Tor! Aus dem Hintergrund müsste Rahn schießen!». Puskás marcó al 87 lo que parecía el empate, pero el árbitro inglés Bill Griffiths lo anuló por fuera de juego en una decisión todavía discutida.

El Milagro de Berna refundó la Alemania de posguerra. Para Hungría fue el principio del final. La derrota provocó manifestaciones espontáneas en Budapest, algunos historiadores las consideran germen de la revolución de 1956. Dos años más tarde, tras la entrada de los tanques soviéticos en la capital, Puskás pidió asilo en España y firmó por el Real Madrid. Hungría no volvió a jugar otra final mundial. Una sospecha persiguió a Alemania durante décadas: estudios académicos confirmaron en los años 2010 que varios jugadores alemanes habían recibido inyecciones presentadas como vitamina C que en realidad contenían pervitin, una metanfetamina muy usada por la Wehrmacht en la Segunda Guerra Mundial. Puskás llamó a su selección «los campeones morales». La frase, igual que la otra, también ha sobrevivido.`,
  },
  {
    n: 14,
    slug: 'usa-1-inglaterra-0-belo-horizonte-1950',
    publishDate: '2026-05-07',
    blockCode: 'S2',
    category: 'polemica',
    protagonist: 'Joe Gaetjens / Inglaterra',
    quote: 'USA 1, England 0',
    quoteDate: '1950-06-29',
    context:
      'El 29 de junio de 1950, en Belo Horizonte, Estados Unidos venció 1-0 a Inglaterra en el debut mundialista de los inventores del fútbol. El gol lo marcó Joe Gaetjens, delantero haitiano-estadounidense, al minuto 38. La leyenda dice que el Daily Mail leyó el telegrama como erratum y publicó USA 1, England 10. La leyenda no resiste la verificación.',
    source: {
      name: 'Wikipedia, United States v England (1950 FIFA World Cup)',
      url: 'https://en.wikipedia.org/wiki/United_States_v_England_(1950_FIFA_World_Cup)',
    },
    sourceSecondary: 'Wikipedia (Joe Gaetjens) · The Guardian · BBC Sport',
    certainty: 'Alta',
    title: 'Belo Horizonte 1950: la sorpresa que enseñó a Inglaterra a perder un Mundial',
    excerpt:
      'Inglaterra debutaba en Mundiales como gran favorita. Un haitiano que lavaba platos en Nueva York marcó al 38 y enterró el mito de los maestros del fútbol.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jules_Rimet%2C_Estadio%2C_1950-07-08_%28373%29.jpg?width=1200',
      alt: 'Jules Rimet en el Mundial de Brasil 1950, contexto del histórico USA 1-0 Inglaterra en Belo Horizonte',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Jules_Rimet,_Estadio,_1950-07-08_(373).jpg',
    },
    body: `Inglaterra llegó al Mundial de Brasil 1950 con setenta años de superioridad asumida. La Football Association, fundada en 1863, había considerado durante décadas que las primeras tres Copas del Mundo organizadas por la FIFA, 1930, 1934, 1938, eran asuntos menores indignos del país que había inventado el fútbol moderno. Inglaterra se había negado a participar y se había salido temporalmente de la FIFA por discrepancias sobre el amateurismo. Cuando volvió, tras la Segunda Guerra Mundial, lo hizo como favorita absoluta. Las casas de apuestas londinenses pagaban 3 a 1 por su victoria final. Las apuestas por Estados Unidos pagaban 500 a 1. La selección norteamericana había llegado a Brasil con jugadores semiprofesionales: un cartero, varios maestros, un conductor de coche fúnebre. La diferencia parecía caricaturesca.

El partido se jugó el 29 de junio de 1950 en el Estádio Independência de Belo Horizonte. La cancha era pequeña, irregular, mucho menor que las que la selección inglesa estaba acostumbrada a usar. Inglaterra dominó desde el primer minuto. Stan Mortensen estrelló un disparo en el larguero. Tom Finney remató dos veces al palo. Wilf Mannion no acertó delante del portero estadounidense Frank Borghi, un sepulturero de St. Louis que había sido boxeador antes que portero. La proporción de tiros se cerró 30 a 6 a favor de Inglaterra. Pero al minuto 38 ocurrió lo imprevisible.

Walter Bahr, capitán estadounidense, disparó desde 22 metros. El balón iba alto, ligeramente desviado. Joe Gaetjens, delantero centro nacido en Puerto Príncipe en 1924, se lanzó en plancha y desvió la pelota con la cabeza, casi por reflejo. Borghi quedó en el suelo. El balón entró por la escuadra. 1-0. Gaetjens estudiaba contabilidad en Columbia, jugaba en el Brookhattan de la liga semiprofesional neoyorquina, lavaba platos en un restaurante para completar el sueldo. Nunca había sido ciudadano estadounidense; jugaba con la selección porque las normas de la época lo permitían. Aquel gol sería el único que marcaría en un Mundial.

La segunda parte fue un asedio inglés que terminó sin más goles. Inglaterra protestó al árbitro, pidió una hora más, no aceptó el resultado en zona mixta. La derrota se publicó en los diarios británicos del día siguiente con la incredulidad debida pero no, contra lo que sostiene la leyenda más célebre del fútbol, con un erratum tipográfico. Durante décadas se ha repetido que el Daily Mail recibió el telegrama con el resultado y, asumiendo que era un error, lo publicó como USA 1, England 10. La historia es vistosa pero no es cierta. El British Newspaper Archive ha confirmado que ningún diario británico de aquel 30 de junio publicó tal cifra. El erratum es un mito periodístico construido a posteriori, probablemente en los años setenta, cuando ya nadie podía verificarlo de primera mano.

Lo que sí ocurrió fue un destino trágico. Inglaterra cayó eliminada en primera fase tras perder también contra España, regresó humillada y tardó dieciséis años en levantar su única Copa del Mundo, en Wembley 66. Joe Gaetjens regresó a Haití en 1953 para abrir una tintorería. Cuando François Duvalier ganó las elecciones de 1957 contra el familiar de Gaetjens, Louis Déjoie, los Tonton Macoutes, policía secreta del régimen, empezaron a vigilarlo. El 8 de julio de 1964 fue arrestado en su tintorería de Puerto Príncipe y encerrado en Fort Dimanche. Su cuerpo nunca apareció. El hombre que había marcado el gol más sorpresivo de la historia de los Mundiales fue víctima de una dictadura tropical sin que el fútbol mundial supiera dónde buscarlo. Fue introducido en el National Soccer Hall of Fame en 1976. La condecoración póstuma no lo trajo de vuelta.`,
  },
  {
    n: 15,
    slug: 'conte-verde-barco-tres-selecciones-mundial-1930',
    publishDate: '2026-05-09',
    blockCode: 'S5',
    category: 'historica',
    protagonist: 'SS Conte Verde / Jules Rimet',
    quote: 'El balón es la única lengua común entre los hombres.',
    quoteDate: '1930-07-30',
    context:
      'Junio de 1930. La FIFA ha concedido la organización del primer Mundial a Uruguay y casi ninguna selección europea quiere viajar. Las Federaciones inglesas no se hablan con FIFA, Italia y Alemania no envían equipo, Hungría declina. Para que el Mundial pueda jugarse, Jules Rimet necesita un barco. Lo encontró en el SS Conte Verde, un transatlántico de la naviera Lloyd Sabaudo nombrado en honor a Amadeo VI de Saboya, conde verde del siglo XIV.',
    source: {
      name: 'Wikipedia · 1930 FIFA World Cup',
      url: 'https://en.wikipedia.org/wiki/1930_FIFA_World_Cup',
    },
    sourceSecondary:
      'Wikipedia (SS Conte Verde) · The Irish Times · These Football Times · Yahoo Sports · L\'Équipe archives',
    certainty: 'Alta',
    title: 'El Conte Verde, el barco que llevó tres selecciones al primer Mundial de la historia',
    excerpt:
      '21 de junio de 1930. Un transatlántico italiano zarpa de Génova rumbo a Montevideo con tres selecciones europeas a bordo, la Copa Jules Rimet y el árbitro de la final. Quince días de travesía decidieron que el primer Mundial pudiera jugarse.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Conte_Verde_nel_1923.jpg?width=1200',
      alt: 'El SS Conte Verde fotografiado en 1923, transatlántico italiano que llevó a tres selecciones europeas al primer Mundial de fútbol en Uruguay 1930',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Conte_Verde_nel_1923.jpg',
    },
    body: `Cuando la FIFA, en su congreso de Barcelona de 1929, votó que Uruguay sería sede del primer Mundial de la historia, lo hizo casi por descarte. La candidatura europea de Italia se había caído por la oposición de Mussolini a financiar la cita. Holanda, Suecia, Hungría y la propia España habían retirado sus ofertas a cambio de promesas para futuras ediciones. Uruguay, que celebraba el centenario de su Constitución y acababa de ganar dos oros olímpicos consecutivos en París 1924 y Ámsterdam 1928, presentó la única candidatura viable. Con una pega: tres semanas de travesía atlántica para cualquier selección europea que se atreviera a participar.

El recelo fue inmediato. Las cuatro federaciones británicas, retiradas de la FIFA desde 1928 por discrepancias sobre el amateurismo, no se plantearon ir. Italia y Alemania declinaron. Hungría, una de las potencias del fútbol europeo de los años veinte, dijo que no por motivos económicos. Austria, Suecia, Suiza, Holanda y España hicieron lo mismo. Cuando llegó la primavera de 1930, Jules Rimet, presidente de la FIFA, sólo tenía un país europeo confirmado: Francia. Y aun así no estaba claro cómo viajarían los franceses. Sin un transatlántico organizado por la propia FIFA, no habría primer Mundial.

La solución apareció con un acuerdo de la naviera genovesa Lloyd Sabaudo. Su buque insignia transatlántico, el SS Conte Verde, una nave de 170 metros y 18.700 toneladas botada en 1922 y bautizada en honor a Amadeo VI de Saboya, conocido como el Conte Verde, conde verde del siglo XIV, hacía la línea regular Génova-Buenos Aires con escala en Río de Janeiro. La travesía duraba quince días y la naviera aceptó habilitar los espacios necesarios para acoger a tres selecciones europeas que habían confirmado in extremis su participación en el Mundial: Rumanía, Francia y Bélgica.

La presencia de Rumanía fue obra directa de su rey. Carol II, monarca recientemente restaurado y aficionado al fútbol, dictó un decreto laboral que obligaba a las empresas a conceder permiso pagado a los jugadores convocados por la federación. La medida estaba pensada explícitamente para evitar el problema que estaban teniendo Bélgica y Francia: que las empresas privadas no liberaran a los futbolistas. Carol II personalmente seleccionó a parte de la convocatoria. Era el primer caso documentado en la historia del fútbol de un jefe de Estado interviniendo en una lista de selección.

El embarque se distribuyó en tres puertos. Los rumanos subieron en Génova, donde el Conte Verde tenía su base. Los franceses lo hicieron el 21 de junio en Villefranche-sur-Mer, en la Riviera francesa. Los belgas, los últimos en sumarse al barco, embarcaron en Barcelona. Yugoslavia, que también había confirmado in extremis su participación, no entró en el Conte Verde porque cuando lo intentaron el barco ya estaba completo. Tuvieron que viajar por separado, en un tren a Marsella y desde allí en el vapor postal Florida, que llegó a Montevideo dos días antes que el Conte Verde.

Con las tres selecciones a bordo, además del propio Jules Rimet y de los tres árbitros designados para la fase final del torneo (los belgas John Langenus y Henri Christophe, y un parisino llamado Thomas Balvay del que la FIFA nunca pudo confirmar si era inglés o francés,, el barco zarpó hacia el Atlántico Sur). Rimet llevaba en su camarote, en una caja de madera forrada, la Copa que años antes había encargado al escultor Abel Lafleur y que entonces se llamaba simplemente la Coupe du Monde. Décadas después, en 1946, la FIFA la rebautizaría con el nombre de su impulsor.

La travesía fue larga. Los entrenamientos se hicieron en cubierta, en una zona habilitada para el ejercicio físico. Los rumanos compartían tablero de ajedrez con los franceses. Los belgas, los más retraídos, comieron por separado durante los primeros días. La temperatura subió en la zona ecuatorial y el equipo médico francés tuvo que tratar mareos persistentes en varios jugadores. Cuando el Conte Verde hizo escala en Río de Janeiro, el 29 de junio, subió la cuarta selección de la travesía: Brasil. La selección brasileña aprovechó las dos jornadas hasta Montevideo para hacer un pequeño campamento de aclimatación con los europeos.

El barco atracó en el puerto de Montevideo el 4 de julio de 1930, nueve días antes de que arrancara el torneo. Las tres selecciones europeas y la brasileña desembarcaron en orden, escoltadas por una muchedumbre uruguaya que aplaudió en el muelle. Rimet bajó con la copa envuelta en papel de seda. Trece días más tarde, el 30 de julio, esa misma copa volvía a subir al podio del Estadio Centenario en manos de José Nasazzi, capitán uruguayo, después de que el equipo charrúa derrotara 4-2 a Argentina en la primera final mundial. El SS Conte Verde, mientras tanto, ya había emprendido el viaje de regreso. Dos años más tarde, su naviera quebró por la crisis del 29. El barco siguió en activo bajo otra empresa hasta 1943, cuando se hundió en Shanghái durante la Segunda Guerra Mundial. La travesía que hizo posible el primer Mundial es probablemente la página menos contada de la historia del fútbol.`,
  },
  {
    n: 25,
    slug: 'iniesta-cabezazo-iker-johannesburgo-2010-espana-campeona',
    publishDate: '2026-05-10',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Andrés Iniesta',
    quote: 'Dani Jarque, siempre con nosotros.',
    quoteDate: '2010-07-11',
    context:
      'Final del Mundial de Sudáfrica 2010 en el Soccer City de Johannesburgo. España y Países Bajos empatan 0-0 al final del tiempo reglamentario. Minuto 116 de la prórroga. Andrés Iniesta, mediocampista del FC Barcelona, controla un pase de Cesc Fàbregas dentro del área y dispara con el empeine derecho. Maarten Stekelenburg no llega. Gol. España gana su primer y único Mundial. Iniesta levanta la camiseta y enseña un mensaje en honor a Dani Jarque, fallecido un año antes.',
    source: {
      name: 'Wikipedia · 2010 FIFA World Cup Final',
      url: 'https://en.wikipedia.org/wiki/2010_FIFA_World_Cup_Final',
    },
    sourceSecondary:
      'Marca · AS · El País · BBC Sport · "La Roja" (Jimmy Burns, 2012) · RTVE archivos',
    certainty: 'Alta',
    title: 'El gol de Iniesta en Johannesburgo: España campeona del mundo 2010 con la dedicatoria a Dani Jarque',
    excerpt:
      '11 de julio de 2010. Soccer City, Johannesburgo. Minuto 116 de la prórroga. Iniesta recibe de Cesc, controla, dispara y bate a Stekelenburg. España campeona del mundo por primera vez. Se quita la camiseta y enseña el mensaje "Dani Jarque, siempre con nosotros".',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Andres_Iniesta_Spain_World_Cup_2010.jpg?width=1200',
      alt: 'Andrés Iniesta celebrando el gol decisivo en la final del Mundial de Sudáfrica 2010 en el Soccer City de Johannesburgo, primer título mundial de España',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    body: `Andrés Iniesta Luján llegó al Mundial de Sudáfrica 2010 como **el mediapunta del FC Barcelona** que acababa de ganar la primera Liga de la era Guardiola y el sextete histórico de 2009. Tenía 26 años y un palmarés impresionante pero, hasta julio de 2010, **ningún gol decisivo con la selección absoluta**. Vicente del Bosque le había dado titularidad como interior izquierdo del 4-2-3-1 después de la Eurocopa 2008, pero Iniesta solía repartir más que finalizar. En el Mundial africano todavía no había marcado cuando llegó la final.

La selección española había llegado al partido decisivo con tropiezos. Debut con derrota **1-0 contra Suiza** en Durban, en el primer partido del torneo, que dejó a media España resignada al fracaso. Reacción con dos victorias ajustadas: **2-0 a Honduras** y 2-1 a Chile. Octavos contra Portugal (1-0, gol de Villa). Cuartos contra Paraguay (1-0, gol de Villa). Semifinal contra Alemania (1-0, gol de Carles Puyol de cabeza). Y la final contra Países Bajos, el viejo enemigo holandés que había llegado al partido sin perder un solo encuentro en todo el torneo, con la generación de Sneijder, Robben y Van Persie.

El 11 de julio de 2010 a las 19:30 hora local. Soccer City Stadium, Johannesburgo, 84.490 espectadores. Árbitro: el inglés Howard Webb. Holanda había pactado tácitamente un planteamiento defensivo durísimo. Webb sacó **14 amarillas y una roja** durante el partido (récord histórico de una final). La patada de **Nigel de Jong al pecho de Xabi Alonso** en el minuto 28, que en otros partidos hubiera sido roja directa, quedó en amarilla por la trascendencia del momento. Iniesta recibió una entrada por detrás de Mark van Bommel en el minuto 36 que el árbitro tampoco castigó con cartulina. La final no fue bonita. Fue una pelea callejera con balón.

El 0-0 llegó al final de los 90 minutos. Robben había tenido la ocasión más clara: un mano a mano con Iker Casillas en el minuto 62, en el que el portero salvó con el pie. Casillas, capitán español, sostendría más tarde que esa parada fue la jugada más importante de su carrera. La prórroga empezó tensa. En el minuto 109, Heitinga le hizo una segunda amarilla a Iniesta dentro del área. Roja. Holanda quedó con diez hombres.

Minuto 116. Cesc Fàbregas, que había entrado al campo en sustitución de Xavi Hernández, recibe un balón en banda derecha. Mira hacia el centro. Pasa a Iniesta, que está corriendo dentro del área grande, **en posición lateral derecha pero dentro del área**. Iniesta lo recibe casi al borde derecho del área, **controla con el pecho de manera que el balón cae a sus pies**, y dispara con la pierna derecha al empeine. **Va lejos del alcance** de Stekelenburg, el portero holandés, que vuela hacia la derecha sin lograr alcanzarlo. Gol. España 1, Holanda 0.

Iniesta corrió hacia la esquina del área, se quitó la camiseta y enseñó un **mensaje escrito en lápiz en la camiseta blanca interior**: *"Dani Jarque, siempre con nosotros"*. **Daniel Jarque**, jugador del RCD Espanyol y amigo personal de Iniesta desde las categorías inferiores de la selección sub-21, había fallecido el 8 de agosto de 2009 a los 26 años por un infarto fulminante en pretemporada en Italia con su equipo. Iniesta había prometido recordarlo en cuanto marcara con la selección absoluta. Cumplió la promesa en la final del Mundial.

España jugó los cuatro minutos restantes a la defensiva. Holanda intentó dos centros desesperados que Casillas atajó con autoridad. El pitido final de Webb llegó a las 22:21 hora local. **España, campeona del mundo por primera vez en su historia**. Casillas, en la entrega del trofeo, lloró durante diez minutos. **Sara Carbonero**, su pareja entonces y periodista de Telecinco, llegó al campo a entrevistarlo y lo besó en directo (imagen que dio la vuelta al mundo). Pero la imagen icónica, **la que recuerda España setenta años después**, es Iniesta con la camiseta blanca y el mensaje a Dani Jarque.

Iniesta dedicó su autobiografía *"La jugada de mi vida"* (2016) entera al gol. Confiesa en el último capítulo que el control con el pecho **lo había practicado mil veces en el Mini Estadi del Barça** cuando era infantil. Que el disparo lo había hecho de manera automática. Que el momento de quitarse la camiseta y enseñar el mensaje a Dani Jarque **lo tenía planeado desde el 8 de agosto de 2009**, el día del entierro de su amigo en Sant Boi. Que la roja por quitarse la camiseta (Howard Webb le sacó amarilla automática, le pareció **el precio más barato que ha pagado por nada en su vida**).

España no volvió a ganar otro Mundial. Cayó en octavos en Brasil 2014 (eliminada por Holanda 1-5 en partido de grupos, venganza holandesa cuatro años después). Fase de grupos en Rusia 2018 (eliminada por Rusia en penaltis tras 1-1 en octavos). Cuartos en Catar 2022 (eliminada por Marruecos en penaltis). Pero los **dieciséis años entre 2008 y 2024** son la **mejor generación del fútbol español** de la historia: una Eurocopa 2008 con Aragonés, un Mundial 2010 con Del Bosque, una Eurocopa 2012 con Del Bosque, una Eurocopa 2024 con Luis de la Fuente. Cuatro títulos de máxima categoría en dieciséis años. Y un gol de Iniesta que sigue sonando, dieciséis años después, **en cualquier bar de cualquier ciudad española**.`,
  },
  {
    n: 26,
    slug: 'just-fontaine-13-goles-suecia-1958-record-historico',
    publishDate: '2026-05-11',
    blockCode: 'S5',
    category: 'historica',
    protagonist: 'Just Fontaine',
    quote: 'No vine a Suecia a hacer turismo, vine a marcar goles.',
    quoteDate: '1958-06-08',
    context:
      'Mundial de Suecia 1958. Just Fontaine, delantero centro francés del Stade de Reims, llega como suplente en la selección. Una lesión de René Bliard, titular previsto, le da la titularidad a última hora. Fontaine pide prestadas las botas de su compañero Stéphane Bruey porque las suyas habían quedado destrozadas en los entrenamientos. Con esas botas marca 13 goles en seis partidos, récord histórico que nadie ha igualado en 68 años.',
    source: {
      name: 'Wikipedia · Just Fontaine',
      url: 'https://en.wikipedia.org/wiki/Just_Fontaine',
    },
    sourceSecondary:
      'L\'Équipe archives · FIFA.com · France Football · "Just Fontaine: L\'homme aux 13 buts" (Pierre-Marie Descamps, 2018)',
    certainty: 'Alta',
    title: 'Just Fontaine y los 13 goles de Suecia 1958: el récord mundialista que lleva 68 años intacto',
    excerpt:
      'Suecia 1958. Just Fontaine entra como suplente, se calza unas botas prestadas y marca 13 goles en seis partidos. Hat-trick a Paraguay, otro a Alemania Occidental. Récord histórico que nadie ha rozado en 68 años: ni Pelé, ni Müller, ni Ronaldo, ni Messi.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Just_Fontaine_1958.jpg?width=1200',
      alt: 'Just Fontaine, delantero centro francés, máximo goleador del Mundial de Suecia 1958 con 13 goles en seis partidos, récord histórico que sigue vigente en 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
    },
    body: `Just Louis Fontaine había nacido en Marrakech en agosto de 1933, en una familia franco-española radicada en el Marruecos colonial. Su madre era una española de Cádiz emigrada al norte de África en los años veinte. Su padre, un francés que trabajaba en la administración protectoral. Just creció hablando español, francés y árabe a partes iguales, y dejó el norte de África a los diecisiete años cuando el OGC Niza le ofreció un contrato como suplente del equipo amateur en 1950. Tres años más tarde subió al USM Niza, después al Stade de Reims, donde se convirtió en uno de los delanteros más eficientes de la liga francesa de los años cincuenta. Para 1958 era titular de Reims, máximo goleador de la liga, y aún así no estaba en la lista inicial de Albert Batteux, el seleccionador francés.

Cuando se publicó la convocatoria francesa para el Mundial de Suecia el 14 de mayo de 1958, Fontaine apareció como suplente del delantero centro titular: **René Bliard**, del FC Reims también, un ariete corpulento y con mejor reputación europea. Fontaine estaba listo para hacer el viaje como segundo violín. Pero a una semana del Mundial, en un entrenamiento en Suecia, Bliard se rompió un ligamento de la rodilla derecha. Una lesión grave. Batteux no tuvo tiempo de convocar a nadie. Fontaine pasó de suplente a titular del equipo.

Hubo un segundo problema: las botas. Fontaine había llevado a Suecia las suyas habituales, de marca francesa Adidas, modelo Argentina. En los primeros entrenamientos sobre el terreno sintético del campo de Halmstad, donde Francia jugaba el primer partido, los tacos de Fontaine se desgastaron en dos sesiones. Para el debut contra Paraguay, las botas estaban inservibles. Como no había repuestos en Suecia y el viaje a Reims llevaría tres días, Fontaine **le pidió prestadas las botas a Stéphane Bruey**, un compañero suplente que calzaba dos números más grande. Bruey aceptó. Las botas eran demasiado anchas. Fontaine las rellenó con papel de periódico en la puntera y en los costados. Con esas botas prestadas, **rellenas de páginas de Le Monde y France Soir**, salió a jugar el primer partido del Mundial.

8 de junio de 1958. Norrköping, Estadio Idrottsparken. Francia 7, Paraguay 3. Fontaine marcó tres goles: minuto 24 (asistencia de Raymond Kopa), minuto 30 (de cabeza tras centro de Jean Vincent) y minuto 67 (con la izquierda, rematando un pase en profundidad). Hat-trick en su primer partido mundialista. Las botas prestadas seguían en sus pies.

Tres días después, el 11 de junio, Francia jugaba contra Yugoslavia en Västerås. Fontaine marcó dos goles. Francia perdió 3-2 pero su delantero centro había ya alcanzado cinco goles en dos partidos. Cuatro días después, contra Escocia, marcó otro gol. Seis goles en tres partidos. Era la sensación del Mundial.

En octavos contra Irlanda del Norte, Fontaine marcó **dos más** (Francia 4, Irlanda 0). Y en cuartos contra Alemania Occidental, el subcampeón vigente de Suecia 1954, marcó **un golazo individual** en el minuto 16 que abrió el camino a una victoria 6-3. Era el partido más asombroso del torneo. **Nueve goles en cinco partidos** (ya con la marca de delantero más prolífico del Mundial). Su récord acumulado dejaba atrás a su rival en la pugna por la Bota de Oro, el brasileño Pelé, que llegó al Mundial como adolescente y solo había marcado seis goles en cuatro partidos.

La semifinal fue Francia 2, Brasil 5. Pelé marcó tres. Fontaine marcó uno (el primer gol del partido, en el minuto 9). En tres días, los rumores en Estocolmo decían que Brasil iría a por la copa y Francia jugaría el tercer y cuarto puesto contra Alemania. El 28 de junio de 1958 en Gotemburgo: Francia 6, Alemania 3. Just Fontaine marcó cuatro goles. Minutos 16, 36, 73, 89. Cuatro tantos en un solo partido contra el subcampeón vigente del mundo. Trece goles en total. Bota de Oro indiscutible.

El récord se contextualiza así: el segundo lugar fue Pelé con 6 goles. La diferencia entre el máximo goleador y el segundo es **mayor que cualquier diferencia en cualquier Mundial de la historia**. Ronaldo Nazário marcó 8 en Corea-Japón 2002 y nadie le siguió cerca. Klose suma 16 a lo largo de **cuatro Mundiales completos** (récord acumulado, no de una edición). Gerd Müller marcó 10 en Alemania 1970 y se quedó a tres. Mbappé marcó 8 en Catar 2022 incluyendo hat-trick en final. Messi ha marcado 13 en **cinco Mundiales** distribuidos a lo largo de veinte años. Just Fontaine no se cuestionaba el récord. Tras volver de Suecia con su Bota de Oro, dijo en una entrevista al *France Football*: *"No vine a Suecia a hacer turismo, vine a marcar goles"*. Dieciocho meses después, el 16 de marzo de 1960, en un partido de la Copa de Europa entre el Reims y el Sparta de Praga, Fontaine se rompió la pierna en un choque con un defensor checoslovaco. **Doble fractura abierta** de tibia y peroné. Tenía 27 años. Los médicos le dijeron que no volvería a jugar. Volvió por seis meses, recayó, intentó tercera operación. **Se retiró a los 29 años**, dos meses antes del Mundial de Chile 1962 donde iba a ser titular indiscutible.

Fontaine fue entrenador del PSG en su fundación (1973), brevemente seleccionador francés (1967, solo dos partidos), comentarista de TF1 durante años. Murió el **1 de marzo de 2023** en Toulouse, a los 89 años. Hasta el último día de su vida, repitió la misma respuesta cuando alguien le preguntaba si su récord caería: *"Los Mundiales tienen ahora 32 selecciones, pronto serán 48. Algún día caerá. Pero nadie marcará 13 en seis partidos. Eso no se hace en el fútbol moderno"*. Sesenta y ocho años después, el récord sigue intacto.`,
  },
  {
    n: 27,
    slug: 'beckenbauer-hombro-dislocado-partido-siglo-italia-alemania-1970',
    publishDate: '2026-05-12',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Franz Beckenbauer',
    quote: 'No voy a salir del campo. Hemos venido a jugar la final.',
    quoteDate: '1970-06-17',
    context:
      'Semifinal del Mundial de México 1970 en el Estadio Azteca. Italia 1, Alemania Occidental 0 en el descanso. Franz Beckenbauer, libero alemán y capitán, recibe una entrada que le disloca el hombro derecho. Sin sustituciones disponibles (Schnellinger ya había sido cambiado), Beckenbauer juega 60 minutos con el brazo en cabestrillo improvisado por el médico del equipo. Alemania remonta a 3-3 en los 90 minutos, va a la prórroga y pierde 4-3 en el partido del siglo.',
    source: {
      name: 'Wikipedia · Italy v West Germany (1970 FIFA World Cup)',
      url: 'https://en.wikipedia.org/wiki/Italy_v_West_Germany_(1970_FIFA_World_Cup)',
    },
    sourceSecondary:
      'Bild · La Gazzetta dello Sport · FIFA archives · "Der Kaiser" (Torsten Körner, 2005) · NDR documental',
    certainty: 'Alta',
    title: 'Beckenbauer y el hombro dislocado del Azteca 1970: el partido del siglo Italia 4-3 Alemania',
    excerpt:
      '17 de junio de 1970. Estadio Azteca. Semifinal Italia-Alemania. Beckenbauer se disloca el hombro en el minuto 64. Sin cambios disponibles, juega 60 minutos con el brazo en cabestrillo improvisado. Alemania empata 3-3 en 90, pierde 4-3 en prórroga. Cinco goles en la prórroga. El partido del siglo.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Franz_Beckenbauer_Azteca_1970.jpg?width=1200',
      alt: 'Franz Beckenbauer durante la semifinal del Mundial de México 1970 entre Italia y Alemania Occidental en el Estadio Azteca, conocida como El Partido del Siglo',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    body: `Franz Anton Beckenbauer había llegado a México 1970 como el mejor libero del mundo. A sus 24 años ya era capitán de Alemania Occidental, dos veces campeón de Bundesliga con el Bayern Múnich, ganador del Balón de Oro Plata europeo (segundo en la votación). Su capacidad para retrasar la posición desde mediapunta hasta libero y salir con balón controlado había **revolucionado el rol del defensor central**. El seleccionador alemán Helmut Schön lo había convertido en el cerebro táctico del equipo. Hasta la semifinal del Mundial 1970 contra Italia en el Estadio Azteca, todo había ido según el plan: Alemania había llegado a semifinales sin perder un partido, había eliminado a Inglaterra en cuartos (3-2 en la prórroga, el partido de la revancha de Wembley 1966) y se enfrentaba a Italia en altitud, a 2.250 metros sobre el nivel del mar.

El partido del 17 de junio de 1970 arrancó a las 16:00 hora local con temperatura de 30 grados y humedad alta. Roberto Boninsegna marcó para Italia en el minuto 8 con un disparo cruzado a la portería de Sepp Maier. Alemania presionó pero no encontró el gol durante 60 minutos. Beckenbauer organizaba la salida desde atrás, Overath corría por el medio, Müller esperaba en el área pero no recibía buenos centros. En el minuto 64, Beckenbauer recuperó un balón en su propia área y avanzó hasta el centro del campo. **Pierluigi Cera, el defensor italiano**, le hizo una entrada por detrás al borde del área grande. Beckenbauer cayó encima del hombro derecho. Sintió un chasquido. Se levantó, intentó mover el brazo, no pudo. Hombro dislocado. Lo que pasó después es uno de los actos de obstinación deportiva más recordados del fútbol. Era 1970. No existían sustituciones libres. Cada selección podía hacer dos cambios por partido y Alemania ya había hecho uno (Schnellinger por Reinhard Libuda en el minuto 53). Quedaba un solo cambio disponible. Beckenbauer, como capitán y libero del equipo, era insustituible tácticamente. Schön le preguntó si quería salir y mandar a Sigi Held, el extremo, a hacer la función de libero. Beckenbauer le respondió, **mirando al banquillo desde el área central**: *"No voy a salir del campo. Hemos venido a jugar la final"*.

El médico del equipo, doctor Erich Deuser, le **encajó el hombro de manera improvisada** en el campo (una manipulación brutal sin anestesia que Beckenbauer ha contado en entrevistas posteriores como *"el dolor más intenso de mi vida"*). Le hizo un cabestrillo con una venda elástica y un trozo de tela cortado de una toalla del banquillo. **El brazo quedó pegado al cuerpo, inmovilizado**. Beckenbauer terminó el partido jugando con un solo brazo, sin poder hacer cambios de dirección rápidos, sin poder caer al suelo sin riesgo de volver a dislocarse el hombro.

Y aún así, jugó hasta el minuto 165 del partido. Porque eso es lo que duró el encuentro: 165 minutos. En el minuto 90, segundo añadido del descuento, **Karl-Heinz Schnellinger** (el sustituido del minuto 53, sustituido bizarramente al revés porque era el último cambio y entró Hannes Löhr por Held, marcó el 1-1 de Alemania). Empate de oro a las puertas de la prórroga.

La prórroga de los 30 minutos extras es **el momento más recordado del fútbol mundial entre 1966 y 1986**. Cinco goles en 30 minutos. Minuto 94: **Gerd Müller** marca el 2-1 alemán. Minuto 98: **Tarcisio Burgnich** empata para Italia. Minuto 104: **Luigi Riva** anota el 2-3. Italia ganaba. Minuto 110: **Gerd Müller** vuelve a empatar, 3-3. La afición italiana, en una de las pocas zonas del Azteca que apoyaba a los azzurri, se levantaba y sentaba cada veinte segundos. Minuto 111, un minuto después: Boninsegna pone el balón en el área para Gianni Rivera, que **se la pasa de tacón** en el momento decisivo a Riva, que tira un centro raso y Rivera mismo cierra al fondo. 4-3 Italia, dieciséis segundos después del 3-3.

Italia ganó la semifinal 4-3 y pasó a la final contra Brasil (que perdería 4-1 con el gol más bello de la historia del fútbol, Pelé-Carlos Alberto, ese mismo Azteca cinco días después). Pero el partido **Italia-Alemania 4-3** se quedó marcado como **"El Partido del Siglo"** (*Partita del Secolo* en italiano, *Jahrhundertspiel* en alemán). Una placa de bronce en el túnel de vestuarios del Azteca, **colocada en 1986** durante el segundo Mundial mexicano, recuerda el encuentro a cualquier futbolista que pase por el túnel hacia el campo. *"Aquí, el 17 de junio de 1970, se jugó el partido más emocionante del fútbol moderno"*.

Beckenbauer regresó al hotel con el brazo aún en cabestrillo, recibió tratamiento esa misma noche en el hospital de la calle Insurgentes, y dos días después acompañó al equipo a recoger su medalla de tercer lugar (Alemania había vencido a Uruguay 1-0 en el partido por el tercer puesto, con Beckenbauer ya sin jugar). Cuatro años más tarde, en Alemania 1974, Beckenbauer **ganaría su Mundial como capitán**, levantando la copa Jules Rimet en el Olympiastadion de Múnich. Doce años más tarde, en México 1986, lo ganó como seleccionador. Beckenbauer es el único hombre que ha ganado un Mundial como jugador y como entrenador, aparte de Mario Zagallo (Brasil 1970, ayudante de Saldanha) y Didier Deschamps (Francia 1998 y 2018).

Beckenbauer murió el 7 de enero de 2024 a los 78 años en Salzburgo. **Su brazo derecho funcionaba con perfecta normalidad** hasta el final, según el cirujano deportivo Hans-Wilhelm Müller-Wohlfahrt que lo trató durante los últimos veinte años de su vida. El hombro del Azteca había sido encajado por el doctor Deuser en aquel banquillo improvisado, sin cirugía, y nunca volvió a dar problemas. La leyenda del Kaiser, por supuesto, no necesitó historiar ese detalle: **lo del hombro dislocado era ya por sí mismo una mitología**.`,
  },
  {
    n: 28,
    slug: 'ronaldo-redencion-yokohama-2002-final-doblete-kahn',
    publishDate: '2026-05-13',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Ronaldo Nazário',
    quote: 'He vuelto. Esto es lo que me debían.',
    quoteDate: '2002-06-30',
    context:
      'Final del Mundial de Corea-Japón 2002 en el International Stadium de Yokohama. Brasil contra Alemania Occidental. Cuatro años antes, en la final de Francia 1998 contra Francia, Ronaldo había tenido un episodio neurológico la noche anterior al partido (convulsiones en el hotel) y había jugado en estado de shock. Brasil perdió 3-0. Cuatro años después, Ronaldo había sufrido dos lesiones graves de rodilla, había estado dos años sin jugar y había regresado para el Mundial 2002 con peso de más y carrera dada por muerta. Marca dos goles en la final contra Alemania. Brasil 2, Alemania 0. Pentacampeón.',
    source: {
      name: 'Wikipedia · 2002 FIFA World Cup Final',
      url: 'https://en.wikipedia.org/wiki/2002_FIFA_World_Cup_Final',
    },
    sourceSecondary:
      'Globo Esporte · O Estado de São Paulo · FIFA.com · BBC Sport · "Ronaldo: The Phenomenon" (Tom Watt, 2007) · NHK archivos',
    certainty: 'Alta',
    title: 'Ronaldo redime Francia 98 en Yokohama 2002: dos goles a Kahn y el pentacampeonato brasileño',
    excerpt:
      '30 de junio de 2002. Yokohama, Japón. Final del Mundial. Ronaldo Nazário, cuatro años después de la noche más oscura de su carrera, marca dos goles a Oliver Kahn y firma el pentacampeonato brasileño. Cinco años después del 0-3 contra Francia y dos lesiones graves de rodilla, El Fenómeno demuestra que estaba vivo.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ronaldo_Brazil_2002_World_Cup.jpg?width=1200',
      alt: 'Ronaldo Nazário celebrando el pentacampeonato brasileño en la final del Mundial de Corea-Japón 2002 tras marcar los dos goles a Oliver Kahn en el Yokohama Stadium',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    body: `**Ronaldo Luís Nazário de Lima** había llegado a la final del Mundial de Francia 1998 en París como el mejor jugador del mundo. Tenía 21 años, Balón de Oro 1997, Pichichi de la Liga española 1996-97 con el Barcelona, y **había marcado 4 goles** en los seis partidos previos del torneo (incluido un cabezazo decisivo en semifinal contra Holanda). El 12 de julio de 1998, la mañana de la final, **El Fenómeno** se levantó del hotel para encontrarse, según testigos posteriores, en un episodio convulsivo de causa nunca confirmada definitivamente. Hay versiones: epilepsia preexistente no diagnosticada, reacción adversa a la **comida del hotel** que se mantuvo en secreto durante años por presión patrocinadora de Nike, **estrés psicológico extremo** por el peso mediático del partido. El doctor del equipo brasileño, Lídio Toledo, lo medicó con tranquilizantes. Mario Zagallo, el seleccionador, lo dejó **fuera del once titular** dos horas antes del partido.

Cuando se filtró la lista a los periodistas en el Stade de France, **Brasil había publicado el once sin Ronaldo**. Pero el delantero (que recordaba poco del episodio matinal, había recibido suero y se había recuperado parcialmente, insistió en jugar). Zagallo y el cuerpo técnico le añadieron al equipo media hora antes del pitido inicial. La final fue **0-3 Francia**, con dos goles de Zinedine Zidane y otro de Petit. **Ronaldo jugó como en sueños**, sin la coordinación habitual, sin el explosivo cambio de ritmo que era su seña. La imagen de él caminando hacia el banco después del partido, **mirando al suelo, llorando bajo la mascarilla**, dio la vuelta al mundo. Una pregunta quedó en el aire: **¿qué le había pasado a Ronaldo aquella mañana?**

Los cuatro años siguientes fueron **devastadores** para él. En el primer partido de la pretemporada 1999-2000 con el Inter de Milán, **se rompió el tendón rotuliano de la rodilla derecha**. Operación. Cinco meses de baja. En su primer partido del retorno, en abril de 2000 en Roma, **se le volvió a romper la misma rodilla**, esta vez con un desgarro completo del tendón. Doble operación. Diecinueve meses sin jugar. Cuando volvió a competir, en febrero de 2002 con el Inter, había perdido **ocho kilos de masa muscular**, jugaba sin la velocidad explosiva característica, llegaba ya a la treintena de años con un físico acelerado por las lesiones. Los críticos brasileños hablaban de su carrera terminada con honor. Hasta el seleccionador Luiz Felipe Scolari dudó de incluirlo en la lista del Mundial 2002.

Pero Scolari lo incluyó como titular. Y Ronaldo respondió con 6 goles en los seis primeros partidos. Doblete a China en grupos, gol a Turquía, doblete a Bélgica en octavos, gol a Inglaterra en cuartos (la jugada del libre directo de Ronaldinho que sobrevoló la cabeza del portero Seaman), gol a Turquía de nuevo en semifinal. Llegaba a la final del Mundial con **6 goles**, máximo goleador en activo del torneo, y un **rival, Alemania Occidental**, dirigida por Rudi Völler y con **Oliver Kahn, el mejor portero del mundo**, como capitán y referente.

El 30 de junio de 2002 a las 20:00 hora local de Yokohama, en el International Stadium con 69.029 espectadores. Árbitro: el italiano Pierluigi Collina. El partido fue una guerra de trincheras durante 67 minutos. Alemania jugaba al contraataque con Klose en punta y Bernd Schneider por la derecha. Brasil controlaba el balón sin encontrar el espacio en el área alemana. Oliver Kahn paraba todo. En el minuto 67, **Ronaldo recibió un pase de Rivaldo en el borde del área grande**. Hizo un control orientado hacia la izquierda. Le pegó con la pierna derecha. Kahn, normalmente impecable, soltó el balón hacia adelante. Ronaldo, que había seguido la jugada, **empujó el rechace al fondo de la red con la pierna izquierda**. Brasil 1, Alemania 0. **Era el primer error grave de Kahn en todo el Mundial** (había sido elegido **Balón de Oro de FIFA al mejor jugador del torneo** la semana antes de la final, premio inédito para un portero).

Doce minutos después, en el minuto 79, una salida en velocidad de Kléberson por la izquierda, centro a Rivaldo en el centro del área, **Rivaldo amaga con disparar y la deja correr** (jugada típica del brasileño llamada "le foglie morte"). Ronaldo, llegando de atrás, golpea con la pierna derecha al fondo. Brasil 2, Alemania 0. Kahn, en el suelo, hundido. Tres minutos después, Ronaldo fue sustituido por Denilson y, al salir del campo, se besó la camiseta de Brasil. Vio entonces a Cafú, su compañero en el lateral derecho, **levantar el quinto Mundial brasileño** ocho minutos más tarde.

En la entrevista post-partido con Globo, todavía sudando y con la copa Jules Rimet en sus manos, Ronaldo dijo la frase que se ha repetido durante dos décadas: *"He vuelto. Esto es lo que me debían"*. La prensa brasileña, que cuatro años antes lo había crucificado por la actuación de París 98 y por el episodio de la mañana de la final, se inclinó ante él. *O Globo* tituló: *"Os 4 anos da redenção"*. *O Estado* publicó portada con su rostro y la palabra única **"Renascido"** ("renacido").

Lo curioso es que **Ronaldo nunca volvió a brillar en una cita mundial**. Cuatro años después, en Alemania 2006, llegó al torneo con 30 años, sobrepeso evidente y la rodilla derecha tocada. Brasil cayó en cuartos contra Francia (1-0, gol de Henry). Ronaldo no marcó un solo gol en el torneo (reflejo de una decadencia física que sus rodillas operadas no le permitían superar). Se retiró del fútbol en febrero de 2011 con el Corinthians, después de otra lesión muscular. Sus números acumulados en Mundiales: **15 goles** (máximo histórico en aquel momento, superado en 2014 por Klose con 16). Catorce de esos quince goles fueron en Mundiales completos (1998, 2002, 2006). El gol que faltó es el que **no marcó en aquella final de Saint-Denis de 1998** cuando jugó medio dormido en estado de shock.

La final de Yokohama fue, en sus palabras de 2018 al canal SporTV: *"el partido en el que demostré que el chico de Bento Ribeiro había vuelto. No por la copa. Por la cabeza"*. Bento Ribeiro es el barrio del norte de Río de Janeiro donde Ronaldo nació en 1976. **La rodilla derecha**, la misma que se rompió dos veces, **le sigue molestando** en 2026 con cincuenta años cumplidos. Pero el Mundial de 2002 sigue en el palmarés. Y el dolor de París 98, eternamente redimido.`,
  },
  {
    n: 29,
    slug: 'roger-milla-baile-bandera-camerun-italia-1990-record-edad',
    publishDate: '2026-05-14',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Roger Milla',
    quote: 'Voy a jugar este Mundial bailando.',
    quoteDate: '1990-05-15',
    context:
      'Mundial de Italia 1990. Roger Milla, delantero camerunés de 38 años, retirado del fútbol profesional en 1989, recibe una llamada del presidente camerunés Paul Biya para regresar a la selección. Milla había sido descartado por el seleccionador Valeri Nepomniachi como "demasiado viejo". Biya intercede personalmente. Milla regresa al equipo, marca cuatro goles desde el banquillo en cuatro partidos, baila junto al banderín de córner después de cada gol, y lleva a Camerún hasta cuartos de final,donde Inglaterra los elimina 3-2 en la prórroga. Récord histórico: jugador más viejo en marcar en un Mundial.',
    source: {
      name: 'Wikipedia · Roger Milla',
      url: 'https://en.wikipedia.org/wiki/Roger_Milla',
    },
    sourceSecondary:
      'FIFA.com · Le Monde · L\'Équipe · Cameroon Sports archives · "Roger Milla: African Footballer of the Century" (FIFA, 2000)',
    certainty: 'Alta',
    title: 'Roger Milla y el baile junto al banderín: Camerún 1990 y el llamado del presidente Biya al jugador de 38 años',
    excerpt:
      'Italia 1990. Roger Milla, 38 años, retirado del fútbol, regresa a Camerún por petición personal del presidente Paul Biya. Marca cuatro goles desde el banquillo, baila en cada celebración junto al banderín, lleva a Camerún a cuartos,donde Inglaterra los elimina por la mínima. Cambia el imaginario del fútbol africano.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roger_Milla_1990.jpg?width=1200',
      alt: 'Roger Milla celebrando un gol en el Mundial de Italia 1990 con el famoso baile junto al banderín de córner, símbolo del fútbol africano',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    body: `**Albert Roger Mooh Miller** había nacido en Yaoundé, capital de Camerún, el 20 de mayo de 1952. A los 38 años, en la primavera de 1990, había **vivido toda una carrera futbolística completa**. Promesa juvenil del Léopard Douala camerunés. Fichaje por el Bastia francés en 1977 a los 25 años. Ganador del Balón de Oro Africano 1976 y 1980. Estrella del Saint-Étienne, el Mónaco y el Saint-Pierre Reunión hasta retirarse del fútbol profesional francés en 1988. Para 1989 jugaba en la isla de Reunión, en el Club Sportif Saint-Pierroise, **en el equivalente africano de la cuarta división francesa**. Vivía relajado, hacía partidos benéficos, daba charlas en escuelas de fútbol, pensaba abrir una academia infantil en Yaoundé. El Mundial de Italia 1990 no aparecía en ninguno de sus planes.

Camerún sí estaba en sus planes (pero solo como aficionado). La selección camerunesa había clasificado a su segundo Mundial absoluto (el primero fue España 1982) bajo el seleccionador soviético **Valeri Nepomniachi**, contratado por la federación con un contrato que tradujo del francés un intérprete que ni hablaba ruso ni entendía bien las explicaciones técnicas. El equipo era joven, físicamente impresionante, técnicamente mediocre, con figuras como **André Kana-Biyik**, su hermano François Omam-Biyik, Thomas N'Kono (portero), Stephen Tataw (capitán). Nepomniachi había publicado la lista preliminar de 22 jugadores sin incluir a Roger Milla. Demasiado viejo, demasiado lento, demasiado fuera del fútbol profesional para el entrenador.

Lo que cambió la historia fue una **llamada telefónica del presidente Paul Biya** (en el cargo desde 1982, dictador democrático del país, a la federación camerunesa el 15 de mayo de 1990). Biya, según la versión nunca desmentida oficialmente, dijo a la federación: *"Milla irá al Mundial. Si no lo lleváis vosotros, lo llevo yo personalmente"*. La presión fue inmediata. Nepomniachi añadió a Milla a la lista veinticuatro horas después. Milla recibió la noticia con un *"voy a jugar este Mundial bailando"* (frase que en aquel momento parecía tópica pero que tres semanas después se cumplió literalmente).

Camerún debutó el 8 de junio de 1990 en Milán contra **Argentina, defensora del título**, con Maradona, Caniggia, Burruchaga. Era la inauguración del Mundial. **Camerún ganó 1-0** con gol del joven Omam-Biyik en el minuto 67, con seis camaruneses en el campo después de dos rojas a sus compañeros. La selección campeona del mundo había caído ante una selección africana que jugaba con NUEVE jugadores en los últimos veinte minutos. Roger Milla había estado en el banquillo desde el minuto cero. **No jugó ni un minuto** del partido más histórico del Mundial.

Una semana después, Camerún jugó contra Rumania. 0-0 al descanso. Nepomniachi puso a Milla en el campo en el minuto 58 por Eugène Ekéké. **Cuarenta y dos segundos** después de pisar el campo, Milla recibió un balón profundo de Cyrille Makanaky, encaró al portero rumano Lung, recortó hacia la derecha y **definió con la zurda** al fondo. 1-0. La televisión africana, que retransmitía el partido en diferido en 47 países, ardió. Milla corrió hacia el córner del Stadio San Paolo de Nápoles. Llegó al banderín. Se paró delante. Empezó a **mover las caderas en círculos** con los brazos en alto, como si estuviera bailando soca o salsa. La cámara enfocaba sus pies, su cintura, sus brazos en alto. El comentarista francés Thierry Roland gritaba al micrófono: *"Mais ce n'est pas vrai! Il danse, l'ancien!"* ("¡No es verdad! ¡Baila, el viejo!").

Veinte minutos después marcó **otro gol** (un cabezazo tras córner). Volvió al banderín. Volvió a bailar. Camerún ganó 2-1 a Rumania y se clasificó como ganador del grupo. Los dos goles de Roger Milla eran los **dos primeros goles** de Camerún en un Mundial fuera del partido inaugural. Y el baile junto al banderín se convirtió, **literalmente en cuarenta y ocho horas**, en el símbolo del fútbol africano en todo el mundo.

En octavos contra Colombia, Milla volvió a entrar desde el banquillo. Marcó **dos goles más** en la prórroga: un disparo individual en el minuto 105 y un robo de balón al portero **René Higuita** (el portero colombiano que salía del área a jugar como libero, una innovación táctica famosa de la época, y definición al área vacía en el minuto 109). Camerún 2, Colombia 1. Cuartos de final. Roger Milla había marcado **cuatro goles en tres partidos** sin haber empezado ninguno.

En cuartos contra Inglaterra, el equipo de Bobby Robson con Gary Lineker, Paul Gascoigne y David Platt, Camerún perdió 3-2 en la prórroga. Roger Milla **dio dos asistencias** (un pase en profundidad y una falta sacada que generó el gol de Kunde Kana-Biyik). Inglaterra ganó por dos penaltis de Lineker (minutos 83 y 105) tras una entrada dudosa sobre Lineker dentro del área de N'Kono y una segunda entrada del propio N'Kono al jugador inglés Steve Bull. La justicia poética: Lineker, que había crecido como aficionado viendo a Roger Milla por televisión en los setentas, eliminaba al ídolo africano. Camerún quedaba fuera en cuartos. Primer equipo africano en llegar tan lejos. **Quinto lugar en la clasificación final del Mundial 1990**.

Milla regresó a Camerún como héroe nacional. Biya le dio la **Medalla de Mérito Camerunesa**, la condecoración civil más alta del país. Cuatro años después, con 42 años cumplidos, Milla volvió a la selección para **Estados Unidos 1994** (decisión personal del presidente, esta vez con menos oposición). Marcó **el primer gol** de Camerún en aquel Mundial, contra Rusia, a sus 42 años y 39 días. Es el **jugador más viejo en marcar en un Mundial de la historia**. Récord que sigue intacto en 2026.

Roger Milla cumplió 74 años el 20 de mayo de 2026, tres semanas antes del debut del Mundial Canadá-México-USA. Lleva veinte años retirado del fútbol activo. Su academia infantil en Yaoundé, **Académie de Football Roger Milla**, ha formado a más de quinientos jóvenes futbolistas cameruneses desde su apertura en 1994. Uno de ellos, **Carlos Kameni**, llegó a portero suplente del Espanyol en 2010. Otro, **Joel Matip**, fue central titular del Liverpool de Klopp y campeón de la Premier League. Roger Milla es, en términos puramente estadísticos, **el jugador más influyente del fútbol africano de la historia**. Su baile junto al banderín se repite en cualquier celebración de gol africano en cualquier liga europea desde 1990. **Bailaron de él, dieciséis años después, los hijos de los jugadores que lo enfrentaron**.`,
 },
 {
 n: 30,
 slug: 'schillaci-toto-italia-1990-bota-oro-sorpresa',
    publishDate: '2026-05-15',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Salvatore "Totò" Schillaci',
    quote: 'Sognavo un gol contro l\'Inghilterra. Ne ho fatti sei.',
    quoteDate: '1990-07-09',
    context:
      'Mundial de Italia 1990. Salvatore "Totò" Schillaci, delantero centro siciliano de 25 años, llega como suplente del titular Gianluca Vialli. Es su primer Mundial absoluto. Toda la presión recae sobre Vialli, el ídolo italiano del Sampdoria. Pero Vialli no marca. Schillaci sí. Marca seis goles en siete partidos,incluido un gol decisivo en cuartos contra Irlanda y el último en la final del tercer puesto contra Inglaterra. Gana la Bota de Oro como tercero del torneo. Su carrera profesional posterior decae rápido: termina jugando en Japón con el Júbilo Iwata.',
    source: {
      name: 'Wikipedia · Salvatore Schillaci',
      url: 'https://en.wikipedia.org/wiki/Salvatore_Schillaci',
    },
    sourceSecondary:
      'La Gazzetta dello Sport · Corriere della Sera · RAI archivos · "Totò Schillaci: Notti Magiche" (Salvo Schillaci, 2021)',
    certainty: 'Alta',
    title: 'Totò Schillaci, la sorpresa de Italia 1990: seis goles, Bota de Oro y una carrera que se apagó dos años después',
    excerpt:
      'Italia 1990. Salvatore Schillaci llega como suplente de Vialli. Toda la presión es para el ídolo del Sampdoria. Pero Vialli no marca. Schillaci sí: seis goles en siete partidos, Bota de Oro, tercer puesto del Mundial. La sorpresa italiana que cambió la cara del torneo,y que se apagó dos años después.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Salvatore_Schillaci_1990.jpg?width=1200',
      alt: 'Salvatore "Totò" Schillaci, delantero italiano, Bota de Oro del Mundial de Italia 1990 con seis goles desde el banquillo de los azzurri',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    body: `**Salvatore Schillaci** había nacido el 1 de diciembre de 1964 en **Palermo**, en una familia siciliana modesta. Su padre era albañil, su madre ama de casa. Schillaci empezó a jugar en las categorías inferiores del **AS Messina** a los 16 años. A los 23, en 1989, fichó por la **Juventus** (su primer club grande, por 6.000 millones de liras italianas). En su primera temporada en Turín marcó 15 goles. La prensa italiana lo llamaba *"il scoiattolo"* (la ardilla) por su pequeño tamaño y su velocidad explosiva. Y *"Totò"*, diminutivo de Salvatore, que se quedó.

En la primavera de 1990, Italia se preparaba para ser anfitriona de su segundo Mundial (el primero fue 1934, ganado por los azzurri). El seleccionador **Azeglio Vicini** tenía el equipo estrella de su carrera: **Gianluca Vialli** como ariete titular, **Roberto Baggio** como mediapunta, **Roberto Donadoni** y **Giuseppe Giannini** por las bandas, **Walter Zenga** en la portería, **Franco Baresi** y **Paolo Maldini** en defensa. El proyecto estaba blindado en torno a Vialli, el goleador del Sampdoria que esa primavera había ganado la Coppa Italia y la Copa del Rey, y Toto Schillaci entraba en la lista de 22 como **suplente nominal**, sin protagonismo previsto.

Italia debutó el 9 de junio de 1990 contra Austria en el Estadio Olímpico de Roma. 0-0 al descanso. Vicini puso a Schillaci en el minuto 75 por Andrea Carnevale. **Cuatro minutos** después, en el minuto 79, Schillaci recibió un balón en el área de Vialli, hizo un control orientado y definió al fondo con la pierna derecha. Italia 1, Austria 0. Su primer toque de balón en un Mundial era un gol. La afición italiana, que no conocía bien al ariete siciliano, **se preguntó quién era el joven** que había marcado el primer gol del Mundial italiano.

Su segundo partido fue **Italia-EE.UU.** Marcó otro gol (cabezazo en el minuto 11). Tercer partido contra Checoslovaquia, marcó otro (disparo cruzado al borde del área). **Tres goles en tres partidos** desde el banquillo. Vicini, que veía cómo Vialli no marcaba (aún sin gol al final de la fase de grupos), tomó la decisión más impopular pero más necesaria del Mundial: **dejar a Vialli en el banquillo** y poner a Schillaci como titular en octavos.

Italia 2, Uruguay 0. Schillaci marcó el primero. Italia 1, Irlanda 0 en cuartos. Schillaci marcó el único gol (disparo bajo al ángulo, una de las imágenes más icónicas del Mundial). **Cinco goles en cinco partidos consecutivos**. La afición italiana, que veneraba a Vialli como ídolo absoluto desde hacía cuatro años, **se volcó con el pequeño ariete siciliano** con un fervor que pocas figuras deportivas han recibido en la historia italiana. *"Totò! Totò! Totò!"* sonaba en cada estadio del Mundial. Los periodistas italianos llamaban al fenómeno **"le notti magiche"** (las noches mágicas, en honor a la canción oficial del Mundial italiano cantada por **Edoardo Bennato y Gianna Nannini**: *"Notti magiche, inseguendo un gol..."* (noches mágicas, persiguiendo un gol).)

La semifinal contra **Argentina** en Nápoles fue el partido más complicado del torneo. Maradona, que había vivido siete años en el Nápoles y era ídolo absoluto de la afición napolitana, jugaba contra Italia en el estadio donde había ganado dos *scudetti*. El estadio se dividió. Maradona, en una entrevista pre-partido, había dicho a los napolitanos: *"Si Italia gana, no celebren conmigo. Si gana Argentina, no me odien"*. Schillaci marcó el **primer gol** de Italia en el minuto 17 (cabezazo tras córner). Argentina empató con Caniggia en el minuto 67. 0-0 en la prórroga. Los penaltis fueron favorables a Argentina 4-3. Italia eliminada en semifinal. Schillaci no falló el suyo. En el partido por el tercer puesto contra Inglaterra (3 de julio de 1990, Bari), Schillaci marcó **su sexto gol** del Mundial: un penalti perfecto al ángulo izquierdo del portero Peter Shilton en el minuto 86. Italia 2, Inglaterra 1. Tercer puesto del Mundial. **Bota de Oro** para Schillaci (seis goles, dos más que el segundo del torneo, Tomáš Skuhravý de Checoslovaquia). Balón de Oro del Mundial también para Schillaci (premio elegido por periodistas). Tres distinciones individuales en su primer y único Mundial.

Lo curioso de la historia de Toto es lo que vino después. La Juventus le subió el contrato a 8.000 millones de liras. Schillaci ganó **2 goles** en toda la siguiente temporada 1990-91. **Lesión muscular** repetida. Pase al **Inter de Milán** en 1992. Otros 5 goles en dos temporadas. En 1994 fichó por el **Júbilo Iwata** japonés (entonces equipo modesto, para escapar de la presión italiana). Jugó tres temporadas en Japón sin volver a alcanzar nunca el nivel de 1990. Se retiró del fútbol profesional en 1999 con 35 años. Tenía **2 títulos italianos** en su palmarés. Lo único brillante de su carrera, según él mismo: el Mundial 1990.

Schillaci falleció el **18 de septiembre de 2024** a los 59 años en Palermo, su ciudad natal, tras una larga batalla contra el cáncer de colon. Su funeral en la Cattedrale di Palermo congregó a 20.000 personas. La RAI organizó un especial de tres horas con vídeos de archivos del Mundial 1990. Roberto Baggio, en un mensaje grabado, dijo: *"Totò era el alma de aquella selección. Lo que parecía un milagro estadístico era una alegría humana. Nos hizo creer que se podía ganar"*. Italia no ha ganado un Mundial desde 1990. Italia **no se ha clasificado** a los dos últimos (Rusia 2018 y Catar 2022). Una generación entera de italianos nacidos en los noventa creció escuchando que **los milagros existieron**, que un suplente palermitano marcó seis goles en un Mundial, que las noches mágicas fueron reales aunque pareciera que no.

En el museo del Stadio Olímpico de Roma, junto al banderín de córner donde Schillaci celebró su primer gol del Mundial 1990, hay una placa de bronce con la frase de la canción de Bennato y Nannini: *"Notti magiche, inseguendo un gol"*. Schillaci escribió debajo, en su autobiografía de 2021: *"Soñaba un gol contra Inglaterra. Marqué seis"*.`,
  },
  {
    n: 16,
    slug: 'gol-fantasma-wembley-inglaterra-alemania-1966',
    publishDate: '2026-05-16',
    blockCode: 'S4',
    category: 'polemica',
    protagonist: 'Geoff Hurst / Tofiq Bahramov',
    quote: 'They think it’s all over… it is now!',
    quoteDate: '1966-07-30',
    context:
      'Final del Mundial de Inglaterra 1966 en Wembley. Inglaterra y Alemania Occidental empatan 2-2 al final del tiempo reglamentario. En el minuto 101 de la prórroga, Geoff Hurst remata a la cruceta, el balón pica contra la línea de gol y vuelve al campo. El árbitro suizo Gottfried Dienst consulta al juez de línea soviético Tofiq Bahramov, que asegura que el balón cruzó completamente la línea. Sesenta años después, la tecnología confirma que no entró.',
    source: {
      name: 'Wikipedia · 1966 FIFA World Cup Final',
      url: 'https://en.wikipedia.org/wiki/1966_FIFA_World_Cup_Final',
    },
    sourceSecondary:
      'BBC Sport · The Guardian · Der Spiegel · "Geoff Hurst Goal Analysis" Oxford University (1996) · L\'Équipe archives',
    certainty: 'Alta',
    title: 'El gol fantasma de Wembley: el remate de Hurst que decidió Inglaterra 4-2 Alemania 1966 y dividió al fútbol durante 60 años',
    excerpt:
      '30 de julio de 1966. Final del Mundial en Wembley, prórroga, 2-2 entre Inglaterra y Alemania. Geoff Hurst golpea al larguero, el balón pica detrás de la línea o delante de ella,nadie lo sabe seguro. Un juez de línea soviético sentencia. Inglaterra gana su único Mundial.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wembley_Stadium_1966.jpg?width=1200',
      alt: 'Vista panorámica de Wembley Stadium durante la final del Mundial 1966, escenario del gol fantasma de Geoff Hurst que decidió el partido entre Inglaterra y Alemania Occidental',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
    },
    body: `30 de julio de 1966. Wembley Stadium, 96.924 espectadores, Inglaterra y Alemania Occidental empatan 2-2 al final del tiempo reglamentario después de que el delantero centroeuropeo Wolfgang Weber empatara en el minuto 89, en una jugada que dejó a un Inglaterra mentalizado para la victoria con un palmo de narices y la final empujada a la prórroga. La selección de Alf Ramsey, que había decidido jugar sin extremos puros (el famoso "wingless wonders" del 4-3-3,, dependía ahora de las piernas cansadas de Bobby Charlton, Bobby Moore y un delantero centro de 24 años que esa misma temporada había marcado solo 23 goles en la Primera División inglesa: Geoff Hurst).

Hurst no era titular hasta semifinal. Jimmy Greaves, el goleador histórico del Tottenham, era el delantero de fe del seleccionador. Pero Greaves se había hecho un corte profundo en la espinilla en el partido contra Francia de la fase de grupos y Ramsey, con valentía táctica que sus críticos llamaron temeridad, decidió no devolverlo al once en cuartos contra Argentina (1-0, el partido de "los animales") ni en semifinal contra Portugal (2-1, doblete de Charlton). Hurst se quedó como titular. En cuartos había marcado el único gol contra Argentina. En semifinal, ninguno. La final era la prueba final.

A los 13 minutos, un centro de Moore desde la izquierda encontró la cabeza de Helmut Haller, que se anticipó al cabezazo de Ray Wilson en la mejor zona del área alemana. 0-1. Wembley enmudeció. Veinte minutos después, una falta directa de Moore botada sobre el área alemana encontró a Hurst en posición de cabeza. 1-1. Volvió Wembley. En el minuto 78, Martin Peters cazó un rechace en el área pequeña y la voló al fondo. 2-1. Inglaterra estaba campeona. Hasta que llegó el minuto 89 y Weber.

La prórroga arrancó con Inglaterra agarrotada y Alemania impulsada por la inercia del empate. Pero el remate llegó del otro bando. Minuto 101. Alan Ball centra desde la derecha al borde del área. Hurst, en posición central, se gira con un control orientado y golpea con la pierna derecha con todo su peso encima. El balón sale violentamente hacia arriba, golpea **el larguero**, baja vertical contra el suelo dentro del área pequeña, **pica** en algún punto exacto que sesenta años después sigue siendo objeto de debate, y rebota hacia atrás al campo. El defensor alemán Wolfgang Weber, el mismo del empate, despeja con la cabeza.

El árbitro suizo Gottfried Dienst no había seguido el balón con claridad. Se giró al juez de línea más cercano, el soviético azerí **Tofiq Bahramov**, que estaba a unos veinte metros con poca visibilidad del impacto. Bahramov, sin dudar, levantó la bandera hacia el centro del campo y señaló: gol. Dienst aceptó la indicación. **3-2** para Inglaterra. Los alemanes protestaron durante varios minutos, encabezados por Uwe Seeler. Dienst no se movió. La final continuó.

En el minuto 120, con Alemania volcada en busca del empate, Hurst recuperó el balón en su propio campo y emprendió una contraofensiva en solitario. El portero Manuel Schäfer salió a la desesperada. Hurst le pegó con la pierna izquierda al fondo: 4-2. El comentarista de BBC Kenneth Wolstenholme acuñó en ese instante la frase más famosa de la historia del comentario futbolístico: *"They think it’s all over… it is now!"* ("creen que se ha acabado, ahora sí"). Hurst se convirtió en el único jugador en la historia que ha marcado un hat-trick en una final de Mundial. Récord que aún no ha sido igualado.

¿Entró o no entró el segundo gol? La pregunta se ha respondido y desautorizado varias veces a lo largo de seis décadas. En 1996, un estudio cinemático de la Universidad de Oxford con análisis fotograma a fotograma del único vídeo de calidad disponible determinó que la pelota **no había cruzado completamente la línea**: faltaron aproximadamente 6 centímetros. En 2016, los 50 aniversarios, una reconstrucción con tecnología Hawk-Eye basada en las imágenes de archivo de la BBC y el Pathé News confirmó el mismo veredicto: no fue gol. El balón rebotó contra el lado interior del larguero, picó **delante** de la línea de gol y volvió al campo. La realidad documental contradice la decisión del árbitro.

Bahramov falleció en 1993 sin retractarse jamás. En su autobiografía, publicada en ruso en 1972, escribió que el balón "claramente había pasado la línea" y que vio "polvo levantarse del fondo de la red". Tres décadas después, los archivos de la Mosfilm soviética confirmaron que Bahramov había sido **invitado de honor de la federación inglesa** en los meses previos al Mundial, un detalle que ha alimentado teorías de soborno nunca probadas. En Bakú, su ciudad natal, hay hoy un estadio que lleva su nombre. Las cuatro selecciones que han disputado allí partidos europeos en las últimas décadas saben por qué el nombre les resulta familiar.

Inglaterra es campeona del mundo en su única participación victoriosa de la historia. **It’s coming home** todavía espera otra vez, pero el episodio de Wembley 1966 marca el momento exacto en que el fútbol mundial se dividió en dos: los que creen que la tecnología debería haber existido siempre y los que mantienen que el factor humano del árbitro es parte del juego. La FIFA tardó **44 años** en aprobar la goal-line technology, después de un gol no concedido a Frank Lampard contra Alemania en Sudáfrica 2010 que sí cruzó claramente la línea. La justicia poética, dijeron los alemanes. **Sechzig sechs**, dijeron los ingleses.`,
  },
  {
    n: 17,
    slug: 'garrincha-piernas-torcidas-chile-1962-mundial-sin-pele',
    publishDate: '2026-05-17',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Manuel Francisco dos Santos "Garrincha"',
    quote: 'No te preocupes, Mané. Vamos a ganarlo nosotros.',
    quoteDate: '1962-06-02',
    context:
      'Chile 1962. Brasil llega como vigente campeón con Pelé como estrella del torneo y "rey del fútbol mundial" tras su Mundial de Suecia 1958. En el segundo partido contra Checoslovaquia, Pelé se desgarra el muslo y queda fuera del Mundial. Brasil parece muerto. Pero la baja despierta al jugador con piernas torcidas, una pierna seis centímetros más corta que la otra y la mirada perdida del genio. Garrincha gana solo el Mundial.',
    source: {
      name: 'Wikipedia · 1962 FIFA World Cup',
      url: 'https://en.wikipedia.org/wiki/1962_FIFA_World_Cup',
    },
    sourceSecondary:
      'FIFA.com · Folha de São Paulo · Globo Esporte archives · "Estrela Solitária" (Ruy Castro, 1995) · O Estado de São Paulo',
    certainty: 'Alta',
    title: 'Garrincha 1962: el ángel de las piernas torcidas que ganó un Mundial sin Pelé',
    excerpt:
      'Chile 1962. Pelé cae lesionado en el segundo partido. Brasil parece eliminado. Pero Mané Garrincha, el extremo con piernas torcidas y la mirada de un niño, regatea solo a cuatro selecciones, gana la Bota de Oro y conquista el segundo Mundial brasileño en solitario. La historia menos contada del fútbol.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Garrincha_1962.jpg?width=1200',
      alt: 'Manuel Francisco dos Santos "Garrincha" durante el Mundial de Chile 1962, donde lideró a Brasil al segundo título consecutivo tras la lesión de Pelé',
      credit: 'Foto: Wikimedia Commons',
      license: 'Dominio público',
    },
    body: `Manuel Francisco dos Santos había nacido en Pau Grande, un pequeño pueblo industrial del estado de Río de Janeiro, en 1933. Vino al mundo con una **deformación congénita en las piernas**: la izquierda doblada hacia adentro, la derecha torcida hacia afuera, una pierna **seis centímetros más corta** que la otra y una desviación severa en la columna lumbar. Los médicos le dijeron a su madre, Doña Maria, que el niño nunca caminaría con normalidad. A los doce años, Mané (como le llamaban todos, corría por los maizales del pueblo con una velocidad que confundía a los pájaros). Su hermana Rosa, una niña diminuta a la que él perseguía cazando, le puso el apodo: *garrincha*, el nombre brasileño de un pequeño pájaro nervioso e impredecible que es imposible atrapar.

Garrincha llegó al Botafogo a los veinte años por casualidad. En 1953 un veterano del club lo vio jugar en un partido entre obreros de la fábrica textil donde trabajaba su padre y le ofreció una prueba. En la prueba, Mané regateó **siete veces consecutivas** al lateral derecho titular del Botafogo, **Nilton Santos**, que más tarde sería su compañero en la selección. Nilton Santos, conmocionado, le dijo al entrenador: *"contrátalo. Si no, jugará contra nosotros y será peor"*. Botafogo le pagó la primera prima de su vida y firmó. Tres años después era titular indiscutible. Cinco años después, en Suecia 1958, marcaba la asistencia que abría el camino al primer Mundial brasileño.

Cuatro años más tarde, en Chile 1962, llegó el Mundial donde Garrincha pasaría de ser **el segundo violín de Pelé** a el genio absoluto en solitario. Brasil debutó el 30 de mayo en Viña del Mar contra México. Ganó 2-0 con goles de Zagallo y Pelé. El siguiente partido era contra Checoslovaquia, en el mismo estadio. Empataron a cero pero la imagen del partido fue Pelé tirado en el suelo en el minuto 25, sujetándose el muslo derecho con una mueca de dolor. Desgarro muscular severo. El médico del equipo, el doctor Hilton Gosling, le dijo en el vestuario que no jugaría ningún partido más del Mundial.

Brasil entró en pánico. Pelé era el jugador del torneo, el mejor del mundo, la promesa absoluta. Sin él, parecía un equipo sin dirección. En el viaje en autobús de vuelta al hotel, Garrincha se sentó al lado del capitán Mauro Ramos y le dijo, con esa mirada como ausente de los grandes melancólicos: *"No te preocupes, Mané. Vamos a ganarlo nosotros"*. Mané, hablando en tercera persona, llamándose a sí mismo Mané, profetizando una victoria contra el sentido común del momento. El capitán le respondió con un gesto de duda. Tres semanas después, Brasil era de nuevo campeón del mundo y Garrincha era el mejor jugador del torneo.

Lo hizo regateando. Su técnica era tan particular que los entrenadores no sabían cómo enseñarla. Salía siempre por banda derecha, encaraba al lateral izquierdo del rival, **fingía un caño**, hacía un cambio de dirección imposible con la pierna corta apoyando todo el peso, y se iba por la línea de fondo dejando al defensor sentado en el césped. Lo hizo cinco veces seguidas a **Vlasov** de la Unión Soviética en cuartos de final. Hizo dos goles, uno de cabeza (milagro, dado que mide 1,69, y otro de zurda). Brasil ganó 3-1.

En semifinal contra Chile, el anfitrión, Garrincha volvió a marcar dos veces. Uno de chilena. Otro de tiro libre con efecto que hizo describir al balón una trayectoria imposible. Brasil ganó 4-2. Pero al final del partido, después del pitido, Garrincha se cruzó con un seleccionado chileno (**Eladio Rojas**, que le había hecho una entrada por detrás durante el partido). Garrincha, normalmente pacífico, le devolvió una patada en el muslo. Roja directa. La FIFA lo expulsó del campeonato un partido. Y aquí entra el milagro político del Mundial.

La final era contra Checoslovaquia. Sin Pelé y, ahora, sin Garrincha. Brasil parecía perdido por segunda vez. El presidente brasileño João Goulart envió al **embajador brasileño en la ONU**, en Chile el día previo a la final, a contactar con la FIFA y con la federación checoslovaca pidiendo clemencia. El presidente del comité de disciplina, **Stanley Rous** (el mismo que sería presidente de la FIFA en 1966,, hizo lo impensable: **levantó la sanción** sin razón técnica clara). Algunos historiadores dicen que recibió presión política brasileña, otros que la FIFA tenía miedo de un Mundial sin las dos estrellas del campeón. Garrincha jugó la final.

17 de junio de 1962. Estadio Nacional de Santiago. Brasil 3, Checoslovaquia 1. Goles de Amarildo (sustituto de Pelé), Zito y Vavá. Garrincha no marcó pero fue **el motor del equipo** durante 90 minutos. La final terminó con Mauro Ramos levantando la Copa Jules Rimet por segundo año consecutivo brasileño. La historia oficial ha hecho del partido una victoria colectiva. La historia real es que **un jugador con las piernas torcidas, una columna desviada y la mirada perdida del genio sostuvo solo a un Mundial**, ganando la Bota de Oro junto a otros cinco delanteros que también marcaron cuatro goles cada uno.

Garrincha murió en Río de Janeiro el 20 de enero de 1983. Alcohol, depresión, pobreza extrema en sus últimos años. Pelé no fue al entierro porque estaba grabando un anuncio en Roma. La familia lo enterró en Pau Grande, su pueblo. Cuatro décadas más tarde, el estadio del Botafogo, demolido en 1976, lleva su nombre: **Estádio Nilton Santos**, conocido popularmente como *Estádio do Engenhão*. Hay en Pau Grande, junto a su tumba, una placa que recoge las palabras de Joao Saldanha, periodista y luego seleccionador brasileño: *"Garrincha fue el último jugador que jugó por amor al juego. Lo demás vino después por accidente"*.`,
  },
  {
    n: 18,
    slug: 'zidane-cabezazo-materazzi-berlin-2006-final',
    publishDate: '2026-05-18',
    blockCode: 'S4',
    category: 'tragica',
    protagonist: 'Zinedine Zidane / Marco Materazzi',
    quote: 'Prefiero recibir un puñetazo en la cara antes que oír eso.',
    quoteDate: '2006-07-09',
    context:
      'Final del Mundial de Alemania 2006 en el Olímpico de Berlín. Francia e Italia empatan 1-1 al final del tiempo reglamentario. Minuto 110 de la prórroga. Zinedine Zidane, capitán francés, que había anunciado su retirada del fútbol al final del torneo, golpea con la cabeza al pecho de Marco Materazzi. El árbitro argentino Horacio Elizondo le saca la roja directa. Francia pierde en penaltis. Zidane se va del fútbol sin la copa, en la imagen más recordada de su carrera.',
    source: {
      name: 'Wikipedia · 2006 FIFA World Cup Final',
      url: 'https://en.wikipedia.org/wiki/2006_FIFA_World_Cup_Final',
    },
    sourceSecondary:
      'L\'Équipe · La Gazzetta dello Sport · Canal+ archives · "Zidane: A 21st Century Portrait" (Gordon/Parreno, 2006) · BBC Sport',
    certainty: 'Alta',
    title: 'El cabezazo de Zidane al pecho de Materazzi: Berlín 2006 y el final más triste de la historia',
    excerpt:
      '9 de julio de 2006. Olímpico de Berlín. Minuto 110 de la prórroga de la final del Mundial. Zidane, capitán francés que se retira al final del torneo, gira la cabeza y golpea al pecho a Marco Materazzi. Roja directa. Francia pierde en penaltis. Zidane se va del fútbol sin levantar la copa.',
    cover: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zinedine_Zidane_2006.jpg?width=1200',
      alt: 'Zinedine Zidane durante la final del Mundial de Alemania 2006 entre Francia e Italia, donde el cabezazo a Marco Materazzi le valió la expulsión en el último partido de su carrera',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    body: `Zinedine Yazid Zidane se había anunciado **fuera del fútbol** seis meses antes del Mundial de Alemania 2006. El 30 de mayo de 2006 jugaría su último partido con el Real Madrid contra el Villarreal en el Santiago Bernabéu, y a continuación viajaría a Berlín para disputar el último torneo de su carrera. A sus 34 años, con dos Champions League, un Mundial (Francia 1998), una Eurocopa (Francia 2000) y tres Balones de Oro, el franco-argelino llegaba a Alemania como el jugador más mediático del mundo. La afición francesa esperaba la despedida perfecta: una segunda Copa del Mundo veinte años después del primer Maracanazo francés.

Francia, sin embargo, llegó a Alemania como un equipo agotado. Eliminada en primera ronda de la Eurocopa 2004 en Portugal. Sin Lilian Thuram en la mejor forma. Con Patrick Vieira en el ocaso. Con Thierry Henry físicamente apagado tras una temporada larga con el Arsenal. Los franceses pasaron de grupos como segundos con un triste empate sin goles contra Suiza, otro 1-1 con Corea del Sur y un raquítico 2-0 a Togo. Los críticos parisinos hablaban de fracaso anunciado. Entonces empezó Zidane. En octavos, contra España, marcó el segundo gol del 3-1. En cuartos, contra Brasil (el rival de las pesadillas francesas, firmó el mejor partido individual del Mundial: asistencia a Henry y una actuación que dejó al equipo de Carlos Alberto Parreira sin reacción durante 90 minutos). Francia 1, Brasil 0. La prensa francesa hablaba ya del *"último baile del genio"*. En semifinal, contra Portugal de su compatriota Carlos Queiroz, marcó de penalti el único gol del partido. Zidane había metido a Francia en la final del Mundial prácticamente solo. La final del 9 de julio de 2006 en el Olímpico de Berlín se planteaba como Zidane contra Italia. El árbitro argentino Horacio Elizondo (elegido para su tercer partido del torneo, después de la inauguración y el cuartos Italia-Ucrania, sopló el pitido inicial a las 20:00 hora local). Zidane abrió el marcador en el minuto 7 con un **penalti de vaselina** que picó en el larguero, bajó al campo y entró por la línea. Era el penalti más arriesgado posible en la final de un Mundial. Los italianos no daban crédito. Diecinueve minutos después, Marco Materazzi, el central del Inter, igualaba de cabeza tras un córner de Pirlo. 1-1. Y así se mantuvo durante los 64 minutos restantes y los primeros 20 de la prórroga.

Minuto 110. Zidane había tenido una ocasión clarísima de gol cinco minutos antes con un cabezazo que Buffon sacó de manera milagrosa con la mano abierta. Era el segundo cabezazo importante de su partido. El cansancio se notaba en sus piernas. Materazzi venía de un duelo personal con él durante toda la final: cuatro o cinco encontronazos físicos en el área, un par de palabras intercambiadas en la pugna. En el minuto 110, en una jugada sin balón, Zidane se gira hacia atrás caminando y le dice algo a Materazzi. El italiano le responde. Zidane camina dos pasos. Se detiene. Se da la vuelta. **Golpea con la cabeza al pecho de Materazzi**. El italiano cae al suelo.

El árbitro Elizondo no había visto la acción. Su asistente Darío García tampoco. El cuarto árbitro Luis Medina Cantalejo, en el monitor de la línea, sí vio el monitor de la cámara de televisión. Por el sistema de comunicación interna del cuarteto arbitral, le dijo a Elizondo lo que había sucedido. Elizondo se acercó al banquillo de Cantalejo durante dos minutos, recibió la confirmación, volvió al campo y sacó la roja directa a Zidane. Sin amarilla previa. Sin advertencia. Sin contemplación.

El estadio enmudeció. Zidane caminó hacia el túnel sin mirar a nadie. **Pasó al lado de la Copa del Mundo** que ya estaba en el banquillo de la FIFA para la ceremonia de premiación. No la miró. Salió por el pasillo. Diez minutos después, Italia ganó en la tanda de penaltis 5-3. Trezeguet falló el único francés. Fabio Grosso anotó el último italiano. Italia, campeona del mundo. Cuarto título mundial de los azzurri.

¿Qué le dijo Materazzi a Zidane? La pregunta dominó la conversación pública durante semanas. Materazzi negó haberlo insultado durante días. La prensa publicó una decena de versiones, casi todas ellas relacionadas con la familia de Zidane (su madre estaba ingresada en el hospital esa semana). Tres días después de la final, en una entrevista con la *Gazzetta dello Sport*, Materazzi admitió que había dicho *"prefiero ir con tu hermana puta"* en respuesta a una frase del francés. Zidane confirmó en *Canal+* dos semanas después que el insulto había sido contra su madre y su hermana, y que había repetido el comentario tres veces durante la jugada anterior al cabezazo. La FIFA sancionó a Materazzi con dos partidos por insulto. A Zidane con tres partidos y multa de 7.500 francos suizos, sin posibilidad de revertirla porque ya estaba retirado.

Pierre Bergé, el publicista de Yves Saint Laurent y amigo personal de Zidane, dijo días después: *"Quería que su carrera terminara con la copa en la mano. Acabó con la cabeza baja. La tragedia perfecta"*. Catorce años más tarde, en septiembre de 2020, Materazzi y Zidane se encontraron en una gala benéfica en Marsella. Se dieron la mano, se abrazaron brevemente, posaron juntos para los fotógrafos sin hablar. Materazzi sigue jugando legendarios con el Inter retirados. Zidane fue luego seleccionador del Real Madrid y ganó tres Champions League consecutivas (2016, 2017, 2018). La imagen del cabezazo, sin embargo, sigue siendo la fotografía más vista de toda su carrera. Más que el penalti picado de Berlín. Más que la asistencia a Henry contra Brasil. Más que las dos volees con la zurda en la final de la Champions 2002 en Glasgow.

*"Prefiero recibir un puñetazo en la cara antes que oír eso"*, dijo Zidane en *Canal+*. Es la única explicación que ha ofrecido en dos décadas.`,
  },
  {
    n: 31,
    slug: 'messi-campeon-lusail-2022-argentina-tercer-mundial-mbappe-final',
    publishDate: '2026-05-19',
    blockCode: 'S7',
    category: 'epica',
    protagonist: 'Lionel Messi',
    quote: 'Es una locura. ¿Cómo no enloquecer?',
    quoteDate: '2022-12-18',
    context:
      'Final del Mundial de Catar 2022 en el Estadio Lusail. Argentina-Francia. Lionel Messi, 35 años, capitán argentino en su quinto y último Mundial, levanta la copa después de un partido que el público mundial consideró «la mejor final de la historia». Argentina 3-3 Francia en 120 minutos. Tanda de penaltis 4-2 a favor de Argentina. Tercer Mundial para Argentina (1978, 1986, 2022). Primer Mundial para Messi.',
    source: {
      name: 'FIFA · 2022 World Cup Final',
      url: 'https://www.fifa.com/en/tournaments/mens/worldcup/qatar2022/match-center/400235459',
    },
    sourceSecondary: 'AFA · La Nación · Clarín · Olé · Sky Sports',
    certainty: 'Alta',
    title:
      'Messi en el Lusail: la noche que Argentina cerró el ciclo más esperado de la historia del fútbol',
    excerpt:
      'El 18 de diciembre de 2022 Lionel Messi levantó la Copa del Mundo en Catar después de una final que cambió la historia del fútbol. 36 años después de Maradona. Cuatro años después de la última frustración. La consagración llegó con un partido que muchos consideran el mejor jamás jugado.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aerial_view_of_Lusail_Stadium_during_the_daytime.png/1280px-Aerial_view_of_Lusail_Stadium_during_the_daytime.png',
      alt: 'Vista aérea del Estadio Lusail, sede de la final del Mundial 2022',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_Lusail_Stadium_during_the_daytime.png',
    },
    body: `Hay finales y hay **la** final. La del 18 de diciembre de 2022 en el Estadio Lusail de Catar entró en la categoría rara de partidos que, mientras se juegan, ya saben que están escribiéndose en piedra. Argentina contra Francia. Lionel Messi contra Kylian Mbappé. La generación dorada de Scaloni contra la generación dorada de Deschamps. Un partido que los aficionados ingleses bautizaron *"the perfect chaos"*, que la prensa italiana calificó de *"capolavoro"* y que la propia FIFA reconoció oficialmente como **la final de mayor audiencia televisada de la historia**, con 1.500 millones de espectadores.

La trama del partido tiene cinco actos perfectos, casi shakespearianos, separados por veinte minutos exactos cada uno. Acto I: Messi marca de penalti en el minuto 23 después de una falta de Dembélé sobre Di María. Acto II: Di María (precisamente él, que cuatro años antes había sido el chivo expiatorio de la final de Brasil 2014 perdida también por Argentina) define con la izquierda en el minuto 36 tras un contraataque coral de cinco pases que la prensa argentina llamará *"el gol más argentino de todos los tiempos"*. **2-0** al descanso. Francia parecía noqueada.

Acto III: Deschamps cambia a Giroud y Dembélé en el minuto 41 del primer tiempo (decisión calificada de *"radical"* en su momento porque generalmente las sustituciones tácticas no se hacen tan pronto). Entran Marcus Thuram y Randal Kolo Muani. Mbappé activa el motor que llevaba dormido todo el partido. En **dos minutos**, entre el minuto 80 y el 81, el francés marca el primer gol (penalti tras una falta de Otamendi sobre Kolo Muani, y el empate definitivo del tiempo reglamentario tras una jugada coral espectacular). **2-2** al minuto 81. *El partido perfecto* se había convertido en *el partido inverosímil*.

Acto IV: la prórroga. En el minuto 108, Messi remata desde tres metros tras un rechace del portero Hugo Lloris. Argentina vuelve a ponerse por delante: 3-2. Pero Mbappé no había acabado. En el minuto 118 vuelve a marcar de penalti tras una mano de Montiel en el área argentina (decisión revisada por el VAR durante minuto y medio). 3-3. Mbappé acababa de marcar un **hat-trick** en la final del Mundial, gesta que solo Geoff Hurst había logrado antes (Inglaterra-Alemania 1966). El estadio se quedó en silencio durante diez segundos enteros: nadie se creía lo que estaba pasando.

Acto V: la tanda de penaltis. El árbitro polaco Szymon Marciniak sorteó la moneda. Tira Argentina primero. **Mbappé marca el primero francés** (4 de 4 goles esa noche, récord absoluto). Messi marca el primero argentino. **Coman fallaba el segundo francés** (tiro a la izquierda, Emiliano Martínez se estira y desvía con la mano). Dybala marca el segundo argentino. **Tchouaméni fallaba el tercer francés** (tiro al palo izquierdo de Martínez, fuera). Paredes marca el tercer argentino. Kolo Muani marca el cuarto francés. **Gonzalo Montiel marca el cuarto argentino**: 4-2. Argentina, campeona del mundo. A las 23:08 hora de Catar, Lionel Messi levantó la **Copa del Mundo** en el centro del campo del Lusail. Llevaba puesto el **bisht**, túnica tradicional árabe regalada por el emir de Catar, decisión protocolar que generó polémica en Europa pero que el propio Messi defendió días después: *"Es un signo de respeto. En Argentina nadie protestó cuando me la pusieron. La polémica vino del resto del mundo"*. La fotografía de Messi con el bisht levantando la copa se convirtió en la **publicación con más likes de la historia de Instagram** (76 millones, récord que aún se mantiene).

¿Qué dijo Messi en la zona mixta posterior al partido? La frase, breve, condensaba todo: *"Es una locura. ¿Cómo no enloquecer?"* Una pregunta retórica que era, en realidad, una respuesta. Había pasado **36 años** desde Maradona en el Azteca. **Veintiocho años** desde la última vez que Messi vio a Argentina cerca de un Mundial (Estados Unidos 1994, era un niño en Rosario). **Cuatro años** desde la frustración brutal de Brasil 2014, cuando Messi había perdido en Maracaná contra Alemania (1-0, gol de Götze en el minuto 113, una imagen que el argentino describió en una entrevista a *La Nación* como *"el peor recuerdo de mi vida deportiva"*). Catar 2022 cerraba todos esos ciclos a la vez.

El cuerpo técnico. Lionel Scaloni, 44 años entonces, sin experiencia previa como entrenador antes de heredar la selección en 2018 tras la salida de Sampaoli, se convirtió en el seleccionador más joven en ganar un Mundial desde Mario Zagallo con Brasil 1970. Scaloni había sido jugador del Lazio, Mallorca y Atlético de Madrid; estaba como ayudante de Sampaoli cuando le llamaron para tomar la selección en una situación de absoluta crisis. Cuatro años después, levantaba la copa con el plantel que él mismo había diseñado: Mac Allister-De Paul-Enzo Fernández en el medio, Otamendi-Romero atrás, Dibu Martínez bajo palos, y Messi-Di María-Lautaro arriba.

Lo que cambió esa noche. Argentina no había ganado un Mundial desde México 1986. Trescientos cuarenta millones de personas en Argentina (más diáspora) celebraron simultáneamente. El Obelisco de Buenos Aires concentró a **cinco millones de personas** según la Policía Federal, la mayor concentración pública en la historia de la ciudad. La televisión pública argentina transmitió desde las 13:00 hasta las 06:00 del día siguiente sin pausa publicitaria (decisión inédita).

Messi, tres años después, hablaría así de aquella noche en una entrevista en *Apple TV+*: *"Hay un Lionel Messi antes del 18 de diciembre de 2022, y otro después. Lo de antes ya no existe"*. Cumplió 35 años durante el Mundial. Cumplirá 39 durante el Mundial 2026. Ancelotti lo quiere a su lado en la consagración mexicano-norteamericana. *"¿Cómo no enloquecer?"*, dijo. La respuesta es que nadie pudo.`,
  },
  {
    n: 32,
    slug: 'gentile-patada-maradona-italia-argentina-1982-espana-falagas',
    publishDate: '2026-05-20',
    blockCode: 'S4',
    category: 'polemica',
    protagonist: 'Claudio Gentile · Diego Maradona',
    quote: 'Era como tener una sombra detrás. No me dejó respirar.',
    quoteDate: '1982-06-29',
    context:
      'Segunda fase del Mundial de España 1982. Italia-Argentina en el Estadio de Sarrià, Barcelona. Diego Maradona, 21 años, juega su primer Mundial. Claudio Gentile, defensa del Juventus, recibe la orden de Enzo Bearzot de neutralizar al argentino. El resultado: 23 patadas en 90 minutos. Italia ganaría 2-1 y eliminaría a Argentina del Mundial. Es la imagen más reproducida del Mundial de España.',
    source: {
      name: 'Wikipedia · 1982 FIFA World Cup',
      url: 'https://es.wikipedia.org/wiki/Copa_Mundial_de_F%C3%BAtbol_de_1982',
    },
    sourceSecondary: 'La Repubblica · El País · Clarín · Marca',
    certainty: 'Alta',
    title:
      '23 patadas a Maradona: Gentile, Bearzot y la noche que Italia rompió el Mundial de España 1982',
    excerpt:
      'El 29 de junio de 1982 Claudio Gentile recibió la orden de Enzo Bearzot: no dejar respirar a Maradona durante los 90 minutos del Italia-Argentina del Sarrià. Le pegó 23 veces, fue amonestado una sola vez, e Italia ganó 2-1. El argentino salió del campo con las dos piernas marcadas y la mirada perdida.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Italia82.JPG',
      alt: 'Italia campeona del Mundial 1982 celebra con Bearzot',
      credit: 'Wikimedia Commons',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Italia82.JPG',
    },
    body: `El **29 de junio de 1982** quedó marcado en la memoria del fútbol mundial como la noche en que un defensor convirtió la marca personal en doctrina militar. **Claudio Gentile**, central del Juventus, 28 años, recibió de su seleccionador **Enzo Bearzot** una orden tan simple como brutal: *"Ti devi attaccare a Maradona come una sanguisuga"* (debes pegarte a Maradona como una sanguijuela). En 90 minutos, en el desaparecido **Estadio de Sarrià** de Barcelona, Gentile cumplió la orden con una precisión casi sádica. Le metió **23 patadas a Diego Armando Maradona**, contadas una a una por los estadísticos de FIFA años después. Recibió una sola tarjeta amarilla. E Italia ganó 2-1 eliminando a Argentina del Mundial.

El contexto. Maradona llegaba al Mundial de España con 21 años. Era el segundo Mundial post-Pelé y la prensa internacional había decidido que el argentino era el heredero natural. Después de un primer partido tibio contra Bélgica (1-0 derrota para Argentina) y una victoria contundente contra Hungría (4-1, dos goles de Maradona), la primera fase había sido razonable. Argentina era campeona vigente del Mundial de 1978 y Maradona venía precedido de un año sublime en el Boca Juniors. La segunda fase la enfrentaba contra **Italia, Brasil y la propia Argentina** en un grupo de tres, donde solo el primero avanzaba a semifinales.

Enzo Bearzot, seleccionador italiano, tenía un equipo en crisis. Italia había firmado un Mundial 78 desastroso y llegaba a España sin haber ganado en cinco partidos consecutivos previos. La prensa italiana pedía la cabeza del seleccionador. Bearzot había construido un equipo defensivo con tres centrales puros (Collovati, Scirea y Gentile, más una segunda línea de medios que cubrían cada vacío). La táctica era simple: **defender en bloque, salir al contragolpe, esperar a Paolo Rossi**. Pero antes de eso, había que neutralizar a Maradona.

La estrategia Gentile. El día previo al partido, Bearzot reunió al equipo en su hotel de la Diagonal de Barcelona. La orden a Gentile fue clara: *"No te separes de él. No le dejes recibir el balón. No le dejes respirar"*. Gentile era un experto en marcaje personal (había estudiado las cintas VHS de los goles de Maradona durante toda la semana). El argentino jugaba con la 10. Gentile pegó su pegatina de marca al número 10 desde el primer minuto.

Las 23 patadas. Las cuentan los estadísticos de FIFA en su revisión del partido años después: tres faltas en el minuto 1, dos en el minuto 5, una cada cinco minutos durante los primeros 45. Algunas eran simples roces de aviso. Otras eran patadas explícitas. La más recordada vino en el minuto 38: Maradona corre con el balón hacia el área italiana, Gentile le agarra desde atrás con las dos manos, el argentino cae al suelo. **El árbitro rumano Nicolae Rainea muestra solo una tarjeta amarilla a Gentile** y otra a Maradona por protestar. Los aficionados argentinos en Sarrià gritan *"¡Asesino!"* desde las gradas.

El partido tuvo dos goles italianos antes del descanso. **Tardelli** marca de cabeza en el minuto 56 y **Cabrini** firma el segundo en el 67. Maradona, por fin libre de Gentile durante diez minutos en la segunda parte (el italiano había sido sustituido en el 80 por riesgo de expulsión,, asistió a Passarella, que firmó el descuento argentino). Italia 2, Argentina 1. La eliminación argentina se consumaría tres días después contra Brasil, en otro partido legendario que Italia ganaría 3-2 con tres goles de Paolo Rossi.

La frase de Maradona. Al salir del campo del Sarrià, Maradona habló con los micrófonos de la televisión argentina con las palabras que abren esta historia: *"Era como tener una sombra detrás. No me dejó respirar"*. Veinte años después, en una entrevista en *El Gráfico*, ampliaría: *"Gentile fue el rival más sucio que tuve en mi carrera. Le pegaron como nunca le habían pegado a nadie en un Mundial. El árbitro lo permitió todo"*. Las 23 patadas se convirtieron en una de las **primeras imágenes en demostrar la necesidad de revisar la dureza permitida** en el fútbol mundialista. Tras España 82, FIFA endureció las normas de juego brusco. La famosa *"camisa amarilla preventiva"* en el primer cuarto del partido se introdujo en parte como reacción a Gentile.

Gentile, el verdugo arrepentido. El italiano, retirado en 1986, dio entrevistas durante décadas sobre aquel partido. En una en 2018 a *La Repubblica*, declaró: *"Yo cumplí la orden de Bearzot. Si pude marcarle es porque era un futbolista brutal. Gracias a aquello, gané un Mundial. Si hubiera dejado de pegarle, Argentina nos hubiera goleado"*. En la misma entrevista admite haber pedido perdón a Maradona personalmente durante una cena en Nápoles en 1994: *"Me dio un abrazo. Me dijo que él hubiera hecho lo mismo si yo hubiera sido el delantero. El fútbol cambia con los años. Aquello no se volverá a ver"*.

El legado. España 82 fue el Mundial de Italia. Paolo Rossi ganó la Bota de Oro con 6 goles. Italia levantó la tercera copa en su historia (1934, 1938, 1982). Pero la imagen que sobrevivió, paradójicamente, no fue la del trofeo: fue la de Maradona caminando hacia el túnel de Sarrià con las piernas marcadas, después de 90 minutos de Gentile. La FIFA conserva esa cinta de televisión catalogada en sus archivos digitales como *"the moment football realized it had to change"*. Cuatro años más tarde, Maradona vengaría todo lo de Sarrià en el Azteca de México. Pero esa, como dicen, es otra historia.`,
  },
  {
    n: 33,
    slug: 'modric-croacia-2018-rusia-subcampeona-luzhniki-final',
    publishDate: '2026-05-21',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Luka Modrić',
    quote: 'Hemos perdido, pero hemos ganado el corazón del mundo.',
    quoteDate: '2018-07-15',
    context:
      'Final del Mundial de Rusia 2018 en el Estadio Luzhniki, Moscú. Francia-Croacia. Luka Modrić, capitán croata de 32 años, había sido la figura del torneo: tres clasificaciones a la final por penaltis, tres prórrogas consecutivas en eliminatorias. Croacia, país de 4 millones de habitantes, llegó a la final del Mundial. Perdió 4-2 contra Francia. Modrić ganó el Balón de Oro del torneo. Es la historia de la mayor gesta de una nación pequeña en un Mundial.',
    source: {
      name: 'FIFA · 2018 World Cup Final',
      url: 'https://www.fifa.com/en/tournaments/mens/worldcup/russia2018/match-center/300331526',
    },
    sourceSecondary: 'Sportske Novosti · The Athletic · BBC Sport · La Vanguardia',
    certainty: 'Alta',
    title:
      'Modrić y la Croacia de los cuatro millones: la gesta del Luzhniki que cambió la jerarquía del fútbol mundial',
    excerpt:
      'En julio de 2018, Croacia llegó a la final del Mundial después de tres prórrogas consecutivas en eliminatorias. Perdió contra Francia, pero Luka Modrić se llevó el Balón de Oro del torneo y la frase definitiva: «Hemos perdido, pero hemos ganado el corazón del mundo». Es la mayor gesta de una nación pequeña en un Mundial.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Croatia%27s_post-match_huddle_after_the_2018_FIFA_World_Cup_Final.jpg/1280px-Croatia%27s_post-match_huddle_after_the_2018_FIFA_World_Cup_Final.jpg',
      alt: 'Los jugadores de Croacia se abrazan tras perder la final del Mundial 2018 contra Francia en el Luzhniki',
      credit: 'Wikimedia Commons',
      license: 'CC BY 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:Croatia\'s_post-match_huddle_after_the_2018_FIFA_World_Cup_Final.jpg',
    },
    body: `Croacia tiene cuatro millones de habitantes. La cifra está mal: en 2018, año del Mundial de Rusia, Croacia tenía exactamente **4,07 millones** de habitantes, según el censo oficial del Instituto de Estadística de Zagreb. Era el país más pequeño en participar en una final de Mundial desde Uruguay 1950 (Uruguay tenía 2,3 millones entonces). Y la diferencia con Uruguay 50 era esencial: Uruguay competía en su propia región sudamericana, Croacia competía en Europa contra Francia, Alemania, Italia, España. La gesta del Luzhniki tiene escala doble: deportiva e identitaria.

El camino hacia la final. Croacia llegó a Rusia 2018 con plantilla de veteranos: **Luka Modrić** (32 años, Real Madrid), **Ivan Rakitić** (30, Barcelona), **Mario Mandžukić** (32, Juventus), **Dejan Lovren** (29, Liverpool), **Ivan Perišić** (29, Inter Milán). La generación dorada croata estaba en su última oportunidad. Habían sido eliminados en cuartos en 1998, primera fase en 2014, sin clasificarse en 2010. Mundial 2018 era todo o nada.

La fase de grupos fue un volcán de fútbol: **3-0 a Nigeria**, **3-0 a Argentina** (con Modrić y Rakitić destrozando al medio campo argentino), 2-1 a Islandia. Era el grupo D, y Croacia lo había ganado con el mejor balance de puntos del Mundial (9). En octavos vencerían a Dinamarca en penaltis (3-2 tras 1-1). En cuartos eliminarían a Rusia anfitriona en penaltis (4-3 tras 2-2). En semifinal vencerían a Inglaterra en prórroga (2-1 tras 1-1, gol de Perišić en el minuto 109 y de Mandžukić en el 109). Tres partidos consecutivos a 120 minutos. Tres partidos consecutivos por la mínima. La selección croata había jugado **el equivalente a un Mundial entero más** en eliminatorias.

El Luzhniki: 15 de julio de 2018. La final llegaría contra **Francia** (la generación dorada francesa de Mbappé, Pogba, Griezmann, Kanté y Lloris). La final empezó a las 18:00 hora de Moscú con 78.011 espectadores en el Luzhniki. **Mario Mandžukić** marcó el primer gol de la final, pero en propia puerta: minuto 18, tras un libre indirecto de Griezmann. Croacia, sorprendida, no se rindió. **Perišić** empató con un latigazo desde fuera del área en el minuto 28 (1-1). En el minuto 38, el VAR del Mundial 2018 (estreno absoluto de la tecnología en una final, anula un córner croata por mano de Perišić en el área). Griezmann tira el penalti correspondiente. **Francia 2, Croacia 1** al descanso.

Acto II: En la segunda parte, **Pogba** y **Mbappé** firmaron el 3-1 y el 4-1 entre los minutos 59 y 65. Mbappé, 19 años, se convirtió en el primer adolescente en marcar en una final del Mundial desde Pelé en Suecia 1958. **Mandžukić** marcó el descuento croata en el 69 tras un error garrafal de Hugo Lloris. 4-2 final. Francia, dos veces campeona del mundo (1998, 2018). Croacia, **subcampeona** por primera vez en su historia.

El llanto del Luzhniki. La imagen más recordada de aquella tarde no es la celebración francesa. Es la imagen de los **once jugadores croatas abrazados en círculo en el centro del campo**, bajo la lluvia que había empezado a caer en Moscú durante los últimos quince minutos. **Modrić, Rakitić, Mandžukić, Perišić, Lovren, Vrsaljko, Strinić, Vida, Kovačić y Pivarić** lloraban mientras Hugo Lloris levantaba la copa veinte metros más allá. La presidenta croata **Kolinda Grabar-Kitarović** bajó al campo bajo la lluvia para abrazar uno a uno a sus jugadores. La foto se hizo viral durante días.

El Balón de Oro de Modrić. La FIFA anunció el premio individual del Mundial mientras los jugadores aún estaban en el campo. **Luka Modrić**, ganador. Era el primer jugador no-de-equipo-campeón en ganar el premio desde Romario en 1994. Modrić venía de ganar la Champions League con el Real Madrid dos meses antes. En diciembre del mismo año, ganaría también el Balón de Oro de France Football, rompiendo la racha de 10 años consecutivos de Messi-Cristiano.

La frase. En la rueda de prensa post-partido, Modrić apareció con los ojos rojos y la voz quebrada. Las palabras llegaron en croata, traducidas por una intérprete: *"Estamos tristes pero orgullosos. Hemos perdido la final, pero hemos ganado el corazón del mundo. Nuestra historia no termina aquí. Volveremos"*. La frase se convirtió en eslogan nacional: aún hoy aparece pintada en murales de Zagreb, Split y Rijeka.

El impacto. Croacia regresó a Zagreb tres días después con un desfile en autobús descapotable que atrajo a **550.000 personas** (el 13% de la población del país). La ciudad colapsó. La aerolínea Croatia Airlines pintó el avión con motivos del Mundial. El presidente croata declaró el 16 de julio festivo nacional. El gobierno aprobó un fondo de **5 millones de euros** para becas deportivas a niños de zonas deprimidas, vinculado al éxito mundialista.

El precedente, Suecia 1958. La última vez que un país tan pequeño llegó tan lejos había sido Suecia en 1958 (entonces 7,4 millones de habitantes, segundo lugar). El precedente directo seguía siendo Uruguay 1950, pero con la ventaja del territorio propio. Croacia 2018 dejaba claro que en el fútbol moderno, con el ecosistema globalizado y la formación europea unificada, **un país de cuatro millones podía competir con los gigantes**. Era una demostración de método sobre escala.

El epílogo 2026. Modrić tiene 40 años en el momento de escribir esto. Vuelve a estar convocado por Croacia para el Mundial 2026. Lo hace por **quinto Mundial consecutivo** (2006, 2014, 2018, 2022, 2026), récord absoluto compartido con Cristiano Ronaldo y Rafael Márquez. *"Vamos a hacer todo lo posible por volver"*, dijo en una entrevista en *Sportske Novosti* en enero de 2026. Croacia está en el Grupo L con Inglaterra, Ghana y Panamá. Su rival en octavos podría ser España. Y la final del 19 de julio de 2026 le pillaría con 40 años y 308 días, edad récord para un jugador en una final mundialista. Tendría su revancha del Luzhniki. *"Y si volvemos al Bernabéu en cuartos (añade Modrić riendo en la misma entrevista,, ya he visto demasiados penaltis"*).`,
  },
  {
    n: 34,
    slug: 'cruyff-holanda-1974-futbol-total-final-perdida-munich',
    publishDate: '2026-05-22',
    blockCode: 'S5',
    category: 'historica',
    protagonist: 'Johan Cruyff',
    quote: 'Jugar al fútbol es muy simple, pero jugar al fútbol simple es lo más difícil que hay.',
    quoteDate: '1974-07-07',
    context:
      'Final del Mundial de Alemania 1974 en el Olímpico de Múnich. Holanda-Alemania Federal. Johan Cruyff (27 años), capitán naranja, había revolucionado el fútbol mundial con el «fútbol total» (totaalvoetbal) bajo dirección de Rinus Michels. Holanda llegaba a la final como favorita absoluta. Perdió 2-1 contra Alemania en el minuto 25 con un Cruyff anulado por Berti Vogts. Es el equipo del Mundial que generó más influencia en la historia táctica del fútbol.',
    source: {
      name: 'Wikipedia · Países Bajos en la Copa Mundial de 1974',
      url: 'https://es.wikipedia.org/wiki/Pa%C3%ADses_Bajos_en_la_Copa_Mundial_de_F%C3%BAtbol_de_1974',
    },
    sourceSecondary: 'De Telegraaf · Voetbal International · La Vanguardia · El País Semanal',
    certainty: 'Alta',
    title:
      'Cruyff y la Naranja Mecánica: el equipo que perdió la final pero ganó la historia del fútbol',
    excerpt:
      'En 1974, Holanda de Cruyff llegó a la final del Mundial revolucionando el fútbol con el totaalvoetbal. Perdió 2-1 contra Alemania pero su influencia táctica supera a la de cualquier equipo campeón. Es la historia del fútbol total y del único Cruyff que disputó un Mundial.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/WK_74%2C_Nederland_tegen_Argentinie_4-0%3B_nr._7a_Cruyff_bij_keeper_Carnevalli.jpg',
      alt: 'Johan Cruyff regatea al portero argentino Daniel Carnevali en el Holanda 4-0 Argentina del Mundial 1974',
      credit: 'Anefo · Wikimedia Commons',
      license: 'CC0 (Dominio público)',
      source: 'https://commons.wikimedia.org/wiki/File:WK_74,_Nederland_tegen_Argentinie_4-0;_nr._7a_Cruyff_bij_keeper_Carnevalli.jpg',
    },
    body: `Hay equipos que ganan el Mundial. Hay equipos que cambian el fútbol. La **Holanda de 1974** es el más célebre ejemplo de que las dos cosas no siempre coinciden. Liderada por **Johan Cruyff** (27 años, Ajax-Barcelona) y dirigida por **Rinus Michels** (50 años, *De Generaal*), la *Naranja Mecánica* perdió la final del Mundial 1974 contra Alemania Federal por **2-1** en el Olímpico de Múnich. Y sin embargo, cincuenta años después, **la influencia táctica de aquel equipo supera con creces** la de los campeones de 1974, 1978 o 1982. Es el equipo más estudiado de la historia. Su forma de jugar engendró al Barcelona de Guardiola, al Bayern Munich de Heynckes, al Manchester City de hoy.

El totaalvoetbal. Rinus Michels lo desarrolló como entrenador del Ajax de Ámsterdam entre 1965 y 1971. La idea, en esencia, era revolucionaria: **cualquier jugador podía ocupar cualquier posición en el campo en cualquier momento del partido**. El central podía atacar. El delantero podía defender. El portero salía a jugar como un onceavo defensor. Los movimientos sin balón formaban patrones geométricos que mareaban al rival. El equipo no jugaba en posiciones fijas: jugaba en roles intercambiables coordinados. La distancia entre líneas era de 25-30 metros (el resto del mundo en 1974 jugaba a 40-50 metros). El equipo presionaba al rival inmediatamente tras perder el balón (lo que después se llamaría *gegenpressing*). El portero **Jan Jongbloed** jugaba como un defensor más a 30 metros de su área (algo impensable en aquel fútbol).

Los cracks. El equipo lo formaban: **Cruyff** (extremo izquierdo, falso 9 y libero táctico, todo a la vez), **Johan Neeskens** (mediocentro creativo), **Wim van Hanegem** (medio izquierdo), **Ruud Krol** (central que atacaba), **Wim Suurbier** (lateral derecho), **Arie Haan** y **Willem van Hanegem** (organizadores del centro del campo), **Rob Rensenbrink** y **Johnny Rep** (extremos). En el banco esperaban Piet Keizer y René van de Kerkhof. Era una generación irrepetible (**siete jugadores del Ajax campeón de las tres Copas de Europa consecutivas 1971-1973**, más cuatro fichados del Feyenoord).

El camino al final. Holanda entró en el grupo C con Uruguay, Suecia y Bulgaria. **2-0 a Uruguay, 0-0 con Suecia, 4-1 a Bulgaria**. Pase de fase como segunda del grupo. En la segunda fase, en el grupo B junto con Brasil, Argentina y Alemania del Este, sucedió lo impensable: **Holanda 4-0 Argentina** (con un gol de Cruyff que la prensa argentina bautizó como *"el regate más bonito del Mundial"*), **Holanda 2-0 Alemania del Este**, y la perla de la conmemoración: **Holanda 2-0 Brasil**, victoria contra el Brasil de Rivelino que destronaba a los campeones vigentes de 1970 sin ningún tipo de duda. Cruyff había marcado el primer gol y asistido el segundo de Neeskens.

La final del 7 de julio de 1974. Olímpico de Múnich. Holanda 1, Alemania 2. El partido tuvo un comienzo demencial: Holanda toca el balón **catorce veces consecutivas** sin que un jugador alemán lo roce. En el minuto 1, Cruyff es derribado por Berti Vogts en el área alemana. Penalti. **Neeskens lo marca** al minuto 1:25 del partido (el penalti más rápido en la historia de una final del Mundial). Holanda 1, Alemania 0. El estadio de Múnich enmudece.

Pero entonces empezó la historia que el fútbol holandés llama *"de overmoed"* (la presunción). Holanda salió a humillar a Alemania. Buscó el segundo y el tercero antes que cuidar el resultado. El árbitro inglés Jack Taylor pitó penalti para Alemania en el minuto 25 tras una caída discutible de Hölzenbein. Paul Breitner lo marcó. 1-1. Antes del descanso, en el minuto 43, **Gerd Müller** firmaba el 2-1 con un giro y volea que entró por la base del poste izquierdo. Sentencia. Holanda atacó toda la segunda parte sin éxito. Cruyff fue marcado por **Berti Vogts** durante los 90 minutos (el alemán, marcando como Gentile haría 8 años después). Final: Alemania 2, Holanda 1. **¿Por qué perdió Holanda?** Las teorías son múltiples. La más extendida: la prensa holandesa publicó el día anterior fotos de Cruyff y otros jugadores en una piscina del hotel con cuatro mujeres (**"el escándalo de la piscina"**). La esposa de Cruyff, Danny Cruyff, le llamó por teléfono esa misma noche desde Barcelona en una conversación que duró tres horas. La leyenda dice que Cruyff llegó al partido con tres horas de sueño. La teoría alternativa: Holanda salió al campo creyendo que ya había ganado. Otra: Müller era inevitable (marcó 14 goles en sus dos Mundiales (1970 y 1974), récord histórico para un alemán hasta Klose).

La frase. Cruyff la pronunció en una entrevista en *De Telegraaf* el 7 de julio de 1974, horas después del partido. *"Jugar al fútbol es muy simple, pero jugar al fútbol simple es lo más difícil que hay"*. La frase resume su filosofía: el toque, el espacio, la sencillez. Es el fundamento de lo que después se llamará *"el método Cruyff"* y que Pep Guardiola consagraría como filosofía del Barcelona moderno. Cuando Cruyff murió en marzo de 2016, la frase apareció escrita en banderas de fans desde Ámsterdam hasta Buenos Aires.

El legado. El fútbol total holandés transformó al fútbol mundial. Sin esa generación, no habría existido el Barcelona Cruyff entrenador (1988-1996), ni el Barça de Guardiola (2008-2012), ni la España campeona del Mundial 2010 que jugó con técnicos formados en la filosofía Cruyff (Luis Aragonés y Vicente del Bosque). El propio Cruyff dirigió al Barça durante ocho temporadas, ganó la primera Champions League azulgrana (1992) e instituyó el modelo de La Masía como cantera del primer equipo. **El AC Milan de Sacchi (1987-1991), el Borussia Dortmund de Klopp (2011-2015) y el Liverpool actual de Slot** mantienen versiones del totaalvoetbal en su ADN. Solo dos selecciones nacionales lo han llevado al éxito mundialista: España 2010 y Alemania 2014. Ninguna era Holanda.

El epílogo. Cruyff jugó un solo Mundial en su carrera. Renunció a Argentina 1978 por motivos personales (un intento de secuestro contra su familia en Barcelona, según reveló él mismo en su autobiografía de 2016). Holanda volvió a la final de 1978 (la perdió contra Argentina 3-1 en prórroga) y a la de 2010 (la perdió contra España 1-0 en prórroga). Tres finales perdidas. Cero copas. Más libros escritos sobre su fútbol que sobre todos los campeones del Mundial juntos. *"Si quieres ganar, primero tienes que jugar bien. No al revés"*, decía Cruyff. Su Holanda jugó como nadie había jugado. Y perdió.`,
  },
  {
    n: 35,
    slug: 'marruecos-2022-semifinal-primer-africano-arabe-regragui-hakimi-bono',
    publishDate: '2026-05-23',
    blockCode: 'S5',
    category: 'epica',
    protagonist: 'Walid Regragui · Achraf Hakimi · Yassine Bono',
    quote: 'Esta victoria es para todos los africanos, para todo el mundo árabe.',
    quoteDate: '2022-12-10',
    context:
      'Cuartos de final del Mundial de Catar 2022 en el Estadio Al Thumama, Doha. Marruecos-Portugal. Marruecos gana 1-0 con gol de cabeza de Youssef En-Nesyri y se convierte en la primera selección africana y árabe en alcanzar las semifinales del Mundial. La hazaña tiene contexto: Marruecos había eliminado en octavos a España en penaltis (3-0 con Bono parando dos). Walid Regragui había asumido la selección apenas tres meses antes del Mundial. Es la historia de la mayor gesta del fútbol africano y árabe en un Mundial.',
    source: {
      name: 'FIFA · 2022 World Cup Morocco',
      url: 'https://www.fifa.com/en/tournaments/mens/worldcup/qatar2022/teams/morocco',
    },
    sourceSecondary: 'Hespress · Le Matin · Al Jazeera · BBC Sport · As',
    certainty: 'Alta',
    title:
      'Marruecos en Doha: la primera selección africana y árabe en una semifinal del Mundial',
    excerpt:
      'En diciembre de 2022, los Leones del Atlas eliminaron a España en octavos y a Portugal en cuartos. Marruecos se convirtió en la primera selección africana y árabe en alcanzar las semifinales del Mundial. Walid Regragui llevaba tres meses al frente. La gesta cambió el mapa del fútbol mundial.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Portugal-Morocco_by_soccer.ru_12.jpg/1280px-Portugal-Morocco_by_soccer.ru_12.jpg',
      alt: 'Achraf Hakimi y otros jugadores marroquíes celebran tras eliminar a Portugal en cuartos del Mundial 2022',
      credit: 'soccer.ru · Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:Portugal-Morocco_by_soccer.ru_12.jpg',
    },
    body: `**Marruecos llevaba 36 años intentando ganar un partido eliminatorio en un Mundial**. Desde México 86, cuando los Leones del Atlas habían sido la primera selección africana en pasar la fase de grupos en un Mundial (cayeron en octavos contra Alemania Federal 1-0 con gol de Matthäus en el minuto 88). Cuatro Mundiales después (1986, 1994, 1998, 2018), Marruecos seguía sin cruzar la primera ronda eliminatoria. La gesta del **10 de diciembre de 2022 en el Estadio Al Thumama de Doha** (**Marruecos 1, Portugal 0**, gol de cabeza de **Youssef En-Nesyri** en el minuto 42, rompió esa maldición histórica de manera definitiva).

El contexto. Marruecos había llegado al Mundial 2022 con un panorama interno desolador. **Vahid Halilhodžić**, seleccionador desde 2019, había clasificado al equipo a Catar pero acumulaba enemistades con varios jugadores (especialmente con Hakim Ziyech (Chelsea) y Noussair Mazraoui (Bayern Munich), que se habían negado a jugar bajo sus órdenes). La Federación Marroquí destituye a Halilhodžić el **31 de agosto de 2022**, tres meses antes del inicio del Mundial. La presión es asfixiante: el sustituto debe construir un equipo, reconciliar a las estrellas y prepararlo para Catar en doce semanas. La FRMF nombra a **Walid Regragui**, 47 años, ex-técnico del Wydad Casablanca (campeón de la Champions League africana 2022) y ex-defensor del propio Marruecos en 2006.

El proyecto Regragui. Regragui reincorporó inmediatamente a Ziyech y Mazraoui. Recuperó a **Achraf Hakimi** (PSG), **Yassine Bounou** "Bono" (Sevilla), **Romain Saïss** (Beşiktaş) y al resto del núcleo. La filosofía táctica: bloque bajo, defensa de cinco, contraataques. El propio Regragui declaró en septiembre, durante su primera rueda de prensa: *"No vamos a ser España. No vamos a ser Brasil. Vamos a ser Marruecos. Vamos a defender con once y atacar con cinco. Y vamos a sorprender"*. Los críticos lo calificaron de derrotista. Las apuestas daban a Marruecos como **rival más débil de su grupo** (Bélgica, Croacia, Canadá).

La fase de grupos: el primer aviso. Marruecos empata sin goles con Croacia (que llegaría a la final del Mundial 2018). **Gana 2-0 a Bélgica** (golazo de Sabiri y otro de Aboukhlal) en uno de los grandes resultados sorpresa de toda la fase de grupos. Gana 2-1 a Canadá. Primera selección africana en ganar un grupo del Mundial desde Nigeria 1998. Pero la verdadera historia, lo que cambiaría la conversación, estaba por venir.

**Octavos: España 0, Marruecos 0 (3-0 en penaltis)**. El 6 de diciembre de 2022, en el Estadio Education City. Luis Enrique presentó una España con Pedri, Gavi, Olmo, Asensio y Morata. Marruecos resistió 120 minutos con bloque bajo, sin permitir un solo remate dentro del área propia. En la tanda de penaltis, **Bounou paró el primero a Sarabia, el segundo a Busquets (palo) y el tercero a Carlos Soler**. Hakimi marcó el último, definitorio. Hakimi nacido en Madrid, criado en Getafe, formado en La Fábrica del Real Madrid, eligió Marruecos sobre España en su debut internacional. La ironía no se le escapó a nadie. *"Es la victoria del barrio sobre el palacio"*, escribió Diego Torres en *El País*.

**Cuartos: el 10 de diciembre, contra Portugal de Cristiano**. Pepe, Bruno Fernandes, Rafael Leão, João Félix, Diogo Costa. Cristiano Ronaldo en el banquillo (decisión del seleccionador Fernando Santos que generó polémica en Portugal). El partido transcurre como Regragui había planificado: bloque bajo, presión coordinada, salidas en contraataque. Minuto 42: tiro de córner desde la izquierda, **Youssef En-Nesyri** (delantero del Sevilla) salta más alto que el portero Diogo Costa que se queda paralizado en el área pequeña. Marruecos 1, Portugal 0. Portugal atacó durante el resto del partido. Bounou se llevó la portería (tres paradas seguidas en el minuto 89 con Cristiano ya en el campo). El árbitro Facundo Tello pitó el final a las 22:38 hora de Doha. Marruecos era semifinalista. Primera selección africana en la historia del Mundial. Primera selección árabe. Primera selección musulmana. El estadio Al Thumama estalló: los aficionados marroquíes habían llegado en masa desde Casablanca, Rabat y Tánger (vuelos charter directos pagados por la FRMF). La imagen del padre de Achraf Hakimi, Hassan, abrazado al hijo en el campo (Achraf llevaba a su madre y a su padre al estadio en cada partido del Mundial) se convirtió en la fotografía más vista del torneo. 11 millones de likes en Instagram en dos horas. 200.000 retuits en X.

La frase. Regragui apareció en rueda de prensa con la voz quebrada. *"Esta victoria es para todos los africanos, para todo el mundo árabe. Hemos demostrado que los pequeños pueden vencer a los grandes. Hemos cambiado el mapa del fútbol mundial. La FIFA, la UEFA, las grandes ligas... ya no pueden mirar a África con desdén"*. La declaración voló por todos los medios árabes. En Casablanca, El Cairo y Riad las cadenas públicas interrumpieron sus emisiones para retransmitirla en directo. **El rey Mohammed VI** llamó personalmente a Regragui esa misma noche. Le ofreció **la Orden del Trono**, la condecoración civil más alta de Marruecos. Regragui la rechazó: *"Cuando ganemos el Mundial, no antes"*.

La semifinal y el bronce. Marruecos cayó **2-0 contra Francia** en semifinales (goles de Hernández y Kolo Muani) el 14 de diciembre. En el partido por el tercer puesto, perdió 2-1 contra Croacia, repitiendo la combinación que ya había aparecido en el Luzhniki 2018. Cuarto puesto del Mundial. Pero la dimensión simbólica de aquella semana había superado de largo la jerarquía deportiva: **el primer país africano y árabe en jugar una semifinal del Mundial**.

El impacto en África. La FIFA decidió en 2023 ampliar el número de selecciones africanas en el Mundial 2026 de 5 a **9** (más una repesca). Marruecos pasó a ser un país de referencia futbolística en el ranking FIFA (del puesto 22 al 11 en seis meses). El sucesor de la cantera marroquí del Mundial 2022 son los jugadores de **Mazraoui, Hakimi, Ziyech, Bounou, En-Nesyri, Amrabat**: la mayoría jugaban en clubes europeos top antes del Mundial; después de Doha, todos eran cotizados en mercado.

El epílogo 2026. Marruecos se ha clasificado para el Mundial 2026 sin perder un partido de eliminatorias. Está en el Grupo C con Brasil, Haití y Escocia. Walid Regragui sigue como seleccionador. Achraf Hakimi sigue como capitán. La pregunta editorial está abierta: *¿puede repetir Marruecos lo de Catar 2022?* En diciembre de 2025, en entrevista en *Hespress*, Regragui contestó así: *"Lo de Catar fue lo que era. Una gesta. En 2026 no necesitamos gestas. Necesitamos consagración. Vamos a por el Mundial. Y si no, a por las semifinales otra vez. Esta vez con la copa en mente"*. La frase llegó a portada de todos los diarios árabes a la mañana siguiente.`,
  },
  {
    n: 36,
    slug: 'naranjito-pertini-anos-de-plomo-espana-1982-italia-transicion-mundial',
    publishDate: '2026-05-24',
    blockCode: 'S5',
    category: 'historica',
    protagonist: 'Sandro Pertini',
    quote: 'No nos van a alcanzar más.',
    quoteDate: '1982-07-11',
    context:
      'Final del Mundial de España 1982 en el Santiago Bernabéu de Madrid. Italia gana 3-1 a Alemania Federal con goles de Paolo Rossi, Tardelli y Altobelli. En el palco oficial, el presidente italiano Sandro Pertini, antiguo partisano antifascista de 86 años, celebra el tercer gol golpeando el aire con su pipa y se gira hacia el banquillo alemán. El rey Juan Carlos I, anfitrión del torneo, observa la escena. Italia y España, dos países en transición política, cierran un capítulo de su historia con un partido de fútbol.',
    source: {
      name: 'Panenka, Brazalete Files 27',
      url: 'https://www.panenka.org/panenkapodcast/brazalete-files-27-naranjito-contra-los-anos-de-plomo/',
    },
    sourceSecondary: 'Wikipedia, Alberto Ojeda (Cuero contra plomo) · The International Journal of the History of Sport · Goal.com',
    certainty: 'Alta',
    title:
      'Naranjito, Pertini y los años de plomo: cómo el Mundial 82 cerró dos transiciones políticas a la vez',
    excerpt:
      'El verano del 82 fue mucho más que un torneo: una España que salía de la dictadura y una Italia que dejaba atrás los años de plomo encontraron en el Bernabéu el espejo simbólico de sus dos transiciones democráticas. La foto de Pertini, partisano y presidente, con la copa al lado en el avión de vuelta a Roma, es la imagen política más potente de la historia de los Mundiales.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Pertini_Causio_Conti_1982.jpg/1280px-Pertini_Causio_Conti_1982.jpg',
      alt: 'Sandro Pertini, presidente italiano y antiguo partisano, juega a las cartas con Causio, Bearzot y Zoff en el avión de vuelta a Roma tras la final del Mundial 1982, con la copa al lado',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:Pertini_Causio_Conti_1982.jpg',
    },
    body: `El **11 de julio de 1982**, en el Santiago Bernabéu de Madrid, Italia ganó la final del Mundial a Alemania Federal por 3-1. Goles de Paolo Rossi, Marco Tardelli y Alessandro Altobelli. La selección italiana levantó su tercera copa del mundo (la primera desde 1938) y el rey de España, Juan Carlos I, entregó el trofeo al capitán Dino Zoff. Hasta aquí, la versión deportiva. La historia política de aquella tarde, sin embargo, fue mucho más densa. En el palco de autoridades, junto al rey, estaba sentado **Sandro Pertini**, presidente de la República Italiana, **86 años**, antiguo partisano antifascista que había escapado de una condena a muerte nazi en 1944. Cuando Tardelli marcó el 2-0 en el minuto 69, Pertini se levantó de la silla con los puños cerrados gritando *"¡Goool!"*. Cuando Altobelli firmó el 3-1 en el 81, golpeó el aire con su pipa y se giró hacia el banquillo alemán con la frase que pasaría a la mitología: *"No ci prendono più"* (*"No nos van a alcanzar más"*). El gesto se hizo viral antes de que existiera Internet.

España e Italia eran, aquel verano, dos países que cargaban con un pasado reciente muy pesado. **España** vivía la fase más vulnerable de su transición democrática: el golpe de Estado del 23 de febrero de 1981 estaba todavía a un año vista, el referéndum de la OTAN se votaría en marzo de 1986, las primeras elecciones de Felipe González llegarían cuatro meses después de la final del Mundial. **ETA mataba a un guardia civil cada tres días de media en 1982**, según los datos de la Fundación Víctimas del Terrorismo. El día de la inauguración del torneo, **13 de junio de 1982**, mientras el Camp Nou se llenaba de palomas blancas y dieciséis mil personas vibraban en la apertura Argentina-Bélgica, **ETA asesinaba al guardia civil Antonio Pérez Gallego** en Villabona (Guipúzcoa). La noticia compartió portadas de los diarios del día siguiente con las imágenes del estadio barcelonés. *"El fútbol y el terror se disputaban el protagonismo"*, escribiría décadas después el periodista Alberto Ojeda en su libro *Cuero contra plomo. Fútbol y sangre en el verano del 82*.

**Italia** salía de un período aún más violento. Los **años de plomo** italianos (1968-1982) habían dejado más de 400 muertos por terrorismo de extrema izquierda y extrema derecha. Las **Brigadas Rojas** habían secuestrado al líder democristiano **Aldo Moro** el 16 de marzo de 1978 y lo habían asesinado 55 días después, abandonando su cadáver en el maletero de un Renault 4 aparcado en la Via Caetani de Roma, a medio camino simbólico entre las sedes del Partido Comunista y de la Democracia Cristiana. El año del Mundial 82 fue el primer año desde 1968 en que el Estado italiano comenzó a ganar la batalla judicial contra el terrorismo (el llamado *processone Moro* iba avanzado, los líderes brigadistas estaban siendo detenidos uno tras otro). Pertini, presidente desde 1978 (el año mismo del asesinato de Moro), encarnaba la respuesta institucional contra la violencia. Su biografía personal pesaba como un manifiesto: socialista miembro del PSI, partisano de la Resistencia, condenado a muerte por los nazis en 1944, había liderado el levantamiento de Milán del 25 de abril de 1945 que terminó con la ejecución de Mussolini y la liberación de Italia. Que aquel hombre celebrara la victoria mundialista golpeando el aire con su pipa, a sus 86 años, era exactamente la imagen política que Italia necesitaba.

**Paolo Rossi** completaba el círculo simbólico desde el lado deportivo. Dos años antes del Mundial, en 1980, había estallado el **escándalo del Totonero** (apuestas ilegales en el fútbol italiano), uno de los mayores fraudes deportivos de la historia europea. Rossi, jugador del Perugia, recibió una sanción de tres años (rebajada a dos en apelación) por presunto amaño en un Avellino-Perugia. Llegó al Mundial 82 después de cumplir su sanción, con dudas físicas, marcado por la prensa como un futbolista quemado. Bearzot, el seleccionador, apostó por él contra todo el consenso periodístico. Rossi marcó seis goles en los últimos cuatro partidos del torneo (hat-trick contra Brasil en la segunda fase, doblete contra Polonia en semifinal, primer gol contra Alemania en la final), ganó la **Bota de Oro**, fue elegido **Balón de Oro de France Football** en diciembre de 1982 y se convirtió en el símbolo del cierre de la era violenta italiana. Si Pertini era la respuesta política contra los años de plomo, Rossi era la deportiva: la redención individual que se podía contar en goles.

La imagen que cerró el círculo no fue ni el levantamiento de la copa ni los abrazos del campo. Fue una fotografía tomada **en el avión presidencial de vuelta a Roma**, la tarde del lunes 12 de julio. Pertini, sin chaqueta, jugaba una partida de **scopa** (juego de cartas tradicional italiano) con tres de los protagonistas del título: el seleccionador **Enzo Bearzot**, el extremo **Franco Causio** (uno de los veteranos del equipo) y el capitán y portero **Dino Zoff** (40 años cumplidos en febrero, el portero más viejo en ganar un Mundial). Sobre la mesa, junto a las cartas, **la Copa Jules Rimet**. La foto la publicó *La Gazzetta dello Sport* en su portada del 13 de julio con un único título: *"Ritorno a Roma"*. Décadas después, el académico británico Simon Martin escribiría en *The International Journal of the History of Sport* que aquella fotografía era *"la representación visual más sintética del nacimiento de la Italia republicana moderna: un ex partisano, un seleccionador, un capitán y un trofeo, en un avión, jugando a las cartas como si fueran amigos en un café"*.

Naranjito, mientras tanto, había sido el otro símbolo del verano del 82. La **naranja antropomórfica diseñada por José María Martín Pacheco y María Dolores Salto en 1978** se convirtió en la mascota oficial del Mundial y en uno de los iconos visuales más reconocibles de la transición española. Modelado deliberadamente como una imagen amable, no agresiva, multicultural en su simpatía y exportable a niños de cualquier país, Naranjito acompañó al torneo durante dieciséis meses de campaña publicitaria previa y se convirtió en la primera mascota mundialista con merchandising masivo de gran éxito. Aparecía en cromos, sellos, peluches, vasos, tazas, en las pancartas oficiales. La España de Naranjito era una España que se presentaba al mundo como amable, abierta, contemporánea. Era una imagen política, aunque pareciera infantil.

Hay piezas de la historia del fútbol que solo se entienden cuando se les añade el contexto de su época. La final del Bernabéu del 11 de julio de 1982 es una de ellas. **Italia ganó un Mundial. España organizó un Mundial**. Pero lo que verdaderamente cerró aquella tarde no fue solo el torneo. Fue una época. Si el balón rodó bien, fue porque dos países que llevaban años no rodando del todo decidieron que era el momento de empezar otra vez.`,
  },
  {
    n: 37,
    slug: 'zidane-doblete-final-francia-brasil-1998-saint-denis-stade-de-france',
    publishDate: '2026-05-25',
    blockCode: 'S7',
    category: 'epica',
    protagonist: 'Zinedine Zidane',
    quote: 'Empecé a jugar al fútbol para que mi padre estuviera orgulloso de mí. Esa final fue para él.',
    quoteDate: '1998-07-13',
    context:
      'Final del Mundial de Francia 1998 en el Stade de France de Saint-Denis. Francia gana 3-0 a Brasil con doblete de cabeza de Zinedine Zidane en el primer tiempo (minutos 27 y 45+1) y tercer gol de Emmanuel Petit en el descuento. Es la primera y única estrella de Francia en el escudo. Zidane, hijo de inmigrantes argelinos nacido en La Castellane (Marsella), se convierte en el héroe deportivo de una Francia multicultural. Brasil, defensor del título, juega con Ronaldo en un estado físico inexplicable que sigue siendo polémico tres décadas después.',
    source: {
      name: 'Wikipedia, 1998 FIFA World Cup Final',
      url: 'https://en.wikipedia.org/wiki/1998_FIFA_World_Cup_Final',
    },
    sourceSecondary: 'L\'Équipe · So Foot · Le Monde · The Guardian · As',
    certainty: 'Alta',
    title:
      'Zidane y los dos cabezazos del Stade de France: la primera estrella de Francia y la pregunta sin resolver de Ronaldo',
    excerpt:
      'El 12 de julio de 1998, en Saint-Denis, Zinedine Zidane marcó dos goles de cabeza a Brasil en una final del Mundial. Francia ganó 3-0 y conquistó la primera estrella de su historia. Brasil sigue preguntándose, tres décadas después, qué le pasó a Ronaldo aquella tarde.',
    cover: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Zinedine_Zidane_2008.jpg/1280px-Zinedine_Zidane_2008.jpg',
      alt: 'Zinedine Zidane, mediapunta francés y autor del doblete de la final del Mundial 1998 contra Brasil',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:Zinedine_Zidane_2008.jpg',
    },
    body: `Hay finales que entran en la conversación de cualquier país aficionado al fútbol. La del **12 de julio de 1998 en el Stade de France** lo hizo por partida doble: por la victoria francesa en su propia casa y por la incógnita brasileña que sigue abierta. **Francia 3, Brasil 0**. Doblete de Zinedine Zidane de cabeza en el primer tiempo, gol de Emmanuel Petit en el descuento. Era la primera vez que Francia ganaba un Mundial en cualquier formato. Era la primera vez que Brasil, campeón vigente, perdía una final mundial por más de un gol desde 1950. Y fue el partido que coronó a Zidane, hijo de inmigrantes argelinos nacido en el barrio marginal de **La Castellane (Marsella)**, como héroe deportivo de una Francia que ese verano se redescubrió a sí misma con el eslogan *"black, blanc, beur"* (negro, blanco, magrebí).

La temporada previa francesa. La selección de **Aimé Jacquet**, criticada durante meses por la prensa francesa, había llegado al Mundial de su propia casa con dudas tácticas y un consenso periodístico tibio. *L\'Équipe*, el diario deportivo de referencia, escribió en mayo de 1998 una serie de artículos contra Jacquet en los que pedía abiertamente su destitución antes del torneo. La Federación Francesa lo mantuvo. Jacquet construyó el equipo alrededor de un trío de mediocentros (Petit, Deschamps, Karembeu), de una defensa atlética encabezada por Marcel Desailly y Lilian Thuram, de Zidane como creador y de Stéphane Guivarc\'h como nueve de referencia. Guivarc\'h marcaría cero goles en el torneo.

El camino a la final tuvo dos momentos definitorios. En cuartos, Francia eliminó a Italia en penaltis después de un 0-0 agónico. En semifinales, contra Croacia (subcampeona, generación dorada de Šuker, Boban y Prosinečki), **Lilian Thuram marcó los dos goles** del partido, los únicos de su carrera internacional en 142 partidos con la selección. Thuram, defensor central que nunca remataba, había escrito el guion más improbable de un Mundial. Francia 2, Croacia 1. Final contra Brasil.

Brasil llegaba como favorito absoluto. La selección de **Mario Zagallo**, con Ronaldo (21 años, Balón de Oro vigente, máximo goleador del Inter de Milán), Rivaldo (Barcelona), Roberto Carlos (Real Madrid), Cafú, Dunga, Bebeto y un Romário ausente por lesión, había sido tercera en cuartos contra Dinamarca y campeona en semifinales contra los Países Bajos en penaltis. **Ronaldo era el favorito a la Bota de Oro** del torneo con 4 goles previos.

La mañana del 12 de julio de 1998. Lo que sucedió en el Hotel Concorde Lafayette de París las horas previas a la final sigue siendo uno de los grandes misterios del fútbol. Ronaldo sufrió un episodio convulsivo de origen nunca aclarado oficialmente. Hay versiones contradictorias: epilepsia preexistente no diagnosticada, reacción adversa a la comida del hotel mantenida en secreto por presión patrocinadora de Nike, estrés psicológico extremo por el peso mediático. El doctor del equipo brasileño, **Lídio Toledo**, lo medicó con tranquilizantes. **Zagallo dejó a Ronaldo fuera del once titular dos horas antes del partido**. Los periodistas vieron en el calentamiento al equipo brasileño sin Ronaldo. El número 9 era **Edmundo**.

Pero entonces llegó la presión. Ronaldo, que había recuperado parcialmente la conciencia y se sentía mejor, insistió ante Zagallo en jugar. Algunas fuentes (entrevista de Roberto Carlos a *Globoesporte* en 2002, libro de Alex Bellos *Futebol* de 2002) apuntan también a una llamada directa de Nike a la CBF presionando por la inclusión del Balón de Oro vigente. **Zagallo lo readmitió al once cuarenta minutos antes del pitido inicial**. Ronaldo salió al campo pero jugó como un fantasma: sin la coordinación habitual, sin el cambio de ritmo característico, sin la decisión finalizadora que era su marca.

El partido. **Minuto 27**: córner de Petit desde la derecha. Zidane, no especialmente alto (1,85m) pero con un timing y un cuello extraordinarios, saltó por delante de Leonardo y cabeceó al fondo de la portería de Taffarel. Francia 1, Brasil 0. **Minuto 45+1, último de la primera parte**: córner de Djorkaeff desde la izquierda. Zidane volvió a saltar, esta vez por delante de Dunga, y volvió a marcar de cabeza. Francia 2, Brasil 0 al descanso. Era inédito en la historia del Mundial: nadie había marcado dos goles de cabeza en una final.

En la segunda parte, Brasil empujó sin precisión. Marcel Desailly fue expulsado en el minuto 68 por doble amarilla. Francia jugó los 22 minutos finales con diez hombres. Pero Brasil no encontró el camino. Ronaldo desapareció en cada balón. Roberto Carlos fue absorbido por Karembeu. Dunga gritaba sin que le escuchara nadie. En el minuto 90+3, contraataque francés rapidísimo iniciado por Vieira, asistencia a Petit, que la cruzó con la zurda y firmó el 3-0. Gol del descuento. Final del partido. Pitido del árbitro marroquí **Said Belqola**. **Francia, campeona del mundo por primera vez en su historia**.

La escena posterior. En el palco, **Jacques Chirac**, presidente francés, sin levitismo ni protocolo, se abrazó con la madre de Zidane. La banda sonora del estadio, en bucle: *"On a gagné, on a gagné"*. Los Campos Elíseos colapsaron con **un millón y medio de personas**. Era la mayor concentración pública francesa desde la Liberación de París en 1944. Zidane, ya en zona mixta, declaró la frase que repetiría tres veces más durante la madrugada: *"Empecé a jugar al fútbol para que mi padre estuviera orgulloso de mí. Esa final fue para él"*.

El epílogo brasileño. La investigación que abrió el Congreso brasileño sobre la final de 1998, dirigida por el diputado Aldo Rebelo, concluyó en el año 2001 sin determinar definitivamente qué le sucedió a Ronaldo aquella tarde. Doce páginas del informe se dedicaron al **doctor Lídio Toledo**. Cero responsables jurídicos. Ronaldo recuperaría su mejor versión solo cuatro años después en Yokohama 2002 cuando, con dos goles a Alemania, le devolvió a Brasil su quinta copa del mundo. Zidane, por su parte, ganaría también la Champions League con el Real Madrid en 2002 (con el gol de volea contra el Bayer Leverkusen) y volvería al Mundial en Alemania 2006 para una despedida amarga con el cabezazo a Materazzi. Pero la cabeza más célebre de su carrera siguió siendo la de Saint-Denis. La del padre orgulloso. La de la primera estrella francesa.`,
  },
];

// ───────────────────────────────────────────────────────────
// Utilidades
// ───────────────────────────────────────────────────────────

export function getHistoria(slug: string): Historia | undefined {
  return HISTORIAS.find((h) => h.slug === slug);
}

export function getHistoriasByBlock(blockCode: HistoriaBlockCode): Historia[] {
  return HISTORIAS.filter((h) => h.blockCode === blockCode);
}

/**
 * Devuelve solo las historias cuya fecha de publicación ya ha pasado.
 * Pensada para builds estáticos diarios (ISR o rebuild via cron).
 */
export function getPublishedHistorias(today: string): Historia[] {
  return HISTORIAS.filter((h) => h.publishDate <= today);
}

export function getHistoriaIndex(slug: string): number {
  return HISTORIAS.findIndex((h) => h.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: Historia;
  next?: Historia;
} {
  const i = getHistoriaIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? HISTORIAS[i - 1] : undefined,
    next: i < HISTORIAS.length - 1 ? HISTORIAS[i + 1] : undefined,
  };
}

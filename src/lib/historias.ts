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
      name: 'Marca (portada 26/11/2020)',
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
      name: 'La Nación (CR)',
      url: 'https://www.nacion.com/cables/palabra-de-maradona-fue-la-mano-de-dios-o-la-/J226MQAQDVGHZGTAZBHR5AD4W4/story/',
    },
    sourceSecondary: 'Infobae · Primicias Ecuador',
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

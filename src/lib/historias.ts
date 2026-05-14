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
      name: 'Stadium Astro — recopilación de portadas tras la muerte de Maradona (Marca, L\'Équipe, Clarín, Daily Star…)',
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

Con las tres selecciones a bordo, además del propio Jules Rimet y de los tres árbitros designados para la fase final del torneo —los belgas John Langenus y Henri Christophe, y un parisino llamado Thomas Balvay del que la FIFA nunca pudo confirmar si era inglés o francés—, el barco zarpó hacia el Atlántico Sur. Rimet llevaba en su camarote, en una caja de madera forrada, la Copa que años antes había encargado al escultor Abel Lafleur y que entonces se llamaba simplemente la Coupe du Monde. Décadas después, en 1946, la FIFA la rebautizaría con el nombre de su impulsor.

La travesía fue larga. Los entrenamientos se hicieron en cubierta, en una zona habilitada para el ejercicio físico. Los rumanos compartían tablero de ajedrez con los franceses. Los belgas, los más retraídos, comieron por separado durante los primeros días. La temperatura subió en la zona ecuatorial y el equipo médico francés tuvo que tratar mareos persistentes en varios jugadores. Cuando el Conte Verde hizo escala en Río de Janeiro, el 29 de junio, subió la cuarta selección de la travesía: Brasil. La selección brasileña aprovechó las dos jornadas hasta Montevideo para hacer un pequeño campamento de aclimatación con los europeos.

El barco atracó en el puerto de Montevideo el 4 de julio de 1930, nueve días antes de que arrancara el torneo. Las tres selecciones europeas y la brasileña desembarcaron en orden, escoltadas por una muchedumbre uruguaya que aplaudió en el muelle. Rimet bajó con la copa envuelta en papel de seda. Trece días más tarde, el 30 de julio, esa misma copa volvía a subir al podio del Estadio Centenario en manos de José Nasazzi, capitán uruguayo, después de que el equipo charrúa derrotara 4-2 a Argentina en la primera final mundial. El SS Conte Verde, mientras tanto, ya había emprendido el viaje de regreso. Dos años más tarde, su naviera quebró por la crisis del 29. El barco siguió en activo bajo otra empresa hasta 1943, cuando se hundió en Shanghái durante la Segunda Guerra Mundial. La travesía que hizo posible el primer Mundial es probablemente la página menos contada de la historia del fútbol.`,
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

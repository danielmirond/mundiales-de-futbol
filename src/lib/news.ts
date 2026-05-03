/**
 * Noticias diarias del Mundial 2026.
 *
 * Curaduría editorial: cada noticia debe llevar título original del medio
 * + resumen propio (NO copiar el lead del medio · copyright) + URL.
 *
 * Cómo añadir una nueva:
 *   1. Encuentra la noticia en un medio relevante (Marca, AS, ESPN, FIFA,
 *      L'Équipe, The Guardian, BBC, OneFootball, Infobae, TyC Sports, etc.).
 *   2. Verifica fecha de publicación.
 *   3. Escribe un resumen propio en español (40-60 palabras), no traducir
 *      literalmente la entradilla del medio. Aporta contexto tuyo.
 *   4. Añade entrada al array `NEWS_ITEMS` con `publishedAt` ISO 8601.
 *   5. Reordena: las más recientes primero.
 *
 * Frecuencia ideal: 3-5 noticias nuevas por semana.
 *
 * Cuando esto crezca a >100 noticias, migrar a tabla Supabase
 * (migration en `supabase/migrations/20260502000000_news_items.sql`).
 */

export type NewsCategory =
  | 'panini'
  | 'convocatorias'
  | 'sedes'
  | 'entradas'
  | 'jugadores'
  | 'mascotas'
  | 'ceremonia'
  | 'polemica'
  | 'tv'
  | 'patrocinios'
  | 'general';

export type NewsItem = {
  /** Slug interno · usado en `/noticias/[slug]`. */
  slug: string;
  /** Título editorial propio (NO copiar textual del medio). */
  title: string;
  /** Resumen editorial propio en español, 40-60 palabras. */
  summary: string;
  /**
   * Cuerpo editorial propio en español (200-400 palabras), separado por
   * `\n\n` entre párrafos. NO traducción literal del medio. Aporta
   * contexto, datos verificados y opinión sutil.
   */
  body: string;
  /** Categoría para filtrado. */
  category: NewsCategory;
  /** Nombre del medio fuente. */
  sourceName: string;
  /** URL del artículo original (atribución obligatoria). */
  sourceUrl: string;
  /** Idioma del medio (no del resumen, que es ES). */
  sourceLang: 'es' | 'en' | 'pt' | 'fr';
  /** Fechas de publicación / actualización (ISO 8601). */
  publishedAt: string;
  modifiedAt?: string;
  /** Fuentes secundarias (atribución adicional, para verificación cruzada). */
  sourcesSecondary?: { name: string; url: string }[];
  /**
   * Imagen de portada (1200×675 ideal Discover-friendly).
   * Recomendado: Wikimedia Commons via `Special:FilePath` con licencia libre.
   * Si se omite, se usa el OG dinámico de marca como fallback.
   */
  image?: {
    url: string;
    alt: string;
    credit?: string;
    license?: string;
  };
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: 'lego-mundial-2026-coleccion-9-sets-messi-ronaldo-mbappe-vinicius',
    title:
      'LEGO presenta su colección Mundial 2026: nueve sets con Messi, Ronaldo, Mbappé y Vinícius Jr. desde 24,99 dólares',
    summary:
      'LEGO entra de lleno en el merchandising oficial de la Copa del Mundo con nueve sets que combinan ladrillos AFOL y partner FIFA. La gama va de los 24,99 $ del emblema oficial al set premium de 1.427 piezas dedicado a Messi (199,99 $). Pre-órdenes abiertas, llegada a tiendas el 1 de mayo y el Messi Celebration aterriza el 1 de junio, justo antes de la inauguración del Mundial.',
    body: `LEGO ha lanzado su colección oficial vinculada al Mundial 2026, su mayor incursión en merchandising deportivo desde la línea Sports descontinuada en 2009. La gama, anunciada bajo el sello LEGO Editions, está compuesta por nueve sets que cubren los tres tipos de coleccionista: el casual ($24,99), el AFOL (Adult Fan Of LEGO) intermedio ($79,99) y el premium ($199,99).

**Los protagonistas son los Big Four**. Los buildable display de la línea «Football Legend» están dedicados a Cristiano Ronaldo (set 43016) y Lionel Messi (43015) por 79,99 $ cada uno: figuras articuladas de unos 25 cm con base personalizada y placa identificativa. La línea «Football Highlights» a 29,99 $ retrata escenas icónicas de Messi (43011) celebrando con la copa, Cristiano (43012), Mbappé (43013) y Vinícius Jr. (43027) en sus ejecuciones más reconocibles.

**El plato fuerte llega en junio**. El set Messi Celebration de 1.427 piezas, valorado en 199,99 $, reproduce el momento del 18 de diciembre de 2022 cuando Messi alza la Copa del Mundo en Doha. Es la pieza más ambiciosa del catálogo, formato wall-art, y se reserva para coleccionistas adultos. Llega el 1 de junio, diez días antes del partido inaugural del Mundial 2026 en el Estadio Azteca.

**Dos sets «entrada» a 24,99 dólares cierran la gama**: el FIFA World Cup 2026 Official Emblem (set 43032, 298 piezas) reproduce el logo oficial del torneo, y el U.S. Soccer National Team Jersey (167 piezas) la camiseta titular de Estados Unidos en formato display. Ambos pensados para regalo y para iniciar a niños mayores de 10 años en la colección.

**Disponibilidad**. Pre-orders ya abiertas en LEGO.com (España, USA, México, Brasil) con envío garantizado para el 1 de mayo (excepto el Messi Celebration). Amazon España, El Corte Inglés y FNAC empezarán a recibir stock entre el 5 y el 15 de mayo. La distribución LATAM (México, Argentina, Brasil) llega 1-2 semanas más tarde. Como la mayoría de releases LEGO de partner, los precios se mantienen oficiales sin descuentos durante las primeras 6-8 semanas.

**Lo que LEGO lograr aquí es un golpe doble**: monetiza la fiebre Mundial sin pisar los terrenos exclusivos de Panini (cromos) ni Funko (figuras), y posiciona la marca en el escaparate del próximo Mundial con cuatro de los rostros más buscados en redes sociales. Es la primera línea LEGO donde Messi y Ronaldo coexisten oficialmente.`,
    category: 'patrocinios',
    sourceName: 'NJ.com (Newsweek media)',
    sourceUrl:
      'https://www.nj.com/shopping-deals/2026/04/lego-unveils-fifa-world-cup-2026-collection-with-sets-that-are-surprisingly-affordable.html',
    sourceLang: 'en',
    publishedAt: '2026-05-04T08:00:00Z',
    sourcesSecondary: [
      {
        name: 'TechRadar · pre-orders',
        url: 'https://www.techradar.com/seasonal-sales/legos-fifa-world-cup-2026-sets-are-up-for-preorder-yes-theres-a-brick-built-lionel-messi',
      },
      {
        name: 'The Brick Fan · LEGO Editions May 2026',
        url: 'https://www.thebrickfan.com/lego-editions-may-2026-sets-officially-announced/',
      },
      {
        name: 'LEGO.com · FIFA World Cup 2026 Emblem 43032',
        url: 'https://www.lego.com/en-us/product/fifa-world-cup-2026-official-emblem-43032',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/LEGO_logo.svg?width=1200',
      alt: 'Logo oficial de LEGO, marca que ha lanzado su colección de nueve sets dedicada al Mundial 2026 con Messi, Ronaldo, Mbappé y Vinicius Jr.',
      credit: 'LEGO Group · vía Wikimedia Commons',
      license: 'Trademark fair use',
    },
  },
  {
    slug: 'espana-mundial-2026-opciones-pronosticos-grupo-h-yamal-rodri',
    title:
      'España al Mundial 2026: cuántas opciones reales tiene la campeona de Europa',
    summary:
      'Con Lamine Yamal y Pedri en plenitud, Rodri recuperando ritmo tras la lesión y Luis de la Fuente apuntalando el banquillo, España llega al Mundial 2026 con su mejor generación desde 2010. Las casas de apuestas la sitúan tercera o cuarta favorita, por detrás de Argentina, Francia y Brasil. El Grupo H —Cabo Verde, Arabia Saudí y Uruguay— es el único obstáculo serio antes de los cruces.',
    body: `España llega al Mundial 2026 como campeona vigente de la Eurocopa 2024 y con la generación más prometedora desde el ciclo Sudáfrica 2010. La pregunta no es si compite por el título, sino contra quién y en qué momento.

**El equipo de la campeona europea**. Lamine Yamal, máximo goleador de Eurocopa con 17 años, llega al Mundial con 19 años recién cumplidos y dos temporadas a 50+ partidos en el Barça. Pedri vuelve sin lesiones en condiciones de lanzar el centro del campo. Rodri, Balón de Oro 2024, recuperó ritmo competitivo en abril tras la rotura de cruzados que lo apartó casi un año. Por delante, Nico Williams, Dani Olmo y Mikel Oyarzabal completan un ataque rápido y vertical, distinto al de la posesión clásica de Xavi-Iniesta.

**El Grupo H, asequible pero no de oficio**. España debuta el 15 de junio contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta (jornada 1, 12:00 CDT). El segundo partido es contra Arabia Saudí el 22 de junio en la misma sede. El cruce decisivo: Uruguay el 26 de junio en el Estadio Akron de Guadalajara. Tres puntos de los nueve previsibles deberían sellar el primer puesto, pero la altitud y el calor mexicanos en pleno verano son una variable que España no controla en su preparación.

**Las apuestas la sitúan top-4**. Las casas británicas (Bet365, William Hill) dan a España cuotas de 7-8 a 1 para ganar el torneo, sólo por detrás de Argentina (5-6 a 1), Francia (5-7 a 1) y Brasil (6-8 a 1). Es la mejor cotización española desde 2014, cuando llegó como campeona en ejercicio. La Inglaterra de Bellingham y la Alemania anfitriona del 2024 quedan medio escalón por debajo.

**El cruce hipotético en octavos**: el segundo del Grupo G (Bélgica, Irán, Egipto o Nueva Zelanda) o un tercero de los grupos D-E-F (España jugaría contra el segundo del G por estructura del cuadro). En cuartos podría aparecer Argentina o Brasil, dependiendo de cómo crucen. La travesía está, pero el camino se complica desde semifinales para arriba como lo hace para todos.

**Pronóstico realista**. Cuartos de final como suelo y semifinales como techo razonable. Para repetir 2010 hay que ganar siete eliminatorias seguidas en 39 días contra los mejores del planeta, y eso siempre depende de momentos específicos: un penalti, una lesión, un día concreto. España tiene jugadores para llegar; lo difícil es que coincidan en su mejor versión durante el mes y medio del torneo.`,
    category: 'jugadores',
    sourceName: 'Marca',
    sourceUrl: 'https://www.marca.com/futbol/seleccion/2026/05/01/espana-mundial-2026-opciones-yamal-rodri.html',
    sourceLang: 'es',
    publishedAt: '2026-05-03T08:00:00Z',
    sourcesSecondary: [
      { name: 'AS · La Eurocopa de Yamal', url: 'https://as.com/futbol/seleccion/2024/07/14/lamine-yamal-eurocopa-2024-final.html' },
      { name: 'OneFootball · Cuotas Mundial 2026', url: 'https://onefootball.com/en/news/world-cup-2026-betting-favourites-2026-04-25' },
      { name: 'BBC Sport · Spain at the Euros', url: 'https://www.bbc.com/sport/football/articles/euro-2024-spain-champions' },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Senyera_Sud-àfrica_Xavi_i_Puyol.JPG?width=1200',
      alt: 'Xavi Hernández y Carles Puyol con la senyera tras la victoria de España en el Mundial de Sudáfrica 2010, la última vez que España ganó la Copa del Mundo',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
    },
  },
  {
    slug: 'panini-album-mundial-2026-980-cromos-salida-30-abril',
    title:
      'El álbum más largo de la historia de Panini: 980 cromos para un Mundial de 48 selecciones',
    summary:
      'La expansión a 48 equipos llega también a la pegatina. Panini sube de 670 a 980 cromos, 112 páginas y 68 especiales en material premium para abarcar 16 ciudades, tres países y un mes y medio de torneo. Completarlo cuesta entre 800 y 1.200 € sin intercambios; con grupos de Telegram baja a la mitad.',
    body: `Panini ha publicado su álbum oficial del Mundial 2026 con la mayor cifra de cromos de su historia: 980 piezas repartidas en 112 páginas, con 68 especiales en material premium (foil, hologramas, parallels). La cifra refleja la expansión del torneo a 48 selecciones y los nuevos partidos de dieciseisavos.

El precio en kiosco español es de 1 € por sobre de cinco cromos y 5 € por el álbum tapa blanda. La caja de 50 sobres con álbum incluido cuesta 80 € en Panini.es. Existen ediciones tapa dura (~15 €) y oro/lujo numerada (1.500 unidades en España, ~30 €).

Los analistas del coleccionismo deportivo sitúan el coste de completar la colección entre 800 y 1.200 € sin intercambios, lo que equivale a tres cuartas partes del Salario Mínimo Interprofesional español. Los grupos de Telegram «Panini Mundial 2026» y la plataforma Wallapop reducen ese coste a la mitad mediante intercambios 1×1 (un cromo por uno tuyo) y 3×1 para foils y hologramas.

Los cromos rookie son los que más se revalorizan a 5-10 años. Lamine Yamal y Endrick figuran como las apuestas seguras del Mundial 2026, replicando lo que hizo Mbappé en 2018, cuyo cromo cotiza hoy por encima de los 60 € en mercado secundario.

La fecha de salida (30 de abril en España y USA, 2 de mayo en LATAM) cumple el patrón habitual de Panini: lanzar la colección seis semanas antes del partido inaugural, suficiente para generar conversación pre-Mundial sin saturar el mercado antes de tiempo.`,
    category: 'panini',
    sourceName: 'Huffington Post España',
    sourceUrl:
      'https://www.huffingtonpost.es/deporte/980-cromos-112-paginas-1000-euros-completar-album-mundial-2026-lamine-yamal-messi-costara-tres-cuartas-partes-smi-f202604.html',
    sourceLang: 'es',
    publishedAt: '2026-04-30T08:00:00+00:00',
    sourcesSecondary: [
      { name: 'Panini.es', url: 'https://www.panini.es/shp_esp_es/fifa-world-cup-2026-official-sticker-collection-lbum-colecci-n-oficial-panini-005460aew-es01.html' },
      { name: 'Sports Illustrated', url: 'https://www.si.com/soccer/2026-world-cup-sticker-album-what-when-comes-out-where-buy-how-works' },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Troca%20de%20cromos%20da%20panini%20-%201.jpg?width=1200',
      alt: 'Niños intercambiando cromos Panini del Mundial de fútbol',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'neymar-omitido-album-panini-mundial-2026',
    title: 'Neymar, fuera del álbum Panini global del Mundial 2026',
    summary:
      'Una decisión que dice más sobre la lista de Ancelotti que sobre Panini. La marca italiana, que cierra contenido en marzo y se juega las cifras de imprenta, prefirió no incluirlo cuando ya circulaba el filtrado del Mundial brasileño. Si Ancelotti lo lleva el 18 de mayo, su rookie cromo regional será uno de los más pagados del mercado secundario.',
    body: `La versión global del álbum oficial Panini del Mundial 2026 omite a Neymar Júnior. La omisión ha generado revuelo en Brasil y entre coleccionistas internacionales, pero responde a una mecánica habitual del calendario editorial de Panini: la imprenta cierra contenido a mediados de marzo, casi dos meses antes de que se anuncien las listas FIFA definitivas (1 de junio) y aún antes de que Ancelotti revele la suya el 18 de mayo.

Panini juega siempre con los listados que circulan en los cuerpos técnicos. En el caso brasileño, parece que el ex-Madrid manejaba en marzo una pre-lista que dejaba fuera al ex-Santos por el pobre estado de forma tras varios meses sin competir y la temporada errática en el fútbol saudí. Esa pre-lista se filtró al equipo de Panini, que prefirió no arriesgar imprimir un cromo que podía quedar sin sentido.

La consecuencia: si Ancelotti acaba llamando a Neymar el 18 de mayo, su único cromo posible será una edición regional (el álbum brasileño puede tener tirada propia con jugadores no incluidos en la versión global). Cualquier eventual cromo de Neymar en esa versión brasileña se convertirá en pieza altamente cotizada en mercado secundario internacional, comparable al cromo de Mbappé rookie en 2018.

Otra opción es que Panini incluya un sticker de actualización post-cierre en sobres especiales, como ya hizo en Qatar 2022 con jugadores de última hora. Hasta hoy, sin embargo, no hay confirmación de esa medida.

La omisión también incrementa la presión sobre Endrick, Vinicius Jr. y Rodrygo como referentes del ataque brasileño en el álbum. Sus cromos tendrán carga simbólica reforzada y, previsiblemente, mayor demanda inicial en kiosco.`,
    category: 'panini',
    sourceName: 'OneFootball',
    sourceUrl:
      'https://onefootball.com/en/news/neymar-omitted-from-2026-world-cup-sticker-album-as-panini-confirms-global-version-42771577',
    sourceLang: 'en',
    publishedAt: '2026-04-30T17:00:00+00:00',
    sourcesSecondary: [
      { name: 'The Guardian', url: 'https://www.theguardian.com/football/2026/apr/29/panini-football-stickers-1000-pounds-48-team-world-cup' },
      { name: 'Globo Esporte', url: 'https://ge.globo.com' },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neymar%20Junior%20Brazil%20Austria%20June%202018.jpg?width=1200',
      alt: 'Neymar Júnior con la camiseta de la selección brasileña, junio 2018',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'love-always-wins-emilio-estefan-cancion-oficial-mundial-2026',
    title:
      'Emilio Estefan firma «Love Always Wins», la canción del Mundial latino',
    summary:
      'Por primera vez, el lanzamiento de los cromos Panini y la banda sonora oficial caen la misma semana. La elección no es casual: con tres anfitriones (USA, México, Canadá), dos rivales (Argentina y Brasil) y la mitad del público hispano, FIFA apuesta el primer himno por una voz cubano-estadounidense. La balada llega antes que el videoclip.',
    body: `Emilio Estefan ha presentado el álbum musical oficial del Mundial 2026 con la canción principal «Love Always Wins». El productor cubano-estadounidense, ganador de 19 Grammys y artífice musical del fenómeno latino global de los 90 (Gloria Estefan, Shakira, Ricky Martin), firma así su segunda colaboración con FIFA tras participar en la ceremonia inaugural de la Copa América 2024.

La elección rompe el patrón de los himnos mundialistas recientes, dominados por colaboraciones tipo Shakira-Carlinhos Brown («Waka Waka», 2010), Ricky Martin («La Copa de la Vida», 1998) o el más cercano «Hayya Hayya» de FIFA-Qatar 2022. Estefan apuesta por una balada producida íntegramente en español-inglés, con coros latinos y arreglos orquestales más cinematográficos que clubberos.

El timing es deliberado. Que la canción salga la misma semana que el álbum Panini (30 abril) responde a una estrategia de saturación de marca dirigida al consumidor hispano: el mercado latino representa más del 60 % de la audiencia esperada del torneo (3 anfitriones, 2 rivales sudamericanos top, diáspora latinoamericana en USA).

«Love Always Wins» se acompaña de un álbum musical completo con artistas locales de los tres países anfitriones (México, USA, Canadá) y representación de cada confederación. Falta confirmar si se grabará un videoclip oficial coreografiado en alguno de los 16 estadios sede.

La canción está disponible en Spotify, Apple Music y YouTube desde el mediodía del 1 de mayo. La FIFA aún no ha anunciado si se utilizará en la ceremonia inaugural del 11 de junio en el Estadio Azteca, ni si habrá un segundo single.`,
    category: 'ceremonia',
    sourceName: 'La Vanguardia',
    sourceUrl:
      'https://www.lavanguardia.com/gente/20260501/11527408/emilio-estefan-presenta-love-always-wins-cancion-album-musical-mundial-2026.amp.html',
    sourceLang: 'es',
    publishedAt: '2026-05-01T10:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gloria%20Estefan%20and%20Emilio%20Estefan%20at%202014%20MIFF%20%28cropped%29.jpg?width=1200',
      alt: 'Emilio Estefan, productor musical cubano-estadounidense, autor de la canción oficial del Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 2.0',
    },
  },
  {
    slug: 'escocia-vuelve-album-panini-mundial-2026',
    title:
      'Escocia vuelve al álbum Panini, fenómeno cultural en Edimburgo y Glasgow',
    summary:
      'Tras tres Mundiales consecutivos sin clasificar (2014, 2018, 2022), Escocia recupera su lugar en el álbum oficial. Los cromos «debut sénior» de Tartan Army han agotado las primeras tiradas en WHSmith y Tesco en 24 horas. Para una nación de 5,5 millones que solo ha pasado fase de grupos cero veces, el cromo es ya parte del folclore.',
    body: `Escocia regresa al álbum Panini del Mundial 2026 tras tres torneos consecutivos sin clasificar (2014 Brasil, 2018 Rusia, 2022 Qatar). La última vez que la Tartan Army tuvo cromos oficiales fue en Francia 1998, hace 28 años.

El recibimiento ha sido fenomenal. The Scotsman reporta que las primeras tiradas en WHSmith y Tesco se agotaron en las 24 horas siguientes al lanzamiento del 30 de abril. La afición escocesa, históricamente fiel al ritual mundialista pese a la sequía deportiva, ha respondido al álbum como si fuera el regreso a un campeonato grande, no solo a un álbum de cromos.

Para Escocia, llegar al Mundial es ya un logro. La selección, dirigida por Steve Clarke, está en el Grupo C junto a Brasil, Marruecos y Haití. El partido más esperado es el debut frente a Haití (13 jun, Gillette Stadium), seguido del enfrentamiento contra Marruecos (19 jun) y el plato fuerte del grupo: Brasil-Escocia (24 jun).

La selección históricamente ha tenido en Mundiales un palmares pobre: ocho participaciones (1954-1998) y cero veces superada la fase de grupos. La generación actual, con figuras como Andy Robertson (Liverpool), John McGinn (Aston Villa) y Scott McTominay (Napoli), tiene la oportunidad histórica de romper esa estadística en un grupo accesible salvo por Brasil.

Para los coleccionistas: los cromos «debut sénior» de los jóvenes escoceses (Ben Doak, Lewis Ferguson, Aaron Hickey) son los más valorados a futuro. Son la generación que llevará a Escocia al menos a otros dos Mundiales, según la proyección demográfica del fútbol joven escocés tras la inversión de la SFA en cantera.`,
    category: 'panini',
    sourceName: 'The Scotsman',
    sourceUrl:
      'https://www.scotsman.com/sport/football/international/panini-world-cup-2026-sticker-album-released-as-scotland-return-to-collection-heres-everything-you-need-to-know-8290414',
    sourceLang: 'en',
    publishedAt: '2026-04-30T14:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tartan%20Army%20Gibraltar%20V%20Scotland%2011%20October%202015%20%282%29.JPG?width=1200',
      alt: 'Tartan Army, hinchada de la selección escocesa de fútbol',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'fechas-fifa-listas-mundial-2026-11-mayo-1-junio',
    title:
      'FIFA fija el calendario de listas: provisional el 11 mayo, definitiva el 1 junio',
    summary:
      'Mismo formato que en Qatar: 35-55 nombres en una pre-lista privada el 11 de mayo, recortada a 23-26 (con tres porteros obligatorios) que se entrega el 1 de junio. Solo se permiten cambios por lesión hasta 24 horas antes del primer partido. Después, el equipo termina el torneo con los aptos restantes. Cada selección publicará su lista en los días previos a cada plazo.',
    body: `El reglamento oficial del Mundial 2026, publicado por FIFA el 19 de marzo, fija dos plazos claros para que las 48 selecciones presenten sus convocatorias. La estructura es la misma que se aplicó en Qatar 2022, con un primer recorte amplio y un segundo definitivo.

El **11 de mayo** (un mes antes del partido inaugural en el Estadio Azteca), cada federación entrega a FIFA una lista provisional de entre 35 y 55 jugadores. Esta lista NO se hace pública por reglamento FIFA, aunque la mayoría de federaciones la anuncian voluntariamente en rueda de prensa los días previos para empezar a generar conversación pre-Mundial.

El **1 de junio** (diez días antes del inaugural), las selecciones presentan la lista definitiva: entre 23 y 26 jugadores con un mínimo obligatorio de 3 porteros. Es el formato extendido que se introdujo en Qatar 2022 como excepción por la pandemia, y que FIFA ha consolidado para el ciclo 2026 con un torneo más largo (33 días vs 28 anteriores) y la nueva ronda de dieciseisavos.

Las sustituciones por lesión están permitidas solo hasta 24 horas antes del primer partido del propio equipo, y requieren certificación médica del seleccionado más validación de un médico FIFA. Una vez disputado el primer encuentro del equipo, no hay sustituciones permitidas: el seleccionado termina el torneo con los jugadores aptos restantes.

Las federaciones top suelen publicar la lista provisional en la primera semana de mayo. España (RFEF) la dará desde Las Rozas, Argentina (AFA) desde Ezeiza, Brasil (CBF) desde Granja Comary el 18 de mayo según confirmación de Carlo Ancelotti. Francia, Alemania, Portugal, Inglaterra y Países Bajos siguen el patrón habitual de las dos semanas previas al plazo definitivo.`,
    category: 'convocatorias',
    sourceName: 'FIFA Regulations · Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_squads',
    sourceLang: 'en',
    publishedAt: '2026-04-29T09:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/FIFA%20World%20Cup%20Trophy%20%28Ank%20Kumar%2C%20Infosys%20Limited%29%2003.jpg?width=1200',
      alt: 'Trofeo de la Copa Mundial de la FIFA',
      credit: 'Foto: Ank Kumar (Infosys) / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'coca-cola-12-cromos-exclusivos-panini-mundial-2026',
    title:
      'Coca-Cola esconde 12 cromos exclusivos en sus botellas del Mundial 2026',
    summary:
      'Cross-promotion como nunca antes. Desde mediados de mayo, doce cromos del álbum Panini solo se consiguen comprando botellas seleccionadas de Coca-Cola en más de veinte países. La doble página dedicada al patrocinador queda en blanco si no pasas por la nevera. Mercado secundario ya cotiza paquetes de los doce a 30-50 €.',
    body: `Coca-Cola, partner oficial FIFA del Mundial 2026, ha cerrado con Panini un acuerdo cross-promocional sin precedentes en la historia del coleccionismo. Desde mediados de mayo, doce cromos exclusivos del álbum oficial se distribuyen únicamente dentro de etiquetas de botellas seleccionadas de Coca-Cola en más de veinte países.

La doble página dedicada al patrocinador en el álbum Panini queda en blanco si el coleccionista no pasa por la nevera del supermercado. No se venden por separado en kioscos, no entran en sobres normales y no se distribuyen como insertos. La única forma legal y oficial de conseguirlos es comprar botellas Coca-Cola con etiqueta promocional Mundial 2026.

El formato es restrictivo: solo botellas de 500 ml a 1,5 L llevan los cromos. Las latas y formatos pequeños quedan fuera de la promoción. La etiqueta lleva además un código QR que activa contenido digital adicional en la app FIFA Panini Digital Album.

Sports Illustrated y Sporting News publicaron los detalles tras el lanzamiento del álbum. La promoción aplica en España, México, Estados Unidos, Argentina, Colombia, Brasil, Reino Unido, Alemania, Francia y otros mercados clave. Cada país tiene una rotación de 6-8 semanas durante la cual hay producto promocional en estanterías.

El mercado secundario ya ha reaccionado. Mercado Libre, Wallapop y Cardmarket cotizan packs de los doce cromos completos a entre 25 y 60 €. Comprar 12+ botellas Coca-Cola para asegurar todos los cromos costaría más caro y dejaría unos cuantos litros de refresco que probablemente no piensas beber.

La operación responde a la lógica del coleccionismo extremo: si quieres llenar el álbum entero, no te queda más remedio que pasar por caja en al menos un canal extra. Para Coca-Cola es una jugada brillante de demanda inducida; para Panini, una página adicional de su mejor álbum jamás producido.`,
    category: 'patrocinios',
    sourceName: 'Sports Illustrated',
    sourceUrl:
      'https://www.si.com/soccer/2026-world-cup-sticker-album-what-when-comes-out-where-buy-how-works',
    sourceLang: 'en',
    publishedAt: '2026-04-30T16:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola_logo.svg?width=1200',
      alt: 'Logotipo de Coca-Cola, partner oficial FIFA',
      credit: 'Coca-Cola Company',
      license: 'Trademark',
    },
  },
  {
    slug: 'ancelotti-confirma-lista-brasil-mundial-2026-18-mayo',
    title:
      'Ancelotti dará la lista de Brasil el 18 de mayo y resolverá el caso Neymar',
    summary:
      'El seleccionador italiano cierra los nombres de la canarinha desde Granja Comary una semana antes del plazo FIFA. Es la fecha que Panini ya manejaba al cerrar contenido y por la que Neymar quedó fuera del álbum global. Ancelotti tiene que decidir entre el peso simbólico y la realidad física tras la temporada que arrastra el ex Santos.',
    body: `Carlo Ancelotti, seleccionador de Brasil desde mayo de 2024, anunciará la lista definitiva de la canarinha para el Mundial 2026 el 18 de mayo desde Granja Comary, el centro de entrenamiento de la CBF en Teresópolis. Es una semana antes del plazo FIFA del 1 de junio y casi tres antes del partido inaugural.

La fecha tiene peso simbólico. Es la misma fecha que Panini ya manejaba en marzo cuando cerró el contenido del álbum oficial, y la razón por la que Neymar quedó fuera de la versión global de los cromos. Si Ancelotti acaba llamándolo, el revuelo del cromo regional brasileño será fenomenal; si confirma su exclusión, será la decisión más comentada de la convocatoria.

El italiano hereda una Brasil con cinco mundiales consecutivos sin pasar de cuartos (2010-2022, eliminada por Países Bajos, Alemania, Bélgica, Bélgica de nuevo y Croacia respectivamente). Su misión: devolver a la canarinha al palmarés mundial tras 24 años (último título: Corea-Japón 2002 con Felipão).

La lista definitiva tendrá 26 jugadores con tres porteros obligatorios. Las dudas habituales: si lleva a Neymar (33 años, sin minutos competitivos suficientes), si apuesta por Endrick titular (19 años, Real Madrid), si recupera a Vinicius Jr. en su mejor versión y cómo cuadra el centro del campo entre Bruno Guimarães (Newcastle), Lucas Paquetá (West Ham) y la nueva generación.

Brasil debuta en el Grupo C el 13 de junio contra Marruecos en MetLife Stadium (Nueva York/Nueva Jersey), revival de los octavos de Qatar 2022 donde la canarinha ganó 4-1. Los otros rivales del grupo son Haití y Escocia. Sobre el papel, primero del grupo asegurado y semifinal como objetivo razonable.`,
    category: 'convocatorias',
    sourceName: 'CBF / Globo Esporte',
    sourceUrl: 'https://www.cbf.com.br',
    sourceLang: 'pt',
    publishedAt: '2026-04-29T18:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carlo%20Ancelotti%202016%20%28cropped%29.jpg?width=1200',
      alt: 'Carlo Ancelotti, seleccionador de Brasil para el Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'phase-4-fifa-tickets-mundial-2026-abierta',
    title:
      'FIFA abre la fase 4: entradas Mundial 2026 disponibles hasta la final',
    summary:
      'Última fase oficial sin sorteo previo. Compra directa hasta agotar inventario o hasta el 19 de julio. Categoría 3 (la más asequible visitante) arranca en 120 $ para fase de grupos. La final escala de 1.490 $ (Cat 3) a 7.875 $ (Cat 1). Mantén distancia con cualquier reventa fuera de fifa.com/tickets: la entrada se cancela en la puerta del estadio.',
    body: `La cuarta y última fase de venta oficial de entradas del Mundial 2026 está activa desde el 1 de abril en fifa.com/tickets. A diferencia de las tres anteriores (Visa Presale, Random Draw, sorteo de aficionados), esta es de compra directa: clic, paga, recibes la entrada en formato digital. Sin sorteo previo, hasta agotar disponibilidad o hasta el 19 de julio (final).

Los precios oficiales se mantienen sin cambios respecto a las fases anteriores:

**Fase de grupos:** Categoría 3 desde 120 $, Cat 2 desde 200 $, Cat 1 desde 320 $.

**Octavos (R32 + R16):** Cat 3 desde 230 $, Cat 1 desde 540 $.

**Cuartos:** Cat 3 desde 460 $, Cat 1 desde 950 $.

**Semifinales:** Cat 3 desde 930 $, Cat 1 desde 2.030 $.

**Final (19 julio, MetLife Stadium):** Cat 3 desde 1.490 $, Cat 1 desde 7.875 $.

FIFA ha añadido en abril una nueva «front category» premium con asientos en zonas privilegiadas, cuyo precio para la final puede superar los 12.000 $. Existe también la categoría «hospitality» gestionada por On Location, partner exclusivo, con paquetes que incluyen catering, parking VIP y acceso a lounges desde los 5.000 $ hasta cifras de seis cifras.

Aviso editorial: FIFA es la única vendedora oficial. Cualquier web que ofrezca entradas a precio nominal fuera de fifa.com/tickets es reventa no autorizada o estafa. Las entradas no oficiales pueden ser canceladas en la puerta del estadio. Si tu entrada es legítima pero no puedes ir, FIFA habilita un sistema oficial de reventa dentro de fifa.com/tickets con tope al precio nominal más comisión.

A día de hoy quedan disponibles entradas para más del 60 % de los partidos de fase de grupos, según fuentes consultadas. La final, los partidos de México y los de Argentina están agotados desde la fase 2.`,
    category: 'entradas',
    sourceName: 'FIFA Tickets',
    sourceUrl: 'https://www.fifa.com/tickets',
    sourceLang: 'en',
    publishedAt: '2026-04-25T10:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MetLife%20Stadium%202022.jpg?width=1200',
      alt: 'MetLife Stadium en East Rutherford, sede de la final del Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'estadio-azteca-renombrado-mexico-city-stadium-fifa',
    title:
      'El Azteca se llama «Mexico City Stadium»: FIFA borra a Banorte por reglamento',
    summary:
      'La regla FIFA contra patrocinios externos rebautiza al estadio para el torneo. El Azteca, que antes ya pasó por «Estadio Banorte» tras el reciente acuerdo bancario, será oficialmente «Mexico City Stadium» del 11 de junio al 19 de julio. Acoge el partido inaugural México vs Sudáfrica a las 13:00 hora local, tercera vez en su historia que abre un Mundial (1970, 1986, 2026).',
    body: `Durante el Mundial 2026, el Estadio Azteca será conocido oficialmente como «Mexico City Stadium». La medida responde a la regla FIFA que prohíbe la presencia de patrocinios externos no oficiales en sus torneos: el Azteca, que en febrero de 2025 había sido renombrado «Estadio Banorte» tras un acuerdo de naming rights con el banco mexicano, no puede usar esa denominación durante los 39 días que dura el torneo.

La medida no es exclusiva del Azteca. Todas las sedes con patrocinios actuales serán rebautizadas para el torneo: AT&T Stadium pasa a «Dallas Stadium», MetLife Stadium a «New York New Jersey Stadium», SoFi Stadium a «Los Angeles Stadium», Mercedes-Benz Stadium a «Atlanta Stadium», y así con las dieciséis. Es una práctica habitual de FIFA en cada Mundial desde Alemania 2006.

Para el Estadio Azteca/Banorte, será la tercera vez que abre un Mundial: 1970 (México-URSS, 0-0), 1986 (Italia-Bulgaria, 1-1) y ahora 2026 (México-Sudáfrica, 11 de junio a las 13:00 hora local CDMX). Ningún otro estadio del mundo ha disputado tres partidos inaugurales de Mundial.

El recinto se ha sometido a una remodelación completa entre 2024 y 2026 que ha modificado tanto su aforo como su distribución. La capacidad oficial Mundial 2026 es de 83.000 espectadores (frente a los 87.523 que tenía pre-remodelación), con todos los asientos individuales numerados, accesibilidad mejorada y nuevos palcos. Sigue siendo el estadio con mayor aforo de todo el torneo.

Para el aficionado mexicano, la denominación oficial FIFA es solo eso: oficial. La afición seguirá llamándolo Azteca, igual que los Madridistas siguen diciendo «Bernabéu» pese al patrocinio. La convención periodística internacional probablemente usará «Mexico City Stadium (Estadio Azteca)» en sus retransmisiones.`,
    category: 'sedes',
    sourceName: 'Wikipedia · 2026 FIFA World Cup',
    sourceUrl: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
    sourceLang: 'en',
    publishedAt: '2026-04-28T12:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Estadio_Azteca.jpg?width=1200',
      alt: 'Estadio Azteca de Ciudad de México, conocido por FIFA en 2026 como «Mexico City Stadium»',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA',
    },
  },
  {
    slug: 'rtve-confirma-mundial-2026-en-abierto-mediapro',
    title:
      'RTVE asegura el Mundial 2026 en abierto: inaugural, España, octavos y final',
    summary:
      'Tras dos meses de negociación con Mediapro, la televisión pública cierra paquete amplio. La 1 y RTVE Play emiten el partido inaugural, los tres partidos de España, uno por jornada de fase de grupos, octavos completos, cuartos, semifinales y la final. Movistar Plus+ y DAZN mantienen los 104 partidos en exclusiva. La cifra del acuerdo, en torno a 55 millones, es la mayor jamás pagada por RTVE por un Mundial.',
    body: `RTVE ha cerrado el acuerdo con Mediapro para emitir en abierto el Mundial 2026 en España. Tras dos meses de negociación, la televisión pública asegura un paquete amplio que cumple con las obligaciones de la Ley General de Comunicación Audiovisual española y, además, va más allá de lo estrictamente exigido por la normativa europea de eventos de interés general.

La cobertura RTVE incluye: el partido inaugural (México-Sudáfrica, 11 jun, Estadio Azteca), los tres partidos de España en la fase de grupos (vs Cabo Verde, vs Arabia Saudí y vs Uruguay), un partido más por jornada de fase de grupos elegido por la cadena, los octavos de final completos, los cuartos, las dos semifinales y la final del 19 de julio en MetLife Stadium. Aproximadamente 30 partidos en abierto de los 104 totales.

Movistar Plus+ y DAZN mantienen los 104 partidos en directo en formato premium con calidad 4K HDR. La cadena de derechos en España: Mediapro adquirió los derechos directamente a FIFA y sublicencia a las tres plataformas (RTVE en abierto, Movistar Plus+ y DAZN en pago). El precio total del acuerdo Mediapro-FIFA, según fuentes del sector, ronda los 280 millones de euros para los seis Mundiales 2026-2030.

La cifra que paga RTVE a Mediapro es de aproximadamente 55 millones de euros, según informaciones del sector audiovisual español. Es la mayor cifra pagada jamás por la televisión pública española por un Mundial, superando ligeramente los 49 millones que pagó por Qatar 2022. La cifra es alta pero permite que España vea en abierto los partidos clave de la Roja y la final, dos puntos que históricamente concentran el grueso de la audiencia mundialista en abierto.

La señal estará disponible en La 1 en formato lineal y en RTVE Play como streaming (gratis con registro). Los comentarios serán en castellano. Para audio en otros idiomas (catalán, gallego, euskera) se utilizarán los canales autonómicos asociados.`,
    category: 'tv',
    sourceName: 'eldiario.es / Vertele',
    sourceUrl: 'https://www.eldiario.es/vertele',
    sourceLang: 'es',
    publishedAt: '2026-02-15T09:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Logo%20RTVE%20%281991-2008%29.svg?width=1200',
      alt: 'Logotipo histórico de RTVE, Radiotelevisión Española',
      credit: 'Wikimedia Commons',
      license: 'Public Domain',
    },
  },
];

/** Devuelve las N noticias más recientes ordenadas por publishedAt desc. */
export function getLatestNews(limit = 6): NewsItem[] {
  return [...NEWS_ITEMS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Filtra por categoría y devuelve N más recientes. */
export function getNewsByCategory(category: NewsCategory, limit = 6): NewsItem[] {
  return NEWS_ITEMS.filter((n) => n.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Devuelve una noticia por su slug. */
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find((n) => n.slug === slug);
}

/** Noticias relacionadas (misma categoría) excluyendo la actual. */
export function getRelatedNews(slug: string, limit = 3): NewsItem[] {
  const current = getNewsBySlug(slug);
  if (!current) return [];
  return NEWS_ITEMS.filter((n) => n.slug !== slug && n.category === current.category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Formato relativo en español (ej. "hace 3 h", "hace 2 d"). */
export function relativeTimeEs(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return 'ahora mismo';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  const w = Math.floor(d / 7);
  if (w < 4) return `hace ${w} sem`;
  const mo = Math.floor(d / 30);
  return `hace ${mo} mes${mo === 1 ? '' : 'es'}`;
}

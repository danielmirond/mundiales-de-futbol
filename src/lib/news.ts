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
    slug: 'suecia-lista-definitiva-26-mundial-2026-potter-isak-gyokeres-kulusevski-fuera',
    title:
      'Suecia se adelanta: Graham Potter publica los 26 definitivos del Mundial con Isak y Gyökeres dentro, Kulusevski fuera',
    summary:
      'La SvFF se convierte en la primera federación en saltarse el plazo de la prelista y anunciar directamente los 26 jugadores definitivos para el Mundial 2026. Graham Potter, ex Chelsea, mete a Alexander Isak (Liverpool, lesionado) y Viktor Gyökeres (Arsenal) en su primera gran convocatoria. Las bajas duras: Dejan Kulusevski (Tottenham) y Roony Bardghji (Barça). Suecia, 13ª participación mundialista, juega Grupo F contra Países Bajos, Japón y Túnez.',
    body: `La Svenska Fotbollförbundet (SvFF) anunció este 12 de mayo los 26 jugadores definitivos que Suecia llevará al Mundial 2026, convirtiéndose en la primera federación del torneo en publicar la lista final apenas un día después del cierre del plazo para entregar la prelista de 55 nombres. La decisión, atribuida al estilo directo del seleccionador inglés Graham Potter —ex entrenador de Brighton y Chelsea, contratado por la SvFF en agosto de 2025 después del fracaso clasificatorio que casi se evita en el repechaje de marzo contra Ucrania y Polonia—, evita la fase de especulación pública que sí han alargado España, Brasil o Argentina.

**El plantel**. El capitán es **Victor Lindelöf**, central del Aston Villa con 75 internacionalidades, una de las cifras más altas del fútbol sueco moderno. Le acompañan en defensa nombres habituales como Daniel Sundgren, Isak Hien (Atalanta) y Jens Cajuste. En el centro del campo, Lucas Bergvall (Tottenham, 19 años) y Anthony Elanga (Newcastle United) son los referentes generacionales. Pero el peso del equipo está arriba, con dos delanteros que cuestan en el mercado europeo más que el presupuesto de varias selecciones presentes.

**Isak y Gyökeres, los dos delanteros récord**. **Alexander Isak** llega como jugador del Liverpool tras el fichaje récord de la pasada temporada (transferencia desde el Newcastle por una cifra cercana a los 130 millones de libras, fichaje más caro de la historia del fútbol inglés). Potter lo incluye pese a una lesión muscular reciente que lo ha apartado de los últimos partidos de la Premier League. La apuesta, dicen fuentes de la federación citadas por Sweden Herald y Yahoo Sports, es que llegue al primer partido del Mundial. **Viktor Gyökeres**, fichado por el Arsenal el verano pasado por unos 65 millones de libras desde el Sporting CP donde marcó 97 goles en 102 partidos, completa la dupla. Es la primera vez en la historia que Suecia lleva al Mundial dos delanteros con fichajes récord recientes en clubes top de Premier League.

**Las bajas más comentadas**. **Dejan Kulusevski**, el extremo del Tottenham, queda fuera tras doce meses marcados por lesiones recurrentes. Según *Goal*, «el Mundial llegó demasiado pronto» para Kulusevski, que arrastra problemas de rodilla desde abril de 2025 y solo ha disputado siete partidos en la última temporada. La otra ausencia que ha sorprendido a la prensa sueca es la de **Roony Bardghji**, extremo de 20 años fichado por el Barça en verano de 2025, que ha disputado 26 partidos en todas las competiciones con el club catalán. Potter ha preferido no llamarlo «por consideraciones de adaptación táctica», según comunicado de la SvFF.

**Lo que esto dice del calendario**. Siete jugadores incluidos en la lista de 26 no estuvieron disponibles para los repechajes de marzo contra Ucrania y Polonia, donde Suecia se ganó el billete al Mundial en condiciones límite. Esto sugiere que Potter está construyendo un equipo distinto al que clasificó, apoyándose ahora en jugadores recuperados de lesión que pueden ofrecerle el nivel competitivo que Suecia necesita para superar al menos la fase de grupos.

**Grupo F y debut**. Suecia disputará la 13ª participación mundialista de su historia (la última fue Rusia 2018, cuartos de final). El grupo F es asequible para sus aspiraciones: Países Bajos (favorita), Japón (rival con calidad técnica), Túnez (rival accesible). Suecia debuta el 17 de junio contra Países Bajos en el Estadio NRG de Houston. La pregunta deportiva real es si Potter consigue trasladar al equipo el ADN ofensivo que prometía cuando llegó al banquillo el verano pasado, después de un primer ciclo en el que Suecia mostró tanto la solvencia clásica de su fútbol como destellos del talento de Isak y Gyökeres que aún no convierte en victorias consistentes ante rivales top.`,
    category: 'convocatorias',
    sourceName: 'Heavy.com Sports',
    sourceUrl:
      'https://heavy.com/sports/soccer/sweden-announces-squad-fifa-world-cup/',
    sourceLang: 'en',
    publishedAt: '2026-05-12T13:25:00Z',
    sourcesSecondary: [
      {
        name: 'Flashscore · Potter names 26-man Sweden squad',
        url: 'https://www.flashscore.com/news/soccer-world-cup-graham-potter-names-26-man-sweden-squad-for-the-world-cup/OjiHKnrg/',
      },
      {
        name: 'Olympics.com · Sweden full squad list',
        url: 'https://www.olympics.com/en/news/fifa-world-cup-2026-sweden-great-escape-graham-potter-all-players-full-squad-list-key-stats-schedule',
      },
      {
        name: 'Yahoo Sports · Official Sweden squad',
        url: 'https://sports.yahoo.com/articles/official-swedens-squad-world-cup-144500546.html',
      },
      {
        name: 'NBC Dallas-Fort Worth · Sweden national team',
        url: 'https://www.nbcdfw.com/news/local/swedish-national-team-announces-2026-fifa-world-cup-roster/4023045/',
      },
      {
        name: 'Sweden Herald · Squad selected by Potter',
        url: 'https://swedenherald.com/article/swedens-world-cup-squad-26-players-selected-by-graham-potter',
      },
      {
        name: 'Fotmob · Isak headlines, Bardghji and Kulusevski out',
        url: 'https://www.fotmob.com/news/1xjd2xary5ves19vtxv63t31pl-isak-headlines-swedens-world-cup-squad-bardghji-kulusevski-absent',
      },
      {
        name: 'Goal · Kulusevski misses out',
        url: 'https://www.goal.com/en-ca/lists/world-cup-dejan-kulusevski-injury-tottenham-sweden-viktor-gyokeres-alexander-isak/bltd56651aa57664624',
      },
    ],
  },
  {
    slug: 'fifa-panini-collection-app-mundial-2026-coca-cola-album-digital',
    title:
      'FIFA y Panini lanzan la app oficial del álbum 2026 con Coca-Cola: 528 cromos digitales, escaneo de etiquetas y packs diarios gratis',
    summary:
      'La aplicación «FIFA Panini Collection by Coca-Cola» abre una pasarela digital al álbum oficial: 48 selecciones, 528 cromos de jugadores, logos, mascotas y trofeos. Cada día regala packs gratis a quien escanee etiquetas de Coca-Cola, sobres físicos Panini y portadas de álbum. Plazo para completar la colección: 30 de septiembre de 2026. iOS y Android.',
    body: `FIFA y Panini activaron oficialmente la app «FIFA Panini Collection by Coca-Cola», su versión digital del álbum 2026, disponible desde esta semana en iOS y Android sin coste de descarga. Es la primera vez que el álbum oficial de un Mundial nace en paralelo en versión física y app desde el primer día, una integración acordada en el marco del contrato Panini-FIFA renovado en 2024 y reforzado con la sponsorship principal de Coca-Cola como Marketing Partner del torneo.

**Lo que contiene**. La app trae las 48 selecciones participantes, **528 cromos de jugadores** (11 por selección), además de **logos**, **mascotas** (Maple, Zayu y Clutch) y **trofeos** asociados al torneo. La mecánica básica es la misma del álbum físico: abrir sobres con cromos aleatorios, pegarlos al álbum digital y completar páginas y secciones para desbloquear recompensas.

**Cómo se consiguen los packs**. La novedad respecto a colecciones digitales anteriores de Panini está en la integración multimarca: el usuario puede escanear con la cámara del teléfono tres tipos de elementos físicos para conseguir packs gratis cada día.

- Etiquetas y latas de **Coca-Cola** con el branding FIFA 2026
- **Sobres físicos** de Panini comprados en kiosco
- **Portadas de álbum** Panini físico

A esto se suman códigos promocionales puntuales que se reparten en campañas de **Panini, FIFA, Coca-Cola y McDonald's** (uno de los sponsors visibles del torneo) para cromos especiales.

**Modelo de negocio**. La descarga es gratuita y la dinámica de packs diarios refuerza el engagement sin pago directo. La monetización clave está en los códigos físicos (mantiene la venta del álbum y sobres en kiosco) y, según fuentes consultadas, en futuras opciones de pago dentro de la app para acelerar la colección, aunque la app respeta el principio de "el que escanea, completa".

**Plazo**. La colección estará viva hasta el **30 de septiembre de 2026**, fecha en que se cierran las recompensas y se publica la galería final. Después seguirá disponible como archivo digital pero ya sin actividad de packs ni códigos.

**Por qué importa**. La conversión generacional del álbum Panini al móvil llevaba años discutiéndose. Con esta app y el respaldo Coca-Cola, FIFA institucionaliza por primera vez un coleccionable digital con la misma marca que el coleccionable físico, sin la fragmentación que sufrió la categoría con Topps + StickerStar + apps no oficiales en Mundiales anteriores. Para el aficionado, el atractivo es la posibilidad real de completar la colección sin pagar: una hora de paseo por el supermercado escaneando etiquetas durante el verano puede equivaler a 60-80 sobres físicos.`,
    category: 'panini',
    sourceName: 'FIFA · Panini Collection app',
    sourceUrl:
      'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-panini-coleccion-aplicacion-app',
    sourceLang: 'es',
    publishedAt: '2026-05-11T14:00:00Z',
    sourcesSecondary: [
      {
        name: 'App Store · FIFA Panini Collection',
        url: 'https://apps.apple.com/us/app/fifa-panini-collection/id6752864987',
      },
      {
        name: 'Google Play · FIFA Panini Collection',
        url: 'https://play.google.com/store/apps/details?id=it.panini.fifacollection',
      },
      {
        name: 'Coca-Cola US · FIFA Panini packs',
        url: 'https://www.coca-cola.com/us/en/offerings/fifa-world-cup-26/panini',
      },
      {
        name: 'FIFA Collect · Panini hub',
        url: 'https://collect.fifa.com/pages/panini',
      },
      {
        name: 'Panini America · World Cup 2026 sticker collection',
        url: 'https://www.paniniamerica.net/sticker-collections/sticker-collection/fifa-world-cup-2026tm.html',
      },
    ],
  },
  {
    slug: 'prelista-argentina-mundial-2026-scaloni-55-messi-dybala-fuera-mastantuono-echeverri',
    title:
      'Argentina entrega su prelista del Mundial: Messi sí, Dybala no, Mastantuono y Echeverri irrumpen',
    summary:
      'La AFA envió este lunes a la FIFA los 55 nombres de Lionel Scaloni. Messi entra rumbo a su último Mundial, acompañado por 20 campeones de Qatar 2022. Las bajas dolorosas: Dybala (40 caps), Ángel Correa (Tigres) y Valentín Castellanos (West Ham). Las sorpresas: Franco Mastantuono (Real Madrid) y Claudio Echeverri (Girona) entran con menos de 20 años. La lista definitiva de 26 se anuncia antes del 30 de mayo.',
    body: `La Asociación del Fútbol Argentino entregó el lunes 11 de mayo a la FIFA la prelista de 55 jugadores que Lionel Scaloni maneja para el Mundial 2026. Completa la tríada del mismo día con Brasil y España, en el plazo máximo permitido por el nuevo reglamento FIFA que convierte las prelistas en vinculantes: cualquier sustitución posterior por lesión deberá salir exclusivamente de estos 55 nombres.

**Messi confirmado**. Lionel Messi entra en la prelista en lo que se anticipa como su último Mundial. El capitán cumplirá 39 años el 24 de junio, en plena fase de grupos, y Scaloni le confirma su sitio sin necesidad de evaluación competitiva final. Acompañan al diez **20 campeones de Qatar 2022**: Emiliano Martínez (Aston Villa), Cuti Romero (Tottenham), Nicolás Otamendi (Benfica), Lisandro Martínez (Manchester United), Rodrigo De Paul (Atlético), Enzo Fernández (Chelsea), Alexis Mac Allister (Liverpool), Julián Álvarez (Manchester City), Lautaro Martínez (Inter) y Ángel Di María (Benfica) entre los más prominentes.

**Las bajas más comentadas**. **Paulo Dybala**, con 40 internacionalidades y goleador en la final de la Copa América 2021 contra Brasil en el Maracaná, queda fuera por una temporada irregular en la Roma marcada por lesiones recurrentes. **Ángel Correa**, ex-Atlético hoy en Tigres UANL de México, tampoco entra: la cláusula tácita del jugador argentino en clubes menos exigentes lo penaliza frente a Scaloni. **Valentín Castellanos**, delantero del West Ham, se queda fuera tras una temporada con cifras goleadoras flojas en Premier League.

**Las sorpresas generacionales**. Scaloni hace un guiño explícito al recambio incluyendo a **Franco Mastantuono**, el extremo de 18 años recién fichado por Real Madrid en enero por 45 millones de euros, y a **Claudio Echeverri**, el ex-River hoy en Girona, también de 18 años. Ambos entran como apuesta de futuro y como cobertura de banda si alguno de los titulares se cae. La presencia de jóvenes refuerza el mensaje generacional que la AFA quiere dar tras Qatar: campeones consolidados arropados por la siguiente camada, no un vestuario cerrado al recambio.

**Reparto por club**. Seis jugadores de **River Plate** (Lanzini, Acuña posible, Quintero, Borja entre los nombres en circulación) y cuatro de **Boca Juniors** son la base local de la prelista. El núcleo europeo principal sigue siendo Manchester City (Julián Álvarez), Inter Milán (Lautaro Martínez), Tottenham (Romero), Manchester United (Lisandro Martínez), Aston Villa (Dibu Martínez) y PSG (no hay incorporaciones nuevas, pero salieron Paredes y Di María en años recientes).

**Lo que viene**. Argentina anuncia los **26 definitivos antes del 30 de mayo**. Concentración previa: a confirmar, probablemente entre el 1 y 5 de junio en Estados Unidos. **Debut**: 16 de junio contra el ganador del repechaje intercontinental (probablemente Bolivia o un equipo del rep AFC) en el SoFi Stadium de Inglewood, Los Ángeles. La defensa del título empieza por dos rivales asequibles antes de un cruce probable contra una potencia europea en octavos.`,
    category: 'convocatorias',
    sourceName: 'FIFA · Argentina lista 55 jugadores Copa Mundial 2026',
    sourceUrl:
      'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/argentina-lista-55-jugadores-copa-mundial-2026',
    sourceLang: 'es',
    publishedAt: '2026-05-11T17:00:00Z',
    sourcesSecondary: [
      {
        name: 'Infobae · 6 de River, 4 de Boca',
        url: 'https://www.infobae.com/deportes/2026/05/11/con-6-jugadores-de-river-y-4-de-boca-afa-anuncio-la-prelista-de-55-jugadores-de-la-seleccion-argentina-para-el-mundial/',
      },
      {
        name: 'Ámbito · Scaloni presenta la prelista',
        url: 'https://www.ambito.com/deportes/mundial-2026-lionel-scaloni-presento-la-prelista-55-jugadores-la-seleccion-argentina-n6276122',
      },
      {
        name: 'Goal · Messi named in provisional squad',
        url: 'https://www.goal.com/en-us/lists/lionel-messi-argentina-world-cup-squad-alejandro-garnacho-lisandro-martinez/blta1814607e6572f83',
      },
      {
        name: 'La Nación · Los nombres de la prelista',
        url: 'https://www.lanacion.com.ar/deportes/futbol/la-prelista-de-55-jugadores-para-el-mundial-2026-estos-son-los-nombres-nid11052026/',
      },
      {
        name: 'Infobae · Grandes ausentes y sorpresas',
        url: 'https://www.infobae.com/deportes/2026/05/11/los-grandes-ausentes-y-las-sorpresas-de-la-prelista-para-el-mundial-de-la-seleccion-argentina/',
      },
      {
        name: 'CNN Español · Seis campeones ausentes',
        url: 'https://cnnespanol.cnn.com/2026/05/11/deportes/prelista-seleccion-argentina-scaloni-mundial-orix',
      },
    ],
  },
  {
    slug: 'prelista-brasil-mundial-2026-ancelotti-55-neymar-vinicius-rodrygo-fuera',
    title:
      'Brasil envía la prelista del Mundial: Ancelotti rescata a Neymar y deja fuera a Rodrygo y Militão',
    summary:
      'La CBF entregó este lunes a la FIFA los 55 nombres de Carlo Ancelotti. La sorpresa: el italiano incluye a Neymar pese a su recuperación de ligamentos, busca su cuarto Mundial. Rodrygo, Éder Militão y la joya del Chelsea Estêvão se quedan fuera por lesión. Vinicius Jr. aparece sin dudas. La lista definitiva de 26 se anuncia el 18 de mayo en el Museo del Mañana de Río de Janeiro.',
    body: `La Confederação Brasileira de Futebol envió el lunes 11 de mayo a FIFA la prelista de 55 jugadores que Carlo Ancelotti maneja para el Mundial 2026. Es la primera lista oficial bajo la dirección del entrenador italiano, contratado en mayo de 2025, y la primera vez en la historia que la prelista es vinculante: cualquier convocatoria posterior por lesión solo podrá hacerse entre los 55 nombres entregados a FIFA.

**Neymar entra, contra toda predicción reciente**. El delantero del Santos, recuperado de la rotura de ligamento cruzado y menisco sufrida en octubre de 2023, había jugado solo 13 partidos competitivos en los doce meses anteriores. Ancelotti lo mantiene en la prelista, en una decisión cargada de simbolismo: Neymar busca su cuarto Mundial (2014, 2018, 2022, 2026) y empatar el récord histórico brasileño que comparten Cafú, Ronaldo Nazário y Dida. La nómina definitiva de 26, que se anuncia el 18 de mayo en el Museo del Mañana de Río, es otra cosa. La continuidad física de Neymar en las próximas dos semanas determinará si llega o no al corte final.

**Las bajas más sentidas**. Rodrygo Goes (Real Madrid) queda fuera por una lesión muscular que arrastra desde finales de abril. Éder Militão tampoco entra: el central blanco lleva tres temporadas marcadas por cruzados y sigue sin recuperar el ritmo competitivo que tenía en 2022. Pero la noticia más comentada es la baja de Estêvão Willian, la joya del Chelsea de 17 años que había explotado en los últimos meses de la Premier League: una lesión de grado 4 en el muslo derecho, detectada hace dos semanas, lo deja fuera de toda opción de Mundial.

**Lo que sí está**. Vinicius Jr. encabeza la delantera brasileña sin discusión. Le acompañan Raphinha (Barça), Endrick (Real Madrid), Antony (Manchester United) y João Pedro (Brighton) como nombres prácticamente confirmados. En el centro del campo, Casemiro vuelve al radar de la selección tras una temporada consistente en el Manchester United, Bruno Guimarães (Newcastle) es indiscutible, y la sorpresa positiva es la inclusión de Andreas Pereira (Fulham), que regresa a la canarinha tras dos años de ausencia. El portero titular sigue siendo Alisson (Liverpool), con Ederson (Manchester City) como suplente histórico.

**Lo que viene**. Brasil concentra a los 26 elegidos en la Granja Comary el 27 de mayo. Debut mundialista: 13 de junio contra Marruecos en el MetLife Stadium de Nueva Jersey, en una de las grandes piedras de toque del Grupo C. La pregunta de fondo, sin embargo, es si Brasil con Ancelotti italiano puede romper el techo de cuartos de final que arrastra desde el 2014 humillación 7-1 en el Mineirão.`,
    category: 'convocatorias',
    sourceName: 'Infobae · Deportes',
    sourceUrl:
      'https://www.infobae.com/deportes/2026/05/11/ancelotti-presento-la-prelista-de-la-seleccion-de-brasil-de-cara-al-mundial-2026-la-baja-sorpresiva-y-el-guino-a-neymar/',
    sourceLang: 'es',
    publishedAt: '2026-05-11T18:00:00Z',
    sourcesSecondary: [
      {
        name: '442 (Perfil) · Neymar adentro, Rodrygo afuera',
        url: 'https://442.perfil.com/noticias/mundial-2026/neymar-adentro-rodrygo-afuera-las-sorpresas-de-ancelotti-en-la-prelista-de-brasil-para-el-mundial-2026-a35.phtml',
      },
      {
        name: 'El Gráfico · Carlo Ancelotti define el camino',
        url: 'https://www.elgrafico.com.ar/articulo/mundial-2026/99856/carlo-ancelotti-define-el-camino-de-brasil-sorpresas-regresos-y-bajas-de-peso-en-la-prelista-para-el-mundial-2026',
      },
      {
        name: '365Scores · Lista de 55 jugadores Brasil 2026',
        url: 'https://www.365scores.com/es/news/brasil-pre-lista-convocados-mundial/',
      },
      {
        name: 'Vanguardia · Neymar, la gran sorpresa',
        url: 'https://www.vanguardia.com/deportes/futbol/2026/05/11/neymar-la-gran-sorpresa-de-carlo-ancelotti-asi-quedo-la-prelista-de-brasil-para-el-mundial-2026/',
      },
    ],
  },
  {
    slug: 'prelista-espana-mundial-2026-de-la-fuente-55-yamal-pedri-rodri',
    title:
      'España manda su prelista a la FIFA: De la Fuente fija a Rodri, Pedri, Yamal y Olmo, no la hace pública',
    summary:
      'La RFEF entregó el lunes 11 de mayo a la FIFA la prelista de 55 jugadores de Luis de la Fuente para el Mundial 2026, sin publicarla. Es la primera vez que el documento es vinculante: cualquier sustitución por lesión deberá salir de esa lista. Fijos sin discusión: Rodri, Pedri, Zubimendi, Fabián Ruiz, Fermín, Dani Olmo, más Lamine Yamal, Nico Williams, Ferran Torres y Oyarzabal arriba. La convocatoria definitiva de 26 se anuncia el 25 de mayo.',
    body: `La Federación Española de Fútbol envió el lunes 11 de mayo a la FIFA la prelista de 55 jugadores que Luis de la Fuente baraja para el Mundial 2026. A diferencia de Brasil, que sí publicó los 55 nombres el mismo día, España optó por no hacerla pública. La razón oficial, según fuentes federativas, es no facilitar mapas de presión a los rivales del Grupo H (Cabo Verde, Arabia Saudí y Uruguay). La razón oficiosa, más prosaica, es no exponer las dudas internas del cuerpo técnico ante la prensa durante las dos semanas que quedan hasta el corte final del 25 de mayo.

**El cambio del reglamento**. La gran novedad del Mundial 2026 frente a torneos anteriores es que la prelista pasa a ser vinculante. Hasta Qatar 2022, las federaciones entregaban una lista preliminar abierta y el seleccionador podía sustituir jugadores lesionados por cualquier futbolista hasta 24 horas antes del primer partido. En el Mundial USA-Canadá-México las cosas cambian: si Lamine Yamal o Rodri sufren una lesión en la última semana, De la Fuente solo podrá sustituirlos por uno de los 54 nombres restantes de la prelista. Esto fuerza al seleccionador a incluir reservas de cada posición clave, no solo a sus 26 favoritos.

**Los seis fijos centrales**. Según trabajos de Infobae, ElDesmarque y BeIN Sports, los seis nombres sin discusión en el centro del campo son Rodri (Manchester City, Balón de Oro 2024, recuperado de cruzados), Pedri (Barça, plenitud física tras dos años marcados por lesiones), Martín Zubimendi (Real Sociedad, pivote defensivo titular), Fabián Ruiz (PSG, conectividad y experiencia), Fermín López (Barça, juventud y desborde) y Dani Olmo (Barça, comodín ofensivo). Es la base que ganó la Eurocopa 2024 más Pedri y Rodri recuperados.

**La delantera intocable**. Los cuatro nombres arriba están blindados: Lamine Yamal (Barça, 19 años recién cumplidos, máximo goleador de la Eurocopa 2024 con 17 años), Nico Williams (Athletic, autor del primer gol en la final de Eurocopa contra Inglaterra), Ferran Torres (Barça, recuperado del bajón anímico) y Mikel Oyarzabal (Real Sociedad, autor del gol del título en la final de Eurocopa). En portería la jerarquía está clara: Unai Simón (Athletic) titular, David Raya (Arsenal) suplente.

**Las dudas reales**. El elemento más comentado de la prelista, según El Nacional y El Gol Digital, es la enorme presencia del Barça (nueve jugadores en distintas posiciones) y la escasez de Real Madrid (apenas un nombre, Joselu Mato del Al-Gharafa contado entre las posibles incorporaciones tardías). En defensa, Daniel Vivian, Pau Cubarsí y Robin Le Normand son las opciones más sólidas. El extremo Sergio Gómez (Manchester City), Yeremy Pino (Villarreal) y Jorge Brian de Frutos están en la conversación como cuartos delanteros. La sorpresa esperada es el navarro Iñigo Martínez Berasategi de la Real Sociedad.

**Lo que viene**. España anuncia los 26 definitivos el 25 de mayo. Se concentra en Las Rozas el 26 de mayo. Debuta en el Mundial el 15 de junio contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta, con kickoff a las 12:00 hora local CDT (19:00 hora peninsular).`,
    category: 'convocatorias',
    sourceName: 'Infobae · España',
    sourceUrl:
      'https://www.infobae.com/espana/deportes/2026/05/11/luis-de-la-fuente-y-la-prelista-de-55-jugadores-que-tiene-que-entregar-a-la-fifa-de-ahi-saldran-los-26-convocados-de-la-seleccion-espanola-para-el-mundial-2026/',
    sourceLang: 'es',
    publishedAt: '2026-05-11T19:30:00Z',
    sourcesSecondary: [
      {
        name: 'Eurosport · Prelista enigmática de De la Fuente',
        url: 'https://www.eurosport.es/futbol/mundial/2026/espana-de-la-fuente-prelista-55-jugadores_sto23298860/story.shtml',
      },
      {
        name: 'beIN Sports · Lesiones, dudas y base intocable',
        url: 'https://www.beinsports.com/es-us/football/copa-mundial-de-la-fifa-2026/articles/luis-de-la-fuente-define-su-prelista-con-espa%C3%B1a-para-la-copa-del-mundo-lesiones-dudas-y-una-base-casi-intocable-2026-05-12',
      },
      {
        name: 'ElDesmarque · Fijos, dudas y posibles sorpresas',
        url: 'https://www.eldesmarque.com/futbol/mundial/20260511/prelista-espana-mundial-2026-dudas-fijos-posibles-sorpresas_18_019131728.html',
      },
      {
        name: 'El Nacional · Catalanes y Barça',
        url: 'https://www.elnacional.cat/es/deportes/luis-fuente-manda-prelista-espana-mundial-2026-barca-catalanes_1638400_102.html',
      },
      {
        name: 'El Gol Digital · Moleiro, Sergio Gómez y los tocados',
        url: 'https://www.elgoldigital.com/futbol/seleccion-espana/espana-prelista-55-mundial-2026-moleiro/',
      },
    ],
  },
  {
    slug: 'lego-mundial-2026-coleccion-9-sets-messi-ronaldo-mbappe-vinicius',
    title:
      'LEGO presenta su colección Mundial 2026: nueve sets con Messi, Ronaldo, Mbappé y Vinícius Jr. desde 24,99 dólares',
    summary:
      'LEGO entra de lleno en el merchandising oficial de la Copa del Mundo con nueve sets que cubren el espectro completo de coleccionista. La gama va de los 24,99 $ del emblema oficial 43032 al set premium «Official Trophy» 43020: una réplica 1:1 del trofeo con 2.842 piezas, 36 cm de altura y la primera vez que LEGO usa tantas piezas en color oro real en un mismo set. Pre-orders activas, llegada a tiendas el 1 de mayo.',
    body: `LEGO ha lanzado su colección oficial vinculada al Mundial 2026, su mayor incursión en merchandising deportivo desde la línea Sports descontinuada en 2009. La gama, anunciada bajo el sello LEGO Editions, está compuesta por nueve sets que cubren los tres tipos de coleccionista: el casual ($24,99), el AFOL (Adult Fan Of LEGO) intermedio ($79,99) y el premium ($199,99).

**Los protagonistas son los Big Four**. Los buildable display de la línea «Football Legend» están dedicados a Cristiano Ronaldo (set 43016) y Lionel Messi (43015) por 79,99 $ cada uno: figuras articuladas de unos 25 cm con base personalizada y placa identificativa. La línea «Football Highlights» a 29,99 $ retrata escenas icónicas de Messi (43011) celebrando con la copa, Cristiano (43012), Mbappé (43013) y Vinícius Jr. (43027) en sus ejecuciones más reconocibles.

**El plato fuerte es la réplica del trofeo**. El set 43020 «FIFA World Cup Official Trophy» reproduce el trofeo a escala 1:1 con 2.842 piezas, 36 cm de altura y un precio de 199,99 $ / 179,99 €. Esconde una sorpresa: un compartimento secreto en la esfera superior con el logo del Mundial 2026 dentro. Incluye una minifigura LEGO exclusiva con un mini-trofeo y una placa en la base con todos los campeones del mundo desde 1974. Es la primera vez que LEGO utiliza tantas piezas en color oro real (combinación de laqueado y moldeado) en un solo set.

**Dos sets «entrada» a 24,99 dólares cierran la gama**: el FIFA World Cup 2026 Official Emblem (set 43032, 298 piezas) reproduce el logo oficial del torneo, y el U.S. Soccer National Team Jersey (167 piezas) la camiseta titular de Estados Unidos en formato display. Ambos pensados para regalo y para iniciar a niños mayores de 10 años en la colección.

**Disponibilidad**. El Trophy 43020 abrió pre-order en marzo de 2026 (la primera pieza de la colección anunciada). Los ocho sets restantes llegan el 1 de mayo a LEGO.com (España, USA, México, Brasil). Amazon España, El Corte Inglés y FNAC empiezan a recibir stock entre el 5 y el 15 de mayo. La distribución LATAM (México, Argentina, Brasil) llega 1-2 semanas más tarde. Como la mayoría de releases LEGO de partner, los precios se mantienen oficiales sin descuentos durante las primeras 6-8 semanas.

**Lo que LEGO logra aquí es un golpe doble**: monetiza la fiebre Mundial sin pisar los terrenos exclusivos de Panini (cromos) ni Funko (figuras), y posiciona la marca en el escaparate del próximo Mundial con cuatro de los rostros más buscados en redes sociales. Es la primera línea LEGO donde Messi y Ronaldo coexisten oficialmente.`,
    category: 'patrocinios',
    sourceName: 'NJ.com (Newsweek media)',
    sourceUrl:
      'https://www.nj.com/shopping-deals/2026/04/lego-unveils-fifa-world-cup-2026-collection-with-sets-that-are-surprisingly-affordable.html',
    sourceLang: 'en',
    publishedAt: '2026-05-04T08:00:00Z',
    sourcesSecondary: [
      {
        name: 'LEGO.com · Official Trophy 43020',
        url: 'https://www.lego.com/en-us/aboutus/news/2025/december/lego-editions-fifa-world-cup-official-trophy',
      },
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

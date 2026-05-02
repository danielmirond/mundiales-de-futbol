/**
 * Evolución de las camisetas mundialistas por selección.
 *
 * Cobertura inicial: las selecciones con más historia mundialista
 * (Argentina, Brasil, España, Alemania, Italia, Francia, Holanda,
 * Inglaterra, Uruguay, México). Se irá ampliando.
 *
 * Cada entrada documenta:
 *  - año del Mundial
 *  - marca técnica (Adidas, Nike, Puma, Umbro, etc.)
 *  - color y detalles distintivos
 *  - imagen de un jugador con la camiseta (Wikimedia preferente)
 *  - jugador icónico que la llevó
 *  - flag `iconic` para la más recordada de cada selección
 *
 * Las imágenes son de jugadores con la camiseta, no de la prenda
 * descontextualizada. Wikimedia Commons no tiene catálogo organizado
 * de camisetas y las prendas oficiales están sujetas a copyright.
 */

export type JerseyEntry = {
  year: number;
  brand: string;
  /** 'home' | 'away' | 'third'. */
  variant: 'home' | 'away' | 'third';
  primaryColor: string;
  secondaryColor?: string;
  /** Descripción editorial (50-80 palabras). */
  description: string;
  /** Imagen Wikimedia de un jugador con esa camiseta o del partido. */
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  /** Jugador o partido emblemático. */
  wornBy?: string;
  /** Camiseta más icónica de la selección. */
  iconic?: boolean;
  /** ASIN de réplica retro disponible en Amazon (si la hay). */
  amazonAsin?: string;
};

export type JerseyHistory = {
  teamCode: string;
  teamName: string;
  /** Apodo histórico de la afición. */
  nickname: string;
  /** Color principal histórico de la selección. */
  baseColor: string;
  /** Resumen editorial general (80-120 palabras). */
  intro: string;
  /** Lista cronológica ascendente de camisetas en Mundiales. */
  jerseys: JerseyEntry[];
};

export const JERSEY_HISTORIES: JerseyHistory[] = [
  // ─── Argentina ────────────────────────────────────────────────
  {
    teamCode: 'ARG',
    teamName: 'Argentina',
    nickname: 'La Albiceleste',
    baseColor: '#74acdf',
    intro:
      'La camiseta argentina son dos rayas verticales celestes y blancas que vienen de la bandera nacional, vista por primera vez en el clásico río-platense de 1908. La AFA la registró oficialmente en 1908 y desde 1930 acompaña a Argentina en cada Mundial. Tres estrellas (1978, 1986, 2022) coronan el escudo. La marca técnica fue de la propia AFA en los inicios, Le Coq Sportif en los 70-80, Adidas desde los 90.',
    jerseys: [
      {
        year: 1978,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#74acdf',
        secondaryColor: '#ffffff',
        description:
          'La primera camiseta de Argentina campeona en su propia tierra. Cuello redondo, dos rayas anchas blanco y celeste, escudo AFA tradicional. La que llevó Kempes con el número 10 al levantar la primera Copa del Mundo en el Monumental.',
        wornBy: 'Mario Kempes',
        iconic: false,
      },
      {
        year: 1986,
        brand: 'Le Coq Sportif',
        variant: 'home',
        primaryColor: '#74acdf',
        secondaryColor: '#ffffff',
        description:
          'La camiseta más icónica de la historia argentina. Le Coq Sportif, cuello redondo, número 10 dorado en la espalda. Maradona la llevó al levantar la copa en el Estadio Azteca, después de marcar la Mano de Dios y el Gol del Siglo a Inglaterra.',
        imageUrl:
          'https://commons.wikimedia.org/wiki/Special:FilePath/Maradona-Mundial_86_con_la_copa.JPG?width=1200',
        imageAlt: 'Diego Maradona levanta la Copa del Mundo en 1986',
        imageCredit: 'Foto: El Gráfico, Wikimedia Commons',
        wornBy: 'Diego Maradona',
        iconic: true,
      },
      {
        year: 1998,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#74acdf',
        secondaryColor: '#ffffff',
        description:
          'Adidas asume la camiseta argentina y la mantiene desde Francia 98. Cuello en V, líneas más estilizadas, three stripes en los hombros. Batistuta, Verón y Ortega defendieron este modelo en el Mundial galo.',
        wornBy: 'Gabriel Batistuta',
      },
      {
        year: 2022,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#74acdf',
        secondaryColor: '#ffffff',
        description:
          'La camiseta del tercer título mundial. Diseño clásico actualizado, escudo cosido, tres estrellas finales sobre el escudo tras el 18 de diciembre en Lusail. Messi la levantó en Catar tras vencer a Francia en penales.',
        wornBy: 'Lionel Messi',
        iconic: true,
      },
    ],
  },

  // ─── Brasil ──────────────────────────────────────────────────
  {
    teamCode: 'BRA',
    teamName: 'Brasil',
    nickname: 'A Canarinha',
    baseColor: '#fdc500',
    intro:
      'Brasil jugó sus primeros tres Mundiales (1930, 1934, 1938) con camiseta blanca con cuello azul. Tras el Maracanazo de 1950, la prensa brasileña responsabilizó al uniforme blanco del fracaso. En 1953 se convocó un concurso público y ganó Aldyr Garcia Schlee, un joven uruguayo de 18 años, con la combinación amarillo-azul-blanco-verde que estrenó la selección en 1954. Desde Suecia 1958 (con Pelé de 17 años) la canarinha es ya el símbolo del fútbol brasileño y del Mundial.',
    jerseys: [
      {
        year: 1958,
        brand: 'Athleta',
        variant: 'home',
        primaryColor: '#fdc500',
        secondaryColor: '#0d2c5d',
        description:
          'Estreno mundialista de la camiseta amarilla y verde diseñada por Aldyr Garcia Schlee. Cuello redondo, número en el pecho, escudo CBD. Pelé la llevó con el 10 en Suecia y Brasil ganó su primer Mundial. Desde aquí, mítica.',
        wornBy: 'Pelé',
        iconic: true,
      },
      {
        year: 1970,
        brand: 'Athleta',
        variant: 'home',
        primaryColor: '#fdc500',
        secondaryColor: '#0d2c5d',
        description:
          'Probablemente la camiseta más fotografiada del fútbol mundial. Pelé, Tostão, Jairzinho, Rivelino y Carlos Alberto en el Estadio Azteca, 21 de junio de 1970. Brasil ganó la Jules Rimet a perpetuidad y la imagen del 10 saltando con los puños hacia arriba se convirtió en póster universal.',
        imageUrl:
          'https://commons.wikimedia.org/wiki/Special:FilePath/Pele_with_Brazilian_squad_-_1958_World_Cup.jpg?width=1200',
        imageAlt: 'Pelé con la canarinha en un Mundial',
        imageCredit: 'Foto: Wikimedia Commons',
        wornBy: 'Pelé',
        iconic: true,
      },
      {
        year: 2002,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#fdc500',
        secondaryColor: '#0d2c5d',
        description:
          'Nike asume la camiseta brasileña en 1996 y diseña la del quinto título. Más amarillo intenso, cuello redondo con detalle azul, swoosh en el pecho. Ronaldo, Rivaldo y Ronaldinho la llevaron en Corea-Japón 2002.',
        wornBy: 'Ronaldo (R9)',
      },
      {
        year: 2022,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#fdc500',
        secondaryColor: '#0d2c5d',
        description:
          'Diseño contemporáneo con detalle de leopardo amarillo en hombros como guiño a la flora y fauna amazónica. Vinicius Jr., Neymar y Casemiro la llevaron en Catar 2022, donde Brasil cayó en cuartos contra Croacia.',
        wornBy: 'Neymar',
      },
    ],
  },

  // ─── España ──────────────────────────────────────────────────
  {
    teamCode: 'ESP',
    teamName: 'España',
    nickname: 'La Roja',
    baseColor: '#c60b1e',
    intro:
      'España juega de rojo desde su debut mundialista en Italia 1934. La elección no responde a la bandera nacional sino al color heráldico tradicional. El cambio profundo llega en 1981, cuando la RFEF firma con Adidas y luego con Le Coq Sportif. Adidas ha vestido a España en todos los Mundiales desde 1990. La camiseta del título mundial 2010 (cuello en V, rojo intenso, escudo cosido) es ya la más recordada por dos generaciones de aficionados.',
    jerseys: [
      {
        year: 1982,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#c60b1e',
        secondaryColor: '#ffd700',
        description:
          'España, anfitriona del Mundial 82, se vistió con cuello redondo amarillo, three stripes blanco en los hombros y escudo RFEF clásico. Quini, Santillana y Arconada la llevaron en una Mundial local que terminó en segunda fase.',
        wornBy: 'Luis Arconada',
      },
      {
        year: 2010,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#c60b1e',
        secondaryColor: '#ffd700',
        description:
          'La camiseta del primer (y único) Mundial de España. Cuello en V, rojo borgoña, escudo bordado, three stripes amarillo en hombros. Iniesta marcó el gol de la final con el 6 a la espalda en Soccer City, Johannesburgo. Pieza de coleccionista para siempre.',
        wornBy: 'Andrés Iniesta (gol final)',
        iconic: true,
      },
      {
        year: 2022,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#c60b1e',
        secondaryColor: '#ffffff',
        description:
          'Diseño con guiño a la del 94 y 96: dos franjas onduladas en azul y amarillo cruzando el pecho de un hombro al otro. Pedri, Gavi y Morata la llevaron en Catar 2022, donde España cayó en octavos contra Marruecos en penales.',
        wornBy: 'Pedri',
      },
      {
        year: 2026,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#c60b1e',
        secondaryColor: '#ffd700',
        description:
          'Camiseta para el Mundial de Norteamérica con detalles dorados en homenaje al título de 2010. Lamine Yamal y Pedri serán los referentes ofensivos. Estreno mundialista oficial el 15 de junio en Atlanta contra Cabo Verde.',
        wornBy: 'Lamine Yamal',
      },
    ],
  },

  // ─── Alemania ────────────────────────────────────────────────
  {
    teamCode: 'GER',
    teamName: 'Alemania',
    nickname: 'Die Mannschaft',
    baseColor: '#ffffff',
    intro:
      'Alemania (RFA hasta 1990) ha jugado todos sus Mundiales con la camiseta blanca con detalles negros, en homenaje a la bandera prusiana y luego a los colores nacionales (negro, rojo, dorado). Adidas ha sido la marca histórica desde 1954 (la del Milagro de Berna). El detalle de las cuatro estrellas sobre el escudo se ganó en 1954, 1974, 1990 y 2014.',
    jerseys: [
      {
        year: 1990,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#ffffff',
        secondaryColor: '#000000',
        description:
          'La camiseta del tercer título alemán. Estampado tricolor (negro, rojo, dorado) en el pecho que ondea de izquierda a derecha. Diseño icónico de la era pre-reunificación. Brehme, Matthäus y Klinsmann la llevaron al título en Italia 90.',
        wornBy: 'Andreas Brehme',
        iconic: true,
      },
      {
        year: 2014,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#ffffff',
        secondaryColor: '#000000',
        description:
          'Camiseta del cuarto título. Diseño minimalista con franjas rojas en el pecho. Götze marcó el gol de la final contra Argentina en el Maracaná en el minuto 113 con el dorsal 19.',
        wornBy: 'Mario Götze',
        iconic: true,
      },
      {
        year: 2022,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#ffffff',
        secondaryColor: '#000000',
        description:
          'Versión moderna con cuello negro y three stripes negras. Müller, Sané y Havertz la llevaron en Catar, donde Alemania quedó eliminada en fase de grupos por segunda vez consecutiva.',
        wornBy: 'Thomas Müller',
      },
    ],
  },

  // ─── Italia ──────────────────────────────────────────────────
  {
    teamCode: 'ITA',
    teamName: 'Italia',
    nickname: 'Gli Azzurri',
    baseColor: '#0066cc',
    intro:
      'Italia juega de azul desde 1911 en homenaje a la Casa de Saboya, dinastía real italiana. El azzurro es el color tradicional aunque la bandera italiana sea verde, blanca y roja. Cuatro estrellas (1934, 1938, 1982, 2006) sobre el escudo. La marca técnica histórica fue Diadora en los 70-80, luego Nike y, desde 2003, Puma.',
    jerseys: [
      {
        year: 1982,
        brand: 'Le Coq Sportif',
        variant: 'home',
        primaryColor: '#0066cc',
        secondaryColor: '#ffffff',
        description:
          'La camiseta del tercer título italiano. Azzurro intenso, cuello en V, escudo FIGC clásico. Paolo Rossi, Bota y Balón de Oro 82, marcó tres goles a Brasil en el Bernabéu y dos a Polonia en semifinal con esta camiseta.',
        wornBy: 'Paolo Rossi',
        iconic: true,
      },
      {
        year: 2006,
        brand: 'Puma',
        variant: 'home',
        primaryColor: '#0066cc',
        secondaryColor: '#ffd700',
        description:
          'La camiseta del cuarto título. Diseño contemporáneo con detalles dorados en cuello y mangas. Cannavaro levantó la copa en Berlín tras ganar a Francia en penales (la final del cabezazo de Zidane a Materazzi).',
        wornBy: 'Fabio Cannavaro',
        iconic: true,
      },
      {
        year: 2026,
        brand: 'Puma',
        variant: 'home',
        primaryColor: '#0066cc',
        secondaryColor: '#ffd700',
        description:
          'Italia no clasificó al Mundial 2026 (eliminada en repechaje europeo por tercera vez consecutiva). Es la primera vez en la historia que la Azzurra se queda fuera de tres Mundiales seguidos.',
        wornBy: 'No clasificada',
      },
    ],
  },

  // ─── Francia ─────────────────────────────────────────────────
  {
    teamCode: 'FRA',
    teamName: 'Francia',
    nickname: 'Les Bleus',
    baseColor: '#1d3a8c',
    intro:
      'Francia ha jugado todos sus Mundiales con camiseta azul (con dos excepciones puntuales en 1978 y 1986). El azul francés viene de los colores nacionales (blanco, rojo, azul). Adidas la ha vestido desde 1972. Dos estrellas sobre el escudo (1998 y 2018), las dos primeras y únicas hasta hoy.',
    jerseys: [
      {
        year: 1998,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#1d3a8c',
        secondaryColor: '#ffffff',
        description:
          'La camiseta del primer título francés. Azul oscuro, cuello redondo blanco, three stripes blanco en los hombros, gallo de la FFF cosido. Zidane marcó dos goles de cabeza en la final contra Brasil en el Stade de France con el dorsal 10.',
        wornBy: 'Zinedine Zidane',
        iconic: true,
      },
      {
        year: 2018,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#1d3a8c',
        secondaryColor: '#ffffff',
        description:
          'Veinte años después, el segundo título francés. Nike había sustituido a Adidas en 2011. Diseño moderno con detalle dorado en el cuello tras el título. Mbappé (19 años), Pogba, Griezmann y Lloris la llevaron en Rusia.',
        wornBy: 'Kylian Mbappé',
        iconic: true,
      },
      {
        year: 2022,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#1d3a8c',
        secondaryColor: '#ffffff',
        description:
          'Diseño con detalle de mapa de Francia en grafismo sobre el pecho. Mbappé hizo hat-trick en la final contra Argentina pero Francia perdió en penales. Una de las finales más dramáticas de la historia mundialista.',
        wornBy: 'Kylian Mbappé (hat-trick final)',
      },
    ],
  },

  // ─── Holanda ─────────────────────────────────────────────────
  {
    teamCode: 'NED',
    teamName: 'Países Bajos',
    nickname: 'La Naranja Mecánica',
    baseColor: '#ff6900',
    intro:
      'Holanda juega de naranja desde finales del siglo XIX en homenaje a la Casa de Orange-Nassau, dinastía real neerlandesa. El naranja brillante es el color más reconocible del fútbol mundial junto con el amarillo de Brasil y el celeste argentino. Adidas vistió a Holanda en sus mejores años (1974, 1988 Eurocopa, 2010), Nike desde 1996. Cero títulos mundiales pese a ser la mejor selección sin haber ganado nunca.',
    jerseys: [
      {
        year: 1974,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#ff6900',
        secondaryColor: '#000000',
        description:
          'La camiseta del fútbol total de Cruyff. Naranja brillante con dos franjas negras en los hombros (no las three stripes Adidas, ese era detalle Cruyff personal). Cruyff llevaba dos rayas porque tenía contrato con Puma personal. Holanda perdió la final 2-1 contra Alemania.',
        wornBy: 'Johan Cruyff',
        iconic: true,
      },
      {
        year: 2010,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#ff6900',
        secondaryColor: '#000000',
        description:
          'Naranja Nike contemporáneo. Holanda llegó a la final contra España en Sudáfrica, donde perdió 1-0 con gol de Iniesta en la prórroga. Sneijder, Robben y Van Persie la llevaron.',
        wornBy: 'Wesley Sneijder',
      },
      {
        year: 2022,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#ff6900',
        secondaryColor: '#000000',
        description:
          'Diseño con guiño a la 88 (la Eurocopa de Van Basten). Cuello redondo negro, detalle dentado en hombros. Holanda cayó en cuartos contra Argentina en penales tras un partido épico (3-3 tras prórroga).',
        wornBy: 'Cody Gakpo',
      },
    ],
  },

  // ─── Inglaterra ──────────────────────────────────────────────
  {
    teamCode: 'ENG',
    teamName: 'Inglaterra',
    nickname: 'Los Three Lions',
    baseColor: '#ffffff',
    intro:
      'Inglaterra juega de blanco desde su primer partido internacional en 1872 (Inglaterra-Escocia, primer partido oficial entre selecciones). El blanco viene del uniforme tradicional del cricket inglés. Three Lions, el escudo, viene del rey Ricardo Corazón de León (siglo XII). Umbro fue la marca técnica histórica (1959-2013), luego Nike (2013-2030).',
    jerseys: [
      {
        year: 1966,
        brand: 'Umbro',
        variant: 'home',
        primaryColor: '#ffffff',
        secondaryColor: '#0d2c5d',
        description:
          'La camiseta del único título inglés. Blanco puro, cuello redondo, escudo Three Lions sobre el pecho izquierdo. Bobby Moore levantó la Jules Rimet en Wembley el 30 de julio de 1966 tras ganar 4-2 a Alemania (con hat-trick de Hurst).',
        wornBy: 'Bobby Moore',
        iconic: true,
      },
      {
        year: 1990,
        brand: 'Umbro',
        variant: 'home',
        primaryColor: '#ffffff',
        secondaryColor: '#0d2c5d',
        description:
          'La camiseta del «It\'s coming home» avant la lettre. Cuello redondo azul, detalles geométricos. Inglaterra llegó a semifinal en Italia 90 y perdió en penales contra Alemania (Pearce y Waddle fallaron). Lágrimas de Gascoigne.',
        wornBy: 'Paul Gascoigne',
      },
      {
        year: 2018,
        brand: 'Nike',
        variant: 'home',
        primaryColor: '#ffffff',
        secondaryColor: '#0d2c5d',
        description:
          'Diseño minimalista contemporáneo. Inglaterra llegó a semifinal en Rusia y cayó contra Croacia en la prórroga. Harry Kane fue Bota de Oro con seis goles. La Tartan Army inglesa cantaba «It\'s coming home».',
        wornBy: 'Harry Kane',
      },
    ],
  },

  // ─── Uruguay ─────────────────────────────────────────────────
  {
    teamCode: 'URU',
    teamName: 'Uruguay',
    nickname: 'La Celeste',
    baseColor: '#5cbcef',
    intro:
      'Uruguay viste de celeste desde 1910, color tomado del partido contra Argentina del 15 de agosto de aquel año (Uruguay 2-1). Las cuatro estrellas sobre el escudo (1924, 1928 Olímpicos, 1930 y 1950 Mundiales) son polémicas: FIFA solo reconoce las dos mundiales, pero Uruguay reclama las cuatro. Le ha vestido históricamente la firma Penalty, luego Puma desde 2018.',
    jerseys: [
      {
        year: 1930,
        brand: 'Local',
        variant: 'home',
        primaryColor: '#5cbcef',
        secondaryColor: '#000000',
        description:
          'La camiseta del primer Mundial de la historia. Uruguay anfitrión, ganó la final contra Argentina 4-2 en el Estadio Centenario. Camiseta celeste con cuello negro y escudo AUF sobre el pecho. José Nasazzi capitaneó al equipo.',
        wornBy: 'José Nasazzi',
      },
      {
        year: 1950,
        brand: 'Local',
        variant: 'home',
        primaryColor: '#5cbcef',
        secondaryColor: '#000000',
        description:
          'La camiseta del Maracanazo. 200 000 brasileños esperando la victoria, Brasil 1-0 al minuto 47. Schiaffino empató a los 66 y Ghiggia hizo el 2-1 al minuto 79. Obdulio Varela, capitán, levantó la copa en silencio. Camiseta del segundo título uruguayo.',
        wornBy: 'Obdulio Varela',
        iconic: true,
      },
      {
        year: 2010,
        brand: 'Puma',
        variant: 'home',
        primaryColor: '#5cbcef',
        secondaryColor: '#ffffff',
        description:
          'Uruguay volvió a semifinales 60 años después del Maracanazo. Diego Forlán fue Balón de Oro en Sudáfrica. Camiseta celeste con cuello redondo blanco y detalles puma. La Garra Charrúa.',
        wornBy: 'Diego Forlán',
      },
    ],
  },

  // ─── México ──────────────────────────────────────────────────
  {
    teamCode: 'MEX',
    teamName: 'México',
    nickname: 'El Tri',
    baseColor: '#006341',
    intro:
      'México juega de verde desde 1928 cuando la Federación Mexicana adoptó los colores nacionales (verde, blanco y rojo). El verde claro / verde oscuro ha tenido variantes a lo largo de la historia. Adidas ha sido la marca técnica desde 1986 (cuando el primer Mundial mexicano). Cero títulos mundiales pero anfitrión de tres (1970, 1986, 2026, único país en la historia).',
    jerseys: [
      {
        year: 1986,
        brand: 'Levi\'s',
        variant: 'home',
        primaryColor: '#006341',
        secondaryColor: '#ffffff',
        description:
          'La camiseta del Mundial mexicano. Verde con detalles geométricos blancos y rojos en cuello y mangas. Hugo Sánchez la llevaba en una época en la que México llegó a cuartos de final por primera vez en su historia.',
        wornBy: 'Hugo Sánchez',
        iconic: true,
      },
      {
        year: 1998,
        brand: 'Aba',
        variant: 'home',
        primaryColor: '#006341',
        secondaryColor: '#ffffff',
        description:
          'La famosa camiseta con el calendario azteca. Diseño de Aba con tetragramas mayas y detalles indígenas en el pecho y los brazos. Cuauhtémoc Blanco la inmortalizó con la «Cuauhtemiña». Una de las camisetas más vendidas de la historia mundialista.',
        wornBy: 'Cuauhtémoc Blanco',
        iconic: true,
      },
      {
        year: 2026,
        brand: 'Adidas',
        variant: 'home',
        primaryColor: '#006341',
        secondaryColor: '#ffffff',
        description:
          'Camiseta del tercer Mundial mexicano como anfitrión. Verde tradicional con detalles en plata. México abre el torneo el 11 de junio en el Estadio Azteca contra Sudáfrica.',
        wornBy: 'Hirving «Chucky» Lozano',
      },
    ],
  },
];

export function getJerseyHistory(teamCode: string): JerseyHistory | undefined {
  return JERSEY_HISTORIES.find((h) => h.teamCode === teamCode);
}

/** Top camisetas icónicas (cross-team) ordenadas por año. */
export function getIconicJerseys(): { history: JerseyHistory; jersey: JerseyEntry }[] {
  const result: { history: JerseyHistory; jersey: JerseyEntry }[] = [];
  for (const h of JERSEY_HISTORIES) {
    for (const j of h.jerseys) {
      if (j.iconic) result.push({ history: h, jersey: j });
    }
  }
  return result.sort((a, b) => a.jersey.year - b.jersey.year);
}

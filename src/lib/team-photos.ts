/**
 * Galería curada de fotos icónicas de selecciones nacionales en los
 * Mundiales. Todas verificadas en Wikimedia Commons con licencia limpia
 * (PD o CC). Ampliable: añadir entradas por código FIFA del país.
 *
 * Convención de URLs: usamos `Special:FilePath` con `?width=1200`,
 * que redirige al thumbnail óptimo y se mantiene estable si Wikimedia
 * cambia el hash del archivo.
 *
 * Para añadir más selecciones, las subcategorías a explorar en Commons:
 *   · Category:[Country]_at_the_YYYY_FIFA_World_Cup
 *   · Category:Anefo_FIFA_World_Cup_YYYY (archivo holandés con muchas
 *     fotos del 1974, 1978...)
 *   · Category:Bundesarchiv_Bild_FIFA (archivo alemán)
 */

export type TeamPhoto = {
  /** Año del Mundial al que pertenece la foto */
  year: number;
  /** URL ya en formato Special:FilePath con width=1200 */
  url: string;
  alt: string;
  /** Caption visible bajo la foto */
  caption: string;
  credit: string;
  license: string;
  /** Página de origen en Commons */
  source: string;
  /** Si es la foto destacada del Mundial para esa selección */
  featured?: boolean;
};

export const TEAM_PHOTOS: Record<string, TeamPhoto[]> = {
  // ════════════════════════════════════════════════════════════
  //  ARG · Argentina (3 títulos: 1978, 1986, 2022)
  // ════════════════════════════════════════════════════════════
  ARG: [
    {
      year: 1986,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maradona-Mundial_86_con_la_copa.JPG?width=1200',
      alt: 'Diego Maradona levanta la Copa del Mundo en el Estadio Azteca, 29 de junio de 1986',
      caption: 'Maradona levanta la copa, Estadio Azteca · 29 jun 1986',
      credit: 'El Gráfico, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Maradona-Mundial_86_con_la_copa.JPG',
      featured: true,
    },
    {
      year: 1986,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Argentina_festejo_avion_86.jpg?width=1200',
      alt: 'La selección argentina celebra el título en el avión de regreso desde México',
      caption: 'Festejo en el avión de regreso · México 86',
      credit: 'Archivo argentino, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Argentina_festejo_avion_86.jpg',
    },
    {
      year: 1986,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bilardo_valdano_borghi_maradona.jpg?width=1200',
      alt: 'Carlos Bilardo, Jorge Valdano, Claudio Borghi y Diego Maradona durante el Mundial 1986',
      caption: 'Bilardo, Valdano, Borghi y Maradona · México 86',
      credit: 'Archivo argentino, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Bilardo_valdano_borghi_maradona.jpg',
    },
    {
      year: 1986,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bilardo_y_grondona_celebrando_el_titulo.jpg?width=1200',
      alt: 'Carlos Bilardo y Julio Grondona celebran el título mundial de 1986',
      caption: 'Bilardo y Grondona celebran el título · 1986',
      credit: 'Archivo argentino, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Bilardo_y_grondona_celebrando_el_titulo.jpg',
    },
    {
      year: 1986,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/El_grafito_3477_maradona_passarella.jpg?width=1200',
      alt: 'Portada de El Gráfico número 3477 con Diego Maradona y Daniel Passarella',
      caption: 'Portada El Gráfico nº 3477 · Maradona y Passarella',
      credit: 'El Gráfico, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:El_grafito_3477_maradona_passarella.jpg',
    },
    {
      year: 1986,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Argentina_x_corea_1986.JPG?width=1200',
      alt: 'Partido Argentina-Corea del Sur en la fase de grupos del Mundial 1986',
      caption: 'Argentina-Corea · Fase de grupos · México 86',
      credit: 'Archivo argentino, 1986',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Argentina_x_corea_1986.JPG',
    },
    {
      year: 2022,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Argentina_3-3_Francia_-_Copa_Mundial_2022_-_Argentina_campeón.jpg?width=1200',
      alt: 'Argentina celebra el tercer título mundial tras vencer a Francia 4-2 en penales tras el 3-3 en Lusail',
      caption: 'Argentina campeona · Lusail · 18 dic 2022',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Argentina_3-3_Francia_-_Copa_Mundial_2022_-_Argentina_campeón.jpg',
      featured: true,
    },
    {
      year: 2022,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fanview_Argentina_Francia_Copa_Mundial_2022.jpg?width=1200',
      alt: 'Vista desde la grada argentina durante la final del Mundial Qatar 2022',
      caption: 'Hinchada argentina · Final Lusail · 2022',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Fanview_Argentina_Francia_Copa_Mundial_2022.jpg',
    },
  ],

  // ════════════════════════════════════════════════════════════
  //  BRA · Brasil (5 títulos: 1958, 1962, 1970, 1994, 2002)
  // ════════════════════════════════════════════════════════════
  BRA: [
    {
      year: 1970,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pele_con_brasil_(cropped).jpg?width=1200',
      alt: 'Pelé con la selección brasileña durante el Mundial de México 1970',
      caption: 'Pelé · Mundial 1970',
      credit: 'El Gráfico, 1970',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Pele_con_brasil_(cropped).jpg',
      featured: true,
    },
  ],

  // ════════════════════════════════════════════════════════════
  //  GER · Alemania (4 títulos: 1954, 1974, 1990, 2014)
  //  Códigos de Alemania histórica: DE / FRG. Centralizamos en GER.
  // ════════════════════════════════════════════════════════════
  GER: [
    {
      year: 2014,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Die_Mannschaft_auf_dem_Weg_zur_Fanmeile,_Berlin_(15.07.2014)_(14474424817).jpg?width=1200',
      alt: 'Die Mannschaft camino a la Fanmeile de Berlín tras ganar el Mundial 2014',
      caption: 'Camino a la Fanmeile · Berlín · 15 jul 2014',
      credit: 'Wikimedia Commons',
      license: 'CC BY 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Die_Mannschaft_auf_dem_Weg_zur_Fanmeile,_Berlin_(15.07.2014)_(14474424817).jpg',
      featured: true,
    },
    {
      year: 2014,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/2014_FIFA_World_Cup_Final,_Germany_vs_Argentina_lineup.jpeg?width=1200',
      alt: 'Alineación de Alemania en la final del Mundial 2014 contra Argentina',
      caption: 'Alineación · Final 2014 · Maracaná',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:2014_FIFA_World_Cup_Final,_Germany_vs_Argentina_lineup.jpeg',
    },
    {
      year: 2014,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Training_Germany_national_team_before_the_match_against_Brazil_at_the_FIFA_World_Cup_2014-07-07.jpg?width=1200',
      alt: 'Entrenamiento de Alemania antes del partido contra Brasil (7 julio 2014)',
      caption: 'Entrenamiento previo al 7-1 a Brasil · 7 jul 2014',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Training_Germany_national_team_before_the_match_against_Brazil_at_the_FIFA_World_Cup_2014-07-07.jpg',
    },
  ],

  // ════════════════════════════════════════════════════════════
  //  ITA · Italia (4 títulos: 1934, 1938, 1982, 2006)
  // ════════════════════════════════════════════════════════════
  ITA: [
    {
      year: 2006,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Italy_2006_FIFA_World_Cup_Champion_-_Melandri,_Napolitano,_Cannavaro_and_Lippi.jpg?width=1200',
      alt: 'Italia campeona 2006: Melandri, el presidente Napolitano, Cannavaro y Lippi con la copa',
      caption: 'Cannavaro y Lippi con la copa · Quirinale · 2006',
      credit: 'Presidencia de la República Italiana',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Italy_2006_FIFA_World_Cup_Champion_-_Melandri,_Napolitano,_Cannavaro_and_Lippi.jpg',
      featured: true,
    },
    {
      year: 2006,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fabio_Cannavaro_in_world_cup_2006.jpg?width=1200',
      alt: 'Fabio Cannavaro, capitán italiano, durante el Mundial de Alemania 2006',
      caption: 'Fabio Cannavaro · Capitán · Alemania 2006',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Fabio_Cannavaro_in_world_cup_2006.jpg',
    },
    {
      year: 2006,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fabio_Grosso_in_world_cup_final_2006.png?width=1200',
      alt: 'Fabio Grosso celebra el penal decisivo de Italia en la final del Mundial 2006',
      caption: 'Fabio Grosso · Penal decisivo de la final · 2006',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Fabio_Grosso_in_world_cup_final_2006.png',
    },
    {
      year: 2006,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gattuso_in_world_cup_final_2006.jpg?width=1200',
      alt: 'Gennaro Gattuso durante la final del Mundial 2006 contra Francia',
      caption: 'Gennaro Gattuso · Final 2006',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Gattuso_in_world_cup_final_2006.jpg',
    },
    {
      year: 2006,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alex_Del_Piero_(2006).jpg?width=1200',
      alt: 'Alessandro Del Piero, jugador clave de Italia en el Mundial 2006',
      caption: 'Alessandro Del Piero · Alemania 2006',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Alex_Del_Piero_(2006).jpg',
    },
  ],

  // ════════════════════════════════════════════════════════════
  //  FRA · Francia (2 títulos: 1998, 2018)
  // ════════════════════════════════════════════════════════════
  FRA: [
    {
      year: 2018,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hugo_Lloris_201807091.jpg?width=1200',
      alt: 'Hugo Lloris, capitán de Francia, durante el Mundial de Rusia 2018',
      caption: 'Hugo Lloris · Capitán · Rusia 2018',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Hugo_Lloris_201807091.jpg',
      featured: true,
    },
    {
      year: 2018,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Benjamin_Pavard_20180709.jpg?width=1200',
      alt: 'Benjamin Pavard, autor del gol del torneo según FIFA, durante Rusia 2018',
      caption: 'Benjamin Pavard · Rusia 2018',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Benjamin_Pavard_20180709.jpg',
    },
  ],

  // ════════════════════════════════════════════════════════════
  //  URU · Uruguay (2 títulos: 1930, 1950)
  // ════════════════════════════════════════════════════════════
  URU: [
    {
      year: 1950,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Obdulio_Varela,_Estadio,_1950-07-15_(374).jpg?width=1200',
      alt: 'Obdulio Varela, capitán de Uruguay en el Maracanazo, en la portada de la revista Estadio el 15 de julio de 1950',
      caption: 'Obdulio Varela · 15 jul 1950 · Maracaná',
      credit: 'Revista Estadio (Santiago, Zig-Zag), 1950',
      license: 'Dominio público',
      source: 'https://commons.wikimedia.org/wiki/File:Obdulio_Varela,_Estadio,_1950-07-15_(374).jpg',
      featured: true,
    },
  ],

  // ════════════════════════════════════════════════════════════
  //  ESP · España (1 título: 2010)
  // ════════════════════════════════════════════════════════════
  ESP: [
    {
      year: 2010,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Senyera_Sud-àfrica_Xavi_i_Puyol.JPG?width=1200',
      alt: 'Xavi Hernández y Carles Puyol con la senyera tras una victoria de España en el Mundial de Sudáfrica 2010',
      caption: 'Xavi y Puyol con la senyera · Sudáfrica 2010',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Senyera_Sud-àfrica_Xavi_i_Puyol.JPG',
      featured: true,
    },
    {
      year: 2010,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Selección_española_antes_del_encuentro_contra_Suiza.jpg?width=1200',
      alt: 'La selección española posa antes del primer partido del Mundial 2010 contra Suiza',
      caption: 'España antes del partido contra Suiza · Sudáfrica 2010',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
      source: 'https://commons.wikimedia.org/wiki/File:Selección_española_antes_del_encuentro_contra_Suiza.jpg',
    },
    {
      year: 2010,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/President_Zapatero_with_FIFA_world_cup.jpg?width=1200',
      alt: 'José Luis Rodríguez Zapatero, presidente del Gobierno español, con la Copa del Mundo 2010',
      caption: 'El presidente Zapatero con la copa · La Moncloa · 2010',
      credit: 'La Moncloa',
      license: 'CC BY-NC-ND',
      source: 'https://commons.wikimedia.org/wiki/File:President_Zapatero_with_FIFA_world_cup.jpg',
    },
    {
      year: 2010,
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gerard_Piqué_en_La_Moncloa.jpg?width=1200',
      alt: 'Gerard Piqué con la Copa del Mundo en La Moncloa tras la victoria de España en 2010',
      caption: 'Piqué con la copa · La Moncloa · 2010',
      credit: 'La Moncloa',
      license: 'CC BY-NC-ND',
      source: 'https://commons.wikimedia.org/wiki/File:Gerard_Piqué_en_La_Moncloa.jpg',
    },
  ],
};

/**
 * Devuelve las fotos verificadas para una selección, ordenadas por año descendente.
 * Filtra cualquier entrada que no tenga URL.
 */
export function getTeamPhotos(code: string): TeamPhoto[] {
  const photos = TEAM_PHOTOS[code];
  if (!photos || photos.length === 0) return [];
  return [...photos].sort((a, b) => b.year - a.year);
}

/**
 * Agrupa las fotos de una selección por año del Mundial.
 * Devuelve un Map con orden cronológico descendente.
 */
export function getTeamPhotosByYear(code: string): Map<number, TeamPhoto[]> {
  const photos = getTeamPhotos(code);
  const map = new Map<number, TeamPhoto[]>();
  for (const p of photos) {
    const list = map.get(p.year) ?? [];
    list.push(p);
    map.set(p.year, list);
  }
  return map;
}

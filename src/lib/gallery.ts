/**
 * Galería de fotos históricas de las selecciones a lo largo de los Mundiales.
 *
 * Curaduría editorial. Todas las imágenes están verificadas en Wikimedia
 * Commons con licencia que permite uso comercial (Public Domain o CC BY).
 *
 * Cuando una foto no esté en Commons, se mantiene como TODO en el array.
 * Para añadir nuevas: verificar el archivo con
 *   curl -sIL "https://commons.wikimedia.org/wiki/Special:FilePath/<filename>"
 * y comprobar la licencia en la página File: del archivo.
 */

export type GalleryPhotoType =
  | 'squad' // Foto de equipo (alineación)
  | 'champion' // Celebración con copa
  | 'action' // Jugada o partido
  | 'venue' // Estadio
  | 'trophy' // Trofeo o ceremonia
  | 'portrait'; // Retrato de jugador

export type GalleryEra =
  | '1930s'
  | '1940s'
  | '1950s'
  | '1960s'
  | '1970s'
  | '1980s'
  | '1990s'
  | '2000s'
  | '2010s'
  | '2020s';

export type GalleryPhoto = {
  id: string;
  /** URL Wikimedia Special:FilePath (resuelve siempre al thumb correcto) */
  url: string;
  /** Alt text descriptivo para a11y y SEO */
  alt: string;
  /** Año del Mundial al que pertenece (o más cercano) */
  year: number;
  /** Slug del Mundial; null si la foto no está atada a una edición concreta */
  editionSlug: string | null;
  /** Código de selección protagonista (ARG, BRA…); null si no aplica */
  teamCode: string | null;
  /** Década */
  era: GalleryEra;
  /** Categoría para filtrado */
  type: GalleryPhotoType;
  /** Descripción/leyenda de 1-2 líneas */
  caption: string;
  /** Atribución del autor */
  credit: string;
  /** Licencia (PD, CC BY, CC BY-SA…) */
  license: string;
  /** URL a la página de origen Wikimedia */
  sourceUrl: string;
};

export const ERA_LABELS: Record<GalleryEra, string> = {
  '1930s': 'Años 30',
  '1940s': 'Años 40',
  '1950s': 'Años 50',
  '1960s': 'Años 60',
  '1970s': 'Años 70',
  '1980s': 'Años 80',
  '1990s': 'Años 90',
  '2000s': 'Años 2000',
  '2010s': 'Años 2010',
  '2020s': 'Años 2020',
};

export const TYPE_LABELS: Record<GalleryPhotoType, string> = {
  squad: 'Equipo',
  champion: 'Campeones',
  action: 'Acción',
  venue: 'Estadios',
  trophy: 'Trofeo',
  portrait: 'Retratos',
};

const wm = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=1200`;
const wmSrc = (filename: string) =>
  `https://commons.wikimedia.org/wiki/File:${filename}`;

export const GALLERY: GalleryPhoto[] = [
  // ─── 1930 Uruguay ─────────────────────────────────────────────
  {
    id: '1930-trophy-handover',
    url: wm('Rimet_y_Jude,_Los_Sports,_1930-07-18_(384).jpg'),
    alt: 'Jules Rimet entrega la primera Copa del Mundo a Raúl Jude tras la final del Mundial de Uruguay 1930',
    year: 1930,
    editionSlug: '1930-uruguay',
    teamCode: 'URU',
    era: '1930s',
    type: 'trophy',
    caption: 'La primera Copa del Mundo. Jules Rimet entrega el trofeo en Montevideo, julio 1930.',
    credit: 'Revista Los Sports (Chile)',
    license: 'Dominio público',
    sourceUrl: wmSrc('Rimet_y_Jude,_Los_Sports,_1930-07-18_(384).jpg'),
  },
  {
    id: '1930-centenario',
    url: wm('Estadio_Centenario_1930.jpg'),
    alt: 'Estadio Centenario de Montevideo durante el Mundial de Uruguay 1930',
    year: 1930,
    editionSlug: '1930-uruguay',
    teamCode: null,
    era: '1930s',
    type: 'venue',
    caption: 'Estadio Centenario de Montevideo, sede de la primera final mundialista.',
    credit: 'Wikimedia Commons',
    license: 'Dominio público',
    sourceUrl: wmSrc('Estadio_Centenario_1930.jpg'),
  },

  // ─── 1950 Brasil, Maracanazo ────────────────────────────────
  {
    id: '1950-varela',
    url: wm('Obdulio_Varela,_Estadio,_1950-07-15_(374).jpg'),
    alt: 'Obdulio Varela, capitán de Uruguay en el Maracanazo, retratado el 15 de julio de 1950',
    year: 1950,
    editionSlug: '1950-brasil',
    teamCode: 'URU',
    era: '1950s',
    type: 'portrait',
    caption: 'Obdulio Varela, el «Negro Jefe» que lideró a Uruguay al Maracanazo.',
    credit: 'Revista Estadio (Santiago, Zig-Zag)',
    license: 'Dominio público',
    sourceUrl: wmSrc('Obdulio_Varela,_Estadio,_1950-07-15_(374).jpg'),
  },
  {
    id: '1950-trophy',
    url: wm('Coupe_Jules_Rimet_-_1930-1970.jpg'),
    alt: 'Coupe Jules Rimet, trofeo oficial de la Copa del Mundo entre 1930 y 1970',
    year: 1950,
    editionSlug: null,
    teamCode: null,
    era: '1950s',
    type: 'trophy',
    caption: 'La Coupe Jules Rimet. Trofeo de los Mundiales hasta 1970, robada en 1983 y nunca recuperada.',
    credit: 'Wikimedia Commons',
    license: 'Dominio público',
    sourceUrl: wmSrc('Coupe_Jules_Rimet_-_1930-1970.jpg'),
  },

  // ─── 1958 Suecia, irrupción de Pelé ─────────────────────────
  {
    id: '1958-pele',
    url: wm('Pele_con_brasil_(cropped).jpg'),
    alt: 'Pelé con la selección brasileña, foto de la era de los Mundiales 1958-1970',
    year: 1958,
    editionSlug: '1958-suecia',
    teamCode: 'BRA',
    era: '1950s',
    type: 'portrait',
    caption: 'Pelé con la selección brasileña. A los 17 años ya era campeón del mundo en Suecia 1958.',
    credit: 'El Gráfico',
    license: 'Dominio público',
    sourceUrl: wmSrc('Pele_con_brasil_(cropped).jpg'),
  },

  // ─── 1970 México, Brasil eterno ─────────────────────────────
  {
    id: '1970-carlos-alberto',
    url: wm('Carlos_Alberto_1970.jpg'),
    alt: 'Carlos Alberto Torres, capitán de Brasil 1970, autor del cuarto gol de la final contra Italia',
    year: 1970,
    editionSlug: '1970-mexico',
    teamCode: 'BRA',
    era: '1970s',
    type: 'portrait',
    caption: 'Carlos Alberto Torres, capitán del Brasil tricampeón. Marcó el cuarto en la final, mejor gol colectivo de la historia.',
    credit: 'Wikimedia Commons',
    license: 'Dominio público',
    sourceUrl: wmSrc('Carlos_Alberto_1970.jpg'),
  },
  {
    id: '1970-azteca',
    url: wm('Estadio_Azteca.jpg'),
    alt: 'Estadio Azteca de Ciudad de México, sede de la final del Mundial 1970, 1986 y 2026',
    year: 1970,
    editionSlug: '1970-mexico',
    teamCode: null,
    era: '1970s',
    type: 'venue',
    caption: 'Estadio Azteca. Sede de las finales de 1970, 1986 y de la inauguración del Mundial 2026.',
    credit: 'Aalizul / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: wmSrc('Estadio_Azteca.jpg'),
  },

  // ─── 1972, Alemania, antesala del 74 ────────────────────────
  {
    id: '1972-beckenbauer',
    url: wm('Franz_Beckenbauer_1972.jpg'),
    alt: 'Franz Beckenbauer, capitán de Alemania Occidental durante la Eurocopa 1972',
    year: 1974,
    editionSlug: '1974-alemania',
    teamCode: 'DEU',
    era: '1970s',
    type: 'portrait',
    caption: 'Franz Beckenbauer, capitán de Alemania Occidental. Eurocampeón 1972 y campeón del mundo 1974.',
    credit: 'Bundesarchiv',
    license: 'CC BY-SA 3.0',
    sourceUrl: wmSrc('Franz_Beckenbauer_1972.jpg'),
  },
  {
    id: '1974-cruyff',
    url: wm('Johan_Cruyff_1975.jpg'),
    alt: 'Johan Cruyff retratado en 1975, en su etapa final como jugador del FC Barcelona',
    year: 1974,
    editionSlug: '1974-alemania',
    teamCode: 'NED',
    era: '1970s',
    type: 'portrait',
    caption: 'Johan Cruyff, capitán de la Naranja Mecánica que perdió la final del Mundial 74 en Múnich.',
    credit: 'Micivek / Wikimedia Commons',
    license: 'CC BY 4.0',
    sourceUrl: wmSrc('Johan_Cruyff_1975.jpg'),
  },

  // ─── 1986 México, Maradona ──────────────────────────────────
  {
    id: '1986-maradona-cup',
    url: wm('Maradona-Mundial_86_con_la_copa.JPG'),
    alt: 'Diego Maradona levanta la Copa del Mundo en el Estadio Azteca, 29 de junio de 1986',
    year: 1986,
    editionSlug: '1986-mexico',
    teamCode: 'ARG',
    era: '1980s',
    type: 'champion',
    caption: 'Diego Maradona levanta la copa en el Azteca, 29 jun 1986. Argentina campeona.',
    credit: 'El Gráfico',
    license: 'Dominio público',
    sourceUrl: wmSrc('Maradona-Mundial_86_con_la_copa.JPG'),
  },
  {
    id: '1986-maradona-young',
    url: wm('Maradona_diario_cronica_1971_copia.jpg'),
    alt: 'Maradona niño con un balón, captado por el diario Crónica en 1971',
    year: 1986,
    editionSlug: '1986-mexico',
    teamCode: 'ARG',
    era: '1970s',
    type: 'portrait',
    caption: 'Maradona con 11 años en el diario Crónica, noviembre 1971. La promesa.',
    credit: 'Diario Crónica',
    license: 'Dominio público',
    sourceUrl: wmSrc('Maradona_diario_cronica_1971_copia.jpg'),
  },

  // ─── 1986/1990, Lineker ─────────────────────────────────────
  {
    id: '1990-lineker',
    url: wm('Gary_Lineker_(cropped).jpg'),
    alt: 'Retrato de Gary Lineker, exdelantero de la selección inglesa',
    year: 1990,
    editionSlug: '1990-italia',
    teamCode: 'ENG',
    era: '1990s',
    type: 'portrait',
    caption: 'Gary Lineker, máximo goleador del Mundial 86 y autor de la profecía sobre Alemania.',
    credit: 'Liton Ali',
    license: 'CC BY 2.0',
    sourceUrl: wmSrc('Gary_Lineker_(cropped).jpg'),
  },

  // ─── 2010 Sudáfrica, España campeona ────────────────────────
  {
    id: '2010-spain-cup',
    url: wm('FIFA_World_Cup_2010_Spain_with_cup.jpg'),
    alt: 'Selección española celebra su primera Copa del Mundo en Sudáfrica 2010',
    year: 2010,
    editionSlug: '2010-sudafrica',
    teamCode: 'ESP',
    era: '2010s',
    type: 'champion',
    caption: 'España campeona del mundo. Soccer City, Johannesburgo, 11 julio 2010.',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA',
    sourceUrl: wmSrc('FIFA_World_Cup_2010_Spain_with_cup.jpg'),
  },
  {
    id: '2010-mbombela',
    url: wm('Mbombela_Stadium_aerial_view.jpg'),
    alt: 'Vista aérea del Mbombela Stadium de Nelspruit, sede del Mundial 2010',
    year: 2010,
    editionSlug: '2010-sudafrica',
    teamCode: null,
    era: '2010s',
    type: 'venue',
    caption: 'Mbombela Stadium, Nelspruit. Una de las 10 sedes de Sudáfrica 2010.',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA',
    sourceUrl: wmSrc('Mbombela_Stadium_aerial_view.jpg'),
  },
  {
    id: '2010-algeria-usa',
    url: wm("2010_FIFA_World_Cup_South_Africa_Algeria_Vs_USA.jpg"),
    alt: 'Argelia contra Estados Unidos en la fase de grupos del Mundial Sudáfrica 2010',
    year: 2010,
    editionSlug: '2010-sudafrica',
    teamCode: 'USA',
    era: '2010s',
    type: 'action',
    caption: 'Argelia-Estados Unidos en la fase de grupos. Mundial Sudáfrica 2010.',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA',
    sourceUrl: wmSrc("2010_FIFA_World_Cup_South_Africa_Algeria_Vs_USA.jpg"),
  },

  // ─── 2014 Brasil, Mineirazo y Maracaná ──────────────────────
  {
    id: '2014-mineirao',
    url: wm('Mineirão_2014.jpg'),
    alt: 'Estadio Mineirão de Belo Horizonte, escenario del 7-1 de Alemania a Brasil',
    year: 2014,
    editionSlug: '2014-brasil',
    teamCode: 'BRA',
    era: '2010s',
    type: 'venue',
    caption: 'El Mineirão, Belo Horizonte. Brasil 1-7 Alemania, semifinal del 8 julio 2014.',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA',
    sourceUrl: wmSrc('Mineirão_2014.jpg'),
  },
  {
    id: '2014-maracana',
    url: wm('Maracanã_2014_b.jpg'),
    alt: 'Estadio Maracaná de Río de Janeiro reformado para el Mundial 2014',
    year: 2014,
    editionSlug: '2014-brasil',
    teamCode: null,
    era: '2010s',
    type: 'venue',
    caption: 'Maracaná, Río de Janeiro. Sede de la final entre Alemania y Argentina, 13 julio 2014.',
    credit: 'Daniel Basil',
    license: 'CC BY 3.0 BR',
    sourceUrl: wmSrc('Maracanã_2014_b.jpg'),
  },

  // ─── 2018 Rusia, Messi ──────────────────────────────────────
  {
    id: '2018-messi',
    url: wm('Lionel_Messi_2018.jpg'),
    alt: 'Lionel Messi con la selección argentina durante el Mundial de Rusia 2018',
    year: 2018,
    editionSlug: '2018-rusia',
    teamCode: 'ARG',
    era: '2010s',
    type: 'action',
    caption: 'Messi en Rusia 2018. Argentina cayó en octavos contra Francia.',
    credit: 'Ekaterina Laut · soccer.ru',
    license: 'CC BY-SA 3.0',
    sourceUrl: wmSrc('Lionel_Messi_2018.jpg'),
  },

  // ─── Pre-Mundial / contexto histórico ────────────────────────
  {
    id: 'maradona-1972-juniors',
    url: wm('Maradona_con_equipo_argentinos_jrs_1972.jpg'),
    alt: 'Diego Maradona con el primer equipo de Argentinos Juniors, 1972',
    year: 1986,
    editionSlug: null,
    teamCode: 'ARG',
    era: '1970s',
    type: 'squad',
    caption: 'Maradona con Argentinos Juniors, 1972. Catorce años antes de la Copa.',
    credit: 'Recuerdos de Buenos Aires',
    license: 'Dominio público',
    sourceUrl: wmSrc('Maradona_con_equipo_argentinos_jrs_1972.jpg'),
  },
];

// ─── Utilidades ───────────────────────────────────────────────────

export function getPhotoById(id: string): GalleryPhoto | undefined {
  return GALLERY.find((p) => p.id === id);
}

export function getPhotosByEdition(editionSlug: string): GalleryPhoto[] {
  return GALLERY.filter((p) => p.editionSlug === editionSlug);
}

export function getPhotosByTeam(teamCode: string): GalleryPhoto[] {
  return GALLERY.filter((p) => p.teamCode === teamCode);
}

export function getPhotosByEra(era: GalleryEra): GalleryPhoto[] {
  return GALLERY.filter((p) => p.era === era);
}

export function getPhotosByType(type: GalleryPhotoType): GalleryPhoto[] {
  return GALLERY.filter((p) => p.type === type);
}

/** Lista única de selecciones que aparecen en la galería */
export function getTeamCodesWithPhotos(): string[] {
  return Array.from(
    new Set(GALLERY.map((p) => p.teamCode).filter((c): c is string => !!c)),
  ).sort();
}

/** Lista única de eras presentes (en orden cronológico) */
export function getErasWithPhotos(): GalleryEra[] {
  const all: GalleryEra[] = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
  return all.filter((e) => GALLERY.some((p) => p.era === e));
}

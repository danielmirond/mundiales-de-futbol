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
  /** Slug interno (no usado en URL ahora; reservado para futura `/noticias/[slug]`). */
  slug: string;
  /** Título publicado por el medio (citamos textual). */
  title: string;
  /** Resumen editorial propio en español, 40-60 palabras. */
  summary: string;
  /** Categoría para filtrado. */
  category: NewsCategory;
  /** Nombre del medio fuente. */
  sourceName: string;
  /** URL del artículo original. */
  sourceUrl: string;
  /** Idioma del medio (no del resumen, que es ES). */
  sourceLang: 'es' | 'en' | 'pt' | 'fr';
  /** Fecha de publicación original (ISO 8601). */
  publishedAt: string;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: 'panini-album-mundial-2026-980-cromos-salida-30-abril',
    title:
      '980 cromos, 112 páginas y casi 1.000 € para completar el álbum del Mundial 2026',
    summary:
      'Panini lanza la mayor colección oficial de su historia: 980 cromos repartidos en 112 páginas con 68 especiales en material premium. Salida el 30 abril en España y USA, 2 mayo en Latinoamérica. Completarlo entero ronda los 800-1.200 € sin intercambios.',
    category: 'panini',
    sourceName: 'Huffington Post España',
    sourceUrl:
      'https://www.huffingtonpost.es/deporte/980-cromos-112-paginas-1000-euros-completar-album-mundial-2026-lamine-yamal-messi-costara-tres-cuartas-partes-smi-f202604.html',
    sourceLang: 'es',
    publishedAt: '2026-04-30T08:00:00+00:00',
  },
  {
    slug: 'neymar-omitido-album-panini-mundial-2026',
    title:
      'Neymar, fuera del álbum Panini global del Mundial 2026',
    summary:
      'La versión global del álbum oficial Panini omite a Neymar. Panini cita las listas filtradas del cuerpo técnico de Carlo Ancelotti, que confirma su convocatoria definitiva el 18 de mayo. La ausencia ha disparado la demanda anticipada de cualquier eventual cromo regional.',
    category: 'panini',
    sourceName: 'OneFootball',
    sourceUrl:
      'https://onefootball.com/en/news/neymar-omitted-from-2026-world-cup-sticker-album-as-panini-confirms-global-version-42771577',
    sourceLang: 'en',
    publishedAt: '2026-04-30T17:00:00+00:00',
  },
  {
    slug: 'love-always-wins-emilio-estefan-cancion-oficial-mundial-2026',
    title:
      'Emilio Estefan presenta «Love Always Wins», canción oficial del Mundial 2026',
    summary:
      'El productor cubano-estadounidense presenta el álbum musical oficial del Mundial 2026 con la canción principal «Love Always Wins». Es la primera vez que el lanzamiento de los cromos Panini y de la banda sonora oficial coinciden en la misma semana, una operación dirigida al público latino primario del torneo.',
    category: 'ceremonia',
    sourceName: 'La Vanguardia',
    sourceUrl:
      'https://www.lavanguardia.com/gente/20260501/11527408/emilio-estefan-presenta-love-always-wins-cancion-album-musical-mundial-2026.amp.html',
    sourceLang: 'es',
    publishedAt: '2026-05-01T10:00:00+00:00',
  },
  {
    slug: 'escocia-vuelve-album-panini-mundial-2026',
    title:
      'Escocia regresa al álbum Panini tras varias ediciones de ausencia',
    summary:
      'La selección escocesa vuelve a aparecer en una colección oficial Panini del Mundial tras varios torneos sin clasificar. La afición escocesa ha agotado las primeras tiradas del álbum disponibles en WHSmith y Tesco en sus primeras 24 horas a la venta.',
    category: 'panini',
    sourceName: 'The Scotsman',
    sourceUrl:
      'https://www.scotsman.com/sport/football/international/panini-world-cup-2026-sticker-album-released-as-scotland-return-to-collection-heres-everything-you-need-to-know-8290414',
    sourceLang: 'en',
    publishedAt: '2026-04-30T14:00:00+00:00',
  },
  {
    slug: 'fechas-fifa-listas-mundial-2026-11-mayo-1-junio',
    title:
      'FIFA fija el calendario de listas: provisional el 11 mayo, definitiva el 1 junio',
    summary:
      'El reglamento oficial del Mundial 2026 establece dos plazos. Las 48 selecciones envían a FIFA su lista provisional (35-55 jugadores, no pública) el 11 de mayo, y la definitiva (23-26 jugadores con 3 porteros obligatorios) el 1 de junio. Tras el primer partido, no hay sustituciones.',
    category: 'convocatorias',
    sourceName: 'FIFA Regulations',
    sourceUrl: 'https://www.fifa.com',
    sourceLang: 'en',
    publishedAt: '2026-04-29T09:00:00+00:00',
  },
  {
    slug: 'coca-cola-12-cromos-exclusivos-panini-mundial-2026',
    title:
      'Coca-Cola incluirá 12 cromos exclusivos del Mundial 2026 en sus etiquetas',
    summary:
      'A partir de mediados de mayo, Coca-Cola distribuirá 12 cromos exclusivos del álbum Panini Mundial 2026 dentro de etiquetas de botellas seleccionadas en más de 20 países. Es la única forma de completar la doble página dedicada al patrocinador sin pasar por mercado secundario.',
    category: 'patrocinios',
    sourceName: 'Sports Illustrated',
    sourceUrl:
      'https://www.si.com/soccer/2026-world-cup-sticker-album-what-when-comes-out-where-buy-how-works',
    sourceLang: 'en',
    publishedAt: '2026-04-30T16:00:00+00:00',
  },
  {
    slug: 'ancelotti-confirma-lista-brasil-mundial-2026-18-mayo',
    title:
      'Ancelotti dará la lista definitiva de Brasil para el Mundial 2026 el 18 de mayo',
    summary:
      'El seleccionador italiano confirma que anunciará los 26 nombres convocados de Brasil el 18 de mayo desde la Granja Comary. Es la fecha que Panini ha citado tras el revuelo de la omisión de Neymar en el álbum oficial. La lista se publicará tras el último fin de semana de la liga europea.',
    category: 'convocatorias',
    sourceName: 'CBF / Globo Esporte',
    sourceUrl: 'https://www.cbf.com.br',
    sourceLang: 'pt',
    publishedAt: '2026-04-29T18:00:00+00:00',
  },
  {
    slug: 'phase-4-fifa-tickets-mundial-2026-abierta',
    title:
      'FIFA abre la fase 4 de venta de entradas del Mundial 2026 hasta la final',
    summary:
      'La cuarta y última fase de venta oficial está activa desde el 1 de abril en fifa.com/tickets. Compra inmediata sin sorteo, hasta agotar disponibilidad o hasta el 19 de julio (final). Categoría 3 desde 120 $; final desde 1.490 $ para Cat 3 y hasta 7.875 $ Cat 1.',
    category: 'entradas',
    sourceName: 'FIFA Tickets',
    sourceUrl: 'https://www.fifa.com/tickets',
    sourceLang: 'en',
    publishedAt: '2026-04-25T10:00:00+00:00',
  },
  {
    slug: 'estadio-azteca-renombrado-mexico-city-stadium-fifa',
    title:
      'FIFA renombra el Estadio Azteca como «Mexico City Stadium» durante el Mundial',
    summary:
      'Por la prohibición FIFA de patrocinios externos en sus torneos, el actual Estadio Banorte (ex-Azteca) será conocido oficialmente como «Mexico City Stadium» durante el Mundial 2026. El estadio acoge el partido inaugural el 11 de junio entre México y Sudáfrica a las 13:00 hora local.',
    category: 'sedes',
    sourceName: 'Wikipedia · 2026 FIFA World Cup',
    sourceUrl: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
    sourceLang: 'en',
    publishedAt: '2026-04-28T12:00:00+00:00',
  },
  {
    slug: 'rtve-confirma-mundial-2026-en-abierto-mediapro',
    title:
      'RTVE confirma que emitirá el Mundial 2026 en abierto vía acuerdo con Mediapro',
    summary:
      'La televisión pública española cierra el acuerdo con Mediapro y emitirá el partido inaugural, los tres partidos de España, un partido más por jornada de fase de grupos, los octavos, los cuartos, las dos semifinales y la final. La señal estará en La 1 y RTVE Play sin coste.',
    category: 'tv',
    sourceName: 'eldiario.es / Vertele',
    sourceUrl: 'https://www.eldiario.es/vertele',
    sourceLang: 'es',
    publishedAt: '2026-02-15T09:00:00+00:00',
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

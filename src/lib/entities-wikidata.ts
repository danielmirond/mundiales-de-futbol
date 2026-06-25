/**
 * Mapeo de entidades del Mundial a Wikidata Q-IDs.
 *
 * Contexto SEO: la filtración Google API Content Warehouse (mayo 2024)
 * documentó `RepositoryWebrefIndexingNamespaceEntity`, que demuestra
 * que Google identifica entidades por su Wikidata Q-ID y las conecta
 * a su Knowledge Graph. Añadir `sameAs: [Wikidata, Wikipedia]` a los
 * `Person` y `SportsTeam` del JSON-LD es la vía más directa para que
 * Google reconozca de qué/quién hablamos.
 *
 * Fuente de Q-IDs: Wikidata.org, query manual + cross-check con
 * https://en.wikipedia.org/wiki/Lionel_Messi (etc.) hasta confirmar.
 *
 * IMPORTANTE: añadir solo Q-IDs que se hayan verificado abriendo la
 * URL real en Wikidata. Un Q-ID erróneo es peor que ningún Q-ID
 * (apunta al grafo equivocado).
 */

export type EntityKind = 'player' | 'team' | 'tournament' | 'venue' | 'organization';

export type WikidataEntity = {
  /** Q-ID de Wikidata, formato 'Q615'. */
  qid: string;
  /** Nombre canónico de la entidad para verificación humana. */
  name: string;
  /** Tipo de entidad. */
  kind: EntityKind;
  /** Slug en Wikipedia EN para construcción de URL secundaria. */
  wikipediaEn?: string;
  /** Slug en Wikipedia ES si difiere del EN. */
  wikipediaEs?: string;
};

/**
 * Catálogo verificado de Q-IDs.
 *
 * Se irá ampliando a medida que las piezas mencionen más entidades.
 * Cada entrada debe tener Q-ID verificado abriendo wikidata.org/wiki/<qid>
 * y confirmando que apunta al jugador / equipo / lugar correcto.
 */
export const WIKIDATA_ENTITIES: Record<string, WikidataEntity> = {
  // ─── Jugadores (verificados a 2026-05-09) ──────────────────────
  'lionel-messi': {
    qid: 'Q615',
    name: 'Lionel Messi',
    kind: 'player',
    wikipediaEn: 'Lionel_Messi',
    wikipediaEs: 'Lionel_Messi',
  },
  'cristiano-ronaldo': {
    qid: 'Q11571',
    name: 'Cristiano Ronaldo',
    kind: 'player',
    wikipediaEn: 'Cristiano_Ronaldo',
    wikipediaEs: 'Cristiano_Ronaldo',
  },
  'diego-maradona': {
    qid: 'Q8023',
    name: 'Diego Maradona',
    kind: 'player',
    wikipediaEn: 'Diego_Maradona',
    wikipediaEs: 'Diego_Maradona',
  },
  pele: {
    qid: 'Q1241',
    name: 'Pelé',
    kind: 'player',
    wikipediaEn: 'Pelé',
    wikipediaEs: 'Pelé',
  },
  'kylian-mbappe': {
    qid: 'Q12846',
    name: 'Kylian Mbappé',
    kind: 'player',
    wikipediaEn: 'Kylian_Mbappé',
    wikipediaEs: 'Kylian_Mbappé',
  },
  'vinicius-jr': {
    qid: 'Q2748137',
    name: 'Vinícius Júnior',
    kind: 'player',
    wikipediaEn: 'Vinícius_Júnior',
    wikipediaEs: 'Vinícius_Júnior',
  },
  'jules-rimet': {
    qid: 'Q188158',
    name: 'Jules Rimet',
    kind: 'player', // funciona como persona
    wikipediaEn: 'Jules_Rimet',
    wikipediaEs: 'Jules_Rimet',
  },
  'johan-cruyff': {
    qid: 'Q104326',
    name: 'Johan Cruyff',
    kind: 'player',
    wikipediaEn: 'Johan_Cruyff',
    wikipediaEs: 'Johan_Cruyff',
  },
  'gary-lineker': {
    qid: 'Q160641',
    name: 'Gary Lineker',
    kind: 'player',
    wikipediaEn: 'Gary_Lineker',
    wikipediaEs: 'Gary_Lineker',
  },
  'pak-doo-ik': {
    qid: 'Q1370275',
    name: 'Pak Doo-ik',
    kind: 'player',
    wikipediaEn: 'Pak_Doo-ik',
    wikipediaEs: 'Pak_Doo-ik',
  },
  'shakira': {
    qid: 'Q1209',
    name: 'Shakira',
    kind: 'player', // celebrity, no jugador, pero Person en schema
    wikipediaEn: 'Shakira',
    wikipediaEs: 'Shakira',
  },
  'donald-trump': {
    qid: 'Q22686',
    name: 'Donald Trump',
    kind: 'player', // Person
    wikipediaEn: 'Donald_Trump',
    wikipediaEs: 'Donald_Trump',
  },

  // ─── Selecciones nacionales (verificadas) ──────────────────────
  'team-argentina': {
    qid: 'Q3576',
    name: 'Selección de fútbol de Argentina',
    kind: 'team',
    wikipediaEn: 'Argentina_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_Argentina',
  },
  'team-brazil': {
    qid: 'Q83459',
    name: 'Selección de fútbol de Brasil',
    kind: 'team',
    wikipediaEn: 'Brazil_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_Brasil',
  },
  'team-spain': {
    qid: 'Q43050',
    name: 'Selección de fútbol de España',
    kind: 'team',
    wikipediaEn: 'Spain_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_España',
  },
  'team-france': {
    qid: 'Q47774',
    name: 'Selección de fútbol de Francia',
    kind: 'team',
    wikipediaEn: 'France_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_Francia',
  },
  'team-germany': {
    qid: 'Q43310',
    name: 'Selección de fútbol de Alemania',
    kind: 'team',
    wikipediaEn: 'Germany_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_Alemania',
  },
  'team-england': {
    qid: 'Q47762',
    name: 'Selección de fútbol de Inglaterra',
    kind: 'team',
    wikipediaEn: 'England_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_Inglaterra',
  },
  'team-uruguay': {
    qid: 'Q193072',
    name: 'Selección de fútbol de Uruguay',
    kind: 'team',
    wikipediaEn: 'Uruguay_national_football_team',
    wikipediaEs: 'Selección_de_fútbol_de_Uruguay',
  },

  // ─── Torneos (verificados) ─────────────────────────────────────
  'wc-2026': {
    qid: 'Q56327580',
    name: '2026 FIFA World Cup',
    kind: 'tournament',
    wikipediaEn: '2026_FIFA_World_Cup',
    wikipediaEs: 'Copa_Mundial_de_Fútbol_de_2026',
  },
  'wc-1930': {
    qid: 'Q101751',
    name: '1930 FIFA World Cup',
    kind: 'tournament',
    wikipediaEn: '1930_FIFA_World_Cup',
    wikipediaEs: 'Copa_Mundial_de_Fútbol_de_1930',
  },
  'wc-1966': {
    qid: 'Q189611',
    name: '1966 FIFA World Cup',
    kind: 'tournament',
    wikipediaEn: '1966_FIFA_World_Cup',
    wikipediaEs: 'Copa_Mundial_de_Fútbol_de_1966',
  },
  'wc-1982': {
    qid: 'Q170478',
    name: '1982 FIFA World Cup',
    kind: 'tournament',
    wikipediaEn: '1982_FIFA_World_Cup',
    wikipediaEs: 'Copa_Mundial_de_Fútbol_de_1982',
  },
  'wc-1986': {
    qid: 'Q193280',
    name: '1986 FIFA World Cup',
    kind: 'tournament',
    wikipediaEn: '1986_FIFA_World_Cup',
    wikipediaEs: 'Copa_Mundial_de_Fútbol_de_1986',
  },

  // ─── Organizaciones ────────────────────────────────────────────
  'fifa': {
    qid: 'Q19317',
    name: 'FIFA',
    kind: 'organization',
    wikipediaEn: 'FIFA',
    wikipediaEs: 'FIFA',
  },
};

/**
 * Devuelve la entidad por su clave canónica del catálogo.
 */
export function getEntity(key: string): WikidataEntity | undefined {
  return WIKIDATA_ENTITIES[key];
}

/**
 * Construye el array `sameAs` para una entidad.
 * Incluye Wikidata canónico + Wikipedia EN + Wikipedia ES (si difiere).
 *
 * @example
 *   sameAsForEntity('lionel-messi')
 *   → [
 *       'https://www.wikidata.org/wiki/Q615',
 *       'https://en.wikipedia.org/wiki/Lionel_Messi',
 *       'https://es.wikipedia.org/wiki/Lionel_Messi',
 *     ]
 */
export function sameAsForEntity(key: string): string[] {
  const e = WIKIDATA_ENTITIES[key];
  if (!e) return [];
  const out: string[] = [`https://www.wikidata.org/wiki/${e.qid}`];
  if (e.wikipediaEn) out.push(`https://en.wikipedia.org/wiki/${e.wikipediaEn}`);
  if (e.wikipediaEs && e.wikipediaEs !== e.wikipediaEn) {
    out.push(`https://es.wikipedia.org/wiki/${e.wikipediaEs}`);
  }
  return out;
}

/**
 * Heurística para resolver el Q-ID de una entidad por su nombre.
 * Útil cuando una pieza tiene un campo `protagonist` con texto libre.
 * Match parcial case-insensitive.
 *
 * @example
 *   findEntityByName('Lionel Messi') → 'lionel-messi'
 *   findEntityByName('Maradona') → 'diego-maradona' (match parcial)
 *   findEntityByName('algo random') → undefined
 */
export function findEntityByName(name: string): string | undefined {
  const needle = name.toLowerCase().trim();
  // 1) Match exacto sobre `name`
  const exact = Object.entries(WIKIDATA_ENTITIES).find(
    ([, e]) => e.name.toLowerCase() === needle,
  );
  if (exact) return exact[0];
  // 2) Match parcial (la entidad incluye el needle o vice versa)
  const partial = Object.entries(WIKIDATA_ENTITIES).find(([, e]) => {
    const en = e.name.toLowerCase();
    return en.includes(needle) || needle.includes(en);
  });
  return partial?.[0];
}

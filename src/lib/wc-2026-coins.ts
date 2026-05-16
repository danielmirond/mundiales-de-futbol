/**
 * Datos centralizados del cluster `/coleccionismo/monedas-mundial-2026`.
 *
 * Tres países anfitriones, tres bancos centrales emitiendo monedas
 * conmemorativas:
 *   - México: Banxico (Banco de México) + Casa de Moneda de México
 *   - Canadá: Royal Canadian Mint
 *   - USA: US Mint (pendiente confirmación de emisión)
 *
 * Fuentes:
 *   - Banxico (13 may 2026): https://www.banxico.org.mx/
 *   - Royal Canadian Mint (14 may 2026): https://www.mint.ca/
 *   - El Financiero, La Jornada, Reforma, Mercado Negro
 *
 * Last review: 16 mayo 2026.
 */

export type CoinEdition = {
  id: string;
  /** Nombre human-readable */
  name: string;
  /** Banco emisor */
  issuer: string;
  /** País emisor */
  countryCode: 'MEX' | 'CAN' | 'USA';
  /** Tipo de metal */
  metal: 'bimetalica' | 'plata' | 'oro' | 'aleacion';
  /** Valor facial */
  faceValue: number;
  /** Moneda (MXN, CAD, USD) */
  currency: 'MXN' | 'CAD' | 'USD';
  /** Precio aproximado de mercado (puede ser mayor al facial para plata/oro/coleccionables) */
  marketPriceUsd?: number;
  /** Tirada en unidades */
  mintageUnits: number;
  /** Ciudad sede o tema (Ángel de la Independencia, Minerva, etc.) */
  theme: string;
  /** Diseño descriptivo */
  designDescription: string;
  /** Fecha de circulación ISO */
  releaseDate: string;
};

// ───────────────────────────────────────────────────────────────────
// México · 12 monedas Banxico
// ───────────────────────────────────────────────────────────────────

export const COINS_MEXICO: CoinEdition[] = [
  // 4 bimetálicas $20 (cuño corriente) - una por cada ciudad sede + México
  {
    id: 'mex-cdmx-bimetalica',
    name: 'Monedas $20 · Ciudad de México',
    issuer: 'Banco de México (Banxico)',
    countryCode: 'MEX',
    metal: 'bimetalica',
    faceValue: 20,
    currency: 'MXN',
    mintageUnits: 5_000_000,
    theme: 'Ciudad de México · Ángel de la Independencia',
    designDescription:
      'En el reverso, el Ángel de la Independencia junto a un jugador con balón. Anverso: escudo nacional. Bimetálica (núcleo cuproniquel, anillo aluminio bronce).',
    releaseDate: '2026-05-13',
  },
  {
    id: 'mex-guadalajara-bimetalica',
    name: 'Monedas $20 · Guadalajara',
    issuer: 'Banco de México (Banxico)',
    countryCode: 'MEX',
    metal: 'bimetalica',
    faceValue: 20,
    currency: 'MXN',
    mintageUnits: 5_000_000,
    theme: 'Guadalajara · Diosa Minerva',
    designDescription:
      'En el reverso, la escultura de la diosa Minerva en su glorieta homónima de Guadalajara junto a un balón de fútbol estilizado.',
    releaseDate: '2026-05-13',
  },
  {
    id: 'mex-monterrey-bimetalica',
    name: 'Monedas $20 · Monterrey',
    issuer: 'Banco de México (Banxico)',
    countryCode: 'MEX',
    metal: 'bimetalica',
    faceValue: 20,
    currency: 'MXN',
    mintageUnits: 5_000_000,
    theme: 'Monterrey · Fuente de Crisol + Cerro de la Silla',
    designDescription:
      'En el reverso, la Fuente de Crisol del paseo Santa Lucía con el Cerro de la Silla al fondo y la silueta de un futbolista.',
    releaseDate: '2026-05-13',
  },
  {
    id: 'mex-anfitrion-bimetalica',
    name: 'Monedas $20 · México anfitrión',
    issuer: 'Banco de México (Banxico)',
    countryCode: 'MEX',
    metal: 'bimetalica',
    faceValue: 20,
    currency: 'MXN',
    mintageUnits: 5_000_000,
    theme: 'México · Anfitrión Mundial 2026',
    designDescription:
      'Diseño general de México como país anfitrión, con el escudo del Mundial 2026 + elementos identitarios mexicanos (águila, balón).',
    releaseDate: '2026-05-13',
  },
  // 4 plata $10 (edición limitada)
  {
    id: 'mex-cdmx-plata',
    name: 'Monedas $10 plata · Ciudad de México',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'plata',
    faceValue: 10,
    currency: 'MXN',
    marketPriceUsd: 60,
    mintageUnits: 100_000,
    theme: 'Ciudad de México · Plata fina',
    designDescription:
      'Edición limitada en plata pura ley 0.999 con el diseño dedicado a la Ciudad de México y acabado proof (espejo).',
    releaseDate: '2026-05-15',
  },
  {
    id: 'mex-guadalajara-plata',
    name: 'Monedas $10 plata · Guadalajara',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'plata',
    faceValue: 10,
    currency: 'MXN',
    marketPriceUsd: 60,
    mintageUnits: 100_000,
    theme: 'Guadalajara · Plata fina',
    designDescription:
      'Plata ley 0.999, acabado proof, diseño dedicado a Guadalajara (Minerva + balón).',
    releaseDate: '2026-05-15',
  },
  {
    id: 'mex-monterrey-plata',
    name: 'Monedas $10 plata · Monterrey',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'plata',
    faceValue: 10,
    currency: 'MXN',
    marketPriceUsd: 60,
    mintageUnits: 100_000,
    theme: 'Monterrey · Plata fina',
    designDescription:
      'Plata ley 0.999, acabado proof, diseño dedicado a Monterrey (Fuente de Crisol).',
    releaseDate: '2026-05-15',
  },
  {
    id: 'mex-anfitrion-plata',
    name: 'Monedas $10 plata · México anfitrión',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'plata',
    faceValue: 10,
    currency: 'MXN',
    marketPriceUsd: 60,
    mintageUnits: 100_000,
    theme: 'México · Plata fina',
    designDescription:
      'Plata ley 0.999, acabado proof, diseño general de México anfitrión.',
    releaseDate: '2026-05-15',
  },
  // 4 oro $25
  {
    id: 'mex-cdmx-oro',
    name: 'Monedas $25 oro · Ciudad de México',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'oro',
    faceValue: 25,
    currency: 'MXN',
    marketPriceUsd: 2_500,
    mintageUnits: 5_000,
    theme: 'Ciudad de México · Oro fino',
    designDescription:
      'Oro ley 0.999, peso ½ onza, acabado proof, diseño Ciudad de México. Edición de 5.000 piezas únicamente.',
    releaseDate: '2026-05-15',
  },
  {
    id: 'mex-guadalajara-oro',
    name: 'Monedas $25 oro · Guadalajara',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'oro',
    faceValue: 25,
    currency: 'MXN',
    marketPriceUsd: 2_500,
    mintageUnits: 5_000,
    theme: 'Guadalajara · Oro fino',
    designDescription:
      'Oro ley 0.999, peso ½ onza, proof, diseño Guadalajara.',
    releaseDate: '2026-05-15',
  },
  {
    id: 'mex-monterrey-oro',
    name: 'Monedas $25 oro · Monterrey',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'oro',
    faceValue: 25,
    currency: 'MXN',
    marketPriceUsd: 2_500,
    mintageUnits: 5_000,
    theme: 'Monterrey · Oro fino',
    designDescription: 'Oro ley 0.999, peso ½ onza, proof, diseño Monterrey.',
    releaseDate: '2026-05-15',
  },
  {
    id: 'mex-anfitrion-oro',
    name: 'Monedas $25 oro · México anfitrión',
    issuer: 'Banco de México · Casa de Moneda',
    countryCode: 'MEX',
    metal: 'oro',
    faceValue: 25,
    currency: 'MXN',
    marketPriceUsd: 2_500,
    mintageUnits: 5_000,
    theme: 'México · Oro fino',
    designDescription: 'Oro ley 0.999, peso ½ onza, proof, diseño México anfitrión.',
    releaseDate: '2026-05-15',
  },
];

// ───────────────────────────────────────────────────────────────────
// Canadá · 1 dólar Royal Canadian Mint
// ───────────────────────────────────────────────────────────────────

export const COINS_CANADA: CoinEdition[] = [
  {
    id: 'can-loonie-fwc26',
    name: '$1 CAD · FIFA World Cup 26™',
    issuer: 'Royal Canadian Mint',
    countryCode: 'CAN',
    metal: 'aleacion',
    faceValue: 1,
    currency: 'CAD',
    mintageUnits: 3_000_000,
    theme: 'Loonie conmemorativo · Versión coloreada y tradicional',
    designDescription:
      'Una emisión especial del dólar canadiense (loonie) con motivo del Mundial 2026. Disponible en versión tradicional (sin color) y coloreada. 1.000.000 piezas en versión tradicional + 2.000.000 piezas coloreadas.',
    releaseDate: '2026-05-14',
  },
];

// ───────────────────────────────────────────────────────────────────
// USA · pendiente
// ───────────────────────────────────────────────────────────────────

export const COINS_USA: CoinEdition[] = [];

// ───────────────────────────────────────────────────────────────────
// Compilado
// ───────────────────────────────────────────────────────────────────

export const ALL_COINS: CoinEdition[] = [
  ...COINS_MEXICO,
  ...COINS_CANADA,
  ...COINS_USA,
];

export const CLUSTER_PAGES = [
  {
    slug: '',
    path: '/coleccionismo/monedas-mundial-2026',
    title: 'Monedas conmemorativas Mundial 2026',
    description:
      'Las 13 monedas oficiales emitidas por México (Banxico) y Canadá (Royal Canadian Mint) para el Mundial 2026: diseño, denominación, tirada y dónde comprarlas.',
  },
  {
    slug: 'donde-comprar',
    path: '/coleccionismo/monedas-mundial-2026/donde-comprar',
    title: 'Dónde comprar las monedas del Mundial 2026',
    description:
      'Los canales oficiales para conseguir las monedas conmemorativas del Mundial 2026: bancos comerciales mexicanos, Casa de Moneda de México, Museo Interactivo de Economía (MIDE), Royal Canadian Mint y distribuidores autorizados.',
  },
  {
    slug: 'precio',
    path: '/coleccionismo/monedas-mundial-2026/precio',
    title: 'Precio de las monedas del Mundial 2026',
    description:
      'Precio facial, valor de mercado y revalorización esperada de las 13 monedas conmemorativas del Mundial 2026. Desde $20 MXN (bimetálicas) hasta 2.500 USD (oro fino).',
  },
  {
    slug: 'oro',
    path: '/coleccionismo/monedas-mundial-2026/oro',
    title: 'Monedas de oro Mundial 2026 · Banxico edición $25 MXN',
    description:
      'Las 4 monedas de oro fino ley 0.999 del Banco de México para el Mundial 2026: peso ½ onza, valor facial $25 MXN, tirada limitada de 5.000 piezas por diseño. La opción coleccionista premium.',
  },
  {
    slug: 'plata',
    path: '/coleccionismo/monedas-mundial-2026/plata',
    title: 'Monedas de plata Mundial 2026 · Banxico edición $10 MXN',
    description:
      'Las 4 monedas de plata fina ley 0.999 del Banco de México para el Mundial 2026: acabado proof, valor facial $10 MXN, tirada de 100.000 piezas por diseño dedicadas a CDMX, Guadalajara, Monterrey y México anfitrión.',
  },
  {
    slug: 'banxico',
    path: '/coleccionismo/monedas-mundial-2026/banxico',
    title: 'Monedas Banxico Mundial 2026 · Las 12 piezas oficiales',
    description:
      'Las 12 monedas conmemorativas del Banco de México para el Mundial 2026: 4 bimetálicas $20 MXN, 4 plata $10 MXN y 4 oro $25 MXN. Detalle por diseño, sede y especificación técnica.',
  },
  {
    slug: 'canada',
    path: '/coleccionismo/monedas-mundial-2026/canada',
    title: 'Moneda Canadá Mundial 2026 · Loonie Royal Canadian Mint',
    description:
      'La moneda oficial canadiense del Mundial 2026 emitida por la Royal Canadian Mint: loonie $1 CAD en versión tradicional y coloreada, tirada de 3 millones de piezas. Cómo conseguirla.',
  },
] as const;

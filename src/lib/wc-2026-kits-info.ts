/**
 * Datos centralizados del cluster `/coleccionismo/camisetas-mundial-2026`.
 *
 * Una sola fuente de verdad para las 6 páginas del cluster (pillar + 5
 * sub-páginas). Cuando cambien precios, retailers o detección de
 * falsificaciones, basta con tocar este archivo.
 *
 * Para los datos de marca técnica por selección (48 selecciones × marca),
 * ver `src/lib/team-kit-2026.ts`.
 *
 * Fuentes:
 *  - adidas.com, nike.com, puma.com (RRP oficiales mayo 2026)
 *  - Footy Headlines (tabla precios cruzada)
 *  - Sole Retriever, GOAT (mercado secundario)
 *  - FIFA Tickets Marketplace (camisetas oficiales matchworn)
 *
 * Last review: 14 mayo 2026.
 */

// ───────────────────────────────────────────────────────────────────
// Retailers y afiliación
// ───────────────────────────────────────────────────────────────────

export type Retailer = {
  id: string;
  name: string;
  affiliateNetwork: 'amazon-associates' | 'awin' | 'cj' | 'direct';
  affiliateActive: boolean;
  hub: string;
  description: string;
  pros: string[];
  cons: string[];
  countriesShipping: string[];
  /** Comisión típica en % */
  commissionRange?: [number, number];
};

// Política editorial: solo monetizamos vía Amazon Associates (`nuus-21`).
// No mantenemos CTAs de afiliación a otros retailers, aunque sean oficiales.
export const RETAILERS: Retailer[] = [
  {
    id: 'amazon-es',
    name: 'Amazon España',
    affiliateNetwork: 'amazon-associates',
    affiliateActive: true,
    hub: 'https://www.amazon.es/s?k=camiseta+seleccion+mundial+2026&tag=nuus-21',
    description:
      'Único retailer con afiliación activa en mundiales-de-futbol.com. Marketplace con todas las marcas técnicas (adidas, Nike, Puma) en stock. Envío Prime en 24-48 h dentro de España.',
    pros: [
      'Envío 24-48 h con Prime',
      'Devolución gratuita 30 días',
      'Reseñas verificadas de compradores',
      'Precios competitivos por descuentos puntuales',
      'Marcas técnicas reales en stock (verificar siempre el vendedor)',
    ],
    cons: [
      'Stock variable por talla',
      'Verificar que el vendedor sea Amazon o la marca técnica (evitar réplicas)',
      'Algunos productos de sellers internacionales (revisar plazo y origen)',
    ],
    countriesShipping: ['ES', 'FR', 'IT', 'DE', 'UK', 'PT'],
    commissionRange: [3, 10],
  },
];

// ───────────────────────────────────────────────────────────────────
// Tipos de camiseta y precios
// ───────────────────────────────────────────────────────────────────

export type KitTier = {
  id: 'kid' | 'replica' | 'authentic' | 'match-worn';
  name: string;
  audience: string;
  priceRangeEur: [number, number];
  fabricNotes: string;
  techByBrand: Partial<Record<'adidas' | 'nike' | 'puma', string>>;
  fitNotes: string;
  details: string[];
  goodFor: string[];
  notGoodFor: string[];
};

export const KIT_TIERS: KitTier[] = [
  {
    id: 'kid',
    name: 'Talla niño',
    audience: 'Niños 4-14 años',
    priceRangeEur: [50, 80],
    fabricNotes: 'Réplica simplificada de la versión adulto.',
    techByBrand: {
      adidas: 'AEROREADY (versión light)',
      nike: 'Dri-FIT (versión youth)',
      puma: 'dryCELL básico',
    },
    fitNotes: 'Tallas por edad: 4Y, 6Y, 8Y, 10Y, 12Y, 14Y. Holgada.',
    details: ['Logo cosido o estampado', 'Sin tecnología avanzada', 'Numero y nombre opcional'],
    goodFor: ['Regalo a un niño', 'Uso casual sin uso deportivo intensivo'],
    notGoodFor: ['Coleccionismo serio', 'Reventa futura'],
  },
  {
    id: 'replica',
    name: 'Réplica (Fan)',
    audience: 'Aficionado adulto, uso casual y deportivo light',
    priceRangeEur: [70, 100],
    fabricNotes: 'Poliéster 100% reciclado básico.',
    techByBrand: {
      adidas: 'AEROREADY',
      nike: 'Dri-FIT Stadium',
      puma: 'dryCELL',
    },
    fitNotes: 'Holgado, talla estándar. Manga 1-2 cm más larga que la authentic.',
    details: ['Logo y escudo cosidos', 'Ventilación básica', 'Cuello redondo o V según diseño'],
    goodFor: ['Llevar al estadio', 'Uso diario', 'Regalo'],
    notGoodFor: ['Práctica deportiva intensiva en calor', 'Coleccionismo de alta gama'],
  },
  {
    id: 'authentic',
    name: 'Auténtica (Player Version)',
    audience: 'Coleccionista exigente, jugador competitivo',
    priceRangeEur: [130, 180],
    fabricNotes: 'Poliéster premium reciclado tejido más fino y ligero. Misma que llevan los jugadores en el campo.',
    techByBrand: {
      adidas: 'HEAT.RDY',
      nike: 'Dri-FIT ADV / Vapor',
      puma: 'ULTRAWEAVE',
    },
    fitNotes: 'Slim fit, talla pequeña respecto a réplica. Recomendado bajar 1 talla si no eres delgado.',
    details: ['Logo prensado en caliente (no cosido)', 'Costuras planas', 'Cuello reforzado y ergonómico', 'Etiquetas internas mínimas', 'Tejido perforado en zonas de transpiración'],
    goodFor: ['Práctica deportiva en calor', 'Coleccionismo', 'Foto profesional', 'Reventa futura'],
    notGoodFor: ['Aficionado casual', 'Niños', 'Tallaje generoso'],
  },
  {
    id: 'match-worn',
    name: 'Match Worn',
    audience: 'Coleccionista premium / institucional',
    priceRangeEur: [3000, 50000],
    fabricNotes: 'Camiseta usada por un jugador en partido oficial. Mercado secundario exclusivamente.',
    techByBrand: {
      adidas: 'HEAT.RDY + parche FIFA + dorsal personalizado',
      nike: 'Match Authentic ADV + parche FIFA',
      puma: 'ULTRAWEAVE + parche FIFA',
    },
    fitNotes: 'La talla del jugador (XL en defensas/portero, M en mediocampistas y delanteros).',
    details: ['Certificado de autenticidad de FIFA o federación', 'Trazabilidad partido por partido', 'Autógrafo si está documentado', 'Daños/sudor del partido visible (autenticidad)', 'Etiqueta interior con jugador'],
    goodFor: ['Coleccionismo de alto nivel', 'Inversión a largo plazo', 'Museos privados'],
    notGoodFor: ['Lavar', 'Uso casual', 'Cualquier deporte'],
  },
];

// ───────────────────────────────────────────────────────────────────
// Guía de tallas
// ───────────────────────────────────────────────────────────────────

export type SizeRow = {
  eu: string;
  uk: string;
  us: string;
  mx: string;
  chestCm: string;
  chestIn: string;
};

export const SIZE_GUIDE_ADULT: SizeRow[] = [
  { eu: 'XS',  uk: '34',    us: 'XS',  mx: 'CH', chestCm: '86-91',   chestIn: '34-36' },
  { eu: 'S',   uk: '36-38', us: 'S',   mx: 'CH', chestCm: '91-96',   chestIn: '36-38' },
  { eu: 'M',   uk: '38-40', us: 'M',   mx: 'M',  chestCm: '96-101',  chestIn: '38-40' },
  { eu: 'L',   uk: '40-42', us: 'L',   mx: 'G',  chestCm: '101-106', chestIn: '40-42' },
  { eu: 'XL',  uk: '42-44', us: 'XL',  mx: 'EG', chestCm: '106-111', chestIn: '42-44' },
  { eu: 'XXL', uk: '44-46', us: 'XXL', mx: 'EG', chestCm: '111-116', chestIn: '44-46' },
];

export const SIZE_GUIDE_KIDS: { age: string; height: string; cmRange: string }[] = [
  { age: '4Y', height: '102-110 cm', cmRange: 'Pecho ≈ 56 cm' },
  { age: '6Y', height: '110-122 cm', cmRange: 'Pecho ≈ 62 cm' },
  { age: '8Y', height: '122-134 cm', cmRange: 'Pecho ≈ 67 cm' },
  { age: '10Y', height: '134-146 cm', cmRange: 'Pecho ≈ 72 cm' },
  { age: '12Y', height: '146-158 cm', cmRange: 'Pecho ≈ 77 cm' },
  { age: '14Y', height: '158-170 cm', cmRange: 'Pecho ≈ 83 cm' },
];

// ───────────────────────────────────────────────────────────────────
// Detección de falsificaciones
// ───────────────────────────────────────────────────────────────────

export type FakeSign = {
  id: number;
  signal: string;
  detail: string;
  severity: 'critical' | 'medium' | 'minor';
};

export const FAKE_DETECTION: FakeSign[] = [
  {
    id: 1,
    signal: 'Precio sospechosamente bajo (≤ 35 €)',
    detail:
      'Una réplica oficial nueva NO baja de 70 € en venta oficial. Una authentic NO baja de 130 €. Camisetas a 20-35 € son CASI SIEMPRE falsificación, especialmente si vienen de marketplaces sin verificación de vendedor.',
    severity: 'critical',
  },
  {
    id: 2,
    signal: 'Logo de la marca estampado en lugar de cosido o prensado',
    detail:
      'Adidas, Nike y Puma usan logos cosidos en réplicas y prensados en caliente en authentics. Si el logo está estampado con plastisol o se siente plástico al tacto, es copia china. Verifica también las 3 rayas Adidas: deben ser cosidas, no impresas.',
    severity: 'critical',
  },
  {
    id: 3,
    signal: 'Etiqueta interior sin holograma FIFA o etiquetas incorrectas',
    detail:
      'Las camisetas oficiales del Mundial 2026 llevarán etiqueta con el escudo de la federación + el logo Mundial 2026 + holograma FIFA pequeño en la parte interna del cuello. Si falta cualquiera de los tres elementos o están mal cosidas (descosidas, hilos sueltos), copia.',
    severity: 'critical',
  },
  {
    id: 4,
    signal: 'Calidad del cuello inferior, costuras desviadas',
    detail:
      'En las copias chinas la calidad del cuello cae rápido tras 1-2 lavados. Las costuras deben ser uniformes, sin hilos sueltos. El estampado de los dorsales en una camiseta authentic se hace en imprenta profesional, no con plotter de bajo coste.',
    severity: 'medium',
  },
  {
    id: 5,
    signal: 'Vendedor sin trazabilidad o con direcciones de China/Vietnam',
    detail:
      'En Amazon, AliExpress o eBay verifica el vendedor. Si la dirección es China, Vietnam o Pakistán y el seller tiene menos de 100 reseñas, la camiseta no es oficial. Los retailers serios siempre publican dirección y CIF español/europeo.',
    severity: 'medium',
  },
  {
    id: 6,
    signal: 'Embalaje genérico sin embalaje de marca técnica',
    detail:
      'Una camiseta oficial Adidas viene en bolsa Adidas con logo y código de producto. Nike y Puma igual. Si llega en una bolsa de plástico transparente sin marcas, es importación sin oficialidad.',
    severity: 'minor',
  },
];

// ───────────────────────────────────────────────────────────────────
// Catálogo de páginas del cluster
// ───────────────────────────────────────────────────────────────────

export const CLUSTER_PAGES = [
  {
    slug: '',
    pathname: '/coleccionismo/camisetas-mundial-2026',
    title: 'Camisetas Mundial 2026',
    description: 'Las 48 camisetas oficiales del Mundial 2026 con marca técnica, precios y dónde comprar.',
    icon: 'shirt',
  },
  {
    slug: 'comprar',
    pathname: '/coleccionismo/camisetas-mundial-2026/comprar',
    title: 'Dónde comprar camisetas Mundial 2026',
    description: 'Los mejores retailers (Amazon, adidas.es, Nike, Puma, Fútbol Emotion) con pros, contras y envío a España.',
    icon: 'shopping-cart',
  },
  {
    slug: 'precio',
    pathname: '/coleccionismo/camisetas-mundial-2026/precio',
    title: 'Precio de las camisetas Mundial 2026',
    description: 'Cuánto cuesta una camiseta Mundial 2026: réplica (70-100 €), authentic (130-180 €), match worn (3000-50000 €).',
    icon: 'banknote',
  },
  {
    slug: 'authentic-vs-replica',
    pathname: '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica',
    title: 'Camiseta authentic vs replica Mundial 2026',
    description: 'Diferencias técnicas: HEAT.RDY vs AEROREADY, Dri-FIT ADV vs Stadium, ULTRAWEAVE vs dryCELL. Cuál te conviene y por qué.',
    icon: 'sparkles',
  },
  {
    slug: 'tallas',
    pathname: '/coleccionismo/camisetas-mundial-2026/tallas',
    title: 'Guía de tallas camisetas Mundial 2026',
    description: 'Tabla de tallas EU/UK/US/MX para adulto y niño. Cómo medirse correctamente y diferencias entre authentic y replica.',
    icon: 'ruler',
  },
  {
    slug: 'falsificaciones',
    pathname: '/coleccionismo/camisetas-mundial-2026/falsificaciones',
    title: 'Falsificaciones camisetas Mundial 2026',
    description: 'Las 6 señales para detectar copias chinas: precio, logo, etiqueta interior, cuello, vendedor y embalaje.',
    icon: 'alert',
  },
] as const;

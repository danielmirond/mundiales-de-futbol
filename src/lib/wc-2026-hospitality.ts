/**
 * Datos centralizados del cluster `/2026/hospitality`.
 *
 * Productos oficiales (On Location – proveedor exclusivo de FIFA):
 *   SM   Single Match
 *   VS   Venue Series
 *   FMT  Follow My Team
 *   MM   Multi-Match Bundle
 *   MEL  Match Experience Light
 *   PS   Private Suites
 *   PPS  PP-Suites (subdominio pp-suites.fifa.com)
 *
 * Fuentes:
 *   https://fifaworldcup26.hospitality.fifa.com/
 *   FIFA.com — articles/limited-release-hospitality-packages-us-matches
 *   Goal.com US, Jetpac Global, The World Cup Guide
 *
 * Afiliación cruzada:
 *   FIFA Hospitality no tiene programa abierto. CTAs principales van directo
 *   a On Location con tracking utm. La monetización real viene de hotel +
 *   vuelo + tours en cada ciudad sede (Booking, Skyscanner, GetYourGuide).
 *
 * Last review: 14 mayo 2026.
 */

// ───────────────────────────────────────────────────────────────────
// Productos
// ───────────────────────────────────────────────────────────────────

export type HospitalityProduct = {
  id: 'SM' | 'VS' | 'FMT' | 'MM' | 'MEL' | 'PS' | 'PPS';
  name: string;
  shortName: string;
  audience: string;
  priceFromUsd: number | null;
  /** Precio máximo razonable observado en mercado mayo 2026 */
  priceCeilingUsd: number | null;
  description: string;
  details: string[];
  /** Path en el portal FIFA Hospitality */
  fifaPath: string;
};

export const HOSPITALITY_PRODUCTS: HospitalityProduct[] = [
  {
    id: 'SM',
    name: 'Single Match',
    shortName: 'Partido único',
    audience: 'Aficionado que quiere ir a UN partido en concreto',
    priceFromUsd: 2500,
    priceCeilingUsd: 15000,
    description:
      'Hospitality para un solo partido. Asientos premium + lounge con comida y bebida 3 h antes del partido y 1 h después. La opción de entrada al hospitality oficial.',
    details: [
      'Asiento premium garantizado (Category 1 o Premium)',
      'Lounge con catering ilimitado (chef-driven)',
      'Barra libre de vinos, cervezas y refrescos',
      'Programa de entretenimiento previo al partido',
      'Regalo conmemorativo oficial FIFA',
      'Acceso a parking premium (según estadio)',
    ],
    fifaPath: '/us/en/choose-matches?productTypeCode=SM',
  },
  {
    id: 'VS',
    name: 'Venue Series',
    shortName: 'Serie por estadio',
    audience: 'Quien quiere ir a TODOS los partidos de un estadio concreto',
    priceFromUsd: 8275,
    priceCeilingUsd: 73000,
    description:
      'Pack con asiento garantizado a TODOS los partidos que se jueguen en un mismo estadio. Ideal si vives o viajas a una sede en concreto (LA, NYC, México DF).',
    details: [
      'Asiento garantizado a los 6–8 partidos del estadio',
      'Mismo asiento todos los partidos',
      'Lounge premium con catering por partido',
      'Programa hospitality completo cada partido',
      'Regalo conmemorativo edición limitada',
      'Precio por persona, desde 8.275 USD (estadios menos demandados)',
    ],
    fifaPath: '/us/en/choose-bundle?id=VS',
  },
  {
    id: 'FMT',
    name: 'Follow My Team',
    shortName: 'Sigue a tu selección',
    audience: 'Fan de una selección que quiere viajar con ella por todo el Mundial',
    priceFromUsd: 6500,
    priceCeilingUsd: 45000,
    description:
      'Asiento premium garantizado en TODOS los partidos de tu selección, desde la fase de grupos hasta donde llegue. Si tu equipo gana la copa, tienes Final.',
    details: [
      'Asiento premium en los 3 partidos de grupos',
      'Continuidad automática hasta donde llegue tu selección',
      'Si tu equipo es eliminado, no recibes los partidos restantes',
      'Lounge premium con catering por partido',
      'Disponible para las 48 selecciones clasificadas',
      'Recomendado para Argentina, Brasil, España, Inglaterra, Francia, México, USA',
    ],
    fifaPath: '/us/en/choose-bundle?id=FMT',
  },
  {
    id: 'MM',
    name: 'Multi-Match Bundle',
    shortName: 'Multi-partido',
    audience: 'Quien quiere combinar 2-5 partidos de su elección sin atarse a estadio o equipo',
    priceFromUsd: 5800,
    priceCeilingUsd: 35000,
    description:
      'Tú eliges entre 2 y 5 partidos del calendario y los empaquetas con descuento sobre el precio Single Match individual. Máxima flexibilidad.',
    details: [
      'Combina cualquier partido del calendario',
      '2–5 partidos por bundle',
      'Hospitality completo en cada partido elegido',
      'Descuento ~10–15 % vs Single Match individual',
      'Disponible mientras haya stock en cada partido',
    ],
    fifaPath: '/us/en/choose-matches?productType=MM',
  },
  {
    id: 'MEL',
    name: 'Match Experience Light',
    shortName: 'Hospitality light',
    audience: 'Entrada premium sin programa completo de hospitality',
    priceFromUsd: 1800,
    priceCeilingUsd: 6000,
    description:
      'Versión más ligera del Single Match: asiento premium + acceso a una zona de hospitality, pero sin barra libre completa ni regalos. La opción más barata dentro del oficial.',
    details: [
      'Asiento Category 1 garantizado',
      'Acceso a hospitality lounge (formato buffet ligero)',
      'Bebidas incluidas pero no barra libre completa',
      'Sin regalos conmemorativos',
      'Sin programa de entretenimiento previo',
    ],
    fifaPath: '/us/en/choose-matches?productType=MEL',
  },
  {
    id: 'PS',
    name: 'Private Suites',
    shortName: 'Suite privada',
    audience: 'Grupos corporativos / familias 8–20 personas',
    priceFromUsd: 43200,
    priceCeilingUsd: 250000,
    description:
      'Suite privada en el estadio para tu grupo. Catering chef-driven, bar privado, baño dentro de la suite y vista panorámica al campo. El producto top de FIFA Hospitality.',
    details: [
      'Capacidad típica 8–20 personas',
      'Cocina y bar privados en la suite',
      'Catering chef-driven personalizado',
      'Acceso premium al estadio',
      'Aparcamiento VIP / drop-off privado',
      'Disponible por partido o por toda la Venue Series',
    ],
    fifaPath: '/us/en/choose-bundle?id=PS',
  },
  {
    id: 'PPS',
    name: 'PP-Suites',
    shortName: 'PP Suites (Pitch Premium)',
    audience: 'Coleccionista de experiencias / corporate de alto perfil',
    priceFromUsd: 120000,
    priceCeilingUsd: 500000,
    description:
      'Suites de pista (Pitch Premium) — el escalón por encima de Private Suites. Acceso a vestuarios, túnel, calentamiento. Reservado a partners corporativos y patrocinadores oficiales.',
    details: [
      'Acceso a vestuarios y túnel pre-partido',
      'Asiento en pitch-side',
      'Catering en lounge dedicado',
      'Photo opportunity con trofeo (según partido)',
      'Reservado a corporate y patrocinadores oficiales',
    ],
    fifaPath: '/us/en/choose-matches?productType=PPS',
  },
];

// ───────────────────────────────────────────────────────────────────
// Ciudades sede (16)
// ───────────────────────────────────────────────────────────────────

export type HospitalityCity = {
  /** Slug alineado con SEDES_2026 (web interna) */
  citySlug: string;
  /** Slug que usa FIFA Hospitality en /venues/<slug> */
  fifaSlug: string;
  cityName: string;
  /** Locale FIFA Hospitality: 'us' | 'ca' | 'mx' */
  fifaLocale: 'us' | 'ca' | 'mx';
  countryCode: 'USA' | 'CAN' | 'MEX';
  stadiumName: string;
  stadiumCapacity: number;
  matchCount: number;
  role: string;
  priceFromUsd: number;
  /** Aeropuerto IATA principal */
  iata: string;
};

export const HOSPITALITY_CITIES: HospitalityCity[] = [
  // USA
  { citySlug: 'atlanta', fifaSlug: 'atlanta', cityName: 'Atlanta', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'Mercedes-Benz Stadium', stadiumCapacity: 75000, matchCount: 8, role: '8 partidos (incluye semifinal)', priceFromUsd: 2500, iata: 'ATL' },
  { citySlug: 'boston', fifaSlug: 'boston', cityName: 'Boston', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'Gillette Stadium', stadiumCapacity: 65000, matchCount: 7, role: '7 partidos (cuartos)', priceFromUsd: 2500, iata: 'BOS' },
  { citySlug: 'dallas', fifaSlug: 'dallas', cityName: 'Dallas', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'AT&T Stadium', stadiumCapacity: 94000, matchCount: 9, role: '9 partidos (semifinal)', priceFromUsd: 2800, iata: 'DFW' },
  { citySlug: 'houston', fifaSlug: 'houston', cityName: 'Houston', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'NRG Stadium', stadiumCapacity: 72000, matchCount: 7, role: '7 partidos', priceFromUsd: 2500, iata: 'IAH' },
  { citySlug: 'kansas-city', fifaSlug: 'kansas-city', cityName: 'Kansas City', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'Arrowhead Stadium', stadiumCapacity: 73000, matchCount: 6, role: '6 partidos', priceFromUsd: 2500, iata: 'MCI' },
  { citySlug: 'los-angeles', fifaSlug: 'los-angeles', cityName: 'Los Angeles', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'SoFi Stadium', stadiumCapacity: 70000, matchCount: 8, role: '8 partidos (cuartos)', priceFromUsd: 3200, iata: 'LAX' },
  { citySlug: 'miami', fifaSlug: 'miami', cityName: 'Miami', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'Hard Rock Stadium', stadiumCapacity: 65000, matchCount: 7, role: '7 partidos (3er puesto)', priceFromUsd: 3000, iata: 'MIA' },
  { citySlug: 'nueva-york', fifaSlug: 'new-york-new-jersey', cityName: 'Nueva York / NJ', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'MetLife Stadium', stadiumCapacity: 82500, matchCount: 8, role: '8 partidos (FINAL)', priceFromUsd: 4500, iata: 'EWR' },
  { citySlug: 'philadelphia', fifaSlug: 'philadelphia', cityName: 'Philadelphia', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'Lincoln Financial Field', stadiumCapacity: 69000, matchCount: 6, role: '6 partidos', priceFromUsd: 2500, iata: 'PHL' },
  { citySlug: 'seattle', fifaSlug: 'seattle', cityName: 'Seattle', fifaLocale: 'us', countryCode: 'USA', stadiumName: 'Lumen Field', stadiumCapacity: 69000, matchCount: 6, role: '6 partidos', priceFromUsd: 2500, iata: 'SEA' },
  { citySlug: 'san-francisco-bay-area', fifaSlug: 'san-francisco-bay-area', cityName: 'San Francisco Bay Area', fifaLocale: 'us', countryCode: 'USA', stadiumName: "Levi's Stadium", stadiumCapacity: 71000, matchCount: 6, role: '6 partidos', priceFromUsd: 2700, iata: 'SFO' },
  // CAN
  { citySlug: 'toronto', fifaSlug: 'toronto', cityName: 'Toronto', fifaLocale: 'ca', countryCode: 'CAN', stadiumName: 'BMO Field', stadiumCapacity: 45000, matchCount: 6, role: '6 partidos', priceFromUsd: 2200, iata: 'YYZ' },
  { citySlug: 'vancouver', fifaSlug: 'vancouver', cityName: 'Vancouver', fifaLocale: 'ca', countryCode: 'CAN', stadiumName: 'BC Place', stadiumCapacity: 54000, matchCount: 7, role: '7 partidos', priceFromUsd: 2200, iata: 'YVR' },
  // MEX
  { citySlug: 'ciudad-de-mexico', fifaSlug: 'mexico-city', cityName: 'Ciudad de México', fifaLocale: 'mx', countryCode: 'MEX', stadiumName: 'Estadio Azteca', stadiumCapacity: 83000, matchCount: 5, role: 'Partido INAUGURAL + 5 partidos', priceFromUsd: 3500, iata: 'MEX' },
  { citySlug: 'guadalajara', fifaSlug: 'guadalajara', cityName: 'Guadalajara', fifaLocale: 'mx', countryCode: 'MEX', stadiumName: 'Estadio Akron', stadiumCapacity: 48000, matchCount: 4, role: '4 partidos', priceFromUsd: 2000, iata: 'GDL' },
  { citySlug: 'monterrey', fifaSlug: 'monterrey', cityName: 'Monterrey', fifaLocale: 'mx', countryCode: 'MEX', stadiumName: 'Estadio BBVA', stadiumCapacity: 53500, matchCount: 4, role: '4 partidos', priceFromUsd: 2000, iata: 'MTY' },
];

export function getCity(citySlug: string): HospitalityCity | undefined {
  return HOSPITALITY_CITIES.find((c) => c.citySlug === citySlug);
}

// ───────────────────────────────────────────────────────────────────
// Selecciones (Follow My Team)
// ───────────────────────────────────────────────────────────────────

/**
 * Mapping de selecciones a sus params Follow My Team en FIFA Hospitality.
 * El portal FIFA usa `?team=XXX` con 48 selecciones detectadas.
 * Para las 47 selecciones donde nuestro código canónico coincide con el
 * de FIFA, fifaParam === teamCode. Excepción: COD (RD Congo) → CGO en FIFA.
 */
export const FMT_TEAM_PARAMS: Record<string, { fifaParam: string; locale: 'us' | 'ca' | 'mx' }> = {
  // CONCACAF
  MEX: { fifaParam: 'MEX', locale: 'mx' },
  USA: { fifaParam: 'USA', locale: 'us' },
  CAN: { fifaParam: 'CAN', locale: 'ca' },
  HAI: { fifaParam: 'HAI', locale: 'us' },
  PAN: { fifaParam: 'PAN', locale: 'us' },
  CUW: { fifaParam: 'CUW', locale: 'us' },
  // CONMEBOL
  BRA: { fifaParam: 'BRA', locale: 'us' },
  ARG: { fifaParam: 'ARG', locale: 'us' },
  URU: { fifaParam: 'URU', locale: 'us' },
  COL: { fifaParam: 'COL', locale: 'us' },
  ECU: { fifaParam: 'ECU', locale: 'us' },
  PAR: { fifaParam: 'PAR', locale: 'us' },
  // UEFA
  ESP: { fifaParam: 'ESP', locale: 'us' },
  FRA: { fifaParam: 'FRA', locale: 'us' },
  ENG: { fifaParam: 'ENG', locale: 'us' },
  GER: { fifaParam: 'GER', locale: 'us' },
  NED: { fifaParam: 'NED', locale: 'us' },
  POR: { fifaParam: 'POR', locale: 'us' },
  CRO: { fifaParam: 'CRO', locale: 'us' },
  BEL: { fifaParam: 'BEL', locale: 'us' },
  SUI: { fifaParam: 'SUI', locale: 'us' },
  AUT: { fifaParam: 'AUT', locale: 'us' },
  NOR: { fifaParam: 'NOR', locale: 'us' },
  SWE: { fifaParam: 'SWE', locale: 'us' },
  CZE: { fifaParam: 'CZE', locale: 'us' },
  SCO: { fifaParam: 'SCO', locale: 'us' },
  BIH: { fifaParam: 'BIH', locale: 'us' },
  TUR: { fifaParam: 'TUR', locale: 'us' },
  // CAF
  MAR: { fifaParam: 'MAR', locale: 'us' },
  SEN: { fifaParam: 'SEN', locale: 'us' },
  EGY: { fifaParam: 'EGY', locale: 'us' },
  TUN: { fifaParam: 'TUN', locale: 'us' },
  ALG: { fifaParam: 'ALG', locale: 'us' },
  GHA: { fifaParam: 'GHA', locale: 'us' },
  CIV: { fifaParam: 'CIV', locale: 'us' },
  RSA: { fifaParam: 'RSA', locale: 'us' },
  COD: { fifaParam: 'CGO', locale: 'us' },
  CPV: { fifaParam: 'CPV', locale: 'us' },
  // AFC
  JPN: { fifaParam: 'JPN', locale: 'us' },
  KOR: { fifaParam: 'KOR', locale: 'us' },
  IRN: { fifaParam: 'IRN', locale: 'us' },
  AUS: { fifaParam: 'AUS', locale: 'us' },
  KSA: { fifaParam: 'KSA', locale: 'us' },
  QAT: { fifaParam: 'QAT', locale: 'us' },
  IRQ: { fifaParam: 'IRQ', locale: 'us' },
  UZB: { fifaParam: 'UZB', locale: 'us' },
  JOR: { fifaParam: 'JOR', locale: 'us' },
  // OFC
  NZL: { fifaParam: 'NZL', locale: 'us' },
};

// ───────────────────────────────────────────────────────────────────
// FAQ
// ───────────────────────────────────────────────────────────────────

export type HospitalityFAQItem = { q: string; a: string };

export const HOSPITALITY_FAQ: HospitalityFAQItem[] = [
  {
    q: '¿Quién vende oficialmente las entradas hospitality del Mundial 2026?',
    a: 'On Location es el operador exclusivo de FIFA para entradas hospitality. La venta directa al público es a través del portal fifaworldcup26.hospitality.fifa.com. Cualquier otra fuente sin acuerdo "Official Sales Partner" es reventa de riesgo.',
  },
  {
    q: '¿Cuál es el precio mínimo de un paquete oficial?',
    a: 'El producto más barato es el Match Experience Light (MEL) desde 1.800 USD por persona. Single Match arranca en 2.500 USD. Venue Series desde 8.275 USD. Las Private Suites parten en 43.200 USD por partido.',
  },
  {
    q: '¿Los paquetes hospitality incluyen vuelo y hotel?',
    a: 'No. Los paquetes oficiales FIFA solo cubren entrada, asiento premium y lounge en el estadio. Vuelo y hotel los gestionas aparte (recomendamos Booking, Skyscanner y Expedia).',
  },
  {
    q: '¿Qué moneda se cobra en cada país?',
    a: 'Por defecto USD para el portal /us/ y /mx/ y CAD para /ca/. El portal mexicano puede cobrar también en MXN. Confirma el cargo final con tu banco y considera comisión de cambio.',
  },
  {
    q: '¿Hay plan de pagos a plazos?',
    a: 'Sí. On Location ofrece un plan de pagos en 3-6 cuotas para paquetes superiores a 5.000 USD. Las cuotas son sin intereses pero hay penalización si cancelas tras la segunda cuota.',
  },
  {
    q: '¿Puedo revender un paquete que ya compré?',
    a: 'Solo en la plataforma oficial de reventa (FIFA Tickets Marketplace, no Match Hospitality). Las cesiones a terceros fuera de la plataforma anulan el paquete y bloquean el acceso al estadio.',
  },
  {
    q: '¿Qué pasa con el "Follow My Team" si mi selección es eliminada en grupos?',
    a: 'Mantienes los 3 partidos de la fase de grupos garantizados. Los partidos posteriores que correspondían a la siguiente ronda se cancelan sin reembolso adicional. Es el riesgo del producto.',
  },
  {
    q: '¿Las suites privadas se venden solo por venue series?',
    a: 'No. Las Private Suites se venden por partido individual (desde 43.200 USD) o por toda la serie de un estadio (>100.000 USD según ciudad y ronda).',
  },
  {
    q: '¿Hay código de vestimenta en hospitality?',
    a: 'Smart casual recomendado, sin obligación. Algunas suites privadas con catering chef-driven exigen "smart" (no shorts, no chanclas). Camisetas de selección son bienvenidas.',
  },
  {
    q: '¿Los menores tienen descuento?',
    a: 'Niños menores de 3 años pueden acceder gratis en regazo. De 3 a 16 años pagan tarifa adulto en hospitality (no hay descuento juvenil en paquetes oficiales).',
  },
];

// ───────────────────────────────────────────────────────────────────
// Política editorial: solo afiliación Amazon (`nuus-21`).
// Sin CTAs externos a Booking, Skyscanner, GetYourGuide. La información
// del producto se mantiene en el sitio (contenido editorial), pero no
// enlazamos para vender.
//
// Los builders fifaProductUrl/fifaVenueUrl/fifaTeamUrl se mantienen para
// referencia interna y para construir microdata JSON-LD, pero NO se usan
// como CTA visible al usuario.
// ───────────────────────────────────────────────────────────────────

const FIFA_HOSPITALITY = 'https://fifaworldcup26.hospitality.fifa.com';

export function fifaProductUrl(product: HospitalityProduct, locale: 'us' | 'ca' | 'mx' = 'us'): string {
  const path = product.fifaPath.replace(/^\/(us|ca|mx)\//, `/${locale}/`);
  return `${FIFA_HOSPITALITY}${path}`;
}

export function fifaVenueUrl(city: HospitalityCity): string {
  return `${FIFA_HOSPITALITY}/venues/${city.fifaSlug}`;
}

export function fifaTeamUrl(teamCode: string): string {
  const fmt = FMT_TEAM_PARAMS[teamCode];
  if (!fmt) return `${FIFA_HOSPITALITY}/us/en/choose-matches`;
  return `${FIFA_HOSPITALITY}/${fmt.locale}/en/choose-matches?team=${fmt.fifaParam}&quantity=1`;
}

// ───────────────────────────────────────────────────────────────────
// Catálogo de páginas del cluster (para sitemap + cross-linking)
// ───────────────────────────────────────────────────────────────────

export const CLUSTER_PAGES = [
  { slug: '', path: '/2026/hospitality', title: 'Hospitality Mundial 2026', priority: 0.95 },
  { slug: 'productos', path: '/2026/hospitality/productos', title: 'Productos hospitality FIFA', priority: 0.9 },
  { slug: 'precios', path: '/2026/hospitality/precios', title: 'Precios hospitality Mundial 2026', priority: 0.9 },
  { slug: 'private-suites', path: '/2026/hospitality/private-suites', title: 'Private Suites Mundial 2026', priority: 0.85 },
  { slug: 'faq', path: '/2026/hospitality/faq', title: 'FAQ hospitality Mundial 2026', priority: 0.75 },
  { slug: 'sedes', path: '/2026/hospitality/sedes', title: 'Hospitality por sede', priority: 0.9 },
  { slug: 'selecciones', path: '/2026/hospitality/selecciones', title: 'Follow My Team por selección', priority: 0.9 },
] as const;

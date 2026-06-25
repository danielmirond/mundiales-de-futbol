/**
 * Marcas técnicas para las 48 selecciones del Mundial 2026.
 *
 * Política editorial: solo afiliación Amazon (`nuus-21`). El `shopUrl`
 * que antes apuntaba a adidas/Nike/Puma oficiales se construye ahora
 * como búsqueda en Amazon España para que sea monetizable.
 *
 * Fuentes de verificación de la marca técnica (mayo 2026):
 *  - Footy Headlines (cuadro de marcas Mundial 2026)
 *  - nss sports (proveedores técnicos)
 *  - OneFootball (Adidas/Nike duopoly)
 *
 * Distribución por marca (48 selecciones):
 *  - Adidas: 14 · Nike: 12 · Puma: 11
 *  - Marcas menores: 11 (Hummel, Kelme, Castore, Joma, Marathon,
 *    Macron, New Balance, Saller, Majid, 7Saber)
 *
 * `verified: 'confirmed'` cuando el contrato está documentado en
 * fuentes públicas. `'estimated'` cuando se infiere del proveedor
 * histórico reciente.
 */

export type KitBrand =
  | 'Adidas'
  | 'Nike'
  | 'Puma'
  | 'Hummel'
  | 'Kappa'
  | 'Kelme'
  | 'Castore'
  | 'Joma'
  | 'Marathon'
  | 'Macron'
  | 'New Balance'
  | 'Saller'
  | 'Majid'
  | '7Saber';

export type TeamKit2026 = {
  /** Código FIFA de la selección. */
  teamCode: string;
  /** Marca técnica oficial 2026. */
  brand: KitBrand;
  /** URL del hub oficial de la marca para esta selección o el hub general. */
  shopUrl: string;
  /** Estado de verificación. */
  verified: 'confirmed' | 'estimated';
  /** Nota editorial opcional (cambio de proveedor, contrato firmado, etc.). */
  note?: string;
};

/**
 * Hubs oficiales de cada marca para cuando una selección no tiene
 * su propia URL dedicada.
 */
const AMAZON_TAG = 'nuus-21';

/** Construye una URL de búsqueda en Amazon España con tag de afiliación. */
export function amazonSearchUrl(teamCode: string, brand: string): string {
  const q = encodeURIComponent(`camiseta ${teamCode} ${brand} mundial 2026`);
  return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG}`;
}

/**
 * Hubs de marca en Amazon España (todas con tag `nuus-21`).
 * Sustituyen a los antiguos hubs oficiales adidas.es / nike.com / etc.
 */
const BRAND_HUB: Record<KitBrand, string> = {
  Adidas: `https://www.amazon.es/s?k=camiseta+adidas+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Nike: `https://www.amazon.es/s?k=camiseta+nike+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Puma: `https://www.amazon.es/s?k=camiseta+puma+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Hummel: `https://www.amazon.es/s?k=camiseta+hummel+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Kappa: `https://www.amazon.es/s?k=camiseta+kappa+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Kelme: `https://www.amazon.es/s?k=camiseta+kelme+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Castore: `https://www.amazon.es/s?k=camiseta+castore+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Joma: `https://www.amazon.es/s?k=camiseta+joma+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Marathon: `https://www.amazon.es/s?k=camiseta+marathon+ecuador+mundial+2026&tag=${AMAZON_TAG}`,
  Macron: `https://www.amazon.es/s?k=camiseta+macron+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  'New Balance': `https://www.amazon.es/s?k=camiseta+new+balance+seleccion+mundial+2026&tag=${AMAZON_TAG}`,
  Saller: `https://www.amazon.es/s?k=camiseta+saller+haiti+mundial+2026&tag=${AMAZON_TAG}`,
  Majid: `https://www.amazon.es/s?k=camiseta+iran+mundial+2026&tag=${AMAZON_TAG}`,
  '7Saber': `https://www.amazon.es/s?k=camiseta+uzbekistan+mundial+2026&tag=${AMAZON_TAG}`,
};

export const TEAM_KITS_2026: Record<string, TeamKit2026> = {
  // ─── Adidas (14) ───────────────────────────────────────────────
  ALG: { teamCode: 'ALG', brand: 'Adidas', shopUrl: amazonSearchUrl('ALG', 'Adidas'), verified: 'confirmed' },
  KSA: { teamCode: 'KSA', brand: 'Adidas', shopUrl: amazonSearchUrl('KSA', 'Adidas'), verified: 'confirmed' },
  ARG: { teamCode: 'ARG', brand: 'Adidas', shopUrl: amazonSearchUrl('ARG', 'Adidas'), verified: 'confirmed' },
  BEL: { teamCode: 'BEL', brand: 'Adidas', shopUrl: amazonSearchUrl('BEL', 'Adidas'), verified: 'confirmed' },
  COL: { teamCode: 'COL', brand: 'Adidas', shopUrl: amazonSearchUrl('COL', 'Adidas'), verified: 'confirmed', note: 'Colombia cambió de Marathon a adidas en 2024.' },
  CUW: { teamCode: 'CUW', brand: 'Adidas', shopUrl: amazonSearchUrl('CUW', 'Adidas'), verified: 'estimated', note: 'Debutante absoluta. Confirmar contrato adidas tras anuncio de la federación.' },
  GER: { teamCode: 'GER', brand: 'Adidas', shopUrl: amazonSearchUrl('GER', 'Adidas'), verified: 'confirmed', note: 'Renovó hasta 2034. Adidas viste a Alemania desde 1954.' },
  JPN: { teamCode: 'JPN', brand: 'Adidas', shopUrl: amazonSearchUrl('JPN', 'Adidas'), verified: 'confirmed' },
  MEX: { teamCode: 'MEX', brand: 'Adidas', shopUrl: amazonSearchUrl('MEX', 'Adidas'), verified: 'confirmed', note: 'Renovó contrato en 2023.' },
  QAT: { teamCode: 'QAT', brand: 'Adidas', shopUrl: amazonSearchUrl('QAT', 'Adidas'), verified: 'confirmed' },
  SCO: { teamCode: 'SCO', brand: 'Adidas', shopUrl: amazonSearchUrl('SCO', 'Adidas'), verified: 'confirmed' },
  ESP: { teamCode: 'ESP', brand: 'Adidas', shopUrl: amazonSearchUrl('ESP', 'Adidas'), verified: 'confirmed', note: 'Adidas viste a España desde 1992.' },
  RSA: { teamCode: 'RSA', brand: 'Adidas', shopUrl: amazonSearchUrl('RSA', 'Adidas'), verified: 'confirmed' },
  SWE: { teamCode: 'SWE', brand: 'Adidas', shopUrl: amazonSearchUrl('SWE', 'Adidas'), verified: 'confirmed' },

  // ─── Nike (12) ─────────────────────────────────────────────────
  AUS: { teamCode: 'AUS', brand: 'Nike', shopUrl: amazonSearchUrl('AUS', 'Nike'), verified: 'confirmed' },
  BRA: { teamCode: 'BRA', brand: 'Nike', shopUrl: amazonSearchUrl('BRA', 'Nike'), verified: 'confirmed', note: 'Nike viste a Brasil desde 1996.' },
  CAN: { teamCode: 'CAN', brand: 'Nike', shopUrl: amazonSearchUrl('CAN', 'Nike'), verified: 'confirmed' },
  KOR: { teamCode: 'KOR', brand: 'Nike', shopUrl: amazonSearchUrl('KOR', 'Nike'), verified: 'confirmed' },
  CRO: { teamCode: 'CRO', brand: 'Nike', shopUrl: amazonSearchUrl('CRO', 'Nike'), verified: 'confirmed' },
  FRA: { teamCode: 'FRA', brand: 'Nike', shopUrl: amazonSearchUrl('FRA', 'Nike'), verified: 'confirmed', note: 'Nike viste a Francia desde 2011, contrato hasta 2034.' },
  ENG: { teamCode: 'ENG', brand: 'Nike', shopUrl: amazonSearchUrl('ENG', 'Nike'), verified: 'confirmed' },
  NOR: { teamCode: 'NOR', brand: 'Nike', shopUrl: amazonSearchUrl('NOR', 'Nike'), verified: 'confirmed' },
  NED: { teamCode: 'NED', brand: 'Nike', shopUrl: amazonSearchUrl('NED', 'Nike'), verified: 'confirmed' },
  USA: { teamCode: 'USA', brand: 'Nike', shopUrl: amazonSearchUrl('USA', 'Nike'), verified: 'confirmed' },
  TUR: { teamCode: 'TUR', brand: 'Nike', shopUrl: amazonSearchUrl('TUR', 'Nike'), verified: 'confirmed' },
  URU: { teamCode: 'URU', brand: 'Nike', shopUrl: amazonSearchUrl('URU', 'Nike'), verified: 'confirmed' },

  // ─── Puma (11) ─────────────────────────────────────────────────
  AUT: { teamCode: 'AUT', brand: 'Puma', shopUrl: amazonSearchUrl('AUT', 'Puma'), verified: 'confirmed' },
  CIV: { teamCode: 'CIV', brand: 'Puma', shopUrl: amazonSearchUrl('CIV', 'Puma'), verified: 'confirmed' },
  EGY: { teamCode: 'EGY', brand: 'Puma', shopUrl: amazonSearchUrl('EGY', 'Puma'), verified: 'confirmed' },
  GHA: { teamCode: 'GHA', brand: 'Puma', shopUrl: amazonSearchUrl('GHA', 'Puma'), verified: 'confirmed' },
  MAR: { teamCode: 'MAR', brand: 'Puma', shopUrl: amazonSearchUrl('MAR', 'Puma'), verified: 'confirmed', note: 'Renovó tras la semifinal de Qatar 2022.' },
  NZL: { teamCode: 'NZL', brand: 'Puma', shopUrl: amazonSearchUrl('NZL', 'Puma'), verified: 'confirmed' },
  PAR: { teamCode: 'PAR', brand: 'Puma', shopUrl: amazonSearchUrl('PAR', 'Puma'), verified: 'confirmed' },
  POR: { teamCode: 'POR', brand: 'Puma', shopUrl: amazonSearchUrl('POR', 'Puma'), verified: 'confirmed', note: 'Puma viste a Portugal desde 1997.' },
  CZE: { teamCode: 'CZE', brand: 'Puma', shopUrl: amazonSearchUrl('CZE', 'Puma'), verified: 'confirmed' },
  SEN: { teamCode: 'SEN', brand: 'Puma', shopUrl: amazonSearchUrl('SEN', 'Puma'), verified: 'confirmed' },
  SUI: { teamCode: 'SUI', brand: 'Puma', shopUrl: amazonSearchUrl('SUI', 'Puma'), verified: 'confirmed' },

  // ─── Marcas menores (11) ───────────────────────────────────────
  HAI: { teamCode: 'HAI', brand: 'Saller', shopUrl: amazonSearchUrl('HAI', 'Saller'), verified: 'estimated', note: 'Proveedor histórico de la Federación Haitiana.' },
  PAN: { teamCode: 'PAN', brand: 'New Balance', shopUrl: amazonSearchUrl('PAN', 'New Balance'), verified: 'confirmed' },
  ECU: { teamCode: 'ECU', brand: 'Marathon', shopUrl: amazonSearchUrl('ECU', 'Marathon'), verified: 'confirmed', note: 'Marca ecuatoriana, proveedor histórico de La Tri.' },
  BIH: { teamCode: 'BIH', brand: 'Kelme', shopUrl: amazonSearchUrl('BIH', 'Kelme'), verified: 'confirmed' },
  TUN: { teamCode: 'TUN', brand: 'Kappa', shopUrl: amazonSearchUrl('TUN', 'Kappa'), verified: 'estimated', note: 'Kappa o renovación con marca local pendiente de confirmar.' },
  COD: { teamCode: 'COD', brand: 'Macron', shopUrl: amazonSearchUrl('COD', 'Macron'), verified: 'estimated' },
  CPV: { teamCode: 'CPV', brand: 'Hummel', shopUrl: amazonSearchUrl('CPV', 'Hummel'), verified: 'estimated', note: 'Debut absoluto. Hummel proveedor histórico africano.' },
  IRN: { teamCode: 'IRN', brand: 'Majid', shopUrl: amazonSearchUrl('IRN', 'Majid'), verified: 'confirmed', note: 'Marca local iraní. Proveedor desde 2018 tras sanciones a Nike.' },
  IRQ: { teamCode: 'IRQ', brand: 'Castore', shopUrl: amazonSearchUrl('IRQ', 'Castore'), verified: 'estimated' },
  UZB: { teamCode: 'UZB', brand: '7Saber', shopUrl: amazonSearchUrl('UZB', '7Saber'), verified: 'confirmed', note: 'Marca local uzbeka. Debut como proveedor de selección nacional en Mundial.' },
  JOR: { teamCode: 'JOR', brand: 'Kelme', shopUrl: amazonSearchUrl('JOR', 'Kelme'), verified: 'confirmed' },
};

/**
 * Devuelve los datos de equipación de una selección o `undefined`
 * si no está en el Mundial 2026 / no hay datos.
 */
export function getTeamKit(teamCode: string): TeamKit2026 | undefined {
  return TEAM_KITS_2026[teamCode];
}

/**
 * Devuelve el hub general de la marca (fallback cuando el shopUrl
 * específico de la selección redirige o falla).
 */
export function getBrandHub(brand: KitBrand): string {
  return BRAND_HUB[brand];
}

/**
 * Lista todas las selecciones que visten una marca concreta. Útil
 * para páginas tipo "Camisetas adidas en el Mundial 2026".
 */
export function getTeamsByBrand(brand: KitBrand): TeamKit2026[] {
  return Object.values(TEAM_KITS_2026).filter((k) => k.brand === brand);
}

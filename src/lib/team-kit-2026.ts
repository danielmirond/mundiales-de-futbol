/**
 * Marcas técnicas y URLs oficiales de equipación para las 48
 * selecciones del Mundial 2026.
 *
 * Fuentes de verificación (mayo 2026):
 *  - Footy Headlines (cuadro de marcas Mundial 2026)
 *  - nss sports (proveedores técnicos)
 *  - OneFootball (Adidas/Nike duopoly)
 *  - Sky Sports y Goal.com (kits revealed)
 *
 * Distribución por marca (48 selecciones):
 *  - Adidas: 14
 *  - Nike: 12
 *  - Puma: 11
 *  - Marcas menores: 11 (Hummel, Kelme, Castore, Joma, Marathon,
 *    Macron, New Balance, Saller, Majid, 7Saber)
 *
 * `verified: 'confirmed'` cuando el contrato está documentado en
 * fuentes públicas. `'estimated'` cuando se infiere del proveedor
 * histórico reciente y no hay anuncio oficial 2026.
 *
 * URLs `shopUrl` apuntan al hub federación oficial de la marca.
 * Si una selección concreta no tiene página dedicada, se enlaza al
 * hub general de fútbol selecciones de esa marca.
 *
 * Afiliación: TODAS las URLs son por ahora directas, sin tag de
 * afiliación. Cuando se active Awin (adidas/Puma) o CJ (Nike US),
 * sustituir por deep links sin tocar este archivo: el componente
 * `<TeamKitShop />` lee la URL del lib y aplica el wrapper de
 * afiliación en runtime.
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
const BRAND_HUB: Record<KitBrand, string> = {
  Adidas: 'https://www.adidas.es/futbol-federations',
  Nike: 'https://www.nike.com/global-football',
  Puma: 'https://eu.puma.com/uk/en/football/national-teams',
  Hummel: 'https://www.hummel.net/en/football/national-team-jerseys/',
  Kappa: 'https://www.kappa.com/national-teams',
  Kelme: 'https://kelme.com/en/national-teams/',
  Castore: 'https://castore.com/collections/national-teams',
  Joma: 'https://www.joma-sport.com/en/national-teams',
  Marathon: 'https://www.marathon.com.ec/',
  Macron: 'https://www.macron.com/en/teamwear/national-teams',
  'New Balance': 'https://www.newbalance.com/football',
  Saller: 'https://www.saller.de/',
  Majid: 'https://www.majidsport.com/',
  '7Saber': 'https://7saber.uz/',
};

export const TEAM_KITS_2026: Record<string, TeamKit2026> = {
  // ─── Adidas (14) ───────────────────────────────────────────────
  ALG: { teamCode: 'ALG', brand: 'Adidas', shopUrl: 'https://www.adidas.es/algeria-football', verified: 'confirmed' },
  KSA: { teamCode: 'KSA', brand: 'Adidas', shopUrl: 'https://www.adidas.com.sa/saudi-arabia', verified: 'confirmed' },
  ARG: { teamCode: 'ARG', brand: 'Adidas', shopUrl: 'https://www.adidas.com.ar/argentina-football', verified: 'confirmed' },
  BEL: { teamCode: 'BEL', brand: 'Adidas', shopUrl: 'https://www.adidas.es/belgium-football', verified: 'confirmed' },
  COL: { teamCode: 'COL', brand: 'Adidas', shopUrl: 'https://www.adidas.com.co/colombia-football', verified: 'confirmed', note: 'Colombia cambió de Marathon a adidas en 2024.' },
  CUW: { teamCode: 'CUW', brand: 'Adidas', shopUrl: 'https://www.adidas.com/curacao-football', verified: 'estimated', note: 'Debutante absoluta. Confirmar contrato adidas tras anuncio de la federación.' },
  GER: { teamCode: 'GER', brand: 'Adidas', shopUrl: 'https://www.adidas.de/germany-football', verified: 'confirmed', note: 'Renovó hasta 2034. Adidas viste a Alemania desde 1954.' },
  JPN: { teamCode: 'JPN', brand: 'Adidas', shopUrl: 'https://shop.adidas.jp/japan/', verified: 'confirmed' },
  MEX: { teamCode: 'MEX', brand: 'Adidas', shopUrl: 'https://www.adidas.com.mx/mexico-football', verified: 'confirmed', note: 'Renovó contrato en 2023.' },
  QAT: { teamCode: 'QAT', brand: 'Adidas', shopUrl: 'https://www.adidas.com.qa/qatar-football', verified: 'confirmed' },
  SCO: { teamCode: 'SCO', brand: 'Adidas', shopUrl: 'https://www.adidas.co.uk/scotland-football', verified: 'confirmed' },
  ESP: { teamCode: 'ESP', brand: 'Adidas', shopUrl: 'https://www.adidas.es/spain-football', verified: 'confirmed', note: 'Adidas viste a España desde 1992.' },
  RSA: { teamCode: 'RSA', brand: 'Adidas', shopUrl: 'https://www.adidas.co.za/south-africa-football', verified: 'confirmed' },
  SWE: { teamCode: 'SWE', brand: 'Adidas', shopUrl: 'https://www.adidas.se/sweden-football', verified: 'confirmed' },

  // ─── Nike (12) ─────────────────────────────────────────────────
  AUS: { teamCode: 'AUS', brand: 'Nike', shopUrl: 'https://www.nike.com/au/socceroos', verified: 'confirmed' },
  BRA: { teamCode: 'BRA', brand: 'Nike', shopUrl: 'https://www.nike.com.br/cbf', verified: 'confirmed', note: 'Nike viste a Brasil desde 1996.' },
  CAN: { teamCode: 'CAN', brand: 'Nike', shopUrl: 'https://www.nike.com/ca/canada-soccer', verified: 'confirmed' },
  KOR: { teamCode: 'KOR', brand: 'Nike', shopUrl: 'https://www.nike.com/kr/korea-football', verified: 'confirmed' },
  CRO: { teamCode: 'CRO', brand: 'Nike', shopUrl: 'https://www.nike.com/croatia-football', verified: 'confirmed' },
  FRA: { teamCode: 'FRA', brand: 'Nike', shopUrl: 'https://www.nike.com/fr/fff', verified: 'confirmed', note: 'Nike viste a Francia desde 2011, contrato hasta 2034.' },
  ENG: { teamCode: 'ENG', brand: 'Nike', shopUrl: 'https://www.nike.com/gb/w/england-football-team', verified: 'confirmed' },
  NOR: { teamCode: 'NOR', brand: 'Nike', shopUrl: 'https://www.nike.com/no/norway-football', verified: 'confirmed' },
  NED: { teamCode: 'NED', brand: 'Nike', shopUrl: 'https://www.nike.com/nl/netherlands-football', verified: 'confirmed' },
  USA: { teamCode: 'USA', brand: 'Nike', shopUrl: 'https://www.nike.com/us/w/usa-football', verified: 'confirmed' },
  TUR: { teamCode: 'TUR', brand: 'Nike', shopUrl: 'https://www.nike.com.tr/turkey-football', verified: 'confirmed' },
  URU: { teamCode: 'URU', brand: 'Nike', shopUrl: 'https://www.nike.com.uy/auf', verified: 'confirmed' },

  // ─── Puma (11) ─────────────────────────────────────────────────
  AUT: { teamCode: 'AUT', brand: 'Puma', shopUrl: 'https://eu.puma.com/at/austria-football', verified: 'confirmed' },
  CIV: { teamCode: 'CIV', brand: 'Puma', shopUrl: 'https://eu.puma.com/ivory-coast-football', verified: 'confirmed' },
  EGY: { teamCode: 'EGY', brand: 'Puma', shopUrl: 'https://eu.puma.com/egypt-football', verified: 'confirmed' },
  GHA: { teamCode: 'GHA', brand: 'Puma', shopUrl: 'https://eu.puma.com/ghana-football', verified: 'confirmed' },
  MAR: { teamCode: 'MAR', brand: 'Puma', shopUrl: 'https://eu.puma.com/morocco-football', verified: 'confirmed', note: 'Renovó tras la semifinal de Qatar 2022.' },
  NZL: { teamCode: 'NZL', brand: 'Puma', shopUrl: 'https://nz.puma.com/new-zealand-football', verified: 'confirmed' },
  PAR: { teamCode: 'PAR', brand: 'Puma', shopUrl: 'https://eu.puma.com/paraguay-football', verified: 'confirmed' },
  POR: { teamCode: 'POR', brand: 'Puma', shopUrl: 'https://eu.puma.com/pt/portugal-football', verified: 'confirmed', note: 'Puma viste a Portugal desde 1997.' },
  CZE: { teamCode: 'CZE', brand: 'Puma', shopUrl: 'https://eu.puma.com/czech-republic-football', verified: 'confirmed' },
  SEN: { teamCode: 'SEN', brand: 'Puma', shopUrl: 'https://eu.puma.com/senegal-football', verified: 'confirmed' },
  SUI: { teamCode: 'SUI', brand: 'Puma', shopUrl: 'https://eu.puma.com/ch/switzerland-football', verified: 'confirmed' },

  // ─── Marcas menores (11) ───────────────────────────────────────
  HAI: { teamCode: 'HAI', brand: 'Saller', shopUrl: 'https://www.saller.de/teamsport/national-teams/haiti', verified: 'estimated', note: 'Proveedor histórico de la Federación Haitiana.' },
  PAN: { teamCode: 'PAN', brand: 'New Balance', shopUrl: 'https://www.newbalance.com/football/national-teams', verified: 'confirmed' },
  ECU: { teamCode: 'ECU', brand: 'Marathon', shopUrl: 'https://www.marathon.com.ec/seleccion-ecuador', verified: 'confirmed', note: 'Marca ecuatoriana, proveedor histórico de La Tri.' },
  BIH: { teamCode: 'BIH', brand: 'Kelme', shopUrl: 'https://kelme.com/en/bosnia-football', verified: 'confirmed' },
  TUN: { teamCode: 'TUN', brand: 'Kappa', shopUrl: 'https://www.kappa.com/national-teams/tunisia', verified: 'estimated', note: 'Kappa o renovación con marca local pendiente de confirmar.' },
  COD: { teamCode: 'COD', brand: 'Macron', shopUrl: 'https://www.macron.com/dr-congo-football', verified: 'estimated' },
  CPV: { teamCode: 'CPV', brand: 'Hummel', shopUrl: 'https://www.hummel.net/cape-verde-football', verified: 'estimated', note: 'Debut absoluto. Hummel proveedor histórico africano.' },
  IRN: { teamCode: 'IRN', brand: 'Majid', shopUrl: 'https://www.majidsport.com/iran-football', verified: 'confirmed', note: 'Marca local iraní. Proveedor desde 2018 tras sanciones a Nike.' },
  IRQ: { teamCode: 'IRQ', brand: 'Castore', shopUrl: 'https://castore.com/collections/iraq-football', verified: 'estimated' },
  UZB: { teamCode: 'UZB', brand: '7Saber', shopUrl: 'https://7saber.uz/uzbekistan-football', verified: 'confirmed', note: 'Marca local uzbeka. Debut como proveedor de selección nacional en Mundial.' },
  JOR: { teamCode: 'JOR', brand: 'Kelme', shopUrl: 'https://kelme.com/en/jordan-football', verified: 'confirmed' },
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

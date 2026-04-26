/**
 * Amazon Associates, productos curados para Mundiales de Fútbol.
 *
 * El tag se inyecta vía env (`NEXT_PUBLIC_AMAZON_TAG`, fallback "nuus-21")
 * para no hardcodearlo y poder rotarlo sin redeploy de assets.
 *
 * Reglas de uso:
 *  - Todos los enlaces salen con rel="sponsored nofollow noopener noreferrer"
 *  - Disclosure visible en cada tarjeta ("Enlace de afiliado")
 *  - Aviso global en /aviso-afiliados
 *
 * Categorías Amazon ES con sus comisiones (Programa de Afiliados, 2026):
 *  - Ropa, Zapatos: 10%
 *  - Hogar, Deportes, Juguetes, Libros: 7%
 *  - Cocina: 5%
 *  - Electrónica, Videojuegos: 3,5%
 */

export const AMAZON_TAG = (
  process.env.NEXT_PUBLIC_AMAZON_TAG ?? 'nuus-21'
).trim();

export type AmazonCategory =
  | 'ropa'
  | 'electronica'
  | 'deportes'
  | 'zapatos'
  | 'juguetes'
  | 'videojuegos'
  | 'cocina'
  | 'hogar'
  | 'libros';

export const CATEGORY_LABELS: Record<AmazonCategory, string> = {
  ropa: 'Ropa',
  electronica: 'Electrónica',
  deportes: 'Deportes',
  zapatos: 'Zapatos',
  juguetes: 'Juguetes',
  videojuegos: 'Videojuegos',
  cocina: 'Cocina',
  hogar: 'Hogar',
  libros: 'Libros',
};

export type AmazonProduct = {
  id: number;
  title: string;
  asin: string;
  category: AmazonCategory;
  /** Comisión en % */
  commission: number;
  /** Rango aproximado en € */
  priceMin: number;
  priceMax: number;
  uses: string;
  /** Código FIFA del país (si aplica) */
  teamCode?: string;
  /** Mundial al que pertenece (si aplica) */
  worldCupYear?: number;
  /** Para niños */
  forKids?: boolean;
  /** Producto destacado */
  featured?: boolean;
  /**
   * ASIN verificado (existe en Amazon ES en el momento de añadirlo).
   * Si false o ausente, el enlace se construye como búsqueda
   * (`/s?k=<title>`) en lugar de `/dp/<asin>` para evitar 404s.
   * Se sigue cobrando comisión por afiliación en search → conversion.
   */
  verified?: boolean;
  /**
   * ID de imagen Amazon (extraído de `data-old-hires` del HTML del producto).
   * Patrón: m.media-amazon.com/images/I/<ID>._AC_SL{size}_.jpg
   * Si está presente, la tarjeta muestra foto con filtro verde de marca.
   */
  imageId?: string;
};

export const AMAZON_PRODUCTS: AmazonProduct[] = [
  // ── Camisetas selección (10%) ─────────────────────────────────
  {
    id: 1,
    title: 'RFEF Camiseta Selección Española Eurocopa 2024 réplica oficial',
    asin: 'B0D58DR1DK',
    verified: true,
    imageId: '71aw2bm6FrL',
    category: 'ropa',
    commission: 10,
    priceMin: 35,
    priceMax: 70,
    uses: 'Pilar absoluto. España juega en grupo. SEO "camiseta España Mundial 2026".',
    teamCode: 'ESP',
    featured: true,
  },
  {
    id: 2,
    title: 'adidas Camiseta Argentina 3 estrellas campeón mundial',
    asin: 'B0C32MKKHJ',
    verified: true,
    imageId: '51tWH6ycHgL',
    category: 'ropa',
    commission: 10,
    priceMin: 70,
    priceMax: 100,
    uses: 'Vigente campeona. Tráfico LATAM brutal.',
    teamCode: 'ARG',
    featured: true,
  },
  {
    id: 3,
    title: 'Nike CBF Brasil Dri-FIT Stadium camiseta selección hombre',
    asin: 'B0CFYH41T3',
    verified: true,
    imageId: '61J2nSaSrzL',
    category: 'ropa',
    commission: 10,
    priceMin: 80,
    priceMax: 110,
    uses: 'Top 3 selecciones más buscadas globalmente.',
    teamCode: 'BRA',
    featured: true,
  },
  {
    id: 4,
    title: 'Camiseta Francia 1ª Nike Mbappé',
    asin: 'B0DDLZ5ZF7',
    category: 'ropa',
    commission: 10,
    priceMin: 80,
    priceMax: 110,
    uses: 'Subcampeona 2022. Mbappé efecto.',
    teamCode: 'FRA',
    featured: true,
  },
  {
    id: 5,
    title: 'Camiseta Inglaterra Nike Bellingham',
    asin: 'B0DDM87KCC',
    category: 'ropa',
    commission: 10,
    priceMin: 80,
    priceMax: 110,
    uses: 'Mercado UK + ES. Considerar para versión EN si escalas.',
    teamCode: 'ENG',
  },
  {
    id: 6,
    title: 'Nike Portugal Ronaldo Player tee, camiseta jugador CR7',
    asin: 'B0BDDXPDB9',
    verified: true,
    imageId: '41AEhuUyRqL',
    category: 'ropa',
    commission: 10,
    priceMin: 60,
    priceMax: 90,
    uses: 'Último mundial CR7. Engagement asegurado.',
    teamCode: 'POR',
  },
  {
    id: 7,
    title: 'adidas Mexico Away camiseta selección mexicana hombre',
    asin: 'B0BFKNN5PB',
    verified: true,
    imageId: '71-mAfjAoML',
    category: 'ropa',
    commission: 10,
    priceMin: 50,
    priceMax: 90,
    uses: 'Anfitriona. Tráfico MX masivo.',
    teamCode: 'MEX',
    featured: true,
  },
  // ── Más selecciones grandes (verificadas) ─────────────────
  {
    id: 50,
    title: 'adidas Italia 2024 Stadium camiseta selección hombre Azzurri',
    asin: 'B0DM3PHJF2',
    verified: true,
    imageId: '71IspwF3h1L',
    category: 'ropa',
    commission: 10,
    priceMin: 60,
    priceMax: 100,
    uses: 'Italia 2024 Stadium. SEO "camiseta Italia Mundial".',
    teamCode: 'ITA',
  },
  {
    id: 51,
    title: 'Nike KNVB Holanda Países Bajos Dri-FIT Stadium camiseta',
    asin: 'B0BDF1LTSK',
    verified: true,
    imageId: '616kwJGckSL',
    category: 'ropa',
    commission: 10,
    priceMin: 50,
    priceMax: 95,
    uses: 'Holanda. Mercado fan total football.',
    teamCode: 'NED',
  },
  {
    id: 52,
    title: 'Nike Croacia Stadium Home camiseta selección hombre',
    asin: 'B0BMTMR92C',
    verified: true,
    imageId: '51Gpwl-BoVL',
    category: 'ropa',
    commission: 10,
    priceMin: 55,
    priceMax: 95,
    uses: 'Subcampeona 2018, semifinal 2022. Modric SEO.',
    teamCode: 'CRO',
  },
  {
    id: 53,
    title: 'PUMA Marruecos 2025 camiseta selección Atlas Lions hombre',
    asin: 'B0F2622LB4',
    verified: true,
    imageId: '61xlZ81k5xL',
    category: 'ropa',
    commission: 10,
    priceMin: 50,
    priceMax: 85,
    uses: 'Semifinal Qatar 2022. Bandera africana.',
    teamCode: 'MAR',
  },
  {
    id: 54,
    title: 'adidas Japón Samurai Blue 2022 Home camiseta selección',
    asin: 'B0BN7MMNHN',
    verified: true,
    imageId: '61eDGQ++TPL',
    category: 'ropa',
    commission: 10,
    priceMin: 45,
    priceMax: 80,
    uses: 'Mercado asiático. Diseño icónico.',
    teamCode: 'JPN',
  },
  {
    id: 55,
    title: 'adidas Bélgica Mundial 2022 Away Diables Rouges camiseta',
    asin: 'B0BMB52B5T',
    verified: true,
    imageId: '41FEJmyaaQL',
    category: 'ropa',
    commission: 10,
    priceMin: 50,
    priceMax: 90,
    uses: 'Generación dorada belga. Lukaku, De Bruyne.',
    teamCode: 'BEL',
  },
  // ── Camisetas retro icónicas (10%) ─────────────────────
  {
    id: 56,
    title: 'Copa Football Maradona × Argentina 1986, Camiseta retro Mundial',
    asin: 'B0BHBYLSTL',
    verified: true,
    imageId: '41BMuZCHoNL',
    category: 'ropa',
    commission: 10,
    priceMin: 60,
    priceMax: 90,
    uses: 'Mundial 86 · cluster Mano de Dios. Cross-sell con /historias y /ediciones/1986-mexico.',
    teamCode: 'ARG',
    worldCupYear: 1986,
    featured: true,
  },
  {
    id: 57,
    title: 'Camiseta retro Pelé 1970 número 10 Brasil tributo Rey del fútbol',
    asin: 'B0DT2V2WP2',
    verified: true,
    imageId: '51gVY8knOcL',
    category: 'ropa',
    commission: 10,
    priceMin: 25,
    priceMax: 45,
    uses: 'Mundial 70 · Pelé tricampeón. Cross-sell con /ediciones/1970-mexico.',
    teamCode: 'BRA',
    worldCupYear: 1970,
    featured: true,
  },
  // ── Cross-sell España ───────────────────────────────
  {
    id: 8,
    title: 'Camiseta niño España adidas',
    asin: 'B0CTHWHQK3',
    category: 'ropa',
    commission: 10,
    priceMin: 40,
    priceMax: 60,
    uses: 'Familia. Long-tail "camiseta España niño Mundial".',
    teamCode: 'ESP',
    forKids: true,
  },
  {
    id: 9,
    title: 'Pantalón corto España adidas',
    asin: 'B0CTJ3X9MB',
    category: 'ropa',
    commission: 10,
    priceMin: 30,
    priceMax: 45,
    uses: 'Cross-sell con camiseta. Conjunto completo.',
    teamCode: 'ESP',
  },
  {
    id: 10,
    title: 'Chándal entrenamiento España adidas',
    asin: 'B0DDM5K5VP',
    category: 'ropa',
    commission: 10,
    priceMin: 70,
    priceMax: 100,
    uses: 'Fans + uso casual. Ticket alto.',
    teamCode: 'ESP',
  },
  {
    id: 11,
    title: 'Bufanda España selección',
    asin: 'B07T7RKBPV',
    category: 'ropa',
    commission: 10,
    priceMin: 12,
    priceMax: 18,
    uses: 'Bajo ticket pero conversión salvaje en partidos clave.',
    teamCode: 'ESP',
  },
  {
    id: 12,
    title: 'Gorra España adidas oficial',
    asin: 'B0CTJ4QM7H',
    category: 'ropa',
    commission: 10,
    priceMin: 20,
    priceMax: 30,
    uses: 'Cross-sell moda. 10% comisión.',
    teamCode: 'ESP',
  },
  // ── TVs y electrónica (3,5%), Fan Zone Mundial 2026 ────────
  {
    id: 13,
    title: 'Hisense U6N 55" Mini-LED 4K Google TV, TV asequible para fútbol',
    asin: 'B0CY4X5M8D',
    verified: true,
    imageId: '719xQytFYFL',
    category: 'electronica',
    commission: 3.5,
    priceMin: 500,
    priceMax: 700,
    uses: 'Tier eco fan zone. Mini-LED + 240 motion rate. SEO "TV Mundial 2026 barata".',
    worldCupYear: 2026,
    featured: true,
  },
  {
    id: 14,
    title: 'Samsung QLED Q60D 65" 4K Smart TV, para ver el Mundial 2026',
    asin: 'B0CS6Z8RTB',
    verified: true,
    imageId: '81LlKvis56L',
    category: 'electronica',
    commission: 3.5,
    priceMin: 800,
    priceMax: 1100,
    uses: 'Tier medio fan zone. Pulgada estándar 65" + 100% color volume.',
    worldCupYear: 2026,
    featured: true,
  },
  {
    id: 15,
    title: 'LG OLED evo C4 55" 4K 144Hz Dolby Vision, premium para fútbol',
    asin: 'B0CYCCS1HP',
    verified: true,
    imageId: '81kGmzJpGcL',
    category: 'electronica',
    commission: 3.5,
    priceMin: 1200,
    priceMax: 1700,
    uses: 'Tier pro. OLED + 144Hz, ideal para deportes y gaming. Ticket alto.',
    worldCupYear: 2026,
    featured: true,
  },
  {
    id: 16,
    title: 'XGIMI Halo+ proyector portátil 1080p Google TV, fan zone móvil',
    asin: 'B09MD1R9QV',
    verified: true,
    imageId: '71N87RNWQSL',
    category: 'electronica',
    commission: 3.5,
    priceMin: 700,
    priceMax: 900,
    uses: 'Auge fan zones caseras. Proyector portátil con batería + Harman Kardon.',
    worldCupYear: 2026,
  },
  {
    id: 17,
    title: 'Samsung HW-Q700C 3.1.2 Dolby Atmos, barra de sonido medio',
    asin: 'B0BPY8V39Z',
    verified: true,
    imageId: '61-Hyt8iqhL',
    category: 'electronica',
    commission: 3.5,
    priceMin: 350,
    priceMax: 500,
    uses: 'Tier medio audio. Q-Symphony con TVs Samsung + Atmos.',
    worldCupYear: 2026,
  },
  {
    id: 60,
    title: 'Samsung HW-Q800D 5.1.2 Atmos 2024, barra de sonido pro',
    asin: 'B0CZMD371L',
    verified: true,
    imageId: '51LIsrX2Q7L',
    category: 'electronica',
    commission: 3.5,
    priceMin: 600,
    priceMax: 800,
    uses: 'Tier pro audio. SpaceFit Sound Pro + 5.1.2 inalámbrico.',
    worldCupYear: 2026,
  },
  {
    id: 61,
    title: 'Samsung HW-Q990F 11.1.4 Atmos 2025, barra premium',
    asin: 'B0F1D7VQJ3',
    verified: true,
    imageId: '71zupey2fiL',
    category: 'electronica',
    commission: 3.5,
    priceMin: 1500,
    priceMax: 1900,
    uses: 'Tier premium. 11.1.4 canales, el gol se siente en 360°.',
    worldCupYear: 2026,
  },
  {
    id: 62,
    title: 'Sony WH-1000XM5 auriculares cancelación ruido, fútbol nocturno',
    asin: 'B09Y2MYL5C',
    verified: true,
    imageId: '61fxPWFu6aL',
    category: 'electronica',
    commission: 3.5,
    priceMin: 280,
    priceMax: 380,
    uses: 'Para ver partidos de madrugada sin molestar. Cluster fan zone.',
    worldCupYear: 2026,
  },
  {
    id: 63,
    title: 'Apple TV 4K 64GB Wi-Fi 3ª gen, para apps de streaming',
    asin: 'B0BJN9J51S',
    verified: true,
    imageId: '51QKvGxHl2L',
    category: 'electronica',
    commission: 3.5,
    priceMin: 169,
    priceMax: 199,
    uses: 'Set-top box premium. Acceso a apps Movistar+, DAZN, Tubi/Peacock con VPN.',
    worldCupYear: 2026,
  },
  // ── Balones (7%) ─────────────────────────────────
  {
    id: 18,
    title: 'adidas FIFA World Cup 26 Trionda Training balón Mundial 2026',
    asin: 'B0DLJD5K46',
    verified: true,
    imageId: '71FYdVCqWeL',
    category: 'deportes',
    commission: 7,
    priceMin: 30,
    priceMax: 60,
    uses: 'Balón oficial entrenamiento Mundial 2026. Coleccionistas y prácticos. Pilar SEO.',
    worldCupYear: 2026,
    featured: true,
  },
  {
    id: 19,
    title: 'Balón réplica adidas Mundial 2026 talla 5',
    asin: 'B0DCZJF8XD',
    category: 'deportes',
    commission: 7,
    priceMin: 25,
    priceMax: 40,
    uses: 'Versión asequible. Mucho más volumen de ventas.',
    worldCupYear: 2026,
  },
  {
    id: 20,
    title: 'Mini balón adidas Mundial 2026',
    asin: 'B0DCZK2GNM',
    category: 'deportes',
    commission: 7,
    priceMin: 12,
    priceMax: 20,
    uses: 'Coleccionable + niños. Conversión muy alta.',
    worldCupYear: 2026,
    forKids: true,
  },
  // ── Botas (10%) ─────────────────────────────────
  {
    id: 21,
    title: 'Botas fútbol adidas Predator',
    asin: 'B0CRY8KMKH',
    category: 'zapatos',
    commission: 10,
    priceMin: 90,
    priceMax: 150,
    uses: 'Categoría moda 10%. Inspiradas equipaciones.',
  },
  {
    id: 22,
    title: 'Botas fútbol Nike Mercurial Vapor',
    asin: 'B0CWGHQK7L',
    category: 'zapatos',
    commission: 10,
    priceMin: 100,
    priceMax: 180,
    uses: 'Top de gama. Para reviews comparativas.',
  },
  // ── Coleccionismo (7%) ─────────────────────────────────
  {
    id: 23,
    title: 'Panini FIFA World Cup Qatar 2022, álbum oficial + 25 sobres cromos',
    asin: 'B0BBGVW8QY',
    verified: true,
    imageId: '615NjPkCS0L',
    category: 'juguetes',
    commission: 7,
    priceMin: 12,
    priceMax: 25,
    uses: 'Cromos Mundial Qatar 2022, coleccionistas. Pre-2026 cuando salga el álbum oficial 2026 se actualiza.',
    worldCupYear: 2022,
    featured: true,
  },
  {
    id: 24,
    title: 'Caja sobres cromos Panini Mundial 2026',
    asin: 'B0DGGN9XMK',
    category: 'juguetes',
    commission: 7,
    priceMin: 60,
    priceMax: 90,
    uses: 'Caja completa. Buscadores high-intent.',
    worldCupYear: 2026,
  },
  {
    id: 25,
    title: 'Funko Pop! Football PSG Lionel Messi, figura coleccionable',
    asin: 'B09YDH36XR',
    verified: true,
    imageId: '51cTIkO-9jL',
    category: 'juguetes',
    commission: 7,
    priceMin: 15,
    priceMax: 25,
    uses: 'Funko Messi. Cluster Argentina + leyendas. Cross-sell con /selecciones/ARG.',
    teamCode: 'ARG',
  },
  {
    id: 26,
    title: 'Monopoly FIFA edición Mundial',
    asin: 'B0DDM6CXVH',
    category: 'juguetes',
    commission: 7,
    priceMin: 30,
    priceMax: 45,
    uses: 'Regalo fan. Long-tail navideño post-mundial.',
  },
  // ── Videojuegos (3,5%) ─────────────────────────────────
  {
    id: 27,
    title: 'EA Sports FC 26 PS5',
    asin: 'B0DPL2KYQM',
    category: 'videojuegos',
    commission: 3.5,
    priceMin: 60,
    priceMax: 75,
    uses: 'Última entrega FIFA-likes. Pico ventas pre-mundial.',
    worldCupYear: 2026,
  },
  {
    id: 28,
    title: 'EA Sports FC 26 Xbox Series X',
    asin: 'B0DPL3J9NL',
    category: 'videojuegos',
    commission: 3.5,
    priceMin: 60,
    priceMax: 75,
    uses: 'Versión Xbox. Cross-platform review.',
    worldCupYear: 2026,
  },
  {
    id: 29,
    title: 'Mando PS5 DualSense edición FIFA',
    asin: 'B0DDM7T2KP',
    category: 'videojuegos',
    commission: 3.5,
    priceMin: 70,
    priceMax: 90,
    uses: 'Cross-sell FC 26.',
  },
  // ── Cocina (5%) y Hogar (7%) ─────────────────────────────────
  {
    id: 30,
    title: 'Frigorífico bebidas portátil 30L Klarstein',
    asin: 'B07VQHV4XJ',
    category: 'cocina',
    commission: 5,
    priceMin: 120,
    priceMax: 180,
    uses: 'Fan zones caseras. Ticket alto.',
  },
  {
    id: 31,
    title: "Plancha asar/grill Cecotec Rock'n Grill",
    asin: 'B07RB7BX9Q',
    category: 'cocina',
    commission: 5,
    priceMin: 50,
    priceMax: 80,
    uses: 'Reuniones para ver partidos. Buen ticket.',
  },
  {
    id: 32,
    title: 'Set 6 vasos cerveza pinta cristal',
    asin: 'B07X7L4G92',
    category: 'hogar',
    commission: 7,
    priceMin: 20,
    priceMax: 30,
    uses: 'Fan zone DIY. Alto volumen estacional.',
  },
  // ── Libros (7%) ─────────────────────────────────
  {
    id: 33,
    title: 'El historiador en el estadio, Toni Padilla, geopolítica del fútbol',
    asin: '8418216298',
    verified: true,
    imageId: '71GpxH3jLRL',
    category: 'libros',
    commission: 7,
    priceMin: 18,
    priceMax: 25,
    uses: 'Toni Padilla (Panenka). Pilar enciclopédico. Reseña evergreen.',
  },
  {
    id: 34,
    title: 'El fútbol a sol y a sombra, Eduardo Galeano (bolsillo)',
    asin: '843231255X',
    verified: true,
    category: 'libros',
    commission: 7,
    priceMin: 12,
    priceMax: 18,
    uses: 'Galeano. Pilar literario. SEO long-tail evergreen.',
  },
  {
    id: 35,
    title: 'Brasil 50, Retratos del Mundial del Maracanazo · Toni Padilla',
    asin: '8494216716',
    verified: true,
    category: 'libros',
    commission: 7,
    priceMin: 20,
    priceMax: 28,
    uses: 'Toni Padilla / Panenka. Maracanazo: cluster SEO fuerte.',
  },
  // ── Más electrónica para Mundial ─────────────────────────────
  {
    id: 36,
    title: 'Auriculares Sony WH-1000XM5',
    asin: 'B09XS7JWHH',
    category: 'electronica',
    commission: 3.5,
    priceMin: 300,
    priceMax: 380,
    uses: 'Para ver partidos sin molestar. Ticket alto.',
  },
  {
    id: 37,
    title: 'Tablet Lenovo Tab M11 + funda',
    asin: 'B0CRPYTC7Z',
    category: 'electronica',
    commission: 3.5,
    priceMin: 180,
    priceMax: 240,
    uses: 'Ver Mundial en movilidad. Buen ticket.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

/** Construye URL final de afiliado con tag inyectado */
/** Construye URL de imagen Amazon CDN (sirve cualquier resolución). */
export function buildAmazonImage(imageId: string, size = 500): string {
  return `https://m.media-amazon.com/images/I/${imageId}._AC_SL${size}_.jpg`;
}

/**
 * Construye URL Amazon. Si el producto no está verificado (asin caducado
 * o sin asignar), genera URL de búsqueda, Amazon nunca da 404 en /s
 * y la atribución de afiliado se mantiene si el usuario compra después.
 */
export function buildAmazonUrl(
  productOrAsin: AmazonProduct | string,
  tag = AMAZON_TAG,
): string {
  // Backwards compat: si recibe un string, asume ASIN verificado.
  if (typeof productOrAsin === 'string') {
    return `https://www.amazon.es/dp/${productOrAsin}/?tag=${tag}`;
  }
  const p = productOrAsin;
  if (p.verified) {
    return `https://www.amazon.es/dp/${p.asin}/?tag=${tag}`;
  }
  // ASIN no verificado → URL de búsqueda con el título.
  const query = encodeURIComponent(p.title);
  return `https://www.amazon.es/s?k=${query}&tag=${tag}`;
}

export function getProductsByTeam(teamCode: string): AmazonProduct[] {
  return AMAZON_PRODUCTS.filter((p) => p.teamCode === teamCode);
}

export function getProductsByCategory(category: AmazonCategory): AmazonProduct[] {
  return AMAZON_PRODUCTS.filter((p) => p.category === category);
}

export function getProductsForWorldCup(year: number): AmazonProduct[] {
  return AMAZON_PRODUCTS.filter((p) => p.worldCupYear === year);
}

export function getFeaturedProducts(): AmazonProduct[] {
  return AMAZON_PRODUCTS.filter((p) => p.featured);
}

export function formatPrice(min: number, max: number): string {
  if (min === max) return `${min} €`;
  return `${min}–${max} €`;
}

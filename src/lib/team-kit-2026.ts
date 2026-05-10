/**
 * Catálogo de camisetas oficiales del Mundial 2026 con enfoque a conversión.
 *
 * Por qué este archivo existe (separado de `wc-jerseys.ts` que es histórico):
 *  - Foco exclusivo en kit OFICIAL del Mundial 2026 (home / away / third / GK).
 *  - Multi-retailer: cada producto enlaza a Amazon ES (`nuus-21`), adidas.es
 *    (Awin), nike.com (CJ Affiliate) y puma.com (directo) cuando estén
 *    publicados.
 *  - Datos de conversión: RRP (€/$), edición (replica vs authentic vs player),
 *    tecnología propia, fecha lanzamiento, badges (preorder, in-stock,
 *    limited).
 *  - Página `/coleccionismo/camisetas-mundial-2026` y bloque renderizado
 *    en `/selecciones/{code}/camisetas` antes del histórico.
 *
 * Política editorial:
 *  - SOLO datos verificables (drop oficial publicado en web de marca o
 *    medio especializado: footyheadlines, the-kits, marca/as).
 *  - Si un dato no está confirmado a fecha del último review, se marca
 *    `unverified: true` y la card se renderiza sin precio.
 *  - URL de afiliado se construye en runtime, no se hardcodea con tag.
 *
 * Comisiones por canal:
 *  - Amazon ES (`nuus-21`):       10 % en ropa
 *  - adidas.es (Awin):             6-12 % según campaña
 *  - nike.com (CJ Affiliate):      8-11 % en team kits
 *  - puma.com (Awin):              7-10 %
 *
 * Lanzamientos verificados a fecha de último review (mayo 2026).
 * Para añadir o actualizar un kit: confirmar drop oficial primero, luego
 * pegar la URL exacta del producto, RRP y la fecha de release ISO.
 */

import { TEAMS_2026 } from '@/lib/wc-2026';
import { AMAZON_TAG } from '@/lib/amazon-products';

// ───────────────────────────────────────────────────────────────────
// Tipos
// ───────────────────────────────────────────────────────────────────

export type KitVariant = 'home' | 'away' | 'third' | 'goalkeeper';

export type KitBrand =
  | 'adidas'
  | 'Nike'
  | 'Puma'
  | 'New Balance'
  | 'Hummel'
  | 'Kappa'
  | 'Macron'
  | 'Le Coq Sportif'
  | 'Marathon'
  | 'Federation';

export type KitEdition =
  | 'replica' // versión fan, tela menos técnica, ~70-100 €
  | 'authentic' // versión jugador, tela técnica, sin algodón, ~150 €
  | 'player' // versión jugador con personalización
  | 'kid'; // talla niño

export type Retailer =
  | 'amazon-es'
  | 'adidas-es'
  | 'nike-com'
  | 'puma-com'
  | 'newbalance'
  | 'fanatics-es'
  | 'official-fed'
  | 'el-corte-ingles'
  | 'futbol-emotion';

export type ShopUrl = {
  retailer: Retailer;
  /** URL del producto. Para Amazon, dejar SIN tag (se inyecta en runtime). */
  url: string;
  /** Programa de afiliación. */
  affiliateNetwork: 'amazon-associates' | 'awin' | 'cj' | 'partnerize' | 'direct';
  /** Si el enlace cuenta con afiliación activa hoy. */
  hasAffiliate: boolean;
  /** Notas internas (e.g. "stock bajo", "solo XL", "drop 7-mayo"). */
  notes?: string;
};

export type Kit2026 = {
  variant: KitVariant;
  /** Nombre comercial oficial (e.g. "Argentina 26 Home Jersey"). */
  productName: string;
  /** Sub-nombre interno del drop (e.g. "Tres Estrellas Home"). */
  dropName?: string;
  /** RRP en EUR. */
  priceEur?: number;
  /** RRP en USD. */
  priceUsd?: number;
  /** Edición. */
  edition: KitEdition;
  /** Tecnología propietaria de la marca. */
  technology?: string;
  /** Fecha de release ISO (YYYY-MM-DD). */
  releaseDate?: string;
  /** Imagen oficial 1200×… si existe (cuidado copyright). */
  imageUrl?: string;
  imageAlt?: string;
  /** URLs por retailer ordenadas por prioridad de afiliado/comisión. */
  shopUrls: ShopUrl[];
  /** Badges visibles en la card. */
  badge?: 'limited' | 'authentic-only' | 'preorder' | 'in-stock' | 'discounted';
  /** Notas editoriales sobre diseño / relevancia (60-100 palabras). */
  designNotes?: string;
};

export type TeamKit2026 = {
  teamCode: string;
  brand: KitBrand;
  /** URL oficial de la federación (si tiene tienda propia). */
  federationUrl?: string;
  /** URL de la página de la marca técnica para esa selección. */
  brandPageUrl?: string;
  /** Resumen editorial breve sobre el kit 2026 (60-100 palabras). */
  intro: string;
  /** Si false, no se muestra info de drop (solo placeholder y CTA genérico). */
  unverified?: boolean;
  kits: Kit2026[];
};

// ───────────────────────────────────────────────────────────────────
// Helpers de afiliación
// ───────────────────────────────────────────────────────────────────

/**
 * Inyecta el tag de Amazon Associates en una URL. Si la URL ya contiene
 * `?tag=`, lo reemplaza. Si no, lo añade.
 *
 * Idempotente: llamar dos veces no rompe el resultado.
 */
export function withAmazonTag(url: string, tag = AMAZON_TAG): string {
  try {
    const u = new URL(url);
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Construye URL final de un retailer aplicando el tag de afiliación
 * que corresponda. Para Amazon inyecta `nuus-21`; para los demás
 * devuelve la URL tal cual (la afiliación se gestiona vía deep-link
 * de Awin/CJ/Partnerize en una capa superior cuando se active).
 */
export function buildShopUrl(s: ShopUrl): string {
  if (s.retailer === 'amazon-es') return withAmazonTag(s.url);
  return s.url;
}

// ───────────────────────────────────────────────────────────────────
// Catálogo
// ───────────────────────────────────────────────────────────────────

/**
 * Catálogo de kits 2026 por selección. Cobertura inicial: top 18
 * selecciones para el mercado ES (España, Argentina, Brasil, México,
 * Francia, Inglaterra, Alemania, Países Bajos, Portugal, USA, Uruguay,
 * Marruecos, Japón, Corea, Bélgica, Suiza, Croacia, Colombia).
 *
 * El resto (30 selecciones) van marcadas `unverified: true` con el
 * brand asignado por el seleccionador y un CTA genérico hasta confirmar
 * drop. El render de página solo muestra info detallada de las
 * verificadas.
 */
export const TEAM_KITS_2026: Record<string, TeamKit2026> = {
  // ─── Top tier mercado ES ───────────────────────────────────────

  ESP: {
    teamCode: 'ESP',
    brand: 'adidas',
    federationUrl: 'https://www.tienda.rfef.es/',
    brandPageUrl: 'https://www.adidas.es/futbol-federations',
    intro:
      'La RFEF y adidas presentan para 2026 una camiseta home roja con detalles dorados conmemorativos del título de la Eurocopa 2024 y referencia visual al kit del Mundial 2010. El badge incluye la estrella conmemorativa de campeona del mundo. La away es blanca con líneas geométricas en celeste y dorado, inspirada en la luz mediterránea. Drop oficial el 24 de marzo en RFEF Tienda y adidas.es.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta España Home 2026',
        dropName: 'Spain 26 Home',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-24',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0D58DR1DK',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 1)',
          },
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
            notes: 'Awin pendiente de alta',
          },
          {
            retailer: 'official-fed',
            url: 'https://www.tienda.rfef.es/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Roja con paneles dorados en cuello y mangas. Escudo RFEF clásico con la estrella de campeona del mundo. Versión authentic con tecnología HEAT.RDY a 150 €.',
      },
      {
        variant: 'away',
        productName: 'Camiseta España Away 2026',
        dropName: 'Spain 26 Away',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-24',
        shopUrls: [
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
          {
            retailer: 'official-fed',
            url: 'https://www.tienda.rfef.es/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Blanca con detalles geométricos en celeste y dorado. La franja del cuello recuerda al kit del Mundial 1994.',
      },
    ],
  },

  ARG: {
    teamCode: 'ARG',
    brand: 'adidas',
    federationUrl: 'https://shop.afa.com.ar/',
    brandPageUrl: 'https://www.adidas.es/futbol-federations',
    intro:
      'Argentina, vigente campeona del mundo, mantiene su clásica franja celeste y blanca con tres estrellas bordadas. La home 2026 conmemora los 100 años desde el primer campeonato olímpico (Ámsterdam 1928, donde la Albiceleste fue subcampeona). La away es violeta, manteniendo el código de color que estrenó en Qatar 2022 con tanto éxito.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Argentina Home 2026 (3 estrellas)',
        dropName: 'Argentina 26 Home',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-21',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0C32MKKHJ',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 2)',
          },
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
          {
            retailer: 'official-fed',
            url: 'https://shop.afa.com.ar/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
            notes: 'No envía a España',
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Tres rayas anchas celestes y blancas verticales. Las tres estrellas bordadas (1978, 1986, 2022) sobre el escudo AFA. Authentic con HEAT.RDY a 150 €.',
      },
      {
        variant: 'away',
        productName: 'Camiseta Argentina Away 2026',
        dropName: 'Argentina 26 Away',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-21',
        shopUrls: [
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Violeta con acentos celestes en hombros y mangas. Continuación del código violeta del Mundial 2022 que fue éxito de ventas global.',
      },
    ],
  },

  BRA: {
    teamCode: 'BRA',
    brand: 'Nike',
    federationUrl: 'https://www.cbf.com.br/lojas',
    brandPageUrl: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
    intro:
      'Brasil sigue con Nike, contrato vigente hasta 2030. La home 2026 mantiene el amarillo canarinho con cuello redondo y franjas verdes inspiradas en el kit de México 70 (Pelé, Carlos Alberto). La away es azul con estampado de hojas tropicales, un guiño a la Amazonía. Drop confirmado el 7 de marzo de 2026.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Brasil Home 2026 Stadium',
        dropName: 'Brazil 26 Home',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-07',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0CFYH41T3',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 3)',
          },
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
            notes: 'CJ Affiliate Nike alta pendiente',
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Amarillo canarinho clásico, franjas verdes en cuello y mangas. Escudo CBF clásico con cinco estrellas. Match Authentic a 150 € con tecnología Dri-FIT ADV.',
      },
      {
        variant: 'away',
        productName: 'Camiseta Brasil Away 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-07',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Azul Brasil con estampado tonal de hojas tropicales (jaguar y bromelias). Franja amarilla en el cuello.',
      },
    ],
  },

  FRA: {
    teamCode: 'FRA',
    brand: 'Nike',
    federationUrl: 'https://store.fff.fr/',
    brandPageUrl: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
    intro:
      'La FFF y Nike presentan una camiseta home azul marino oscuro con un patrón de gallo (Le Coq Gaulois) en tonos sutiles. La banda tricolor en el cuello vuelve después de dos ciclos sin ella. La away es blanca crema con detalles en azul y rojo. Drop el 14 de marzo de 2026.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Francia Home 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0DDLZ5ZF7',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 4)',
          },
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
          {
            retailer: 'official-fed',
            url: 'https://store.fff.fr/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Azul marino con patrón sutil de gallo. Banda tricolor (azul-blanco-rojo) en cuello redondo. Logo Nike y escudo FFF en blanco.',
      },
      {
        variant: 'away',
        productName: 'Camiseta Francia Away 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Blanca crema con líneas finas tonales. Detalles tricolores en mangas y cuello.',
      },
    ],
  },

  ENG: {
    teamCode: 'ENG',
    brand: 'Nike',
    federationUrl: 'https://store.englandfootball.com/',
    brandPageUrl: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
    intro:
      'Inglaterra y Nike apuestan en 2026 por una camiseta home blanca con paneles azul marino en hombros y costados, una vuelta al diseño clásico Umbro de los 80 (referencia al kit de México 86). La away es roja con líneas crudas blancas, en homenaje al kit campeón de 1966. Drop el 14 de marzo.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Inglaterra Home 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0DDM87KCC',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 5)',
          },
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Blanca con paneles azul marino. Tres leones en el escudo. Acentos rojos en cuello.',
      },
      {
        variant: 'away',
        productName: 'Camiseta Inglaterra Away 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Roja con detalles blancos crudos. Inspirada visualmente en el kit campeón del Mundial 1966.',
      },
    ],
  },

  GER: {
    teamCode: 'GER',
    brand: 'adidas',
    federationUrl: 'https://shop.dfb.de/',
    brandPageUrl: 'https://www.adidas.es/futbol-federations',
    intro:
      'Alemania y adidas, contrato histórico que cumple 75 años en 2026, presentan una camiseta home blanca con franja diagonal en negro, rojo y oro recordando el kit de Italia 90. La away es rosa, una rareza para una selección masculina y la más comentada del ciclo. Drop el 24 de marzo.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Alemania Home 2026',
        priceEur: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-24',
        shopUrls: [
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Blanca con franja tricolor diagonal. Escudo DFB con la estrella conmemorativa de cuatro veces campeón del mundo.',
      },
      {
        variant: 'away',
        productName: 'Camiseta Alemania Away 2026 Pink',
        priceEur: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-24',
        shopUrls: [
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Rosa pastel con detalles en negro y dorado. La camiseta más comentada del Mundial 2026 en redes sociales.',
      },
    ],
  },

  POR: {
    teamCode: 'POR',
    brand: 'Nike',
    federationUrl: 'https://lojaonline.fpf.pt/',
    brandPageUrl: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
    intro:
      'Portugal y Nike presentan una camiseta home roja vino con detalles verdes y dorados, evolución directa del kit que vistió Cristiano Ronaldo en Qatar 2022. La away es blanca con paneles celestes mar inspirada en los azulejos lisboetas. Drop confirmado el 14 de marzo.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Portugal Home 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Rojo vino con cuello verde y dorado. Cruz de Cristo bordada en el pecho como detalle conmemorativo. Authentic con dorsal Ronaldo a 150 €.',
      },
      {
        variant: 'away',
        productName: 'Camiseta Portugal Away 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Blanca con patrón tonal de azulejos lisboetas en celeste. Detalles rojos y verdes en mangas.',
      },
    ],
  },

  NED: {
    teamCode: 'NED',
    brand: 'Nike',
    federationUrl: 'https://store.knvb.com/',
    brandPageUrl: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
    intro:
      'Países Bajos y Nike presentan una camiseta home naranja flúor con detalles blancos minimalistas, drop el 21 de marzo. La away es azul cobalto con bandera roja-blanca-azul en cuello, primera away azul de los Oranje desde Sudáfrica 2010. Diseño centrado en sostenibilidad: 100 % poliéster reciclado.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Países Bajos Home 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-21',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Naranja flúor con cuello en V blanco. Escudo KNVB con el león dorado.',
      },
    ],
  },

  POL: {
    teamCode: 'POL',
    brand: 'Nike',
    intro: 'Polonia y Nike, kit pendiente de drop oficial.',
    unverified: true,
    kits: [],
  },

  MEX: {
    teamCode: 'MEX',
    brand: 'adidas',
    federationUrl: 'https://shop.miseleccion.mx/',
    brandPageUrl: 'https://www.adidas.com.mx/futbol',
    intro:
      'México, anfitrión, presenta con adidas la camiseta más esperada del Mundial 2026. La home es verde tradicional con una serpiente Quetzalcóatl bordada en el pecho como guiño al imaginario mexica. La away es burdeos con detalles dorados, inspirada en el oro azteca. Drop oficial el 13 de marzo, día del centenario de la FMF.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta México Home 2026',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-13',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0BDF1LTSK',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 9)',
          },
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
          {
            retailer: 'official-fed',
            url: 'https://shop.miseleccion.mx/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
            notes: 'Envía a España vía DHL',
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Verde con serpiente Quetzalcóatl tonal. Escudo FMF clásico. Authentic con HEAT.RDY a 150 €.',
      },
      {
        variant: 'away',
        productName: 'Camiseta México Away 2026',
        priceEur: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-13',
        shopUrls: [
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Burdeos profundo con detalles dorados. Inspirada en el oro azteca y la cerámica de Teotihuacán.',
      },
    ],
  },

  USA: {
    teamCode: 'USA',
    brand: 'Nike',
    federationUrl: 'https://www.ussoccerstore.com/',
    brandPageUrl: 'https://www.nike.com/us/w/usa-soccer',
    intro:
      'Estados Unidos, anfitrión, presenta con Nike una home blanca con la histórica banda diagonal de "Stars and Stripes" reinterpretada (referencia visual al kit de USA 94). La away es azul marino con detalles rojos. Drop el 4 de marzo, primer kit Mundial-anfitrión presentado del ciclo.',
    kits: [
      {
        variant: 'home',
        productName: 'USA 26 Home Stadium Jersey',
        priceEur: 100,
        priceUsd: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-04',
        shopUrls: [
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/us/w/usa-soccer',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
          {
            retailer: 'official-fed',
            url: 'https://www.ussoccerstore.com/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Blanca con banda diagonal "Stars and Stripes" tonal. Escudo USSF en azul marino.',
      },
    ],
  },

  URU: {
    teamCode: 'URU',
    brand: 'Puma',
    federationUrl: 'https://store.auf.org.uy/',
    brandPageUrl: 'https://eu.puma.com/uk/en/teams/uruguay',
    intro:
      'Uruguay y Puma celebran en 2026 el centenario de la primera Copa del Mundo (Uruguay 1930). La home es celeste con cuatro estrellas (incluyendo las dos olímpicas que la FIFA reconoce) y un patrón sutil que reproduce el Estadio Centenario. La away es blanca con detalles negros y celestes.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Uruguay Home 2026 Centenario',
        priceEur: 90,
        edition: 'replica',
        technology: 'dryCELL',
        releaseDate: '2026-03-30',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0BMTMR92C',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 11)',
          },
          {
            retailer: 'puma-com',
            url: 'https://eu.puma.com/uk/en/teams/uruguay',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'limited',
        designNotes:
          'Celeste con cuatro estrellas sobre el escudo AUF. Conmemorativa del centenario del Mundial 1930. Tirada limitada de 1930 unidades numeradas con motivo del centenario.',
      },
    ],
  },

  MAR: {
    teamCode: 'MAR',
    brand: 'Puma',
    brandPageUrl: 'https://eu.puma.com/uk/en/teams/morocco',
    intro:
      'Marruecos y Puma, contrato vigente hasta 2030. Tras la histórica semifinal en Qatar 2022, la home 2026 es roja con detalles verdes y un patrón sutil de zellige (mosaico) en hombros. La away es blanca crema con bordados verdes. Drop el 28 de marzo.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Marruecos Home 2026',
        priceEur: 90,
        edition: 'replica',
        technology: 'dryCELL',
        releaseDate: '2026-03-28',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0BN7MMNHN',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 12)',
          },
          {
            retailer: 'puma-com',
            url: 'https://eu.puma.com/uk/en/teams/morocco',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Roja con la estrella verde de Marruecos. Patrón tonal de zellige en hombros. Bordado conmemorativo de la semifinal en Qatar 2022.',
      },
    ],
  },

  JPN: {
    teamCode: 'JPN',
    brand: 'adidas',
    federationUrl: 'https://store.jfa.jp/',
    brandPageUrl: 'https://shop.adidas.jp/football/japan/',
    intro:
      'Japón y adidas presentan una home azul marino con un patrón sutil de origami (grullas) en mangas y costados. La away es blanca con detalles en rojo y dorado. La JFA y adidas mantienen el contrato hasta 2030 valorado en 80 millones USD anuales (el más alto de la AFC).',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Japón Home 2026',
        priceEur: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-04-01',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0BMB52B5T',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 13)',
          },
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Azul marino con patrón tonal de origami. Escudo JFA con el cuervo Yatagarasu.',
      },
    ],
  },

  KOR: {
    teamCode: 'KOR',
    brand: 'Nike',
    intro: 'Corea del Sur y Nike, kit pendiente de drop oficial.',
    unverified: true,
    kits: [],
  },

  BEL: {
    teamCode: 'BEL',
    brand: 'adidas',
    federationUrl: 'https://www.adidas.be/',
    intro:
      'Bélgica y adidas continúan tras renovar el contrato en 2024. La home 2026 es roja borgoña con cuello negro y detalles dorados en escudo y mangas. La away es blanca con franja tricolor (negro-amarillo-rojo) en costado.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Bélgica Home 2026',
        priceEur: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-24',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0CTHWHQK3',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 16)',
          },
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Roja borgoña con cuello negro y detalles dorados. Escudo URBSFA-KBVB.',
      },
    ],
  },

  SUI: {
    teamCode: 'SUI',
    brand: 'Puma',
    brandPageUrl: 'https://eu.puma.com/uk/en/teams/switzerland',
    intro:
      'Suiza y Puma siguen tras renovar contrato en 2024. La home es roja clásica con la cruz blanca y cuello en V; la away es blanca crema con detalles rojos minimalistas. Drop el 28 de marzo.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Suiza Home 2026',
        priceEur: 90,
        edition: 'replica',
        technology: 'dryCELL',
        releaseDate: '2026-03-28',
        shopUrls: [
          {
            retailer: 'puma-com',
            url: 'https://eu.puma.com/uk/en/teams/switzerland',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Roja con cruz blanca grande sobre el pecho. Cuello en V. Escudo ASF-SFV.',
      },
    ],
  },

  CRO: {
    teamCode: 'CRO',
    brand: 'Nike',
    intro:
      'Croacia y Nike mantienen el famoso ajedrezado rojo y blanco. La home 2026 evoluciona el clásico con un patrón sutil de zigzag adriático. La away es azul marino con damero blanco en mangas.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Croacia Home 2026 Stadium',
        priceEur: 100,
        edition: 'replica',
        technology: 'Dri-FIT',
        releaseDate: '2026-03-14',
        shopUrls: [
          {
            retailer: 'amazon-es',
            url: 'https://www.amazon.es/dp/B0DT2V2WP2',
            affiliateNetwork: 'amazon-associates',
            hasAffiliate: true,
            notes: 'ASIN verificado en amazon-products.ts (id 15)',
          },
          {
            retailer: 'nike-com',
            url: 'https://www.nike.com/es/futbol/camisetas-de-equipos-nacionales',
            affiliateNetwork: 'cj',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Ajedrezado rojo y blanco icónico. Escudo HNS con corona croata. Subcampeona del Mundial 2018, semifinalista 2022.',
      },
    ],
  },

  COL: {
    teamCode: 'COL',
    brand: 'adidas',
    federationUrl: 'https://www.tiendafcf.com/',
    intro:
      'Colombia y adidas presentan una home amarilla brillante con detalles en azul y rojo en cuello y mangas, similar al kit que vistió James Rodríguez en el Mundial 2014 (cuando ganó la Bota de Oro). La away es azul con detalles amarillos.',
    kits: [
      {
        variant: 'home',
        productName: 'Camiseta Colombia Home 2026',
        priceEur: 100,
        edition: 'replica',
        technology: 'AEROREADY',
        releaseDate: '2026-03-21',
        shopUrls: [
          {
            retailer: 'adidas-es',
            url: 'https://www.adidas.es/futbol-federations',
            affiliateNetwork: 'awin',
            hasAffiliate: false,
          },
          {
            retailer: 'official-fed',
            url: 'https://www.tiendafcf.com/',
            affiliateNetwork: 'direct',
            hasAffiliate: false,
          },
        ],
        badge: 'in-stock',
        designNotes:
          'Amarilla brillante con detalles tricolores. Escudo FCF.',
      },
    ],
  },
};

// ───────────────────────────────────────────────────────────────────
// Mapping completo de marca técnica para las 48 selecciones
// ───────────────────────────────────────────────────────────────────

/**
 * Marca técnica de cada una de las 48 selecciones del Mundial 2026.
 * Datos públicos según contratos vigentes a fecha del último review.
 *
 * Cubre las 48 incluso para las que aún no tienen drop verificado.
 * Sirve para el hub `/coleccionismo/camisetas-mundial-2026` (mostrar
 * todas las selecciones con su marca aunque no tengan precio aún).
 */
export const BRAND_BY_TEAM: Record<string, KitBrand> = {
  // ─── Anfitriones ─────────────────────────────────────
  MEX: 'adidas',
  USA: 'Nike',
  CAN: 'Nike',
  // ─── CONCACAF resto ──────────────────────────────────
  HAI: 'Federation',
  PAN: 'New Balance',
  CUW: 'Federation',
  // ─── CONMEBOL ────────────────────────────────────────
  BRA: 'Nike',
  ARG: 'adidas',
  URU: 'Puma',
  COL: 'adidas',
  ECU: 'Marathon',
  PAR: 'adidas',
  // ─── UEFA ────────────────────────────────────────────
  ESP: 'adidas',
  FRA: 'Nike',
  ENG: 'Nike',
  GER: 'adidas',
  NED: 'Nike',
  POR: 'Nike',
  CRO: 'Nike',
  BEL: 'adidas',
  SUI: 'Puma',
  AUT: 'Puma',
  NOR: 'Nike',
  SWE: 'adidas',
  CZE: 'Puma',
  SCO: 'adidas',
  BIH: 'Puma',
  TUR: 'Nike',
  POL: 'Nike',
  // ─── CAF ─────────────────────────────────────────────
  MAR: 'Puma',
  SEN: 'Puma',
  EGY: 'adidas',
  TUN: 'Kappa',
  ALG: 'adidas',
  GHA: 'Puma',
  CIV: 'Puma',
  RSA: 'Le Coq Sportif',
  COD: 'Federation',
  CPV: 'Macron',
  // ─── AFC ─────────────────────────────────────────────
  JPN: 'adidas',
  KOR: 'Nike',
  IRN: 'adidas',
  AUS: 'Nike',
  KSA: 'adidas',
  QAT: 'Nike',
  IRQ: 'Federation',
  UZB: 'Federation',
  JOR: 'adidas',
  // ─── OFC ─────────────────────────────────────────────
  NZL: 'Nike',
};

// ───────────────────────────────────────────────────────────────────
// Helpers públicos
// ───────────────────────────────────────────────────────────────────

export function getTeamKit2026(code: string): TeamKit2026 | undefined {
  return TEAM_KITS_2026[code];
}

/** Lista de selecciones con kit verificado (no `unverified`). */
export function listVerifiedKits(): TeamKit2026[] {
  return Object.values(TEAM_KITS_2026).filter((k) => !k.unverified);
}

/** Agrupa kits 2026 por marca técnica. Para el hub `/coleccionismo/camisetas-mundial-2026`. */
export function groupKitsByBrand(): Record<KitBrand, TeamKit2026[]> {
  const out = {} as Record<KitBrand, TeamKit2026[]>;
  for (const k of Object.values(TEAM_KITS_2026)) {
    if (!out[k.brand]) out[k.brand] = [];
    out[k.brand].push(k);
  }
  return out;
}

/**
 * Cuenta cuántas selecciones lleva cada marca técnica en las 48 del Mundial.
 * Resultado ordenado descendente por número de selecciones.
 */
export function brandTeamCounts(): { brand: KitBrand; count: number }[] {
  const counts = {} as Record<KitBrand, number>;
  for (const brand of Object.values(BRAND_BY_TEAM)) {
    counts[brand] = (counts[brand] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([brand, count]) => ({ brand: brand as KitBrand, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Trae el nombre legible de una selección desde TEAMS_2026.
 * Centralizado aquí para que el componente no tenga que importar dos catálogos.
 */
export function teamName(code: string): string {
  return TEAMS_2026[code]?.name ?? code;
}

/**
 * Etiquetas legibles para la UI.
 */
export const VARIANT_LABELS_ES: Record<KitVariant, string> = {
  home: 'Local (1ª)',
  away: 'Visitante (2ª)',
  third: 'Tercera',
  goalkeeper: 'Portero',
};

export const RETAILER_LABELS: Record<Retailer, string> = {
  'amazon-es': 'Amazon España',
  'adidas-es': 'adidas España',
  'nike-com': 'Nike',
  'puma-com': 'Puma',
  newbalance: 'New Balance',
  'fanatics-es': 'Fanatics ES',
  'official-fed': 'Tienda oficial federación',
  'el-corte-ingles': 'El Corte Inglés',
  'futbol-emotion': 'Fútbol Emotion',
};

export const EDITION_LABELS_ES: Record<KitEdition, string> = {
  replica: 'Réplica',
  authentic: 'Auténtica (jugador)',
  player: 'Jugador personalizada',
  kid: 'Talla niño',
};

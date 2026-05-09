/**
 * Sistema de autoría editorial para noticias e historias.
 *
 * Política editorial actual: las piezas se firman como `Organization`
 * (Mundial de Fútbol). El sitio NO expone autores humanos por defecto.
 *
 * Cuándo usar `Person` (autoría humana):
 *  - Solo cuando se incorpore un colaborador externo con perfil
 *    público verificable (LinkedIn, X, Wikipedia) que SÍ quiera
 *    aparecer firmando piezas concretas.
 *  - Añadir entrada al catálogo `AUTHORS` con `sameAs` rellenado y
 *    referenciar `authorId` solo en las piezas que ese colaborador
 *    firme. Las demás siguen como Organization.
 *
 * Contexto SEO: la filtración Google API Content Warehouse (mayo 2024)
 * documentó `QualityAuthorshipAuthorAttributions`. E-E-A-T premia
 * autoría humana CON perfil verificable; una `Person` con `sameAs`
 * vacío no aporta más que una `Organization` y es preferible no
 * declararla. Por eso el fallback por defecto es Organization.
 */

const SITE_NAME = 'Mundial de Fútbol';
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com'
).trim();

export type Author = {
  /** ID único usado como `authorId` en piezas. Slug sin acentos. */
  id: string;
  /** Nombre completo público. */
  name: string;
  /** URL pública canónica (página /autores/<id> del propio sitio). */
  url: string;
  /** Bio corta (~120 palabras) para la página /autores/<id>. */
  bio: string;
  /** Cargo o rol editorial. */
  jobTitle?: string;
  /** Foto del autor (Wikimedia Commons o /public/authors/<id>.jpg). */
  imageUrl?: string;
  /**
   * Perfiles públicos del autor para construir el `sameAs` del JSON-LD.
   * Si está vacío, NO usar este autor en piezas (mejor `Organization`).
   */
  sameAs: string[];
  /** Áreas de especialidad para SEO topical authority. */
  expertise?: string[];
};

/**
 * Catálogo de autores externos.
 *
 * Vacío por política editorial: el sitio firma todo como Organization.
 * Solo añadir entradas cuando un colaborador externo quiera aparecer
 * firmando piezas con perfil público real (`sameAs` debe tener al
 * menos LinkedIn o X).
 *
 * @example
 *   'colaborador-x': {
 *     id: 'colaborador-x',
 *     name: 'Nombre Apellido',
 *     url: 'https://mundiales-de-futbol.com/autores/colaborador-x',
 *     bio: '...',
 *     sameAs: ['https://www.linkedin.com/in/...', 'https://x.com/...'],
 *   }
 */
export const AUTHORS: Record<string, Author> = {};

/**
 * Devuelve un autor por ID, o `undefined` si no existe en el catálogo
 * o si no se especifica `authorId`. El consumidor debe gestionar el
 * caso `undefined` aplicando el fallback a Organization.
 */
export function getAuthor(authorId?: string): Author | undefined {
  if (!authorId) return undefined;
  return AUTHORS[authorId];
}

/**
 * Construye el objeto JSON-LD para el campo `author`:
 *  - Si `authorId` corresponde a una entrada del catálogo CON `sameAs`
 *    rellenado, devuelve un `Person` enriquecido.
 *  - En cualquier otro caso (sin `authorId`, ID inexistente, o autor
 *    sin `sameAs`), devuelve un `Organization` con el sitio.
 *
 * No emite `Person` con `sameAs` vacío: para E-E-A-T es preferible
 * Organization que Person genérica (la filtración Content Warehouse
 * documenta que Google espera entidades resolubles).
 */
export function authorJsonLd(authorId?: string) {
  const a = getAuthor(authorId);

  // Sin autor o autor sin perfiles → Organization.
  if (!a || a.sameAs.length === 0) {
    return {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    };
  }

  // Autor con perfil verificable → Person enriquecida.
  const obj: Record<string, unknown> = {
    '@type': 'Person',
    name: a.name,
    url: a.url,
    sameAs: a.sameAs,
  };
  if (a.jobTitle) obj.jobTitle = a.jobTitle;
  if (a.imageUrl) obj.image = a.imageUrl;
  if (a.expertise && a.expertise.length > 0) obj.knowsAbout = a.expertise;
  return obj;
}

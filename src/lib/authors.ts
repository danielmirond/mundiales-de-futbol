/**
 * Sistema de autoría humana para noticias e historias.
 *
 * Contexto SEO: la filtración Google API Content Warehouse (mayo 2024)
 * confirmó que Google traquea autoría con `QualityAuthorshipAuthorAttributions`.
 * E-E-A-T: la atribución a una persona real con perfil verificable
 * tiene más peso en ranking que a una organización genérica.
 *
 * Cada pieza editorial (`NewsItem`, `Historia`) debería referenciar
 * un `authorId` que apunta a una de estas entradas. El JSON-LD
 * `Article` / `NewsArticle` emite entonces un `Person` con `sameAs`
 * a los perfiles públicos del autor (LinkedIn, X, Wikipedia si tiene).
 *
 * Para piezas legacy sin `authorId`, el fallback es `Organization`
 * (Mundial de Fútbol) — se mantiene la firma colectiva que tenía el
 * sitio antes.
 */

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
   * Cuanto más completos (LinkedIn + X + redacción + Wikipedia si aplica),
   * mayor señal de autoría según la filtración Content Warehouse.
   */
  sameAs: string[];
  /** Áreas de especialidad para SEO topical authority. */
  expertise?: string[];
};

/**
 * Catálogo de autores. Por ahora un único autor (el editor del sitio).
 * Cuando se incorporen colaboradores externos, añadir aquí.
 *
 * IMPORTANTE: Daniel — completa los `sameAs` con tus URLs públicas
 * reales (LinkedIn, X, Mundo Deportivo si tienes perfil) para activar
 * el efecto E-E-A-T documentado en la filtración.
 */
export const AUTHORS: Record<string, Author> = {
  'daniel-mirond': {
    id: 'daniel-mirond',
    name: 'Daniel Mirón',
    url: 'https://mundiales-de-futbol.com/autores/daniel-mirond',
    bio: 'Periodista de SEO técnico y datos deportivos. Cubre Mundiales de Fútbol con foco en hemeroteca, datos verificables y narrativa lateral. Edita mundiales-de-futbol.com desde 2026.',
    jobTitle: 'Editor jefe',
    sameAs: [
      // TODO Daniel: rellenar con tus URLs reales para máximo E-E-A-T
      // 'https://www.linkedin.com/in/...',
      // 'https://x.com/...',
      // 'https://www.mundodeportivo.com/perfiles/...',
    ],
    expertise: [
      'Mundiales de fútbol',
      'SEO técnico',
      'Datos deportivos',
      'Hemeroteca',
    ],
  },
};

/**
 * Devuelve un autor por ID o el autor por defecto si no se especifica.
 * Si el ID no existe, también devuelve el autor por defecto (resiliente
 * a typos en ediciones manuales del array de noticias/historias).
 */
export function getAuthor(authorId?: string): Author {
  if (authorId && AUTHORS[authorId]) return AUTHORS[authorId];
  return AUTHORS['daniel-mirond'];
}

/**
 * Construye el objeto JSON-LD `Person` para un autor.
 * Si `sameAs` está vacío, omite el campo (mejor que array vacío para
 * Google Rich Results validator).
 */
export function authorJsonLd(authorId?: string) {
  const a = getAuthor(authorId);
  const obj: Record<string, unknown> = {
    '@type': 'Person',
    name: a.name,
    url: a.url,
  };
  if (a.jobTitle) obj.jobTitle = a.jobTitle;
  if (a.imageUrl) obj.image = a.imageUrl;
  if (a.sameAs.length > 0) obj.sameAs = a.sameAs;
  if (a.expertise && a.expertise.length > 0) obj.knowsAbout = a.expertise;
  return obj;
}

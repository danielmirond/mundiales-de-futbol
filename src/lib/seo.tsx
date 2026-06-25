import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

// Defensive `.trim()`: una env var con whitespace accidental (p.ej. \n)
// rompía URLs en sitemap, OG tags y JSON-LD. Trim siempre.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com'
).trim();
const SITE_NAME = 'Mundial de Fútbol';

// Discover-friendly default ratio: 1200×675 (16:9). Matches the historias
// covers and what Google Discover prefers. Si la página no aporta `image`,
// Next.js sirve `app/[locale]/opengraph-image.tsx` automáticamente.
const OG_DEFAULT_W = 1200;
const OG_DEFAULT_H = 675;

export const SEO = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  ogWidth: OG_DEFAULT_W,
  ogHeight: OG_DEFAULT_H,
};

/** Render a JSON-LD `<script>` tag safely for App Router. */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/** Build a localized URL for the canonical/hreflang chain. */
export function localeUrl(locale: string, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === routing.defaultLocale) return `${SITE_URL}${clean === '/' ? '' : clean}`;
  return `${SITE_URL}/${locale}${clean === '/' ? '' : clean}`;
}

/**
 * Build the hreflang `languages` object for `alternates`.
 *
 * Solo emite locales con contenido realmente traducido. Si una página
 * sólo existe en español, devuelve `{ es: ..., 'x-default': ... }` para
 * evitar que Google indexe /en/, /fr/, /pt/, /ar/ como contenido inglés
 * cuando sirven español (hreflang inválido = penalización autoridad).
 */
export function hreflangAlternates(
  path: string,
  availableLocales: readonly string[] = [routing.defaultLocale],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of availableLocales) map[l] = localeUrl(l, path);
  // x-default apunta al default locale (es). Recomendación Google.
  map['x-default'] = localeUrl(routing.defaultLocale, path);
  return map;
}

export type PageImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type PageMetadataOptions = {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: PageImage;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
  /**
   * Locales en los que esta página tiene contenido realmente traducido.
   * Por defecto sólo el español (`['es']`). Si la página tiene traducciones
   * para otros locales (ej. una noticia con `i18n.en` rellenado), pasarlo
   * aquí para emitir el hreflang correcto.
   *
   * Efectos:
   * - Sólo se emiten `<link rel="alternate" hreflang>` para los locales listados.
   * - Si el `locale` actual NO está en `availableLocales`, se aplica
   *   `noindex` automático (la URL existe pero sirve fallback ES y no
   *   queremos que Google la indexe como versión en ese idioma).
   */
  availableLocales?: readonly string[];
};

/**
 * Centralized metadata builder. Use everywhere except the root layout
 * (which sets defaults) and pages that need exotic OG fields.
 *
 * Always emits:
 *   - canonical + hreflang alternates
 *   - robots with `max-image-preview: large` (Discover-friendly)
 *   - Twitter summary_large_image card
 *
 * Cuando `opts.image` no se aporta, NO se inyecta `openGraph.images`:
 * Next.js usará automáticamente `app/[locale]/opengraph-image.tsx`
 * (1200×675 brand fallback dinámico).
 */
export function pageMetadata(opts: PageMetadataOptions): Metadata {
  const url = localeUrl(opts.locale, opts.path);
  const availableLocales = opts.availableLocales ?? [routing.defaultLocale];
  // Auto-noindex: si servimos /en/, /fr/, /pt/, /ar/ pero NO hay traducción
  // real para ese locale en esta página, no queremos que Google la indexe
  // como contenido inglés/francés/etc. (sirve fallback español).
  const localeUntranslated = !availableLocales.includes(opts.locale);
  const shouldNoIndex = opts.noIndex || localeUntranslated;

  const ogImages = opts.image
    ? [
        {
          url: opts.image.url,
          width: opts.image.width ?? OG_DEFAULT_W,
          height: opts.image.height ?? OG_DEFAULT_H,
          alt: opts.image.alt ?? opts.title,
        },
      ]
    : undefined;

  // Canonical apunta a la versión disponible: si el usuario aterriza en
  // /en/ pero solo hay ES, el canonical va a la URL ES (evita duplicidad).
  const canonicalUrl = localeUntranslated
    ? localeUrl(routing.defaultLocale, opts.path)
    : url;

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    robots: shouldNoIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates(opts.path, availableLocales),
    },
    openGraph: {
      type: opts.type ?? 'website',
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      ...(ogImages ? { images: ogImages } : {}),
      ...(opts.type === 'article' && opts.publishedTime
        ? { publishedTime: opts.publishedTime }
        : {}),
      ...(opts.type === 'article' && opts.modifiedTime
        ? { modifiedTime: opts.modifiedTime }
        : {}),
      ...(opts.type === 'article' && opts.authors
        ? { authors: opts.authors }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      ...(opts.image ? { images: [opts.image.url] } : {}),
    },
  };
}

// ─── JSON-LD helpers ─────────────────────────────────────────────

export function organizationLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.svg`,
      width: 512,
      height: 512,
    },
    sameAs: [],
  };
}

export function websiteLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: localeUrl(locale, '/'),
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(
  locale: string,
  crumbs: Crumb[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: localeUrl(locale, c.path),
    })),
  };
}

import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
const SITE_NAME = 'Mundial de Fútbol';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`; // 1200×630 fallback

export const SEO = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  defaultOgImage: DEFAULT_OG_IMAGE,
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

/** Build the full hreflang `languages` object for `alternates`. */
export function hreflangAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((l) => [l, localeUrl(l, path)]),
  );
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
};

/**
 * Centralized metadata builder. Use everywhere except the root layout
 * (which sets defaults) and pages that need exotic OG fields.
 *
 * Always emits:
 *   - canonical + hreflang alternates
 *   - robots with `max-image-preview: large` (Discover-friendly)
 *   - OG image (1200×630 fallback if none provided)
 *   - Twitter summary_large_image card
 */
export function pageMetadata(opts: PageMetadataOptions): Metadata {
  const url = localeUrl(opts.locale, opts.path);
  const image = opts.image ?? {
    url: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  };

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    alternates: {
      canonical: url,
      languages: hreflangAlternates(opts.path),
    },
    openGraph: {
      type: opts.type ?? 'website',
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image.url,
          width: image.width ?? 1200,
          height: image.height ?? 630,
          alt: image.alt ?? opts.title,
        },
      ],
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
      images: [image.url],
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

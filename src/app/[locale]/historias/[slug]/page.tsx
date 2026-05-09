import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ExternalLink, Quote } from 'lucide-react';
import {
  HISTORIAS,
  getHistoria,
  getAdjacent,
  BLOCK_LABELS,
  CATEGORY_LABELS,
  type HistoriaCategory,
} from '@/lib/historias';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo';

const CATEGORY_COLORS: Record<HistoriaCategory, { dot: string; text: string }> = {
  epica: { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  polemica: { dot: 'bg-red-400', text: 'text-red-300' },
  tragica: { dot: 'bg-indigo-400', text: 'text-indigo-300' },
  profetica: { dot: 'bg-amber-400', text: 'text-amber-300' },
  humor: { dot: 'bg-yellow-400', text: 'text-yellow-300' },
  historica: { dot: 'bg-sky-400', text: 'text-sky-300' },
  mixta: { dot: 'bg-fuchsia-400', text: 'text-fuchsia-300' },
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function generateStaticParams() {
  return HISTORIAS.flatMap((h) =>
    routing.locales.map((locale) => ({ locale, slug: h.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const historia = getHistoria(slug);
  if (!historia) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const title = `${historia.title} · Historias del Mundial`;
  const description = historia.excerpt;
  const url =
    locale === routing.defaultLocale
      ? `${siteUrl}/historias/${historia.slug}`
      : `${siteUrl}/${locale}/historias/${historia.slug}`;
  // No declaramos `images` en openGraph ni twitter: Next.js auto-detecta
  // el archivo adyacente `opengraph-image.tsx` y lo sirve con tamaño
  // 1200×675 garantizado. La URL Wikimedia de `historia.cover` se sigue
  // usando como hero visual dentro del cuerpo del artículo (la mayoría
  // no son 16:9 y mentir sobre el tamaño descalifica la pieza para
  // Google Discover).
  return {
    title,
    description,
    // Discover-friendly: max-image-preview:large permite que Google muestre
    // la imagen grande en Discover y SERP enriquecidas.
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}/historias/${historia.slug}`
            : `${siteUrl}/${l}/historias/${historia.slug}`,
        ]),
      ),
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      publishedTime: historia.publishDate,
      authors: ['Mundial de Fútbol'],
      tags: [historia.protagonist, BLOCK_LABELS[historia.blockCode], CATEGORY_LABELS[historia.category]],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const historia = getHistoria(slug);
  if (!historia) notFound();

  const { prev, next } = getAdjacent(slug);
  const colors = CATEGORY_COLORS[historia.category];
  const paragraphs = historia.body.split('\n\n').filter(Boolean);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const articleUrl =
    locale === routing.defaultLocale
      ? `${siteUrl}/historias/${historia.slug}`
      : `${siteUrl}/${locale}/historias/${historia.slug}`;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: historia.title,
    description: historia.excerpt,
    datePublished: historia.publishDate,
    dateModified: historia.publishDate,
    author: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    about: { '@type': 'Person', name: historia.protagonist },
    citation: historia.source.url
      ? [{ '@type': 'CreativeWork', name: historia.source.name, url: historia.source.url }]
      : undefined,
  };

  // Discover-friendly: ImageObject 1200×675 ratio 16:9 servido por
  // el OG dinámico (`opengraph-image.tsx` adyacente). Esto garantiza
  // el ratio correcto en lugar de declarar 1200×675 sobre la URL
  // Wikimedia (que mantiene aspect ratio del archivo original).
  const ogImageUrl =
    locale === routing.defaultLocale
      ? `${siteUrl}/historias/${historia.slug}/opengraph-image`
      : `${siteUrl}/${locale}/historias/${historia.slug}/opengraph-image`;
  jsonLd.image = {
    '@type': 'ImageObject',
    url: ogImageUrl,
    width: 1200,
    height: 675,
    caption: historia.cover?.alt ?? historia.title,
    ...(historia.cover?.credit ? { creditText: historia.cover.credit } : {}),
    ...(historia.cover?.source
      ? {
          license: historia.cover.source,
          acquireLicensePage: historia.cover.source,
        }
      : {}),
  };

  return (
    <article className="relative">
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(255,255,255,0.08), transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/historias')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Historias del Mundial
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            <span className="text-[var(--color-pitch)]">
              {historia.blockCode === 'EFEMERIDE' || historia.blockCode === 'ARRANQUE'
                ? BLOCK_LABELS[historia.blockCode]
                : `Bloque ${historia.blockCode.replace('S', '')} · ${BLOCK_LABELS[historia.blockCode]}`}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
              <span className={colors.text}>{CATEGORY_LABELS[historia.category]}</span>
            </span>
            <span>#{String(historia.n).padStart(2, '0')}</span>
          </div>

          {historia.cover && (
            <figure className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
              <div className="relative aspect-[1200/675]">
                <Image
                  src={historia.cover.url}
                  alt={historia.cover.alt}
                  fill
                  priority
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-[var(--color-border)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <span>{historia.cover.credit}</span>
                <span>{historia.cover.license}</span>
              </figcaption>
            </figure>
          )}

          <Quote className="mt-12 h-10 w-10 text-[var(--color-pitch)] opacity-50" />

          <blockquote className="mt-4 font-display text-fluid-h1 leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
            «{historia.quote}»
          </blockquote>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-2xl uppercase text-[var(--color-fg)] md:text-3xl">
              {historia.protagonist}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {historia.quoteDate}
            </span>
          </div>
        </div>
      </section>

      {/* Title + excerpt */}
      <section className="mx-auto w-full max-w-[760px] px-6 pb-12 md:px-10">
        <h1 className="font-display text-fluid-h2 uppercase leading-[0.95]">{historia.title}</h1>
        <p className="mt-6 text-lg italic leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {historia.excerpt}
        </p>
      </section>

      {/* Body */}
      <section className="mx-auto w-full max-w-[760px] px-6 pb-16 md:px-10 md:pb-24">
        <div className="prose-historia space-y-6 text-base leading-[1.75] text-[var(--color-fg)]/90 md:text-lg md:leading-[1.8]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Context + sources */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-20 md:px-10">
        <div className="grid gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:grid-cols-2 md:p-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Contexto histórico
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
              {historia.context}
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Fuentes
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-fg-muted)]">
              <li>
                {historia.source.url ? (
                  <a
                    href={historia.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 underline decoration-[var(--color-fg-subtle)] underline-offset-4 transition-colors hover:text-[var(--color-fg)] hover:decoration-[var(--color-fg)]"
                  >
                    <span>{historia.source.name}</span>
                    <ExternalLink className="mt-1 h-3 w-3 flex-shrink-0" />
                  </a>
                ) : (
                  <span>{historia.source.name}</span>
                )}
              </li>
              {historia.sourceSecondary && (
                <li className="text-[var(--color-fg-subtle)]">
                  Cruzada con: {historia.sourceSecondary}
                </li>
              )}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              <span>Nivel de certeza</span>
              <span className="text-[var(--color-fg)]">{historia.certainty}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prev/next nav */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24 md:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link
              href={withLocale(locale as Locale, `/historias/${prev.slug}`)}
              className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-2)]"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Anterior
              </span>
              <span className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                {prev.protagonist}
              </span>
              <span className="line-clamp-2 text-sm italic text-[var(--color-fg-muted)]">
                «{prev.quote}»
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={withLocale(locale as Locale, `/historias/${next.slug}`)}
              className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] p-6 text-right transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-2)] md:items-end"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Siguiente <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </span>
              <span className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                {next.protagonist}
              </span>
              <span className="line-clamp-2 text-sm italic text-[var(--color-fg-muted)]">
                «{next.quote}»
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>

        <div className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Publicado el {fmtDate(historia.publishDate)}
        </div>
      </section>
    </article>
  );
}

import Image from 'next/image';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import {
  buildAmazonUrl,
  buildAmazonImage,
  formatPrice,
  CATEGORY_LABELS,
  type AmazonProduct,
} from '@/lib/amazon-products';

/**
 * Tarjeta de afiliado Amazon.
 *
 * Cumplimiento legal y SEO:
 *  - rel="sponsored nofollow noopener noreferrer" (Google Search Central
 *    recomienda "sponsored" desde 2019, antes era solo "nofollow").
 *  - target="_blank" para no perder al usuario.
 *  - Disclosure visible: "Enlace de afiliado".
 *
 * Foto del producto (cuando existe `product.imageId`):
 *  - Imagen Amazon CDN servida vía m.media-amazon.com
 *  - Filtro duotone verde con la marca: imagen en grayscale + overlay
 *    `var(--color-pitch)` con mix-blend-mode multiply. Mantiene la
 *    silueta del producto reconocible mientras integra el branding.
 */
function ProductImage({ product }: { product: AmazonProduct }) {
  if (!product.imageId) return null;
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-pitch)]">
      <Image
        src={buildAmazonImage(product.imageId, 500)}
        alt={product.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover grayscale contrast-110 mix-blend-multiply"
        unoptimized
      />
      {/* Glow verde sutil en hover para reforzar branding */}
      <div className="absolute inset-0 bg-[var(--color-pitch)]/20 mix-blend-overlay opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function AmazonCard({
  product,
  variant = 'default',
}: {
  product: AmazonProduct;
  variant?: 'default' | 'compact' | 'featured';
}) {
  const url = buildAmazonUrl(product);
  const priceLabel = formatPrice(product.priceMin, product.priceMax);

  if (variant === 'compact') {
    return (
      <a
        href={url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]/40"
      >
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            {CATEGORY_LABELS[product.category]} · Amazon
          </div>
          <div className="mt-1 truncate text-sm font-medium text-[var(--color-fg)]">
            {product.title}
          </div>
        </div>
        <div className="flex flex-shrink-0 items-baseline gap-2">
          <span className="font-mono text-sm tab-num text-[var(--color-pitch)]">{priceLabel}</span>
          <ExternalLink className="h-3 w-3 text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]" />
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-3xl border p-6 transition-colors md:p-7 ${
        variant === 'featured'
          ? 'border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] hover:border-[var(--color-pitch)]/50'
          : 'border-[var(--color-border)] bg-[var(--color-bg-2)] hover:border-[var(--color-border-strong)]'
      }`}
    >
      {variant === 'featured' && (
        <span className="absolute right-5 top-5 z-10 rounded-full bg-[var(--color-pitch)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-black">
          Destacado
        </span>
      )}

      <ProductImage product={product} />

      <div className="flex items-center gap-3">
        <ShoppingCart className="h-4 w-4 text-[var(--color-pitch)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {CATEGORY_LABELS[product.category]} · Amazon
        </span>
      </div>

      <h3 className="font-display text-xl uppercase leading-tight text-[var(--color-fg)] md:text-2xl">
        {product.title}
      </h3>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl tab-num text-[var(--color-pitch)] md:text-4xl">
          {priceLabel}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          aprox.
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-pitch)]">
          Comprar en Amazon
          <ExternalLink className="h-3 w-3" />
        </span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]"
          title="Recibimos una pequeña comisión sin coste para ti"
        >
          Enlace de afiliado
        </span>
      </div>
    </a>
  );
}

export function AmazonProductGrid({
  products,
  variant = 'default',
  title,
  subtitle,
}: {
  products: AmazonProduct[];
  variant?: 'default' | 'compact';
  title?: string;
  subtitle?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      {(title || subtitle) && (
        <header className="mb-10">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <ShoppingCart className="h-4 w-4" />
            <span>Tienda · Amazon</span>
          </div>
          {title && (
            <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
              {subtitle}
            </p>
          )}
        </header>
      )}

      <div
        className={
          variant === 'compact'
            ? 'space-y-3'
            : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5'
        }
      >
        {products.map((p) => (
          <AmazonCard key={p.id} product={p} variant={variant === 'compact' ? 'compact' : p.featured ? 'featured' : 'default'} />
        ))}
      </div>

      {/* Disclosure global de la sección */}
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--color-fg-subtle)]">
        Este sitio participa en el Programa de Afiliados de Amazon EU.
        Cuando compras a través de un enlace marcado como «Enlace de afiliado»
        recibimos una pequeña comisión sin coste adicional para ti.
        {' '}
        <a
          href="/aviso-afiliados"
          className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-fg-muted)]"
        >
          Más información
        </a>
        .
      </p>
    </section>
  );
}

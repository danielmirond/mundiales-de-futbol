import Image from 'next/image';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import {
  buildAmazonUrl,
  buildAmazonImage,
  formatPrice,
  getProductByAsin,
  getProductById,
  type AmazonProduct,
} from '@/lib/amazon-products';

/**
 * Widget pequeño de venta (buy box) para un único producto de Amazon.
 *
 * Pensado para incrustar dentro de páginas y artículos:
 *   <AmazonBuyWidget asin="B0GXFB4BJ5" />
 *   <AmazonBuyWidget id={75} heading="El regalo perfecto" />
 *   <AmazonBuyWidget product={producto} />
 *
 * Usa el tag de afiliado global (`nuus-21`) vía buildAmazonUrl y cumple:
 *  - rel="sponsored nofollow noopener noreferrer"
 *  - target="_blank"
 *  - disclosure visible + enlace a /aviso-afiliados
 *
 * Si el producto no se encuentra (asin/id inexistente) no renderiza nada.
 */
export function AmazonBuyWidget({
  asin,
  id,
  product,
  heading,
  cta = 'Comprar en Amazon',
}: {
  asin?: string;
  id?: number;
  product?: AmazonProduct;
  heading?: string;
  cta?: string;
}) {
  const p =
    product ??
    (asin ? getProductByAsin(asin) : undefined) ??
    (id != null ? getProductById(id) : undefined);

  if (!p) return null;

  const url = buildAmazonUrl(p);
  const priceLabel = formatPrice(p.priceMin, p.priceMax);
  const imgSrc = p.imageId ? buildAmazonImage(p.imageId, 300) : null;

  return (
    <aside className="my-8 overflow-hidden rounded-3xl border border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)]">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        {/* Imagen (opcional) */}
        {imgSrc && (
          <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-2xl bg-white sm:h-28 sm:w-28">
            <Image
              src={imgSrc}
              alt={p.title}
              fill
              sizes="(max-width: 640px) 100vw, 112px"
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        {/* Texto */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{heading ?? 'Tienda · Amazon'}</span>
          </div>
          <h3 className="mt-2 font-display text-lg uppercase leading-tight text-[var(--color-fg)] sm:text-xl">
            {p.title}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl tab-num text-[var(--color-pitch)]">
              {priceLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              aprox.
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <a
            href={url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03]"
          >
            {cta}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <span
            className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] sm:text-right"
            title="Recibimos una pequeña comisión sin coste para ti"
          >
            Enlace de afiliado ·{' '}
            <a href="/aviso-afiliados" className="underline underline-offset-2 hover:text-[var(--color-fg-muted)]">
              info
            </a>
          </span>
        </div>
      </div>
    </aside>
  );
}

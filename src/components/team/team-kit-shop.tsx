import Link from 'next/link';
import { ArrowRight, ExternalLink, ShoppingBag, Shirt } from 'lucide-react';
import { getTeamKit, type KitBrand } from '@/lib/team-kit-2026';
import { getAmazonKit2026 } from '@/lib/wc-jerseys';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Sección "Camiseta y equipación · Mundial 2026" para la página de
 * cada selección.
 *
 * Renderiza:
 *  - Marca técnica oficial 2026 (Adidas, Nike, Puma, etc.)
 *  - CTA al shop oficial con `rel="sponsored noopener noreferrer"`
 *  - Link interno a la histórica de camisetas (`/selecciones/<code>/camisetas`)
 *  - Nota editorial cuando aplique (cambio de proveedor, debut, etc.)
 *  - Aviso "verificación pendiente" cuando `verified === 'estimated'`
 *
 * Si la selección no está en el catálogo (no juega el Mundial 2026 o
 * faltan datos), el componente devuelve `null` y el render no produce
 * sección.
 */

type Props = {
  teamCode: string;
  teamName: string;
  locale: Locale;
  /** Si la selección tiene página dedicada de evolución de camisetas. */
  hasJerseyHistory?: boolean;
};

const BRAND_GRADIENT: Record<KitBrand, string> = {
  Adidas: 'from-white/10 via-white/5 to-transparent border-white/20',
  Nike: 'from-orange-500/15 via-orange-500/5 to-transparent border-orange-500/30',
  Puma: 'from-red-500/15 via-red-500/5 to-transparent border-red-500/30',
  Hummel: 'from-blue-500/15 via-blue-500/5 to-transparent border-blue-500/30',
  Kappa: 'from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/30',
  Kelme: 'from-yellow-500/15 via-yellow-500/5 to-transparent border-yellow-500/30',
  Castore: 'from-slate-400/15 via-slate-400/5 to-transparent border-slate-400/30',
  Joma: 'from-blue-600/15 via-blue-600/5 to-transparent border-blue-600/30',
  Marathon: 'from-yellow-400/15 via-yellow-400/5 to-transparent border-yellow-400/30',
  Macron: 'from-red-700/15 via-red-700/5 to-transparent border-red-700/30',
  'New Balance': 'from-pink-500/15 via-pink-500/5 to-transparent border-pink-500/30',
  Saller: 'from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30',
  Majid: 'from-green-700/15 via-green-700/5 to-transparent border-green-700/30',
  '7Saber': 'from-cyan-500/15 via-cyan-500/5 to-transparent border-cyan-500/30',
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function TeamKitShop({
  teamCode,
  teamName,
  locale,
  hasJerseyHistory = false,
}: Props) {
  const kit = getTeamKit(teamCode);
  if (!kit) return null;

  const gradient = BRAND_GRADIENT[kit.brand];
  const isEstimated = kit.verified === 'estimated';
  // CTA Amazon afiliado para la camiseta 2026 de esta selección.
  // `searchUrl` siempre; `product` solo cuando el script de enriquecimiento
  // encontró un match verificado en Amazon ES.
  const amazon = getAmazonKit2026(teamCode, teamName, kit.brand);

  return (
    <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        <Shirt className="inline h-3 w-3 mr-2" />
        Camiseta y equipación · Mundial 2026
      </div>
      <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
        {teamName} viste {kit.brand} en este Mundial
      </h2>

      <div
        className={`mt-8 grid gap-px overflow-hidden rounded-3xl border bg-gradient-to-br ${gradient}`}
      >
        <div className="bg-[var(--color-bg-2)] p-7 md:p-9">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                Marca técnica oficial
              </div>
              <div className="mt-2 font-display text-5xl uppercase leading-none text-[var(--color-fg)] md:text-6xl">
                {kit.brand}
              </div>
              {kit.note && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {kit.note}
                </p>
              )}
              {isEstimated && (
                <p className="mt-3 max-w-xl font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
                  Verificación pendiente · proveedor estimado por contrato histórico
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 md:flex-col md:items-stretch">
              <a
                href={kit.shopUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="group inline-flex items-center justify-between gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-black transition-opacity hover:opacity-90"
              >
                Shop oficial {kit.brand}
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* CTA Amazon afiliado: si tenemos match verificado mostramos
                  el producto; si no, búsqueda genérica. `rel="sponsored"`
                  por política Amazon Associates. */}
              <a
                href={amazon.product?.productUrl ?? amazon.searchUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="group inline-flex items-center justify-between gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingBag className="h-3 w-3" />
                  {amazon.product ? 'Comprar en Amazon' : 'Buscar en Amazon'}
                </span>
                <ExternalLink className="h-3 w-3" />
              </a>

              {hasJerseyHistory && (
                <Link
                  href={withLocale(locale, `/selecciones/${teamCode}/camisetas`)}
                  className="group inline-flex items-center justify-between gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  Histórica camisetas
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </Link>
              )}
            </div>
          </div>

          {/* Mini-card del producto Amazon cuando hay match verificado.
              Es la "vitrina" visual: foto + título + CTA explícito. */}
          {amazon.product && (
            <a
              href={amazon.product.productUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-7 group flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 pr-5 transition-colors hover:border-[var(--color-pitch)]"
            >
              <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={amazon.product.imageUrl}
                  alt={amazon.product.title}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                  Réplica disponible
                </span>
                <span className="mt-0.5 block truncate text-sm font-medium text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                  {amazon.product.title}
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  Amazon · ASIN {amazon.product.asin}
                </span>
              </span>
              <span className="hidden shrink-0 items-center gap-1 rounded-full bg-[var(--color-pitch)] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-black group-hover:opacity-90 md:inline-flex">
                Comprar
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--color-fg-subtle)]">
        El enlace al shop oficial lleva al hub de federaciones de la marca, no a una réplica concreta. Disponibilidad de la equipación 2026 sujeta al lanzamiento oficial de la federación. Algunas selecciones pueden lanzar su kit definitivo entre mayo y junio de 2026.
      </p>
    </section>
  );
}

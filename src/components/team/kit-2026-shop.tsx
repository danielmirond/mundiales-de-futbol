import { ExternalLink, ShoppingCart, ShieldCheck, Sparkles } from 'lucide-react';
import {
  type TeamKit2026,
  type Kit2026,
  type ShopUrl,
  buildShopUrl,
  VARIANT_LABELS_ES,
  RETAILER_LABELS,
  EDITION_LABELS_ES,
} from '@/lib/team-kit-2026';

/**
 * Bloque de camisetas oficiales del Mundial 2026 con enfoque a conversión.
 *
 * Renderiza:
 *  1. Cabecera con marca técnica + intro editorial.
 *  2. Una card por kit (home / away / third / GK) con:
 *     - Nombre comercial + edición + tecnología
 *     - Precio RRP en EUR/USD si está disponible
 *     - Múltiples retailers como CTAs (Amazon, marca, federación)
 *     - Notas de diseño editoriales
 *  3. Disclosure de afiliados (rel="sponsored nofollow").
 *
 * Pensado para insertarse en `/selecciones/{code}/camisetas` ANTES del
 * histórico de jerseys, capturando intent de compra alto.
 */

export function Kit2026Shop({ kit }: { kit: TeamKit2026 }) {
  if (kit.unverified || kit.kits.length === 0) return null;

  return (
    <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        <Sparkles className="h-3 w-3" />
        <span>Camiseta oficial Mundial 2026</span>
      </div>

      <header className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <h2 className="font-display text-3xl uppercase md:text-4xl">
          Kit oficial 2026 ·{' '}
          <span className="text-[var(--color-pitch)]">{kit.brand}</span>
        </h2>
        {kit.brandPageUrl && (
          <a
            href={kit.brandPageUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] underline-offset-4 hover:text-[var(--color-pitch)] hover:underline"
          >
            Ver en {kit.brand} ↗
          </a>
        )}
      </header>

      <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
        {kit.intro}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {kit.kits.map((k) => (
          <KitCard key={k.variant} kit={k} brand={kit.brand} />
        ))}
      </div>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        Precios RRP oficiales de marca técnica. La afiliación con Amazon España
        (<code>nuus-21</code>) está activa; los demás retailers se mostrarán
        con afiliación de Awin / CJ Affiliate cuando se completen las altas.
        Detalles en{' '}
        <a href="/aviso-afiliados" className="underline">
          aviso de afiliados
        </a>
        .
      </p>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────
// Card individual por kit
// ───────────────────────────────────────────────────────────────────

function KitCard({ kit, brand }: { kit: Kit2026; brand: string }) {
  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {VARIANT_LABELS_ES[kit.variant]}
          </div>
          <h3 className="mt-2 font-display text-xl uppercase leading-[1.05] md:text-2xl">
            {kit.productName}
          </h3>
        </div>
        {kit.badge && <Badge value={kit.badge} />}
      </div>

      {/* Meta-data row */}
      <dl className="mt-5 grid grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
        <div>
          <dt className="text-[var(--color-fg-subtle)]">Edición</dt>
          <dd className="mt-1 text-[var(--color-fg)]">
            {EDITION_LABELS_ES[kit.edition]}
          </dd>
        </div>
        {kit.technology && (
          <div>
            <dt className="text-[var(--color-fg-subtle)]">Tecnología</dt>
            <dd className="mt-1 text-[var(--color-fg)]">{kit.technology}</dd>
          </div>
        )}
        {kit.priceEur != null && (
          <div>
            <dt className="text-[var(--color-fg-subtle)]">Precio RRP</dt>
            <dd className="mt-1 font-display text-2xl tab-num text-[var(--color-pitch)]">
              {kit.priceEur} €
            </dd>
          </div>
        )}
        {kit.releaseDate && (
          <div>
            <dt className="text-[var(--color-fg-subtle)]">Lanzamiento</dt>
            <dd className="mt-1 text-[var(--color-fg)]">
              {formatReleaseDate(kit.releaseDate)}
            </dd>
          </div>
        )}
      </dl>

      {/* Design notes */}
      {kit.designNotes && (
        <p className="mt-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {kit.designNotes}
        </p>
      )}

      {/* CTAs por retailer */}
      <div className="mt-6 space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Comprar en
        </div>
        <div className="flex flex-col gap-2">
          {kit.shopUrls.map((s, i) => (
            <ShopButton key={`${s.retailer}-${i}`} shop={s} primary={i === 0} brand={brand} />
          ))}
        </div>
      </div>
    </article>
  );
}

// ───────────────────────────────────────────────────────────────────
// Botón individual con disclosure de afiliación
// ───────────────────────────────────────────────────────────────────

function ShopButton({
  shop,
  primary,
  brand,
}: {
  shop: ShopUrl;
  primary: boolean;
  brand: string;
}) {
  const href = buildShopUrl(shop);
  const label = RETAILER_LABELS[shop.retailer];

  // Estilos: el primer retailer (mayor comisión) destaca como CTA primario.
  const className = primary
    ? 'group inline-flex items-center justify-between gap-3 rounded-full bg-[var(--color-pitch)] px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01]'
    : 'group inline-flex items-center justify-between gap-3 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm transition-colors hover:border-[var(--color-pitch)]';

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        {label}
        {shop.hasAffiliate && (
          <ShieldCheck
            aria-label="Afiliación activa"
            className="h-3.5 w-3.5 text-current opacity-70"
          />
        )}
      </span>
      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
    </a>
  );
}

// ───────────────────────────────────────────────────────────────────
// Badge
// ───────────────────────────────────────────────────────────────────

function Badge({ value }: { value: NonNullable<Kit2026['badge']> }) {
  const map: Record<NonNullable<Kit2026['badge']>, { label: string; bg: string }> = {
    limited: { label: 'Edición limitada', bg: '#cc4d00' },
    'authentic-only': { label: 'Solo authentic', bg: '#1a1a1a' },
    preorder: { label: 'Pre-order', bg: '#5b54a8' },
    'in-stock': { label: 'En stock', bg: '#0a8458' },
    discounted: { label: 'Rebajada', bg: '#b00020' },
  };
  const v = map[value];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white"
      style={{ background: v.bg }}
    >
      {v.label}
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────
// Helpers de presentación
// ───────────────────────────────────────────────────────────────────

function formatReleaseDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

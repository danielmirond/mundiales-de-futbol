'use client';

/**
 * MovistarBanner — afiliado Movistar Plus+ / Copa Mundial FIFA 2026™
 *
 * Creative oficial: imágenes CDN de movistarplus.es
 * Copy oficial: "VIVE AL COMPLETO LA COPA MUNDIAL DE LA FIFA 2026™"
 *
 * Variantes:
 *  · cintillo → creative oficial M+ (imagen + copy). Para artículos y grupos.
 *  · card     → tarjeta con contexto de partido específico
 *  · sticky   → barra inferior fija (layout global), descartable
 *  · strip    → franja horizontal entre secciones
 *
 * Afiliación: AWIN 2898755 / Movistar Plus+ 114230
 * Compliance: rel="sponsored nofollow noopener noreferrer"
 * Disclosure: label visible + /aviso-afiliados
 *
 * Tono Movistar Plus+: cercano, tuteo, RRSS, sencillo, sin gritar.
 */

import { useEffect, useState } from 'react';
import { X, Tv2, Play } from 'lucide-react';

// ── Constantes oficiales ──────────────────────────────────────────────────────

/** URL genérica del Mundial en M+ (fallback cuando no hay ficha de partido) */
const DEFAULT_HREF =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol%2Fmundial';

/**
 * Imágenes del cintillo oficial (CDN movistarplus.es)
 * Fuente: widget HTML oficial Movistar Plus+ jun 2026
 */
const M_IMG = {
  desktop: 'https://www.movistarplus.es/recorte/e/original/dd27c37a41ecbdae12841fd27ce6c744',
  mobile:  'https://www.movistarplus.es/recorte/e/original/e59ce4c0e93291e975ee4ad2bb744022',
  bg:      'https://www.movistarplus.es/recorte/e/original/84e62c08fdf5ad3e79deab3d4d7991c3',
};

/** Datos de prensa verificados (PDF Movistar Plus+, jun 2026) */
const M_PRICE   = '9,99 €/mes';
const M_TAGLINE = 'La Casa del Fútbol';

const DISMISS_KEY  = 'mdf_movistar_dismissed';
const DISMISS_DAYS = 3;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isDismissed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  return Date.now() - parseInt(raw, 10) < DISMISS_DAYS * 86_400_000;
}

function dismiss() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

// ── Disclosure ────────────────────────────────────────────────────────────────

function TAndC({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[10px] leading-relaxed ${className}`}>
      Enlace de afiliado · AWIN · Al contratar a través de este enlace recibimos
      una comisión sin coste adicional para ti.{' '}
      <a
        href="/aviso-afiliados"
        className="underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
      >
        Más info
      </a>
      .
    </p>
  );
}

// ── Variant: CINTILLO OFICIAL ─────────────────────────────────────────────────
/**
 * Reproduce el cintillo oficial de Movistar Plus+ usando su creative y copy.
 * Wrappea el enlace con AWIN para tracking de afiliado.
 */
function CintilloBanner({ href, context }: { href: string; context?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="group relative flex overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-white/20"
      aria-label="Ver la Copa Mundial FIFA 2026 en Movistar Plus+"
      style={{
        backgroundImage: `url(${M_IMG.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/40" />

      {/* Imagen oficial responsive */}
      <div className="relative z-10 shrink-0">
        <picture>
          <source
            srcSet={M_IMG.mobile}
            media="(max-width: 768px)"
          />
          <img
            loading="lazy"
            src={M_IMG.desktop}
            alt="La Copa Mundial de la FIFA 2026™ al completo en Movistar Plus+"
            title="La Copa Mundial de la FIFA 2026™ al completo en Movistar Plus+"
            width={295}
            height={251}
            className="h-auto w-[120px] object-contain md:w-[160px] transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </picture>
      </div>

      {/* Texto */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-2 px-5 py-5 md:px-6">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">
          <Tv2 className="h-3 w-3" />
          {context
            ? <span>{context} · Movistar Plus+</span>
            : <span>{M_TAGLINE}</span>
          }
        </div>

        {/* Copy oficial */}
        <p className="text-lg font-black uppercase leading-tight tracking-tight text-white md:text-xl">
          {context ? (
            <>
              Sigue {context}<br />
              <span className="text-base font-bold normal-case text-white/80">
                en directo en Movistar Plus+
              </span>
            </>
          ) : (
            <>
              Vive al completo<br />
              <span className="text-white/90">la Copa Mundial FIFA 2026™</span>
            </>
          )}
        </p>

        {/* Price + CTA */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black transition-all group-hover:bg-white/90">
            <Play className="h-3 w-3 fill-black" />
            Ver en Movistar Plus+
          </span>
          <span className="font-mono text-[10px] text-white/50">
            DAZN · desde {M_PRICE}
          </span>
        </div>

        <TAndC className="mt-1 text-white/25" />
      </div>
    </a>
  );
}

// ── Variant: CARD (contexto de partido) ──────────────────────────────────────

function CardBanner({ href, context }: { href: string; context?: string }) {
  return (
    <aside
      aria-label="Movistar Plus+ — ver el partido"
      className="overflow-hidden rounded-2xl border border-white/10 bg-black"
    >
      {/* Hero image con overlay */}
      <div
        className="relative flex h-24 items-end overflow-hidden px-5 pb-4"
        style={{
          backgroundImage: `url(${M_IMG.bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Logo image pequeño */}
        <picture className="relative z-10 mr-3">
          <source srcSet={M_IMG.mobile} media="(max-width: 768px)" />
          <img
            src={M_IMG.desktop}
            alt=""
            aria-hidden
            width={60}
            height={51}
            className="h-auto w-[60px] object-contain opacity-90"
          />
        </picture>

        <div className="relative z-10">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">
            {context ? `${context} ·` : ''} Movistar Plus+
          </div>
          <p className="text-sm font-bold uppercase leading-tight text-white">
            {context ? 'Ver en directo' : 'Copa Mundial FIFA 2026™'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-4">
        <p className="text-sm leading-relaxed text-white/70">
          {context
            ? `¿Quieres ver ${context} en vivo? Lo tienes en Movistar Plus+ vía DAZN. Los 104 partidos, sin excepción.`
            : `Los 104 partidos del Mundial 2026 a través de DAZN, en Movistar Plus+. Sin perderte uno. Desde ${M_PRICE}.`}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            DAZN + Movistar Plus+
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            desde {M_PRICE}
          </span>
        </div>

        <a
          href={href}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5
                     text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[.98]"
        >
          <Tv2 className="h-4 w-4" />
          {context ? `Ver ${context} en M+` : 'Suscribirse a Movistar Plus+'}
        </a>

        <TAndC className="mt-3 text-white/30" />
      </div>
    </aside>
  );
}

// ── Variant: STICKY (barra inferior global) ───────────────────────────────────

function StickyBanner({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isDismissed()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="complementary"
      aria-label="Oferta Movistar Plus+ — Copa Mundial FIFA 2026"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 bg-black px-4 py-3 shadow-2xl
                 border-t border-white/10 md:px-6"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {/* Miniatura oficial */}
      <picture className="hidden shrink-0 sm:block">
        <source srcSet={M_IMG.mobile} media="(max-width: 768px)" />
        <img
          src={M_IMG.desktop}
          alt=""
          aria-hidden
          width={44}
          height={38}
          className="h-auto w-[44px] object-contain rounded-md opacity-90"
        />
      </picture>

      {/* Copy */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="truncate text-sm font-bold leading-tight text-white">
          Copa Mundial FIFA 2026™ al completo
        </span>
        <span className="hidden text-white/30 sm:inline">·</span>
        <span className="truncate text-xs text-white/60">
          104 partidos en Movistar Plus+ vía DAZN · {M_PRICE}
        </span>
      </div>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        onClick={() => dismiss()}
        className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black
                   transition-all hover:bg-white/90 active:scale-95 whitespace-nowrap"
      >
        Ver cómo
      </a>

      {/* Dismiss */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => { dismiss(); setVisible(false); }}
        className="shrink-0 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Variant: STRIP ────────────────────────────────────────────────────────────

function StripBanner({ href, context }: { href: string; context?: string }) {
  return (
    <div
      className="relative overflow-hidden border-y border-white/10"
      style={{
        backgroundImage: `url(${M_IMG.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-start gap-5
                      px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        {/* Left: logo + copy */}
        <div className="flex items-center gap-4">
          <picture className="shrink-0">
            <source srcSet={M_IMG.mobile} media="(max-width: 768px)" />
            <img
              src={M_IMG.desktop}
              alt="Movistar Plus+"
              width={70}
              height={60}
              className="h-auto w-[70px] object-contain"
            />
          </picture>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">
              {context ? `${context} ·` : ''} {M_TAGLINE}
            </div>
            <p className="text-base font-black uppercase leading-tight text-white md:text-lg">
              {context
                ? `Sigue ${context} en directo`
                : 'Vive al completo la Copa Mundial FIFA 2026™'}
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              104 partidos via DAZN · desde {M_PRICE}
            </p>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex shrink-0 flex-col items-start gap-1.5 md:items-end">
          <a
            href={href}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold
                       text-black transition-all hover:bg-white/90 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            Suscribirse a Movistar Plus+
          </a>
          <TAndC className="text-white/25 md:text-right" />
        </div>
      </div>
    </div>
  );
}

// ── Exports públicos ──────────────────────────────────────────────────────────

/**
 * Cintillo oficial con creative de Movistar Plus+.
 * Ideal para artículos de partido, grupos y calendario.
 *
 * ```tsx
 * <MovistarCintillo context="España vs Cabo Verde" href="https://awin..." />
 * <MovistarCintillo /> // genérico
 * ```
 */
export function MovistarCintillo({
  href = DEFAULT_HREF,
  context,
}: {
  href?: string;
  context?: string;
}) {
  return <CintilloBanner href={href} context={context} />;
}

/**
 * Tarjeta inline compacta.
 * Usa context para copy específico de partido.
 */
export function MovistarCard({
  href = DEFAULT_HREF,
  context,
}: {
  href?: string;
  context?: string;
}) {
  return <CardBanner href={href} context={context} />;
}

/**
 * Barra sticky inferior — en el layout global.
 */
export function MovistarStickyBar({ href = DEFAULT_HREF }: { href?: string }) {
  return <StickyBanner href={href} />;
}

/**
 * Franja entre secciones de contenido.
 */
export function MovistarStrip({
  href = DEFAULT_HREF,
  context,
}: {
  href?: string;
  context?: string;
}) {
  return <StripBanner href={href} context={context} />;
}

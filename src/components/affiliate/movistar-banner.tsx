'use client';

/**
 * MovistarBanner — afiliado Movistar Plus+ / Mundial 2026
 *
 * Variantes:
 *  · sticky  → barra inferior fija en toda la web (layout global)
 *  · card    → tarjeta inline para grupos, partidos, artículos
 *  · strip   → franja horizontal entre secciones de contenido
 *
 * Afiliación: AWIN 2898755 / Movistar Plus+ 114230
 * Cumplimiento: rel="sponsored nofollow noopener noreferrer"
 * Disclosure visible + enlace /aviso-afiliados en T&C
 *
 * Tono: natural, cercano, tuteo, lenguaje RRSS, sin gritar,
 *       sencillo pero no simple. Guía de estilo Movistar Plus+.
 */

import { useEffect, useState } from 'react';
import { X, Tv2, Play } from 'lucide-react';

// ── Constantes ────────────────────────────────────────────────────────────────

const DEFAULT_HREF =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol%2Fmundial';

/**
 * Datos verificados del PDF de prensa Movistar Plus+ (jun 2026):
 *  - 104 partidos totales via DAZN en Movistar Plus+
 *  - Precio OTT: 9,99 €/mes (sin necesidad de ser cliente Movistar)
 *  - Tagline oficial: "La Casa del Fútbol"
 *  - Incluye partidos de España (RTVE en abierto + DAZN)
 */
const M_PRICE = '9,99 €/mes';
const M_TAGLINE = 'La Casa del Fútbol';

const DISMISS_KEY = 'mdf_movistar_dismissed';
const DISMISS_DAYS = 3; // reaparece a los 3 días

// ── Helpers ───────────────────────────────────────────────────────────────────

function isDismissed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function dismiss() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

// ── Logo ──────────────────────────────────────────────────────────────────────

/**
 * Logo Movistar Plus+ como SVG inline.
 * Guía de marca: positivo negro (#000), negativo blanco (#fff).
 */
function MovistarLogo({ color = '#ffffff', size = 20 }: { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 120 24"
      width={size * 5}
      height={size}
      fill="none"
      aria-label="Movistar Plus+"
      role="img"
    >
      {/* Wordmark simplificado: "Movistar Plus+" */}
      <text
        x="0"
        y="19"
        fontFamily="'Arial', sans-serif"
        fontWeight="700"
        fontSize="18"
        fill={color}
        letterSpacing="-0.5"
      >
        Movistar Plus+
      </text>
    </svg>
  );
}

// ── T&C disclosure ────────────────────────────────────────────────────────────

function TAndC({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[10px] leading-relaxed ${className}`}>
      Enlace de afiliado. Al suscribirte a través de este enlace recibimos una pequeña comisión
      sin coste adicional para ti.{' '}
      <a
        href="/aviso-afiliados"
        className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        Más info
      </a>
      .
    </p>
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
      aria-label="Oferta Movistar Plus+"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 md:px-6
                 bg-black border-t border-white/10 shadow-2xl
                 safe-area-inset-bottom"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {/* Icono */}
      <div className="hidden shrink-0 rounded-full bg-white/10 p-2 sm:flex">
        <Tv2 className="h-4 w-4 text-white" />
      </div>

      {/* Copy */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="truncate text-sm font-semibold leading-tight text-white">
          104 partidos. Todos en Movistar Plus+
        </span>
        <span className="hidden text-xs text-white/50 sm:inline">·</span>
        <span className="truncate text-xs text-white/70">
          Vía DAZN · desde {M_PRICE} · {M_TAGLINE}
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
        className="shrink-0 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Variant: CARD (tarjeta inline) ────────────────────────────────────────────

function CardBanner({
  href,
  context,
}: {
  href: string;
  /** Ej: "España vs Cabo Verde", "Grupo G", "Jornada 3" */
  context?: string;
}) {
  return (
    <aside
      aria-label="Movistar Plus+ — ver el Mundial"
      className="overflow-hidden rounded-2xl border border-white/10 bg-black"
    >
      {/* Header decorativo */}
      <div className="relative flex items-center gap-3 overflow-hidden px-5 py-4">
        {/* fondo con noise sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
            backgroundSize: '200px',
          }}
        />
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Play className="h-4 w-4 fill-white text-white" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
            {context ? `${context} · Movistar Plus+` : 'Movistar Plus+'}
          </div>
          <div className="mt-0.5 text-sm font-bold leading-tight text-white">
            Vélo en directo
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-1">
        <p className="text-sm leading-relaxed text-white/70">
          {context
            ? `¿Quieres ver ${context} en directo? Lo tienes en Movistar Plus+ vía DAZN. Todos los partidos del Mundial, sin excepciones.`
            : `Los 104 partidos del Mundial 2026 a través de DAZN, en Movistar Plus+. Sin perderte uno. Desde ${M_PRICE}.`}
        </p>

        {/* Price badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            DAZN + Movistar Plus+
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
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

// ── Variant: STRIP (franja entre secciones) ───────────────────────────────────

function StripBanner({ href, context }: { href: string; context?: string }) {
  return (
    <div className="border-y border-white/8 bg-black">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Tv2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">
              {context ? `${context} ·` : ''} Movistar Plus+
            </div>
            <p className="text-sm font-semibold text-white">
              {context
                ? `${context} en DAZN vía Movistar Plus+`
                : `104 partidos via DAZN · desde ${M_PRICE}`}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <a
            href={href}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold
                       text-black transition-all hover:bg-white/90 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-black text-black" />
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
 * Barra sticky inferior — va en el layout global.
 *
 * ```tsx
 * <MovistarStickyBar />
 * // o con link específico de partido/grupo:
 * <MovistarStickyBar href="https://awin..." />
 * ```
 */
export function MovistarStickyBar({ href = DEFAULT_HREF }: { href?: string }) {
  return <StickyBanner href={href} />;
}

/**
 * Tarjeta inline — para artículos, páginas de grupo, páginas de partido.
 *
 * ```tsx
 * <MovistarCard context="España vs Cabo Verde" href="https://awin..." />
 * <MovistarCard context="Grupo G" />
 * ```
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
 * Franja entre secciones — para páginas largas de calendario, grupos, etc.
 *
 * ```tsx
 * <MovistarStrip context="Jornada 1" href="https://awin..." />
 * ```
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

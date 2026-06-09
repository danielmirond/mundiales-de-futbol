'use client';

/**
 * MovistarBanner — La Copa Mundial FIFA 2026™ en Movistar Plus+
 *
 * Assets y copy extraídos del HTML oficial de movistarplus.es (jun 2026).
 * Todos los enlaces pasados por AWIN (afiliado 2898755 / anunciante 114230).
 *
 * Variantes:
 *  · cintillo  → creative oficial con thumbnail del partido (recomendado)
 *  · card      → tarjeta compacta para sidebars
 *  · sticky    → barra inferior fija (layout global), descartable
 *  · strip     → franja entre secciones
 *
 * Compliance: rel="sponsored nofollow noopener noreferrer" en todos los links.
 * Tono M+: cercano, tuteo, RRSS, sencillo, sin gritar.
 */

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getMatchThumbnail } from '@/lib/movistar-match-links';

// ── Assets oficiales CDN movistarplus.es ──────────────────────────────────────

/** Imágenes cabecera (WebP, mejor calidad que los recortes anteriores) */
const HERO = {
  desktop: 'https://www.movistarplus.es/recorte/e/cabecera/0513c9416ba33ffc9c730e187a070aa9.webp',
  mobile:  'https://www.movistarplus.es/recorte/e/cabeceraMobile/739220290a8d376bde1d4ce697617dc4.webp',
  og:      'https://www.movistarplus.es/recorte/e/ogimage/0513c9416ba33ffc9c730e187a070aa9',
};

/** Logos de canal oficial */
const LOGOS = {
  daznMundial: 'https://www.movistarplus.es/recorte/m-NEONEGR/ficha_m/DAZNLI.png',
  fanzone:     'https://www.movistarplus.es/recorte/m-NEONEGR/ficha_m/MLIG1.png',
  champions:   'https://www.movistarplus.es/recorte/m-NEONEGR/ficha_m/CHAPIO.png',
};

// ── Copy oficial (extraído del HTML de M+) ────────────────────────────────────

const COPY = {
  title:    'La Copa Mundial de la FIFA 2026™ al completo en Movistar Plus a través de DAZN',
  subtitle: 'Disfruta al completo el campeonato del mundo que se celebrará en EEUU, México y Canadá del 11 de junio al 19 de julio.',
  tagline:  'La Casa del Fútbol',
  dial:     'DAZN Mundial · dial 55',
  fanzone:  'M+ Fanzone · dial 57',
  /** 9,99€/mes = OTT sin fibra | 50€/mes = Fútbol Total con fibra+móvil */
  priceOtt:   '9,99 €/mes',
  pricePack:  '50 €/mes',
  matches:  '104 partidos · 48 selecciones',
};

// ── AWIN URL genérica ─────────────────────────────────────────────────────────

const DEFAULT_HREF =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=' +
  encodeURIComponent('https://www.movistarplus.es/deportes/futbol/mundial');

// ── localStorage dismiss ──────────────────────────────────────────────────────

// v2: la barra se reubicó al top (bajo el nav). Subimos la versión de la key
// para que quien ya la había cerrado abajo vuelva a verla en su nueva posición.
const DISMISS_KEY  = 'mdf_movistar_dismissed_v2';
const DISMISS_DAYS = 3;

function isDismissed() {
  if (typeof localStorage === 'undefined') return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  return raw ? Date.now() - parseInt(raw, 10) < DISMISS_DAYS * 86_400_000 : false;
}
function dismiss() { localStorage.setItem(DISMISS_KEY, String(Date.now())); }

// ── Disclosure ────────────────────────────────────────────────────────────────

function TAndC({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[10px] leading-relaxed ${className}`}>
      Enlace de afiliado · AWIN · Sin coste adicional para ti.{' '}
      <a href="/aviso-afiliados"
        className="underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity">
        Más info
      </a>.
    </p>
  );
}

// ── Canal badges ──────────────────────────────────────────────────────────────

function ChannelBadges({ small = false }: { small?: boolean }) {
  const size = small ? 'h-6' : 'h-8';
  return (
    <div className="flex items-center gap-2">
      <img src={LOGOS.daznMundial} alt="DAZN Mundial" title="DAZN Mundial · dial 55"
        className={`${size} w-auto object-contain`} loading="lazy" />
      <img src={LOGOS.fanzone} alt="M+ Fanzone" title="M+ Fanzone · dial 57"
        className={`${size} w-auto object-contain`} loading="lazy" />
    </div>
  );
}

// ── Variant: CINTILLO OFICIAL ─────────────────────────────────────────────────
/**
 * Creative oficial de Movistar Plus+.
 * Si hay matchId → muestra el thumbnail específico del partido.
 * Si no → muestra la imagen cabecera del Mundial.
 */
function CintilloBanner({
  href,
  context,
  matchId,
}: {
  href: string;
  context?: string;
  matchId?: string;
}) {
  const thumbSrc = matchId ? getMatchThumbnail(matchId) : null;

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="group relative flex overflow-hidden rounded-2xl border border-white/10
                 bg-black transition-all hover:border-white/25 hover:shadow-2xl"
      aria-label={context
        ? `Ver ${context} en Movistar Plus+`
        : 'La Copa Mundial FIFA 2026™ en Movistar Plus+'
      }
    >
      {/* Imagen: thumbnail del partido o cabecera del Mundial */}
      <div className="relative shrink-0 overflow-hidden">
        {thumbSrc ? (
          /* Thumbnail del partido (ratio cuadrado oficial) */
          <img
            loading="lazy"
            src={thumbSrc}
            alt={context ?? 'Partido Mundial 2026'}
            width={160}
            height={136}
            className="h-full w-[120px] object-cover transition-transform duration-500
                       group-hover:scale-105 md:w-[160px]"
          />
        ) : (
          /* Cabecera general del Mundial (WebP, mejor calidad) */
          <picture>
            <source srcSet={HERO.mobile} media="(max-width: 768px)" />
            <img
              loading="lazy"
              src={HERO.desktop}
              alt={COPY.title}
              width={160}
              height={90}
              className="h-full w-[120px] object-cover transition-transform duration-500
                         group-hover:scale-105 md:w-[160px]"
            />
          </picture>
        )}
        {/* Gradiente lateral */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-4 md:px-5">
        {/* Eyebrow */}
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
          {context ? `${context} ·` : ''} Movistar Plus+
        </div>

        {/* Título */}
        <p className="text-sm font-black uppercase leading-tight text-white md:text-base">
          {context ? (
            <>Sigue {context}<br />
              <span className="text-xs font-bold normal-case text-white/75">
                en directo — {COPY.dial}
              </span>
            </>
          ) : (
            <>Vive al completo<br />
              <span className="text-white/90">la Copa Mundial FIFA 2026™</span>
            </>
          )}
        </p>

        {/* Canales + CTA */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ChannelBadges small />
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold
                           text-black transition-all group-hover:bg-white/90">
            Ver en M+
          </span>
        </div>

        <TAndC className="text-white/20" />
      </div>
    </a>
  );
}

// ── Variant: HERO (landing / grupos, ancho completo) ─────────────────────────

function HeroBanner({ href, context }: { href: string; context?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10">
      {/* Fondo WebP oficial */}
      <picture>
        <source srcSet={HERO.mobile} media="(max-width: 768px)" />
        <img
          loading="lazy"
          src={HERO.desktop}
          alt={COPY.title}
          width={1280}
          height={720}
          className="h-48 w-full object-cover object-top md:h-72"
        />
      </picture>

      {/* Overlay + contenido */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent p-6 md:p-8">
        <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/50 mb-2">
          {COPY.tagline} · Movistar Plus+ vía DAZN
        </div>

        <h3 className="text-xl font-black uppercase leading-tight text-white md:text-2xl">
          {context
            ? `${context} en directo`
            : 'La Copa Mundial FIFA 2026™ al completo'}
        </h3>
        <p className="mt-1 text-sm text-white/70">
          {COPY.matches} · {COPY.dial} · {COPY.fanzone}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {/* Canal logos */}
          <ChannelBadges />

          {/* CTA */}
          <a
            href={href}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm
                       font-bold text-black transition-all hover:bg-white/90 active:scale-95"
          >
            Suscribirse a Movistar Plus+
          </a>

          {/* Precio */}
          <div className="flex flex-col gap-0">
            <span className="font-mono text-xs font-bold text-white">desde {COPY.priceOtt}</span>
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">OTT sin fibra</span>
          </div>
        </div>

        <TAndC className="mt-3 text-white/25" />
      </div>
    </div>
  );
}

// ── Variant: CARD compacta ────────────────────────────────────────────────────

function CardBanner({ href, context, matchId }: { href: string; context?: string; matchId?: string }) {
  const thumbSrc = matchId ? getMatchThumbnail(matchId) : null;

  return (
    <aside className="overflow-hidden rounded-2xl border border-white/10 bg-black"
      aria-label="Movistar Plus+ — ver el partido">

      {/* Hero */}
      <div className="relative h-28 overflow-hidden">
        {thumbSrc ? (
          <img loading="lazy" src={thumbSrc} alt={context ?? ''} width={400} height={228}
            className="h-full w-full object-cover" />
        ) : (
          <picture>
            <source srcSet={HERO.mobile} media="(max-width: 768px)" />
            <img loading="lazy" src={HERO.desktop} alt={COPY.title} width={400} height={225}
              className="h-full w-full object-cover object-top" />
          </picture>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/40">
              {context ? `${context} ·` : ''} M+
            </div>
            <p className="text-sm font-bold uppercase leading-tight text-white">
              {context ? 'Ver en directo' : 'Copa Mundial FIFA 2026™'}
            </p>
          </div>
          <ChannelBadges small />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-3">
        <p className="text-xs leading-relaxed text-white/65">
          {context
            ? `¿Quieres ver ${context}? En Movistar Plus+ vía DAZN. Canal 55, disponible con el paquete de Fútbol.`
            : `Los ${COPY.matches} del Mundial 2026 en Movistar Plus+ vía DAZN. Desde ${COPY.priceOtt} (OTT).`}
        </p>

        <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center rounded-xl bg-white py-2.5
                     text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[.98]">
          {context ? `Ver ${context} en M+` : 'Suscribirse a Movistar Plus+'}
        </a>

        <TAndC className="mt-2 text-white/25" />
      </div>
    </aside>
  );
}

// ── Variant: STRIP ────────────────────────────────────────────────────────────

function StripBanner({ href, context }: { href: string; context?: string }) {
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black">
      {/* Fondo muy tenue */}
      <picture>
        <source srcSet={HERO.mobile} media="(max-width: 768px)" />
        <img src={HERO.desktop} alt="" aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15" />
      </picture>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 py-5
                      md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-4">
          <ChannelBadges />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">
              {context ? `${context} ·` : ''} {COPY.tagline}
            </div>
            <p className="text-base font-black uppercase leading-tight text-white">
              {context
                ? `${context} en Movistar Plus+`
                : 'La Copa Mundial FIFA 2026™ al completo'}
            </p>
            <p className="mt-0.5 text-xs text-white/55">
              {COPY.matches} · {COPY.dial} · desde {COPY.priceOtt}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1.5 md:items-end">
          <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold
                       text-black transition-all hover:bg-white/90 active:scale-95">
            Suscribirse a Movistar Plus+
          </a>
          <TAndC className="text-white/25 md:text-right" />
        </div>
      </div>
    </div>
  );
}

// ── Variant: STICKY ───────────────────────────────────────────────────────────

function StickyBanner({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (!isDismissed()) setVisible(true); }, []);
  if (!visible) return null;

  return (
    <div role="complementary" aria-label="Copa Mundial FIFA 2026™ en Movistar Plus+"
      className="fixed left-0 right-0 top-16 z-30 flex items-center gap-3 border-b border-white/10
                 bg-black px-4 py-2.5 shadow-2xl md:top-20 md:px-6">

      {/* Logos de canal */}
      <div className="hidden shrink-0 gap-1.5 sm:flex">
        <img src={LOGOS.daznMundial} alt="DAZN Mundial"
          className="h-6 w-auto object-contain" loading="lazy" />
        <img src={LOGOS.fanzone} alt="M+ Fanzone"
          className="h-6 w-auto object-contain" loading="lazy" />
      </div>

      {/* Copy */}
      <div className="flex min-w-0 flex-1 flex-col gap-0 sm:flex-row sm:items-center sm:gap-3">
        <span className="truncate text-sm font-bold text-white">
          Copa Mundial FIFA 2026™ al completo
        </span>
        <span className="hidden text-white/30 sm:inline">·</span>
        <span className="truncate text-xs text-white/55">
          {COPY.matches} · Movistar Plus+ vía DAZN · desde {COPY.priceOtt}
        </span>
      </div>

      {/* CTA */}
      <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer"
        onClick={() => dismiss()}
        className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black
                   transition-all hover:bg-white/90 active:scale-95 whitespace-nowrap">
        Ver cómo
      </a>

      {/* Dismiss */}
      <button type="button" aria-label="Cerrar"
        onClick={() => { dismiss(); setVisible(false); }}
        className="shrink-0 rounded-full p-1.5 text-white/40 transition-colors
                   hover:bg-white/10 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

/**
 * Cintillo con thumbnail del partido (si hay matchId) o cabecera general.
 * Es el componente principal para artículos de TV/horario.
 *
 * ```tsx
 * <MovistarCintillo context="México vs Sudáfrica" matchId="4318260" href="..." />
 * ```
 */
export function MovistarCintillo({
  href = DEFAULT_HREF,
  context,
  matchId,
}: {
  href?: string;
  context?: string;
  matchId?: string;
}) {
  return <CintilloBanner href={href} context={context} matchId={matchId} />;
}

/**
 * Hero de ancho completo con imagen cabecera oficial.
 * Para páginas de grupo, calendario, home de noticias.
 *
 * ```tsx
 * <MovistarHero context="Grupo G" href="..." />
 * ```
 */
export function MovistarHero({
  href = DEFAULT_HREF,
  context,
}: {
  href?: string;
  context?: string;
}) {
  return <HeroBanner href={href} context={context} />;
}

/** Tarjeta compacta para sidebars */
export function MovistarCard({
  href = DEFAULT_HREF,
  context,
  matchId,
}: {
  href?: string;
  context?: string;
  matchId?: string;
}) {
  return <CardBanner href={href} context={context} matchId={matchId} />;
}

/** Franja entre secciones */
export function MovistarStrip({
  href = DEFAULT_HREF,
  context,
}: {
  href?: string;
  context?: string;
}) {
  return <StripBanner href={href} context={context} />;
}

/** Barra sticky global — usar en layout */
export function MovistarStickyBar({ href = DEFAULT_HREF }: { href?: string }) {
  return <StickyBanner href={href} />;
}

'use client';

/**
 * MovistarBanner — Fútbol y baloncesto en directo en Movistar Plus+ (vía DAZN)
 *
 * Copy genérico de temporada de clubes: NO enumera competiciones ni diales
 * concretos (los derechos cambian por temporada y un cintillo afiliado no
 * puede prometer lo que no está verificado). Todos los enlaces pasan por AWIN
 * (afiliado 2898755 / anunciante 114230) con deep link a la sección de
 * deportes de movistarplus.es.
 *
 * Variantes:
 *  · cintillo  → creative con thumbnail del partido (si hay matchId)
 *  · card      → tarjeta compacta para sidebars
 *  · strip     → franja entre secciones
 *  · sticky    → barra superior fija (layout global), descartable
 *
 * Compliance: rel="sponsored nofollow noopener noreferrer" en todos los links.
 * Tono M+: cercano, tuteo, sencillo, sin gritar.
 */

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getMatchThumbnail } from '@/lib/movistar-match-links';

// ── Logos de canal (CDN movistarplus.es) ──────────────────────────────────────

const LOGOS = {
  dazn: 'https://www.movistarplus.es/recorte/m-NEONEGR/ficha_m/DAZNLI.png',
  mplus: 'https://www.movistarplus.es/recorte/m-NEONEGR/ficha_m/MLIG1.png',
};

// ── Copy ──────────────────────────────────────────────────────────────────────

const COPY = {
  title: 'El mejor fútbol y baloncesto en directo en Movistar Plus+ y DAZN',
  subtitle: 'Ligas, copas europeas y NBA, cada semana, en una sola suscripción.',
  tagline: 'La Casa del Fútbol',
  via: 'Movistar Plus+ vía DAZN',
  matches: 'Fútbol y baloncesto · cada semana',
};

// ── AWIN URL genérica ─────────────────────────────────────────────────────────

const DEFAULT_HREF =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=' +
  encodeURIComponent('https://www.movistarplus.es/deportes');

// ── localStorage dismiss ──────────────────────────────────────────────────────

// v3: nuevo mensaje de temporada de clubes; quien cerró la barra del Mundial
// vuelve a verla una vez con el copy nuevo.
const DISMISS_KEY = 'mdf_movistar_dismissed_v3';
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
      <img src={LOGOS.dazn} alt="DAZN" className={`${size} w-auto object-contain`} loading="lazy" />
      <img src={LOGOS.mplus} alt="Movistar Plus+" className={`${size} w-auto object-contain`} loading="lazy" />
    </div>
  );
}

/** Fondo neutro (sustituye a la cabecera del Mundial, ya caducada). */
const ART_BG = 'bg-[radial-gradient(ellipse_at_top_left,_rgba(0,255,133,0.25),_transparent_55%),linear-gradient(135deg,#0b1220_0%,#05070c_60%,#000_100%)]';

// ── Variant: CINTILLO ─────────────────────────────────────────────────────────

function CintilloBanner({ href, context, matchId }: { href: string; context?: string; matchId?: string }) {
  const thumbSrc = matchId ? getMatchThumbnail(matchId) : null;

  // El aviso de afiliado (con su propio enlace) va FUERA del <a>: un <a> anidado
  // hace que el navegador cierre el enlace antes de tiempo y rompe la hidratación.
  return (
    <div>
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="group relative flex overflow-hidden rounded-2xl border border-white/10
                 bg-black transition-all hover:border-white/25 hover:shadow-2xl"
      aria-label={context ? `Ver ${context} en Movistar Plus+` : COPY.title}
    >
      <div className="relative shrink-0 overflow-hidden">
        {thumbSrc ? (
          <img loading="lazy" src={thumbSrc} alt={context ?? 'Partido en Movistar Plus+'} width={160} height={136}
            className="h-full w-[120px] object-cover transition-transform duration-500 group-hover:scale-105 md:w-[160px]" />
        ) : (
          <div aria-hidden className={`h-full w-[120px] md:w-[160px] ${ART_BG}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-4 md:px-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
          {context ? `${context} ·` : ''} Movistar Plus+
        </div>
        <p className="text-sm font-black uppercase leading-tight text-white md:text-base">
          {context ? (
            <>Sigue {context}<br />
              <span className="text-xs font-bold normal-case text-white/75">en directo — {COPY.via}</span>
            </>
          ) : (
            <>El mejor fútbol y baloncesto<br />
              <span className="text-white/90">en directo, cada semana</span>
            </>
          )}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ChannelBadges small />
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black transition-all group-hover:bg-white/90">
            Ver en M+
          </span>
        </div>
      </div>
    </a>
    <TAndC className="mt-2 px-1 text-white/25" />
    </div>
  );
}

// ── Variant: HERO (ancho completo) ────────────────────────────────────────────

function HeroBanner({ href, context }: { href: string; context?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${ART_BG}`}>
      <div className="flex min-h-48 flex-col justify-end p-6 md:min-h-64 md:p-8">
        <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.35em] text-white/50">
          {COPY.tagline} · {COPY.via}
        </div>
        <h3 className="text-xl font-black uppercase leading-tight text-white md:text-2xl">
          {context ? `${context} en directo` : COPY.title}
        </h3>
        <p className="mt-1 text-sm text-white/70">{COPY.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <ChannelBadges />
          <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-95">
            Suscribirse a Movistar Plus+
          </a>
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
    <aside className="overflow-hidden rounded-2xl border border-white/10 bg-black" aria-label="Movistar Plus+ — ver en directo">
      <div className={`relative h-28 overflow-hidden ${thumbSrc ? '' : ART_BG}`}>
        {thumbSrc && (
          <img loading="lazy" src={thumbSrc} alt={context ?? ''} width={400} height={228} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/40">
              {context ? `${context} ·` : ''} M+
            </div>
            <p className="text-sm font-bold uppercase leading-tight text-white">
              {context ? 'Ver en directo' : 'Fútbol y baloncesto en directo'}
            </p>
          </div>
          <ChannelBadges small />
        </div>
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-xs leading-relaxed text-white/65">
          {context
            ? `¿Quieres ver ${context}? En ${COPY.via}.`
            : `${COPY.subtitle}`}
        </p>
        <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[.98]">
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
    <div className={`relative overflow-hidden border-y border-white/10 ${ART_BG}`}>
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-4">
          <ChannelBadges />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">
              {context ? `${context} ·` : ''} {COPY.tagline}
            </div>
            <p className="text-base font-black uppercase leading-tight text-white">
              {context ? `${context} en Movistar Plus+` : COPY.title}
            </p>
            <p className="mt-0.5 text-xs text-white/55">{COPY.matches} · {COPY.via}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-1.5 md:items-end">
          <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-95">
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
    <div role="complementary" aria-label="Fútbol y baloncesto en directo en Movistar Plus+"
      className="fixed left-0 right-0 top-16 z-30 flex items-center gap-3 border-b border-white/10 bg-black px-4 py-2.5 shadow-2xl md:top-20 md:px-6">
      <div className="hidden shrink-0 gap-1.5 sm:flex">
        <img src={LOGOS.dazn} alt="DAZN" className="h-6 w-auto object-contain" loading="lazy" />
        <img src={LOGOS.mplus} alt="Movistar Plus+" className="h-6 w-auto object-contain" loading="lazy" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0 sm:flex-row sm:items-center sm:gap-3">
        <span className="truncate text-sm font-bold text-white">Fútbol y baloncesto en directo</span>
        <span className="hidden text-white/30 sm:inline">·</span>
        <span className="truncate text-xs text-white/55">{COPY.matches} · {COPY.via}</span>
      </div>
      <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={() => dismiss()}
        className="shrink-0 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-all hover:bg-white/90 active:scale-95">
        Ver cómo
      </a>
      <button type="button" aria-label="Cerrar" onClick={() => { dismiss(); setVisible(false); }}
        className="shrink-0 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

/** Cintillo con thumbnail del partido (si hay matchId). Principal en artículos/fichas. */
export function MovistarCintillo({ href = DEFAULT_HREF, context, matchId }: { href?: string; context?: string; matchId?: string }) {
  return <CintilloBanner href={href} context={context} matchId={matchId} />;
}

/** Hero de ancho completo (portada, hubs). */
export function MovistarHero({ href = DEFAULT_HREF, context }: { href?: string; context?: string }) {
  return <HeroBanner href={href} context={context} />;
}

/** Tarjeta compacta para sidebars */
export function MovistarCard({ href = DEFAULT_HREF, context, matchId }: { href?: string; context?: string; matchId?: string }) {
  return <CardBanner href={href} context={context} matchId={matchId} />;
}

/** Franja entre secciones */
export function MovistarStrip({ href = DEFAULT_HREF, context }: { href?: string; context?: string }) {
  return <StripBanner href={href} context={context} />;
}

/** Barra sticky global — usar en layout */
export function MovistarStickyBar({ href = DEFAULT_HREF }: { href?: string }) {
  return <StickyBanner href={href} />;
}

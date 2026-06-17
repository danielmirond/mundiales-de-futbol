'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { WC_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Sticky bar omnipresente del Mundial 2026.
 *
 * Aparece en TODAS las páginas debajo de SiteNav. Se actualiza solo:
 *
 *  - Fase PRE       (hoy → 11 jun 2026)        cuenta atrás + partido inaugural
 *  - Fase GRUPOS    (11 → 27 jun)              partido del día (TODO datos vivos)
 *  - Fase KO        (28 jun → 19 jul)          ronda actual + próximo partido
 *  - Fase POST      (a partir 20 jul 2026)     enlace al campeón + archivo
 *
 * Cliente component porque el countdown ticking + cálculo de fase necesitan
 * estado y Date.now(). Render inicial: usa diff entre `WC_2026.kickoff` y
 * `Date.now()` en mount (no SSR para evitar mismatch). Loading state durante
 * el primer paint = render skeleton minimal con etiqueta sin tiempo.
 *
 * El componente es accesible (role="status" para el countdown), respeta
 * prefers-reduced-motion y no impone altura agresiva en móvil.
 */

type Phase = 'pre' | 'group' | 'ko' | 'post';

function detectPhase(now: number): Phase {
  const kickoff = new Date(WC_2026.kickoff).getTime();
  const groupsEnd = new Date('2026-06-27T23:59:59-06:00').getTime();
  const final = new Date(WC_2026.final).getTime();
  if (now < kickoff) return 'pre';
  if (now <= groupsEnd) return 'group';
  if (now <= final) return 'ko';
  return 'post';
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function withLocale(locale: Locale, href: string): string {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function Wc2026Bar() {
  const t = useTranslations('wc2026Bar');
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('pre');
  const [d, setD] = useState(0);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);

  useEffect(() => {
    setMounted(true);
    const kickoff = new Date(WC_2026.kickoff).getTime();

    function tick() {
      const now = Date.now();
      setPhase(detectPhase(now));
      const diff = Math.max(0, kickoff - now);
      setD(Math.floor(diff / 86_400_000));
      setH(Math.floor((diff % 86_400_000) / 3_600_000));
      setM(Math.floor((diff % 3_600_000) / 60_000));
    }
    tick();
    // 1 minuto basta para el ticker top-of-page; el countdown del hero
    // es el que actualiza por segundos.
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Quick-nav: 4 enlaces fijos. Se renderiza también en SSR / primer paint,
  // así los enlaces están presentes en el HTML (crawleables, SEO).
  const quickNav = (
    <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
      <Link
        href={withLocale(locale, '/2026/partidos-hoy')}
        className="font-semibold text-[var(--color-pitch)] transition-opacity hover:opacity-80"
      >
        {t('today')}
      </Link>
      <Link
        href={withLocale(locale, '/noticias/rtve-la1-partidos-mundial-2026-abierto-donde-ver-resto-dazn')}
        className="transition-colors hover:text-[var(--color-pitch)]"
      >
        {t('rtve')}
      </Link>
      <Link
        href={withLocale(locale, '/2026/calendario')}
        className="transition-colors hover:text-[var(--color-pitch)]"
      >
        {t('calendar')}
      </Link>
      <Link
        href={withLocale(locale, '/2026/grupos')}
        className="transition-colors hover:text-[var(--color-pitch)]"
      >
        {t('groups')}
      </Link>
    </nav>
  );

  // Server-render / primer paint: chip estático (sin countdown) para evitar
  // hydration mismatch; el quick-nav SÍ va en el HTML.
  if (!mounted) {
    return (
      <div className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5 text-xs md:px-10">
          <Link
            href={withLocale(locale, '/2026')}
            className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] text-[var(--color-pitch)] transition-opacity hover:opacity-80"
            aria-label={t('label')}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pitch)]" />
            {t('label')}
          </Link>
          {quickNav}
        </div>
      </div>
    );
  }

  // ─── Render por fase ─────────────────────────────────────────────
  return (
    <div className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5 text-xs md:px-10">
        {/* Chip izq: estado del torneo */}
        <Link
          href={withLocale(locale, '/2026')}
          className="group inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] transition-colors hover:text-[var(--color-pitch)]"
          aria-label={t('label')}
        >
          {phase === 'pre' && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pitch)] shadow-[0_0_8px_var(--color-pitch)]" />
              <span className="text-[var(--color-pitch)]">{t('label')}</span>
              <span className="tab-num text-[var(--color-fg)]" role="status" aria-live="polite">
                {d}{t('dayShort')} {pad(h)}{t('hourShort')} {pad(m)}{t('minuteShort')}
              </span>
            </>
          )}
          {phase === 'group' && (
            <>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span className="text-red-500">{t('live')}</span>
              <span className="text-[var(--color-fg)]">{t('groupStage')}</span>
            </>
          )}
          {phase === 'ko' && (
            <>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span className="text-red-500">{t('live')}</span>
              <span className="text-[var(--color-fg)]">{t('koStage')}</span>
            </>
          )}
          {phase === 'post' && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pitch)]" />
              <span className="text-[var(--color-fg)]">{t('archive')}</span>
            </>
          )}
        </Link>

        {/* Centro: ticker contextual */}
        <span className="flex-1 truncate text-center text-[var(--color-fg-muted)]">
          {phase === 'pre' && (
            <>
              {t('opener')}{' '}
              <strong className="text-[var(--color-fg)]">
                🇲🇽 MEX vs RSA 🇿🇦
              </strong>
              {' · '}
              <span className="font-mono text-[var(--color-fg-subtle)]">
                11 jun · Azteca
              </span>
            </>
          )}
          {(phase === 'group' || phase === 'ko') && (
            <Link
              href={withLocale(locale, '/2026/partidos-hoy')}
              className="inline-flex items-center gap-2 font-mono text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
            >
              <span className="text-[var(--color-fg-subtle)]">
                {phase === 'group' ? t('groupStage') : t('koStage')}
              </span>
              <span className="text-[var(--color-pitch)]">· {t('today')} →</span>
            </Link>
          )}
          {phase === 'post' && t('postSubtitle')}
        </span>

        {/* Quick nav derecha */}
        {quickNav}
      </div>
    </div>
  );
}

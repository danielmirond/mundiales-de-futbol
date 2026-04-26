'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Tv, Ticket, Sofa, MapPin } from 'lucide-react';
import { WORLD_CUP_2026_KICKOFF } from '@/lib/tournaments';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function diff(target: Date) {
  const now = Date.now();
  const delta = target.getTime() - now;
  if (delta <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true };
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);
  return { days, hours, minutes, seconds, live: false };
}

export function Countdown() {
  const t = useTranslations('home.countdown');
  const locale = useLocale() as Locale;
  const [state, setState] = useState(() => diff(WORLD_CUP_2026_KICKOFF));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setState(diff(WORLD_CUP_2026_KICKOFF)), 1000);
    return () => clearInterval(id);
  }, []);

  // Cell layout, días con énfasis visual, resto más compactos
  const minorCells = [
    { value: state.hours, label: t('hours') },
    { value: state.minutes, label: t('minutes') },
    { value: state.seconds, label: t('seconds') },
  ];

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-pitch)]/20 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)]">
      {/* Glow superior verde */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.25), transparent 60%)',
        }}
      />
      <div className="absolute inset-0 grid-overlay opacity-25" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        {/* Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-pitch)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-pitch)]" />
              </span>
              {state.live ? t('liveNow') : t('label')}
            </div>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-5xl">
              {t('host')}
            </h2>
          </div>
          <Link
            href={withLocale(locale, '/2026')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Calendario completo
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        {/* Cuenta atrás, días gigantes + resto en línea */}
        <div className="mt-12 grid gap-8 md:grid-cols-[1.5fr_1fr] md:gap-12 md:items-center">
          {/* Días, número gigante */}
          <div className="flex items-baseline gap-6">
            <span
              className="font-display tab-num text-[12rem] leading-[0.8] tracking-[-0.04em] text-[var(--color-pitch)] md:text-[16rem]"
              suppressHydrationWarning
            >
              {mounted ? String(state.days).padStart(2, '0') : '--'}
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-display text-3xl uppercase leading-none text-[var(--color-fg)] md:text-4xl">
                {t('days')}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                11 jun · Estadio Azteca
              </span>
            </div>
          </div>

          {/* Horas / minutos / segundos */}
          <div className="grid grid-cols-3 divide-x divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 rtl:divide-x-reverse">
            {minorCells.map((c) => (
              <div key={c.label} className="flex flex-col items-center justify-center px-2 py-5 md:py-6">
                <span
                  className="font-display tab-num text-3xl leading-none text-[var(--color-fg)] md:text-4xl"
                  suppressHydrationWarning
                >
                  {mounted ? String(c.value).padStart(2, '0') : '--'}
                </span>
                <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs principales del Mundial */}
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale, '/2026/donde-ver')}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Tv className="h-4 w-4" />
            Dónde ver
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale, '/2026/entradas')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            <Ticket className="h-4 w-4" />
            Entradas
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale, '/2026/fan-zone')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            <Sofa className="h-4 w-4" />
            Fan zone
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale, '/2026/sedes')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            <MapPin className="h-4 w-4" />
            16 sedes
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale, '/selecciones/ESP/grupo-h')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            🇪🇸
            España · Grupo H
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

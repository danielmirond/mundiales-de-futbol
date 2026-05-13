'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { WC_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Panel "Próximo partido" del dashboard /2026.
 *
 * Pre-torneo: partido inaugural MEX vs RSA con countdown live (HH:MM:SS).
 * Durante el torneo: TODO siguiente partido del calendario en `lib/wc-2026.ts`
 * con kickoff. Para no recargar el panel se intenta primero la lista
 * estática; cuando haya DB conectada se conmuta.
 *
 * Client component para countdown segundo a segundo.
 */
export function NextMatchPanel({ locale }: { locale: Locale }) {
  const t = useTranslations('pages.wc2026.dashboard.nextMatch');
  const [mounted, setMounted] = useState(false);
  const [d, setD] = useState(0);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);

  // Hoy: el "próximo partido" estático es el inaugural.
  // Cuando haya datos vivos, este componente leerá el match con kickoff
  // futuro más cercano.
  const next = {
    home: 'MEX',
    homeFlag: '🇲🇽',
    away: 'RSA',
    awayFlag: '🇿🇦',
    venue: 'Estadio Azteca · CDMX',
    kickoff: new Date(WC_2026.kickoff).getTime(),
    matchUrl: '/ediciones/2026-norteamerica/partido/1',
    stage: t('opener'),
  };

  useEffect(() => {
    setMounted(true);
    function tick() {
      const now = Date.now();
      const diff = Math.max(0, next.kickoff - now);
      setD(Math.floor(diff / 86_400_000));
      setH(Math.floor((diff % 86_400_000) / 3_600_000));
      setM(Math.floor((diff % 3_600_000) / 60_000));
      setS(Math.floor((diff % 60_000) / 1_000));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [next.kickoff]);

  return (
    <article className="rounded-3xl border border-[var(--color-pitch)]/40 bg-gradient-to-br from-[var(--color-bg-2)] to-[var(--color-bg-3)] p-6 md:p-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        <Clock className="mr-2 inline h-3 w-3" />
        {t('heading')}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <h3 className="font-display text-lg uppercase leading-tight">
          {next.stage}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          11 jun
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-2">
          <span aria-hidden className="text-5xl">{next.homeFlag}</span>
          <span className="font-display text-lg uppercase">{next.home}</span>
        </div>
        <div className="text-center">
          <div className="font-display text-xl font-extrabold uppercase text-[var(--color-fg-subtle)]">
            VS
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span aria-hidden className="text-5xl">{next.awayFlag}</span>
          <span className="font-display text-lg uppercase">{next.away}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        <MapPin className="h-3 w-3" />
        {next.venue}
      </div>

      {/* Countdown HH:MM:SS */}
      <div
        className="mt-5 grid grid-cols-4 gap-2 rounded-2xl bg-[var(--color-bg)] p-3 text-center"
        role="status"
        aria-live="polite"
      >
        <CountdownUnit value={mounted ? d : 0} label={t('days')} />
        <CountdownUnit value={mounted ? h : 0} label={t('hours')} />
        <CountdownUnit value={mounted ? m : 0} label={t('minutes')} />
        <CountdownUnit value={mounted ? s : 0} label={t('seconds')} pulse />
      </div>

      <Link
        href={withLocale(locale, next.matchUrl)}
        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-pitch)] px-4 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
      >
        {t('cta')}
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </article>
  );
}

function CountdownUnit({
  value,
  label,
  pulse,
}: {
  value: number;
  label: string;
  pulse?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-display text-2xl font-extrabold tab-num text-[var(--color-pitch)] ${
          pulse ? 'motion-safe:animate-pulse' : ''
        }`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {label}
      </div>
    </div>
  );
}

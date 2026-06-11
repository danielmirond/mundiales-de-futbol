'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Tv, CalendarDays, Target } from 'lucide-react';
import { HeroImagery } from '@/components/home/hero-imagery';
import { FIXTURES_2026, TEAMS_2026 } from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const INTL_LOCALE: Record<string, string> = {
  es: 'es-ES', en: 'en-GB', fr: 'fr-FR', pt: 'pt-PT', ar: 'ar',
};

// Precalculado una sola vez: todos los partidos con kickoff en epoch ms, ordenados.
const SCHEDULE = FIXTURES_2026
  .map((f) => ({ ...f, kickoff: new Date(fixtureToUTC(f)).getTime() }))
  .sort((a, b) => a.kickoff - b.kickoff);

const MATCH_MS = 115 * 60 * 1000; // duración aprox. de un partido (incl. descanso/añadido)

type Picked = { match: (typeof SCHEDULE)[number]; live: boolean } | null;

function pickMatch(now: number): Picked {
  const live = SCHEDULE.find((m) => now >= m.kickoff && now < m.kickoff + MATCH_MS);
  if (live) return { match: live, live: true };
  const next = SCHEDULE.find((m) => m.kickoff > now);
  return next ? { match: next, live: false } : null;
}

function countdown(target: number, now: number) {
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor((d / 3_600_000) % 24),
    minutes: Math.floor((d / 60_000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

function makeFormatters(locale: string) {
  const intl = INTL_LOCALE[locale] ?? 'es-ES';
  return {
    dateFmt: new Intl.DateTimeFormat(intl, {
      timeZone: 'Europe/Madrid',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
    timeFmt: new Intl.DateTimeFormat(intl, {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function Side({ code }: { code?: string }) {
  const team = code ? TEAMS_2026[code] : undefined;
  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      <span className="text-5xl leading-none md:text-6xl" aria-hidden>
        {team?.flag ?? '🏳️'}
      </span>
      <span className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] md:text-2xl">
        {team?.name ?? code ?? '—'}
      </span>
    </div>
  );
}

export function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home.hero');
  const tc = useTranslations('home.countdown');
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { dateFmt, timeFmt } = makeFormatters(locale);
  const picked = pickMatch(now ?? SCHEDULE[0].kickoff);
  const c = picked ? countdown(picked.match.kickoff, now ?? 0) : null;

  const cells = c
    ? [
        { value: c.days, label: tc('days') },
        { value: c.hours, label: tc('hours') },
        { value: c.minutes, label: tc('minutes') },
        { value: c.seconds, label: tc('seconds') },
      ]
    : [];

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeroImagery />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute -inset-[30%] opacity-40 animate-slow-spin mix-blend-screen"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(0,255,133,0.35), rgba(255,59,59,0.35), rgba(255,212,0,0.35), rgba(0,255,133,0.35))',
            filter: 'blur(120px)',
          }}
        />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute inset-0 pitch-glow opacity-60" />
        <div className="absolute inset-0 flame-glow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-[var(--color-bg)]/50 to-[var(--color-bg)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-pitch)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-pitch)]" />
          </span>
          {picked?.live ? t('liveNow') : t('kicker')}
        </div>

        <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
          <span className="block text-[var(--color-fg)]">{t('titleLine1')}</span>
          <span className="block bg-gradient-to-r from-[var(--color-pitch)] via-[var(--color-sun)] to-[var(--color-flame)] bg-clip-text text-transparent">
            {t('titleLine2')}
          </span>
        </h1>

        {/* Tarjeta del partido en vivo / próximo */}
        {picked && (
          <div className="mt-10 w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-6 backdrop-blur md:p-8">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              <span>{picked.live ? t('live') : t('nextMatch')}</span>
              <span className="text-[var(--color-pitch)]">
                {picked.match.stage.length === 1 ? `${t('group')} ${picked.match.stage}` : picked.match.stage}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Side code={picked.match.home} />
              <span className="font-display text-2xl text-[var(--color-fg-subtle)] md:text-3xl">
                {picked.live ? '·' : 'vs'}
              </span>
              <Side code={picked.match.away} />
            </div>

            <div className="mt-5 text-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
              {dateFmt.format(picked.match.kickoff)} · {timeFmt.format(picked.match.kickoff)} h ({t('madridTime')})
            </div>

            {/* Cuenta atrás */}
            {!picked.live && (
              <div className="mt-6 grid grid-cols-4 divide-x divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)]/60 rtl:divide-x-reverse">
                {cells.map((cell) => (
                  <div key={cell.label} className="flex flex-col items-center justify-center px-1 py-4">
                    <span
                      className="font-display tab-num text-3xl leading-none text-[var(--color-fg)] md:text-4xl"
                      suppressHydrationWarning
                    >
                      {now === null ? '--' : String(cell.value).padStart(2, '0')}
                    </span>
                    <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                      {cell.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {picked.live && (
              <div className="mt-6 rounded-2xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/10 py-4 text-center font-display text-2xl uppercase text-[var(--color-pitch)]">
                {t('inPlay')}
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={withLocale(locale, '/2026/calendario')}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            <CalendarDays className="h-4 w-4" />
            {t('ctaCalendar')}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
          <Link
            href={withLocale(locale, '/2026/donde-ver')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            <Tv className="h-4 w-4" />
            {t('ctaWhere')}
          </Link>
          <Link
            href={withLocale(locale, '/2026/predicciones-mundial-2026')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            <Target className="h-4 w-4" />
            {t('ctaPorra')}
          </Link>
        </div>
      </div>
    </section>
  );
}

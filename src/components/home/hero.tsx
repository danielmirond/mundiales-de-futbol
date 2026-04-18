'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trofeos } from '@/components/brand/trofeos';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale() as Locale;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute -inset-[30%] opacity-60 animate-slow-spin"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(0,255,133,0.35), rgba(255,59,59,0.35), rgba(255,212,0,0.35), rgba(0,255,133,0.35))',
            filter: 'blur(120px)',
          }}
        />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <div className="absolute inset-0 pitch-glow" />
        <div className="absolute inset-0 flame-glow" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/30 to-[var(--color-bg)]" />
      </div>

      {/* Floating trofeos mark — top right of hero, subtle */}
      <div className="pointer-events-none absolute right-6 top-24 z-0 hidden opacity-60 md:block md:right-10 md:top-32 lg:opacity-80">
        <Trofeos size={280} showLabel={false} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]"
        >
          <span className="h-px w-10 bg-[var(--color-pitch)]" />
          {t('kicker')}
        </div>

        <h1
          className="mt-6 font-display text-fluid-display uppercase"
        >
          <span className="block text-[var(--color-fg)]">{t('titleLine1')}</span>
          <span className="block bg-gradient-to-r from-[var(--color-pitch)] via-[var(--color-sun)] to-[var(--color-flame)] bg-clip-text text-transparent">
            {t('titleLine2')}
          </span>
        </h1>

        <p
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl"
        >
          {t('subtitle')}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" variant="primary">
            <Link href={withLocale(locale, '/ediciones')}>
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href={withLocale(locale, '/2026')}>
              <Calendar className="h-4 w-4" />
              {t('ctaSecondary')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocaleSwitcher } from './locale-switcher';
import { LogomarkSeal } from '@/components/brand/logomark-seal';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function SiteNav() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/ediciones', label: t('editions') },
    { href: '/selecciones', label: t('selections') },
    { href: '/jugadores', label: t('players') },
    { href: '/estadios', label: t('stadiums') },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          href={withLocale(locale, '/')}
          className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-fg)]"
        >
          <LogomarkSeal size={40} />
          <span className="hidden font-display text-xl normal-case tracking-tight sm:inline">
            Mundiales
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={withLocale(locale, l.href)}
              className="rounded-full px-4 py-2 text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={withLocale(locale, '/2026')}
            className="ms-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-pitch)] transition-colors hover:bg-[var(--color-pitch)]/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-pitch)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-pitch)]" />
            </span>
            {t('live2026')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-fg)] backdrop-blur lg:hidden"
            aria-label={t('menu')}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)] transition-transform duration-500',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 md:h-20 md:px-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Mundiales</span>
          <button
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)]"
            aria-label={t('close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 pb-10 pt-8 md:px-10">
          {[...links, { href: '/2026', label: t('live2026') }].map((l) => (
            <Link
              key={l.href}
              href={withLocale(locale, l.href)}
              onClick={() => setOpen(false)}
              className="font-display text-6xl uppercase leading-none tracking-tight text-[var(--color-fg)] transition-colors hover:text-[var(--color-pitch)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { routing, type Locale } from '@/i18n/routing';

const COOKIE_NAME = 'mdf_consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type Consent = {
  necessary: true; // always true
  analytics: boolean;
  marketing: boolean;
  ts: number;
  version: 1;
};

function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^|; )' + COOKIE_NAME + '=([^;]*)'));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[2]));
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  const value = encodeURIComponent(JSON.stringify(c));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function CookieBanner() {
  const t = useTranslations('cookies');
  const locale = useLocale() as Locale;
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function accept(all: boolean) {
    const c: Consent = {
      necessary: true,
      analytics: all ? true : analytics,
      marketing: all ? true : marketing,
      ts: Date.now(),
      version: 1,
    };
    writeConsent(c);
    setVisible(false);
  }

  function reject() {
    const c: Consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      ts: Date.now(),
      version: 1,
    };
    writeConsent(c);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-bg-2)]/95 p-6 shadow-2xl backdrop-blur md:p-8"
      role="dialog"
      aria-labelledby="cookie-banner-title"
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2
            id="cookie-banner-title"
            className="font-display text-2xl uppercase leading-tight text-[var(--color-fg)]"
          >
            {t('title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {t('intro')}{' '}
            <Link
              href={withLocale(locale, '/cookies')}
              className="underline hover:text-[var(--color-fg)]"
            >
              {t('cookiesPolicyLink')}
            </Link>
            {' · '}
            <Link
              href={withLocale(locale, '/privacidad')}
              className="underline hover:text-[var(--color-fg)]"
            >
              {t('privacyPolicyLink')}
            </Link>
          </p>
        </div>

        {expanded && (
          <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <label className="flex items-start gap-3 opacity-70">
              <input type="checkbox" checked disabled className="mt-1" />
              <span className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-[var(--color-fg)]">{t('necessary.title')}</span>
                <span className="text-xs text-[var(--color-fg-muted)]">{t('necessary.desc')}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 accent-[var(--color-pitch)]"
              />
              <span className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-[var(--color-fg)]">{t('analytics.title')}</span>
                <span className="text-xs text-[var(--color-fg-muted)]">{t('analytics.desc')}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 accent-[var(--color-pitch)]"
              />
              <span className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-[var(--color-fg)]">{t('marketing.title')}</span>
                <span className="text-xs text-[var(--color-fg-muted)]">{t('marketing.desc')}</span>
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => accept(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 text-sm font-medium text-black transition-colors hover:bg-white"
          >
            {t('acceptAll')}
          </button>
          <button
            onClick={reject}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)]"
          >
            {t('rejectAll')}
          </button>
          {expanded ? (
            <button
              onClick={() => accept(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)]"
            >
              {t('saveChoices')}
            </button>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex h-11 items-center justify-center gap-2 px-3 text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {t('configure')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';

type Status = 'idle' | 'sending' | 'ok' | 'error';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const locale = useLocale() as Locale;
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          website: data.get('website'), // honeypot
          consent: data.get('consent') === 'on',
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!res.ok || !json.ok) {
        setStatus('error');
        setErrorMsg(json.error ?? 'error');
        return;
      }
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMsg('network');
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/5 p-8 text-[var(--color-fg)]">
        <div className="font-display text-2xl uppercase leading-none text-[var(--color-pitch)]">
          {t('successTitle')}
        </div>
        <p className="mt-4 text-[var(--color-fg-muted)]">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot: hidden from humans. Any value means it's a bot. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {t('nameLabel')} *
          </span>
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            maxLength={120}
            className="h-12 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-5 text-sm text-[var(--color-fg)] focus:border-[var(--color-pitch)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            {t('emailLabel')} *
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            className="h-12 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-5 text-sm text-[var(--color-fg)] focus:border-[var(--color-pitch)] focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {t('subjectLabel')}
        </span>
        <input
          type="text"
          name="subject"
          maxLength={200}
          className="h-12 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-5 text-sm text-[var(--color-fg)] focus:border-[var(--color-pitch)] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {t('messageLabel')} *
        </span>
        <textarea
          required
          name="message"
          rows={6}
          minLength={10}
          maxLength={5000}
          className="min-h-[160px] rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-5 py-4 text-sm text-[var(--color-fg)] focus:border-[var(--color-pitch)] focus:outline-none"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]">
        <input
          required
          type="checkbox"
          name="consent"
          className="mt-1 accent-[var(--color-pitch)]"
        />
        <span>
          {t('consent')}{' '}
          <Link
            href={withLocale(locale, '/privacidad')}
            className="underline hover:text-[var(--color-fg)]"
          >
            {t('privacyLink')}
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 text-sm font-medium text-black transition-all duration-300 hover:bg-white hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
        {status === 'error' && (
          <span className="text-sm text-[var(--color-flame)]">
            {errorMsg === 'rate_limited'
              ? t('errorRateLimit')
              : errorMsg === 'invalid_input'
                ? t('errorValidation')
                : t('errorGeneric')}
          </span>
        )}
      </div>
    </form>
  );
}

import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { TimelineMark } from '@/components/brand/timeline';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const locale = (await getLocale()) as Locale;
  return (
    <footer className="relative mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-10">
        <div>
          <TimelineMark size={40} ticks={14} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {t('tagline')}
          </p>
        </div>
        <div className="text-sm text-[var(--color-fg-muted)]">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            1930 — 2026
          </div>
          <ul className="mt-4 space-y-2">
            <li>22 ediciones</li>
            <li>2.578 partidos</li>
            <li>2.720 goles</li>
            <li>8 campeones</li>
          </ul>
        </div>
        <div className="text-sm text-[var(--color-fg-muted)]">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            Open data
          </div>
          <p className="mt-4 leading-relaxed">{t('credits')}</p>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-4 px-6 py-6 text-xs text-[var(--color-fg-subtle)] md:flex-row md:items-center md:justify-between md:px-10">
          <span className="tab-num">© {new Date().getFullYear()} mundiales-de-futbol.com</span>
          <nav className="flex items-center gap-5 text-[11px] font-mono uppercase tracking-widest">
            <Link
              href={withLocale(locale, '/privacidad')}
              className="transition-colors hover:text-[var(--color-fg)]"
            >
              {t('privacy')}
            </Link>
            <Link
              href={withLocale(locale, '/cookies')}
              className="transition-colors hover:text-[var(--color-fg)]"
            >
              {t('cookies')}
            </Link>
            <span className="font-mono uppercase tracking-widest">v0.1 · alpha</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}

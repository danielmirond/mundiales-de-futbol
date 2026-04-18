import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { TOURNAMENTS } from '@/lib/tournaments';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function EditionsGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.editions');

  return (
    <section id="ediciones" className="relative mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            1930 — 2026
          </div>
          <h2 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.92]">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[var(--color-fg-muted)]">{t('subtitle')}</p>
        </div>
        <Link
          href={withLocale(locale, '/ediciones')}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          {t('viewAll')}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-px bg-[var(--color-border)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {TOURNAMENTS.map((ed) => {
          const upcoming = ed.year >= 2026;
          return (
            <Link
              key={ed.year}
              href={withLocale(locale, `/ediciones/${ed.slug}`)}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1.5 transition-all duration-500 group-hover:h-2.5"
                style={{ background: `linear-gradient(90deg, ${ed.palette.from}, ${ed.palette.to})` }}
              />
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl tab-num text-[var(--color-fg)] md:text-4xl">
                  {ed.year}
                </span>
                {upcoming && (
                  <span className="rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-pitch)]">
                    Next
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
                  {ed.host}
                </div>
                <div className="mt-1 text-sm text-[var(--color-fg)]">
                  {upcoming ? '—' : `🏆 ${ed.champion}`}
                </div>
                <div className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  <span>{ed.teams}T</span>
                  {ed.matches ? <span>{ed.matches}P</span> : null}
                  {ed.goals ? <span>{ed.goals}G</span> : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

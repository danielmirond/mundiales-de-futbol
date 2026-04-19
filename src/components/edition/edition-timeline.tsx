import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TOURNAMENTS } from '@/lib/tournaments';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Horizontal band with all 22 editions as ticks. Previous / next arrows
 * flank. The active edition gets a glow + year label. Tap any tick to
 * jump to that tournament.
 */
export function EditionTimeline({
  currentYear,
  locale,
}: {
  currentYear: number;
  locale: Locale;
}) {
  const editions = TOURNAMENTS;
  const idx = editions.findIndex((e) => e.year === currentYear);
  const prev = idx > 0 ? editions[idx - 1] : null;
  const next = idx < editions.length - 1 ? editions[idx + 1] : null;

  return (
    <nav
      aria-label="Ediciones del Mundial"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-2)]/60 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-4 px-4 py-4 md:px-10">
        <Link
          aria-label="Edición anterior"
          href={prev ? withLocale(locale, `/ediciones/${prev.slug}`) : '#'}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors',
            prev
              ? 'text-[var(--color-fg)] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]'
              : 'pointer-events-none opacity-30 text-[var(--color-fg-subtle)]',
          )}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>

        <ul className="flex flex-1 items-center gap-0 overflow-x-auto scrollbar-none">
          {editions.map((e) => {
            const active = e.year === currentYear;
            return (
              <li key={e.year} className="relative min-w-0 flex-1">
                <Link
                  href={withLocale(locale, `/ediciones/${e.slug}`)}
                  className="group flex flex-col items-center gap-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pitch)] rounded-md"
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'block h-px w-full transition-all',
                      active ? 'h-[2px] bg-[var(--color-pitch)]' : 'bg-[var(--color-border-strong)]',
                    )}
                  />
                  <span
                    className={cn(
                      'flex h-2 w-2 shrink-0 items-center justify-center rounded-full transition-all',
                      active
                        ? 'h-3 w-3 bg-[var(--color-pitch)]'
                        : 'bg-[var(--color-fg-subtle)] group-hover:bg-[var(--color-fg)]',
                    )}
                    style={active ? { boxShadow: '0 0 16px 3px rgba(0,255,133,0.7)' } : {}}
                  />
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase tracking-widest transition-colors',
                      active
                        ? 'text-[var(--color-pitch)]'
                        : 'text-[var(--color-fg-subtle)] group-hover:text-[var(--color-fg)]',
                    )}
                  >
                    {e.year}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          aria-label="Edición siguiente"
          href={next ? withLocale(locale, `/ediciones/${next.slug}`) : '#'}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors',
            next
              ? 'text-[var(--color-fg)] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]'
              : 'pointer-events-none opacity-30 text-[var(--color-fg-subtle)]',
          )}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </nav>
  );
}

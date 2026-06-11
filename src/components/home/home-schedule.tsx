import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { WC2026Calendar } from '@/components/edition/wc2026-calendar';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/** Sección de la home: calendario completo del Mundial 2026 + enlace. */
export function HomeSchedule({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <CalendarDays className="h-4 w-4" />
              Calendario
            </div>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-5xl">
              Todos los partidos del Mundial 2026
            </h2>
          </div>
          <Link
            href={withLocale(locale, '/2026/calendario')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Ver calendario completo
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-10">
          <WC2026Calendar locale={locale} />
        </div>
      </div>
    </section>
  );
}

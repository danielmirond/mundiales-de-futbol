import Link from 'next/link';
import { ArrowRight, ListChecks } from 'lucide-react';
import { GROUPS_2026, getTeam2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/** Sección de la home: los 12 grupos del Mundial 2026 + enlace. */
export function HomeGroups({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <ListChecks className="h-4 w-4" />
              Grupos
            </div>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-5xl">
              Los 12 grupos · 48 selecciones
            </h2>
          </div>
          <Link
            href={withLocale(locale, '/2026/grupos')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Ver grupos y clasificación
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GROUPS_2026.map((g) => {
            const teams = (g.teams.filter(Boolean) as string[])
              .map((c) => getTeam2026(c))
              .filter(Boolean);
            return (
              <li key={g.letter} className="bg-[var(--color-bg)]">
                <Link
                  href={withLocale(locale, `/2026/grupo/${g.letter}`)}
                  className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <span className="font-display text-4xl uppercase leading-none text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                    Grupo {g.letter}
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {teams.map((tm) => (
                      <li key={tm!.code} className="flex items-center gap-2.5">
                        <span aria-hidden className="text-lg">{tm!.flag}</span>
                        <span className="text-sm font-medium text-[var(--color-fg)]">{tm!.name}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

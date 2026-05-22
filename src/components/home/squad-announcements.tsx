import Link from 'next/link';
import { ArrowRight, ListChecks } from 'lucide-react';
import { SQUADS_2026, STATUS_LABELS } from '@/lib/wc-2026-squads';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Tira de listas anunciadas en la home.
 *
 * Renderiza las 8 selecciones más recientes con `status !== 'pending'`
 * (orden descendente por `announcedAt`) con bandera, nombre, entrenador,
 * fecha y badge del estado (final / provisional). Sirve como entrada
 * rápida al cluster `/2026/listas/{code}` desde la página de inicio,
 * dando visibilidad extra al contenido de convocatorias que de otro
 * modo solo viviría dentro del DailyNews carousel.
 */

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function SquadAnnouncements({ locale }: { locale: Locale }) {
  const announced = SQUADS_2026.filter((s) => s.status !== 'pending')
    .sort((a, b) =>
      (b.announcedAt ?? '').localeCompare(a.announcedAt ?? ''),
    )
    .slice(0, 8);

  if (announced.length === 0) return null;

  const totalAnnounced = SQUADS_2026.filter((s) => s.status !== 'pending').length;

  return (
    <section className="relative border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <ListChecks className="h-3 w-3" />
              <span>
                Listas Mundial 2026 · {totalAnnounced}/48 anunciadas
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-4xl">
              Últimas convocatorias confirmadas
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)]">
              Plantillas oficiales con entrenador, fecha y fuente oficial conforme cada federación las anuncia. Plazo FIFA: 1 de junio para las 26 definitivas.
            </p>
          </div>
          <Link
            href={withLocale(locale, '/2026/listas')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Todas las listas
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <ul
          className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {announced.map((s) => {
            const team = TEAMS_2026[s.teamCode];
            if (!team) return null;
            const isFinal = s.status === 'final';
            return (
              <li key={s.teamCode} className="bg-[var(--color-bg-2)]">
                <Link
                  href={withLocale(locale, `/2026/listas/${s.teamCode}`)}
                  className="group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-[var(--color-bg)]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span aria-hidden className="text-3xl leading-none">
                      {team.flag}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] ${
                        isFinal
                          ? 'border-[var(--color-pitch)]/40 text-[var(--color-pitch)]'
                          : 'border-amber-500/40 text-amber-300'
                      }`}
                    >
                      {STATUS_LABELS[s.status]}
                    </span>
                  </div>
                  <div className="font-display text-xl uppercase leading-none text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">
                    {team.name}
                  </div>
                  {s.coach && (
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                      {s.coach}
                    </div>
                  )}
                  {s.announcedAt && (
                    <div className="mt-auto font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      Anunciada {s.announcedAt.slice(5)}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

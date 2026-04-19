import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getFormatter } from 'next-intl/server';
import { ArrowLeft, Trophy, Users, Activity, Target, CalendarDays } from 'lucide-react';
import { TOURNAMENTS, getTournament } from '@/lib/tournaments';
import { routing, type Locale } from '@/i18n/routing';
import { MatchesList } from '@/components/edition/matches-list';
import { ArchiveVideos } from '@/components/edition/archive-videos';
import { PressWall } from '@/components/edition/press-wall';
import { EditionTimeline } from '@/components/edition/edition-timeline';

export function generateStaticParams() {
  return TOURNAMENTS.flatMap((t) =>
    routing.locales.map((locale) => ({ locale, slug: t.slug })),
  );
}

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = getTournament(slug);
  if (!t) notFound();

  const format = await getFormatter();
  const upcoming = t.year >= 2026;

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex min-h-[70svh] flex-col justify-end overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${t.palette.from}66, ${t.palette.to}55 50%, transparent)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/ediciones')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> 1930 — 2026
          </Link>
          <div
            className="mt-6 font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: t.palette.from }}
          >
            FIFA World Cup
          </div>
          <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.88]">
            <span className="block tab-num text-[var(--color-fg)]">{t.year}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${t.palette.from}, ${t.palette.to})` }}
            >
              {t.host}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-fg-muted)] md:text-2xl">
            {t.tagline}
          </p>
          {t.summary && (
            <p className="mt-3 max-w-2xl text-base italic leading-relaxed text-[var(--color-fg-subtle)]">
              {t.summary}
            </p>
          )}
        </div>
      </section>

      <EditionTimeline currentYear={t.year} locale={locale as Locale} />

      {/* Stats */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Trophy, label: 'Campeón', value: upcoming ? '—' : t.champion },
            { Icon: Users, label: 'Selecciones', value: String(t.teams) },
            { Icon: Activity, label: 'Partidos', value: t.matches ? format.number(t.matches) : '—' },
            { Icon: Target, label: 'Goles', value: t.goals ? format.number(t.goals) : '—' },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-3 bg-[var(--color-bg-2)] p-6 md:p-8">
              <Icon className="h-5 w-5" style={{ color: t.palette.from }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {label}
              </span>
              <span className="font-display text-4xl text-[var(--color-fg)] md:text-5xl">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Meta */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-fluid-h2 uppercase">Datos clave</h2>
            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-5 text-base">
              <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Sede
              </dt>
              <dd>{t.host}</dd>
              <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Fechas
              </dt>
              <dd className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[var(--color-fg-muted)]" />
                {t.startDate} — {t.endDate}
              </dd>
              {!upcoming && (
                <>
                  <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    Asistencia total
                  </dt>
                  <dd>{format.number(t.attendance)}</dd>
                  {t.topScorer && (
                    <>
                      <dt className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
                        Máximo goleador
                      </dt>
                      <dd>
                        {t.topScorer.name} · <span className="text-[var(--color-fg-muted)]">{t.topScorer.team}</span> · {t.topScorer.goals} goles
                      </dd>
                    </>
                  )}
                </>
              )}
            </dl>
          </div>
          <aside className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
              Próximamente
            </div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-fg-muted)]">
              <li>• Plantillas de las {t.teams} selecciones</li>
              <li>• Eventos minuto a minuto (goles, tarjetas, cambios)</li>
              <li>• Mapas de tiros con xG (StatsBomb)</li>
              <li>• Vídeos históricos (archive.org)</li>
              <li>• Crónicas generadas por IA</li>
            </ul>
          </aside>
        </div>
      </section>

      <PressWall year={t.year} locale={locale} />

      <ArchiveVideos year={t.year} locale={locale} />

      <MatchesList year={t.year} slug={slug} locale={locale as Locale} />
    </div>
  );
}

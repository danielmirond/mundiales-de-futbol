import Link from 'next/link';
import { FIXTURES_2026, VENUES_2026, STAGE_LABEL, type Fixture26 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function formatLongDate(date: string) {
  const d = new Date(date + 'T00:00:00');
  return new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d);
}

function Pill({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex h-6 items-center rounded-full px-2 font-mono text-[10px] uppercase tracking-widest"
      style={{
        background: color ? `${color}22` : 'var(--color-bg-2)',
        color: color ?? 'var(--color-fg-muted)',
        border: `1px solid ${color ? `${color}55` : 'var(--color-border)'}`,
      }}
    >
      {children}
    </span>
  );
}

export function WC2026Calendar({ locale }: { locale: Locale }) {
  // Group fixtures by date
  const byDate = new Map<string, Fixture26[]>();
  for (const f of FIXTURES_2026) {
    if (!byDate.has(f.date)) byDate.set(f.date, []);
    byDate.get(f.date)!.push(f);
  }
  const days = [...byDate.keys()].sort();

  const venueBySlug = new Map(VENUES_2026.map((v) => [v.slug, v]));

  return (
    <section id="calendario" className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Calendario · 104 partidos · 11 jun → 19 jul
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        Día a día
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
        Fechas, sedes y fase de cada partido del Mundial 2026. Los equipos se
        rellenan según avance la competición.
      </p>

      <div className="mt-10 space-y-8">
        {days.map((day) => {
          const fixtures = byDate.get(day)!;
          const [yyyy, mm, dd] = day.split('-');
          return (
            <div key={day}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                <div className="flex items-baseline gap-5">
                  <div className="font-display text-5xl tab-num text-[var(--color-fg)] leading-none">
                    {dd}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                      {formatLongDate(day)}
                    </div>
                    <div className="mt-1 font-mono text-xs text-[var(--color-fg-muted)] tab-num">
                      {yyyy}-{mm} · {fixtures.length} partido{fixtures.length === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
                {fixtures.map((f) => {
                  const venue = venueBySlug.get(f.venue);
                  const stageLabel = STAGE_LABEL[f.stage] ?? f.stage;
                  const isKO = ['R32', 'R16', 'QF', 'SF', '3P', 'F'].includes(f.stage);
                  return (
                    <div
                      key={f.n}
                      className="flex flex-col gap-3 bg-[var(--color-bg)] p-4 hover:bg-[var(--color-bg-2)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Pill color={isKO ? 'var(--color-pitch)' : undefined}>
                          {stageLabel}
                        </Pill>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)] tab-num">
                          {f.time}
                        </span>
                      </div>
                      <div className="font-display text-lg uppercase text-[var(--color-fg)]">
                        {f.home && f.away ? (
                          <span>{f.home}, {f.away}</span>
                        ) : f.home ? (
                          <span>{f.home} <span className="text-[var(--color-fg-subtle)]">- TBD</span></span>
                        ) : f.label ? (
                          <span>{f.label}</span>
                        ) : (
                          <span className="text-[var(--color-fg-subtle)] italic">Por decidir</span>
                        )}
                      </div>
                      {venue && (
                        <Link
                          href={withLocale(locale, `/estadios/${venue.slug}`)}
                          className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
                        >
                          {venue.name} · {venue.hostCity}, {venue.country}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

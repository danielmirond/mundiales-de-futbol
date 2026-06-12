import Link from 'next/link';
import { FIXTURES_2026, VENUES_2026, STAGE_LABEL } from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// ── Conversión a hora de España (Europe/Madrid) ──────────────────────────────
// Cada partido trae hora LOCAL de su estadio; la pasamos a UTC y la formateamos
// en horario peninsular. Reagrupamos por la FECHA en Madrid (un partido nocturno
// en EE. UU. cae de madrugada del día siguiente aquí).
const MADRID = 'Europe/Madrid';
const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const longFmt = new Intl.DateTimeFormat('es', {
  timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long',
});

type Enriched = {
  f: (typeof FIXTURES_2026)[number];
  ms: number;
  madridDate: string; // YYYY-MM-DD en Madrid
  madridTime: string; // HH:MM en Madrid
};

const ENRICHED: Enriched[] = FIXTURES_2026.map((f) => {
  const ms = new Date(fixtureToUTC(f)).getTime();
  return { f, ms, madridDate: dateKeyFmt.format(ms), madridTime: timeFmt.format(ms) };
});

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

export async function WC2026Calendar({ locale }: { locale: Locale }) {
  const scoreMap = buildScoreMap(await fetchScores());

  // Agrupar por fecha en Madrid
  const byDate = new Map<string, Enriched[]>();
  for (const e of ENRICHED) {
    if (!byDate.has(e.madridDate)) byDate.set(e.madridDate, []);
    byDate.get(e.madridDate)!.push(e);
  }
  // Ordenar partidos del día por hora real
  for (const list of byDate.values()) list.sort((a, b) => a.ms - b.ms);
  const days = [...byDate.keys()].sort();

  const venueBySlug = new Map(VENUES_2026.map((v) => [v.slug, v]));

  return (
    <section id="calendario" className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Calendario · 104 partidos · 11 jun → 19 jul · hora de España
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        Día a día
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-fg-muted)]">
        Fechas, sedes y fase de cada partido del Mundial 2026, con los horarios en
        hora peninsular española (Madrid). Los equipos se rellenan según avance la
        competición.
      </p>

      <div className="mt-10 space-y-8">
        {days.map((day) => {
          const entries = byDate.get(day)!;
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
                      {longFmt.format(entries[0].ms)}
                    </div>
                    <div className="mt-1 font-mono text-xs text-[var(--color-fg-muted)] tab-num">
                      {yyyy}-{mm} · {entries.length} partido{entries.length === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
                {entries.map(({ f, madridTime }) => {
                  const venue = venueBySlug.get(f.venue);
                  const stageLabel = STAGE_LABEL[f.stage] ?? f.stage;
                  const isKO = ['R32', 'R16', 'QF', 'SF', '3P', 'F'].includes(f.stage);
                  const sc = scoreMap.get(scoreKey(f.home, f.away));
                  const played = sc && sc.state !== 'pre' && sc.homeScore !== null && sc.awayScore !== null;
                  return (
                    <div
                      key={f.n}
                      className="flex flex-col gap-3 bg-[var(--color-bg)] p-4 hover:bg-[var(--color-bg-2)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Pill color={isKO ? 'var(--color-pitch)' : undefined}>
                          {stageLabel}
                        </Pill>
                        {played ? (
                          <span className="tab-num font-display text-base leading-none text-[var(--color-fg)]">
                            {sc!.homeScore}<span className="text-[var(--color-fg-subtle)]">-</span>{sc!.awayScore}
                            {sc!.state === 'in' && (
                              <span className="ms-2 font-mono text-[9px] uppercase tracking-widest text-[var(--color-flame)]">
                                {sc!.clock || 'EN VIVO'}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)] tab-num">
                            {madridTime} h
                          </span>
                        )}
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

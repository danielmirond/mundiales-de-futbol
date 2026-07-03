import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { FIXTURES_2026, TEAMS_2026, STAGE_LABEL, matchSlug } from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { resolveKnockout, wentToShootout } from '@/lib/wc-2026-knockout';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/** Slug canónico: equipos en grupos; `partido-N` en eliminatorias. */
const linkSlug = (f: (typeof FIXTURES_2026)[number]) =>
  f.stage.length === 1 ? matchSlug(f) : `partido-${f.n}`;

const MADRID = 'Europe/Madrid';
const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const dayFmt = new Intl.DateTimeFormat('es', {
  timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long',
});

type Row = { f: (typeof FIXTURES_2026)[number]; ms: number; dateKey: string };

const SCHED: Row[] = FIXTURES_2026
  .map((f) => {
    const ms = new Date(fixtureToUTC(f)).getTime();
    return { f, ms, dateKey: dateKeyFmt.format(ms) };
  })
  .sort((a, b) => a.ms - b.ms);

type ScoreMap = ReturnType<typeof buildScoreMap>;

function TeamMini({ code, label }: { code?: string; label?: string }) {
  const team = code ? TEAMS_2026[code] : undefined;
  return (
    <span className="flex min-w-0 flex-col items-center gap-1 text-center">
      <span className="text-2xl leading-none" aria-hidden>{team?.flag ?? '⚽'}</span>
      <span className="w-full truncate text-xs font-medium text-[var(--color-fg)]">
        {team?.name ?? label ?? code ?? '—'}
      </span>
    </span>
  );
}

/** Tarjeta de partido para el carrusel. */
function MatchCard({ row, scoreMap, locale }: { row: Row; scoreMap: ScoreMap; locale: Locale }) {
  const { f, ms } = row;
  const sc = scoreMap.get(scoreKey(f.home, f.away));
  const played = sc && sc.state !== 'pre' && sc.homeScore !== null && sc.awayScore !== null;
  const live = sc?.state === 'in';
  const stage = f.stage.length === 1 ? `Gr. ${f.stage}` : (STAGE_LABEL[f.stage] ?? f.stage);
  return (
    <Link
      href={withLocale(locale, `/2026/partido/${linkSlug(f)}`)}
      className="flex w-[240px] shrink-0 snap-start flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 transition-colors hover:border-[var(--color-pitch)]/40 hover:bg-[var(--color-bg-2)]"
    >
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        <span>{stage}</span>
        {live ? (
          <span className="inline-flex items-center gap-1 text-[var(--color-flame)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-flame)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-flame)]" />
            </span>
            EN DIRECTO{sc!.clock ? ` · ${sc!.clock}` : ''}
          </span>
        ) : played ? (
          <span>Final</span>
        ) : (
          <span className="tab-num">{timeFmt.format(ms)} h</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <TeamMini code={f.home} label={f.label} />
        <span className="flex shrink-0 flex-col items-center self-center px-1">
          {played ? (
            <>
              <span className="font-display tab-num text-2xl leading-none text-[var(--color-fg)]">
                {sc!.homeScore}<span className="text-[var(--color-fg-subtle)]">-</span>{sc!.awayScore}
              </span>
              {sc && wentToShootout(sc) && (
                <span className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {sc.shootoutHome}-{sc.shootoutAway} pen.
                </span>
              )}
            </>
          ) : (
            <span className="font-mono text-xs text-[var(--color-fg-subtle)]">vs</span>
          )}
        </span>
        <TeamMini code={f.away} />
      </div>
    </Link>
  );
}

/** Calendario de la home: carrusel de los partidos de hoy + lista de próximos. */
export async function HomeSchedule({ locale }: { locale: Locale }) {
  const scoreMap = buildScoreMap(await fetchScores());
  // Eliminatorias: resolver equipos reales en vivo (fixtures traen solo el cuadro).
  const ko = await resolveKnockout();
  const withTeams = (row: Row): Row => {
    const r = ko.get(row.f.n);
    return r?.home && r?.away ? { ...row, f: { ...row.f, home: r.home, away: r.away } } : row;
  };
  const now = Date.now();
  const todayKey = dateKeyFmt.format(now);

  let carouselDay = todayKey;
  let carousel = SCHED.filter((s) => s.dateKey === todayKey);
  if (carousel.length === 0) {
    const next = SCHED.find((s) => s.ms > now);
    if (next) { carouselDay = next.dateKey; carousel = SCHED.filter((s) => s.dateKey === next.dateKey); }
  }
  carousel = carousel.map(withTeams);
  const isToday = carouselDay === todayKey;

  // Lista de próximos días (siguientes a la jornada del carrusel), hasta ~8 partidos.
  const upcoming = SCHED.filter((s) => s.dateKey > carouselDay && s.ms > now).slice(0, 8).map(withTeams);
  const upcomingDays: { key: string; rows: Row[] }[] = [];
  for (const r of upcoming) {
    let g = upcomingDays.find((x) => x.key === r.dateKey);
    if (!g) { g = { key: r.dateKey, rows: [] }; upcomingDays.push(g); }
    g.rows.push(r);
  }

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <CalendarDays className="h-4 w-4" />
              {isToday ? 'Partidos de hoy' : 'Próxima jornada'}
            </div>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-5xl">
              Mundial 2026 en directo
            </h2>
            {carousel.length > 0 && (
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                {dayFmt.format(carousel[0].ms)}
              </p>
            )}
          </div>
          <Link
            href={withLocale(locale, '/2026/calendario')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Ver calendario completo
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        {/* Carrusel de partidos del día */}
        {carousel.length > 0 && (
          <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
            {carousel.map((row) => (
              <MatchCard key={row.f.n} row={row} scoreMap={scoreMap} locale={locale} />
            ))}
          </div>
        )}

        {/* Próximos días */}
        {upcomingDays.length > 0 && (
          <div className="mt-10 space-y-6">
            {upcomingDays.map((g) => (
              <div key={g.key}>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {dayFmt.format(g.rows[0].ms)}
                </div>
                <ul className="mt-3 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                  {g.rows.map(({ f, ms }) => {
                    const stage = f.stage.length === 1 ? `Gr. ${f.stage}` : (STAGE_LABEL[f.stage] ?? f.stage);
                    return (
                      <li key={f.n} className="flex items-center gap-3 px-4 py-3">
                        <span className="w-14 shrink-0 text-center font-mono text-xs tab-num text-[var(--color-fg-muted)]">
                          {timeFmt.format(ms)}
                        </span>
                        <Link
                          href={withLocale(locale, `/2026/partido/${linkSlug(f)}`)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-sm transition-opacity hover:opacity-80"
                        >
                          <span aria-hidden className="text-base">{f.home ? TEAMS_2026[f.home]?.flag : '⚽'}</span>
                          <span className="truncate text-[var(--color-fg)]">{f.home ? TEAMS_2026[f.home]?.name : f.label}</span>
                          <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">vs</span>
                          <span aria-hidden className="text-base">{f.away ? TEAMS_2026[f.away]?.flag : '⚽'}</span>
                          <span className="truncate text-[var(--color-fg)]">{f.away ? TEAMS_2026[f.away]?.name : ''}</span>
                        </Link>
                        <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)] sm:block">
                          {stage}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

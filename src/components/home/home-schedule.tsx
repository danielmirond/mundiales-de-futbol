import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { FIXTURES_2026, TEAMS_2026, STAGE_LABEL } from '@/lib/wc-2026';
import { fixtureToUTC } from '@/lib/wc-2026-fixture-utc';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

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

function Team({ code, label }: { code?: string; label?: string }) {
  const team = code ? TEAMS_2026[code] : undefined;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="text-lg leading-none" aria-hidden>{team?.flag ?? '⚽'}</span>
      <span className="truncate text-sm text-[var(--color-fg)]">
        {team?.name ?? label ?? code ?? '—'}
      </span>
    </span>
  );
}

/** Calendario compacto de la home: partidos de hoy (con resultado) + próximos. */
export async function HomeSchedule({ locale }: { locale: Locale }) {
  const scoreMap = buildScoreMap(await fetchScores());
  const now = Date.now();
  const todayKey = dateKeyFmt.format(now);

  // Partidos de hoy (jugados, en vivo o por jugar) + próximos hasta ~9 en total.
  const todays = SCHED.filter((s) => s.dateKey === todayKey);
  const future = SCHED.filter((s) => s.dateKey !== todayKey && s.ms > now);
  let list = [...todays, ...future].slice(0, Math.min(9, Math.max(6, todays.length)));
  if (list.length === 0) list = future.slice(0, 6); // fallback (entre fases)

  // Agrupar por día (Madrid) conservando orden
  const groups: { key: string; rows: Row[] }[] = [];
  for (const r of list) {
    let g = groups.find((x) => x.key === r.dateKey);
    if (!g) { g = { key: r.dateKey, rows: [] }; groups.push(g); }
    g.rows.push(r);
  }

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <CalendarDays className="h-4 w-4" />
              Calendario · hoy y próximos
            </div>
            <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-5xl">
              Partidos del Mundial 2026
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

        <div className="mt-10 space-y-8">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {g.key === todayKey ? 'Hoy · ' : ''}{dayFmt.format(g.rows[0].ms)}
              </div>
              <ul className="mt-3 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                {g.rows.map(({ f, ms }) => {
                  const sc = scoreMap.get(scoreKey(f.home, f.away));
                  const played = sc && sc.state !== 'pre' && sc.homeScore !== null && sc.awayScore !== null;
                  const live = sc?.state === 'in';
                  const stage = f.stage.length === 1 ? `Gr. ${f.stage}` : (STAGE_LABEL[f.stage] ?? f.stage);
                  return (
                    <li key={f.n} className="flex items-center gap-3 px-4 py-3 md:px-5">
                      {/* Hora / marcador */}
                      <div className="w-14 shrink-0 text-center">
                        {played ? (
                          <span className="font-display text-lg tab-num leading-none text-[var(--color-fg)]">
                            {sc!.homeScore}<span className="text-[var(--color-fg-subtle)]">-</span>{sc!.awayScore}
                          </span>
                        ) : (
                          <span className="font-mono text-xs tab-num text-[var(--color-fg-muted)]">
                            {timeFmt.format(ms)}
                          </span>
                        )}
                        {live && (
                          <div className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-[var(--color-flame)]">
                            {sc!.clock || 'EN VIVO'}
                          </div>
                        )}
                      </div>

                      {/* Equipos */}
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Team code={f.home} label={f.label} />
                        <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">vs</span>
                        <Team code={f.away} />
                      </div>

                      {/* Fase */}
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
      </div>
    </section>
  );
}

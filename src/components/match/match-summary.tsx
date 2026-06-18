import type { MatchSummary, LineupPlayer, MatchEvent } from '@/lib/wc-2026-match-summary';

const KIND_ICON: Record<MatchEvent['kind'], string> = {
  goal: '⚽',
  yellow: '🟨',
  red: '🟥',
  sub: '🔁',
  var: '📺',
  other: '•',
};

function Lineup({
  team,
  flag,
  formation,
  starters,
  subs,
}: {
  team: string;
  flag: string;
  formation: string | null;
  starters: LineupPlayer[];
  subs: LineupPlayer[];
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)]">
          {flag} {team}
        </h3>
        {formation && (
          <span className="font-mono text-xs tab-num text-[var(--color-pitch)]">{formation}</span>
        )}
      </div>
      <ul className="mt-4 space-y-1.5">
        {starters.map((p, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="inline-grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[var(--color-bg)] font-mono text-[10px] tab-num text-[var(--color-fg-muted)]">
              {p.jersey || '·'}
            </span>
            <span className="flex-1 truncate text-[var(--color-fg)]">{p.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
              {p.pos}
            </span>
          </li>
        ))}
      </ul>
      {subs.length > 0 && (
        <>
          <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            Suplentes
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-fg-muted)]">
            {subs.map((p) => p.name).join(' · ')}
          </p>
        </>
      )}
    </div>
  );
}

export function MatchSummarySections({
  summary,
  homeName,
  awayName,
  homeFlag,
  awayFlag,
}: {
  summary: MatchSummary;
  homeName: string;
  awayName: string;
  homeFlag: string;
  awayFlag: string;
}) {
  return (
    <>
      {/* ── ESTADÍSTICAS ── */}
      {summary.hasStats && (
        <section className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10">
          <h2 className="font-display text-fluid-h2 uppercase leading-none">Estadísticas</h2>
          <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between gap-3 bg-[var(--color-bg-2)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              <span>{homeFlag} {homeName}</span>
              <span>{awayName} {awayFlag}</span>
            </div>
            <ul>
              {summary.stats.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] px-4 py-3 text-sm"
                >
                  <span className="w-12 text-left font-mono tab-num font-semibold text-[var(--color-fg)]">
                    {s.home}
                  </span>
                  <span className="flex-1 text-center text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">
                    {s.label}
                  </span>
                  <span className="w-12 text-right font-mono tab-num font-semibold text-[var(--color-fg)]">
                    {s.away}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── MOMENTOS CLAVE ── */}
      {summary.hasEvents && (
        <section className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10">
          <h2 className="font-display text-fluid-h2 uppercase leading-none">Momentos clave</h2>
          <ul className="mt-6 space-y-2">
            {summary.events.map((e, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3"
              >
                <span className="inline-grid h-7 min-w-[2.75rem] place-items-center rounded-full bg-[var(--color-bg)] px-2 font-mono text-xs tab-num text-[var(--color-pitch)]">
                  {e.minute || '·'}
                </span>
                <span className="mt-0.5 text-base leading-none" aria-hidden>
                  {KIND_ICON[e.kind]}
                </span>
                <span className="flex-1 text-sm text-[var(--color-fg-muted)]">
                  <span className="font-medium text-[var(--color-fg)]">{e.type}</span>
                  {e.players.length > 0 && <> · {e.players.join(' → ')}</>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── ALINEACIONES ── */}
      {summary.hasLineups && (
        <section className="mx-auto mt-12 w-full max-w-[1000px] px-6 md:px-10">
          <h2 className="font-display text-fluid-h2 uppercase leading-none">Alineaciones</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Lineup
              team={homeName}
              flag={homeFlag}
              formation={summary.formationHome}
              starters={summary.startHome}
              subs={summary.subsHome}
            />
            <Lineup
              team={awayName}
              flag={awayFlag}
              formation={summary.formationAway}
              starters={summary.startAway}
              subs={summary.subsAway}
            />
          </div>
        </section>
      )}
    </>
  );
}

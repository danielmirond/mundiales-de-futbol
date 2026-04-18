import { MapPin } from 'lucide-react';
import { getMatchesForTournament, groupByStage, STAGE_LABEL_ES } from '@/lib/data/matches';

function formatDate(iso: string, locale = 'es') {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function MatchesList({ year }: { year: number }) {
  const matches = await getMatchesForTournament(year);
  if (matches.length === 0) return null;
  const groups = groupByStage(matches);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Calendario completo
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-[0.95]">
            {matches.length} partidos
          </h2>
        </div>
      </div>

      <div className="mt-12 space-y-16">
        {groups.map(({ stage, matches }) => (
          <div key={stage}>
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                {STAGE_LABEL_ES[stage] ?? stage}
              </span>
              <span className="text-xs text-[var(--color-fg-subtle)] tab-num">
                {matches.length}
              </span>
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
            <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((m) => (
                <article
                  key={m.match_number}
                  className="group flex flex-col gap-4 bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)] font-mono">
                    <span>{formatDate(m.match_date)}</span>
                    {m.venue?.name && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {m.venue.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center gap-3 justify-end text-end">
                      <span
                        className={`truncate text-base ${
                          m.winner_code === m.home_code
                            ? 'font-semibold text-[var(--color-fg)]'
                            : 'text-[var(--color-fg-muted)]'
                        }`}
                      >
                        {m.home_team?.name_official ?? m.home_code}
                      </span>
                      <span className="text-2xl">{m.home_team?.flag_emoji ?? '🏳️'}</span>
                    </div>
                    <div className="flex items-center gap-2 font-display text-3xl tab-num text-[var(--color-fg)] md:text-4xl">
                      <span className={m.winner_code === m.home_code ? '' : 'opacity-60'}>
                        {m.home_score ?? '—'}
                      </span>
                      <span className="text-[var(--color-fg-subtle)]">·</span>
                      <span className={m.winner_code === m.away_code ? '' : 'opacity-60'}>
                        {m.away_score ?? '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.away_team?.flag_emoji ?? '🏳️'}</span>
                      <span
                        className={`truncate text-base ${
                          m.winner_code === m.away_code
                            ? 'font-semibold text-[var(--color-fg)]'
                            : 'text-[var(--color-fg-muted)]'
                        }`}
                      >
                        {m.away_team?.name_official ?? m.away_code}
                      </span>
                    </div>
                  </div>

                  {(m.home_score_pk !== null || m.referee?.full_name) && (
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] font-mono">
                      {m.home_score_pk !== null && m.away_score_pk !== null ? (
                        <span>Penales {m.home_score_pk}—{m.away_score_pk}</span>
                      ) : (
                        <span />
                      )}
                      {m.referee?.full_name && <span>Árb · {m.referee.full_name}</span>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { MatchSummary } from '@/lib/wc-2026-match-summary';
import { MatchSummarySections } from './match-summary';

/**
 * Envoltorio cliente del detalle de partido. Renderiza el resumen (SSR para
 * SEO) y, si el partido está EN JUEGO, hace polling al endpoint /api/match-live
 * cada ~25s para actualizar marcador, narración, momentos y estadísticas sin
 * recargar la página: live-blog en directo.
 */
export function LiveMatchSummary({
  initial,
  eventId,
  home,
  away,
  homeName,
  awayName,
  homeFlag,
  awayFlag,
}: {
  initial: MatchSummary;
  eventId: string;
  home: string;
  away: string;
  homeName: string;
  awayName: string;
  homeFlag: string;
  awayFlag: string;
}) {
  const [summary, setSummary] = useState<MatchSummary>(initial);
  const live = summary.state === 'in';

  useEffect(() => {
    if (summary.state !== 'in') return;
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch(
          `/api/match-live?event=${encodeURIComponent(eventId)}&home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}`,
          { cache: 'no-store' },
        );
        const j = await r.json();
        if (!cancelled && j?.summary) setSummary(j.summary as MatchSummary);
      } catch {
        /* reintento en el siguiente tick */
      }
    };
    const id = setInterval(tick, 25_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [summary.state, eventId, home, away]);

  return (
    <>
      {live && (
        <section className="mx-auto mt-8 w-full max-w-[1000px] px-6 md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--color-flame)]/30 bg-[var(--color-flame)]/10 px-5 py-2.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-flame)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-flame)]" />
              En directo
            </span>
            <span className="font-display text-xl tab-num text-[var(--color-fg)]">
              {homeFlag} {summary.homeScore ?? 0}
              <span className="mx-1 text-[var(--color-fg-subtle)]">-</span>
              {summary.awayScore ?? 0} {awayFlag}
            </span>
            {summary.clock && (
              <span className="font-mono text-xs text-[var(--color-flame)]">{summary.clock}</span>
            )}
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
              · actualización automática
            </span>
          </div>
        </section>
      )}

      <MatchSummarySections
        summary={summary}
        homeName={homeName}
        awayName={awayName}
        homeFlag={homeFlag}
        awayFlag={awayFlag}
        live={live}
      />
    </>
  );
}

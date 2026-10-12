'use client';

import { useEffect, useState } from 'react';
import type { MatchSummary } from '@/lib/wc-2026-match-summary';
import { MatchSummarySections } from './match-summary';
import { ScoreboardLarge, type ScoreboardData } from './scoreboard';
import { StickyScoreboard } from './sticky-scoreboard';

/**
 * Envoltorio cliente del detalle de partido. Renderiza marcador + resumen
 * (SSR para SEO) y, si el partido está EN JUEGO, hace polling a
 * /api/match-live cada ~25s para actualizar marcador, narración, momentos y
 * estadísticas sin recargar: live-blog en directo.
 */
export function LiveMatchSummary({
  initial, eventId, home, away, homeName, awayName, homeFlag = '', awayFlag = '', espn, board, children,
}: {
  initial: MatchSummary;
  eventId: string;
  home: string;
  away: string;
  homeName: string;
  awayName: string;
  homeFlag?: string;
  awayFlag?: string;
  /** Competición ESPN (portal); por defecto, Mundial 2026. */
  espn?: { sport: string; league: string };
  /** Si se pasa, renderiza el marcador grande + cabecera pegajosa (fichas del portal). */
  board?: Omit<ScoreboardData, 'summary'>;
  /** Se pinta entre el marcador y las secciones (pestañas, cintillo). */
  children?: React.ReactNode;
}) {
  const [summary, setSummary] = useState<MatchSummary>(initial);
  const live = summary.state === 'in';

  useEffect(() => {
    if (summary.state !== 'in') return;
    let cancelled = false;
    const tick = async () => {
      try {
        const league = espn ? `&sport=${encodeURIComponent(espn.sport)}&league=${encodeURIComponent(espn.league)}` : '';
        const r = await fetch(
          `/api/match-live?event=${encodeURIComponent(eventId)}&home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}${league}`,
          { cache: 'no-store' },
        );
        const j = await r.json();
        if (!cancelled && j?.summary) setSummary((prev) => ({ ...(j.summary as MatchSummary), header: j.summary.header ?? prev.header }));
      } catch {
        /* reintento en el siguiente tick */
      }
    };
    const id = setInterval(tick, 25_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [summary.state, eventId, home, away, espn]);

  return (
    <>
      {board && summary.header && (
        <>
          <section id="scoreboard-large" className="mx-auto mt-8 w-full max-w-[1000px] px-4 md:px-10">
            <ScoreboardLarge {...board} summary={summary} />
          </section>
          <StickyScoreboard sport={board.sport} summary={summary} />
        </>
      )}

      {!board && live && (
        <section className="mx-auto mt-8 w-full max-w-[1000px] px-6 md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--color-live)]/30 bg-[var(--color-live)]/10 px-5 py-2.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-live-ink)]"><i className="pulse" />En directo</span>
            <span className="font-display text-xl tab-num text-[var(--color-fg)]">
              {homeFlag} {summary.homeScore ?? 0}<span className="mx-1 text-[var(--color-fg-subtle)]">-</span>{summary.awayScore ?? 0} {awayFlag}
            </span>
            {summary.clock && <span className="font-mono text-xs text-[var(--color-live-ink)]">{summary.clock}</span>}
          </div>
        </section>
      )}

      {children}

      <MatchSummarySections
        summary={summary}
        homeName={homeName}
        awayName={awayName}
        homeFlag={homeFlag}
        awayFlag={awayFlag}
        live={live}
        sport={board?.sport}
      />
    </>
  );
}

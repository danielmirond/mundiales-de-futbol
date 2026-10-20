'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { MatchSummary } from '@/lib/wc-2026-match-summary';
import { liveParagraph } from '@/lib/live-paragraph';
import { ScoreboardLarge, type ScoreboardData } from '@/components/match/scoreboard';

/**
 * Apertura en directo: marcador grande y párrafo de preview que se refrescan
 * cada ~25 s contra /api/match-live mientras el partido siga en juego.
 */
export function LiveOpeningBoard({
  initial, eventId, espn, board, href,
}: {
  initial: MatchSummary;
  eventId: string;
  espn: { sport: string; league: string };
  board: Omit<ScoreboardData, 'summary'>;
  href: string;
}) {
  const [summary, setSummary] = useState(initial);

  useEffect(() => {
    if (summary.state !== 'in') return;
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch(`/api/match-live?event=${encodeURIComponent(eventId)}&sport=${encodeURIComponent(espn.sport)}&league=${encodeURIComponent(espn.league)}`, { cache: 'no-store' });
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
  }, [summary.state, eventId, espn]);

  const live = summary.state === 'in';
  return (
    <div className="grid gap-6">
      <ScoreboardLarge {...board} summary={summary} />
      <p className="mx-auto max-w-[760px] text-center text-[17px] leading-[1.6] text-[var(--color-fg-muted)]">{liveParagraph(summary, board.sport)}</p>
      <div className="flex justify-center">
        <Link href={href} className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-live)] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
          {live ? 'Sigue el directo' : 'Ver el partido'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

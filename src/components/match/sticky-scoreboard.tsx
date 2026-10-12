'use client';

import { useEffect, useRef, useState } from 'react';
import type { MatchSummary } from '@/lib/wc-2026-match-summary';
import { ScoreboardSmall } from './scoreboard';
import { phaseOf } from './match-status';

/**
 * Cabecera pegajosa: sustituye al marcador grande cuando este sale de la
 * pantalla (IntersectionObserver sobre el centinela `#scoreboard-large`).
 */
export function StickyScoreboard({ sport, summary }: { sport: string; summary: MatchSummary }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = document.getElementById('scoreboard-large');
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4rem)] z-30 px-3 transition-all duration-300 md:top-[calc(env(safe-area-inset-top)+5rem)] ${show ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`} aria-hidden={!show}>
      <div className="pointer-events-auto mx-auto max-w-[640px]">
        <ScoreboardSmall sport={sport} summary={summary} phase={phaseOf(summary.state, summary.statusName, summary.hasLineups)} />
      </div>
    </div>
  );
}

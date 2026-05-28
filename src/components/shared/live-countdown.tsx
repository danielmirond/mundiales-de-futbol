'use client';

import { useEffect, useState } from 'react';

type Props = {
  /** ISO UTC string del kickoff */
  kickoffUtc: string;
  /** Labels traducibles desde el server (pasa strings ya en el locale del page) */
  labels: {
    inX: string;        // "in {X}" — placeholder {X} se reemplaza
    live: string;       // "Live"
    ended: string;      // "Ended"
    days: string;       // "d"
    hours: string;      // "h"
    minutes: string;    // "m"
  };
};

/**
 * Live countdown: se calcula con el reloj del navegador del usuario.
 * El kickoff es UTC absoluto, por lo que el delta es invariante a TZ del
 * navegador. La hora del kickoff visible en la página se renderiza en
 * server con la TZ del país (no es responsabilidad de este componente).
 */
export function LiveCountdown({ kickoffUtc, labels }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000); // refresh 1/min
    return () => clearInterval(id);
  }, []);

  if (now === null) return null; // evita hydration mismatch

  const kickoffMs = new Date(kickoffUtc).getTime();
  const deltaMs = kickoffMs - now;

  // Partido en directo: dentro de las 2h posteriores al kickoff
  if (deltaMs <= 0 && deltaMs > -2 * 3600_000) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-red-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
        {labels.live}
      </span>
    );
  }

  // Partido terminado
  if (deltaMs <= -2 * 3600_000) {
    return <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">{labels.ended}</span>;
  }

  // Countdown
  const totalMin = Math.floor(deltaMs / 60_000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const minutes = totalMin % 60;

  let countdown: string;
  if (days >= 1) countdown = `${days}${labels.days} ${hours}${labels.hours}`;
  else if (hours >= 1) countdown = `${hours}${labels.hours} ${minutes}${labels.minutes}`;
  else countdown = `${minutes}${labels.minutes}`;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-pitch)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pitch)]" />
      {labels.inX.replace('{X}', countdown)}
    </span>
  );
}

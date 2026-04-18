'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WORLD_CUP_2026_KICKOFF } from '@/lib/tournaments';

function diff(target: Date) {
  const now = Date.now();
  const delta = target.getTime() - now;
  if (delta <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true };
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);
  return { days, hours, minutes, seconds, live: false };
}

export function Countdown() {
  const t = useTranslations('home.countdown');
  const [state, setState] = useState(() => diff(WORLD_CUP_2026_KICKOFF));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setState(diff(WORLD_CUP_2026_KICKOFF)), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { value: state.days, label: t('days') },
    { value: state.hours, label: t('hours') },
    { value: state.minutes, label: t('minutes') },
    { value: state.seconds, label: t('seconds') },
  ];

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="relative mx-auto grid w-full max-w-[1400px] gap-8 px-6 py-16 md:grid-cols-[auto_1fr] md:items-center md:gap-16 md:py-24 md:px-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {state.live ? t('liveNow') : t('label')}
          </div>
          <p className="mt-3 max-w-xs text-lg leading-snug text-[var(--color-fg-muted)]">
            {t('host')}
          </p>
        </div>
        <div className="grid grid-cols-4 divide-x divide-[var(--color-border)] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 rtl:divide-x-reverse">
          {cells.map((c) => (
            <div key={c.label} className="flex flex-col items-center justify-center py-8">
              <span className="font-display text-5xl tab-num text-[var(--color-fg)] md:text-7xl" suppressHydrationWarning>
                {mounted ? String(c.value).padStart(2, '0') : '--'}
              </span>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

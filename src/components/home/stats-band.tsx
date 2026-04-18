import { getTranslations, getFormatter } from 'next-intl/server';
import { AGGREGATES } from '@/lib/tournaments';

export async function StatsBand() {
  const t = await getTranslations('home.stats');
  const format = await getFormatter();

  const items = [
    { value: AGGREGATES.editions, label: t('editions') },
    { value: AGGREGATES.matches, label: t('matches') },
    { value: AGGREGATES.goals, label: t('goals') },
    { value: AGGREGATES.champions, label: t('champions') },
    { value: AGGREGATES.teams2026, label: t('teams2026') },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1400px] gap-px bg-[var(--color-border)] px-0 sm:grid-cols-2 md:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="group relative flex flex-col gap-6 bg-[var(--color-bg)] p-8 md:p-10"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
              {item.label}
            </span>
            <span className="tab-num font-display text-fluid-h1 leading-none text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
              {format.number(item.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

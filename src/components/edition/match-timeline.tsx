import { cn } from '@/lib/utils';
import { displayName, type TimelineEvent } from '@/lib/data/match-detail';

function Icon({ type }: { type: string }) {
  if (type === 'goal' || type === 'penalty_goal' || type === 'own_goal') {
    return <span aria-hidden>⚽</span>;
  }
  if (type === 'yellow') return <span aria-hidden className="text-[var(--color-sun)]">▮</span>;
  if (type === 'yellow_red' || type === 'red') return <span aria-hidden className="text-[var(--color-flame)]">▮</span>;
  if (type === 'sub') return <span aria-hidden className="text-[var(--color-fg-muted)]">⇅</span>;
  return <span aria-hidden>·</span>;
}

function label(type: string) {
  switch (type) {
    case 'goal':
      return 'Gol';
    case 'penalty_goal':
      return 'Penalti';
    case 'own_goal':
      return 'Gol en propia';
    case 'yellow':
      return 'Amarilla';
    case 'yellow_red':
      return 'Doble amarilla';
    case 'red':
      return 'Roja directa';
    case 'sub':
      return 'Cambio';
    default:
      return type;
  }
}

export function MatchTimeline({
  events,
  homeCode,
  awayCode,
}: {
  events: TimelineEvent[];
  homeCode: string;
  awayCode: string;
}) {
  if (events.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--color-border)]" aria-hidden />
      <ul className="space-y-4">
        {events.map((e) => {
          const side = e.team_code === homeCode ? 'left' : e.team_code === awayCode ? 'right' : 'left';
          const isGoal = e.event_type === 'goal' || e.event_type === 'penalty_goal' || e.event_type === 'own_goal';
          return (
            <li
              key={e.id}
              className={cn(
                'grid grid-cols-[1fr_auto_1fr] items-center gap-4',
                side === 'right' && 'direction-rtl',
              )}
            >
              <div className={cn('flex items-center gap-3', side === 'left' ? 'justify-end text-end' : 'justify-start text-start order-3')}>
                <div>
                  <div
                    className={cn(
                      'text-sm',
                      isGoal ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]',
                    )}
                  >
                    {displayName(e.player)}
                  </div>
                  {e.secondary_player && (
                    <div className="text-xs text-[var(--color-fg-subtle)]">
                      {e.event_type === 'sub' ? '↑ ' : 'asist · '}
                      {displayName(e.secondary_player)}
                    </div>
                  )}
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    {label(e.event_type)}
                  </div>
                </div>
                <div className="text-xl">
                  <Icon type={e.event_type} />
                </div>
              </div>
              <div className="relative z-10 flex h-10 w-16 items-center justify-center rounded-full bg-[var(--color-bg-2)] ring-1 ring-[var(--color-border)] font-mono text-xs tab-num">
                {e.minute ?? '?'}′
              </div>
              <span className={cn(side === 'left' ? 'order-3' : '')} aria-hidden />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

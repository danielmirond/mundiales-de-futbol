import { Icon } from '@/components/ui/icon';
import type { SnapshotLineup, SnapshotMissing } from '@/lib/sportapi';

const REASON: Record<string, string> = { injury: 'Lesión', suspension: 'Sanción', suspended: 'Sanción', missing: 'Ausente', doubtful: 'Duda', '1': 'Lesión', '2': 'Duda', '3': 'Sanción', '11': 'Lesión', '12': 'Sanción', '13': 'Ausente' };
const label = (m: SnapshotMissing) => REASON[m.reason] ?? REASON[m.type] ?? (m.reason || 'Baja');

/** Bajas (lesionados y sancionados) de ambos equipos, del snapshot de SportAPI. */
export function MissingPlayers({ lineup, homeName, awayName }: { lineup: SnapshotLineup; homeName: string; awayName: string }) {
  const sides = [{ name: homeName, s: lineup.home }, { name: awayName, s: lineup.away }];
  if (sides.every((x) => x.s.missing.length === 0)) return null;
  return (
    <section className="mx-auto mt-6 w-full max-w-[1000px] px-6 md:px-10">
      <div className="grid gap-4 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 md:grid-cols-2">
        {sides.map(({ name, s }) => (
          <div key={name}>
            <div className="sub-label">Bajas · {name}{s.formation ? ` · ${s.formation}` : ''}</div>
            {s.missing.length === 0 ? <p className="mt-2 text-sm text-[var(--color-fg-muted)]">Sin bajas conocidas.</p> : (
              <ul className="mt-2 space-y-1.5">
                {s.missing.map((m) => (
                  <li key={m.name} className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
                    <Icon name={/sanci/i.test(label(m)) ? 'roja' : 'cambio'} size={14} className="text-[var(--color-loss)]" />{m.name}
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{label(m)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{lineup.confirmed ? 'Onces confirmados' : 'Previsión'} · fuente SportAPI</p>
    </section>
  );
}

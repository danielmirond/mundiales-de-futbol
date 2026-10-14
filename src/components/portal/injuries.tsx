import Link from 'next/link';
import type { Injury } from '@/lib/espn-preview';

const TONE: Record<Injury['severity'], string> = {
  out: 'text-[var(--color-loss)]',
  doubt: 'text-[var(--color-gold)]',
  other: 'text-[var(--color-fg-subtle)]',
};
const dayEs = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(/T/.test(iso) ? iso : `${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  const otherYear = d.getUTCFullYear() !== new Date().getUTCFullYear();
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', ...(otherYear ? { year: 'numeric' } : {}), timeZone: 'Europe/Madrid' }).format(d);
};

/** Lista de bajas: jugador, posición, estado (color por gravedad), zona y vuelta prevista. */
export function InjuryList({ items, playerBase }: { items: Injury[]; playerBase?: string }) {
  if (items.length === 0) return <p className="text-sm text-[var(--color-fg-muted)]">Sin bajas en el parte.</p>;
  return (
    <ul className="divide-y divide-[var(--color-border)]">
      {items.map((i) => (
        <li key={`${i.name}-${i.status}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2.5 text-sm">
          <span className="font-medium text-[var(--color-fg)]">
            {i.athleteId && playerBase ? <Link href={`${playerBase}/${i.athleteId}`} className="hover:text-[var(--accent-ink)]">{i.name}</Link> : i.name}
          </span>
          {i.position && <span className="text-xs text-[var(--color-fg-subtle)]">{i.position}</span>}
          <span className="ml-auto flex items-baseline gap-3">
            {i.part && <span className="text-xs text-[var(--color-fg-muted)]">{i.part}</span>}
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${TONE[i.severity]}`}>{i.status}</span>
          </span>
          {i.returnDate && <span className="basis-full text-xs text-[var(--color-fg-subtle)]">Vuelta prevista: {dayEs(i.returnDate)}</span>}
        </li>
      ))}
    </ul>
  );
}

import { Icon, type IconName } from '@/components/ui/icon';

export type MatchPhase = 'pre' | 'lineups' | 'live' | 'ht' | 'et' | 'pen' | 'ft' | 'ppd' | 'sus';

/** Fase visual a partir del estado ESPN. */
export function phaseOf(state: string, statusName = '', hasLineups = false): MatchPhase {
  if (/POSTPONED|CANCELED/.test(statusName)) return 'ppd';
  if (/SUSPENDED|ABANDONED/.test(statusName)) return 'sus';
  if (state === 'post') return 'ft';
  if (state === 'in') {
    if (/HALFTIME/.test(statusName)) return 'ht';
    if (/SHOOTOUT|PEN/.test(statusName)) return 'pen';
    if (/OVERTIME|EXTRA/.test(statusName)) return 'et';
    return 'live';
  }
  return hasLineups ? 'lineups' : 'pre';
}

const META: Record<MatchPhase, { cls: string; label: string; icon?: IconName }> = {
  pre: { cls: '', label: 'Programado', icon: 'programado' },
  lineups: { cls: 'lu', label: 'Alineaciones', icon: 'alineaciones' },
  live: { cls: 'live', label: 'En directo' },
  ht: { cls: 'ht', label: 'Descanso', icon: 'descanso' },
  et: { cls: 'et', label: 'Prórroga', icon: 'prorroga' },
  pen: { cls: 'pen', label: 'Penaltis', icon: 'penaltis' },
  ft: { cls: 'ft', label: 'Final', icon: 'final' },
  ppd: { cls: 'ppd', label: 'Aplazado', icon: 'aplazado' },
  sus: { cls: 'sus', label: 'Suspendido', icon: 'suspendido' },
};

/** Píldora de estado de partido (sistema de diseño · 04). */
export function MatchStatus({ phase, label }: { phase: MatchPhase; label?: string }) {
  const m = META[phase];
  return (
    <span className={`st ${m.cls}`}>
      {phase === 'live' ? <i className="pulse" /> : m.icon ? <Icon name={m.icon} /> : null}
      {label ?? m.label}
    </span>
  );
}

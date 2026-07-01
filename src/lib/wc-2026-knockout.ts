import { fetchScores } from './live-scores';
import type { LiveMatch } from './live-scores';

/**
 * Cruces REALES de la fase eliminatoria del Mundial 2026, en vivo desde ESPN.
 *
 * ESPN no etiqueta la ronda por evento, pero el calendario es fijo, así que la
 * deducimos por rango de fechas. Devuelve cada ronda con sus enfrentamientos
 * reales (equipos, marcador, estado) en cuanto se determinan/juegan.
 */

const ROUNDS: { key: string; label: string; from: string; to: string }[] = [
  { key: 'R32', label: 'Dieciseisavos de final', from: '2026-06-28', to: '2026-07-03' },
  { key: 'R16', label: 'Octavos de final', from: '2026-07-04', to: '2026-07-07' },
  { key: 'QF', label: 'Cuartos de final', from: '2026-07-09', to: '2026-07-11' },
  { key: 'SF', label: 'Semifinales', from: '2026-07-14', to: '2026-07-15' },
  { key: '3P', label: 'Tercer puesto', from: '2026-07-18', to: '2026-07-18' },
  { key: 'F', label: 'Final', from: '2026-07-19', to: '2026-07-19' },
];

export type KnockoutRound = { key: string; label: string; matches: LiveMatch[] };

export async function getKnockoutRounds(): Promise<KnockoutRound[]> {
  const scores = await fetchScores();
  return ROUNDS.map((r) => ({
    key: r.key,
    label: r.label,
    matches: scores
      .filter((m) => {
        const d = (m.date || '').slice(0, 10);
        return !!m.home && !!m.away && d >= r.from && d <= r.to;
      })
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
  })).filter((r) => r.matches.length > 0);
}

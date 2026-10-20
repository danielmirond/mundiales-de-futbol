import type { MatchSummary, MatchEvent } from './wc-2026-match-summary';

const min = (m: string) => m.replace(/'$/, '′');

function goalsLine(events: MatchEvent[], side: 'home' | 'away', team: string): string | null {
  const g = events.filter((e) => e.kind === 'goal' && e.side === side);
  if (g.length === 0) return null;
  return `${team}: ${g.map((e) => `${e.players[0] ?? e.type} (${min(e.minute)}${/propia|own/i.test(e.type) ? ', en propia' : ''})`).join(', ')}`;
}

/**
 * Párrafo de preview de un directo (determinista): quién gana, dónde y en qué
 * minuto, los goles por equipo y las expulsiones. Se recalcula con cada refresco.
 */
export function liveParagraph(s: MatchSummary, sport: string): string {
  const h = s.header;
  if (!h) return '';
  const hs = s.homeScore ?? 0;
  const as = s.awayScore ?? 0;
  const where = h.venue ? ` en ${h.venue}` : '';
  const basket = sport === 'baloncesto';
  const half = /HALFTIME/.test(s.statusName ?? '');
  const when = half
    ? 'al descanso'
    : basket && s.period
      ? `en el ${s.period}.º cuarto${s.clock ? ` (${s.clock})` : ''}`
      : s.clock
        ? `en el minuto ${min(s.clock)}`
        : 'en directo';
  let lead: string;
  if (s.state === 'pre') lead = `${h.home.name} y ${h.away.name} están a punto de empezar${where}.`;
  else if (hs === as) lead = hs === 0 && !basket ? `${h.home.name} y ${h.away.name} siguen sin goles${where}, ${when}.` : `${h.home.name} y ${h.away.name} empatan a ${hs}${where}, ${when}.`;
  else {
    const [w, l, a, b] = hs > as ? [h.home.name, h.away.name, hs, as] : [h.away.name, h.home.name, as, hs];
    lead = `${w} gana ${a}-${b} a ${l}${where}, ${when}.`;
  }
  const parts = [lead];
  if (!basket) {
    const goals = [goalsLine(s.events, 'home', h.home.name), goalsLine(s.events, 'away', h.away.name)].filter(Boolean);
    if (goals.length) parts.push(`Goles. ${goals.join('; ')}.`);
    const reds = s.events.filter((e) => e.kind === 'red');
    if (reds.length) parts.push(`${reds.length === 1 ? 'Expulsado' : 'Expulsados'}: ${reds.map((e) => `${e.players[0] ?? 'un jugador'} (${min(e.minute)})`).join(', ')}.`);
  }
  return parts.join(' ');
}

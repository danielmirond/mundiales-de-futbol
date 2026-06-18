/**
 * Detalle de un partido del Mundial 2026 vía la API pública de ESPN (sin key):
 * alineaciones (con formación), momentos clave (goles, tarjetas, cambios) y
 * estadísticas. Endpoint `summary?event={id}` (mismo origen que live-scores).
 *
 * Devuelve `null` si el partido aún no tiene datos (pre-partido) o falla la API.
 */

const ESPN_SUMMARY =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary';

export type LineupPlayer = {
  name: string;
  jersey: string;
  pos: string;
  starter: boolean;
};

export type MatchEvent = {
  minute: string;
  /** 'goal' | 'yellow' | 'red' | 'sub' | 'var' | 'other' */
  kind: 'goal' | 'yellow' | 'red' | 'sub' | 'var' | 'other';
  type: string;
  side: 'home' | 'away' | null;
  players: string[];
  text: string;
};

export type TeamStat = { key: string; label: string; home: string; away: string };

export type MatchSummary = {
  formationHome: string | null;
  formationAway: string | null;
  startHome: LineupPlayer[];
  startAway: LineupPlayer[];
  subsHome: LineupPlayer[];
  subsAway: LineupPlayer[];
  events: MatchEvent[];
  stats: TeamStat[];
  hasLineups: boolean;
  hasEvents: boolean;
  hasStats: boolean;
};

// Estadísticas que mostramos, en orden, con etiqueta en español.
const STAT_LABELS: { key: string; label: string }[] = [
  { key: 'possessionPct', label: 'Posesión (%)' },
  { key: 'totalShots', label: 'Tiros' },
  { key: 'shotsOnTarget', label: 'Tiros a puerta' },
  { key: 'wonCorners', label: 'Córners' },
  { key: 'saves', label: 'Paradas' },
  { key: 'foulsCommitted', label: 'Faltas' },
  { key: 'offsides', label: 'Fueras de juego' },
  { key: 'yellowCards', label: 'Tarjetas amarillas' },
  { key: 'redCards', label: 'Tarjetas rojas' },
  { key: 'passPct', label: 'Precisión de pase (%)' },
];

function classifyEvent(typeText: string): MatchEvent['kind'] {
  const t = typeText.toLowerCase();
  if (t.includes('own goal')) return 'goal';
  if (t.includes('goal') || t.includes('penalty - scored')) return 'goal';
  if (t.includes('yellow')) return 'yellow';
  if (t.includes('red')) return 'red';
  if (t.includes('substitution')) return 'sub';
  if (t.includes('var') || t.includes('video')) return 'var';
  return 'other';
}

const TYPE_ES: Record<string, string> = {
  Goal: 'Gol',
  'Own Goal': 'Gol en propia',
  'Penalty - Scored': 'Gol de penalti',
  'Penalty - Missed': 'Penalti fallado',
  'Yellow Card': 'Tarjeta amarilla',
  'Red Card': 'Tarjeta roja',
  Substitution: 'Cambio',
};

export async function fetchMatchSummary(
  eventId: string,
  homeCode: string,
  awayCode: string,
  revalidate = 120,
): Promise<MatchSummary | null> {
  if (!eventId) return null;
  let data: any;
  try {
    const res = await fetch(`${ESPN_SUMMARY}?event=${eventId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' },
      next: { revalidate },
    });
    if (!res.ok) return null;
    data = await res.json();
  } catch {
    return null;
  }

  // Mapea el id de equipo de ESPN a 'home'/'away' según NUESTROS códigos.
  const idToSide = new Map<string, 'home' | 'away'>();
  const assign = (teamId: unknown, abbr: string | undefined, espnSide?: string) => {
    if (teamId == null) return;
    const code = (abbr ?? '').toUpperCase();
    let side: 'home' | 'away' | null = null;
    if (code && code === homeCode.toUpperCase()) side = 'home';
    else if (code && code === awayCode.toUpperCase()) side = 'away';
    else if (espnSide === 'home' || espnSide === 'away') side = espnSide;
    if (side) idToSide.set(String(teamId), side);
  };
  for (const c of data.header?.competitions?.[0]?.competitors ?? []) {
    assign(c.id ?? c.team?.id, c.team?.abbreviation, c.homeAway);
  }

  // ── Alineaciones ──
  const mkPlayers = (roster: any[]): LineupPlayer[] =>
    (roster ?? []).map((p) => ({
      name: p.athlete?.displayName ?? p.athlete?.shortName ?? '',
      jersey: p.jersey ?? '',
      pos: p.position?.abbreviation ?? '',
      starter: !!p.starter,
    }));

  let formationHome: string | null = null;
  let formationAway: string | null = null;
  const startHome: LineupPlayer[] = [];
  const startAway: LineupPlayer[] = [];
  const subsHome: LineupPlayer[] = [];
  const subsAway: LineupPlayer[] = [];

  for (const r of data.rosters ?? []) {
    const side =
      idToSide.get(String(r.team?.id)) ??
      (r.homeAway === 'home' || r.homeAway === 'away' ? r.homeAway : null);
    if (!side) continue;
    const players = mkPlayers(r.roster);
    if (side === 'home') {
      formationHome = r.formation ?? null;
      startHome.push(...players.filter((p) => p.starter));
      subsHome.push(...players.filter((p) => !p.starter));
    } else {
      formationAway = r.formation ?? null;
      startAway.push(...players.filter((p) => p.starter));
      subsAway.push(...players.filter((p) => !p.starter));
    }
  }

  // ── Momentos clave ──
  const events: MatchEvent[] = (data.keyEvents ?? [])
    .map((k: any): MatchEvent => {
      const typeText: string = k.type?.text ?? '';
      return {
        minute: k.clock?.displayValue ?? '',
        kind: classifyEvent(typeText),
        type: TYPE_ES[typeText] ?? typeText,
        side: idToSide.get(String(k.team?.id)) ?? null,
        players: (k.participants ?? k.athletesInvolved ?? [])
          .map((p: any) => p.athlete?.displayName ?? p.displayName)
          .filter(Boolean),
        text: k.text ?? '',
      };
    })
    .filter((e: MatchEvent) => ['goal', 'yellow', 'red', 'sub'].includes(e.kind));

  // ── Estadísticas ──
  const byCode: Record<'home' | 'away', Record<string, string>> = { home: {}, away: {} };
  for (const t of data.boxscore?.teams ?? []) {
    const side = idToSide.get(String(t.team?.id)) ?? (t.homeAway as 'home' | 'away' | undefined);
    if (side !== 'home' && side !== 'away') continue;
    for (const s of t.statistics ?? []) {
      if (s?.name) byCode[side][s.name] = s.displayValue ?? '';
    }
  }
  const stats: TeamStat[] = STAT_LABELS.filter(
    (s) => byCode.home[s.key] != null || byCode.away[s.key] != null,
  ).map((s) => ({
    key: s.key,
    label: s.label,
    home: byCode.home[s.key] ?? '—',
    away: byCode.away[s.key] ?? '—',
  }));

  const hasLineups = startHome.length > 0 || startAway.length > 0;
  const hasEvents = events.length > 0;
  const hasStats = stats.length > 0;
  if (!hasLineups && !hasEvents && !hasStats) return null;

  return {
    formationHome,
    formationAway,
    startHome,
    startAway,
    subsHome,
    subsAway,
    events,
    stats,
    hasLineups,
    hasEvents,
    hasStats,
  };
}

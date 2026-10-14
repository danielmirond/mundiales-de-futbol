/**
 * Detalle de un partido del Mundial 2026 vía la API pública de ESPN (sin key):
 * alineaciones (con formación), momentos clave (goles, tarjetas, cambios) y
 * estadísticas. Endpoint `summary?event={id}` (mismo origen que live-scores).
 *
 * Devuelve `null` si el partido aún no tiene datos (pre-partido) o falla la API.
 */

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';
/** Ruta ESPN de una competición: { sport: 'soccer', league: 'esp.1' }. */
export type EspnPath = { sport: string; league: string };
const WORLD_CUP: EspnPath = { sport: 'soccer', league: 'fifa.world' };

/** Cabecera del partido (equipos, marcador, fecha, sede) tal como la da ESPN. */
export type SummarySide = { id?: string; abbr: string; name: string; logo?: string; color?: string; linescores?: number[]; shootout?: number | null };
export type SummaryHeader = {
  home: SummarySide;
  away: SummarySide;
  date: string;
  venue: string;
  competition: string;
};

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

export type CommentaryLine = { minute: string; text: string };

export type MatchSummary = {
  formationHome: string | null;
  formationAway: string | null;
  startHome: LineupPlayer[];
  startAway: LineupPlayer[];
  subsHome: LineupPlayer[];
  subsAway: LineupPlayer[];
  events: MatchEvent[];
  stats: TeamStat[];
  commentary: CommentaryLine[];
  homeScore: number | null;
  awayScore: number | null;
  clock: string | null;
  state: 'pre' | 'in' | 'post' | string;
  /** Nombre de estado ESPN (STATUS_HALFTIME, STATUS_FINAL_PEN, STATUS_POSTPONED…). */
  statusName?: string;
  period?: number;
  hasLineups: boolean;
  hasEvents: boolean;
  hasStats: boolean;
  hasCommentary: boolean;
  /** Presente en el resumen genérico (fichas del portal). */
  header?: SummaryHeader;
};

// Estadísticas de baloncesto (boxscore NBA/Euroliga), en orden.
const STAT_LABELS_BASKETBALL: { key: string; label: string }[] = [
  { key: 'fieldGoalsMade-fieldGoalsAttempted', label: 'Tiros de campo' },
  { key: 'fieldGoalPct', label: 'Tiros de campo (%)' },
  { key: 'threePointFieldGoalsMade-threePointFieldGoalsAttempted', label: 'Triples' },
  { key: 'threePointFieldGoalPct', label: 'Triples (%)' },
  { key: 'freeThrowsMade-freeThrowsAttempted', label: 'Tiros libres' },
  { key: 'totalRebounds', label: 'Rebotes' },
  { key: 'assists', label: 'Asistencias' },
  { key: 'steals', label: 'Robos' },
  { key: 'blocks', label: 'Tapones' },
  { key: 'totalTurnovers', label: 'Pérdidas' },
  { key: 'pointsInPaint', label: 'Puntos en la zona' },
  { key: 'fastBreakPoints', label: 'Puntos al contraataque' },
  { key: 'largestLead', label: 'Mayor ventaja' },
];

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

// Clasificación bilingüe (ESPN devuelve el texto en español con lang=es, pero
// dejamos también las claves en inglés por robustez).
function classifyEvent(typeText: string): MatchEvent['kind'] {
  const t = typeText.toLowerCase();
  if (t.includes('amarilla') || t.includes('yellow')) return 'yellow';
  if (t.includes('roja') || t.includes('red')) return 'red';
  if (t.includes('sustituc') || t.includes('cambio') || t.includes('substitution')) return 'sub';
  if (t.includes('gol') || t.includes('goal') || t.includes('penalty - scored')) return 'goal';
  if (t.includes('var') || t.includes('vídeo') || t.includes('video')) return 'var';
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

/** Resumen de un partido del Mundial 2026 (compatibilidad con las fichas /2026). */
export async function fetchMatchSummary(
  eventId: string,
  homeCode: string,
  awayCode: string,
  revalidate = 120,
): Promise<MatchSummary | null> {
  return fetchEventSummary(WORLD_CUP, eventId, homeCode, awayCode, revalidate);
}

/**
 * Resumen genérico de un evento ESPN de cualquier competición del portal.
 * `homeCode`/`awayCode` pueden ir vacíos: entonces los lados se toman de la
 * cabecera de ESPN. Fútbol → rosters/keyEvents/commentary; baloncesto → plays
 * (jugada a jugada) y boxscore.
 */
export async function fetchEventSummary(
  espn: EspnPath,
  eventId: string,
  homeCode = '',
  awayCode = '',
  revalidate = 120,
): Promise<MatchSummary | null> {
  if (!eventId) return null;
  const basketball = espn.sport === 'basketball';
  /** NFL, NHL, MLB y rugby: estadísticas tal cual las da ESPN (en español) y jugadas de anotación. */
  const otherSport = espn.sport !== 'soccer' && !basketball;
  let data: any;
  try {
    const res = await fetch(`${ESPN_BASE}/${espn.sport}/${espn.league}/summary?event=${eventId}&lang=es&region=es`, {
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
  const headerComp = data.header?.competitions?.[0] ?? {};
  let homeScore: number | null = null;
  let awayScore: number | null = null;
  const sideInfo: Record<'home' | 'away', SummarySide> = {
    home: { abbr: '', name: '' }, away: { abbr: '', name: '' },
  };
  for (const c of headerComp.competitors ?? []) {
    assign(c.id ?? c.team?.id, c.team?.abbreviation, c.homeAway);
    const side = idToSide.get(String(c.id ?? c.team?.id));
    const sc = c.score === undefined || c.score === null || c.score === '' ? null : Number(c.score);
    if (side === 'home') homeScore = sc;
    else if (side === 'away') awayScore = sc;
    if (side) {
      sideInfo[side] = {
        id: c.team?.id != null ? String(c.team.id) : undefined,
        abbr: String(c.team?.abbreviation ?? '').toUpperCase(),
        name: c.team?.displayName ?? c.team?.shortDisplayName ?? c.team?.name ?? '',
        logo: c.team?.logos?.[0]?.href ?? c.team?.logo,
        color: c.team?.color,
        linescores: Array.isArray(c.linescores) ? c.linescores.map((l: any) => Number(l.displayValue ?? l.value ?? 0)) : undefined,
        shootout: c.shootoutScore === undefined || c.shootoutScore === null || c.shootoutScore === '' ? null : Number(c.shootoutScore),
      };
    }
  }
  const clock: string | null = headerComp.status?.displayClock ?? null;
  const state: string = headerComp.status?.type?.state ?? 'pre';
  const statusName: string = headerComp.status?.type?.name ?? '';
  const period: number | undefined = headerComp.status?.period ? Number(headerComp.status.period) : undefined;
  const header: SummaryHeader = {
    home: sideInfo.home,
    away: sideInfo.away,
    date: headerComp.date ?? data.header?.date ?? '',
    venue: data.gameInfo?.venue?.fullName ?? '',
    competition: data.header?.league?.name ?? '',
  };

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
        type: typeText || TYPE_ES[typeText] || '',
        side: idToSide.get(String(k.team?.id)) ?? null,
        players: (k.participants ?? k.athletesInvolved ?? [])
          .map((p: any) => p.athlete?.displayName ?? p.displayName)
          .filter(Boolean),
        text: k.text ?? '',
      };
    })
    .filter((e: MatchEvent) => ['goal', 'yellow', 'red', 'sub'].includes(e.kind));
  if (otherSport && events.length === 0) {
    const periodLabel = (n?: number) => (!n ? '' : espn.sport === 'baseball' ? `${n}.ª entrada` : espn.sport === 'hockey' ? (n > 3 ? 'Prórroga' : `${n}.º periodo`) : n > 4 ? 'Prórroga' : `${n}.º cuarto`);
    let scoring: any[] = (data.scoringPlays?.length ? data.scoringPlays : (data.plays ?? []).filter((x: any) => x.scoringPlay || /^goal$/i.test(x.type?.text ?? '')));
    // En español ESPN no sirve la jugada a jugada de algunos deportes (NHL): se pide en inglés solo para esto.
    if (scoring.length === 0) {
      try {
        const en = await fetch(`${ESPN_BASE}/${espn.sport}/${espn.league}/summary?event=${eventId}`, { headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' }, next: { revalidate } });
        if (en.ok) { const d2 = await en.json(); scoring = (d2.scoringPlays?.length ? d2.scoringPlays : (d2.plays ?? []).filter((x: any) => x.scoringPlay)); }
      } catch { /* sin jugadas */ }
    }
    const TYPE_US: [RegExp, string][] = [[/passing touchdown/i, 'Touchdown de pase'], [/rushing touchdown/i, 'Touchdown de carrera'], [/(fumble|interception|punt|kickoff).*return touchdown/i, 'Touchdown en retorno'], [/field goal/i, 'Gol de campo'], [/safety/i, 'Safety'], [/two-point|2pt/i, 'Conversión de dos'], [/^goal$/i, 'Gol'], [/resultado de la jugada|play result/i, 'Carrera']];
    const typeUs = (t: string) => { for (const [re, es] of TYPE_US) if (re.test(t)) return es; return t; };
    for (const k of scoring.slice(0, 40)) {
      events.push({
        minute: [periodLabel(k.period?.number), espn.sport === 'baseball' ? '' : k.clock?.displayValue].filter(Boolean).join(' · '),
        kind: 'goal',
        type: `${typeUs(k.type?.text ?? 'Anotación')}${k.homeScore != null ? ` (${k.homeScore}-${k.awayScore})` : ''}`,
        side: idToSide.get(String(k.team?.id)) ?? null,
        players: [],
        text: k.text ?? '',
      });
    }
  }

  // ── Estadísticas ──
  const byCode: Record<'home' | 'away', Record<string, string>> = { home: {}, away: {} };
  for (const t of data.boxscore?.teams ?? []) {
    const side = idToSide.get(String(t.team?.id)) ?? (t.homeAway as 'home' | 'away' | undefined);
    if (side !== 'home' && side !== 'away') continue;
    for (const s of t.statistics ?? []) {
      if (s?.name) byCode[side][s.name] = s.displayValue ?? '';
    }
  }
  const generic: TeamStat[] = [];
  if (otherSport) {
    const bySide: Record<'home' | 'away', { label: string; value: string }[]> = { home: [], away: [] };
    for (const t of data.boxscore?.teams ?? []) {
      const side = idToSide.get(String(t.team?.id)) ?? (t.homeAway as 'home' | 'away' | undefined);
      if (side !== 'home' && side !== 'away') continue;
      bySide[side] = (t.statistics ?? []).filter((x: any) => x?.label && x?.displayValue != null).map((x: any) => ({ label: String(x.label), value: String(x.displayValue) }));
    }
    bySide.home.slice(0, 14).forEach((h, i) => generic.push({ key: `g${i}`, label: h.label, home: h.value, away: bySide.away.find((a) => a.label === h.label)?.value ?? '—' }));
  }
  const stats: TeamStat[] = otherSport ? generic : (basketball ? STAT_LABELS_BASKETBALL : STAT_LABELS).filter(
    (s) => byCode.home[s.key] != null || byCode.away[s.key] != null,
  ).map((s) => {
    // ESPN da la precisión de pase como fracción (0.9) en ligas de clubes.
    const pct = (v: string | undefined) =>
      v != null && s.key === 'passPct' && Number(v) <= 1 ? String(Math.round(Number(v) * 100)) : v;
    return {
      key: s.key,
      label: s.label,
      home: pct(byCode.home[s.key]) ?? '—',
      away: pct(byCode.away[s.key]) ?? '—',
    };
  });

  // ── Narración ──
  // Fútbol: `commentary` minuto a minuto. Baloncesto: `plays` (jugada a jugada,
  // 500+ por partido) → nos quedamos con las jugadas con puntos y los hitos de
  // periodo, con el reloj como "Q2 · 7:31" y el marcador parcial.
  const commentary: CommentaryLine[] = basketball
    ? (data.plays ?? [])
        .filter((p: any) => p.scoringPlay || /end of|final del|inicio|comienza|start of/i.test(p.text ?? ''))
        .map((p: any): CommentaryLine => ({
          minute: p.period?.number ? `Q${p.period.number} · ${p.clock?.displayValue ?? ''}` : (p.clock?.displayValue ?? ''),
          text: p.scoringPlay && p.homeScore != null ? `${p.text} (${p.homeScore}-${p.awayScore})` : (p.text ?? ''),
        }))
        .filter((c: CommentaryLine) => c.text)
        .slice(-200)
    : (data.commentary ?? [])
        .map((c: any): CommentaryLine => ({
          minute: c.time?.displayValue ?? '',
          text: c.text ?? '',
        }))
        .filter((c: CommentaryLine) => c.text);

  const hasLineups = startHome.length > 0 || startAway.length > 0;
  const hasEvents = events.length > 0;
  const hasStats = stats.length > 0;
  const hasCommentary = commentary.length > 0;
  if (!hasLineups && !hasEvents && !hasStats && !hasCommentary && !header.home.name) return null;

  return {
    formationHome,
    formationAway,
    startHome,
    startAway,
    subsHome,
    subsAway,
    events,
    stats,
    commentary,
    homeScore,
    awayScore,
    clock,
    state,
    statusName,
    period,
    hasLineups,
    hasEvents,
    hasStats,
    hasCommentary,
    header,
  };
}

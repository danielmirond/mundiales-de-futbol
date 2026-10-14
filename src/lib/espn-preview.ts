/**
 * Previa de partido y parte de lesionados con la API pública de ESPN:
 *  - `summary?event=` trae `lastFiveGames` (racha), `seasonseries` (cara a
 *    cara), `injuries` (bajas, no en fútbol) y `standings` (tabla).
 *  - `{sport}/{league}/injuries` trae el parte completo de la liga
 *    (NBA, NFL, NHL, MLB, WNBA). Fútbol no lo publica.
 * Los textos libres de ESPN vienen en inglés: solo se usan estado y zona,
 * traducidos con diccionario (sin IA).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Competition } from './competitions';
import type { EspnPath } from './wc-2026-match-summary';

const SITE_API = 'https://site.api.espn.com/apis/site/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type FormGame = {
  id: string;
  date: string;
  result: 'G' | 'E' | 'P';
  home: boolean;
  opponent: { id?: string; abbr: string; name: string; logo?: string };
  goalsFor: number | null;
  goalsAgainst: number | null;
  competition?: string;
};
export type SeriesGame = { id: string; date: string; homeAbbr: string; homeName: string; homeScore: string; awayAbbr: string; awayName: string; awayScore: string; winner?: 'home' | 'away'; completed: boolean };
export type Injury = { athleteId?: string; name: string; position?: string; status: string; severity: 'out' | 'doubt' | 'other'; part?: string; returnDate?: string; date?: string };
export type TableSpot = { id: string; name: string; rank: number; stats: Record<string, string> };

export type MatchPreview = {
  form: { home: FormGame[]; away: FormGame[] };
  series: { label: string; score?: string; games: SeriesGame[] } | null;
  injuries: { home: Injury[]; away: Injury[] };
  table: { home?: TableSpot; away?: TableSpot; total: number } | null;
};

// ─── Traducciones ────────────────────────────────────────────────

const STATUS_ES: Record<string, [string, Injury['severity']]> = {
  'out': ['Baja', 'out'],
  'injured reserve': ['Lista de lesionados', 'out'],
  'reserve-ret': ['Retirado (reserva)', 'out'],
  'suspension': ['Sancionado', 'out'],
  'doubtful': ['Duda seria', 'doubt'],
  'questionable': ['Duda', 'doubt'],
  'day-to-day': ['Día a día', 'doubt'],
  'probable': ['Probable', 'other'],
};
export function injuryStatusEs(raw: string): { label: string; severity: Injury['severity'] } {
  const hit = STATUS_ES[raw.trim().toLowerCase()];
  if (hit) return { label: hit[0], severity: hit[1] };
  if (/^\d+-day/i.test(raw)) return { label: `Lista de lesionados (${raw.match(/^\d+/)![0]} días)`, severity: 'out' };
  return { label: raw, severity: 'other' };
}

const PART_ES: Record<string, string> = {
  knee: 'Rodilla', ankle: 'Tobillo', foot: 'Pie', back: 'Espalda', calf: 'Gemelo', hamstring: 'Isquiotibiales',
  hip: 'Cadera', shoulder: 'Hombro', achilles: 'Tendón de Aquiles', illness: 'Enfermedad', concussion: 'Conmoción',
  quadriceps: 'Cuádriceps', neck: 'Cuello', groin: 'Ingle', wrist: 'Muñeca', hand: 'Mano', finger: 'Dedo',
  thumb: 'Pulgar', elbow: 'Codo', toe: 'Dedo del pie', thigh: 'Muslo', abdomen: 'Abdomen', ribs: 'Costillas',
  chest: 'Pecho', head: 'Cabeza', face: 'Cara', eye: 'Ojo', nose: 'Nariz', jaw: 'Mandíbula', pectoral: 'Pectoral',
  oblique: 'Oblicuo', forearm: 'Antebrazo', leg: 'Pierna', 'lower leg': 'Pierna', arm: 'Brazo', heel: 'Talón',
  'lower body': 'Tren inferior', 'upper body': 'Tren superior', rest: 'Descanso', undisclosed: 'Sin detallar',
  personal: 'Motivos personales', 'not injury related': 'Sin lesión', 'contract dispute': 'Conflicto contractual',
  biceps: 'Bíceps', triceps: 'Tríceps', lat: 'Dorsal', spine: 'Columna', 'plantar fascia': 'Fascia plantar',
  shin: 'Espinilla', collarbone: 'Clavícula', clavicle: 'Clavícula', tooth: 'Diente', mouth: 'Boca',
  'oblique strain': 'Oblicuo', torso: 'Tronco', 'rotator cuff': 'Manguito rotador', ucl: 'Ligamento del codo',
  "coach's decision": 'Decisión técnica', suspension: 'Sanción', skull: 'Cráneo', strain: 'Distensión', orbital: 'Órbita ocular',
  kneecap: 'Rótula', side: 'Costado', acl: 'ligamento cruzado anterior', mcl: 'ligamento lateral interno', pcl: 'ligamento cruzado posterior',
  meniscus: 'menisco', 'ac joint': 'articulación acromioclavicular', 'high ankle': 'esguince alto', sprain: 'esguince', fracture: 'fractura',
  labrum: 'labrum', tendon: 'tendón', patella: 'rótula',
};
/** «Knee - ACL» → «Rodilla (ligamento cruzado anterior)». */
const partEs = (raw?: string) => {
  if (!raw) return undefined;
  const tr = (x: string) => PART_ES[x.trim().toLowerCase()] ?? x.trim();
  const [base, ...rest] = raw.split(' - ');
  return rest.length ? `${tr(base)} (${rest.map(tr).join(', ')})` : tr(base);
};

const POS_ES: Record<string, Record<string, string>> = {
  basketball: { G: 'Base/escolta', F: 'Alero/ala-pívot', C: 'Pívot', PG: 'Base', SG: 'Escolta', SF: 'Alero', PF: 'Ala-pívot' },
  football: { QB: 'Quarterback', RB: 'Running back', FB: 'Fullback', WR: 'Receptor', TE: 'Tight end', OL: 'Línea ofensiva', OT: 'Tackle ofensivo', G: 'Guard', C: 'Center', LB: 'Linebacker', DE: 'Defensive end', DT: 'Defensive tackle', CB: 'Cornerback', S: 'Safety', K: 'Pateador', PK: 'Pateador', P: 'Despejador', LS: 'Long snapper' },
  hockey: { G: 'Portero', D: 'Defensa', C: 'Centro', LW: 'Ala izquierda', RW: 'Ala derecha', F: 'Delantero' },
  baseball: { SP: 'Lanzador abridor', RP: 'Relevista', P: 'Lanzador', C: 'Receptor', '1B': 'Primera base', '2B': 'Segunda base', '3B': 'Tercera base', SS: 'Campocorto', LF: 'Jardinero izquierdo', CF: 'Jardinero central', RF: 'Jardinero derecho', OF: 'Jardinero', DH: 'Bateador designado' },
};

function normInjury(i: any, sport: string): Injury | null {
  const a = i?.athlete;
  if (!a?.displayName) return null;
  const rawStatus = String(i.status ?? i.type?.description ?? '');
  if (/^active$/i.test(rawStatus)) return null; // NFL: «Active» = entrena con normalidad
  const st = injuryStatusEs(rawStatus);
  const id = a.id ?? String(a.links?.[0]?.href ?? '').match(/\/id\/(\d+)/)?.[1];
  const pos = a.position?.abbreviation;
  return {
    athleteId: id ? String(id) : undefined,
    name: a.displayName,
    position: pos ? POS_ES[sport]?.[pos] ?? pos : undefined,
    status: st.label,
    severity: st.severity,
    part: partEs(i.details?.type),
    returnDate: i.details?.returnDate,
    date: i.date,
  };
}
const bySeverity = (x: Injury, y: Injury) => ['out', 'doubt', 'other'].indexOf(x.severity) - ['out', 'doubt', 'other'].indexOf(y.severity) || x.name.localeCompare(y.name);

// ─── Previa ──────────────────────────────────────────────────────

const num = (v: unknown) => (v === undefined || v === null || v === '' ? null : Number(v));

function normForm(team: any): FormGame[] {
  const ours = String(team?.team?.id ?? '');
  return (team?.events ?? []).map((e: any): FormGame => {
    const home = String(e.homeTeamId ?? '') === ours;
    const hs = num(e.homeTeamScore), as = num(e.awayTeamScore);
    const gf = home ? hs : as, ga = home ? as : hs;
    // Resultado por marcador (gameResult llega traducido y es ambiguo: «D»).
    const result: FormGame['result'] = gf === null || ga === null ? 'E' : gf > ga ? 'G' : gf < ga ? 'P' : 'E';
    return {
      id: String(e.id ?? ''),
      date: e.gameDate ?? '',
      result,
      home,
      opponent: { id: e.opponent?.id, abbr: e.opponent?.abbreviation ?? '', name: e.opponent?.displayName ?? '', logo: e.opponent?.logo },
      goalsFor: gf,
      goalsAgainst: ga,
      competition: e.competitionName,
    };
  }).sort((x: FormGame, y: FormGame) => y.date.localeCompare(x.date));
}

function normSeries(ss: any): MatchPreview['series'] {
  const s = Array.isArray(ss) ? ss[0] : null;
  if (!s) return null;
  const games: SeriesGame[] = (s.events ?? []).map((e: any) => {
    const h = e.competitors?.find((c: any) => c.homeAway === 'home');
    const a = e.competitors?.find((c: any) => c.homeAway === 'away');
    return {
      id: String(e.id ?? ''),
      date: e.date ?? '',
      homeAbbr: h?.team?.abbreviation ?? '', homeName: h?.team?.displayName ?? '', homeScore: String(h?.score ?? ''),
      awayAbbr: a?.team?.abbreviation ?? '', awayName: a?.team?.displayName ?? '', awayScore: String(a?.score ?? ''),
      winner: h?.winner ? 'home' : a?.winner ? 'away' : undefined,
      completed: Boolean(e.statusType?.completed ?? e.status === 'post'),
    };
  }).filter((g: SeriesGame) => g.completed)
    .sort((x: SeriesGame, y: SeriesGame) => y.date.localeCompare(x.date));
  if (games.length === 0) return null;
  return { label: s.type === 'season' ? 'Esta temporada' : `Últimos ${games.length} enfrentamientos`, score: s.seriesScore, games };
}

function normTable(st: any, homeId?: string, awayId?: string): MatchPreview['table'] {
  const groups: any[] = st?.groups ?? [];
  let home: TableSpot | undefined, away: TableSpot | undefined, total = 0;
  for (const g of groups) {
    const entries: any[] = g?.standings?.entries ?? [];
    entries.forEach((e, i) => {
      const stats: Record<string, string> = {};
      for (const s of e.stats ?? []) if (s?.name) stats[s.name] = String(s.displayValue ?? s.value ?? '');
      const spot: TableSpot = { id: String(e.id ?? ''), name: typeof e.team === 'string' ? e.team : e.team?.displayName ?? '', rank: Number(stats.rank) || i + 1, stats };
      if (spot.id && spot.id === homeId) { home = spot; total = entries.length; }
      if (spot.id && spot.id === awayId) { away = spot; total = Math.max(total, entries.length); }
    });
  }
  return home || away ? { home, away, total } : null;
}

/**
 * Datos de previa del partido. Misma URL que `fetchEventSummary` para
 * aprovechar la caché de datos de Next (una sola petición a ESPN).
 */
export async function fetchMatchPreview(espn: EspnPath, eventId: string, homeId?: string, awayId?: string, revalidate = 120): Promise<MatchPreview | null> {
  try {
    const res = await fetch(`${SITE_API}/${espn.sport}/${espn.league}/summary?event=${eventId}&lang=es&region=es`, { headers: HEADERS, next: { revalidate } });
    if (!res.ok) return null;
    const d = await res.json();
    const five: any[] = d.lastFiveGames ?? [];
    const formOf = (id?: string) => normForm(five.find((t) => String(t?.team?.id ?? '') === id));
    // Bajas desde el parte de la liga (en inglés, traducido con diccionario): el
    // del summary llega con traducción automática de ESPN («Atrás» por espalda).
    const report = espn.sport === 'soccer' ? [] : await fetchInjuryReport(espn);
    const injOf = (id?: string) => report.find((t) => t.id === id)?.injuries ?? [];
    return {
      form: { home: formOf(homeId), away: formOf(awayId) },
      series: normSeries(d.seasonseries),
      injuries: { home: injOf(homeId), away: injOf(awayId) },
      table: normTable(d.standings, homeId, awayId),
    };
  } catch {
    return null;
  }
}

// ─── Parte de lesionados de la liga ──────────────────────────────

/** Ligas con parte de lesionados en ESPN (el fútbol no lo publica). */
export const hasInjuryReport = (c: Competition) => Boolean(c.espn && ['basketball', 'football', 'hockey', 'baseball'].includes(c.espn.sport));

export type TeamInjuries = { id: string; name: string; injuries: Injury[] };

export async function fetchLeagueInjuries(c: Competition, revalidate = 1800): Promise<TeamInjuries[]> {
  return hasInjuryReport(c) ? fetchInjuryReport(c.espn!, revalidate) : [];
}

async function fetchInjuryReport(espn: EspnPath, revalidate = 1800): Promise<TeamInjuries[]> {
  try {
    const res = await fetch(`${SITE_API}/${espn.sport}/${espn.league}/injuries`, { headers: HEADERS, next: { revalidate } });
    if (!res.ok) return [];
    const d = await res.json();
    return (d.injuries ?? []).map((t: any): TeamInjuries => ({
      id: String(t.id ?? ''),
      name: t.displayName ?? '',
      injuries: (t.injuries ?? []).map((i: any) => normInjury(i, espn.sport)).filter(Boolean).sort(bySeverity) as Injury[],
    })).filter((t: TeamInjuries) => t.injuries.length > 0)
      .sort((x: TeamInjuries, y: TeamInjuries) => x.name.localeCompare(y.name));
  } catch {
    return [];
  }
}

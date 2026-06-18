/**
 * Head-to-head (cara a cara) entre selecciones en la historia de los Mundiales.
 *
 * Datos REALES a partir de `wc-historical-matches.json` (todos los partidos de
 * todas las Copas del Mundo, 1930→) cruzados con los nombres de `wc-teams.json`
 * (incluye códigos históricos: TCH, FRG, GDR, YUG, URS, SCG, ZAI…).
 *
 * Genera una URL canónica por par (orden alfabético por slug del nombre), de
 * forma que `/historial/brasil-vs-francia` resuelve para "brasil vs francia" y
 * "francia vs brasil". También cubre los emparejamientos del Mundial 2026.
 */
import historical from './wc-historical-matches.json';
import teams from './wc-teams.json';
import { FIXTURES_2026, TEAMS_2026, matchSlug } from './wc-2026';

type HistMatch = {
  match_number: number;
  stage: string;
  match_date: string | null;
  home_code: string;
  away_code: string;
  home_score: number | null;
  away_score: number | null;
  home_score_et: number | null;
  away_score_et: number | null;
  home_score_pk: number | null;
  away_score_pk: number | null;
  winner_code: string | null;
  venue_name: string | null;
  venue_city: string | null;
};

const NAME: Record<string, string> = Object.fromEntries(
  (teams as { code: string; name_official: string }[]).map((t) => [t.code, t.name_official]),
);
const FLAG: Record<string, string> = Object.fromEntries(
  (teams as { code: string; flag_emoji: string }[]).map((t) => [t.code, t.flag_emoji]),
);

export function teamName(code: string): string {
  return NAME[code] ?? TEAMS_2026[code]?.name ?? code;
}
export function teamFlag(code: string): string {
  return FLAG[code] ?? TEAMS_2026[code]?.flag ?? '';
}

export const STAGE_LABEL_H2H: Record<string, string> = {
  group: 'Fase de grupos',
  group2: 'Segunda fase de grupos',
  final_group: 'Fase final (liguilla)',
  r16: 'Octavos de final',
  qf: 'Cuartos de final',
  sf: 'Semifinal',
  '3rd': 'Tercer puesto',
  final: 'Final',
};

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
export function codeSlug(code: string): string {
  return slugify(teamName(code));
}

/** Ordena el par por slug del nombre (canónico, estable). */
function orderPair(a: string, b: string): [string, string] {
  return codeSlug(a) <= codeSlug(b) ? [a, b] : [b, a];
}
export function pairSlug(a: string, b: string): string {
  const [x, y] = orderPair(a, b);
  return `${codeSlug(x)}-vs-${codeSlug(y)}`;
}

// Aplana todos los partidos históricos con su año.
const ALL: (HistMatch & { year: string })[] = [];
for (const [year, arr] of Object.entries(historical as Record<string, HistMatch[]>)) {
  for (const m of arr) if (m.home_code && m.away_code) ALL.push({ ...m, year });
}

// slug canónico -> [códigos]. Unión de pares históricos + emparejamientos 2026.
const slugToCodes = new Map<string, [string, string]>();
function register(a: string, b: string) {
  if (!a || !b || a === b) return;
  const [x, y] = orderPair(a, b);
  slugToCodes.set(`${codeSlug(x)}-vs-${codeSlug(y)}`, [x, y]);
}
for (const m of ALL) register(m.home_code, m.away_code);
for (const f of FIXTURES_2026) if (f.home && f.away) register(f.home, f.away);

export function allHeadToHeadSlugs(): string[] {
  return [...slugToCodes.keys()];
}

export type Meeting = {
  year: string;
  stage: string;
  date: string | null;
  aScore: number;
  bScore: number;
  decided: '' | 'pr' | 'pen'; // prórroga / penaltis
  winner: 'a' | 'b' | 'draw';
  venue: string | null;
};

export type HeadToHead = {
  slug: string;
  a: string;
  b: string;
  aName: string;
  bName: string;
  aFlag: string;
  bFlag: string;
  meetings: Meeting[];
  total: number;
  aWins: number;
  bWins: number;
  draws: number;
  aGoals: number;
  bGoals: number;
  fixture2026: { date: string; venue: string; stage: string; slug: string } | null;
};

export type TeamH2H = {
  code: string;
  name: string;
  flag: string;
  slug: string;
  total: number;
  wins: number;
  losses: number;
  draws: number;
  meets2026: boolean;
};

/**
 * Todos los cara a cara de una selección (rivales en Mundiales + rivales del
 * Mundial 2026 aunque no se hayan visto nunca). Ordenado por nº de duelos.
 */
export function headToHeadsForTeam(code: string): TeamH2H[] {
  const opps = new Map<string, { total: number; w: number; l: number; d: number }>();
  for (const m of ALL) {
    let opp: string | null = null;
    if (m.home_code === code) opp = m.away_code;
    else if (m.away_code === code) opp = m.home_code;
    if (!opp || opp === code) continue;
    const e = opps.get(opp) ?? { total: 0, w: 0, l: 0, d: 0 };
    e.total++;
    if (m.winner_code === code) e.w++;
    else if (m.winner_code === opp) e.l++;
    else e.d++;
    opps.set(opp, e);
  }
  const fixtureOpps = new Set<string>();
  for (const f of FIXTURES_2026) {
    let opp: string | null = null;
    if (f.home === code) opp = f.away ?? null;
    else if (f.away === code) opp = f.home ?? null;
    if (opp && opp !== code) {
      fixtureOpps.add(opp);
      if (!opps.has(opp)) opps.set(opp, { total: 0, w: 0, l: 0, d: 0 });
    }
  }
  const out: TeamH2H[] = [];
  for (const [opp, e] of opps) {
    out.push({
      code: opp,
      name: teamName(opp),
      flag: teamFlag(opp),
      slug: pairSlug(code, opp),
      total: e.total,
      wins: e.w,
      losses: e.l,
      draws: e.d,
      meets2026: fixtureOpps.has(opp),
    });
  }
  out.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, 'es'));
  return out;
}

export type TeamWcRecord = {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  wcCount: number;
};

/**
 * Récord completo de una selección en los Mundiales (1930-2022) a partir del
 * histórico real. `codes` debe incluir el código actual y sus predecesores
 * (p. ej. ['GER','FRG','GDR']) para sumar bien el linaje.
 */
export function teamWorldCupRecord(codes: string[]): TeamWcRecord {
  const set = new Set(codes.map((c) => c.toUpperCase()));
  let played = 0,
    wins = 0,
    draws = 0,
    losses = 0,
    goalsFor = 0,
    goalsAgainst = 0;
  const years = new Set<string>();
  for (const m of ALL) {
    const isHome = set.has(m.home_code);
    const isAway = set.has(m.away_code);
    if (!isHome && !isAway) continue;
    played++;
    years.add(m.year);
    const ourCode = isHome ? m.home_code : m.away_code;
    const our = (isHome ? m.home_score : m.away_score) ?? 0;
    const opp = (isHome ? m.away_score : m.home_score) ?? 0;
    goalsFor += our;
    goalsAgainst += opp;
    if (m.winner_code === ourCode) wins++;
    else if (!m.winner_code) draws++;
    else losses++;
  }
  return { played, wins, draws, losses, goalsFor, goalsAgainst, wcCount: years.size };
}

// Fusión de linaje para la clasificación histórica (sucesor FIFA reconocido).
const LINEAGE_MERGE: Record<string, string> = {
  FRG: 'GER',
  GDR: 'GER',
  URS: 'RUS',
  TCH: 'CZE',
  YUG: 'SRB',
  SCG: 'SRB',
};
const mergeCode = (c: string) => LINEAGE_MERGE[c] ?? c;

export type StandingRow = {
  code: string;
  name: string;
  flag: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number; // 3 por victoria, 1 por empate
  wcCount: number;
};

/**
 * Clasificación histórica de todos los Mundiales (1930-2022): tabla agregada de
 * todas las selecciones, fusionando linajes (RFA/RDA→Alemania, URSS→Rusia…).
 * Ordenada por puntos, luego diferencia de goles, luego goles a favor.
 */
export function allTimeStandings(): StandingRow[] {
  type Agg = { p: number; w: number; d: number; l: number; gf: number; ga: number; years: Set<string> };
  const agg = new Map<string, Agg>();
  const get = (c: string) => {
    let e = agg.get(c);
    if (!e) {
      e = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, years: new Set() };
      agg.set(c, e);
    }
    return e;
  };
  for (const m of ALL) {
    const h = mergeCode(m.home_code);
    const a = mergeCode(m.away_code);
    if (h === a) continue; // evita doble conteo en duelos intra-linaje (RFA-RDA 1974)
    const win = m.winner_code ? mergeCode(m.winner_code) : null;
    for (const [code, isHome] of [[h, true], [a, false]] as const) {
      const e = get(code);
      e.p++;
      e.years.add(m.year);
      const our = (isHome ? m.home_score : m.away_score) ?? 0;
      const opp = (isHome ? m.away_score : m.home_score) ?? 0;
      e.gf += our;
      e.ga += opp;
      if (!win) e.d++;
      else if (win === code) e.w++;
      else e.l++;
    }
  }
  return [...agg.entries()]
    .map(([code, e]) => ({
      code,
      name: teamName(code),
      flag: teamFlag(code),
      played: e.p,
      wins: e.w,
      draws: e.d,
      losses: e.l,
      goalsFor: e.gf,
      goalsAgainst: e.ga,
      points: e.w * 3 + e.d,
      wcCount: e.years.size,
    }))
    .sort(
      (x, y) =>
        y.points - x.points ||
        y.goalsFor - y.goalsAgainst - (x.goalsFor - x.goalsAgainst) ||
        y.goalsFor - x.goalsFor,
    );
}

export function getHeadToHead(slug: string): HeadToHead | null {
  const codes = slugToCodes.get(slug);
  if (!codes) return null;
  const [a, b] = codes;

  const meetings: Meeting[] = [];
  let aWins = 0,
    bWins = 0,
    draws = 0,
    aGoals = 0,
    bGoals = 0;

  for (const m of ALL) {
    const isPair =
      (m.home_code === a && m.away_code === b) || (m.home_code === b && m.away_code === a);
    if (!isPair) continue;
    const aIsHome = m.home_code === a;
    const aScore = (aIsHome ? m.home_score : m.away_score) ?? 0;
    const bScore = (aIsHome ? m.away_score : m.home_score) ?? 0;
    aGoals += aScore;
    bGoals += bScore;

    let winner: 'a' | 'b' | 'draw';
    if (m.winner_code === a) {
      aWins++;
      winner = 'a';
    } else if (m.winner_code === b) {
      bWins++;
      winner = 'b';
    } else {
      draws++;
      winner = 'draw';
    }

    let decided: Meeting['decided'] = '';
    if (m.home_score_pk != null || m.away_score_pk != null) decided = 'pen';
    else if (m.home_score_et != null || m.away_score_et != null) decided = 'pr';

    meetings.push({
      year: m.year,
      stage: m.stage,
      date: m.match_date,
      aScore,
      bScore,
      decided,
      winner,
      venue: m.venue_name,
    });
  }

  meetings.sort((x, y) => Number(y.year) - Number(x.year));

  let fixture2026: HeadToHead['fixture2026'] = null;
  const f = FIXTURES_2026.find(
    (x) => (x.home === a && x.away === b) || (x.home === b && x.away === a),
  );
  if (f) fixture2026 = { date: f.date, venue: f.venue, stage: f.stage, slug: matchSlug(f) };

  return {
    slug,
    a,
    b,
    aName: teamName(a),
    bName: teamName(b),
    aFlag: teamFlag(a),
    bFlag: teamFlag(b),
    meetings,
    total: meetings.length,
    aWins,
    bWins,
    draws,
    aGoals,
    bGoals,
    fixture2026,
  };
}

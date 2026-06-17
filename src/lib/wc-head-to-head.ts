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

import { fetchScores, type LiveMatch } from './live-scores';
import { FIXTURES_2026, TEAMS_2026, STAGE_LABEL, type Fixture26 } from './wc-2026';

/**
 * Cruces REALES de la fase eliminatoria del Mundial 2026, en vivo desde ESPN.
 *
 * ESPN no etiqueta la ronda por evento y sus fechas vienen en UTC (lo que
 * desajusta cualquier filtro por día). Pero SÍ da el estadio de cada partido,
 * así que emparejamos cada evento de ESPN con nuestro fixture por
 * **estadio + orden cronológico** dentro del estadio: es biyectivo y a prueba
 * de zonas horarias. Cuando ESPN aún no ha determinado un cruce usa
 * marcadores ("RD32", "QFW1"...) que no existen en TEAMS_2026, de modo que los
 * dejamos sin resolver hasta que se conozcan los equipos.
 */

const KO_STAGES = ['R32', 'R16', 'QF', 'SF', '3P', 'FINAL'];
const KO_RANGE = '20260628-20260719';

// Estadio (nombre ESPN) → slug de nuestro catálogo de sedes.
const ESPN_VENUE: Record<string, string> = {
  'SoFi Stadium': 'sofi-stadium',
  'NRG Stadium': 'nrg-stadium',
  'Gillette Stadium': 'gillette-stadium',
  'Estadio BBVA': 'estadio-bbva',
  'AT&T Stadium': 'att-stadium',
  'MetLife Stadium': 'metlife-stadium',
  'Estadio Banorte': 'estadio-azteca', // el Azteca renombrado por patrocinio (2025)
  'Lumen Field': 'lumen-field',
  "Levi's Stadium": 'levis-stadium',
  'BMO Field': 'bmo-field',
  'BC Place': 'bc-place',
  'Hard Rock Stadium': 'hard-rock-stadium',
  'GEHA Field at Arrowhead Stadium': 'arrowhead-stadium',
  'Mercedes-Benz Stadium': 'mercedes-benz-stadium',
  'Lincoln Financial Field': 'lincoln-financial-field',
};

export type ResolvedKO = {
  n: number;
  home?: string;
  away?: string;
  homeScore: number | null;
  awayScore: number | null;
  state: 'pre' | 'in' | 'post';
  clock: string | null;
  date: string;
  espnId: string;
};

const isTeam = (code?: string) => !!code && !!TEAMS_2026[code];

function byDate<T extends { date: string }>(a: T, b: T) {
  return (a.date || '').localeCompare(b.date || '');
}
function byKickoff(a: Fixture26, b: Fixture26) {
  return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
}

/**
 * Empareja cada fixture de eliminatorias con su evento real de ESPN.
 * Devuelve un mapa nº de partido → datos resueltos (equipos si ya se conocen,
 * marcador y estado). Cacheado por `fetchScores`.
 */
export async function resolveKnockout(): Promise<Map<number, ResolvedKO>> {
  const out = new Map<number, ResolvedKO>();
  const scores = await fetchScores(KO_RANGE);

  // Bucket ESPN por estadio (solo eventos con estadio mapeable).
  const espByVenue = new Map<string, LiveMatch[]>();
  for (const m of scores) {
    const slug = ESPN_VENUE[m.venue];
    if (!slug) continue;
    (espByVenue.get(slug) ?? espByVenue.set(slug, []).get(slug)!).push(m);
  }

  // Bucket fixtures KO por estadio.
  const fxByVenue = new Map<string, Fixture26[]>();
  for (const f of FIXTURES_2026) {
    if (!KO_STAGES.includes(f.stage)) continue;
    (fxByVenue.get(f.venue) ?? fxByVenue.set(f.venue, []).get(f.venue)!).push(f);
  }

  for (const [venue, fxs] of fxByVenue) {
    const esp = (espByVenue.get(venue) ?? []).slice().sort(byDate);
    fxs.slice().sort(byKickoff).forEach((f, i) => {
      const e = esp[i];
      if (!e) return;
      out.set(f.n, {
        n: f.n,
        home: isTeam(e.home) ? e.home : undefined,
        away: isTeam(e.away) ? e.away : undefined,
        homeScore: e.homeScore,
        awayScore: e.awayScore,
        state: e.state,
        clock: e.clock,
        date: e.date,
        espnId: e.id,
      });
    });
  }
  return out;
}

/** Resuelve los equipos reales de un único fixture de eliminatorias. */
export async function resolveKnockoutFixture(n: number): Promise<ResolvedKO | undefined> {
  return (await resolveKnockout()).get(n);
}

export type KnockoutMatch = {
  n: number;
  /** slug canónico de /2026/partido/[slug] (siempre `partido-N` en eliminatorias) */
  slug: string;
  label: string; // texto del bracket ("2º A · 2º B") cuando aún no hay equipos
  home?: string;
  away?: string;
  homeScore: number | null;
  awayScore: number | null;
  state: 'pre' | 'in' | 'post';
  clock: string | null;
  date: string;
  time: string;
};

export type KnockoutRound = { key: string; label: string; matches: KnockoutMatch[] };

/**
 * Rondas de eliminatorias (dieciseisavos → final) con los enfrentamientos
 * reales cuando ESPN ya los conoce, o el texto del cuadro mientras tanto.
 */
export async function getKnockoutRounds(): Promise<KnockoutRound[]> {
  const resolved = await resolveKnockout();

  return KO_STAGES.map((stage) => {
    const matches = FIXTURES_2026.filter((f) => f.stage === stage)
      .sort(byKickoff)
      .map((f): KnockoutMatch => {
        const r = resolved.get(f.n);
        return {
          n: f.n,
          slug: `partido-${f.n}`,
          label: f.label ?? '',
          home: r?.home,
          away: r?.away,
          homeScore: r?.homeScore ?? null,
          awayScore: r?.awayScore ?? null,
          state: r?.state ?? 'pre',
          clock: r?.clock ?? null,
          date: r?.date || `${f.date}T${f.time}`,
          time: f.time,
        };
      });
    return { key: stage, label: STAGE_LABEL[stage] ?? stage, matches };
  }).filter((r) => r.matches.length > 0);
}

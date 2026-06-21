import { FIXTURES_2026 } from '@/lib/wc-2026';
import { scoreKey } from '@/lib/live-scores';
import type { LiveMatch } from '@/lib/live-scores';
import type { Standing } from './standings';

/**
 * Clasificación EN VIVO y escenarios de clasificación DETERMINISTAS por grupo
 * (Mundial 2026), calculados a partir de los marcadores reales de ESPN
 * (los resultados de 2026 NO están en Supabase, que solo tiene el histórico).
 *
 * Formato 2026: 12 grupos de 4 → 1.º y 2.º DIRECTO; los 8 mejores terceros
 * también avanzan (cruzado entre grupos → el 3.º es "opción a mejor tercero").
 *
 * Escenarios por fuerza bruta sobre los resultados posibles (V/E/D) de los
 * partidos que quedan (≤6 → ≤729 combinaciones). Desempate aproximado por
 * puntos y diferencia de goles actual. Sin azar.
 */

export type ScenarioStatus = 'qualified' | 'alive-direct' | 'third-only' | 'eliminated';

export type TeamScenario = {
  code: string;
  status: ScenarioStatus;
  label: string;
  detail?: string;
};

type Agg = { code: string; pts: number; gd: number; gf: number };

function rankAgg(arr: Agg[]): Agg[] {
  return [...arr]
    .map((t) => ({ ...t }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.code.localeCompare(b.code));
}

function blankStanding(code: string): Standing {
  return { code, MP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, form: [] };
}

export function computeGroupLive(
  stage: string,
  teamCodes: string[],
  scoreMap: Map<string, LiveMatch>,
): { standings: Standing[]; scenarios: TeamScenario[]; played: number } {
  const rows = new Map<string, Standing>(teamCodes.map((c) => [c, blankStanding(c)]));
  const fixtures = FIXTURES_2026.filter(
    (f) => f.stage === stage && f.home && f.away && teamCodes.includes(f.home) && teamCodes.includes(f.away),
  );
  const remaining: [string, string][] = [];
  let played = 0;

  for (const f of fixtures) {
    const sc = scoreMap.get(scoreKey(f.home!, f.away!));
    const finished = sc && sc.state === 'post' && sc.homeScore != null && sc.awayScore != null;
    if (!finished) {
      remaining.push([f.home!, f.away!]);
      continue;
    }
    played++;
    const h = rows.get(f.home!)!;
    const a = rows.get(f.away!)!;
    const hs = sc!.homeScore!;
    const as = sc!.awayScore!;
    h.MP++; a.MP++;
    h.GF += hs; h.GA += as; a.GF += as; a.GA += hs;
    if (hs > as) { h.W++; a.L++; h.Pts += 3; h.form.unshift('W'); a.form.unshift('L'); }
    else if (hs < as) { a.W++; h.L++; a.Pts += 3; a.form.unshift('W'); h.form.unshift('L'); }
    else { h.D++; a.D++; h.Pts += 1; a.Pts += 1; h.form.unshift('D'); a.form.unshift('D'); }
  }
  for (const s of rows.values()) s.GD = s.GF - s.GA;

  const standings = [...rows.values()].sort(
    (a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.code.localeCompare(b.code),
  );

  const scenarios = played > 0 ? buildScenarios(teamCodes, rows, remaining) : [];
  return { standings, scenarios, played };
}

function buildScenarios(
  teamCodes: string[],
  rows: Map<string, Standing>,
  remaining: [string, string][],
): TeamScenario[] {
  const base: Agg[] = teamCodes.map((c) => {
    const s = rows.get(c)!;
    return { code: c, pts: s.Pts, gd: s.GD, gf: s.GF };
  });

  const ranksByTeam = new Map<string, Set<number>>(teamCodes.map((c) => [c, new Set<number>()]));
  const nextOf = new Map<string, number>();
  remaining.forEach(([h, a], i) => {
    if (!nextOf.has(h)) nextOf.set(h, i);
    if (!nextOf.has(a)) nextOf.set(a, i);
  });
  const ownResult = new Map<string, { win: boolean[]; draw: boolean[] }>(
    teamCodes.map((c) => [c, { win: [], draw: [] }]),
  );

  const n = remaining.length;
  const combos = 3 ** n;
  for (let mask = 0; mask < combos; mask++) {
    const agg = new Map(base.map((t) => [t.code, { ...t }]));
    let x = mask;
    const outcomes: number[] = [];
    for (let i = 0; i < n; i++) {
      const o = x % 3;
      x = Math.floor(x / 3);
      outcomes.push(o);
      const [h, a] = remaining[i];
      const H = agg.get(h)!;
      const A = agg.get(a)!;
      if (o === 0) { H.pts += 3; H.gd += 1; H.gf += 1; A.gd -= 1; }
      else if (o === 2) { A.pts += 3; A.gd += 1; A.gf += 1; H.gd -= 1; }
      else { H.pts += 1; A.pts += 1; }
    }
    const ranked = rankAgg([...agg.values()]);
    ranked.forEach((t, idx) => {
      const rank = idx + 1;
      ranksByTeam.get(t.code)!.add(rank);
      const ni = nextOf.get(t.code);
      if (ni != null) {
        const [h] = remaining[ni];
        const o = outcomes[ni];
        const isHome = h === t.code;
        const won = (isHome && o === 0) || (!isHome && o === 2);
        const drew = o === 1;
        const r = ownResult.get(t.code)!;
        if (won) r.win.push(rank <= 2);
        else if (drew) r.draw.push(rank <= 2);
      }
    });
  }

  const all = (arr: boolean[]) => arr.length > 0 && arr.every(Boolean);

  return teamCodes.map((code): TeamScenario => {
    const ranks = ranksByTeam.get(code)!;
    const canTop2 = [...ranks].some((r) => r <= 2);
    const alwaysTop2 = [...ranks].every((r) => r <= 2);
    const canThird = [...ranks].some((r) => r === 3);

    if (alwaysTop2) return { code, status: 'qualified', label: 'Clasificada', detail: 'Top 2 asegurado' };
    if (!canTop2 && !canThird) return { code, status: 'eliminated', label: 'Eliminada' };
    if (!canTop2 && canThird)
      return { code, status: 'third-only', label: 'Opción a mejor 3.º', detail: 'No puede ser top 2' };

    const r = ownResult.get(code)!;
    let detail = 'Depende de otros resultados';
    if (all(r.draw)) detail = 'Le vale el empate para el top 2';
    else if (all(r.win)) detail = 'Ganando entra en el top 2';
    else if (r.win.some(Boolean)) detail = 'Debe ganar y mirar otros resultados';
    return { code, status: 'alive-direct', label: 'Depende', detail };
  });
}

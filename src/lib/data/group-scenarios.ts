import { createClient } from '@/lib/supabase/server';

/**
 * Escenarios de clasificación DETERMINISTAS por grupo (Mundial 2026).
 *
 * Formato 2026: 12 grupos de 4 → 1.º y 2.º pasan DIRECTO; los 8 mejores
 * terceros también avanzan (eso es cruzado entre grupos, así que el 3.º se
 * marca como "opción a mejor tercero", no como clasificado seguro).
 *
 * Calcula el estado de cada selección por FUERZA BRUTA sobre los resultados
 * posibles (V/E/D) de los partidos que quedan del grupo (≤6 → ≤729 combinaciones).
 * El desempate se aproxima por puntos y, en empate, por la diferencia de goles
 * ACTUAL (no se inventan marcadores). Sin azar.
 */

export type ScenarioStatus =
  | 'qualified' // top 2 asegurado
  | 'alive-direct' // aún puede entrar en el top 2
  | 'third-only' // no puede top 2, pero sí 3.º (opción a mejor tercero)
  | 'eliminated'; // no puede ni 3.º

export type TeamScenario = {
  code: string;
  status: ScenarioStatus;
  label: string;
  detail?: string;
};

type Agg = { code: string; pts: number; gd: number; gf: number };

function rankClone(base: Agg[]): Agg[] {
  return [...base]
    .map((t) => ({ ...t }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.code.localeCompare(b.code));
}

export async function computeGroupScenarios(
  year: number,
  stage: string,
  teamCodes: string[],
): Promise<TeamScenario[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('matches')
    .select('home_code, away_code, home_score, away_score, status, match_date')
    .eq('tournament_year', year)
    .eq('stage', stage.toUpperCase())
    .order('match_date', { ascending: true });

  type Raw = {
    home_code: string;
    away_code: string;
    home_score: number | null;
    away_score: number | null;
    status: string | null;
  };
  const matches = (data ?? []) as Raw[];

  const base = new Map<string, Agg>();
  for (const c of teamCodes) base.set(c, { code: c, pts: 0, gd: 0, gf: 0 });

  const remaining: [string, string][] = [];
  for (const m of matches) {
    const h = base.get(m.home_code);
    const a = base.get(m.away_code);
    if (!h || !a) continue;
    if (m.status === 'finished' && m.home_score != null && m.away_score != null) {
      h.gf += m.home_score;
      a.gf += m.away_score;
      h.gd += m.home_score - m.away_score;
      a.gd += m.away_score - m.home_score;
      if (m.home_score > m.away_score) h.pts += 3;
      else if (m.home_score < m.away_score) a.pts += 3;
      else {
        h.pts += 1;
        a.pts += 1;
      }
    } else {
      remaining.push([m.home_code, m.away_code]);
    }
  }

  const baseArr = [...base.values()];
  // Por cada combinación de resultados de los partidos restantes, rango final.
  const ranksByTeam = new Map<string, Set<number>>();
  for (const c of teamCodes) ranksByTeam.set(c, new Set());
  // Para "qué necesita": rangos según el resultado del PRÓXIMO partido del equipo.
  const nextOf = new Map<string, number>(); // code -> índice del próximo partido en `remaining`
  remaining.forEach(([h, a], i) => {
    if (!nextOf.has(h)) nextOf.set(h, i);
    if (!nextOf.has(a)) nextOf.set(a, i);
  });
  const top2ByOwnResult = new Map<string, { win: boolean[]; draw: boolean[]; loss: boolean[] }>();
  for (const c of teamCodes) top2ByOwnResult.set(c, { win: [], draw: [], loss: [] });

  const n = remaining.length;
  const combos = 3 ** n;
  for (let mask = 0; mask < combos; mask++) {
    const agg = new Map(baseArr.map((t) => [t.code, { ...t }]));
    let x = mask;
    const outcomes: number[] = []; // 0 home win, 1 draw, 2 away win
    for (let i = 0; i < n; i++) {
      const o = x % 3;
      x = Math.floor(x / 3);
      outcomes.push(o);
      const [h, a] = remaining[i];
      const H = agg.get(h)!;
      const A = agg.get(a)!;
      if (o === 0) {
        H.pts += 3;
        H.gd += 1;
        H.gf += 1;
        A.gd -= 1;
      } else if (o === 2) {
        A.pts += 3;
        A.gd += 1;
        A.gf += 1;
        H.gd -= 1;
      } else {
        H.pts += 1;
        A.pts += 1;
      }
    }
    const ranked = rankClone([...agg.values()]);
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
        const bucket = top2ByOwnResult.get(t.code)!;
        (won ? bucket.win : drew ? bucket.draw : bucket.loss).push(rank <= 2);
      }
    });
  }

  return teamCodes.map((code): TeamScenario => {
    const ranks = ranksByTeam.get(code)!;
    const canTop2 = [...ranks].some((r) => r <= 2);
    const alwaysTop2 = [...ranks].every((r) => r <= 2);
    const canThird = [...ranks].some((r) => r === 3);
    const best = Math.min(...ranks);
    const worst = Math.max(...ranks);

    if (n === 0) {
      // Todo decidido.
      if (worst <= 2) return { code, status: 'qualified', label: 'Clasificada', detail: 'Top 2' };
      if (best === 3) return { code, status: 'third-only', label: 'Tercera', detail: 'Opción a mejor tercero' };
      return { code, status: 'eliminated', label: 'Eliminada' };
    }
    if (alwaysTop2) return { code, status: 'qualified', label: 'Clasificada', detail: 'Top 2 asegurado' };
    if (!canTop2 && !canThird) return { code, status: 'eliminated', label: 'Eliminada' };
    if (!canTop2 && canThird)
      return { code, status: 'third-only', label: 'Opción a mejor 3.º', detail: 'No puede ser top 2' };

    // Vivo para el top 2 → "qué necesita" según su próximo partido.
    const b = top2ByOwnResult.get(code)!;
    const all = (arr: boolean[]) => arr.length > 0 && arr.every(Boolean);
    let detail = 'Depende de otros resultados';
    if (all(b.draw)) detail = 'Le vale el empate para el top 2';
    else if (all(b.win)) detail = 'Ganando entra en el top 2';
    else if (b.win.some(Boolean)) detail = 'Debe ganar y mirar otros resultados';
    return { code, status: 'alive-direct', label: 'Depende', detail };
  });
}

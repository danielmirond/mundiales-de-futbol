import { createClient } from '@/lib/supabase/server';

export type Standing = {
  code: string;
  MP: number;
  W: number;
  D: number;
  L: number;
  GF: number;
  GA: number;
  GD: number;
  Pts: number;
  /** Last 5 results, newest first: 'W' | 'D' | 'L' */
  form: string[];
};

/**
 * Compute live group standings from the `matches` table.
 *
 * @param year      Tournament year (e.g. 2026)
 * @param stage     Group letter (A..L) or any other stage label
 * @param teamCodes The 4 team codes of the group, in draw order
 * @returns Rows sorted by points → goal difference → goals for → team code
 */
export async function computeGroupStandings(
  year: number,
  stage: string,
  teamCodes: string[],
): Promise<Standing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('matches')
    .select(
      'home_code, away_code, home_score, away_score, status, match_date',
    )
    .eq('tournament_year', year)
    .eq('stage', stage.toUpperCase())
    .order('match_date', { ascending: true });

  if (error) {
    console.error('computeGroupStandings:', error);
  }

  // Initialise
  const rows = new Map<string, Standing>();
  for (const code of teamCodes) {
    rows.set(code, {
      code,
      MP: 0, W: 0, D: 0, L: 0,
      GF: 0, GA: 0, GD: 0, Pts: 0,
      form: [],
    });
  }

  type Raw = {
    home_code: string;
    away_code: string;
    home_score: number | null;
    away_score: number | null;
    status: string | null;
  };
  const matches = (data ?? []) as Raw[];

  for (const m of matches) {
    if (m.status !== 'finished') continue;
    if (m.home_score == null || m.away_score == null) continue;
    const h = rows.get(m.home_code);
    const a = rows.get(m.away_code);
    if (!h || !a) continue;

    h.MP++; a.MP++;
    h.GF += m.home_score; h.GA += m.away_score;
    a.GF += m.away_score; a.GA += m.home_score;

    if (m.home_score > m.away_score) {
      h.W++; a.L++;
      h.Pts += 3;
      h.form.unshift('W'); a.form.unshift('L');
    } else if (m.home_score < m.away_score) {
      a.W++; h.L++;
      a.Pts += 3;
      a.form.unshift('W'); h.form.unshift('L');
    } else {
      h.D++; a.D++;
      h.Pts += 1; a.Pts += 1;
      h.form.unshift('D'); a.form.unshift('D');
    }
  }

  // Compute GD + trim form
  for (const r of rows.values()) {
    r.GD = r.GF - r.GA;
    r.form = r.form.slice(0, 5);
  }

  return Array.from(rows.values()).sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    if (b.GF !== a.GF) return b.GF - a.GF;
    return a.code.localeCompare(b.code);
  });
}

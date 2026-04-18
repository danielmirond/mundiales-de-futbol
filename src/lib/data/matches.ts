import { createClient } from '@/lib/supabase/server';

export type Match = {
  match_number: number;
  stage: string;
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number | null;
  away_score: number | null;
  home_score_pk: number | null;
  away_score_pk: number | null;
  winner_code: string | null;
  home_team: { name_official: string; flag_emoji: string | null } | null;
  away_team: { name_official: string; flag_emoji: string | null } | null;
  venue: { name: string; city: string | null } | null;
  referee: { full_name: string } | null;
};

export const STAGE_ORDER: Record<string, number> = {
  group: 0,
  r16: 1,
  qf: 2,
  sf: 3,
  '3rd': 4,
  final: 5,
};

export const STAGE_LABEL_ES: Record<string, string> = {
  group: 'Fase de grupos',
  r16: 'Octavos de final',
  qf: 'Cuartos de final',
  sf: 'Semifinales',
  '3rd': 'Tercer puesto',
  final: 'Final',
};

export async function getMatchesForTournament(year: number): Promise<Match[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('matches')
      .select(
        `match_number, stage, match_date, home_code, away_code,
         home_score, away_score, home_score_pk, away_score_pk, winner_code,
         home_team:teams!matches_home_code_fkey(name_official, flag_emoji),
         away_team:teams!matches_away_code_fkey(name_official, flag_emoji),
         venue:venues!matches_venue_id_fkey(name, city),
         referee:referees!matches_referee_id_fkey(full_name)`,
      )
      .eq('tournament_year', year)
      .order('match_date', { ascending: true });

    if (error) throw error;
    return (data ?? []) as unknown as Match[];
  } catch (err) {
    console.error('getMatchesForTournament failed:', err);
    return [];
  }
}

export function groupByStage(matches: Match[]): Array<{ stage: string; matches: Match[] }> {
  const groups = new Map<string, Match[]>();
  for (const m of matches) {
    if (!groups.has(m.stage)) groups.set(m.stage, []);
    groups.get(m.stage)!.push(m);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (STAGE_ORDER[a] ?? 99) - (STAGE_ORDER[b] ?? 99))
    .map(([stage, matches]) => ({ stage, matches }));
}

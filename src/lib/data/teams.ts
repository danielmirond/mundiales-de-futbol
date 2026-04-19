import { createClient } from '@/lib/supabase/server';

export type TeamStats = {
  code: string;
  iso_alpha3: string | null;
  name_official: string;
  name_common: string | null;
  flag_emoji: string | null;
  confederation: string | null;
  dissolved_year: number | null;
  successor_code: string | null;
  wc_count: number;
  wc_years: number[];
  titles: number;
  runners_up: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
};

export type TeamMatchRow = {
  id: string;
  tournament_year: number;
  match_number: number;
  stage: string | null;
  match_date: string;
  team_code: string;
  opponent_code: string;
  team_score: number | null;
  opponent_score: number | null;
  result: 'W' | 'D' | 'L' | '—';
};

const SELECT = 'code,iso_alpha3,name_official,name_common,flag_emoji,confederation,dissolved_year,successor_code,wc_count,wc_years,titles,runners_up,matches_played,wins,draws,losses,goals_for,goals_against';

export function teamDisplayName(t: Pick<TeamStats, 'name_official' | 'name_common'>) {
  return t.name_common || t.name_official;
}

export async function getAllTeamsRanked(): Promise<TeamStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('team_stats')
      .select(SELECT)
      .order('titles', { ascending: false })
      .order('runners_up', { ascending: false })
      .order('wc_count', { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data ?? []) as unknown as TeamStats[];
  } catch (err) {
    console.error('getAllTeamsRanked:', err);
    return [];
  }
}

export async function getTeamByCode(code: string): Promise<TeamStats | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('team_stats')
      .select(SELECT)
      .eq('code', code.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as TeamStats | null) ?? null;
  } catch (err) {
    console.error('getTeamByCode:', err);
    return null;
  }
}

/** Every match this team has played, newest first. */
export async function getTeamMatches(code: string): Promise<TeamMatchRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('matches')
      .select(
        'id, tournament_year, match_number, stage, match_date, home_code, away_code, home_score, away_score, home_score_pk, away_score_pk, winner_code, status',
      )
      .or(`home_code.eq.${code},away_code.eq.${code}`)
      .order('match_date', { ascending: false });
    if (error) throw error;

    type Raw = {
      id: string;
      tournament_year: number;
      match_number: number;
      stage: string | null;
      match_date: string;
      home_code: string;
      away_code: string;
      home_score: number | null;
      away_score: number | null;
      winner_code: string | null;
      status: string | null;
    };

    return ((data ?? []) as Raw[]).map((m) => {
      const isHome = m.home_code === code;
      const opponent = isHome ? m.away_code : m.home_code;
      const teamScore = isHome ? m.home_score : m.away_score;
      const oppScore = isHome ? m.away_score : m.home_score;
      let result: 'W' | 'D' | 'L' | '—' = '—';
      if (m.winner_code === code) result = 'W';
      else if (m.winner_code === null && m.home_score !== null) result = 'D';
      else if (m.winner_code && m.winner_code !== code) result = 'L';
      return {
        id: m.id,
        tournament_year: m.tournament_year,
        match_number: m.match_number,
        stage: m.stage,
        match_date: m.match_date,
        team_code: code,
        opponent_code: opponent,
        team_score: teamScore,
        opponent_score: oppScore,
        result,
      };
    });
  } catch (err) {
    console.error('getTeamMatches:', err);
    return [];
  }
}

/** Top goalscorers for this team (across WCs with event data). */
export type TeamTopScorer = {
  player_id: string;
  slug: string;
  full_name: string;
  known_as: string | null;
  goals: number;
};

export async function getTeamTopScorers(code: string, limit = 10): Promise<TeamTopScorer[]> {
  try {
    const supabase = await createClient();

    // Get all goal events by this team's players.
    const { data: events, error: eErr } = await supabase
      .from('match_events')
      .select('player_id')
      .in('event_type', ['goal', 'penalty_goal'])
      .eq('team_code', code);
    if (eErr) throw eErr;

    const counts = new Map<string, number>();
    for (const e of (events ?? []) as { player_id: string | null }[]) {
      if (!e.player_id) continue;
      counts.set(e.player_id, (counts.get(e.player_id) ?? 0) + 1);
    }

    const topIds = [...counts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);
    if (topIds.length === 0) return [];

    const { data: players } = await supabase
      .from('players')
      .select('id, slug, full_name, known_as')
      .in('id', topIds);

    return (players ?? [])
      .map((p) => ({
        player_id: p.id,
        slug: p.slug,
        full_name: p.full_name,
        known_as: p.known_as,
        goals: counts.get(p.id) ?? 0,
      }))
      .sort((a, b) => b.goals - a.goals);
  } catch (err) {
    console.error('getTeamTopScorers:', err);
    return [];
  }
}

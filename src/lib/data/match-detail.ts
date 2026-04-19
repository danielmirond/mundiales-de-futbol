import { createClient } from '@/lib/supabase/server';

export type MatchDetail = {
  id: string;
  match_number: number;
  tournament_year: number;
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
  referee: { full_name: string; nationality_code: string | null } | null;
};

export type LineupPlayer = {
  player_id: string;
  team_code: string;
  shirt_number: number | null;
  position: string | null;
  starter: boolean;
  minutes_played: number | null;
  sub_on_minute: number | null;
  sub_off_minute: number | null;
  player: { full_name: string; known_as: string | null; slug: string } | null;
};

export type TimelineEvent = {
  id: string;
  minute: number | null;
  period: string | null;
  event_type: string;
  team_code: string | null;
  detail: string | null;
  player: { full_name: string; known_as: string | null; slug: string } | null;
  secondary_player: { full_name: string; known_as: string | null; slug: string } | null;
};

export async function getMatchByNumber(
  year: number,
  matchNumber: number,
): Promise<MatchDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('matches')
      .select(
        `id, match_number, tournament_year, stage, match_date, home_code, away_code,
         home_score, away_score, home_score_pk, away_score_pk, winner_code,
         home_team:teams!matches_home_code_fkey(name_official, flag_emoji),
         away_team:teams!matches_away_code_fkey(name_official, flag_emoji),
         venue:venues!matches_venue_id_fkey(name, city),
         referee:referees!matches_referee_id_fkey(full_name, nationality_code)`,
      )
      .eq('tournament_year', year)
      .eq('match_number', matchNumber)
      .maybeSingle();
    if (error) throw error;
    return data as unknown as MatchDetail | null;
  } catch {
    return null;
  }
}

export async function getLineupsForMatch(matchId: string): Promise<LineupPlayer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('match_lineups')
      .select(
        `player_id, team_code, shirt_number, position, starter,
         minutes_played, sub_on_minute, sub_off_minute,
         player:players!match_lineups_player_id_fkey(full_name, known_as, slug)`,
      )
      .eq('match_id', matchId);
    if (error) throw error;
    return (data ?? []) as unknown as LineupPlayer[];
  } catch {
    return [];
  }
}

export async function getEventsForMatch(matchId: string): Promise<TimelineEvent[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('match_events')
      .select(
        `id, minute, period, event_type, team_code, detail,
         player:players!match_events_player_id_fkey(full_name, known_as, slug),
         secondary_player:players!match_events_secondary_player_id_fkey(full_name, known_as, slug)`,
      )
      .eq('match_id', matchId)
      .order('minute', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as TimelineEvent[];
  } catch {
    return [];
  }
}

export function displayName(p: { full_name: string; known_as: string | null } | null): string {
  if (!p) return '—';
  return p.known_as || p.full_name;
}

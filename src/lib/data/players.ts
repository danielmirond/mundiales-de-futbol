import { createClient } from '@/lib/supabase/server';

export type PlayerStats = {
  id: string;
  slug: string;
  full_name: string;
  known_as: string | null;
  nationality_code: string | null;
  position: string | null;
  birth_date: string | null;
  death_date: string | null;
  photo_url: string | null;
  wc_count: number;
  wc_years: number[];
  total_minutes: number;
  starts: number;
  goals: number;
  own_goals: number;
  assists: number;
  yellows: number;
  reds: number;
};

export type PlayerMatchAppearance = {
  match_id: string;
  tournament_year: number;
  match_number: number;
  stage: string | null;
  match_date: string;
  team_code: string;
  opponent_code: string;
  home_score: number | null;
  away_score: number | null;
  starter: boolean;
  minutes_played: number | null;
  sub_on_minute: number | null;
  sub_off_minute: number | null;
  goals: number;
  yellows: number;
  reds: number;
};

export function displayPlayerName(p: {
  full_name: string;
  known_as: string | null;
}): string {
  return (p.known_as && p.known_as.trim()) || p.full_name;
}

const SELECT_COLUMNS =
  'id,slug,full_name,known_as,nationality_code,position,birth_date,death_date,photo_url,' +
  'wc_count,wc_years,total_minutes,starts,goals,own_goals,assists,yellows,reds';

/**
 * Top players ordered by World Cup appearances, then total minutes.
 * Filters out players with zero minutes (unused bench-only appearances).
 */
export async function getTopPlayers(limit = 60): Promise<PlayerStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .gt('total_minutes', 0)
      .order('wc_count', { ascending: false })
      .order('total_minutes', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as PlayerStats[];
  } catch (err) {
    console.error('getTopPlayers:', err);
    return [];
  }
}

/** Players ordered by yellow cards received in World Cups. */
export async function getPlayersByYellows(limit = 30): Promise<PlayerStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .gt('yellows', 0)
      .order('yellows', { ascending: false })
      .order('wc_count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as PlayerStats[];
  } catch (err) {
    console.error('getPlayersByYellows:', err);
    return [];
  }
}

/** Players ordered by red cards received in World Cups. */
export async function getPlayersByReds(limit = 30): Promise<PlayerStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .gt('reds', 0)
      .order('reds', { ascending: false })
      .order('yellows', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as PlayerStats[];
  } catch (err) {
    console.error('getPlayersByReds:', err);
    return [];
  }
}

/** Players ordered by own_goals scored. */
export async function getPlayersByOwnGoals(limit = 30): Promise<PlayerStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .gt('own_goals', 0)
      .order('own_goals', { ascending: false })
      .order('wc_count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as PlayerStats[];
  } catch (err) {
    console.error('getPlayersByOwnGoals:', err);
    return [];
  }
}

/** Players ordered by total minutes played in World Cups. */
export async function getPlayersByMinutes(limit = 30): Promise<PlayerStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .gt('total_minutes', 0)
      .order('total_minutes', { ascending: false })
      .order('wc_count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as PlayerStats[];
  } catch (err) {
    console.error('getPlayersByMinutes:', err);
    return [];
  }
}

/** Top goalscorers across World Cup history (in our data). */
export async function getTopScorers(limit = 30): Promise<PlayerStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .gt('goals', 0)
      .order('goals', { ascending: false })
      .order('wc_count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as PlayerStats[];
  } catch (err) {
    console.error('getTopScorers:', err);
    return [];
  }
}

export async function getPlayerBySlug(slug: string): Promise<PlayerStats | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('player_stats')
      .select(SELECT_COLUMNS)
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as PlayerStats | null) ?? null;
  } catch (err) {
    console.error('getPlayerBySlug:', err);
    return null;
  }
}

/**
 * Get every match appearance of a player, newest first, with goals/cards
 * counted from match_events.
 */
export async function getPlayerCareer(playerId: string): Promise<PlayerMatchAppearance[]> {
  try {
    const supabase = await createClient();

    // Step 1 — pull lineup rows (one per match the player was in a squad for).
    const { data: lineups, error: lErr } = await supabase
      .from('match_lineups')
      .select(
        `team_code, starter, minutes_played, sub_on_minute, sub_off_minute,
         match:matches!match_lineups_match_id_fkey(id, tournament_year, match_number, stage, match_date, home_code, away_code, home_score, away_score)`,
      )
      .eq('player_id', playerId);
    if (lErr) throw lErr;

    // Step 2 — pull event totals per match for the player.
    const { data: events, error: eErr } = await supabase
      .from('match_events')
      .select('match_id, event_type')
      .eq('player_id', playerId);
    if (eErr) throw eErr;

    type EventRow = { match_id: string; event_type: string };
    const byMatch = new Map<string, { goals: number; yellows: number; reds: number }>();
    for (const e of (events ?? []) as EventRow[]) {
      const m = byMatch.get(e.match_id) ?? { goals: 0, yellows: 0, reds: 0 };
      if (e.event_type === 'goal' || e.event_type === 'penalty_goal') m.goals++;
      else if (e.event_type === 'yellow' || e.event_type === 'yellow_red') m.yellows++;
      else if (e.event_type === 'red' || e.event_type === 'yellow_red') m.reds++;
      byMatch.set(e.match_id, m);
    }

    type LineupRow = {
      team_code: string;
      starter: boolean | null;
      minutes_played: number | null;
      sub_on_minute: number | null;
      sub_off_minute: number | null;
      match: {
        id: string;
        tournament_year: number;
        match_number: number;
        stage: string | null;
        match_date: string;
        home_code: string;
        away_code: string;
        home_score: number | null;
        away_score: number | null;
      } | null;
    };

    const appearances: PlayerMatchAppearance[] = ((lineups ?? []) as unknown as LineupRow[])
      .filter((l) => l.match)
      .map((l) => {
        const m = l.match!;
        const opponent = l.team_code === m.home_code ? m.away_code : m.home_code;
        const ev = byMatch.get(m.id) ?? { goals: 0, yellows: 0, reds: 0 };
        return {
          match_id: m.id,
          tournament_year: m.tournament_year,
          match_number: m.match_number,
          stage: m.stage,
          match_date: m.match_date,
          team_code: l.team_code,
          opponent_code: opponent,
          home_score: m.home_score,
          away_score: m.away_score,
          starter: !!l.starter,
          minutes_played: l.minutes_played,
          sub_on_minute: l.sub_on_minute,
          sub_off_minute: l.sub_off_minute,
          goals: ev.goals,
          yellows: ev.yellows,
          reds: ev.reds,
        };
      });

    return appearances.sort((a, b) =>
      a.match_date < b.match_date ? 1 : a.match_date > b.match_date ? -1 : 0,
    );
  } catch (err) {
    console.error('getPlayerCareer:', err);
    return [];
  }
}

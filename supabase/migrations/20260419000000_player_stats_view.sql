-- =====================================================================
-- Materialised-style view that aggregates per-player World Cup stats.
-- Used by /jugadores (index sort) and /jugadores/[slug] (detail).
-- =====================================================================

create or replace view player_stats as
select
  p.id,
  p.slug,
  p.full_name,
  p.known_as,
  p.nationality_code,
  p.position,
  p.birth_date,
  p.death_date,
  p.photo_url,
  coalesce((
    select count(distinct s.tournament_year)
    from squads s where s.player_id = p.id
  ), 0) as wc_count,
  coalesce((
    select array_agg(distinct s.tournament_year order by s.tournament_year)
    from squads s where s.player_id = p.id
  ), '{}') as wc_years,
  coalesce((
    select sum(coalesce(ml.minutes_played, 0))::int
    from match_lineups ml where ml.player_id = p.id
  ), 0) as total_minutes,
  coalesce((
    select count(*) from match_lineups ml
    where ml.player_id = p.id and ml.starter = true
  ), 0) as starts,
  coalesce((
    select count(*) from match_events me
    where me.player_id = p.id and me.event_type in ('goal', 'penalty_goal')
  ), 0) as goals,
  coalesce((
    select count(*) from match_events me
    where me.player_id = p.id and me.event_type = 'own_goal'
  ), 0) as own_goals,
  coalesce((
    select count(*) from match_events me
    where me.secondary_player_id = p.id and me.event_type in ('goal', 'penalty_goal')
  ), 0) as assists,
  coalesce((
    select count(*) from match_events me
    where me.player_id = p.id and me.event_type in ('yellow', 'yellow_red')
  ), 0) as yellows,
  coalesce((
    select count(*) from match_events me
    where me.player_id = p.id and me.event_type in ('red', 'yellow_red')
  ), 0) as reds
from players p;

-- Grant public-read on the view (RLS on underlying tables still enforced).
grant select on player_stats to anon, authenticated;

-- =====================================================================
-- Per-national-team aggregate view: titles, matches, record, goals,
-- years played. Used by /selecciones and /selecciones/[code].
-- =====================================================================

create or replace view team_stats as
select
  t.code,
  t.iso_alpha3,
  t.name_official,
  t.name_common,
  t.flag_emoji,
  t.confederation,
  t.dissolved_year,
  t.successor_code,
  coalesce((
    select count(distinct tournament_year)
    from matches m where m.home_code = t.code or m.away_code = t.code
  ), 0) as wc_count,
  coalesce((
    select array_agg(distinct tournament_year order by tournament_year)
    from matches m where m.home_code = t.code or m.away_code = t.code
  ), '{}') as wc_years,
  coalesce((
    select count(*) from tournaments tr where tr.champion_code = t.code
  ), 0) as titles,
  coalesce((
    select count(*) from tournaments tr where tr.runner_up_code = t.code
  ), 0) as runners_up,
  coalesce((
    select count(*) from matches m
    where m.home_code = t.code or m.away_code = t.code
  ), 0) as matches_played,
  coalesce((
    select count(*) from matches m where m.winner_code = t.code
  ), 0) as wins,
  coalesce((
    select count(*) from matches m
    where (m.home_code = t.code or m.away_code = t.code)
      and m.winner_code is null
      and m.home_score is not null
  ), 0) as draws,
  coalesce((
    select count(*) from matches m
    where (m.home_code = t.code or m.away_code = t.code)
      and m.winner_code is not null
      and m.winner_code != t.code
  ), 0) as losses,
  coalesce((
    select sum(case when m.home_code = t.code then m.home_score else m.away_score end)
    from matches m
    where (m.home_code = t.code or m.away_code = t.code)
      and m.home_score is not null
  ), 0) as goals_for,
  coalesce((
    select sum(case when m.home_code = t.code then m.away_score else m.home_score end)
    from matches m
    where (m.home_code = t.code or m.away_code = t.code)
      and m.home_score is not null
  ), 0) as goals_against
from teams t
where exists (
  select 1 from matches m where m.home_code = t.code or m.away_code = t.code
);

grant select on team_stats to anon, authenticated;

notify pgrst, 'reload schema';

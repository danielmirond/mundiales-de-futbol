-- =====================================================================
-- Mundiales de Fútbol — initial schema
-- Covers: tournaments, teams, players, venues, referees, matches,
-- lineups, events, shot events (StatsBomb-style), player-match stats,
-- editorial articles and media (archive.org / youtube / wikimedia).
-- All public content is readable anonymously (RLS "public read").
-- Writes are restricted — service role only, until auth is added.
-- =====================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------
-- Tournaments (22 editions, 1930–2026)
-- -------------------------------------------------------------------
create table if not exists tournaments (
  year                  int         primary key,
  slug                  text        not null unique,
  host_country          text        not null,
  host_countries        text[],
  champion_code         text,
  runner_up_code        text,
  third_code            text,
  fourth_code           text,
  teams                 int,
  matches_played        int,
  goals                 int,
  attendance            bigint,
  start_date            date,
  end_date              date,
  format                text,
  mascot                text,
  ball_name             text,
  anthem                text,
  motto                 text,
  top_scorer_name       text,
  top_scorer_goals      int,
  top_scorer_team       text,
  palette_from          text,
  palette_to            text,
  tagline_i18n          jsonb,          -- { es, en, pt, fr, ar }
  summary_i18n          jsonb,
  external_fifa_id      text,
  external_wikidata_id  text,
  hero_image_url        text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- -------------------------------------------------------------------
-- Teams (national sides) — keyed by FIFA 3-letter code with historical quirks
-- -------------------------------------------------------------------
create table if not exists teams (
  code                  text        primary key,   -- 'BRA', 'ARG', 'FRG' (West Germany), etc.
  iso_alpha3            text,                       -- may differ ('FRG' vs 'DEU')
  name_official         text        not null,
  name_common           text,
  name_i18n             jsonb,
  confederation         text,        -- 'UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC'
  flag_emoji            text,
  flag_svg_url          text,
  founded_year          int,
  dissolved_year        int,         -- for 'FRG', 'URS', 'YUG', 'TCH', 'ZAI'
  successor_code        text,        -- 'FRG' -> 'GER'
  wikidata_id           text,
  created_at            timestamptz default now()
);

-- -------------------------------------------------------------------
-- Venues (stadiums)
-- -------------------------------------------------------------------
create table if not exists venues (
  id                    uuid        primary key default gen_random_uuid(),
  slug                  text        not null unique,
  name                  text        not null,
  name_alt              text[],
  city                  text,
  country_code          text,
  latitude              numeric(9,6),
  longitude             numeric(9,6),
  capacity_history      jsonb,       -- { "2022": 60000, "2018": 55000 }
  surface               text,
  opened_year           int,
  closed_year           int,
  wikidata_id           text,
  hero_image_url        text,
  summary_i18n          jsonb,
  created_at            timestamptz default now()
);
create index if not exists venues_country_idx on venues(country_code);

-- -------------------------------------------------------------------
-- Players
-- -------------------------------------------------------------------
create table if not exists players (
  id                    uuid        primary key default gen_random_uuid(),
  slug                  text        not null unique,
  full_name             text        not null,
  known_as              text,
  birth_date            date,
  death_date            date,
  nationality_code      text references teams(code),
  position              text,        -- 'GK' | 'DF' | 'MF' | 'FW'
  height_cm             int,
  preferred_foot        text,        -- 'L' | 'R' | 'B'
  wikidata_id           text,
  transfermarkt_id      text,
  photo_url             text,
  bio_i18n              jsonb,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);
create index if not exists players_nationality_idx on players(nationality_code);

-- -------------------------------------------------------------------
-- Squads (23–26 players selected for a tournament)
-- -------------------------------------------------------------------
create table if not exists squads (
  tournament_year       int references tournaments(year) on delete cascade,
  team_code             text references teams(code),
  player_id             uuid references players(id) on delete cascade,
  shirt_number          int,
  position              text,
  captain               boolean     default false,
  club                  text,
  club_country          text,
  primary key (tournament_year, team_code, player_id)
);
create index if not exists squads_player_idx on squads(player_id);

-- -------------------------------------------------------------------
-- Referees
-- -------------------------------------------------------------------
create table if not exists referees (
  id                    uuid        primary key default gen_random_uuid(),
  full_name             text        not null,
  nationality_code      text references teams(code),
  birth_date            date,
  wikidata_id           text,
  created_at            timestamptz default now()
);

-- -------------------------------------------------------------------
-- Matches (group stage + knockout + final)
-- -------------------------------------------------------------------
create table if not exists matches (
  id                    uuid        primary key default gen_random_uuid(),
  tournament_year       int references tournaments(year) on delete cascade,
  match_number          int,
  stage                 text,        -- 'group-a', 'r16', 'qf', 'sf', '3rd', 'final'
  match_date            timestamptz,
  venue_id              uuid references venues(id),
  home_code             text references teams(code),
  away_code             text references teams(code),
  home_score            int,
  away_score            int,
  home_score_et         int,
  away_score_et         int,
  home_score_pk         int,
  away_score_pk         int,
  winner_code           text references teams(code),
  attendance            int,
  referee_id            uuid references referees(id),
  weather               text,
  temperature_c         int,
  external_fifa_id      text,
  external_wikidata_id  text,
  external_statsbomb_id text,
  status                text default 'scheduled',  -- 'scheduled' | 'live' | 'finished' | 'postponed'
  live_minute           int,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now(),
  unique (tournament_year, match_number)
);
create index if not exists matches_year_date_idx on matches(tournament_year, match_date);
create index if not exists matches_home_idx on matches(home_code);
create index if not exists matches_away_idx on matches(away_code);

-- -------------------------------------------------------------------
-- Match lineups
-- -------------------------------------------------------------------
create table if not exists match_lineups (
  match_id              uuid references matches(id) on delete cascade,
  team_code             text references teams(code),
  player_id             uuid references players(id),
  shirt_number          int,
  position              text,
  starter               boolean     default true,
  captain               boolean     default false,
  minutes_played        int,
  sub_on_minute         int,
  sub_off_minute        int,
  primary key (match_id, team_code, player_id)
);

-- -------------------------------------------------------------------
-- Match events (goals, cards, subs, VAR, etc.)
-- -------------------------------------------------------------------
create table if not exists match_events (
  id                    uuid        primary key default gen_random_uuid(),
  match_id              uuid references matches(id) on delete cascade,
  minute                int,
  stoppage              int,
  period                text,        -- '1H' | '2H' | 'ET1' | 'ET2' | 'PK'
  event_type            text not null,
    -- 'goal' | 'own_goal' | 'penalty_goal' | 'penalty_miss'
    -- 'yellow' | 'yellow_red' | 'red'
    -- 'sub_in' | 'sub_out'
    -- 'var_reviewed' | 'var_overturned'
  team_code             text references teams(code),
  player_id             uuid references players(id),
  secondary_player_id   uuid references players(id),
  detail                text,
  created_at            timestamptz default now()
);
create index if not exists match_events_match_minute on match_events(match_id, minute);

-- -------------------------------------------------------------------
-- Shot events (StatsBomb-style, 120x80 coords)
-- Only available for selected tournaments (1986, 1990, 2018, 2022, ...)
-- -------------------------------------------------------------------
create table if not exists match_shot_events (
  id                    uuid        primary key default gen_random_uuid(),
  match_id              uuid references matches(id) on delete cascade,
  minute                int,
  second                int,
  period                text,
  team_code             text references teams(code),
  player_id             uuid references players(id),
  start_x               numeric(6,3),
  start_y               numeric(6,3),
  end_x                 numeric(6,3),
  end_y                 numeric(6,3),
  body_part             text,        -- 'head' | 'left_foot' | 'right_foot' | 'other'
  outcome               text,        -- 'goal' | 'saved' | 'off_target' | 'blocked' | 'post'
  xg                    numeric(5,4),
  pattern               text,        -- 'open_play' | 'corner' | 'free_kick' | 'penalty'
  statsbomb_shot_id     text,
  created_at            timestamptz default now()
);
create index if not exists shot_events_match_idx on match_shot_events(match_id);
create index if not exists shot_events_player_idx on match_shot_events(player_id);

-- -------------------------------------------------------------------
-- Denormalised player-match stats (for fast lookup)
-- -------------------------------------------------------------------
create table if not exists player_match_stats (
  match_id              uuid references matches(id) on delete cascade,
  player_id             uuid references players(id),
  team_code             text references teams(code),
  minutes               int,
  goals                 int default 0,
  assists               int default 0,
  shots                 int default 0,
  shots_on_target       int default 0,
  xg                    numeric(6,4),
  xa                    numeric(6,4),
  passes                int,
  passes_completed      int,
  key_passes            int,
  tackles               int,
  interceptions         int,
  fouls_committed       int,
  fouls_drawn           int,
  yellow_cards          int default 0,
  red_cards             int default 0,
  primary key (match_id, player_id)
);

-- -------------------------------------------------------------------
-- Editorial articles (chronicles, features, profiles)
-- -------------------------------------------------------------------
create table if not exists articles (
  id                    uuid        primary key default gen_random_uuid(),
  slug                  text        not null unique,
  kind                  text,        -- 'match_chronicle' | 'tournament_recap' | 'player_profile' | 'feature'
  tournament_year       int references tournaments(year),
  match_id              uuid references matches(id),
  player_id             uuid references players(id),
  venue_id              uuid references venues(id),
  title_i18n            jsonb       not null,
  dek_i18n              jsonb,
  body_i18n             jsonb,
  hero_media_id         uuid,
  authors               text[],
  tags                  text[],
  reading_time_sec      int,
  published_at          timestamptz,
  updated_at            timestamptz default now(),
  created_at            timestamptz default now()
);
create index if not exists articles_year_idx on articles(tournament_year);
create index if not exists articles_published_idx on articles(published_at desc);

-- -------------------------------------------------------------------
-- Media (video + image + audio, incl. archive.org identifiers)
-- -------------------------------------------------------------------
create table if not exists media (
  id                    uuid        primary key default gen_random_uuid(),
  kind                  text        not null,     -- 'video' | 'image' | 'audio'
  source                text        not null,     -- 'archive.org' | 'youtube' | 'wikimedia' | 'fifa' | 'internal'
  source_id             text,                     -- archive identifier or YouTube video id
  url                   text,
  embed_url             text,
  thumbnail_url         text,
  duration_sec          int,
  width                 int,
  height                int,
  tournament_year       int references tournaments(year),
  match_id              uuid references matches(id),
  player_id             uuid references players(id),
  venue_id              uuid references venues(id),
  title_i18n            jsonb,
  description_i18n      jsonb,
  credit                text,
  license               text,                     -- 'CC-BY', 'CC0', 'public-domain', 'fair-use'
  attribution           text,
  featured              boolean default false,
  created_at            timestamptz default now()
);
create index if not exists media_year_idx on media(tournament_year);
create index if not exists media_match_idx on media(match_id);
create index if not exists media_player_idx on media(player_id);
create index if not exists media_source_idx on media(source, source_id);

-- Add hero_media_id foreign key now that media table exists
alter table articles
  add constraint articles_hero_media_fk
  foreign key (hero_media_id) references media(id)
  on delete set null
  deferrable initially deferred;

-- -------------------------------------------------------------------
-- Row-Level Security — public-read, writes restricted to service role
-- -------------------------------------------------------------------
alter table tournaments         enable row level security;
alter table teams               enable row level security;
alter table venues              enable row level security;
alter table players             enable row level security;
alter table squads              enable row level security;
alter table referees            enable row level security;
alter table matches             enable row level security;
alter table match_lineups       enable row level security;
alter table match_events        enable row level security;
alter table match_shot_events   enable row level security;
alter table player_match_stats  enable row level security;
alter table articles            enable row level security;
alter table media               enable row level security;

do $$
declare t text;
begin
  for t in
    select unnest(array[
      'tournaments','teams','venues','players','squads','referees',
      'matches','match_lineups','match_events','match_shot_events',
      'player_match_stats','articles','media'
    ])
  loop
    execute format('drop policy if exists "public_read" on %I;', t);
    execute format('create policy "public_read" on %I for select using (true);', t);
  end loop;
end$$;

-- -------------------------------------------------------------------
-- updated_at triggers
-- -------------------------------------------------------------------
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

do $$
declare t text;
begin
  for t in select unnest(array['tournaments','players','matches','articles']) loop
    execute format('drop trigger if exists trg_%I_touch on %I;', t, t);
    execute format('create trigger trg_%I_touch before update on %I
                    for each row execute function touch_updated_at();', t, t);
  end loop;
end$$;

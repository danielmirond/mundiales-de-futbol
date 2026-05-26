-- =====================================================================
-- Porra Mundial 2026 — schema
-- Auth-backed prediction game. Uses Supabase auth.users.
-- =====================================================================

-- -------------------------------------------------------------------
-- Public profile per registered user
-- -------------------------------------------------------------------
create table if not exists porra_users (
  user_id        uuid        primary key references auth.users(id) on delete cascade,
  display_name   text        not null,
  slug           text        not null unique,
  avatar_url     text,
  country_code   text,
  total_points   int         not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists porra_users_points_idx on porra_users (total_points desc);

-- -------------------------------------------------------------------
-- Special predictions: campeón, subcampeón, tercero, bota de oro
-- One row per user; locks on tournament start (2026-06-11 16:00 UTC).
-- -------------------------------------------------------------------
create table if not exists porra_special_predictions (
  user_id              uuid        primary key references porra_users(user_id) on delete cascade,
  champion_code        text        references teams(code),
  runner_up_code       text        references teams(code),
  third_code           text        references teams(code),
  top_scorer_name      text,
  top_scorer_team_code text        references teams(code),
  points_awarded       int         not null default 0,
  locked               boolean     not null default false,
  updated_at           timestamptz not null default now()
);

-- -------------------------------------------------------------------
-- Per-match predictions
-- Locks 1h before kickoff via trigger / cron.
-- -------------------------------------------------------------------
create table if not exists porra_match_predictions (
  user_id        uuid        not null references porra_users(user_id) on delete cascade,
  match_id       uuid        not null references matches(id) on delete cascade,
  home_score     int         not null check (home_score >= 0 and home_score <= 30),
  away_score     int         not null check (away_score >= 0 and away_score <= 30),
  -- For knockouts only: who advances if it goes to extra time / penalties
  advance_code   text        references teams(code),
  points_awarded int         not null default 0,
  locked         boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (user_id, match_id)
);

create index if not exists porra_match_pred_match_idx on porra_match_predictions (match_id);

-- -------------------------------------------------------------------
-- Private leagues
-- -------------------------------------------------------------------
create table if not exists porra_leagues (
  id          uuid        primary key default gen_random_uuid(),
  code        text        not null unique,                -- 6-char shareable code
  name        text        not null,
  owner_id    uuid        not null references porra_users(user_id) on delete cascade,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists porra_league_members (
  league_id  uuid        not null references porra_leagues(id) on delete cascade,
  user_id    uuid        not null references porra_users(user_id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (league_id, user_id)
);

create index if not exists porra_league_members_user_idx on porra_league_members (user_id);

-- -------------------------------------------------------------------
-- RLS
-- -------------------------------------------------------------------
alter table porra_users enable row level security;
alter table porra_special_predictions enable row level security;
alter table porra_match_predictions enable row level security;
alter table porra_leagues enable row level security;
alter table porra_league_members enable row level security;

-- Profiles: anyone can read; only owner can write.
create policy porra_users_read on porra_users
  for select using (true);
create policy porra_users_insert_self on porra_users
  for insert with check (auth.uid() = user_id);
create policy porra_users_update_self on porra_users
  for update using (auth.uid() = user_id);

-- Special predictions: anyone reads (rankings public); only self writes when not locked.
create policy porra_special_read on porra_special_predictions
  for select using (true);
create policy porra_special_upsert_self on porra_special_predictions
  for insert with check (auth.uid() = user_id and locked = false);
create policy porra_special_update_self on porra_special_predictions
  for update using (auth.uid() = user_id and locked = false);

-- Match predictions: public read (leaderboard transparency); self-write when not locked.
create policy porra_match_pred_read on porra_match_predictions
  for select using (true);
create policy porra_match_pred_insert_self on porra_match_predictions
  for insert with check (auth.uid() = user_id and locked = false);
create policy porra_match_pred_update_self on porra_match_predictions
  for update using (auth.uid() = user_id and locked = false);

-- Leagues: members and owner read; owner creates and edits.
create policy porra_leagues_read_member on porra_leagues
  for select using (
    auth.uid() = owner_id or
    exists (select 1 from porra_league_members m where m.league_id = id and m.user_id = auth.uid())
  );
create policy porra_leagues_insert_owner on porra_leagues
  for insert with check (auth.uid() = owner_id);
create policy porra_leagues_update_owner on porra_leagues
  for update using (auth.uid() = owner_id);

-- League members: members of the league can see each other; user can join (insert self).
create policy porra_league_members_read on porra_league_members
  for select using (
    exists (
      select 1 from porra_league_members m2
      where m2.league_id = league_id and m2.user_id = auth.uid()
    )
  );
create policy porra_league_members_join on porra_league_members
  for insert with check (auth.uid() = user_id);
create policy porra_league_members_leave on porra_league_members
  for delete using (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- Helpers
-- -------------------------------------------------------------------

-- Generate a short league code (6 alphanum chars, no ambiguous I/O/0/1).
create or replace function porra_generate_league_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  exists_already boolean;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    select exists(select 1 from porra_leagues where porra_leagues.code = code) into exists_already;
    exit when not exists_already;
  end loop;
  return code;
end;
$$;

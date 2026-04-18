# Supabase — Mundiales de Fútbol

Database schema, migrations and seed data for the project.

## Apply the initial schema

You don't need the Supabase CLI — the quickest path is the SQL editor:

1. Open the Supabase dashboard → SQL editor.
2. Paste the contents of `migrations/20260418000000_initial_schema.sql`.
3. Run.

For reproducibility, you can also install the CLI and run `supabase db push` against a linked project.

## Schema at a glance

| Table | Purpose |
| --- | --- |
| `tournaments` | 22 editions 1930–2026, i18n taglines, winners, palette. |
| `teams` | National teams incl. historical ones (FRG, URS, YUG…). |
| `venues` | Stadiums with coords and capacity history. |
| `players` | Player profiles, nationality, birth/death dates. |
| `squads` | Rosters per tournament. |
| `referees` | Match officials. |
| `matches` | All World Cup matches, incl. live metadata for 2026. |
| `match_lineups` | Starting XI + subs + minutes. |
| `match_events` | Goals, cards, subs, VAR. |
| `match_shot_events` | StatsBomb-style events with xG + coords. |
| `player_match_stats` | Denormalised stats for fast player pages. |
| `articles` | Editorial: chronicles, features, profiles (i18n body). |
| `media` | Video/image/audio assets — archive.org, YouTube, Wikimedia. |

## Ingestion workflow (to be built)

1. **Wikidata SPARQL** → backbone of tournaments, venues, referees.
2. **Wikipedia scraping** → matches, squads, top scorers.
3. **StatsBomb open data** → match_shot_events and richer lineups.
4. **archive.org / YouTube** → curated media per tournament.
5. **FIFA / API-Football** → live 2026 match data.

## Row-Level Security

All tables are read-only for anonymous users. Writes only work with the service role key (ingest workers + admin tools).

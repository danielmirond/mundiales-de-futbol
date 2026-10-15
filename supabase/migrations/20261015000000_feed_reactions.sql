-- =====================================================================
-- Directo vertical: reacciones con frase predefinida (sin texto libre).
-- Una reacción por tarjeta y visitante (voter = hash diario de IP + UA,
-- calculado en el servidor; no se guarda la IP). Escritura solo desde el
-- API con la service role; lectura pública de los agregados.
-- =====================================================================
create table if not exists feed_reactions (
  id          bigint generated always as identity primary key,
  card_id     text        not null check (char_length(card_id) between 4 and 40),
  reaction    text        not null check (reaction ~ '^[a-z0-9_]{2,24}$'),
  voter       text        not null check (char_length(voter) = 32),
  created_at  timestamptz not null default now(),
  unique (card_id, voter)
);

create index if not exists feed_reactions_card_idx on feed_reactions (card_id, created_at desc);

alter table feed_reactions enable row level security;
-- Sin políticas para anon/authenticated: nadie lee ni escribe la tabla en
-- bruto con la clave pública. El API usa la service role (salta RLS).

-- Agregados por tarjeta y reacción (lo único que se expone).
create or replace view feed_reaction_counts as
  select card_id, reaction, count(*)::int as n, max(created_at) as last_at
  from feed_reactions
  group by card_id, reaction;

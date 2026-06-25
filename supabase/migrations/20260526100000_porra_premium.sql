-- =====================================================================
-- Porra Mundial 2026 — Premium fields
-- Freemium model: free registration with initial prediction (champion +
-- top 4 + Bota de Oro). Premium €2.99 unlocks per-match predictions
-- and unlimited private leagues. Lifetime access for World Cup 2026.
-- =====================================================================

alter table porra_users
  add column if not exists has_premium       boolean     not null default false,
  add column if not exists stripe_customer_id text        unique,
  add column if not exists stripe_session_id  text        unique,
  add column if not exists purchased_at       timestamptz,
  add column if not exists purchase_amount    int,
  add column if not exists purchase_currency  text;

create index if not exists porra_users_premium_idx on porra_users (has_premium) where has_premium = true;

-- Service-role grant: webhook needs to update premium status without RLS
-- restrictions. Keep RLS for client reads (existing policies allow public
-- select on porra_users so leaderboard works fine).

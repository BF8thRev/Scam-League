-- ============================================================
-- SCAM LEAGUE — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Trades table
-- Each row is one logged trade between two owners.
-- side_a_assets / side_b_assets are JSONB arrays of:
--   { name, playerId, cap, position }
-- grade_snapshot is JSONB frozen at log time:
--   { sideAPts, sideBPts, sideASurplus, sideBSurplus,
--     sideADyn3yr, sideBDyn3yr, verdict, surplusMargin }

create table if not exists trades (
  id            uuid primary key default gen_random_uuid(),
  trade_date    date not null default current_date,
  note          text,
  side_a_owner  text not null,
  side_b_owner  text not null,
  side_a_assets jsonb not null default '[]',
  side_b_assets jsonb not null default '[]',
  grade_snapshot jsonb not null default '{}',
  retro_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trades_updated_at
  before update on trades
  for each row execute procedure set_updated_at();

-- Row-level security: enable but allow full anon access for personal use.
-- Tighten this with auth.uid() checks if you add Supabase Auth later.
alter table trades enable row level security;

create policy "anon_all" on trades
  for all
  using (true)
  with check (true);

-- Index for common query patterns
create index if not exists trades_side_a_owner_idx on trades (side_a_owner);
create index if not exists trades_side_b_owner_idx on trades (side_b_owner);
create index if not exists trades_trade_date_idx on trades (trade_date desc);

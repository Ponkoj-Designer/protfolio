-- Run this once in Supabase Dashboard -> SQL Editor.
-- The API stores the whole portfolio dataset in a single row.
create table if not exists public.portfolio_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

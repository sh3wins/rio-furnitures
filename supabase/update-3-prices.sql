-- =========================================================
-- RIO — update 3: staff set prices from the admin dashboard
-- (Website → Prices). Paste into Supabase → SQL Editor → Run (once).
-- Safe to run again. Needs schema.sql to have been run first.
-- =========================================================

-- One row per piece that has a price. No row = no price shown.
create table if not exists public.site_prices (
  product_id text primary key check (product_id ~ '^[a-z0-9-]{1,80}$'),  -- the piece's id from js/data.js, or its link name if posted from the dashboard
  price      integer not null check (price between 1 and 100000000),     -- Kenya shillings
  updated_at timestamptz not null default now()
);

alter table public.site_prices enable row level security;

-- Visitors can read prices; only staff can set, change or remove them.
drop policy if exists "public reads prices" on public.site_prices;
create policy "public reads prices" on public.site_prices
  for select to anon, authenticated using (true);
drop policy if exists "staff manage prices" on public.site_prices;
create policy "staff manage prices" on public.site_prices
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

grant select on public.site_prices to anon, authenticated;
grant insert, update, delete on public.site_prices to authenticated;

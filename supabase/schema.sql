```sql
-- =========================================================
-- RIO FURNITURES — database for the admin dashboard
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Safe to run again (it only creates what's missing).
-- =========================================================

-- ---------- Staff (who can open the admin) ----------
create table if not exists public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '',
  role       text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- Is the logged-in person on the staff list?
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.staff where user_id = auth.uid()); $$;

-- ---------- Quote requests (from Start a Project / My Project) ----------
create table if not exists public.quotes (
  id            uuid primary key default gen_random_uuid(),
  ref           text unique not null,
  created_at    timestamptz not null default now(),
  source        text not null default 'project' check (source in ('project', 'start', 'custom')),
  project_name  text check (char_length(project_name) <= 200),
  space         text check (char_length(space) <= 40),
  needs         text[] default '{}',
  qty_range     text check (char_length(qty_range) <= 20),
  items         jsonb not null default '[]'::jsonb,   -- [{ name, code, qty, finishes: { black: 40, … } }]
  total_pieces  int not null default 0 check (total_pieces between 0 and 1000000),
  notes         text check (char_length(notes) <= 5000),
  files         text[] default '{}',                  -- file names the customer said they'd send
  timeline      text check (char_length(timeline) <= 80),
  contact_name  text check (char_length(contact_name) <= 120),
  contact_phone text check (char_length(contact_phone) <= 40),
  contact_email text check (char_length(contact_email) <= 160),
  location      text check (char_length(location) <= 160),
  status        text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  internal_note text default ''
);

-- ---------- Orders (drive the public tracking page) ----------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,             -- e.g. RIO-7K3Q, given to the customer
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  quote_id       uuid references public.quotes (id) on delete set null,
  project        text not null default '',          -- PUBLIC label shown on tracking (no personal info)
  space          text default '',
  stage          int not null default 0 check (stage between 0 and 9),
  expected       text default '',                   -- PUBLIC, e.g. "Delivery planned for late October"
  items          jsonb not null default '[]'::jsonb,-- PUBLIC [{ name, qty, finishes }]
  updates        jsonb not null default '[]'::jsonb,-- PUBLIC [{ date, text }] newest first
  customer_name  text default '',                   -- PRIVATE (staff only)
  customer_phone text default '',                   -- PRIVATE
  customer_email text default '',                   -- PRIVATE
  private_note   text default '',                   -- PRIVATE
  archived       boolean not null default false
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ---------- Security: Row Level Security ----------
alter table public.staff  enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;

-- staff: staff can see the staff list
drop policy if exists "staff read" on public.staff;
create policy "staff read" on public.staff for select using (public.is_staff());

-- quotes: ANYONE can send a quote request (the public website);
--         only staff can read or change them.
drop policy if exists "public can send quotes" on public.quotes;
create policy "public can send quotes" on public.quotes for insert to anon, authenticated
  with check (status = 'new' and coalesce(internal_note, '') = '');
drop policy if exists "staff read quotes" on public.quotes;
create policy "staff read quotes" on public.quotes for select using (public.is_staff());
drop policy if exists "staff update quotes" on public.quotes;
create policy "staff update quotes" on public.quotes for update using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff delete quotes" on public.quotes;
create policy "staff delete quotes" on public.quotes for delete using (public.is_staff());

-- orders: only staff can read/write the table directly
drop policy if exists "staff all orders" on public.orders;
create policy "staff all orders" on public.orders for all using (public.is_staff()) with check (public.is_staff());

-- Public tracking: returns ONLY the safe, public fields for one order code.
create or replace function public.track_order(p_code text)
returns table (code text, project text, space text, stage int, expected text, items jsonb, updates jsonb, updated_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select o.code, o.project, o.space, o.stage, o.expected, o.items, o.updates, o.updated_at
  from public.orders o
  where upper(o.code) = upper(trim(p_code)) and o.archived = false
  limit 1;
$$;
revoke all on function public.track_order(text) from public;
grant execute on function public.track_order(text) to anon, authenticated;

-- Let the website insert quotes without being able to read them back
grant insert on public.quotes to anon;
grant select, insert, update, delete on public.quotes, public.orders to authenticated;
grant select on public.staff to authenticated;

```
-- =========================================================
-- RIO — update 2: staff can post projects and furniture
-- (with photos) from the admin dashboard.
-- Paste into Supabase → SQL Editor → Run (once). Safe to run again.
-- Needs schema.sql to have been run first (it uses is_staff()).
-- =========================================================

-- 1. A PUBLIC storage bucket for website photos (8 MB per photo, images only).
--    Anyone can view a photo by its link; only staff can add or remove photos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-photos', 'site-photos', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "rio staff add site photos" on storage.objects;
create policy "rio staff add site photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-photos' and public.is_staff());
drop policy if exists "rio staff see site photos" on storage.objects;
create policy "rio staff see site photos" on storage.objects
  for select to authenticated using (bucket_id = 'site-photos' and public.is_staff());
drop policy if exists "rio staff change site photos" on storage.objects;
create policy "rio staff change site photos" on storage.objects
  for update to authenticated using (bucket_id = 'site-photos' and public.is_staff())
  with check (bucket_id = 'site-photos' and public.is_staff());
drop policy if exists "rio staff remove site photos" on storage.objects;
create policy "rio staff remove site photos" on storage.objects
  for delete to authenticated using (bucket_id = 'site-photos' and public.is_staff());

-- 2. Projects posted from the admin (shown in "In real spaces")
create table if not exists public.site_projects (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title      text not null check (char_length(title) between 1 and 160),
  space      text not null default 'other' check (char_length(space) <= 40),
  story      text not null default '' check (char_length(story) <= 1200),
  photos     text[] not null default '{}',     -- paths inside the site-photos bucket; first one is the cover
  published  boolean not null default true
);

-- 3. Furniture posted from the admin (shown on the Furniture page)
create table if not exists public.site_products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null check (slug ~ '^[a-z0-9-]{3,80}$'),  -- used in the page link
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  type        text not null default '' check (char_length(type) <= 80),
  category    text not null default 'seating' check (char_length(category) <= 40),
  spaces      text[] not null default '{}',
  description text not null default '' check (char_length(description) <= 1200),
  finishes    text[] not null default '{}',    -- colour ids from js/data.js (black, white, …)
  photos      text[] not null default '{}',    -- first one is the main photo
  published   boolean not null default true
);

-- 4. Who can do what:
--    visitors can read what is published; staff can read and change everything.
alter table public.site_projects enable row level security;
alter table public.site_products enable row level security;

drop policy if exists "public reads published projects" on public.site_projects;
create policy "public reads published projects" on public.site_projects
  for select to anon, authenticated using (published or public.is_staff());
drop policy if exists "staff manage projects" on public.site_projects;
create policy "staff manage projects" on public.site_projects
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public reads published products" on public.site_products;
create policy "public reads published products" on public.site_products
  for select to anon, authenticated using (published or public.is_staff());
drop policy if exists "staff manage products" on public.site_products;
create policy "staff manage products" on public.site_products
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

grant select on public.site_projects, public.site_products to anon, authenticated;
grant insert, update, delete on public.site_projects, public.site_products to authenticated;

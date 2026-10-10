-- =========================================================
-- RIO — update 4: customer reviews, with photos
-- Customers send a review from the website (reviews.html).
-- It stays hidden until staff press "Show on website" in the
-- dashboard (Website → Reviews).
-- Paste into Supabase → SQL Editor → Run (once). Safe to run again.
-- Needs schema.sql to have been run first (it uses is_staff()).
-- =========================================================

-- 1. A PUBLIC storage bucket for review photos (5 MB per photo, images only).
--    Anyone can add a photo with their review; only staff can remove one.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "rio public can add review photos" on storage.objects;
create policy "rio public can add review photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'review-photos');
drop policy if exists "rio staff see review photos" on storage.objects;
create policy "rio staff see review photos" on storage.objects
  for select to authenticated using (bucket_id = 'review-photos' and public.is_staff());
drop policy if exists "rio staff remove review photos" on storage.objects;
create policy "rio staff remove review photos" on storage.objects
  for delete to authenticated using (bucket_id = 'review-photos' and public.is_staff());

-- 2. The reviews
create table if not exists public.site_reviews (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 80),
  context    text not null default '' check (char_length(context) <= 120),   -- what RIO made for them
  rating     integer not null check (rating between 1 and 5),
  body       text not null check (char_length(body) between 1 and 1200),
  photos     text[] not null default '{}' check (coalesce(array_length(photos, 1), 0) <= 3),  -- paths in the review-photos bucket
  published  boolean not null default false                                   -- false = waiting for staff
);

alter table public.site_reviews enable row level security;

-- Anyone can SEND a review, but only as "waiting". Visitors only see approved ones.
drop policy if exists "public can send reviews" on public.site_reviews;
create policy "public can send reviews" on public.site_reviews
  for insert to anon, authenticated with check (published = false);
drop policy if exists "public reads approved reviews" on public.site_reviews;
create policy "public reads approved reviews" on public.site_reviews
  for select to anon, authenticated using (published or public.is_staff());
drop policy if exists "staff manage reviews" on public.site_reviews;
create policy "staff manage reviews" on public.site_reviews
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

grant select, insert on public.site_reviews to anon, authenticated;
grant update, delete on public.site_reviews to authenticated;

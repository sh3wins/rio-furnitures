-- =========================================================
-- RIO — update 1: real file uploads + tracking by quote reference
-- Paste into Supabase → SQL Editor → Run (once). Safe to run again.
-- =========================================================

-- 1. A private storage bucket for customer files (20 MB per file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('quote-files', 'quote-files', false, 20971520)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;

-- Anyone sending a quote from the website may UPLOAD files (they can't read or list them)
drop policy if exists "rio public can upload quote files" on storage.objects;
create policy "rio public can upload quote files" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'quote-files');

-- Only RIO staff can open / download / delete them
drop policy if exists "rio staff read quote files" on storage.objects;
create policy "rio staff read quote files" on storage.objects
  for select to authenticated using (bucket_id = 'quote-files' and public.is_staff());
drop policy if exists "rio staff delete quote files" on storage.objects;
create policy "rio staff delete quote files" on storage.objects
  for delete to authenticated using (bucket_id = 'quote-files' and public.is_staff());

-- 2. Track a quote by its reference (Q-XXXXX). Returns only safe, public fields.
create or replace function public.track_quote(p_ref text)
returns table (ref text, status text, space text, project_name text, total_pieces int, qty_range text, created_at timestamptz, order_code text)
language sql stable security definer set search_path = public
as $$
  select q.ref, q.status, q.space, q.project_name, q.total_pieces, q.qty_range, q.created_at,
         (select o.code from public.orders o where o.quote_id = q.id and o.archived = false order by o.created_at desc limit 1)
  from public.quotes q
  where upper(q.ref) = upper(trim(p_ref))
  limit 1;
$$;
revoke all on function public.track_quote(text) from public;
grant execute on function public.track_quote(text) to anon, authenticated;

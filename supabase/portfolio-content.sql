-- Apply after portfolio-journal.sql, using the existing owner allowlist.
begin;
create table public.portfolio_content (
  id integer primary key check (id = 1),
  data jsonb not null check (
    jsonb_typeof(data) = 'object' and
    data ?& array['photo','cv','projects'] and
    jsonb_typeof(data->'photo') = 'string' and
    jsonb_typeof(data->'cv') = 'string' and
    jsonb_typeof(data->'projects') = 'array' and
    jsonb_array_length(data->'projects') <= 40 and
    octet_length(data::text) <= 65536
  )
);
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;
create policy portfolio_content_read on public.portfolio_content for select to anon, authenticated using (true);
create policy portfolio_content_owner on public.portfolio_content for all to authenticated
  using ((select public.portfolio_journal_is_owner())) with check ((select public.portfolio_journal_is_owner()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-assets', 'portfolio-assets', true, 10485760,
  array['image/png','image/jpeg','image/webp','application/pdf']);
create policy portfolio_assets_owner on storage.objects for all to authenticated
using (bucket_id = 'portfolio-assets' and (select public.portfolio_journal_is_owner()))
with check (bucket_id = 'portfolio-assets' and (select public.portfolio_journal_is_owner()));
-- Restrictive guards protect this bucket even if other applications have broad policies.
create policy portfolio_assets_insert_guard on storage.objects as restrictive for insert to authenticated
with check (bucket_id <> 'portfolio-assets' or (select public.portfolio_journal_is_owner()));
create policy portfolio_assets_update_guard on storage.objects as restrictive for update to authenticated
using (bucket_id <> 'portfolio-assets' or (select public.portfolio_journal_is_owner()))
with check (bucket_id <> 'portfolio-assets' or (select public.portfolio_journal_is_owner()));
create policy portfolio_assets_delete_guard on storage.objects as restrictive for delete to authenticated
using (bucket_id <> 'portfolio-assets' or (select public.portfolio_journal_is_owner()));
create policy portfolio_assets_anon_insert_guard on storage.objects as restrictive for insert to anon
with check (bucket_id <> 'portfolio-assets');
create policy portfolio_assets_anon_update_guard on storage.objects as restrictive for update to anon
using (bucket_id <> 'portfolio-assets') with check (bucket_id <> 'portfolio-assets');
create policy portfolio_assets_anon_delete_guard on storage.objects as restrictive for delete to anon
using (bucket_id <> 'portfolio-assets');
commit;

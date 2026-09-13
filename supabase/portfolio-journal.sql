-- Run in the 1t1g SQL editor. Creates portfolio-only objects, without changing
-- existing application tables, Auth settings or existing storage policies.
-- Transaction rolls back if a name already exists: inspect before rerunning.
begin;

create table public.portfolio_journal_owners (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_journal_owners enable row level security;
revoke all on public.portfolio_journal_owners from anon, authenticated;
grant select on public.portfolio_journal_owners to authenticated;
create policy portfolio_owner_self on public.portfolio_journal_owners
  for select to authenticated using (user_id = (select auth.uid()));

create function public.portfolio_journal_is_owner() returns boolean
language sql stable security invoker set search_path = ''
as $$ select exists(select 1 from public.portfolio_journal_owners where user_id = (select auth.uid())); $$;
revoke all on function public.portfolio_journal_is_owner() from public;
grant execute on function public.portfolio_journal_is_owner() to authenticated;

create table public.portfolio_journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 140),
  category text not null check (length(category) between 1 and 60),
  text text not null default '' check (length(text) <= 20000),
  url text not null default '' check (url = '' or (length(url) <= 2000 and url ~ '^https?://')),
  image text not null default '' check (image = '' or image = '/assets/journal-ai-lake.png' or image ~ '^portfolio/[a-f0-9-]{36}\.(png|jpg|webp|mp4|webm)$'),
  visibility text not null default 'draft' check (visibility in ('public','private','draft')),
  sample boolean not null default false,
  updated timestamptz not null default now()
);
alter table public.portfolio_journal_posts enable row level security;
revoke all on public.portfolio_journal_posts from anon, authenticated;
grant select on public.portfolio_journal_posts to anon, authenticated;
grant insert, update, delete on public.portfolio_journal_posts to authenticated;
create index portfolio_journal_public on public.portfolio_journal_posts(visibility, updated desc);
create policy portfolio_read_public on public.portfolio_journal_posts for select to anon, authenticated using (visibility = 'public');
create policy portfolio_owner_manage on public.portfolio_journal_posts for all to authenticated
  using ((select public.portfolio_journal_is_owner())) with check ((select public.portfolio_journal_is_owner()));

create function public.portfolio_journal_touch() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated = now(); return new; end; $$;
create trigger portfolio_journal_updated before update on public.portfolio_journal_posts
  for each row execute function public.portfolio_journal_touch();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-journal-media', 'portfolio-journal-media', false, 20971520,
  array['image/png','image/jpeg','image/webp','video/mp4','video/webm']);

-- A restrictive guard also prevents any broad pre-existing 1t1g storage
-- policies from accidentally granting access to this new bucket.
-- For all OTHER buckets this guard returns true and has no effect.
create policy portfolio_bucket_guard_anon on storage.objects as restrictive
for all to anon
using (bucket_id <> 'portfolio-journal-media' or exists (
  select 1 from public.portfolio_journal_posts p where p.visibility='public' and p.image=name
)) with check (bucket_id <> 'portfolio-journal-media');

create policy portfolio_bucket_guard_authenticated on storage.objects as restrictive
for all to authenticated
using (bucket_id <> 'portfolio-journal-media' or (select public.portfolio_journal_is_owner()) or exists (
  select 1 from public.portfolio_journal_posts p where p.visibility='public' and p.image=name
)) with check (bucket_id <> 'portfolio-journal-media' or (select public.portfolio_journal_is_owner()));

-- Public visibility permits reads only, never uploads or deletion by visitors.
create policy portfolio_media_read on storage.objects for select to anon, authenticated
using (bucket_id='portfolio-journal-media' and exists (
  select 1 from public.portfolio_journal_posts p where p.visibility='public' and p.image=name
));
create policy portfolio_media_owner on storage.objects for all to authenticated
using (bucket_id='portfolio-journal-media' and (select public.portfolio_journal_is_owner()))
with check (bucket_id='portfolio-journal-media' and (select public.portfolio_journal_is_owner()));

-- Extra restrictive delete guards: broad policies on the shared project must
-- not allow someone to delete a publicly readable portfolio attachment.
create policy portfolio_media_delete_guard on storage.objects as restrictive for delete to authenticated
using (bucket_id <> 'portfolio-journal-media' or (select public.portfolio_journal_is_owner()));
create policy portfolio_media_anon_delete_guard on storage.objects as restrictive for delete to anon
using (bucket_id <> 'portfolio-journal-media');

commit;

-- NEXT: In Authentication > Users, copy your OWNER user UUID (not project ID).
-- If you already have a personal 1t1g login, that Auth user can be used.
-- Otherwise create a user manually; do not change global signup settings.
-- Run separately, replacing the placeholder:
-- insert into public.portfolio_journal_owners(user_id) values ('YOUR-OWNER-USER-UUID');

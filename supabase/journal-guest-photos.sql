-- Run once AFTER journal-submissions.sql. Preserves current posts/submissions.
begin;
alter table public.portfolio_journal_submissions add column category text not null default 'Community'
 check(category in ('Books','Movies','Notes','Photos & videos','Vlogs','Quotes','News','Community'));
alter table public.portfolio_journal_submissions add column image text not null default ''
 check(image='' or image ~ '^guest/[a-f0-9-]{36}\.(png|jpg|webp)$');
alter table public.portfolio_journal_posts drop constraint portfolio_journal_posts_image_check;
alter table public.portfolio_journal_posts add constraint portfolio_journal_posts_image_check
 check(image='' or image='/assets/journal-ai-lake.png' or image ~ '^(portfolio|guest)/[a-f0-9-]{36}\.(png|jpg|webp|mp4|webm)$');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('portfolio-guest-media','portfolio-guest-media',false,1048576,array['image/png','image/jpeg','image/webp']);

-- Serialize the shared guest upload quota. Scope is this bucket only.
create function public.portfolio_guest_upload_allowed(object_name text) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 if object_name !~ '^guest/[a-f0-9-]{36}\.(png|jpg|webp)$' then return false; end if;
 perform pg_catalog.pg_advisory_xact_lock(19282762);
 return (select count(*) from storage.objects where bucket_id='portfolio-guest-media')<200
 and (select count(*) from storage.objects where bucket_id='portfolio-guest-media' and created_at>now()-interval '1 day')<50;
end; $$;
revoke all on function public.portfolio_guest_upload_allowed(text) from public;
grant execute on function public.portfolio_guest_upload_allowed(text) to anon;

create policy portfolio_guest_anon_guard on storage.objects as restrictive for all to anon
 using(bucket_id<>'portfolio-guest-media' or exists(select 1 from public.portfolio_journal_posts p where p.visibility='public' and p.image=name))
 with check(bucket_id<>'portfolio-guest-media' or public.portfolio_guest_upload_allowed(name));
create policy portfolio_guest_auth_guard on storage.objects as restrictive for all to authenticated
 using(bucket_id<>'portfolio-guest-media' or public.portfolio_journal_is_owner() or exists(select 1 from public.portfolio_journal_posts p where p.visibility='public' and p.image=name))
 with check(bucket_id<>'portfolio-guest-media' or public.portfolio_journal_is_owner());
-- Visitors may create a new object, but never replace/delete an existing one.
create policy portfolio_guest_anon_update_guard on storage.objects as restrictive for update to anon
 using(bucket_id<>'portfolio-guest-media') with check(bucket_id<>'portfolio-guest-media');
create policy portfolio_guest_anon_delete_guard on storage.objects as restrictive for delete to anon
 using(bucket_id<>'portfolio-guest-media');
create policy portfolio_guest_auth_delete_guard on storage.objects as restrictive for delete to authenticated
 using(bucket_id<>'portfolio-guest-media' or public.portfolio_journal_is_owner());
create policy portfolio_guest_upload on storage.objects for insert to anon
 with check(bucket_id='portfolio-guest-media' and public.portfolio_guest_upload_allowed(name));
create policy portfolio_guest_public_read on storage.objects for select to anon,authenticated
 using(bucket_id='portfolio-guest-media' and exists(select 1 from public.portfolio_journal_posts p where p.visibility='public' and p.image=name));
create policy portfolio_guest_owner on storage.objects for all to authenticated
 using(bucket_id='portfolio-guest-media' and public.portfolio_journal_is_owner())
 with check(bucket_id='portfolio-guest-media' and public.portfolio_journal_is_owner());

create function public.portfolio_submit_journal_v2(p_name text,p_title text,p_text text,p_visitor text,p_category text,p_image text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_category is null or p_category not in ('Books','Movies','Notes','Photos & videos','Vlogs','Quotes','News','Community')
 or p_image is null or (p_image<>'' and p_image !~ '^guest/[a-f0-9-]{36}\.(png|jpg|webp)$') then raise exception 'Invalid category or photo.';end if;
 if p_image<>'' and not exists(select 1 from storage.objects where bucket_id='portfolio-guest-media' and name=p_image) then raise exception 'Photo upload not found.';end if;
 -- Reuse the original validation, duplicate checks and submission quotas.
 perform public.portfolio_submit_journal(p_name,p_title,p_text,p_visitor);
 update public.portfolio_journal_submissions set category=p_category,image=p_image
 where id=(select id from public.portfolio_journal_submissions where visitor_hash=md5(p_visitor) and text=trim(p_text) order by created_at desc limit 1);
end; $$;
revoke all on function public.portfolio_submit_journal_v2(text,text,text,text,text,text) from public;
grant execute on function public.portfolio_submit_journal_v2(text,text,text,text,text,text) to anon,authenticated;

create or replace function public.portfolio_review_journal(p_id uuid,p_approve boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare submission public.portfolio_journal_submissions; published uuid;
begin
 if not exists(select 1 from public.portfolio_journal_owners where user_id=(select auth.uid())) then raise exception 'Owner access required.';end if;
 select * into submission from public.portfolio_journal_submissions where id=p_id for update;
 if not found then raise exception 'Submission not found.';end if;
 if submission.status<>'pending' then raise exception 'Already reviewed.';end if;
 if p_approve is null then raise exception 'Choose approve or reject.';end if;
 if p_approve then
 insert into public.portfolio_journal_posts(title,category,text,author_name,image,visibility)
 values(submission.title,submission.category,submission.text,submission.author_name,submission.image,'public') returning id into published;
 end if;
 update public.portfolio_journal_submissions set status=case when p_approve then 'approved' else 'rejected' end,post_id=published where id=p_id;
 return published;
end; $$;
commit;

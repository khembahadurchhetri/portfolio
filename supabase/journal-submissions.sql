-- Run ONCE after portfolio-journal.sql. Existing entries are preserved.
begin;
alter table public.portfolio_journal_posts add column author_name text not null default '' check(length(author_name)<=80);
create table public.portfolio_journal_submissions (
 id uuid primary key default gen_random_uuid(),
 author_name text not null check(length(author_name) between 1 and 80),
 title text not null check(length(title) between 1 and 140),
 text text not null check(length(text) between 10 and 5000),
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 visitor_hash text not null,
 created_at timestamptz not null default now(),
 post_id uuid references public.portfolio_journal_posts(id) on delete set null
);
alter table public.portfolio_journal_submissions enable row level security;
revoke all on public.portfolio_journal_submissions from anon,authenticated;
grant select on public.portfolio_journal_submissions to authenticated;
create policy portfolio_submission_owner_read on public.portfolio_journal_submissions for select to authenticated
 using ((select public.portfolio_journal_is_owner()));

create function public.portfolio_submit_journal(p_name text,p_title text,p_text text,p_visitor text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if length(trim(p_name)) not between 1 and 80 or length(trim(p_title)) not between 1 and 140
 or length(trim(p_text)) not between 10 and 5000 or length(p_visitor) not between 16 and 128
 or p_name is null or p_title is null or p_text is null or p_visitor is null then
 raise exception 'Please check the name, title and journal length.'; end if;
 -- Serialize quota checks so simultaneous requests cannot bypass the cap.
 perform pg_catalog.pg_advisory_xact_lock(19282761);
 if (select count(*) from public.portfolio_journal_submissions where created_at>now()-interval '1 day')>=100
 or (select count(*) from public.portfolio_journal_submissions where visitor_hash=md5(p_visitor) and created_at>now()-interval '1 day')>=3
 then raise exception 'Submission limit reached. Please try another day.'; end if;
 if exists(select 1 from public.portfolio_journal_submissions where text=trim(p_text) and created_at>now()-interval '1 day')
 then raise exception 'This journal has already been submitted.'; end if;
 insert into public.portfolio_journal_submissions(author_name,title,text,visitor_hash)
 values(trim(p_name),trim(p_title),trim(p_text),md5(p_visitor));
end; $$;
revoke all on function public.portfolio_submit_journal(text,text,text,text) from public;
grant execute on function public.portfolio_submit_journal(text,text,text,text) to anon,authenticated;

create function public.portfolio_review_journal(p_id uuid,p_approve boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare submission public.portfolio_journal_submissions; published uuid;
begin
 if not exists(select 1 from public.portfolio_journal_owners where user_id=(select auth.uid()))
 then raise exception 'Owner access required.'; end if;
 select * into submission from public.portfolio_journal_submissions where id=p_id for update;
 if not found then raise exception 'Submission not found.'; end if;
 if submission.status<>'pending' then raise exception 'This submission has already been reviewed.'; end if;
 if p_approve is null then raise exception 'Choose approve or reject.'; end if;
 if p_approve then
 insert into public.portfolio_journal_posts(title,category,text,author_name,visibility)
 values(submission.title,'Community',submission.text,submission.author_name,'public') returning id into published;
 end if;
 update public.portfolio_journal_submissions set status=case when p_approve then 'approved' else 'rejected' end,post_id=published where id=p_id;
 return published;
end; $$;
revoke all on function public.portfolio_review_journal(uuid,boolean) from public;
grant execute on function public.portfolio_review_journal(uuid,boolean) to authenticated;
create view public.portfolio_journal_summaries with (security_invoker=true) as
 select id,title,category,left(text,240) as text,image,visibility,sample,author_name,updated
 from public.portfolio_journal_posts where visibility='public';
grant select on public.portfolio_journal_summaries to anon,authenticated;
commit;

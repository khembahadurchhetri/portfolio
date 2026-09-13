# Vercel + shared 1t1g Supabase project

Project: https://zrenpbsmjiarpjsuowoe.supabase.co

The browser-safe publishable key is configured in assets/journal-config.js. No service-role key belongs in this repository. When this key is configured, both local and hosted pages use Supabase, not the old local SQLite database. Local entries and passwords are not transferred automatically.

## 1. Create the journal schema

In the **1t1g** Supabase project, open **SQL Editor → New query**. Paste the contents of `supabase/portfolio-journal.sql` and run it once. The script runs as a transaction and fails if its object names already exist, rather than replacing them. It creates only portfolio-prefixed tables/functions and the `portfolio-journal-media` private bucket. Its new storage restrictions affect only that bucket; existing 1t1g buckets pass through unchanged.

## 2. Authorize your owner account

Go to **Authentication → Users**. Use your own existing Auth user, or manually create a dedicated owner user with a password and confirmed email. A Supabase dashboard login is not automatically an Auth user. Do not change the shared project's signup, redirect or email settings.

Copy that user's UUID, then run this separately in SQL Editor:

```sql
insert into public.portfolio_journal_owners(user_id)
values ('REPLACE-WITH-YOUR-AUTH-USER-UUID');
```

Only users explicitly listed here can manage the journal. Ordinary 1t1g users cannot view drafts/private entries or make changes. Use this Auth user's email/password at the portfolio `/admin` page, not the old `npm run setup` password unless they happen to match. Owner sessions stay in browser memory; refreshing the admin page requires signing in again. Expired sessions can be signed in again without discarding the open unsaved form.

## 3. Add content and verify

Start `npm start` and open http://localhost:3000/admin. Sign in, create a private test entry and attach a photo. Click **Save entry**. Reload, sign in again and confirm it persisted. In a signed-out browser, it must not appear in the journal. Publish it and confirm it appears, then make it private again.

Signed attachment URLs expire after 60 seconds. Previously issued URLs can remain usable until expiry even after changing visibility. Downloaded copies cannot be revoked. Deleting a post removes it from the journal; uploaded objects remain private in the bucket for manual cleanup in Supabase Storage. A file referenced by another public entry remains publicly readable. The generated lake in assets is intentionally public demo artwork and is never private.

The fresh database is empty. Optional sample entries can be inserted using `supabase/journal-samples.sql` after the schema is created. They are labeled as samples. Run that seed only once to avoid duplicates. Your existing local SQLite data remains in the ignored data directory; nothing in this setup deletes or migrates it.

## 4. Deploy to the existing Vercel project

Commit and push the code to the repository connected to khemchhetri.com.np. The included vercel.json sets Framework to Other, build command to `npm run build` and output directory to `public-dist`. Remove any conflicting old dashboard build/output overrides. No Docker or Node server deployment is required for this option. The build copies only website files, excluding SQLite data, server code and migration SQL.

After deployment open https://www.khemchhetri.com.np/admin and repeat the private/public test. Publishing code does not apply the SQL or create an owner. Do not change DNS: the domain already points to Vercel.

## Verification limits

Local tests cover the adapter's request behavior and the legacy Node backend. Real RLS and Storage enforcement must be checked against the configured Supabase project after applying SQL, including a signed-out visitor and a non-owner 1t1g Auth user. The migration has not been applied automatically.

References: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage policies](https://supabase.com/docs/guides/storage/security/access-control), [API keys](https://supabase.com/docs/guides/api/api-keys).

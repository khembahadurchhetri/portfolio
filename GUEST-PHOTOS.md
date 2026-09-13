# Guest journal photos and categories

Run `supabase/journal-guest-photos.sql` once in 1t1g's SQL Editor, after the existing journal migrations. This adds category/photo fields to pending submissions, creates a private `portfolio-guest-media` bucket, and updates approval to publish the chosen category and attachment together. Existing text-only submissions use Community and no photo.

Visitors can select Books, Movies, Notes, Photos & videos, Vlogs, Quotes, News or Community. They can attach one PNG, JPEG or WebP image up to 1 MB. Guest video uploads are not enabled. Owner uploads remain unchanged.

Guest uploads are insert-only; visitors cannot list private files, replace files or delete them. Anonymous reads require a matching public post. Only the owner can preview a pending image through a 60-second signed URL. Publishing makes the attachment readable; making the post private removes public read permission, though an already issued signed URL can work until it expires.

The bucket is capped at 50 new uploads per day and 200 total objects. This bounds storage use on the shared free project. The existing per-visitor submission limits still apply. Anonymous upload quotas are basic abuse mitigation, not proof of identity or CAPTCHA protection. Interrupted/failed submissions and rejected entries can leave private files: review and clean up unused files through Supabase Storage. Do not delete files still referenced by approved posts.

After applying SQL, test a visitor photo submission, check that its photo cannot be read while pending, then sign in and use Preview photo and Approve & publish. Confirm it appears in the chosen category. The new SQL is prepared locally and has not been automatically applied.

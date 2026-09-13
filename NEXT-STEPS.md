# Next.js portfolio

## Run and edit

```powershell
npm run dev
```

Open http://localhost:3000. For production locally run `npm run build`, then `npm start`. Vercel now uses the Next.js framework setting in vercel.json; remove an old `public-dist` output override in the Vercel dashboard. Do not open index.html with Live Server for the new application.

| Source | Purpose |
| --- | --- |
| app/page.jsx | Composes the home page |
| components/portfolio/ | Hero, About, Skills, Projects, Journal and other sections |
| components/admin/ | Owner editor and moderation panel |
| components/SubmissionForm.jsx | Public submission form |
| app/api/journal/submit/route.js | Validates public submissions |
| styles/portfolio.css, assets/scenery.css | Layout, typography and background motion |
| assets/portfolio.js | Existing navigation, contact and animation behavior |
| assets/journal-backend.js | Supabase requests and owner session |
| assets/ | Original images, music and other public assets |

The site runtime is now Next.js/React (JavaScript), CSS, and Supabase/PostgreSQL. Python was only a development helper, not a website dependency. Existing DOM-based behavior remains isolated in assets; the page sections themselves are React components. The old SQLite backend remains available as `npm run start:legacy` for recovery, not for the new site. Original HTML is backed up privately under data/refactor-backup.

## Required Supabase update

Run **supabase/journal-submissions.sql** once in the same 1t1g project's SQL Editor. It adds an author field, a private submissions table, submission/review functions, and a public summary view. It preserves existing journal entries and owner authorization. Do not rerun the original portfolio-journal.sql.

Visitors submit a name, title and text. They cannot read the submissions table, approve submissions or insert directly into published entries. Only an authorized owner can call the approval function. Approval locks the submission row and atomically publishes one Community entry; repeat approval cannot publish duplicates. Rejection leaves the entry unpublished. The owner sees the queue via **Load approval queue** in `/admin`.

The form includes consent, length limits and a hidden spam field. The database serializes quota checks and caps submissions at 100 per day globally and 3 per visitor identifier, with duplicate text checks. Visitor identifiers are not proof of identity and can be changed by direct callers; this is lightweight abuse control, not CAPTCHA-grade spam protection. Names are visitor-provided, not verified identities.

## Performance changes and limits

- Detail pages fetch one selected post instead of the entire journal, and no longer issue a separate HEAD request before loading media.
- The journal waits until near the viewport, then requests short summaries (240 characters) instead of full posts.
- Supabase requests time out after 12 seconds (uploads: 60 seconds) rather than hanging indefinitely.
- Offscreen animations and background-tab loops pause, and reduced-motion preferences stop those loops.
- Hero/project images use Next Image with responsive sizes. Private journal media never passes through Next's public image cache.
- Chatbot code loads only when the visitor opens Chat.

The 10.8 MB music file already had preload="none"; it was not an initial-load download. It still downloads when played. Supabase latency, shared project load and visitor network conditions can still affect the journal. These are code-level improvements; no production speed score is claimed without measuring the deployed site.

## Verify before publishing

Run `npm test` and `npm run build`. After applying SQL, submit a visitor entry, confirm it is absent from the public journal, sign in as owner and approve it, then confirm it appears with the visitor's name. Also reject one and verify it remains hidden. Confirm a non-owner 1t1g account cannot read the queue or approve a submission.

Build and mocked API tests do not validate live Supabase RLS. The new SQL must be applied and those checks completed before the approval feature is considered live.

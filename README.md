# Khem Chhetri portfolio

This project now uses **Next.js + React**, CSS and Supabase.

```powershell
npm run dev
```

Open http://localhost:3000. Edit `app/page.jsx` and the sections in `components/portfolio/` instead of index.html.

- [Current setup, architecture, moderation and performance notes](NEXT-STEPS.md)
- [Initial Supabase setup](SUPABASE-SETUP.md)
- New required SQL: `supabase/journal-submissions.sql` (run once after the original schema).

Checks: `npm test` and `npm run build`. Production server: `npm start` after building. Vercel uses the Next.js preset.

The old SQLite database remains private in `data/`. It has not been deleted. Docker and JOURNAL-SETUP.md describe the earlier Node/SQLite option, not the current Vercel deployment.

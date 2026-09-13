# Khem Bahadur Chhetri — Portfolio

## Journal backend (current)

**Vercel/Supabase setup:** The portfolio is now configured to use the shared 1t1g Supabase project. Follow [SUPABASE-SETUP.md](SUPABASE-SETUP.md) to apply the portfolio-only SQL, authorize your owner Auth user and deploy. The local Node/SQLite instructions below are the fallback when no Supabase publishable key is configured.

Run `npm run setup` once to create your owner account, then `npm start` and open `http://localhost:3000`. The dashboard is at `/admin`. Requires Node 24.14+. Run `npm test` for backend integration checks.

See [JOURNAL-SETUP.md](JOURNAL-SETUP.md) for persistent hosting, HTTPS configuration, backups, uploads and public/private publishing. The older static-site notes below describe the original portfolio; static-only deployment does **not** support the new admin backend.

## Original structure
```
index.html               everything: HTML, CSS (in <style>), JS (in <script>)
assets/khem-photo.jpg    your real photo, used in the hero
assets/home-was-you.mp3  background track for the music widget
cv/Khem_Chhetri_CV.pdf   your CV — downloadable
```
Only one file to edit. Inside `index.html`:
- CSS lives in one `<style>` block, ordered: theme tokens → nav → hero →
  ticker → about → skills → experience → projects → resume → contact →
  footer → responsive. Section header comments mark each part.
- JS lives in one `<script>` block near the bottom, same idea —
  EmailJS config first, then theme/menu/rail/form logic each in its
  own labeled block.
- HTML sections are ordered top to bottom exactly as they appear on
  the page, each wrapped in `<!-- SECTION NAME -->` comments.

## Run it
Just open `index.html` in a browser. No build step, no dependencies to install.

## Deploy it
Drag the whole folder into [Vercel](https://vercel.com/new) or
[Netlify Drop](https://app.netlify.com/drop) — it's a static site,
so it deploys as-is in a few seconds.

## Turn on "message → your Gmail" and "CV download alerts"
Right now the contact form falls back to opening the visitor's email
app (`mailto:`), and CV downloads don't send you anything — both work,
but the email part isn't automatic yet. To make messages land directly
in your Gmail inbox and get notified on downloads, wire up **EmailJS**
(free, no backend, ~5 minutes):

1. Sign up at https://www.emailjs.com
2. **Email Services** → Add Service → connect your Gmail → copy the **Service ID**
3. **Email Templates** → create one for contact messages using variables
   `{{from_name}}`, `{{reply_to}}`, `{{message}}` → copy the **Template ID**
4. Create a second template for download alerts using `{{source}}`,
   `{{time}}`, `{{referrer}}`, `{{user_agent}}` → copy that **Template ID**
5. **Account → General** → copy your **Public Key**
6. Open `js/main.js`, paste all four values into the `EMAILJS_CONFIG`
   object at the top of the file.

That's it — no server, no API keys exposed beyond the public key
(which is designed to be public).

## Notes on what changed from the old version
- Real photo instead of a canvas-drawn portrait
- Fonts: Space Grotesk (headings) + Inter (body) — no more serif/cursive feel
- Dark mode now uses one consistent variable system, so text never goes low-contrast
- Scroll indicator ("trail rail") stays visible on mobile and now rotates the
  car to face up/down depending on scroll direction
- Added a tech-stack + socials ticker (opposite-direction marquees)
- Added two native horizontal-scroll strips (quick facts, projects) — no
  slider UI, just drag/swipe
- CV is now embedded (inline preview) and downloadable, with an optional
  silent email alert on download
- Hero's dead right-hand space now holds your actual photo

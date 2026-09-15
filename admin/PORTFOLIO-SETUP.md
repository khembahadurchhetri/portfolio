# Portfolio editing

The Next.js admin at `/admin` now has Portfolio settings above the journal editor.
It uses the existing owner login and owner allowlist; visitors cannot save settings
or upload portfolio files.

## Activate on Supabase

1. Open the SQL editor for the same Supabase project configured in
   `assets/journal-config.js`.
2. Run `supabase/portfolio-content.sql` once, after the existing journal migration.
   It creates the portfolio settings table, public portfolio asset bucket, and
   owner-only write policies. It does not modify the owner allowlist.
3. Sign in at `/admin`. Edit Portfolio settings and click **Save portfolio**.
4. Reload the homepage to see the saved projects, profile photo and CV.

Until the migration is applied, the homepage uses `assets/portfolio-defaults.json`
and admin displays an explicit setup message. Database credentials are not included
in this repository, so the migration must be applied through your database access.

Profile and project uploads support PNG, JPEG and WebP; CV uploads support PDF.
Maximum upload size is 10 MB. These portfolio uploads are public immediately;
Save portfolio attaches them to the website. Journal privacy works separately.
Previously uploaded assets are retained so existing links keep working.

Every project has a code/GitHub URL, with an optional separate live URL. Exact
repository URLs are configured for HamroChatbot, Threft Nepal, IT Services,
Stock Volatility Prediction and Journal Studio. Other projects currently use the owner's GitHub profile until
specific repository URLs are entered in admin.

The local Node backend also implements the settings and upload endpoints with its
existing owner session and CSRF checks. The new editing interface is in Next.js;
legacy static HTML does not include it.

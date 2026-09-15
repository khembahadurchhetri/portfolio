# Admin and email notifications

Admin automatically loads pending submissions after sign-in, refreshes every
30 seconds while the tab is visible, and checks again when you return to the tab.
The header and browser tab show the pending count. Save, publish, upload, delete,
and review actions display visible confirmations.

Email is prepared using Resend's HTTPS API:
https://resend.com/docs/api-reference/emails/send-email

Set these SERVER-ONLY environment variables in your deployment, then redeploy:

- RESEND_API_KEY: a Resend sending key
- JOURNAL_NOTIFY_EMAIL: your recipient email
- JOURNAL_NOTIFY_FROM: a sender approved by your Resend account
- PORTFOLIO_SITE_URL: your site's HTTPS URL

None should use a NEXT_PUBLIC_ prefix. Do not commit credentials.

Email is sent after the visitor submission is accepted by Supabase. It includes
only an approval reminder and a link to admin; signing in is still required.
A transient delivery failure is retried once with the same idempotency key.
A failed email never discards or duplicates the saved submission. Persistent
failures are logged; the in-admin queue remains the source of truth. This does
not provide a durable email retry queue. Direct submissions to Supabase outside
the website endpoint do not trigger this email.

No email delivery is active until the environment variables are configured.

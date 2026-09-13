# Journal Studio

The portfolio now has a Node 24.14+ backend with SQLite persistence. There are no npm dependencies. Opening index.html directly is no longer sufficient for the admin features.

## Run locally

1. Run `npm run setup` in an interactive terminal. Enter your email and a unique password of at least 14 characters. Password input is hidden. This creates the sole owner account. There is no public signup or default password.
2. Run `npm start`.
3. Visit `http://localhost:3000` and `http://localhost:3000/admin`.

The public journal shows one entry per page on mobile and three on desktop, with horizontal category filters and Previous/Next buttons. Full entries have their own page, so vertical scrolling remains normal.

## Publishing

Use New entry, choose a category (or type a new one), write the entry, upload an optional image/video, choose visibility and save. Existing entries can be edited or permanently deleted. Draft/private entries and their uploads require an authenticated owner session. Public entries and their attachments can be read by everyone. To make a private copy of an already public attachment, upload a separate file; visibility is based on all posts using the same attachment. Content previously downloaded by visitors cannot be revoked.

PNG, JPEG, WebP, MP4 and WebM uploads are limited to 20 MB each. Larger vlogs can use a related link, but link destinations have their own access controls. Uploads are stored in the database, not a public directory. Unattached uploads remain private and are pruned when an entry is deleted. Sample seed content includes an AI-generated imaginary landscape, two reading-shelf examples, an original sample quote and writing prompts; none are presented as your lived experience.

## Deployment

### Container option (prepared, not deployed)

The included Dockerfile and compose.yaml run the service as a non-root user with a named persistent volume. Set PUBLIC_ORIGIN to your final HTTPS origin, then run `docker compose up -d --build` on your host. Run `docker compose exec portfolio npm run setup` to create the hosted owner account. Point your HTTPS reverse proxy at localhost:3000. Never use `docker compose down -v` unless you intend to delete the journal database and uploads.

The local database is deliberately excluded from the image. Your local account and posts do not automatically transfer to the host. To migrate them, stop both services and privately copy the local database into the hosted data volume, preserving its file ownership. Back up both databases first. Do not upload the data directory to GitHub or expose it as a downloadable asset.

Typing in the admin editor does not auto-save. Click Save entry after uploading or editing; the editor now shows unsaved changes and warns before leaving. If the session expires, sign in again in the same page to retain the unsaved form. A successful save shows the visibility. Public/private/draft entries persist in the same database across restarts.

Run this as a single Node service with a persistent disk and HTTPS reverse proxy, not a static-only deployment or ephemeral serverless filesystem. Configure:

| Variable | Value |
| --- | --- |
| NODE_ENV | production |
| PUBLIC_ORIGIN | Exact HTTPS site origin, e.g. https://your-domain.example (no trailing slash) |
| HOST | 0.0.0.0 when required by your host |
| PORT | Port supplied by the host; local default 3000 |
| DATA_DIR | Absolute path to the persistent data directory |

Run `npm run setup` on the host using the same DATA_DIR, then `npm start`. Keep the data directory private and out of static hosting. Back up the entire data directory while the service is stopped (SQLite database and any WAL files), then restart. Media, owner credentials, posts and sessions are in this database. Losing it loses the content. Re-running setup changes the owner credentials and revokes existing sessions; this is also the local password recovery procedure.

Sessions expire after eight hours. Cookies are HttpOnly and SameSite=Strict, with Secure enabled for HTTPS. Mutations require the configured Origin and a session CSRF token. Passwords use salted scrypt hashing, login attempts are limited, and private media is authorized on every request. Only one owner is supported; visitor accounts, sharing invitations, password-reset email and MFA are not implemented.

## Verification

Run `npm test` for authorization, CSRF, public/private media transitions, CRUD persistence, protected filesystem routes, upload type checks and logout revocation.

Implementation references: [Node SQLite](https://nodejs.org/api/sqlite.html) and [Node crypto](https://nodejs.org/api/crypto.html).

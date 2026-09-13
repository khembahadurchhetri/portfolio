# Portfolio content

The active mountain portfolio is `../index.html`.

## Project images

Project cards use the supplied images: `hamrochatbot.png`, `threft.png`, `stockvolatility.png`, `itservices.png`, `tomato.png`, and `passwordmanagement.png`. Screenshots fit inside a consistent 16:9 frame without distortion or cropping; the tomato photo fills its frame. The password image is contained so the key stays visible.

Nepal Travel Guide uses `travelguide.png`, filling the preview frame. Interface Design Studies uses `uuiuxx.png`, contained in the frame to preserve the complete design canvas. All eight project cards now use supplied images; the `project-*.svg` previews are unused.

## Journal

Manage entries at `/admin` after running the Node server and creating your owner account. See [JOURNAL-SETUP.md](../JOURNAL-SETUP.md). Entries are stored in SQLite with public, private or draft visibility, and uploaded media is authorized by the server. All categories use the same visibility controls.

`journal-samples.json` supplies public demonstration content only. The database seeds it once on first startup; editing or deleting sample entries through the dashboard persists across restarts. The AI-generated lake is an imagined scene, not a personal photograph. Never place actual private content in static assets. Static-only hosting provides a sample preview and cannot run authentication or CRUD.

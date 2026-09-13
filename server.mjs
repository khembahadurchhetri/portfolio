import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { readFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const root = path.dirname(fileURLToPath(import.meta.url));
const hashPassword = promisify(scrypt);
const token = () => randomBytes(32).toString('hex');
const digest = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.pdf':'application/pdf', '.mp3':'audio/mpeg', '.webp':'image/webp' };

export async function createApp({ dataDir = process.env.DATA_DIR || path.join(root, 'data'), origin = process.env.PUBLIC_ORIGIN || 'http://localhost:3000', secure = origin.startsWith('https:') } = {}) {
  await mkdir(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, 'journal.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS owner (id INTEGER PRIMARY KEY CHECK(id=1), email TEXT NOT NULL, salt TEXT NOT NULL, hash TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, content TEXT NOT NULL, visibility TEXT NOT NULL, updated TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, type TEXT NOT NULL, bytes BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  if (!db.prepare("SELECT 1 FROM meta WHERE key='seeded'").get()) {
    const samples = JSON.parse(await readFile(path.join(root, 'assets/journal-samples.json'), 'utf8'));
    db.exec('BEGIN');
    for (const entry of samples) db.prepare('INSERT INTO posts VALUES (?, ?, ?, ?)').run(entry.id, JSON.stringify(entry), 'public', new Date().toISOString());
    db.prepare('INSERT INTO meta VALUES (?, ?)').run('seeded', '1');
    db.exec('COMMIT');
  }
  async function setOwner(email, password) {
    if (!email.includes('@') || password.length < 14 || password.length > 256) fail(400, 'Use an email and a password of 14–256 characters.');
    const salt = token();
    const hash = (await hashPassword(password, salt, 64)).toString('hex');
    db.prepare('INSERT OR REPLACE INTO owner VALUES (1, ?, ?, ?)').run(email.toLowerCase().trim(), salt, hash);
    db.exec('DELETE FROM sessions');
  }
  const attempts = new Map();
  let globalAttempts = [];
  function session(req) {
    const cookie = /(?:^|;\s*)journal_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    return cookie ? db.prepare('SELECT * FROM sessions WHERE id=? AND expires>?').get(digest(cookie), Date.now()) : null;
  }
  function requireOwner(req) { const value = session(req); if (!value) fail(401, 'Sign in to continue.'); return value; }
  async function body(req, limit = 65536) {
    const chunks = []; let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > limit) fail(413, 'Upload is too large. Maximum media size: 20 MB.'); chunks.push(chunk); }
    return Buffer.concat(chunks);
  }
  async function json(req) { try { return JSON.parse((await body(req)).toString()); } catch (e) { if (e.status) throw e; fail(400, 'Invalid JSON.'); } }
  const mapPost = row => ({ ...JSON.parse(row.content), updated: row.updated });
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    if (secure) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    const send = (status, value) => { res.writeHead(status, { 'Content-Type':'application/json', 'Cache-Control':'no-store' }); res.end(JSON.stringify(value)); };
    try {
      const url = new URL(req.url, origin); const route = url.pathname;
      if (route.startsWith('/api/') || route.startsWith('/media/')) res.setHeader('Cache-Control', 'no-store');
      if (!['GET','HEAD'].includes(req.method)) {
        if (req.headers.origin !== origin) fail(403, 'Request origin is not allowed.');
        if (route !== '/api/login') {
          const auth = requireOwner(req);
          if (req.headers['x-csrf-token'] !== auth.csrf) fail(403, 'Session verification failed. Reload and try again.');
        }
      }
      if (route === '/api/login' && req.method === 'POST') {
        const now = Date.now(); const ip = req.socket.remoteAddress;
        for (const [key, times] of attempts) if (times.at(-1) < now - 900000) attempts.delete(key);
        const recent = (attempts.get(ip) || []).filter(t => t > now - 900000);
        globalAttempts = globalAttempts.filter(t => t > now - 900000);
        if (recent.length >= 8 || globalAttempts.length >= 40) fail(429, 'Too many attempts. Try again in 15 minutes.');
        attempts.set(ip, [...recent, now]); globalAttempts.push(now);
        const input = await json(req);
        if (typeof input.email !== 'string' || typeof input.password !== 'string' || input.password.length > 256) fail(400, 'Enter an email and password.');
        const owner = db.prepare('SELECT * FROM owner WHERE id=1').get();
        if (!owner) fail(503, 'Your owner account has not been created yet. In the portfolio terminal, run npm run setup and complete the email and password prompts. Then sign in here.');
        const hashed = await hashPassword(input.password, owner.salt, 64);
        if (!timingSafeEqual(hashed, Buffer.from(owner.hash, 'hex')) || input.email.trim().toLowerCase() !== owner.email) fail(401, 'Incorrect email or password.');
        const id = token(), csrf = token();
        db.prepare('DELETE FROM sessions WHERE expires < ?').run(now);
        db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(id), csrf, now + 8 * 3600000);
        res.setHeader('Set-Cookie', `journal_session=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure ? '; Secure' : ''}`);
        return send(200, { csrf });
      }
      if (route === '/api/session' && req.method === 'GET') { const auth = requireOwner(req); return send(200, { csrf: auth.csrf }); }
      if (route === '/api/logout' && req.method === 'POST') {
        db.prepare('DELETE FROM sessions WHERE id=?').run(requireOwner(req).id);
        res.setHeader('Set-Cookie', `journal_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure ? '; Secure' : ''}`);
        return send(200, { ok:true });
      }
      if (route === '/api/posts' && req.method === 'GET') {
        const rows = db.prepare("SELECT * FROM posts WHERE visibility='public' ORDER BY updated DESC, id").all();
        return send(200, rows.map(mapPost));
      }
      if (route === '/api/admin/posts' && req.method === 'GET') { requireOwner(req); return send(200, db.prepare('SELECT * FROM posts ORDER BY updated DESC, id').all().map(mapPost)); }
      const postRoute = /^\/api\/admin\/posts(?:\/([\w-]+))?$/.exec(route);
      if (postRoute && ['POST', 'PUT'].includes(req.method)) {
        requireOwner(req); const input = await json(req); const id = postRoute[1] || randomBytes(16).toString('hex');
        if ((req.method === 'PUT' && !postRoute[1]) || (req.method === 'POST' && postRoute[1])) fail(405, 'Method not allowed.');
        if (req.method === 'PUT' && !db.prepare('SELECT 1 FROM posts WHERE id=?').get(id)) fail(404, 'Entry not found.');
        const clean = { id };
        for (const [key, max] of [['title',140],['category',60],['text',20000],['url',2000],['image',2000]]) {
          if (input[key] != null && typeof input[key] !== 'string') fail(400, `Invalid ${key}.`);
          clean[key] = (input[key] || '').trim(); if (clean[key].length > max) fail(400, `${key} is too long.`);
        }
        if (!clean.title || !clean.category || !['public','private','draft'].includes(input.visibility)) fail(400, 'Title, category and valid visibility are required.');
        clean.visibility = input.visibility; clean.sample = input.sample === true;
        if (clean.url && !/^https?:\/\//i.test(clean.url)) fail(400, 'Links must start with https:// or http://.');
        if (clean.image && clean.image !== '/assets/journal-ai-lake.png' && !/^\/media\/[a-f0-9]{32}$/.test(clean.image)) fail(400, 'Choose an uploaded file.');
        if (clean.image.startsWith('/media/') && !db.prepare('SELECT 1 FROM media WHERE id=?').get(clean.image.slice(7))) fail(400, 'Media not found.');
        const updated = new Date().toISOString();
        db.prepare('INSERT OR REPLACE INTO posts VALUES (?, ?, ?, ?)').run(id, JSON.stringify(clean), clean.visibility, updated);
        return send(req.method === 'POST' ? 201 : 200, { ...clean, updated });
      }
      if (postRoute?.[1] && req.method === 'DELETE') {
        requireOwner(req); const result = db.prepare('DELETE FROM posts WHERE id=?').run(postRoute[1]);
        if (!result.changes) fail(404, 'Entry not found.');
        // Remove uploads that no remaining entry references, including private entries.
        db.exec("DELETE FROM media WHERE NOT EXISTS (SELECT 1 FROM posts WHERE json_extract(content, '$.image') = '/media/' || media.id)");
        return send(200, { ok:true });
      }
      if (route === '/api/admin/media' && req.method === 'POST') {
        requireOwner(req); const bytes = await body(req, 20 * 1024 * 1024);
        let type;
        if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) type='image/png';
        else if (bytes[0]===255 && bytes[1]===216 && bytes[2]===255) type='image/jpeg';
        else if (bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP') type='image/webp';
        else if (bytes.toString('ascii',4,8)==='ftyp') type='video/mp4';
        else if (bytes.subarray(0,4).equals(Buffer.from([26,69,223,163]))) type='video/webm';
        else fail(415, 'Use a PNG, JPEG, WebP, MP4 or WebM file.');
        const id = randomBytes(16).toString('hex'); db.prepare('INSERT INTO media VALUES (?, ?, ?)').run(id, type, bytes);
        return send(201, { url:`/media/${id}`, type });
      }
      const mediaRoute = /^\/media\/([a-f0-9]{32})$/.exec(route);
      if (mediaRoute && ['GET','HEAD'].includes(req.method)) {
        const publicUse = db.prepare("SELECT 1 FROM posts WHERE visibility='public' AND json_extract(content, '$.image')=?").get(route);
        if (!publicUse && !session(req)) fail(404, 'Media not found.');
        const media = db.prepare('SELECT * FROM media WHERE id=?').get(mediaRoute[1]); if (!media) fail(404, 'Media not found.');
        const bytes = Buffer.from(media.bytes); res.setHeader('Content-Type', media.type); res.setHeader('Accept-Ranges','bytes');
        const range = req.headers.range;
        if (range) {
          const m = /^bytes=(\d+)-(\d*)$/.exec(range); const start = Number(m?.[1]), end = m?.[2] ? Number(m[2]) : bytes.length-1;
          if (!m || start > end || end >= bytes.length) { res.setHeader('Content-Range', `bytes */${bytes.length}`); return res.writeHead(416).end(); }
          res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`); res.setHeader('Content-Length',end-start+1); res.writeHead(206); return res.end(req.method === 'HEAD' ? undefined : bytes.subarray(start,end+1));
        }
        res.setHeader('Content-Length', bytes.length); return res.end(req.method === 'HEAD' ? undefined : bytes);
      }
      if (route.startsWith('/api/') || route.startsWith('/media/')) fail(404, 'Not found.');
      if (!['GET','HEAD'].includes(req.method)) fail(405, 'Method not allowed.');
      const requested = decodeURIComponent(route === '/' ? '/index.html' : route === '/admin' || route === '/admin/' ? '/admin/index.html' : route);
      // Explicit public directories: database, server sources and dotfiles cannot be served.
      if (!(['/index.html','/entry.html'].includes(requested) || /^\/(assets|admin|project3)\/[\w./ -]+$/.test(requested)) || requested.split('/').some(p => p.startsWith('.')) || requested.endsWith('.md')) fail(404, 'Not found.');
      const file = path.resolve(root, '.' + requested);
      if (!file.startsWith(root + path.sep)) fail(404, 'Not found.');
      const info = await stat(file); if (!info.isFile()) fail(404, 'Not found.');
      if (requested.startsWith('/admin/') || requested === '/entry.html') { res.setHeader('Cache-Control','no-store'); res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://zrenpbsmjiarpjsuowoe.supabase.co; img-src 'self' https://zrenpbsmjiarpjsuowoe.supabase.co; media-src 'self' https://zrenpbsmjiarpjsuowoe.supabase.co; frame-ancestors 'none'; form-action 'self'; base-uri 'none'"); }
      res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');
      res.end(req.method === 'HEAD' ? undefined : await readFile(file));
    } catch (error) { if (!res.headersSent) send(error.status || (error.code === 'ENOENT' ? 404 : 500), { error: error.status ? error.message : error.code === 'ENOENT' ? 'Not found.' : 'The server could not complete this request.' }); else res.end(); }
  });
  server.requestTimeout = 60000;
  return { server, db, setOwner, close: () => new Promise(resolve => { server.close(() => { db.close(); resolve(); }); server.closeAllConnections(); }) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const app = await createApp();
  if (process.argv.includes('--setup')) {
    const rl = createInterface({ input:process.stdin, output:process.stdout });
    try {
      const email = await rl.question('Owner email: ');
      rl.close();
      // Read password without echoing it or storing it in shell history.
      const password = await new Promise((resolve, reject) => {
        if (!process.stdin.isTTY) return reject(new Error('Run setup in an interactive terminal.'));
        process.stdout.write('Password (14+ characters, hidden): '); process.stdin.setRawMode(true); process.stdin.resume(); let value='';
        const receive = chunk => { for (const char of chunk.toString()) { if (char === '\r' || char === '\n' || char === '\u0003') { process.stdin.off('data',receive); process.stdin.setRawMode(false); process.stdout.write('\n'); return char === '\u0003' ? reject(new Error('Cancelled')) : resolve(value); } if (char === '\u007f' || char === '\b') value=value.slice(0,-1); else value+=char; } }; process.stdin.on('data',receive);
      });
      await app.setOwner(email,password); console.log('Owner account saved. Existing sessions revoked.');
    } catch (error) { console.error(error.message); process.exitCode=1; }
    finally { rl.close(); app.db.close(); process.stdin.pause(); }
  } else {
    if (process.env.NODE_ENV === 'production' && !process.env.PUBLIC_ORIGIN?.startsWith('https://')) throw new Error('Production requires an HTTPS PUBLIC_ORIGIN.');
    const port = Number(process.env.PORT || 3000);
    app.server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Portfolio and admin: ${process.env.PUBLIC_ORIGIN || 'http://localhost:' + port}`));
  }
}

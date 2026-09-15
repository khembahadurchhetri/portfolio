// Server-only email delivery. No visitor-supplied address or URL is used.
export async function notifyJournalSubmission() {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.JOURNAL_NOTIFY_EMAIL;
  const from = process.env.JOURNAL_NOTIFY_FROM;
  const site = process.env.PORTFOLIO_SITE_URL;
  if (!key || !to || !from || !site) return false;
  let reviewUrl;
  try {
    const url = new URL('/admin#moderation', site);
    if (url.protocol !== 'https:') return false;
    reviewUrl = url.href;
  } catch { return false; }
  const idempotencyKey = crypto.randomUUID();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({ from, to: [to], subject: 'A journal is awaiting your approval', text: `A visitor submitted a new journal. Sign in to review and approve or reject it:\n\n${reviewUrl}\n\nIt remains unpublished until you approve it.` }),
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) return true;
      if (response.status < 500 && response.status !== 429) break;
    } catch { /* Retry transient delivery failures using the same key. */ }
  }
  console.error('Journal saved, but owner notification email failed. Check email provider configuration and logs.');
  return false;
}

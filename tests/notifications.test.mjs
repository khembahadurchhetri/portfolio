import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notifyJournalSubmission } from '../app/api/journal/submit/notify.js';

test('approval emails require configuration and retry with one idempotency key', async () => {
  const keys = ['RESEND_API_KEY','JOURNAL_NOTIFY_EMAIL','JOURNAL_NOTIFY_FROM','PORTFOLIO_SITE_URL'];
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({url, options}); return new Response(null, {status:calls.length === 1 ? 503 : 200}); };
  try {
    for (const key of keys) delete process.env[key];
    assert.equal(await notifyJournalSubmission(), false);
    assert.equal(calls.length, 0);
    Object.assign(process.env, {RESEND_API_KEY:'test-key',JOURNAL_NOTIFY_EMAIL:'owner@example.com',JOURNAL_NOTIFY_FROM:'Portfolio <alerts@example.com>',PORTFOLIO_SITE_URL:'https://portfolio.example.com'});
    assert.equal(await notifyJournalSubmission(), true);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].options.headers['Idempotency-Key'], calls[1].options.headers['Idempotency-Key']);
    const body = JSON.parse(calls[1].options.body);
    assert.deepEqual(body.to, ['owner@example.com']);
    assert.match(body.text, /https:\/\/portfolio.example.com\/admin#moderation/);
    process.env.PORTFOLIO_SITE_URL = 'javascript:alert(1)';
    assert.equal(await notifyJournalSubmission(), false);
    assert.equal(calls.length, 2);
  } finally {
    globalThis.fetch = original;
    for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
  }
});

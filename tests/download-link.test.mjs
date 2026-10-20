import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLinkHandler, downloadUrl, parseLinkRequest } from '../lib/download-link.ts';

const ORIGIN = 'https://autotrim.app';
const NOW = new Date('2026-10-20T10:00:00Z');

function request(body, origin = ORIGIN, url = `${ORIGIN}/api/download-link`) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(origin ? { origin } : {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function recorder(answer = true) {
  const calls = [];
  const send = async (path, method, body) => { calls.push({ path, method, body }); return typeof answer === 'function' ? answer(calls.length) : answer; };
  return { calls, send };
}

test('a phone visitor gets a profile, then the event whose email carries the link with their campaign', async () => {
  const cio = recorder();
  const handler = createLinkHandler({ send: cio.send, now: () => NOW });
  const res = await handler(request({ email: ' Jane@Example.com ', locale: 'fr', marketing: false, utm_source: 'meta', utm_campaign: 'prospecting-hesitations' }));

  assert.equal(res.status, 204);
  assert.deepEqual(cio.calls[0], {
    path: '/customers/jane%40example.com',
    method: 'PUT',
    body: { email: 'jane@example.com', language: 'fr', mobile_link_requested_at: NOW.getTime() / 1000 },
  });
  assert.equal(cio.calls[1].path, '/customers/jane%40example.com/events');
  assert.equal(cio.calls[1].body.name, 'download_link_requested');
  assert.equal(cio.calls[1].body.data.download_url,
    'https://autotrim.app/fr/download?utm_source=meta&utm_campaign=prospecting-hesitations&via=mobile_link');
});

test('the marketing yes is recorded, a no never erases an earlier yes', async () => {
  const yes = recorder();
  await createLinkHandler({ send: yes.send, now: () => NOW })(request({ email: 'a@b.co', locale: 'en', marketing: true }));
  assert.equal(yes.calls[0].body.marketing_opt_in, true);

  const no = recorder();
  await createLinkHandler({ send: no.send, now: () => NOW })(request({ email: 'a@b.co', locale: 'en', marketing: false }));
  assert.equal('marketing_opt_in' in no.calls[0].body, false);
});

test('without a campaign, the link says it came from this email', () => {
  assert.equal(downloadUrl('en', {}), 'https://autotrim.app/en/download?utm_source=download_link&utm_medium=email&via=mobile_link');
});

test('another site, a bad address or a malformed body is refused, and nothing reaches Customer.io', async () => {
  const cio = recorder();
  const handler = createLinkHandler({ send: cio.send });
  assert.equal((await handler(request({ email: 'a@b.co' }, 'https://evil.example'))).status, 403);
  assert.equal((await handler(request({ email: 'a@b.co' }, null))).status, 403);
  assert.equal((await handler(request({ email: 'not-an-email' }))).status, 400);
  assert.equal((await handler(request('{nope'))).status, 400);
  assert.equal((await handler(request({ email: 'a@b.co', pad: 'x'.repeat(3000) }))).status, 400);
  assert.equal(cio.calls.length, 0);
});

test('a filled hidden field looks accepted to the bot, but sends nothing', async () => {
  const cio = recorder();
  const res = await createLinkHandler({ send: cio.send })(request({ email: 'a@b.co', website: 'spam' }));
  assert.equal(res.status, 204);
  assert.equal(cio.calls.length, 0);
});

test('a Vercel preview is its own origin', async () => {
  const cio = recorder();
  const preview = 'https://auto-trim-landing-abc.vercel.app';
  const res = await createLinkHandler({ send: cio.send })(request({ email: 'a@b.co' }, preview, `${preview}/api/download-link`));
  assert.equal(res.status, 204);
});

test('missing credentials or a Customer.io failure answer 503, so the form can say so', async () => {
  assert.equal((await createLinkHandler({ send: null })(request({ email: 'a@b.co' }))).status, 503);
  const failing = recorder(n => n !== 2);
  assert.equal((await createLinkHandler({ send: failing.send })(request({ email: 'a@b.co' }))).status, 503);
});

test('unknown locales fall back to English, odd UTM values are dropped', () => {
  const parsed = parseLinkRequest({ email: 'a@b.co', locale: 'de', utm_source: 'meta', utm_campaign: '<script>' });
  assert.equal(parsed.locale, 'en');
  assert.deepEqual(parsed.utm, { utm_source: 'meta' });
});

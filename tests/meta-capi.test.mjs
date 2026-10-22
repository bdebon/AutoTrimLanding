import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { reportPurchase, purchaseEvent, metaCheckoutFrom, META_API_VERSION } from '../supabase/functions/lemonsqueezy-webhook/meta.ts';

const CONFIG = { pixelId: '1234567890', token: 'test-token', testEventCode: 'TEST42' };
const CREATED = new Date('2026-10-22T10:00:00Z');
const ORDER = {
  orderId: '9807132',
  createdAt: CREATED,
  value: 119,
  currency: 'USD',
  email: '  Jane.Doe@Example.com ',
  country: 'US',
  contentName: 'annual',
};
const CUSTOM = {
  visitor_id: '01a15329-abc',
  utm_source: 'meta',
  ads_consent: '1',
  fbc: 'fb.1.1792650000000.IwAR123',
  fbp: 'fb.1.1792640000000.987654',
  ua: 'Mozilla/5.0 (iPhone)',
  page: 'https://autotrim.app/en/pricing',
};

function recorder(response = new Response('{"events_received":1}', { status: 200 })) {
  const calls = [];
  const send = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    if (response instanceof Error) throw response;
    return response;
  };
  return { calls, send };
}

const sha = (value) => createHash('sha256').update(value).digest('hex');

test('a purchase without consent to ads is never sent', async () => {
  const { calls, send } = recorder();
  const { ads_consent, ...noConsent } = CUSTOM;
  assert.equal(await reportPurchase(ORDER, noConsent, CONFIG, false, send), 'no_consent');
  assert.equal(await reportPurchase(ORDER, {}, CONFIG, false, send), 'no_consent');
  assert.equal(calls.length, 0);
});

test('a real purchase goes to the pixel once per order, with the hashed email and the ad click', async () => {
  const { calls, send } = recorder();
  assert.equal(await reportPurchase(ORDER, CUSTOM, CONFIG, false, send), 'sent');
  assert.equal(calls.length, 1);
  const { url, body } = calls[0];
  assert.equal(url, `https://graph.facebook.com/${META_API_VERSION}/1234567890/events`);
  assert.equal(body.access_token, 'test-token');
  assert.equal('test_event_code' in body, false);
  assert.deepEqual(body.data, [{
    event_name: 'Purchase',
    event_time: Math.floor(CREATED.getTime() / 1000),
    event_id: '9807132',
    action_source: 'website',
    event_source_url: 'https://autotrim.app/en/pricing',
    user_data: {
      em: [sha('jane.doe@example.com')],
      country: [sha('us')],
      fbc: 'fb.1.1792650000000.IwAR123',
      fbp: 'fb.1.1792640000000.987654',
      client_user_agent: 'Mozilla/5.0 (iPhone)',
    },
    custom_data: { value: 119, currency: 'USD', order_id: '9807132', content_name: 'annual' },
  }]);
});

test('the token never goes in the address', async () => {
  const { calls, send } = recorder();
  await reportPurchase(ORDER, CUSTOM, CONFIG, false, send);
  assert.equal(calls[0].url.includes('test-token'), false);
});

test('a test-mode order goes to the Test events tab only, and only with a test code', async () => {
  const { calls, send } = recorder();
  assert.equal(await reportPurchase(ORDER, CUSTOM, { ...CONFIG, testEventCode: '' }, true, send), 'test_skipped');
  assert.equal(calls.length, 0);
  assert.equal(await reportPurchase(ORDER, CUSTOM, CONFIG, true, send), 'sent');
  assert.equal(calls[0].body.test_event_code, 'TEST42');
});

test('without a pixel or a token, nothing is sent', async () => {
  const { calls, send } = recorder();
  assert.equal(await reportPurchase(ORDER, CUSTOM, { ...CONFIG, token: '' }, false, send), 'not_configured');
  assert.equal(await reportPurchase(ORDER, CUSTOM, { ...CONFIG, pixelId: '' }, false, send), 'not_configured');
  assert.equal(calls.length, 0);
});

test('a free order is not a sale', async () => {
  const { calls, send } = recorder();
  assert.equal(await reportPurchase({ ...ORDER, value: 0 }, CUSTOM, CONFIG, false, send), 'free');
  assert.equal(calls.length, 0);
});

test('a refusal or an outage at Meta is reported, never thrown', async (t) => {
  t.mock.method(console, 'error', () => {});
  const refused = recorder(new Response('{"error":{"message":"Invalid parameter"}}', { status: 400 }));
  assert.equal(await reportPurchase(ORDER, CUSTOM, CONFIG, false, refused.send), 'failed');
  const down = recorder(new Error('network down'));
  assert.equal(await reportPurchase(ORDER, CUSTOM, CONFIG, false, down.send), 'failed');
});

test('a consent with no click and no pixel still sends the email, and the site as the page', () => {
  const checkout = metaCheckoutFrom({ ads_consent: '1', fbc: '', ua: 42 });
  assert.deepEqual(checkout, { fbc: undefined, fbp: undefined, userAgent: undefined, page: undefined });
  const event = purchaseEvent({ ...ORDER, country: undefined }, checkout, CREATED);
  assert.equal(event.event_source_url, 'https://autotrim.app/');
  assert.deepEqual(event.user_data, { em: [sha('jane.doe@example.com')] });
});

test('an order older than Meta accepts (a webhook simulated later) is sent as of now', () => {
  const now = new Date(CREATED.getTime() + 30 * 24 * 60 * 60 * 1000);
  const event = purchaseEvent(ORDER, metaCheckoutFrom(CUSTOM), now);
  assert.equal(event.event_time, Math.floor(now.getTime() / 1000));
});

/**
 * Sends the deployed LemonSqueezy webhook a signed test-mode order, as if bought after a Meta ad
 * with consent to ads, to check the whole chain without a real purchase: the signature, PostHog
 * (`purchase_test`, never counted as a sale) and, when META_TEST_EVENT_CODE is set in the
 * function's secrets, Meta's Test events tab. Customer.io is skipped in test mode.
 *
 * Run with `node scripts/send-test-purchase.mjs`. It asks for the webhook's signing secret
 * (LemonSqueezy, Settings, Webhooks) without showing it, and keeps it nowhere.
 */
import { createHmac } from 'node:crypto';

const WEBHOOK = 'https://gvvldbuvgbribbothphm.supabase.co/functions/v1/lemonsqueezy-webhook';

function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const input = process.stdin;
    input.setRawMode(true);
    input.resume();
    input.setEncoding('utf8');
    let value = '';
    input.on('data', function onData(chunk) {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          input.setRawMode(false);
          input.pause();
          input.off('data', onData);
          process.stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u0003') process.exit(130);
        value = char === '\u007f' ? value.slice(0, -1) : value + char;
      }
    });
  });
}

const secret = process.env.LS_SIGNING_SECRET || (await askHidden('LemonSqueezy signing secret: '));
if (!secret) {
  console.error('No signing secret: nothing sent.');
  process.exit(1);
}

const now = Date.now();
const payload = {
  meta: {
    event_name: 'order_created',
    test_mode: true,
    custom_data: {
      utm_source: 'meta',
      utm_medium: 'paid_social',
      utm_campaign: 'capi-test',
      ads_consent: '1',
      fbc: `fb.1.${now - 60_000}.capi-test-click`,
      fbp: `fb.1.${now - 120_000}.1234567890`,
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
      page: 'https://autotrim.app/en/pricing',
    },
  },
  data: {
    type: 'orders',
    id: `capi-test-${now}`,
    attributes: {
      user_email: 'capi-test@autotrim.app',
      user_name: 'CAPI Test',
      status: 'paid',
      created_at: new Date(now).toISOString(),
      subtotal_usd: 14900,
      tax_usd: 0,
      total_usd: 14900,
      first_order_item: { product_id: 637169, product_name: 'AutoTrim Perpetual License', variant_name: 'Default' },
    },
  },
};

const body = JSON.stringify(payload);
const res = await fetch(WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Signature': createHmac('sha256', secret).update(body).digest('hex') },
  body,
});
console.log(res.status, await res.text());
console.log(`Order ${payload.data.id}: look for it in Meta's Test events tab and as purchase_test in PostHog.`);

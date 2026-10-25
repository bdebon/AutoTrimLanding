import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  cancelSubscriptionsOf,
  ownsLifetime,
  LIFETIME_PRODUCT,
  SUBSCRIPTION_PRODUCT,
} from '../supabase/functions/lemonsqueezy-webhook/lifetime-switch.ts';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status });

function subscription(id, status, extra = {}) {
  return { id: String(id), attributes: { product_id: SUBSCRIPTION_PRODUCT, status, variant_name: 'Monthly', test_mode: false, ...extra } };
}

/** A fake LemonSqueezy: answers the list with `list`, each DELETE with a cancelled subscription. */
function lemonSqueezy(list, { deleteStatus = 200 } = {}) {
  const calls = [];
  const send = async (url, init) => {
    calls.push({ url, method: init.method, auth: init.headers.Authorization });
    if (init.method === 'DELETE') {
      if (deleteStatus !== 200) return json({ errors: [{ detail: 'nope' }] }, deleteStatus);
      return json({ data: { attributes: { status: 'cancelled', ends_at: '2026-11-22T10:00:00.000000Z' } } });
    }
    return json({ data: list });
  };
  return { calls, send };
}

test('a lifetime purchase cancels the subscriptions that can still charge, and only those', async () => {
  const { calls, send } = lemonSqueezy([
    subscription(1, 'active'),
    subscription(2, 'past_due'),
    subscription(3, 'cancelled'),
    subscription(4, 'expired'),
    subscription(5, 'active', { test_mode: true }),
    subscription(6, 'active', { product_id: 999 }),
  ]);
  const cancelled = await cancelSubscriptionsOf('Jane@Example.com', 'key', send);

  assert.deepEqual(cancelled.map((c) => c.id), ['1', '2']);
  assert.equal(cancelled[0].endsAt, '2026-11-22T10:00:00.000000Z');
  assert.equal(cancelled[0].variantName, 'Monthly');

  const lookup = new URL(calls[0].url);
  assert.equal(lookup.pathname, '/v1/subscriptions');
  assert.equal(lookup.searchParams.get('filter[user_email]'), 'Jane@Example.com');
  assert.equal(lookup.searchParams.get('filter[product_id]'), String(SUBSCRIPTION_PRODUCT));
  assert.deepEqual(
    calls.filter((c) => c.method === 'DELETE').map((c) => new URL(c.url).pathname),
    ['/v1/subscriptions/1', '/v1/subscriptions/2'],
  );
  assert.ok(calls.every((c) => c.auth === 'Bearer key'));
});

test('without an API key, nothing is called and nothing is cancelled', async () => {
  const { calls, send } = lemonSqueezy([subscription(1, 'active')]);
  assert.deepEqual(await cancelSubscriptionsOf('jane@example.com', '', send), []);
  assert.equal(calls.length, 0);
});

test('a refused cancel is left out, and a network error never throws', async () => {
  const refused = lemonSqueezy([subscription(1, 'active')], { deleteStatus: 404 });
  assert.deepEqual(await cancelSubscriptionsOf('jane@example.com', 'key', refused.send), []);

  const offline = async () => {
    throw new Error('offline');
  };
  assert.deepEqual(await cancelSubscriptionsOf('jane@example.com', 'key', offline), []);
  assert.equal(await ownsLifetime('jane@example.com', 'key', offline), false);
});

function order(productId, status, extra = {}) {
  return { attributes: { first_order_item: { product_id: productId }, status, test_mode: false, ...extra } };
}

test('a paid lifetime order makes the email a lifetime owner', async () => {
  const { calls, send } = lemonSqueezy([order(SUBSCRIPTION_PRODUCT, 'paid'), order(LIFETIME_PRODUCT, 'paid')]);
  assert.equal(await ownsLifetime('jane@example.com', 'key', send), true);
  const lookup = new URL(calls[0].url);
  assert.equal(lookup.pathname, '/v1/orders');
  assert.equal(lookup.searchParams.get('filter[user_email]'), 'jane@example.com');

  const partial = lemonSqueezy([order(LIFETIME_PRODUCT, 'partial_refund')]);
  assert.equal(await ownsLifetime('jane@example.com', 'key', partial.send), true);
});

test('a refunded, test or subscription-only history is not a lifetime owner', async () => {
  for (const list of [
    [order(LIFETIME_PRODUCT, 'refunded')],
    [order(LIFETIME_PRODUCT, 'paid', { test_mode: true })],
    [order(SUBSCRIPTION_PRODUCT, 'paid')],
    [],
  ]) {
    const { send } = lemonSqueezy(list);
    assert.equal(await ownsLifetime('jane@example.com', 'key', send), false);
  }
  assert.equal(await ownsLifetime('jane@example.com', '', lemonSqueezy([order(LIFETIME_PRODUCT, 'paid')]).send), false);
});

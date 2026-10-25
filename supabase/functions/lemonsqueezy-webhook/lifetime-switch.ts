// The lifetime license replaces the subscription: a subscriber who buys it must never be charged
// again. LemonSqueezy sees two unrelated products, so the webhook does it: the lifetime order
// cancels the buyer's subscriptions, and the cancellation that follows is not a departure (no
// exit survey, no churn).
//
// Needs LS_API_KEY (LemonSqueezy → Settings → API). Without it, nothing is cancelled and every
// cancellation is treated as a departure, as before.

export const LIFETIME_PRODUCT = 637169;
export const SUBSCRIPTION_PRODUCT = 637170;
const LS_API = "https://api.lemonsqueezy.com/v1";
// The statuses that can still charge: cancelled ones only run to the end of the paid period
const BILLING_STATUSES = new Set(["on_trial", "active", "paused", "past_due", "unpaid"]);
// A partial refund (a discount granted afterwards) leaves the license with its owner
const OWNED_ORDER_STATUSES = new Set(["paid", "partial_refund"]);

type Send = (url: string, init: RequestInit) => Promise<Response>;

export interface CancelledSubscription {
  id: string;
  variantName: string;
  /** End of the period already paid: the subscription key works until then */
  endsAt: string;
}

function headers(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  };
}

/** Cancels every subscription of this email that can still charge. Never throws. */
export async function cancelSubscriptionsOf(email: string, apiKey: string, send: Send = fetch): Promise<CancelledSubscription[]> {
  if (!email) return [];
  if (!apiKey) {
    console.error("LS_API_KEY missing: the subscription of a lifetime buyer was not cancelled");
    return [];
  }
  const cancelled: CancelledSubscription[] = [];
  try {
    const query = new URLSearchParams({
      "filter[user_email]": email,
      "filter[product_id]": String(SUBSCRIPTION_PRODUCT),
      "page[size]": "100",
    });
    const res = await send(`${LS_API}/subscriptions?${query}`, { method: "GET", headers: headers(apiKey) });
    if (!res.ok) {
      console.error("LemonSqueezy subscriptions lookup failed", res.status, await res.text());
      return [];
    }
    const list = (await res.json())?.data ?? [];
    for (const sub of list) {
      const attrs = sub?.attributes ?? {};
      if (attrs.product_id !== SUBSCRIPTION_PRODUCT || attrs.test_mode || !BILLING_STATUSES.has(attrs.status)) continue;
      const del = await send(`${LS_API}/subscriptions/${sub.id}`, { method: "DELETE", headers: headers(apiKey) });
      if (!del.ok) {
        console.error("LemonSqueezy subscription cancel failed", sub.id, del.status, await del.text());
        continue;
      }
      const after = (await del.json())?.data?.attributes ?? {};
      cancelled.push({ id: String(sub.id), variantName: attrs.variant_name ?? "", endsAt: after.ends_at ?? "" });
    }
  } catch (e) {
    console.error("LemonSqueezy subscription cancel error", String(e));
  }
  return cancelled;
}

/** Whether this email owns a lifetime license. Never throws: false when it cannot tell. */
export async function ownsLifetime(email: string, apiKey: string, send: Send = fetch): Promise<boolean> {
  if (!email || !apiKey) return false;
  try {
    const query = new URLSearchParams({ "filter[user_email]": email, "page[size]": "100" });
    const res = await send(`${LS_API}/orders?${query}`, { method: "GET", headers: headers(apiKey) });
    if (!res.ok) {
      console.error("LemonSqueezy orders lookup failed", res.status, await res.text());
      return false;
    }
    const list = (await res.json())?.data ?? [];
    return list.some((order: any) => {
      const attrs = order?.attributes ?? {};
      return attrs.first_order_item?.product_id === LIFETIME_PRODUCT && !attrs.test_mode && OWNED_ORDER_STATUSES.has(attrs.status);
    });
  } catch (e) {
    console.error("LemonSqueezy orders lookup error", String(e));
    return false;
  }
}

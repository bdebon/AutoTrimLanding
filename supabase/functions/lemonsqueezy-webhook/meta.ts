// Purchases reported to Meta's Conversions API, so Meta sees which ads sell: the checkout is
// on LemonSqueezy, where the pixel does not run, so it never sees a sale. Nothing here knows
// LemonSqueezy: when payments move to Stripe, only the call in index.ts changes.
//
// Only with consent to ads: the site puts `ads_consent` and Meta's ids in the checkout's custom
// data (the landing's lib/meta-click.ts). A purchase without it is never sent.
//
// Configuration, from the Supabase function's secrets:
// - META_PIXEL_ID, the pixel (dataset) the purchases go to;
// - META_CAPI_TOKEN, an access token made in Meta's Events Manager (the pixel's Settings,
//   Conversions API). This repository is public: never write its value here;
// - META_TEST_EVENT_CODE, optional, from Events Manager's Test events tab. LemonSqueezy
//   test-mode orders then show up in that tab; without it, they are not sent at all.
//   Real orders never carry it.

import { createHash } from "node:crypto";

// Marketing API versions expire about a year after the next one ships (v24.0 ended on
// 2026-10-06): check developers.facebook.com/docs/graph-api/changelog every year.
export const META_API_VERSION = "v26.0";
const SITE_URL = "https://autotrim.app/";
// Meta refuses the whole request when an event is older than 7 days
const MAX_EVENT_AGE_MS = 6 * 24 * 60 * 60 * 1000;

export interface MetaConfig {
  pixelId: string;
  token: string;
  testEventCode?: string;
}

/** What the site put in the checkout for Meta, with consent to ads. */
export interface MetaCheckout {
  fbc?: string;
  fbp?: string;
  userAgent?: string;
  page?: string;
}

export interface MetaOrder {
  /** Also the event id: Meta keeps one event per id, so a resent webhook counts once. */
  orderId: string;
  createdAt: Date;
  /** What the customer paid, before tax. */
  value: number;
  currency: string;
  email: string;
  /** ISO 3166-1 alpha-2, when known */
  country?: string;
  /** The license bought, e.g. lifetime or monthly */
  contentName?: string;
}

export type MetaStatus = "sent" | "no_consent" | "not_configured" | "test_skipped" | "free" | "failed";

/** Meta's fields from the checkout's custom data, or null without consent to ads. */
export function metaCheckoutFrom(custom: Record<string, unknown>): MetaCheckout | null {
  if (!custom.ads_consent) return null;
  const text = (key: string) => (typeof custom[key] === "string" && custom[key] ? (custom[key] as string) : undefined);
  return { fbc: text("fbc"), fbp: text("fbp"), userAgent: text("ua"), page: text("page") };
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function purchaseEvent(order: MetaOrder, checkout: MetaCheckout, now = new Date()): Record<string, unknown> {
  const userData: Record<string, unknown> = { em: [sha256(order.email)] };
  if (order.country) userData.country = [sha256(order.country)];
  if (checkout.fbc) userData.fbc = checkout.fbc;
  if (checkout.fbp) userData.fbp = checkout.fbp;
  if (checkout.userAgent) userData.client_user_agent = checkout.userAgent;
  // A webhook simulated later from an old test order would be refused: it is sent as of now
  const time = now.getTime() - order.createdAt.getTime() < MAX_EVENT_AGE_MS ? order.createdAt : now;
  return {
    event_name: "Purchase",
    event_time: Math.floor(time.getTime() / 1000),
    event_id: order.orderId,
    action_source: "website",
    event_source_url: checkout.page ?? SITE_URL,
    user_data: userData,
    custom_data: {
      value: Math.round(order.value * 100) / 100,
      currency: order.currency,
      order_id: order.orderId,
      ...(order.contentName ? { content_name: order.contentName } : {}),
    },
  };
}

/**
 * Reports a purchase to Meta, if the checkout carried consent to ads. Never throws: a failure
 * is logged and returned, and the webhook goes on.
 */
export async function reportPurchase(
  order: MetaOrder,
  custom: Record<string, unknown>,
  config: MetaConfig,
  testMode: boolean,
  send: typeof fetch = fetch,
): Promise<MetaStatus> {
  const checkout = metaCheckoutFrom(custom);
  if (!checkout) return "no_consent";
  if (!config.pixelId || !config.token) return "not_configured";
  if (testMode && !config.testEventCode) return "test_skipped";
  if (!(order.value > 0)) return "free";

  const body = {
    data: [purchaseEvent(order, checkout)],
    access_token: config.token,
    ...(testMode ? { test_event_code: config.testEventCode } : {}),
  };
  try {
    const res = await send(`https://graph.facebook.com/${META_API_VERSION}/${config.pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return "sent";
    console.error("Meta error", res.status, order.orderId, await res.text());
  } catch (e) {
    console.error("Meta error", order.orderId, String(e));
  }
  return "failed";
}

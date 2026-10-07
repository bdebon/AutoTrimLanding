// LemonSqueezy -> Customer.io + PostHog bridge for AutoTrim
// Receives LS webhooks, verifies HMAC signature, filters AutoTrim products,
// pushes the person and events to Customer.io (EU) and the revenue events to PostHog.
// GET / responds "ok" — used by the keep-alive ping.
//
// Secrets come from the Supabase function environment (Dashboard → Edge Functions → Secrets):
// CIO_SITE_ID, CIO_API_KEY, LS_SIGNING_SECRET, optional LS_API_KEY. This repository is public:
// never write their values here.

import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";

const CIO_SITE_ID = Deno.env.get("CIO_SITE_ID") ?? "";
const CIO_API_KEY = Deno.env.get("CIO_API_KEY") ?? "";
const LS_SIGNING_SECRET = Deno.env.get("LS_SIGNING_SECRET") ?? "";
const LS_API_KEY = Deno.env.get("LS_API_KEY") ?? ""; // optional — enables country lookup for language routing
// Public project token (same as in the app and the landing): capture only.
const POSTHOG_KEY = "phc_7yAkO5ws3adg6Bc2jvfeh0rM4pVBmsE7xxMZ46l7A1l";
const POSTHOG_CAPTURE = "https://us.i.posthog.com/i/v0/e/";

const CIO_TRACK = "https://track-eu.customer.io/api/v1";
const AUTOTRIM_PRODUCTS = new Set([637169, 637170]); // Perpetual, Subscription
const FR_COUNTRIES = new Set(["FR", "BE", "LU", "MC", "RE", "GP", "MQ", "NC", "PF", "SN", "CI", "MA", "DZ", "TN"]);
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

const cioAuth = "Basic " + Buffer.from(`${CIO_SITE_ID}:${CIO_API_KEY}`).toString("base64");

async function cio(path: string, method: string, body: unknown): Promise<boolean> {
  const res = await fetch(`${CIO_TRACK}${path}`, {
    method,
    headers: { Authorization: cioAuth, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error("CIO error", res.status, path, await res.text());
  return res.ok;
}

async function posthog(event: string, distinctId: string, properties: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(POSTHOG_CAPTURE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: POSTHOG_KEY, event, distinct_id: distinctId, properties, timestamp: new Date().toISOString() }),
    });
    if (!res.ok) console.error("PostHog error", res.status, event, await res.text());
    return res.ok;
  } catch (e) {
    console.error("PostHog error", event, String(e));
    return false;
  }
}

async function lsCustomerCountry(customerId: unknown): Promise<string> {
  if (!LS_API_KEY || !customerId) return "";
  try {
    const res = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${LS_API_KEY}`, Accept: "application/vnd.api+json" },
    });
    if (!res.ok) return "";
    const json = await res.json();
    return json?.data?.attributes?.country ?? "";
  } catch {
    return "";
  }
}

function guessLanguage(country: string, email: string): string {
  if (country) return FR_COUNTRIES.has(country) ? "fr" : "en";
  if (email.endsWith(".fr") || email.endsWith(".be")) return "fr";
  return "en";
}

function licenseType(productId: number, variantName: string): string {
  if (productId === 637169) return "lifetime";
  return /year|annual/i.test(variantName) ? "annual" : "monthly";
}

Deno.serve(async (req: Request) => {
  if (req.method === "GET") return new Response("ok");
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const raw = await req.text();
  const sig = req.headers.get("x-signature") ?? "";
  const digest = createHmac("sha256", LS_SIGNING_SECRET).update(raw).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(sig);
  if (!LS_SIGNING_SECRET || a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const eventName = payload?.meta?.event_name ?? "";
  const testMode = payload?.meta?.test_mode === true;
  const custom = payload?.meta?.custom_data ?? {};
  const attrs = payload?.data?.attributes ?? {};

  if (eventName === "order_created") {
    const item = attrs.first_order_item ?? {};
    if (!AUTOTRIM_PRODUCTS.has(item.product_id)) return new Response("ignored (other product)");
    if (attrs.status === "refunded") return new Response("ignored (refunded)");
    const email = (attrs.user_email ?? "").toLowerCase();
    if (!email) return new Response("ignored (no email)");
    const firstName = (attrs.user_name ?? "").split(" ")[0] ?? "";
    const country = await lsCustomerCountry(attrs.customer_id);
    const language = guessLanguage(country, email);
    const lt = licenseType(item.product_id, item.variant_name ?? "");
    const totalUsd = (attrs.total_usd ?? attrs.total ?? 0) / 100;
    const subtotalUsd = (attrs.subtotal_usd ?? attrs.subtotal ?? 0) / 100;

    // The checkout carries the visitor's PostHog id when the buy link added it;
    // otherwise the purchase lands on a person keyed by the buyer's email.
    const visitorId = typeof custom.visitor_id === "string" && custom.visitor_id ? custom.visitor_id : "";
    const utm: Record<string, string> = {};
    for (const k of UTM_KEYS) if (typeof custom[k] === "string" && custom[k]) utm[k] = custom[k];
    await posthog(testMode ? "purchase_test" : "purchase", visitorId || email, {
      revenue: subtotalUsd,
      total_usd: totalUsd,
      license_type: lt,
      product_name: item.product_name ?? "",
      variant_name: item.variant_name ?? "",
      order_id: payload?.data?.id ?? "",
      attribution: visitorId ? "visitor_id" : "email_only",
      ...utm,
      $set: { email, license_type: lt, ...(firstName ? { first_name: firstName } : {}) },
      $set_once: { first_purchase_at: new Date().toISOString(), first_license_type: lt },
    });

    if (testMode) return new Response("ok purchase (test mode, Customer.io skipped)");

    await cio(`/customers/${encodeURIComponent(email)}`, "PUT", {
      email,
      first_name: firstName,
      language,
      license_type: lt,
      country,
      subscription_status: lt === "lifetime" ? "none" : "active",
    });
    await cio(`/customers/${encodeURIComponent(email)}/events`, "POST", {
      name: "purchase",
      data: { license_type: lt, product_name: item.product_name ?? "", variant_name: item.variant_name ?? "", total_usd: totalUsd, order_id: payload?.data?.id ?? "" },
    });
    return new Response("ok purchase");
  }

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    if (attrs.product_id !== 637170) return new Response("ignored (other product)");
    const email = (attrs.user_email ?? "").toLowerCase();
    if (!email) return new Response("ignored (no email)");
    await posthog(testMode ? "subscription_cancelled_test" : "subscription_cancelled", email, {
      variant_name: attrs.variant_name ?? "",
      ends_at: attrs.ends_at ?? "",
      lemonsqueezy_event: eventName,
      $set: { email, subscription_status: "cancelled" },
    });
    if (testMode) return new Response("ok cancelled (test mode, Customer.io skipped)");
    await cio(`/customers/${encodeURIComponent(email)}`, "PUT", {
      email,
      subscription_status: "cancelled",
    });
    await cio(`/customers/${encodeURIComponent(email)}/events`, "POST", {
      name: "subscription_cancelled",
      data: { variant_name: attrs.variant_name ?? "", ends_at: attrs.ends_at ?? "" },
    });
    return new Response("ok cancelled");
  }

  if (eventName === "subscription_payment_success" || eventName === "subscription_payment_failed") {
    if (attrs.product_id && attrs.product_id !== 637170) return new Response("ignored (other product)");
    const email = (attrs.user_email ?? "").toLowerCase();
    if (!email) return new Response("ignored (no email)");
    const totalUsd = (attrs.total_usd ?? attrs.total ?? 0) / 100;
    const subtotalUsd = (attrs.subtotal_usd ?? attrs.subtotal ?? 0) / 100;
    // The first payment of a subscription is already counted by order_created.
    if (eventName === "subscription_payment_success" && attrs.billing_reason !== "initial") {
      await posthog(testMode ? "subscription_renewed_test" : "subscription_renewed", email, {
        revenue: subtotalUsd,
        total_usd: totalUsd,
        billing_reason: attrs.billing_reason ?? "",
        $set: { email },
      });
    }
    if (testMode) return new Response("ok " + eventName + " (test mode, Customer.io skipped)");
    await cio(`/customers/${encodeURIComponent(email)}/events`, "POST", {
      name: eventName,
      data: { total_usd: totalUsd },
    });
    return new Response("ok " + eventName);
  }

  return new Response("ignored (unhandled event)");
});

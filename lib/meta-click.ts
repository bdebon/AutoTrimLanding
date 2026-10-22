// What Meta needs to tie a purchase to the ad that brought it, handed to the checkout as
// custom data, next to the visitor id. The LemonSqueezy webhook reports the purchase to Meta
// with it (supabase/functions/lemonsqueezy-webhook/meta.ts). Only with consent to ads
// (lib/consent.ts): without it, the checkout carries none of it and Meta hears nothing.
//
// - fbc, the ad click: Meta adds `fbclid` to the address an ad opens. The pixel turns it into
//   the `_fbc` cookie, but only on the page where it loads, and it loads late
//   (app/TrackingScripts.tsx): a visitor who moves on before that loses the click. So the site
//   keeps its own copy, in the pixel's format, for the pixel's 90 days.
// - fbp, the browser: the `_fbp` cookie the pixel sets.
// - the browser's user agent and the page of the buy link: Meta requires both on a purchase
//   reported for a website.

export const FBC_STORAGE_KEY = "autotrim_fbc";
export const FBC_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

export interface AdClick {
  fbclid: string;
  at: number;
}

/** The ad click in a page's query string, if an ad opened it. */
export function adClickFrom(search: string, now = Date.now()): AdClick | null {
  const fbclid = new URLSearchParams(search).get("fbclid")?.trim();
  return fbclid ? { fbclid, at: now } : null;
}

/** The pixel's format: fb.<domain level, 1 for autotrim.app>.<click time in ms>.<fbclid> */
export function fbcFor(click: AdClick): string {
  return `fb.1.${click.at}.${click.fbclid}`;
}

export function storeAdClick(click: AdClick, storage: KeyValueStore): void {
  try {
    storage.setItem(FBC_STORAGE_KEY, fbcFor(click));
  } catch {
    // Storage full or disabled
  }
}

function fbcTime(fbc: string): number {
  const time = Number(fbc.split(".")[2]);
  return Number.isFinite(time) ? time : 0;
}

export function readCookie(cookies: string, name: string): string | null {
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key !== name) continue;
    try {
      return decodeURIComponent(value.join("=")) || null;
    } catch {
      return null;
    }
  }
  return null;
}

/** The latest ad click, from our copy or the pixel's cookie, if not older than 90 days. */
export function latestFbc(cookies: string, storage: KeyValueStore | null, now = Date.now()): string | null {
  let stored: string | null = null;
  try {
    stored = storage?.getItem(FBC_STORAGE_KEY) ?? null;
  } catch {
    // Storage unavailable
  }
  const fresh = [stored, readCookie(cookies, "_fbc")].filter(
    (fbc): fbc is string => !!fbc && now - fbcTime(fbc) <= FBC_MAX_AGE_MS,
  );
  return fresh.sort((a, b) => fbcTime(b) - fbcTime(a))[0] ?? null;
}

export interface MetaCheckoutContext {
  adsAllowed: boolean;
  cookies: string;
  storage: KeyValueStore | null;
  userAgent: string;
  page: string;
  now?: number;
}

/** The checkout's custom data for Meta: nothing without consent to ads. */
export function metaCheckoutData(context: MetaCheckoutContext): Record<string, string> {
  if (!context.adsAllowed) return {};
  const data: Record<string, string> = { ads_consent: "1" };
  const fbc = latestFbc(context.cookies, context.storage, context.now);
  const fbp = readCookie(context.cookies, "_fbp");
  if (fbc) data.fbc = fbc;
  if (fbp) data.fbp = fbp;
  if (context.userAgent) data.ua = context.userAgent;
  if (context.page) data.page = context.page;
  return data;
}

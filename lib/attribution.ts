// Campaign attribution kept in the browser and handed on twice: to the app, inside the
// code the Download button copies to the clipboard, and to the checkout, as custom data.
// It must be captured on whatever page the visitor lands on: most land on the home page,
// which has no download or buy button, then reach /download without the query string.
// So the root layout captures it on every page load (app/PostHogProvider.tsx).

// Short keys: the app decodes this exact shape (AutoTrim's AttributionService.ts)
export interface AttributionData {
  s?: string; // utm_source
  m?: string; // utm_medium
  c?: string; // utm_campaign
  t?: string; // utm_content
  k?: string; // utm_term
  v?: string; // visitor_id (PostHog distinct_id), added when the code is copied
  // Added when the code is copied, with consent to ads only (lib/meta-click.ts):
  a?: 1; // consent to ads
  fc?: string; // the Meta ad click (fbc)
  fp?: string; // the Meta browser id (fbp)
  r?: string; // external referrer
  ts: number; // timestamp
}

export const ATTRIBUTION_STORAGE_KEY = "autotrim_attribution";

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

export function readAttribution(storage: KeyValueStore): AttributionData | null {
  try {
    const stored = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AttributionData) : null;
  } catch {
    return null;
  }
}

/**
 * Records the campaign of this page view. New UTMs replace the stored ones (last touch);
 * a page without UTMs keeps them; a first visit without any is still recorded, with its
 * external referrer.
 */
export function captureAttribution(
  search: string,
  referrer: string,
  host: string,
  storage: KeyValueStore,
  now = Date.now(),
): AttributionData | null {
  const params = new URLSearchParams(search);
  const data: AttributionData = { ts: now };
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");
  if (source) data.s = source;
  if (medium) data.m = medium;
  if (campaign) data.c = campaign;
  if (content) data.t = content;
  if (term) data.k = term;

  const existing = readAttribution(storage);
  const hasUtm = Boolean(source || medium || campaign || content || term);
  if (!hasUtm && existing) return existing;

  if (referrer) {
    try {
      if (new URL(referrer).hostname !== host) data.r = referrer;
    } catch {
      // Not a URL: no referrer
    }
  }
  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or disabled
  }
  return data;
}

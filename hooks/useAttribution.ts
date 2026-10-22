"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { CHECKOUT_URLS } from "@/lib/checkout";
import { captureAttribution, readAttribution, type AttributionData } from "@/lib/attribution";
import { attributionStorage } from "@/lib/attribution-storage";
import { adsAllowed, analyticsAllowed } from "@/lib/consent";
import { metaCheckoutData } from "@/lib/meta-click";

export type { AttributionData } from "@/lib/attribution";

const ATTRIBUTION_PREFIX = "ATR:";
// What posthog-js reports as the distinct id in cookieless mode
const COOKIELESS_DISTINCT_ID = "$posthog_cookieless";

/**
 * Hook to manage marketing attribution tracking.
 * Captures UTM parameters and PostHog visitor ID, stores them in localStorage,
 * and provides a function to copy the attribution code to clipboard.
 * Without consent to analytics (lib/consent.ts), the visitor id is never handed on: the app
 * and the checkout only get the campaign, and nothing is stored (lib/attribution-storage.ts).
 */
export function useAttribution() {
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  // The root layout already captured the landing page (app/PostHogProvider.tsx); this
  // covers a client-side navigation that carries UTMs.
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    try {
      captureAttribution(searchParams.toString(), document.referrer, window.location.hostname, attributionStorage());
    } catch {
      // storage unavailable
    }
  }, [searchParams]);

  /**
   * Copy the attribution code to clipboard.
   * Format: ATR:{base64_encoded_json}
   * Returns true if successful, false otherwise.
   */
  const copyAttributionToClipboard = useCallback(async (): Promise<boolean> => {
    try {
      const attributionData = getStoredAttribution() || { ts: Date.now() };

      const distinctId = visitorId();
      if (distinctId) attributionData.v = distinctId;

      // With consent to ads, what the app needs to report a purchase made from it to Meta
      const meta = metaData();
      if (meta.ads_consent) attributionData.a = 1;
      if (meta.fbc) attributionData.fc = meta.fbc;
      if (meta.fbp) attributionData.fp = meta.fbp;

      // Update timestamp to current time
      attributionData.ts = Date.now();

      // Encode to base64
      const jsonString = JSON.stringify(attributionData);
      const base64 = btoa(jsonString);
      const attributionCode = `${ATTRIBUTION_PREFIX}${base64}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(attributionCode);
      return true;
    } catch (error) {
      console.error("Failed to copy attribution to clipboard:", error);
      return false;
    }
  }, []);

  /**
   * Records the click on the server too, for an app whose first launch finds no code in
   * the clipboard (something else was copied meanwhile): see lib/download-handoff.ts.
   * Fire and forget.
   */
  const recordDownloadHandoff = useCallback((): void => {
    const distinctId = visitorId();
    if (!distinctId) return;
    const attribution = getStoredAttribution();
    fetch("/api/download-handoff", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitor_id: distinctId,
        utm_source: attribution?.s,
        utm_medium: attribution?.m,
        utm_campaign: attribution?.c,
        utm_content: attribution?.t,
        utm_term: attribution?.k,
      }),
    }).catch(() => {});
  }, []);

  /**
   * Get the current attribution data (without copying to clipboard)
   */
  const getAttributionData = useCallback((): AttributionData | null => {
    const data = getStoredAttribution();
    if (!data) return null;

    const distinctId = visitorId();
    if (distinctId) data.v = distinctId;

    return data;
  }, []);

  /**
   * Build a LemonSqueezy checkout URL carrying the visitor id, UTM params and, with consent
   * to ads, Meta's click ids.
   * The base must be a product checkout (see lib/checkout.ts): the store page
   * drops query params, so custom data only survives on a checkout link.
   */
  const buildLemonSqueezyUrl = useCallback(
    (baseUrl: string = CHECKOUT_URLS.subscription): string => {
      const attribution = getStoredAttribution();
      const url = new URL(baseUrl);

      // Add UTM params as checkout custom data
      if (attribution?.s) url.searchParams.set("checkout[custom][utm_source]", attribution.s);
      if (attribution?.m) url.searchParams.set("checkout[custom][utm_medium]", attribution.m);
      if (attribution?.c) url.searchParams.set("checkout[custom][utm_campaign]", attribution.c);
      if (attribution?.t) url.searchParams.set("checkout[custom][utm_content]", attribution.t);
      if (attribution?.k) url.searchParams.set("checkout[custom][utm_term]", attribution.k);

      // Add visitor ID for cross-platform attribution
      const distinctId = visitorId();
      if (distinctId) url.searchParams.set("checkout[custom][visitor_id]", distinctId);

      // With consent to ads, what Meta needs to tie the purchase to the ad (lib/meta-click.ts)
      for (const [key, value] of Object.entries(metaData())) url.searchParams.set(`checkout[custom][${key}]`, value);

      return url.toString();
    },
    []
  );

  return {
    copyAttributionToClipboard,
    recordDownloadHandoff,
    getAttributionData,
    buildLemonSqueezyUrl,
  };
}

function getStoredAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;
  try {
    return readAttribution(attributionStorage());
  } catch {
    return null;
  }
}

function metaData(): Record<string, string> {
  if (typeof window === "undefined") return {};
  let storage: Storage | null = null;
  try {
    storage = localStorage;
  } catch {
    // localStorage unavailable
  }
  return metaCheckoutData({
    adsAllowed: adsAllowed(),
    cookies: document.cookie,
    storage,
    userAgent: navigator.userAgent,
    page: window.location.origin + window.location.pathname,
  });
}

/** The PostHog visitor id, only with consent to analytics, and never the cookieless placeholder. */
function visitorId(): string | null {
  if (!analyticsAllowed() || typeof posthog === "undefined" || !posthog.__loaded) return null;
  if (posthog.get_explicit_consent_status() === "denied") return null;
  const distinctId = posthog.get_distinct_id();
  return distinctId && distinctId !== COOKIELESS_DISTINCT_ID ? distinctId : null;
}

export default useAttribution;

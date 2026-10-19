"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { CHECKOUT_URLS } from "@/lib/checkout";
import { captureAttribution, readAttribution, type AttributionData } from "@/lib/attribution";

export type { AttributionData } from "@/lib/attribution";

const ATTRIBUTION_PREFIX = "ATR:";

/**
 * Hook to manage marketing attribution tracking.
 * Captures UTM parameters and PostHog visitor ID, stores them in localStorage,
 * and provides a function to copy the attribution code to clipboard.
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
      captureAttribution(searchParams.toString(), document.referrer, window.location.hostname, localStorage);
    } catch {
      // localStorage unavailable
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

      // Get PostHog visitor ID if available
      if (typeof posthog !== "undefined" && posthog.__loaded) {
        const distinctId = posthog.get_distinct_id();
        if (distinctId) {
          attributionData.v = distinctId;
        }
      }

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
   * Get the current attribution data (without copying to clipboard)
   */
  const getAttributionData = useCallback((): AttributionData | null => {
    const data = getStoredAttribution();
    if (!data) return null;

    // Add PostHog visitor ID if available
    if (typeof posthog !== "undefined" && posthog.__loaded) {
      const distinctId = posthog.get_distinct_id();
      if (distinctId) {
        data.v = distinctId;
      }
    }

    return data;
  }, []);

  /**
   * Build a LemonSqueezy checkout URL carrying the visitor id and UTM params.
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
      if (typeof posthog !== "undefined" && posthog.__loaded) {
        const distinctId = posthog.get_distinct_id();
        if (distinctId) {
          url.searchParams.set("checkout[custom][visitor_id]", distinctId);
        }
      }

      return url.toString();
    },
    []
  );

  return {
    copyAttributionToClipboard,
    getAttributionData,
    buildLemonSqueezyUrl,
  };
}

function getStoredAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;
  try {
    return readAttribution(localStorage);
  } catch {
    return null;
  }
}

export default useAttribution;

"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";

// Attribution data structure matching what the app expects
export interface AttributionData {
  s?: string; // utm_source
  m?: string; // utm_medium
  c?: string; // utm_campaign
  t?: string; // utm_content
  k?: string; // utm_term
  v?: string; // visitor_id (PostHog distinct_id)
  r?: string; // referrer
  ts: number; // timestamp
}

const STORAGE_KEY = "autotrim_attribution";
const ATTRIBUTION_PREFIX = "ATR:";

// Validate UTM parameters to prevent injection attacks
const isValidUtmParam = (value: string | null): value is string => {
  if (!value) return false;
  return /^[a-zA-Z0-9_\-\.~]{1,200}$/.test(value);
};

/**
 * Hook to manage marketing attribution tracking.
 * Captures UTM parameters and PostHog visitor ID, stores them in localStorage,
 * and provides a function to copy the attribution code to clipboard.
 */
export function useAttribution() {
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  // Capture and store attribution data on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmContent = searchParams.get("utm_content");
    const utmTerm = searchParams.get("utm_term");

    // Only store if we have at least one UTM param or it's the first visit
    const hasUtmParams = utmSource || utmMedium || utmCampaign || utmContent || utmTerm;
    const existingData = getStoredAttribution();

    // Update attribution data if we have new UTM params
    if (hasUtmParams || !existingData) {
      const attributionData: AttributionData = {
        ts: Date.now(),
      };

      if (isValidUtmParam(utmSource)) attributionData.s = utmSource;
      if (isValidUtmParam(utmMedium)) attributionData.m = utmMedium;
      if (isValidUtmParam(utmCampaign)) attributionData.c = utmCampaign;
      if (isValidUtmParam(utmContent)) attributionData.t = utmContent;
      if (isValidUtmParam(utmTerm)) attributionData.k = utmTerm;

      // Capture referrer on first visit (hostname only for privacy)
      if (typeof document !== "undefined" && document.referrer) {
        try {
          const referrerUrl = new URL(document.referrer);
          // Only store external referrers - hostname only to avoid sensitive data
          if (referrerUrl.hostname !== window.location.hostname) {
            attributionData.r = referrerUrl.hostname;
          }
        } catch {
          // Invalid referrer URL, skip it
        }
      }

      storeAttribution(attributionData);
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
   * Build LemonSqueezy checkout URL with UTM params
   */
  const buildLemonSqueezyUrl = useCallback(
    (baseUrl: string = "https://autotrim.lemonsqueezy.com/"): string => {
      const attribution = getStoredAttribution();
      if (!attribution) return baseUrl;

      const url = new URL(baseUrl);

      // Add UTM params as checkout custom data
      if (attribution.s) url.searchParams.set("checkout[custom][utm_source]", attribution.s);
      if (attribution.m) url.searchParams.set("checkout[custom][utm_medium]", attribution.m);
      if (attribution.c) url.searchParams.set("checkout[custom][utm_campaign]", attribution.c);
      if (attribution.t) url.searchParams.set("checkout[custom][utm_content]", attribution.t);
      if (attribution.k) url.searchParams.set("checkout[custom][utm_term]", attribution.k);

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

// Helper functions for localStorage

function getStoredAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AttributionData;
    }
  } catch {
    // Invalid JSON, return null
  }

  return null;
}

function storeAttribution(data: AttributionData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or disabled
  }
}

export default useAttribution;

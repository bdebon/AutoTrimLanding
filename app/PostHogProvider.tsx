"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { attributionStorage, settleAttributionStorage } from "@/lib/attribution-storage";
import { getConsentState, subscribeConsent, allows } from "@/lib/consent";

const POSTHOG_KEY = "phc_7yAkO5ws3adg6Bc2jvfeh0rM4pVBmsE7xxMZ46l7A1l";
// Our own path, proxied to PostHog by the rewrites in next.config.ts, so ad blockers
// let it through. The UI host keeps the toolbar and links on posthog.com.
const POSTHOG_API_HOST = "/ingest";
const POSTHOG_UI_HOST = "https://us.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    settleAttributionStorage();
    // Every page load records the campaign it came with, whatever the page: the visitor
    // often lands on the home page, which has no download or buy button (lib/attribution.ts).
    try {
      captureAttribution(window.location.search, document.referrer, window.location.hostname, attributionStorage());
    } catch {
      // storage unavailable
    }
    if (typeof window !== "undefined" && !posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_API_HOST,
        ui_host: POSTHOG_UI_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: "localStorage+cookie",
        // Visitors who must be asked are counted without any cookie or stored identifier
        // until they accept analytics (lib/consent.ts). PostHog drops these events unless
        // cookieless mode is on in the project settings.
        ...(getConsentState().required ? { cookieless_mode: "on_reject" as const } : {}),
      });
    }
    applyAnalyticsConsent();
    return subscribeConsent(() => {
      applyAnalyticsConsent();
      settleAttributionStorage();
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Keeps PostHog in line with the visitor's choice. A refusal, or no answer yet where we
 * must ask, switches it to cookieless counting; an acceptance after that starts a new,
 * cookie-based identity that nothing links to the cookieless visits. A visitor nobody
 * asked is left as PostHog starts: in.
 */
function applyAnalyticsConsent(): void {
  if (!posthog.__loaded) return;
  const state = getConsentState();
  const status = posthog.get_explicit_consent_status();
  if (allows(state, "analytics")) {
    if (status === "denied" || (state.required && status === "pending")) {
      posthog.opt_in_capturing({ captureEventName: false });
    }
  } else if (status !== "denied") {
    posthog.opt_out_capturing();
    // A first page load starts a session before the switch, and leaves its window id behind
    try {
      Object.keys(sessionStorage)
        .filter((key) => key.startsWith(`ph_${POSTHOG_KEY}`))
        .forEach((key) => sessionStorage.removeItem(key));
    } catch {
      // sessionStorage unavailable
    }
  }
}

export default PostHogProvider;

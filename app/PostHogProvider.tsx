"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

const POSTHOG_KEY = "phc_7yAkO5ws3adg6Bc2jvfeh0rM4pVBmsE7xxMZ46l7A1l";
// Our own path, proxied to PostHog by the rewrites in next.config.ts, so ad blockers
// let it through. The UI host keeps the toolbar and links on posthog.com.
const POSTHOG_API_HOST = "/ingest";
const POSTHOG_UI_HOST = "https://us.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Every page load records the campaign it came with, whatever the page: the visitor
    // often lands on the home page, which has no download or buy button (lib/attribution.ts).
    try {
      captureAttribution(window.location.search, document.referrer, window.location.hostname, localStorage);
    } catch {
      // localStorage unavailable
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
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export default PostHogProvider;

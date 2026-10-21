"use client";

import { openConsentSettings } from "@/lib/consent";

/** Reopens the cookie choices (app/ConsentBanner.tsx): withdrawing must be as easy as accepting. */
export default function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {label}
    </button>
  );
}

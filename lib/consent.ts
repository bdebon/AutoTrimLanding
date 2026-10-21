// Consent for the website's trackers. Visitors from the EU, the EEA, the UK and Switzerland
// are asked first (GDPR and the ePrivacy rules, enforced by the CNIL in France); elsewhere
// nothing is asked, but the footer's "Cookies" link lets anyone turn the trackers off.
//
// Two purposes, chosen separately:
// - analytics: PostHog with its cookie and local storage, which links a visit to the app it
//   downloads and to a purchase. Without it, PostHog only counts visits, with no cookie and
//   no stored identifier (cookieless mode, app/PostHogProvider.tsx).
// - ads: the Meta Pixel and Google Tag Manager, loaded only with it (app/TrackingScripts.tsx).
//
// The choice is kept in localStorage for 6 months, as the CNIL recommends, then asked again.
// The region comes from the device's time zone: no request, it works on static pages, and a
// VPN does not change it. A time zone we cannot read counts as one where we must ask.

export type ConsentPurpose = "analytics" | "ads";
export type ConsentChoice = Record<ConsentPurpose, boolean>;

export interface ConsentState {
  /** This visitor must be asked before any tracker runs. */
  required: boolean;
  /** Their answer, or null while they have not given one. */
  choice: ConsentChoice | null;
}

export const CONSENT_STORAGE_KEY = "autotrim_consent";
/** Raise it when the purposes change, to ask everyone again. */
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;
type StoredConsent = { v: number; analytics: boolean; ads: boolean; ts: number };

// EU and EEA territories outside the Europe/ zones, and the legacy aliases of European zones
const EUROPEAN_TIME_ZONES = new Set([
  "Atlantic/Azores", "Atlantic/Canary", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik",
  "Arctic/Longyearbyen", "Asia/Famagusta", "Asia/Nicosia",
  "America/Cayenne", "America/Guadeloupe", "America/Marigot", "America/Martinique", "America/St_Barthelemy",
  "Indian/Mayotte", "Indian/Reunion",
  "CET", "EET", "MET", "WET", "Eire", "GB", "GB-Eire", "Iceland", "Poland", "Portugal",
]);

export function consentRequiredForTimeZone(timeZone: string | undefined): boolean {
  if (!timeZone) return true;
  return timeZone.startsWith("Europe/") || EUROPEAN_TIME_ZONES.has(timeZone);
}

export function readChoice(storage: KeyValueStore, now = Date.now()): ConsentChoice | null {
  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredConsent;
    if (stored.v !== CONSENT_VERSION || typeof stored.ts !== "number") return null;
    if (now - stored.ts > CONSENT_MAX_AGE_MS) return null;
    return { analytics: stored.analytics === true, ads: stored.ads === true };
  } catch {
    return null;
  }
}

export function writeChoice(storage: KeyValueStore, choice: ConsentChoice, now = Date.now()): void {
  const stored: StoredConsent = { v: CONSENT_VERSION, analytics: choice.analytics, ads: choice.ads, ts: now };
  try {
    storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage disabled: the choice holds for this page only
  }
}

/** Whether a purpose may run: the visitor's answer, or, when nobody asked them, yes. */
export function allows(state: ConsentState, purpose: ConsentPurpose): boolean {
  return state.choice ? state.choice[purpose] : !state.required;
}

// The browser side: one state for the page, read once, that the banner, the scripts and the
// attribution code all follow.

export const CONSENT_REGION_OVERRIDE_KEY = "autotrim_consent_region";
const SERVER_STATE: ConsentState = { required: true, choice: null };

let state: ConsentState | null = null;
let settingsOpen = false;
const listeners = new Set<() => void>();

function initialState(): ConsentState {
  let choice: ConsentChoice | null = null;
  try {
    choice = readChoice(localStorage);
  } catch {
    // localStorage unavailable
  }
  return { required: regionRequiresConsent(), choice };
}

/**
 * The device's region, unless the address forces one for testing from elsewhere:
 * ?consent_region=eu (asked) or ?consent_region=world (not asked) holds for the tab,
 * ?consent_region=auto goes back to the time zone.
 */
function regionRequiresConsent(): boolean {
  try {
    const forced = new URLSearchParams(window.location.search).get("consent_region");
    if (forced === "auto") sessionStorage.removeItem(CONSENT_REGION_OVERRIDE_KEY);
    else if (forced === "eu" || forced === "world") sessionStorage.setItem(CONSENT_REGION_OVERRIDE_KEY, forced);
    const override = sessionStorage.getItem(CONSENT_REGION_OVERRIDE_KEY);
    if (override === "eu") return true;
    if (override === "world") return false;
  } catch {
    // sessionStorage unavailable
  }
  try {
    return consentRequiredForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return true;
  }
}

export function getConsentState(): ConsentState {
  if (typeof window === "undefined") return SERVER_STATE;
  if (!state) state = initialState();
  return state;
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    writeChoice(localStorage, choice);
  } catch {
    // localStorage unavailable
  }
  state = { required: getConsentState().required, choice };
  settingsOpen = false;
  notify();
}

/** The footer's "Cookies" link: shows the choices again, whatever the region. */
export function openConsentSettings(): void {
  settingsOpen = true;
  notify();
}

export function closeConsentSettings(): void {
  settingsOpen = false;
  notify();
}

export function consentSettingsOpen(): boolean {
  return settingsOpen;
}

export function analyticsAllowed(): boolean {
  return allows(getConsentState(), "analytics");
}

export function adsAllowed(): boolean {
  return allows(getConsentState(), "ads");
}

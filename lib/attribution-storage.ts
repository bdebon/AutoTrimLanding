import { ATTRIBUTION_STORAGE_KEY } from "./attribution";
import { analyticsAllowed } from "./consent";

// Where the campaign of the visit is kept (lib/attribution.ts). With analytics accepted, or
// where nobody has to be asked, it is localStorage, so it survives the visit. Otherwise it
// stays in memory: the code copied by the Download button still carries the campaign during
// this visit, and nothing is written to the browser.

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

const memory = new Map<string, string>();
const memoryStore: KeyValueStore = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => void memory.set(key, String(value)),
};

export function attributionStorage(): KeyValueStore {
  if (!analyticsAllowed()) return memoryStore;
  try {
    return localStorage;
  } catch {
    return memoryStore;
  }
}

/** After a change of mind: an acceptance keeps this visit's campaign, a refusal erases it. */
export function settleAttributionStorage(): void {
  try {
    if (analyticsAllowed()) {
      const kept = memory.get(ATTRIBUTION_STORAGE_KEY);
      if (kept && !localStorage.getItem(ATTRIBUTION_STORAGE_KEY)) localStorage.setItem(ATTRIBUTION_STORAGE_KEY, kept);
    } else {
      const stored = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      if (stored && !memory.has(ATTRIBUTION_STORAGE_KEY)) memory.set(ATTRIBUTION_STORAGE_KEY, stored);
      localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable
  }
}

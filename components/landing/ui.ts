/** Shared layout and control classes of the landing, built on the app's tokens. */

export const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";

export const eyebrow =
  "font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-at-dim";

export const h2 =
  "font-display text-[32px] font-bold leading-[1.05] text-at-text sm:text-[40px] lg:text-[48px]";

export const body =
  "font-ui text-[17px] leading-[1.55] text-at-muted sm:text-[18px]";

const btnBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-pill px-6 font-ui text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-at-accent focus-visible:ring-offset-2 focus-visible:ring-offset-at-app";

/** Text on the accent is dark, never white. */
export const btn = {
  primary: `${btnBase} bg-at-accent text-at-on-accent hover:bg-[#FF7047]`,
  ghost: `${btnBase} border border-at-border-hi bg-transparent text-at-text hover:bg-at-card-hi`,
  quiet: `${btnBase} bg-transparent text-at-muted hover:text-at-text`,
} as const;

export const card =
  "rounded-card-lg border border-at-border bg-at-card";

export const capsuleLang = (locale: string): "fr" | "en" =>
  locale === "fr" ? "fr" : "en";

// Figures written the way the app writes them (frontend/src/utils/format.ts, locales).

export type Lang = "fr" | "en";

/** 59:45, 1:02:14. Seconds are floored, like the app. */
export const formatDuration = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0
    ? `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${mins}:${String(secs).padStart(2, "0")}`;
};

/** "−36 %" in French, "−36%" in English (ui.queue.shorterShort). */
export const formatShorter = (percent: number, lang: Lang) =>
  lang === "fr" ? `−${Math.round(percent)}\u00A0%` : `−${Math.round(percent)}%`;

export const formatCount = (value: number, lang: Lang) =>
  new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(Math.round(value));

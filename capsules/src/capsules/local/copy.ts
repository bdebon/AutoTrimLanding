export type LocalCopy = {
  lang: "fr" | "en";
  title: string;
  line: string;
  analysing: string;
  file: string;
  wifiOff: string;
  /** A screen recording of the real app analysing, in public/ (e.g. "recordings/local-fr.mp4"). Empty: the drawn card. */
  recording: string;
};

export const localFr: LocalCopy = {
  lang: "fr",
  title: "Tout se passe sur votre machine.",
  line: "Aucun fichier envoyé. Jamais.",
  analysing: "Analyse",
  file: "2025-09-05_21-00-54.mp4",
  wifiOff: "Wi‑Fi désactivé",
  recording: "recordings/local-fr.mp4",
};

export const localEn: LocalCopy = {
  lang: "en",
  title: "Everything happens on your machine.",
  line: "No file uploaded. Ever.",
  analysing: "Analysing",
  file: "2025-09-05_21-00-54.mp4",
  wifiOff: "Wi‑Fi off",
  recording: "recordings/local-en.mp4",
};

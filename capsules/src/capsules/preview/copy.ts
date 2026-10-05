export type PreviewCopy = {
  lang: "fr" | "en";
  title: string;
  legend: string;
  playback: string;
  kept: string;
  silence: string;
  hesitation: string;
};

export const previewFr: PreviewCopy = {
  lang: "fr",
  title: "Regardez avant d’exporter.",
  legend: "Gardé, silence, hésitation. Zoomez sur une minute.",
  playback: "Lecture",
  kept: "Gardé",
  silence: "Silence",
  hesitation: "Hésitation",
};

export const previewEn: PreviewCopy = {
  lang: "en",
  title: "Watch before you export.",
  legend: "Kept, silence, hesitation. Zoom into a minute.",
  playback: "Playback",
  kept: "Kept",
  silence: "Silence",
  hesitation: "Hesitation",
};

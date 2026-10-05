export type TimelineCopy = {
  lang: "fr" | "en";
  title: string;
  legend: string;
  exportVerb: string;
  menuTitle: string;
  project: string;
  /** "+{n} images". */
  nudge: string;
};

export const timelineFr: TimelineCopy = {
  lang: "fr",
  title: "Votre timeline, pas notre export.",
  legend: "Chaque coupe reste éditable.",
  exportVerb: "Exporter la timeline",
  menuTitle: "Timeline pour",
  project: "Tournage du 5 sept",
  nudge: "+{n} images",
};

export const timelineEn: TimelineCopy = {
  lang: "en",
  title: "Your timeline, not our export.",
  legend: "Every cut still yours.",
  exportVerb: "Export timeline",
  menuTitle: "Timeline for",
  project: "Shoot · Sep 5",
  nudge: "+{n} frames",
};

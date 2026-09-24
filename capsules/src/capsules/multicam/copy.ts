// Copy of the multicam drop scene. UI strings are the app's own (frontend/src/i18n/locales).

export type MulticamCopy = {
  lang: "fr" | "en";
  caption: string;
  groupTitle: string;
  /** "{n} fichiers synchronisés · {d}". */
  groupSubtitle: string;
  syncLabel: string;
  mainSound: string;
  mainAngle: string;
  /** Lanes in order: two mics, the main angle, the two other cameras. */
  rowNames: string[];
};

export const multicamFr: MulticamCopy = {
  lang: "fr",
  caption: "Plusieurs caméras, plusieurs micros, un seul drop.",
  groupTitle: "Groupe · 3 angles, 2 micros",
  groupSubtitle: "{n} fichiers synchronisés · {d}",
  syncLabel: "Synchro sûre",
  mainSound: "Son principal",
  mainAngle: "Angle principal",
  rowNames: ["Micro Marc", "Micro Julie", "Cam A · large", "Cam B · Marc", "Cam C · Julie"],
};

export const multicamEn: MulticamCopy = {
  lang: "en",
  caption: "Several cameras, several mics, one drop.",
  groupTitle: "Group · 3 angles, 2 mics",
  groupSubtitle: "{n} files in sync · {d}",
  syncLabel: "Sync confirmed",
  mainSound: "Main sound",
  mainAngle: "Main angle",
  rowNames: ["Marc’s mic", "Julie’s mic", "Cam A · wide", "Cam B · Marc", "Cam C · Julie"],
};

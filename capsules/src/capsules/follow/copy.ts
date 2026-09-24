export type FollowCopy = {
  lang: "fr" | "en";
  title: string;
  legend: string;
  /** Wide, Marc, Julie. */
  angles: [string, string, string];
};

export const followFr: FollowCopy = {
  lang: "fr",
  title: "Le montage suit celui qui parle.",
  legend: "Chaque caméra sur la personne qu’elle filme. Le plan large quand tout le monde parle.",
  angles: ["Cam A · large", "Cam B · Marc", "Cam C · Julie"],
};

export const followEn: FollowCopy = {
  lang: "en",
  title: "The cut follows who’s talking.",
  legend: "Each camera on the person it films. The wide shot when everyone talks.",
  angles: ["Cam A · wide", "Cam B · Marc", "Cam C · Julie"],
};

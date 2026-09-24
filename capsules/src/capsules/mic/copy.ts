export type MicCopy = {
  lang: "fr" | "en";
  title: string;
  legend: string;
  rows: [string, string];
};

export const micFr: MicCopy = {
  lang: "fr",
  title: "Chaque micro, sa voix.",
  legend: "Une coupe seulement quand personne ne parle.",
  rows: ["Micro Marc", "Micro Julie"],
};

export const micEn: MicCopy = {
  lang: "en",
  title: "One mic per person.",
  legend: "A cut only when nobody speaks.",
  rows: ["Marc’s mic", "Julie’s mic"],
};

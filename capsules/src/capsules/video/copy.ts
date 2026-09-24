export type VideoCopy = {
  lang: "fr" | "en";
  title: string;
  zipName: string;
  /** "{n} MP4". */
  count: string;
};

export const videoFr: VideoCopy = { lang: "fr", title: "Ou juste la vidéo.", zipName: "Tournage · 5 sept.zip", count: "{n} MP4" };
export const videoEn: VideoCopy = { lang: "en", title: "Or just the video.", zipName: "Shoot · Sep 5.zip", count: "{n} MP4" };

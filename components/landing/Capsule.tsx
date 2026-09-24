import fs from "node:fs";
import path from "node:path";
import { useTranslations } from "next-intl";
import CapsuleVideo, { type CapsuleSource } from "./CapsuleVideo";

/**
 * <Capsule name="euh" lang="fr" /> looks for public/capsules/<name>-<lang>.{webm,mp4,webp,png}
 * at render time and hands what exists to the player. Missing render: the poster
 * alone, or a drawn placeholder with the capsule's title.
 */
export default function Capsule({
  name,
  lang,
  number,
  title,
  priority = false,
  tapOnMobile = false,
}: {
  name: string;
  lang: "fr" | "en";
  number: number;
  title: string;
  priority?: boolean;
  tapOnMobile?: boolean;
}) {
  const t = useTranslations("landing.capsule");
  const base = `${name}-${lang}`;
  const dir = path.join(process.cwd(), "public", "capsules");
  const has = (ext: string) => fs.existsSync(path.join(dir, `${base}.${ext}`));

  const sources: CapsuleSource[] = [];
  if (has("webm")) sources.push({ src: `/capsules/${base}.webm`, type: "video/webm" });
  if (has("mp4")) sources.push({ src: `/capsules/${base}.mp4`, type: "video/mp4" });
  const poster = has("webp") ? `/capsules/${base}.webp` : has("png") ? `/capsules/${base}.png` : null;

  return (
    <CapsuleVideo
      name={name}
      title={title}
      label={t("label", { number })}
      pendingLabel={t("pending")}
      playLabel={t("play")}
      pauseLabel={t("pause")}
      sources={sources}
      poster={poster}
      priority={priority}
      tapOnMobile={tapOnMobile}
    />
  );
}

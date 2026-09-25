import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * A screenshot of the real app (brief §6, captures A–D). Looks for
 * public/app/<name>-<lang>.png, then <name>.png; without a file, a reserved frame at the
 * app window's ratio (about 1280×800 at 2×) so nothing shifts when the image lands.
 */
export default function Screenshot({
  name,
  lang,
  label,
  alt,
  /** The reserved frame's ratio; a real capture shows at its own ratio, nothing cropped. */
  ratio = "1280 / 800",
  className = "",
  priority = false,
}: {
  name: string;
  lang: "fr" | "en";
  label: string;
  alt?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  const t = useTranslations("landing.screenshot");
  const dir = path.join(process.cwd(), "public", "app");
  const candidates = [`${name}-${lang}.webp`, `${name}.webp`, `${name}-${lang}.png`, `${name}.png`, `${name}-${lang}.jpg`, `${name}.jpg`];
  const file = candidates.find((f) => fs.existsSync(path.join(dir, f)));

  if (file) {
    return (
      <figure className={`relative w-full overflow-hidden rounded-card-lg border border-at-border bg-at-panel ${className}`} style={{ aspectRatio: "2400 / 1584" }}>
        <Image src={`/app/${file}`} alt={alt ?? label} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover object-right-bottom" priority={priority} />
      </figure>
    );
  }

  return (
    <figure
      className={`relative w-full overflow-hidden rounded-card-lg border border-at-border bg-at-panel ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-at-hairline px-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-at-border-hi" />
        <span className="h-2 w-2 rounded-full bg-at-border-hi" />
        <span className="h-2 w-2 rounded-full bg-at-border-hi" />
      </div>
      <figcaption className="absolute inset-x-0 top-8 bottom-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="font-ui text-[13.5px] leading-snug text-at-muted">{label}</span>
        <span className="font-ui text-[11.5px] text-at-faint">{t("pending")}</span>
      </figcaption>
    </figure>
  );
}

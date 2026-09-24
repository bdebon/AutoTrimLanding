import { useTranslations } from "next-intl";

/**
 * A reserved slot for a screenshot of the packaged v2 app (brief §6, captures A–D).
 * Same ratio as the app window it will hold (about 1280×800 at 2×), so nothing
 * shifts when the image lands. No app UI is drawn here beyond the frame.
 */
export default function Screenshot({
  label,
  ratio = "1280 / 800",
  className = "",
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  const t = useTranslations("landing.screenshot");
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

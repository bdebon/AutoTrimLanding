import type { ReactNode } from "react";
import TrackView from "./TrackView";
import Reveal from "./Reveal";
import { container, eyebrow as eyebrowClass, h2, body as bodyClass } from "./ui";

/**
 * A landing section: eyebrow, title, body, then whatever the section shows.
 * `align` centres the header (multicam, pricing, FAQ) or keeps it left inside a grid.
 */
export default function Section({
  id,
  track = id,
  eyebrow,
  title,
  body,
  align = "left",
  narrow = false,
  children,
  className = "",
  titleClassName = "",
}: {
  id: string;
  track?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  align?: "left" | "center";
  narrow?: boolean;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  const header =
    title || eyebrow || body ? (
      <Reveal
        as="header"
        className={`${align === "center" ? "mx-auto text-center" : ""} ${
          narrow ? "max-w-3xl" : "max-w-2xl"
        }`}
      >
        {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
        {title && <h2 className={`${h2} ${eyebrow ? "mt-4" : ""} ${titleClassName}`}>{title}</h2>}
        {body && <p className={`${bodyClass} mt-6`}>{body}</p>}
      </Reveal>
    ) : null;

  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-28 ${className}`}>
      <TrackView section={track} />
      <div className={container}>
        {header}
        {children}
      </div>
    </section>
  );
}

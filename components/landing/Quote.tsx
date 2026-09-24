import Image from "next/image";

/** A short testimonial. Without a photo: the initial on an accent tile, never a generic avatar. */
export default function Quote({
  text,
  name,
  role,
  avatar,
  compact = false,
}: {
  text: string;
  name: string;
  role?: string;
  avatar?: string | null;
  compact?: boolean;
}) {
  return (
    <figure
      className={`flex h-full flex-col justify-between rounded-card-lg border border-at-border bg-at-card ${
        compact ? "p-5" : "p-6 sm:p-7"
      }`}
    >
      <blockquote
        className={`font-ui leading-[1.5] text-at-text ${compact ? "text-[15px]" : "text-[17px]"}`}
      >
        <p>{text}</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-tile bg-at-accent font-display text-[17px] font-bold text-at-on-accent"
          >
            {name.charAt(0)}
          </span>
        )}
        <span className="flex flex-col">
          <span className="font-ui text-[14px] font-semibold text-at-text">{name}</span>
          {role && <span className="font-ui text-[12.5px] text-at-dim">{role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

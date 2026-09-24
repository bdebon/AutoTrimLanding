import Link from "next/link";

/** The app's pulse glyph (LogoGlyph, 16-unit grid) on its accent tile, and the wordmark. */
export const PULSE_PATH = "M1.5 8H3l1.3-4.4L6.6 12.4l2-7.6L10.2 8h4.3";

export function PulseTile({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center bg-at-accent"
      style={{ width: size, height: size, borderRadius: size * (186 / 824) }}
    >
      <svg width={size * 0.74} height={size * 0.74} viewBox="0 0 16 16" fill="none">
        <path
          d={PULSE_PATH}
          stroke="var(--at-on-accent)"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Logo({ href = "/", size = 28 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="AutoTrim">
      <PulseTile size={size} />
      <span className="font-display text-[20px] font-bold leading-none text-at-text">
        AutoTrim
      </span>
    </Link>
  );
}

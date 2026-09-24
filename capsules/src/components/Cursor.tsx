import React from "react";

/**
 * A macOS pointer, for the moments a hand does something (open a menu, drag a cut).
 * `kind` "grab" is the closed hand of a drag. `press` (0..1) shrinks it a little, a click.
 */
export const Cursor: React.FC<{ x: number; y: number; size: number; kind?: "arrow" | "grab"; press?: number; opacity?: number }> = ({
  x,
  y,
  size,
  kind = "arrow",
  press = 0,
  opacity = 1,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    style={{
      position: "absolute",
      left: kind === "arrow" ? x - size * 0.28 : x - size / 2,
      top: kind === "arrow" ? y - size * 0.18 : y - size / 2,
      transform: `scale(${1 - 0.12 * press})`,
      transformOrigin: kind === "arrow" ? "28% 18%" : "50% 50%",
      opacity,
      overflow: "visible",
      filter: `drop-shadow(0 ${size * 0.04}px ${size * 0.08}px rgba(0,0,0,0.55))`,
    }}
  >
    {kind === "arrow" ? (
      <path
        d="M9 5.5v19.2l4.6-4.5 3 7 3.4-1.5-3-6.8h6.4z"
        fill="#FFFFFF"
        stroke="#14100E"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M11 13.5v-1.8a1.7 1.7 0 0 1 3.4 0v1.2-2.4a1.7 1.7 0 0 1 3.4 0v2.4-1.6a1.7 1.7 0 0 1 3.4 0v2.2a1.7 1.7 0 0 1 3.3.4v5.4c0 4-2.6 6.7-6.6 6.7h-1.2c-2.4 0-4.1-1-5.4-3l-3-4.6a1.7 1.7 0 0 1 2.7-2z"
        fill="#FFFFFF"
        stroke="#14100E"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    )}
  </svg>
);

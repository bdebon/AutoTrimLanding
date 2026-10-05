import React from "react";

// Glyphs of frontend/src/ui/icons.tsx, same grids and strokes. Stroke-only, currentColor.

type Glyph = { viewBox: string; stroke: number; filled?: boolean; body: React.ReactNode };

const GLYPHS = {
  camera: {
    viewBox: "0 0 24 24",
    stroke: 1.6,
    body: (
      <>
        <rect x="2.5" y="6" width="14" height="12" rx="2.4" />
        <path d="M16.5 10.5l5-2.6v8.2l-5-2.6z" />
      </>
    ),
  },
  mic: {
    viewBox: "0 0 20 20",
    stroke: 1.7,
    body: (
      <>
        <rect x="7" y="2.5" width="6" height="10" rx="3" />
        <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" />
      </>
    ),
  },
  group: {
    viewBox: "0 0 20 20",
    stroke: 1.7,
    body: (
      <>
        <rect x="2.5" y="4" width="15" height="4" rx="1.4" />
        <rect x="2.5" y="12" width="15" height="4" rx="1.4" />
      </>
    ),
  },
  check: { viewBox: "0 0 20 20", stroke: 2.4, body: <path d="M5 10.3l3.5 3.4L15 6.5" /> },
  download: { viewBox: "0 0 16 16", stroke: 1.9, body: <path d="M8 2v8M4.5 7l3.5 3.5L11.5 7M2.5 13.5h11" /> },
  chevronUp: { viewBox: "0 0 16 16", stroke: 1.8, body: <path d="M4 9.5l4-4 4 4" /> },
  chevronDown: { viewBox: "0 0 16 16", stroke: 1.8, body: <path d="M4 6.5l4 4 4-4" /> },
  shield: {
    viewBox: "0 0 20 20",
    stroke: 1.7,
    body: <path d="M10 2.2l6.2 2.4v5.1c0 3.6-2.5 6.7-6.2 8.1-3.7-1.4-6.2-4.5-6.2-8.1V4.6z" />,
  },
  speech: {
    viewBox: "0 0 20 20",
    stroke: 1.7,
    body: (
      <>
        <path d="M17 9.4c0 3.2-3.1 5.8-7 5.8a8.4 8.4 0 0 1-2-.24L4.4 16.4l.5-2.6A5.5 5.5 0 0 1 3 9.4c0-3.2 3.1-5.8 7-5.8s7 2.6 7 5.8z" />
        <path d="M7.4 9.4h5.2" />
      </>
    ),
  },
  play: { viewBox: "0 0 16 16", stroke: 0, filled: true, body: <path d="M4.5 2.5l9 5.5-9 5.5z" /> },
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof GLYPHS;

export const Icon: React.FC<{ name: IconName; size: number; color?: string; style?: React.CSSProperties }> = ({
  name,
  size,
  color,
  style,
}) => {
  const glyph: Glyph = GLYPHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={glyph.viewBox}
      fill={glyph.filled ? "currentColor" : "none"}
      stroke={glyph.filled ? "none" : "currentColor"}
      strokeWidth={glyph.filled ? undefined : glyph.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, color, ...style }}
    >
      {glyph.body}
    </svg>
  );
};

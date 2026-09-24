import React from "react";
import { color } from "../tokens";

/** LogoGlyph of frontend/src/ui/icons.tsx, on its 16-unit grid. */
export const PULSE_PATH = "M1.5 8H3l1.3-4.4L6.6 12.4l2-7.6L10.2 8h4.3";

/**
 * The AutoTrim pulse. With `tile`, the app icon (src-tauri/icons/icon.svg): accent tile,
 * dark glyph, same proportions. `draw` (0..1) traces the stroke from the left.
 */
export const PulseGlyph: React.FC<{
  size: number;
  draw?: number;
  tile?: boolean;
  tileScale?: number;
  style?: React.CSSProperties;
}> = ({ size, draw = 1, tile = false, tileScale = 1, style }) => {
  const glyph = (
    <svg width={tile ? size * 0.738 : size} height={tile ? size * 0.738 : size} viewBox="0 0 16 16" style={{ display: "block" }}>
      <path
        d={PULSE_PATH}
        fill="none"
        stroke={tile ? color.onAccent : color.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.min(1, Math.max(0, draw))}
      />
    </svg>
  );
  if (!tile) return <div style={style}>{glyph}</div>;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * (186 / 824),
        background: color.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${tileScale})`,
        ...style,
      }}
    >
      {glyph}
    </div>
  );
};

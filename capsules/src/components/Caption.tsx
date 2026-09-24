import React from "react";
import { color, displayTracking, font } from "../tokens";

/**
 * The line that names what is happening, in the display face. `enter` and `exit` (0..1)
 * move it in from below and out upwards, so captions that follow each other read as one
 * sentence continuing.
 */
export const Caption: React.FC<{
  text: string;
  /** Centre of the line, in frame pixels. */
  x: number;
  y: number;
  fontSize: number;
  maxWidth?: number;
  enter: number;
  exit?: number;
  tone?: "text" | "muted";
}> = ({ text, x, y, fontSize, maxWidth, enter, exit = 0, tone = "text" }) => {
  const opacity = Math.min(enter, 1 - exit);
  if (opacity <= 0) return null;
  const dy = (1 - enter) * 0.35 * fontSize - exit * 0.35 * fontSize;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: maxWidth ?? "max-content",
        transform: `translate(-50%, -50%) translateY(${dy}px)`,
        fontFamily: font.display,
        fontWeight: 700,
        fontSize,
        letterSpacing: displayTracking,
        lineHeight: 1.08,
        textAlign: "center",
        color: tone === "text" ? color.text : color.textMuted,
        opacity,
        textWrap: "balance",
      }}
    >
      {text}
    </div>
  );
};

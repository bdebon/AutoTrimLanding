import React from "react";
import { color, eyebrow, font, radius } from "../tokens";

/**
 * The app's stat card (frontend/src/ui/Data.tsx): 86 px high, uppercase label, value in
 * 30 px display with tabular figures. `highlighted` is the headline figure of a finished
 * session: accent ground, accent value.
 */
export const StatCard: React.FC<{
  label: string;
  value: string;
  suffix?: string;
  highlighted?: boolean;
  scale: number;
  width: number;
  style?: React.CSSProperties;
}> = ({ label, value, suffix, highlighted, scale, width, style }) => (
  <div
    style={{
      boxSizing: "border-box",
      width,
      height: 86 * scale,
      padding: `${15 * scale}px ${18 * scale}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: radius.card * scale,
      border: `${scale}px solid ${highlighted ? color.statHiBorder : color.border}`,
      background: highlighted ? color.statHiBg : color.bgCard,
      ...style,
    }}
  >
    <span
      style={{
        fontFamily: font.ui,
        ...eyebrow,
        fontSize: eyebrow.fontSize * scale,
        color: highlighted ? color.accentSoftText : color.textDim,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: font.display,
        fontWeight: 700,
        fontSize: 30 * scale,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        color: highlighted ? color.accent : color.text,
        whiteSpace: "nowrap",
      }}
    >
      {value}
      {suffix ? (
        <span style={{ fontFamily: font.ui, fontSize: 15 * scale, fontWeight: 500, letterSpacing: 0, color: color.textDim }}> {suffix}</span>
      ) : null}
    </span>
  </div>
);

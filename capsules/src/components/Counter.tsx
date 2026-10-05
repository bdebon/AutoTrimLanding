import React from "react";
import { color, displayTracking, font, radius } from "../tokens";

/**
 * A duration in a pill, like the app's stat chips. Figures are tabular on the DISPLAY face
 * only (Schibsted's tabular figures widen ":"). Going from `from` to `to`, each character
 * that changes rolls: the old one leaves upwards, the new one comes from below.
 */
export const Counter: React.FC<{
  label?: string;
  from: string;
  to: string;
  /** 0 shows `from`, 1 shows `to`. */
  progress: number;
  scale: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ label, from, to, progress, scale, opacity = 1, style }) => {
  const length = Math.max(from.length, to.length);
  const a = from.padStart(length, " ");
  const b = to.padStart(length, " ");
  const valueSize = 22 * scale;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10 * scale,
        height: 38 * scale,
        padding: `0 ${16 * scale}px`,
        borderRadius: radius.pill,
        background: color.bgCard,
        border: `${scale}px solid ${color.border}`,
        opacity,
        ...style,
      }}
    >
      {label ? (
        <span style={{ fontFamily: font.ui, fontSize: 12.5 * scale, color: color.textDim, fontWeight: 500 }}>{label}</span>
      ) : null}
      <span
        style={{
          display: "inline-flex",
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: valueSize,
          letterSpacing: displayTracking,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          color: color.text,
        }}
      >
        {Array.from(b).map((next, i) => {
          const prev = a[i];
          if (prev === next || progress <= 0 || progress >= 1) {
            return <span key={i}>{progress >= 1 ? next : prev}</span>;
          }
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", overflow: "hidden", height: "1.1em", marginTop: "-0.05em" }}>
              <span style={{ display: "block", transform: `translateY(${-progress * 100}%)`, opacity: 1 - progress, paddingTop: "0.05em" }}>
                {prev}
              </span>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  paddingTop: "0.05em",
                  transform: `translateY(${(1 - progress) * 100}%)`,
                  opacity: progress,
                }}
              >
                {next}
              </span>
            </span>
          );
        })}
      </span>
    </div>
  );
};

import React from "react";
import { color, radius } from "../tokens";

export interface Bar {
  /** Centre of the bar, in frame pixels. */
  x: number;
  /** Half height, in frame pixels: bars grow both ways from the midline, like the app. */
  half: number;
  color: string;
  opacity?: number;
}

/**
 * The app's waveform: fixed-pitch rounded bars on a midline. Draw the band first
 * (HatchBand), the bars on top: kept vs removed lives on the band, never on the bars.
 */
export const WaveBars: React.FC<{
  bars: Bar[];
  /** Vertical centre of the bars, in frame pixels. */
  midline: number;
  barWidth: number;
  scale: number;
  frameWidth: number;
}> = ({ bars, midline, barWidth, scale, frameWidth }) => {
  const tallest = Math.max(1, ...bars.map((b) => b.half));
  const top = midline - tallest - 2;
  const height = tallest * 2 + 4;
  return (
    <svg
      width={frameWidth}
      height={height}
      viewBox={`0 ${top} ${frameWidth} ${height}`}
      style={{ position: "absolute", left: 0, top, overflow: "visible" }}
    >
      {bars.map((bar, i) =>
        bar.half <= 0 || (bar.opacity ?? 1) <= 0 ? null : (
          <rect
            key={i}
            x={bar.x - barWidth / 2}
            y={midline - bar.half}
            width={barWidth}
            height={bar.half * 2}
            rx={Math.min(scale, bar.half)}
            fill={bar.color}
            opacity={bar.opacity ?? 1}
          />
        )
      )}
    </svg>
  );
};

/** The track the bars sit in: the app's inset well. */
export const WaveWell: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  scale: number;
  opacity?: number;
}> = ({ left, top, width, height, scale, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: radius.inset * scale,
      background: color.waveWell,
      opacity,
    }}
  />
);

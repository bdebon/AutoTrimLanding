import React from "react";
import { color, radius, wave } from "../tokens";

/**
 * A file's lane: its whole waveform in a well, or, for a camera with no sound, the frames
 * of a film strip (a shape, not a picture: the capsules show no faces). `envelope` is the
 * file's loudness, `perSecond` values a second (scripts/analyze-multicam.mjs).
 */
export const MediaStrip: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  envelope: number[] | null;
  /** Values of `envelope` per second. */
  perSecond: number;
  /** Seconds of the file the strip shows (its full length by default). */
  duration: number;
  scale: number;
  barColor?: string;
  /** Fixed number of bars: they stretch with the strip instead of shimmering as it resizes. */
  bars?: number;
  /** Power on the loudness: higher keeps a mic's own voice and drops the others' bleed. */
  contrast?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ x, y, width, height, envelope, perSecond, duration, scale: s, barColor = color.waveRawBar, bars, contrast = 1.6, opacity = 1, style }) => {
  const inner = Math.max(1, width - 6 * s);
  const count = bars ?? Math.max(1, Math.floor(inner / (wave.barPitch * s * 0.75)));
  const pitch = inner / count;
  const barWidth = pitch * (wave.barWidth / wave.barPitch);
  let d = "";
  if (envelope) {
    const half = height * 0.4;
    for (let b = 0; b < count; b++) {
      const from = Math.floor(((b / count) * duration) * perSecond);
      const to = Math.max(from + 1, Math.floor((((b + 1) / count) * duration) * perSecond));
      let peak = 0;
      for (let i = from; i < to && i < envelope.length; i++) peak = Math.max(peak, envelope[i]);
      const h = Math.max(s * 0.75, Math.pow(peak / 99, contrast) * half);
      const cx = 3 * s + (b + 0.5) * pitch;
      d += `M${cx - barWidth / 2} ${height / 2 - h}h${barWidth}v${h * 2}h${-barWidth}z`;
    }
  }
  const frameWidth = 26 * s;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: radius.inset * s * 0.7,
        background: envelope ? color.waveWell : color.bgChip,
        overflow: "hidden",
        opacity,
        ...style,
      }}
    >
      {envelope ? (
        <svg width={width} height={height} style={{ display: "block" }}>
          <path d={d} fill={barColor} />
        </svg>
      ) : (
        <svg width={width} height={height} style={{ display: "block" }}>
          {Array.from({ length: Math.ceil(width / frameWidth) }, (_, i) => (
            <rect key={i} x={i * frameWidth + s} y={3 * s} width={frameWidth - 2 * s} height={height - 6 * s} rx={2 * s} fill={color.bgCardHi} />
          ))}
        </svg>
      )}
    </div>
  );
};

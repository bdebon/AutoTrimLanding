import React, { useId } from "react";
import { color, wave } from "../tokens";

/**
 * A removed region, the app's way: lighter than the well AND hatched (the hatch survives
 * greyscale, colour blindness and a compressed video). Optional 3 px edge on top: accent
 * for a hesitation in the app, ivory for a retake.
 *
 * The band is anchored on its centre and so is the hatch: when the band closes, it closes
 * like a curtain over a still pattern, the stripes never slide.
 */
export const HatchBand: React.FC<{
  centerX: number;
  width: number;
  top: number;
  height: number;
  scale: number;
  edgeColor?: string;
  /** 0..1: the edge draws itself from the left. */
  edgeProgress?: number;
  opacity?: number;
}> = ({ centerX, width, top, height, scale, edgeColor, edgeProgress = 1, opacity = 1 }) => {
  const id = useId().replace(/:/g, "");
  if (width <= 0.25 || opacity <= 0) return null;
  const tile = wave.hatchTile * scale;
  const edge = wave.edge * scale;
  return (
    <svg
      width={1}
      height={height}
      style={{ position: "absolute", left: centerX, top, overflow: "visible", opacity }}
    >
      <defs>
        <pattern id={`hatch-${id}`} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <rect width={tile} height={tile} fill={color.waveCutBand} />
          {[-tile, 0, tile].map((shift) => (
            <line
              key={shift}
              x1={shift}
              y1={0}
              x2={shift + tile}
              y2={tile}
              stroke={color.waveCutHatch}
              strokeWidth={wave.hatchStroke * scale}
              strokeLinecap="square"
            />
          ))}
        </pattern>
      </defs>
      <rect x={-width / 2} y={0} width={width} height={height} fill={`url(#hatch-${id})`} />
      {edgeColor && edgeProgress > 0 ? (
        <rect x={-width / 2} y={0} width={width * Math.min(1, edgeProgress)} height={edge} fill={edgeColor} />
      ) : null}
    </svg>
  );
};

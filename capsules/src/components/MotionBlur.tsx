import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";

/**
 * Camera-style motion blur, centred on the current frame. @remotion/motion-blur takes its
 * samples ahead of the frame (about 3/4 of a frame on average): switching it on and off
 * makes the layer jump in time, which reads as a judder. This one averages sub-frames around
 * the frame itself, so it can stay on for a whole scene: what stands still is unchanged,
 * what moves is smoothed. Children must read the frame themselves (useCurrentFrame), not
 * receive it as a prop, or every sample is the same picture.
 */
export const MotionBlur: React.FC<{ children: React.ReactNode; samples?: number; shutterAngle?: number }> = ({
  children,
  samples = 8,
  shutterAngle = 180,
}) => {
  const frame = useCurrentFrame();
  const shutter = shutterAngle / 360;
  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      {Array.from({ length: samples }, (_, i) => {
        const offset = shutter * ((i + 0.5) / samples - 0.5);
        return (
          <AbsoluteFill key={i} style={{ mixBlendMode: "plus-lighter", filter: `opacity(${1 / samples})` }}>
            <Freeze frame={Math.max(0, frame + offset)}>{children}</Freeze>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

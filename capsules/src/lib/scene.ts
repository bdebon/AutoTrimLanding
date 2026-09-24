import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease, ramp } from "./motion";
import { scaleFor } from "../tokens";

/**
 * What every short capsule needs: the clock in seconds, the app-to-video scale, the margins,
 * where the caption sits, and the fade back to the empty ground at the very end (frame 0 and
 * the last frame are the same, so the capsule loops).
 */
export function useScene() {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const time = frame / fps;
  const total = durationInFrames / fps;
  const s = scaleFor(width);
  const margin = 40 * s;
  const fadeOut = ramp(time, total - 0.45, 0.35, ease.inOut);
  return {
    time,
    total,
    width,
    height,
    s,
    margin,
    contentWidth: width - 2 * margin,
    captionY: height * 0.17,
    captionSize: 30 * s,
    /** Opacity of the whole scene: 1, then 0 at the end. */
    alive: 1 - fadeOut,
  };
}

export type Scene = ReturnType<typeof useScene>;

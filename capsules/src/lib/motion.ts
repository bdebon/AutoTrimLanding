import { Easing, interpolate, interpolateColors } from "remotion";

// Every capsule is written in seconds, not frames: timings then survive a change of fps
// and read like the storyboard.

export type Ease = (t: number) => number;

export const ease = {
  /** Things arriving: quick start, long settle. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Things closing with weight: a short wind-up, then a long slow landing. */
  heavy: Easing.bezier(0.5, 0, 0.1, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** A camera travelling to a place: slow to leave, fast in between, long to land. */
  goto: Easing.bezier(0.7, 0, 0.2, 1),
  /** Things leaving. */
  in: Easing.bezier(0.5, 0, 0.75, 0),
  linear: (t: number) => t,
} satisfies Record<string, Ease>;

/** 0 before `start`, 1 after `start + duration`, eased in between. */
export const ramp = (time: number, start: number, duration: number, easing: Ease = ease.out) =>
  duration <= 0
    ? Number(time >= start)
    : easing(interpolate(time, [start, start + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const mixColor = (a: string, b: string, t: number) => (t <= 0 ? a : t >= 1 ? b : interpolateColors(t, [0, 1], [a, b]));

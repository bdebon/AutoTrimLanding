import multicamJson from "../../data/multicam-fixtures.json";
import type { Span } from "../../lib/session";

/**
 * A multicam take, from the app's sync fixtures (~/Movies/AutoTrim-multicam-fixtures:
 * synthetic voices, true offsets in truth.json), extracted by scripts/analyze-multicam.mjs.
 * Set aside from the hero (Benjamin, 2026-09-24): it will illustrate multicam on its own,
 * see CAPSULES.md #3.
 */

interface MulticamFile {
  name: string;
  kind: "camera" | "mic";
  duration: number;
  offset: number;
  hasAudio: boolean;
  envelope: number[] | null;
}
interface MulticamTake {
  frameRate: number;
  files: MulticamFile[];
  speech: Record<string, { start: number; end: number; text: string }[]>;
}
export const multicam = multicamJson as unknown as MulticamTake;
export const MULTICAM_PER_SECOND = 10;

/** Lanes of the group, in the app's order: mics, then the main angle, then the others. */
export const lanes = [
  { files: ["mic_marc.wav"], icon: "mic" as const, badge: "mainSound" as const },
  { files: ["mic_julie.wav"], icon: "mic" as const },
  { files: ["cam_wide.mp4"], icon: "camera" as const, badge: "mainAngle" as const },
  { files: ["cam_marc_C0001.mp4", "cam_marc_C0002.mp4"], icon: "camera" as const },
  { files: ["cam_julie.mp4"], icon: "camera" as const },
].map((lane) => ({ ...lane, members: lane.files.map((name) => multicam.files.find((f) => f.name === name)!) }));

export const groupClock = (() => {
  const start = Math.min(...multicam.files.map((f) => f.offset));
  const end = Math.max(...multicam.files.map((f) => f.offset + f.duration));
  return { start, end, span: end - start };
})();

/** Loudness 0..1 of a file at a time of the group's clock. */
export const sampleOn = (name: string) => {
  const file = multicam.files.find((f) => f.name === name)!;
  return (t: number) => {
    if (!file.envelope) return 0;
    const i = Math.floor((t - file.offset) * MULTICAM_PER_SECOND);
    return i >= 0 && i < file.envelope.length ? file.envelope[i] / 99 : 0;
  };
};

/**
 * The take's cuts: who speaks when (the fixtures' ground truth), padded and joined like the
 * app does (0.05 s before, 0.15 s after, silences under 0.5 s kept), laid end to end.
 */
export const takeClips = (() => {
  const spans = Object.values(multicam.speech)
    .flat()
    .map((l) => [Math.max(groupClock.start, l.start - 0.05), l.end + 0.15] as Span)
    .sort((a, b) => a[0] - b[0]);
  const merged: Span[] = [];
  for (const span of spans) {
    const last = merged[merged.length - 1];
    if (last && span[0] - last[1] < 0.5) last[1] = Math.max(last[1], span[1]);
    else merged.push([...span] as Span);
  }
  let t = 0;
  return merged.map(([s, e]) => {
    const clip = { start: t, end: t + (e - s), sourceStart: s };
    t += e - s;
    return clip;
  });
})();

export const takeLength = takeClips[takeClips.length - 1].end;


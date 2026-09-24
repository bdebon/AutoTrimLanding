import { multicam, MULTICAM_PER_SECOND } from "./data";

/**
 * Who speaks when in the take, from the fixtures' ground truth, on the reference clock
 * (mic_marc.wav, offset 0). Capsules #4 and #5 read a window of it.
 */
export type Speaker = "marc" | "julie";
export const SPEAKERS: Speaker[] = ["marc", "julie"];

const lines = (who: Speaker) => multicam.speech[who] ?? [];

export const speaking = (who: Speaker, t: number) => lines(who).some((l) => t >= l.start && t < l.end);

/** Loudness 0..1 of a person's mic at a time of the reference clock. */
export const micLevel = (who: Speaker) => {
  const file = multicam.files.find((f) => f.name === `mic_${who}.wav`)!;
  return (t: number) => {
    if (!file.envelope) return 0;
    const i = Math.floor((t - file.offset) * MULTICAM_PER_SECOND);
    return i >= 0 && i < file.envelope.length ? file.envelope[i] / 99 : 0;
  };
};

/** Bars for a mic over a window, one per `secondsPerBar`. Peak-pooled, like the app. */
export const micBars = (who: Speaker, from: number, to: number, secondsPerBar: number) => {
  const level = micLevel(who);
  const count = Math.ceil((to - from) / secondsPerBar);
  const amps = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let peak = 0;
    for (let k = 0; k < 4; k++) peak = Math.max(peak, level(from + (i + k / 4) * secondsPerBar));
    amps[i] = peak;
  }
  return amps;
};

/** Stretches of the window where nobody speaks, at least `min` long. Window seconds. */
export const silences = (from: number, to: number, min = 0.4): [number, number][] => {
  const step = 0.02;
  const out: [number, number][] = [];
  let start: number | null = null;
  for (let t = from; t <= to + 1e-6; t += step) {
    const quiet = t < to && !SPEAKERS.some((who) => speaking(who, t));
    if (quiet && start === null) start = t;
    if (!quiet && start !== null) {
      if (t - start >= min) out.push([start - from, t - from]);
      start = null;
    }
  }
  if (start !== null && to - start >= min) out.push([start - from, to - from]);
  return out;
};

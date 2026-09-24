import sessionJson from "../../data/session-2025-09-05.json";
import detailJson from "../../data/session-2025-09-05-detail.json";
import { envelopePeak, joinedClock, silencesOf, type Session, type Span } from "../../lib/session";
import { peak, type Speech } from "../../lib/speech";

/**
 * Everything the hero draws, taken from real analyses:
 * - the session: 17 OBS rushes of 5 Sept 2025 (one hour), analysed by
 *   scripts/analyze-session.mjs (the app's silence pipeline + CrisperWhisper hesitations);
 * Choices below (which minute to show, which hesitations) are made by rule, not by hand, so
 * a new session file gives a new hero with its own numbers.
 */
export const session = sessionJson as unknown as Session;
const PER_SECOND = session.envelopePerSecond;

// ---- Scenes 1-3: one rush, its silences, then its hesitations up close -------------------

/** Seconds of audio per bar in the silence scenes: a 1 s silence is 4 bars wide. */
export const COARSE = 0.25;
/** Seconds per bar once zoomed in: a 0.15 s hesitation is 7 bars wide. */
export const FINE = 0.02;

export interface HesitationBeat {
  /** Joined-clock seconds (the rush once its silences are gone). */
  start: number;
  end: number;
  before: string;
  after: string;
}

/** Silences inside a minute centred on `center`. */
const silencesAround = (silences: Span[], center: number) => silences.filter(([s, e]) => e > center - 30 && s < center + 30).length;

/**
 * The three hesitations of the zoomed scene, picked by hand (Benjamin's review: short lines,
 * time to read them) among the session's real ones, and the line shown under each: the real
 * words around it, cut short. Source seconds of the [UH] tags in the rush's transcript.
 */
export const HERO_PICK = {
  rush: "2025-09-05_21-00-54.mp4",
  hesitations: [
    { at: 80.9, fr: "seize euros [euh…] les arrondis" },
    { at: 85.5, fr: "pourquoi [euh…] mon grand frère" },
    { at: 94.2, fr: "mais [euh…] voilà." },
  ],
};

const pick = (() => {
  const file = session.files.find((f) => f.name === HERO_PICK.rush);
  if (!file) throw new Error(`HERO_PICK.rush ${HERO_PICK.rush} is not in the session`);
  const clock = joinedClock(file.speech);
  const picked = HERO_PICK.hesitations.map(({ at }) => {
    const h = file.hesitations.reduce((best, x) => (Math.abs(x.start - at) < Math.abs(best.start - at) ? x : best));
    if (Math.abs(h.start - at) > 0.5) throw new Error(`no hesitation near ${at}s in ${file.name}`);
    return { ...h, start: clock.toJoined(h.start), end: clock.toJoined(h.end), source: h.start };
  });
  // The silence scene shows the busiest minute just before them, so the goto stays short
  const silences = silencesOf(file);
  const first = picked[0].source;
  let busiest = Math.max(30, first - 60);
  for (let c = busiest; c <= first - 15; c += 1) if (silencesAround(silences, c) > silencesAround(silences, busiest)) busiest = c;
  return { file, beats: picked as HesitationBeat[], busiest };
})();

export const rush = pick.file;
export const beats = pick.beats;

/** The rush once its silences are gone: the clock of the zoomed scene. */
export const joined = joinedClock(rush.speech);

/**
 * Loudness of the rush at a source time. The session keeps 20 values a second; the zoomed
 * scene needs 100, extracted for this rush alone (scripts/extract-envelope.mjs).
 */
const detail = detailJson as unknown as Speech;
const hasDetail = detail.source === rush.name;
if (!hasDetail) console.warn(`session detail is for ${detail.source}, the hero picked ${rush.name}: zoom drawn at 20 values a second`);
const loudness = (from: number, to: number) => (hasDetail ? peak(detail, from, to) : envelopePeak(rush, PER_SECOND, from, to));

export interface Strip {
  amps: Float32Array;
  /** Source seconds (the strip is the whole rush). */
  silences: Span[];
  /** Source second at the centre of the frame while the silences go. */
  focus: number;
  /** Source second of the first hesitation: where the joined wave scrolls to. */
  target: number;
}

/** The coarse strip: the whole rush, silences as they are. */
export const strip: Strip = (() => {
  const amps = new Float32Array(Math.ceil(rush.duration / COARSE));
  for (let i = 0; i < amps.length; i++) amps[i] = envelopePeak(rush, PER_SECOND, i * COARSE, (i + 1) * COARSE);
  return {
    amps,
    silences: silencesOf(rush),
    focus: pick.busiest,
    target: joined.toSource((beats[0].start + beats[0].end) / 2),
  };
})();

/** The fine strip: the whole rush on its joined clock, one bar per 20 ms. */
export const fineAmps: Float32Array = (() => {
  const amps = new Float32Array(Math.ceil(joined.total / FINE));
  for (let i = 0; i < amps.length; i++) {
    const t = joined.toSource(i * FINE);
    amps[i] = loudness(t, t + FINE);
  }
  return amps;
})();

/**
 * "ça peut être [euh…] problématique aussi": the real words around a hesitation, up to three
 * each side, never across the end of a sentence, no trailing comma.
 */
export const beatLine = (beat: HesitationBeat, word: string, index?: number, lang?: string) => {
  if (lang === "fr" && index !== undefined && HERO_PICK.hesitations[index]) return HERO_PICK.hesitations[index].fr;
  const words = (text: string) => text.replace(/[\[\]]/g, "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const ends = (w: string) => /[.!?…]$/.test(w);
  let before = words(beat.before).slice(-3);
  const cut = before.map(ends).lastIndexOf(true);
  if (cut >= 0) before = before.slice(cut + 1);
  let after = words(beat.after).slice(0, 3);
  const stop = after.findIndex(ends);
  if (stop >= 0) after = after.slice(0, stop + 1);
  const tidy = (list: string[]) => list.join(" ").replace(/[,;:]$/, "");
  return `${tidy(before)} [${word}…] ${tidy(after)}`.trim();
};

// ---- Scenes 6-7: the session screen with two clips, then the editor they land in ---------

/** The two clips of the export scene: the rush of the zoom and the next one of the shoot. */
export const APP_FILES = ["2025-09-05_21-00-54.mp4", "2025-09-05_21-10-12.mp4"].map((name) => {
  const file = session.files.find((f) => f.name === name);
  if (!file) throw new Error(`${name} is not in the session`);
  return file;
});

/** Frame rate of the rushes (OBS, 30 fps): the hand rolls a cut by whole frames. */
export const RUSH_FPS = 30;

export interface EditorClip {
  /** Timeline seconds. */
  start: number;
  end: number;
  sourceStart: number;
  file: number;
}

/** What the export gives: the kept segments of both clips, end to end, in list order. */
export const editorClips: EditorClip[] = (() => {
  let t = 0;
  return APP_FILES.flatMap((file, index) =>
    file.kept.map(([s, e]) => {
      const clip = { start: t, end: t + (e - s), sourceStart: s, file: index };
      t += e - s;
      return clip;
    })
  );
})();

/** The cut the hand rolls: early in the timeline, between two clips long enough to see. */
export const editorEdit = (() => {
  for (let i = 3; i < editorClips.length; i++) {
    const a = editorClips[i - 1];
    const b = editorClips[i];
    if (a.end - a.start > 2 && b.end - b.start > 2 && a.file === b.file) return i;
  }
  return 1;
})();

/** Loudness 0..1 of one of the two clips at a source time. */
export const appSample = (file: number) => (t: number) => envelopePeak(APP_FILES[file], PER_SECOND, t, t + 1 / PER_SECOND);

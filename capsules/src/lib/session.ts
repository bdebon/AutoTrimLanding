/**
 * A shoot analysed by scripts/analyze-session.mjs: per file, the speech left after the
 * silences, what is kept once the hesitations are out, the hesitations with the words
 * around them, and a loudness envelope. Totals are the app's recap cards.
 */
export type Span = [number, number];

export interface SessionHesitation {
  start: number;
  end: number;
  before: string;
  after: string;
}

export interface SessionFile {
  name: string;
  duration: number;
  thresholdDb: number;
  speech: Span[];
  kept: Span[];
  hesitations: SessionHesitation[];
  /** 0..99, `envelopePerSecond` values a second. */
  envelope: number[];
}

export interface Session {
  label: string;
  envelopePerSecond: number;
  totals: {
    files: number;
    source: number;
    afterSilences: number;
    final: number;
    removed: number;
    silenceRemoved: number;
    hesitationRemoved: number;
    hesitations: number;
    shorterPercent: number;
    cuts: number;
    editingSaved: number;
  };
  files: SessionFile[];
}

/** Peak of the envelope over [from, to), 0..1. */
export const envelopePeak = (file: SessionFile, perSecond: number, from: number, to: number) => {
  const a = Math.max(0, Math.floor(from * perSecond));
  const b = Math.min(file.envelope.length, Math.max(a + 1, Math.ceil(to * perSecond)));
  let max = 0;
  for (let i = a; i < b; i++) max = Math.max(max, file.envelope[i]);
  return max / 99;
};

/** The silences of a file: what lies between its speech segments. */
export const silencesOf = (file: SessionFile): Span[] => {
  const out: Span[] = [];
  let cursor = 0;
  for (const [s, e] of file.speech) {
    if (s > cursor + 1e-3) out.push([cursor, s]);
    cursor = Math.max(cursor, e);
  }
  if (cursor < file.duration - 1e-3) out.push([cursor, file.duration]);
  return out;
};

/**
 * The file once its silences are gone, as a clock of its own: source time <-> time on the
 * joined speech. Hesitations are placed on this clock for the zoomed scene.
 */
export const joinedClock = (segments: Span[]) => {
  const starts: number[] = [];
  let total = 0;
  for (const [s, e] of segments) {
    starts.push(total);
    total += e - s;
  }
  const toJoined = (t: number) => {
    for (let i = 0; i < segments.length; i++) {
      const [s, e] = segments[i];
      if (t < s) return starts[i];
      if (t <= e) return starts[i] + (t - s);
    }
    return total;
  };
  const toSource = (j: number) => {
    for (let i = segments.length - 1; i >= 0; i--) {
      if (j >= starts[i]) return segments[i][0] + Math.min(j - starts[i], segments[i][1] - segments[i][0]);
    }
    return segments.length ? segments[0][0] : 0;
  };
  return { total, toJoined, toSource };
};

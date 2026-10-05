/**
 * A real recording, reduced to numbers by scripts/extract-envelope.mjs: a loudness envelope
 * (0..1, `perSecond` values a second) and the word timings of its transcript.
 */
export interface SpeechWord {
  text: string;
  start: number;
  end: number;
  /** A hesitation the model tagged ([UH], [UM]). */
  filler: boolean;
}

export interface Speech {
  source: string;
  perSecond: number;
  duration: number;
  envelope: number[];
  words?: SpeechWord[];
}

/** Loudest value of the envelope over [from, to), in seconds. Bars show peaks, like the app. */
export const peak = (speech: Speech, from: number, to: number) => {
  const { envelope, perSecond } = speech;
  const a = Math.max(0, Math.floor(from * perSecond));
  const b = Math.min(envelope.length, Math.max(a + 1, Math.ceil(to * perSecond)));
  let max = 0;
  for (let i = a; i < b; i++) max = Math.max(max, envelope[i]);
  return max;
};

/** The longest stretch with no word in it: the room, to draw pauses with. */
export const quietestGap = (speech: Speech): [number, number] => {
  const words = speech.words ?? [];
  let best: [number, number] = [0, Math.min(0.3, speech.duration)];
  for (let i = 1; i < words.length; i++) {
    const gap: [number, number] = [words[i - 1].end, words[i].start];
    if (gap[1] - gap[0] > best[1] - best[0]) best = gap;
  }
  return best;
};

/**
 * Real words to lend their energy to a line of copy: for each spoken token, the unused word
 * of the recording whose length best matches the token's (about 75 ms a letter). A
 * hesitation token takes a real hesitation. Deterministic: same copy, same waveform.
 */
export function lendWords(speech: Speech, tokens: { spoken: string; hesitation: boolean }[]): [number, number][] {
  const words = speech.words ?? [];
  const used = new Set<number>();
  return tokens.map(({ spoken, hesitation }) => {
    const wanted = hesitation ? 0.36 : Math.max(0.1, spoken.length * 0.075);
    let pick = -1;
    words.forEach((word, i) => {
      if (used.has(i) || word.filler !== hesitation) return;
      const score = Math.abs(word.end - word.start - wanted);
      if (pick < 0 || score < Math.abs(words[pick].end - words[pick].start - wanted)) pick = i;
    });
    if (pick < 0) return [0, wanted];
    used.add(pick);
    return [words[pick].start, words[pick].end];
  });
}

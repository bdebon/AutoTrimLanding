import speechFr from "../../data/speech-fr.json";
import { lendWords, quietestGap, type Speech } from "../../lib/speech";
import { parseLine, type Token } from "../../lib/sentence";

/** Real speech the waveform is made of: a French rush with four real "euh" (CrisperWhisper bench). */
export const speech = speechFr as Speech;
export const room = quietestGap(speech);

/**
 * The storyboard, in seconds. Typing follows the rhythm of the real words lent to the copy;
 * everything after is placed from the end of the typing, so a longer line just shifts it.
 */
export function euhTimeline(line: string) {
  const tokens: Token[] = parseLine(line);
  const sources = lendWords(speech, tokens);

  // 1. The line types itself in, word by word, at the pace of speech
  let t = 0.35;
  const words = tokens.map((token, i) => {
    const spoken = Math.min(0.42, Math.max(0.16, sources[i][1] - sources[i][0]));
    const pause = token.text !== token.spoken ? 0.22 : 0.07;
    const word = { appear: t, spokenEnd: t + spoken };
    t += spoken + pause;
    return word;
  });
  const typed = t;

  // 2. The hesitation is found: ivory pill, hatched band under its bars
  const detect = { start: typed + 0.25, duration: 0.4 };
  // 3. It goes: the word fades, the band closes with weight, the line joins up
  const remove = { start: detect.start + detect.duration + 0.5, duration: 0.2 };
  const collapse = { start: remove.start + 0.12, duration: 0.6 };
  const tick = { start: collapse.start + 0.22, duration: 0.34 };
  // What is left is what the app keeps: bars go accent, words go back to full white
  const settle = { start: collapse.start + collapse.duration - 0.1, duration: 0.5 };
  // 4. End card, held 1.5 s, then everything fades back to the empty ground of frame 0
  const exit = { start: settle.start + settle.duration + 0.45, duration: 0.4 };
  const end = { start: exit.start + 0.2, duration: 0.7 };
  const hold = 1.5;
  const fade = { start: end.start + end.duration + hold, duration: 0.35 };
  const total = fade.start + fade.duration + 0.1;

  return { tokens, sources, words, typed, detect, remove, collapse, tick, settle, exit, end, fade, total };
}

export type EuhTimeline = ReturnType<typeof euhTimeline>;

import { measureText } from "@remotion/layout-utils";
import { peak, type Speech } from "./speech";

/**
 * A line of copy laid out word by word, with the waveform under it aligned on the words.
 *
 * Each token owns a SLOT: its text plus half a space on each side, rounded up to a whole
 * number of bar pitches. Slots tile the line, the bars tile the slots, so bars stay on one
 * grid whatever happens. Removing a token shrinks its slot to zero: the text and the bars
 * on both sides close up by the very same amount, which is the whole point.
 */

export interface Token {
  text: string;
  /** The spoken part, without trailing punctuation: "donc…" says "donc". */
  spoken: string;
  hesitation: boolean;
}

/** "donc… [euh…] l’idée" — square brackets mark the hesitation. */
export const parseLine = (line: string): Token[] =>
  line
    .trim()
    .split(/\s+/)
    .map((raw) => {
      const hesitation = raw.startsWith("[") && raw.endsWith("]");
      const text = hesitation ? raw.slice(1, -1) : raw;
      return { text, spoken: text.replace(/[….,!?;:]+$/u, ""), hesitation };
    });

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing?: string;
}

export interface MeasuredToken extends Token {
  textWidth: number;
  spokenWidth: number;
  slotWidth: number;
  /** Where the text starts inside its slot. */
  textLeft: number;
}

const width = (text: string, style: TextStyle) => measureText({ text, ...style, validateFontIsLoaded: true }).width;

export function measureLine(tokens: Token[], style: TextStyle, pitch: number) {
  const space = width("a a", style) - width("aa", style);
  const measured: MeasuredToken[] = tokens.map((token) => {
    const textWidth = width(token.text, style);
    const slotWidth = Math.ceil((textWidth + space) / pitch) * pitch;
    return {
      ...token,
      textWidth,
      spokenWidth: token.spoken ? width(token.spoken, style) : 0,
      slotWidth,
      textLeft: (slotWidth - textWidth) / 2,
    };
  });
  return { tokens: measured, space, total: measured.reduce((sum, t) => sum + t.slotWidth, 0) };
}

export interface Slot {
  /** Left edge, relative to the centre of the line. */
  x: number;
  width: number;
}

/** Slots with each one's remaining share (1 = whole, 0 = removed), the line kept centred. */
export function placeSlots(tokens: MeasuredToken[], remaining: number[]): { slots: Slot[]; total: number } {
  const widths = tokens.map((t, i) => t.slotWidth * Math.max(0, remaining[i] ?? 1));
  const total = widths.reduce((a, b) => a + b, 0);
  let x = -total / 2;
  const slots = widths.map((w) => {
    const slot = { x, width: w };
    x += w;
    return slot;
  });
  return { slots, total };
}

/**
 * Amplitude (0..1) of every bar of a slot. Under the spoken letters, the energy of the real
 * word lent to the token, stretched to the letters; under spaces and punctuation, the room
 * noise of the recording (never zero, never flat).
 */
export function slotAmplitudes(
  token: MeasuredToken,
  source: [number, number],
  room: [number, number],
  speech: Speech,
  pitch: number,
  seed: number
): number[] {
  const count = Math.round(token.slotWidth / pitch);
  const spokenFrom = token.textLeft;
  const spokenTo = token.textLeft + token.spokenWidth;
  const secondsPerBar = (source[1] - source[0]) / Math.max(1, token.spokenWidth / pitch);
  const roomLength = Math.max(0.05, room[1] - room[0]);
  const out: number[] = [];
  for (let b = 0; b < count; b++) {
    const center = (b + 0.5) * pitch;
    if (token.spokenWidth > 0 && center >= spokenFrom && center < spokenTo) {
      const t = source[0] + ((center - spokenFrom) / token.spokenWidth) * (source[1] - source[0]);
      out.push(peak(speech, t - secondsPerBar / 2, t + secondsPerBar / 2));
    } else {
      const t = room[0] + ((seed * 0.173 + b * 0.041) % roomLength);
      out.push(peak(speech, t, t + 0.02) * 0.5);
    }
  }
  return out;
}

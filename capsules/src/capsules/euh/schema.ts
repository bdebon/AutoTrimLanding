import { z } from "zod";

export const euhSchema = z.object({
  /** The spoken line; the hesitation between square brackets. */
  line: z.string(),
  counterLabel: z.string(),
  counterFrom: z.string(),
  counterTo: z.string(),
  name: z.string(),
  version: z.string(),
  tagline: z.string(),
  /** A file in public/, e.g. "audio/euh.wav". Empty: silent. */
  soundtrack: z.string(),
  /** Subtitles for a voice-over on `soundtrack`, in seconds. */
  captions: z.array(z.object({ start: z.number(), end: z.number(), text: z.string() })),
});

export type EuhProps = z.infer<typeof euhSchema>;

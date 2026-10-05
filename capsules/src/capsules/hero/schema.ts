import { z } from "zod";

export const captionLine = z.object({ start: z.number(), end: z.number(), text: z.string() });

export const heroSchema = z.object({
  lang: z.enum(["fr", "en"]),
  // HUD
  shoot: z.string(),
  /** "{n} fichiers": {n} is the real number of files of the session. */
  files: z.string(),
  // Captions, one per scene
  title: z.string(),
  silences: z.string(),
  hesitations: z.string(),
  localBadge: z.string(),
  /** Caption over the session screen and its export menu. */
  exportCaption: z.string(),
  /** Caption over the editor the timeline lands in. */
  editorCaption: z.string(),
  // Session screen (the app's strings)
  appTitle: z.string(),
  /** "{status} · {n} fichiers · {from} → {to}". */
  appSubtitle: z.string(),
  statusDone: z.string(),
  /** "{n} coupes". */
  cuts: z.string(),
  /** "Fichier entier · {d}". */
  wholeFile: z.string(),
  /** "{n} fichiers bout à bout". */
  endToEnd: z.string(),
  preview: z.string(),
  // Export
  exportVerb: z.string(),
  menuTitle: z.string(),
  /** Second section of the menu: one clip per cut, for editors with no timeline import. */
  segmentsTitle: z.string(),
  /** "+{n} images": the hand moves a cut by n frames. */
  nudge: z.string(),
  /** Caption of the figures: answers the opening title. */
  statsCaption: z.string(),
  // Stats (the app's recap cards)
  statShorter: z.string(),
  statSaved: z.string(),
  statCuts: z.string(),
  // End card
  name: z.string(),
  version: z.string(),
  tagline: z.string(),
  /** Small note under the tagline: multicam is not shown, only mentioned. */
  multicamNote: z.string(),
  /** Transcript lines under the hesitations, one per beat; "[euh]" marks the hesitation. Empty: the real words of the session. */
  hesitationLines: z.array(z.string()),
  /** A file in public/, e.g. "audio/hero.wav". Empty: silent. */
  soundtrack: z.string(),
  /** Subtitles for a voice-over on `soundtrack`, in seconds. */
  captions: z.array(captionLine),
});

export type HeroProps = z.infer<typeof heroSchema>;

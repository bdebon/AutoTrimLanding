/**
 * AutoTrim design tokens, for video.
 *
 * Derived from ../design/tokens.css, the landing's copy of the app's canonical
 * frontend/src/styles/tokens.css (synced by ../design/sync-design.sh), including the values
 * the app added after the designer's export (ivory, raw bars, danger). Names
 * follow the CSS variables without the `--at-` prefix. Change a value in tokens.css first,
 * then here: the capsules must look like the app, not like a cousin of it.
 */

export const color = {
  // Grounds
  bgApp: "#0A0A0B",
  bgPanel: "#0E0E10",
  bgCard: "#151312",
  bgCardHi: "#1A1715",
  bgChip: "#1E1B19",
  bgFooter: "#0B0B0C",
  bgInset: "#0A0908",
  bgStage: "#070606",

  // Lines
  lineHairline: "#1C1917",
  border: "#262220",
  borderHi: "#35302C",

  // Text
  text: "#F5F3F0",
  textMuted: "#C6C1BA",
  textDim: "#8E8A84",
  textFaint: "#75706A",
  textDisabled: "#6B655F",

  // Accent. Text on an accent fill is dark, never white (white on accent is 3.7:1).
  accent: "#FF5B2E",
  onAccent: "#14100E",
  accentSurface: "#1A120E",
  accentSoft: "#241611",
  accentSoftStrong: "#2A1811",
  accentSoftBorder: "#4A2417",
  accentSoftText: "#BFA79C",

  // Danger (app only): failed files and destructive confirmations, never a second accent
  danger: "#F2665C",

  // Timeline. Kept vs removed is carried by the BAND behind the bars, never by the bars.
  waveWell: "#131010",
  waveKeptBand: "#150F0C",
  waveKeptBar: "#FF5B2E",
  waveCutBand: "#2A2522",
  waveCutHatch: "#3A332E",
  waveCutBar: "#5A524C",
  /** Whole file during analysis: a shape, not a result yet. */
  waveRawBar: "#4A433E",
  playhead: "#F5F3F0",
  markCutBg: "#2A2522",
  markCutText: "#B5ABA3",
  /** Hesitation and retake markers: told by their weight, not by a hue. */
  ivory: "#EDE3D6",

  // Stat card holding the headline figure of a finished session (frontend/src/ui/Data.tsx)
  statHiBg: "#17100C",
  statHiBorder: "#40261A",
  // Export split button (frontend/src/components/queue/ExportMenu.tsx)
  exportDivider: "#B8401F",
  exportHint: "#3D1A0E",
  menuGround: "#131110",
  menuRule: "#2A2522",

  // Tracks
  track: "#262220",
  trackIdle: "#2A2724",
  thumb: "#F5F3F0",
} as const;

/** Radii in app pixels. Multiply by the capsule's scale (see `scaleFor`). */
export const radius = {
  pill: 999,
  control: 11,
  tile: 12,
  card: 14,
  cardLg: 16,
  modal: 18,
  inset: 9,
} as const;

export const font = {
  /** Bricolage Grotesque: titles and numbers. Tightened. */
  display: '"Bricolage Grotesque Variable", "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
  /** Schibsted Grotesk: everything else. Never tightened. */
  ui: '"Schibsted Grotesk Variable", "Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif',
} as const;

/** Uppercase label above a figure (`.at-eyebrow` in the app). */
export const eyebrow = { fontSize: 11, letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" as const };

/** Letter spacing of the display face. The UI face is never tightened. */
export const displayTracking = "-0.025em";

/** Font sizes of the app, in app pixels. */
export const fontSize = {
  hero: 38,
  title: 24,
  header: 17,
  stat: 19,
  body: 13.5,
  control: 12.5,
  helper: 11.5,
  eyebrow: 11,
} as const;

/** Waveform geometry of the app (frontend/src/utils/waveGeometry.ts, timelineRenderer.ts). */
export const wave = {
  /** Bars are 3 px on a 4 px pitch. */
  barWidth: 3,
  barPitch: 4,
  /** Tallest half-bar, as a share of the well height. */
  maxHalf: 0.44,
  /** Floor of every removed band and marker. */
  minBand: 3,
  /** Accent (hesitation) or ivory (retake) edge on top of a removed band. */
  edge: 3,
  /** Hatch: a 2 px "\" diagonal on an 8 px square tile (frontend/src/utils/bandedWaveform.ts). */
  hatchStroke: 2,
  hatchTile: 8,
} as const;

/**
 * App pixels to video pixels. The app is drawn for a ~1280 px wide window; a 1920 wide
 * frame shows it at 2x, which is how a screen recording of a Retina Mac reads. A 1080 wide
 * portrait is watched on a phone, so it keeps 2x too: lines of copy fit themselves to the
 * width, everything else stays legible at thumb size.
 */
export const scaleFor = (width: number) => Math.min(2, width / 540);

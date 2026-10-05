/**
 * The hero's storyboard, in seconds (CAPSULES.md #1, reworked after Benjamin's first review).
 * Every beat is a { start, duration } read with ramp(); scenes overlap by a few tenths so one
 * hands over to the next.
 */
export const HERO_SECONDS = 30;

const beat = (start: number, duration: number) => ({ start, duration });

export const T = {
  // 0-3.9 · An hour of footage, its silences
  waveIn: beat(0.1, 1.9),
  countUp: beat(0.2, 1.7),
  chipIn: beat(0.3, 0.5),
  titleIn: beat(0.4, 0.5),
  titleUp: beat(1.85, 0.55),
  /** The first silences hatch as soon as the wave lands. */
  hatchStart: 1.75,
  hatchStagger: 0.045,
  hatchPop: 0.2,
  cutBarsOut: beat(2.75, 0.3),
  close: beat(3.0, 0.7),
  countSilences: beat(3.0, 0.9),
  keptAccent: beat(3.4, 0.5),
  pillIn: beat(3.75, 0.35),
  titleOut: beat(2.95, 0.25),
  silencesIn: beat(3.25, 0.45),
  /** Straight after the colour: a smooth goto to the first hesitation. */
  goto: beat(3.9, 1.4),

  // 5.3-14.3 · Hesitations, zoomed in
  silencesOut: beat(5.2, 0.3),
  zoom: beat(5.3, 0.7),
  hesitationsIn: beat(5.45, 0.5),
  badgeIn: beat(6.0, 0.4),
  /** Starts of the three hesitation beats: each one leaves time to read its line. */
  beats: [5.95, 8.6, 11.35],
  hudOut: beat(14.0, 0.35),
  hesitationsOut: beat(14.0, 0.3),
  waveOut: beat(14.05, 0.4),

  // 14.3-18.9 · Back on the session screen: two clips, cut, and the export menu
  appIn: beat(14.35, 0.55),
  exportCaptionIn: beat(14.45, 0.5),
  cursorIn: beat(15.45, 0.4),
  toChevron: beat(15.5, 0.5),
  clickOpen: 16.1,
  menuOpen: beat(16.15, 0.3),
  hover: [16.6, 16.9, 17.2, 17.5, 17.75],
  clickPick: 17.9,
  menuClose: beat(18.0, 0.25),
  appOut: beat(18.3, 0.45),
  exportCaptionOut: beat(18.3, 0.3),

  // 18.5-24.2 · In the editor the timeline landed in: a clip edge pulled by hand, then played
  editorIn: beat(18.5, 0.6),
  editorCaptionIn: beat(18.65, 0.5),
  editorCursorIn: beat(19.35, 0.3),
  toEdit: beat(19.4, 0.65),
  grab: 20.2,
  drag: beat(20.3, 0.85),
  release: 21.35,
  editorCursorOut: beat(21.6, 0.3),
  /** The playhead plays across the pulled edge: the breath is back. */
  play: beat(21.7, 1.9),
  editorOut: beat(24.0, 0.4),
  editorCaptionOut: beat(24.0, 0.3),

  // 24.3-28.4 · The whole hour shrinks, then the app's figures
  statsCaptionIn: beat(24.35, 0.5),
  hourIn: beat(24.45, 0.5),
  hourHatch: beat(24.95, 0.25),
  hourClose: beat(25.2, 0.75),
  resultIn: beat(25.45, 0.5),
  statsIn: 25.95,
  statsStagger: 0.06,
  statCount: beat(26.05, 0.9),
  statsCaptionOut: beat(28.3, 0.3),

  // 28.5-30 · End card, then back to the empty ground of frame 0
  statsOut: beat(28.35, 0.35),
  end: beat(28.55, 0.6),
  fade: beat(29.6, 0.35),
} as const;

/** Where things sit, for 1920×1080 or a stacked 1080×1350. */
export function heroLayout(width: number, height: number) {
  const portrait = height > width;
  const s = Math.min(2, width / 540);
  const margin = 40 * s;
  return {
    portrait,
    s,
    margin,
    captionY: height * 0.2,
    captionSize: (portrait ? 24 : 30) * s,
    titleSize: (portrait ? 38 : 46) * s,
    titleY: height * 0.36,
    waveMid: portrait ? height * 0.5 : height * 0.56,
    track: (portrait ? 92 : 104) * s,
    /** Wide format: cards in 3 × 2; stacked: 2 × 3. */
    cardColumns: portrait ? 2 : 3,
    contentWidth: width - 2 * margin,
  };
}

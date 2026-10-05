# AutoTrim capsules

Short animated marketing capsules for AutoTrim v2, made with [Remotion](https://www.remotion.dev).
A separate project inside the landing repo (`trimly-landing/capsules/`): it does not touch the
Next.js site. The app repo (`../../AutoTrim`, next to this one) is only needed to rebuild the
data; the design tokens it is drawn with are in [`../design/`](../design/README.md).

## Setup

```bash
cd capsules
npm install
```

## Render

```bash
npx remotion render Hero-fr out/hero-fr.mp4
npx remotion render Hero-en out/hero-en.mp4
npx remotion render Hero-fr-4x5 out/hero-fr-4x5.mp4
npx remotion render Hero-en-4x5 out/hero-en-4x5.mp4
npx remotion render Euh-fr out/euh-fr.mp4
npx remotion render Euh-en out/euh-en.mp4
npx remotion render Euh-fr-4x5 out/euh-fr-4x5.mp4
npx remotion render Euh-en-4x5 out/euh-en-4x5.mp4
```

1920×1080 or 1080×1350, 60 fps, H.264 yuv420p, crf 16 (see `remotion.config.ts`). On an
M1 Pro, "Euh." renders in about 10 s and the 30 s hero in about 40 s.

One frame, to check a detail:

```bash
npx remotion still Euh-fr out/frame.png --frame=225
```

Live preview with a timeline and a props panel, to tweak copy or timing:

```bash
npx remotion studio
```

## Capsule #1, the hero

Thirty seconds of what v2 does, on a real hour of rushes:

| s | Scene |
|---|---|
| 0–3.9 | A rush slides in, wider than the screen; as soon as it lands its silences hatch, then close; the counter drops, `−33 %`. *Une heure de rushes.* |
| 3.9–5.3 | One smooth goto (motion-blurred) to the first hesitation. |
| 5.3–14.3 | Zoom in: three real hesitations with short lines, each read, marked, taken out. *IA en local.* |
| 14.3–18.8 | AutoTrim's session screen, two clips cut; the export menu: three editors, and one clip per cut for CapCut. |
| 18.5–24.4 | Final Cut Pro was picked: the timeline in a magnetic timeline (not AutoTrim), a clip edge pulled by four frames, then played. |
| 24.3–28.4 | *Une heure de rushes, 40 minutes à monter.* The hour as one bar: its removed third hatches and closes, `59:45 → 39:57`, then the app's recap cards. |
| 28.5–30 | End card with a quiet "Aussi en multicam", then the empty ground of frame 0. |

Multicam is only mentioned: shown in the middle, it broke the single-shoot story. Its scene
is set aside in `src/capsules/multicam/` (composition `MulticamDrop-draft-fr`, 4 s) for the
multicam capsule.

Storyboard in seconds: `src/capsules/hero/timeline.ts`. Copy: `src/capsules/hero/copy.ts`.

### Where the numbers come from

The session is the 17 OBS recordings of 5 Sept 2025 (`~/Movies/OBS/2025-09-05_*`), 59:45 in
total. It was analysed offline, the way the app does it, because the app's backend cannot
be run from here:

- **Silences**: `scripts/analyze-session.mjs` ports the backend's pipeline: automatic threshold
  (`auto_threshold.rs`), ffmpeg `silencedetect` with the app's own ffmpeg, padding, merge and
  minimum speech (`silence_detector.rs`), with the app's default settings.
- **Hesitations**: `scripts/transcribe-session.py` runs CrisperWhisper 2.0 small through the
  bench in the app repo, `AutoTrim/scripts/crisperwhisper-demo` (same model as the app, Python
  instead of whisper.cpp, without the app's acoustic snapping). The script finds the app repo
  next to this one, or where `AUTOTRIM_REPO` points. Its `[UH]`/`[UM]` intervals are taken out
  with the app's `subtract_intervals` rule.
- **Figures**: the app's recap formulas (`ProcessingQueue.tsx`): shorter = removed ÷ source,
  cuts = kept segments − 1 per file, editing saved = 1.61 × length − 25 s per file.

| Figure | Value |
|---|---|
| Source | 59:45 |
| After silences | 40:20 |
| After hesitations | 39:57 |
| Shorter | −33 % |
| Cuts | 521 |
| Hesitations removed | 123 |
| Editing saved | 1:29:07 |

The three hesitations of the zoom are picked by hand for short, readable lines
(`HERO_PICK` in `src/capsules/hero/data.ts`), among the session's real ones; the silence
minute is the busiest one just before them. The zoomed scene needs a 100 Hz envelope of
that rush (`src/data/session-2025-09-05-detail.json`).

The parked multicam scene uses the app's sync fixtures (`~/Movies/AutoTrim-multicam-fixtures`,
synthetic voices, true offsets in `truth.json`), extracted by `scripts/analyze-multicam.mjs`.

To rebuild the data from another shoot:

```bash
../../AutoTrim/scripts/crisperwhisper-demo/.venv/bin/python scripts/transcribe-session.py --out .cache/transcripts /path/to/*.mp4
node scripts/analyze-session.mjs --out src/data/session-2025-09-05.json --transcripts .cache/transcripts /path/to/*.mp4
node scripts/extract-envelope.mjs /path/to/<rush the hero picks>.mp4 --out src/data/session-2025-09-05-detail.json
```

Transcribing an hour takes about 13 minutes on the M1 Pro's CPU. The data module warns in
the console when the detail file is not for the rush it picked.

## Capsule #2, "Euh."

A line types itself in over its waveform. The hesitation is found: an ivory pill on the
word, a hatched band under its bars. It goes: the word fades, the band closes with weight,
and the two halves of the line and of the waveform join up. The counter ticks `0:14 → 0:13`
and the kept bars turn accent, as in the app. End card, held 1.5 s. First and last frames
are the same empty ground, so the video loops.

| Beat | FR start (s) |
|---|---|
| Words type in | 0.35 |
| Hesitation found | 2.9 |
| Word fades | 3.8 |
| Band closes (600 ms) | 3.95 |
| Counter ticks | 4.2 |
| Bars turn accent | 4.45 |
| Line leaves | 5.4 |
| End card | 5.6 |
| Fade to empty ground | 7.8 |

The storyboard is in `src/capsules/euh/timeline.ts`, in seconds. Typing follows the pace of
the real words behind the copy, and every later beat is placed from the end of the typing.
A longer line shifts the rest, and the composition length follows.

The copy is in `src/capsules/euh/copy.ts`. Square brackets mark the hesitation:
`donc… [euh…] l’idée c’est que`.

### The waveform is real

`src/data/speech-fr.json` is the loudness envelope of a real French rush with four real
"euh". It was transcribed by CrisperWhisper (the app repo's `AutoTrim/scripts/crisperwhisper-demo/out/`). Each word
of the copy borrows the energy of a real word of about the same length. The hesitation
borrows a real "euh", which is why it shows as a flat plateau. Spaces and "…" show the room
noise of the same recording. Only numbers are committed, never the audio.

To take the waveform from another recording:

```bash
node scripts/extract-envelope.mjs /path/to/rush.mp4 --out src/data/name.json \
  --words /path/to/transcript.verbatim.json --from 12 --to 24
```

## Audio and subtitles

Every capsule has a `soundtrack` prop: a file in `public/`, such as `audio/euh.wav`. Leave
it empty for a silent video. Make the audio the length of the composition, or the loop
will jump.

`captions` is the subtitle track for a voice-over on that soundtrack: a list of
`{ start, end, text }` in seconds, burnt in at the bottom. Empty by default.

## Kit

| File | What it is |
|---|---|
| `src/tokens.ts` | Colours, radii, fonts and waveform geometry of [`../design/tokens.css`](../design/tokens.css) (the app's `frontend/src/styles/tokens.css`, synced by `../design/sync-design.sh`), including ivory `#EDE3D6` |
| `src/fonts.ts` | The app's font packages. `useFontsReady()` holds the render until they load |
| `src/lib/motion.ts` | `ramp(time, start, duration, easing)` and the shared easings. Capsules are written in seconds |
| `src/lib/speech.ts` | Real envelopes and words: `peak`, `lendWords`, `quietestGap` |
| `src/lib/sentence.ts` | A line laid out word by word, with bars on the same grid. Removing a word closes text and waveform by the same amount |
| `src/components/CapsuleFrame.tsx` | Ground, UI font and audio slot |
| `src/components/WaveBars.tsx` | Rounded bars on a midline (`WaveBars`) and the inset well (`WaveWell`) |
| `src/components/HatchBand.tsx` | The removed band: lighter and hatched like the app, with an optional 3 px edge. It closes on its centre over a still hatch |
| `src/components/Transcript.tsx` | Words placed by the caller, with an optional pill |
| `src/components/Counter.tsx` | Duration in a pill. Tabular figures on the display face, and changed digits roll |
| `src/components/PulseGlyph.tsx` | The pulse from `LogoGlyph`, bare or on the app icon's accent tile. It draws itself |
| `src/components/EndCard.tsx` | Icon, name, accent version and one line |
| `src/components/LongWave.tsx` | A long real waveform as a few SVG paths: scrolls, hatches zones one by one, closes them, leaves ticks |
| `src/components/MediaStrip.tsx` | A file's lane: its whole waveform, or film cells for a camera without sound |
| `src/components/FileCard.tsx` | A queue file as a card: icon tile, name, meta, strip |
| `src/components/GroupCard.tsx` | The multicam group frame: header, sync chip, row labels |
| `src/components/SessionCard.tsx` | A processed file on the session screen: name, what it became, the whole file cut in its well |
| `src/components/MagneticEditor.tsx` | The timeline as Final Cut Pro shows it (magnetic storyline, film strip over waveform, yellow edge bracket), no logo |
| `src/components/EditorWindow.tsx` | A track-based editor (V1/A1), neutral: for Premiere or Resolve scenes |
| `src/components/MotionBlur.tsx` | Motion blur centred on the frame, meant to stay on for a whole scene |
| `src/components/ExportButton.tsx` | The footer's split button and its menu, opening upwards, with sections |
| `src/components/StatCard.tsx` | The app's stat card, highlighted or not |
| `src/components/Chip.tsx` | Pill chips: neutral, accent, soft, ivory |
| `src/components/Caption.tsx` | The scene's line in the display face, in from below, out upwards |
| `src/components/Cursor.tsx` | A pointer or a grabbing hand, with a click |
| `src/components/icons.tsx` | The app's glyphs |
| `src/lib/session.ts` | Session data: silences, joined clock |
| `src/lib/format.ts` | Durations, percentages and counts written like the app |

Scale: the app is drawn for a window about 1280 px wide. Capsules show it at 2×, which is
how a Retina screen recording reads. Multiply app pixels by `scaleFor(width)`.

Rules taken from the app, to keep:

- Cuts are never edited in AutoTrim. Show an edit only after the export, in `EditorWindow`.
- Removed and kept live on the band behind the bars, never on the bars.
- A removed band is lighter than the well and hatched, both at once.
- Text on accent or ivory is dark `#14100E`, never white.
- Tabular figures are for the display face only. Schibsted's tabular figures widen ":".
- One accent. Ivory marks what the AI found.

In the app, a hesitation band carries an accent edge and a retake band an ivory one. This
capsule uses ivory for the hesitation, as the brief asked.

### Motion that never judders

- A camera moving over a wave whose zones have closed moves on the closed clock
  (`LongWave`'s `anchorClosed`), never on strip time: on strip time it stalls every time it
  crosses a zone that is no longer there.
- Bars moving faster than their pitch strobe: keep `MotionBlur` on for the whole scene rather
  than switching it on and off. Its children read the frame themselves (`useCurrentFrame`).
- Check a render before sending it: frames standing still between moving frames are judder.

```bash
python3 scripts/check-motion.py out/hero-fr.mp4 0 14 470 260
```

### Adding a capsule

1. Create `src/capsules/<name>/` with a `schema.ts` (zod props), `copy.ts` (FR and EN) and a
   `timeline.ts` in seconds.
2. Build the scene from the components above inside a `CapsuleFrame`, and gate it on
   `useFontsReady()` if it measures text.
3. Register it in `src/Root.tsx` for each language and format, with
   `calculateMetadata` when its length depends on the copy.
4. Keep frame 0 and the last frame identical if it should loop.

The other capsules, with their storyboards, copy and what the kit needs for each, are in
[`CAPSULES.md`](CAPSULES.md).

## Renders for the landing

The landing plays the capsules from `public/capsules/<name>-<lang>.{mp4,webp}` (the
4:5 formats are for social only). Render the compositions, then encode them for the web:

```bash
for id in Hero MulticamDrop MulticamMic MulticamFollow Timeline Video Preview Local Euh; do
  for lang in fr en; do npx remotion render $id-$lang out/$(echo $id | tr A-Z a-z)-$lang.mp4; done
done
scripts/publish-landing.sh            # every capsule
scripts/publish-landing.sh euh local  # or just some
```

`publish-landing.sh` writes the H.264 MP4 (crf 21, faststart) and the WebP
poster (frame chosen per capsule in the script) into `public/capsules/`. The landing names
are `hero`, `euh`, `multicam-drop`, `multicam-mic`, `multicam-follow`, `timeline`, `video`,
`preview`, `local`; the section each one plays in is in `design/landing-2026-09/BRIEF.md`.

## Commits

Use `chore(landing): …` subjects, like the rest of this repo.

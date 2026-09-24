import React from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Chip } from "../../components/Chip";
import { Cursor } from "../../components/Cursor";
import { ExportButton, type ExportChoice } from "../../components/ExportButton";
import { MagneticEditor, magneticClipCenter, type MagneticClip } from "../../components/MagneticEditor";
import { useFontsReady } from "../../fonts";
import { formatDuration } from "../../lib/format";
import { ease, mix, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { APP_FILES, appSample, editorClips, editorEdit, RUSH_FPS } from "../hero/data";
import type { TimelineCopy } from "./copy";

export const TIMELINE_SECONDS = 8;
const NUDGE_FRAMES = 4;
const VIEW_SECONDS = 7;

const T = {
  buttonIn: 0.3,
  cursorIn: 0.55,
  toChevron: { start: 0.6, duration: 0.5 },
  clickOpen: 1.2,
  menuOpen: 1.25,
  hover: [1.65, 1.95, 2.25, 2.55],
  clickPick: 2.85,
  menuClose: 2.92,
  buttonOut: 3.15,
  editorIn: 3.3,
  toEdit: { start: 3.95, duration: 0.65 },
  grab: 4.65,
  drag: { start: 4.75, duration: 0.85 },
  release: 5.65,
  cursorOut: 5.9,
  play: { start: 5.95, duration: 1.4 },
  legendIn: 5.9,
};
const ROW = 46;
const BLOCK_TITLE = 25;
const MENU_PADDING = 8;

/**
 * Capsule #7, "Votre timeline, pas notre export." The export button unfolds: Final Cut Pro,
 * Premiere Pro, DaVinci Resolve. The timeline lands in the editor with its cuts; a clip edge
 * is grabbed and pulled by a few frames, the rest follows, and it plays across the seam.
 */
export const Timeline: React.FC<TimelineCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<TimelineCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth } = useScene();
  const a = s * 0.85;
  const choices: ExportChoice[] = [
    { label: "Final Cut Pro", hint: "FCPXML" },
    { label: "Premiere Pro", hint: "XML" },
    { label: "DaVinci Resolve", hint: "FCPXML" },
  ];

  // The button, alone on the ground, its menu opening upwards
  const buttonShown = ramp(time, T.buttonIn, 0.4) * (1 - ramp(time, T.buttonOut, 0.35, ease.in));
  const buttonRight = width * 0.5 - 190 * a;
  const buttonBottom = height * 0.3;
  const buttonTop = height - buttonBottom - 48 * a;
  const open = ramp(time, T.menuOpen, 0.3, ease.out) * (1 - ramp(time, T.menuClose, 0.25, ease.inOut));
  const hoverOrder = [1, 2, 1, 0];
  const hovered = T.hover.reduce((h, at, i) => (time >= at ? hoverOrder[i] : h), -1);
  const chevron = { x: width - buttonRight - 22 * a, y: buttonTop + 24 * a };
  const menuBottom = buttonTop - 10 * a;
  const menuHeight = (MENU_PADDING * 2 + BLOCK_TITLE + choices.length * ROW) * a;
  const rowCenter = (i: number) => menuBottom - menuHeight + (MENU_PADDING + BLOCK_TITLE + i * ROW + ROW / 2) * a;
  const rowX = width - buttonRight - 250 * a;
  let cursor = { x: width * 0.72, y: height + 40 * s };
  const toChevron = ramp(time, T.toChevron.start, T.toChevron.duration, ease.inOut);
  cursor = { x: mix(cursor.x, chevron.x, toChevron), y: mix(cursor.y, chevron.y, toChevron) };
  T.hover.forEach((at, i) => {
    const p = ramp(time, at - 0.22, 0.22, ease.inOut);
    cursor = { x: mix(cursor.x, rowX, p), y: mix(cursor.y, rowCenter(hoverOrder[i]), p) };
  });
  const click = (at: number) => ramp(time, at - 0.06, 0.06) * (1 - ramp(time, at, 0.1));

  // The editor the timeline lands in
  const editorShown = ramp(time, T.editorIn, 0.6, ease.out);
  const pulled = ramp(time, T.drag.start, T.drag.duration, ease.inOut);
  const shift = (NUDGE_FRAMES / RUSH_FPS) * pulled;
  const edited = editorClips[editorEdit - 1];
  const clips: MagneticClip[] = editorClips.map((clip, i) => ({
    start: i >= editorEdit ? clip.start + shift : clip.start,
    end: i === editorEdit - 1 || i >= editorEdit ? clip.end + shift : clip.end,
    sourceStart: clip.sourceStart,
    label: APP_FILES[clip.file].name,
    sample: appSample(clip.file),
  }));
  const total = editorClips[editorClips.length - 1].end + shift;
  const edge = edited.end + shift;
  const e = s * 0.8;
  const winW = Math.min(contentWidth, 1100 * e);
  const winH = 290 * e;
  const winX = (width - winW) / 2;
  const winY = (height - winH) / 2 + 30 * s + (1 - editorShown) * 40 * s;
  const pxPerSecond = (winW - 20 * e) / VIEW_SECONDS;
  const viewStart = edited.end - VIEW_SECONDS * 0.55;
  const tx = (t: number) => winX + 10 * e + (t - viewStart) * pxPerSecond;
  const v1Y = winY + magneticClipCenter(e);
  const toEdit = ramp(time, T.toEdit.start, T.toEdit.duration, ease.inOut);
  const target = { x: tx(edge), y: v1Y };
  const hand = time >= T.editorIn ? { x: mix(width * 0.7, target.x, toEdit), y: mix(height + 40 * s, target.y, toEdit) } : cursor;
  const grabbing = time >= T.grab && time < T.release;
  const cursorShown = ramp(time, T.cursorIn, 0.3) * (1 - ramp(time, T.buttonOut, 0.2)) + ramp(time, T.editorIn + 0.5, 0.3) * (1 - ramp(time, T.cursorOut, 0.3));
  const tooltip = ramp(time, T.drag.start, 0.2) * (1 - ramp(time, T.release + 0.25, 0.25));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption text={copy.title} x={width / 2} y={captionY} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.2, 0.5)} exit={ramp(time, TIMELINE_SECONDS - 1.0, 0.35, ease.in)} />
      {buttonShown > 0 ? (
        <ExportButton
          verb={copy.exportVerb}
          choices={choices}
          selected={0}
          hovered={open > 0.5 ? hovered : -1}
          open={open}
          menuTitle={copy.menuTitle}
          scale={a}
          right={buttonRight}
          bottom={buttonBottom - (1 - buttonShown) * 16 * s}
          opacity={buttonShown}
          press={click(T.clickOpen)}
        />
      ) : null}
      {editorShown > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: editorShown }}>
          <MagneticEditor
            project={copy.project}
            duration={formatDuration(total)}
            clips={clips}
            viewStart={viewStart}
            pxPerSecond={pxPerSecond}
            fps={RUSH_FPS}
            playhead={mix(edge - 1.4, edge + 1.2, ramp(time, T.play.start, T.play.duration, ease.linear))}
            edge={{ time: edge, opacity: ramp(time, T.toEdit.start + 0.4, 0.2) * (1 - ramp(time, T.release + 0.3, 0.3)) }}
            x={winX}
            y={winY}
            width={winW}
            height={winH}
            scale={e}
          />
          {tooltip > 0 ? (
            <Chip label={copy.nudge.replace("{n}", String(NUDGE_FRAMES))} tone="ivory" scale={s} height={28} fontSize={12} style={{ position: "absolute", left: hand.x + 18 * s, top: hand.y - 50 * s, opacity: tooltip }} />
          ) : null}
        </div>
      ) : null}
      {cursorShown > 0 ? (
        <Cursor x={hand.x} y={hand.y} size={30 * s} kind={time >= T.editorIn && toEdit > 0.9 ? "grab" : "arrow"} press={grabbing ? 0.4 : Math.max(click(T.clickOpen), click(T.clickPick))} opacity={Math.min(1, cursorShown)} />
      ) : null}
      <Caption text={copy.legend} x={width / 2} y={height * 0.86} fontSize={22 * s} maxWidth={contentWidth} enter={ramp(time, T.legendIn, 0.5)} exit={ramp(time, TIMELINE_SECONDS - 0.9, 0.35, ease.in)} tone="muted" />
    </div>
  );
};

import React from "react";
import { Chip } from "../../../components/Chip";
import { Cursor } from "../../../components/Cursor";
import { MagneticEditor, magneticClipCenter, type MagneticClip } from "../../../components/MagneticEditor";
import { formatDuration } from "../../../lib/format";
import { ease, mix, ramp } from "../../../lib/motion";
import { APP_FILES, appSample, editorClips, editorEdit, RUSH_FPS } from "../data";
import type { HeroProps } from "../schema";
import { T, type heroLayout } from "../timeline";

type Layout = ReturnType<typeof heroLayout>;

/** Frames the hand pulls the edge by. */
const NUDGE_FRAMES = 4;
/** Seconds of timeline the window shows around the edit. */
const VIEW_SECONDS = 7;

/**
 * 18.5-24.4 s. Final Cut Pro was picked: the timeline lands in a magnetic timeline (not AutoTrim):
 * the clips of the export end to end. The hand pulls the out-point of one clip by four
 * frames to bring a breath back, the rest of the timeline follows, and the playhead plays
 * across the edge. The app's own promise: nothing is erased, every clip keeps its handles.
 */
export const Editor: React.FC<{ time: number; layout: Layout; width: number; height: number; copy: HeroProps }> = ({
  time,
  layout: L,
  width,
  height,
  copy,
}) => {
  const out = ramp(time, T.editorOut.start, T.editorOut.duration, ease.in);
  if (time < T.editorIn.start - 0.05 || out >= 1) return null;
  const s = L.s;
  const shown = ramp(time, T.editorIn.start, T.editorIn.duration, ease.out);

  const pulled = ramp(time, T.drag.start, T.drag.duration, ease.inOut);
  const shift = (NUDGE_FRAMES / RUSH_FPS) * pulled;
  const edited = editorClips[editorEdit - 1];
  // A magnetic timeline: pulling an out-point pushes everything after it
  const clips: MagneticClip[] = editorClips.map((clip, i) => ({
    start: i >= editorEdit ? clip.start + shift : clip.start,
    end: i === editorEdit - 1 || i >= editorEdit ? clip.end + shift : clip.end,
    sourceStart: clip.sourceStart,
    label: APP_FILES[clip.file].name,
    sample: appSample(clip.file),
  }));
  const total = editorClips[editorClips.length - 1].end + shift;
  const edge = edited.end + shift;

  const e = L.portrait ? s * 0.62 : s * 0.8;
  const winW = Math.min(L.contentWidth, 1100 * e);
  const winH = 290 * e;
  const winX = (width - winW) / 2;
  const winY = Math.max(L.captionY + L.captionSize + 40 * s, (height - winH) / 2 + 40 * s) + (1 - shown) * 40 * s;
  const laneW = winW - 20 * e;
  const pxPerSecond = laneW / VIEW_SECONDS;
  const viewStart = edited.end - VIEW_SECONDS * 0.55;
  const tx = (t: number) => winX + 10 * e + (t - viewStart) * pxPerSecond;
  const v1Y = winY + magneticClipCenter(e);

  // The hand: in, onto the edge, grab, pull, let go
  const start = { x: width * 0.7, y: height + 40 * s };
  const toEdit = ramp(time, T.toEdit.start, T.toEdit.duration, ease.inOut);
  const target = { x: tx(edge), y: v1Y };
  const cursor = { x: mix(start.x, target.x, toEdit), y: mix(start.y, target.y, toEdit) };
  const grabbing = time >= T.grab && time < T.release;
  const cursorShown = ramp(time, T.editorCursorIn.start, T.editorCursorIn.duration) * (1 - ramp(time, T.editorCursorOut.start, T.editorCursorOut.duration));
  const tooltip = ramp(time, T.drag.start, 0.2) * (1 - ramp(time, T.release + 0.25, 0.25));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: shown * (1 - out), transform: `translateY(${-out * 30 * s}px)` }}>
      <MagneticEditor
        project={copy.appTitle}
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
        <Chip
          label={copy.nudge.replace("{n}", String(NUDGE_FRAMES))}
          tone="ivory"
          scale={s}
          height={28}
          fontSize={12}
          style={{ position: "absolute", left: cursor.x + 18 * s, top: cursor.y - 50 * s, opacity: tooltip }}
        />
      ) : null}
      {cursorShown > 0 ? (
        <Cursor x={cursor.x} y={cursor.y} size={30 * s} kind={toEdit > 0.9 ? "grab" : "arrow"} press={grabbing ? 0.4 : 0} opacity={cursorShown} />
      ) : null}
    </div>
  );
};

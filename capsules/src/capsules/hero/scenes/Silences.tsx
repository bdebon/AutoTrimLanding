import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { LongWave, waveMapping, type WaveZone } from "../../../components/LongWave";
import { MotionBlur } from "../../../components/MotionBlur";
import { ease, mix, mixColor, ramp } from "../../../lib/motion";
import { color, wave } from "../../../tokens";
import { COARSE, strip } from "../data";
import { T, type heroLayout } from "../timeline";

type Layout = ReturnType<typeof heroLayout>;

/**
 * 0-6 s. The rush slides in from the right, wider than the screen; its silences hatch one
 * after the other, left to right, then all close at once and the speech joins up. The
 * joined speech glides to the first hesitation (one smooth goto, motion-blurred), and the
 * viewer is zoomed into it (the next scene takes over, same place, finer bars).
 */
export const Silences: React.FC<{ time: number; layout: Layout; width: number }> = ({ time, layout, width }) => {
  if (time >= T.zoom.start + T.zoom.duration) return null;
  // Bars moving faster than their own pitch strobe (the entry, the silences closing, the
  // goto). The blur stays on for the whole scene: switched on and off, it shows.
  return (
    <MotionBlur>
      <Layer layout={layout} width={width} />
    </MotionBlur>
  );
};

/**
 * Where the camera is during the goto, on the closed clock (the silences are gone by then):
 * undefined before, so the wave keeps its anchor while the silences close.
 */
const gotoAt = (zones: WaveZone[], time: number) => {
  if (time < T.goto.start) return undefined;
  const { closed } = waveMapping(zones, COARSE);
  return mix(closed(strip.focus), closed(strip.target), ramp(time, T.goto.start, T.goto.duration, ease.goto));
};

const Layer: React.FC<{ layout: Layout; width: number }> = ({ layout: L, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const s = L.s;
  const zoom = ramp(time, T.zoom.start, T.zoom.duration, ease.inOut);
  if (zoom >= 1) return null;
  const pps = (wave.barPitch * s) / COARSE;
  const entered = ramp(time, T.waveIn.start, T.waveIn.duration, ease.out);
  // At the start, strip time 0 stands at the right edge of the frame
  const offset = (1 - entered) * (width / 2 + strip.focus * pps);
  const closed = ramp(time, T.close.start, T.close.duration, ease.heavy);
  const cutBars = 1 - ramp(time, T.cutBarsOut.start, T.cutBarsOut.duration, ease.inOut);

  // Hatch order: left to right across what is on screen
  const viewStart = strip.focus - width / 2 / pps;
  const visible = strip.silences.filter(([s0, e0]) => e0 > viewStart && s0 < viewStart + width / pps);
  const zones: WaveZone[] = strip.silences.map(([start, end]) => {
    const index = visible.findIndex(([s0]) => s0 === start);
    const rank = index >= 0 ? index : start < viewStart ? 0 : visible.length;
    const at = T.hatchStart + rank * T.hatchStagger;
    return {
      start,
      end,
      band: ramp(time, at, T.hatchPop, ease.out),
      bars: cutBars,
      remaining: 1 - closed,
    };
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 1 - zoom,
        transform: `scale(${1 + 4 * zoom})`,
        transformOrigin: `${width / 2}px ${L.waveMid}px`,
      }}
    >
      <LongWave
        amps={strip.amps}
        secondsPerBar={COARSE}
        zones={zones}
        anchorTime={strip.focus}
        anchorClosed={gotoAt(zones, time)}
        anchorX={width / 2 + offset}
        midline={L.waveMid}
        trackHeight={L.track}
        scale={s}
        frameWidth={width}
        barColor={mixColor(color.waveRawBar, color.waveKeptBar, ramp(time, T.keptAccent.start, T.keptAccent.duration, ease.inOut))}
      />
    </div>
  );
};

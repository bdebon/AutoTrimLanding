import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Chip } from "../../../components/Chip";
import { LongWave, waveMapping, type WaveTick, type WaveZone } from "../../../components/LongWave";
import { MotionBlur } from "../../../components/MotionBlur";
import { Transcript, type TranscriptWord } from "../../../components/Transcript";
import { ease, mix, mixColor, ramp } from "../../../lib/motion";
import { measureLine, parseLine, placeSlots, type TextStyle } from "../../../lib/sentence";
import { color, font } from "../../../tokens";
import { beatLine, beats, FINE, fineAmps } from "../data";
import type { HeroProps } from "../schema";
import { T, type heroLayout } from "../timeline";
import { beatTimes } from "./Hud";

type Layout = ReturnType<typeof heroLayout>;

/**
 * 5.3-14.3 s. Zoomed into the joined speech: three real hesitations of the rush, one after the
 * other. Each one: the camera pans to it, ivory pill on the word and ivory-edged band under
 * its bars, the word goes, the band closes and leaves an ivory tick above the track.
 */
export const Hesitations: React.FC<{ time: number; layout: Layout; width: number; copy: HeroProps }> = ({ time, layout, width, copy }) => {
  if (time < T.zoom.start || time > T.waveOut.start + T.waveOut.duration) return null;
  // Blurred for the whole scene, like the one before: the zoom and the pans stay smooth
  return (
    <MotionBlur>
      <Layer layout={layout} width={width} copy={copy} />
    </MotionBlur>
  );
};

const Layer: React.FC<{ layout: Layout; width: number; copy: HeroProps }> = ({ layout: L, width, copy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const s = L.s;
  const zoom = ramp(time, T.zoom.start, T.zoom.duration, ease.inOut);
  const out = ramp(time, T.waveOut.start, T.waveOut.duration, ease.in);
  const hesitationWord = copy.lang === "fr" ? "euh" : "um";
  const lines = beats.map((beat, k) => copy.hesitationLines[k] || beatLine(beat, hesitationWord, k, copy.lang));
  const style: TextStyle = { fontFamily: font.ui, fontSize: (L.portrait ? 26 : 30) * s, fontWeight: 500 };
  const measured = useMemo(() => lines.map((line) => measureLine(parseLine(line), style, 1)), [lines.join("|"), style.fontSize]);
  if (zoom <= 0 || out >= 1) return null;

  const zones: WaveZone[] = beats.map((beat, k) => {
    const bt = beatTimes(k);
    return {
      start: beat.start,
      end: beat.end,
      band: ramp(time, bt.detect.start, bt.detect.duration),
      bars: 1 - ramp(time, bt.fadeWord.start, bt.fadeWord.duration),
      remaining: 1 - ramp(time, bt.close.start, bt.close.duration, ease.heavy),
      edge: color.ivory,
    };
  });
  // Camera: centred on the beat under way, panning to the next one on the closed clock (the
  // hesitation it leaves is already gone: on strip time the pan would stall crossing it)
  const clock = waveMapping(zones, FINE).closed;
  let anchor = clock((beats[0].start + beats[0].end) / 2);
  beats.forEach((beat, k) => {
    if (k === 0) return;
    const bt = beatTimes(k);
    anchor = mix(anchor, clock((beat.start + beat.end) / 2), ramp(time, bt.pan.start, bt.pan.duration, ease.goto));
  });

  const ticks: WaveTick[] = beats.map((beat, k) => ({
    time: beat.start,
    opacity: ramp(time, beatTimes(k).close.start + beatTimes(k).close.duration - 0.15, 0.25),
  }));

  // The line under the wave belongs to the latest beat that has started
  const current = beats.reduce((last, _, k) => (time >= beatTimes(k).pan.start ? k : last), 0);
  const bt = beatTimes(current);
  const next = current + 1 < beats.length ? beatTimes(current + 1).pan.start : T.waveOut.start;
  const lineIn = ramp(time, current === 0 ? T.zoom.start + T.zoom.duration * 0.6 : bt.line.start, bt.line.duration);
  const lineOut = ramp(time, next - 0.05, 0.2, ease.in);
  const detected = ramp(time, bt.detect.start, bt.detect.duration);
  const gone = ramp(time, bt.fadeWord.start, bt.fadeWord.duration, ease.inOut);
  const closed = ramp(time, bt.close.start, bt.close.duration, ease.heavy);
  const m = measured[current];
  const { slots } = placeSlots(m.tokens, m.tokens.map((t) => (t.hesitation ? 1 - closed : 1)));
  const words: TranscriptWord[] = m.tokens.map((token, i) => ({
    text: token.text,
    x: width / 2 + slots[i].x + (slots[i].width - token.slotWidth) / 2 + token.textLeft,
    opacity: (token.hesitation ? 1 - gone : 1) * lineIn * (1 - lineOut),
    color: token.hesitation ? mixColor(color.text, color.onAccent, detected) : mixColor(color.text, color.textDim, detected * (1 - closed)),
    pill: token.hesitation ? detected : 0,
    pillColor: color.ivory,
    scale: token.hesitation ? mix(1, 0.94, gone) : undefined,
    dy: (1 - lineIn) * 10 * s,
  }));

  const badge = ramp(time, T.badgeIn.start, T.badgeIn.duration) * (1 - ramp(time, T.hesitationsOut.start, T.hesitationsOut.duration, ease.in));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: zoom * (1 - out),
        transform: `scale(${0.2 + 0.8 * zoom}) translateY(${-out * 30 * s}px)`,
        transformOrigin: `${width / 2}px ${L.waveMid}px`,
      }}
    >
      <LongWave
        amps={fineAmps}
        secondsPerBar={FINE}
        zones={zones}
        ticks={ticks}
        anchorTime={(beats[0].start + beats[0].end) / 2}
        anchorClosed={anchor}
        anchorX={width / 2}
        midline={L.waveMid}
        trackHeight={L.track}
        scale={s}
        frameWidth={width}
        barColor={color.waveKeptBar}
      />
      <Transcript words={words} top={L.waveMid + L.track / 2 + 40 * s} style={style} />
      {badge > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: L.captionY + L.captionSize * 0.9,
            display: "flex",
            justifyContent: "center",
            opacity: badge,
            transform: `translateY(${(1 - badge) * 8 * s}px)`,
          }}
        >
          <Chip label={copy.localBadge} icon="shield" tone="soft" scale={s} />
        </div>
      ) : null}
    </div>
  );
};

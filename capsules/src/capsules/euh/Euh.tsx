import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Counter } from "../../components/Counter";
import { EndCard } from "../../components/EndCard";
import { HatchBand } from "../../components/HatchBand";
import { Transcript, type TranscriptWord } from "../../components/Transcript";
import { WaveBars, WaveWell, type Bar } from "../../components/WaveBars";
import { useFontsReady } from "../../fonts";
import { ease, mix, mixColor, ramp } from "../../lib/motion";
import { measureLine, placeSlots, slotAmplitudes, type TextStyle } from "../../lib/sentence";
import { color, font, scaleFor, wave } from "../../tokens";
import type { EuhProps } from "./schema";
import { euhTimeline, room, speech } from "./timeline";

/**
 * Loudness is in dB, where speech sits in a narrow band near the top: raised to this power
 * the bars keep the real syllables' shape instead of reading as a flat wall.
 */
const BAR_CONTRAST = 2;

/**
 * Capsule #2, "Euh." A line types itself in over its waveform, the hesitation is found,
 * removed, and the line closes up. Then the end card. Loops: first and last frames are the
 * same empty ground.
 */
export const Euh: React.FC<EuhProps> = (props) => {
  const fontsReady = useFontsReady();
  return <CapsuleFrame soundtrack={props.soundtrack} captions={props.captions}>{fontsReady ? <Scene {...props} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<EuhProps> = ({ line, counterLabel, counterFrom, counterTo, name, version, tagline }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = frame / fps;
  const s = scaleFor(width);
  const tl = useMemo(() => euhTimeline(line), [line]);

  const pitch = wave.barPitch * s;
  const barWidth = wave.barWidth * s;

  // The line fits 84 % of the width at most
  const { style, measured } = useMemo(() => {
    const base: TextStyle = { fontFamily: font.ui, fontSize: 50 * s, fontWeight: 500 };
    let m = measureLine(tl.tokens, base, pitch);
    const room = width * 0.84;
    if (m.total <= room) return { style: base, measured: m };
    const fitted = { ...base, fontSize: (base.fontSize * room) / m.total };
    m = measureLine(tl.tokens, fitted, pitch);
    return { style: fitted, measured: m };
  }, [tl, s, pitch, width]);

  const amplitudes = useMemo(
    () => measured.tokens.map((token, i) => slotAmplitudes(token, tl.sources[i], room, speech, pitch, i + 1)),
    [measured, tl, pitch]
  );

  // ---- Progress of each beat ------------------------------------------------------
  const detected = ramp(time, tl.detect.start, tl.detect.duration);
  const removed = ramp(time, tl.remove.start, tl.remove.duration, ease.inOut);
  const closed = ramp(time, tl.collapse.start, tl.collapse.duration, ease.heavy);
  const ticked = ramp(time, tl.tick.start, tl.tick.duration);
  const settled = ramp(time, tl.settle.start, tl.settle.duration, ease.inOut);
  const exited = ramp(time, tl.exit.start, tl.exit.duration, ease.in);
  const faded = ramp(time, tl.fade.start, tl.fade.duration, ease.inOut);
  const shown = ramp(time, 0.15, 0.4) * (1 - exited);

  // ---- Geometry ---------------------------------------------------------------------
  const remaining = measured.tokens.map((t) => (t.hesitation ? 1 - closed : 1));
  const { slots, total } = placeSlots(measured.tokens, remaining);
  const cx = width / 2;
  const wellHeight = 64 * s;
  const gap = 30 * s;
  const groupHeight = style.fontSize + gap + wellHeight;
  const lift = exited * -18 * s;
  const textTop = (height - groupHeight) / 2 + lift;
  const wellTop = textTop + style.fontSize + gap;
  const midline = wellTop + wellHeight / 2;
  const wellPad = 10 * s;
  const maxHalf = wellHeight * wave.maxHalf;

  // ---- Words --------------------------------------------------------------------
  const words: TranscriptWord[] = measured.tokens.map((token, i) => {
    const arrive = ramp(time, tl.words[i].appear, 0.22);
    const x = cx + slots[i].x + (slots[i].width - token.slotWidth) / 2 + token.textLeft;
    if (token.hesitation) {
      return {
        text: token.text,
        x,
        opacity: arrive * (1 - removed) * shown,
        dy: (1 - arrive) * 14 * s,
        color: mixColor(color.text, color.onAccent, detected),
        pill: detected,
        pillColor: color.ivory,
        scale: mix(1, 0.94, removed),
      };
    }
    // The other words step back while the hesitation is shown, and come back when it is gone
    const dim = detected * (1 - settled);
    return {
      text: token.text,
      x,
      opacity: arrive * shown,
      dy: (1 - arrive) * 14 * s,
      color: mixColor(color.text, color.textDim, dim),
    };
  });

  // ---- Bars ------------------------------------------------------------------------
  const bars: Bar[] = [];
  measured.tokens.forEach((token, i) => {
    const amps = amplitudes[i];
    // The waveform is written left to right as the words are said: this slot's bars grow
    // between this word's arrival and the next one's
    const from = tl.words[i].appear;
    const to = i + 1 < tl.words.length ? tl.words[i + 1].appear : tl.typed;
    const slotLeft = cx + slots[i].x + (slots[i].width - token.slotWidth) / 2;
    amps.forEach((amp, b) => {
      const grow = ramp(time, mix(from, to, (b + 0.5) / amps.length) - 0.04, 0.16);
      if (grow <= 0) return;
      const half = Math.max(s, Math.pow(amp, BAR_CONTRAST) * maxHalf) * grow;
      if (token.hesitation) {
        bars.push({
          x: slotLeft + (b + 0.5) * pitch,
          half,
          color: mixColor(color.waveRawBar, color.waveCutBar, detected),
          opacity: (1 - removed) * shown,
        });
      } else {
        bars.push({
          x: slotLeft + (b + 0.5) * pitch,
          half,
          color: mixColor(color.waveRawBar, color.waveKeptBar, settled),
          opacity: shown,
        });
      }
    });
  });

  const hesitation = measured.tokens.findIndex((t) => t.hesitation);
  const band = hesitation >= 0 ? slots[hesitation] : null;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - faded }}>
        <WaveWell
          left={cx - total / 2 - wellPad}
          top={wellTop}
          width={total + wellPad * 2}
          height={wellHeight}
          scale={s}
          opacity={shown}
        />
        {band ? (
          <HatchBand
            centerX={cx + band.x + band.width / 2}
            width={band.width}
            top={wellTop}
            height={wellHeight}
            scale={s}
            edgeColor={color.ivory}
            edgeProgress={ramp(time, tl.detect.start + 0.1, 0.4)}
            // Gone before it becomes a hairline at the seam
            opacity={detected * shown * (1 - ramp(time, tl.collapse.start + tl.collapse.duration * 0.55, tl.collapse.duration * 0.3, ease.inOut))}
          />
        ) : null}
        <WaveBars bars={bars} midline={midline} barWidth={barWidth} scale={s} frameWidth={width} />
        <Transcript words={words} top={textTop} style={style} />

        <Counter
          label={counterLabel}
          from={counterFrom}
          to={counterTo}
          progress={ticked}
          scale={s}
          opacity={ramp(time, 0.2, 0.4) * (1 - exited)}
          style={{ position: "absolute", top: 40 * s, right: 40 * s }}
        />

        <EndCard
          name={name}
          version={version}
          line={tagline}
          scale={s}
          progress={{
            tile: ramp(time, tl.end.start, 0.45),
            glyph: ramp(time, tl.end.start + 0.1, 0.55, ease.inOut),
            title: ramp(time, tl.end.start + 0.15, 0.5),
            line: ramp(time, tl.end.start + 0.3, 0.5),
          }}
        />
      </div>
    </>
  );
};

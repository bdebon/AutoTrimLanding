import React, { useMemo } from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Icon } from "../../components/icons";
import { LongWave, waveMapping, type WaveZone } from "../../components/LongWave";
import { WaveWell } from "../../components/WaveBars";
import { useFontsReady } from "../../fonts";
import { ease, mix, mixColor, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { color, font, wave } from "../../tokens";
import { micBars, silences, SPEAKERS } from "../multicam/voices";
import type { MicCopy } from "./copy";

export const MIC_SECONDS = 8;

/** The stretch of the take the capsule shows: Marc, Julie, Marc, Julie overlapping, a pause. */
const WINDOW: [number, number] = [1.6, 17.6];
/** Seconds of audio per bar: the whole window across the frame. */
const SPB = 0.066;

/**
 * The blade's programme. It first tries a gap in Marc's track while Julie is talking and
 * bounces back; then it lands where both are silent, three times, each faster.
 * Times are window seconds for `at`, capsule seconds for the rest.
 */
const BLADE = {
  bounce: { at: 7.4, down: 1.35, up: 2.05 },
  cuts: [
    { move: 2.55, down: 2.85, close: 3.35 },
    { move: 4.05, down: 4.25, close: 4.65 },
    { move: 5.25, down: 5.4, close: 5.7 },
  ],
  lift: 6.25,
};
const LEGEND_IN = 6.35;

/**
 * Capsule #4, "Chaque micro, sa voix." Two voice tracks. A blade comes down on a gap of one
 * track, but the other is speaking: it bounces. It comes down where both are silent: the
 * band hatches and closes on both tracks at once. Three times, faster.
 */
export const Mic: React.FC<MicCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<MicCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth, margin } = useScene();
  const amps = useMemo(() => SPEAKERS.map((who) => micBars(who, WINDOW[0], WINDOW[1], SPB)), []);
  const gaps = useMemo(() => silences(WINDOW[0], WINDOW[1], 0.6), []);
  const span = WINDOW[1] - WINDOW[0];

  // The three cuts are the three longest gaps, in time order
  const cuts = useMemo(
    () =>
      [...gaps]
        .sort((a, b) => b[1] - b[0] - (a[1] - a[0]))
        .slice(0, 3)
        .sort((a, b) => a[0] - b[0]),
    [gaps]
  );

  const shown = ramp(time, 0.3, 0.5);
  const settled = ramp(time, LEGEND_IN - 0.2, 0.5, ease.inOut);
  const zones: WaveZone[] = cuts.map(([start, end], i) => {
    const c = BLADE.cuts[i];
    return {
      start,
      end,
      band: ramp(time, c.down + 0.22, 0.2, ease.out),
      bars: 1 - ramp(time, c.close - 0.1, 0.2),
      remaining: 1 - ramp(time, c.close, 0.55, ease.heavy),
    };
  });

  // Geometry: two tracks, labels on the left
  const labelW = 190 * s;
  const wellLeft = margin + labelW;
  const wellW = width - margin - wellLeft;
  const pitch = wave.barPitch * s;
  const pps = pitch / SPB;
  const trackH = 92 * s;
  const gap = 34 * s;
  const top = height * 0.5 - trackH - gap / 2 + 20 * s;
  const mids = [top + trackH / 2, top + trackH + gap + trackH / 2];
  const anchorTime = span / 2;
  const anchorX = wellLeft + wellW / 2;
  const { closed } = waveMapping(zones, SPB);
  const origin = closed(anchorTime);
  const xOf = (t: number) => anchorX + (closed(t) - origin) * pps;

  // The blade: where it stands (window seconds) and how far down it is
  let at = BLADE.bounce.at - WINDOW[0];
  let down = ramp(time, BLADE.bounce.down, 0.45, ease.heavy) * (1 - ramp(time, BLADE.bounce.up, 0.4, ease.out));
  BLADE.cuts.forEach((c, i) => {
    const target = (cuts[i][0] + cuts[i][1]) / 2;
    at = mix(at, target, ramp(time, c.move, 0.3, ease.inOut));
    const next = BLADE.cuts[i + 1]?.move ?? BLADE.lift;
    down = Math.max(down, ramp(time, c.down, 0.3, ease.heavy) * (1 - ramp(time, next, 0.25, ease.out)));
  });
  const bladeShown = ramp(time, BLADE.bounce.down - 0.3, 0.3) * (1 - ramp(time, BLADE.lift + 0.1, 0.3));
  const bladeX = xOf(at);
  const bladeTop = top - 40 * s;
  const bladeBottom = top + trackH * 2 + gap;
  const bladeY = mix(bladeTop - 80 * s, bladeTop, down);
  const bladeH = mix(40 * s, bladeBottom - bladeTop, down);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption text={copy.title} x={width / 2} y={captionY} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.2, 0.5)} exit={ramp(time, MIC_SECONDS - 1.0, 0.35, ease.in)} />
      {SPEAKERS.map((who, i) => (
        <React.Fragment key={who}>
          <div
            style={{
              position: "absolute",
              left: margin,
              top: mids[i] - 12 * s,
              display: "flex",
              alignItems: "center",
              gap: 9 * s,
              fontFamily: font.ui,
              fontSize: 15 * s,
              fontWeight: 500,
              color: color.textMuted,
              opacity: shown,
            }}
          >
            <Icon name="mic" size={16 * s} color={color.textDim} />
            {copy.rows[i]}
          </div>
          <WaveWell left={wellLeft - 10 * s} top={mids[i] - trackH / 2} width={wellW + 20 * s} height={trackH} scale={s} opacity={shown} />
          <div style={{ position: "absolute", left: wellLeft - 10 * s, top: mids[i] - trackH / 2, width: wellW + 20 * s, height: trackH, overflow: "hidden", opacity: shown }}>
            <LongWave
              amps={amps[i]}
              secondsPerBar={SPB}
              zones={zones}
              anchorTime={anchorTime}
              anchorX={anchorX - (wellLeft - 10 * s)}
              midline={trackH / 2}
              trackHeight={trackH}
              scale={s}
              frameWidth={wellW + 20 * s}
              barColor={mixColor(i === 0 ? color.textDim : color.textFaint, color.waveKeptBar, settled)}
              contrast={4.5}
            />
          </div>
        </React.Fragment>
      ))}
      {bladeShown > 0 ? (
        <div style={{ position: "absolute", left: bladeX - s, top: bladeY, width: 2 * s, height: bladeH, background: color.playhead, opacity: bladeShown, borderRadius: s }}>
          <div
            style={{
              position: "absolute",
              left: -5 * s,
              top: -6 * s,
              width: 12 * s,
              height: 9 * s,
              background: color.playhead,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>
      ) : null}
      <Caption
        text={copy.legend}
        x={width / 2}
        y={height * 0.84}
        fontSize={22 * s}
        maxWidth={contentWidth}
        enter={ramp(time, LEGEND_IN, 0.5)}
        exit={ramp(time, MIC_SECONDS - 0.9, 0.35, ease.in)}
        tone="muted"
      />
    </div>
  );
};

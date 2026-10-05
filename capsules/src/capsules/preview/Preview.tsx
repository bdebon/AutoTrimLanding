import React, { useMemo } from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { LongWave, type WaveZone } from "../../components/LongWave";
import { useFontsReady } from "../../fonts";
import { formatDuration } from "../../lib/format";
import { ease, mix, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { envelopePeak, joinedClock, silencesOf } from "../../lib/session";
import { color, displayTracking, font, radius, wave } from "../../tokens";
import { beats, rush, session } from "../hero/data";
import type { PreviewCopy } from "./copy";

export const PREVIEW_SECONDS = 8;
const PLAY_START = 0.5;
const ZOOM = { start: 3.4, duration: 0.9 };
/** Seconds per bar once zoomed: one minute across the well. */
const FINE = 0.25;
/** Finest sampling of the rush, pooled into whatever the zoom needs. */
const BASE = 0.05;

/**
 * Capsule #9, "Regardez avant d'exporter." The whole file with its three states, a playhead
 * running; then a zoom into one minute: each cut appears, and the playhead jumps the hatched
 * bands without a stutter while the clock keeps counting.
 */
export const Preview: React.FC<PreviewCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<PreviewCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth, margin } = useScene();
  const per = session.envelopePerSecond;
  const joined = useMemo(() => joinedClock(rush.kept), []);
  const base = useMemo(() => {
    const out = new Float32Array(Math.ceil(rush.duration / BASE));
    for (let i = 0; i < out.length; i++) out[i] = envelopePeak(rush, per, i * BASE, (i + 1) * BASE);
    return out;
  }, [per]);
  const silences = useMemo(() => silencesOf(rush), []);

  // The well: the whole file first, then one minute
  const wellX = margin;
  const wellW = width - 2 * margin;
  const trackH = 110 * s;
  const wellY = height * 0.46 - trackH / 2;
  const pitch = wave.barPitch * s;
  const wholeSpb = rush.duration / Math.floor(wellW / pitch);
  const zoom = ramp(time, ZOOM.start, ZOOM.duration, ease.inOut);
  const spb = Math.exp(mix(Math.log(wholeSpb), Math.log(FINE), zoom));
  const pps = pitch / spb;
  const amps = useMemo(() => {
    const count = Math.ceil(rush.duration / spb);
    const out = new Float32Array(count);
    const perBar = spb / BASE;
    for (let i = 0; i < count; i++) {
      let peak = 0;
      const a = Math.floor(i * perBar);
      const b = Math.max(a + 1, Math.floor((i + 1) * perBar));
      for (let k = a; k < b && k < base.length; k++) peak = Math.max(peak, base[k]);
      out[i] = peak;
    }
    return out;
  }, [base, spb]);

  // Playback: the joined clock runs at 1×, the source time jumps the silences
  const played = Math.max(0, time - PLAY_START);
  const p0 = Math.max(0, beats[0].start - 5.5);
  const playback = p0 + played;
  const src = joined.toSource(playback);
  // The zoom lands on the minute the playhead is in
  const zoomCenter = joined.toSource(p0 + (ZOOM.start + ZOOM.duration - PLAY_START) + 1.2);
  const xWhole = (t: number) => wellX + (t / rush.duration) * wellW;
  const anchorX = mix(xWhole(zoomCenter), wellX + wellW / 2, zoom);
  const xOf = (t: number) => anchorX + (t - zoomCenter) * pps;
  const playheadX = xOf(src);

  const zones: WaveZone[] = useMemo(
    () => [
      ...silences.map(([start, end]) => ({ start, end, remaining: 1, band: 1, bars: 1 })),
      ...rush.hesitations.map((h) => ({ start: h.start, end: h.end, remaining: 1, band: 1, bars: 1, edge: color.ivory })),
    ],
    [silences]
  );

  const shown = ramp(time, 0.25, 0.45);
  const chipH = 34 * s;
  const swatch = (kind: "kept" | "silence" | "hesitation") => (
    <span style={{ position: "relative", display: "inline-block", width: 34 * s, height: 16 * s, borderRadius: 4 * s, overflow: "hidden", background: kind === "kept" ? color.waveKeptBand : color.waveCutBand }}>
      {kind !== "kept" ? (
        <svg width={34 * s} height={16 * s} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={i * 6 * s - 8 * s} y1={0} x2={i * 6 * s + 8 * s} y2={16 * s} stroke={color.waveCutHatch} strokeWidth={2 * s} />
          ))}
        </svg>
      ) : null}
      {kind === "hesitation" ? <span style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3 * s, background: color.ivory }} /> : null}
      {kind === "kept" ? (
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 * s }}>
          {[5, 9, 7, 11, 6].map((h, i) => (
            <span key={i} style={{ width: 2 * s, height: h * s, borderRadius: s, background: color.accent }} />
          ))}
        </span>
      ) : null}
    </span>
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption text={copy.title} x={width / 2} y={captionY} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.2, 0.5)} exit={ramp(time, PREVIEW_SECONDS - 1.0, 0.35, ease.in)} />

      {/* The clock, top right */}
      <div
        style={{
          position: "absolute",
          right: margin,
          top: margin,
          height: 38 * s,
          padding: `0 ${16 * s}px`,
          display: "inline-flex",
          alignItems: "center",
          gap: 10 * s,
          borderRadius: radius.pill,
          background: color.bgCard,
          border: `${s}px solid ${color.border}`,
          opacity: shown,
        }}
      >
        <span style={{ fontFamily: font.ui, fontSize: 12.5 * s, color: color.textDim, fontWeight: 500 }}>{copy.playback}</span>
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22 * s, letterSpacing: displayTracking, fontVariantNumeric: "tabular-nums", color: color.text }}>
          {formatDuration(playback)}
        </span>
      </div>

      <div style={{ position: "absolute", left: wellX, top: wellY, width: wellW, height: trackH, borderRadius: radius.inset * s, background: color.bgInset, overflow: "hidden", opacity: shown }}>
        <LongWave amps={amps} secondsPerBar={spb} zones={zones} anchorTime={zoomCenter} anchorX={anchorX - wellX} midline={trackH / 2} trackHeight={trackH} scale={s} frameWidth={wellW} barColor={color.waveKeptBar} contrast={2.2} />
        {playheadX >= wellX && playheadX <= wellX + wellW ? (
          <>
            <div style={{ position: "absolute", left: playheadX - wellX - s, top: 0, width: 2 * s, height: trackH, background: color.playhead }} />
            <div style={{ position: "absolute", left: playheadX - wellX - 6 * s, top: 0, width: 12 * s, height: 8 * s, background: color.playhead, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          </>
        ) : null}
      </div>

      {/* The three states */}
      <div style={{ position: "absolute", left: wellX, top: wellY + trackH + 22 * s, display: "flex", gap: 10 * s, opacity: shown }}>
        {(["kept", "silence", "hesitation"] as const).map((kind) => (
          <span key={kind} style={{ display: "inline-flex", alignItems: "center", gap: 9 * s, height: chipH, padding: `0 ${14 * s}px`, borderRadius: radius.pill, background: color.bgCard, border: `${s}px solid ${color.border}`, fontFamily: font.ui, fontSize: 12.5 * s, fontWeight: 500, color: color.text }}>
            {swatch(kind)}
            {copy[kind]}
          </span>
        ))}
      </div>

      <Caption text={copy.legend} x={width / 2} y={height * 0.84} fontSize={22 * s} maxWidth={contentWidth} enter={ramp(time, ZOOM.start + ZOOM.duration + 0.4, 0.5)} exit={ramp(time, PREVIEW_SECONDS - 0.9, 0.35, ease.in)} tone="muted" />
    </div>
  );
};

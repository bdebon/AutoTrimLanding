import React from "react";
import { color, font, radius } from "../tokens";
import { Icon } from "./icons";
import { LongWave, type WaveZone } from "./LongWave";

/**
 * A processed file on the session screen (artboard 05-complete): check tile, name, what it
 * became ("4:38 → 3:10 · −32 % · 70 coupes"), Preview, and the whole file in its well:
 * kept speech in accent bars, removed zones hatched, hesitations with an ivory edge.
 */
export interface SessionCardFile {
  duration: number;
  /** Kept segments, source seconds. */
  kept: [number, number][];
  /** Hesitations taken out, source seconds. */
  hesitations: { start: number; end: number }[];
  /** Loudness 0..1 at a source time. */
  sample: (t: number) => number;
}

export const SESSION_CARD_HEIGHT = 158;

export const SessionCard: React.FC<{
  name: string;
  meta: React.ReactNode;
  wholeFile: string;
  preview: string;
  file: SessionCardFile;
  x: number;
  y: number;
  width: number;
  scale: number;
  opacity?: number;
}> = ({ name, meta, wholeFile, preview, file, x, y, width, scale: s, opacity = 1 }) => {
  const wellW = width - 32 * s;
  const wellH = 64 * s;
  // Bars on the app's pitch, one per slice of the file
  const pitch = 4 * s * 0.75;
  const count = Math.floor(wellW / pitch);
  const secondsPerBar = file.duration / count;
  const amps = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let peak = 0;
    for (let k = 0; k < 4; k++) peak = Math.max(peak, file.sample(i * secondsPerBar + (k / 4) * secondsPerBar));
    amps[i] = peak;
  }
  const zones: WaveZone[] = [];
  let cursor = 0;
  for (const [a, b] of [...file.kept, [file.duration, file.duration] as [number, number]]) {
    if (a > cursor + 1e-3) {
      const hesitation = file.hesitations.some((h) => h.end > cursor && h.start < a);
      zones.push({ start: cursor, end: a, remaining: 1, band: 1, bars: 1, edge: hesitation ? color.ivory : undefined });
    }
    cursor = Math.max(cursor, b);
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: SESSION_CARD_HEIGHT * s,
        boxSizing: "border-box",
        borderRadius: radius.card * s,
        border: `${s}px solid ${color.border}`,
        background: color.bgCard,
        opacity,
        fontFamily: font.ui,
      }}
    >
      <div style={{ position: "absolute", left: 16 * s, right: 16 * s, top: 14 * s, height: 36 * s, display: "flex", alignItems: "center", gap: 12 * s }}>
        <Icon name="chevronDown" size={13 * s} color={color.textDim} />
        <div
          style={{
            width: 28 * s,
            height: 28 * s,
            borderRadius: 999,
            background: color.accentSoft,
            color: color.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="check" size={13 * s} />
        </div>
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5 * s, fontWeight: 500, color: color.text, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontSize: 11.5 * s, color: color.textDim, marginTop: 2 * s, whiteSpace: "nowrap" }}>{meta}</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6 * s,
            height: 30 * s,
            padding: `0 ${13 * s}px`,
            borderRadius: 999,
            background: color.bgChip,
            fontSize: 12 * s,
            fontWeight: 500,
            color: color.text,
          }}
        >
          <Icon name="play" size={9 * s} />
          {preview}
        </div>
        <div
          style={{
            width: 30 * s,
            height: 30 * s,
            borderRadius: 999,
            border: `${s}px solid ${color.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2.5 * s,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 2.6 * s, height: 2.6 * s, borderRadius: 9, background: color.textDim }} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 16 * s,
          top: 62 * s,
          width: wellW,
          height: wellH,
          borderRadius: radius.inset * s,
          background: color.bgInset,
          overflow: "hidden",
        }}
      >
        <LongWave
          amps={amps}
          secondsPerBar={secondsPerBar}
          zones={zones}
          anchorTime={file.duration / 2}
          anchorX={wellW / 2}
          midline={wellH / 2}
          trackHeight={wellH}
          scale={s * 0.75}
          frameWidth={wellW}
          barColor={color.waveKeptBar}
          contrast={2.4}
        />
      </div>
      <div style={{ position: "absolute", left: 26 * s, top: 134 * s, fontSize: 11 * s, color: color.textDim }}>{wholeFile}</div>
    </div>
  );
};

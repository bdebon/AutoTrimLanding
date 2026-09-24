import React from "react";
import { font } from "../tokens";

/**
 * The timeline as it lands in a magnetic editor, the way Final Cut Pro shows a project: no
 * tracks, the clips end to end on one primary storyline, each one a blue block with its
 * film strip on top and its waveform below, a yellow bracket on a selected edge. Evokes the
 * look without copying any logo or name: the window only carries the project's name.
 * Cuts are edited here, after the export, never in AutoTrim.
 */
export const magneticPalette = {
  window: "#1E1E1F",
  titleBar: "#2B2B2D",
  titleText: "#A9A9AD",
  header: "#262628",
  headerText: "#C9C9CD",
  headerDim: "#8A8A8F",
  timeline: "#1A1A1B",
  ruler: "#222224",
  rulerText: "#8E8E93",
  rulerTick: "#3C3C40",
  storyline: "#232326",
  clip: "#3D5FA8",
  clipEdge: "#6F90D8",
  film: ["#32508F", "#2C4880"],
  audio: "#2F4C8A",
  wave: "#9CC0F4",
  label: "#EEF2FB",
  playhead: "#F2F2F2",
  selected: "#F5C518",
} as const;

export interface MagneticClip {
  start: number;
  end: number;
  sourceStart: number;
  label: string;
  sample: (sourceTime: number) => number;
}

const timecode = (t: number, fps: number) => {
  const total = Math.max(0, Math.round(t * fps));
  const pad = (n: number) => String(n).padStart(2, "0");
  const secs = Math.floor(total / fps);
  return `${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}:${pad(total % fps)}`;
};

/** Vertical centre of the storyline's clips, from the window's top, in window pixels. */
export const magneticClipCenter = (scale: number) => (30 + 32 + 24 + 36 + 48) * scale;

export const MagneticEditor: React.FC<{
  project: string;
  /** Shown next to the project name, like the editor does. */
  duration: string;
  clips: MagneticClip[];
  viewStart: number;
  pxPerSecond: number;
  fps: number;
  playhead: number;
  /** The selected clip edge, timeline seconds. */
  edge?: { time: number; opacity: number };
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  opacity?: number;
}> = ({ project, duration, clips, viewStart, pxPerSecond, fps, playhead, edge, x, y, width, height, scale: s, opacity = 1 }) => {
  const P = magneticPalette;
  const titleBar = 30 * s;
  const header = 32 * s;
  const ruler = 24 * s;
  const clipTop = titleBar + header + ruler + 36 * s;
  const clipH = 96 * s;
  const filmH = 58 * s;
  const left = 10 * s;
  const right = width - 10 * s;
  const tx = (t: number) => left + (t - viewStart) * pxPerSecond;
  const step = pxPerSecond > 150 ? 1 : 5;
  const ticks: number[] = [];
  for (let t = Math.ceil(viewStart / step) * step; tx(t) < right; t += step) ticks.push(t);
  const cell = 52 * s;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 10 * s,
        background: P.window,
        overflow: "hidden",
        opacity,
        fontFamily: font.ui,
        border: `${s}px solid #36363A`,
        boxShadow: `0 ${24 * s}px ${60 * s}px rgba(0,0,0,0.6)`,
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: titleBar, background: P.titleBar, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 7 * s, marginLeft: 12 * s }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 11 * s, height: 11 * s, borderRadius: 99, background: c }} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: titleBar,
          height: header,
          background: P.header,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10 * s,
          fontSize: 12 * s,
        }}
      >
        <span style={{ color: P.headerText, fontWeight: 600 }}>{project}</span>
        <span style={{ color: P.headerDim, fontVariantNumeric: "tabular-nums" }}>{duration}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: titleBar + header, bottom: 0, background: P.timeline }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: titleBar + header, height: ruler, background: P.ruler }} />
      {ticks.map((t) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: tx(t),
            top: titleBar + header + 5 * s,
            height: ruler - 5 * s,
            borderLeft: `${s}px solid ${P.rulerTick}`,
            paddingLeft: 4 * s,
            fontSize: 10 * s,
            color: P.rulerText,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {timecode(t, fps)}
        </div>
      ))}
      {/* The primary storyline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: clipTop - 6 * s, height: clipH + 12 * s, background: P.storyline }} />
      {clips.map((clip, i) => {
        const x0 = Math.max(left, tx(clip.start));
        const x1 = Math.min(right, tx(clip.end));
        if (x1 - x0 < 1) return null;
        const w = x1 - x0 - 1.5 * s;
        let bars = "";
        const waveH = clipH - filmH;
        for (let bx = 2 * s; bx < w - 2 * s; bx += 2.5 * s) {
          const t = clip.sourceStart + (viewStart + (x0 + bx - left) / pxPerSecond - clip.start);
          const b = Math.max(0.6 * s, Math.pow(clip.sample(t), 1.6) * waveH * 0.42);
          bars += `M${bx} ${waveH / 2 - b}h${1.6 * s}v${b * 2}h${-1.6 * s}z`;
        }
        // Film cells stay anchored to the clip's start, so they slide with it
        const cellOffset = (tx(clip.start) - x0) % cell;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0,
              top: clipTop,
              width: w,
              height: clipH,
              boxSizing: "border-box",
              borderRadius: 5 * s,
              border: `${s}px solid ${P.clipEdge}`,
              background: P.clip,
              overflow: "hidden",
            }}
          >
            <svg width={w} height={filmH} style={{ position: "absolute", left: 0, top: 0 }}>
              {Array.from({ length: Math.ceil(w / cell) + 2 }, (_, k) => (
                <rect key={k} x={cellOffset + (k - 1) * cell + s} y={s} width={cell - 2 * s} height={filmH - 2 * s} fill={P.film[k % 2]} />
              ))}
            </svg>
            <span style={{ position: "absolute", left: 6 * s, top: 4 * s, fontSize: 11 * s, fontWeight: 500, color: P.label, whiteSpace: "nowrap" }}>{clip.label}</span>
            <div style={{ position: "absolute", left: 0, right: 0, top: filmH, bottom: 0, background: P.audio }}>
              <svg width={w} height={waveH} style={{ position: "absolute", left: 0, top: 0 }}>
                <path d={bars} fill={P.wave} />
              </svg>
            </div>
          </div>
        );
      })}
      {edge && edge.opacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: tx(edge.time) - 6 * s,
            top: clipTop - 2 * s,
            width: 6 * s,
            height: clipH + 4 * s,
            boxSizing: "border-box",
            borderRadius: `${3 * s}px 0 0 ${3 * s}px`,
            border: `${2.5 * s}px solid ${P.selected}`,
            borderRight: "none",
            opacity: edge.opacity,
          }}
        />
      ) : null}
      {tx(playhead) >= left && tx(playhead) <= right ? (
        <>
          <div style={{ position: "absolute", left: tx(playhead) - s, top: titleBar + header, width: 2 * s, bottom: 0, background: P.playhead }} />
          <div
            style={{
              position: "absolute",
              left: tx(playhead) - 6 * s,
              top: titleBar + header,
              width: 12 * s,
              height: 9 * s,
              background: P.playhead,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </>
      ) : null}
    </div>
  );
};

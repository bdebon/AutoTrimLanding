import React from "react";
import { font } from "../tokens";

/**
 * The editor a timeline lands in after the export: Final Cut, Premiere, Resolve, CapCut…
 * Deliberately NOT AutoTrim: its own neutral greys, blue video, green audio, red playhead,
 * a plain window. Generic on purpose too: no editor's layout, logo or name is copied.
 * Cuts are edited here, never in AutoTrim.
 */
export const editorPalette = {
  window: "#1B1C20",
  titleBar: "#25262B",
  titleText: "#A7A9B0",
  panel: "#141518",
  header: "#1F2024",
  headerText: "#8D9098",
  ruler: "#1D1E22",
  rulerText: "#7D8088",
  rulerTick: "#3A3C43",
  lane: "#18191D",
  video: ["#3E5190", "#34467E"],
  videoEdge: "#6177C2",
  videoText: "#DDE3F7",
  audio: "#2C5642",
  audioEdge: "#4E8C6C",
  audioWave: "#93D6B2",
  playhead: "#E5484D",
  handle: "#F2C94C",
} as const;

export interface EditorClip {
  start: number;
  end: number;
  sourceStart: number;
  label: string;
  /** Alternates the video colour between source files. */
  tone: number;
  sample: (sourceTime: number) => number;
}

const timecode = (t: number, fps: number) => {
  const total = Math.max(0, Math.round(t * fps));
  const f = total % fps;
  const secs = Math.floor(total / fps);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}:${pad(f)}`;
};

export const EditorWindow: React.FC<{
  title: string;
  clips: EditorClip[];
  /** Timeline second at the left edge of the lanes. */
  viewStart: number;
  pxPerSecond: number;
  fps: number;
  playhead: number;
  /** The clip edge being pulled, timeline seconds, and how visible its handle is. */
  handle?: { time: number; opacity: number };
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  opacity?: number;
}> = ({ title, clips, viewStart, pxPerSecond, fps, playhead, handle, x, y, width, height, scale: s, opacity = 1 }) => {
  const P = editorPalette;
  const titleBar = 30 * s;
  const header = 64 * s;
  const ruler = 26 * s;
  const laneH = { v2: 30 * s, v1: 46 * s, a1: 58 * s, a2: 30 * s };
  const gap = 4 * s;
  const top0 = titleBar + ruler + 10 * s;
  const rows = [
    { name: "V2", kind: "empty", h: laneH.v2 },
    { name: "V1", kind: "video", h: laneH.v1 },
    { name: "A1", kind: "audio", h: laneH.a1 },
    { name: "A2", kind: "empty", h: laneH.a2 },
  ];
  let yy = top0;
  const placed = rows.map((r) => {
    const row = { ...r, top: yy };
    yy += r.h + gap;
    return row;
  });
  const laneLeft = header;
  const laneRight = width - 8 * s;
  const tx = (t: number) => laneLeft + (t - viewStart) * pxPerSecond;
  const step = pxPerSecond > 150 ? 1 : 5;
  const ticks: number[] = [];
  for (let t = Math.ceil(viewStart / step) * step; tx(t) < laneRight; t += step) ticks.push(t);

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
        boxShadow: `0 ${24 * s}px ${60 * s}px rgba(0,0,0,0.6)`,
        border: `${s}px solid #2E3036`,
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: titleBar, background: P.titleBar, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 7 * s, marginLeft: 12 * s }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 11 * s, height: 11 * s, borderRadius: 99, background: c }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 12 * s, color: P.titleText }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: titleBar, bottom: 0, background: P.panel }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: titleBar, height: ruler, background: P.ruler }} />
      {ticks.map((t) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: tx(t),
            top: titleBar + 6 * s,
            height: ruler - 6 * s,
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
      {placed.map((row) => (
        <React.Fragment key={row.name}>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: header - 6 * s,
              top: row.top,
              height: row.h,
              background: P.header,
              color: P.headerText,
              fontSize: 11 * s,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              paddingLeft: 12 * s,
              boxSizing: "border-box",
            }}
          >
            {row.name}
          </div>
          <div style={{ position: "absolute", left: laneLeft, right: 8 * s, top: row.top, height: row.h, background: P.lane }} />
          {row.kind !== "empty"
            ? clips.map((clip, i) => {
                const x0 = Math.max(laneLeft, tx(clip.start));
                const x1 = Math.min(laneRight, tx(clip.end));
                if (x1 - x0 < 1) return null;
                const video = row.kind === "video";
                let bars = "";
                if (!video) {
                  const half = row.h * 0.4;
                  for (let bx = x0 + 2 * s; bx < x1 - 2 * s; bx += 3 * s) {
                    const t = clip.sourceStart + (viewStart + (bx - laneLeft) / pxPerSecond - clip.start);
                    const b = Math.max(0.6 * s, Math.pow(clip.sample(t), 1.6) * half);
                    bars += `M${bx - x0} ${row.h / 2 - b}h${2 * s}v${b * 2}h${-2 * s}z`;
                  }
                }
                return (
                  <div
                    key={`${row.name}-${i}`}
                    style={{
                      position: "absolute",
                      left: x0,
                      top: row.top,
                      width: x1 - x0 - s,
                      height: row.h,
                      boxSizing: "border-box",
                      borderRadius: 4 * s,
                      background: video ? P.video[clip.tone % 2] : P.audio,
                      border: `${s}px solid ${video ? P.videoEdge : P.audioEdge}`,
                      overflow: "hidden",
                    }}
                  >
                    {video ? (
                      <span style={{ position: "absolute", left: 6 * s, top: 5 * s, fontSize: 11 * s, color: P.videoText, whiteSpace: "nowrap" }}>{clip.label}</span>
                    ) : (
                      <svg width={x1 - x0} height={row.h} style={{ position: "absolute", left: 0, top: -s }}>
                        <path d={bars} fill={P.audioWave} />
                      </svg>
                    )}
                  </div>
                );
              })
            : null}
        </React.Fragment>
      ))}
      {handle && handle.opacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: tx(handle.time) - 3 * s,
            top: placed[1].top - 2 * s,
            width: 5 * s,
            height: placed[2].top + placed[2].h - placed[1].top + 4 * s,
            borderRadius: 2 * s,
            border: `${2 * s}px solid ${P.handle}`,
            borderLeft: "none",
            opacity: handle.opacity,
          }}
        />
      ) : null}
      {tx(playhead) >= laneLeft && tx(playhead) <= laneRight ? (
        <div style={{ position: "absolute", left: tx(playhead) - s, top: titleBar, width: 2 * s, height: height - titleBar, background: P.playhead }} />
      ) : null}
    </div>
  );
};

import React from "react";
import { color, displayTracking, font } from "../tokens";
import { Chip } from "./Chip";
import { PulseGlyph } from "./PulseGlyph";

export interface EndCardProgress {
  /** Tile arriving (0..1). */
  tile: number;
  /** Pulse tracing itself (0..1). */
  glyph: number;
  /** Name arriving (0..1). */
  title: number;
  /** Tagline arriving (0..1). */
  line: number;
  /** Small note arriving (0..1). */
  note?: number;
}

/**
 * Closing card of every capsule: the app icon, the name, one line. Centred on the frame;
 * `scale` is the capsule's app-to-video scale.
 */
export const EndCard: React.FC<{
  name: string;
  /** Shown after the name, in accent: "2". */
  version?: string;
  line: string;
  /** A quieter mention under the line: a chip. */
  note?: string;
  progress: EndCardProgress;
  scale: number;
  opacity?: number;
}> = ({ name, version, line, note, progress, scale, opacity = 1 }) => {
  const titleSize = 46 * scale;
  const tileSize = 58 * scale;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22 * scale,
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 * scale }}>
        <PulseGlyph
          size={tileSize}
          tile
          draw={progress.glyph}
          tileScale={0.8 + 0.2 * progress.tile}
          style={{ opacity: progress.tile }}
        />
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: titleSize,
            letterSpacing: displayTracking,
            lineHeight: 1,
            color: color.text,
            opacity: progress.title,
            transform: `translateX(${(1 - progress.title) * -14 * scale}px)`,
          }}
        >
          {name}
          {version ? <span style={{ color: color.accent }}> {version}</span> : null}
        </div>
      </div>
      <div
        style={{
          fontFamily: font.ui,
          fontWeight: 400,
          fontSize: 19 * scale,
          color: color.textMuted,
          lineHeight: 1.3,
          textAlign: "center",
          opacity: progress.line,
          transform: `translateY(${(1 - progress.line) * 10 * scale}px)`,
        }}
      >
        {line}
      </div>
      {note ? (
        <Chip
          label={note}
          icon="camera"
          scale={scale}
          height={28}
          fontSize={12}
          style={{ opacity: progress.note ?? 1, transform: `translateY(${(1 - (progress.note ?? 1)) * 8 * scale}px)`, marginTop: -4 * scale }}
        />
      ) : null}
    </div>
  );
};

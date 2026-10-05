import React from "react";
import { color, font, radius } from "../tokens";
import { Icon, type IconName } from "./icons";
import { MediaStrip } from "./MediaStrip";

/**
 * A file of the queue, as a small card: icon tile, name, meta line, its whole waveform (or a
 * film strip for a camera with no sound). Absolutely placed at (x, y), `width` wide.
 */
export const FileCard: React.FC<{
  name: string;
  meta: string;
  icon: IconName;
  envelope: number[] | null;
  perSecond: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  scale: number;
  rotate?: number;
  opacity?: number;
  /** False when the caller draws the strip itself (to move it out of the card). */
  strip?: boolean;
}> = ({ name, meta, icon, envelope, perSecond, duration, x, y, width, scale: s, rotate = 0, opacity = 1, strip = true }) => {
  const height = FILE_CARD_HEIGHT * s;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        boxSizing: "border-box",
        borderRadius: radius.card * s,
        border: `${s}px solid ${color.border}`,
        background: color.bgCard,
        transform: `rotate(${rotate}deg)`,
        opacity,
        boxShadow: `0 ${14 * s}px ${30 * s}px rgba(0,0,0,0.45)`,
      }}
    >
      <div style={{ position: "absolute", left: 14 * s, top: 13 * s, right: 14 * s, display: "flex", alignItems: "center", gap: 11 * s }}>
        <div
          style={{
            width: 32 * s,
            height: 32 * s,
            borderRadius: radius.tile * s,
            background: color.bgChip,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.textMuted,
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={17 * s} />
        </div>
        <div style={{ minWidth: 0, fontFamily: font.ui }}>
          <div style={{ fontSize: 13.5 * s, fontWeight: 500, color: color.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          <div style={{ fontSize: 11.5 * s, color: color.textDim, marginTop: 2 * s, whiteSpace: "nowrap" }}>{meta}</div>
        </div>
      </div>
      {strip ? (
      <MediaStrip
        x={14 * s}
        y={56 * s}
        width={width - 28 * s - 2 * s}
        height={26 * s}
        envelope={envelope}
        perSecond={perSecond}
        duration={duration}
        scale={s}
      />
      ) : null}
    </div>
  );
};

/** Height of a FileCard, in app pixels. */
export const FILE_CARD_HEIGHT = 96;

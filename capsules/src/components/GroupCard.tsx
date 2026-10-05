import React from "react";
import { color, font, radius } from "../tokens";
import { Chip } from "./Chip";
import { Icon, type IconName } from "./icons";

/**
 * The frame of a multicam group (artboard multicam/m1-groupes): group tile, title,
 * subtitle, "Synchro sûre" chip, and one row per member. Rows are placed by the caller
 * (their lanes are MediaStrips on the group's clock); this draws the card, the header and
 * each row's label column. `reveal` (0..1) brings the frame in around rows already there.
 */
export interface GroupRow {
  label: string;
  icon: IconName;
  /** Small chip after the label: "Son principal", "Angle principal". */
  badge?: string;
  /** Right-aligned note of the label column: "+0,30 s", "lancée à +3:12". */
  note?: string;
  opacity?: number;
}

export const GROUP_HEADER = 62;
export const GROUP_ROW = 30;
export const GROUP_LABEL_COLUMN = 300;

export const GroupCard: React.FC<{
  title: string;
  subtitle: string;
  syncLabel: string;
  rows: GroupRow[];
  x: number;
  y: number;
  width: number;
  scale: number;
  reveal: number;
  /** Separate from `reveal`: the sync chip lands last. */
  synced?: number;
}> = ({ title, subtitle, syncLabel, rows, x, y, width, scale: s, reveal, synced = 1 }) => {
  const height = (GROUP_HEADER + rows.length * GROUP_ROW + 16) * s;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius.card * s,
          border: `${s}px solid ${color.border}`,
          background: color.bgCard,
          opacity: reveal,
          transform: `scale(${0.98 + 0.02 * reveal})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18 * s,
          right: 18 * s,
          top: 16 * s,
          display: "flex",
          alignItems: "center",
          gap: 12 * s,
          opacity: reveal,
          fontFamily: font.ui,
        }}
      >
        <div
          style={{
            width: 30 * s,
            height: 30 * s,
            borderRadius: 999,
            background: color.bgChip,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.textMuted,
          }}
        >
          <Icon name="group" size={15 * s} />
        </div>
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5 * s, fontWeight: 600, color: color.text, whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontSize: 11.5 * s, color: color.textDim, marginTop: 2 * s, whiteSpace: "nowrap" }}>{subtitle}</div>
        </div>
        <Chip
          label={syncLabel}
          icon="check"
          tone="soft"
          scale={s}
          height={30}
          fontSize={12}
          style={{ opacity: synced, transform: `scale(${0.9 + 0.1 * synced})` }}
        />
      </div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{
            position: "absolute",
            left: 18 * s,
            width: (GROUP_LABEL_COLUMN - 26) * s,
            top: (GROUP_HEADER + i * GROUP_ROW) * s,
            height: GROUP_ROW * s,
            display: "flex",
            alignItems: "center",
            gap: 8 * s,
            fontFamily: font.ui,
            fontSize: 12.5 * s,
            color: color.text,
            opacity: row.opacity ?? 1,
            whiteSpace: "nowrap",
          }}
        >
          <Icon name={row.icon} size={14 * s} color={color.textDim} />
          <span>{row.label}</span>
          {row.badge ? (
            <span
              style={{
                fontSize: 10.5 * s,
                color: color.accentSoftText,
                background: color.accentSoft,
                borderRadius: 5 * s,
                padding: `${2 * s}px ${6 * s}px`,
              }}
            >
              {row.badge}
            </span>
          ) : null}
          <span style={{ marginLeft: "auto", fontSize: 11.5 * s, color: color.textDim }}>{row.note}</span>
        </div>
      ))}
    </div>
  );
};

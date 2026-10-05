import React from "react";
import { color, font, radius } from "../tokens";
import { Icon, type IconName } from "./icons";

export type ChipTone = "neutral" | "accent" | "soft" | "ivory";

const TONES: Record<ChipTone, { background: string; border: string; text: string; icon: string }> = {
  neutral: { background: color.bgCard, border: color.border, text: color.text, icon: color.textDim },
  accent: { background: color.accent, border: color.accent, text: color.onAccent, icon: color.onAccent },
  soft: { background: color.accentSoft, border: color.accentSoftBorder, text: color.accentSoftText, icon: color.accent },
  ivory: { background: color.ivory, border: color.ivory, text: color.onAccent, icon: color.onAccent },
};

/**
 * The app's pill chip (top-bar controls, "Synchro sûre", badges): 34 px high, every chip and
 * button is a pill. Sizes are app pixels times `scale`.
 */
export const Chip: React.FC<{
  label: React.ReactNode;
  /** Quieter part after the label: "· 17 fichiers". */
  detail?: React.ReactNode;
  icon?: IconName;
  tone?: ChipTone;
  scale: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
}> = ({ label, detail, icon, tone = "neutral", scale, height = 34, fontSize = 12.5, fontFamily = font.ui, fontWeight = 500, style }) => {
  const t = TONES[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7 * scale,
        height: height * scale,
        padding: `0 ${14 * scale}px`,
        borderRadius: radius.pill,
        background: t.background,
        border: `${scale}px solid ${t.border}`,
        color: t.text,
        fontFamily,
        fontSize: fontSize * scale,
        fontWeight,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={14 * scale} color={t.icon} /> : null}
      <span>{label}</span>
      {detail ? <span style={{ color: tone === "neutral" ? color.textDim : undefined, opacity: tone === "neutral" ? 1 : 0.75 }}>{detail}</span> : null}
    </div>
  );
};

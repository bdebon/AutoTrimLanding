import React from "react";
import { color, eyebrow, font, radius } from "../tokens";
import { Icon } from "./icons";

export interface ExportChoice {
  label: string;
  /** Right-hand hint: "FCPXML", "XML". */
  hint: string;
  /** Title of a new section starting at this row (the app's "Ou un clip par coupe"). */
  section?: string;
}

/**
 * The footer's split button (frontend/src/components/queue/ExportMenu.tsx): one accent pill,
 * "Exporter la timeline · <editor>", a divider and a chevron. The menu opens upwards,
 * above the button, like in the app. Everything is positioned from the button's
 * bottom-right corner (`right`, `bottom`).
 */
export const ExportButton: React.FC<{
  verb: string;
  choices: ExportChoice[];
  selected: number;
  /** Row under the pointer, -1 for none. */
  hovered?: number;
  /** 0 closed, 1 open. */
  open: number;
  menuTitle: string;
  scale: number;
  right: number;
  bottom: number;
  opacity?: number;
  /** Press on the chevron, 0..1. */
  press?: number;
}> = ({ verb, choices, selected, hovered = -1, open, menuTitle, scale: s, right, bottom, opacity = 1, press = 0 }) => {
  const height = 48 * s;
  const menuWidth = 380 * s;
  const rowHeight = 46 * s;
  return (
    <div style={{ position: "absolute", right, bottom, opacity }}>
      {open > 0 ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: height + 10 * s,
            width: menuWidth,
            boxSizing: "border-box",
            padding: 8 * s,
            borderRadius: radius.cardLg * s,
            border: `${s}px solid ${color.border}`,
            background: color.bgCard,
            boxShadow: `0 ${20 * s}px ${50 * s}px rgba(0,0,0,0.55)`,
            opacity: open,
            transform: `translateY(${(1 - open) * 12 * s}px) scale(${0.97 + 0.03 * open})`,
            transformOrigin: "100% 100%",
          }}
        >
          <div
            style={{
              fontFamily: font.ui,
              ...eyebrow,
              fontSize: 10.5 * s,
              letterSpacing: "0.14em",
              color: color.textDim,
              padding: `${6 * s}px ${12 * s}px`,
            }}
          >
            {menuTitle}
          </div>
          {choices.map((choice, i) => {
            const checked = i === selected;
            return (
              <React.Fragment key={choice.label}>
              {choice.section ? (
                <>
                  <div style={{ height: s, background: color.menuRule, margin: `${6 * s}px ${10 * s}px` }} />
                  <div
                    style={{
                      fontFamily: font.ui,
                      ...eyebrow,
                      fontSize: 10.5 * s,
                      letterSpacing: "0.14em",
                      color: color.textDim,
                      padding: `${6 * s}px ${12 * s}px`,
                    }}
                  >
                    {choice.section}
                  </div>
                </>
              ) : null}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10 * s,
                  height: rowHeight,
                  padding: `0 ${12 * s}px`,
                  borderRadius: radius.control * s,
                  background: checked ? color.accentSurface : i === hovered ? color.bgCardHi : "transparent",
                  fontFamily: font.ui,
                }}
              >
                <span style={{ width: 18 * s, display: "flex", justifyContent: "center", color: color.accent }}>
                  {checked ? <Icon name="check" size={16 * s} /> : null}
                </span>
                <span style={{ flexGrow: 1, fontSize: 13 * s, fontWeight: checked ? 600 : 500, color: color.text }}>{choice.label}</span>
                <span style={{ fontSize: 11.5 * s, color: checked ? color.accentSoftText : color.textDim }}>{choice.hint}</span>
              </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height,
          borderRadius: radius.pill,
          background: color.accent,
          color: color.onAccent,
          fontFamily: font.ui,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 9 * s, padding: `0 ${14 * s}px 0 ${20 * s}px`, fontSize: 13.5 * s }}>
          <Icon name="download" size={15 * s} />
          <span style={{ fontWeight: 600 }}>{verb}</span>
          <span style={{ fontWeight: 500, color: color.exportHint }}>· {choices[selected]?.label}</span>
        </span>
        <span style={{ width: s, margin: `${11 * s}px 0`, background: color.exportDivider }} />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            padding: `0 ${16 * s}px 0 ${13 * s}px`,
            transform: `scale(${1 - 0.1 * press})`,
          }}
        >
          <Icon name="chevronUp" size={13 * s} style={{ transform: `rotate(${open * 180}deg)` }} />
        </span>
      </div>
    </div>
  );
};

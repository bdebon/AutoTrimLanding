import React from "react";
import { Cursor } from "../../../components/Cursor";
import { ExportButton, type ExportChoice } from "../../../components/ExportButton";
import { SESSION_CARD_HEIGHT, SessionCard } from "../../../components/SessionCard";
import { ease, mix, ramp } from "../../../lib/motion";
import { formatDuration, formatShorter, type Lang } from "../../../lib/format";
import { color, displayTracking, font, radius } from "../../../tokens";
import { APP_FILES, appSample } from "../data";
import type { HeroProps } from "../schema";
import { T, type heroLayout } from "../timeline";

type Layout = ReturnType<typeof heroLayout>;

const length = (spans: [number, number][]) => spans.reduce((sum, [a, b]) => sum + b - a, 0);

/** Height of the export menu rows and blocks, in app pixels (components/ExportButton.tsx). */
const ROW = 46;
const BLOCK_TITLE = 25;
const RULE = 13;
const MENU_PADDING = 8;

/**
 * 14.3-18.8 s. Back on AutoTrim's session screen: two plain clips, processed, cut the way
 * the app shows it. The hand opens the export menu (the three editors, and one clip per cut
 * for CapCut) and picks Final Cut Pro. Nothing is edited here: that happens in the editor.
 */
export const AppExport: React.FC<{ time: number; layout: Layout; width: number; height: number; copy: HeroProps }> = ({
  time,
  layout: L,
  width,
  height,
  copy,
}) => {
  const out = ramp(time, T.appOut.start, T.appOut.duration, ease.in);
  if (time < T.appIn.start - 0.05 || out >= 1) return null;
  const s = L.s;
  const a = L.portrait ? s * 0.62 : s * 0.75;
  const lang = copy.lang as Lang;

  const choices: ExportChoice[] = [
    { label: "Final Cut Pro", hint: "FCPXML" },
    { label: "Premiere Pro", hint: "XML" },
    { label: "DaVinci Resolve", hint: "FCPXML" },
    { label: "CapCut", hint: "ZIP", section: copy.segmentsTitle },
  ];

  // The screen, as a panel under the caption
  const panelW = Math.min(L.contentWidth, 1080 * a);
  const headerH = 66 * a;
  const footerH = 74 * a;
  const pad = 20 * a;
  const gap = 12 * a;
  const panelH = headerH + pad + APP_FILES.length * SESSION_CARD_HEIGHT * a + (APP_FILES.length - 1) * gap + pad + footerH;
  const panelX = (width - panelW) / 2;
  const panelY = Math.min(height - panelH - 30 * s, L.captionY + L.captionSize + 40 * s);
  const shown = ramp(time, T.appIn.start, T.appIn.duration);

  const source = APP_FILES.reduce((sum, f) => sum + f.duration, 0);
  const kept = APP_FILES.reduce((sum, f) => sum + length(f.kept), 0);

  // Export button in the footer, right-aligned; the menu opens upwards
  const buttonRight = width - (panelX + panelW) + 24 * a;
  const buttonBottom = height - (panelY + panelH) + (footerH - 48 * a) / 2;
  const open = ramp(time, T.menuOpen.start, T.menuOpen.duration, ease.out) * (1 - ramp(time, T.menuClose.start, T.menuClose.duration, ease.inOut));
  const hoverOrder = [1, 2, 3, 2, 0];
  const hovered = T.hover.reduce((h, at, i) => (time >= at ? hoverOrder[i] : h), -1);
  const selected = 0;

  // Where the hand goes
  const buttonTop = height - buttonBottom - 48 * a;
  const chevron = { x: width - buttonRight - 22 * a, y: buttonTop + 24 * a };
  const menuBottom = buttonTop - 10 * a;
  const rowCenter = (i: number) => {
    // Rows are stacked from the menu's top: padding, title, rows, and a rule + title before a section
    const blocksAbove = choices.slice(0, i + 1).filter((c) => c.section).length;
    const menuHeight = (MENU_PADDING * 2 + BLOCK_TITLE + choices.length * ROW + choices.filter((c) => c.section).length * (RULE + BLOCK_TITLE)) * a;
    const top = menuBottom - menuHeight;
    return top + (MENU_PADDING + BLOCK_TITLE + i * ROW + blocksAbove * (RULE + BLOCK_TITLE) + ROW / 2) * a;
  };
  const rowX = width - buttonRight - 250 * a;
  let cursor = { x: width * 0.78, y: height + 40 * s };
  const toChevron = ramp(time, T.toChevron.start, T.toChevron.duration, ease.inOut);
  cursor = { x: mix(cursor.x, chevron.x, toChevron), y: mix(cursor.y, chevron.y, toChevron) };
  T.hover.forEach((at, i) => {
    const p = ramp(time, at - 0.22, 0.22, ease.inOut);
    cursor = { x: mix(cursor.x, rowX, p), y: mix(cursor.y, rowCenter(hoverOrder[i]), p) };
  });
  const click = (at: number) => ramp(time, at - 0.06, 0.06) * (1 - ramp(time, at, 0.1));
  const press = Math.max(click(T.clickOpen), click(T.clickPick));
  const cursorShown = ramp(time, T.cursorIn.start, T.cursorIn.duration) * (1 - out);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: shown * (1 - out), transform: `translateY(${(1 - shown) * 24 * s - out * 30 * s}px)` }}>
      <div
        style={{
          position: "absolute",
          left: panelX,
          top: panelY,
          width: panelW,
          height: panelH,
          borderRadius: radius.modal * a,
          border: `${a}px solid ${color.lineHairline}`,
          background: color.bgPanel,
          fontFamily: font.ui,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 24 * a, top: 14 * a }}>
          <div style={{ fontSize: 17 * a, fontWeight: 600, color: color.text }}>{copy.appTitle}</div>
          <div style={{ fontSize: 11.5 * a, color: color.textDim, marginTop: 3 * a }}>
            {copy.appSubtitle
              .replace("{status}", copy.statusDone)
              .replace("{n}", String(APP_FILES.length))
              .replace("{from}", formatDuration(source))
              .replace("{to}", formatDuration(kept))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: headerH, height: a, background: color.lineHairline }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: footerH, height: a, background: color.lineHairline }} />
        <div style={{ position: "absolute", left: 24 * a, bottom: 0, height: footerH, display: "flex", alignItems: "center", gap: 10 * a }}>
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20 * a, letterSpacing: displayTracking, fontVariantNumeric: "tabular-nums", color: color.text }}>
            {formatDuration(source)} → {formatDuration(kept)}
          </span>
          <span style={{ fontSize: 12.5 * a, color: color.textDim }}>{copy.endToEnd.replace("{n}", String(APP_FILES.length))}</span>
        </div>
      </div>
      {APP_FILES.map((file, i) => {
        const fileKept = length(file.kept);
        const cuts = Math.max(0, file.kept.length - 1);
        return (
          <SessionCard
            key={file.name}
            name={file.name}
            meta={
              <>
                {formatDuration(file.duration)} → {formatDuration(fileKept)} ·{" "}
                <b style={{ color: color.textMuted, fontWeight: 600 }}>{formatShorter(((file.duration - fileKept) / file.duration) * 100, lang)}</b> ·{" "}
                {copy.cuts.replace("{n}", String(cuts))}
              </>
            }
            wholeFile={copy.wholeFile.replace("{d}", formatDuration(file.duration))}
            preview={copy.preview}
            file={{ duration: file.duration, kept: file.kept, hesitations: file.hesitations, sample: appSample(i) }}
            x={panelX + 20 * a}
            y={panelY + headerH + pad + i * (SESSION_CARD_HEIGHT * a + gap) + (1 - ramp(time, T.appIn.start + 0.1 + i * 0.06, 0.45)) * 14 * s}
            width={panelW - 40 * a}
            scale={a}
            opacity={ramp(time, T.appIn.start + 0.1 + i * 0.06, 0.45)}
          />
        );
      })}
      <ExportButton
        verb={copy.exportVerb}
        choices={choices}
        selected={selected}
        hovered={open > 0.5 ? hovered : -1}
        open={open}
        menuTitle={copy.menuTitle}
        scale={a}
        right={buttonRight}
        bottom={buttonBottom}
        press={click(T.clickOpen)}
      />
      {cursorShown > 0 ? <Cursor x={cursor.x} y={cursor.y} size={30 * s} press={press} opacity={cursorShown} /> : null}
    </div>
  );
};

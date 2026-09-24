import React from "react";
import { Chip } from "../../../components/Chip";
import { ease, ramp } from "../../../lib/motion";
import { formatDuration, formatShorter, type Lang } from "../../../lib/format";
import { color, displayTracking, font } from "../../../tokens";
import { session } from "../data";
import type { HeroProps } from "../schema";
import { T, type heroLayout } from "../timeline";

type Layout = ReturnType<typeof heroLayout>;

const totals = session.totals;

/** Removed so far, in seconds, as the scenes take things out. */
export function removedAt(time: number) {
  let removed = totals.silenceRemoved * ramp(time, T.countSilences.start, T.countSilences.duration, ease.inOut);
  T.beats.forEach((_, k) => {
    removed += (totals.hesitationRemoved / T.beats.length) * ramp(time, beatTimes(k).close.start, beatTimes(k).close.duration, ease.heavy);
  });
  return removed;
}

/**
 * When each hesitation beat does what. The line comes first and is left to be read, then the
 * hesitation is marked, held, and only then taken out.
 */
export function beatTimes(k: number) {
  const start = T.beats[k];
  const pan = { start, duration: k === 0 ? 0 : 0.5 };
  const line = { start: start + pan.duration * 0.5, duration: 0.3 };
  const detect = { start: start + pan.duration + 0.7, duration: 0.3 };
  const fadeWord = { start: detect.start + detect.duration + 0.55, duration: 0.2 };
  const close = { start: fadeWord.start + 0.12, duration: 0.5 };
  return { pan, line, detect, fadeWord, close, end: close.start + close.duration };
}

/** Chip top left, running length bottom left, the share removed next to it. */
export const Hud: React.FC<{ time: number; layout: Layout; copy: HeroProps; height: number }> = ({ time, layout: L, copy, height }) => {
  const s = L.s;
  const shown = ramp(time, T.chipIn.start, T.chipIn.duration) * (1 - ramp(time, T.hudOut.start, T.hudOut.duration, ease.in));
  if (shown <= 0) return null;
  const counted = totals.source * ramp(time, T.countUp.start, T.countUp.duration, ease.out);
  const removed = removedAt(time);
  const value = time < T.countSilences.start ? counted : totals.source - removed;
  const pill = ramp(time, T.pillIn.start, T.pillIn.duration);
  const lang = copy.lang as Lang;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: shown }}>
      <Chip
        label={copy.shoot}
        detail={`· ${copy.files.replace("{n}", String(totals.files))}`}
        scale={s}
        style={{ position: "absolute", left: L.margin, top: L.margin }}
      />
      <div style={{ position: "absolute", left: L.margin, top: height - L.margin - 40 * s, height: 40 * s, display: "flex", alignItems: "center", gap: 14 * s }}>
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: 34 * s,
            letterSpacing: displayTracking,
            fontVariantNumeric: "tabular-nums",
            color: color.text,
            lineHeight: 1,
          }}
        >
          {formatDuration(value)}
        </span>
        {pill > 0 ? (
          <Chip
            label={formatShorter((removed / totals.source) * 100, lang)}
            tone="accent"
            scale={s}
            fontFamily={font.display}
            fontWeight={700}
            fontSize={15}
            style={{ opacity: pill, transform: `scale(${0.85 + 0.15 * pill})`, fontVariantNumeric: "tabular-nums" }}
          />
        ) : null}
      </div>
    </div>
  );
};

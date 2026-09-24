import React from "react";
import { FILE_CARD_HEIGHT, FileCard } from "../../components/FileCard";
import { GROUP_HEADER, GROUP_LABEL_COLUMN, GROUP_ROW, GroupCard, type GroupRow } from "../../components/GroupCard";
import { MediaStrip } from "../../components/MediaStrip";
import { ease, mix, ramp } from "../../lib/motion";
import { formatDuration } from "../../lib/format";
import { color } from "../../tokens";
import { groupClock, lanes, MULTICAM_PER_SECOND } from "./data";
import type { MulticamCopy } from "./copy";

/** The scene's own clock, in seconds from its start. */
const T = {
  multicamIn: { start: 0.0, duration: 0.5 },
  cardsFall: 0.1,
  cardsStagger: 0.06,
  cardFall: 0.55,
  toLanes: { start: 1.05, duration: 0.9 },
  lanesStagger: 0.05,
  groupReveal: { start: 2.05, duration: 0.5 },
  syncChip: { start: 2.65, duration: 0.35 },
  groupOut: { start: 3.65, duration: 0.4 },
};
/** Length of the scene, out included. */
export const MULTICAM_DROP_SECONDS = 4.1;

export interface MulticamLayout {
  portrait: boolean;
  s: number;
  contentWidth: number;
  cardColumns: number;
}

export const multicamLayout = (width: number, height: number): MulticamLayout => {
  const s = Math.min(2, width / 540);
  return { portrait: height > width, s, contentWidth: width - 80 * s, cardColumns: height > width ? 2 : 3 };
};

/** Deterministic scatter: same video every render. */
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

const BARS = 96;

/**
 * Six files of one take land in a mess (two cameras started late, one cut in two files, two
 * mics), their waveforms leave the cards for lanes on one clock, slide into place, and the
 * lanes become one group card. The app's multicam fixtures. Set aside from the hero; kept
 * for the multicam capsule (CAPSULES.md #3). `time` is seconds from the scene's start.
 */
export const MulticamDrop: React.FC<{ time: number; layout: MulticamLayout; width: number; height: number; copy: MulticamCopy }> = ({
  time,
  layout: L,
  width,
  height,
  copy,
}) => {
  const s = L.s;
  const start = T.cardsFall - 0.1;
  const out = ramp(time, T.groupOut.start, T.groupOut.duration, ease.in);
  if (time < start || out >= 1) return null;

  const files = lanes.flatMap((lane, row) => lane.members.map((file, k) => ({ file, row, k, lane })));
  const lang = copy.lang;
  const seconds = (v: number) =>
    `${v >= 0 ? "+" : "−"}${new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(v))} s`;

  // The group card, where everything ends
  const cs = L.portrait ? s * 0.78 : s;
  const groupWidth = Math.min(L.contentWidth, 820 * cs);
  const gx = (width - groupWidth) / 2;
  const groupHeight = (GROUP_HEADER + lanes.length * GROUP_ROW + 16) * cs;
  const gy = L.portrait ? height * 0.36 : (height - groupHeight) / 2 + 40 * s;
  const laneX = gx + GROUP_LABEL_COLUMN * cs;
  const laneW = groupWidth - GROUP_LABEL_COLUMN * cs - 18 * cs;
  const perSecond = laneW / groupClock.span;

  // The cards, first scattered, as FileCards
  const cardScale = L.portrait ? s * 0.72 : s * 0.8;
  const columns = L.cardColumns;
  const gap = 18 * s;
  const cardW = Math.min(330 * cardScale, (L.contentWidth - gap * (columns - 1)) / columns);
  const cardH = FILE_CARD_HEIGHT * cardScale;
  const gridW = columns * cardW + (columns - 1) * gap;
  const rowsCount = Math.ceil(files.length / columns);
  const gridTop = L.portrait ? height * 0.3 : height * 0.33;

  const toLane = (i: number) => ramp(time, T.toLanes.start + i * T.lanesStagger, T.toLanes.duration * 0.6, ease.heavy);
  const toSync = (i: number) => ramp(time, T.toLanes.start + T.toLanes.duration * 0.55 + i * T.lanesStagger, 0.4, ease.out);
  const reveal = ramp(time, T.groupReveal.start, T.groupReveal.duration);

  const rows: GroupRow[] = lanes.map((lane, i) => ({
    label: copy.rowNames[i] ?? lane.files[0],
    icon: lane.icon,
    badge: lane.badge === "mainSound" ? copy.mainSound : lane.badge === "mainAngle" ? copy.mainAngle : undefined,
    note: i === 0 ? formatDuration(lane.members[0].duration) : seconds(lane.members[0].offset),
    opacity: reveal,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 30 * s}px)` }}>
      <GroupCard
        title={copy.groupTitle}
        subtitle={copy.groupSubtitle.replace("{n}", String(files.length)).replace("{d}", formatDuration(groupClock.span))}
        syncLabel={copy.syncLabel}
        rows={rows}
        x={gx}
        y={gy}
        width={groupWidth}
        scale={cs}
        reveal={reveal}
        synced={ramp(time, T.syncChip.start, T.syncChip.duration)}
      />
      {files.map(({ file, row, k }, i) => {
        const fall = ramp(time, T.cardsFall + i * T.cardsStagger, T.cardFall, ease.out);
        if (fall <= 0) return null;
        const col = i % columns;
        const line = Math.floor(i / columns);
        const restX = (width - gridW) / 2 + col * (cardW + gap) + jitter(i, 1) * 26 * s;
        const restY = gridTop + line * (cardH + gap) - (rowsCount - 2) * 0 + jitter(i, 2) * 18 * s;
        const restRotate = jitter(i, 3) * 5;
        const cardX = restX + jitter(i, 4) * 60 * s * (1 - fall);
        const cardY = mix(-cardH - 60 * s - i * 20 * s, restY, fall);
        const rotate = restRotate * (0.4 + 0.6 * fall) + jitter(i, 5) * 10 * (1 - fall);

        const p = toLane(i);
        const sync = toSync(i);
        // Unsynced, every lane starts at the left; a split file follows its first half
        const before = lanes[row].members.slice(0, k).reduce((sum, f) => sum + f.duration, 0);
        const laneStart = mix(laneX + before * perSecond, laneX + (file.offset - groupClock.start) * perSecond, sync);
        const stripRest = { x: cardX + 14 * cardScale, y: cardY + 56 * cardScale, w: cardW - 30 * cardScale, h: 26 * cardScale };
        const stripLane = { x: laneStart, y: gy + (GROUP_HEADER + row * GROUP_ROW + 6) * cs, w: file.duration * perSecond, h: (GROUP_ROW - 12) * cs };
        const strip = {
          x: mix(stripRest.x, stripLane.x, p),
          y: mix(stripRest.y, stripLane.y, p),
          w: mix(stripRest.w, stripLane.w, p),
          h: mix(stripRest.h, stripLane.h, p),
        };
        const meta = `${formatDuration(file.duration)} · ${file.kind === "mic" ? "WAV" : "MP4"}`;
        return (
          <React.Fragment key={file.name}>
            {p < 1 ? (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - Math.min(1, p * 1.8) }}>
                <FileCard
                  name={file.name}
                  meta={meta}
                  icon={file.kind === "mic" ? "mic" : "camera"}
                  envelope={null}
                  perSecond={MULTICAM_PER_SECOND}
                  duration={file.duration}
                  x={cardX + (stripLane.x - stripRest.x) * p}
                  y={cardY + (stripLane.y - stripRest.y) * p}
                  width={cardW}
                  scale={cardScale}
                  rotate={rotate * (1 - p)}
                  strip={false}
                />
              </div>
            ) : null}
            <MediaStrip
              x={strip.x}
              y={strip.y}
              width={strip.w}
              height={strip.h}
              envelope={file.envelope}
              perSecond={MULTICAM_PER_SECOND}
              duration={file.duration}
              scale={cardScale * mix(1, cs / cardScale, p)}
              bars={Math.max(12, Math.round((BARS * file.duration) / groupClock.span))}
              barColor={file.kind === "mic" ? color.textFaint : color.waveRawBar}
              contrast={file.kind === "mic" ? 3.2 : 1.6}
              style={{ transform: `rotate(${rotate * (1 - p)}deg)`, transformOrigin: `${stripRest.x - cardX}px ${stripRest.y - cardY}px` }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

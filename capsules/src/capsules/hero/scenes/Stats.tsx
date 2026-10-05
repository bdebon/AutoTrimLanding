import React, { useId } from "react";
import { StatCard } from "../../../components/StatCard";
import { ease, mixColor, ramp } from "../../../lib/motion";
import { formatCount, formatDuration, formatShorter, type Lang } from "../../../lib/format";
import { color, displayTracking, font, wave } from "../../../tokens";
import { session } from "../data";
import type { HeroProps } from "../schema";
import { T, type heroLayout } from "../timeline";

type Layout = ReturnType<typeof heroLayout>;

/**
 * 24.3-28.4 s. The payoff: the whole hour as one bar, its removed third hatches and closes
 * like the silences did at the start, what is left turns accent: "59:45 → 39:57". Then the
 * app's recap cards, counting up. Every figure is the session's, computed like the app.
 */
export const Stats: React.FC<{ time: number; layout: Layout; width: number; height: number; copy: HeroProps }> = ({
  time,
  layout: L,
  width,
  height,
  copy,
}) => {
  const id = useId().replace(/:/g, "");
  const s = L.s;
  const out = ramp(time, T.statsOut.start, T.statsOut.duration, ease.in);
  if (time < T.hourIn.start - 0.05 || out >= 1) return null;
  const lang = copy.lang as Lang;
  const totals = session.totals;

  // The hour, and what is left of it
  const hourIn = ramp(time, T.hourIn.start, T.hourIn.duration);
  const hatch = ramp(time, T.hourHatch.start, T.hourHatch.duration, ease.out);
  const closed = ramp(time, T.hourClose.start, T.hourClose.duration, ease.heavy);
  const result = ramp(time, T.resultIn.start, T.resultIn.duration);
  const keptShare = totals.final / totals.source;
  const barW = Math.min(L.contentWidth, 900 * s);
  const barH = 16 * s;
  const keptW = barW * keptShare;
  const removedW = barW * (1 - keptShare) * (1 - closed);
  const totalW = keptW + removedW;
  const barX = (width - totalW) / 2;
  const numbersY = L.portrait ? height * 0.34 : height * 0.36;
  const barY = numbersY + 58 * s;
  const tile = wave.hatchTile * s;

  // Cards under it
  const gap = 14 * s;
  const stacked = L.portrait;
  const cardW = stacked ? Math.min(L.contentWidth, 420 * s) : Math.min((L.contentWidth - 2 * gap) / 3, 290 * s);
  const cardH = 86 * s;
  const blockW = stacked ? cardW : cardW * 3 + gap * 2;
  const cardsTop = barY + barH + 50 * s;
  const counted = ramp(time, T.statCount.start, T.statCount.duration, ease.out);
  const cards = [
    { label: copy.statShorter, value: formatShorter(totals.shorterPercent * counted, lang), highlighted: true },
    { label: copy.statSaved, value: formatDuration(totals.editingSaved * counted) },
    { label: copy.statCuts, value: formatCount(totals.cuts * counted, lang) },
  ];

  const big = (L.portrait ? 40 : 52) * s;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {/* 59:45 → 39:57 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: numbersY - big / 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 18 * s,
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: big,
          letterSpacing: displayTracking,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          opacity: hourIn,
        }}
      >
        <span style={{ color: mixColor(color.text, color.textDim, result) }}>{formatDuration(totals.source)}</span>
        {result > 0 ? (
          <>
            <span style={{ color: color.textDim, opacity: result, fontSize: big * 0.8 }}>→</span>
            <span style={{ color: color.accent, opacity: result, transform: `translateX(${(1 - result) * -16 * s}px)`, display: "inline-block" }}>
              {formatDuration(totals.final)}
            </span>
          </>
        ) : null}
      </div>
      {/* The hour as a bar: kept part first, the removed third hatched, then closed */}
      <svg width={width} height={barH + 4 * s} style={{ position: "absolute", left: 0, top: barY, opacity: hourIn }}>
        <defs>
          <pattern id={`hh-${id}`} width={tile} height={tile} patternUnits="userSpaceOnUse">
            <rect width={tile} height={tile} fill={color.waveCutBand} />
            {[-tile, 0, tile].map((shift) => (
              <line key={shift} x1={shift} y1={0} x2={shift + tile} y2={tile} stroke={color.waveCutHatch} strokeWidth={wave.hatchStroke * s} strokeLinecap="square" />
            ))}
          </pattern>
          <clipPath id={`hc-${id}`}>
            <rect x={barX} y={2 * s} width={totalW} height={barH} rx={barH / 2} />
          </clipPath>
        </defs>
        <g clipPath={`url(#hc-${id})`}>
          <rect x={barX} y={2 * s} width={keptW} height={barH} fill={mixColor(color.waveRawBar, color.accent, closed)} />
          <rect x={barX + keptW} y={2 * s} width={removedW} height={barH} fill={color.waveRawBar} />
          {hatch > 0 ? <rect x={barX + keptW} y={2 * s} width={removedW} height={barH} fill={`url(#hh-${id})`} opacity={hatch} /> : null}
        </g>
      </svg>
      {cards.map((card, i) => {
        const p = ramp(time, T.statsIn + i * T.statsStagger, 0.5, ease.out);
        return (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            highlighted={card.highlighted}
            scale={s}
            width={cardW}
            style={{
              position: "absolute",
              left: stacked ? (width - blockW) / 2 : (width - blockW) / 2 + i * (cardW + gap),
              top: (stacked ? cardsTop + i * (cardH + gap) : cardsTop) + (1 - p) * 20 * s,
              opacity: p,
            }}
          />
        );
      })}
    </div>
  );
};

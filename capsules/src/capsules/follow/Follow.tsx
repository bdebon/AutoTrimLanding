import React, { useMemo } from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Icon } from "../../components/icons";
import { useFontsReady } from "../../fonts";
import { ease, mix, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { color, font, radius } from "../../tokens";
import { micLevel, speaking } from "../multicam/voices";
import type { FollowCopy } from "./copy";

export const FOLLOW_SECONDS = 10;

/** The stretch of the take: nobody, Marc, both, Julie, nobody. Reference-clock seconds. */
const WINDOW: [number, number] = [10.4, 17.3];
const PLAY_START = 0.6;
const TILES_OUT = 7.45;
const TIMELINE_IN = 7.85;

type Angle = 0 | 1 | 2; // wide, Marc, Julie
const LANES: Angle[] = [2, 1, 0]; // V3 Julie, V2 Marc, V1 wide: the main angle is V1, at the bottom

/** Who the cut is on at a source time: both or nobody yet → wide; nobody afterwards → hold. */
const segments = (() => {
  const step = 0.02;
  const out: { from: number; to: number; angle: Angle }[] = [];
  let current: Angle = 0;
  for (let t = WINDOW[0]; t < WINDOW[1]; t += step) {
    const m = speaking("marc", t);
    const j = speaking("julie", t);
    const angle: Angle = m && j ? 0 : m ? 1 : j ? 2 : current;
    const last = out[out.length - 1];
    if (last && last.angle === angle) last.to = t + step;
    else out.push({ from: t, to: t + step, angle });
    current = angle;
  }
  return out;
})();

/**
 * Capsule #5, "Le montage suit celui qui parle." Three angles in a mosaic, a voice meter
 * under each. Marc talks: his camera fills the frame. Julie: switch. Both: the wide shot.
 * Then the timeline this gives: the angles stacked, cut at the same instants.
 */
export const Follow: React.FC<FollowCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<FollowCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth } = useScene();
  const levels = useMemo(() => [micLevel("marc"), micLevel("julie")], []);
  const src = WINDOW[0] + (time - PLAY_START);
  const capsuleTime = (source: number) => PLAY_START + (source - WINDOW[0]);

  // How much each angle is "the" shot right now: the segments hand over with weight
  const focus = [0, 1, 2].map((angle) =>
    segments.reduce((sum, seg, i) => {
      if (seg.angle !== angle) return sum;
      const on = i === 0 ? 1 : ramp(time, capsuleTime(seg.from), 0.45, ease.heavy);
      const next = segments[i + 1];
      const off = next ? ramp(time, capsuleTime(next.from), 0.45, ease.heavy) : 0;
      return sum + on - off;
    }, 0)
  );

  // Geometry: the big shot on top, the three small ones under it
  const shown = ramp(time, 0.3, 0.5) * (1 - ramp(time, TILES_OUT, 0.4, ease.in));
  const bigW = Math.min(contentWidth, 470 * s);
  const bigH = bigW * (9 / 16);
  const gap = 18 * s;
  const smallW = (bigW - 2 * gap) / 3;
  const smallH = smallW * (9 / 16);
  const top = captionY + captionSize + 14 * s;
  const big = { x: (width - bigW) / 2, y: top, w: bigW, h: bigH };
  const small = (i: number) => ({ x: (width - bigW) / 2 + i * (smallW + gap), y: top + bigH + gap + 14 * s, w: smallW, h: smallH });
  const meterY = top + bigH + gap + 14 * s + smallH + 12 * s;
  const level = (angle: Angle) => (angle === 0 ? Math.max(levels[0](src), levels[1](src)) : levels[angle - 1](src));

  // The timeline the cut gives
  const tl = ramp(time, TIMELINE_IN, 0.5) * alive;
  const laneH = 34 * s;
  const laneGap = 8 * s;
  const labelW = 150 * s;
  const tlW = Math.min(contentWidth, 1000 * s);
  const tlX = (width - tlW) / 2;
  const tlY = height * 0.5 - (laneH * 3 + laneGap * 2) / 2 + 10 * s;
  const span = WINDOW[1] - WINDOW[0];
  const tx = (t: number) => tlX + labelW + ((t - WINDOW[0]) / span) * (tlW - labelW);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption text={copy.title} x={width / 2} y={captionY} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.2, 0.5)} exit={ramp(time, FOLLOW_SECONDS - 1.0, 0.35, ease.in)} />

      {shown > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: shown }}>
          {[0, 1, 2].map((i) => (
            <div key={`slot-${i}`} style={{ position: "absolute", left: small(i).x, top: small(i).y, width: small(i).w, height: small(i).h, borderRadius: radius.card * s, border: `${s}px dashed ${color.borderHi}`, boxSizing: "border-box", opacity: 0.6 }} />
          ))}
          {[0, 1, 2]
            .map((angle) => ({ angle: angle as Angle, f: focus[angle] }))
            .sort((a, b) => a.f - b.f)
            .map(({ angle, f }) => {
              const r = { x: mix(small(angle).x, big.x, f), y: mix(small(angle).y, big.y, f), w: mix(small(angle).w, big.w, f), h: mix(small(angle).h, big.h, f) };
              const k = r.w / big.w;
              return (
                <div
                  key={angle}
                  style={{
                    position: "absolute",
                    left: r.x,
                    top: r.y,
                    width: r.w,
                    height: r.h,
                    boxSizing: "border-box",
                    borderRadius: radius.card * s,
                    border: `${Math.max(s, 2 * s * f)}px solid ${f > 0.5 ? color.accent : color.border}`,
                    background: color.bgStage,
                    overflow: "hidden",
                    boxShadow: `0 ${14 * s * f}px ${40 * s * f}px rgba(0,0,0,${0.5 * f})`,
                  }}
                >
                  <Figures angle={angle} w={r.w} h={r.h} s={s} />
                  <div
                    style={{
                      position: "absolute",
                      left: 12 * s * k + 6 * s,
                      bottom: 12 * s * k + 6 * s,
                      display: "flex",
                      alignItems: "center",
                      gap: 6 * s,
                      padding: `${4 * s}px ${10 * s}px`,
                      borderRadius: radius.pill,
                      background: "rgba(10,10,11,0.75)",
                      fontFamily: font.ui,
                      fontSize: mix(11, 14, f) * s,
                      fontWeight: 500,
                      color: color.text,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon name="camera" size={mix(11, 14, f) * s} color={color.textMuted} />
                    {copy.angles[angle]}
                  </div>
                </div>
              );
            })}
          {[0, 1, 2].map((angle) => {
            const r = small(angle);
            const v = Math.pow(level(angle as Angle), 2.2);
            return (
              <div key={`meter-${angle}`} style={{ position: "absolute", left: r.x, top: meterY, width: r.w, height: 5 * s, borderRadius: 3 * s, background: color.track }}>
                <div style={{ width: `${Math.min(100, v * 100)}%`, height: "100%", borderRadius: 3 * s, background: focus[angle] > 0.5 ? color.accent : color.textDim }} />
              </div>
            );
          })}
        </div>
      ) : null}

      {tl > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: tl, transform: `translateY(${(1 - tl) * 14 * s}px)` }}>
          {LANES.map((angle, row) => {
            const y = tlY + row * (laneH + laneGap);
            return (
              <React.Fragment key={angle}>
                <div style={{ position: "absolute", left: tlX, top: y, width: labelW - 14 * s, height: laneH, display: "flex", alignItems: "center", gap: 8 * s, fontFamily: font.ui, fontSize: 12.5 * s, color: color.textMuted, whiteSpace: "nowrap" }}>
                  <span style={{ fontWeight: 700, color: color.textDim, width: 22 * s }}>V{3 - row}</span>
                  {copy.angles[angle]}
                </div>
                <div style={{ position: "absolute", left: tx(WINDOW[0]), top: y, width: tx(WINDOW[1]) - tx(WINDOW[0]), height: laneH, borderRadius: 6 * s, background: color.waveWell }} />
                {segments
                  .filter((seg) => seg.angle === angle)
                  .map((seg) => (
                    <div key={seg.from} style={{ position: "absolute", left: tx(seg.from), top: y, width: tx(seg.to) - tx(seg.from) - s, height: laneH, borderRadius: 5 * s, background: color.accent, opacity: 0.9 }} />
                  ))}
              </React.Fragment>
            );
          })}
          {segments.slice(1).map((seg) => (
            <div key={`cut-${seg.from}`} style={{ position: "absolute", left: tx(seg.from) - s, top: tlY - 8 * s, width: 2 * s, height: laneH * 3 + laneGap * 2 + 16 * s, background: color.playhead, opacity: 0.55 }} />
          ))}
        </div>
      ) : null}

      <Caption text={copy.legend} x={width / 2} y={height * 0.84} fontSize={20 * s} maxWidth={contentWidth * 0.8} enter={ramp(time, TIMELINE_IN + 0.3, 0.5)} exit={ramp(time, FOLLOW_SECONDS - 0.9, 0.35, ease.in)} tone="muted" />
    </div>
  );
};

/** A shape, not a picture: head and shoulders, one or two of them. The capsules show no faces. */
const Figures: React.FC<{ angle: Angle; w: number; h: number; s: number }> = ({ angle, w, h }) => {
  const people = angle === 0 ? [0.36, 0.64] : [0.5];
  return (
    <svg width={w} height={h} viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", left: 0, top: 0 }}>
      <rect width="160" height="90" fill={color.bgStage} />
      <rect y="72" width="160" height="18" fill={color.bgPanel} />
      {people.map((cx) => {
        const x = cx * 160;
        const r = angle === 0 ? 8 : 11;
        const w = angle === 0 ? 22 : 30;
        const neck = angle === 0 ? 50 : 48;
        return (
          <g key={cx}>
            <circle cx={x} cy={neck - r - 2} r={r} fill={color.bgCardHi} />
            <path d={`M${x - w} 90 C${x - w} ${neck}, ${x + w} ${neck}, ${x + w} 90Z`} fill={color.bgCardHi} />
          </g>
        );
      })}
    </svg>
  );
};

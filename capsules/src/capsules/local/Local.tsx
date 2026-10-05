import React from "react";
import { OffthreadVideo, staticFile } from "remotion";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { useFontsReady } from "../../fonts";
import { ease, mix, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { color, displayTracking, font, radius } from "../../tokens";
import type { LocalCopy } from "./copy";

export const LOCAL_SECONDS = 6;
const WIFI_OFF = 1.7;
const LINE_IN = 3.6;

/**
 * Capsule #10, "Tout se passe sur votre machine." On the left, a Wi‑Fi symbol the size of
 * the claim: it goes out, arc by arc, a stroke crosses it, "Wi‑Fi désactivé". On the right,
 * the real app, recorded, keeps analysing exactly as before. Nothing was ever sent.
 */
export const Local: React.FC<LocalCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<LocalCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth, margin } = useScene();
  const shown = ramp(time, 0.25, 0.45);

  // Right: the app, recorded
  const recW = Math.min(contentWidth * 0.55, 480 * s);
  const recH = recW * (1584 / 2400);
  const recX = width - margin - recW;
  const recY = captionY + captionSize + 30 * s;

  // Left: the Wi‑Fi, big
  const leftW = recX - margin;
  const cx = margin + leftW / 2;
  const cy = recY + recH / 2 - 40 * s;
  const size = 105 * s;
  const off = ramp(time, WIFI_OFF, 0.5, ease.inOut);
  const arcOff = (k: number) => ramp(time, WIFI_OFF + k * 0.12, 0.25, ease.inOut); // top arc first
  const slash = ramp(time, WIFI_OFF + 0.15, 0.4, ease.out);
  const shake = Math.sin(Math.min(1, Math.max(0, (time - WIFI_OFF) / 0.3)) * Math.PI * 4) * (1 - ramp(time, WIFI_OFF, 0.35)) * 4 * s;
  const label = ramp(time, WIFI_OFF + 0.45, 0.45);
  const cont = ramp(time, WIFI_OFF + 1.0, 0.45);

  const arcs = [
    { r: 0.42, k: 0 },
    { r: 0.29, k: 1 },
    { r: 0.16, k: 2 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption text={copy.title} x={width / 2} y={captionY} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.2, 0.5)} exit={ramp(time, LOCAL_SECONDS - 0.9, 0.35, ease.in)} />

      {/* The Wi‑Fi symbol */}
      <div style={{ position: "absolute", left: cx - size, top: cy - size, width: size * 2, height: size * 2, opacity: shown, transform: `translateX(${shake}px)` }}>
        <svg width={size * 2} height={size * 2} viewBox="-1 -1 2 2" style={{ overflow: "visible" }}>
          {arcs.map((a) => {
            const y0 = 0.62; // the dot sits here; arcs are centred on it
            const r = a.r * 2;
            const ang = Math.PI / 4;
            const x1 = -r * Math.sin(ang);
            const y1 = y0 - r * Math.cos(ang);
            const x2 = r * Math.sin(ang);
            return (
              <path
                key={a.k}
                d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y1}`}
                fill="none"
                stroke={color.text}
                strokeWidth={0.075}
                strokeLinecap="round"
                opacity={mix(1, 0.18, arcOff(a.k))}
              />
            );
          })}
          <circle cx="0" cy="0.62" r="0.075" fill={color.text} opacity={mix(1, 0.18, off)} />
          <path
            d="M-0.62 -0.55 L0.62 0.75"
            fill="none"
            stroke={color.text}
            strokeWidth={0.085}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - slash}
            opacity={slash > 0 ? 1 : 0}
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          width: leftW,
          top: cy + size + 24 * s,
          textAlign: "center",
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: 30 * s,
          letterSpacing: displayTracking,
          color: color.text,
          opacity: label,
          transform: `translateY(${(1 - label) * 10 * s}px)`,
        }}
      >
        {copy.wifiOff}
      </div>
      <div
        style={{
          position: "absolute",
          left: margin,
          width: leftW,
          top: cy + size + 24 * s + 46 * s,
          textAlign: "center",
          fontFamily: font.ui,
          fontSize: 17 * s,
          color: color.textMuted,
          opacity: cont,
          transform: `translateY(${(1 - cont) * 8 * s}px)`,
        }}
      >
        {copy.continues}
      </div>

      {/* The app, still analysing */}
      <div
        style={{
          position: "absolute",
          left: recX,
          top: recY + (1 - shown) * 16 * s,
          width: recW,
          height: recH,
          borderRadius: radius.cardLg * s,
          overflow: "hidden",
          border: `${s}px solid ${color.border}`,
          boxShadow: `0 ${24 * s}px ${60 * s}px rgba(0,0,0,0.55)`,
          opacity: shown,
          background: color.bgPanel,
        }}
      >
        <OffthreadVideo src={staticFile(copy.recording)} muted style={{ width: recW, height: recH, objectFit: "cover", display: "block" }} />
      </div>

      <Caption text={copy.line} x={width / 2} y={height * 0.93} fontSize={24 * s} maxWidth={contentWidth} enter={ramp(time, LINE_IN, 0.5)} exit={ramp(time, LOCAL_SECONDS - 0.85, 0.35, ease.in)} />
    </div>
  );
};

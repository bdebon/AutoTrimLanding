import React, { useMemo } from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Chip } from "../../components/Chip";
import { FILE_CARD_HEIGHT, FileCard } from "../../components/FileCard";
import { LongWave, type WaveZone } from "../../components/LongWave";
import { useFontsReady } from "../../fonts";
import { formatDuration } from "../../lib/format";
import { ease, mix, mixColor, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { envelopePeak, silencesOf } from "../../lib/session";
import { color, font, radius, wave } from "../../tokens";
import { session } from "../hero/data";
import type { VideoCopy } from "./copy";

export const VIDEO_SECONDS = 6;
const FILES = ["2025-09-05_18-02-34.mp4", "2025-09-05_19-19-20.mp4", "2025-09-05_21-23-14.mp4"];
const T = {
  cardsIn: 0.3,
  stagger: 0.08,
  hatch: 1.2,
  close: { start: 1.85, duration: 0.7 },
  accent: 2.4,
  zipIn: 3.0,
  fly: { start: 3.2, duration: 0.6 },
  zipClose: { start: 4.0, duration: 0.6 },
  labelIn: 4.5,
};

/**
 * Capsule #8, "Ou juste la vidéo." Three files, their silences close all at once, and the
 * three cut MP4s drop into one ZIP that zips itself up.
 */
export const Video: React.FC<VideoCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<VideoCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth } = useScene();
  const files = useMemo(() => FILES.map((name) => session.files.find((f) => f.name === name)!), []);
  const per = session.envelopePerSecond;

  const cs = s * 0.9;
  const gap = 22 * s;
  const cardW = Math.min(360 * cs, (contentWidth - 2 * gap) / 3);
  const cardH = FILE_CARD_HEIGHT * cs;
  const rowW = cardW * 3 + gap * 2;
  const rowX = (width - rowW) / 2;
  const cardY = height * 0.42 - cardH / 2;
  const strip = { x: 14 * cs, y: 56 * cs, w: cardW - 30 * cs, h: 26 * cs };
  const pitch = wave.barPitch * cs * 0.75;

  const closed = ramp(time, T.close.start, T.close.duration, ease.heavy);
  const accent = ramp(time, T.accent, 0.45, ease.inOut);

  // The ZIP everything drops into
  const zipW = 150 * s;
  const zipH = 110 * s;
  const zipX = width / 2 - zipW / 2;
  const zipY = height * 0.5 - zipH / 2 + 20 * s;
  const zipIn = ramp(time, T.zipIn, 0.45);
  const zipped = ramp(time, T.zipClose.start, T.zipClose.duration, ease.inOut);
  const label = ramp(time, T.labelIn, 0.45);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption text={copy.title} x={width / 2} y={captionY} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.2, 0.5)} exit={ramp(time, VIDEO_SECONDS - 0.9, 0.35, ease.in)} />

      {zipIn > 0 ? (
        <div style={{ position: "absolute", left: zipX, top: zipY, width: zipW, height: zipH, opacity: zipIn, transform: `scale(${0.9 + 0.1 * zipIn})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: radius.cardLg * s, border: `${s}px solid ${color.border}`, background: color.bgCard, boxShadow: `0 ${16 * s}px ${40 * s}px rgba(0,0,0,0.45)` }} />
          {/* The zipper, closing from the top */}
          <svg width={zipW} height={zipH} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 9 }, (_, i) => {
              const y = 14 * s + i * 9.5 * s;
              const done = y <= 14 * s + zipped * 86 * s;
              return <rect key={i} x={zipW / 2 - (done ? 5 : 3) * s} y={y} width={(done ? 10 : 6) * s} height={4 * s} rx={s} fill={done ? color.textMuted : color.borderHi} />;
            })}
            <rect x={zipW / 2 - 7 * s} y={8 * s + zipped * 86 * s} width={14 * s} height={12 * s} rx={3 * s} fill={color.accent} />
          </svg>
        </div>
      ) : null}

      {files.map((file, i) => {
        const shown = ramp(time, T.cardsIn + i * T.stagger, 0.45);
        const x = rowX + i * (cardW + gap);
        const y = cardY + (1 - shown) * 16 * s;
        // Flight: the card shrinks into the ZIP, one after the other
        const p = ramp(time, T.fly.start + i * 0.12, T.fly.duration, ease.heavy);
        const cx = mix(x + cardW / 2, width / 2, p);
        const cy = mix(y + cardH / 2, zipY + zipH / 2, p);
        const k = mix(1, 0.18, p);
        const fade = 1 - ramp(time, T.fly.start + i * 0.12 + T.fly.duration * 0.7, T.fly.duration * 0.3);
        const count = Math.floor(strip.w / pitch);
        const spb = file.duration / count;
        const amps = new Float32Array(count);
        for (let b = 0; b < count; b++) amps[b] = envelopePeak(file, per, b * spb, (b + 1) * spb);
        const zones: WaveZone[] = silencesOf(file).map(([start, end], z) => ({
          start,
          end,
          band: ramp(time, T.hatch + i * 0.1 + z * 0.02, 0.2, ease.out),
          bars: 1 - ramp(time, T.close.start - 0.2, 0.2),
          remaining: 1 - closed,
        }));
        return (
          <div key={file.name} style={{ position: "absolute", left: cx - cardW / 2, top: cy - cardH / 2, width: cardW, height: cardH, transform: `scale(${k})`, opacity: shown * fade }}>
            <FileCard name={file.name} meta={`${formatDuration(file.duration)} · MP4`} icon="camera" envelope={null} perSecond={per} duration={file.duration} x={0} y={0} width={cardW} scale={cs} strip={false} />
            <div style={{ position: "absolute", left: strip.x, top: strip.y, width: strip.w, height: strip.h, borderRadius: radius.inset * cs * 0.7, background: color.waveWell, overflow: "hidden" }}>
              <LongWave
                amps={amps}
                secondsPerBar={spb}
                zones={zones}
                anchorTime={0}
                anchorX={0}
                midline={strip.h / 2}
                trackHeight={strip.h}
                scale={cs * 0.75}
                frameWidth={strip.w}
                barColor={mixColor(color.waveRawBar, color.waveKeptBar, accent)}
                contrast={2.2}
              />
            </div>
          </div>
        );
      })}

      {label > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: zipY + zipH + 22 * s, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * s, opacity: label, transform: `translateY(${(1 - label) * 8 * s}px)` }}>
          <span style={{ fontFamily: font.ui, fontSize: 15 * s, fontWeight: 500, color: color.text }}>{copy.zipName}</span>
          <Chip label={copy.count.replace("{n}", String(files.length))} tone="soft" scale={s} height={28} fontSize={12} />
        </div>
      ) : null}
    </div>
  );
};

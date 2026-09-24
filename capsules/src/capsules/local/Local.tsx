import React, { useMemo } from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Chip } from "../../components/Chip";
import { Icon } from "../../components/icons";
import { LongWave, type WaveZone } from "../../components/LongWave";
import { useFontsReady } from "../../fonts";
import { formatDuration } from "../../lib/format";
import { ease, mix, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { envelopePeak, silencesOf } from "../../lib/session";
import { color, font, radius, wave } from "../../tokens";
import { session } from "../hero/data";
import type { LocalCopy } from "./copy";

export const LOCAL_SECONDS = 6;
const SWEEP = { start: 0.7, duration: 4.4 };
const WIFI_OFF = 2.3;
const LINE_IN = 3.5;

/**
 * Capsule #10, "Tout se passe sur votre machine." A file is being analysed; the Wi‑Fi goes
 * off in the menu bar; the analysis carries on exactly as before, the counter turning, the
 * silences hatching one after the other. Nothing was ever sent.
 */
export const Local: React.FC<LocalCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<LocalCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth } = useScene();
  const file = useMemo(() => session.files.find((f) => f.name === copy.file) ?? session.files[11], [copy.file]);
  const per = session.envelopePerSecond;

  // The card and its well
  const a = s * 0.85;
  const cardW = Math.min(contentWidth, 1000 * a);
  const cardX = (width - cardW) / 2;
  const cardH = 170 * a;
  const cardY = height * 0.5 - cardH / 2 + 30 * s;
  const wellX = 16 * a;
  const wellW = cardW - 32 * a;
  const wellH = 72 * a;
  const wellY = 64 * a;
  const pitch = wave.barPitch * a * 0.75;
  const count = Math.floor(wellW / pitch);
  const spb = file.duration / count;
  const amps = useMemo(() => {
    const out = new Float32Array(count);
    for (let i = 0; i < count; i++) out[i] = envelopePeak(file, per, i * spb, (i + 1) * spb);
    return out;
  }, [file, per, count, spb]);

  // The sweep: source seconds analysed so far
  const progress = ramp(time, SWEEP.start, SWEEP.duration, ease.inOut);
  const analysed = file.duration * progress;
  const sweepX = wellX + (analysed / file.duration) * wellW;
  const zones: WaveZone[] = useMemo(() => silencesOf(file).map(([start, end]) => ({ start, end, remaining: 1, band: 0, bars: 1 })), [file]);
  const live: WaveZone[] = zones.map((z) => ({ ...z, band: ramp(analysed, z.end, 0.9, ease.out) }));

  const shown = ramp(time, 0.25, 0.45);
  const wifiOff = ramp(time, WIFI_OFF, 0.2);
  const wifiShake = Math.sin(Math.max(0, Math.min(1, (time - WIFI_OFF) / 0.25)) * Math.PI * 3) * (1 - ramp(time, WIFI_OFF, 0.3)) * 3 * s;
  const barH = 30 * s;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      {/* The menu bar, and its Wi‑Fi going off */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: barH, background: color.bgPanel, borderBottom: `${s}px solid ${color.lineHairline}`, opacity: shown }}>
        <div style={{ position: "absolute", left: 20 * s, top: 0, height: barH, display: "flex", alignItems: "center", gap: 8 * s, fontFamily: font.ui, fontSize: 13 * s, fontWeight: 600, color: color.text }}>
          AutoTrim
        </div>
        <div style={{ position: "absolute", right: 20 * s, top: 0, height: barH, display: "flex", alignItems: "center", gap: 14 * s }}>
          {wifiOff > 0 ? (
            <span style={{ fontFamily: font.ui, fontSize: 12 * s, color: color.textDim, opacity: wifiOff }}>{copy.wifiOff}</span>
          ) : null}
          <svg width={20 * s} height={16 * s} viewBox="0 0 20 16" style={{ transform: `translateX(${wifiShake}px)` }}>
            {[9, 6, 3].map((r, i) => (
              <path
                key={r}
                d={`M${10 - r * 0.95} ${13 - r * 0.9} A${r * 1.25} ${r * 1.25} 0 0 1 ${10 + r * 0.95} ${13 - r * 0.9}`}
                fill="none"
                stroke={mix(1, 0.3, wifiOff) > 0.5 ? color.text : color.textDisabled}
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={mix(1, i === 2 ? 1 : 0.35, wifiOff)}
              />
            ))}
            <circle cx="10" cy="13.4" r="1.4" fill={wifiOff > 0.5 ? color.textDisabled : color.text} />
            {wifiOff > 0 ? <path d="M3 2L17 15" stroke={color.text} strokeWidth={1.8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - wifiOff} /> : null}
          </svg>
        </div>
      </div>

      <Caption text={copy.title} x={width / 2} y={captionY + 8 * s} fontSize={captionSize} maxWidth={contentWidth} enter={ramp(time, 0.3, 0.5)} exit={ramp(time, LOCAL_SECONDS - 0.9, 0.35, ease.in)} />

      {/* The file being analysed */}
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY + (1 - shown) * 16 * s,
          width: cardW,
          height: cardH,
          boxSizing: "border-box",
          borderRadius: radius.card * a,
          border: `${a}px solid ${color.border}`,
          background: color.bgCard,
          opacity: shown,
          fontFamily: font.ui,
        }}
      >
        <div style={{ position: "absolute", left: 16 * a, right: 16 * a, top: 14 * a, height: 36 * a, display: "flex", alignItems: "center", gap: 12 * a }}>
          <div style={{ width: 28 * a, height: 28 * a, borderRadius: 999, background: color.bgChip, display: "flex", alignItems: "center", justifyContent: "center", color: color.textMuted }}>
            <Icon name="camera" size={14 * a} />
          </div>
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5 * a, fontWeight: 500, color: color.text, whiteSpace: "nowrap" }}>{file.name}</div>
            <div style={{ fontSize: 11.5 * a, color: color.textDim, marginTop: 2 * a, whiteSpace: "nowrap" }}>{formatDuration(file.duration)} · MP4</div>
          </div>
          <Chip label={copy.analysing} detail={`· ${Math.round(progress * 100)} %`} tone="soft" scale={a} height={30} fontSize={12} />
        </div>
        <div style={{ position: "absolute", left: wellX, top: wellY, width: wellW, height: wellH, borderRadius: radius.inset * a, background: color.bgInset, overflow: "hidden" }}>
          <LongWave amps={amps} secondsPerBar={spb} zones={live} anchorTime={file.duration / 2} anchorX={wellW / 2} midline={wellH / 2} trackHeight={wellH} scale={a * 0.75} frameWidth={wellW} barColor={color.waveRawBar} contrast={2.4} />
          <div style={{ position: "absolute", left: 0, top: 0, width: sweepX - wellX, height: wellH, overflow: "hidden" }}>
            <LongWave amps={amps} secondsPerBar={spb} zones={live} anchorTime={file.duration / 2} anchorX={wellW / 2} midline={wellH / 2} trackHeight={wellH} scale={a * 0.75} frameWidth={wellW} barColor={color.waveKeptBar} contrast={2.4} />
          </div>
          {progress > 0 && progress < 1 ? <div style={{ position: "absolute", left: sweepX - wellX - a, top: 0, width: 2 * a, height: wellH, background: color.playhead, opacity: 0.9 }} /> : null}
        </div>
        <div style={{ position: "absolute", left: wellX, right: wellX, top: wellY + wellH + 14 * a, height: 4 * a, borderRadius: 2 * a, background: color.track }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 2 * a, background: color.accent }} />
        </div>
      </div>

      <Caption text={copy.line} x={width / 2} y={height * 0.84} fontSize={24 * s} maxWidth={contentWidth} enter={ramp(time, LINE_IN, 0.5)} exit={ramp(time, LOCAL_SECONDS - 0.85, 0.35, ease.in)} />
    </div>
  );
};

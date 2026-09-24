import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { color, font } from "../tokens";

/** A timed subtitle line, for a voice-over laid on `soundtrack`. Seconds. */
export interface CaptionLine {
  start: number;
  end: number;
  text: string;
}

/**
 * Ground of every capsule: the app's window ground, the UI face, the audio slot and the
 * subtitle track. `soundtrack` is a file in public/ (e.g. "audio/hero.wav"); empty means
 * silent. Make it the length of the composition so the loop stays seamless. `captions`
 * are burnt in at the bottom, over everything.
 */
export const CapsuleFrame: React.FC<{ soundtrack?: string; captions?: CaptionLine[]; children?: React.ReactNode }> = ({
  soundtrack,
  captions,
  children,
}) => (
  <AbsoluteFill
    style={{
      background: color.bgApp,
      color: color.text,
      fontFamily: font.ui,
      WebkitFontSmoothing: "antialiased",
      overflow: "hidden",
    }}
  >
    {soundtrack ? <Audio src={staticFile(soundtrack)} /> : null}
    {children}
    {captions && captions.length ? <Subtitles lines={captions} /> : null}
  </AbsoluteFill>
);

const Subtitles: React.FC<{ lines: CaptionLine[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const time = frame / fps;
  const line = lines.find((l) => time >= l.start && time < l.end);
  if (!line) return null;
  const s = Math.min(2, width / 540);
  const fade = Math.min(1, (time - line.start) / 0.12, (line.end - time) / 0.12);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44 * s, display: "flex", justifyContent: "center", opacity: fade }}>
      <div
        style={{
          maxWidth: width * 0.8,
          padding: `${7 * s}px ${14 * s}px`,
          borderRadius: 10 * s,
          background: "rgba(10, 10, 11, 0.82)",
          fontFamily: font.ui,
          fontSize: 17 * s,
          fontWeight: 500,
          lineHeight: 1.3,
          color: color.text,
          textAlign: "center",
          textWrap: "balance",
        }}
      >
        {line.text}
      </div>
    </div>
  );
};

import React from "react";
import { color } from "../tokens";
import type { TextStyle } from "../lib/sentence";

export interface TranscriptWord {
  text: string;
  /** Left edge of the text, in frame pixels. */
  x: number;
  opacity?: number;
  color?: string;
  /** Vertical offset in pixels, for words arriving. */
  dy?: number;
  /** A pill behind the word (the app's marker chips): 0 = none, 1 = fully shown. */
  pill?: number;
  pillColor?: string;
  /** Scale of the word and its pill, around their centre. */
  scale?: number;
}

/**
 * A spoken line, word by word, each word placed by the caller (see lib/sentence.ts) so the
 * waveform under it can follow the same geometry.
 */
export const Transcript: React.FC<{
  words: TranscriptWord[];
  /** Top of the line box, in frame pixels. The box is one font size tall. */
  top: number;
  style: TextStyle;
}> = ({ words, top, style }) => (
  <>
    {words.map((word, i) => {
      const opacity = word.opacity ?? 1;
      if (opacity <= 0) return null;
      const pill = word.pill ?? 0;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: word.x,
            top: top + (word.dy ?? 0),
            height: style.fontSize,
            lineHeight: 1,
            whiteSpace: "pre",
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            letterSpacing: style.letterSpacing,
            color: word.color ?? color.text,
            opacity,
            transform: word.scale !== undefined ? `scale(${word.scale})` : undefined,
          }}
        >
          {pill > 0 ? (
            <div
              style={{
                position: "absolute",
                left: "-0.16em",
                right: "-0.16em",
                top: "-0.04em",
                bottom: "-0.16em",
                borderRadius: 999,
                background: word.pillColor ?? color.ivory,
                opacity: pill,
                transform: `scale(${0.86 + 0.14 * pill})`,
              }}
            />
          ) : null}
          <span style={{ position: "relative" }}>{word.text}</span>
        </div>
      );
    })}
  </>
);

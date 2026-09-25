import type { CSSProperties } from "react";

/**
 * "Coupe les silences. Et les euh." on two lines: one sentence per line, never "Et"
 * orphaned. `lineClassName` and `lineDelays` (ms) let each line make its own entrance.
 */
export default function Sentences({
  text,
  lineClassName = "",
  lineDelays,
}: {
  text: string;
  lineClassName?: string;
  lineDelays?: number[];
}) {
  const parts = text.split(/(?<=[.!?])\s+/);
  return (
    <>
      {parts.map((part, i) => (
        <span
          key={i}
          className={`block ${lineClassName}`}
          style={lineDelays ? ({ "--d": `${lineDelays[i] ?? 0}ms`, "--dy": "26px", "--dur": "1.1s" } as CSSProperties) : undefined}
        >
          {part}
        </span>
      ))}
    </>
  );
}

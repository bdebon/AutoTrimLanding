import React from "react";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Cursor } from "../../components/Cursor";
import { Icon } from "../../components/icons";
import { useFontsReady } from "../../fonts";
import { ease, mix, ramp } from "../../lib/motion";
import { useScene } from "../../lib/scene";
import { color, font, radius } from "../../tokens";
import type { MulticamCopy } from "./copy";
import { MulticamDrop, multicamGroupRect, multicamLayout, type DropTiming } from "./MulticamDrop";

export const DROP_SECONDS = 10;

/** Capsule #3 at its own pace: the files fall, find their place, become one group, one button. */
const T3: DropTiming = {
  multicamIn: { start: 0, duration: 0.5 },
  cardsFall: 0.35,
  cardsStagger: 0.09,
  cardFall: 0.65,
  toLanes: { start: 2.1, duration: 1.3 },
  lanesStagger: 0.08,
  groupReveal: { start: 3.9, duration: 0.55 },
  syncChip: { start: 4.7, duration: 0.4 },
  groupOut: { start: 8.7, duration: 0.45 },
};
const BUTTON_IN = 6.1;
const CLICK = 7.5;

/**
 * Capsule #3, "Trois caméras, deux micros, un drop." Six files of one take land in a mess,
 * line up on one clock, become one group card, and a single button processes it.
 */
export const Drop: React.FC<MulticamCopy> = (copy) => {
  const ready = useFontsReady();
  return <CapsuleFrame>{ready ? <Scene {...copy} /> : null}</CapsuleFrame>;
};

const Scene: React.FC<MulticamCopy> = (copy) => {
  const { time, width, height, s, alive, captionY, captionSize, contentWidth } = useScene();
  const L = multicamLayout(width, height);
  const group = multicamGroupRect(L, width, height);
  const out = ramp(time, T3.groupOut.start, T3.groupOut.duration, ease.in);

  // The one button, under the group card, and the hand that presses it
  const shown = ramp(time, BUTTON_IN, 0.4);
  const buttonH = 44 * s;
  const buttonY = group.y + group.height + 28 * s;
  const buttonX = width / 2;
  const toButton = ramp(time, BUTTON_IN + 0.5, 0.7, ease.inOut);
  const cursor = { x: mix(width * 0.72, buttonX + 40 * s, toButton), y: mix(height + 40 * s, buttonY + buttonH / 2, toButton) };
  const press = ramp(time, CLICK - 0.06, 0.06) * (1 - ramp(time, CLICK, 0.12));
  const pressed = ramp(time, CLICK, 0.08);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: alive }}>
      <Caption
        text={copy.title}
        x={width / 2}
        y={captionY}
        fontSize={captionSize}
        maxWidth={contentWidth}
        enter={ramp(time, 0.2, 0.5)}
        exit={ramp(time, DROP_SECONDS - 1.1, 0.35, ease.in)}
      />
      <MulticamDrop time={time} layout={L} width={width} height={height} copy={copy} timing={T3} />
      {shown > 0 ? (
        <div
          style={{
            position: "absolute",
            left: buttonX,
            top: buttonY,
            height: buttonH,
            padding: `0 ${22 * s}px`,
            transform: `translateX(-50%) translateY(${(1 - shown) * 10 * s - out * 30 * s}px) scale(${1 - 0.05 * press})`,
            opacity: shown * (1 - out),
            display: "flex",
            alignItems: "center",
            gap: 9 * s,
            borderRadius: radius.pill,
            background: pressed > 0 ? color.accent : color.accent,
            color: color.onAccent,
            fontFamily: font.ui,
            fontSize: 14 * s,
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: `0 ${10 * s}px ${30 * s}px rgba(255,91,46,${0.18 * pressed})`,
          }}
        >
          <Icon name="play" size={12 * s} />
          {copy.processButton}
        </div>
      ) : null}
      {toButton > 0 && out < 1 ? <Cursor x={cursor.x} y={cursor.y} size={30 * s} press={press} opacity={Math.min(1, toButton * 3) * (1 - out)} /> : null}
    </div>
  );
};

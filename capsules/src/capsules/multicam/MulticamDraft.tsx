import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { useFontsReady } from "../../fonts";
import { ramp } from "../../lib/motion";
import type { MulticamCopy } from "./copy";
import { MULTICAM_DROP_SECONDS, MulticamDrop, multicamLayout } from "./MulticamDrop";

/** The drop scene on its own, as it was in the first hero: a draft to build capsule #3 from. */
export const MulticamDraft: React.FC<MulticamCopy> = (copy) => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = frame / fps;
  const L = multicamLayout(width, height);
  return (
    <CapsuleFrame>
      {ready ? (
        <>
          <Caption
            text={copy.caption}
            x={width / 2}
            y={height * 0.2}
            fontSize={(L.portrait ? 24 : 30) * L.s}
            maxWidth={L.contentWidth}
            enter={ramp(time, 0, 0.5)}
            exit={ramp(time, MULTICAM_DROP_SECONDS - 0.4, 0.3)}
          />
          <MulticamDrop time={time} layout={L} width={width} height={height} copy={copy} />
        </>
      ) : null}
    </CapsuleFrame>
  );
};

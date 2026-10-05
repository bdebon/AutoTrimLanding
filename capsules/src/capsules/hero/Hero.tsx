import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CapsuleFrame } from "../../components/CapsuleFrame";
import { Caption } from "../../components/Caption";
import { EndCard } from "../../components/EndCard";
import { useFontsReady } from "../../fonts";
import { ease, mix, ramp } from "../../lib/motion";
import type { HeroProps } from "./schema";
import { Hesitations } from "./scenes/Hesitations";
import { Hud } from "./scenes/Hud";
import { Silences } from "./scenes/Silences";
import { Stats } from "./scenes/Stats";
import { AppExport } from "./scenes/AppExport";
import { Editor } from "./scenes/Editor";
import { heroLayout, T } from "./timeline";

/**
 * Capsule #1, the hero: everything v2 does in thirty seconds, on a real hour of rushes.
 * Scenes are plain functions of time; each one shows itself inside its window and hands
 * over to the next. First and last frames are the same empty ground: it loops.
 */
export const Hero: React.FC<HeroProps> = (props) => {
  const fontsReady = useFontsReady();
  return (
    <CapsuleFrame soundtrack={props.soundtrack} captions={props.captions}>
      {fontsReady ? <Scene {...props} /> : null}
    </CapsuleFrame>
  );
};

const Scene: React.FC<HeroProps> = (copy) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = frame / fps;
  const L = heroLayout(width, height);
  const s = L.s;
  const faded = ramp(time, T.fade.start, T.fade.duration, ease.inOut);

  // The title arrives in the middle, then rises to become the first caption
  const titleUp = ramp(time, T.titleUp.start, T.titleUp.duration, ease.inOut);
  const captions: { text: string; enter: number; exit: number }[] = [
    { text: copy.silences, enter: ramp(time, T.silencesIn.start, T.silencesIn.duration), exit: ramp(time, T.silencesOut.start, T.silencesOut.duration, ease.in) },
    { text: copy.hesitations, enter: ramp(time, T.hesitationsIn.start, T.hesitationsIn.duration), exit: ramp(time, T.hesitationsOut.start, T.hesitationsOut.duration, ease.in) },
    { text: copy.exportCaption, enter: ramp(time, T.exportCaptionIn.start, T.exportCaptionIn.duration), exit: ramp(time, T.exportCaptionOut.start, T.exportCaptionOut.duration, ease.in) },
    { text: copy.statsCaption, enter: ramp(time, T.statsCaptionIn.start, T.statsCaptionIn.duration), exit: ramp(time, T.statsCaptionOut.start, T.statsCaptionOut.duration, ease.in) },
    { text: copy.editorCaption, enter: ramp(time, T.editorCaptionIn.start, T.editorCaptionIn.duration), exit: ramp(time, T.editorCaptionOut.start, T.editorCaptionOut.duration, ease.in) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - faded }}>
      <Silences time={time} layout={L} width={width} />
      <Hesitations time={time} layout={L} width={width} copy={copy} />
      <AppExport time={time} layout={L} width={width} height={height} copy={copy} />
      <Editor time={time} layout={L} width={width} height={height} copy={copy} />
      <Stats time={time} layout={L} width={width} height={height} copy={copy} />
      <Hud time={time} layout={L} copy={copy} height={height} />

      <Caption
        text={copy.title}
        x={width / 2}
        y={mix(L.titleY, L.captionY, titleUp)}
        fontSize={mix(L.titleSize, L.captionSize, titleUp)}
        maxWidth={L.contentWidth}
        enter={ramp(time, T.titleIn.start, T.titleIn.duration)}
        exit={ramp(time, T.titleOut.start, T.titleOut.duration, ease.in)}
      />
      {captions.map((c) => (
        <Caption key={c.text} text={c.text} x={width / 2} y={L.captionY} fontSize={L.captionSize} maxWidth={L.contentWidth} enter={c.enter} exit={c.exit} />
      ))}

      <EndCard
        name={copy.name}
        version={copy.version}
        line={copy.tagline}
        note={copy.multicamNote}
        scale={s}
        progress={{
          tile: ramp(time, T.end.start, 0.4),
          glyph: ramp(time, T.end.start + 0.08, 0.45, ease.inOut),
          title: ramp(time, T.end.start + 0.12, 0.4),
          line: ramp(time, T.end.start + 0.22, 0.4),
          note: ramp(time, T.end.start + 0.4, 0.4),
        }}
      />
    </div>
  );
};

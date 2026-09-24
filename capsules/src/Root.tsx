import React from "react";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { Euh } from "./capsules/euh/Euh";
import { euhEn, euhFr } from "./capsules/euh/copy";
import { euhSchema, type EuhProps } from "./capsules/euh/schema";
import { euhTimeline } from "./capsules/euh/timeline";
import { Hero } from "./capsules/hero/Hero";
import { heroEn, heroFr } from "./capsules/hero/copy";
import { heroSchema } from "./capsules/hero/schema";
import { HERO_SECONDS } from "./capsules/hero/timeline";
import { multicamEn, multicamFr } from "./capsules/multicam/copy";
import { MulticamDraft } from "./capsules/multicam/MulticamDraft";
import { MULTICAM_DROP_SECONDS } from "./capsules/multicam/MulticamDrop";
import { Drop, DROP_SECONDS } from "./capsules/multicam/Drop";
import { Mic, MIC_SECONDS } from "./capsules/mic/Mic";
import { micEn, micFr } from "./capsules/mic/copy";
import { Follow, FOLLOW_SECONDS } from "./capsules/follow/Follow";
import { followEn, followFr } from "./capsules/follow/copy";
import { Timeline, TIMELINE_SECONDS } from "./capsules/timeline/Timeline";
import { timelineEn, timelineFr } from "./capsules/timeline/copy";
import { Video, VIDEO_SECONDS } from "./capsules/video/Video";
import { videoEn, videoFr } from "./capsules/video/copy";
import { Preview, PREVIEW_SECONDS } from "./capsules/preview/Preview";
import { previewEn, previewFr } from "./capsules/preview/copy";
import { Local, LOCAL_SECONDS } from "./capsules/local/Local";
import { localEn, localFr } from "./capsules/local/copy";

/** The short landing capsules (CAPSULES.md #3 to #10), 1920×1080, one per language. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shorts: { id: string; component: React.FC<any>; seconds: number; fr: unknown; en: unknown }[] = [
  { id: "MulticamDrop", component: Drop, seconds: DROP_SECONDS, fr: multicamFr, en: multicamEn },
  { id: "MulticamMic", component: Mic, seconds: MIC_SECONDS, fr: micFr, en: micEn },
  { id: "MulticamFollow", component: Follow, seconds: FOLLOW_SECONDS, fr: followFr, en: followEn },
  { id: "Timeline", component: Timeline, seconds: TIMELINE_SECONDS, fr: timelineFr, en: timelineEn },
  { id: "Video", component: Video, seconds: VIDEO_SECONDS, fr: videoFr, en: videoEn },
  { id: "Preview", component: Preview, seconds: PREVIEW_SECONDS, fr: previewFr, en: previewEn },
  { id: "Local", component: Local, seconds: LOCAL_SECONDS, fr: localFr, en: localEn },
];

const FPS = 60;

// The length follows the copy: a longer line types longer, the rest shifts
const euhLength: CalculateMetadataFunction<EuhProps> = ({ props }) => ({
  durationInFrames: Math.ceil(euhTimeline(props.line).total * FPS),
});

const formats = [
  { suffix: "", width: 1920, height: 1080 },
  { suffix: "-4x5", width: 1080, height: 1350 },
];

export const Root: React.FC = () => (
  <>
    {shorts.flatMap(({ id, component, seconds, fr, en }) =>
      (
        [
          ["fr", fr],
          ["en", en],
        ] as const
      ).map(([lang, copy]) => (
        <Composition
          key={`${id}-${lang}`}
          id={`${id}-${lang}`}
          component={component}
          defaultProps={copy as Record<string, unknown>}
          durationInFrames={Math.ceil(seconds * FPS)}
          fps={FPS}
          width={1920}
          height={1080}
        />
      ))
    )}
    {/* Set aside from the hero, to build the multicam capsule (CAPSULES.md #3) from */}
    <Composition id="MulticamDrop-draft-fr" component={MulticamDraft} defaultProps={multicamFr} durationInFrames={Math.ceil(MULTICAM_DROP_SECONDS * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="MulticamDrop-draft-en" component={MulticamDraft} defaultProps={multicamEn} durationInFrames={Math.ceil(MULTICAM_DROP_SECONDS * FPS)} fps={FPS} width={1920} height={1080} />
    {formats.map(({ suffix, width, height }) =>
      (
        [
          ["fr", heroFr],
          ["en", heroEn],
        ] as const
      ).map(([lang, copy]) => (
        <Composition
          key={`hero-${lang}${suffix}`}
          id={`Hero-${lang}${suffix}`}
          component={Hero}
          schema={heroSchema}
          defaultProps={copy}
          durationInFrames={HERO_SECONDS * FPS}
          fps={FPS}
          width={width}
          height={height}
        />
      ))
    )}
    {formats.map(({ suffix, width, height }) =>
      (
        [
          ["fr", euhFr],
          ["en", euhEn],
        ] as const
      ).map(([lang, copy]) => (
        <Composition
          key={`${lang}${suffix}`}
          id={`Euh-${lang}${suffix}`}
          component={Euh}
          schema={euhSchema}
          defaultProps={copy}
          calculateMetadata={euhLength}
          durationInFrames={480}
          fps={FPS}
          width={width}
          height={height}
        />
      ))
    )}
  </>
);

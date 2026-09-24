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

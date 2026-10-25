import type { GuideCopy, GuideStep } from '@/components/guides/types';

export type HowToGuide = GuideCopy & {
  /** HowTo JSON-LD, built from the same steps the page shows. */
  howTo: {
    name: string;
    description: string;
    tool: string;
    steps: GuideStep[];
  };
};

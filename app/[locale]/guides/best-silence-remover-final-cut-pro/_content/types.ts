import type { GuideCopy } from '@/components/guides/types';

export type BestGuide = GuideCopy & {
  /** ItemList JSON-LD: the five options, in the order the page ranks them. */
  itemList: {
    name: string;
    manualName: string;
  };
};

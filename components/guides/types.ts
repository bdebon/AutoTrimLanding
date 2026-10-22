import type { FaqItem } from '@/lib/seo';
import type { GuideLang } from '@/lib/guides';

export type GuideStep = { name: string; text: string };

/** The text of one language version of a guide, besides its body. */
export type GuideCopy = {
  lang: GuideLang;
  /** H1 and Article headline. */
  title: string;
  metaTitle: string;
  socialTitle: string;
  description: string;
  keywords: string;
  ogAlt: string;
  subtitle: string;
  /** Human-readable "last updated" date, in the guide's language. */
  updated: string;
  /** ISO dates for the Article JSON-LD. */
  datePublished: string;
  dateModified: string;
  faq: FaqItem[];
  /** The article body, rendered inside GuideShell. */
  Body: (props: { locale: string }) => React.ReactNode;
};

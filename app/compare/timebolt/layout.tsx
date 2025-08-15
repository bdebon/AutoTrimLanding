import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoTrim vs TimeBolt: The Ultimate Comparison | 48× Faster Video Editing",
  description: "Compare AutoTrim and TimeBolt side-by-side. See why AutoTrim is 48× faster with parallel processing, cleaner UI, and no subscription fees. Try free today.",
  keywords: "AutoTrim vs TimeBolt, TimeBolt alternative, video editing comparison, silence removal software, parallel video processing",
  alternates: {
    canonical: "/compare/timebolt",
  },
  openGraph: {
    title: "AutoTrim vs TimeBolt: 48× Faster Video Editing",
    description: "Detailed comparison showing why professionals switch from TimeBolt to AutoTrim. Parallel processing, one-click workflow, no subscriptions.",
    url: "/compare/timebolt",
    siteName: "AutoTrim",
    images: [
      {
        url: "/assets/img/hero-screenshot.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTrim vs TimeBolt Comparison",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim vs TimeBolt: The Ultimate Comparison",
    description: "See why AutoTrim is 48× faster than TimeBolt for multi-clip projects. No subscriptions, just results.",
    images: ["/assets/img/hero-screenshot.jpg"],
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
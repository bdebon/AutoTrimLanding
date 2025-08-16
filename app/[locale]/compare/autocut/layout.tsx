import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoTrim vs AutoCut: Standalone Speed vs Plugin Complexity",
  description: "Compare AutoTrim and AutoCut. See why AutoTrim's standalone app with local AI processing beats AutoCut's plugin limitations and subscription costs.",
  keywords: "AutoTrim vs AutoCut, AutoCut alternative, video editing comparison, standalone vs plugin, local AI processing",
  alternates: {
    canonical: "/compare/autocut",
  },
  openGraph: {
    title: "AutoTrim vs AutoCut: Clear, Cost-Effective Speed Wins",
    description: "AutoTrim is standalone, fast, and subscription-free. AutoCut is a complex plugin with ongoing costs. See the comparison.",
    url: "/compare/autocut",
    siteName: "AutoTrim",
    images: [
      {
        url: "/assets/img/hero-screenshot.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTrim vs AutoCut Comparison",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim vs AutoCut: Standalone Speed Wins",
    description: "See why professionals choose AutoTrim over AutoCut for faster, simpler video editing without subscriptions.",
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
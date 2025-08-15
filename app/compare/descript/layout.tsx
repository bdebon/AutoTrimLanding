import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoTrim vs Descript: Speed & Control vs All-in-One Cloud",
  description: "Compare AutoTrim and Descript. See why AutoTrim's lightning-fast local processing beats Descript's cloud-based complexity for professional video editing.",
  keywords: "AutoTrim vs Descript, Descript alternative, video editing comparison, local vs cloud processing, text-based editing",
  alternates: {
    canonical: "/compare/descript",
  },
  openGraph: {
    title: "AutoTrim vs Descript: Professional Speed vs Cloud Complexity",
    description: "AutoTrim delivers blazing-fast local processing with no subscriptions. Descript offers cloud-based text editing with monthly fees. See the comparison.",
    url: "/compare/descript",
    siteName: "AutoTrim",
    images: [
      {
        url: "/assets/img/hero-screenshot.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTrim vs Descript Comparison",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim vs Descript: Speed & Control Win",
    description: "See why professional editors choose AutoTrim over Descript for faster, simpler video editing without cloud dependencies.",
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
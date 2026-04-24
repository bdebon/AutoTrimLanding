"use client";

import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareFinalCut from "@/components/CompareFinalCut";

export default function CompareFinalCutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AutoTrim for Final Cut Pro: The Missing Silence Remover",
    description:
      "Final Cut Pro has no native silence removal and no third-party plugin marketplace for it. AutoTrim fills the gap — drop your clips, get a ready-to-import FCPXML timeline.",
    author: {
      "@type": "Person",
      name: "Benjamin Code",
    },
    publisher: {
      "@type": "Organization",
      name: "AutoTrim",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/img/logo-autotrim.svg`,
      },
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/compare/final-cut-pro`,
    },
  };

  return (
    <div className="min-h-screen">
      <Script
        id="ld-comparison"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <CompareFinalCut />
      </main>
      <Footer />
    </div>
  );
}

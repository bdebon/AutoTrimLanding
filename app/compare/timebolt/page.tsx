"use client";

import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareTimebolt from "@/components/CompareTimebolt";

export default function CompareTimeboltPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AutoTrim vs TimeBolt: The Ultimate Comparison",
    description: "Detailed comparison between AutoTrim and TimeBolt for video editing. See why professionals are switching to AutoTrim for 48× faster workflow.",
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
      "@id": `${siteUrl}/compare/timebolt`,
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
        <CompareTimebolt />
      </main>
      <Footer />
    </div>
  );
}
"use client";

import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareAutocut from "@/components/CompareAutocut";

export default function CompareAutocutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AutoTrim vs AutoCut: Standalone Speed vs Plugin Complexity",
    description: "Detailed comparison between AutoTrim and AutoCut. See why AutoTrim's standalone approach with local AI processing beats AutoCut's plugin limitations.",
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
      "@id": `${siteUrl}/compare/autocut`,
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
        <CompareAutocut />
      </main>
      <Footer />
    </div>
  );
}
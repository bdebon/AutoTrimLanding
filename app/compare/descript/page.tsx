"use client";

import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareDescript from "@/components/CompareDescript";

export default function CompareDescriptPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AutoTrim vs Descript: Speed & Control vs All-in-One Cloud",
    description: "Detailed comparison between AutoTrim and Descript. See why AutoTrim's lightning-fast local processing beats Descript's cloud-based complexity for professional video editing.",
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
      "@id": `${siteUrl}/compare/descript`,
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
        <CompareDescript />
      </main>
      <Footer />
    </div>
  );
}
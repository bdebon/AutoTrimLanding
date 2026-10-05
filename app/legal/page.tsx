import React from "react";
import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Legal Notice | AutoTrim",
  description: "Publisher and company information for AutoTrim.",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Legal Notice | AutoTrim",
    description: "Publisher and company information for AutoTrim.",
    url: "/legal",
    siteName: "AutoTrim",
    images: [{ url: "/og/home-en.png", width: 1200, height: 630, alt: "AutoTrim" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Notice | AutoTrim",
    description: "Publisher and company information for AutoTrim.",
    images: ["/og/home-en.png"],
  },
};

export default function LegalPage() {
  return (
    <LegalShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-bold text-at-text mb-8">Legal Notice</h1>

        <p className="text-at-muted mb-8">Effective Date: January 2025</p>

        <div className="prose prose-lg leading-relaxed max-w-none text-at-muted">
          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">Website Editor</h2>

          <div className="mb-6">
            <p className="mb-2"><strong>Company:</strong> bdebon SASU</p>
            <p className="mb-2"><strong>Legal status:</strong> SASU</p>
            <p className="mb-2"><strong>Share capital:</strong> €500</p>
            <p className="mb-2"><strong>Head office:</strong> Bordeaux, France</p>
            <p className="mb-2"><strong>RCS:</strong> Bordeaux</p>
            <p className="mb-2"><strong>SIRET:</strong> 83116964400018</p>
            <p className="mb-2"><strong>VAT number:</strong> FR75831169644</p>
          </div>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">Publication Director</h2>

          <div className="mb-6">
            <p className="mb-2"><strong>Name:</strong> Benjamin Debon</p>
            <p className="mb-2"><strong>Email:</strong> b1jam1code@gmail.com</p>
          </div>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">Hosting</h2>

          <div className="mb-6">
            <p className="mb-2">The website autotrim.app is hosted by:</p>
            <p className="mb-2"><strong>Vercel Inc.</strong></p>
            <p className="mb-2">340 S Lemon Ave #4133</p>
            <p className="mb-2">Walnut, CA 91789, United States</p>
            <p className="mb-4"></p>
            <p className="mb-2">Software binaries are hosted on:</p>
            <p className="mb-2"><strong>GitHub</strong></p>
          </div>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">Intellectual Property</h2>

          <p className="mb-6">
            All content on this website, including text, images, graphics, and logos, is the exclusive property of bdebon SASU
            unless otherwise stated. Any reproduction, distribution, or use of this content without prior written permission
            is strictly prohibited.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">Contact</h2>

          <p className="mb-6">
            For any inquiries regarding this legal notice or the website, please contact us at b1jam1code@gmail.com.
          </p>
        </div>
      </div>
    </LegalShell>
  );
}
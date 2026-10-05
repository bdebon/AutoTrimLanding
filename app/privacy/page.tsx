import React from "react";
import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy | AutoTrim",
  description: "How AutoTrim handles your information and processes your media locally.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | AutoTrim",
    description: "How AutoTrim handles your information and processes your media locally.",
    url: "/privacy",
    siteName: "AutoTrim",
    images: [{ url: "/og/home-en.png", width: 1200, height: 630, alt: "AutoTrim" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | AutoTrim",
    description: "How AutoTrim handles your information and processes your media locally.",
    images: ["/og/home-en.png"],
  },
};

export default function PrivacyPage() {
  return (
    <LegalShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-bold text-at-text mb-8">Privacy Policy</h1>

        <p className="text-at-muted mb-8">Effective Date: January 2025</p>

        <div className="prose prose-lg leading-relaxed max-w-none text-at-muted">
          <p className="mb-6">
            We respect your privacy. This Privacy Policy explains how we handle your data when you use our Website and Software.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">Purchase Information</h3>
          <p className="mb-6">
            When you buy AutoTrim, our payment processor (LemonSqueezy or equivalent) collects your name, email, and payment
            details. We do not store your payment data.
          </p>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">Analytics & Cookies</h3>
          <p className="mb-6">
            We may use basic analytics tools to understand website usage.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">2. Information We Do Not Collect</h2>
          <p className="mb-6">
            AutoTrim processes your video files entirely on your computer. We do not upload, store, or access your media files.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-6">
            <li className="mb-2">To deliver your license key and provide support.</li>
            <li className="mb-2">To communicate important updates or product improvements.</li>
          </ul>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">4. Your Choices</h2>
          <p className="mb-6">
            You may request deletion of your personal data or unsubscribe from communications by contacting us.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">5. Security</h2>
          <p className="mb-6">
            We take reasonable measures to protect your data, though no method is 100% secure.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">6. Contact</h2>
          <p className="mb-6">
            If you have questions, contact us at b1jam1code@gmail.com.
          </p>
        </div>
      </div>
    </LegalShell>
  );
}
import React from "react";
import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Refund Policy | AutoTrim",
  description: "Information about refunds for AutoTrim licenses.",
  alternates: { canonical: "/refund" },
  openGraph: {
    title: "Refund Policy | AutoTrim",
    description: "Information about refunds for AutoTrim licenses.",
    url: "/refund",
    siteName: "AutoTrim",
    images: [{ url: "/og/home-en.png", width: 1200, height: 630, alt: "AutoTrim" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | AutoTrim",
    description: "Information about refunds for AutoTrim licenses.",
    images: ["/og/home-en.png"],
  },
};

export default function RefundPage() {
  return (
    <LegalShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-bold text-at-text mb-8">Refund Policy</h1>

        <p className="text-at-muted mb-8">Effective Date: January 2025</p>

        <div className="prose prose-lg leading-relaxed max-w-none text-at-muted">
          <p className="mb-6">
            We want you to feel confident when purchasing AutoTrim.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">14-Day Money-Back Guarantee</h2>

          <ul className="list-disc list-inside mb-6">
            <li className="mb-3">
              You may request a full refund within 14 days of purchase if you are not satisfied.
            </li>
            <li className="mb-3">
              Refund requests must be sent to b1jam1code@gmail.com with your order details.
            </li>
            <li className="mb-3">
              Refunds will be issued to your original payment method.
            </li>
            <li className="mb-3">
              After 14 days, all sales are final.
            </li>
          </ul>

          <p className="mb-6">
            This policy does not affect your legal rights under applicable consumer protection laws.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">Contact Us</h2>
          <p className="mb-6">
            For any questions about refunds, please email us at b1jam1code@gmail.com.
          </p>
        </div>
      </div>
    </LegalShell>
  );
}
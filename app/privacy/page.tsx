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

        <p className="text-at-muted mb-8">Effective Date: October 2026</p>

        <div className="prose prose-lg leading-relaxed max-w-none text-at-muted">
          <p className="mb-6">
            We respect your privacy. This Privacy Policy explains what data we collect when you use our Website and
            Software, why, and how you can control it.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">Purchase Information</h3>
          <p className="mb-6">
            When you buy AutoTrim, our payment processor and merchant of record, LemonSqueezy, collects your name, email,
            billing country and payment details. We receive your name, email, country and order details. We never see or
            store your payment details.
          </p>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">Website Analytics</h3>
          <p className="mb-6">
            We use PostHog to understand how visitors find and use the Website: pages viewed, the site or campaign that
            referred you (including UTM parameters), device and browser type, your IP address and the approximate location
            derived from it. PostHog stores a random identifier in your browser (cookie and local storage) and may record how
            you navigate the Website (session replay).
          </p>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">App Usage Statistics</h3>
          <p className="mb-6">
            The AutoTrim app sends usage statistics to PostHog: features used, processing figures (such as the number and
            length of clips), errors, app version, operating system, your IP address and the approximate location derived
            from it, and a random install identifier. When you download
            the app from the Website, this identifier is linked to your Website visit. If you buy a license from the app
            or activate one, the purchase and the license email are linked to these statistics, so we can see how
            customers discover and use AutoTrim.
          </p>
          <p className="mb-6">
            You can turn usage statistics off at any time in the app, under Preferences, &ldquo;Share usage
            statistics&rdquo;.
          </p>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">Emails</h3>
          <p className="mb-6">
            We use Customer.io to send customers emails about their license, product updates and offers. Every email has
            an unsubscribe link.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">2. Information We Do Not Collect</h2>
          <p className="mb-6">
            AutoTrim processes your video and audio files entirely on your computer. We do not upload, store, or access
            your media files, and their content is never part of the usage statistics.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-6">
            <li className="mb-2">To deliver your license key and provide support.</li>
            <li className="mb-2">To understand how people discover AutoTrim and which channels work.</li>
            <li className="mb-2">To fix bugs and improve the Software.</li>
            <li className="mb-2">To communicate important updates, product improvements and offers.</li>
          </ul>
          <p className="mb-6">
            Under the GDPR, we rely on the performance of our contract with you to deliver your license, and on our
            legitimate interest to measure and improve the Website and Software and to email our customers. You can
            object at any time.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">4. Service Providers</h2>
          <p className="mb-6">
            We share data only with the providers that run the service: LemonSqueezy (payments and licenses), PostHog
            (analytics), Customer.io (email), Supabase (processing purchase notifications) and Vercel (website hosting).
            Some of them process data in the United States, under the safeguards provided in their data processing
            agreements, such as the European Commission&apos;s standard contractual clauses. We do not sell your data.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">5. Retention</h2>
          <p className="mb-6">
            We keep purchase records as long as the law requires for accounting. We keep analytics data as long as it
            helps us improve AutoTrim, and we delete your data when you ask.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">6. Your Choices and Rights</h2>
          <p className="mb-6">
            You can turn off usage statistics in the app, unsubscribe from emails with the link they contain, and ask us to
            access, correct or delete your personal data, or object to its use, by contacting us. You can also lodge a
            complaint with your data protection authority.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">7. Security</h2>
          <p className="mb-6">
            We take reasonable measures to protect your data, though no method is 100% secure.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">8. Contact</h2>
          <p className="mb-6">
            If you have questions, contact us at b1jam1code@gmail.com.
          </p>
        </div>
      </div>
    </LegalShell>
  );
}
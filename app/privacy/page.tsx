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
            derived from it. With your consent, PostHog stores a random identifier in your browser (cookie and local
            storage), may record how you navigate the Website (session replay), and links your visit to the app you
            download and to a purchase. Without it, PostHog only counts your visits: no cookie, nothing stored in your
            browser, and no session replay.
          </p>

          <h3 className="font-display text-xl font-semibold text-at-text mt-6 mb-3">Cookies and Advertising Tags</h3>
          <p className="mb-6">
            Visitors from the European Union, the European Economic Area, the United Kingdom and Switzerland are asked
            first, and nothing that tracks them runs before they answer. Two choices are offered separately: audience
            measurement (PostHog, as described above) and advertising. With consent to advertising, the Website loads
            the Meta Pixel, which tells Meta (Meta Platforms Ireland) which pages you view and when you click Download,
            so we can measure our ads and show them to people likely to need AutoTrim, and Google Tag Manager. Meta sets
            its own cookies (_fbp, _fbc), and the Website keeps a copy of the ad click identifier in your browser for 90
            days. Elsewhere these tools run by default.
          </p>
          <p className="mb-6">
            With that same consent (or, outside these regions, unless you turned advertising off), a purchase is also
            reported to Meta, so we can tell which ads lead to sales. The checkout link carries Meta&rsquo;s identifiers
            from your browser (_fbc, _fbp), your browser type and the page you bought from. Once the payment goes
            through, our server sends Meta the order: its number, amount and currency, your email address and country
            in hashed form (SHA-256), and these identifiers. Without consent to advertising, nothing about your purchase
            is sent to Meta.
          </p>
          <p className="mb-6">
            Wherever you are, you can change your choice at any time with the &ldquo;Cookies&rdquo; link at the bottom of
            every page. Your choice is kept in your browser for 6 months, then asked again. Vercel Web Analytics also
            counts page views, without cookies.
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
            To link the download to the app, the Download button copies a short code to your clipboard, which the app
            reads on its first launch. Without consent to audience measurement, the code only carries the campaign that
            brought you, not your visitor identifier, and nothing below is recorded. In case something else was copied meanwhile, the click is also recorded on our
            server with your visitor identifier and campaign, under a keyed hash of your network (your IP address
            itself is never stored). If the app finds no code on its first launch, it asks our server from the same
            network: when exactly one visitor clicked Download from that network in the previous 3 hours, the app takes
            that visitor&rsquo;s identifier. These records are deleted as soon as they are used, and after 24 hours.
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
          <p className="mb-6">
            On a phone, you can leave your email to receive the download link on your computer. We keep that address in
            Customer.io, with the campaign that brought you, and only send you that link, unless you also ask for news
            and tips with the box below the form. To keep bots from sending it in a loop, the form is checked by
            Cloudflare Turnstile, which looks at signals from your browser and network when you send it.
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
            Under the GDPR, we rely on the performance of our contract with you to deliver your license, on your consent
            for the Website&apos;s analytics cookies and advertising tags, and on our legitimate interest to measure and
            improve the Software and to email our customers. You can withdraw your consent or object at any time.
          </p>

          <h2 className="font-display text-2xl font-semibold text-at-text mt-8 mb-4">4. Service Providers</h2>
          <p className="mb-6">
            We share data only with the providers that run the service: LemonSqueezy (payments and licenses), PostHog
            (analytics), Customer.io (email), Supabase (processing purchase notifications), Vercel (website hosting and
            cookieless page counts), and, with your consent to advertising, Meta (ad measurement, including the
            purchases made after visiting the Website) and Google (Tag Manager).
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
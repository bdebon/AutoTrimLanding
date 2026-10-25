import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import TrackingScripts from "./TrackingScripts";
import ConsentBanner from "./ConsentBanner";
import PostHogProvider from "./PostHogProvider";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";

// The app's two variable families, self-hosted from the fontsource packages. next/font
// preloads them and sizes the fallback face to their metrics, so nothing jumps when they land.
const display = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2", style: "normal" },
    { path: "../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  variable: "--font-display-next",
  display: "swap",
  weight: "200 800",
});
const ui = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2", style: "normal" },
    { path: "../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-ext-wght-normal.woff2", style: "normal" },
    { path: "../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-ui-next",
  display: "swap",
  weight: "400 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0B",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.autotrim.app"),
  title: "AutoTrim – Remove Silence from Videos Automatically | Free Trial",
  description:
    "AutoTrim removes silences, filler words and hesitations from your videos in seconds. Drop all your clips, get one clean timeline for Premiere, Final Cut or Resolve. 100% local, no cloud. Try free.",
  keywords: "auto trim, remove silence from video, automatic silence removal, cut filler words, video editing automation, trim silence video, autotrim, Final Cut Pro, Adobe Premiere, DaVinci Resolve, video production, content creation",
  authors: [{ name: "AutoTrim Team" }],
  creator: "AutoTrim",
  publisher: "AutoTrim",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AutoTrim – Remove Silence from Videos Automatically | Free Trial",
    description:
      "AutoTrim removes silences, filler words and hesitations from your videos in seconds. Drop all your clips, get one clean timeline for Premiere, Final Cut or Resolve. 100% local, no cloud. Try free.",
    url: "/",
    siteName: "AutoTrim",
    images: [
      {
        url: "/og/home-en.png",
        width: 1200,
        height: 630,
        alt: "AutoTrim - Auto trim and remove silence from videos automatically",
      },
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim – Remove Silence from Videos Automatically | Free Trial",
    description:
      "AutoTrim removes silences, filler words and hesitations from your videos in seconds. Drop all your clips, get one clean timeline. 100% local, no cloud. Try free.",
    images: ["/og/home-en.png"],
    creator: "@autotrimapp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The page's language follows the active locale: the next-intl middleware passes it
  // to every /[locale] request. Pages outside [locale] (/legal, /privacy, /terms,
  // /refund) never go through it, so i18n/request.ts falls back to "en" for them.
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://github.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${ui.variable} antialiased`}
      >
        {/* Schema.org structured data */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AutoTrim",
              "alternateName": "Auto Trim",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "macOS, Windows",
              "description": "AutoTrim removes silences, filler words and hesitations from your videos in seconds. Drop all your clips, get one clean timeline for Premiere, Final Cut or Resolve. 100% local processing.",
              "url": "https://www.autotrim.app",
              "downloadUrl": "https://www.autotrim.app/en/download",
              "screenshot": "https://www.autotrim.app/app/session-en.webp",
              "datePublished": "2025-01-01",
              "author": {
                "@type": "Person",
                "name": "Benjamin Code",
                "url": "https://www.youtube.com/@BenjaminCode"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free version — unlimited processing and previews, pay only to export",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "price": "15",
                  "priceCurrency": "USD",
                  "description": "Monthly license — $15/month, cancel anytime",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "price": "119",
                  "priceCurrency": "USD",
                  "description": "Annual license — $119/year",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "price": "149",
                  "priceCurrency": "USD",
                  "description": "Lifetime license — one-time payment, all future updates included",
                  "availability": "https://schema.org/InStock"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "3"
              },
              "featureList": [
                "Automatic silence removal",
                "Remove filler words and hesitations with AI",
                "Parallel multi-clip processing",
                "Single clean XML timeline export",
                "Works with Final Cut Pro, Adobe Premiere, DaVinci Resolve",
                "100% local processing — no cloud uploads",
                "Audio/video sync detection",
                "Customizable silence thresholds"
              ]
            })
          }}
        />

        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Analytics />
        {/* Meta Pixel and Google Tag Manager, only with consent (lib/consent.ts) */}
        <TrackingScripts />
        <ConsentBanner />
      </body>
    </html>
  );
}

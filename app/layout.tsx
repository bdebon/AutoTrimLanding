import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import FacebookPixel from "./FacebookPixel";
import PostHogProvider from "./PostHogProvider";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AutoTrim – Remove Silence from Videos Automatically | Free Trial",
  description:
    "AutoTrim removes silences, filler words and hesitations from your videos in seconds. Drop all your clips, get one clean timeline for Premiere, Final Cut or Resolve. 100% local, no cloud. Try free.",
  keywords: "auto trim, remove silence from video, automatic silence removal, cut filler words, video editing automation, trim silence video, autotrim, Final Cut Pro, Adobe Premiere, DaVinci Resolve, video production, content creation",
  authors: [{ name: "AutoTrim Team" }],
  creator: "AutoTrim",
  publisher: "AutoTrim",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
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
        url: "/assets/img/hero-screenshot.jpg",
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
    images: ["/assets/img/hero-screenshot.jpg"],
    creator: "@autotrimapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://github.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${ui.variable} antialiased`}
      >
        {/* Meta Pixel - lazyOnload for better LCP */}
        <Script
          id="facebook-pixel"
          strategy="lazyOnload"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2240864149721547');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2240864149721547&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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
              "screenshot": "https://www.autotrim.app/assets/img/hero-screenshot.jpg",
              "softwareVersion": "1.0",
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
                  "description": "Lifetime license — one-time payment, all future updates included (launch price, regular $279)",
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

        <FacebookPixel />
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Analytics />

        {/* Google Tag Manager - lazyOnload for better LCP */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-MTPT8QGT"
        />
        <Script
          id="gtm-init"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          `}
        </Script>
      </body>
    </html>
  );
}

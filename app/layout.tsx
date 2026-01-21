import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import FacebookPixel from "./FacebookPixel";
import PostHogProvider from "./PostHogProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AutoTrim – Auto Trim Silence, Filler Words & Hesitations from Videos",
  description:
    "Automatically remove silence, filler words, and hesitations from videos with AutoTrim. Auto trim and cut unwanted pauses in seconds. Speed up your video editing workflow by 10x. Works with Final Cut Pro, Adobe Premiere, and DaVinci Resolve. Try it free today!",
  keywords: "auto trim, automatic trimming, silence removal, remove filler words, cut hesitations, video editing, automatic editing, remove silence from video, cut silence video, um ah removal, Final Cut Pro, Adobe Premiere, DaVinci Resolve, video production, content creation",
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
    title: "AutoTrim – Auto Trim Silence, Filler Words & Hesitations from Videos",
    description:
      "Automatically remove silence, filler words, and hesitations from videos. Auto trim and cut unwanted pauses in seconds. Speed up your video editing workflow by 10x. Works with Final Cut Pro, Adobe Premiere, and DaVinci Resolve.",
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
    title: "AutoTrim – Auto Trim Silence, Filler Words & Hesitations",
    description:
      "Automatically remove silence, filler words, and hesitations from videos. Auto trim and cut unwanted pauses in seconds. Speed up your video editing workflow by 10x.",
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
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preload" href="/assets/img/logo-autotrim.svg" as="image" fetchPriority="high" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${geistMono.variable} antialiased`}
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
              "description": "Automatically remove silence, filler words, and hesitations from videos. Auto trim and cut unwanted pauses in seconds with parallel processing.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free trial with one-time purchase for lifetime license"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "3"
              },
              "featureList": [
                "Automatic silence removal",
                "Remove filler words and hesitations",
                "Auto trim videos",
                "Parallel video processing",
                "XML timeline export",
                "Works with Final Cut Pro, Adobe Premiere, DaVinci Resolve",
                "Local processing - no cloud uploads"
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

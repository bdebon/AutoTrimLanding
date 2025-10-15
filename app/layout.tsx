import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MTPT8QGT');`
          }}
        />
        {/* End Google Tag Manager */}

        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preload" href="/assets/img/logo-autotrim.svg" as="image" fetchPriority="high" />
        <script
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
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MTPT8QGT"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
        <Analytics />
      </body>
    </html>
  );
}

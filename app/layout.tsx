import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AutoTrim – Instantly cut silence in your videos | Automatic Video Editing",
  description:
    "Remove silence from videos automatically with AutoTrim. Speed up your video editing workflow by 10x. Works with Final Cut Pro, Adobe Premiere, and DaVinci Resolve. Try it free today!",
  keywords: "video editing, silence removal, automatic editing, Final Cut Pro, Adobe Premiere, DaVinci Resolve, video production, content creation",
  authors: [{ name: "AutoTrim Team" }],
  creator: "AutoTrim",
  publisher: "AutoTrim",
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
    title: "AutoTrim – Instantly cut silence in your videos",
    description:
      "Remove silence from videos automatically. Speed up your video editing workflow by 10x. Works with Final Cut Pro, Adobe Premiere, and DaVinci Resolve.",
    url: "/",
    siteName: "AutoTrim",
    images: [
      {
        url: "/assets/img/hero-screenshot.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTrim - Automatic silence removal tool",
      },
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim – Instantly cut silence in your videos",
    description:
      "Remove silence from videos automatically. Speed up your video editing workflow by 10x.",
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
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

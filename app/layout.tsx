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
  title: "AutoTrim – Instantly cut silence in your videos",
  description:
    "Speed up your editing workflow. AutoTrim removes silence automatically. Fast, accurate, and reliable.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AutoTrim – Instantly cut silence in your videos",
    description:
      "Speed up your editing workflow. AutoTrim removes silence automatically.",
    url: "/",
    siteName: "AutoTrim",
    images: [
      {
        url: "/assets/img/hero-screenshot.jpg",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim – Instantly cut silence in your videos",
    description:
      "Speed up your editing workflow. AutoTrim removes silence automatically.",
    images: ["/assets/img/hero-screenshot.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
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

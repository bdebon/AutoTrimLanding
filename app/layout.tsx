import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

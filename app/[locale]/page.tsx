import { Metadata } from "next";
import Script from "next/script";
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ProcessSteps from "@/components/ProcessSteps";
import VideoDemo from "@/components/VideoDemo";
import TimeSavings from "@/components/TimeSavings";
import PerksGrid from "@/components/PerksGrid";
import Testimonials from "@/components/Testimonials";
import WhyFaster from "@/components/WhyFaster";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const localeMap: Record<string, string> = {
    'fr': 'fr_FR',
    'es': 'es_ES',
    'zh': 'zh_CN',
    'en': 'en_US'
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ["/assets/img/hero-screenshot.jpg"],
      locale: localeMap[locale] || 'en_US',
    },
  };
}

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AutoTrim",
    alternateName: "Auto Trim",
    description:
      "AutoTrim removes silences, filler words and hesitations from your videos in seconds. Drop all your clips, get one clean timeline for Premiere, Final Cut or Resolve.",
    image: [`${siteUrl}/assets/img/hero-screenshot.jpg`],
    brand: {
      "@type": "Brand",
      name: "AutoTrim",
    },
    url: siteUrl,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does AutoTrim work on Mac and Windows?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. AutoTrim runs on macOS and Windows thanks to Rust & Tauri.",
        },
      },
      {
        "@type": "Question",
        name: "Does AutoTrim work with Final Cut Pro, Premiere, and DaVinci Resolve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! AutoTrim exports XML/FCPXML timelines compatible with all major NLEs including Final Cut Pro, Adobe Premiere, and DaVinci Resolve.",
        },
      },
      {
        "@type": "Question",
        name: "Do my files leave my computer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. All processing happens locally on your device. No cloud uploads, no data leaving your machine.",
        },
      },
      {
        "@type": "Question",
        name: "Can AutoTrim remove filler words and hesitations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, AutoTrim can detect and remove filler words and hesitations using AI. This feature is available but still experimental — results may vary depending on language and diction.",
        },
      },
      {
        "@type": "Question",
        name: "Can I process multiple clips at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Parallel multi-clip processing is built-in. Drop all your clips at once and get one clean, assembled timeline — no need to process clips one by one.",
        },
      },
      {
        "@type": "Question",
        name: "Does AutoTrim support audio files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! AutoTrim works with both video and audio files. You can even drop video and audio separately — if they match, AutoTrim syncs them automatically and exports both aligned in your timeline.",
        },
      },
    ],
  };
  return (
    <div className="min-h-screen">
      <Script
        id="ld-product"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <VideoDemo />
        <TimeSavings />
        <Testimonials />
        <ProcessSteps />
        <WhyFaster />
        <PerksGrid />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

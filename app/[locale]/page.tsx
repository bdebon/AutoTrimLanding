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
import Pricing from "@/components/Pricing";
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
      "Auto trim and remove silence, filler words, and hesitations from videos automatically. Speed up your editing workflow with parallel processing.",
    image: [`${siteUrl}/assets/img/hero-screenshot.jpg`],
    brand: {
      "@type": "Brand",
      name: "AutoTrim",
    },
    url: siteUrl,
  };
  return (
    <div className="min-h-screen">
      <Script
        id="ld-product"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

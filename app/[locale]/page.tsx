import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ProcessSteps from "@/components/ProcessSteps";
import VideoDemo from "@/components/VideoDemo";
import TimeSavings from "@/components/TimeSavings";
import WhoIsItFor from "@/components/WhoIsItFor";
import PerksGrid from "@/components/PerksGrid";
import Testimonials from "@/components/Testimonials";
import WhyFaster from "@/components/WhyFaster";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AutoTrim",
    description:
      "Speed up your editing workflow. AutoTrim removes silence automatically.",
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
        <ProcessSteps />
        <VideoDemo />
        <TimeSavings />
        <WhoIsItFor />
        <PerksGrid />
        <Testimonials />
        <WhyFaster />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

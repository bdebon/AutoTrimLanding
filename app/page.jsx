"use client";

import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Hero from "../src/components/Hero";
import SocialProof from "../src/components/SocialProof";
import ProcessSteps from "../src/components/ProcessSteps";
import VideoDemo from "../src/components/VideoDemo";
import TimeSavings from "../src/components/TimeSavings";
import WhoIsItFor from "../src/components/WhoIsItFor";
import PerksGrid from "../src/components/PerksGrid";
import Testimonials from "../src/components/Testimonials";
import Pricing from "../src/components/Pricing";
import FAQ from "../src/components/FAQ";
import FinalCTA from "../src/components/FinalCTA";

export default function Page() {
  return (
    <div className="min-h-screen">
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
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

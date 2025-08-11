import React from "react";
import Header from "./components/Header";
import { Routes, Route } from 'react-router-dom';
import Hero from "./components/Hero";
import ProcessSteps from "./components/ProcessSteps";
import TimeSavings from "./components/TimeSavings";
import PerksGrid from "./components/PerksGrid";
import SocialProof from "./components/SocialProof.jsx";
import VideoDemo from "./components/VideoDemo";
import WhoIsItFor from "./components/WhoIsItFor";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FinalCTA from "./components/FinalCTA";
import Download from "./components/Download";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />
          <Route path="/download" element={<Download />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

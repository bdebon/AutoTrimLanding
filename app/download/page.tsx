"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Download from "@/components/Download";

export default function DownloadPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Download />
      </main>
      <Footer />
    </div>
  );
}

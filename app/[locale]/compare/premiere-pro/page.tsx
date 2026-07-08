import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparePremiere from "@/components/ComparePremiere";

export default async function ComparePremierePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AutoTrim vs Premiere Pro's Built-in Tools: Automatic Silence Removal Compared",
    description:
      "Premiere Pro's text-based editing cleans pauses one sequence at a time. AutoTrim removes silences and filler words from all your rushes in parallel and exports one assembled XML timeline ready for the fine cut.",
    author: {
      "@type": "Person",
      name: "Benjamin Code",
      url: "https://www.youtube.com/@BenjaminCode",
    },
    publisher: {
      "@type": "Organization",
      name: "AutoTrim",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/img/logo-autotrim.svg`,
      },
    },
    datePublished: "2026-07-08",
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/en/compare/premiere-pro`,
    },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <ComparePremiere />
      </main>
      <Footer />
    </div>
  );
}

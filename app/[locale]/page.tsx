import { Metadata } from "next";
import Script from "next/script";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import Silences from "@/components/landing/Silences";
import Hesitations from "@/components/landing/Hesitations";
import Multicam from "@/components/landing/Multicam";
import Timeline from "@/components/landing/Timeline";
import Preview from "@/components/landing/Preview";
import Local from "@/components/landing/Local";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Faq, { type FaqEntry } from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = "/og/autotrim-v2.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.meta" });

  const localeMap: Record<string, string> = {
    fr: "fr_FR",
    es: "es_ES",
    zh: "zh_CN",
    en: "en_US",
  };

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: t("ogAlt") }],
      locale: localeMap[locale] || "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [OG_IMAGE],
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AutoTrim",
    alternateName: "Auto Trim",
    description: t("meta.description"),
    image: [`${siteUrl}${OG_IMAGE}`],
    brand: { "@type": "Brand", name: "AutoTrim" },
    url: siteUrl,
  };

  // The same twelve questions as the FAQ section, in the page's language.
  const faqItems = t.raw("faq.items") as FaqEntry[];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-at-app font-ui text-at-text">
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
        <Hero locale={locale} />
        <Silences />
        <Hesitations locale={locale} />
        <Multicam locale={locale} />
        <Timeline locale={locale} />
        <Preview locale={locale} />
        <Local locale={locale} />
        <Testimonials />
        <Pricing locale={locale} />
        <Faq />
        <FinalCta locale={locale} />
      </main>
      <Footer />
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareTimebolt from "@/components/CompareTimebolt";
import CompareExtras from "@/components/CompareExtras";
import {
  compareArticleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/lib/seo";

export default async function CompareTimeboltPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.autotrim.app";
  const t = await getTranslations({ locale });
  const faqItems = Object.values(
    t.raw("compareTimebolt.faq") as Record<string, FaqItem>
  );

  const jsonLd = [
    compareArticleJsonLd({
      siteUrl,
      slug: "timebolt",
      headline: "AutoTrim vs TimeBolt: The Ultimate Comparison",
      description:
        "Detailed comparison between AutoTrim and TimeBolt for video editing. See why professionals are switching to AutoTrim for 48× faster workflow.",
      datePublished: "2026-02-12",
    }),
    faqJsonLd(faqItems),
    breadcrumbJsonLd(siteUrl, [
      { name: "AutoTrim", path: `/${locale}` },
      { name: t("compareTimebolt.title"), path: `/${locale}/compare/timebolt` },
    ]),
  ];

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <CompareTimebolt />
        <CompareExtras locale={locale} slug="timebolt" faqItems={faqItems} />
      </main>
      <Footer />
    </div>
  );
}

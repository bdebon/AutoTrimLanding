import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareFinalCut from "@/components/CompareFinalCut";
import CompareExtras from "@/components/CompareExtras";
import {
  compareArticleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/lib/seo";

export default async function CompareFinalCutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.autotrim.app";
  const t = await getTranslations({ locale });
  const faqItems = Object.values(
    t.raw("compareFinalCut.faq") as Record<string, FaqItem>
  );

  const jsonLd = [
    compareArticleJsonLd({
      siteUrl,
      slug: "final-cut-pro",
      headline: t("compareFinalCut.title"),
      description: t("metadata.compareFinalCut.description"),
      datePublished: "2026-04-24",
      dateModified: "2026-10-22",
      locale,
    }),
    faqJsonLd(faqItems),
    breadcrumbJsonLd(siteUrl, [
      { name: "AutoTrim", path: `/${locale}` },
      {
        name: t("compareFinalCut.title"),
        path: `/${locale}/compare/final-cut-pro`,
      },
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
        <CompareFinalCut />
        <CompareExtras
          locale={locale}
          slug="final-cut-pro"
          faqItems={faqItems}
        />
      </main>
      <Footer />
    </div>
  );
}

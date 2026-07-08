import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareAutocut from "@/components/CompareAutocut";
import CompareExtras from "@/components/CompareExtras";
import {
  compareArticleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/lib/seo";

export default async function CompareAutocutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const t = await getTranslations({ locale });
  const faqItems = Object.values(
    t.raw("compareAutocut.faq") as Record<string, FaqItem>
  );

  const jsonLd = [
    compareArticleJsonLd({
      siteUrl,
      slug: "autocut",
      headline: "AutoTrim vs AutoCut: Standalone Speed vs Plugin Complexity",
      description:
        "Detailed comparison between AutoTrim and AutoCut. See why AutoTrim's standalone approach with local AI processing beats AutoCut's plugin limitations.",
      datePublished: "2026-02-12",
    }),
    faqJsonLd(faqItems),
    breadcrumbJsonLd(siteUrl, [
      { name: "AutoTrim", path: `/${locale}` },
      { name: t("compareAutocut.title"), path: `/${locale}/compare/autocut` },
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
        <CompareAutocut />
        <CompareExtras locale={locale} slug="autocut" faqItems={faqItems} />
      </main>
      <Footer />
    </div>
  );
}

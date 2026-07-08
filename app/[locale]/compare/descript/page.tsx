import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareDescript from "@/components/CompareDescript";
import CompareExtras from "@/components/CompareExtras";
import {
  compareArticleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/lib/seo";

export default async function CompareDescriptPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const t = await getTranslations({ locale });
  const faqItems = Object.values(
    t.raw("compareDescript.faq") as Record<string, FaqItem>
  );

  const jsonLd = [
    compareArticleJsonLd({
      siteUrl,
      slug: "descript",
      headline: "AutoTrim vs Descript: Speed & Control vs All-in-One Cloud",
      description:
        "Detailed comparison between AutoTrim and Descript. See why AutoTrim's lightning-fast local processing beats Descript's cloud-based complexity for professional video editing.",
      datePublished: "2026-02-12",
    }),
    faqJsonLd(faqItems),
    breadcrumbJsonLd(siteUrl, [
      { name: "AutoTrim", path: `/${locale}` },
      { name: t("compareDescript.title"), path: `/${locale}/compare/descript` },
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
        <CompareDescript />
        <CompareExtras locale={locale} slug="descript" faqItems={faqItems} />
      </main>
      <Footer />
    </div>
  );
}

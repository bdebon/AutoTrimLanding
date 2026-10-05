import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComparePremiere from "@/components/ComparePremiere";
import CompareExtras from "@/components/CompareExtras";
import {
  compareArticleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/lib/seo";

export default async function ComparePremierePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.autotrim.app";
  const t = await getTranslations({ locale });
  const faqItems = Object.values(
    t.raw("comparePremiere.faq") as Record<string, FaqItem>
  );

  const jsonLd = [
    compareArticleJsonLd({
      siteUrl,
      slug: "premiere-pro",
      headline:
        "AutoTrim vs Premiere Pro's Built-in Tools: Automatic Silence Removal Compared",
      description:
        "Premiere Pro's text-based editing cleans pauses one sequence at a time. AutoTrim removes silences and filler words from all your rushes in parallel and exports one assembled XML timeline ready for the fine cut.",
      datePublished: "2026-07-08",
    }),
    faqJsonLd(faqItems),
    breadcrumbJsonLd(siteUrl, [
      { name: "AutoTrim", path: `/${locale}` },
      {
        name: t("comparePremiere.title"),
        path: `/${locale}/compare/premiere-pro`,
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
        <ComparePremiere />
        <CompareExtras
          locale={locale}
          slug="premiere-pro"
          faqItems={faqItems}
        />
      </main>
      <Footer />
    </div>
  );
}

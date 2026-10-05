import { socialImage } from "@/lib/social";
import { localeAlternates } from "@/lib/seo";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const localeMap: Record<string, string> = {
    'fr': 'fr_FR',
    'es': 'es_ES',
    'zh': 'zh_CN',
    'en': 'en_US'
  };

  return {
    title: t('pricing.title'),
    description: t('pricing.description'),
    keywords: t('pricing.keywords'),
    alternates: localeAlternates(locale, "/pricing"),
    twitter: {
      card: "summary_large_image",
      title: t('pricing.title'),
      description: t('pricing.description'),
      images: [socialImage(locale, "pricing")],
    },
    openGraph: {
      url: `/${locale}/pricing`,
      siteName: "AutoTrim",
      type: "website",
      images: [{ url: socialImage(locale, "pricing"), width: 1200, height: 630, alt: t('pricing.title') }],
      title: t('pricing.title'),
      description: t('pricing.description'),
      locale: localeMap[locale] || 'en_US',
    },
  };
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

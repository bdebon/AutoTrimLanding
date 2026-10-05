import { socialImage } from "@/lib/social";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { localeAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.compareFinalCut' });

  const localeMap: Record<string, string> = {
    'fr': 'fr_FR', 'es': 'es_ES', 'zh': 'zh_CN', 'en': 'en_US'
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: localeAlternates(locale, '/compare/final-cut-pro'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `/${locale}/compare/final-cut-pro`,
      siteName: "AutoTrim",
      images: [
        {
          url: socialImage(locale, "compare-final-cut-pro"),
          width: 1200,
          height: 630,
          alt: "AutoTrim for Final Cut Pro",
        },
      ],
      locale: localeMap[locale] || 'en_US',
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: [socialImage(locale, "compare-final-cut-pro")],
    },
  };
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

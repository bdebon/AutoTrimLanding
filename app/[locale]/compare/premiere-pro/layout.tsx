import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { localeAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.comparePremiere' });

  const localeMap: Record<string, string> = {
    'fr': 'fr_FR', 'es': 'es_ES', 'zh': 'zh_CN', 'en': 'en_US'
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: localeAlternates(locale, '/compare/premiere-pro'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `/${locale}/compare/premiere-pro`,
      siteName: "AutoTrim",
      images: [
        {
          url: "/assets/img/hero-screenshot.jpg",
          width: 1200,
          height: 630,
          alt: "AutoTrim vs Premiere Pro built-in tools comparison",
        },
      ],
      locale: localeMap[locale] || 'en_US',
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: ["/assets/img/hero-screenshot.jpg"],
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

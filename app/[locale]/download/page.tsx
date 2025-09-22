import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Download from "@/components/Download";

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
    title: t('download.title'),
    description: t('download.description'),
    keywords: t('download.keywords'),
    openGraph: {
      title: t('download.title'),
      description: t('download.description'),
      locale: localeMap[locale] || 'en_US',
    },
  };
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Download />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import { GuideShell } from '@/components/guides/GuideShell';
import { faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import {
  guideAlternates,
  guideLang,
  GUIDES_LABEL,
  OG_LOCALE,
  type GuideLang,
} from '@/lib/guides';
import type { BestGuide } from './_content/types';
import en from './_content/en';
import fr from './_content/fr';
import es from './_content/es';

const SLUG = 'best-silence-remover-final-cut-pro';
const CONTENT: Record<GuideLang, BestGuide> = { en, fr, es };
// One social image for every language, like the other guides.
const OG_IMAGE = `/og/guide-${SLUG}-en.png`;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = CONTENT[guideLang(locale, SLUG)];
  const alternates = guideAlternates(locale, SLUG);

  return {
    title: c.metaTitle,
    description: c.description,
    keywords: c.keywords,
    alternates,
    openGraph: {
      title: c.metaTitle,
      description: c.description,
      url: alternates.canonical,
      siteName: 'AutoTrim',
      type: 'article',
      locale: OG_LOCALE[c.lang],
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: c.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.socialTitle,
      description: c.description,
      images: [OG_IMAGE],
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.autotrim.app';
  const c = CONTENT[guideLang(locale, SLUG)];
  const path = `/${c.lang}/guides/${SLUG}`;
  const { Body } = c;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.title,
      description: c.description,
      inLanguage: c.lang,
      author: {
        '@type': 'Person',
        name: 'Benjamin Code',
        url: 'https://www.youtube.com/@BenjaminCode',
      },
      publisher: {
        '@type': 'Organization',
        name: 'AutoTrim',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/icon-512.png`,
        },
      },
      datePublished: c.datePublished,
      dateModified: c.dateModified,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}${path}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: c.itemList.name,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'AutoTrim',
          url: `${siteUrl}/${c.lang}`,
        },
        { '@type': 'ListItem', position: 2, name: 'TimeBolt' },
        { '@type': 'ListItem', position: 3, name: 'Recut' },
        { '@type': 'ListItem', position: 4, name: 'Descript' },
        { '@type': 'ListItem', position: 5, name: c.itemList.manualName },
      ],
    },
    faqJsonLd(c.faq),
    breadcrumbJsonLd(siteUrl, [
      { name: 'AutoTrim', path: `/${c.lang}` },
      { name: GUIDES_LABEL[c.lang], path: `/${c.lang}/guides` },
      { name: c.title, path },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuideShell
        locale={locale}
        lang={c.lang}
        title={c.title}
        subtitle={c.subtitle}
        updated={c.updated}
      >
        <Body locale={locale} />
      </GuideShell>
    </>
  );
}

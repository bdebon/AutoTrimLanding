import type { MetadataRoute } from 'next';
import { GUIDE_SLUGS, GUIDES_INDEX_LANGS, guideLangs, type GuideLang } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.autotrim.app';
  const lastModified = new Date();

  const locales = ['en', 'fr', 'es', 'zh'];
  const comparePages = ['timebolt', 'autocut', 'descript', 'final-cut-pro', 'premiere-pro'];

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Add locale-specific pages
  locales.forEach(locale => {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Add download page for each locale
    entries.push({
      url: `${siteUrl}/${locale}/download`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Add pricing page for each locale
    entries.push({
      url: `${siteUrl}/${locale}/pricing`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    // Add comparison pages for each locale
    comparePages.forEach(page => {
      entries.push({
        url: `${siteUrl}/${locale}/compare/${page}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  // Guides: one entry per language a guide is written in (lib/guides.ts).
  // English-only guides keep their single /en URL; /zh is never listed.
  const guideEntries = (
    path: string,
    langs: readonly GuideLang[],
    priority: number,
    changeFrequency: 'weekly' | 'monthly'
  ) => {
    const alternates =
      langs.length > 1
        ? {
            languages: {
              ...Object.fromEntries(langs.map((l) => [l, `${siteUrl}/${l}${path}`])),
              'x-default': `${siteUrl}/en${path}`,
            },
          }
        : undefined;
    langs.forEach((l) => {
      entries.push({
        url: `${siteUrl}/${l}${path}`,
        lastModified,
        changeFrequency,
        priority,
        ...(alternates && { alternates }),
      });
    });
  };

  guideEntries('/guides', GUIDES_INDEX_LANGS, 0.8, 'weekly');
  GUIDE_SLUGS.forEach((slug) => {
    guideEntries(`/guides/${slug}`, guideLangs(slug), 0.7, 'monthly');
  });

  return entries;
}

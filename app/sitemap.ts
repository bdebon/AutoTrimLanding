import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.autotrim.app';
  const lastModified = new Date();

  const locales = ['en', 'fr', 'es', 'zh'];
  const comparePages = ['timebolt', 'autocut', 'descript', 'final-cut-pro', 'premiere-pro'];
  // English-only guides (canonical lives on /en)
  const guidePages = [
    'how-to-remove-silence-final-cut-pro',
    'best-silence-remover-final-cut-pro',
    'timebolt-alternative-mac',
    'remove-filler-words-from-video',
    'descript-alternative-final-cut-pro',
  ];

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

  // English-only guides
  entries.push({
    url: `${siteUrl}/en/guides`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  });
  guidePages.forEach(page => {
    entries.push({
      url: `${siteUrl}/en/guides/${page}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return entries;
}

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const lastModified = new Date();

  const locales = ['en', 'fr', 'es', 'zh'];
  const comparePages = ['timebolt', 'autocut', 'descript'];

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

  return entries;
}

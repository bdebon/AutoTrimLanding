import { routing } from '@/i18n/routing';

/**
 * Builds canonical + hreflang alternates for a localized path.
 * `path` must start with a slash and exclude the locale prefix, e.g. "/compare/timebolt".
 */
export function localeAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `/${l}${path}`;
  }
  languages['x-default'] = `/en${path}`;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}

export type FaqItem = { q: string; a: string };

/** schema.org FAQPage node from a list of Q&A items. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/** schema.org Article node for a /compare page. */
export function compareArticleJsonLd(opts: {
  siteUrl: string;
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
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
        url: `${opts.siteUrl}/icon-512.png`,
      },
    },
    datePublished: opts.datePublished,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${opts.siteUrl}/en/compare/${opts.slug}`,
    },
  };
}

/** schema.org BreadcrumbList node. */
export function breadcrumbJsonLd(
  siteUrl: string,
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

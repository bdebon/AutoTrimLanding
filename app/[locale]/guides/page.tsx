import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { breadcrumbJsonLd } from '@/lib/seo';

const DESCRIPTION =
  'Practical guides for video editors: removing silences and filler words in Final Cut Pro, Premiere Pro and DaVinci Resolve, plus honest tool comparisons.';

export const metadata: Metadata = {
  title: 'Video Editing Guides – Silence Removal, Filler Words & Rough Cuts | AutoTrim',
  description: DESCRIPTION,
  alternates: {
    canonical: '/en/guides',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Editing Guides | AutoTrim',
    description: DESCRIPTION,
    images: ['/og/guides-en.png'],
  },
  openGraph: {
    images: [{ url: '/og/guides-en.png', width: 1200, height: 630, alt: 'AutoTrim video editing guides' }],
    title: 'Video Editing Guides – Silence Removal, Filler Words & Rough Cuts',
    description: DESCRIPTION,
    url: '/en/guides',
    siteName: 'AutoTrim',
    type: 'website',
    locale: 'en_US',
  },
};

const GUIDES = [
  {
    slug: 'how-to-remove-silence-final-cut-pro',
    title: 'How to Remove Silence in Final Cut Pro (Manual & Automatic)',
    description:
      'FCP has no built-in silence remover. The two workflows editors actually use — with real numbers on what each costs you.',
  },
  {
    slug: 'best-silence-remover-final-cut-pro',
    title: 'Best Silence Remover for Final Cut Pro (2026)',
    description:
      'An honest comparison of the real options: AutoTrim, TimeBolt, Recut, Descript — and the manual blade workflow.',
  },
  {
    slug: 'timebolt-alternative-mac',
    title: 'TimeBolt Alternative for Mac',
    description:
      'Why editors switch: parallel processing and one merged timeline instead of one XML per clip — plus what TimeBolt still does better.',
  },
  {
    slug: 'remove-filler-words-from-video',
    title: 'How to Remove Filler Words (Um, Uh) from Video Automatically',
    description:
      "Fillers aren't silences — removing them requires transcription. How it works, which tools do it, and how to keep cuts natural.",
  },
  {
    slug: 'descript-alternative-final-cut-pro',
    title: 'Descript Alternative for Final Cut Pro Users',
    description:
      'Get the cleanup without the cloud uploads, the subscription, or leaving your editor. Including when Descript is still the right pick.',
  },
];

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.autotrim.app';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AutoTrim Video Editing Guides',
      description: DESCRIPTION,
      url: `${siteUrl}/en/guides`,
      hasPart: GUIDES.map((g) => ({
        '@type': 'Article',
        headline: g.title,
        url: `${siteUrl}/en/guides/${g.slug}`,
      })),
    },
    breadcrumbJsonLd(siteUrl, [
      { name: 'AutoTrim', path: '/en' },
      { name: 'Guides', path: '/en/guides' },
    ]),
  ];

  return (
    <div className="min-h-screen bg-at-app">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-at-text mb-4">
            Video Editing Guides
          </h1>
          <p className="text-xl text-at-muted mb-12">
            Practical, no-fluff guides on silence removal, filler words and
            faster rough cuts — written by an editor who got tired of doing it
            by hand.
          </p>

          <div className="space-y-6">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/en/guides/${g.slug}`}
                className="block rounded-2xl border border-at-border p-6 hover:border-at-accent-soft-border hover:shadow-sm transition-all duration-200 group"
              >
                <h2 className="font-display text-2xl font-semibold text-at-text mb-2 group-hover:text-at-accent">
                  {g.title}
                </h2>
                <p className="text-at-muted mb-3">{g.description}</p>
                <span className="inline-flex items-center gap-1 text-at-accent font-medium">
                  Read the guide
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-at-border p-6">
            <h2 className="font-display text-xl font-semibold text-at-text mb-3">
              Tool comparisons
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li>
                <Link href={`/${locale}/compare/final-cut-pro`} className="text-at-accent hover:underline">
                  AutoTrim vs Final Cut Pro built-in tools
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/compare/premiere-pro`} className="text-at-accent hover:underline">
                  AutoTrim vs Premiere Pro built-in tools
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/compare/timebolt`} className="text-at-accent hover:underline">
                  AutoTrim vs TimeBolt
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/compare/autocut`} className="text-at-accent hover:underline">
                  AutoTrim vs AutoCut
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/compare/descript`} className="text-at-accent hover:underline">
                  AutoTrim vs Descript
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-at-accent hover:underline">
                  AutoTrim pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import {
  GuideShell,
  AnswerBox,
  H2,
  P,
  UL,
  DataTable,
  FaqBlock,
  CtaBox,
  RelatedLinks,
} from '@/components/guides/GuideShell';
import { faqJsonLd, breadcrumbJsonLd, type FaqItem } from '@/lib/seo';

const TITLE = 'TimeBolt Alternative for Mac: Why Editors Switch to AutoTrim';
const DESCRIPTION =
  'Looking for a TimeBolt alternative on Mac? AutoTrim processes all clips in parallel and exports one merged timeline instead of one XML per clip — with local AI and a $149 lifetime license. An honest side-by-side, including what TimeBolt still does better.';
const SLUG = 'timebolt-alternative-mac';
const UPDATED = 'July 8, 2026';

export const metadata: Metadata = {
  title: 'TimeBolt Alternative for Mac (2026) – AutoTrim, Honestly Compared',
  description: DESCRIPTION,
  keywords:
    'timebolt alternative, timebolt alternative mac, timebolt vs autotrim, silence remover mac, timebolt replacement, batch silence removal mac, jump cut software mac',
  alternates: {
    canonical: `/en/guides/${SLUG}`,
  },
  openGraph: {
    title: 'TimeBolt Alternative for Mac (2026) – AutoTrim, Honestly Compared',
    description: DESCRIPTION,
    url: `/en/guides/${SLUG}`,
    siteName: 'AutoTrim',
    type: 'article',
    locale: 'en_US',
    images: [
      {
        url: '/assets/img/hero-screenshot.jpg',
        width: 1200,
        height: 630,
        alt: 'AutoTrim as a TimeBolt alternative on Mac',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeBolt Alternative for Mac (2026)',
    description: DESCRIPTION,
    images: ['/assets/img/hero-screenshot.jpg'],
  },
};

const FAQ: FaqItem[] = [
  {
    q: 'What is the best TimeBolt alternative for Mac?',
    a: 'AutoTrim, for editors whose pain is multi-clip shoots: it processes all clips in parallel and exports one merged XML/FCPXML timeline, where TimeBolt processes one clip at a time and exports one XML per clip. It runs natively on macOS and Windows with a free version to test on your own footage.',
  },
  {
    q: 'Why do editors look for a TimeBolt alternative?',
    a: 'Three recurring reasons: the one-XML-per-clip output that must be reassembled by hand in the editor, sequential clip-by-clip processing that slows down multi-clip shoots, and a subscription requirement for the AI-powered features.',
  },
  {
    q: 'What does TimeBolt do that AutoTrim does not?',
    a: 'TimeBolt bundles extra automations like punch-in zooms, jump-cut styling and fast-forward effects. AutoTrim deliberately focuses on the rough cut — silence and filler-word removal, batch processing, one merged timeline — and leaves creative effects to your editor.',
  },
  {
    q: 'Can I try AutoTrim before paying?',
    a: 'Yes. The free version processes and previews unlimited clips with no time limit. A license is only needed to export the timeline: $15/month, $119/year, or $149 one-time lifetime (launch price, regular $279), with a 14-day money-back guarantee.',
  },
  {
    q: 'Does AutoTrim work with Final Cut Pro, Premiere and Resolve?',
    a: 'Yes — it exports FCPXML for Final Cut Pro and XML for Premiere Pro and DaVinci Resolve. For Final Cut Pro editors this matters twice: FCP has no native silence remover and no plugin marketplace, so standalone tools are the only automatic option.',
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
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
          url: `${siteUrl}/assets/img/logo-autotrim.svg`,
        },
      },
      datePublished: '2026-07-08',
      dateModified: '2026-07-08',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/en/guides/${SLUG}`,
      },
    },
    faqJsonLd(FAQ),
    breadcrumbJsonLd(siteUrl, [
      { name: 'AutoTrim', path: '/en' },
      { name: 'Guides', path: '/en/guides' },
      { name: TITLE, path: `/en/guides/${SLUG}` },
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
        title={TITLE}
        subtitle="TimeBolt earned its place as the veteran silence remover. But if your shoots involve more than one clip, its workflow shows its age — here's what switching actually gets you, and what you'd give up."
        updated={UPDATED}
      >
        <AnswerBox>
          <p>
            <strong>
              AutoTrim is the closest TimeBolt alternative for Mac
            </strong>{' '}
            — with the two workflow differences that make people switch: all
            clips are processed <strong>in parallel</strong> (not one at a
            time), and the output is <strong>one merged XML/FCPXML timeline</strong>{' '}
            (not one XML per clip to reassemble by hand). Processing is 100%
            local, and there&apos;s a $149 lifetime license instead of a
            subscription for AI features.
          </p>
        </AnswerBox>

        <H2 id="why-switch">The three reasons editors leave TimeBolt</H2>
        <UL
          items={[
            <>
              <strong>One XML per clip.</strong> On a six-rush shoot, TimeBolt
              hands you six timelines to merge manually in Final Cut or
              Premiere. The time you saved on cutting comes back as assembly
              work.
            </>,
            <>
              <strong>Sequential processing.</strong> Clips go through one at a
              time, so total wait grows linearly with every rush you shot.
              AutoTrim runs several clips simultaneously — around 1 minute for
              30 minutes of footage, roughly 48× faster than cutting manually.
            </>,
            <>
              <strong>Subscription for AI features.</strong> TimeBolt&apos;s
              AI-powered options require ongoing fees. AutoTrim&apos;s AI
              (transcription-based silence and filler-word detection) runs
              locally at no extra cost, and the Lifetime license is a one-time
              $149.
            </>,
          ]}
        />

        <H2 id="side-by-side">Side by side</H2>
        <DataTable
          headers={['', 'AutoTrim', 'TimeBolt']}
          rows={[
            ['Import', 'All clips at once (drag & drop)', 'One clip at a time'],
            ['Processing', 'Parallel, local AI', 'Sequential'],
            ['Output', 'One merged XML/FCPXML timeline', 'One XML per clip — manual merge'],
            ['Filler words (um, uh)', 'Local AI transcription (experimental)', 'AI features require subscription'],
            ['Extras (zooms, jump cuts)', 'None — by design, the edit stays in your NLE', 'Punch-in zoom, jump cuts, fast-forward'],
            ['Platforms', 'macOS & Windows', 'macOS & Windows'],
            ['Pricing', 'Free version · $15/mo · $119/yr · $149 lifetime', 'Paid license, subscription for AI features'],
          ]}
        />

        <H2 id="honest-part">Where TimeBolt is still the better pick</H2>
        <P>
          Honesty over conversion: if your work is{' '}
          <strong>single long recordings</strong> — webinars, sermons, lectures,
          screen casts — the per-clip workflow doesn&apos;t hurt you, and
          TimeBolt&apos;s punch-in zooms and jump-cut styling automate effects
          AutoTrim deliberately leaves to your editor. AutoTrim wins when the
          job is <strong>many clips per video</strong> and you want one clean
          timeline back; that&apos;s the use case it was built for.
        </P>

        <H2 id="switching">Switching takes one test shoot</H2>
        <P>
          There&apos;s nothing to migrate — no projects, no presets to convert.
          Download AutoTrim, drop in the rushes from your last shoot, preview
          the cuts, and compare the result with your TimeBolt workflow. The
          free version has no time limit; you only pay when you want to export
          the timeline.
        </P>

        <CtaBox
          locale={locale}
          title="Run it against your last TimeBolt project"
          subtext="Same footage, one merged timeline, no per-clip XML juggling."
        />

        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: `/${locale}/compare/timebolt`, label: 'AutoTrim vs TimeBolt — full comparison table' },
            { href: '/en/guides/best-silence-remover-final-cut-pro', label: 'Best Silence Remover for Final Cut Pro (2026)' },
            { href: '/en/guides/how-to-remove-silence-final-cut-pro', label: 'How to Remove Silence in Final Cut Pro' },
            { href: '/en/guides/remove-filler-words-from-video', label: 'How to Remove Filler Words from Video Automatically' },
            { href: `/${locale}/pricing`, label: 'AutoTrim pricing' },
          ]}
        />
      </GuideShell>
    </>
  );
}

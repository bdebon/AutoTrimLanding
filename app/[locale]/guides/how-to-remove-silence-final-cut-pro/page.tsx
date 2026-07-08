import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GuideShell,
  AnswerBox,
  H2,
  H3,
  P,
  UL,
  StepList,
  DataTable,
  FaqBlock,
  CtaBox,
  RelatedLinks,
} from '@/components/guides/GuideShell';
import { faqJsonLd, breadcrumbJsonLd, type FaqItem } from '@/lib/seo';

const TITLE = 'How to Remove Silence in Final Cut Pro (Manual & Automatic)';
const DESCRIPTION =
  'Final Cut Pro has no built-in silence remover. Here are the two ways FCP editors cut silences in 2026: the manual blade workflow (~48 min per 30 min of footage) and the automatic FCPXML workflow (~1 min).';
const SLUG = 'how-to-remove-silence-final-cut-pro';
const UPDATED = 'July 8, 2026';

export const metadata: Metadata = {
  title: 'How to Remove Silence in Final Cut Pro (2026) – Manual & Automatic',
  description: DESCRIPTION,
  keywords:
    'remove silence final cut pro, final cut pro silence removal, cut silences fcpx, delete pauses final cut, final cut pro remove dead air, fcpxml silence remover, final cut pro jump cuts',
  alternates: {
    canonical: `/en/guides/${SLUG}`,
  },
  openGraph: {
    title: 'How to Remove Silence in Final Cut Pro (2026) – Manual & Automatic',
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
        alt: 'AutoTrim removing silences from Final Cut Pro footage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Remove Silence in Final Cut Pro (2026)',
    description: DESCRIPTION,
    images: ['/assets/img/hero-screenshot.jpg'],
  },
};

const FAQ: FaqItem[] = [
  {
    q: 'Does Final Cut Pro have a built-in silence remover?',
    a: 'No. As of 2026, Final Cut Pro has no native feature that detects and removes silences, and no plugin marketplace to add one. You either cut silences manually with the blade tool or use a standalone app like AutoTrim that exports a cleaned FCPXML timeline back into FCP.',
  },
  {
    q: 'Can I batch-process multiple clips at once?',
    a: 'Not inside Final Cut Pro. With AutoTrim you can: drop all your clips in at once, they are processed in parallel, and you get back one merged FCPXML timeline with every clip already cleaned and in order.',
  },
  {
    q: 'Is my footage uploaded anywhere?',
    a: "No. AutoTrim's AI transcription and silence detection run entirely on your Mac. Nothing is uploaded, it works offline, and unreleased or client footage stays private.",
  },
  {
    q: 'How much does AutoTrim cost?',
    a: 'The free version processes and previews unlimited clips. Exporting the FCPXML requires a license: $15/month, $119/year, or $149 one-time for lifetime access (launch price, regular $279). There is a 14-day money-back guarantee.',
  },
  {
    q: 'What if I recorded audio and video separately?',
    a: 'Drop both into AutoTrim. Matching audio and video files are detected and synced automatically, and both come back aligned in the exported timeline.',
  },
  {
    q: 'Will automatic cutting ruin my pacing?',
    a: 'You stay in control. Silence threshold, minimum gap and pre/post-roll padding are adjustable (or use the YouTube, Podcast and Vlog presets), and you can preview every cut before exporting. The fine cut still happens in Final Cut Pro.',
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
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to remove silence in Final Cut Pro automatically',
      description:
        'Remove silences from all your clips before they reach Final Cut Pro, using AutoTrim to generate a cleaned FCPXML timeline.',
      totalTime: 'PT5M',
      tool: [{ '@type': 'HowToTool', name: 'AutoTrim (macOS app)' }],
      step: [
        {
          '@type': 'HowToStep',
          name: 'Drop your clips into AutoTrim',
          text: 'Drag and drop all your raw clips (and separate audio files, if any) into AutoTrim at once. Matching audio/video pairs are synced automatically.',
        },
        {
          '@type': 'HowToStep',
          name: 'Pick a preset or tune the detection',
          text: 'Choose the YouTube, Podcast or Vlog preset, or adjust silence threshold, minimum gap and pre/post-roll padding manually.',
        },
        {
          '@type': 'HowToStep',
          name: 'Let it process in parallel',
          text: 'AutoTrim transcribes and analyzes every clip locally, several clips at a time. Around 30 minutes of footage takes about 1 minute.',
        },
        {
          '@type': 'HowToStep',
          name: 'Preview the cuts',
          text: 'Scrub through the detected segments and preview exactly what will be kept and what will be removed before exporting.',
        },
        {
          '@type': 'HowToStep',
          name: 'Export the FCPXML and import it into Final Cut Pro',
          text: 'Export one merged FCPXML timeline and import it into your Final Cut Pro project. Every clip is already cut and assembled, ready for the fine cut.',
        },
      ],
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
        subtitle="Final Cut Pro still has no built-in silence remover in 2026. Here are the two workflows FCP editors actually use — with real numbers on what each one costs you."
        updated={UPDATED}
      >
        <AnswerBox>
          <p>
            <strong>Final Cut Pro cannot remove silences automatically.</strong>{' '}
            There is no native feature and no plugin marketplace to add one. FCP
            editors have two options: cut every silence manually with the blade
            tool (about 48 minutes of work for 30 minutes of talking-head
            footage), or process clips through a standalone tool like{' '}
            <Link href={`/${locale}`} className="text-primary-600 hover:underline">
              AutoTrim
            </Link>{' '}
            that detects silences with local AI and exports a cleaned FCPXML
            timeline back into Final Cut Pro in about 1 minute.
          </p>
        </AnswerBox>

        <H2 id="why-fcp-cant">Why Final Cut Pro can&apos;t do this natively</H2>
        <P>
          Adobe Premiere Pro has text-based editing that can delete pauses.
          DaVinci Resolve has built-in silence detection. Final Cut Pro has
          neither — and unlike Premiere or Resolve, it has no plugin ecosystem
          that could fill the gap. FCP supports effects plugins (FxPlug), but
          those can&apos;t analyze your footage and cut your timeline. That&apos;s why
          tools like AutoCut exist for Premiere and Resolve, but not for Final
          Cut Pro.
        </P>
        <P>
          The consequence: for years, the default answer to &quot;how do I remove
          silences in FCP?&quot; has been &quot;you don&apos;t — you cut them by hand.&quot; The
          workaround that actually works is doing the silence removal{' '}
          <em>before</em> the footage reaches Final Cut Pro, then importing the
          result as an FCPXML timeline.
        </P>

        <H2 id="manual-method">Method 1: cut silences manually (free, slow)</H2>
        <P>
          The traditional workflow, using nothing but Final Cut Pro itself:
        </P>
        <StepList
          steps={[
            {
              name: 'Expand the audio waveform',
              text: 'In the timeline, increase clip height so silences are visible as flat sections in the waveform.',
            },
            {
              name: 'Blade at each silence boundary',
              text: 'Play through the clip and cut (Cmd+B) at the start and end of every silent gap and every flubbed take.',
            },
            {
              name: 'Ripple-delete the silent segments',
              text: 'Select each silent segment and delete it so the timeline closes the gap automatically.',
            },
            {
              name: 'Repeat for every clip',
              text: 'Do the same pass on every rush in the shoot, then arrange all cleaned clips in order.',
            },
          ]}
        />
        <P>
          It works, and it costs nothing — except time. In a measured
          real-world case, this pass took about <strong>48 minutes for 30
          minutes of talking-head footage</strong>. If you publish weekly,
          that&apos;s hundreds of hours a year spent on cuts a machine can make.
        </P>

        <H2 id="automatic-method">
          Method 2: remove silences automatically with AutoTrim
        </H2>
        <P>
          AutoTrim is a Mac app (Windows too) built specifically for this
          workflow: it takes your raw clips, detects silences and hesitations
          using AI that runs entirely on your machine, and exports{' '}
          <strong>one merged FCPXML timeline</strong> — not one file per clip —
          that imports straight into Final Cut Pro.
        </P>
        <StepList
          steps={[
            {
              name: 'Drop your clips into AutoTrim',
              text: 'All of them at once — including separate audio files. Matching audio/video pairs are synced automatically.',
            },
            {
              name: 'Pick a preset or tune the detection',
              text: 'YouTube, Podcast and Vlog presets are one click. Or adjust silence threshold, minimum gap and pre/post-roll padding yourself.',
            },
            {
              name: 'Let it process in parallel',
              text: 'Clips are transcribed and analyzed locally, several at a time. About 30 minutes of footage takes around 1 minute.',
            },
            {
              name: 'Preview every cut',
              text: 'Check what will be kept and removed before committing to anything.',
            },
            {
              name: 'Export FCPXML and import into Final Cut Pro',
              text: 'One timeline, every clip already cut and assembled in order. You do the fine cut in FCP as usual.',
            },
          ]}
        />

        <H2 id="comparison">Manual vs automatic: the numbers</H2>
        <DataTable
          headers={['', 'Manual blade workflow', 'AutoTrim workflow']}
          rows={[
            ['Time for 30 min of footage', '~48 minutes', '~1 minute (48× faster)'],
            ['Multi-clip batches', 'One clip at a time', 'All clips in parallel'],
            ['Output', 'Cuts made directly in your project', 'One merged FCPXML timeline'],
            ['Filler words (um, uh)', 'Find and cut by ear', 'Detected via local AI transcription (experimental)'],
            ['Cost', 'Free (your time)', 'Free to try · $15/mo · $119/yr · $149 lifetime'],
            ['Privacy', 'Local', '100% local — nothing uploaded'],
          ]}
        />
        <P>
          At a typical freelance rate, 5 hours of rough-cut work per week is
          roughly 260 hours a year. That&apos;s the real cost of the manual method —
          not the $0 price tag.
        </P>

        <H2 id="tips">Tips for clean automatic cuts</H2>
        <UL
          items={[
            <>Start with a preset, then tighten the <strong>silence threshold</strong> if your room tone is loud.</>,
            <>Add 100–200 ms of <strong>pre/post-roll padding</strong> to keep breaths natural and avoid clipped words.</>,
            <>Raise the <strong>minimum silence length</strong> for podcasts so intentional pauses survive.</>,
            <>Filler-word removal is experimental — preview those cuts before exporting, especially outside English.</>,
            <>Keep your original files untouched: AutoTrim only generates a timeline, it never re-encodes or modifies your footage.</>,
          ]}
        />

        <CtaBox
          locale={locale}
          title="Stop cutting silences by hand in Final Cut Pro"
          subtext="Drop in your clips, preview the cuts, import one clean FCPXML timeline."
        />

        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: '/en/guides/best-silence-remover-final-cut-pro', label: 'Best Silence Remover for Final Cut Pro (2026)' },
            { href: '/en/guides/remove-filler-words-from-video', label: 'How to Remove Filler Words from Video Automatically' },
            { href: `/${locale}/compare/final-cut-pro`, label: 'AutoTrim vs Final Cut Pro built-in tools' },
            { href: `/${locale}/compare/timebolt`, label: 'AutoTrim vs TimeBolt' },
            { href: `/${locale}/pricing`, label: 'AutoTrim pricing' },
          ]}
        />
      </GuideShell>
    </>
  );
}

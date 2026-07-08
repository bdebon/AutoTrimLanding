import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GuideShell,
  AnswerBox,
  H2,
  P,
  UL,
  StepList,
  DataTable,
  FaqBlock,
  CtaBox,
  RelatedLinks,
} from '@/components/guides/GuideShell';
import { faqJsonLd, breadcrumbJsonLd, type FaqItem } from '@/lib/seo';

const TITLE = 'How to Remove Filler Words (Um, Uh) from Video Automatically';
const DESCRIPTION =
  'Filler words are found by transcribing your footage, not by analyzing volume. How automatic um/uh removal works in 2026, which tools do it (AutoTrim, Descript, Premiere Pro), and how to keep the cuts from sounding robotic.';
const SLUG = 'remove-filler-words-from-video';
const UPDATED = 'July 8, 2026';

export const metadata: Metadata = {
  title: 'How to Remove Filler Words (Um, Uh) from Video Automatically (2026)',
  description: DESCRIPTION,
  keywords:
    'remove filler words from video, remove um uh from video, cut filler words automatically, filler word remover, remove hesitations video editing, clean up talking head video',
  alternates: {
    canonical: `/en/guides/${SLUG}`,
  },
  openGraph: {
    title: 'How to Remove Filler Words (Um, Uh) from Video Automatically (2026)',
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
        alt: 'Automatic filler word removal from video',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove Filler Words from Video Automatically (2026)',
    description: DESCRIPTION,
    images: ['/assets/img/hero-screenshot.jpg'],
  },
};

const FAQ: FaqItem[] = [
  {
    q: 'How does automatic filler-word removal work?',
    a: 'The tool transcribes your footage with speech-to-text AI, locates words like "um", "uh" and hesitations in the transcript with their exact timestamps, and cuts those ranges from the timeline. Silence detection alone cannot do this — fillers are sounds, not gaps, so transcription is required.',
  },
  {
    q: 'Which tools can remove filler words automatically?',
    a: 'The main options in 2026: AutoTrim (local AI transcription, exports one merged timeline to Final Cut Pro, Premiere or Resolve), Descript (cloud editor with filler-word removal built into its transcript workflow), and Premiere Pro\'s text-based editing (inside Premiere, per sequence). Final Cut Pro has no native option.',
  },
  {
    q: 'Can I remove filler words without uploading my footage?',
    a: 'Yes — that is AutoTrim\'s approach: the transcription model runs entirely on your machine, so nothing is uploaded and it works offline. Cloud tools like Descript require uploading your footage to their servers first.',
  },
  {
    q: 'How accurate is automatic filler-word removal?',
    a: 'Good enough to save real time, not good enough to skip the preview. Accuracy depends on language, diction and audio quality. AutoTrim marks its filler-word removal as experimental — preview the cuts before exporting, especially for non-English footage.',
  },
  {
    q: 'Should I remove every single "um"?',
    a: 'Usually not. Removing all of them can make speech feel unnaturally dense. Many editors cut the obvious, drawn-out fillers and hesitations but keep some natural rhythm — with padding around cuts so breaths are not clipped.',
  },
  {
    q: 'Does this work for podcasts and audio-only files?',
    a: 'Yes. AutoTrim accepts audio files as well as video, and if you record audio and video separately it detects matching pairs and syncs them automatically before cutting.',
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
      name: 'How to remove filler words from video automatically',
      description:
        'Use local AI transcription to detect and cut filler words from your footage, then export a clean timeline to your editor.',
      totalTime: 'PT5M',
      tool: [{ '@type': 'HowToTool', name: 'AutoTrim (macOS / Windows app)' }],
      step: [
        {
          '@type': 'HowToStep',
          name: 'Drop your clips into AutoTrim',
          text: 'Add all video and audio files from the shoot at once. Matching audio/video pairs are synced automatically.',
        },
        {
          '@type': 'HowToStep',
          name: 'Enable filler-word removal',
          text: 'Turn on filler-word and hesitation detection alongside silence removal. The AI transcription runs locally on your machine.',
        },
        {
          '@type': 'HowToStep',
          name: 'Preview the detected cuts',
          text: 'Review what will be removed — filler-word detection is experimental and accuracy varies with language and diction.',
        },
        {
          '@type': 'HowToStep',
          name: 'Export one merged timeline',
          text: 'Export FCPXML for Final Cut Pro or XML for Premiere Pro / DaVinci Resolve, with all clips cleaned and assembled.',
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
        subtitle="Silence detection can't hear an 'um' — it's a sound, not a gap. Removing filler words automatically requires transcription. Here's how it works and which tools actually do it."
        updated={UPDATED}
      >
        <AnswerBox>
          <p>
            <strong>
              To remove filler words automatically, you need a tool that
              transcribes your footage
            </strong>{' '}
            — it finds &quot;um&quot;, &quot;uh&quot; and hesitations in the transcript with
            timestamps and cuts those ranges. In 2026 the main options are{' '}
            <Link href={`/${locale}`} className="text-primary-600 hover:underline">
              AutoTrim
            </Link>{' '}
            (local AI, exports to Final Cut Pro/Premiere/Resolve), Descript
            (cloud editor, subscription) and Premiere Pro&apos;s text-based editing
            (inside Premiere, per sequence). Final Cut Pro has no native
            option.
          </p>
        </AnswerBox>

        <H2 id="how-it-works">Why this needs transcription, not just silence detection</H2>
        <P>
          Classic silence removers watch the audio level: when the waveform
          goes flat, that&apos;s a cut. But a filler word isn&apos;t silent — &quot;um&quot; can be
          as loud as the rest of the sentence. The only reliable way to find
          fillers is to know what is being <em>said</em>: transcribe the audio,
          match filler patterns in the text, and map them back to precise
          timestamps. That&apos;s why this feature only appeared once speech-to-text
          models became fast and accurate enough to run on a normal computer.
        </P>

        <H2 id="tools">The tools that can do it (2026)</H2>
        <DataTable
          headers={['Tool', 'Where it runs', 'Output', 'Works with FCP?', 'Pricing model']}
          rows={[
            [
              <strong key="a">AutoTrim</strong>,
              'Locally on your machine',
              'One merged FCPXML/XML timeline',
              'Yes — native FCPXML export',
              'Free version · $15/mo · $119/yr · $149 lifetime',
            ],
            [
              <strong key="d">Descript</strong>,
              'Cloud (upload required)',
              'Edit inside Descript, export/round-trip',
              'Via export round-trips',
              'Subscription',
            ],
            [
              <strong key="p">Premiere Pro text-based editing</strong>,
              'Inside Premiere',
              'Cuts applied to one sequence at a time',
              'No — Premiere only',
              'Creative Cloud subscription',
            ],
            [
              <strong key="f">Final Cut Pro (native)</strong>,
              '—',
              'No transcription-based editing',
              '—',
              'No option',
            ],
          ]}
        />

        <H2 id="steps">The workflow with AutoTrim</H2>
        <StepList
          steps={[
            {
              name: 'Drop in every file from the shoot',
              text: 'Video and audio together — separately recorded pairs are detected and synced automatically.',
            },
            {
              name: 'Enable filler-word removal',
              text: 'It runs alongside silence detection. Transcription happens on your machine; nothing is uploaded.',
            },
            {
              name: 'Preview the cuts',
              text: 'Filler-word detection is experimental — check the cuts, especially on fast talkers and non-English footage.',
            },
            {
              name: 'Export one merged timeline',
              text: 'FCPXML for Final Cut Pro, XML for Premiere Pro or DaVinci Resolve. All clips cleaned, assembled, in order.',
            },
          ]}
        />

        <H2 id="tips">Keeping it natural</H2>
        <UL
          items={[
            <>Don&apos;t aim for zero fillers — speech with every &quot;um&quot; removed can sound clipped and robotic. Cut the long, obvious ones.</>,
            <>Keep 100–200 ms of padding around cuts so breaths and consonants aren&apos;t chopped.</>,
            <>Fix it at the source too: a slower speaking pace on set beats any amount of automatic cleanup.</>,
            <>Always preview before export — a false positive in the middle of a word is worse than a leftover &quot;uh&quot;.</>,
          ]}
        />

        <CtaBox
          locale={locale}
          title="Cut the ums from your next video"
          subtext="Local AI, no uploads, one clean timeline for FCP, Premiere or Resolve."
        />

        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: '/en/guides/how-to-remove-silence-final-cut-pro', label: 'How to Remove Silence in Final Cut Pro' },
            { href: '/en/guides/descript-alternative-final-cut-pro', label: 'Descript Alternative for Final Cut Pro Users' },
            { href: `/${locale}/compare/premiere-pro`, label: 'AutoTrim vs Premiere Pro built-in tools' },
            { href: `/${locale}/compare/descript`, label: 'AutoTrim vs Descript' },
            { href: `/${locale}/pricing`, label: 'AutoTrim pricing' },
          ]}
        />
      </GuideShell>
    </>
  );
}

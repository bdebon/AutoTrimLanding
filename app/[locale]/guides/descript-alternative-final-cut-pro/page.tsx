import type { Metadata } from 'next';
import Link from 'next/link';
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

const TITLE = 'Descript Alternative for Final Cut Pro Users';
const DESCRIPTION =
  "Descript's silence and filler-word cleanup is great — if you accept cloud uploads, a subscription, and leaving your editor. AutoTrim does the same cleanup locally and hands Final Cut Pro one merged FCPXML timeline. Honest comparison for FCP editors.";
const SLUG = 'descript-alternative-final-cut-pro';
const UPDATED = 'July 8, 2026';

export const metadata: Metadata = {
  title: 'Descript Alternative for Final Cut Pro Users (2026) – AutoTrim',
  description: DESCRIPTION,
  keywords:
    'descript alternative, descript alternative final cut pro, descript alternative mac, local descript alternative, descript without subscription, remove silence final cut pro',
  alternates: {
    canonical: `/en/guides/${SLUG}`,
  },
  openGraph: {
    title: 'Descript Alternative for Final Cut Pro Users (2026) – AutoTrim',
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
        alt: 'AutoTrim as a Descript alternative for Final Cut Pro editors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Descript Alternative for Final Cut Pro Users (2026)',
    description: DESCRIPTION,
    images: ['/assets/img/hero-screenshot.jpg'],
  },
};

const FAQ: FaqItem[] = [
  {
    q: 'What is the best Descript alternative for Final Cut Pro users?',
    a: 'AutoTrim — it covers the part of Descript most FCP editors actually use (automatic silence and filler-word removal) but runs 100% locally and exports a native FCPXML timeline, so you never leave Final Cut Pro and never upload footage.',
  },
  {
    q: 'Why leave Descript if it works?',
    a: 'The three reasons FCP editors cite: uploading every shoot to the cloud is slow with big files and a problem for client confidentiality; the subscription never ends; and Descript replaces your editor instead of feeding it — round-tripping projects back to Final Cut Pro adds friction on every video.',
  },
  {
    q: 'Does AutoTrim have text-based editing like Descript?',
    a: 'No. AutoTrim is not a document-style editor — it automates the rough cut (silences, filler words, hesitations) and exports a timeline. The creative edit happens in Final Cut Pro, Premiere Pro or DaVinci Resolve, which is exactly the point for editors who want to stay in their NLE.',
  },
  {
    q: 'Is AutoTrim cheaper than Descript?',
    a: 'Descript is subscription-only. AutoTrim has a free version (unlimited processing and previews), then $15/month, $119/year, or a one-time $149 lifetime license — pay once and stop. All paid plans have a 14-day money-back guarantee.',
  },
  {
    q: 'When is Descript still the better choice?',
    a: "If you want to edit by editing a text document, need built-in screen recording, remote-recording or publishing workflows, or you don't use a traditional NLE at all — Descript is a full production suite, and AutoTrim doesn't try to be one.",
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
        subtitle="Most FCP editors who try Descript want one feature: automatic silence and filler-word cleanup. They get it — bundled with cloud uploads, a subscription, and a whole new editor. There's a more surgical option."
        updated={UPDATED}
      >
        <AnswerBox>
          <p>
            <strong>
              For Final Cut Pro editors, the closest Descript alternative is
              AutoTrim
            </strong>
            : it removes silences and filler words from all your clips using AI
            that runs locally on your Mac, then exports{' '}
            <strong>one merged FCPXML timeline</strong> straight into FCP. No
            uploads, no subscription required ($149 lifetime option), no
            switching editors. Descript remains the better pick if you want
            text-document-style editing and an all-in-one production suite.
          </p>
        </AnswerBox>

        <H2 id="the-problem">The Descript round-trip, from an FCP seat</H2>
        <P>
          Descript&apos;s workflow assumes it <em>is</em> your editor. If you edit
          in Final Cut Pro, using Descript just for cleanup means: upload the
          shoot to Descript&apos;s cloud, wait, clean the transcript, export, bring
          the result back into FCP, and reconcile it with your project — every
          single video. With multi-gigabyte rushes, the upload alone can take
          longer than the cleanup. And if the footage is a client&apos;s unreleased
          product launch, &quot;it&apos;s on someone else&apos;s servers&quot; is a conversation
          you don&apos;t want to have.
        </P>

        <H2 id="side-by-side">Side by side for FCP editors</H2>
        <DataTable
          headers={['', 'AutoTrim', 'Descript']}
          rows={[
            ['What it is', 'A rough-cut tool that feeds your NLE', 'A full cloud editing suite'],
            ['Where footage is processed', '100% on your machine', "Descript's cloud (upload required)"],
            ['Final Cut Pro integration', 'Native FCPXML export, one merged timeline', 'Export round-trips'],
            ['Silence removal', 'Yes — batch, parallel, adjustable', 'Yes — inside its editor'],
            ['Filler words (um, uh)', 'Yes — local AI (experimental)', 'Yes'],
            ['Text-based editing', 'No — by design', 'Yes, its core workflow'],
            ['Works offline', 'Yes', 'Limited — cloud-first'],
            ['Pricing', 'Free version · $15/mo · $119/yr · $149 lifetime', 'Subscription only'],
          ]}
        />

        <H2 id="why-local">Why local processing matters for pros</H2>
        <UL
          items={[
            <><strong>Speed on real files.</strong> No upload step: gigabytes of rushes start processing the second you drop them. About 1 minute for 30 minutes of footage.</>,
            <><strong>Client confidentiality.</strong> Unreleased and NDA footage never leaves your machine — nothing to disclose, nothing to leak.</>,
            <><strong>Offline work.</strong> Planes, locations, bad hotel Wi-Fi: the AI runs on your hardware.</>,
            <><strong>No recurring dependency.</strong> With the $149 lifetime license, the tool keeps working whether or not you keep paying anyone.</>,
          ]}
        />

        <H2 id="honest-part">When Descript is still the right tool</H2>
        <P>
          If you don&apos;t come from an NLE at all — you record a podcast, want to
          edit it like a Google Doc, publish clips, and never touch a timeline
          — Descript is built for you, and AutoTrim isn&apos;t. AutoTrim is for
          editors who already live in Final Cut Pro (or Premiere, or Resolve)
          and want the tedious rough-cut pass automated without changing
          anything else about how they work.
        </P>

        <CtaBox
          locale={locale}
          title="Keep editing in Final Cut Pro"
          subtext="Drop in your rushes, get back one clean FCPXML — no uploads, no new editor to learn."
        />

        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: `/${locale}/compare/descript`, label: 'AutoTrim vs Descript — full comparison table' },
            { href: '/en/guides/how-to-remove-silence-final-cut-pro', label: 'How to Remove Silence in Final Cut Pro' },
            { href: '/en/guides/best-silence-remover-final-cut-pro', label: 'Best Silence Remover for Final Cut Pro (2026)' },
            { href: '/en/guides/remove-filler-words-from-video', label: 'How to Remove Filler Words from Video Automatically' },
            { href: `/${locale}/pricing`, label: 'AutoTrim pricing' },
          ]}
        />
      </GuideShell>
    </>
  );
}

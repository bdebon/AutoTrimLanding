import Link from 'next/link';
import {
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
import type { HowToGuide } from './types';

const MANUAL_STEPS = [
  {
    name: 'Expand the audio waveform',
    text: 'In the timeline, increase clip height so silences are visible as flat sections in the waveform.',
  },
  {
    name: 'Blade at each silence boundary',
    text: 'Play through the clip and cut (Cmd+B) at the start and end of every silent gap and every flubbed take.',
  },
  {
    name: 'Delete the silent segments',
    text: 'Select each silent segment and delete it. In the primary storyline, the magnetic timeline closes the gap for you.',
  },
  {
    name: 'Repeat for every clip',
    text: 'Do the same pass on every clip from the shoot, then arrange all the cleaned clips in order.',
  },
];

const AUTO_STEPS = [
  {
    name: 'Drop all your footage into AutoTrim',
    text: 'Every file from the shoot at once, audio-only files included. For a multicam shoot, AutoTrim finds the files that belong to the same take (several cameras, a separate audio recorder) and syncs them.',
  },
  {
    name: 'Choose what to remove',
    text: 'Silences, and hesitations ("ums") if you want them gone too: they are detected in about ten languages, including English and French. Adjust the silence threshold if you want more breathing room.',
  },
  {
    name: 'Preview before you export',
    text: 'Press play to hear your footage without the pauses, zoom in on a cut and listen to what was removed. Processing and previewing are free.',
  },
  {
    name: 'Export the FCPXML and import it into Final Cut Pro',
    text: 'One timeline, every clip already cut and assembled in order. Every cut stays adjustable: drag the edge of a clip to bring a breath back. You do the fine cut in Final Cut Pro as usual.',
  },
];

const FAQ = [
  {
    q: 'Does Final Cut Pro have a built-in silence remover?',
    a: 'No. As of 2026, Final Cut Pro has no native feature that detects and removes silences. A few third-party effects can detect silence inside Final Cut Pro. AutoTrim works before the edit instead: it takes the whole shoot at once, removes hesitations as well as silences, syncs multicam takes and exports one assembled FCPXML timeline, all on your machine. Otherwise, silences are cut by hand with the blade tool.',
  },
  {
    q: 'Can I process all the clips from a shoot at once?',
    a: 'Not natively in Final Cut Pro. With AutoTrim you can: drop all your footage in at once, the files are processed in parallel, and you get back one FCPXML timeline with every clip already cleaned and in order.',
  },
  {
    q: 'Can it remove "ums" too?',
    a: 'Yes. AutoTrim removes hesitations as well as silences, in about ten languages including English and French. You can listen to everything that was removed in the preview before exporting.',
  },
  {
    q: 'Is my footage uploaded anywhere?',
    a: 'No. AutoTrim runs entirely on your machine, on macOS or Windows. Nothing is uploaded, and after the initial model download it works offline, so unreleased or client footage stays private.',
  },
  {
    q: 'How much does AutoTrim cost?',
    a: 'It is free to try, with unlimited previews. Exporting the timeline needs a license: $15/month, $119/year, or $149 one-time for lifetime access. There is a 14-day money-back guarantee.',
  },
  {
    q: 'What if I filmed with several cameras or recorded audio separately?',
    a: 'Drop everything in. AutoTrim finds the files that belong to the same take (several cameras, a separate audio recorder), syncs them, and only cuts when nobody is speaking. The angles and mics come back synced in the exported timeline.',
  },
  {
    q: 'Will automatic cutting ruin my pacing?',
    a: 'You stay in control. You can adjust the silence threshold, listen to what was removed before exporting, and every cut stays adjustable in Final Cut Pro: drag the edge of a clip to bring a breath back.',
  },
];

function Body({ locale }: { locale: string }) {
  return (
    <>
      <AnswerBox>
        <p>
          <strong>Final Cut Pro has no native silence removal.</strong> You
          can cut every silence by hand with the blade tool, use one of the
          few third-party effects that can detect silence inside Final Cut
          Pro, or run your footage through a desktop app like{' '}
          <Link href={`/${locale}`} className="text-at-accent hover:underline">
            AutoTrim
          </Link>{' '}
          before the edit: it removes the silences and hesitations from the
          whole shoot at once, on your machine, and hands back one assembled
          FCPXML timeline for Final Cut Pro.
        </p>
      </AnswerBox>

      <H2 id="why-fcp-cant">Why Final Cut Pro can&apos;t do this natively</H2>
      <P>
        Adobe Premiere Pro has text-based editing that can delete pauses.
        DaVinci Resolve has built-in silence detection. Final Cut Pro has
        neither. Its plugins are FxPlug effects rather than workflow
        extensions, which is why tools like AutoCut exist for Premiere and
        Resolve but not for Final Cut Pro. A few third-party effects can
        detect silence inside Final Cut Pro.
      </P>
      <P>
        For years, the default answer to &quot;how do I remove silences in
        FCP?&quot; has been &quot;you cut them by hand.&quot; The other route
        is doing the silence removal <em>before</em> the footage reaches Final
        Cut Pro: AutoTrim takes the whole shoot at once, removes hesitations
        as well as silences, syncs multicam takes and hands back one assembled
        FCPXML timeline, all on your machine.
      </P>

      <H2 id="manual-method">Method 1: cut silences manually (free, slow)</H2>
      <P>The traditional workflow, using nothing but Final Cut Pro itself:</P>
      <StepList steps={MANUAL_STEPS} />
      <P>
        It works, and it costs nothing — except time. Across about 2,500 hours
        of footage processed by AutoTrim, the median share of silence is{' '}
        <strong>one third</strong>: on a typical talking-head shoot, roughly a
        third of the runtime is dead air you have to find and cut by hand,
        clip after clip. If you publish weekly, that pass comes back every
        week.
      </P>

      <H2 id="automatic-method">
        Method 2: remove silences automatically with AutoTrim
      </H2>
      <P>
        AutoTrim is a desktop app for macOS and Windows (not a plugin) built
        for exactly this workflow: you drop in all the footage from a shoot,
        it removes the silences and hesitations (&quot;ums&quot;) with AI that
        runs entirely on your machine, and hands back{' '}
        <strong>one assembled FCPXML timeline</strong> — not one file per clip
        — that opens straight in Final Cut Pro. It can also export a timeline
        for Premiere Pro or DaVinci Resolve.
      </P>
      <StepList steps={AUTO_STEPS} />

      <H2 id="comparison">Manual vs automatic, side by side</H2>
      <DataTable
        headers={['', 'Manual blade workflow', 'AutoTrim workflow']}
        rows={[
          ['What gets cut', 'Every silence, found by eye and ear', 'Silences and hesitations, detected on your machine'],
          ['Multi-clip shoots', 'One clip at a time, then assemble', 'All the footage at once, one assembled timeline'],
          ['Multicam', 'Sync angles and audio yourself', 'Files of one take found and synced; cuts only when nobody speaks'],
          ['Hesitations (um, uh)', 'Find and cut by ear', 'Detected in about ten languages, including English and French'],
          ['Control', 'Total', 'Preview before export; every cut stays adjustable in FCP'],
          ['Cost', 'Free (your time)', 'Free to try · $15/mo · $119/yr · $149 lifetime'],
          ['Privacy', 'Local', 'Local — nothing uploaded'],
        ]}
      />
      <P>
        How much time that saves depends on how much you shoot. James, a Final
        Cut editor, puts it at &quot;at least one to two hours on a typical
        project.&quot;
      </P>

      <H2 id="tips">Tips for clean automatic cuts</H2>
      <UL
        items={[
          <>Start with the default settings, then adjust the <strong>silence threshold</strong> if your room tone is loud.</>,
          <>Keep a little <strong>room around each sentence</strong> so breaths stay natural and words never get clipped.</>,
          <>For a podcast with one mic per person, drop in every track: AutoTrim only cuts when nobody is speaking, so one guest&apos;s pause never clips another guest&apos;s answer.</>,
          <>Listen to the removed hesitations in the preview before exporting, especially if you switch between languages.</>,
          <>Your original files stay untouched: the FCPXML points to your media, nothing is re-encoded or modified.</>,
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
    </>
  );
}

const content: HowToGuide = {
  lang: 'en',
  title: 'How to Remove Silence in Final Cut Pro (Manual & Automatic)',
  metaTitle: 'How to Remove Silence in Final Cut Pro (2026) – Manual & Automatic',
  socialTitle: 'How to Remove Silence in Final Cut Pro (2026)',
  description:
    'Final Cut Pro has no built-in silence remover. The two ways FCP editors cut silences in 2026: by hand with the blade tool, or automatically with a desktop app that hands back one clean FCPXML timeline.',
  keywords:
    'remove silence final cut pro, final cut pro silence removal, cut silences fcpx, delete pauses final cut, final cut pro remove dead air, remove ums final cut pro, fcpxml silence remover, final cut pro jump cuts',
  ogAlt: 'AutoTrim removing silences from Final Cut Pro footage',
  subtitle:
    'Final Cut Pro still has no built-in silence remover in 2026. Here are the two workflows FCP editors actually use, and what each one costs you.',
  updated: 'October 22, 2026',
  datePublished: '2026-07-08',
  dateModified: '2026-10-22',
  faq: FAQ,
  howTo: {
    name: 'How to remove silence in Final Cut Pro automatically',
    description:
      'Remove silences and hesitations from all your footage before it reaches Final Cut Pro, using AutoTrim to generate one assembled FCPXML timeline.',
    tool: 'AutoTrim (desktop app for macOS and Windows)',
    steps: AUTO_STEPS,
  },
  Body,
};

export default content;

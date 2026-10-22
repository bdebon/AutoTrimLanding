import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { breadcrumbJsonLd } from '@/lib/seo';
import {
  GUIDE_SLUGS,
  GUIDES_LABEL,
  OG_LOCALE,
  guideHref,
  guideIsEnglishOnlyFor,
  guidesIndexAlternates,
  guidesIndexLang,
  type GuideLang,
  type GuideSlug,
} from '@/lib/guides';

type IndexCopy = {
  metaTitle: string;
  socialTitle: string;
  description: string;
  ogAlt: string;
  collectionName: string;
  h1: string;
  intro: string;
  readGuide: string;
  /** Badge on guides that only exist in English. */
  englishOnly: string;
  guides: Record<GuideSlug, { title: string; description: string }>;
  comparisonsTitle: string;
  comparisons: {
    finalCut: string;
    premiere: string;
    timebolt: string;
    autocut: string;
    descript: string;
    pricing: string;
  };
};

const COPY: Record<GuideLang, IndexCopy> = {
  en: {
    metaTitle: 'Video Editing Guides – Silence Removal, Filler Words & Rough Cuts | AutoTrim',
    socialTitle: 'Video Editing Guides | AutoTrim',
    description:
      'Practical guides for video editors: removing silences and filler words in Final Cut Pro, Premiere Pro and DaVinci Resolve, plus honest tool comparisons.',
    ogAlt: 'AutoTrim video editing guides',
    collectionName: 'AutoTrim Video Editing Guides',
    h1: 'Video Editing Guides',
    intro:
      'Practical, no-fluff guides on silence removal, filler words and faster rough cuts — written by an editor who got tired of doing it by hand.',
    readGuide: 'Read the guide',
    englishOnly: '',
    guides: {
      'how-to-remove-silence-final-cut-pro': {
        title: 'How to Remove Silence in Final Cut Pro (Manual & Automatic)',
        description:
          'FCP has no built-in silence remover. The two workflows editors actually use, and what each one costs you.',
      },
      'best-silence-remover-final-cut-pro': {
        title: 'Best Silence Remover for Final Cut Pro (2026)',
        description:
          'An honest comparison of the real options: AutoTrim, TimeBolt, Recut, Descript — and the manual blade workflow.',
      },
      'timebolt-alternative-mac': {
        title: 'TimeBolt Alternative for Mac',
        description:
          'Why editors switch: parallel processing and one merged timeline instead of one XML per clip — plus what TimeBolt still does better.',
      },
      'remove-filler-words-from-video': {
        title: 'How to Remove Filler Words (Um, Uh) from Video Automatically',
        description:
          "Fillers aren't silences — removing them requires transcription. How it works, which tools do it, and how to keep cuts natural.",
      },
      'descript-alternative-final-cut-pro': {
        title: 'Descript Alternative for Final Cut Pro Users',
        description:
          'Get the cleanup without the cloud uploads, the subscription, or leaving your editor. Including when Descript is still the right pick.',
      },
    },
    comparisonsTitle: 'Tool comparisons',
    comparisons: {
      finalCut: 'AutoTrim vs Final Cut Pro built-in tools',
      premiere: 'AutoTrim vs Premiere Pro built-in tools',
      timebolt: 'AutoTrim vs TimeBolt',
      autocut: 'AutoTrim vs AutoCut',
      descript: 'AutoTrim vs Descript',
      pricing: 'AutoTrim pricing',
    },
  },
  fr: {
    metaTitle: 'Guides de montage vidéo : silences, hésitations et dérush | AutoTrim',
    socialTitle: 'Guides de montage vidéo | AutoTrim',
    description:
      'Guides pratiques pour monteurs : supprimer les silences et les hésitations dans Final Cut Pro, Premiere Pro et DaVinci Resolve, et comparatifs d’outils honnêtes.',
    ogAlt: 'Les guides de montage vidéo d’AutoTrim',
    collectionName: 'Guides de montage vidéo AutoTrim',
    h1: 'Guides de montage vidéo',
    intro:
      'Des guides pratiques, sans blabla, sur la suppression des silences, les hésitations et le dérush, écrits par un monteur qui en avait assez de tout couper à la main.',
    readGuide: 'Lire le guide',
    englishOnly: 'En anglais',
    guides: {
      'how-to-remove-silence-final-cut-pro': {
        title: 'Comment supprimer les silences dans Final Cut Pro (à la main ou automatiquement)',
        description:
          'FCP ne sait pas supprimer les silences tout seul. Les deux méthodes qu’utilisent vraiment les monteurs, et ce que chacune vous coûte.',
      },
      'best-silence-remover-final-cut-pro': {
        title: 'Le meilleur logiciel pour couper les silences dans Final Cut Pro (2026)',
        description:
          'Comparatif honnête des vraies options : AutoTrim, TimeBolt, Recut, Descript, et la coupe à la main avec l’outil Lame.',
      },
      'timebolt-alternative-mac': {
        title: 'Alternative à TimeBolt sur Mac',
        description:
          'Pourquoi des monteurs changent : une seule timeline au lieu d’un XML par clip, et ce que TimeBolt fait encore mieux.',
      },
      'remove-filler-words-from-video': {
        title: 'Supprimer automatiquement les mots de remplissage (euh, hum) d’une vidéo',
        description:
          'Les « euh » ne sont pas des silences : il faut une transcription pour les retirer. Comment ça marche, quels outils le font, et comment garder des coupes naturelles.',
      },
      'descript-alternative-final-cut-pro': {
        title: 'Alternative à Descript pour les monteurs Final Cut Pro',
        description:
          'Le nettoyage sans upload dans le cloud et sans quitter votre logiciel de montage. Et les cas où Descript reste le bon choix.',
      },
    },
    comparisonsTitle: 'Comparatifs d’outils',
    comparisons: {
      finalCut: 'AutoTrim vs les outils intégrés de Final Cut Pro',
      premiere: 'AutoTrim vs les outils intégrés de Premiere Pro',
      timebolt: 'AutoTrim vs TimeBolt',
      autocut: 'AutoTrim vs AutoCut',
      descript: 'AutoTrim vs Descript',
      pricing: 'Les tarifs d’AutoTrim',
    },
  },
  es: {
    metaTitle: 'Guías de edición de video: silencios, muletillas y primer corte | AutoTrim',
    socialTitle: 'Guías de edición de video | AutoTrim',
    description:
      'Guías prácticas para editores: cómo eliminar silencios y muletillas en Final Cut Pro, Premiere Pro y DaVinci Resolve, y comparaciones honestas de herramientas.',
    ogAlt: 'Las guías de edición de video de AutoTrim',
    collectionName: 'Guías de edición de video de AutoTrim',
    h1: 'Guías de edición de video',
    intro:
      'Guías prácticas y sin relleno para eliminar silencios y muletillas y llegar antes al primer corte, escritas por un editor cansado de hacerlo a mano.',
    readGuide: 'Leer la guía',
    englishOnly: 'En inglés',
    guides: {
      'how-to-remove-silence-final-cut-pro': {
        title: 'Cómo eliminar silencios en Final Cut Pro (a mano o automáticamente)',
        description:
          'FCP no puede eliminar silencios por sí solo. Los dos métodos que de verdad usan los editores, y lo que te cuesta cada uno.',
      },
      'best-silence-remover-final-cut-pro': {
        title: 'El mejor programa para eliminar silencios en Final Cut Pro (2026)',
        description:
          'Comparación honesta de las opciones reales: AutoTrim, TimeBolt, Recut, Descript y el corte a mano con la Cuchilla.',
      },
      'timebolt-alternative-mac': {
        title: 'Alternativa a TimeBolt para Mac',
        description:
          'Por qué hay editores que cambian: una sola línea de tiempo en vez de un XML por clip, y lo que TimeBolt todavía hace mejor.',
      },
      'remove-filler-words-from-video': {
        title: 'Cómo quitar muletillas («eh», «em») de un video automáticamente',
        description:
          'Las muletillas no son silencios: para quitarlas hace falta una transcripción. Cómo funciona, qué herramientas lo hacen y cómo mantener cortes naturales.',
      },
      'descript-alternative-final-cut-pro': {
        title: 'Alternativa a Descript para usuarios de Final Cut Pro',
        description:
          'La limpieza sin subir nada a la nube ni salir de tu editor. Y cuándo Descript sigue siendo la mejor opción.',
      },
    },
    comparisonsTitle: 'Comparaciones de herramientas',
    comparisons: {
      finalCut: 'AutoTrim vs las herramientas de Final Cut Pro',
      premiere: 'AutoTrim vs las herramientas de Premiere Pro',
      timebolt: 'AutoTrim vs TimeBolt',
      autocut: 'AutoTrim vs AutoCut',
      descript: 'AutoTrim vs Descript',
      pricing: 'Precios de AutoTrim',
    },
  },
};

const OG_IMAGE = '/og/guides-en.png';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = guidesIndexLang(locale);
  const c = COPY[lang];
  const alternates = guidesIndexAlternates(locale);

  return {
    title: c.metaTitle,
    description: c.description,
    alternates,
    twitter: {
      card: 'summary_large_image',
      title: c.socialTitle,
      description: c.description,
      images: [OG_IMAGE],
    },
    openGraph: {
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: c.ogAlt }],
      title: c.metaTitle.replace(/ \| AutoTrim$/, ''),
      description: c.description,
      url: alternates.canonical,
      siteName: 'AutoTrim',
      type: 'website',
      locale: OG_LOCALE[lang],
    },
  };
}

export default async function GuidesIndexPage({ params }: Props) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.autotrim.app';
  const lang = guidesIndexLang(locale);
  const c = COPY[lang];

  // Keyed on the index language: /zh shows the English index, without badges.
  const badge = (slug: GuideSlug) =>
    guideIsEnglishOnlyFor(lang, slug) ? c.englishOnly : null;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: c.collectionName,
      description: c.description,
      inLanguage: lang,
      url: `${siteUrl}/${lang}/guides`,
      hasPart: GUIDE_SLUGS.map((slug) => ({
        '@type': 'Article',
        headline: c.guides[slug].title,
        url: `${siteUrl}${guideHref(lang, slug)}`,
      })),
    },
    breadcrumbJsonLd(siteUrl, [
      { name: 'AutoTrim', path: `/${lang}` },
      { name: GUIDES_LABEL[lang], path: `/${lang}/guides` },
    ]),
  ];

  const comparisons = [
    { href: `/${locale}/compare/final-cut-pro`, label: c.comparisons.finalCut },
    { href: `/${locale}/compare/premiere-pro`, label: c.comparisons.premiere },
    { href: `/${locale}/compare/timebolt`, label: c.comparisons.timebolt },
    { href: `/${locale}/compare/autocut`, label: c.comparisons.autocut },
    { href: `/${locale}/compare/descript`, label: c.comparisons.descript },
    { href: `/${locale}/pricing`, label: c.comparisons.pricing },
  ];

  return (
    <div className="min-h-screen bg-at-app">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div lang={lang} className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-at-text mb-4">
            {c.h1}
          </h1>
          <p className="text-xl text-at-muted mb-12">{c.intro}</p>

          <div className="space-y-6">
            {GUIDE_SLUGS.map((slug) => {
              const g = c.guides[slug];
              const englishOnly = badge(slug);
              return (
                <Link
                  key={slug}
                  href={guideHref(lang, slug)}
                  hrefLang={englishOnly ? 'en' : undefined}
                  className="block rounded-2xl border border-at-border p-6 hover:border-at-accent-soft-border hover:shadow-sm transition-all duration-200 group"
                >
                  <h2 className="font-display text-2xl font-semibold text-at-text mb-2 group-hover:text-at-accent">
                    {g.title}
                    {englishOnly && (
                      <span className="ml-3 inline-block align-middle rounded-full border border-at-border px-2.5 py-0.5 font-ui text-xs font-medium text-at-dim">
                        {englishOnly}
                      </span>
                    )}
                  </h2>
                  <p className="text-at-muted mb-3">{g.description}</p>
                  <span className="inline-flex items-center gap-1 text-at-accent font-medium">
                    {c.readGuide}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-14 rounded-2xl border border-at-border p-6">
            <h2 className="font-display text-xl font-semibold text-at-text mb-3">
              {c.comparisonsTitle}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparisons.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-at-accent hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

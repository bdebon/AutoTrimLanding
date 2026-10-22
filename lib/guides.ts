/**
 * Which language each guide exists in, and the URLs that follow from it.
 *
 * Slugs stay English in every language (same pattern as /compare). A guide
 * missing from GUIDE_LANGS exists in English only: on /fr, /es or /zh it
 * renders the English text and canonicalizes to /en. /zh always gets the
 * English guides.
 */

export type GuideLang = 'en' | 'fr' | 'es';

export const GUIDE_SLUGS = [
  'how-to-remove-silence-final-cut-pro',
  'best-silence-remover-final-cut-pro',
  'timebolt-alternative-mac',
  'remove-filler-words-from-video',
  'descript-alternative-final-cut-pro',
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

const GUIDE_LANGS: Partial<Record<GuideSlug, readonly GuideLang[]>> = {
  'how-to-remove-silence-final-cut-pro': ['en', 'fr', 'es'],
  'best-silence-remover-final-cut-pro': ['en', 'fr', 'es'],
};

/** Languages the guides index (/guides) is written in. */
export const GUIDES_INDEX_LANGS: readonly GuideLang[] = ['en', 'fr', 'es'];

/** The section's name in each language (breadcrumbs, JSON-LD). */
export const GUIDES_LABEL: Record<GuideLang, string> = {
  en: 'Guides',
  fr: 'Guides',
  es: 'Guías',
};

export const OG_LOCALE: Record<GuideLang, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
};

export function guideLangs(slug: GuideSlug): readonly GuideLang[] {
  return GUIDE_LANGS[slug] ?? ['en'];
}

function pick(locale: string, langs: readonly GuideLang[]): GuideLang {
  return (langs as readonly string[]).includes(locale) ? (locale as GuideLang) : 'en';
}

/** Language a reader of `locale` gets this guide in. */
export function guideLang(locale: string, slug: GuideSlug): GuideLang {
  return pick(locale, guideLangs(slug));
}

/** True when the guide is not available in the reader's language. */
export function guideIsEnglishOnlyFor(locale: string, slug: GuideSlug): boolean {
  return locale !== 'en' && guideLang(locale, slug) === 'en';
}

export function guidesIndexLang(locale: string): GuideLang {
  return pick(locale, GUIDES_INDEX_LANGS);
}

/** Link target for a reader of `locale`: their language when it exists, English otherwise. */
export function guideHref(locale: string, slug: GuideSlug): string {
  return `/${guideLang(locale, slug)}/guides/${slug}`;
}

export function guidesIndexHref(locale: string): string {
  return `/${guidesIndexLang(locale)}/guides`;
}

function alternatesFor(locale: string, langs: readonly GuideLang[], path: string) {
  const lang = pick(locale, langs);
  // A locale without its own version canonicalizes to the English page.
  if (lang !== locale || langs.length < 2) {
    return { canonical: `/${lang}${path}` };
  }
  const languages: Record<string, string> = {};
  for (const l of langs) languages[l] = `/${l}${path}`;
  languages['x-default'] = `/en${path}`;
  return { canonical: `/${lang}${path}`, languages };
}

/** canonical + hreflang (each version, plus x-default English) for a guide. */
export function guideAlternates(locale: string, slug: GuideSlug) {
  return alternatesFor(locale, guideLangs(slug), `/guides/${slug}`);
}

export function guidesIndexAlternates(locale: string) {
  return alternatesFor(locale, GUIDES_INDEX_LANGS, '/guides');
}

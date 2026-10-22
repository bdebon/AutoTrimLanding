import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { FaqItem } from '@/lib/seo';
import { guideHref, type GuideSlug } from '@/lib/guides';

const COMPARE_SLUGS: { slug: string; footerKey: string }[] = [
  { slug: 'final-cut-pro', footerKey: 'finalCut' },
  { slug: 'premiere-pro', footerKey: 'premierePro' },
  { slug: 'timebolt', footerKey: 'timebolt' },
  { slug: 'autocut', footerKey: 'autocut' },
  { slug: 'descript', footerKey: 'descript' },
];

// Each guide in the reader's language when it exists, English otherwise
// (the footer labels flag the English-only ones)
const GUIDE_LINKS: { slug: GuideSlug; footerKey: string }[] = [
  { slug: 'how-to-remove-silence-final-cut-pro', footerKey: 'removeSilenceFcp' },
  { slug: 'best-silence-remover-final-cut-pro', footerKey: 'bestSilenceRemoverFcp' },
  { slug: 'remove-filler-words-from-video', footerKey: 'fillerWords' },
];

/**
 * Server-rendered extra sections for the /compare pages:
 * "at a glance" fact table, what editors say, FAQ (paired with FAQPage
 * JSON-LD emitted by the page) and internal links. Fully static HTML so AI
 * crawlers that don't execute JavaScript can read every claim.
 */
export default async function CompareExtras({
  locale,
  slug,
  faqItems,
}: {
  locale: string;
  slug: string;
  faqItems: FaqItem[];
}) {
  const t = await getTranslations({ locale });

  const factKeys = [
    'whatItIs',
    'removes',
    'worksWith',
    'input',
    'multicam',
    'processing',
    'output',
    'preview',
    'proof',
    'price',
    'guarantee',
  ] as const;
  const testimonials = t.raw('compareShared.testimonials.items') as string[];

  const relatedCompare = COMPARE_SLUGS.filter((c) => c.slug !== slug);

  return (
    <section className="bg-at-app py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* At a glance — consistent fact block across all compare pages */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-at-text mb-2">
            {t('compareShared.atGlance.title')}
          </h2>
          <p className="text-sm text-at-dim mb-6">{t('compareShared.updated')}</p>
          <div className="rounded-2xl border border-at-border overflow-hidden">
            <table className="w-full text-left">
              <tbody>
                {factKeys.map((key, i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-at-panel' : 'bg-at-card'}>
                    <th
                      scope="row"
                      className="p-4 align-top text-sm font-semibold text-at-muted w-1/3"
                    >
                      {t(`compareShared.atGlance.rows.${key}.label`)}
                    </th>
                    <td className="p-4 text-sm text-at-muted">
                      {t(`compareShared.atGlance.rows.${key}.value`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* What editors say */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-at-text mb-6">
            {t('compareShared.testimonials.title')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((quote, i) => (
              <li
                key={i}
                className="rounded-2xl border border-at-border bg-at-panel p-5 text-at-muted leading-relaxed"
              >
                {quote}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-at-text mb-6">
            {t('compareShared.faqTitle')}
          </h2>
          <div className="divide-y divide-at-border">
            {faqItems.map((item, i) => (
              <div key={i} className="py-6">
                <h3 className="font-display text-lg font-semibold text-at-text mb-2">{item.q}</h3>
                <p className="text-at-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div>
          <h2 className="font-display text-2xl font-bold text-at-text mb-6">
            {t('compareShared.relatedTitle')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GUIDE_LINKS.map((g) => (
              <li key={g.slug}>
                <Link
                  href={guideHref(locale, g.slug)}
                  className="text-at-accent hover:text-at-accent hover:underline"
                >
                  {t(`footer.guides.${g.footerKey}`)}
                </Link>
              </li>
            ))}
            {relatedCompare.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${locale}/compare/${c.slug}`}
                  className="text-at-accent hover:text-at-accent hover:underline"
                >
                  {t(`footer.comparisons.${c.footerKey}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${locale}/pricing`}
                className="text-at-accent hover:text-at-accent hover:underline"
              >
                {t('footer.resources.pricing')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

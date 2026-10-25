import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Check } from 'lucide-react';
import type { FaqItem } from '@/lib/seo';
import { guidesIndexHref, GUIDES_LABEL, type GuideLang } from '@/lib/guides';

/**
 * Shared shell + typographic building blocks for the /guides section.
 * Everything is server-rendered static HTML so search and AI crawlers get
 * the full content without executing JavaScript.
 *
 * `locale` is the URL locale (header, footer, internal links); `lang` is the
 * language the guide text is written in, which differs when a guide only
 * exists in English (e.g. every guide on /zh).
 */

const UI: Record<
  GuideLang,
  {
    breadcrumb: string;
    by: string;
    role: string;
    updated: string;
    quickAnswer: string;
    faq: string;
    cta: string;
    ctaNote: string;
    keepReading: string;
  }
> = {
  en: {
    breadcrumb: 'Breadcrumb',
    by: 'By',
    role: 'YouTuber & developer of AutoTrim',
    updated: 'Last updated:',
    quickAnswer: 'Quick answer',
    faq: 'Frequently asked questions',
    cta: 'Try AutoTrim Free',
    ctaNote: 'Free version with unlimited previews — pay only when you export.',
    keepReading: 'Keep reading',
  },
  fr: {
    breadcrumb: "Fil d'Ariane",
    by: 'Par',
    role: "YouTuber et développeur d'AutoTrim",
    updated: 'Dernière mise à jour :',
    quickAnswer: 'En bref',
    faq: 'Questions fréquentes',
    cta: 'Essayer AutoTrim gratuitement',
    ctaNote: "Version gratuite avec previews illimitées : vous ne payez que pour exporter.",
    keepReading: 'À lire aussi',
  },
  es: {
    breadcrumb: 'Ruta de navegación',
    by: 'Por',
    role: 'YouTuber y desarrollador de AutoTrim',
    updated: 'Última actualización:',
    quickAnswer: 'Respuesta rápida',
    faq: 'Preguntas frecuentes',
    cta: 'Prueba AutoTrim gratis',
    ctaNote: 'Versión gratuita con vistas previas ilimitadas: solo pagas para exportar.',
    keepReading: 'Sigue leyendo',
  },
};

export function GuideShell({
  locale,
  lang = 'en',
  title,
  subtitle,
  updated,
  children,
}: {
  locale: string;
  lang?: GuideLang;
  title: string;
  subtitle: string;
  updated: string;
  children: React.ReactNode;
}) {
  const ui = UI[lang];
  return (
    <div className="min-h-screen bg-at-app">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <article lang={lang} className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label={ui.breadcrumb} className="mb-6 text-sm text-at-dim">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={`/${locale}`} className="hover:text-at-accent">
                  AutoTrim
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={guidesIndexHref(locale)} className="hover:text-at-accent">
                  {GUIDES_LABEL[lang]}
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-at-text mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-at-muted mb-4">{subtitle}</p>
          <p className="text-sm text-at-dim mb-10">
            {ui.by}{' '}
            <a
              href="https://www.youtube.com/@BenjaminCode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-at-accent hover:underline"
            >
              Benjamin Code
            </a>
            , {ui.role} · {ui.updated} {updated}
          </p>

          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}

/** Featured-snippet style direct answer, placed right under the intro. */
export function AnswerBox({
  lang = 'en',
  children,
}: {
  lang?: GuideLang;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-at-accent-surface border border-at-accent-soft-border rounded-2xl p-6 mb-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-at-accent mb-2">
        {UI[lang].quickAnswer}
      </p>
      <div className="text-at-text leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-3xl font-bold text-at-text mt-12 mb-4">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-xl font-semibold text-at-text mt-8 mb-3">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-at-muted leading-relaxed mb-5">{children}</p>;
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-6 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-at-muted leading-relaxed">
          <Check className="h-5 w-5 text-at-accent flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered step list (pairs with HowTo JSON-LD). */
export function StepList({
  steps,
}: {
  steps: { name: string; text: React.ReactNode }[];
}) {
  return (
    <ol className="mb-6 space-y-6">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-at-accent text-at-on-accent font-semibold flex items-center justify-center text-sm">
            {i + 1}
          </span>
          <div>
            <p className="font-semibold text-at-text mb-1">{step.name}</p>
            <p className="text-at-muted leading-relaxed">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Simple data table — extraction-friendly for search engines and LLMs. */
export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto mb-8 rounded-2xl border border-at-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-at-panel border-b border-at-border">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-4 font-semibold text-at-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-at-border">
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-at-panel/50' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="p-4 text-at-muted align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FaqBlock({ items, lang = 'en' }: { items: FaqItem[]; lang?: GuideLang }) {
  return (
    <div className="mt-4 mb-10">
      <H2 id="faq">{UI[lang].faq}</H2>
      <div className="divide-y divide-at-border">
        {items.map((item, i) => (
          <div key={i} className="py-6">
            <h3 className="font-display text-lg font-semibold text-at-text mb-2">{item.q}</h3>
            <p className="text-at-muted leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CtaBox({
  locale,
  lang = 'en',
  title,
  subtext,
}: {
  locale: string;
  lang?: GuideLang;
  title: string;
  subtext: string;
}) {
  return (
    <div className="bg-at-accent-surface border border-at-accent-soft-border rounded-card-lg p-8 my-10 text-center">
      <h2 className="font-display text-2xl font-bold text-at-text mb-3">{title}</h2>
      <p className="text-at-muted mb-6">{subtext}</p>
      <Link
        href={`/${locale}/download`}
        className="inline-flex items-center gap-2 px-8 py-4 bg-at-accent text-at-on-accent font-semibold rounded-xl hover:bg-[#FF7047] transition-all duration-200 shadow-sm hover:shadow-sm"
      >
        {UI[lang].cta}
        <ArrowRight className="h-5 w-5" />
      </Link>
      <p className="text-sm text-at-dim mt-4">{UI[lang].ctaNote}</p>
    </div>
  );
}

export function RelatedLinks({
  links,
  lang = 'en',
}: {
  links: { href: string; label: string }[];
  lang?: GuideLang;
}) {
  return (
    <div className="mt-4">
      <H2>{UI[lang].keepReading}</H2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-at-accent hover:text-at-accent hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

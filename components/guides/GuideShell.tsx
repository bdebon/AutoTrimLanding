import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Check } from 'lucide-react';
import type { FaqItem } from '@/lib/seo';

/**
 * Shared shell + typographic building blocks for the English-only
 * /guides section. Everything is server-rendered static HTML so search
 * and AI crawlers get the full content without executing JavaScript.
 */

export function GuideShell({
  locale,
  title,
  subtitle,
  updated,
  children,
}: {
  locale: string;
  title: string;
  subtitle: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-at-app">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-at-dim">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={`/${locale}`} className="hover:text-at-accent">
                  AutoTrim
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/en/guides" className="hover:text-at-accent">
                  Guides
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-at-text mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-at-muted mb-4">{subtitle}</p>
          <p className="text-sm text-at-dim mb-10">
            By{' '}
            <a
              href="https://www.youtube.com/@BenjaminCode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-at-accent hover:underline"
            >
              Benjamin Code
            </a>
            , YouTuber &amp; developer of AutoTrim · Last updated: {updated}
          </p>

          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}

/** Featured-snippet style direct answer, placed right under the intro. */
export function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-at-accent-surface border border-at-accent-soft-border rounded-2xl p-6 mb-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-at-accent mb-2">
        Quick answer
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

export function FaqBlock({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-4 mb-10">
      <H2 id="faq">Frequently asked questions</H2>
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
  title,
  subtext,
}: {
  locale: string;
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
        Try AutoTrim Free
        <ArrowRight className="h-5 w-5" />
      </Link>
      <p className="text-sm text-at-dim mt-4">
        Free version with unlimited previews — pay only when you export.
      </p>
    </div>
  );
}

export function RelatedLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <div className="mt-4">
      <H2>Keep reading</H2>
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

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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={`/${locale}`} className="hover:text-primary-600">
                  AutoTrim
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/en/guides" className="hover:text-primary-600">
                  Guides
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{subtitle}</p>
          <p className="text-sm text-gray-500 mb-10">
            By{' '}
            <a
              href="https://www.youtube.com/@BenjaminCode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
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
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 mb-2">
        Quick answer
      </p>
      <div className="text-gray-800 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl font-bold text-gray-900 mt-12 mb-4">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 leading-relaxed mb-5">{children}</p>;
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-6 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
          <Check className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
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
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center text-sm">
            {i + 1}
          </span>
          <div>
            <p className="font-semibold text-gray-900 mb-1">{step.name}</p>
            <p className="text-gray-600 leading-relaxed">{step.text}</p>
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
    <div className="overflow-x-auto mb-8 rounded-2xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-4 font-semibold text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="p-4 text-gray-600 align-top">
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
      <div className="divide-y divide-gray-200">
        {items.map((item, i) => (
          <div key={i} className="py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.q}</h3>
            <p className="text-gray-600 leading-relaxed">{item.a}</p>
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
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-8 my-10 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{subtext}</p>
      <Link
        href={`/${locale}/download`}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Try AutoTrim Free
        <ArrowRight className="h-5 w-5" />
      </Link>
      <p className="text-sm text-gray-500 mt-4">
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
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import React from "react";
import { Check, X, Minus, Zap, Scale, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import OptimizedImage from "./OptimizedImage";

/**
 * Shared body of the /compare pages: title, answer-first intro, optional
 * how-to steps, comparison table, verdict and call to action.
 *
 * Each row is { key, highlight?, competitor?, autoTrimImage?, competitorImage? }.
 * `competitor` says how the other tool fares on that row, so the table never
 * shows a cross next to something it actually does:
 *   "no" (default) a cross · "yes" it does it too · "neutral" a matter of fit.
 * `autoTrimImage` is the name of a localized app capture in /public/app.
 */
const COMPETITOR_ICONS = { no: X, yes: Check, neutral: Minus };

const ComparePage = ({ ns, competitorKey, competitorName, rows, howTo = false }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const captureLocale = currentLocale === "fr" ? "fr" : "en";
  const steps = howTo ? t.raw(`${ns}.howTo.steps`) : [];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 secondary-hero">
      <div className="max-w-7xl mx-auto">
        {/* Header: the first paragraph answers the page's main question */}
        <div className="text-center mb-12">
          <h1
            data-animate="compare-title"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-at-text mb-6"
          >
            {t(`${ns}.title`)}
          </h1>
          <p
            data-animate="compare-subtitle"
            className="text-xl text-at-muted max-w-3xl mx-auto leading-relaxed"
          >
            {t(`${ns}.subtitle`)}
          </p>
        </div>

        {howTo && (
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-2xl font-bold text-at-text mb-6">
              {t(`${ns}.howTo.title`)}
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-at-accent-surface font-semibold text-at-accent">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-lg text-at-muted leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Comparison table */}
        <div
          data-animate="compare-table"
          className="bg-at-card rounded-2xl shadow-sm overflow-hidden border border-at-border mb-16"
        >
          <div className="hidden md:grid md:grid-cols-3 bg-at-chip border-b-2 border-at-border">
            <div className="p-6 font-semibold text-at-muted">
              {t(`${ns}.table.headers.feature`)}
            </div>
            <div className="p-6 font-semibold text-center bg-at-accent-surface border-x-2 border-at-border">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-at-accent" />
                <span className="text-at-accent">{t(`${ns}.table.headers.autoTrim`)}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-at-muted">
              {t(`${ns}.table.headers.${competitorKey}`)}
            </div>
          </div>

          {rows.map((row) => {
            const label = t(`${ns}.table.rows.${row.key}.label`);
            const CompetitorIcon = COMPETITOR_ICONS[row.competitor || "no"];
            return (
              <div
                key={row.key}
                data-animate="table-row"
                className={`grid grid-cols-1 md:grid-cols-3 border-b border-at-border ${
                  row.highlight ? "bg-at-accent-surface/30" : ""
                }`}
              >
                <div className="p-6 font-medium text-at-muted">{label}</div>
                <div className="p-6 border-x-2 border-at-border bg-at-accent-surface">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-at-accent flex-shrink-0 mt-0.5" />
                      <span className="text-at-muted">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-accent md:hidden">
                          AutoTrim
                        </span>
                        {t(`${ns}.table.rows.${row.key}.autoTrim`)}
                      </span>
                    </div>
                    {row.autoTrimImage && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-at-accent-soft-border shadow-sm">
                        <OptimizedImage
                          src={`/app/${row.autoTrimImage}-${captureLocale}.webp`}
                          alt={`${label} - AutoTrim`}
                          className="w-full h-auto"
                          width={600}
                          height={400}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CompetitorIcon className="h-5 w-5 text-at-dim flex-shrink-0 mt-0.5" />
                      <span className="text-at-muted">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-dim md:hidden">
                          {competitorName}
                        </span>
                        {t(`${ns}.table.rows.${row.key}.${competitorKey}`)}
                      </span>
                    </div>
                    {row.competitorImage && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-at-border-hi shadow-sm">
                        <OptimizedImage
                          src={row.competitorImage}
                          alt={`${label} - ${competitorName}`}
                          className="w-full h-auto opacity-75"
                          width={600}
                          height={400}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verdict */}
        <div
          data-animate="winner-section"
          className="bg-at-accent-surface border border-at-accent-soft-border rounded-card-lg p-8 lg:p-12 mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Scale className="h-12 w-12 text-at-accent" />
          </div>
          <h2 className="font-display text-3xl font-bold text-at-text text-center mb-4">
            {t(`${ns}.winner.title`)}
          </h2>
          <p className="text-lg text-at-muted text-center max-w-3xl mx-auto">
            {t(`${ns}.winner.description`)}
          </p>
        </div>

        {/* Call to action */}
        <div data-animate="compare-cta" className="text-center">
          <h3 className="font-display text-2xl font-bold text-at-text mb-6">
            {t(`${ns}.cta.title`)}
          </h3>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-at-accent text-at-on-accent font-semibold rounded-xl hover:bg-[#FF7047] transition-all duration-200 shadow-sm hover:shadow-sm transform hover:-translate-y-0.5 mb-4"
          >
            {t(`${ns}.cta.button`)}
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-at-muted">{t(`${ns}.cta.subtext`)}</p>
        </div>
      </div>
    </section>
  );
};

export default ComparePage;

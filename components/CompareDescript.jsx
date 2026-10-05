"use client";
import React from "react";
import { Check, X, Zap, Trophy, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const CompareDescript = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const tableData = [
    {
      label: t("compareDescript.table.rows.platformWorkflow.label"),
      autoTrim: t("compareDescript.table.rows.platformWorkflow.autoTrim"),
      descript: t("compareDescript.table.rows.platformWorkflow.descript"),
      autoTrimWins: true,
    },
    {
      label: t("compareDescript.table.rows.processingStyle.label"),
      autoTrim: t("compareDescript.table.rows.processingStyle.autoTrim"),
      descript: t("compareDescript.table.rows.processingStyle.descript"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareDescript.table.rows.aiExecution.label"),
      autoTrim: t("compareDescript.table.rows.aiExecution.autoTrim"),
      descript: t("compareDescript.table.rows.aiExecution.descript"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareDescript.table.rows.pricingStructure.label"),
      autoTrim: t("compareDescript.table.rows.pricingStructure.autoTrim"),
      descript: t("compareDescript.table.rows.pricingStructure.descript"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareDescript.table.rows.silenceRemoval.label"),
      autoTrim: t("compareDescript.table.rows.silenceRemoval.autoTrim"),
      descript: t("compareDescript.table.rows.silenceRemoval.descript"),
      autoTrimWins: true,
    },
    {
      label: t("compareDescript.table.rows.advancedTools.label"),
      autoTrim: t("compareDescript.table.rows.advancedTools.autoTrim"),
      descript: t("compareDescript.table.rows.advancedTools.descript"),
      autoTrimWins: false,
    },
    {
      label: t("compareDescript.table.rows.performanceUX.label"),
      autoTrim: t("compareDescript.table.rows.performanceUX.autoTrim"),
      descript: t("compareDescript.table.rows.performanceUX.descript"),
      autoTrimWins: true,
    },
    {
      label: t("compareDescript.table.rows.bestFor.label"),
      autoTrim: t("compareDescript.table.rows.bestFor.autoTrim"),
      descript: t("compareDescript.table.rows.bestFor.descript"),
      autoTrimWins: true,
    },
  ];

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 secondary-hero"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            data-animate="compare-title"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-at-text mb-6"
          >
            {t("compareDescript.title")}
          </h1>
          <p
            data-animate="compare-subtitle"
            className="text-xl text-at-muted max-w-4xl mx-auto leading-relaxed"
          >
            {t("compareDescript.subtitle")}
          </p>
        </div>

        {/* Comparison Table */}
        <div
          data-animate="compare-table"
          className="bg-at-card rounded-2xl shadow-sm overflow-hidden border border-at-border mb-16"
        >
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-3 bg-at-chip border-b-2 border-at-border">
            <div className="p-6 font-semibold text-at-muted">
              {t("compareDescript.table.headers.feature")}
            </div>
            <div className="p-6 font-semibold text-center bg-at-accent-surface border-x-2 border-at-border">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-at-accent" />
                <span className="text-at-accent">{t("compareDescript.table.headers.autoTrim")}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-at-muted">
              {t("compareDescript.table.headers.descript")}
            </div>
          </div>

          {/* Table Rows */}
          {tableData.map((row, index) => (
            <div
              key={index}
              data-animate="table-row"
              className={`grid grid-cols-1 md:grid-cols-3 border-b border-at-border ${
                row.highlight ? "bg-yellow-50/20" : ""
              }`}
            >
              <div className="p-6 font-medium text-at-muted">
                {row.label}
              </div>
              <div className="p-6 border-x-2 border-at-border bg-at-accent-surface">
                <div className="flex items-start gap-3">
                  {row.autoTrimWins ? (
                    <Check className="h-5 w-5 text-at-accent flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-accent md:hidden">AutoTrim</span>{row.autoTrim}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  {!row.autoTrimWins ? (
                    <Check className="h-5 w-5 text-at-accent flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-at-dim flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-dim md:hidden">Descript</span>{row.descript}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Winner Section */}
        <div
          data-animate="winner-section"
          className="bg-at-accent-surface border border-at-accent-soft-border rounded-card-lg p-8 lg:p-12 mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 text-at-accent" />
          </div>
          <h2 className="font-display text-3xl font-bold text-at-text text-center mb-4">
            {t("compareDescript.winner.title")}
          </h2>
          <p className="text-lg text-at-muted text-center max-w-3xl mx-auto">
            {t("compareDescript.winner.description")}
          </p>
        </div>

        {/* CTA Section */}
        <div data-animate="compare-cta" className="text-center">
          <h3 className="font-display text-2xl font-bold text-at-text mb-6">
            {t("compareDescript.cta.title")}
          </h3>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-at-accent text-at-on-accent font-semibold rounded-xl hover:bg-[#FF7047] transition-all duration-200 shadow-sm hover:shadow-sm transform hover:-translate-y-0.5 mb-4"
          >
            {t("compareDescript.cta.button")}
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-at-muted">
            {t("compareDescript.cta.subtext")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompareDescript;
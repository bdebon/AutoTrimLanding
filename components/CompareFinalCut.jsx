"use client";
import React from "react";
import { Check, X, Zap, Trophy, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const CompareFinalCut = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const tableData = [
    {
      label: t("compareFinalCut.table.rows.nativeSilenceRemoval.label"),
      autoTrim: t("compareFinalCut.table.rows.nativeSilenceRemoval.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.nativeSilenceRemoval.finalCut"),
      highlight: true,
    },
    {
      label: t("compareFinalCut.table.rows.fillerWordRemoval.label"),
      autoTrim: t("compareFinalCut.table.rows.fillerWordRemoval.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.fillerWordRemoval.finalCut"),
      highlight: true,
    },
    {
      label: t("compareFinalCut.table.rows.pluginEcosystem.label"),
      autoTrim: t("compareFinalCut.table.rows.pluginEcosystem.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.pluginEcosystem.finalCut"),
      highlight: true,
    },
    {
      label: t("compareFinalCut.table.rows.multiClipWorkflow.label"),
      autoTrim: t("compareFinalCut.table.rows.multiClipWorkflow.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.multiClipWorkflow.finalCut"),
    },
    {
      label: t("compareFinalCut.table.rows.aiPrivacy.label"),
      autoTrim: t("compareFinalCut.table.rows.aiPrivacy.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.aiPrivacy.finalCut"),
    },
    {
      label: t("compareFinalCut.table.rows.timeOn30min.label"),
      autoTrim: t("compareFinalCut.table.rows.timeOn30min.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.timeOn30min.finalCut"),
      highlight: true,
    },
    {
      label: t("compareFinalCut.table.rows.pricing.label"),
      autoTrim: t("compareFinalCut.table.rows.pricing.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.pricing.finalCut"),
    },
    {
      label: t("compareFinalCut.table.rows.bestFor.label"),
      autoTrim: t("compareFinalCut.table.rows.bestFor.autoTrim"),
      finalCut: t("compareFinalCut.table.rows.bestFor.finalCut"),
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
            {t("compareFinalCut.title")}
          </h1>
          <p
            data-animate="compare-subtitle"
            className="text-xl text-at-muted max-w-4xl mx-auto leading-relaxed"
          >
            {t("compareFinalCut.subtitle")}
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
              {t("compareFinalCut.table.headers.feature")}
            </div>
            <div className="p-6 font-semibold text-center bg-at-accent-surface border-x-2 border-at-border">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-at-accent" />
                <span className="text-at-accent">{t("compareFinalCut.table.headers.autoTrim")}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-at-muted">
              {t("compareFinalCut.table.headers.finalCut")}
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
                  <Check className="h-5 w-5 text-at-accent flex-shrink-0 mt-0.5" />
                  <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-accent md:hidden">AutoTrim</span>{row.autoTrim}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-at-dim flex-shrink-0 mt-0.5" />
                  <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-dim md:hidden">Final Cut Pro</span>{row.finalCut}</span>
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
            {t("compareFinalCut.winner.title")}
          </h2>
          <p className="text-lg text-at-muted text-center max-w-3xl mx-auto">
            {t("compareFinalCut.winner.description")}
          </p>
        </div>

        {/* CTA Section */}
        <div data-animate="compare-cta" className="text-center">
          <h3 className="font-display text-2xl font-bold text-at-text mb-6">
            {t("compareFinalCut.cta.title")}
          </h3>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-at-accent text-at-on-accent font-semibold rounded-xl hover:bg-[#FF7047] transition-all duration-200 shadow-sm hover:shadow-sm transform hover:-translate-y-0.5 mb-4"
          >
            {t("compareFinalCut.cta.button")}
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-at-muted">
            {t("compareFinalCut.cta.subtext")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompareFinalCut;

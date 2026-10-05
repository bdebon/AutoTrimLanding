"use client";
import React from "react";
import { Check, X, Zap, Trophy, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import OptimizedImage from "./OptimizedImage";

const ComparePremiere = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const tableData = [
    {
      label: t("comparePremiere.table.rows.importWorkflow.label"),
      autoTrim: t("comparePremiere.table.rows.importWorkflow.autoTrim"),
      premiere: t("comparePremiere.table.rows.importWorkflow.premiere"),
      autoTrimImage: `/app/session-${currentLocale === "fr" ? "fr" : "en"}.webp`,
    },
    {
      label: t("comparePremiere.table.rows.processing.label"),
      autoTrim: t("comparePremiere.table.rows.processing.autoTrim"),
      premiere: t("comparePremiere.table.rows.processing.premiere"),
      highlight: true,
      autoTrimImage: `/app/session-${currentLocale === "fr" ? "fr" : "en"}.webp`,
    },
    {
      label: t("comparePremiere.table.rows.finalOutput.label"),
      autoTrim: t("comparePremiere.table.rows.finalOutput.autoTrim"),
      premiere: t("comparePremiere.table.rows.finalOutput.premiere"),
    },
    {
      label: t("comparePremiere.table.rows.silenceRemoval.label"),
      autoTrim: t("comparePremiere.table.rows.silenceRemoval.autoTrim"),
      premiere: t("comparePremiere.table.rows.silenceRemoval.premiere"),
    },
    {
      label: t("comparePremiere.table.rows.fillerWords.label"),
      autoTrim: t("comparePremiere.table.rows.fillerWords.autoTrim"),
      premiere: t("comparePremiere.table.rows.fillerWords.premiere"),
    },
    {
      label: t("comparePremiere.table.rows.realWorldSpeed.label"),
      autoTrim: t("comparePremiere.table.rows.realWorldSpeed.autoTrim"),
      premiere: t("comparePremiere.table.rows.realWorldSpeed.premiere"),
      highlight: true,
    },
    {
      label: t("comparePremiere.table.rows.otherNles.label"),
      autoTrim: t("comparePremiere.table.rows.otherNles.autoTrim"),
      premiere: t("comparePremiere.table.rows.otherNles.premiere"),
    },
    {
      label: t("comparePremiere.table.rows.bestFor.label"),
      autoTrim: t("comparePremiere.table.rows.bestFor.autoTrim"),
      premiere: t("comparePremiere.table.rows.bestFor.premiere"),
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
            {t("comparePremiere.title")}
          </h1>
          <p
            data-animate="compare-subtitle"
            className="text-xl text-at-muted max-w-3xl mx-auto"
          >
            {t("comparePremiere.subtitle")}
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
              {t("comparePremiere.table.headers.feature")}
            </div>
            <div className="p-6 font-semibold text-center bg-at-accent-surface border-x-2 border-at-border">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-at-accent" />
                <span className="text-at-accent">{t("comparePremiere.table.headers.autoTrim")}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-at-muted">
              {t("comparePremiere.table.headers.premiere")}
            </div>
          </div>

          {/* Table Rows */}
          {tableData.map((row, index) => (
            <div
              key={index}
              data-animate="table-row"
              className={`grid grid-cols-1 md:grid-cols-3 border-b border-at-border ${
                row.highlight ? "bg-at-accent-surface/30" : ""
              }`}
            >
              <div className="p-6 font-medium text-at-muted">
                {row.label}
              </div>
              <div className="p-6 border-x-2 border-at-border bg-at-accent-surface">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-at-accent flex-shrink-0 mt-0.5" />
                    <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-accent md:hidden">AutoTrim</span>{row.autoTrim}</span>
                  </div>
                  {row.autoTrimImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-at-accent-soft-border shadow-sm">
                      {row.autoTrimImage.endsWith('.gif') ? (
                        <VideoPlayer
                          src={row.autoTrimImage}
                          alt={`${row.label} - AutoTrim`}
                          className="w-full h-auto"
                        />
                      ) : (
                        <OptimizedImage
                          src={row.autoTrimImage}
                          alt={`${row.label} - AutoTrim`}
                          className="w-full h-auto"
                          width={600}
                          height={400}
                          loading="lazy"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-at-dim flex-shrink-0 mt-0.5" />
                  <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-dim md:hidden">Premiere Pro</span>{row.premiere}</span>
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
            {t("comparePremiere.winner.title")}
          </h2>
          <p className="text-lg text-at-muted text-center max-w-3xl mx-auto">
            {t("comparePremiere.winner.description")}
          </p>
        </div>

        {/* CTA Section */}
        <div data-animate="compare-cta" className="text-center">
          <h3 className="font-display text-2xl font-bold text-at-text mb-6">
            {t("comparePremiere.cta.title")}
          </h3>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-at-accent text-at-on-accent font-semibold rounded-xl hover:bg-[#FF7047] transition-all duration-200 shadow-sm hover:shadow-sm transform hover:-translate-y-0.5 mb-4"
          >
            {t("comparePremiere.cta.button")}
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-at-muted">
            {t("comparePremiere.cta.subtext")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparePremiere;

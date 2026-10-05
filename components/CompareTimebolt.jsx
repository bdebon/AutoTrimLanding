"use client";
import React from "react";
import { Check, X, Zap, Trophy, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import OptimizedImage from "./OptimizedImage";

const CompareTimebolt = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const tableData = [
    {
      label: t("compareTimebolt.table.rows.importWorkflow.label"),
      autoTrim: t("compareTimebolt.table.rows.importWorkflow.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.importWorkflow.timebolt"),
      autoTrimWins: true,
      autoTrimImage: `/app/session-${currentLocale === "fr" ? "fr" : "en"}.webp`,
      timeboltImage: "/assets/img/Timebolt/import.jpg", // Import un seul fichier à la fois
    },
    {
      label: t("compareTimebolt.table.rows.processing.label"),
      autoTrim: t("compareTimebolt.table.rows.processing.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.processing.timebolt"),
      autoTrimWins: true,
      highlight: true,
      autoTrimImage: `/app/session-${currentLocale === "fr" ? "fr" : "en"}.webp`,
      timeboltImage: "/assets/img/Timebolt/one-file-at-a-time.jpg", // Traitement séquentiel
    },
    {
      label: t("compareTimebolt.table.rows.finalOutput.label"),
      autoTrim: t("compareTimebolt.table.rows.finalOutput.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.finalOutput.timebolt"),
      autoTrimWins: true,
    },
    {
      label: t("compareTimebolt.table.rows.realWorldSpeed.label"),
      autoTrim: t("compareTimebolt.table.rows.realWorldSpeed.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.realWorldSpeed.timebolt"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareTimebolt.table.rows.userExperience.label"),
      autoTrim: t("compareTimebolt.table.rows.userExperience.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.userExperience.timebolt"),
      autoTrimWins: true,
    },
    {
      label: t("compareTimebolt.table.rows.interface.label"),
      autoTrim: t("compareTimebolt.table.rows.interface.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.interface.timebolt"),
      autoTrimWins: true,
      autoTrimImage: `/app/session-${currentLocale === "fr" ? "fr" : "en"}.webp`, // Interface moderne et épurée
      timeboltImage: "/assets/img/Timebolt/interface.jpg", // Interface datée et complexe
    },
    {
      label: t("compareTimebolt.table.rows.featureQuality.label"),
      autoTrim: t("compareTimebolt.table.rows.featureQuality.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.featureQuality.timebolt"),
      autoTrimWins: true,
    },
    {
      label: t("compareTimebolt.table.rows.aiCost.label"),
      autoTrim: t("compareTimebolt.table.rows.aiCost.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.aiCost.timebolt"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareTimebolt.table.rows.developedBy.label"),
      autoTrim: t("compareTimebolt.table.rows.developedBy.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.developedBy.timebolt"),
      autoTrimWins: true,
    },
    {
      label: t("compareTimebolt.table.rows.bestFor.label"),
      autoTrim: t("compareTimebolt.table.rows.bestFor.autoTrim"),
      timebolt: t("compareTimebolt.table.rows.bestFor.timebolt"),
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
            {t("compareTimebolt.title")}
          </h1>
          <p
            data-animate="compare-subtitle"
            className="text-xl text-at-muted max-w-3xl mx-auto"
          >
            {t("compareTimebolt.subtitle")}
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
              {t("compareTimebolt.table.headers.feature")}
            </div>
            <div className="p-6 font-semibold text-center bg-at-accent-surface border-x-2 border-at-border">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-at-accent" />
                <span className="text-at-accent">{t("compareTimebolt.table.headers.autoTrim")}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-at-muted">
              {t("compareTimebolt.table.headers.timebolt")}
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
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-at-dim flex-shrink-0 mt-0.5" />
                    <span className="text-at-muted"><span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-at-dim md:hidden">TimeBolt</span>{row.timebolt}</span>
                  </div>
                  {row.timeboltImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-at-border-hi shadow-sm">
                      {row.timeboltImage.endsWith('.gif') ? (
                        <VideoPlayer
                          src={row.timeboltImage}
                          alt={`${row.label} - TimeBolt`}
                          className="w-full h-auto opacity-75"
                        />
                      ) : (
                        <OptimizedImage
                          src={row.timeboltImage}
                          alt={`${row.label} - TimeBolt`}
                          className="w-full h-auto opacity-75"
                          width={600}
                          height={400}
                          loading="lazy"
                        />
                      )}
                    </div>
                  )}
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
            {t("compareTimebolt.winner.title")}
          </h2>
          <p className="text-lg text-at-muted text-center max-w-3xl mx-auto">
            {t("compareTimebolt.winner.description")}
          </p>
        </div>

        {/* CTA Section */}
        <div data-animate="compare-cta" className="text-center">
          <h3 className="font-display text-2xl font-bold text-at-text mb-6">
            {t("compareTimebolt.cta.title")}
          </h3>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-at-accent text-at-on-accent font-semibold rounded-xl hover:bg-[#FF7047] transition-all duration-200 shadow-sm hover:shadow-sm transform hover:-translate-y-0.5 mb-4"
          >
            {t("compareTimebolt.cta.button")}
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-at-muted">
            {t("compareTimebolt.cta.subtext")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompareTimebolt;
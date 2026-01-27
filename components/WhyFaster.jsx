"use client";
import React from "react";
import { Check, X, Zap, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const WhyFaster = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';


  const tableData = [
    {
      label: t("whyFaster.table.rows.import.label"),
      autoTrim: t("whyFaster.table.rows.import.autoTrim"),
      otherTools: t("whyFaster.table.rows.import.otherTools"),
      highlight: false,
    },
    {
      label: t("whyFaster.table.rows.processing.label"),
      autoTrim: t("whyFaster.table.rows.processing.autoTrim"),
      otherTools: t("whyFaster.table.rows.processing.otherTools"),
      highlight: true,
    },
    {
      label: t("whyFaster.table.rows.result.label"),
      autoTrim: t("whyFaster.table.rows.result.autoTrim"),
      otherTools: t("whyFaster.table.rows.result.otherTools"),
      highlight: false,
    },
    {
      label: t("whyFaster.table.rows.speed.label"),
      autoTrim: t("whyFaster.table.rows.speed.autoTrim"),
      otherTools: t("whyFaster.table.rows.speed.otherTools"),
      highlight: true,
    },
    {
      label: t("whyFaster.table.rows.aiCost.label"),
      autoTrim: t("whyFaster.table.rows.aiCost.autoTrim"),
      otherTools: t("whyFaster.table.rows.aiCost.otherTools"),
      highlight: false,
    },
  ];

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12"
        >
          {t("whyFaster.title")}
        </h2>

        {/* Comparison Table */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 min-w-[640px] sm:min-w-0">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <div className="p-6 font-semibold text-gray-700">
              {t("whyFaster.table.headers.feature")}
            </div>
            <div className="p-6 font-semibold text-center bg-gradient-to-br from-green-50 to-emerald-50 border-x-2 border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{t("whyFaster.table.headers.autoTrim")}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-gray-600">
              {t("whyFaster.table.headers.otherTools")}
            </div>
          </div>

          {/* Table Rows */}
          {tableData.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 border-b border-gray-100 ${
                row.highlight ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="p-6 font-medium text-gray-700">
                {row.label}
              </div>
              <div className="p-6 border-x-2 border-gray-100 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{row.autoTrim}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{row.otherTools}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-6">
            {t("whyFaster.cta")}
          </p>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t("whyFaster.ctaButton")}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyFaster;
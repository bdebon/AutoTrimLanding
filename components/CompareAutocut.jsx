"use client";
import React, { useLayoutEffect, useRef } from "react";
import { Check, X, Zap, Trophy, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const CompareAutocut = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('[data-animate="compare-title"]');
      const subtitle = sectionRef.current?.querySelector('[data-animate="compare-subtitle"]');
      const table = sectionRef.current?.querySelector('[data-animate="compare-table"]');
      const rows = gsap.utils.toArray(sectionRef.current?.querySelectorAll('[data-animate="table-row"]'));
      const winner = sectionRef.current?.querySelector('[data-animate="winner-section"]');
      const cta = sectionRef.current?.querySelector('[data-animate="compare-cta"]');

      // Title animation
      if (title) {
        gsap.set(title, { opacity: 0, y: 30 });
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Subtitle animation
      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 20 });
        gsap.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: subtitle,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Table animation
      if (table) {
        gsap.set(table, { opacity: 0, scale: 0.95 });
        gsap.to(table, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: table,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Rows stagger animation
      if (rows.length) {
        gsap.set(rows, { opacity: 0, x: -20 });
        
        ScrollTrigger.create({
          trigger: rows[0],
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(rows, {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.08,
              delay: 0.3,
            });
          },
        });
      }

      // Winner section animation
      if (winner) {
        gsap.set(winner, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: winner,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(winner, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          },
        });
      }

      // CTA animation
      if (cta) {
        gsap.set(cta, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: cta,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(cta, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              delay: 0.2,
            });
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const tableData = [
    {
      label: t("compareAutocut.table.rows.platform.label"),
      autoTrim: t("compareAutocut.table.rows.platform.autoTrim"),
      autocut: t("compareAutocut.table.rows.platform.autocut"),
      autoTrimWins: true,
    },
    {
      label: t("compareAutocut.table.rows.workflow.label"),
      autoTrim: t("compareAutocut.table.rows.workflow.autoTrim"),
      autocut: t("compareAutocut.table.rows.workflow.autocut"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareAutocut.table.rows.aiPerformance.label"),
      autoTrim: t("compareAutocut.table.rows.aiPerformance.autoTrim"),
      autocut: t("compareAutocut.table.rows.aiPerformance.autocut"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareAutocut.table.rows.pricing.label"),
      autoTrim: t("compareAutocut.table.rows.pricing.autoTrim"),
      autocut: t("compareAutocut.table.rows.pricing.autocut"),
      autoTrimWins: true,
      highlight: true,
    },
    {
      label: t("compareAutocut.table.rows.features.label"),
      autoTrim: t("compareAutocut.table.rows.features.autoTrim"),
      autocut: t("compareAutocut.table.rows.features.autocut"),
      autoTrimWins: true,
    },
    {
      label: t("compareAutocut.table.rows.learningCurve.label"),
      autoTrim: t("compareAutocut.table.rows.learningCurve.autoTrim"),
      autocut: t("compareAutocut.table.rows.learningCurve.autocut"),
      autoTrimWins: true,
    },
    {
      label: t("compareAutocut.table.rows.bestFor.label"),
      autoTrim: t("compareAutocut.table.rows.bestFor.autoTrim"),
      autocut: t("compareAutocut.table.rows.bestFor.autocut"),
      autoTrimWins: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            data-animate="compare-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            {t("compareAutocut.title")}
          </h1>
          <p
            data-animate="compare-subtitle"
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            {t("compareAutocut.subtitle")}
          </p>
        </div>

        {/* Comparison Table */}
        <div
          data-animate="compare-table"
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 mb-16"
        >
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <div className="p-6 font-semibold text-gray-700">
              {t("compareAutocut.table.headers.feature")}
            </div>
            <div className="p-6 font-semibold text-center bg-gradient-to-br from-green-50 to-emerald-50 border-x-2 border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{t("compareAutocut.table.headers.autoTrim")}</span>
              </div>
            </div>
            <div className="p-6 font-semibold text-center text-gray-600">
              {t("compareAutocut.table.headers.autocut")}
            </div>
          </div>

          {/* Table Rows */}
          {tableData.map((row, index) => (
            <div
              key={index}
              data-animate="table-row"
              className={`grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 ${
                row.highlight ? "bg-yellow-50/20" : ""
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
                  <span className="text-gray-600">{row.autocut}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Winner Section */}
        <div
          data-animate="winner-section"
          className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-3xl p-8 lg:p-12 mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {t("compareAutocut.winner.title")}
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            {t("compareAutocut.winner.description")}
          </p>
        </div>

        {/* CTA Section */}
        <div data-animate="compare-cta" className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {t("compareAutocut.cta.title")}
          </h3>
          <a
            href={`/${currentLocale}/download`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4"
          >
            {t("compareAutocut.cta.button")}
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-gray-600">
            {t("compareAutocut.cta.subtext")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompareAutocut;
"use client";
import React from "react";
import { Zap, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

const ProcessSteps = () => {
  const t = useTranslations();
  const steps = [
    {
      number: "1",
      title: t("processSteps.steps.drop.title"),
      description: t("processSteps.steps.drop.description"),
      gif: "/assets/img/gif1.gif",
      alt: t("processSteps.steps.drop.alt"),
    },
    {
      number: "2",
      title: t("processSteps.steps.trim.title"),
      description: t("processSteps.steps.trim.description"),
      gif: "/assets/img/gif2.gif",
      alt: t("processSteps.steps.trim.alt"),
    },
    {
      number: "3",
      title: t("processSteps.steps.export.title"),
      description: t("processSteps.steps.export.description"),
      gif: "/assets/img/gif3.gif",
      alt: t("processSteps.steps.export.alt"),
    },
  ];


  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2
            className="mx-auto text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("processSteps.title")}
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t("processSteps.subtitle")}
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* GIF side */}
              <div
                className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent" />
                  <img
                    src={step.gif}
                    alt={step.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Floating step number */}
                  <div
                    className="absolute top-6 left-6 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl font-bold text-2xl shadow-xl"
                  >
                    {step.number}
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-6">
                  <h3
                    className="text-3xl lg:text-4xl font-bold text-gray-900"
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-lg lg:text-xl text-gray-600 leading-relaxed"
                  >
                    {step.description}
                  </p>

                  {/* Visual enhancement */}
                  <div
                    className="flex items-center gap-3 pt-4"
                  >
                    <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
                    <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                      {t("processSteps.stepCounter")} {step.number} {t("processSteps.of")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Box */}
        <div 
          className="mt-20 mx-auto max-w-4xl bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-10 border border-blue-100 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t("howItWorks.comparison.title")}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* AutoTrim Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">{t("processSteps.autoTrimLabel")}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("howItWorks.comparison.autoTrim")}
              </p>
            </div>
            
            {/* Other Tools Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">{t("processSteps.otherToolsLabel")}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("howItWorks.comparison.otherTools")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;

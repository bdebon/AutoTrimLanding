"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import {
  Plus,
  HelpCircle,
} from "lucide-react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";

const FAQ = () => {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef({});

  const faqs = [
    { q: t("faq.questions.0.q"), a: t("faq.questions.0.a") },
    { q: t("faq.questions.1.q"), a: t("faq.questions.1.a") },
    { q: t("faq.questions.2.q"), a: t("faq.questions.2.a") },
    { q: t("faq.questions.3.q"), a: t("faq.questions.3.a") },
    { q: t("faq.questions.4.q"), a: t("faq.questions.4.a") },
    { q: t("faq.questions.5.q"), a: t("faq.questions.5.a") },
    { q: t("faq.questions.6.q"), a: t("faq.questions.6.a") },
  ];

  useLayoutEffect(() => {
    // Set initial state for all FAQ contents
    Object.keys(contentRefs.current).forEach((key) => {
      if (contentRefs.current[key]) {
        gsap.set(contentRefs.current[key], {
          height: 0,
          opacity: 0,
          overflow: "hidden",
        });
      }
    });
  }, []);

  const toggleFAQ = (index) => {
    const isOpening = openIndex !== index;
    const prevIndex = openIndex;

    // Close previously open item
    if (prevIndex !== null && contentRefs.current[prevIndex]) {
      gsap.to(contentRefs.current[prevIndex], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }

    // Open new item
    if (isOpening && contentRefs.current[index]) {
      gsap.to(contentRefs.current[index], {
        height: "auto",
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }

    setOpenIndex(isOpening ? index : null);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4">
            <HelpCircle className="h-6 w-6 text-gray-700" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t("faq.title")}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-gray-900 font-medium pr-4">
                  {faq.q}
                </h3>
                <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                  <Plus className="h-5 w-5 text-primary-500 flex-shrink-0" />
                </div>
              </button>

              <div
                ref={(el) => (contentRefs.current[index] = el)}
                style={{ height: 0, opacity: 0, overflow: 'hidden' }}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
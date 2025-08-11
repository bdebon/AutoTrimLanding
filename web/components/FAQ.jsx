import React, { useState } from "react";
import {
  Plus,
  Minus,
  HelpCircle,
  Lightbulb,
  Calculator,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = t("faq.questions");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
              className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-gray-900 font-medium pr-4">{faq.q}</h3>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-primary-500 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-primary-500 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

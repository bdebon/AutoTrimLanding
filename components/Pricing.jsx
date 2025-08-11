import React from "react";
import { Check, Shield, Zap, Download, Flame, Gem, FlaskConical, Lock, BadgeDollarSign } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const Pricing = () => {
  const { t } = useTranslation();

  return (
    <section
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            One-time payment. Lifetime access.
          </h2>
          <p className="text-xl text-gray-600">
            AutoTrim is free to try. Pay only when you're ready to export.
          </p>
        </div>

        {/* Single centered pricing card */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Early bird badge */
            }
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg inline-flex items-center gap-1">
                <Flame className="w-4 h-4" />
                Early Bird
              </span>
            </div>

            {/* Main card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    <span className="inline-flex items-center gap-2">
                      <Gem className="w-5 h-5 text-primary-600" />
                      Lifetime License
                    </span>
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-black text-gray-900">
                      $99
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      $199
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 mt-2">one-time payment</p>
                  <p className="text-sm text-primary-600 font-semibold mt-1">
                    No subscription. No limits. Yours forever.
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited projects</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited clips</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Lifetime updates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Priority export speed</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Activate on 2 machines
                    </span>
                  </li>
                </ul>

                <a
                  href="/download"
                  className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Download Free Trial
                </a>
                <p className="mt-3 text-center text-sm text-gray-600">
                  Already tried?{' '}
                  <a href="#pricing" className="text-primary-700 underline hover:no-underline">
                    Buy license
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trial & Trust indicators */}
        <div className="mt-16 text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <FlaskConical className="w-6 h-6" />
            <p className="text-lg">
              <span className="font-semibold">Free to try</span> — process your
              files, preview your cuts.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lock className="w-6 h-6" />
            <p className="text-lg">
              Pay only to export your final XML or timeline.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg text-gray-700 font-medium inline-flex items-center gap-2">
              <BadgeDollarSign className="w-5 h-5 text-green-600" />
              14-day money-back guarantee.
            </p>
          </div>
        </div>

        {/* Bottom CTA removed to reduce redundancy with freemium flow */}
      </div>
    </section>
  );
};

export default Pricing;

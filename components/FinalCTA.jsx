import React from 'react';
import { Clock, Zap, ArrowRight, Brain, Hourglass, Check } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <Brain className="w-14 h-14 text-white/90" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
            Still Not Sure?
          </h2>
        </div>

        {/* Time breakdown cards */}
        <div className="space-y-6 max-w-2xl mx-auto mb-12">
          {/* Current situation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                <Hourglass className="w-7 h-7 text-gray-200" />
              </div>
              <div>
                <p className="text-lg text-gray-300 mb-2">
                  You're spending <span className="text-white font-bold">5 hours/week</span> trimming videos.
                </p>
                <p className="text-3xl font-black text-white">
                  That's <span className="text-red-400">260 hours a year</span>.
                </p>
              </div>
            </div>
          </div>

          {/* With AutoTrim */}
          <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-400/20">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                <Zap className="w-7 h-7 text-primary-300" />
              </div>
              <div>
                <p className="text-lg text-gray-300 mb-2">
                  With AutoTrim, you get <span className="text-white font-bold">96% of that time back</span>.
                </p>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  That's 250+ hours saved — every single year.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value proposition */}
        <div className="text-center mb-12">
          <p className="text-2xl text-white font-bold mb-2">
            What's your time worth?
          </p>
          <p className="text-gray-400">
            At $50/hour, that's <span className="text-white font-semibold">$12,500 saved annually</span>.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="#pricing"
            className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            Start Saving Time Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Free to try</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>14-day money back</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>One-time payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>100% local & private</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
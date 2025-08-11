import React from 'react';
import { Shield, Zap, Clock } from 'lucide-react';

export default function SocialProof() {
  return (
    <section aria-label="Trust signals" className="py-10 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/60 px-4 py-2 text-sm text-primary-800">
            <Zap className="h-4 w-4 text-primary-600" />
            <span>≈ 29× faster</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-sm text-emerald-800">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>Save ~46 min of work on 30 min of footage</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-4 py-2 text-sm text-indigo-800">
            <Shield className="h-4 w-4 text-indigo-600" />
            <span>100% local & private</span>
          </div>
        </div>
      </div>
    </section>
  );
}

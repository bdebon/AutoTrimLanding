import React, { useEffect, useRef, useState } from 'react';
import { Clock, X, TrendingUp, Zap } from 'lucide-react';

const TimeSavings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea',
      'input[type="text"]',
      'input[type="radio"]',
      'input[type="checkbox"]',
      'select',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const modalEl = modalRef.current;
    const focusables = modalEl ? Array.from(modalEl.querySelectorAll(focusableSelectors)) : [];
    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];

    // Focus the close button by default
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
      } else if (e.key === 'Tab') {
        if (focusables.length === 0) return;
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            AutoTrim saves you time. A lot of time.
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 underline underline-offset-2"
          >
            How we measured
          </button>
        </div>

        {/* Asymmetric cards layout */}
        <div className="relative h-[400px] max-w-6xl mx-auto mb-24">
          {/* Radial gradient background for hero stat */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]" style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(14, 165, 233, 0.15) 30%, rgba(56, 189, 248, 0.05) 60%, transparent 80%)' }}></div>
          </div>
          {/* Main central card - Hero stat */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 text-center">
              <div className="text-7xl sm:text-8xl font-black text-white mb-4 flex items-baseline justify-center gap-0">
                <span>29</span>
                <X className="h-10 w-10 sm:h-12 sm:w-12 inline-block -ml-1" strokeWidth={4} style={{ marginBottom: '0.1em' }} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                Faster
              </div>
              <p className="text-primary-100 text-lg max-w-xs mx-auto">
                AutoTrim processes your footage 29× faster than manual editing.
              </p>
              <p className="text-primary-200 text-sm mt-4">
                1 min 40 sec vs 48 min for 30 min of video
              </p>
            </div>
          </div>

          {/* Left card - Manual editing */}
          <div className="absolute top-16 left-0 transform rotate-[-3deg] hover:rotate-0 transition-all duration-300 z-10">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-[280px]">
              <Clock className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Manual Editing
              </h3>
              <p className="text-3xl font-bold text-red-500 mb-2">
                48 min
              </p>
              <p className="text-gray-600 text-sm">
                30 min = 48 min of trimming
              </p>
              <p className="text-red-600 text-sm font-semibold mt-2">
                That's 96% wasted time.
              </p>
            </div>
          </div>

          {/* Right card - With AutoTrim */}
          <div className="absolute top-16 right-0 transform rotate-[3deg] hover:rotate-0 transition-all duration-300 z-10">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-[280px]">
              <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                With AutoTrim
              </h3>
              <p className="text-3xl font-bold text-green-500 mb-2">
                250+ hours
              </p>
              <p className="text-gray-600 text-sm">
                saved per year
              </p>
              <p className="text-green-600 text-sm font-semibold mt-2">
                If you edit 5h/week.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900 mb-8">
            What would you do with 250 extra hours?
          </p>
          <a 
            href="#pricing" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <Zap className="h-5 w-5 group-hover:animate-pulse" />
            <span>Save Time Now</span>
          </a>
        </div>
      </div>

      {/* How we measured modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-measured-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            ref={modalRef}
            className="relative z-10 w-[90vw] max-w-2xl max-h-[85vh] overflow-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 id="how-measured-title" className="text-xl font-bold text-gray-900">
                How we measured
              </h3>
              <button
                ref={closeBtnRef}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="prose prose-sm sm:prose text-gray-700">
              <h4 className="mt-0">Real test case</h4>
              <ul>
                <li>Raw clip: 1 min 33 s</li>
                <li>Manual derush in Final Cut: <strong>2 min 30 s</strong> (150 s)</li>
                <li>With AutoTrim: <strong>25 s</strong></li>
              </ul>
              <p><strong>≈ 6× faster</strong></p>

              <hr />

              <h4>Realistic scenario (client case)</h4>
              <ul>
                <li>6 clips of 5 min = <strong>30 min raw</strong></li>
                <li>Manual (FCP): 30 min × 1.61 ≈ <strong>48 min 18 s</strong></li>
                <li>AutoTrim: parallel processing ×4, 6 clips in 2 waves of 50 s = <strong>1 min 40 s</strong></li>
              </ul>
              <p>
                <strong>Time saved:</strong> ~46 min 38 s — <strong>96.4% reduction</strong> — <strong>≈ 29× faster</strong>
              </p>

              <hr />

              <h4>Vs. other tools</h4>
              <ul>
                <li>Similar per‑clip processing speed (~50 s)</li>
                <li><strong>No parallel processing</strong></li>
                <li><strong>One XML per clip</strong> → manual merge in FCP</li>
              </ul>
              <p>
                Sequential: 6 × 50 s = <strong>5 min</strong> + manual merge 6 × 2 min 30 s = <strong>15 min</strong> → <strong>20 min total</strong>
                <br />
                AutoTrim: <strong>1 min 40 s</strong> + single XML → <strong>no merge</strong>
                <br />
                <strong>Gain:</strong> ~18 min 20 s — <strong>91.6% reduction</strong> — <strong>≈ 12× faster</strong>
              </p>

              <p className="mt-6 text-xs text-gray-500">
                Notes: tests réalisés sur des rushs parlés, timings variables selon machine, source audio et paramètres.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TimeSavings;
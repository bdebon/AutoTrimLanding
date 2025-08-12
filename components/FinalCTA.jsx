import React, { useLayoutEffect, useRef } from "react";
import { Clock, Zap, ArrowRight, Brain, Hourglass, Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FinalCTA = () => {
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    let splitInst = null;

    const ctx = gsap.context(() => {
      const bgCircles = rootRef.current?.querySelectorAll(
        '[data-animate="cta-bg"]'
      );
      const icon = rootRef.current?.querySelector('[data-animate="cta-icon"]');
      const title = rootRef.current?.querySelector(
        '[data-animate="cta-title"]'
      );
      const cards = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="cta-card"]')
      );
      const valueTitle = rootRef.current?.querySelector(
        '[data-animate="cta-value-title"]'
      );
      const valueText = rootRef.current?.querySelector(
        '[data-animate="cta-value-text"]'
      );
      const button = rootRef.current?.querySelector(
        '[data-animate="cta-button"]'
      );
      const trustItems = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="cta-trust"]')
      );

      // Background circles animation
      if (bgCircles.length) {
        gsap.set(bgCircles, { scale: 0, opacity: 0 });
        gsap.to(bgCircles, {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          stagger: 0.3,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 90%",
            once: true,
          },
        });
      }

      // Icon animation
      if (icon) {
        gsap.set(icon, { scale: 0, rotate: -180, opacity: 0 });
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          opacity: 0.9,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Title animation with SplitText
      if (title && titleRef.current) {
        gsap.set(titleRef.current, { y: 30 });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
          onEnter: async () => {
            try {
              const mod = await import("@activetheory/split-text");
              const SplitText = mod.default || mod;
              splitInst = new SplitText(title, { type: "words" });
              const words = splitInst.words;

              gsap.set(words, {
                yPercent: 130,
                display: "inline-block",
                willChange: "transform",
                force3D: true,
              });

              gsap.set(titleRef.current, { opacity: 1, y: 0 });

              gsap.to(words, {
                yPercent: 0,
                duration: 0.9,
                ease: "power4.out",
                stagger: { each: 0.08, from: "start" },
                delay: 0.3,
              });
            } catch (e) {
              // Fallback animation
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.3,
              });
            }
          },
        });
      }

      // Cards animation with number counting
      cards.forEach((card, i) => {
        const numbers = card.querySelectorAll('[data-animate="cta-number"]');
        const text = card.querySelector('[data-animate="cta-text"]');

        // Initial states
        gsap.set(card, { opacity: 0, y: 40, scale: 0.95 });
        if (text) gsap.set(text, { opacity: 0, y: 20 });

        const baseDelay = i * 0.2;

        // Card entrance
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: baseDelay + 0.6,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        });

        // Animate numbers
        if (numbers.length) {
          numbers.forEach((num) => {
            const finalValue = num.textContent;
            const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ""));

            if (!isNaN(numericValue)) {
              gsap.fromTo(
                num,
                { textContent: 0 },
                {
                  textContent: numericValue,
                  duration: 1.5,
                  ease: "power2.out",
                  snap: { textContent: 1 },
                  delay: baseDelay + 0.8,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    once: true,
                  },
                  onUpdate: function () {
                    const value = Math.round(this.targets()[0].textContent);
                    if (finalValue.includes("+")) {
                      num.textContent = value + "+";
                    } else {
                      num.textContent = value;
                    }
                  },
                }
              );
            }
          });
        }

        // Text animation
        if (text) {
          gsap.to(text, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: baseDelay + 1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }
      });

      // Value proposition animation
      if (valueTitle) {
        gsap.set(valueTitle, { opacity: 0, scale: 0.8 });
        gsap.to(valueTitle, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: valueTitle,
            start: "top 90%",
            once: true,
          },
        });
      }

      if (valueText) {
        gsap.set(valueText, { opacity: 0, y: 20 });
        gsap.to(valueText, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: valueText,
            start: "top 90%",
            once: true,
          },
        });
      }

      // CTA Button animation
      if (button) {
        gsap.set(button, { opacity: 0, y: 30, scale: 0.9 });
        gsap.to(button, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: button,
            start: "top 95%",
            once: true,
          },
        });

        // Pulse animation on hover
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }

      // Trust indicators animation
      if (trustItems.length) {
        gsap.set(trustItems, { opacity: 0, y: 20, scale: 0.8 });
        gsap.to(trustItems, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.3)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: trustItems[0],
            start: "top 95%",
            once: true,
          },
        });
      }
    }, rootRef);

    return () => {
      try {
        splitInst?.revert && splitInst.revert();
      } catch {}
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div
          data-animate="cta-bg"
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        ></div>
        <div
          data-animate="cta-bg"
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
        ></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div data-animate="cta-icon" className="mb-4 flex justify-center">
            <Brain className="w-14 h-14 text-white/90" />
          </div>
          <h2
            ref={titleRef}
            data-animate="cta-title"
            className="mx-auto text-4xl sm:text-5xl font-black text-white mb-2 overflow-hidden"
            style={{ opacity: 0 }}
          >
            Still Not Sure?
          </h2>
        </div>

        {/* Time breakdown cards */}
        <div className="space-y-6 max-w-2xl mx-auto mb-12">
          {/* Current situation */}
          <div
            data-animate="cta-card"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                <Hourglass className="w-7 h-7 text-gray-200" />
              </div>
              <div data-animate="cta-text">
                <p className="text-lg text-gray-300 mb-2">
                  You're spending{" "}
                  <span className="text-white font-bold">5 hours/week</span>{" "}
                  trimming videos.
                </p>
                <p className="text-3xl font-black text-white">
                  That's{" "}
                  <span className="text-red-400">
                    <span data-animate="cta-number">260</span> hours a year
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* With AutoTrim */}
          <div
            data-animate="cta-card"
            className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-400/20"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                <Zap className="w-7 h-7 text-primary-300" />
              </div>
              <div data-animate="cta-text">
                <p className="text-lg text-gray-300 mb-2">
                  With AutoTrim, you get{" "}
                  <span className="text-white font-bold">
                    96% of that time back
                  </span>
                  .
                </p>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  That's <span data-animate="cta-number">250+</span> hours saved
                  — every single year.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value proposition */}
        <div className="text-center mb-12">
          <p
            data-animate="cta-value-title"
            className="text-2xl text-white font-bold mb-2"
          >
            What's your time worth?
          </p>
          <p data-animate="cta-value-text" className="text-gray-400">
            At $50/hour, that's{" "}
            <span className="text-white font-semibold">
              $<span data-animate="cta-number">12,500</span> saved annually
            </span>
            .
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            data-animate="cta-button"
            href="#pricing"
            className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-2xl hover:shadow-3xl"
          >
            Start Saving Time Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
          <div data-animate="cta-trust" className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Free to try</span>
          </div>
          <div data-animate="cta-trust" className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>14-day money back</span>
          </div>
          <div data-animate="cta-trust" className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>One-time payment</span>
          </div>
          <div data-animate="cta-trust" className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>100% local & private</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

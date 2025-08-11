import React, { useLayoutEffect, useRef } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  CheckCircle,
  Clock,
  Shield,
  Globe2,
  ArrowDown,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { t } = useTranslation();
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const arrow1Ref = useRef(null);
  const arrow2Ref = useRef(null);
  const heroContentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const setup = async () => {
        // Hide title container to avoid flash until prepared
        gsap.set(titleRef.current, { opacity: 0 });

        // Init non-title elements with fade+lift
        gsap.set([badgeRef.current, descriptionRef.current, ctaRef.current], {
          opacity: 0,
          y: 30,
        });

        // Try to use ActiveTheory SplitText for word-by-word reveal
        let words1 = null;
        let words2 = null;
        try {
          const mod = await import("@activetheory/split-text");
          const SplitText = mod.default || mod;
          const split1 = new SplitText(titleLine1Ref.current, {
            type: "words",
          });
          const split2 = new SplitText(titleLine2Ref.current, {
            type: "words",
          });
          words1 = split1.words;
          words2 = split2.words;
          // If line 2 contained gradient text classes, copy them to each word span
          const gradientEl =
            titleLine2Ref.current.querySelector(".bg-clip-text");
          if (gradientEl) {
            const gradientClasses = gradientEl.className;
            words2.forEach((w) => {
              // Preserve existing classes and append gradient styles
              w.className = `${w.className} ${gradientClasses}`.trim();
            });
          }
          // Prepare words for masked reveal (stronger wave)
          gsap.set([words1, words2], {
            yPercent: 160,
            display: "inline-block",
            willChange: "transform",
            force3D: true,
          });
        } catch (e) {
          // Fallback to line-based masked reveal
          gsap.set([titleLine1Ref.current, titleLine2Ref.current], {
            yPercent: 160,
            willChange: "transform",
            force3D: true,
          });
        }

        // Build main hero timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Reveal title container now that elements are ready
        tl.set(titleRef.current, { opacity: 1 });

        if (words1 && words2) {
          // Wave reveal per word with stagger
          tl.to(words1, {
            yPercent: 0,
            duration: 1.05,
            ease: "power4.out",
            stagger: { each: 0.1, from: "start" },
          }).to(
            words2,
            {
              yPercent: 0,
              duration: 1.05,
              ease: "power4.out",
              stagger: { each: 0.1, from: "start" },
            },
            "-=0.8"
          );
        } else {
          // Fallback: line-by-line masked reveal
          tl.fromTo(
            titleLine1Ref.current,
            { yPercent: 160 },
            { yPercent: 0, duration: 1.1, ease: "power4.out" }
          ).fromTo(
            titleLine2Ref.current,
            { yPercent: 160 },
            { yPercent: 0, duration: 1.1, ease: "power4.out" },
            "-=0.8"
          );
        }

        // Description overlaps after title
        tl.to(
          descriptionRef.current,
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.7"
        )
          // Badge overlaps description
          .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.8")
          // CTAs overlap both desc and badge
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 1.2 }, "-=0.6")
          // Step 1 appears with slight overlap to keep flow
          .fromTo(
            step1Ref.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.4 },
            ">-.4"
          );

        // Independent reveals for Step 2 and Step 3 when they enter viewport (top 90%)
        gsap.fromTo(
          step2Ref.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: step2Ref.current,
              start: "top 90%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          step3Ref.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: step3Ref.current,
              start: "top 90%",
              once: true,
            },
          }
        );

        // Arrows tied to their respective steps
        gsap.fromTo(
          arrow1Ref.current,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            overwrite: "auto",
            scrollTrigger: {
              trigger: step2Ref.current,
              start: "top 90%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          arrow2Ref.current,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            overwrite: "auto",
            scrollTrigger: {
              trigger: step3Ref.current,
              start: "top 90%",
              once: true,
            },
          }
        );

        // Stats reveal
        if (statsRef.current?.children) {
          gsap.fromTo(
            statsRef.current.children,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: { each: 0.1, from: "center" },
              overwrite: "auto",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                once: true,
              },
            }
          );
        }
      };

      // Run async setup
      setup();
    }, heroContentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-300/50 via-primary-200/30 to-transparent rounded-full blur-3xl opacity-70"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-secondary-300/40 via-secondary-200/25 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="hidden sm:block absolute top-1/3 left-0 w-[420px] h-[420px] bg-gradient-to-r from-emerald-300/35 to-transparent rounded-full blur-2xl opacity-40"></div>
      </div>

      <div
        ref={heroContentRef}
        className="relative max-w-7xl mx-auto text-center"
      >
        <div>
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 mb-8"
            style={{ opacity: 0 }}
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              Save 96% of your editing time
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight"
            style={{ opacity: 0 }}
          >
            <span style={{ display: "block", overflow: "hidden" }}>
              <span ref={titleLine1Ref} style={{ display: "inline-block" }}>
                Stop wasting hours
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span ref={titleLine2Ref} style={{ display: "inline-block" }}>
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  trimming silence.
                </span>
              </span>
            </span>
          </h1>

          <p
            ref={descriptionRef}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            style={{ opacity: 0 }}
          >
            {t("hero.description")}
          </p>

          <div
            ref={ctaRef}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ opacity: 0 }}
          >
            <a
              href="/download"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-4 h-4 mr-2" />
              {t("hero.cta.main")}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#demo"
              className="group inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            >
              <Play className="w-4 h-4 mr-2" />
              {t("hero.cta.secondary")}
            </a>
          </div>
        </div>

        <div className="mt-20 relative">
          {/* Three-step Process */}
          <div className="relative max-w-5xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div ref={step1Ref} className="space-y-4" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="text-lg text-gray-900">
                    <span className="font-semibold">
                      {t("hero.steps.step1.prefix")}
                    </span>{" "}
                    {t("hero.steps.step1.title")}
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <img
                      src="/assets/img/hero-step-1.jpg"
                      alt="Raw footage with silences"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Animated Arrow 1 */}
              <div
                ref={arrow1Ref}
                className="flex justify-center items-center gap-3 -my-4"
                style={{ opacity: 0 }}
              >
                <ArrowDown className="w-8 h-8 text-primary-500" />
              </div>

              {/* Step 2 */}
              <div ref={step2Ref} className="space-y-4" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-full font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="text-lg text-gray-900 flex items-center gap-2">
                    <span>
                      <span className="font-semibold">
                        {t("hero.steps.step2.prefix")}
                      </span>{" "}
                      {t("hero.steps.step2.title")}
                    </span>
                    <img
                      src="/assets/img/logo-autotrim.svg"
                      alt="AutoTrim"
                      className="h-5 w-auto"
                    />
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-secondary-100 to-secondary-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <img
                      src="/assets/img/hero-step-2.jpg"
                      alt="Trimly processing"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Animated Arrow 2 */}
              <div
                ref={arrow2Ref}
                className="flex justify-center items-center gap-3 -my-4"
                style={{ opacity: 0 }}
              >
                <ArrowDown className="w-8 h-8 text-secondary-500" />
              </div>

              {/* Step 3 */}
              <div ref={step3Ref} className="space-y-4" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full font-bold shadow-lg">
                    3
                  </div>
                  <h3 className="text-lg text-gray-900 flex items-center gap-2">
                    <span>
                      <span className="font-semibold">
                        {t("hero.steps.step3.prefix")}
                      </span>{" "}
                      {t("hero.steps.step3.title")}
                    </span>
                    <div className="flex items-center gap-1">
                      <img
                        src="/assets/img/fcpx-icon.png"
                        alt="Final Cut Pro"
                        className="h-4 w-auto"
                      />
                      <img
                        src="/assets/img/premiere-icon.svg"
                        alt="Adobe Premiere"
                        className="h-4 w-auto"
                      />
                      <img
                        src="/assets/img/resolve-icon.svg"
                        alt="DaVinci Resolve"
                        className="h-4 w-auto"
                      />
                    </div>
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <img
                      src="/assets/img/hero-step-3.jpg"
                      alt="Clean XML timeline"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

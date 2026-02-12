"use client";
import React, { useLayoutEffect, useRef } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  ArrowDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OptimizedImage from "./OptimizedImage";
import dynamic from "next/dynamic";
import { trackEvent } from "@/lib/tracking";

// Dynamic import with ssr: false to avoid loading Three.js on server
// and defer loading until after initial render
const AnimatedBackground = dynamic(
  () => import("../src/components/three/AnimatedBackground"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-300/50 via-primary-200/30 to-transparent rounded-full blur-3xl opacity-70"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-secondary-300/40 via-secondary-200/25 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="hidden sm:block absolute top-1/3 left-0 w-[420px] h-[420px] bg-gradient-to-r from-emerald-300/35 to-transparent rounded-full blur-2xl opacity-40"></div>
      </div>
    )
  }
);

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    let splitInst1 = null;
    let splitInst2 = null;

    const ctx = gsap.context(() => {
      // Hero elements
      const badge = rootRef.current?.querySelector(
        '[data-animate="hero-badge"]'
      );
      const titleLine1 = rootRef.current?.querySelector(
        '[data-animate="hero-title-line1"]'
      );
      const titleLine2 = rootRef.current?.querySelector(
        '[data-animate="hero-title-line2"]'
      );
      const description = rootRef.current?.querySelector(
        '[data-animate="hero-description"]'
      );
      const buttons = rootRef.current?.querySelectorAll(
        '[data-animate="hero-button"]'
      );

      // Badge animation with sparkle icon
      if (badge) {
        const icon = badge.querySelector('[data-animate="hero-badge-icon"]');
        gsap.set(badge, { opacity: 0, y: 20, scale: 0.9 });
        if (icon) gsap.set(icon, { rotate: -360, scale: 0 });

        gsap.to(badge, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          delay: 0.2,
        });

        if (icon) {
          gsap.to(icon, {
            rotate: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(2.5)",
            delay: 0.3,
          });
        }
      }

      // Title animation with proper wave effect
      const animateTitle = async () => {
        try {
          const mod = await import("@activetheory/split-text");
          const SplitText = mod.default || mod;

          // Split both lines into words
          if (titleLine1) {
            splitInst1 = new SplitText(titleLine1, { type: "words" });
            const words1 = splitInst1.words;

            gsap.set(words1, {
              yPercent: 120,
              display: "inline-block",
              willChange: "transform",
              force3D: true,
            });

            // Show title container
            gsap.set(titleRef.current, { visibility: 'visible', y: 0 });

            // Animate first line words
            gsap.to(words1, {
              yPercent: 0,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.05,
              delay: 0.4,
            });
          }

          if (titleLine2) {
            splitInst2 = new SplitText(titleLine2, { type: "words" });
            const words2 = splitInst2.words;

            // Preserve gradient classes
            words2.forEach((word) => {
              word.classList.add(
                "bg-gradient-to-r",
                "from-primary-500",
                "to-primary-600",
                "bg-clip-text",
                "text-transparent"
              );
            });

            gsap.set(words2, {
              yPercent: 120,
              display: "inline-block",
              willChange: "transform",
              force3D: true,
            });

            // Animate second line words with overlap
            gsap.to(words2, {
              yPercent: 0,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.05,
              delay: 0.6, // Start before first line finishes for wave effect
            });
          }
        } catch (e) {
          // Fallback without SplitText
          gsap.set(titleRef.current, { visibility: 'visible' });
          gsap.fromTo(
            titleLine1,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.9, ease: "power4.out", delay: 0.4 }
          );
          gsap.fromTo(
            titleLine2,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.9, ease: "power4.out", delay: 0.6 }
          );
        }
      };

      if (titleRef.current) {
        gsap.set(titleRef.current, { visibility: 'hidden' });
        animateTitle();
      }

      // Description animation
      if (description) {
        gsap.set(description, { opacity: 0, y: 30 });
        gsap.to(description, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1,
        });
      }

      // Buttons animation with bounce
      if (buttons.length) {
        gsap.set(buttons, { opacity: 0, y: 30, scale: 0.9 });
        gsap.to(buttons, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.5)",
          stagger: 0.1,
          delay: 1.2,
        });
      }

      // Steps
      const steps = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="hero-step"]')
      );
      const arrows = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="hero-arrow"]')
      );

      // Steps animation with sophisticated reveals
      steps.forEach((step, i) => {
        const badge = step.querySelector('[data-animate="step-badge"]');
        const title = step.querySelector('[data-animate="step-title"]');
        const logos = step.querySelectorAll('[data-animate="step-logo"]');
        const image = step.querySelector('[data-animate="step-image"]');
        const glow = step.querySelector('[data-animate="step-glow"]');

        // Initial states
        gsap.set(step, { opacity: 0, y: 60 });
        if (badge) gsap.set(badge, { scale: 0, rotate: -180 });
        if (title) gsap.set(title, { x: -30, opacity: 0 });
        if (logos.length) gsap.set(logos, { scale: 0, rotate: -90 });
        if (image) {
          gsap.set(image, { 
            opacity: 0,
            y: 20,
            filter: "blur(10px)"
          });
        }
        if (glow) gsap.set(glow, { opacity: 0 });

        // Step entrance - delay first step to appear after hero CTA animation
        ScrollTrigger.create({
          trigger: step,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({
              delay: i === 0 ? 1.4 : 0 // First step waits for hero animations to finish
            });

            // Main step container
            tl.to(step, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });

            // Badge animation
            if (badge) {
              tl.to(
                badge,
                {
                  scale: 1,
                  rotate: 0,
                  duration: 0.6,
                  ease: "back.out(2)",
                },
                "-=0.6"
              );
            }

            // Title slide
            if (title) {
              tl.to(
                title,
                {
                  x: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: "power3.out",
                },
                "-=0.5"
              );
            }

            // Logos animation
            if (logos.length) {
              tl.to(
                logos,
                {
                  scale: 1,
                  rotate: 0,
                  duration: 0.4,
                  ease: "back.out(1.7)",
                  stagger: 0.05,
                },
                "-=0.4"
              );
            }

            // Image reveal with blur and slide
            if (image) {
              tl.to(
                image,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.8,
                  ease: "power2.out",
                },
                "-=0.3"
              );
            }

            // Glow effect
            if (glow) {
              tl.to(
                glow,
                {
                  opacity: 0.5,
                  duration: 1.2,
                  ease: "power2.inOut",
                },
                "-=0.8"
              );
            }
          },
        });

        // Arrow animation (appears after step)
        if (arrows[i]) {
          gsap.set(arrows[i], { opacity: 0, y: -20, scale: 0 });

          ScrollTrigger.create({
            trigger: arrows[i],
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.to(arrows[i], {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
              });

              // Add subtle bounce animation
              gsap.to(arrows[i], {
                y: 10,
                duration: 1,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true,
                delay: 0.5,
              });
            },
          });
        }
      });
    }, rootRef);

    return () => {
      try {
        splitInst1?.revert && splitInst1.revert();
        splitInst2?.revert && splitInst2.revert();
      } catch {}
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Three.js Animated Background - loaded dynamically after hydration */}
      <AnimatedBackground />

      <div className="relative max-w-7xl mx-auto text-center">
        <div>
          <div
            data-animate="hero-badge"
            className="opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 mb-8"
          >
            <Sparkles
              data-animate="hero-badge-icon"
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm font-medium text-primary-700">
              {t("hero.badge")}
            </span>
          </div>

          <h1
            ref={titleRef}
            data-animate="hero-title"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mx-auto"
            style={{ visibility: 'hidden' }}
          >
            <span className="block overflow-hidden">
              <span data-animate="hero-title-line1" className="inline-block">
                {t("hero.titleLine1")}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                data-animate="hero-title-line2"
                className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent"
              >
                {t("hero.titleLine2")}
              </span>
            </span>
          </h1>

          <p
            data-animate="hero-description"
            className="opacity-0 mt-6 text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            {t("hero.description")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              data-animate="hero-button"
              href={`/${currentLocale}/download`}
              onClick={() => trackEvent("cta_clicked", { location: "hero", type: "download" })}
              className="opacity-0 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-4 h-4 mr-2" />
              {t("hero.cta.main")}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              data-animate="hero-button"
              href="#demo"
              onClick={() => trackEvent("cta_clicked", { location: "hero", type: "watch_demo" })}
              className="opacity-0 group inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
            >
              <Play className="w-4 h-4 mr-2" />
              {t("hero.cta.secondary")}
            </a>
          </div>
        </div>

        <div className="mt-20 relative">
          {/* Three-step Process */}
          <h2 className="sr-only">How it works in three steps</h2>
          <div className="relative max-w-5xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div data-animate="hero-step" className="opacity-0 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    data-animate="step-badge"
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full font-bold shadow-lg"
                  >
                    1
                  </div>
                  <h3
                    data-animate="step-title"
                    className="text-lg text-gray-900"
                  >
                    <span className="font-semibold">
                      {t("hero.steps.step1.prefix")}
                    </span>{" "}
                    {t("hero.steps.step1.title")}
                  </h3>
                </div>
                <div className="relative group">
                  <div
                    data-animate="step-glow"
                    className="absolute rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
                  ></div>
                  <div className="relative bg-white rounded-xl overflow-hidden">
                    <OptimizedImage
                      data-animate="step-image"
                      src="/assets/img/hero-step-1.jpg"
                      alt="Raw footage with silences"
                      className="w-full"
                      width={400}
                      height={300}
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Animated Arrow 1 */}
              <div
                data-animate="hero-arrow"
                className="opacity-0 flex justify-center items-center gap-3 -my-4"
              >
                <ArrowDown className="w-8 h-8 text-primary-500" />
              </div>

              {/* Step 2 */}
              <div data-animate="hero-step" className="opacity-0 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    data-animate="step-badge"
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-full font-bold shadow-lg"
                  >
                    2
                  </div>
                  <h3
                    data-animate="step-title"
                    className="text-lg text-gray-900 flex items-center gap-2"
                  >
                    <span>
                      <span className="font-semibold">
                        {t("hero.steps.step2.prefix")}
                      </span>{" "}
                      {t("hero.steps.step2.title")}
                    </span>
                    <img
                      data-animate="step-logo"
                      src="/assets/img/logo-autotrim.svg"
                      alt="AutoTrim"
                      className="h-5 w-auto"
                    />
                  </h3>
                </div>
                <div className="relative group">
                  <div
                    data-animate="step-glow"
                    className="absolute from-secondary-100 to-secondary-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
                  ></div>
                  <div className="relative bg-white rounded-xl overflow-hidden">
                    <OptimizedImage
                      data-animate="step-image"
                      src="/assets/img/hero-step-2.jpg"
                      alt="Trimly processing"
                      className="w-full"
                      width={400}
                      height={300}
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Animated Arrow 2 */}
              <div
                data-animate="hero-arrow"
                className="opacity-0 flex justify-center items-center gap-3 -my-4"
              >
                <ArrowDown className="w-8 h-8 text-secondary-500" />
              </div>

              {/* Step 3 */}
              <div data-animate="hero-step" className="opacity-0 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    data-animate="step-badge"
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full font-bold shadow-lg"
                  >
                    3
                  </div>
                  <h3
                    data-animate="step-title"
                    className="text-lg text-gray-900 flex items-center gap-2"
                  >
                    <span>
                      <span className="font-semibold">
                        {t("hero.steps.step3.prefix")}
                      </span>{" "}
                      {t("hero.steps.step3.title")}
                    </span>
                    <div className="flex items-center gap-1">
                      <OptimizedImage
                        data-animate="step-logo"
                        src="/assets/img/fcpx-icon.png"
                        alt="Final Cut Pro"
                        className="h-4 w-auto"
                        width={32}
                        height={32}
                        priority
                      />
                      <OptimizedImage
                        data-animate="step-logo"
                        src="/assets/img/premiere-icon.svg"
                        alt="Adobe Premiere"
                        className="h-4 w-auto"
                        width={32}
                        height={32}
                        priority
                      />
                      <OptimizedImage
                        data-animate="step-logo"
                        src="/assets/img/resolve-icon.svg"
                        alt="DaVinci Resolve"
                        className="h-4 w-auto"
                        width={32}
                        height={32}
                        priority
                      />
                    </div>
                  </h3>
                </div>
                <div className="relative group">
                  <div
                    data-animate="step-glow"
                    className="absolute rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
                  ></div>
                  <div className="relative bg-white rounded-xl overflow-hidden">
                    <OptimizedImage
                      data-animate="step-image"
                      src="/assets/img/hero-step-3.jpg"
                      alt="Clean XML timeline"
                      className="w-full"
                      width={400}
                      height={300}
                      priority
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

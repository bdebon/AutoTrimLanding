"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Clock, ChevronDown, Activity, Gauge, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

const TimeSavings = () => {
  const t = useTranslations('timeSavings');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const accordionRef = useRef(null);

  // Prepare accordion container
  useLayoutEffect(() => {
    if (accordionRef.current) {
      gsap.set(accordionRef.current, {
        height: 0,
        opacity: 0,
        overflow: "hidden",
      });
    }
  }, []);

  // Animations: title wave + cards entrances
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const titleTextRef = useRef(null);
  // Bars data (seconds) for comparison chart
  const barsData = [
    {
      label: t('methods.manual.name'),
      subtitle: t('methods.manual.description'),
      timeLabel: t('methods.manual.time'),
      seconds: 48 * 60,
      color: "from-gray-600 to-gray-700",
      bgColor: "from-gray-50 to-gray-100",
      Icon: Clock,
      speed: t('methods.manual.speed'),
      percentage: 100,
    },
    {
      label: t('methods.otherTools.name'),
      subtitle: t('methods.otherTools.description'),
      timeLabel: t('methods.otherTools.time'),
      seconds: 20 * 60,
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-50 to-gray-100",
      Icon: Activity,
      speed: t('methods.otherTools.speed'),
      percentage: 42,
    },
    {
      label: t('methods.autoTrim.name'),
      subtitle: t('methods.autoTrim.description'),
      timeLabel: t('methods.autoTrim.time'),
      seconds: 60,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 via-green-50 to-emerald-100",
      Icon: Zap,
      speed: t('methods.autoTrim.speed'),
      percentage: 2.1,
      highlight: true,
    },
  ];

  useLayoutEffect(() => {
    // Hoisted reference for cleanup
    let splitInst = null;

    const ctx = gsap.context(() => {
      const icon = rootRef.current?.querySelector('[data-animate="ts-icon"]');
      const subtitle = rootRef.current?.querySelector(
        '[data-animate="ts-subtitle"]'
      );

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

      // Subtitle animation
      if (subtitle) {
        gsap.set(subtitle, { y: 20, opacity: 0 });
        gsap.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
          delay: 0.5,
        });
      }

      // Helper: build a paused bars timeline; play when ready
      const buildBarsTimeline = () => {
        const stage = rootRef.current?.querySelector(
          '[data-animate="ts-stage"]'
        );
        if (!stage) return null;
        const rows = gsap.utils.toArray(
          stage.querySelectorAll('[data-animate="bar-row"]')
        );
        const max = Math.max(...barsData.map((b) => b.seconds));
        const tl = gsap.timeline({ paused: true });

        rows.forEach((row, i) => {
          const card = row.querySelector('[data-animate="bar-card"]');
          const bar = row.querySelector('[data-animate="bar-fill"]');
          const val = row.querySelector('[data-animate="bar-value"]');
          const speed = row.querySelector('[data-animate="bar-speed"]');
          const icon = row.querySelector('[data-animate="bar-icon"]');
          const pct = Math.max(4, (barsData[i].seconds / max) * 100);

          // Initial states
          gsap.set(card, { opacity: 0, y: 40, scale: 0.9 });
          gsap.set(bar, { width: 0 });
          if (icon) gsap.set(icon, { scale: 0, rotate: -180 });
          if (speed) gsap.set(speed, { opacity: 0, x: -20 });

          // Card entrance
          tl.to(
            card,
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
            i * 0.15
          );

          // Icon animation
          if (icon) {
            tl.to(
              icon,
              { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(1.4)" },
              i * 0.15 + 0.1
            );
          }

          // Bar fill with more dramatic effect
          tl.to(
            bar,
            {
              width: `${pct}%`,
              duration: 1.2,
              ease: "power3.inOut",
              onUpdate: function () {
                // Add glow effect during animation for AutoTrim
                if (barsData[i].highlight && this.progress() > 0.5) {
                  gsap.set(bar, {
                    boxShadow: "0 0 20px rgba(14,165,233,0.5)",
                  });
                }
              },
            },
            i * 0.15 + 0.2
          );

          // Value and speed appear
          tl.fromTo(
            val,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
            i * 0.15 + 0.4
          );

          if (speed) {
            tl.to(
              speed,
              { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
              i * 0.15 + 0.6
            );
          }
        });

        return tl;
      };

      let barsTl = buildBarsTimeline();
      // Title: SplitText wave with proper centering
      if (titleRef.current && titleTextRef.current) {
        const sectionTrigger = rootRef.current;
        gsap.set(titleRef.current, { y: 30 });

        ScrollTrigger.create({
          trigger: sectionTrigger,
          start: "top 85%",
          once: true,
          onEnter: async () => {
            try {
              const mod = await import("@activetheory/split-text");
              const SplitText = mod.default || mod;
              splitInst = new SplitText(titleTextRef.current, {
                type: "words",
              });
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
                stagger: { each: 0.06, from: "start" },
                delay: 0.3,
                onComplete: () => {
                  barsTl && barsTl.play();
                },
              });
            } catch (e) {
              // Fallback animation
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.3,
                onComplete: () => {
                  barsTl && barsTl.play();
                },
              });
            }
          },
        });
      }

      // Old cards trigger removed; handled by barsTl built above
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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div data-animate="ts-icon" className="mb-4 flex justify-center">
            <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl">
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mx-auto mb-4 overflow-hidden"
            style={{ opacity: 0 }}
          >
            <span ref={titleTextRef}>
              {t('title')}
            </span>
          </h2>
          <p
            data-animate="ts-subtitle"
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Comparison visualization */}
        <div data-animate="ts-stage" className="relative max-w-5xl mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-100/20 to-blue-100/20 rounded-full blur-3xl" />
          </div>

          <div className="relative grid gap-6">
            {barsData.map((d) => (
              <div key={d.label} data-animate="bar-row" className="relative">
                <div
                  data-animate="bar-card"
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
                    d.bgColor
                  } ${
                    d.highlight
                      ? "ring-2 ring-emerald-400 ring-offset-2 shadow-2xl"
                      : "shadow-xl"
                  }`}
                >
                  {/* Inner content */}
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div
                          data-animate="bar-icon"
                          className={`p-3 rounded-xl bg-white shadow-md ${
                            d.highlight ? "ring-2 ring-emerald-200" : ""
                          }`}
                        >
                          <d.Icon
                            className={`w-6 h-6 ${
                              d.highlight ? "text-emerald-600" : "text-gray-700"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {d.label}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {d.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          data-animate="bar-value"
                          className={`text-2xl font-black ${
                            d.highlight
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700"
                              : "text-gray-900"
                          }`}
                        >
                          {d.timeLabel}
                        </div>
                        <div
                          data-animate="bar-speed"
                          className={`text-sm font-medium mt-1 ${
                            d.highlight ? "text-emerald-600" : "text-gray-500"
                          }`}
                        >
                          {d.speed}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative">
                      <div className="w-full h-2 rounded-full bg-white/50 overflow-hidden">
                        <div
                          data-animate="bar-fill"
                          className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                          style={{ width: 0 }}
                        />
                      </div>
                      {/* Percentage indicator */}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">0 min</span>
                        <span
                          className={`text-xs font-semibold ${
                            d.highlight ? "text-emerald-600" : "text-gray-600"
                          }`}
                        >
{d.percentage}{t('percentManual')}
                        </span>
                        <span className="text-xs text-gray-500">48 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-xs text-gray-600 text-center relative">
            <button
              type="button"
              className="mx-auto inline-flex items-center gap-2 hover:text-gray-800"
              aria-expanded={isAccordionOpen}
              aria-controls="ts-accordion"
              onClick={() => {
                const open = !isAccordionOpen;
                setIsAccordionOpen(open);
                if (!accordionRef.current) return;
                if (open) {
                  gsap.to(accordionRef.current, {
                    height: "auto",
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                } else {
                  gsap.to(accordionRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                  });
                }
              }}
            >
<span>{t('realCase.title')}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isAccordionOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            id="ts-accordion"
            ref={accordionRef}
            className={`mt-4 max-w-3xl mx-auto text-left overflow-hidden ${
              !isAccordionOpen ? "pointer-events-none" : ""
            }`}
            aria-hidden={!isAccordionOpen}
            style={{ height: 0, opacity: 0, overflow: "hidden" }}
          >
            <div className="bg-white/70 backdrop-blur-[1px] rounded-xl border border-gray-100 p-4 sm:p-6 text-gray-800">
              {/* Section: Real test case */}
              <div className="space-y-3">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                  {t('realCase.test.title')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">{t('realCase.test.rawClip')}</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {t('realCase.test.duration')}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">
                      {t('realCase.test.manualFCP')}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {t('realCase.test.manualTime')}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">{t('realCase.test.autoTrimLabel')}</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {t('realCase.test.autoTrimTime')}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 inline-block">
{t('realCase.test.result')}
                </div>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Section: Client scenario */}
              <div className="space-y-4">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                  Realistic scenario (client case)
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>
                    6 clips of 5 min ={" "}
                    <span className="font-semibold text-gray-900">
                      30 min raw
                    </span>
                  </li>
                  <li>
                    Manual (FCP): 30 min × 1.61 ≈{" "}
                    <span className="font-semibold text-gray-900">
                      48 min 18 s
                    </span>
                  </li>
                  <li>
                    AutoTrim: batch processing on 30 min raw ={" "}
                    <span className="font-semibold text-gray-900">
                      1 min total
                    </span>
                  </li>
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">
                      Manual total
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      48 min 18 s
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">
                      AutoTrim total
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      1 min
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">Time saved</div>
                    <div className="text-sm font-semibold text-gray-900">
                      ~47 min 18 s
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">~97.9% reduction</span> —{" "}
                  <span className="font-semibold">≈ 48× faster</span>
                </div>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Section: Vs. other tools */}
              <div className="space-y-4">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                  {t('realCase.vsOtherTools.title')}
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>{t('realCase.vsOtherTools.similarSpeed')}</li>
                  <li>{t('realCase.vsOtherTools.noParallel')}</li>
                  <li>{t('realCase.vsOtherTools.oneXmlPerClip')}</li>
                </ul>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-amber-900 text-sm">
                  {t('realCase.vsOtherTools.sequential')}
                  <br />
                  {t('realCase.vsOtherTools.autoTrimBetter')}
                  <br />
                  {t('realCase.vsOtherTools.gain')}
                </div>
              </div>

              <p className="mt-6 text-[11px] text-gray-500">
                {t('realCase.notes')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeSavings;

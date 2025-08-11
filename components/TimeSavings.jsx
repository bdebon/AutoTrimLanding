import React, { useLayoutEffect, useRef, useState } from "react";
import { Zap, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TimeSavings = () => {
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
      label: "Manual editing",
      timeLabel: "48 min",
      seconds: 48 * 60,
      color: "from-red-400 to-rose-500",
    },
    {
      label: "Other tools",
      timeLabel: "20 min",
      seconds: 20 * 60,
      color: "from-amber-400 to-orange-500",
    },
    {
      label: "AutoTrim",
      timeLabel: "1 min 40 s",
      seconds: 100,
      color: "from-primary-500 to-primary-600",
    },
  ];

  useLayoutEffect(() => {
    // Hoisted reference for cleanup
    let splitInst = null;

    const ctx = gsap.context(() => {
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
          const bar = row.querySelector('[data-animate="bar-fill"]');
          const val = row.querySelector('[data-animate="bar-value"]');
          const pct = Math.max(4, (barsData[i].seconds / max) * 100);
          gsap.set(bar, { width: 0 });
          tl.to(
            bar,
            { width: `${pct}%`, duration: 1.0, ease: "power3.out" },
            i * 0.12
          );
          tl.fromTo(
            val,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
            i * 0.12 + 0.15
          );
        });
        // Bars timeline intentionally has no own ScrollTrigger.
        // It will be played by the title wave timeline (or its fallback),
        // ensuring bars fill only after the title finishes revealing.
        return tl;
      };

      let barsTl = buildBarsTimeline();
      // Title: SplitText wave with line masking (single split: lines + words)
      if (titleRef.current && titleTextRef.current) {
        const sectionTrigger = rootRef.current;
        // Prepare for SSR hidden; wave on enter
        gsap.set(titleRef.current, { y: 24, willChange: "transform" });
        ScrollTrigger.create({
          trigger: sectionTrigger,
          start: "top 85%",
          once: true,
          onEnter: async () => {
            try {
              const mod = await import("@activetheory/split-text");
              const SplitText = mod.default || mod;
              // Single split call to get lines and words
              splitInst = new SplitText(titleTextRef.current, {
                type: "lines, words",
              });
              const lines = splitInst.lines || [];
              gsap.set(lines, { overflow: "hidden", display: "block" });
              // Collect words per line by querying within each line
              const perLineWords = lines.map((ln) =>
                Array.from(ln.querySelectorAll("span"))
              );
              const allWords = perLineWords.flat();
              gsap.set(allWords, {
                yPercent: 160,
                display: "inline-block",
                willChange: "transform",
                force3D: true,
              });

              // Reveal title wrapper then animate words line by line for a wave
              gsap.set(titleRef.current, {
                opacity: 1,
                visibility: "visible",
                y: 0,
              });
              const tl = gsap.timeline();
              perLineWords.forEach((words, i) => {
                tl.to(
                  words,
                  {
                    yPercent: 0,
                    duration: 1.05,
                    ease: "power4.out",
                    stagger: { each: 0.08, from: "start" },
                  },
                  i * 0.08
                );
              });
              // When the title wave completes, play bars after a slight delay
              tl.call(
                () => {
                  barsTl && barsTl.play();
                },
                null,
                ">+0.15"
              );
            } catch (e) {
              // Fallback: simple fade/slide
              gsap.to(titleRef.current, {
                opacity: 1,
                visibility: "visible",
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              });
              // Also play bars in fallback after a small delay
              if (barsTl) gsap.delayedCall(0.15, () => barsTl.play());
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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mx-auto"
            style={{ opacity: 0, visibility: "hidden", overflow: "hidden" }}
          >
            <span ref={titleTextRef} className="inline-block">
              AutoTrim saves you time. A lot of time.
            </span>
          </h2>
        </div>

        {/* Comparison bars stage */}
        <div data-animate="ts-stage" className="relative max-w-3xl mx-auto">
          {/* Radial gradient background for subtle depth */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(14,165,233,0.20) 0%, rgba(14,165,233,0.10) 40%, rgba(56,189,248,0.04) 65%, transparent 85%)",
              }}
            />
          </div>

          <div className="relative space-y-8">
            {barsData.map((d) => (
              <div key={d.label} data-animate="bar-row">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    {d.label}
                  </div>
                  <div
                    data-animate="bar-value"
                    className="text-sm font-semibold text-gray-700"
                  >
                    {d.timeLabel}
                  </div>
                </div>
                <div className="w-full h-4 rounded-full bg-gray-200/70 overflow-hidden">
                  <div
                    data-animate="bar-fill"
                    className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-gray-600 text-center relative">
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
              <span>Based on a real client case: 30 min of raw footage</span>
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
                  Real test case
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">Raw clip</div>
                    <div className="text-sm font-semibold text-gray-900">
                      1 min 33 s
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">
                      Manual (FCP)
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      2 min 30 s (150 s)
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="text-[11px] text-gray-500">AutoTrim</div>
                    <div className="text-sm font-semibold text-gray-900">
                      8 s
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 inline-block">
                  ≈ 19× faster
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
                    <span className="font-semibold text-gray-900">30 min raw</span>
                  </li>
                  <li>
                    Manual (FCP): 30 min × 1.61 ≈{" "}
                    <span className="font-semibold text-gray-900">48 min 18 s</span>
                  </li>
                  <li>
                    AutoTrim: batch processing on 30 min raw ={" "}
                    <span className="font-semibold text-gray-900">1 min total</span>
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
                  Vs. other tools
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>Similar per‑clip processing speed (~50 s)</li>
                  <li>
                    <span className="font-semibold">
                      No parallel processing
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">One XML per clip</span> →
                    manual merge in FCP
                  </li>
                </ul>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-amber-900 text-sm">
                  Sequential: 6 × 50 s ={" "}
                  <span className="font-semibold">5 min</span> + merge 6 × 2 min
                  30 s = <span className="font-semibold">15 min</span> →{" "}
                  <span className="font-semibold">20 min total</span>
                  <br />
                  AutoTrim: <span className="font-semibold">1 min</span> + single XML → <span className="font-semibold">no merge</span>
                  <br />
                  <span className="font-semibold">Gain:</span> ~19 min —{" "}
                  <span className="font-semibold">95% reduction</span> —{" "}
                  <span className="font-semibold">≈ 20× faster</span>
                </div>
              </div>

              <p className="mt-6 text-[11px] text-gray-500">
                Notes: tests réalisés sur des rushs parlés, timings variables
                selon machine, source audio et paramètres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeSavings;

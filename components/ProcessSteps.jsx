import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProcessSteps = () => {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const steps = [
    {
      number: "1",
      title: "Drop your files",
      description:
        "Drag & drop your clips. They appear instantly in the queue, ready to go.",
      gif: "/assets/img/gif1.gif",
      alt: "Drag and drop video files into AutoTrim interface for automatic silence removal",
    },
    {
      number: "2",
      title: "Trim in parallel",
      description:
        'Hit "Process" and let AutoTrim analyze all files at once. Preview your timeline as soon as a clip is done.',
      gif: "/assets/img/gif2.gif",
      alt: "AutoTrim processing multiple video files in parallel with automatic silence detection",
    },
    {
      number: "3",
      title: "One timeline, all clips",
      description:
        "AutoTrim automatically merges ALL your processed clips into ONE single timeline. Everything is already assembled and ready to edit - just export and go.",
      gif: "/assets/img/gif3.gif",
      alt: "Single unified timeline export with all clips already assembled in AutoTrim",
    },
  ];

  useLayoutEffect(() => {
    let splitInst = null;

    const ctx = gsap.context(() => {
      const title = rootRef.current?.querySelector(
        '[data-animate="how-title"]'
      );
      const desc = rootRef.current?.querySelector('[data-animate="how-desc"]');
      const cards = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="how-card"]')
      );

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
                stagger: { each: 0.06, from: "start" },
              });
            } catch (e) {
              // Fallback animation
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              });
            }
          },
        });
      }

      // Description animation
      if (desc) {
        gsap.set(desc, { y: 20, opacity: 0 });
        gsap.to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
          delay: 0.3,
        });
      }

      // Cards animation with sophisticated reveals
      cards.forEach((card, i) => {
        const badge = card.querySelector('[data-animate="how-badge"]');
        const h3 = card.querySelector('[data-animate="how-h3"]');
        const p = card.querySelector('[data-animate="how-p"]');
        const gif = card.querySelector('[data-animate="how-gif"]');
        const accent = card.querySelector('[data-animate="how-accent"]');
        const isEven = i % 2 === 0;

        // Initial states
        gsap.set(card, { opacity: 0, y: 60 });
        if (badge) gsap.set(badge, { scale: 0, rotate: -360, opacity: 0 });
        if (h3) gsap.set(h3, { opacity: 0, x: isEven ? -40 : 40 });
        if (p) gsap.set(p, { opacity: 0, y: 20 });
        if (accent) gsap.set(accent, { opacity: 0, x: -20 });
        if (gif) {
          gsap.set(gif, {
            opacity: 0,
            scale: 1.05,
            filter: "brightness(0.4) saturate(0.5)",
          });
        }

        // Create timeline for each card
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();

            // Card entrance
            tl.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            });

            // GIF animation with sophisticated reveal
            if (gif) {
              tl.to(
                gif,
                {
                  opacity: 1,
                  scale: 1,
                  filter: "brightness(1) saturate(1)",
                  duration: 1.2,
                  ease: "power2.out",
                },
                "-=0.7"
              );
            }

            // Badge animation with bounce
            if (badge) {
              tl.to(
                badge,
                {
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: "back.out(1.7)",
                },
                "-=1"
              );
            }

            // Title slide in
            if (h3) {
              tl.to(
                h3,
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.7,
                  ease: "power3.out",
                },
                "-=0.9"
              );
            }

            // Paragraph fade up
            if (p) {
              tl.to(
                p,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power3.out",
                },
                "-=0.6"
              );
            }

            // Accent line
            if (accent) {
              tl.to(
                accent,
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.6,
                  ease: "power3.out",
                },
                "-=0.4"
              );
            }
          },
        });
      });
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
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div ref={rootRef} className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            data-animate="how-title"
            className="mx-auto text-3xl sm:text-4xl font-bold text-gray-900 mb-4 overflow-hidden"
            style={{ opacity: 0 }}
          >
            How to Automatically Trim Video Silences in Seconds
          </h2>
          <p
            data-animate="how-desc"
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            style={{ opacity: 0 }}
          >
            From raw clips to a clean timeline — here's how AutoTrim works
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              data-animate="how-card"
              className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* GIF side */}
              <div
                className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent" />
                  <img
                    data-animate="how-gif"
                    src={step.gif}
                    alt={step.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Floating step number */}
                  <div
                    data-animate="how-badge"
                    className="absolute top-6 left-6 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl font-bold text-2xl shadow-xl"
                  >
                    {step.number}
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-6">
                  <h3
                    data-animate="how-h3"
                    className="text-3xl lg:text-4xl font-bold text-gray-900"
                  >
                    {step.title}
                  </h3>
                  <p
                    data-animate="how-p"
                    className="text-lg lg:text-xl text-gray-600 leading-relaxed"
                  >
                    {step.description}
                  </p>

                  {/* Visual enhancement */}
                  <div
                    data-animate="how-accent"
                    className="flex items-center gap-3 pt-4"
                  >
                    <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
                    <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                      Step {step.number} of 3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;

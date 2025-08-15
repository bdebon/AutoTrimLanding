"use client";
import React, { useLayoutEffect, useRef } from "react";
import {
  Upload,
  Cpu,
  Sliders,
  Sparkles,
  Film,
  MonitorPlay,
  RefreshCcw,
  Globe,
  Zap,
  Star,
  ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PerksGrid = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleTextRef = useRef(null);
  let splitInst = null;
  const perks = [
    {
      icon: Upload,
      title: "Drag & Drop Everything",
      desc: "Drop any number of clips; AutoTrim ingests them instantly, whatever the format.",
      size: "normal",
      iconBg: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-500/10 to-blue-600/20",
      featured: true,
    },
    {
      icon: Sparkles,
      title: "Smart Presets",
      desc: "YouTube, Podcast, Vlog… one click applies the perfect settings.",
      size: "normal",
      iconBg: "from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-600",
      gradient: "from-yellow-500/10 to-yellow-600/20",
      featured: false,
    },
    {
      icon: Sliders,
      title: "Fine-Tune Cuts",
      desc: "Silence threshold, pre/post-roll, min gap – dial in your exact editing style.",
      size: "large",
      gifPath: "/assets/img/perks1.gif",
      iconBg: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-500/10 to-green-600/20",
      featured: false,
    },
    {
      icon: Film,
      title: "Single or Multi-XML",
      desc: "Export one clean timeline or individual XMLs – no more puzzle pieces.",
      size: "normal",
      iconBg: "from-red-50 to-red-100",
      iconColor: "text-red-600",
      gradient: "from-red-500/10 to-red-600/20",
      featured: true,
    },
    {
      icon: MonitorPlay,
      title: "100% Local Processing",
      desc: "AI, video processing, everything runs on your machine. No uploads, no waiting, maximum speed.",
      size: "normal",
      iconBg: "from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
      gradient: "from-indigo-500/10 to-indigo-600/20",
      featured: false,
    },
    {
      icon: Cpu,
      title: "Parallel Processing",
      desc: "Max out your cores: up to 4 jobs run side-by-side for zero downtime.",
      size: "large",
      gifPath: "/assets/img/perks3.gif",
      iconBg: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      gradient: "from-purple-500/10 to-purple-600/20",
      featured: true,
    },
    {
      icon: RefreshCcw,
      title: "Repetition & Hesitation Remover",
      desc: "Cuts filler words and double-takes automatically.",
      comingSoon: true,
      size: "normal",
      iconBg: "from-pink-50 to-pink-100",
      iconColor: "text-pink-600",
      gradient: "from-pink-500/10 to-pink-600/20",
      featured: false,
    },
    {
      icon: Globe,
      title: "Multilingual & Format-Agnostic",
      desc: "French, English, Spanish… MP4, MOV, MKV – it just works.",
      size: "normal",
      iconBg: "from-teal-50 to-teal-100",
      iconColor: "text-teal-600",
      gradient: "from-teal-500/10 to-teal-600/20",
      featured: false,
    },
    {
      icon: Zap,
      title: "Blazing-Fast Preview",
      desc: "Scrub in real-time, no lag, even on long footage.",
      size: "normal",
      iconBg: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      gradient: "from-orange-500/10 to-orange-600/20",
      featured: false,
    },
    {
      icon: Cpu,
      title: "Optimized for Pro Editing Machines",
      desc: "AutoTrim is built for the hardware you already own. It runs AI models locally, using the full power of your CPU and GPU — with no slow uploads and no extra server costs.",
      size: "normal",
      iconBg: "from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-600",
      gradient: "from-cyan-500/10 to-cyan-600/20",
      featured: true,
    },
  ];

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const descEl = sectionRef.current.querySelector('[data-animate="perks-desc"]');
      const cardEls = gsap.utils.toArray(sectionRef.current.querySelectorAll('[data-animate="perks-card"]'));

      // Title animation with SplitText
      if (titleRef.current && titleTextRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: titleRef.current,
          start: "top 85%",
          once: true,
          onEnter: async () => {
            try {
              const mod = await import("@activetheory/split-text");
              const SplitText = mod.default || mod;
              splitInst = new SplitText(titleTextRef.current, { type: "words" });
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
                delay: 0.2,
              });
            } catch (e) {
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.2,
              });
            }
          },
        });
      }

      // Description animation
      if (descEl) {
        gsap.set(descEl, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: descEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(descEl, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.6,
            });
          },
        });
      }

      // Cards sophisticated animation - all triggered together when first card enters viewport
      if (cardEls.length) {
        // Set initial states for all cards
        cardEls.forEach((card) => {
          const icon = card.querySelector('[data-animate="perk-icon"]');
          const content = card.querySelector('[data-animate="perk-content"]');
          const image = card.querySelector('[data-animate="perk-image"]');
          const badge = card.querySelector('[data-animate="perk-badge"]');
          const glow = card.querySelector('[data-animate="perk-glow"]');
          const featured = card.querySelector('[data-animate="perk-featured"]');

          gsap.set(card, { opacity: 0, y: 60, scale: 0.9 });
          if (icon) gsap.set(icon, { scale: 0, rotate: -180 });
          if (content) gsap.set(content, { opacity: 0, y: 20 });
          if (image) gsap.set(image, { opacity: 0, scale: 1.1 });
          if (badge) gsap.set(badge, { opacity: 0, scale: 0, rotate: 45 });
          if (glow) gsap.set(glow, { opacity: 0, scale: 1.2 });
          if (featured) gsap.set(featured, { opacity: 0, scale: 0 });
        });

        // Create main timeline triggered by first card
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: cardEls[0], // Trigger on first card only
            start: "top 90%",
            once: true,
          },
        });

        // Animate all cards with stagger
        cardEls.forEach((card, i) => {
          const icon = card.querySelector('[data-animate="perk-icon"]');
          const content = card.querySelector('[data-animate="perk-content"]');
          const image = card.querySelector('[data-animate="perk-image"]');
          const badge = card.querySelector('[data-animate="perk-badge"]');
          const glow = card.querySelector('[data-animate="perk-glow"]');
          const featured = card.querySelector('[data-animate="perk-featured"]');
          
          const delay = i * 0.12; // Stagger delay

          // Card reveal with bounce
          mainTl.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.4)",
          }, delay);

          // Glow effect
          if (glow) {
            mainTl.to(glow, {
              opacity: 0.08,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            }, delay + 0.2);
          }

          // Icon animation with spin
          if (icon) {
            mainTl.to(icon, {
              scale: 1,
              rotate: 0,
              duration: 0.7,
              ease: "back.out(2.5)",
            }, delay + 0.3);
          }

          // Content slide up
          if (content) {
            mainTl.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            }, delay + 0.4);
          }

          // Image fade in (for large cards)
          if (image) {
            mainTl.to(image, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
            }, delay + 0.2);
          }

          // Badge animation
          if (badge) {
            mainTl.to(badge, {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.5,
              ease: "back.out(1.7)",
            }, delay + 0.5);
          }

          // Featured star
          if (featured) {
            mainTl.to(featured, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(2)",
            }, delay + 0.6);
          }
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (splitInst) {
        splitInst.revert();
        splitInst = null;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-24 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-green-100 to-blue-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Title with SplitText */}
          <div ref={titleRef} className="mb-6 overflow-hidden">
            <h2 
              ref={titleTextRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mx-auto"
            >
              Why creators never go back.
            </h2>
          </div>

          {/* Description */}
          <p 
            data-animate="perks-desc" 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            From drag-and-drop to clean XML, AutoTrim is packed with features that
            save time — and sanity.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:auto-rows-min">
          {perks.map((perk, index) => (
            <div
              key={index}
              data-animate="perks-card"
              className={`
                group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl
                border border-gray-100/50 hover:border-primary-200 overflow-hidden
                transition-all duration-500 hover:-translate-y-2
                ${perk.size === "large" ? "lg:col-span-2 lg:row-span-2" : ""}
              `}
            >
              {/* Background glow */}
              <div 
                data-animate="perk-glow"
                className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-0 rounded-3xl blur-xl scale-110`}
              ></div>

              {/* Featured badge */}
              {perk.featured && (
                <div 
                  data-animate="perk-featured"
                  className="absolute top-4 right-4 z-10"
                >
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-xs font-bold text-white">
                    <Star className="h-3 w-3" fill="currentColor" />
                    <span>Popular</span>
                  </div>
                </div>
              )}

              {perk.gifPath && perk.size === "large" ? (
                <div className="relative flex flex-col h-full">
                  {/* Image section - Much taller for better GIF visibility */}
                  <div className="relative h-64 lg:h-96 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      data-animate="perk-image"
                      src={perk.gifPath}
                      alt={perk.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
                    
                    {/* Floating icon */}
                    <div 
                      data-animate="perk-icon"
                      className="absolute top-4 left-4"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${perk.iconBg} shadow-lg backdrop-blur-sm`}>
                        <perk.icon className={`w-6 h-6 ${perk.iconColor}`} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content section - Reduced padding to give more space to GIF */}
                  <div data-animate="perk-content" className="p-6 flex-1 flex flex-col relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {perk.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-1 text-sm">{perk.desc}</p>
                    
                    {perk.comingSoon && (
                      <div data-animate="perk-badge">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                          <Sparkles className="h-3 w-3" />
                          COMING SOON
                        </span>
                      </div>
                    )}
                    
                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <ArrowUpRight className="h-5 w-5 text-primary-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div data-animate="perk-content" className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div data-animate="perk-icon" className="mb-6">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${perk.iconBg} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                      <perk.icon className={`w-8 h-8 ${perk.iconColor}`} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {perk.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 flex-1">{perk.desc}</p>
                  
                  {perk.comingSoon && (
                    <div data-animate="perk-badge">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                        <Sparkles className="h-3 w-3" />
                        COMING SOON
                      </span>
                    </div>
                  )}
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    <ArrowUpRight className="h-5 w-5 text-primary-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">Loved by 10,000+ creators worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerksGrid;

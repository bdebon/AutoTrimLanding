"use client";
import React, { useLayoutEffect, useRef } from "react";
import {
  Youtube,
  Mic,
  GraduationCap,
  Briefcase,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhoIsItFor = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleTextRef = useRef(null);
  let splitInst = null;

  const personas = [
    {
      icon: Youtube,
      title: "YouTubers & Vloggers",
      description: "Ship videos faster without the tedious trimming",
      gradient: "from-red-500 to-red-600",
      iconBg: "from-red-50 to-red-100",
      iconColor: "text-red-600",
      stats: "10+ hours saved/week",
    },
    {
      icon: Mic,
      title: "Podcasters",
      description: "Clean up long-form content in minutes, not hours",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      stats: "3x faster editing",
    },
    {
      icon: GraduationCap,
      title: "Online Teachers",
      description: "Focus on teaching, not editing your courses",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      stats: "More time to teach",
    },
    {
      icon: Briefcase,
      title: "Freelance Editors",
      description: "Handle more clients by cutting editing time",
      gradient: "from-green-500 to-green-600",
      iconBg: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      stats: "2x client capacity",
    },
    {
      icon: Users,
      title: "Content Teams",
      description: "Scale video production without scaling headcount",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      stats: "Team productivity boost",
    },
    {
      icon: Clock,
      title: "Any Creator Who Values Time",
      description: "If you edit videos regularly, AutoTrim is for you",
      gradient: "from-primary-500 to-primary-600",
      iconBg: "from-primary-50 to-primary-100",
      iconColor: "text-primary-600",
      stats: "Hours back daily",
    },
  ];

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header icon animation
      const iconEl = sectionRef.current.querySelector('[data-animate="who-icon"]');
      const descEl = sectionRef.current.querySelector('[data-animate="who-desc"]');
      const statsEl = sectionRef.current.querySelector('[data-animate="who-stats"]');
      const cardEls = gsap.utils.toArray(sectionRef.current.querySelectorAll('[data-animate="who-card"]'));

      // Icon animation with sparkle effect
      if (iconEl) {
        const sparkles = iconEl.querySelectorAll('[data-animate="sparkle"]');
        gsap.set(iconEl, { opacity: 0, scale: 0, rotate: -180 });
        gsap.set(sparkles, { opacity: 0, scale: 0, rotate: 0 });

        ScrollTrigger.create({
          trigger: iconEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(iconEl, {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
            });
            
            gsap.to(sparkles, {
              opacity: 1,
              scale: 1,
              rotate: 360,
              duration: 1.2,
              ease: "back.out(1.5)",
              stagger: 0.1,
              delay: 0.3,
            });
          },
        });
      }

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

      // Stats animation
      if (statsEl) {
        gsap.set(statsEl, { opacity: 0, y: 15 });
        ScrollTrigger.create({
          trigger: statsEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(statsEl, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: 0.8,
            });
          },
        });
      }

      // Cards sophisticated animation - all triggered together when first card enters viewport
      if (cardEls.length) {
        // Set initial states for all cards
        cardEls.forEach((card) => {
          const icon = card.querySelector('[data-animate="card-icon"]');
          const content = card.querySelector('[data-animate="card-content"]');
          const stat = card.querySelector('[data-animate="card-stat"]');
          const glow = card.querySelector('[data-animate="card-glow"]');

          gsap.set(card, { opacity: 0, y: 40, scale: 0.9 });
          if (icon) gsap.set(icon, { scale: 0, rotate: -90 });
          if (content) gsap.set(content, { opacity: 0, x: -20 });
          if (stat) gsap.set(stat, { opacity: 0, scale: 0.8 });
          if (glow) gsap.set(glow, { opacity: 0, scale: 1.2 });
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
          const icon = card.querySelector('[data-animate="card-icon"]');
          const content = card.querySelector('[data-animate="card-content"]');
          const stat = card.querySelector('[data-animate="card-stat"]');
          const glow = card.querySelector('[data-animate="card-glow"]');
          
          const delay = i * 0.15; // Stagger delay

          // Card reveal
          mainTl.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.4)",
          }, delay);

          // Icon animation
          if (icon) {
            mainTl.to(icon, {
              scale: 1,
              rotate: 0,
              duration: 0.6,
              ease: "back.out(2)",
            }, delay + 0.1);
          }

          // Content slide in
          if (content) {
            mainTl.to(content, {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power3.out",
            }, delay + 0.2);
          }

          // Stat badge
          if (stat) {
            mainTl.to(stat, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.5)",
            }, delay + 0.3);
          }

          // Subtle glow effect
          if (glow) {
            mainTl.to(glow, {
              opacity: 0.1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
            }, delay + 0.1);
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
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Animated icon with sparkles */}
          <div data-animate="who-icon" className="mb-6 flex justify-center relative">
            <div className="relative">
              <div className="absolute -inset-4">
                <Sparkles 
                  data-animate="sparkle" 
                  className="absolute -top-2 -right-2 h-4 w-4 text-primary-400" 
                />
                <Sparkles 
                  data-animate="sparkle" 
                  className="absolute -bottom-2 -left-2 h-3 w-3 text-blue-400" 
                />
                <Sparkles 
                  data-animate="sparkle" 
                  className="absolute top-0 -left-4 h-2 w-2 text-purple-400" 
                />
              </div>
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
                <Users className="h-12 w-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title with SplitText */}
          <div ref={titleRef} className="mb-6 overflow-hidden">
            <h2 
              ref={titleTextRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mx-auto"
            >
              AutoTrim is Made For
            </h2>
          </div>

          {/* Description */}
          <p
            data-animate="who-desc"
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you're creating content full-time or just getting started,
            AutoTrim saves you hours every week.
          </p>

          {/* Stats */}
          <div 
            data-animate="who-stats"
            className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>10,000+ happy creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Millions of hours saved</span>
            </div>
          </div>
        </div>

        {/* Personas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {personas.map((persona, index) => (
            <div
              key={index}
              data-animate="who-card"
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-shadow duration-200"
            >
              {/* Background glow */}
              <div 
                data-animate="card-glow"
                className={`absolute inset-0 bg-gradient-to-br ${persona.gradient} opacity-0 rounded-2xl blur-xl scale-110`}
              ></div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div data-animate="card-icon" className="mb-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${persona.iconBg} group-hover:scale-105 transition-transform duration-200`}>
                    <persona.icon
                      className={`h-8 w-8 ${persona.iconColor}`}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <div data-animate="card-content">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {persona.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {persona.description}
                  </p>
                </div>

                {/* Stats badge */}
                <div data-animate="card-stat">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${persona.gradient} text-white`}>
                    {persona.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
            </div>
            <p className="text-lg text-gray-700 font-medium">
              Join thousands of creators who've reclaimed their time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;

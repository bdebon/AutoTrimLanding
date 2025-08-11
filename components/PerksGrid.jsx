"use client";
import React, { useEffect, useRef } from "react";
import {
  Upload,
  Cpu,
  Sliders,
  Sparkle,
  Film,
  MonitorPlay,
  RefreshCcw,
  Globe,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PerksGrid = () => {
  const sectionRef = useRef(null);
  const perks = [
    {
      icon: Upload,
      title: "Drag & Drop Everything",
      desc: "Drop any number of clips; AutoTrim ingests them instantly, whatever the format.",
      size: "normal",
      iconBg: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Sparkle,
      title: "Smart Presets",
      desc: "YouTube, Podcast, Vlog… one click applies the perfect settings.",
      size: "normal",
      iconBg: "from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: Sliders,
      title: "Fine-Tune Cuts",
      desc: "Silence threshold, pre/post-roll, min gap – dial in your exact editing style.",
      size: "large",
      gifPath: "/assets/img/perks1.gif",
      iconBg: "from-green-50 to-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Film,
      title: "Single or Multi-XML",
      desc: "Export one clean timeline or individual XMLs – no more puzzle pieces.",
      size: "normal",
      iconBg: "from-red-50 to-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: MonitorPlay,
      title: "100% Local Processing",
      desc: "AI, video processing, everything runs on your machine. No uploads, no waiting, maximum speed.",
      size: "normal",
      iconBg: "from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      icon: Cpu,
      title: "Parallel Processing",
      desc: "Max out your cores: up to 4 jobs run side-by-side for zero downtime.",
      size: "large",
      gifPath: "/assets/img/perks3.gif",
      iconBg: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: RefreshCcw,
      title: "Repetition & Hesitation Remover",
      desc: "Cuts filler words and double-takes automatically.",
      comingSoon: true,
      size: "normal",
      iconBg: "from-pink-50 to-pink-100",
      iconColor: "text-pink-600",
    },
    {
      icon: Globe,
      title: "Multilingual & Format-Agnostic",
      desc: "French, English, Spanish… MP4, MOV, MKV – it just works.",
      size: "normal",
      iconBg: "from-teal-50 to-teal-100",
      iconColor: "text-teal-600",
    },
    {
      icon: Zap,
      title: "Blazing-Fast Preview",
      desc: "Scrub in real-time, no lag, even on long footage.",
      size: "normal",
      iconBg: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const titleEl = sectionRef.current.querySelector('[data-animate="perks-title"]');
      const descEl = sectionRef.current.querySelector('[data-animate="perks-desc"]');
      const cardEls = gsap.utils.toArray(sectionRef.current.querySelectorAll('[data-animate="perks-card"]'));

      if (titleEl) {
        gsap.fromTo(titleEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", overwrite: "auto", scrollTrigger: { trigger: titleEl, start: "top 90%", once: true } });
      }
      if (descEl) {
        gsap.fromTo(descEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, delay: 0.1, ease: "power3.out", overwrite: "auto", scrollTrigger: { trigger: descEl, start: "top 90%", once: true } });
      }
      if (cardEls.length) {
        cardEls.forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: i * 0.06, overwrite: "auto", scrollTrigger: { trigger: el, start: "top 95%", once: true } });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-gradient-to-b from-white to-gray-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 data-animate="perks-title" className="text-3xl font-bold text-center">
          Why creators never go back.
        </h2>
        <p data-animate="perks-desc" className="text-lg text-gray-600 text-center mt-4">
          From drag-and-drop to clean XML, AutoTrim is packed with features that
          save time — and sanity.
        </p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:auto-rows-min mt-12">
          {perks.map((perk, index) => (
            <div
              key={index}
              data-animate="perks-card"
              className={`
                group bg-white rounded-2xl shadow-sm hover:shadow-xl
                border border-gray-100 hover:border-primary-200 overflow-hidden
                ${perk.size === "large" ? "lg:col-span-2 lg:row-span-2" : ""}
              `}
            >
              {perk.gifPath && perk.size === "large" ? (
                <div className="flex flex-col h-full">
                  <div className="relative h-48 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={perk.gifPath}
                      alt={perk.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${perk.iconBg} self-start`}>
                      <perk.icon className={`w-8 h-8 ${perk.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900">
                      {perk.title}
                      {perk.comingSoon && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary-100 text-primary-700">
                          COMING SOON
                        </span>
                      )}
                    </h3>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${perk.iconBg} transition-all duration-300 group-hover:scale-110`}>
                    <perk.icon className={`w-8 h-8 ${perk.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {perk.title}
                    {perk.comingSoon && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary-100 text-primary-700">
                        COMING SOON
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{perk.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerksGrid;

"use client";
import React, { useEffect, useRef } from "react";
import {
  Youtube,
  Mic,
  GraduationCap,
  Briefcase,
  Users,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhoIsItFor = () => {
  const sectionRef = useRef(null);

  const personas = [
    {
      icon: Youtube,
      title: "YouTubers & Vloggers",
      description: "Ship videos faster without the tedious trimming",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: Mic,
      title: "Podcasters",
      description: "Clean up long-form content in minutes, not hours",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: GraduationCap,
      title: "Online Teachers",
      description: "Focus on teaching, not editing your courses",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Briefcase,
      title: "Freelance Editors",
      description: "Handle more clients by cutting editing time",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Users,
      title: "Content Teams",
      description: "Scale video production without scaling headcount",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: Clock,
      title: "Any Creator Who Values Time",
      description: "If you edit videos regularly, AutoTrim is for you",
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const iconEl = sectionRef.current.querySelector(
        '[data-animate="who-icon"]'
      );
      const titleEl = sectionRef.current.querySelector(
        '[data-animate="who-title"]'
      );
      const descEl = sectionRef.current.querySelector(
        '[data-animate="who-desc"]'
      );
      const cardEls = gsap.utils.toArray(
        sectionRef.current.querySelectorAll('[data-animate="who-card"]')
      );

      // No CSS transitions for initial state; drive both props together with fromTo

      // Icon
      if (iconEl) {
        gsap.fromTo(
          iconEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: iconEl,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // Title
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: titleEl,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // Description slightly after title
      if (descEl) {
        gsap.fromTo(
          descEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.1,
            overwrite: "auto",
            scrollTrigger: {
              trigger: descEl,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // Cards stagger
      if (cardEls.length) {
        cardEls.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              delay: i * 0.08,
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div data-animate="who-icon" className="mb-4 flex justify-center">
            <Users className="h-12 w-12 text-gray-900" />
          </div>
          <h2
            data-animate="who-title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            AutoTrim is Made For
          </h2>
          <p
            data-animate="who-desc"
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Whether you're creating content full-time or just getting started,
            AutoTrim saves you hours every week.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona, index) => (
            <div
              key={index}
              data-animate="who-card"
              className="group relative bg-white rounded-xl p-6 hover:shadow-lg border border-gray-100 hover:border-primary-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${persona.bg} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <persona.icon
                    className={`h-6 w-6 ${persona.color}`}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {persona.title}
                  </h3>
                  <p className="text-sm text-gray-600">{persona.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 font-medium">
            Join thousands of creators who've reclaimed their time with
            AutoTrim.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;

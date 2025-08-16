"use client";
import React, { useLayoutEffect, useRef } from "react";
import { Star, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  const testimonials = [
    {
      text: t("testimonials.quotes.0.text"),
      name: "Benjamin Code",
      role: "Creator",
      avatar: "/assets/img/pp-rose.jpg",
      rating: 5,
    },
    {
      text: t("testimonials.quotes.1.text"),
      name: "Alex Rivera",
      role: "Video Editor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
    },
    {
      text: t("testimonials.quotes.2.text"),
      name: "Mike Johnson",
      role: "Professional Editor",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
    },
  ];

  useLayoutEffect(() => {
    let splitInst = null;

    const ctx = gsap.context(() => {
      const title = rootRef.current?.querySelector(
        '[data-animate="test-title"]'
      );
      const subtitle = rootRef.current?.querySelector(
        '[data-animate="test-subtitle"]'
      );
      const cards = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="test-card"]')
      );
      const socialProof = rootRef.current?.querySelector(
        '[data-animate="test-social"]'
      );
      const cta = rootRef.current?.querySelector('[data-animate="test-cta"]');

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
          delay: 0.3,
        });
      }

      // Cards animation with stagger
      cards.forEach((card, i) => {
        const stars = card.querySelectorAll('[data-animate="test-star"]');
        const icon = card.querySelector('[data-animate="test-icon"]');
        const text = card.querySelector('[data-animate="test-text"]');
        const avatar = card.querySelector('[data-animate="test-avatar"]');
        const name = card.querySelector('[data-animate="test-name"]');
        const role = card.querySelector('[data-animate="test-role"]');

        // Initial states
        gsap.set(card, { opacity: 0, y: 40, scale: 0.95 });
        if (stars.length) gsap.set(stars, { opacity: 0, scale: 0 });
        if (icon) gsap.set(icon, { opacity: 0, rotate: -180 });
        if (text) gsap.set(text, { opacity: 0, y: 15 });
        if (avatar) gsap.set(avatar, { opacity: 0, scale: 0.8 });
        if (name) gsap.set(name, { opacity: 0, x: -10 });
        if (role) gsap.set(role, { opacity: 0, x: -10 });

        const baseDelay = i * 0.1;

        // Card entrance
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: baseDelay,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        });

        // Stars animation
        if (stars.length) {
          gsap.to(stars, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
            stagger: 0.05,
            delay: baseDelay + 0.15,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Icon animation
        if (icon) {
          gsap.to(icon, {
            opacity: 0.3,
            rotate: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: baseDelay + 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Text animation
        if (text) {
          gsap.to(text, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: baseDelay + 0.25,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Avatar animation
        if (avatar) {
          gsap.to(avatar, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.3)",
            delay: baseDelay + 0.3,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Name and role animation
        const authorElements = [name, role].filter(Boolean);
        if (authorElements.length) {
          gsap.to(authorElements, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
            delay: baseDelay + 0.35,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }
      });

      // Social proof animation - delayed to appear after cards
      if (socialProof) {
        const avatars = socialProof.querySelectorAll(
          '[data-animate="test-avatar-circle"]'
        );
        const text = socialProof.querySelector(
          '[data-animate="test-social-text"]'
        );

        if (avatars.length) {
          gsap.set(avatars, { opacity: 0, scale: 0 });
          gsap.to(avatars, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
            stagger: 0.1,
            delay: 0.5, // Reduced delay
            scrollTrigger: {
              trigger: socialProof,
              start: "top 90%",
              once: true,
            },
          });
        }

        if (text) {
          gsap.set(text, { opacity: 0, x: -20 });
          gsap.to(text, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.8, // Reduced delay
            scrollTrigger: {
              trigger: socialProof,
              start: "top 90%",
              once: true,
            },
          });
        }
      }

      // CTA button animation - delayed to appear last
      if (cta) {
        gsap.set(cta, { opacity: 0, y: 20, scale: 0.9 });
        gsap.to(cta, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          delay: 1, // Reduced delay
          scrollTrigger: {
            trigger: cta,
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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            data-animate="test-title"
            className="text-3xl sm:text-4xl mx-auto font-bold text-white mb-4 overflow-hidden"
            style={{ opacity: 0 }}
          >
            {t("testimonials.title")}
          </h2>
          <p
            data-animate="test-subtitle"
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {t("testimonials.trustedBy")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-animate="test-card"
              className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        data-animate="test-star"
                        className="h-4 w-4 fill-primary-400 text-primary-400"
                      />
                    ))}
                  </div>
                  <MessageCircle
                    data-animate="test-icon"
                    className="h-6 w-6 text-primary-500/30"
                  />
                </div>

                <p
                  data-animate="test-text"
                  className="text-gray-300 mb-8 leading-relaxed font-normal"
                >
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-sm opacity-50" />
                    <img
                      data-animate="test-avatar"
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="relative w-12 h-12 rounded-full object-cover border-2 border-gray-800"
                    />
                  </div>
                  <div>
                    <p
                      data-animate="test-name"
                      className="font-semibold text-white"
                    >
                      {testimonial.name}
                    </p>
                    <p
                      data-animate="test-role"
                      className="text-sm text-gray-500"
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="flex flex-col items-center gap-6">
            <div data-animate="test-social" className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div
                  data-animate="test-avatar-circle"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 border-2 border-gray-900"
                />
                <div
                  data-animate="test-avatar-circle"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-gray-900"
                />
                <div
                  data-animate="test-avatar-circle"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-gray-900"
                />
              </div>
              <span data-animate="test-social-text" className="text-gray-400">
                {t("testimonials.joinUsers")}
              </span>
            </div>

            <a
              data-animate="test-cta"
              href={`/${currentLocale}/download`}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-2xl hover:shadow-primary-500/25 hover:scale-105"
            >
              {t("testimonials.startTrial")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

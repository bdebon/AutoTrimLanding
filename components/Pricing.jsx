import React, { useLayoutEffect, useRef } from "react";
import {
  Check,
  Shield,
  Zap,
  Download,
  Flame,
  Gem,
  FlaskConical,
  Lock,
  BadgeDollarSign,
  Calendar,
  Crown,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  const plans = [
    {
      name: "Annual",
      icon: Calendar,
      price: "$79",
      period: "/year",
      description: "Billed yearly",
      features: [
        "Unlimited projects",
        "Unlimited clips",
        "1 year of updates",
        "Priority export speed",
        "Activate on 2 machines",
      ],
      popular: false,
    },
    {
      name: "Lifetime License",
      icon: Crown,
      price: "$149",
      originalPrice: "$249",
      period: "one-time",
      description: "Early bird special",
      features: [
        "Unlimited projects",
        "Unlimited clips",
        "Lifetime updates",
        "Priority export speed",
        "Activate on 2 machines",
      ],
      popular: true,
      badge: "Best Value",
    },
  ];

  useLayoutEffect(() => {
    let splitInst = null;

    const ctx = gsap.context(() => {
      const title = rootRef.current?.querySelector(
        '[data-animate="pricing-title"]'
      );
      const subtitle = rootRef.current?.querySelector(
        '[data-animate="pricing-subtitle"]'
      );
      const cards = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="pricing-card"]')
      );
      const trustIndicators = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="pricing-trust"]')
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

      // Cards animation
      cards.forEach((card, i) => {
        const badge = card.querySelector('[data-animate="pricing-badge"]');
        const icon = card.querySelector('[data-animate="pricing-icon"]');
        const price = card.querySelector('[data-animate="pricing-price"]');
        const originalPrice = card.querySelector(
          '[data-animate="pricing-original"]'
        );
        const period = card.querySelector('[data-animate="pricing-period"]');
        const description = card.querySelector('[data-animate="pricing-desc"]');
        const features = card.querySelectorAll(
          '[data-animate="pricing-feature"]'
        );
        const button = card.querySelector('[data-animate="pricing-button"]');
        const subtext = card.querySelector('[data-animate="pricing-subtext"]');

        // Initial states
        gsap.set(card, { opacity: 0, y: 40, scale: 0.95 });
        if (badge) gsap.set(badge, { opacity: 0, scale: 0, y: -10 });
        if (icon) gsap.set(icon, { opacity: 0, rotate: -180 });
        if (price) gsap.set(price, { opacity: 0, scale: 0.8 });
        if (originalPrice) gsap.set(originalPrice, { opacity: 0, x: 20 });
        if (period) gsap.set(period, { opacity: 0, y: 10 });
        if (description) gsap.set(description, { opacity: 0, y: 10 });
        if (features.length) gsap.set(features, { opacity: 0, x: -20 });
        if (button) gsap.set(button, { opacity: 0, y: 20 });
        if (subtext) gsap.set(subtext, { opacity: 0 });

        const baseDelay = i * 0.1;

        // Card entrance
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          delay: baseDelay + 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        });

        // Badge animation
        if (badge) {
          gsap.to(badge, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
            delay: baseDelay + 0.3,
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
            opacity: 1,
            rotate: 0,
            duration: 0.4,
            ease: "power3.out",
            delay: baseDelay + 0.35,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Price animation
        if (price) {
          gsap.to(price, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.3)",
            delay: baseDelay + 0.4,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Original price animation
        if (originalPrice) {
          gsap.to(originalPrice, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power3.out",
            delay: baseDelay + 0.45,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Period and description animation
        const textElements = [period, description].filter(Boolean);
        if (textElements.length) {
          gsap.to(textElements, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.05,
            delay: baseDelay + 0.5,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Features animation
        if (features.length) {
          gsap.to(features, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.04,
            delay: baseDelay + 0.55,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Button animation
        if (button) {
          gsap.to(button, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            delay: baseDelay + 0.7,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }

        // Subtext animation
        if (subtext) {
          gsap.to(subtext, {
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            delay: baseDelay + 0.75,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          });
        }
      });

      // Trust indicators animation
      if (trustIndicators.length) {
        gsap.set(trustIndicators, { opacity: 0, y: 20 });
        gsap.to(trustIndicators, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: trustIndicators[0],
            start: "top 90%",
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
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            ref={titleRef}
            data-animate="pricing-title"
            className="text-4xl sm:text-5xl mx-auto font-bold text-gray-900 mb-4 overflow-hidden"
            style={{ opacity: 0 }}
          >
            Choose Your Plan
          </h2>
          <p data-animate="pricing-subtitle" className="text-xl text-gray-600">
            AutoTrim is free to try. Pay only when you're ready to export.
          </p>
        </div>

        {/* Pricing cards grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative" data-animate="pricing-card">
              {/* Badge */}
              {plan.badge && (
                <div
                  data-animate="pricing-badge"
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card */}
              <div
                className={`bg-white rounded-3xl shadow-xl border ${
                  plan.popular
                    ? "border-primary-500 shadow-primary-500/20"
                    : "border-gray-100"
                } overflow-hidden h-full`}
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      <span className="inline-flex items-center gap-2">
                        <plan.icon
                          data-animate="pricing-icon"
                          className={`w-5 h-5 ${
                            plan.popular ? "text-primary-600" : "text-gray-600"
                          }`}
                        />
                        {plan.name}
                      </span>
                    </h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span
                        data-animate="pricing-price"
                        className="text-5xl font-black text-gray-900"
                      >
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span
                          data-animate="pricing-original"
                          className="text-xl text-gray-500 line-through"
                        >
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p
                      data-animate="pricing-period"
                      className="text-lg text-gray-600 mt-2"
                    >
                      {plan.period}
                    </p>
                    <p
                      data-animate="pricing-desc"
                      className={`text-sm font-semibold mt-1 ${
                        plan.popular ? "text-primary-600" : "text-gray-600"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        data-animate="pricing-feature"
                        className="flex items-center"
                      >
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    data-animate="pricing-button"
                    href="/download"
                    className={`block w-full text-center py-4 rounded-xl font-bold text-lg shadow-lg ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg"
                    }`}
                  >
                    Download Free Trial
                  </a>
                  <p
                    data-animate="pricing-subtext"
                    className="mt-3 text-center text-sm text-gray-600"
                  >
                    Already tried?{" "}
                    <a
                      href="#pricing"
                      className="text-primary-700 underline hover:no-underline"
                    >
                      Buy license
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trial & Trust indicators */}
        <div className="mt-16 text-center space-y-4 max-w-2xl mx-auto">
          <div
            data-animate="pricing-trust"
            className="flex items-center justify-center gap-2 text-gray-600"
          >
            <FlaskConical className="w-6 h-6" />
            <p className="text-lg">
              <span className="font-semibold">Free to try</span> — process your
              files, preview your cuts.
            </p>
          </div>
          <div
            data-animate="pricing-trust"
            className="flex items-center justify-center gap-2 text-gray-600"
          >
            <Lock className="w-6 h-6" />
            <p className="text-lg">
              Pay only to export your final XML or timeline.
            </p>
          </div>
          <div
            data-animate="pricing-trust"
            className="pt-4 border-t border-gray-200"
          >
            <p className="text-lg text-gray-700 font-medium inline-flex items-center gap-2">
              <BadgeDollarSign className="w-5 h-5 text-green-600" />
              14-day money-back guarantee.
            </p>
          </div>
          <div
            data-animate="pricing-trust"
            className="pt-4"
          >
            <p className="text-lg text-gray-700 font-semibold">
              {t("pricing.note")}
            </p>
          </div>
        </div>

        {/* Bottom CTA removed to reduce redundancy with freemium flow */}
      </div>
    </section>
  );
};

export default Pricing;

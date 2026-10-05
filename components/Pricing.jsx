"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import {
  Check,
  Download,
  Gem,
  FlaskConical,
  Lock,
  BadgeDollarSign,
  Calendar,
  Crown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAttribution } from "@/hooks/useAttribution";
import { trackEvent } from "@/lib/tracking";
import posthog from "posthog-js";



// Inner component that uses hooks
const PricingContent = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const { buildLemonSqueezyUrl } = useAttribution();
  const rootRef = useRef(null);
  const [checkoutUrl, setCheckoutUrl] = useState("https://autotrim.lemonsqueezy.com/");

  // Attribution reads browser storage; resolve it after hydration so SSR and the
  // first client render agree while preserving the attributed checkout link.
  useEffect(() => {
    setCheckoutUrl(buildLemonSqueezyUrl());
  }, [buildLemonSqueezyUrl]);

  const freePlan = {
    name: t("pricing.plans.free.title"),
    price: t("pricing.plans.free.price"),
    period: t("pricing.plans.free.period"),
    description: t("pricing.plans.free.billing"),
    features: t.raw("pricing.plans.free.features") || [],
    limitation: t("pricing.plans.free.limitation"),
  };

  const plans = [
    {
      id: "monthly",
      name: t("pricing.plans.monthly.title"),
      icon: Calendar,
      price: t("pricing.plans.monthly.price"),
      period: t("pricing.plans.monthly.period"),
      description: t("pricing.plans.monthly.billing"),
      features: t.raw("pricing.plans.monthly.features") || [],
      popular: false,
    },
    {
      id: "annual",
      name: t("pricing.plans.annual.title"),
      icon: Gem,
      price: t("pricing.plans.annual.price"),
      period: t("pricing.plans.annual.period"),
      description: t("pricing.plans.annual.billing"),
      features: t.raw("pricing.plans.annual.features") || [],
      popular: false,
    },
    {
      id: "lifetime",
      name: t("pricing.plans.lifetime.title"),
      icon: Crown,
      price: t("pricing.plans.lifetime.price"),
      originalPrice: t("pricing.plans.lifetime.originalPrice"),
      period: t("pricing.plans.lifetime.period"),
      description: t("pricing.plans.lifetime.earlyBird"),
      features: t.raw("pricing.plans.lifetime.features") || [],
      popular: true,
      badge: t("pricing.plans.lifetime.badge"),
    },
  ];


  // PostHog: track when pricing section becomes visible
  useEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            posthog.capture("pricing_viewed");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 secondary-hero"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1
            data-animate="pricing-title"
            className="font-display text-4xl sm:text-5xl mx-auto font-bold text-at-text mb-4 overflow-hidden"
          >
            {t("pricing.title")}
          </h1>
          <p data-animate="pricing-subtitle" className="text-xl text-at-muted">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <div
            data-animate="pricing-badge-item"
            className="flex items-center gap-2 bg-at-accent-surface text-at-accent px-4 py-2.5 rounded-full text-sm font-semibold border border-at-accent-soft-border"
          >
            <FlaskConical className="w-4 h-4" />
            {t("pricing.benefits.freeTry")}
          </div>
          <div
            data-animate="pricing-badge-item"
            className="flex items-center gap-2 bg-at-accent-surface text-at-accent px-4 py-2.5 rounded-full text-sm font-semibold border border-at-accent-soft-border"
          >
            <Lock className="w-4 h-4" />
            {t("pricing.benefits.payExport")}
          </div>
          <div
            data-animate="pricing-badge-item"
            className="flex items-center gap-2 bg-at-accent-surface text-at-accent px-4 py-2.5 rounded-full text-sm font-semibold border border-at-accent-soft-border"
          >
            <BadgeDollarSign className="w-4 h-4" />
            {t("pricing.benefits.moneyBack")}
          </div>
        </div>

        {/* Free plan banner */}
        <div data-animate="pricing-card" className="mb-8 max-w-4xl mx-auto">
          <div className="bg-at-card rounded-card-lg shadow-sm border border-at-accent-soft-border shadow-black/10 overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="text-center md:text-left md:min-w-[160px]">
                <h3 className="font-display text-2xl font-bold text-at-text mb-2">
                  <span className="inline-flex items-center gap-2">
                    <Download className="w-5 h-5 text-at-accent" />
                    {freePlan.name}
                  </span>
                </h3>
                <span className="text-4xl font-black text-at-text">{freePlan.price}</span>
                <p className="text-at-muted mt-1">{freePlan.period}</p>
                <p className="text-sm font-semibold text-at-accent">{freePlan.description}</p>
              </div>

              <div className="flex-1 flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
                {freePlan.features.map((feature, idx) => (
                  <span key={idx} className="flex items-center text-at-muted">
                    <Check className="h-4 w-4 text-at-accent mr-2 flex-shrink-0" />
                    {feature}
                  </span>
                ))}
                {freePlan.limitation && (
                  <span className="flex items-center text-at-dim">
                    <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                    {freePlan.limitation}
                  </span>
                )}
              </div>

              <div className="text-center md:text-right shrink-0">
                <a
                  href={`/${currentLocale}/download`}
                  onClick={() => trackEvent("pricing_cta_clicked", { plan: "free", action: "download_trial" })}
                  className="inline-block px-8 py-4 rounded-xl font-bold text-lg shadow-sm bg-at-accent text-at-on-accent hover:bg-[#FF7047] hover:shadow-sm"
                >
                  {t("pricing.downloadFree")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Paid plans grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative" data-animate="pricing-card">
              {/* Badge */}
              {plan.badge && (
                <div
                  data-animate="pricing-badge"
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <span className="bg-at-accent text-at-on-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card */}
              <div
                className={`bg-at-card rounded-card-lg shadow-sm border ${
                  plan.popular
                    ? "border-at-accent shadow-black/20"
                    : "border-at-border"
                } overflow-hidden h-full`}
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="font-display text-2xl font-bold text-at-text mb-4">
                      <span className="inline-flex items-center gap-2">
                        <plan.icon
                          data-animate="pricing-icon"
                          className={`w-5 h-5 ${
                            plan.popular ? "text-at-accent" : "text-at-muted"
                          }`}
                        />
                        {plan.name}
                      </span>
                    </h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span
                        data-animate="pricing-price"
                        className="text-5xl font-black text-at-text"
                      >
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span
                          data-animate="pricing-original"
                          className="text-xl text-at-dim line-through"
                        >
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p
                      data-animate="pricing-period"
                      className="text-lg text-at-muted mt-2"
                    >
                      {plan.period}
                    </p>
                    <p
                      data-animate="pricing-desc"
                      className={`text-sm font-semibold mt-1 ${
                        plan.popular ? "text-at-accent" : "text-at-muted"
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
                        <Check className="h-5 w-5 text-at-accent mr-3 flex-shrink-0" />
                        <span className="text-at-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    data-animate="pricing-button"
                    href={`/${currentLocale}/download`}
                    onClick={() => trackEvent("pricing_cta_clicked", { plan: plan.id, action: "download_trial" })}
                    className={`block w-full text-center py-4 rounded-xl font-bold text-lg shadow-sm ${
                      plan.popular
                        ? "bg-at-accent text-at-on-accent hover:bg-[#FF7047] hover:shadow-sm"
                        : "bg-at-chip text-at-text hover:bg-at-chip hover:shadow-sm"
                    }`}
                  >
                    {t("pricing.downloadTrial")}
                  </a>
                  <p
                    data-animate="pricing-subtext"
                    className="mt-3 text-center text-sm text-at-muted"
                  >
                    {t("pricing.alreadyTried")}{" "}
                    <a
                      href={checkoutUrl}
                      onClick={() => trackEvent("pricing_cta_clicked", { plan: plan.id, action: "buy_license" })}
                      className="text-at-accent underline hover:no-underline"
                    >
                      {t("pricing.buyLicense")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p
            data-animate="pricing-trust"
            className="text-lg text-at-muted font-semibold"
          >
            {t("pricing.note")}
          </p>
        </div>

        {/* Bottom CTA removed to reduce redundancy with freemium flow */}
      </div>
    </section>
  );
};

// Wrapper component with Suspense for useSearchParams
const Pricing = () => {
  return (
    <Suspense fallback={<PricingFallback />}>
      <PricingContent />
    </Suspense>
  );
};

// Fallback component while loading
const PricingFallback = () => {
  return (
    <section
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 secondary-hero"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-12 bg-at-chip rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-at-chip rounded w-96 max-w-full mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-at-card rounded-card-lg shadow-sm border border-at-border p-8">
              <div className="h-8 bg-at-chip rounded w-32 mx-auto mb-4 animate-pulse" />
              <div className="h-12 bg-at-chip rounded w-24 mx-auto mb-4 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-5 bg-at-chip rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import { useTranslations } from "next-intl";
import Link from "next/link";
import BuyLink from "./BuyLink";
import CtaLink from "./CtaLink";
import Reveal from "./Reveal";
import Section from "./Section";
import { btn } from "./ui";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[3px] shrink-0 text-at-accent">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PAID = ["monthly", "annual", "lifetime"] as const;

export default function Pricing({ locale }: { locale: string }) {
  const t = useTranslations("landing.pricing");
  const freeFeatures = t.raw("free.features") as string[];
  const common = t.raw("common") as string[];

  return (
    <Section id="pricing" eyebrow={t("eyebrow")} title={t("title")} body={t("subtitle")} align="center" className="border-t border-at-hairline">
      {/* Free: the trial, without a time limit */}
      <Reveal className="mx-auto mt-12 max-w-5xl">
        <div className="flex flex-col gap-6 rounded-card-lg border border-at-border bg-at-card p-6 md:flex-row md:items-center md:justify-between sm:p-8">
          <div className="md:w-48">
            <h3 className="font-display text-[22px] font-bold text-at-text">{t("free.title")}</h3>
            <p className="mt-1 font-display text-[40px] font-bold tabular-nums leading-none text-at-text">{t("free.price")}</p>
            <p className="mt-2 font-ui text-[13.5px] text-at-dim">{t("free.period")}</p>
          </div>
          <ul className="grid flex-1 gap-2 sm:grid-cols-2">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 font-ui text-[15px] text-at-muted">
                <Check />
                {f}
              </li>
            ))}
            <li className="flex items-start gap-2 font-ui text-[15px] text-at-dim">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[3px] shrink-0">
                <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {t("free.limitation")}
            </li>
          </ul>
          <CtaLink href={`/${locale}/download`} location="pricing" type="download" className={`${btn.primary} md:shrink-0`}>
            {t("download")}
          </CtaLink>
        </div>
      </Reveal>

      {/* Paid: the export */}
      <div className="mx-auto mt-5 grid max-w-5xl gap-4 md:grid-cols-3 md:gap-5">
        {PAID.map((plan) => {
          const features = t.raw(`${plan}.features`) as string[];
          const featured = plan === "lifetime";
          return (
            <article
              key={plan}
              className={`flex flex-col rounded-card-lg border p-6 sm:p-7 ${
                featured ? "border-at-accent-soft-border bg-at-accent-surface" : "border-at-border bg-at-card"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-[20px] font-bold text-at-text">{t(`${plan}.title`)}</h3>
                {featured && (
                  <span className="rounded-pill bg-at-accent px-3 py-1 font-ui text-[11px] font-semibold uppercase tracking-[0.08em] text-at-on-accent">
                    {t("lifetime.badge")}
                  </span>
                )}
              </div>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-[40px] font-bold tabular-nums leading-none text-at-text">{t(`${plan}.price`)}</span>
                <span className="font-ui text-[14px] text-at-dim">{t(`${plan}.period`)}</span>
              </p>
              <p className={`mt-2 font-ui text-[13.5px] ${featured ? "text-at-accent-soft-text" : "text-at-dim"}`}>
                {t(`${plan}.billing`)}
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-ui text-[15px] text-at-muted">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <BuyLink plan={plan} className={`${featured ? btn.primary : btn.ghost} w-full`}>
                  {t("buy")}
                </BuyLink>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 font-ui text-[13.5px] text-at-dim">
        {common.map((c, i) => (
          <span key={c} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-at-faint">·</span>}
            {c}
          </span>
        ))}
      </p>
      <p className="mt-3 text-center">
        <Link href={`/${locale}/pricing`} className="font-ui text-[13.5px] text-at-muted underline decoration-at-border-hi underline-offset-4 hover:text-at-text">
          {t("allPlans")}
        </Link>
      </p>
    </Section>
  );
}

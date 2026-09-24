"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/landing/Logo";
import { btn } from "@/components/landing/ui";
import { trackEvent } from "@/lib/tracking";

const Footer = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  const handleLanguageChange = (newLocale: string) => {
    trackEvent("language_changed", { from_locale: currentLocale, to_locale: newLocale });
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  const link = "font-ui text-[14px] text-at-dim transition-colors hover:text-at-text";
  const heading = "font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-at-muted";

  const legalLinks = [
    { href: "/terms", label: t("landing.footer.legal.terms") },
    { href: "/privacy", label: t("landing.footer.legal.privacy") },
    { href: "/refund", label: t("landing.footer.legal.refund") },
    { href: "/legal", label: t("landing.footer.legal.legal") },
  ];

  return (
    <footer className="border-t border-at-hairline bg-at-footer px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Final line + the CTA, same name as everywhere else */}
        <div className="flex flex-col gap-6 border-b border-at-hairline pb-12 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo href={`/${currentLocale}`} />
            <p className="mt-4 max-w-md font-ui text-[15px] text-at-muted">{t("landing.footer.tagline")}</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <p className="font-ui text-[14px] text-at-dim">{t("footer.cta.ready")}</p>
            <Link
              href={`/${currentLocale}/download`}
              onClick={() => trackEvent("cta_clicked", { location: "footer", type: "download" })}
              className={`${btn.primary} h-10! px-5! text-[14px]!`}
            >
              {t("footer.cta.button")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {/* Resources */}
          <div>
            <h3 className={heading}>{t("footer.resources.title")}</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href={`/${currentLocale}/download`} className={link}>{t("footer.resources.download")}</Link></li>
              <li><Link href={`/${currentLocale}/pricing`} className={link}>{t("footer.resources.pricing")}</Link></li>
              <li><a href={`/${currentLocale}#faq`} className={link}>{t("footer.resources.faq")}</a></li>
              <li>
                <a href="https://autotrim.lemonsqueezy.com/affiliates" target="_blank" rel="noopener noreferrer" className={link}>
                  {t("footer.resources.affiliate")}
                </a>
              </li>
            </ul>
          </div>

          {/* Comparisons */}
          <div>
            <h3 className={heading}>{t("footer.comparisons.title")}</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href={`/${currentLocale}/compare/timebolt`} className={link}>{t("footer.comparisons.timebolt")}</Link></li>
              <li><Link href={`/${currentLocale}/compare/autocut`} className={link}>{t("footer.comparisons.autocut")}</Link></li>
              <li><Link href={`/${currentLocale}/compare/descript`} className={link}>{t("footer.comparisons.descript")}</Link></li>
              <li><Link href={`/${currentLocale}/compare/premiere-pro`} className={link}>{t("footer.comparisons.premierePro")}</Link></li>
              <li><Link href={`/${currentLocale}/compare/final-cut-pro`} className={link}>{t("footer.comparisons.finalCut")}</Link></li>
            </ul>
          </div>

          {/* Guides (English-only content) */}
          <div>
            <h3 className={heading}>{t("footer.guides.title")}</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/en/guides/how-to-remove-silence-final-cut-pro" className={link}>{t("footer.guides.removeSilenceFcp")}</Link></li>
              <li><Link href="/en/guides/best-silence-remover-final-cut-pro" className={link}>{t("footer.guides.bestSilenceRemoverFcp")}</Link></li>
              <li><Link href="/en/guides/timebolt-alternative-mac" className={link}>{t("footer.guides.timeboltAlternative")}</Link></li>
              <li><Link href="/en/guides/remove-filler-words-from-video" className={link}>{t("footer.guides.fillerWords")}</Link></li>
              <li><Link href="/en/guides/descript-alternative-final-cut-pro" className={link}>{t("footer.guides.descriptAlternative")}</Link></li>
              <li><Link href="/en/guides" className={link}>{t("footer.guides.allGuides")}</Link></li>
            </ul>
          </div>

          {/* Legal + contact */}
          <div>
            <h3 className={heading}>{t("landing.footer.legal.legal")}</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
              ))}
              <li><a href="mailto:b1jam1code@gmail.com" className={link}>{t("landing.footer.legal.contact")}</a></li>
            </ul>
          </div>
        </div>

        {/* Language + copyright */}
        <div className="flex flex-col gap-4 border-t border-at-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-at-dim">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
              <path d="M1.75 8h12.5M8 1.75c2 2 2 10.5 0 12.5M8 1.75c-2 2-2 10.5 0 12.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <label htmlFor="language-select" className="sr-only">{t("footer.language.label")}</label>
            <select
              id="language-select"
              value={currentLocale}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="rounded-control border border-at-border bg-at-card px-3 py-1.5 font-ui text-[13.5px] text-at-muted focus:border-at-border-hi focus:outline-none"
              aria-label={t("footer.language.label")}
            >
              <option value="en">{t("footer.language.en")}</option>
              <option value="fr">{t("footer.language.fr")}</option>
              <option value="es">{t("footer.language.es")}</option>
              <option value="zh">{t("footer.language.zh")}</option>
            </select>
          </div>
          <p className="font-ui text-[13px] text-at-faint">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

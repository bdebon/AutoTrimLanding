"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  const handleLanguageChange = (newLocale: string) => {
    // Replace the locale in the current path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Copyright */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-4">
              <Image
                src="/assets/img/logo-autotrim.svg"
                alt="AutoTrim"
                className="h-8 w-auto"
                width={120}
                height={32}
                loading="lazy"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {t("footer.copyright")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                href="/legal"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Legal Notice
              </Link>
              <a
                href="mailto:b1jam1code@gmail.com"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.resources.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/download`}
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.resources.download")}
                </Link>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.resources.pricing")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.resources.faq")}
                </a>
              </li>
            </ul>
          </div>

          {/* Comparisons */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.comparisons.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/compare/timebolt`}
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.timebolt")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/compare/autocut`}
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.autocut")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/compare/descript`}
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.descript")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/compare/premiere-pro`}
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.premierePro")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Language Selector */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-600" />
              <label htmlFor="language-select" className="sr-only">
                {t("footer.language.label")}
              </label>
              <select
                id="language-select"
                value={currentLocale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-gray-600 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-500"
                aria-label={t("footer.language.label")}
              >
                <option value="en">{t("footer.language.en")}</option>
                <option value="fr">{t("footer.language.fr")}</option>
                <option value="es">{t("footer.language.es")}</option>
                <option value="zh">{t("footer.language.zh")}</option>
              </select>
            </div>

            {/* Final CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-600 text-sm">{t("footer.cta.ready")}</p>
              <Link
                href={`/${currentLocale}/download`}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
              >
                {t("footer.cta.button")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

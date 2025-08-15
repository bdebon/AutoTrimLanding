import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { Globe } from "lucide-react";

const Footer = () => {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Copyright */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-4">
              <img
                src="/assets/img/logo-autotrim.svg"
                alt="AutoTrim"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {t("footer.copyright")}
            </p>
            <div className="flex gap-4">
              <a
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                {t("footer.links.privacy")}
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                {t("footer.links.terms")}
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                {t("footer.links.contact")}
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
                <a
                  href="/download"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.resources.download")}
                </a>
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
              <li>
                <a
                  href="/blog"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.resources.blog")}
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
                <a
                  href="/compare/timebolt"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.timebolt")}
                </a>
              </li>
              <li>
                <a
                  href="/compare/autocut"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.autocut")}
                </a>
              </li>
              <li>
                <a
                  href="/compare/descript"
                  className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                >
                  {t("footer.comparisons.descript")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Language Selector and Bottom CTA */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-600" />
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
            </div>

            {/* CTA */}
            <div className="text-center sm:text-right">
              <p className="text-gray-700 mb-2">Ready to reclaim your time?</p>
              <a
                href="/download"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Try AutoTrim Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

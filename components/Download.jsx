"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Download as DownloadIcon, Monitor, Mail } from "lucide-react";
import { useTranslations } from 'next-intl';
import { trackDownload } from '@/lib/tracking';
import { useAttribution } from '@/hooks/useAttribution';

// Simple OS detection from user agent
function detectOS() {
  if (typeof window === 'undefined') return "mac"; // Default to mac for SSR
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  // Mobile detection first
  if (/android/i.test(ua)) return "mobile";
  if (/iPhone|iPad|iPod/i.test(ua)) return "mobile";
  if (/windows phone/i.test(ua)) return "mobile";
  if (/win/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "mac";
  // No Linux distribution supported for now
  if (/linux/i.test(ua)) return "unknown";
  return "unknown";
}

const assetLinks = {
  // Final artifact names as confirmed by the user
  mac: "https://github.com/bdebon/AutoTrimReleases/releases/download/latest/AutoTrim.dmg",
  windows:
    "https://github.com/bdebon/AutoTrimReleases/releases/download/latest/AutoTrim-Setup.msi",
};

// Inner component that uses hooks requiring Suspense
const DownloadContent = () => {
  const t = useTranslations('download');
  const { copyAttributionToClipboard } = useAttribution();

  // Start with a sensible default (mac is most common) to show content immediately
  const [os, setOs] = useState("mac");
  useEffect(() => {
    setOs(detectOS());
  }, []);

  // Handle download click: copy attribution to clipboard, then track
  const handleDownloadClick = async (platform) => {
    // Copy attribution code to clipboard BEFORE initiating download
    await copyAttributionToClipboard();

    // Track the download event
    trackDownload({
      platform: platform,
      downloadLink: platform === 'mac' ? assetLinks.mac : assetLinks.windows,
      location: 'download_page'
    });
  };

  const primaryHref =
    os === "mac" ? assetLinks.mac : os === "windows" ? assetLinks.windows : "#";
  const primaryLabel =
    os === "mac"
      ? t('macOS')
      : os === "windows"
      ? t('windows')
      : t('chooseOS');

  // Mobile: show desktop-only message
  if (os === "mobile") {
    return (
      <section
        id="download"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 flex justify-center">
            <Monitor className="h-12 w-12 text-gray-900" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {t('mobile.desktopOnly')}
          </p>

          <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <Mail className="h-8 w-8 text-primary-500 mx-auto mb-3" aria-hidden="true" />
            <p className="text-gray-700 font-medium mb-4">
              {t('mobile.sendReminder')}
            </p>
            <a
              href={`mailto:?subject=${encodeURIComponent(t('mobile.emailSubject'))}&body=${encodeURIComponent(t('mobile.emailBody'))}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg"
            >
              <Mail className="h-5 w-5" />
              <span>{t('mobile.emailButton')}</span>
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-gray-500">
            <p>{t('mobile.orVisit')}</p>
            <code className="bg-gray-100 px-3 py-1 rounded-lg text-primary-600 font-mono">
              autotrim.app
            </code>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="download"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4 flex justify-center">
          <DownloadIcon className="h-12 w-12 text-gray-900" aria-hidden="true" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={primaryHref}
            onClick={() => handleDownloadClick(os)}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg"
          >
            <DownloadIcon className="h-5 w-5" />
            <span>{primaryLabel}</span>
          </a>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:inline">{t('otherPlatform')}</span>
            {os === "mac" ? (
              <a
                href={assetLinks.windows}
                onClick={() => handleDownloadClick('windows')}
                className="underline hover:no-underline"
              >
                {t('buttons.windows')}
              </a>
            ) : os === "windows" ? (
              <a
                href={assetLinks.mac}
                onClick={() => handleDownloadClick('mac')}
                className="underline hover:no-underline"
              >
                {t('buttons.macOS')}
              </a>
            ) : (
              <>
                <a
                  href={assetLinks.mac}
                  onClick={() => handleDownloadClick('mac')}
                  className="underline hover:no-underline"
                >
                  {t('buttons.macOS')}
                </a>
                <span>·</span>
                <a
                  href={assetLinks.windows}
                  onClick={() => handleDownloadClick('windows')}
                  className="underline hover:no-underline"
                >
                  {t('buttons.windows')}
                </a>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          {t('githubNote')}
        </p>
      </div>
    </section>
  );
};

// Wrapper component with Suspense for useSearchParams
const Download = () => {
  return (
    <Suspense fallback={<DownloadFallback />}>
      <DownloadContent />
    </Suspense>
  );
};

// Fallback component while loading
const DownloadFallback = () => {
  return (
    <section
      id="download"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4 flex justify-center">
          <DownloadIcon className="h-12 w-12 text-gray-900" aria-hidden="true" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-8 animate-pulse" />
        <div className="flex justify-center">
          <div className="h-14 bg-gray-200 rounded-xl w-48 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Download;

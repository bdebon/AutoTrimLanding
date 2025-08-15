import React, { useEffect, useState, useMemo } from "react";
import { Download as DownloadIcon, Monitor, Laptop } from "lucide-react";

// Simple OS detection from user agent
function detectOS() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(ua)) return "windows";
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

const Download = () => {
  // Start with a stable SSR value to avoid hydration mismatch, then update on client
  const [os, setOs] = useState("unknown");
  useEffect(() => {
    setOs(detectOS());
  }, []);

  const primaryHref =
    os === "mac" ? assetLinks.mac : os === "windows" ? assetLinks.windows : "#";
  const primaryLabel =
    os === "mac"
      ? "Download for macOS"
      : os === "windows"
      ? "Download for Windows"
      : "Choose your OS";

  return (
    <section
      id="download"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4 flex justify-center">
          <DownloadIcon className="h-12 w-12 text-gray-900" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Download AutoTrim
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Free to try. Process your files and preview your cuts. Pay only when
          you're ready to export.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg"
          >
            <DownloadIcon className="h-5 w-5" />
            <span>{primaryLabel}</span>
          </a>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:inline">Other platform:</span>
            {os === "mac" ? (
              <a
                href={assetLinks.windows}
                className="underline hover:no-underline"
              >
                Windows
              </a>
            ) : os === "windows" ? (
              <a href={assetLinks.mac} className="underline hover:no-underline">
                macOS
              </a>
            ) : (
              <>
                <a
                  href={assetLinks.mac}
                  className="underline hover:no-underline"
                >
                  macOS
                </a>
                <span>·</span>
                <a
                  href={assetLinks.windows}
                  className="underline hover:no-underline"
                >
                  Windows
                </a>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          All downloads are served from the latest GitHub release.
        </p>
      </div>
    </section>
  );
};

export default Download;

"use client";
import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Mail, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { trackDownload } from "@/lib/tracking";
import { useAttribution } from "@/hooks/useAttribution";
import { PulseTile } from "./landing/Logo";

function detectOS() {
  const ua = navigator.userAgent || navigator.vendor || "";
  if (/android|iPhone|iPad|iPod|windows phone/i.test(ua)) return "mobile";
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "mobile";
  if (/win/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "mac";
  return "unknown";
}

const assetLinks = {
  mac: "https://github.com/bdebon/AutoTrimReleases/releases/download/latest/AutoTrim.dmg",
  windows: "https://github.com/bdebon/AutoTrimReleases/releases/download/latest/AutoTrim-Setup.msi",
};

/** The same composition is rendered during Suspense, without replacing the product with a skeleton. */
function DownloadView({ os = "mac", onDownload }) {
  const t = useTranslations("download");
  const locale = useLocale();
  const primary = os === "windows" ? "windows" : "mac";
  const secondary = primary === "mac" ? "windows" : "mac";
  const isMobile = os === "mobile";
  const platformLabel = (platform) => t(platform === "mac" ? "macOS" : "windows");

  return (
    <section id="download" className="download-page">
      <div className="download-composition">
        <div className="download-copy">
          <div className="download-brand">
            <PulseTile size={44} />
            <div><span>AutoTrim</span><small>macOS & Windows</small></div>
          </div>
          <h1>{t("experience.title")}<br /><span>{t("experience.titleAccent")}</span></h1>
          <p className="download-intro">{t("experience.body")}</p>

          <div className="download-actions">
            {isMobile ? (
              <>
                <p className="download-device-note">{t("mobile.desktopOnly")}</p>
                <a className="download-primary" href={`mailto:?subject=${encodeURIComponent(t("mobile.emailSubject"))}&body=${encodeURIComponent(t("mobile.emailBody"))}`}>
                  <Mail size={19} aria-hidden="true" />{t("mobile.emailButton")}
                </a>
              </>
            ) : (
              <>
                {os === "unknown" && <p className="download-device-note">{t("chooseOS")}</p>}
                <a className="download-primary" href={assetLinks[primary]} onClick={() => onDownload?.(primary)}>
                  <ArrowDown size={19} aria-hidden="true" />{platformLabel(primary)}
                </a>
                <p className="download-free"><Check size={14} aria-hidden="true" />{t("experience.free")}</p>
                <a className="download-alternative" href={assetLinks[secondary]} onClick={() => onDownload?.(secondary)}>
                  {platformLabel(secondary)}<ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </>
            )}
          </div>

          <div className="download-editors">
            <p>{t("experience.editors")}</p>
            <span>Final Cut Pro</span><span>Premiere Pro</span><span>DaVinci Resolve</span>
          </div>
          {os === "windows" && (
            <details className="download-windows-note">
              <summary><ShieldCheck size={16} aria-hidden="true" />{t("windowsNote.title")}</summary>
              <p>{t("windowsNote.description")}</p>
            </details>
          )}
        </div>

        <figure className="download-product">
          <div className="download-window">
            <div className="download-window-bar" aria-hidden="true">
              <span className="download-window-dots"><i /><i /><i /></span>
              <span>AutoTrim</span><span className="download-window-status"><i />{t("experience.windowStatus")}</span>
            </div>
            <Image
              src={`/app/session-${locale === "fr" ? "fr" : "en"}.webp`}
              width={2400}
              height={1584}
              priority
              sizes="(min-width: 1280px) 790px, (min-width: 1024px) 65vw, (min-width: 640px) 90vw, 620px"
              alt={t("experience.screenshotAlt")}
              className="download-app-image"
            />
          </div>
          <figcaption className="download-result">
            <span className="download-result-check"><Check size={20} aria-hidden="true" /></span>
            <div><strong>{t("experience.result")}</strong><span>{t("experience.resultNote")}</span></div>
            <span className="download-result-time">23:44 <span>→</span> <b>15:35</b></span>
          </figcaption>
        </figure>
      </div>

      <div className="download-start">
        <p className="download-start-label">{t("experience.next")}</p>
        <ol>
          {["drop", "preview", "edit"].map((step, index) => (
            <li key={step}>
              <span className="download-step-number">0{index + 1}</span>
              <div><h2>{t(`experience.steps.${step}.title`)}</h2><p>{t(`experience.steps.${step}.body`)}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DownloadContent() {
  const { copyAttributionToClipboard } = useAttribution();
  const [os, setOs] = useState("mac");
  useEffect(() => { setOs(detectOS()); }, []);

  const handleDownloadClick = async (platform) => {
    await copyAttributionToClipboard();
    trackDownload({ platform, downloadLink: assetLinks[platform], location: "download_page" });
  };

  return <DownloadView os={os} onDownload={handleDownloadClick} />;
}

export default function Download() {
  return <Suspense fallback={<DownloadView />}><DownloadContent /></Suspense>;
}

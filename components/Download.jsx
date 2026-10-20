"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Mail, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { trackDownload, trackEvent, trackMetaEvent } from "@/lib/tracking";
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
                <p className="download-device-note">{t("mobile.desktopOnly")} {t("mobile.linkIntro")}</p>
                <MobileLinkForm />
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

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!window.__autotrimTurnstile) {
    window.__autotrimTurnstile = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
      script.onerror = () => { window.__autotrimTurnstile = null; reject(new Error("turnstile")); };
      document.head.appendChild(script);
    });
  }
  return window.__autotrimTurnstile;
}

/**
 * Cloudflare Turnstile, run only when the form is sent: invisible unless Cloudflare has a
 * doubt, then it shows its check in place. Each token serves once.
 */
function useTurnstile(locale) {
  const container = useRef(null);
  const widget = useRef(null);
  const pending = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (!TURNSTILE_SITE_KEY) return;
    loadTurnstile().then((turnstile) => {
      if (cancelled || !container.current || widget.current !== null) return;
      widget.current = turnstile.render(container.current, {
        sitekey: TURNSTILE_SITE_KEY,
        execution: "execute",
        appearance: "interaction-only",
        language: locale,
        callback: (token) => pending.current?.resolve(token),
        "error-callback": () => pending.current?.reject(new Error("turnstile")),
        "timeout-callback": () => pending.current?.reject(new Error("turnstile")),
      });
    }).catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [locale]);

  const getToken = () => new Promise((resolve, reject) => {
    if (!window.turnstile || widget.current === null) return reject(new Error("turnstile"));
    const timer = setTimeout(() => reject(new Error("turnstile")), 30000);
    pending.current = {
      resolve: (token) => { clearTimeout(timer); resolve(token); },
      reject: (error) => { clearTimeout(timer); reject(error); },
    };
    window.turnstile.reset(widget.current);
    window.turnstile.execute(widget.current);
  });

  return { container, getToken };
}

/**
 * On a phone, the visitor leaves their email and gets the download link to open on their
 * computer (lib/download-link.ts). The link keeps the campaign of this visit.
 */
function MobileLinkForm() {
  const t = useTranslations("download.mobile");
  const locale = useLocale();
  const { getAttributionData } = useAttribution();
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const { container, getToken } = useTurnstile(locale);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    const attribution = getAttributionData();
    const utm = {
      utm_source: attribution?.s,
      utm_medium: attribution?.m,
      utm_campaign: attribution?.c,
      utm_content: attribution?.t,
      utm_term: attribution?.k,
    };
    try {
      const turnstile = await getToken();
      const res = await fetch("/api/download-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, marketing, website, turnstile, ...utm }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      trackEvent("download_link_requested", { locale, marketing, has_campaign: Boolean(utm.utm_source || utm.utm_campaign) });
      trackMetaEvent("Lead", { content_name: "AutoTrim Download Link", location: "download_page_mobile" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="download-device-note" role="status">
        <Check size={16} aria-hidden="true" className="mr-1.5 inline text-at-accent" />{t("sent")}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-[420px]">
      <label htmlFor="download-link-email" className="sr-only">{t("emailLabel")}</label>
      <input
        id="download-link-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")}
        className="h-14 w-full rounded-pill border border-at-border-hi bg-at-card px-5 font-ui text-[16px] text-at-text placeholder:text-at-faint focus:border-at-accent focus:outline-none"
      />
      {/* Hidden from people: only a bot fills it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" />
      <div ref={container} className="mt-3 empty:hidden" />
      <button type="submit" disabled={status === "sending"} className="download-primary mt-3 w-full disabled:opacity-60">
        <Mail size={19} aria-hidden="true" />{status === "sending" ? t("sending") : t("submit")}
      </button>
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 font-ui text-[13px] leading-[1.45] text-at-muted">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--at-accent)]" />
        {t("marketing")}
      </label>
      {status === "error" && <p className="mt-3 font-ui text-[13px] text-at-danger" role="alert">{t("error")}</p>}
      <p className="mt-3 font-ui text-[12px] leading-[1.45] text-at-dim">{t("privacyNote")}</p>
    </form>
  );
}

function DownloadContent() {
  const { copyAttributionToClipboard, recordDownloadHandoff } = useAttribution();
  const [os, setOs] = useState("mac");
  useEffect(() => { setOs(detectOS()); }, []);

  const handleDownloadClick = async (platform) => {
    recordDownloadHandoff();
    await copyAttributionToClipboard();
    trackDownload({ platform, downloadLink: assetLinks[platform], location: "download_page" });
  };

  return <DownloadView os={os} onDownload={handleDownloadClick} />;
}

export default function Download() {
  return <Suspense fallback={<DownloadView />}><DownloadContent /></Suspense>;
}

"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { allows, getConsentState, subscribeConsent } from "@/lib/consent";

const META_PIXEL_ID = "2240864149721547";
const GTM_ID = "GTM-MTPT8QGT";

// What these tags leave on our domain (Meta, and the Google Ads tag inside the GTM
// container), erased when consent to ads is withdrawn
const AD_COOKIES = ["_fbp", "_fbc", "_gcl_au"];
const AD_STORAGE_KEYS = ["_gcl_ls"];

/**
 * The Meta Pixel and Google Tag Manager, only with consent to ads (lib/consent.ts).
 * lazyOnload keeps them off the critical path, as before. A withdrawal reloads the page,
 * the only way to unload them, after erasing their cookies.
 */
export default function TrackingScripts() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentState, () => null);
  const ads = consent !== null && allows(consent, "ads");
  const pathname = usePathname();
  const loaded = useRef(false);
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (ads) {
      loaded.current = true;
      return;
    }
    if (!loaded.current) return;
    window.fbq?.("consent", "revoke");
    const domain = window.location.hostname.replace(/^www\./, "");
    for (const name of AD_COOKIES) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
    }
    try {
      AD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // localStorage unavailable
    }
    window.location.reload();
  }, [ads]);

  // The init snippet sends the first PageView; client-side navigations send the next ones
  useEffect(() => {
    if (!ads) return;
    if (trackedPath.current === null) {
      trackedPath.current = pathname;
      return;
    }
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [ads, pathname]);

  if (!ads) return null;
  return (
    <>
      <Script id="facebook-pixel" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <Script id="gtm-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        `}
      </Script>
      <Script id="gtm-script" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />
    </>
  );
}

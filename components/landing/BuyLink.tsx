"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useAttribution } from "@/hooks/useAttribution";
import { trackEvent } from "@/lib/tracking";

const BASE_URL = "https://autotrim.lemonsqueezy.com/";

function BuyLinkInner({ plan, className, children }: { plan: string; className?: string; children: ReactNode }) {
  const { buildLemonSqueezyUrl } = useAttribution();
  // The attribution lives in localStorage: resolve it after hydration so the
  // server and the client render the same href.
  const [href, setHref] = useState(BASE_URL);
  useEffect(() => setHref(buildLemonSqueezyUrl()), [buildLemonSqueezyUrl]);
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent("cta_clicked", { location: "pricing", type: "buy", plan })}
    >
      {children}
    </a>
  );
}

/** The Lemon Squeezy checkout link, with the visitor's attribution attached. */
export default function BuyLink(props: { plan: string; className?: string; children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <a href={BASE_URL} className={props.className}>
          {props.children}
        </a>
      }
    >
      <BuyLinkInner {...props} />
    </Suspense>
  );
}
